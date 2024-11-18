import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Circle,
  LayoutDashboard,
  Database,
  Building2,
  Download,
  Sparkles,
  BarChart2,
  Settings,
  Lightbulb,
  Package,
  GaugeCircle,
  TableProperties,
  Users,
  Mail,
  Brain,
  ArrowRightLeft,
  FileBarChart,
  FileOutput,
  Bot,
  ArrowUpCircle,
  Lock,
  Shield,
  CheckCircle2,
  DollarSign,
  Leaf,
  LucideIcon 
} from 'lucide-react';
import { useState } from 'react';
import RoadmapTooltip from './RoadmapTooltip';

const iconMap: Record<string, LucideIcon> = {
  Circle,
  LayoutDashboard,
  Database,
  Building2,
  Download,
  Sparkles,
  BarChart2,
  Settings,
  Lightbulb,
  Package,
  GaugeCircle,
  TableProperties,
  Users,
  Mail,
  Brain,
  ArrowRightLeft,
  FileBarChart,
  FileOutput,
  Bot,
  ArrowUpCircle,
  Lock,
  Shield,
  CheckCircle2,
  DollarSign,
  Leaf
};

const statusColors: Record<string, string> = {
  planned: 'bg-gray-400',
  'in-development': 'bg-yellow-400',
  preview: 'bg-green-400',
  considering: 'bg-blue-400'
};

const statusDisplay: Record<string, string> = {
  planned: 'planned',
  'in-development': 'in dev',
  preview: 'preview',
  considering: 'future'
};

const targetDisplay: Record<string, string> = {
  'Friends and Family': 'F&F',
  'Pilot': 'Pilot',
  'Beta': 'Public Beta',
  'future': 'Future'
};

export type RoadmapNodeData = {
  label: string;
  icon?: string;
  status?: string;
  target?: string;
  tooltip?: string;
  borderColor?: string;
  backgroundColor?: string;
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
        className="rounded-[5px] w-48"
        style={{ 
          border: data.borderColor ? `1px solid ${data.borderColor}` : undefined,
          backgroundColor: data.backgroundColor || '#f8fafc',
        }}
      >
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-[10px] font-medium text-gray-300 tracking-tight break-words">{data.label}</span>
          </div>
          <div className="mt-1.5 flex justify-between items-center">
            {data.target && (
              <span className="text-[9px] text-gray-400 lowercase font-mono">
                {targetDisplay[data.target]}
              </span>
            )}
            {data.status && data.status !== ' ' && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-gray-400 lowercase font-mono">
                  {statusDisplay[data.status]}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${statusColors[data.status]}`} />
              </div>
            )}
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