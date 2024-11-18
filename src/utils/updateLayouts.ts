import * as fs from 'fs';
import * as path from 'path';

interface Node {
    id: string;
    position: { x: number; y: number };
    label: string;
}

// Remove old constants
// const VERTICAL_GAP = 120;

// Spacing configuration
const SPACING = {
    vertical: 120,
    horizontal: {
        base: 250,
        multiplier: 1.5
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

async function main() {
    const nodes = loadJSON(nodesFilePath);
    const edges = loadJSON(edgesFilePath);
    
    const updatedNodes = layoutTree(nodes, edges);
    saveJSON(nodesFilePath, updatedNodes);
    saveJSON(edgesFilePath, edges);
}

main().catch(error => console.error(error));