export interface RoadmapNode {
  id: string;
  type: 'roadmapNode';
  position: { x: number; y: number };
  borderColor?: string; // Add at root level
  data: {
    label: string;
    icon?: string;
    status?: 'planned' | 'in-progress' | 'completed';
    borderColor?: string; // Also in data
    tooltip?: string;
    target?: string;
    focus?: string[];
    backlog?: string[];
    backgroundColor?: string;
  };
}
