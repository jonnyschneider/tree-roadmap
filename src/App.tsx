import ReactFlow, { Background, Controls, MiniMap, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';

import RoadmapNode from './components/RoadmapNode';
import { initialNodes, initialEdges } from './data/initialData'; // Fix import path

const nodeTypes: NodeTypes = {
    roadmapNode: RoadmapNode,
};

export default function App() {
    // Debug log the PhantmGPT node specifically
    console.log('PhantmGPT Node:', initialNodes.find(n => n.id === 'de-phantmgpt'));
    console.log('Nodes:', initialNodes);
    console.log('Edges:', initialEdges);

    return (
        <div className="h-screen w-screen bg-gray-900">
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={{
                    type: 'straight',
                    style: { stroke: '#374151', strokeWidth: 1 },
                    animated: false,
                }}
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