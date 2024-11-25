import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const nodesFilePath = path.join(__dirname, '../data/nodes.json');
const csvFilePath = path.join(__dirname, '../data/linear.csv');

interface CsvData {
  ID: string;
  Title: string;
  Description: string;
  Status: string;
  Project: string;
  'Project Milestone': string;
}

interface NodeData {
  id: string;
  title: string;
  description: string;
  status: string;
  project: string;
  target: string;
  position: { x: number; y: number };
  level: number;
}

interface EdgeData {
  source: string;
  target: string;
}

const nodesData: NodeData[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row: CsvData) => {
    if (row['Project Milestone'] && row['Project Milestone'].trim() !== '') {
      nodesData.push({
        id: row.ID,
        title: row.Title,
        description: row.Description,
        status: row.Status,
        project: row.Project,
        target: row['Project Milestone'],
        position: { x: 0, y: 0 }, // Add position property
        level: 1 // Add level property
      });
    }
  })
  .on('end', () => {
    const projectNodes = generateProjectNodes(nodesData);
    const edgeNodes = generateEdgeNodes(nodesData);
    const rootNode = {
      id: 'root',
      title: 'root',
      description: 'root',
      status: 'Project',
      project: 'root',
      target: '',
      level: 0,
      position: { x: 0, y: 0 }
    };
    const nodesJson = {
      nodesData: [rootNode].concat(projectNodes, nodesData),
      edgesData: edgeNodes
    };
    fs.writeFileSync(nodesFilePath, JSON.stringify(nodesJson, null, 2));
    
    // Run the radial layout utility script using ts-node
    const { exec } = require('child_process');
    exec('npx ts-node src/scripts/radialLayout.ts', (error: { message: any; }, _stdout: any, stderr: any) => {
      if (error) {
        return;
      }
      if (stderr) {
        return;
      }
    });
  });

function generateProjectNodes(nodes: NodeData[]): NodeData[] {
  const projects = new Set<string>();
  nodes.forEach(node => {
    if (node.project) {
      projects.add(node.project);
    }
  });

  return Array.from(projects).map(project => ({
    id: project.toLowerCase().replace(/\s+/g, '-'),
    title: project,
    description: `Project node for ${project}`,
    status: 'Project',
    project: project,
    target: '',
    position: { x: 0, y: 0 }, // Add position property
    level: 1 // Add level property
  }));
}

function generateEdgeNodes(nodes: NodeData[]): EdgeData[] {
  const edges: EdgeData[] = nodes
    .filter(node => node.project)
    .map(node => ({
      source: node.project.toLowerCase().replace(/\s+/g, '-'),
      target: node.id
    }));

  // Add edges from root node to project nodes
  const projectNodes = new Set<string>();
  nodes.forEach(node => {
    if (node.project) {
      projectNodes.add(node.project.toLowerCase().replace(/\s+/g, '-'));
    }
  });

  projectNodes.forEach(projectNode => {
    edges.push({
      source: 'root', // Assuming 'root' is the ID of the root node
      target: projectNode
    });
  });

  return edges;
}
