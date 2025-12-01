#!/usr/bin/env node

/**
 * OECD MCP Server - stdio transport
 * Provides access to OECD statistical data via SDMX API
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { OECDClient } from './oecd-client.js';
import { TOOL_DEFINITIONS, executeTool } from './tools.js';

const client = new OECDClient();

// Create MCP server
const server = new Server(
  {
    name: 'oecd-mcp-server',
    version: '3.0.2',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// ========== TOOLS ==========

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOL_DEFINITIONS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return await executeTool(client, name, args);
});

// ========== RESOURCES ==========

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'oecd://categories',
        name: 'OECD Data Categories',
        description: 'List of all 17 OECD data categories with descriptions',
        mimeType: 'application/json',
      },
      {
        uri: 'oecd://dataflows/popular',
        name: 'Popular OECD Datasets',
        description: 'Curated list of commonly used OECD datasets',
        mimeType: 'application/json',
      },
      {
        uri: 'oecd://api/info',
        name: 'OECD API Information',
        description: 'Information about the OECD SDMX API endpoints and usage',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'oecd://categories': {
      const categories = client.getCategories();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(categories, null, 2),
          },
        ],
      };
    }

    case 'oecd://dataflows/popular': {
      const popular = client.getPopularDatasets();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(popular, null, 2),
          },
        ],
      };
    }

    case 'oecd://api/info': {
      const info = client.getApiInfo();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(info, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ========== PROMPTS ==========

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'analyze_economic_trend',
        description: 'Analyze economic indicators over time for specified countries',
        arguments: [
          {
            name: 'indicator',
            description: 'Economic indicator to analyze (e.g., "GDP", "inflation", "unemployment")',
            required: true,
          },
          {
            name: 'countries',
            description: 'Comma-separated list of country codes (e.g., "USA,GBR,DEU")',
            required: true,
          },
          {
            name: 'time_period',
            description: 'Time period for analysis (e.g., "2020-2023")',
            required: false,
          },
        ],
      },
      {
        name: 'compare_countries',
        description: 'Compare data across multiple countries for a specific indicator',
        arguments: [
          {
            name: 'indicator',
            description: 'Indicator to compare (e.g., "GDP per capita", "life expectancy")',
            required: true,
          },
          {
            name: 'countries',
            description: 'Comma-separated list of countries to compare',
            required: true,
          },
          {
            name: 'year',
            description: 'Year for comparison (optional)',
            required: false,
          },
        ],
      },
      {
        name: 'get_latest_statistics',
        description: 'Get the most recent statistics for a specific topic',
        arguments: [
          {
            name: 'topic',
            description: 'Topic to get statistics for (e.g., "unemployment", "inflation", "GDP growth")',
            required: true,
          },
          {
            name: 'country',
            description: 'Country code (optional, returns data for all countries if not specified)',
            required: false,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'analyze_economic_trend': {
      const { indicator, countries, time_period } = args as {
        indicator: string;
        countries: string;
        time_period?: string;
      };

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Analyze the ${indicator} trend for ${countries}${time_period ? ` during ${time_period}` : ''}.

Steps:
1. Search for relevant OECD datasets containing ${indicator} data
2. Get the data structure to understand available dimensions
3. Query the data for the specified countries and time period
4. Analyze trends, compare countries, and highlight key insights
5. Provide a summary with visualizable data if possible`,
            },
          },
        ],
      };
    }

    case 'compare_countries': {
      const { indicator, countries, year } = args as {
        indicator: string;
        countries: string;
        year?: string;
      };

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Compare ${indicator} across ${countries}${year ? ` for the year ${year}` : ''}.

Steps:
1. Search for OECD datasets containing ${indicator}
2. Query data for all specified countries
3. Compare values and rankings
4. Highlight differences and similarities
5. Provide context about what the differences might indicate`,
            },
          },
        ],
      };
    }

    case 'get_latest_statistics': {
      const { topic, country } = args as { topic: string; country?: string };

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Get the latest ${topic} statistics${country ? ` for ${country}` : ' for all OECD countries'}.

Steps:
1. Search for datasets related to ${topic}
2. Identify the most relevant and recent dataset
3. Query the latest available data
4. Present key statistics and recent trends
5. Highlight any notable changes or patterns`,
            },
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('OECD MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
