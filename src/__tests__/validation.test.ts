/**
 * Unit tests for Zod validation schemas
 * Tests runtime validation for all MCP tool inputs
 */

import { describe, it, expect } from 'vitest';
import {
  SearchDataflowsSchema,
  ListDataflowsSchema,
  GetDataStructureSchema,
  QueryDataSchema,
  SearchIndicatorsSchema,
  GetDataflowUrlSchema,
  validateInput,
} from '../validation.js';

describe('SearchDataflowsSchema', () => {
  it('should validate correct input', () => {
    const valid = { query: 'GDP', limit: 20 };
    const result = SearchDataflowsSchema.parse(valid);
    expect(result).toEqual(valid);
  });

  it('should apply default limit of 20', () => {
    const input = { query: 'inflation' };
    const result = SearchDataflowsSchema.parse(input);
    expect(result.limit).toBe(20);
  });

  it('should reject empty query', () => {
    expect(() => SearchDataflowsSchema.parse({ query: '' }))
      .toThrow('Search query must not be empty');
  });

  it('should reject query > 100 characters', () => {
    expect(() => SearchDataflowsSchema.parse({ query: 'a'.repeat(101) }))
      .toThrow('Search query must not exceed 100 characters');
  });

  it('should reject limit < 1', () => {
    expect(() => SearchDataflowsSchema.parse({ query: 'test', limit: 0 }))
      .toThrow('Limit must be at least 1');
  });

  it('should reject limit > 100', () => {
    expect(() => SearchDataflowsSchema.parse({ query: 'test', limit: 101 }))
      .toThrow('Limit cannot exceed 100');
  });

  it('should reject non-integer limit', () => {
    expect(() => SearchDataflowsSchema.parse({ query: 'test', limit: 3.14 }))
      .toThrow('Limit must be an integer');
  });
});

describe('ListDataflowsSchema', () => {
  it('should validate with valid category', () => {
    const valid = { category: 'ECO' as const, limit: 50 };
    const result = ListDataflowsSchema.parse(valid);
    expect(result).toEqual(valid);
  });

  it('should validate without category', () => {
    const result = ListDataflowsSchema.parse({});
    expect(result.limit).toBe(50); // default
    expect(result.category).toBeUndefined();
  });

  it('should apply default limit of 50', () => {
    const result = ListDataflowsSchema.parse({ category: 'HEA' });
    expect(result.limit).toBe(50);
  });

  it('should reject invalid category', () => {
    expect(() => ListDataflowsSchema.parse({ category: 'INVALID' }))
      .toThrow();
  });

  it('should accept all valid categories', () => {
    const categories = ['ECO', 'HEA', 'EDU', 'ENV', 'TRD', 'JOB', 'NRG', 'AGR',
      'GOV', 'SOC', 'DEV', 'STI', 'TAX', 'FIN', 'TRA', 'IND', 'REG'];

    categories.forEach(cat => {
      expect(() => ListDataflowsSchema.parse({ category: cat })).not.toThrow();
    });
  });
});

describe('GetDataStructureSchema', () => {
  it('should validate correct dataflow ID', () => {
    const valid = { dataflow_id: 'QNA' };
    const result = GetDataStructureSchema.parse(valid);
    expect(result).toEqual(valid);
  });

  it('should accept dataflow ID with underscores', () => {
    const valid = { dataflow_id: 'HEALTH_STAT' };
    expect(() => GetDataStructureSchema.parse(valid)).not.toThrow();
  });

  it('should accept dataflow ID with numbers', () => {
    const valid = { dataflow_id: 'PDB_LV123' };
    expect(() => GetDataStructureSchema.parse(valid)).not.toThrow();
  });

  it('should reject empty dataflow ID', () => {
    expect(() => GetDataStructureSchema.parse({ dataflow_id: '' }))
      .toThrow('Dataflow ID must not be empty');
  });

  it('should reject dataflow ID > 50 characters', () => {
    expect(() => GetDataStructureSchema.parse({ dataflow_id: 'A'.repeat(51) }))
      .toThrow('Dataflow ID must not exceed 50 characters');
  });

  it('should reject lowercase dataflow ID', () => {
    expect(() => GetDataStructureSchema.parse({ dataflow_id: 'qna' }))
      .toThrow('Dataflow ID must contain only uppercase letters');
  });

  it('should reject dataflow ID with special characters', () => {
    expect(() => GetDataStructureSchema.parse({ dataflow_id: 'QNA-TEST' }))
      .toThrow('Dataflow ID must contain only uppercase letters');
  });
});

