import { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import RoadmapNode from './components/RoadmapNode';
import data from './data/nodes.json';

const nodeTypes: NodeTypes = {
  roadmapNode: RoadmapNode,
};

const releases = ['Friends and Family', 'Customer Pilot', 'Public Beta'];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null);

  useEffect(() => {
    const flowNodes = data.nodesData.map((node: { id: string; title: string; description: string; status: string; target: string; project: string; position: { x: number; y: number } }) => ({
      id: node.id,
      type: 'roadmapNode',
      position: node.position, // Read the position from nodes.json data
      style: {
        opacity: 1,
      },
      data: {
        id: node.id, // Ensure id is included in data
        title: node.title,
        description: node.description,
        status: node.status,
        target: node.target, // Include target in data
        project: node.project, // Add project to data
      },
    }));

    const flowEdges = data.edgesData.map((edge: { source: string; target: string }) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'straight',
      style: { stroke: '#374151', strokeWidth: 1 },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, []);

  const filteredNodes = selectedRelease
    ? nodes.filter((node) => node.data.target === selectedRelease || node.data.status === 'Project' || node.data.id === 'root')
    : nodes;

  return (
    <div style={{ height: '100%' }} className="h-screen w-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10">
        {releases.map((release) => (
          <button
            key={release}
            onClick={() => setSelectedRelease(release)}
            className={`px-2 py-1 m-1 rounded text-xs ${
              selectedRelease === release ? 'bg-emerald text-salt' : 'bg-gray-700 text-white'
            }`}
          >
            {release}
          </button>
        ))}
        <button
          onClick={() => setSelectedRelease(null)}
          className={`px-2 py-1 m-1 rounded text-xs ${
            selectedRelease === null ? 'bg-emerald text-salt' : 'bg-gray-700 text-white'
          }`}
        >
          Show All
        </button>
      </div>
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        className="react-flow-dark"
      >
        <Background
          color="#2D3748"
          gap={20}
          size={0.5}
          style={{ backgroundColor: '#fff8ef' }} //salt
        />
        <Controls
          className="react-flow__controls-light"
          showInteractive={false}
        />
        <MiniMap
          className="hidden bg-gray-900 border-gray-800"
        />
      </ReactFlow>
    </div>
  );
}
