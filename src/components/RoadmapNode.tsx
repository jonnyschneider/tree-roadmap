import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { TbDelta } from 'react-icons/tb';
import RoadmapTooltip from './RoadmapTooltip';

export type RoadmapNodeData = {
  id: string;
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

  const getStatusIndicator = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo':
        return (
          <div className="flex items-center space-x-2 px-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            <div>Planned</div>
          </div>
        );
      case 'in progress':
        return (
          <div className="flex items-center space-x-2 px-2">
            <span className="w-3 h-3 bg-sky-600 rounded-full"></span>
            <span>In Progress</span>
          </div>
        );
      case 'done':
        return (
          <div className="flex items-center space-x-2 px-2">
            <span className="w-3 h-3 bg-emerald rounded-full"></span>
            <span>Available</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (data.id === 'root') {
    return (
      <div
        onMouseEnter={() => {
          console.log('Mouse enter:', data.status, 'description:', data.description);
          setShowTooltip(true);
        }}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative cursor-pointer bg-salt w-[220px] h-[220px] flex items-center justify-center border-0 rounded-full"
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
        <img src="/img/Phantm_Primary_Logo_RGB_Forest.svg" alt="Phantm Logo" className="w-full h-full object-contain bg-emerald rounded-full" />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
        />
      </div>
    );
  }

  if (data.status === 'Project') {
    return (
      <div
        onMouseEnter={() => {
          console.log('Mouse enter:', data.status, 'description:', data.description);
          setShowTooltip(true);
        }}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative cursor-pointer bg-salt w-[250px]" // Set fixed width for Project nodes
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
        
        <div  // Custom content for Project nodes
          className="w-full p-2 bg-emerald text-salt border-2 border-forest rounded-lg"
        >
          <div className="font-mono mb-2 p-2 font-bold text-l text-forest uppercase text-center">Area of Value</div>
          <div className="font-sans mb-2 p-2 font-bold text-xl text-white text-center">{data.project}</div>
          
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
        />
      </div>
    );
  }

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
      className="relative cursor-pointer bg-salt w-[250px]" // Set fixed width for other nodes
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
        className="w-full p-0 pb-2 bg-white text-pine border-2 border-pine rounded-lg"
      >
        <div className="font-mono mb-2 p-2 text-xs bg-pine text-white uppercase">{data.project}</div>
        <div className="font-bold font-sans mb-2 p-2 text-xl ">{data.title}</div>
        <div className="space-y-2 p-2 text-sm mt-2 mr-2">
          {getStatusIndicator(data.status)}
          <div className="flex items-center space-x-1 p-1">
            <TbDelta size={20} />
            <span>{data.target}</span>
          </div>
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