describe('QueryDataSchema', () => {
  it('should validate correct query data', () => {
    const valid = {
      dataflow_id: 'QNA',
      filter: 'USA.GDP..',
      start_period: '2020',
      end_period: '2023',
      last_n_observations: 100,
    };
    const result = QueryDataSchema.parse(valid);
    expect(result).toEqual(valid);
  });

  it('should validate quarterly period format', () => {
    const valid = {
      dataflow_id: 'QNA',
      start_period: '2020-Q1',
      end_period: '2023-Q4',
    };
    expect(() => QueryDataSchema.parse(valid)).not.toThrow();
  });

  it('should validate monthly period format', () => {
    const valid = {
      dataflow_id: 'MEI',
      start_period: '2020-01',
      end_period: '2023-12',
    };
    expect(() => QueryDataSchema.parse(valid)).not.toThrow();
  });

  it('should reject invalid period format', () => {
    expect(() => QueryDataSchema.parse({
      dataflow_id: 'QNA',
      start_period: '20-Q1', // invalid year
    })).toThrow('Invalid period format');
  });

  it('should reject period with invalid quarter', () => {
    expect(() => QueryDataSchema.parse({
      dataflow_id: 'QNA',
      start_period: '2020-Q5', // Q5 doesn't exist
    })).toThrow('Invalid period format');
  });

  it('should reject period with invalid month', () => {
    expect(() => QueryDataSchema.parse({
      dataflow_id: 'MEI',
      end_period: '2020-13', // month 13 doesn't exist
    })).toThrow('Invalid period format');
  });

  it('should accept observations limit up to 1000', () => {
    const valid = { dataflow_id: 'QNA', last_n_observations: 1000 };
    expect(() => QueryDataSchema.parse(valid)).not.toThrow();
  });

  it('should reject observations limit > 1000 (context protection)', () => {
    expect(() => QueryDataSchema.parse({
      dataflow_id: 'QNA',
      last_n_observations: 1001,
    })).toThrow('Observations limit cannot exceed 1000');
  });

  it('should reject observations limit < 1', () => {
    expect(() => QueryDataSchema.parse({
      dataflow_id: 'QNA',
      last_n_observations: 0,
    })).toThrow('Observations limit must be at least 1');
  });

  it('should reject non-integer observations limit', () => {
    expect(() => QueryDataSchema.parse({
      dataflow_id: 'QNA',
      last_n_observations: 99.5,
    })).toThrow('Observations limit must be an integer');
  });

  it('should reject filter > 200 characters', () => {
    expect(() => QueryDataSchema.parse({
      dataflow_id: 'QNA',
      filter: 'X'.repeat(201),
    })).toThrow('Filter must not exceed 200 characters');
  });
});

describe('SearchIndicatorsSchema', () => {
  it('should validate correct indicator search', () => {
    const valid = { indicator: 'GDP', category: 'ECO' as const };
    const result = SearchIndicatorsSchema.parse(valid);
    expect(result).toEqual(valid);
  });

  it('should validate without category', () => {
    const result = SearchIndicatorsSchema.parse({ indicator: 'inflation' });
    expect(result.indicator).toBe('inflation');
    expect(result.category).toBeUndefined();
  });

  it('should reject empty indicator', () => {
    expect(() => SearchIndicatorsSchema.parse({ indicator: '' }))
      .toThrow('Indicator search term must not be empty');
  });

  it('should reject indicator > 100 characters', () => {
    expect(() => SearchIndicatorsSchema.parse({ indicator: 'A'.repeat(101) }))
      .toThrow('Indicator search term must not exceed 100 characters');
  });
});

describe('GetDataflowUrlSchema', () => {
  it('should validate correct dataflow URL request', () => {
    const valid = { dataflow_id: 'QNA', filter: 'USA.GDP..' };
    const result = GetDataflowUrlSchema.parse(valid);
    expect(result).toEqual(valid);
  });

  it('should validate without filter', () => {
    const result = GetDataflowUrlSchema.parse({ dataflow_id: 'MEI' });
    expect(result.dataflow_id).toBe('MEI');
    expect(result.filter).toBeUndefined();
  });

  it('should reject invalid dataflow ID format', () => {
    expect(() => GetDataflowUrlSchema.parse({ dataflow_id: 'invalid-id' }))
      .toThrow('Dataflow ID must contain only uppercase letters');
  });
});

describe('validateInput helper', () => {
  it('should return validated data for valid input', () => {
    const input = { query: 'test', limit: 10 };
    const result = validateInput(SearchDataflowsSchema, input, 'search_dataflows');
    expect(result).toEqual(input);
  });

  it('should throw descriptive error with tool name', () => {
    try {
      validateInput(SearchDataflowsSchema, { query: '' }, 'search_dataflows');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('Invalid input for tool "search_dataflows"');
      expect((error as Error).message).toContain('query');
    }
  });

  it('should handle multiple validation errors', () => {
    try {
      validateInput(
        SearchDataflowsSchema,
        { query: '', limit: 0 },
        'search_dataflows'
      );
      expect.fail('Should have thrown error');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('search_dataflows');
      // Should mention both validation errors
    }
  });

  it('should preserve error type for unexpected errors', () => {
    const badSchema = { parse: () => { throw new TypeError('Unexpected'); } };
    expect(() => validateInput(badSchema as any, {}, 'test'))
      .toThrow(TypeError);
  });
});

describe('Edge cases and boundary conditions', () => {
  it('should handle exact boundary values for limits', () => {
    // SearchDataflows: limit 1-100
    expect(() => SearchDataflowsSchema.parse({ query: 'test', limit: 1 })).not.toThrow();
    expect(() => SearchDataflowsSchema.parse({ query: 'test', limit: 100 })).not.toThrow();

    // QueryData: observations 1-1000
    expect(() => QueryDataSchema.parse({ dataflow_id: 'QNA', last_n_observations: 1 })).not.toThrow();
    expect(() => QueryDataSchema.parse({ dataflow_id: 'QNA', last_n_observations: 1000 })).not.toThrow();
  });

  it('should handle exact boundary values for string lengths', () => {
    // Query: 1-100 chars
    expect(() => SearchDataflowsSchema.parse({ query: 'a' })).not.toThrow();
    expect(() => SearchDataflowsSchema.parse({ query: 'a'.repeat(100) })).not.toThrow();

    // Dataflow ID: 1-50 chars
    expect(() => GetDataStructureSchema.parse({ dataflow_id: 'A' })).not.toThrow();
    expect(() => GetDataStructureSchema.parse({ dataflow_id: 'A'.repeat(50) })).not.toThrow();
  });

  it('should handle optional parameters correctly', () => {
    // All optional fields undefined
    const minimal = QueryDataSchema.parse({ dataflow_id: 'QNA' });
    expect(minimal.filter).toBeUndefined();
    expect(minimal.start_period).toBeUndefined();
    expect(minimal.end_period).toBeUndefined();
    expect(minimal.last_n_observations).toBeUndefined();
  });
});
