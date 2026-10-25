#!/usr/bin/env node
'use strict';

/**
 * TaskCompleted hook. Exit 2 sends the task back.
 * The reference payload is { "qualityGatePassed": true } after the gate exits 0.
 */

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  let payload = {};
  try {
    payload = raw.trim() ? JSON.parse(raw) : {};
  } catch (err) {
    process.stderr.write('TaskCompleted blocked: payload was not JSON\n');
    process.exit(2);
  }
  if (payload.qualityGatePassed === true) process.exit(0);
  process.stderr.write('TaskCompleted blocked: quality gate has not passed\n');
  process.exit(2);
});
