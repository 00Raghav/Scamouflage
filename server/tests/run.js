import { SAMPLES } from './samples.js';
import { processAnalysis } from '../combine.js';
import { analyzeResponseSchema } from '../schema.js';

async function runTests() {
  console.log('🧪 Starting Scamouflage Pipeline Tests...\n');

  let passed = 0;
  let failed = 0;

  for (const sample of SAMPLES) {
    console.log(`--------------------------------------------------`);
    console.log(`🔍 Testing: ${sample.name} (${sample.inputType})`);

    try {
      const result = await processAnalysis({
        inputType: sample.inputType,
        content: sample.content
      });

      // 1. Validate response structure with Zod schema
      const schemaCheck = analyzeResponseSchema.safeParse(result);
      if (!schemaCheck.success) {
        console.error(`❌ Schema Validation Failed:`, schemaCheck.error.format());
        failed++;
        continue;
      }

      console.log(`   Threat Score:    ${result.riskScore} / 100`);
      console.log(`   Risk Category:   ${result.riskCategory}`);
      console.log(`   Summary (EN):    ${result.summary.en.substring(0, 80)}...`);
      console.log(`   Flagged Phrases: ${result.flaggedPhrases.length}`);
      if (result.urlAnalysis) {
        console.log(`   URL Domain:      ${result.urlAnalysis.domain} (Lookalike: ${result.urlAnalysis.lookalikeOf || 'None'})`);
      }

      // 2. Score threshold assertions
      let testPassed = true;

      if (sample.expectedScoreMin !== undefined && result.riskScore < sample.expectedScoreMin) {
        console.error(`❌ Expected score >= ${sample.expectedScoreMin}, but received ${result.riskScore}`);
        testPassed = false;
      }

      if (sample.expectedScoreMax !== undefined && result.riskScore > sample.expectedScoreMax) {
        console.error(`❌ Expected score <= ${sample.expectedScoreMax}, but received ${result.riskScore}`);
        testPassed = false;
      }

      if (sample.expectedCategory && !sample.expectedCategory.includes(result.riskCategory)) {
        console.error(`❌ Expected category in [${sample.expectedCategory.join(', ')}], but got "${result.riskCategory}"`);
        testPassed = false;
      }

      if (testPassed) {
        console.log(`✅ Passed!`);
        passed++;
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`❌ Error during execution:`, err);
      failed++;
    }
  }

  console.log(`\n==================================================`);
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed (${SAMPLES.length} total)`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
