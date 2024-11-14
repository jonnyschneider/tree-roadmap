// src/types/RoadmapTypes.ts
export interface RoadmapNode {
    id: string;
    type: 'roadmapNode';
    position: { x: number; y: number };
    data: {
      label: string;
      icon?: string;
      status?: 'planned' | 'in-progress' | 'completed';
      description?: string;
    };
  }