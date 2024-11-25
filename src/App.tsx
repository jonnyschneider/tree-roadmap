import React, { useEffect } from 'react';
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

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    console.log('Raw nodes data:', data.nodesData);

    const flowNodes = data.nodesData.map((node: { id: string; title: string; description: string; status: string; target: string; project: string; position: { x: number; y: number } }) => ({
      id: node.id,
      type: 'roadmapNode',
      position: node.position, // Read the position from nodes.json data
      style: {
      opacity: 1,
      },
      data: {
      title: node.title,
      description: node.description,
      status: node.status,
      target: node.target, // Include target in data
      project: node.project, // Add project to data
      },
    }));

    console.log('Transformed nodes:', flowNodes);

    const flowEdges = data.edgesData.map((edge: { source: string; target: string }) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'straight',
      style: { stroke: '#374151', strokeWidth: 1 },
    }));

    console.log('Final nodes set to state:', flowNodes);
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, []);

  return (
    <div style={{ height: 800 }} className="h-screen w-screen bg-gray-900">
      <div className="text-center text-white bg-blue-500 p-4">Tailwind CSS Test</div>
      <ReactFlow
        nodes={nodes}
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
          style={{ backgroundColor: '#1a202c' }}
        />
        <Controls
          className="react-flow__controls-dark"
          showInteractive={false}
        />
        <MiniMap
          nodeColor="#2D3748"
          maskColor="#1a202c99"
          className="bg-gray-900 border-gray-800"
        />
      </ReactFlow>
    </div>
  );
}
