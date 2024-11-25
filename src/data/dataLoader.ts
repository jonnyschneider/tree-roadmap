import { Node, Edge } from 'reactflow';
import { RoadmapNodeData } from '../components/RoadmapNode'; // Correct import path
import data from './nodes.json';

type Status = 'completed' | 'in-progress' | 'planned';

interface EdgeData {
  source: string;
  target: string;
}

export function loadNodes(): Node<RoadmapNodeData>[] {
  return data.nodesData.map(
    (node: {
      id: string;
      position: { x: number | null; y: number | null };
      title?: string;
      description?: string;
      status?: string;
      project?: string;
      icon?: string;
      moreInfo?: string;
    }) => ({
      id: node.id,
      type: 'roadmapNode',
      position: { x: node.position.x ?? 0, y: node.position.y ?? 0 },
      data: {
        id: node.id,
        title: node.title,
        description: node.description,
        status: node.status as Status,
        icon: node.icon,
        moreInfo: node.moreInfo,
      },
    }),
  );
}

export function loadEdges(): Edge[] {
  return data.edgesData.map((edge: EdgeData) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'straight',
  }));
}
