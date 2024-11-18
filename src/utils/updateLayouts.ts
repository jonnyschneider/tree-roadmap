import * as fs from 'fs';
import * as path from 'path';

interface Node {
    id: string;
    position: { x: number; y: number };
    label: string;
    target?: 'Friends and Family' | 'Pilot' | 'Beta' | 'future';
    borderColor?: string;
}

// Remove old constants
// const VERTICAL_GAP = 120;

/*
 Spacing configuration
const SPACING = {
    vertical: 120,
    horizontal: {
        base: 250,
        multiplier: 1.5
    }
} as const;

*/ 

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

/* Commented out to remove old layout functions
// const BASE_HORIZONTAL_GAP = 250;
// const BRANCH_SPACING_MULTIPLIER = 1.5;

function calculateNodeSpacing(childCount: number): number {
    return childCount > 1 
        ? SPACING.horizontal.base * SPACING.horizontal.multiplier 
        : SPACING.horizontal.base;
}


function layoutTree(nodes: Node[], edges: { source: string; target: string }[]) {
    nodes.forEach(node => {
        node.position = { x: 0, y: 0 };
    });

    const root = nodes.find(n => n.id === 'root')!;
    root.position = { x: 0, y: 0 };

    // Calculate cumulative branch widths
    const mainBranches = edges
        .filter(e => e.source === 'root')
        .map(e => ({
            id: e.target,
            branchWidth: calculateBranchWidth(e.target, edges)
        }));

    // Position level 1 nodes with proportional spacing
    let currentX = -mainBranches.reduce((sum, b) => sum + b.branchWidth, 0) / 2;
    mainBranches.forEach(branch => {
        const node = nodes.find(n => n.id === branch.id)!;
        node.position = {
            x: currentX + branch.branchWidth/2,
            y: SPACING.vertical
        };
        
        positionBranch(branch.id, node.position, nodes, edges);
        currentX += branch.branchWidth;
    });

    return nodes;
}


function calculateBranchWidth(nodeId: string, edges: { source: string; target: string }[]): number {
    const children = edges.filter(e => e.source === nodeId).map(e => e.target);
    if (children.length === 0) return SPACING.horizontal.base;

    const childrenWidth = children
        .map(childId => calculateBranchWidth(childId, edges))
        .reduce((sum, width) => sum + width, 0);
    
    return Math.max(calculateNodeSpacing(children.length), childrenWidth);
}

function positionBranch(parentId: string, parentPos: { x: number; y: number }, nodes: Node[], edges: { source: string; target: string }[]) {
    const children = edges
        .filter(e => e.source === parentId)
        .map(e => e.target);
    
    if (children.length === 0) return;

    const totalChildrenWidth = children
        .map(childId => calculateBranchWidth(childId, edges))
        .reduce((sum, width) => sum + width, 0);
    
    let currentX = parentPos.x - totalChildrenWidth/2;
    children.forEach(childId => {
        const node = nodes.find(n => n.id === childId)!;
        const branchWidth = calculateBranchWidth(childId, edges);
        
        node.position = {
            x: currentX + branchWidth/2,
            y: parentPos.y + SPACING.vertical
        };
        
        positionBranch(childId, node.position, nodes, edges);
        currentX += branchWidth;
    });
}
*/
function layoutRadial(nodes: Node[], edges: { source: string; target: string }[]) {
    // Position root at center
    const root = nodes.find(n => n.id === 'root')!;
    root.position = { x: 0, y: 0 };
    root.borderColor = LAYOUT.borders.root;

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

        // Position children by target release
        const children = edges
            .filter(e => e.source === nodeId)
            .map(e => e.target);

        const childAngleStep = angleStep / Math.max(children.length, 1);
        const startAngle = angle - (angleStep / 2);

        children.forEach((childId, childIndex) => {
            const child = nodes.find(n => n.id === childId)!;
            const childAngle = startAngle + (childIndex + 0.5) * childAngleStep;
            
            // Get radius and border color based on target
            const [radius, borderColor] = getTargetAttributes(child.target);
            
            child.position = {
                x: Math.cos(childAngle) * radius,
                y: Math.sin(childAngle) * radius
            };
            child.borderColor = borderColor;
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