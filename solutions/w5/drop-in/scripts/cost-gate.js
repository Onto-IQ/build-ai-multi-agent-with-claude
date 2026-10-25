#!/usr/bin/env node
'use strict';

/**
 * Teaching cost gate. Exit 2 when a run record is over the workshop budget.
 * The dollar cap is a class limit until a TUI dry run records a real total_cost_usd.
 */

const fs = require('fs');

const LIMIT_USD = 2;
const LIMIT_OUTPUT_TOKENS = 20000;

function main() {
  const file = process.argv[2];
  if (!file) {
    console.log('FAIL | cost-gate | usage: node scripts/cost-gate.js <usage.json>');
    process.exit(2);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.log(`FAIL | cost-gate | cannot read usage file (${err.message})`);
    process.exit(2);
  }
  const cost = Number(data.total_cost_usd);
  const outputTokens = Number(data.usage && data.usage.output_tokens) || 0;
  if (!Number.isFinite(cost)) {
    console.log('FAIL | cost-gate | missing total_cost_usd');
    process.exit(2);
  }
  const reasons = [];
  if (cost > LIMIT_USD) reasons.push(`total_cost_usd ${cost} > ${LIMIT_USD}`);
  if (outputTokens > LIMIT_OUTPUT_TOKENS) reasons.push(`output_tokens ${outputTokens} > ${LIMIT_OUTPUT_TOKENS}`);
  if (reasons.length > 0) {
    console.log(`FAIL | cost-gate | ${reasons.join('; ')}`);
    process.exit(2);
  }
  console.log(`PASS | cost-gate | total_cost_usd=${cost} output_tokens=${outputTokens}`);
}

main();
