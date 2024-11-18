import { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, NodeTypes, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import RoadmapNode from './components/RoadmapNode';
import nodesData from './data/nodes.json';
import edgesData from './data/edges.json';

const nodeTypes: NodeTypes = {
    roadmapNode: RoadmapNode,
};

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        // Transform JSON data into ReactFlow format
        const flowNodes = nodesData.map(node => ({
            id: node.id,
            type: 'roadmapNode',
            position: node.position,
            data: {
                label: node.label,
                icon: node.icon,
                status: node.status,
                borderColor: node.borderColor,
                tooltip: node.tooltip,
                target: node.target,
                focus: node.focus,
                backlog: node.backlog
            }
        }));

        const flowEdges = edgesData.map(edge => ({
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: 'straight',
            style: { stroke: '#374151', strokeWidth: 1 }
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
    }, []);

    return (
        <div className="h-screen w-screen bg-gray-900">
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