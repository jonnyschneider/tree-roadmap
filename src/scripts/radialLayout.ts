import * as fs from 'fs';
import * as path from 'path';

interface Node {
  id: string;
  position: { x: number; y: number };
  target?: 'Friends and Family' | 'Customer Pilot' | 'Public Beta' | 'Future';
}

interface Edge {
  source: string;
  target: string;
}

const LAYOUT_RADIUS = {
  root: 0,
  level1: 300, // Increased spacing for Project Nodes
  friendsAndFamily: 675, // Increased spacing
  customerPilot: 825, // Increased spacing
  publicBeta: 1100, // Increased spacing
  future: 1350, // Increased spacing
} as const;

const nodesFilePath = path.join(__dirname, '..', 'data', 'nodes.json');

function loadJSON(filePath: string): any {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function saveJSON(filePath: string, data: any): void {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, 'utf-8');
}

export function layoutRadial(
  nodes: Node[],
  edges: Edge[],
) {
  console.log('Starting layout calculation...');
  console.log('Initial nodes:', nodes);
  console.log('Initial edges:', edges);

  // Position root at center
  const root = nodes.find((n) => n.id === 'root')!;
  root.position = { x: 0, y: 0 };
  console.log('Root node positioned:', root);

  // Get and position Level 1 nodes (Project Nodes)
  const level1Nodes = edges
    .filter((e) => e.source === 'root')
    .map((e) => e.target);
  console.log('Level 1 nodes:', level1Nodes);

  const angleStep = (2 * Math.PI) / level1Nodes.length;
  level1Nodes.forEach((nodeId, index) => {
    const angle = index * angleStep;
    const node = nodes.find((n) => n.id === nodeId)!;

    node.position = {
      x: Math.cos(angle) * LAYOUT_RADIUS.level1,
      y: Math.sin(angle) * LAYOUT_RADIUS.level1,
    };
    console.log(`Level 1 node positioned: ${nodeId}`, node);

    // Position children by target release
    const children = edges
      .filter((e) => e.source === nodeId)
      .map((e) => e.target);
    console.log(`Children of ${nodeId}:`, children);

    const childAngleStep = angleStep / Math.max(children.length, 1);
    const startAngle = angle - angleStep / 2;

    children.forEach((childId, childIndex) => {
      const child = nodes.find((n) => n.id === childId)!;
      const childAngle = startAngle + (childIndex + 0.5) * childAngleStep;
      const radius = getTargetRadius(child.target);
      console.log(`Child ${childId} target radius:`, radius);

      child.position = {
        x: Math.cos(childAngle) * radius,
        y: Math.sin(childAngle) * radius,
      };
      console.log(`Child node positioned: ${childId}`, child);
    });
  });

  console.log('Final nodes:', nodes);
  return nodes;
}

function getTargetRadius(target?: string): number {
  switch (target) {
    case 'Friends and Family':
      return LAYOUT_RADIUS.friendsAndFamily;
    case 'Customer Pilot':
      return LAYOUT_RADIUS.customerPilot;
    case 'Public Beta':
      return LAYOUT_RADIUS.publicBeta;
    case 'Future':
      return LAYOUT_RADIUS.future;
    default:
      return LAYOUT_RADIUS.friendsAndFamily;
  }
}

async function main() {
  const data = loadJSON(nodesFilePath);
  const nodes = data.nodesData;
  const edges = data.edgesData;

  const updatedNodesRadial = layoutRadial(nodes, edges);

  saveJSON(nodesFilePath, { nodesData: updatedNodesRadial, edgesData: edges });
}

main().catch((error) => console.error(error));