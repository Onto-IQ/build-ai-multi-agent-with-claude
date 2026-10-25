'use strict';

const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'drop-in', 'mcp', 'sales-server.js');
const child = spawn(process.execPath, [serverPath], { stdio: ['pipe', 'pipe', 'pipe'] });
let stderr = '';
let buffer = '';
const pending = [];

child.stderr.on('data', (chunk) => {
  stderr += chunk;
});
child.stdout.on('data', (chunk) => {
  buffer += chunk.toString('utf8');
  let nl = buffer.indexOf('\n');
  while (nl !== -1) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (line && pending.length > 0) pending.shift()(line);
    nl = buffer.indexOf('\n');
  }
});

function send(message) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout waiting for id ${message.id}`)), 4000);
    pending.push((line) => {
      clearTimeout(timer);
      resolve(JSON.parse(line));
    });
    child.stdin.write(`${JSON.stringify(message)}\n`);
  });
}

function fail(message) {
  console.log(`FAIL | ${message}`);
  child.kill();
  process.exit(1);
}

async function main() {
  const init = await send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } });
  if (!init.result || !init.result.serverInfo) fail('initialize');
  console.log('PASS | initialize');
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);

  const listed = await send({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  const names = (listed.result.tools || []).map((tool) => tool.name).sort();
  const expected = ['echo', 'lookup_province', 'shout'];
  if (names.join() !== expected.join()) fail(`tools/list got ${names.join(',')}`);
  console.log('PASS | tools/list');

  const thai = 'สวัสดี — ทดสอบ ก-ฮ ๐๑๒๓';
  const echoed = await send({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: { name: 'echo', arguments: { text: thai } },
  });
  const echoText = echoed.result && echoed.result.content && echoed.result.content[0].text;
  if (echoText !== thai) fail(`echo mismatch ${echoText}`);
  console.log('PASS | echo thai');

  const looked = await send({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: { name: 'lookup_province', arguments: { province: 'เชียงใหม่' } },
  });
  const region = looked.result.content[0].text;
  if (region !== 'เหนือ') fail(`lookup ${region}`);
  console.log('PASS | lookup_province');

  const shouted = await send({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: { name: 'shout', arguments: { text: 'hello-sales' } },
  });
  if (shouted.result.content[0].text !== 'HELLO-SALES') fail('shout');
  console.log('PASS | shout');

  if (stderr.includes('{')) fail('stderr leaked json');
  console.log('PASS | stderr has no json');
  child.kill();
  console.log('w3 check: passed');
}

main().catch((err) => fail(err.stack || err.message));
