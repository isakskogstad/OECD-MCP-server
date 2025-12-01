#!/usr/bin/env node
/**
 * Batch test multiple OECD dataflows
 */
import fetch from 'node-fetch';

const SDMX_BASE = 'https://sdmx.oecd.org/public/rest/data';

const dataflowsToTest = [
  // Government
  { id: 'GOV_2023', agency: 'OECD.GOV.GIP', fullId: 'DSD_GOV@DF_GOV_2023', cat: 'GOV', name: 'Government at a Glance 2023' },
  { id: 'SNA_TABLE11', agency: 'OECD.SDD.NAD', fullId: 'DSD_NASEC10@SNA_TABLE11', cat: 'GOV', name: 'Government Expenditure by Function' },
  { id: 'GGDP', agency: 'OECD.SDD.NAD', fullId: 'DSD_NASEC10@GGDP', cat: 'GOV', name: 'General Government Debt' },
  
  // Agriculture
  { id: 'FISH_AQUA', agency: 'OECD.TAD.ARP', fullId: 'DSD_FISH@DF_FISH_AQUA', cat: 'AGR', name: 'Aquaculture Production' },
  { id: 'FISH_FLEET', agency: 'OECD.TAD.ARP', fullId: 'DSD_FISH@DF_FISH_FLEET', cat: 'AGR', name: 'Fishing Fleet' },
  { id: 'PSE', agency: 'OECD.TAD.ARP', fullId: 'DSD_PSE@DF_PSE', cat: 'AGR', name: 'Producer Support Estimate' },
  
  // Social Protection
  { id: 'SOCX_AGG', agency: 'OECD.ELS.SAE', fullId: 'DSD_SOCX@DF_SOCX_AGG', cat: 'SOC', name: 'Social Expenditure - Aggregated data' },
  { id: 'IDD', agency: 'OECD.WISE.INE', fullId: 'DSD_IDD@DF_IDD', cat: 'SOC', name: 'Income Distribution Database' },
  { id: 'BLI', agency: 'OECD.WISE.BLI', fullId: 'DSD_BLI@DF_BLI', cat: 'SOC', name: 'Better Life Index' },
  
  // Development
  { id: 'TABLE1', agency: 'OECD.DCD.FSD', fullId: 'DSD_DAC2A@DF_TABLE1', cat: 'DEV', name: 'Total DAC Flows by Donor' },
  { id: 'TABLE2A', agency: 'OECD.DCD.FSD', fullId: 'DSD_DAC2A@DF_TABLE2A', cat: 'DEV', name: 'ODA by Donor and Recipient' },
  { id: 'CRS', agency: 'OECD.DCD.FSD', fullId: 'DSD_CRS@DF_CRS', cat: 'DEV', name: 'Creditor Reporting System' },
  
  // Innovation & Technology
  { id: 'MSTI_PUB', agency: 'OECD.STI.STP', fullId: 'DSD_MSTI_PUB@DF_MSTI_PUB', cat: 'STI', name: 'Main Science and Technology Indicators' },
  { id: 'PATS_IPC', agency: 'OECD.STI.STP', fullId: 'DSD_PATS@DF_PATS_IPC', cat: 'STI', name: 'Patents by Technology' },
  { id: 'ICT_ACCESS', agency: 'OECD.STI.STP', fullId: 'DSD_ICT@DF_ICT_ACCESS', cat: 'STI', name: 'ICT Access and Usage by Households' },
  
  // Taxation  
  { id: 'REV', agency: 'OECD.CTP.TPS', fullId: 'DSD_REV@DF_REV', cat: 'TAX', name: 'Revenue Statistics' },
  { id: 'CTS_CIT', agency: 'OECD.CTP.TPS', fullId: 'DSD_CTS@DF_CTS_CIT', cat: 'TAX', name: 'Corporate Tax Statistics' },
  { id: 'CTS_PIT', agency: 'OECD.CTP.TPS', fullId: 'DSD_CTS@DF_CTS_PIT', cat: 'TAX', name: 'Personal Income Tax Statistics' },
  
  // Finance
  { id: 'FI', agency: 'OECD.DAF.AS', fullId: 'DSD_FI@DF_FI', cat: 'FIN', name: 'Financial Indicators' },
  { id: 'PENSION', agency: 'OECD.DAF.AS', fullId: 'DSD_PEN@DF_PENSION', cat: 'FIN', name: 'Pension Statistics' },
  
  // Transport
  { id: 'ITF_GOODS', agency: 'OECD.ITF.STA', fullId: 'DSD_ITF@DF_ITF_GOODS_TRANSPORT', cat: 'TRA', name: 'Goods Transport' },
  { id: 'ITF_PASSENGER', agency: 'OECD.ITF.STA', fullId: 'DSD_ITF@DF_ITF_PASSENGER_TRANSPORT', cat: 'TRA', name: 'Passenger Transport' },
  { id: 'ITF_INV', agency: 'OECD.ITF.STA', fullId: 'DSD_ITF@DF_ITF_INV', cat: 'TRA', name: 'Transport Infrastructure Investment' },
  
  // Industry & Services
  { id: 'PDB_LV', agency: 'OECD.SDD.TPS', fullId: 'DSD_PDB@DF_PDB_LV', cat: 'IND', name: 'Productivity by Industry' },
  { id: 'SNA_TABLE6A', agency: 'OECD.SDD.NAD', fullId: 'DSD_NAMAIN10@DF_TABLE6A', cat: 'IND', name: 'Value Added by Industry' },
  { id: 'STAN08BIS', agency: 'OECD.SDD.TPS', fullId: 'DSD_STAN08@DF_STAN08BIS', cat: 'IND', name: 'STAN Database for Structural Analysis' },
  
  // Regional Statistics
  { id: 'REGION_DEMOGR', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_DEMO@DF_REGION_DEMOGR', cat: 'REG', name: 'Regional Demography' },
  { id: 'REGION_ECONOM', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_ECO@DF_REGION_ECONOM', cat: 'REG', name: 'Regional Economy' },
  { id: 'REGION_INNOV', agency: 'OECD.CFE.EDS', fullId: 'DSD_REG_INNO@DF_REGION_INNOV', cat: 'REG', name: 'Regional Innovation' },
];

async function testDataflow(df) {
  const url = `${SDMX_BASE}/${df.agency},${df.fullId}/all?format=jsondata&lastNObservations=1`;
  
  try {
    const response = await fetch(url, { timeout: 5000 });
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
  console.log('Testing OECD Dataflows...\n');
  console.log('='.repeat(80));
  
  const results = {};
  
  for (const df of dataflowsToTest) {
    const result = await testDataflow(df);
    console.log(`${result.status} ${result.cat.padEnd(5)} ${result.id.padEnd(20)} ${result.name}`);
    if (result.error) console.log(`     Error: ${result.error}`);
    
    if (!results[result.cat]) results[result.cat] = [];
    results[result.cat].push(result);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\nSummary by Category:');
  console.log('-'.repeat(80));
  
  for (const [cat, dfs] of Object.entries(results)) {
    const working = dfs.filter(d => d.status === '✅').length;
    console.log(`${cat}: ${working}/${dfs.length} working`);
    dfs.filter(d => d.status === '✅').forEach(d => console.log(`  ✅ ${d.id}`));
  }
}

main().catch(console.error);
