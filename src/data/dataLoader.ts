import { Node, Edge } from 'reactflow';
import { RoadmapNodeData } from '../components/RoadmapNode';
import nodesData from './nodes.json';
import edgesData from './edges.json';

type Status = 'completed' | 'in-progress' | 'planned';

interface NodeData {
  id: string;
  position: { x: number; y: number };
  label: string;
  status: Status;
  icon?: string;
  tooltip?: string;
}

interface EdgeData {
  source: string;
  target: string;
}

export function loadNodes(): Node<RoadmapNodeData>[] {
return nodesData.map((node: {
    id: string;
    position: { x: number; y: number };
    label: string;
    status: string;
    icon?: string;
    tooltip?: string;
}) => ({
    id: node.id,
    type: 'roadmapNode',
    position: node.position,
    data: {
        label: node.label,
        status: node.status as Status,
        icon: node.icon,
        tooltip: node.tooltip,
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