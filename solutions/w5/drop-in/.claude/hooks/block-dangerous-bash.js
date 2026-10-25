#!/usr/bin/env node
'use strict';

/**
 * PreToolUse hook. Exit 2 blocks the tool call.
 * Claude Code sends a JSON payload on stdin.
 */

function isDangerous(command) {
  const text = String(command || '');
  if (/\btaskkill\b/i.test(text)) return true;
  if (/\bRemove-Item\b/i.test(text) && /Recurse/i.test(text)) return true;
  if (/\brm\b/.test(text) && /(?:^|\s)-[a-zA-Z]*r[a-zA-Z]*f|(?:^|\s)-[a-zA-Z]*f[a-zA-Z]*r/.test(text)) return true;
  if (/\|\s*(?:ba)?sh\b/.test(text)) return true;
  return false;
}

function commandFrom(payload) {
  if (!payload || typeof payload !== 'object') return '';
  if (payload.tool_input && typeof payload.tool_input.command === 'string') return payload.tool_input.command;
  if (typeof payload.command === 'string') return payload.command;
  return '';
}

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
    process.stderr.write('hook ignored malformed payload\n');
    process.exit(0);
  }
  const command = commandFrom(payload);
  if (isDangerous(command)) {
    process.stderr.write(`blocked dangerous command: ${command}\n`);
    process.exit(2);
  }
  process.exit(0);
});
