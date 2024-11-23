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
  position: { x: number; y: number };
  title: string;
  description: string;
  status: string;
  project: string;
  target: string;
}

const nodesData: NodeData[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row: CsvData) => {
    console.log('CSV Row:', row); // Debugging statement
    nodesData.push({
      id: row.ID,
      position: { x: 0, y: 0 }, // Default position, can be updated later
      title: row.Title,
      description: row.Description,
      status: row.Status,
      project: row.Project,
      target: row['Project Milestone'],
    });
  })
  .on('end', () => {
    console.log('Parsed Nodes Data:', nodesData); // Debugging statement
    const nodesJson = JSON.parse(fs.readFileSync(nodesFilePath, 'utf-8'));
    nodesJson.nodesData = nodesJson.nodesData.concat(nodesData);
    fs.writeFileSync(nodesFilePath, JSON.stringify(nodesJson, null, 2));
    console.log('CSV data has been migrated to nodes.json');
  });