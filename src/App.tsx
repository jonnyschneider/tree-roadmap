import { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, NodeTypes, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import RoadmapNode from './components/RoadmapNode';
import { initialNodes } from './data/initialNodes';
import { initialEdges } from './data/initialEdges';

const nodeTypes: NodeTypes = {
    roadmapNode: RoadmapNode,
};

function saveNodes(nodes: any) {
    localStorage.setItem('nodes', JSON.stringify(nodes));
}

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    // Save node positions to localStorage when nodes change
    useEffect(() => {
        saveNodes(nodes);
    }, [nodes]);

    const handleClearStorage = () => {
        localStorage.clear();
        // Reload the page to reset to initial nodes
        window.location.reload();
    };

    return (
        <div className="h-screen w-screen bg-gray-900 relative">
            <button
                onClick={handleClearStorage}
                className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
            >
                Reset Layout
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDragStop={(_, node) => {
                    setNodes((nds) =>
                        nds.map((n) =>
                            n.id === node.id ? { ...n, position: node.position } : n
                        )
                    );
                }}
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