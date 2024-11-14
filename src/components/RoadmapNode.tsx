import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Circle,
  Map, 
  User, 
  CreditCard, 
  Wallet,
  Database,
  FileText,
  Upload,
  Download,
  Brain,
  ChartBar,
  Building,
  LucideIcon 
} from 'lucide-react';

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
};

export default function RoadmapNode({ data }: NodeProps<RoadmapNodeData>) {
  const IconComponent = data.icon ? iconMap[data.icon] || Circle : Circle;
  
  return (
    <div>
      <Handle 
        type="target" 
        position={Position.Top}
        className="!bg-transparent !w-8 !h-1 !border-0 !rounded-none"
      />
      <div className="rounded-[5px] bg-gray-800/90">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-300 tracking-tight">{data.label}</span>
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