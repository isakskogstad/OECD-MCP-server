# OECD MCP Server

[![npm version](https://img.shields.io/npm/v/oecd-mcp-server.svg)](https://www.npmjs.com/package/oecd-mcp-server)
[![MCP Registry](https://img.shields.io/badge/MCP-Registry-green.svg)](https://registry.modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Monitoring](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml/badge.svg)](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml)

**MCP server for OECD economic and statistical data via SDMX API.**

OECD MCP Server connects LLMs and AI chatbots to the Organisation for Economic Co-operation and Development's comprehensive statistical database. Access **5,000+ datasets** across **17 categories** including economy, health, education, environment, trade, and more for all OECD member countries and partner economies.

> **What is OECD?** The Organisation for Economic Co-operation and Development (OECD) is an intergovernmental organisation with 38 member countries, founded to stimulate economic progress and world trade. It provides a forum for governments to work together, share experiences and seek solutions to common problems.

---

## Quick Start

### Remote Server (No Installation Required!)

```
https://oecd-mcp-server.onrender.com/mcp
```

See [Client Configuration](#client-configuration) below for how to connect from your AI client.

### Local Installation

**With npx (fastest):**
```bash
npx oecd-mcp-server
```

**With global installation:**
```bash
npm install -g oecd-mcp-server
oecd-mcp-server
```

---

## Client Configuration

### ChatGPT (Developer Mode)

1. Enable **Developer Mode** in ChatGPT Settings → Connectors
2. Click **Create** to create a new connector
3. Enter:
   - **Connector name:** OECD
   - **Description:** OECD economic and statistical data
   - **Connector URL:**
     ```
     https://oecd-mcp-server.onrender.com/mcp
     ```
4. Click **Create**

### Claude Web (claude.ai)

1. Go to **Settings** → **Integrations** (Connectors)
2. Click **Add custom connector**
3. Enter URL:
   ```
   https://oecd-mcp-server.onrender.com/mcp
   ```
4. Click **Add**

### Claude Desktop

Add to configuration file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**With remote server:**
```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/mcp"
    }
  }
}
```

**With npx (local):**
```json
{
  "mcpServers": {
    "oecd": {
      "command": "npx",
      "args": ["-y", "oecd-mcp-server"]
    }
  }
}
```

### Claude Code (CLI)

**With remote server (HTTP):**
```bash
claude mcp add --transport http oecd https://oecd-mcp-server.onrender.com/mcp
```

**With remote server (SSE):**
```bash
claude mcp add --transport sse oecd https://oecd-mcp-server.onrender.com/sse
```

**With npx (local):**
```bash
claude mcp add oecd -- npx -y oecd-mcp-server
```

Verify with:
```bash
claude mcp list
```

### OpenAI Codex CLI

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.oecd]
url = "https://oecd-mcp-server.onrender.com/sse"
```

Or via CLI:
```bash
codex mcp add oecd --url https://oecd-mcp-server.onrender.com/sse
```

### Gemini CLI

Add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/sse"
    }
  }
}
```

Or via CLI:
```bash
gemini mcp add oecd --url https://oecd-mcp-server.onrender.com/sse
```

### Firebase Studio / Android Studio

Add to `mcp.json` in project root:

```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/sse"
    }
  }
}
```

### Other MCP Clients

**SSE transport (e.g., Lovable):**
```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/sse",
      "transport": "sse"
    }
  }
}
```

---

## Features

- **9 MCP Tools** for querying OECD data
- **3 MCP Resources** for browsing categories and datasets
- **3 MCP Prompts** for common analysis patterns
- **5,000+ Datasets** across 17 major categories
- **SDMX-Compliant** - Uses OECD SDMX v2.1 API
- **No Authentication Required** - Public API access
- **Automated Monitoring** - Daily contract tests ensure reliability
- **Multiple Transports** - stdio, HTTP/JSON-RPC, and HTTP/SSE supported

### Transport Methods

The OECD MCP Server supports **three transport protocols** for maximum flexibility:

| Transport | Use Case | Endpoint | Method |
|-----------|----------|----------|--------|
| **stdio** | Local installation (Claude Desktop, CLI) | N/A | Standard input/output |
| **HTTP/JSON-RPC** | Simple synchronous requests (ChatGPT, simple clients) | `/mcp` | POST |
| **HTTP/SSE** | Persistent connections with server-to-client push | `/mcp` | GET |

**Recommended for remote access:**
- **ChatGPT & simple HTTP clients:** Use HTTP/JSON-RPC (POST)
- **Claude Desktop & advanced clients:** Use HTTP/SSE (GET)
- **Local development:** Use stdio with npx

---

## Tools

### Dataset Discovery

| Tool | Description |
|------|-------------|
| `search_dataflows` | Search for OECD datasets by keyword |
| `list_dataflows` | List available dataflows, optionally filtered by category |
| `get_categories` | Get all available OECD data categories |
| `get_popular_datasets` | Get commonly used OECD datasets |
| `search_indicators` | Search for specific economic indicators |
| `list_categories_detailed` | Get all categories with example datasets |

### Data Retrieval

| Tool | Description |
|------|-------------|
| `get_data_structure` | Get metadata and structure of a specific dataset |
| `query_data` | Query actual data from an OECD dataset |
| `get_dataflow_url` | Generate OECD Data Explorer URL for visualization |

---

## OECD Data Categories

The server provides access to **17 main categories** covering all OECD data topics:

| Category | Code | Example Topics | Datasets |
|----------|------|----------------|----------|
| **Economy** | ECO | GDP, inflation, interest rates, forecasts | 500+ |
| **Employment** | JOB | Labour market, unemployment, wages | 300+ |
| **Trade** | TRD | International trade, imports, exports | 250+ |
| **Health** | HEA | Healthcare, life expectancy, health spending | 200+ |
| **Education** | EDU | PISA, education outcomes, spending | 180+ |
| **Environment** | ENV | Climate, emissions, green growth | 150+ |
| **Innovation** | STI | R&D, patents, digital economy, AI | 140+ |
| **Energy** | NRG | Energy production, renewables, prices | 120+ |
| **Taxation** | TAX | Tax revenues, tax rates, tax policy | 100+ |
| **Finance** | FIN | Financial markets, banking, pensions | 95+ |
| **Government** | GOV | Public sector, governance, trust | 90+ |
| **Social** | SOC | Social spending, inequality, quality of life | 85+ |
| **Agriculture** | AGR | Agricultural production, food security | 75+ |
| **Industry** | IND | Industrial production, services | 70+ |
| **Development** | DEV | Development aid, ODA | 60+ |
| **Transport** | TRA | Infrastructure, mobility, freight | 50+ |
| **Regional** | REG | Sub-national data, cities, regions | 45+ |

---

## Popular Datasets

| Dataset | ID | Description |
|---------|-----|-------------|
| **Quarterly National Accounts** | QNA | GDP, consumption, investment by quarter |
| **Main Economic Indicators** | MEI | CPI, unemployment, production indices |
| **Economic Outlook** | EO | Economic projections and forecasts |
| **Health Statistics** | HEALTH_STAT | Healthcare systems and outcomes |
| **PISA Results** | PISA | Education assessment results |
| **Unemployment by Duration** | UN_DEN | Long-term vs short-term unemployment |
| **Green Growth** | GREEN_GROWTH | Environmental and economic indicators |
| **Trade in Services** | CTS | Service sector trade statistics |
| **FDI Statistics** | FDI | Foreign direct investment flows |
| **Revenue Statistics** | REV | Tax revenue by type and level |

---

## Resources

### oecd://categories
List of all OECD data categories with descriptions and dataset counts.

### oecd://dataflows/popular
Popular OECD datasets with IDs, descriptions, and example queries.

### oecd://api/info
Information about the OECD SDMX API endpoints, authentication, and rate limits.

---

## Prompts

### analyze_economic_trend
Analyze economic indicators over time for specific countries.

**Arguments:**
- `indicator` (required): Economic indicator to analyze (e.g., "GDP", "inflation")
- `countries` (required): Comma-separated country codes (e.g., "USA,GBR,DEU")
- `time_period` (optional): Time range (e.g., "2020-2023")

### compare_countries
Compare data across multiple countries for a specific indicator.

**Arguments:**
- `indicator` (required): Indicator to compare (e.g., "GDP per capita")
- `countries` (required): Comma-separated country codes
- `year` (optional): Specific year for comparison

### get_latest_statistics
Get most recent statistics for a topic.

**Arguments:**
- `topic` (required): Topic to query (e.g., "unemployment", "inflation")
- `country` (optional): Country code (e.g., "USA")

---

## Example Usage

### Search and Query GDP Data

```typescript
// 1. Search for GDP datasets
await use_mcp_tool("oecd", "search_dataflows", {
  query: "GDP"
});

// 2. Get data structure
await use_mcp_tool("oecd", "get_data_structure", {
  dataflow_id: "QNA"
});

// 3. Query USA GDP data
await use_mcp_tool("oecd", "query_data", {
  dataflow_id: "QNA",
  filter: "USA.GDP..",
  start_period: "2020-Q1",
  end_period: "2023-Q4"
});
```

### Compare Countries Using Prompts

```typescript
// Compare GDP per capita across countries
await use_mcp_tool("oecd", "compare_countries", {
  indicator: "GDP per capita",
  countries: "USA,GBR,FRA,DEU,JPN",
  year: "2023"
});
```

### Get Latest Unemployment Statistics

```typescript
// Get latest unemployment data for USA
await use_mcp_tool("oecd", "get_latest_statistics", {
  topic: "unemployment",
  country: "USA"
});
```

### Visualize Data in OECD Explorer

```typescript
// Get direct link to OECD Data Explorer
await use_mcp_tool("oecd", "get_dataflow_url", {
  dataflow_id: "QNA",
  filter: "USA.GDP.."
});
// Returns: https://data-explorer.oecd.org/...
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Renders this README as HTML |
| `/mcp` | GET/POST | Standard MCP protocol (recommended) |
| `/sse` | GET | Server-Sent Events transport |
| `/rpc` | POST | JSON-RPC endpoint |
| `/health` | GET | Health check endpoint |

---

## Development

### Project Structure

```
oecd-mcp-server/
├── src/
│   ├── index.ts          # MCP server (stdio transport)
│   ├── http-server.ts    # HTTP server for cloud deployment
│   ├── sdmx-client.ts    # OECD SDMX API client
│   ├── oecd-client.ts    # High-level OECD client
│   ├── known-dataflows.ts # Curated dataset list
│   └── types.ts          # TypeScript type definitions
├── tests/
│   └── contract/
│       └── api-contract.test.ts  # API contract tests
├── .github/
│   └── workflows/
│       └── api-monitoring.yml    # Daily API monitoring
├── dist/                 # Compiled JavaScript
├── Dockerfile           # Docker configuration
├── render.yaml          # Render deployment config
├── package.json
├── tsconfig.json
└── README.md
```

### Running Tests

```bash
# Run all tests
npm test

# Run contract tests
npm test tests/contract/api-contract.test.ts

# Build project
npm run build
```

### Development Mode

```bash
npm run dev  # Watch mode with auto-rebuild
```

---

## Automated Monitoring

The server includes automated API monitoring via GitHub Actions:

- **Daily contract tests** verify API availability and data structure
- **Automatic issue creation** when OECD API changes break compatibility
- **Automatic issue closure** when tests pass again
- **Manual workflow trigger** for on-demand testing

[![API Monitoring](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml/badge.svg)](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml)

---

## Deployment

### Render Deployment

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Deploy on Render**:
   - Render automatically detects `render.yaml` and deploys
   - Health check: `https://oecd-mcp-server.onrender.com/health`
   - MCP endpoint: `https://oecd-mcp-server.onrender.com/mcp`

### Docker Deployment

```bash
# Build image
docker build -t oecd-mcp-server .

# Run container
docker run -p 3000:3000 oecd-mcp-server

# Check health
curl http://localhost:3000/health
```

---

## Troubleshooting

### OECD API Returns No Data
- Verify the dataflow ID is correct using `search_dataflows`
- Check filter syntax matches SDMX conventions
- Ensure time period is valid for the dataset
- Use `get_data_structure` first to understand dimensions

### Connection Issues
- Verify internet connectivity
- Check OECD API status: https://sdmx.oecd.org/public/rest/
- Review GitHub Actions for API monitoring status
- Check server logs for detailed error messages

### Structure Parsing Errors
- SDMX structure varies by dataset
- Some datasets use non-standard formats
- Check contract tests for known working examples
- Review raw API response for debugging

---

## Contributing

Contributions are welcome! Areas for improvement:

- **More Datasets**: Add verified dataflows to `src/known-dataflows.ts`
- **Better Documentation**: Examples, use cases, tutorials
- **Enhanced Tools**: Additional analysis capabilities
- **Bug Fixes**: Report and fix issues
- **Tests**: Expand test coverage

Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## About OECD

The [Organisation for Economic Co-operation and Development (OECD)](https://www.oecd.org/) is an international organisation of 38 countries committed to democracy and the market economy. The OECD provides a forum for governments to work together, share experiences and seek solutions to common problems.

**Member Countries (38):**
Australia, Austria, Belgium, Canada, Chile, Colombia, Costa Rica, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Ireland, Israel, Italy, Japan, Korea, Latvia, Lithuania, Luxembourg, Mexico, Netherlands, New Zealand, Norway, Poland, Portugal, Slovak Republic, Slovenia, Spain, Sweden, Switzerland, Turkey, United Kingdom, United States

**Partner Economies:**
Brazil, China, India, Indonesia, South Africa

---

## API Information

- **Base URL**: https://sdmx.oecd.org/public/rest/
- **Format**: SDMX-JSON v2.1 (Statistical Data and Metadata eXchange)
- **Authentication**: None required (public API)
- **Rate Limiting**: Please be respectful with API usage
- **Documentation**: https://data.oecd.org/
- **SDMX Standard**: https://sdmx.org/
- **Migration**: Legacy OECD.Stat APIs deprecated June 2024

---

## License

MIT License - See [LICENSE](LICENSE) file for details

Created by Isak Skogstad

---

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- Data provided by [OECD](https://www.oecd.org/)
- Uses the [SDMX standard](https://sdmx.org/) for statistical data exchange
- Inspired by other open data MCP servers

---

## Support

- **Issues**: [GitHub Issues](https://github.com/isakskogstad/OECD-MCP-server/issues)
- **OECD Data Portal**: https://data.oecd.org/
- **SDMX Documentation**: https://sdmx.org/
- **MCP Documentation**: https://modelcontextprotocol.io/
- **npm Package**: https://www.npmjs.com/package/oecd-mcp-server
