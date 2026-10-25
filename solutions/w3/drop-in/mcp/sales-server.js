/**
 * sales-server.js — MCP stdio server for Workshop 3.
 * Tools: echo, lookup_province, shout.
 * stdout is JSON-RPC only.
 */
'use strict';

const readline = require('readline');

const SERVER_INFO = { name: 'sales-tools', version: '1.0.0' };

const PROVINCE_REGION = {
  เชียงใหม่: 'เหนือ',
  เชียงราย: 'เหนือ',
  ขอนแก่น: 'ตะวันออกเฉียงเหนือ',
  นครราชสีมา: 'ตะวันออกเฉียงเหนือ',
  กรุงเทพมหานคร: 'กลาง',
  นนทบุรี: 'กลาง',
  ชลบุรี: 'ตะวันออก',
  ระยอง: 'ตะวันออก',
  สุราษฎร์ธานี: 'ใต้',
  สงขลา: 'ใต้',
  กาญจนบุรี: 'ตะวันตก',
};

const TOOLS = [
  {
    name: 'echo',
    description: 'Echoes the given text back to the caller.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
  },
  {
    name: 'lookup_province',
    description: 'Returns the Thai sales region for a known province name.',
    inputSchema: {
      type: 'object',
      properties: { province: { type: 'string' } },
      required: ['province'],
    },
  },
  {
    name: 'shout',
    description: 'Returns the text in upper case.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
  },
];

function reply(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`);
}

function replyError(id, code, message) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } })}\n`);
}

function toolText(text) {
  return { content: [{ type: 'text', text }] };
}

function handle(req) {
  if (req.method === 'initialize') {
    return reply(req.id, {
      protocolVersion: req.params && req.params.protocolVersion ? req.params.protocolVersion : '2025-03-26',
      capabilities: { tools: {} },
      serverInfo: SERVER_INFO,
    });
  }
  if (req.method === 'notifications/initialized') return;
  if (req.method === 'ping') return reply(req.id, {});
  if (req.method === 'tools/list') return reply(req.id, { tools: TOOLS });
  if (req.method === 'tools/call') {
    const name = req.params && req.params.name;
    const args = (req.params && req.params.arguments) || {};
    if (name === 'echo') return reply(req.id, toolText(String(args.text ?? '')));
    if (name === 'shout') return reply(req.id, toolText(String(args.text ?? '').toUpperCase()));
    if (name === 'lookup_province') {
      const province = String(args.province ?? '').trim();
      const region = PROVINCE_REGION[province];
      if (!region) return reply(req.id, toolText('ไม่พบจังหวัด'));
      return reply(req.id, toolText(region));
    }
    return replyError(req.id, -32602, `Unknown tool: ${name}`);
  }
  if (req.id !== undefined) return replyError(req.id, -32601, `Unknown method: ${req.method}`);
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    handle(JSON.parse(trimmed));
  } catch (err) {
    process.stderr.write(`sales-server: bad message: ${err.message}\n`);
  }
});
