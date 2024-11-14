import { Node, Edge } from 'reactflow';
import { RoadmapNodeData } from '../components/RoadmapNode';

type Status = 'completed' | 'in-progress' | 'planned';

function createNode(
    id: string,
    position: { x: number; y: number },
    label: string,
    status: Status,
    icon?: string
): Node<RoadmapNodeData> {
    return {
        id,
        type: 'roadmapNode',
        position,
        data: { label, status, ...(icon ? { icon } : {}) }
    };
}

const VERTICAL_SPACING = 80;
const HORIZONTAL_SPACING = 500;
const BRANCH_OFFSET = 50;
const LEVEL1_Y = 500;
const BRANCH_ANGLE = 30;

function getBranchPosition(startX: number, startY: number): { x: number; y: number } {
    const angleInRadians = BRANCH_ANGLE * (Math.PI / 180);
    return {
        x: startX + (BRANCH_OFFSET * Math.cos(angleInRadians)),
        y: startY + (BRANCH_OFFSET * Math.sin(angleInRadians))
    };
}

export const initialNodes: Node<RoadmapNodeData>[] = [
    // Root node
    createNode('root', { x: 600, y: 50 }, 'Phantm Captr', 'completed', 'Map'),

    // Level 1 nodes
    createNode('material-library', { x: 200, y: LEVEL1_Y }, 'Material Library', 'completed', 'Database'),
    createNode('data-io', { x: 450, y: LEVEL1_Y }, 'Data I/O', 'in-progress', 'Database'),
    createNode('data-enrichment', { x: 700, y: LEVEL1_Y }, 'Data Enrichment', 'in-progress', 'Brain'),
    createNode('insights', { x: 950, y: LEVEL1_Y }, 'Insights', 'planned', 'ChartBar'),
    createNode('supplier-data', { x: 1200, y: LEVEL1_Y }, 'Supplier Data Management', 'planned', 'Building'),

    // Material Library children
    ...([
        'Core',
        'Custom Data Fields',
        'Variant Mapping',
        'Secondary Packaging',
        'Tertiary Packaging'
    ] as const).map((label, index) => 
        createNode(
            `ml-${label.toLowerCase().replace(/\s+/g, '-')}`,
            {
                x: getBranchPosition(200, LEVEL1_Y).x,
                y: getBranchPosition(200, LEVEL1_Y).y + (VERTICAL_SPACING * index)
            },
            label,
            'completed'
        )
    ),

    // Data I/O - Input branch
    createNode('io-in', getBranchPosition(450, LEVEL1_Y), 'In', 'in-progress', 'Upload'),

    // Data I/O - Input children
    ...([
        { label: 'Bulk Import (SQL, CSV, XLS)', status: 'completed' as Status },
        { label: 'ERP Batch Upload', status: 'completed' as Status },
        { label: 'Middleware iPaaS', status: 'planned' as Status },
        { label: 'ERP Adaptor', status: 'planned' as Status },
        { label: 'Datalake Slurp Slurp', status: 'planned' as Status },
        { label: 'Inbound API endpoint', status: 'in-progress' as Status }
    ].map((item, index) => 
        createNode(
            `io-in-${item.label.toLowerCase().replace(/[().,\s]+/g, '-')}`,
            {
                x: getBranchPosition(getBranchPosition(450, LEVEL1_Y).x, getBranchPosition(450, LEVEL1_Y).y).x,
                y: getBranchPosition(450, LEVEL1_Y).y + (VERTICAL_SPACING * index)
            },
            item.label,
            item.status
        )
    )),

    // Data I/O - Output branch
    createNode(
        'io-out',
        { 
            x: getBranchPosition(450, LEVEL1_Y).x + HORIZONTAL_SPACING, 
            y: getBranchPosition(450, LEVEL1_Y).y 
        },
        'Out',
        'in-progress',
        'Download'
    ),

    // Data I/O - Output children
    ...([
        { label: 'PowerBI', status: 'completed' as Status },
        { label: 'Raw', status: 'completed' as Status }
    ].map((item, index) => 
        createNode(
            `io-out-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            {
                x: getBranchPosition(450, LEVEL1_Y).x + HORIZONTAL_SPACING,
                y: getBranchPosition(450, LEVEL1_Y).y + (VERTICAL_SPACING * (index + 1))
            },
            item.label,
            item.status
        )
    )),

    // Data Enrichment - PhantmGPT branch
    createNode(
        'de-phantmgpt',
        getBranchPosition(700, LEVEL1_Y),
        'Best Guess with PhantmGPT',
        'in-progress'
    ),

    // PhantmGPT children
    ...([
        { label: 'Normative Range Tuning', status: 'in-progress' as Status },
        { label: 'Advanced Prompts', status: 'planned' as Status },
        { label: 'Expert Moderation', status: 'planned' as Status },
        { label: 'Advanced LLM (Sonnet 3.5 / GPT-4o)', status: 'planned' as Status },
        { label: 'LangChain Embeddings', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `gpt-${item.label.toLowerCase().replace(/[().,\s/]+/g, '-')}`,
            {
                x: getBranchPosition(getBranchPosition(700, LEVEL1_Y).x, getBranchPosition(700, LEVEL1_Y).y).x,
                y: getBranchPosition(700, LEVEL1_Y).y + (VERTICAL_SPACING * index)
            },
            item.label,
            item.status
        )
    )),

    // Data Enrichment - LLM Configuration branch
    createNode(
        'de-llm-config',
        {
            x: getBranchPosition(700, LEVEL1_Y).x + HORIZONTAL_SPACING,
            y: getBranchPosition(700, LEVEL1_Y).y
        },
        'LLM Configuration',
        'planned'
    ),

    // LLM Configuration children
    ...([
        { label: 'Hybrid Extrapolation', status: 'planned' as Status },
        { label: 'Client Moderation', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `llm-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            {
                x: getBranchPosition(700, LEVEL1_Y).x + HORIZONTAL_SPACING,
                y: getBranchPosition(700, LEVEL1_Y).y + (VERTICAL_SPACING * (index + 1))
            },
            item.label,
            item.status
        )
    )),

    // Other Data Enrichment nodes
    ...([
        { label: 'Version control', status: 'in-progress' as Status },
        { label: 'Traceability', status: 'in-progress' as Status },
        { label: 'Data Confidence Score', status: 'planned' as Status },
        { label: 'SKU-to-spec Reconciliation', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `de-${item.label.toLowerCase().replace(/[-.]\s+/g, '-')}`,
            {
                x: getBranchPosition(700, LEVEL1_Y).x + (HORIZONTAL_SPACING * 2),
                y: getBranchPosition(700, LEVEL1_Y).y + (VERTICAL_SPACING * index)
            },
            item.label,
            item.status
        )
    )),

    // Insights children
    ...([
        { label: 'Phantm Portfolio Report', status: 'planned' as Status },
        { label: 'Custom Reporting', status: 'planned' as Status },
        { label: 'APCO', status: 'planned' as Status },
        { label: 'Material Audit', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `insights-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            {
                x: getBranchPosition(950, LEVEL1_Y).x,
                y: getBranchPosition(950, LEVEL1_Y).y + (VERTICAL_SPACING * index)
            },
            item.label,
            item.status
        )
    )),

    // Supplier Data Management children
    ...([
        { label: 'Document Management', status: 'planned' as Status },
        { label: 'File Upload', status: 'planned' as Status },
        { label: 'Upload by Email', status: 'planned' as Status },
        { label: 'Supplier Portal', status: 'planned' as Status }
    ].map((item, index) => 
        createNode(
            `sdm-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
            {
                x: getBranchPosition(1200, LEVEL1_Y).x,
                y: getBranchPosition(1200, LEVEL1_Y).y + (VERTICAL_SPACING * index)
            },
            item.label,
            item.status
        )
    )),
];
// Add after the initialNodes in the same file

