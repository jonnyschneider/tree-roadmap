import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, NodeTypes, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import RoadmapNode from './components/RoadmapNode';
import nodesData from './data/nodes.json';
import edgesData from './data/edges.json';

const RELEASE_FILTERS = {
    'Friends and Family': 'F&F',
    'Pilot': 'Pilot',
    'Beta': 'Beta',
    'future': 'Future'
} as const;

const nodeTypes: NodeTypes = {
    roadmapNode: RoadmapNode,
};

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

    useEffect(() => {
        console.log('Raw nodes data:', nodesData);
        
        const flowNodes = nodesData.map(node => ({
            id: node.id,
            type: 'roadmapNode',
            position: node.position,
            style: { 
                opacity: 1
            },
            data: {
                ...node,  // Pass all node data
                borderColor: node.borderColor,  // Explicitly pass borderColor
                backgroundColor: node.backgroundColor
            }
        }));

        console.log('Transformed nodes:', flowNodes);

        const flowEdges = edgesData.map(edge => ({
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: 'straight',
            style: { stroke: '#374151', strokeWidth: 1 }
        }));

        console.log('Final nodes set to state:', flowNodes);
        setNodes(flowNodes);
        setEdges(flowEdges);
    }, []);

    // Update node visibility when filters change
    useEffect(() => {
        setNodes(nodes => nodes.map(node => ({
            ...node,
            style: {
                ...node.style,
                opacity: activeFilters.size === 0 || activeFilters.has(node.data.target) ? 1 : 0.2
            }
        })));
    }, [activeFilters, setNodes]);

    const toggleFilter = (filter: string) => {
        setActiveFilters(current => {
            const newFilters = new Set(current);
            if (newFilters.has(filter)) {
                newFilters.delete(filter);
            } else {
                newFilters.add(filter);
            }
            return newFilters;
        });
    };

    return (
        <div className="h-screen w-screen bg-gray-900">
            {/* Add filter buttons */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                {Object.entries(RELEASE_FILTERS).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => toggleFilter(key)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            activeFilters.has(key)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

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