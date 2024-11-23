import { Handle, Position, NodeProps } from 'reactflow';
import { useState } from 'react';
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
};

export default function RoadmapNode({ data, id }: NodeProps<RoadmapNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  console.log('Node rendered:', {
    id,
    type: 'roadmapNode',
    data: data,
    hasTooltip: Boolean(data.description),
    tooltipContent: data.description
  });
  
  return (
    <div 
      onMouseEnter={() => {
        console.log('Mouse enter:', data.status, 'description:', data.description);
        setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative cursor-pointer"
    >
      {showTooltip && data.description && (
        <RoadmapTooltip
          title={data.title}
          description={data.description}
          moreInfo={data.moreInfo}
        />
      )}
      <Handle 
        type="target" 
        position={Position.Top}
        className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
      />
      <div 
        className="rounded-[5px] w-48"
        style={{ 
          border: data.borderColor ? `1px solid ${data.borderColor}` : undefined,
          backgroundColor: data.backgroundColor || '#f8fafc',
        }}
      >
        {/* Render node content here */}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
      />
    </div>
  );
}