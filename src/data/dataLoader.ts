import { Node, Edge } from 'reactflow';
import { RoadmapNodeData } from '../components/RoadmapNode'; // Correct import path
import nodesData from './nodes.json';
import edgesData from './edges.json';

type Status = 'completed' | 'in-progress' | 'planned';

interface EdgeData {
  source: string;
  target: string;
}

export function loadNodes(): Node<RoadmapNodeData>[] {
  return nodesData.map((node: {
    id: string;
    position: { x: number | null; y: number | null };
    label: string;
    status: string;
    icon?: string;
    tooltip?: string;
    focus?: string[];
    moreInfo?: string;
  }) => ({
    id: node.id,
    type: 'roadmapNode',
    position: { x: node.position.x ?? 0, y: node.position.y ?? 0 },
    data: {
      label: node.label,
      status: node.status as Status,
      icon: node.icon,
      tooltip: node.tooltip,
      focus: node.focus,
      moreInfo: node.moreInfo,
    },
  }));
}

export function loadEdges(): Edge[] {
  return edgesData.map((edge: EdgeData) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'straight',
  }));
}