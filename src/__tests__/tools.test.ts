/**
 * Unit tests for shared MCP tool definitions and handlers
 * Tests tool execution, error handling, and safety limits
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TOOL_DEFINITIONS,
  TOOL_HANDLERS,
  executeTool,
  type ToolHandler,
} from '../tools.js';
import type { OECDClient } from '../oecd-client.js';

// Mock OECDClient for testing
const createMockClient = (): OECDClient => ({
  searchDataflows: vi.fn(),
  listDataflows: vi.fn(),
  getDataStructure: vi.fn(),
  queryData: vi.fn(),
  getCategories: vi.fn(),
  getPopularDatasets: vi.fn(),
  searchIndicators: vi.fn(),
  getDataExplorerUrl: vi.fn(),
  getCategoriesDetailed: vi.fn(),
} as any);

describe('TOOL_DEFINITIONS', () => {
  it('should export 9 tool definitions', () => {
    expect(TOOL_DEFINITIONS).toHaveLength(9);
  });

  it('should have all required tool properties', () => {
    TOOL_DEFINITIONS.forEach((tool) => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('inputSchema');
      expect(typeof tool.name).toBe('string');
      expect(typeof tool.description).toBe('string');
      expect(tool.inputSchema).toBeTypeOf('object');
    });
  });

  it('should include all 9 expected tools', () => {
    const toolNames = TOOL_DEFINITIONS.map((t) => t.name);
    expect(toolNames).toContain('search_dataflows');
    expect(toolNames).toContain('list_dataflows');
    expect(toolNames).toContain('get_data_structure');
    expect(toolNames).toContain('query_data');
    expect(toolNames).toContain('get_categories');
    expect(toolNames).toContain('get_popular_datasets');
    expect(toolNames).toContain('search_indicators');
    expect(toolNames).toContain('get_dataflow_url');
    expect(toolNames).toContain('list_categories_detailed');
  });

  it('should have unique tool names', () => {
    const names = TOOL_DEFINITIONS.map((t) => t.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('should have valid input schemas', () => {
    TOOL_DEFINITIONS.forEach((tool) => {
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema).toHaveProperty('properties');
    });
  });
});

describe('TOOL_HANDLERS', () => {
  it('should have handlers for all 9 tools', () => {
    expect(Object.keys(TOOL_HANDLERS)).toHaveLength(9);
  });

  it('should have matching tool names between definitions and handlers', () => {
    const defNames = TOOL_DEFINITIONS.map((t) => t.name).sort();
    const handlerNames = Object.keys(TOOL_HANDLERS).sort();
    expect(handlerNames).toEqual(defNames);
  });

  it('should have functions as handler values', () => {
    Object.values(TOOL_HANDLERS).forEach((handler) => {
      expect(typeof handler).toBe('function');
    });
  });
});

describe('search_dataflows handler', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should call client.searchDataflows with validated args', async () => {
    vi.mocked(mockClient.searchDataflows).mockResolvedValue([
      { id: 'QNA', version: '1.0', name: 'Quarterly National Accounts', agencyID: 'OECD' },
    ]);

    const handler = TOOL_HANDLERS.search_dataflows;
    await handler(mockClient, { query: 'GDP', limit: 10 });

    expect(mockClient.searchDataflows).toHaveBeenCalledWith('GDP', 10);
  });

  it('should return formatted JSON response', async () => {
    const mockResults = [{ id: 'QNA', version: '1.0', name: 'Test', agencyID: 'OECD' }];
    vi.mocked(mockClient.searchDataflows).mockResolvedValue(mockResults as any);

    const handler = TOOL_HANDLERS.search_dataflows;
    const result = await handler(mockClient, { query: 'test', limit: 5 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse(result.content[0].text)).toEqual(mockResults);
  });

  it('should reject invalid input and throw', async () => {
    const handler = TOOL_HANDLERS.search_dataflows;

    await expect(
      handler(mockClient, { query: '' }) // Invalid empty query
    ).rejects.toThrow();
  });
});

describe('query_data handler with safety limits', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should apply default limit of 100 when not specified', async () => {
    vi.mocked(mockClient.queryData).mockResolvedValue([{ value: 1 }] as any);

    const handler = TOOL_HANDLERS.query_data;
    await handler(mockClient, { dataflow_id: 'QNA' });

    expect(mockClient.queryData).toHaveBeenCalledWith(
      expect.objectContaining({
        lastNObservations: 100, // DEFAULT_LIMIT
      })
    );
  });

  it('should respect specified limit up to 1000', async () => {
    vi.mocked(mockClient.queryData).mockResolvedValue([{ value: 1 }] as any);

    const handler = TOOL_HANDLERS.query_data;
    await handler(mockClient, { dataflow_id: 'QNA', last_n_observations: 500 });

    expect(mockClient.queryData).toHaveBeenCalledWith(
      expect.objectContaining({
        lastNObservations: 500,
      })
    );
  });

  it('should reject limit > MAX_LIMIT (1000) via validation', async () => {
    const handler = TOOL_HANDLERS.query_data;

    // Validation should reject 5000 observations (exceeds max 1000)
    await expect(
      handler(mockClient, {
        dataflow_id: 'QNA',
        last_n_observations: 5000, // Exceeds max
      })
    ).rejects.toThrow('Observations limit cannot exceed 1000');

    // Client method should NOT be called (validation fails first)
    expect(mockClient.queryData).not.toHaveBeenCalled();
  });

  it('should include warning when near max limit (800+)', async () => {
    const largeData = Array(850).fill({ value: 1 });
    vi.mocked(mockClient.queryData).mockResolvedValue(largeData as any);

    const handler = TOOL_HANDLERS.query_data;
    const result = await handler(mockClient, {
      dataflow_id: 'QNA',
      last_n_observations: 850,
    });

    const response = JSON.parse(result.content[0].text);
    expect(response).toHaveProperty('warning');
    expect(response).toHaveProperty('total_observations', 850);
  });

  it('should pass through filter, periods correctly', async () => {
    vi.mocked(mockClient.queryData).mockResolvedValue([{ value: 1 }] as any);

    const handler = TOOL_HANDLERS.query_data;
    await handler(mockClient, {
      dataflow_id: 'QNA',
      filter: 'USA.GDP..',
      start_period: '2020',
      end_period: '2023',
    });

    expect(mockClient.queryData).toHaveBeenCalledWith({
      dataflowId: 'QNA',
      filter: 'USA.GDP..',
      startPeriod: '2020',
      endPeriod: '2023',
      lastNObservations: 100, // Default
    });
  });
});

describe('list_dataflows handler', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should call listDataflows with category filter', async () => {
    vi.mocked(mockClient.listDataflows).mockResolvedValue([]);

    const handler = TOOL_HANDLERS.list_dataflows;
    await handler(mockClient, { category: 'ECO', limit: 30 });

    expect(mockClient.listDataflows).toHaveBeenCalledWith({
      category: 'ECO',
      limit: 30,
    });
  });

  it('should call listDataflows without category', async () => {
    vi.mocked(mockClient.listDataflows).mockResolvedValue([]);

    const handler = TOOL_HANDLERS.list_dataflows;
    await handler(mockClient, {});

    expect(mockClient.listDataflows).toHaveBeenCalledWith({
      category: undefined,
      limit: 50, // Default from validation
    });
  });
});

describe('get_data_structure handler', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should call getDataStructure with dataflow ID', async () => {
    vi.mocked(mockClient.getDataStructure).mockResolvedValue({} as any);

    const handler = TOOL_HANDLERS.get_data_structure;
    await handler(mockClient, { dataflow_id: 'QNA' });

    expect(mockClient.getDataStructure).toHaveBeenCalledWith('QNA');
  });

  it('should return structure data as JSON', async () => {
    const mockStructure = { dimensions: ['LOCATION', 'TIME_PERIOD'] };
    vi.mocked(mockClient.getDataStructure).mockResolvedValue(mockStructure as any);

    const handler = TOOL_HANDLERS.get_data_structure;
    const result = await handler(mockClient, { dataflow_id: 'MEI' });

    expect(JSON.parse(result.content[0].text)).toEqual(mockStructure);
  });
});

describe('get_categories handler', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should call getCategories without arguments', async () => {
    vi.mocked(mockClient.getCategories).mockReturnValue([]);

    const handler = TOOL_HANDLERS.get_categories;
    await handler(mockClient, {});

    expect(mockClient.getCategories).toHaveBeenCalledWith();
  });

  it('should return categories as JSON', async () => {
    const mockCategories = [{ code: 'ECO', name: 'Economy' }];
    vi.mocked(mockClient.getCategories).mockReturnValue(mockCategories as any);

    const handler = TOOL_HANDLERS.get_categories;
    const result = await handler(mockClient, {});

    expect(JSON.parse(result.content[0].text)).toEqual(mockCategories);
  });
});

describe('search_indicators handler', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should call searchIndicators with indicator and category', async () => {
    vi.mocked(mockClient.searchIndicators).mockResolvedValue([]);

    const handler = TOOL_HANDLERS.search_indicators;
    await handler(mockClient, { indicator: 'GDP', category: 'ECO' });

    expect(mockClient.searchIndicators).toHaveBeenCalledWith({
      indicator: 'GDP',
      category: 'ECO',
    });
  });

  it('should call searchIndicators without category', async () => {
    vi.mocked(mockClient.searchIndicators).mockResolvedValue([]);

    const handler = TOOL_HANDLERS.search_indicators;
    await handler(mockClient, { indicator: 'inflation' });

    expect(mockClient.searchIndicators).toHaveBeenCalledWith({
      indicator: 'inflation',
      category: undefined,
    });
  });
});

describe('get_dataflow_url handler', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should call getDataExplorerUrl with dataflow ID and filter', async () => {
    vi.mocked(mockClient.getDataExplorerUrl).mockReturnValue('https://example.com');

    const handler = TOOL_HANDLERS.get_dataflow_url;
    await handler(mockClient, { dataflow_id: 'QNA', filter: 'USA.GDP..' });

    expect(mockClient.getDataExplorerUrl).toHaveBeenCalledWith('QNA', 'USA.GDP..');
  });

  it('should return URL as plain text', async () => {
    const mockUrl = 'https://data-explorer.oecd.org/vis?df=QNA';
    vi.mocked(mockClient.getDataExplorerUrl).mockReturnValue(mockUrl);

    const handler = TOOL_HANDLERS.get_dataflow_url;
    const result = await handler(mockClient, { dataflow_id: 'QNA' });

    expect(result.content[0].text).toBe(mockUrl);
  });
});

describe('executeTool', () => {
  let mockClient: OECDClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  it('should execute a valid tool successfully', async () => {
    vi.mocked(mockClient.getCategories).mockReturnValue([]);

    const result = await executeTool(mockClient, 'get_categories', {});

    expect(result.isError).toBeUndefined();
    expect(result.content).toHaveLength(1);
  });

  it('should return error for unknown tool name', async () => {
    const result = await executeTool(mockClient, 'nonexistent_tool', {});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Unknown tool: nonexistent_tool');
  });

  it('should catch and return validation errors', async () => {
    const result = await executeTool(mockClient, 'search_dataflows', {
      query: '', // Invalid empty query
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Error:');
  });

  it('should catch and return client method errors', async () => {
    vi.mocked(mockClient.searchDataflows).mockRejectedValue(
      new Error('OECD API error')
    );

    const result = await executeTool(mockClient, 'search_dataflows', {
      query: 'test',
      limit: 10,
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('OECD API error');
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(mockClient.getCategories).mockImplementation(() => {
      throw 'String error'; // Non-Error throw
    });

    const result = await executeTool(mockClient, 'get_categories', {});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe('Error: String error');
  });
});

describe('Integration: Tool definitions and handlers', () => {
  it('should have matching schemas between definitions and handlers', () => {
    TOOL_DEFINITIONS.forEach((tool) => {
      expect(TOOL_HANDLERS).toHaveProperty(tool.name);
      const handler = TOOL_HANDLERS[tool.name];
      expect(typeof handler).toBe('function');
    });
  });

  it('should execute all tools without crashing (smoke test)', async () => {
    const mockClient = createMockClient();

    // Mock all client methods to return dummy data
    vi.mocked(mockClient.searchDataflows).mockResolvedValue([]);
    vi.mocked(mockClient.listDataflows).mockResolvedValue([]);
    vi.mocked(mockClient.getDataStructure).mockResolvedValue({} as any);
    vi.mocked(mockClient.queryData).mockResolvedValue([]);
    vi.mocked(mockClient.getCategories).mockReturnValue([]);
    vi.mocked(mockClient.getPopularDatasets).mockReturnValue([]);
    vi.mocked(mockClient.searchIndicators).mockResolvedValue([]);
    vi.mocked(mockClient.getDataExplorerUrl).mockReturnValue('http://example.com');
    vi.mocked(mockClient.getCategoriesDetailed).mockResolvedValue([]);

    const toolCalls = [
      { name: 'search_dataflows', args: { query: 'test', limit: 10 } },
      { name: 'list_dataflows', args: {} },
      { name: 'get_data_structure', args: { dataflow_id: 'QNA' } },
      { name: 'query_data', args: { dataflow_id: 'QNA' } },
      { name: 'get_categories', args: {} },
      { name: 'get_popular_datasets', args: {} },
      { name: 'search_indicators', args: { indicator: 'GDP' } },
      { name: 'get_dataflow_url', args: { dataflow_id: 'QNA' } },
      { name: 'list_categories_detailed', args: {} },
    ];

    for (const { name, args } of toolCalls) {
      const result = await executeTool(mockClient, name, args);
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content.length).toBeGreaterThan(0);
    }
  });
});
