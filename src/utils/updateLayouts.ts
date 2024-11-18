import * as fs from 'fs';
import * as path from 'path';

interface Node {
    id: string;
    position: { x: number; y: number };
    label: string;
    target?: 'Friends and Family' | 'Pilot' | 'Beta' | 'future';
    borderColor?: string;
}

const LAYOUT = {
    radius: {
        root: 0,
        level1: 250,        // Areas of Value
        friendsAndFamily: 500,
        pilot: 700,
        beta: 900,
        future: 1100
    },
    borders: {
        root: '#6B7280',    // Gray
        level1: '#9333EA',  // Purple
        friendsAndFamily: '#22C55E',  // Green
        pilot: '#3B82F6',   // Blue
        beta: '#EAB308',    // Yellow
        future: '#EC4899'   // Pink
    }
} as const;

const nodesFilePath = path.join(__dirname, '..', 'data', 'nodes.json');
const edgesFilePath = path.join(__dirname, '..', 'data', 'edges.json');

function loadJSON(filePath: string): any {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

function saveJSON(filePath: string, data: any): void {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf-8');
}

export function layoutRadial(nodes: Node[], edges: { source: string; target: string }[]) {
    console.log('Starting layout calculation...');
    
    // Position root at center
    const root = nodes.find(n => n.id === 'root')!;
    root.position = { x: 0, y: 0 };
    root.borderColor = LAYOUT.borders.root;
    console.log('Root node styled:', root);

    // Get and position Level 1 nodes (Areas of Value)
    const level1Nodes = edges
        .filter(e => e.source === 'root')
        .map(e => e.target);

    const angleStep = (2 * Math.PI) / level1Nodes.length;
    level1Nodes.forEach((nodeId, index) => {
        const angle = index * angleStep;
        const node = nodes.find(n => n.id === nodeId)!;
        
        node.position = {
            x: Math.cos(angle) * LAYOUT.radius.level1,
            y: Math.sin(angle) * LAYOUT.radius.level1
        };
        node.borderColor = LAYOUT.borders.level1;
        console.log(`Level 1 node styled: ${nodeId}`, node);

        // Position children by target release
        const children = edges
            .filter(e => e.source === nodeId)
            .map(e => e.target);

        const childAngleStep = angleStep / Math.max(children.length, 1);
        const startAngle = angle - (angleStep / 2);

        children.forEach((childId, childIndex) => {
            const child = nodes.find(n => n.id === childId)!;
            const childAngle = startAngle + (childIndex + 0.5) * childAngleStep;
            const [radius, borderColor] = getTargetAttributes(child.target);
            
            child.position = {
                x: Math.cos(childAngle) * radius,
                y: Math.sin(childAngle) * radius
            };
            child.borderColor = borderColor;
            console.log(`Child node styled: ${childId}`, child);
        });
    });

    return nodes;
}

function getTargetAttributes(target?: string): [number, string] {
    switch (target) {
        case 'Friends and Family':
            return [LAYOUT.radius.friendsAndFamily, LAYOUT.borders.friendsAndFamily];
        case 'Pilot':
            return [LAYOUT.radius.pilot, LAYOUT.borders.pilot];
        case 'Beta':
            return [LAYOUT.radius.beta, LAYOUT.borders.beta];
        case 'future':
            return [LAYOUT.radius.future, LAYOUT.borders.future];
        default:
            return [LAYOUT.radius.friendsAndFamily, LAYOUT.borders.friendsAndFamily];
    }
}

async function main() {
    const nodes = loadJSON(nodesFilePath);
    const edges = loadJSON(edgesFilePath);
    
    const updatedNodesRadial = layoutRadial(nodes, edges);
    
    saveJSON(nodesFilePath, updatedNodesRadial);
    saveJSON(edgesFilePath, edges);
}

main().catch(error => console.error(error));