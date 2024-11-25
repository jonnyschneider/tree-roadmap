import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import RoadmapTooltip from './RoadmapTooltip';

export type RoadmapNodeData = {
  title?: string;
  description?: string;
  status: string;
  project?: string;
  icon?: string;
  target?: string;
  borderColor?: string;
  backgroundColor?: string;
  moreInfo?: string;
  position?: { x: number; y: number };
};

export default function RoadmapNode({ data, id }: NodeProps<RoadmapNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);

  console.log('Node rendered:', {
    id,
    type: 'roadmapNode',
    data: data,
    hasTooltip: Boolean(data.description),
    tooltipContent: data.description,
    project: data.project,
    position: [0,0] 
  });

  return (
    <div
      onMouseEnter={() => {
        console.log(
          'Mouse enter:',
          data.status,
          'description:',
          data.description,
        );
        setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative cursor-pointer bg-pine"
    >
      {showTooltip && data.description && (
        <RoadmapTooltip
          title={data.title}
          description={data.description}
          moreInfo={data.moreInfo}
          target={data.target}
        />
      )}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
      />
      
      <div  //Node div with rounded corners and a border
        className="rounded-[5px] w-42 p-0 bg-salt text-pine"
      >
        <div className="font-mono mb-2 p-2 text-xs bg-pine text-salt uppercase">{data.project}</div>
        <div className="font-bold font-sans mb-2 p-2 text-xl ">{data.title}</div>
        <div className="flex justify-between bg-white text-sm mt-2">
          <span>{data.status}</span>
          <span>{data.target}</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
      />
    </div>
  );
}
