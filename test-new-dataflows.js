#!/usr/bin/env node
/**
 * Test script for new OECD dataflows
 * Tests QNA, MEI, and HEALTH_STAT dataflows
 */

import { OECDClient } from './dist/oecd-client.js';

async function testDataflows() {
  const client = new OECDClient();

  console.log('='.repeat(60));
  console.log('Testing New OECD Dataflows');
  console.log('='.repeat(60));
  console.log('');

  // Test 1: List all dataflows
  console.log('📊 Test 1: List All Dataflows');
  console.log('-'.repeat(60));
  try {
    const allDataflows = await client.listDataflows();
    console.log(`✅ Total dataflows: ${allDataflows.length}`);
    console.log('   Dataflows:', allDataflows.map(df => df.id).join(', '));
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  // Test 2: Filter by ECO category
  console.log('💰 Test 2: Filter by ECO Category');
  console.log('-'.repeat(60));
  try {
    const ecoDataflows = await client.listDataflows({ category: 'ECO' });
    console.log(`✅ ECO dataflows: ${ecoDataflows.length}`);
    ecoDataflows.forEach(df => {
      console.log(`   - ${df.id}: ${df.name}`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  // Test 3: Filter by HEA category
  console.log('🏥 Test 3: Filter by HEA Category');
  console.log('-'.repeat(60));
  try {
    const heaDataflows = await client.listDataflows({ category: 'HEA' });
    console.log(`✅ HEA dataflows: ${heaDataflows.length}`);
    heaDataflows.forEach(df => {
      console.log(`   - ${df.id}: ${df.name}`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  // Test 4: Search for "GDP"
  console.log('🔍 Test 4: Search for "GDP"');
  console.log('-'.repeat(60));
  try {
    const gdpResults = await client.searchDataflows('GDP');
    console.log(`✅ Found ${gdpResults.length} result(s)`);
    gdpResults.forEach(df => {
      console.log(`   - ${df.id}: ${df.name}`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  // Test 5: Query QNA data
  console.log('📈 Test 5: Query QNA Data (Quarterly National Accounts)');
  console.log('-'.repeat(60));
  try {
    const qnaData = await client.queryData({
      dataflowId: 'QNA',
      filter: 'all',
      lastNObservations: 3
    });
    console.log(`✅ Retrieved ${qnaData.length} observations`);
    if (qnaData.length > 0) {
      console.log(`   Latest observation: ${JSON.stringify(qnaData[0], null, 2).substring(0, 200)}...`);
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  // Test 6: Query MEI data
  console.log('📊 Test 6: Query MEI Data (Main Economic Indicators)');
  console.log('-'.repeat(60));
  try {
    const meiData = await client.queryData({
      dataflowId: 'MEI',
      filter: 'all',
      lastNObservations: 3
    });
    console.log(`✅ Retrieved ${meiData.length} observations`);
    if (meiData.length > 0) {
      console.log(`   Latest observation: ${JSON.stringify(meiData[0], null, 2).substring(0, 200)}...`);
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  // Test 7: Query HEALTH_STAT data
  console.log('🏥 Test 7: Query HEALTH_STAT Data (Health Statistics)');
  console.log('-'.repeat(60));
  try {
    const healthData = await client.queryData({
      dataflowId: 'HEALTH_STAT',
      filter: 'all',
      lastNObservations: 3
    });
    console.log(`✅ Retrieved ${healthData.length} observations`);
    if (healthData.length > 0) {
      console.log(`   Latest observation: ${JSON.stringify(healthData[0], null, 2).substring(0, 200)}...`);
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  // Test 8: Get popular datasets
  console.log('⭐ Test 8: Get Popular Datasets');
  console.log('-'.repeat(60));
  try {
    const popular = await client.getPopularDatasets();
    console.log(`✅ Found ${popular.length} popular datasets`);
    popular.forEach(ds => {
      const status = ds.description.includes('✅') ? '✅' :
                     ds.description.includes('❌') ? '❌' : '⏳';
      console.log(`   ${status} ${ds.id}: ${ds.name}`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('Testing Complete!');
  console.log('='.repeat(60));
}

testDataflows().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
