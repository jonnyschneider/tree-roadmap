const fs = require('fs');
const path = require('path');

const nodesFilePath = path.join(__dirname, '../data/nodes.json');
const nodesData = require(nodesFilePath);

const levelSpacing = 400;
const nodeSpacing = 300;
const baseLevel1Spacing = 700; // Base spacing between level 1 nodes

function organizeNodes(nodesData) {
  const levels = {};
  const parentChildMap = {};

  // Group nodes by level and create parent-child map
  nodesData.nodesData.forEach(node => {
    if (!levels[node.level]) {
      levels[node.level] = [];
    }
    levels[node.level].push(node);

    if (node.level > 0) {
      const parentNode = nodesData.edgesData.find(edge => edge.target === node.id)?.source;
      if (parentNode) {
        if (!parentChildMap[parentNode]) {
          parentChildMap[parentNode] = [];
        }
        parentChildMap[parentNode].push(node);
      }
    }
  });

  // Calculate required spacing for Level 1 nodes
  const level1Nodes = levels[1];
  const level1Spacing = level1Nodes.reduce((maxSpacing, node) => {
    const children = parentChildMap[node.id] || [];
    const requiredWidth = (children.length - 1) * nodeSpacing;
    return Math.max(maxSpacing, requiredWidth + baseLevel1Spacing);
  }, baseLevel1Spacing);

  console.log('Calculated level1Spacing:', level1Spacing); // Debug statement

  // Position Level 1 nodes
  const y = 1 * levelSpacing;
  const totalWidth = (level1Nodes.length - 1) * level1Spacing;
  const startX = -totalWidth / 2;

  level1Nodes.forEach((node, index) => {
    node.position = {
      x: startX + index * level1Spacing,
      y: y
    };
    console.log(`Level 1 node ${node.id} position:`, node.position); // Debug statement
  });

  // Position other nodes
  Object.keys(levels).forEach(level => {
    if (level == 1) return; // Skip Level 1 nodes as they are already positioned
    const nodes = levels[level];
    const y = level * levelSpacing;
    const spacing = nodeSpacing;
    const totalWidth = (nodes.length - 1) * spacing;
    const startX = -totalWidth / 2;

    nodes.forEach((node, index) => {
      node.position = {
        x: startX + index * spacing,
        y: y
      };
      console.log(`Level ${level} node ${node.id} position:`, node.position); // Debug statement
    });
  });

  console.log('Updated nodes data:', JSON.stringify(nodesData, null, 2)); // Debug statement
  return nodesData;
}

const organizedNodesData = organizeNodes(nodesData);

console.log('Base level1Spacing:', baseLevel1Spacing); // Debug statement
console.log('Final organized nodes data before writing:', JSON.stringify(organizedNodesData, null, 2)); // Debug statement

fs.writeFileSync(nodesFilePath, JSON.stringify(organizedNodesData, null, 2));
console.log('Nodes organized successfully.');

// Verify the written data
const writtenData = JSON.parse(fs.readFileSync(nodesFilePath, 'utf8'));
console.log('Written nodes data:', JSON.stringify(writtenData, null, 2)); // Debug statement