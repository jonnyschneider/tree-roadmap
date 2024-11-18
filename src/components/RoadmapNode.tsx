import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Circle,
  Map, 
  Database,
  FileText,
  Upload,
  Download,
  Brain,
  ChartBar,
  Building,
  LucideIcon 
} from 'lucide-react';
import { useState } from 'react';
import RoadmapTooltip from './RoadmapTooltip';

const iconMap: Record<string, LucideIcon> = {
  Circle,
  Map,
  Database,
  FileText,
  Upload,
  Download,
  Brain,
  ChartBar,
  Building
};

const statusColors: Record<string, string> = {
  planned: 'bg-gray-400',
  'in-progress': 'bg-blue-400',
  completed: 'bg-green-400',
};

export type RoadmapNodeData = {
  label: string;
  icon?: string;
  status?: 'planned' | 'in-progress' | 'completed';
  tooltip?: string;
  borderColor?: string;  // Add this
};

export default function RoadmapNode({ data, id }: NodeProps<RoadmapNodeData>) {
  const [showTooltip, setShowTooltip] = useState(false);
  const IconComponent = data.icon ? iconMap[data.icon] || Circle : Circle;
  
  console.log('Node rendered:', {
    id,
    type: 'roadmapNode',
    data: data,
    hasTooltip: Boolean(data.tooltip),
    tooltipContent: data.tooltip
  });
  
  return (
    <div 
      onMouseEnter={() => {
        console.log('Mouse enter:', data.label, 'tooltip:', data.tooltip);
        setShowTooltip(true);
      }}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative cursor-pointer"
    >
      {/* Debug render to check if tooltip exists */}
      <div className="hidden">{JSON.stringify(data)}</div>
      
      {showTooltip && data.tooltip && (
        <RoadmapTooltip>{data.tooltip}</RoadmapTooltip>
      )}
      <Handle 
        type="target" 
        position={Position.Top}
        className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
      />
      <div 
        className="rounded-[5px] bg-gray-800/90 w-48"
        style={{ border: data.borderColor ? `2px solid ${data.borderColor}` : undefined }}
      >
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-medium text-gray-300 tracking-tight break-words">{data.label}</span>
          </div>
          {data.status && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${statusColors[data.status]}`} />
              <span className="text-[9px] text-gray-400 capitalize font-mono">{data.status}</span>
            </div>
          )}
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