import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, NodeTypes, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import RoadmapNode from './components/RoadmapNode';
import { loadNodes, saveNodes } from './data/initialNodes';
import { initialEdges } from './data/initialEdges';

const nodeTypes: NodeTypes = {
    roadmapNode: RoadmapNode,
};

export default function App() {
    const initialNodes = loadNodes();

    // Debug log the PhantmGPT node specifically
    console.log('PhantmGPT Node:', initialNodes.find(n => n.id === 'de-phantmgpt'));
    console.log('Nodes:', initialNodes);
    console.log('Edges:', initialEdges);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Save node positions to localStorage when nodes change
    useEffect(() => {
        saveNodes(nodes);
    }, [nodes]);

    return (
        <div className="h-screen w-screen bg-gray-900">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDragStop={(event, node) => {
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