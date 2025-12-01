#!/usr/bin/env node
/**
 * Comprehensive test of ALL discovered OECD dataflows
 */
import fetch from 'node-fetch';

const SDMX_BASE = 'https://sdmx.oecd.org/public/rest/data';
const DELAY = 500; // ms between requests to avoid rate limiting

const NEW_DATAFLOWS = [
  // ENERGY (NRG)
  { id: 'NAT_RES', agency: 'OECD.SDD.NAD.SEEA', fullId: 'DSD_NAT_RES@DF_NAT_RES', cat: 'NRG', name: 'Natural Resources - Mineral and Energy' },
  
  // AGRICULTURE (AGR)
  { id: 'AGR_OUTLOOK', agency: 'OECD.TAD.ATM', fullId: 'DSD_AGR@DF_OUTLOOK_2023_2032', cat: 'AGR', name: 'Agricultural Outlook 2023-2032' },
  
  // SOCIAL (SOC)
  { id: 'IDD', agency: 'OECD.WISE.INE', fullId: 'DSD_WISE_IDD@DF_IDD', cat: 'SOC', name: 'Income Distribution Database' },
  { id: 'SOCX_AGG', agency: 'OECD.ELS.SPD', fullId: 'DSD_SOCX_AGG@DF_SOCX_AGG', cat: 'SOC', name: 'Social Expenditure - Aggregated Data' },
  { id: 'INCOME_INEQ', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_SOC@DF_INCOME_INEQ', cat: 'SOC', name: 'Income Inequality - Regions' },
  
  // DEVELOPMENT (DEV)
  { id: 'DAC2A', agency: 'OECD.DCD.FSD', fullId: 'DSD_DAC2@DF_DAC2A', cat: 'DEV', name: 'Aid (ODA) Disbursements by Country and Region' },
  { id: 'DAC3A', agency: 'OECD.DCD.FSD', fullId: 'DSD_DAC2@DF_DAC3A', cat: 'DEV', name: 'Aid (ODA) Commitments by Country and Region' },
  { id: 'ODF', agency: 'OECD.DCD.FSD', fullId: 'DSD_DAC2@DF_ODF', cat: 'DEV', name: 'Official Development Financing' },
  { id: 'RIOMARKERS', agency: 'OECD.DCD.FSD', fullId: 'DSD_RIOMRKR@DF_RIOMARKERS', cat: 'DEV', name: 'Aid Targeting Environmental Objectives' },
  
  // INNOVATION & TECHNOLOGY (STI)
  { id: 'MSTI', agency: 'OECD.STI.STP', fullId: 'DSD_MSTI@DF_MSTI', cat: 'STI', name: 'Main Science and Technology Indicators' },
  { id: 'PAT_DEV', agency: 'OECD.ENV.EPI', fullId: 'DSD_PAT_DEV@DF_PAT_DEV', cat: 'STI', name: 'Patents - Technology Development' },
  { id: 'PATENTS_WIPO', agency: 'OECD.STI.PIE', fullId: 'DSD_PATENTS@DF_PATENTS_WIPO', cat: 'STI', name: 'Patents by WIPO Technology Domains' },
  { id: 'ICT_IND', agency: 'OECD.STI.DEP', fullId: 'DSD_ICT_HH_IND@DF_IND', cat: 'STI', name: 'ICT Access and Usage by Individuals' },
  
  // TAXATION (TAX)
  { id: 'REV_OECD', agency: 'OECD.CTP.TPS', fullId: 'DSD_REV_COMP_OECD@DF_RSOECD', cat: 'TAX', name: 'Revenue Statistics in OECD Countries' },
  { id: 'ETR', agency: 'OECD.CTP.TPS', fullId: 'DSD_ETR@DF_ETR_BASELINE', cat: 'TAX', name: 'Effective Tax Rates - Corporate Tax' },
  { id: 'PIT', agency: 'OECD.CTP.TPS', fullId: 'DSD_TAX_PIT@DF_PIT_TOP_EARN_THRESH', cat: 'TAX', name: 'Personal Income Tax - Top Rates' },
  { id: 'TAX_WAGES', agency: 'OECD.CTP.TPS', fullId: 'DSD_TAX_WAGES_DECOMP@DF_TW_DECOMP', cat: 'TAX', name: 'Labour Taxation - Tax Wedge' },
  
  // TRANSPORT (TRA)
  { id: 'INFRINV', agency: 'OECD.ITF', fullId: 'DSD_INFRINV@DF_INFRINV', cat: 'TRA', name: 'Transport Infrastructure Investment' },
  { id: 'TRANS_IND', agency: 'OECD.ITF', fullId: 'DSD_INDICATORS@DF_TRANSPORTINDICATORS', cat: 'TRA', name: 'Transport Performance Indicators' },
  
  // INDUSTRY & SERVICES (IND)
  { id: 'TABLE6', agency: 'OECD.SDD.NAD', fullId: 'DSD_NAMAIN10@DF_TABLE6', cat: 'IND', name: 'Value Added by Economic Activity' },
  { id: 'PDB_ISIC4', agency: 'OECD.SDD.TPS', fullId: 'DSD_PDB@DF_PDB_ISIC4_I4', cat: 'IND', name: 'Productivity by Industry (ISIC4)' },
  { id: 'STAN', agency: 'OECD.STI.PIE', fullId: 'DSD_STAN@DF_STAN', cat: 'IND', name: 'STAN Database for Structural Analysis' },
  { id: 'PDB_LV', agency: 'OECD.SDD.TPS', fullId: 'DSD_PDB@DF_PDB_LV', cat: 'IND', name: 'Productivity Levels' },
  { id: 'PDB_ULC', agency: 'OECD.SDD.TPS', fullId: 'DSD_PDB@DF_PDB_ULC_Q', cat: 'IND', name: 'Unit Labour Costs' },
  
  // REGIONAL STATISTICS (REG)
  { id: 'REG_DEMO', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_DEMO@DF_DEMO', cat: 'REG', name: 'Regional Demography' },
  { id: 'REG_ECO_RURB', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_ECO@DF_TYPE_RURB', cat: 'REG', name: 'Economic Indicators by Urban-Rural Type' },
  { id: 'REG_LABOUR', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_LABOUR@DF_LAB', cat: 'REG', name: 'Labour Statistics - Regions' },
  { id: 'REG_GVA', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_ECO@DF_GVA', cat: 'REG', name: 'Gross Value Added - Regions' },
  { id: 'REGOFI', agency: 'OECD.CFE.RDG', fullId: 'DSD_SNGF_AGG@DF_REGOFI', cat: 'REG', name: 'Regional Government Finance' },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testDataflow(df) {
  const url = `${SDMX_BASE}/${df.agency},${df.fullId}/all?format=jsondata&lastNObservations=1`;
  
  try {
    const response = await fetch(url, { timeout: 8000 });
    if (response.ok) {
      const data = await response.json();
      if (data && data.data) {
        return { ...df, status: '✅', error: null };
      }
    }
    return { ...df, status: '❌', error: `${response.status} ${response.statusText}` };
  } catch (error) {
    return { ...df, status: '❌', error: error.message };
  }
}

async function main() {
  console.log('🧪 Testing ALL New OECD Dataflows');
  console.log('='.repeat(90));
  console.log(`Total to test: ${NEW_DATAFLOWS.length} dataflows\n`);
  
  const results = {};
  let tested = 0;
  
  for (const df of NEW_DATAFLOWS) {
    tested++;
    console.log(`[${tested}/${NEW_DATAFLOWS.length}] Testing ${df.cat}/${df.id}...`);
    
    const result = await testDataflow(df);
    console.log(`${result.status} ${result.cat.padEnd(5)} ${result.id.padEnd(20)} ${result.name}`);
    if (result.error) console.log(`     Error: ${result.error}`);
    
    if (!results[result.cat]) results[result.cat] = [];
    results[result.cat].push(result);
    
    // Rate limiting delay
    if (tested < NEW_DATAFLOWS.length) {
      await sleep(DELAY);
    }
  }
  
  console.log('\n' + '='.repeat(90));
  console.log('📊 Summary by Category:');
  console.log('-'.repeat(90));
  
  let totalWorking = 0;
  let totalTested = 0;
  
  for (const [cat, dfs] of Object.entries(results).sort()) {
    const working = dfs.filter(d => d.status === '✅');
    totalWorking += working.length;
    totalTested += dfs.length;
    
    console.log(`\n${cat}: ${working.length}/${dfs.length} working`);
    working.forEach(d => console.log(`  ✅ ${d.id.padEnd(20)} - ${d.name}`));
    
    const failed = dfs.filter(d => d.status === '❌');
    if (failed.length > 0) {
      failed.forEach(d => console.log(`  ❌ ${d.id.padEnd(20)} - ${d.error}`));
    }
  }
  
  console.log('\n' + '='.repeat(90));
  console.log(`\n🎯 TOTAL: ${totalWorking}/${totalTested} dataflows working (${Math.round(totalWorking/totalTested*100)}%)`);
  console.log('\nNext step: Add working dataflows to known-dataflows.ts');
}

main().catch(console.error);
