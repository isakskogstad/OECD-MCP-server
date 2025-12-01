# OECD MCP Server

## Overview
Model Context Protocol (MCP) server providing access to OECD statistical data via SDMX API. Enables AI assistants to query 5,000+ datasets across 17 categories including economy, health, education, environment, trade, and more.

**All data is fetched directly from OECD API - no caching or storage.**

## Tech Stack
- **Runtime:** Node.js 20 (TypeScript)
- **Framework:** Express.js
- **MCP SDK:** @modelcontextprotocol/sdk ^1.0.0
- **Transport:** SSE (Server-Sent Events) over HTTP + HTTP/JSON-RPC
- **Testing:** Vitest
- **Deployment:** Docker + Render (free tier)

## Project Structure
- `src/` - Source code
  - `http-server.ts` - Main HTTP server with SSE transport
  - `index.ts` - STDIO transport for local usage
  - `oecd-client.ts` - High-level OECD client
  - `sdmx-client.ts` - OECD SDMX API client
  - `tools.ts` - MCP tool definitions and execution
  - `types.ts` - TypeScript type definitions
  - `validation.ts` - Input validation
  - `known-dataflows.ts` - Known dataflow metadata
- `tests/` - Test files
- `Dockerfile` - Container configuration
- `render.yaml` - Render deployment config
- `server.json` - MCP Registry metadata
- `backups/` - Automatic backups (session-start, session-end, changes)

## MCP Capabilities
**Tools (9):**
- search_dataflows - Search datasets by keyword
- list_dataflows - Browse datasets by category
- get_data_structure - Get dataset metadata
- query_data - Query statistical data
- get_categories - List all 17 categories
- get_popular_datasets - Curated dataset list
- search_indicators - Search by indicator
- get_dataflow_url - Generate Data Explorer URL
- list_categories_detailed - Detailed category info

**Resources (3):**
- oecd://categories - Category list
- oecd://dataflows/popular - Popular datasets
- oecd://api/info - API information

**Prompts (3):**
- analyze_economic_trend
- compare_countries
- get_latest_statistics

## Deployment Info
- **Render URL:** https://oecd-mcp-server.onrender.com
- **MCP Endpoints:**
  - POST /mcp (HTTP/JSON-RPC - recommended)
  - GET /mcp (SSE - legacy)
- **Health Check:** GET /health
- **Plan:** Free tier (cold starts after inactivity)
- **Region:** Frankfurt

## MCP Registry Publishing
- **Server Name:** io.github.isakskogstad/oecd-mcp
- **npm Package:** oecd-mcp
- **Version:** 4.0.0
- **Status:** Active in MCP Registry & npm
- **Deployment Type:** Remote + npm package
- **Registry URL:** https://registry.modelcontextprotocol.io/v0/servers?search=io.github.isakskogstad/oecd-mcp
- **npm URL:** https://www.npmjs.com/package/oecd-mcp

**Available via:**
- npm package: `npx oecd-mcp`
- Streamable HTTP: https://oecd-mcp-server.onrender.com/mcp
- SSE (legacy): https://oecd-mcp-server.onrender.com/sse

## Architecture (v4.0.0)
**Direct API Only - No Caching/Storage**

All requests go directly to OECD SDMX API:
```
Client Request → MCP Server → OECD SDMX API → Response
```

Benefits:
- Simpler architecture
- No external dependencies (no Supabase)
- Always fresh data
- Lower operational complexity

## Build Commands
```bash
npm run build       # Compile TypeScript
npm start           # Start HTTP server
npm run start:stdio # Start STDIO server (local)
npm test            # Run tests
```

## Environment
- NODE_ENV=production
- PORT=3000

## Backup Info
- Last session backup: 2025-12-01_15-00-00_session-start
- Backup retention policy: Manual cleanup

## Changelog
### v4.0.0 (2025-12-01)
- **BREAKING:** Removed Supabase integration completely
- All data now fetched directly from OECD API
- Simplified architecture - no external dependencies
- Removed: supabase-cache.ts, Supabase SDK, all cache-related code

### v3.0.x
- Initial Supabase cache integration (removed in v4.0.0)

## Notes
- Server responds in ~100-150ms when warm
- Cold starts on free tier take 30-60 seconds
- For reliable performance, consider paid Render plan or local deployment
