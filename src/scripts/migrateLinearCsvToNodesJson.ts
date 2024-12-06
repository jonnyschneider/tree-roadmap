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
  Labels?: string; // Make Labels optional
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
  label: string; // Ensure label is always a string
}

interface EdgeData {
  source: string;
  target: string;
}

const nodesData: NodeData[] = [];

console.log('Starting CSV processing...');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row: CsvData) => {
    console.log(`Processing row with ID: ${row.ID}`);
    if (row.Labels) {
      const labels = row.Labels.split(',').map(label => label.trim().toLowerCase());
      console.log(`Row ID: ${row.ID}, Labels: ${row.Labels}, Parsed Labels: ${labels}`);
      if (row['Project Milestone'] && row['Project Milestone'].trim() !== '' && labels.some(label => label === 'on treemap')) {
        console.log(`Processing node with ID: ${row.ID} and labels: ${row.Labels}`);
        nodesData.push({
          id: row.ID,
          title: row.Title,
          description: row.Description,
          status: row.Status,
          project: row.Project,
          target: row['Project Milestone'],
          position: { x: 0, y: 0 }, // Add position property
          level: 1, // Add level property
          label: row.Labels // Include labels in data
        });
      }
    } else {
      console.log(`Row with ID: ${row.ID} has no Labels`);
    }
  })
  .on('end', () => {
    console.log(`Total nodes processed: ${nodesData.length}`);
    const projectNodes = generateProjectNodes(nodesData);
    const edgeNodes = generateEdgeNodes(nodesData);
    const rootNode: NodeData = {
      id: 'root',
      title: 'root',
      description: 'root',
      status: 'Project',
      project: 'root',
      target: '',
      level: 0,
      position: { x: 0, y: 0 },
      label: 'root' // Add label to root node
    };
    const nodesJson = {
      nodesData: [rootNode].concat(projectNodes, nodesData),
      edgesData: edgeNodes
    };
    fs.writeFileSync(nodesFilePath, JSON.stringify(nodesJson, null, 2));
    console.log('nodes.json file written successfully');
    
    // Run the radial layout utility script using ts-node
    const { exec } = require('child_process');
    exec('npx ts-node src/scripts/radialLayout.ts', (error: { message: any; }, _stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error executing radialLayout script: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr from radialLayout script: ${stderr}`);
        return;
      }
      console.log('Radial layout script executed successfully');
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
    level: 1, // Add level property
    label: 'On Treemap' // Add label to project nodes
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

