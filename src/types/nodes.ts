export type ReleaseTarget = 'Friends and Family' | 'Pilot' | 'Beta' | 'future';
export type NodeStatus = 'planned' | 'in-progress' | 'completed' | 'preview';

export interface Position {
  x: number;
  y: number;
}

export interface RoadmapNodeData {
  id: string;
  position: Position;
  label: string;
  icon?: string;
  tooltip?: string;
  status?: NodeStatus;
  target?: ReleaseTarget;
  borderColor?: string;
  backgroundColor?: string;
  focus?: string[];
  backlog?: string[];
}

export interface LayoutConfig {
  radius: {
    root: number;
    level1: number;
    friendsAndFamily: number;
    pilot: number;
    beta: number;
    future: number;
  };
  colors: {
    root: {
      border: string;
      bg: string;
    };
    level1: {
      border: string;
      bg: string;
    };
  };
}