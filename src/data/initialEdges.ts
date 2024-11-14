import { Edge } from 'reactflow';

const createEdge = (source: string, target: string): Edge => ({
    id: `${source}-${target}`,
    source,
    target,
    type: 'straight'
});

const edges: Edge[] = [
    // Root to Level 1 - radiating lines
    createEdge('root', 'material-library'),
    createEdge('root', 'data-io'),
    createEdge('root', 'data-enrichment'),
    createEdge('root', 'insights'),
    createEdge('root', 'supplier-data'),

    // Material Library - straight vertical connections
    createEdge('material-library', 'ml-core'),
    createEdge('ml-core', 'ml-custom-data-fields'),
    createEdge('ml-custom-data-fields', 'ml-variant-mapping'),
    createEdge('ml-variant-mapping', 'ml-secondary-packaging'),
    createEdge('ml-secondary-packaging', 'ml-tertiary-packaging'),

    // Data I/O - branch connections
    createEdge('data-io', 'io-in'),
    createEdge('data-io', 'io-out'),

    // Data I/O Input branch - vertical connections
    ...([
        'bulk-import-sql-csv-xls',
        'erp-batch-upload',
        'middleware-ipaas',
        'erp-adaptor',
        'datalake-slurp-slurp',
        'inbound-api-endpoint'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('io-in', `io-in-${target}`));
        } else {
            edges.push(createEdge(`io-in-${arr[index - 1]}`, `io-in-${target}`));
        }
        return edges;
    }, [])),

    // Data I/O Output branch - vertical connections
    ...(['powerbi', 'raw'].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('io-out', `io-out-${target}`));
        } else {
            edges.push(createEdge(`io-out-${arr[index - 1]}`, `io-out-${target}`));
        }
        return edges;
    }, [])),

    // Data Enrichment - branch connections
    createEdge('data-enrichment', 'de-phantmgpt'),
    createEdge('data-enrichment', 'de-llm-config'),
    createEdge('data-enrichment', 'de-general'),


    // PhantmGPT branch - vertical connections
    ...([
        'normative-range-tuning',
        'advanced-prompts',
        'expert-moderation',
        'advanced-llm-sonnet-3-5-gpt-4o',
        'langchain-embeddings'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('de-phantmgpt', `gpt-${target}`));
        } else {
            edges.push(createEdge(`gpt-${arr[index - 1]}`, `gpt-${target}`));
        }
        return edges;
    }, [])),

    // LLM Configuration branch - vertical connections
    ...(['hybrid-extrapolation', 'client-moderation'].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('de-llm-config', `llm-${target}`));
        } else {
            edges.push(createEdge(`llm-${arr[index - 1]}`, `llm-${target}`));
        }
        return edges;
    }, [])),

    // Data Enrichment - vertical connections
    ...([
        'general',
        'version-control',
        'traceability',
        'data-confidence-score',
        'sku-to-spec-reconciliation'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('data-enrichment', `de-${target}`));
        } else {
            edges.push(createEdge(`de-${arr[index - 1]}`, `de-${target}`));
        }
        return edges;
    }, [])),

    // Insights - vertical connections
    ...([
        'phantm-portfolio-report',
        'custom-reporting',
        'apco',
        'material-audit'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('insights', `insights-${target}`));
        } else {
            edges.push(createEdge(`insights-${arr[index - 1]}`, `insights-${target}`));
        }
        return edges;
    }, [])),

    // Supplier Data Management - vertical connections
    ...([
        'document-management',
        'file-upload',
        'upload-by-email',
        'supplier-portal'
    ].reduce<Edge[]>((edges, target, index, arr) => {
        if (index === 0) {
            edges.push(createEdge('supplier-data', `sdm-${target}`));
        } else {
            edges.push(createEdge(`sdm-${arr[index - 1]}`, `sdm-${target}`));
        }
        return edges;
    }, [])),
];

export { edges as initialEdges };