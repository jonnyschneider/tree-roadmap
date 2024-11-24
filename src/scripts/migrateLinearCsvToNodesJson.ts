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
}

interface EdgeData {
  source: string;
  target: string;
}

const nodesData: NodeData[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row: CsvData) => {
    console.log('CSV Row:', row); // Debugging statement
    if (row['Project Milestone'] && row['Project Milestone'].trim() !== '') {
      nodesData.push({
        id: row.ID,
        title: row.Title,
        description: row.Description,
        status: row.Status,
        project: row.Project,
        target: row['Project Milestone'],
      });
    }
  })
  .on('end', () => {
    console.log('Parsed Nodes Data:', nodesData); // Debugging statement
    const nodesJson = JSON.parse(fs.readFileSync(nodesFilePath, 'utf-8'));
    const projectNodes = generateProjectNodes(nodesData);
    const edgeNodes = generateEdgeNodes(nodesData);
    nodesJson.nodesData = projectNodes.concat(nodesJson.nodesData, nodesData);
    nodesJson.edgesData = nodesJson.edgesData.concat(edgeNodes);
    fs.writeFileSync(nodesFilePath, JSON.stringify(nodesJson, null, 2));
    console.log('CSV data has been migrated to nodes.json');
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
    target: ''
  }));
}

function generateEdgeNodes(nodes: NodeData[]): EdgeData[] {
  return nodes
    .filter(node => node.project)
    .map(node => ({
      source: node.project.toLowerCase().replace(/\s+/g, '-'),
      target: node.id
    }));
}