function createEdge(source: string, target: string): Edge {
    return {
        id: `${source}-${target}`,
        source,
        target,
        type: 'straight'
    };
}

export const initialEdges: Edge[] = [
    // Root to Level 1 - radiating lines
    ...[
        'material-library',
        'data-io',
        'data-enrichment',
        'insights',
        'supplier-data'
    ].map(target => createEdge('root', target)),

    // Material Library vertical chain
    createEdge('material-library', 'ml-core'),
    createEdge('ml-core', 'ml-custom-data-fields'),
    createEdge('ml-custom-data-fields', 'ml-variant-mapping'),
    createEdge('ml-variant-mapping', 'ml-secondary-packaging'),
    createEdge('ml-secondary-packaging', 'ml-tertiary-packaging'),

    // Data I/O branches
    // Connection to 'In' and 'Out' branches
    createEdge('data-io', 'io-in'),
    createEdge('data-io', 'io-out'),

    // Input vertical chain
    ...[
        'bulk-import-sql-csv-xls',
        'erp-batch-upload',
        'middleware-ipaas',
        'erp-adaptor',
        'datalake-slurp-slurp',
        'inbound-api-endpoint'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            // First node connects to parent
            edges.push(createEdge('io-in', `io-in-${target}`));
        } else {
            // Other nodes connect to previous node
            edges.push(createEdge(
                `io-in-${arr[index - 1]}`,
                `io-in-${target}`
            ));
        }
        return edges;
    }, []),

    // Output vertical chain
    ...[
        'powerbi',
        'raw'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('io-out', `io-out-${target}`));
        } else {
            edges.push(createEdge(
                `io-out-${arr[index - 1]}`,
                `io-out-${target}`
            ));
        }
        return edges;
    }, []),

    // Data Enrichment connections
    createEdge('data-enrichment', 'de-phantmgpt'),
    createEdge('data-enrichment', 'de-llm-config'),
    createEdge('data-enrichment', 'de-version-control'),

    // PhantmGPT vertical chain
    ...[
        'normative-range-tuning',
        'advanced-prompts',
        'expert-moderation',
        'advanced-llm-sonnet-3-5-gpt-4o',
        'langchain-embeddings'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('de-phantmgpt', `gpt-${target}`));
        } else {
            edges.push(createEdge(
                `gpt-${arr[index - 1]}`,
                `gpt-${target}`
            ));
        }
        return edges;
    }, []),

    // LLM Configuration vertical chain
    ...[
        'hybrid-extrapolation',
        'client-moderation'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('de-llm-config', `llm-${target}`));
        } else {
            edges.push(createEdge(
                `llm-${arr[index - 1]}`,
                `llm-${target}`
            ));
        }
        return edges;
    }, []),

    // Other Data Enrichment vertical chain
    ...[
        'version-control',
        'traceability',
        'data-confidence-score',
        'sku-to-spec-reconciliation'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('data-enrichment', `de-${target}`));
        } else {
            edges.push(createEdge(
                `de-${arr[index - 1]}`,
                `de-${target}`
            ));
        }
        return edges;
    }, []),

    // Insights vertical chain
    ...[
        'phantm-portfolio-report',
        'custom-reporting',
        'apco',
        'material-audit'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('insights', `insights-${target}`));
        } else {
            edges.push(createEdge(
                `insights-${arr[index - 1]}`,
                `insights-${target}`
            ));
        }
        return edges;
    }, []),

    // Supplier Data Management vertical chain
    ...[
        'document-management',
        'file-upload',
        'upload-by-email',
        'supplier-portal'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('supplier-data', `sdm-${target}`));
        } else {
            edges.push(createEdge(
                `sdm-${arr[index - 1]}`,
                `sdm-${target}`
            ));
        }
        return edges;
    }, []),
];

