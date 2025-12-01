/**
 * Known OECD SDMX Dataflows
 * Based on actual OECD SDMX API structure (December 2024)
 *
 * NOTE: OECD SDMX API uses complex agency IDs like "OECD.CFE.EDS", not simple "OECD"
 * This is a curated list of working dataflows for common OECD statistics
 */

export interface KnownDataflow {
  id: string;
  fullId: string; // Format: DSD_ID@DF_ID
  agency: string;
  version: string;
  name: string;
  description: string;
  category: string;
}

/**
 * Curated list of working OECD dataflows
 * These have been verified to work with the SDMX API structure endpoints
 */
export const KNOWN_DATAFLOWS: KnownDataflow[] = [
  // ========================================
  // ECONOMIC INDICATORS (OECD.SDD.NAD, OECD.SDD.STES)
  // ========================================
  {
    id: 'QNA',
    fullId: 'DSD_NAMAIN1@DF_QNA',
    agency: 'OECD.SDD.NAD',
    version: '1.0',
    name: 'Quarterly National Accounts',
    description: 'GDP and main aggregates - quarterly frequency. Includes GDP, consumption, investment, government spending by country and quarter.',
    category: 'ECO',
  },
  {
    id: 'MEI',
    fullId: 'DSD_STES@DF_CLI',
    agency: 'OECD.SDD.STES',
    version: '1.0',
    name: 'Main Economic Indicators - Composite Leading Indicators',
    description: 'Composite Leading Indicators (CLI) designed to provide early signals of turning points in business cycles. Monthly frequency.',
    category: 'ECO',
  },

  // ========================================
  // HEALTH STATISTICS (OECD.ELS.HD)
  // ========================================
  {
    id: 'HEALTH_STAT',
    fullId: 'DSD_HEALTH_STAT@DF_PHS',
    agency: 'OECD.ELS.HD',
    version: '1.0',
    name: 'Health Statistics - Perceived Health Status',
    description: 'Percentage of population aged 15+ reporting good/very good health status, by age and gender.',
    category: 'HEA',
  },

  // ========================================
  // EDUCATION (OECD.EDU.IMEP)
  // ========================================
  {
    id: 'EAG_FIN',
    fullId: 'DSD_EAG_UOE_FIN@DF_UOE_INDIC_FIN_PERSTUD',
    agency: 'OECD.EDU.IMEP',
    version: '3.0',
    name: 'Education at a Glance - Financial Indicators per Student',
    description: 'Education spending per student by education level. Part of UNESCO-UIS/OECD/EUROSTAT (UOE) data collection.',
    category: 'EDU',
  },

  // ========================================
  // EMPLOYMENT & LABOUR (OECD.ELS.SAE)
  // ========================================
  {
    id: 'AVD_DUR',
    fullId: 'DSD_DUR@DF_AVD_DUR',
    agency: 'OECD.ELS.SAE',
    version: '1.0',
    name: 'Unemployment by Duration - Average Duration',
    description: 'Average duration of unemployment in months by country and demographic characteristics.',
    category: 'JOB',
  },

  // ========================================
  // TRADE (OECD.SDD.TPS)
  // ========================================
  {
    id: 'TIS',
    fullId: 'DSD_BOP@DF_TIS',
    agency: 'OECD.SDD.TPS',
    version: '1.0',
    name: 'Trade in Services',
    description: 'International trade in services by country and service category, based on Balance of Payments.',
    category: 'TRD',
  },

  // ========================================
  // FINANCE & INVESTMENT (OECD.DAF.INV)
  // ========================================
  {
    id: 'FDI',
    fullId: 'DSD_FDI@DF_FDI_CTRY_IND_SUMM',
    agency: 'OECD.DAF.INV',
    version: '1.0',
    name: 'Foreign Direct Investment - Country and Industry Summary',
    description: 'FDI flows and stocks by country and industry. Includes inward and outward FDI positions.',
    category: 'FIN',
  },

  // ========================================
  // GOVERNMENT (OECD.GOV.GIP, OECD.SDD.NAD)
  // ========================================
  {
    id: 'GOV_2023',
    fullId: 'DSD_GOV@DF_GOV_2023',
    agency: 'OECD.GOV.GIP',
    version: '1.0',
    name: 'Government at a Glance 2023',
    description: 'Comprehensive government indicators including public finance, budgeting, human resources management, regulatory governance, and open government.',
    category: 'GOV',
  },
  {
    id: 'SNA_TABLE11',
    fullId: 'DSD_NASEC10@SNA_TABLE11',
    agency: 'OECD.SDD.NAD',
    version: '1.0',
    name: 'Government Expenditure by Function (COFOG)',
    description: 'General government expenditure by Classification of the Functions of Government (COFOG). Shows spending on health, education, defense, etc.',
    category: 'GOV',
  },
  {
    id: 'GGDP',
    fullId: 'DSD_NASEC10@GGDP',
    agency: 'OECD.SDD.NAD',
    version: '1.0',
    name: 'General Government Debt-to-GDP ratio',
    description: 'General government gross debt as a percentage of GDP. Key fiscal sustainability indicator.',
    category: 'GOV',
  },

  // ========================================
  // CLIMATE & ENVIRONMENT (OECD.CFE.EDS - Functional Urban Areas)
  // ========================================
  {
    id: 'DF_LAND_TEMP',
    fullId: 'DSD_FUA_CLIM@DF_LAND_TEMP',
    agency: 'OECD.CFE.EDS',
    version: '1.2',
    name: 'Land surface temperature - Cities and FUAs',
    description: 'Land surface temperature indicators in functional urban areas and cities',
    category: 'ENV',
  },
  {
    id: 'DF_CLIM_PROJ',
    fullId: 'DSD_FUA_CLIM@DF_CLIM_PROJ',
    agency: 'OECD.CFE.EDS',
    version: '1.4',
    name: 'Climate projections by scenario, 2030–2060 – Cities and FUAs',
    description: 'Climate projections for cities based on different scenarios (SSP)',
    category: 'ENV',
  },
  {
    id: 'DF_COASTAL_FLOOD',
    fullId: 'DSD_FUA_CLIM@DF_COASTAL_FLOOD',
    agency: 'OECD.CFE.EDS',
    version: '1.1',
    name: 'Coastal flooding - Cities and FUAs',
    description: 'Population and built-up exposure to coastal floods',
    category: 'ENV',
  },
  {
    id: 'DF_DROUGHT',
    fullId: 'DSD_FUA_CLIM@DF_DROUGHT',
    agency: 'OECD.CFE.EDS',
    version: '1.2',
    name: 'Drought - Cities and FUAs',
    description: 'Soil moisture anomaly estimates in functional urban areas',
    category: 'ENV',
  },
  {
    id: 'DF_FIRES',
    fullId: 'DSD_FUA_CLIM@DF_FIRES',
    agency: 'OECD.CFE.EDS',
    version: '1.1',
    name: 'Wildfires - Cities and FUAs',
    description: 'Population and land exposure to wildfires',
    category: 'ENV',
  },
  {
    id: 'DF_HEAT_STRESS',
    fullId: 'DSD_FUA_CLIM@DF_HEAT_STRESS',
    agency: 'OECD.CFE.EDS',
    version: '1.1',
    name: 'Heat stress - Cities and FUAs',
    description: 'Population exposure to heat stress (UTCI index)',
    category: 'ENV',
  },
  {
    id: 'DF_PRECIP',
    fullId: 'DSD_FUA_CLIM@DF_PRECIP',
    agency: 'OECD.CFE.EDS',
    version: '1.1',
    name: 'Precipitation - FUAs',
    description: 'Total precipitation and extreme precipitation days',
    category: 'ENV',
  },
  {
    id: 'DF_RIVER_FLOOD',
    fullId: 'DSD_FUA_CLIM@DF_RIVER_FLOOD',
    agency: 'OECD.CFE.EDS',
    version: '1.1',
    name: 'River flooding - Cities and FUAs',
    description: 'Population and built-up exposure to river floods',
    category: 'ENV',
  },
  {
    id: 'GREEN_GROWTH',
    fullId: 'DSD_GG@DF_GREEN_GROWTH',
    agency: 'OECD.ENV.EPI',
    version: '1.0',
    name: 'Green Growth Indicators',
    description: 'Environmental and economic indicators for green growth monitoring. Includes carbon productivity, energy intensity, and renewable energy deployment.',
    category: 'ENV',
  },

  // ========================================
  // ENERGY & NATURAL RESOURCES (OECD.SDD.NAD.SEEA)
  // ========================================
  {
    id: 'NAT_RES',
    fullId: 'DSD_NAT_RES@DF_NAT_RES',
    agency: 'OECD.SDD.NAD.SEEA',
    version: '1.0',
    name: 'Natural Resources - Mineral and Energy',
    description: 'Natural resource accounts for mineral and energy resources. Part of System of Environmental-Economic Accounting (SEEA).',
    category: 'NRG',
  },

  // ========================================
  // AGRICULTURE & FISHERIES (OECD.TAD.ATM)
  // ========================================
  {
    id: 'AGR_OUTLOOK',
    fullId: 'DSD_AGR@DF_OUTLOOK_2023_2032',
    agency: 'OECD.TAD.ATM',
    version: '1.0',
    name: 'Agricultural Outlook 2023-2032',
    description: 'OECD-FAO Agricultural Outlook projections for agricultural production, consumption, trade, and prices. Covers major commodities and regions through 2032.',
    category: 'AGR',
  },

  // ========================================
  // SOCIAL PROTECTION & WELL-BEING (OECD.WISE.INE, OECD.ELS.SPD, OECD.CFE.EDS)
  // ========================================
  {
    id: 'IDD',
    fullId: 'DSD_WISE_IDD@DF_IDD',
    agency: 'OECD.WISE.INE',
    version: '1.0',
    name: 'Income Distribution Database',
    description: 'Comprehensive income distribution statistics including Gini coefficients, income quintiles, poverty rates, and income inequality measures by country.',
    category: 'SOC',
  },
  {
    id: 'SOCX_AGG',
    fullId: 'DSD_SOCX_AGG@DF_SOCX_AGG',
    agency: 'OECD.ELS.SPD',
    version: '1.0',
    name: 'Social Expenditure - Aggregated Data',
    description: 'Social spending by country and program area (pensions, healthcare, family benefits, unemployment, housing, etc.). Both public and private social expenditure.',
    category: 'SOC',
  },
  {
    id: 'INCOME_INEQ',
    fullId: 'DSD_REG_SOC@DF_INCOME_INEQ',
    agency: 'OECD.CFE.EDS',
    version: '1.0',
    name: 'Income Inequality - Regional Level',
    description: 'Regional income inequality indicators including Gini coefficient and income ratios at sub-national level.',
    category: 'SOC',
  },

  // ========================================
  // DEVELOPMENT COOPERATION (OECD.DCD.FSD)
  // ========================================
  {
    id: 'DAC2A',
    fullId: 'DSD_DAC2@DF_DAC2A',
    agency: 'OECD.DCD.FSD',
    version: '1.0',
    name: 'Aid (ODA) Disbursements by Country and Region',
    description: 'Official Development Assistance (ODA) disbursements from DAC donors by recipient country and region. Part of DAC Table 2.',
    category: 'DEV',
  },
  {
    id: 'DAC3A',
    fullId: 'DSD_DAC2@DF_DAC3A',
    agency: 'OECD.DCD.FSD',
    version: '1.0',
    name: 'Aid (ODA) Commitments by Country and Region',
    description: 'Official Development Assistance (ODA) commitments from DAC donors by recipient country and region. Part of DAC Table 3.',
    category: 'DEV',
  },
  {
    id: 'ODF',
    fullId: 'DSD_DAC2@DF_ODF',
    agency: 'OECD.DCD.FSD',
    version: '1.0',
    name: 'Other Official Flows (OOF)',
    description: 'Official Development Financing beyond ODA - includes other official flows to developing countries.',
    category: 'DEV',
  },
];

/**
 * Get dataflow by ID (short ID like "DF_LAND_TEMP")
 */
export function getDataflowById(id: string): KnownDataflow | undefined {
  return KNOWN_DATAFLOWS.find((df) => df.id === id);
}

/**
 * Search dataflows by keyword
 */
export function searchDataflows(query: string): KnownDataflow[] {
  const lowerQuery = query.toLowerCase();
  return KNOWN_DATAFLOWS.filter(
    (df) =>
      df.id.toLowerCase().includes(lowerQuery) ||
      df.name.toLowerCase().includes(lowerQuery) ||
      df.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get dataflows by category
 */
export function getDataflowsByCategory(category: string): KnownDataflow[] {
  return KNOWN_DATAFLOWS.filter((df) => df.category === category);
}

/**
 * Convert KnownDataflow to SDMXDataflow format
 */
export function toSDMXDataflow(kdf: KnownDataflow) {
  return {
    id: kdf.id,
    version: kdf.version,
    name: kdf.name,
    description: kdf.description,
    agencyID: kdf.agency,
  };
}
