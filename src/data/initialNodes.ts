import { Node } from 'reactflow';
import { RoadmapNodeData } from '../components/RoadmapNode';

type Status = 'completed' | 'in-progress' | 'planned';

const createNode = (
    id: string,
    position: { x: number; y: number },
    label: string,
    status: Status,
    icon?: string
): Node<RoadmapNodeData> => ({
    id,
    type: 'roadmapNode',
    position,
    data: { label, status, ...(icon ? { icon } : {}) }
});

const VERTICAL_SPACING = 80;
const BRANCH_OFFSET = 200;  // Increased for better spacing
const LEVEL1_Y = 150;
const ROOT_X = 600;

// Position helper functions
const getVerticalPosition = (parentX: number, startY: number, index: number) => ({
    x: parentX,  // Keep X aligned with parent
    y: startY + (VERTICAL_SPACING * (index + 1))
});

const getBranchLeftPosition = (parentX: number, parentY: number) => ({
    x: parentX - BRANCH_OFFSET,
    y: parentY + VERTICAL_SPACING
});

const getBranchRightPosition = (parentX: number, parentY: number) => ({
    x: parentX + BRANCH_OFFSET,
    y: parentY + VERTICAL_SPACING
});

const nodes: Node<RoadmapNodeData>[] = [
    // Root node centered
    createNode('root', { x: ROOT_X, y: 50 }, 'Phantm Captr', 'completed', 'Map'),

    // Level 1 nodes spread horizontally
    createNode('material-library', { x: 0, y: LEVEL1_Y }, 'Material Library', 'completed', 'Database'),
    createNode('data-io', { x:400, y: LEVEL1_Y }, 'Data I/O', 'in-progress', 'Database'),
    createNode('data-enrichment', { x: 800, y: LEVEL1_Y }, 'Data Enrichment', 'in-progress', 'Brain'),
    createNode('insights', { x: 1200, y: LEVEL1_Y }, 'Insights', 'planned', 'ChartBar'),
    createNode('supplier-data', { x: 1400, y: LEVEL1_Y }, 'Supplier Data Management', 'planned', 'Building'),

    // Material Library - vertical aligned children
    ...([
        'Core',
        'Custom Data Fields',
        'Variant Mapping',
        'Secondary Packaging',
        'Tertiary Packaging'
    ] as const).map((label, index) => 
        createNode(
            `ml-${label.toLowerCase().replace(/\s+/g, '-')}`,
            getVerticalPosition(0, LEVEL1_Y, index),
            label,
            'completed'
        )
    ),

    // Data I/O - Branch nodes
    createNode('io-in', getBranchLeftPosition(450, LEVEL1_Y), 'In', 'in-progress', 'Upload'),
    createNode('io-out', getBranchRightPosition(300, LEVEL1_Y), 'Out', 'in-progress', 'Download'),

    // Data I/O - Input branch vertical children
    ...([
        { label: 'Bulk Import (SQL, CSV, XLS)', status: 'completed' as Status },
        { label: 'ERP Batch Upload', status: 'completed' as Status },
        { label: 'Middleware iPaaS', status: 'planned' as Status },
        { label: 'ERP Adaptor', status: 'planned' as Status },
        { label: 'Datalake Slurp Slurp', status: 'planned' as Status },
        { label: 'Inbound API endpoint', status: 'in-progress' as Status }
    ].map((item, index) => {
        const branchPos = getBranchLeftPosition(450, LEVEL1_Y);
        return createNode(
            `io-in-${item.label.toLowerCase().replace(/[().,\s]+/g, '-')}`,
            getVerticalPosition(branchPos.x, branchPos.y, index),
            item.label,
            item.status
        );
    })),

    // Data I/O - Output branch vertical children
    ...([
        { label: 'PowerBI', status: 'completed' as Status },
        { label: 'Raw', status: 'completed' as Status }
    ].map((item, index) => {
        const branchPos = getBranchRightPosition(300, LEVEL1_Y);
        return createNode(
            `io-out-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            getVerticalPosition(branchPos.x, branchPos.y, index),
            item.label,
            item.status
        );
    })),

    // Data Enrichment - Branch nodes
    createNode('de-phantmgpt', getBranchLeftPosition(900, LEVEL1_Y), 'Best Guess with PhantmGPT', 'in-progress'),
    createNode('de-llm-config', getBranchRightPosition(750, LEVEL1_Y), 'LLM Configuration', 'planned'),
    createNode('de-general', getBranchRightPosition(1700, LEVEL1_Y), 'General', 'planned'),


    // Data Enrichment - PhantmGPT branch vertical children
    ...([
        { label: 'Normative Range Tuning', status: 'in-progress' as Status },
        { label: 'Advanced Prompts', status: 'planned' as Status },
        { label: 'Expert Moderation', status: 'planned' as Status },
        { label: 'Advanced LLM (Sonnet 3.5 / GPT-4o)', status: 'planned' as Status },
        { label: 'LangChain Embeddings', status: 'planned' as Status }
    ].map((item, index) => {
        const branchPos = getBranchLeftPosition(900, LEVEL1_Y);
        return createNode(
            `gpt-${item.label.toLowerCase().replace(/[().,\s/]+/g, '-')}`,
            getVerticalPosition(branchPos.x, branchPos.y, index),
            item.label,
            item.status
        );
    })),

    // Data Enrichment - LLM Configuration branch vertical children
    ...([
        { label: 'Hybrid Extrapolation', status: 'planned' as Status },
        { label: 'Client Moderation', status: 'planned' as Status }
    ].map((item, index) => {
        const branchPos = getBranchRightPosition(750, LEVEL1_Y);
        return createNode(
            `llm-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            getVerticalPosition(branchPos.x, branchPos.y, index),
            item.label,
            item.status
        );
    })),

    // Data Enrichment - General branch vertical aligned children
    ...([
        { label: 'Version control', status: 'in-progress' as Status },
        { label: 'Traceability', status: 'in-progress' as Status },
        { label: 'Data Confidence Score', status: 'planned' as Status },
        { label: 'SKU-to-spec Reconciliation', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `de-${item.label.toLowerCase().replace(/[-.]\s+/g, '-')}`,
            getVerticalPosition(1700, LEVEL1_Y, index),
            item.label,
            item.status
        )
    )),

    // Insights - vertical aligned children
    ...([
        { label: 'Phantm Portfolio Report', status: 'planned' as Status },
        { label: 'Custom Reporting', status: 'planned' as Status },
        { label: 'APCO', status: 'planned' as Status },
        { label: 'Material Audit', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `insights-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            getVerticalPosition(1200, LEVEL1_Y, index),
            item.label,
            item.status
        )
    )),

    // Supplier Data Management - vertical aligned children
    ...([
        { label: 'Document Management', status: 'planned' as Status },
        { label: 'File Upload', status: 'planned' as Status },
        { label: 'Upload by Email', status: 'planned' as Status },
        { label: 'Supplier Portal', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `sdm-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            getVerticalPosition(1400, LEVEL1_Y, index),
            item.label,
            item.status
        )
    )),
];

export { nodes as initialNodes };