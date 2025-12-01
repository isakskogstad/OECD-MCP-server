<div align="right">

**🇸🇪 Svenska** | [![🇬🇧 English](https://img.shields.io/badge/🇬🇧-English-blue)](README.md)

</div>

# OECD MCP Server

[![npm version](https://img.shields.io/npm/v/oecd-mcp.svg)](https://www.npmjs.com/package/oecd-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP-Registry-green.svg)](https://registry.modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Monitoring](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml/badge.svg)](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml)

**MCP-server för OECD ekonomisk och statistisk data via SDMX API.**

OECD MCP Server kopplar LLM:er och AI-chatbottar till Organisationen för ekonomiskt samarbete och utvecklings (OECD) omfattande statistikdatabas. Tillgång till **5 000+ dataset** över **17 kategorier** inklusive ekonomi, hälsa, utbildning, miljö, handel, och mycket mer för alla OECD-medlemsländer och partnerländer.

> **Vad är OECD?** Organisationen för ekonomiskt samarbete och utveckling (OECD) är en mellanstatlig organisation med 38 medlemsländer, grundad för att stimulera ekonomisk utveckling och världshandel. Den tillhandahåller ett forum för regeringar att samarbeta, dela erfarenheter och söka lösningar på gemensamma problem.

---

## Snabbstart

### 🌐 Fjärrserver (Ingen Installation Krävs!)

Det enklaste sättet att komma igång - använd bara denna URL i vilken MCP-kompatibel klient som helst:

```
https://oecd-mcp-server.onrender.com/mcp
```

**Fungerar direkt med:**
- ChatGPT (Developer Mode)
- Claude Web (claude.ai)
- VS Code (GitHub Copilot)
- Cursor AI
- Och 400+ andra MCP-klienter

Se [Klientkonfiguration](#klientkonfiguration) nedan för specifika installationsinstruktioner.

### 💻 Lokal Installation

**Snabbstart med npx (rekommenderas):**
```bash
npx oecd-mcp
```

**Global installation:**
```bash
npm install -g oecd-mcp
oecd-mcp
```

**Krav:**
- Node.js >= 18.0.0
- npm eller npx

---

## Klientkonfiguration

### Anthropic-produkter

#### Claude Web (claude.ai)

**Tillgänglig på:** Pro-, Max-, Team- och Enterprise-planer

**Installation:**
1. Gå till **Inställningar** → **Integrationer** (Connectors)
2. Klicka på **Lägg till anpassad connector**
3. Ange URL:
   ```
   https://oecd-mcp-server.onrender.com/mcp
   ```
4. Klicka på **Lägg till**

**Det är allt!** OECD MCP-servern är nu tillgänglig i dina Claude Web-konversationer.

#### Claude Desktop

**Konfigurationsfilsplatser:**
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Metod 1: Fjärrserver (rekommenderas)**

Lägg till detta i din konfigurationsfil:
```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/mcp"
    }
  }
}
```

**Metod 2: Lokal Installation (via npx)**

```json
{
  "mcpServers": {
    "oecd": {
      "command": "npx",
      "args": ["-y", "oecd-mcp"]
    }
  }
}
```

**Efter konfiguration:**
- Starta om Claude Desktop
- Leta efter hammarikonen (🔨) i nedre högra hörnet
- OECD MCP-serververktygen är nu tillgängliga!

#### Claude Code (CLI)

**Fjärrserver - HTTP Transport (rekommenderas):**
```bash
claude mcp add --transport http oecd https://oecd-mcp-server.onrender.com/mcp
```

**Fjärrserver - SSE Transport (legacy):**
```bash
claude mcp add --transport sse oecd https://oecd-mcp-server.onrender.com/sse
```

**Lokal Installation:**
```bash
claude mcp add oecd -- npx -y oecd-mcp
```

**Verifiera installation:**
```bash
claude mcp list
```

**Vanliga kommandon:**
```bash
# Ta bort server
claude mcp remove oecd

# Felsökningsläge
claude --mcp-debug
```

---

### OpenAI-produkter

#### ChatGPT (Developer Mode)

**Tillgänglig på:** Plus- och Pro-användare (webb), Business- och Enterprise-användare (med admin-godkännande)

**Installation:**
1. Öppna ChatGPT Inställningar → **Connectors** → **Advanced**
2. Aktivera **Developer Mode**
3. Klicka på **Create** för att skapa en ny connector
4. Ange:
   - **Connector name:** OECD Statistics
   - **Description:** OECD ekonomisk och statistisk data - 5 000+ dataset
   - **Connector URL:**
     ```
     https://oecd-mcp-server.onrender.com/mcp
     ```
5. Klicka på **Create**

**Obs:** ChatGPT kan inte ansluta till localhost-servrar. För lokal utveckling, använd en tunneltjänst som ngrok.

**Stödda transporter:**
- ✅ HTTP/Streamable (rekommenderas)
- ✅ SSE (legacy-support)

#### OpenAI Codex CLI

**Konfigurationsfil:** `~/.codex/config.toml`

**Lägg till OECD MCP-server:**
```toml
[mcp_servers.oecd]
url = "https://oecd-mcp-server.onrender.com/sse"
```

**Eller via CLI:**
```bash
codex mcp add oecd --url https://oecd-mcp-server.onrender.com/sse
```

---

### Google-produkter

#### Gemini / Google AI Studio

Google AI Studio har ännu inte direkt MCP-klientstöd, men du kan använda MCP-servrar som verktyg via:

**Community MCP-servrar:**
- [eternnoir/aistudio-mcp-server](https://github.com/eternnoir/aistudio-mcp-server) - Gemini API-integration för MCP
- [bsmi021/mcp-gemini-server](https://github.com/bsmi021/mcp-gemini-server) - Omsluter Google Generative AI SDK

**Installation (för användning med andra MCP-klienter):**
```bash
npx -y aistudio-mcp-server
```

**Miljövariabel krävs:**
```bash
export GEMINI_API_KEY="din-api-nyckel"
```

#### Gemini CLI (Inofficiell)

**Konfigurationsfil:** `~/.gemini/settings.json`

**Lägg till OECD MCP-server:**
```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/sse"
    }
  }
}
```

**Eller via CLI:**
```bash
gemini mcp add oecd --url https://oecd-mcp-server.onrender.com/sse
```

---

### Microsoft-produkter

#### VS Code med GitHub Copilot

**Krav:**
- VS Code >= 1.102 (för MCP-stöd)
- GitHub Copilot-prenumeration

**Installation:**
1. Öppna VS Code **Inställningar** → **Tillägg** → **MCP**
2. Klicka på **Lägg till MCP-server**
3. Välj konfigurationsmetod:

**Metod 1: Fjärrserver**
```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/mcp",
      "transport": "http"
    }
  }
}
```

**Metod 2: Lokal Installation**
```json
{
  "mcpServers": {
    "oecd": {
      "command": "npx",
      "args": ["-y", "oecd-mcp"]
    }
  }
}
```

**Enterprise-användare:** Administratörer kan aktivera/avaktivera MCP med policyn "MCP servers in Copilot" (avaktiverad som standard).

**Efter konfiguration:**
- Starta om VS Code
- GitHub Copilot kan nu komma åt OECD statistisk data
- Använd naturligt språk för att fråga dataset: "Visa BNP-data för USA från 2020-2023"

---

### Andra Populära Klienter

#### Cursor AI

**Konfigurationsfilsplatser:**
- **Global:** `~/.cursor/mcp.json`
- **Projektspecifik:** `.cursor/mcp.json` (i projektets rot)

**Installation via UI:**
1. Öppna Cursor Inställningar → **MCP**
2. Klicka på **Lägg till ny global MCP-server**

**Fjärrserverkonfiguration:**
```json
{
  "mcpServers": {
    "oecd": {
      "command": "npx",
      "args": ["-y", "oecd-mcp"]
    }
  }
}
```

**Stödjer:** STDIO och Streamable HTTP-transporter

#### Lovable.dev

**För SSE-transport:**
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

#### Firebase Studio / Android Studio

**Konfigurationsfil:** `mcp.json` i projektets rot

```json
{
  "mcpServers": {
    "oecd": {
      "url": "https://oecd-mcp-server.onrender.com/sse"
    }
  }
}
```

---

## Funktioner

- **9 MCP-verktyg** för att fråga OECD-data
- **3 MCP-resurser** för att bläddra bland kategorier och dataset
- **3 MCP-prompts** för vanliga analysmönster
- **5 000+ dataset** över 17 huvudkategorier
- **SDMX-kompatibel** - Använder OECD SDMX v2.1 API
- **Ingen Autentisering Krävs** - Offentlig API-åtkomst
- **Automatiserad Övervakning** - Dagliga kontraktstester säkerställer tillförlitlighet
- **Flera Transporter** - stdio, HTTP/JSON-RPC, och HTTP/SSE stöds

### Transportmetoder

OECD MCP Server stödjer **tre transportprotokoll** för maximal flexibilitet:

| Transport | Användningsfall | Endpoint | Metod |
|-----------|----------------|----------|-------|
| **stdio** | Lokal installation (Claude Desktop, CLI) | Ej tillämpligt | Standard input/output |
| **HTTP/JSON-RPC** | Enkla synkrona förfrågningar (ChatGPT, enkla klienter) | `/mcp` | POST |
| **HTTP/SSE** | Permanenta anslutningar med server-till-klient push | `/mcp` | GET |

**Rekommenderas för fjärråtkomst:**
- **ChatGPT & enkla HTTP-klienter:** Använd HTTP/JSON-RPC (POST)
- **Claude Desktop & avancerade klienter:** Använd HTTP/SSE (GET)
- **Lokal utveckling:** Använd stdio med npx

---

## Verktyg

### Dataset-upptäckt

| Verktyg | Beskrivning |
|---------|-------------|
| `search_dataflows` | Sök efter OECD-dataset med nyckelord |
| `list_dataflows` | Lista tillgängliga dataflöden, valfritt filtrerat efter kategori |
| `get_categories` | Hämta alla tillgängliga OECD-datakategorier |
| `get_popular_datasets` | Hämta vanligt använda OECD-dataset |
| `search_indicators` | Sök efter specifika ekonomiska indikatorer |
| `list_categories_detailed` | Hämta alla kategorier med exempeldataset |

### Datahämtning

| Verktyg | Beskrivning |
|---------|-------------|
| `get_data_structure` | Hämta metadata och struktur för ett specifikt dataset |
| `query_data` | Fråga faktisk data från ett OECD-dataset |
| `get_dataflow_url` | Generera OECD Data Explorer URL för visualisering |

---

## OECD-datakategorier

Servern ger tillgång till **17 huvudkategorier** som täcker alla OECD-dataområden:

| Kategori | Kod | Exempelämnen | Dataset |
|----------|-----|--------------|---------|
| **Ekonomi** | ECO | BNP, inflation, räntor, prognoser | 500+ |
| **Sysselsättning** | JOB | Arbetsmarknad, arbetslöshet, löner | 300+ |
| **Handel** | TRD | Internationell handel, import, export | 250+ |
| **Hälsa** | HEA | Sjukvård, livslängd, hälsoutgifter | 200+ |
| **Utbildning** | EDU | PISA, utbildningsresultat, utgifter | 180+ |
| **Miljö** | ENV | Klimat, utsläpp, grön tillväxt | 150+ |
| **Innovation** | STI | FoU, patent, digital ekonomi, AI | 140+ |
| **Energi** | NRG | Energiproduktion, förnybar energi, priser | 120+ |
| **Beskattning** | TAX | Skatteintäkter, skattesatser, skattepolitik | 100+ |
| **Finans** | FIN | Finansmarknader, bankväsen, pensioner | 95+ |
| **Förvaltning** | GOV | Offentlig sektor, styrning, förtroende | 90+ |
| **Socialt** | SOC | Sociala utgifter, ojämlikhet, livskvalitet | 85+ |
| **Jordbruk** | AGR | Jordbruksproduktion, livsmedelstrygghet | 75+ |
| **Industri** | IND | Industriproduktion, tjänster | 70+ |
| **Utveckling** | DEV | Utvecklingsbistånd, ODA | 60+ |
| **Transport** | TRA | Infrastruktur, mobilitet, frakt | 50+ |
| **Regional** | REG | Sub-nationell data, städer, regioner | 45+ |

---

## Populära Dataset

| Dataset | ID | Beskrivning |
|---------|-----|-------------|
| **Kvartalsvis Nationalräkenskaper** | QNA | BNP, konsumtion, investeringar per kvartal |
| **Huvudsakliga Ekonomiska Indikatorer** | MEI | KPI, arbetslöshet, produktionsindex |
| **Ekonomisk Prognos** | EO | Ekonomiska projektioner och prognoser |
| **Hälsostatistik** | HEALTH_STAT | Sjukvårdssystem och resultat |
| **PISA-resultat** | PISA | Utbildningsbedömningsresultat |
| **Arbetslöshet efter Varaktighet** | UN_DEN | Långtidsarbetslöshet vs korttidsarbetslöshet |
| **Grön Tillväxt** | GREEN_GROWTH | Miljö- och ekonomiska indikatorer |
| **Handel med Tjänster** | CTS | Tjänstesektorshandelsstatistik |
| **FDI-statistik** | FDI | Utländska direktinvesteringsflöden |
| **Skatteintäktsstatistik** | REV | Skatteintäkter efter typ och nivå |

---

## Resurser

### oecd://categories
Lista över alla OECD-datakategorier med beskrivningar och dataset-antal.

### oecd://dataflows/popular
Populära OECD-dataset med ID:n, beskrivningar och exempelfrågor.

### oecd://api/info
Information om OECD SDMX API-endpoints, autentisering och hastighetsbegränsningar.

---

## Prompts

### analyze_economic_trend
Analysera ekonomiska indikatorer över tid för specifika länder.

**Argument:**
- `indicator` (obligatorisk): Ekonomisk indikator att analysera (t.ex. "GDP", "inflation")
- `countries` (obligatorisk): Kommaseparerade landskoder (t.ex. "USA,GBR,DEU")
- `time_period` (valfri): Tidsintervall (t.ex. "2020-2023")

### compare_countries
Jämför data över flera länder för en specifik indikator.

**Argument:**
- `indicator` (obligatorisk): Indikator att jämföra (t.ex. "GDP per capita")
- `countries` (obligatorisk): Kommaseparerade landskoder
- `year` (valfri): Specifikt år för jämförelse

### get_latest_statistics
Hämta senaste statistik för ett ämne.

**Argument:**
- `topic` (obligatorisk): Ämne att fråga om (t.ex. "unemployment", "inflation")
- `country` (valfri): Landskod (t.ex. "USA")

---

## Exempel på Användning

### Sök och Fråga BNP-data

```typescript
// 1. Sök efter BNP-dataset
await use_mcp_tool("oecd", "search_dataflows", {
  query: "GDP"
});

// 2. Hämta datastruktur
await use_mcp_tool("oecd", "get_data_structure", {
  dataflow_id: "QNA"
});

// 3. Fråga USA BNP-data
await use_mcp_tool("oecd", "query_data", {
  dataflow_id: "QNA",
  filter: "USA.GDP..",
  start_period: "2020-Q1",
  end_period: "2023-Q4"
});
```

### Jämför Länder med Prompts

```typescript
// Jämför BNP per capita över länder
await use_mcp_tool("oecd", "compare_countries", {
  indicator: "GDP per capita",
  countries: "USA,GBR,FRA,DEU,JPN",
  year: "2023"
});
```

### Hämta Senaste Arbetslöshetsstatistik

```typescript
// Hämta senaste arbetslöshetsdata för USA
await use_mcp_tool("oecd", "get_latest_statistics", {
  topic: "unemployment",
  country: "USA"
});
```

### Visualisera Data i OECD Explorer

```typescript
// Hämta direktlänk till OECD Data Explorer
await use_mcp_tool("oecd", "get_dataflow_url", {
  dataflow_id: "QNA",
  filter: "USA.GDP.."
});
// Returnerar: https://data-explorer.oecd.org/...
```

---

## API-endpoints

| Endpoint | Metod | Beskrivning |
|----------|-------|-------------|
| `/` | GET | Renderar denna README som HTML |
| `/mcp` | GET/POST | Standard MCP-protokoll (rekommenderas) |
| `/sse` | GET | Server-Sent Events transport |
| `/rpc` | POST | JSON-RPC endpoint |
| `/health` | GET | Hälsokontroll-endpoint |

---

## Utveckling

### Projektstruktur

```
oecd-mcp/
├── src/
│   ├── index.ts          # MCP-server (stdio-transport)
│   ├── http-server.ts    # HTTP-server för molndistribution
│   ├── sdmx-client.ts    # OECD SDMX API-klient
│   ├── oecd-client.ts    # Högnivå OECD-klient
│   ├── known-dataflows.ts # Kurerad dataset-lista
│   └── types.ts          # TypeScript-typdefinitioner
├── tests/
│   └── contract/
│       └── api-contract.test.ts  # API-kontraktstester
├── .github/
│   └── workflows/
│       └── api-monitoring.yml    # Daglig API-övervakning
├── dist/                 # Kompilerad JavaScript
├── Dockerfile           # Docker-konfiguration
├── render.yaml          # Render distributionskonfiguration
├── package.json
├── tsconfig.json
└── README.md
```

### Köra Tester

```bash
# Kör alla tester
npm test

# Kör kontraktstester
npm test tests/contract/api-contract.test.ts

# Bygga projekt
npm run build
```

### Utvecklingsläge

```bash
npm run dev  # Bevakningsläge med auto-ombyggnad
```

---

## Automatiserad Övervakning

Servern inkluderar automatiserad API-övervakning via GitHub Actions:

- **Dagliga kontraktstester** verifierar API-tillgänglighet och datastruktur
- **Automatisk ärendeskapande** när OECD API-ändringar bryter kompatibilitet
- **Automatisk ärendestängning** när testerna passerar igen
- **Manuell workflow-trigger** för testning på begäran

[![API Monitoring](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml/badge.svg)](https://github.com/isakskogstad/OECD-MCP-server/actions/workflows/api-monitoring.yml)

---

## Distribution

### Render-distribution

1. **Pusha till GitHub**:
```bash
git push origin main
```

2. **Distribuera på Render**:
   - Render upptäcker automatiskt `render.yaml` och distribuerar
   - Hälsokontroll: `https://oecd-mcp-server.onrender.com/health`
   - MCP-endpoint: `https://oecd-mcp-server.onrender.com/mcp`

### Docker-distribution

```bash
# Bygg avbild
docker build -t oecd-mcp .

# Kör container
docker run -p 3000:3000 oecd-mcp

# Kontrollera hälsa
curl http://localhost:3000/health
```

---

## Felsökning

### OECD API Returnerar Ingen Data
- Verifiera att dataflödes-ID:t är korrekt med `search_dataflows`
- Kontrollera att filtersyntaxen matchar SDMX-konventioner
- Säkerställ att tidsperioden är giltig för datasetet
- Använd `get_data_structure` först för att förstå dimensioner

### Anslutningsproblem
- Verifiera internetanslutning
- Kontrollera OECD API-status: https://sdmx.oecd.org/public/rest/
- Granska GitHub Actions för API-övervakningsstatus
- Kontrollera serverloggar för detaljerade felmeddelanden

### Strukturparseringsfel
- SDMX-strukturen varierar efter dataset
- Vissa dataset använder icke-standardformat
- Kontrollera kontraktstester för kända fungerande exempel
- Granska rå API-svar för felsökning

---

## Bidra

Bidrag är välkomna! Områden för förbättring:

- **Fler Dataset**: Lägg till verifierade dataflöden till `src/known-dataflows.ts`
- **Bättre Dokumentation**: Exempel, användningsfall, handledningar
- **Förbättrade Verktyg**: Ytterligare analyskapacitet
- **Buggfixar**: Rapportera och fixa problem
- **Tester**: Utöka testtäckning

Vänligen:
1. Forka repository
2. Skapa en feature-gren
3. Gör dina ändringar
4. Lägg till tester om tillämpligt
5. Skicka in en pull request

---

## Om OECD

[Organisationen för ekonomiskt samarbete och utveckling (OECD)](https://www.oecd.org/) är en internationell organisation med 38 länder som är engagerade i demokrati och marknadsekonomi. OECD tillhandahåller ett forum för regeringar att samarbeta, dela erfarenheter och söka lösningar på gemensamma problem.

**Medlemsländer (38):**
Australien, Belgien, Chile, Colombia, Costa Rica, Danmark, Estland, Finland, Frankrike, Grekland, Irland, Island, Israel, Italien, Japan, Kanada, Lettland, Litauen, Luxemburg, Mexiko, Nederländerna, Norge, Nya Zeeland, Polen, Portugal, Schweiz, Slovakien, Slovenien, Spanien, Storbritannien, Sverige, Sydkorea, Tjeckien, Turkiet, Tysklad, Ungern, USA, Österrike

**Partnerländer:**
Brasilien, Indien, Indonesien, Kina, Sydafrika

---

## API-information

- **Bas-URL**: https://sdmx.oecd.org/public/rest/
- **Format**: SDMX-JSON v2.1 (Statistical Data and Metadata eXchange)
- **Autentisering**: Ingen krävs (offentlig API)
- **Hastighetsbegränsning**: Var vänligen respektfull med API-användning
- **Dokumentation**: https://data.oecd.org/
- **SDMX-standard**: https://sdmx.org/
- **Migration**: Legacy OECD.Stat API:er avvecklade juni 2024

---

## Licens

MIT License - Se [LICENSE](LICENSE)-filen för detaljer

Skapat av Isak Skogstad

---

## Erkännanden

- Byggd med [Model Context Protocol SDK](https://github.com/modelcontextprotocol)
- Data tillhandahållen av [OECD](https://www.oecd.org/)
- Använder [SDMX-standarden](https://sdmx.org/) för statistiskt datautbyte
- Inspirerad av andra öppna data MCP-servrar

---

## Support

- **Ärenden**: [GitHub Issues](https://github.com/isakskogstad/OECD-MCP-server/issues)
- **OECD Dataportalen**: https://data.oecd.org/
- **SDMX-dokumentation**: https://sdmx.org/
- **MCP-dokumentation**: https://modelcontextprotocol.io/
- **npm-paket**: https://www.npmjs.com/package/oecd-mcp
