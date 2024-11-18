import { Node } from 'reactflow';
import { RoadmapNodeData } from '../components/RoadmapNode';
import { loadNodes as loadNodesFromDataLoader } from './dataLoader';

// Function to load nodes from localStorage or JSON
export function loadNodes(): Node<RoadmapNodeData>[] {
  const savedNodes = localStorage.getItem('nodes');
  if (savedNodes) {
    return JSON.parse(savedNodes);
  } else {
    // Load initial nodes from JSON via dataLoader
    return loadNodesFromDataLoader();
  }
}

// Function to save nodes to localStorage
export function saveNodes(updatedNodes: Node<RoadmapNodeData>[]) {
  localStorage.setItem('nodes', JSON.stringify(updatedNodes));
}

export const initialNodes = loadNodes();