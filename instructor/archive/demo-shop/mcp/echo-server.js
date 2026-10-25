/**
 * echo-server.js — Minimal MCP stdio server (teaching artifact for VIBE-CODE-L2)
 *
 * MCP over stdio = newline-delimited JSON-RPC 2.0 on stdin/stdout.
 * Implements: initialize, notifications/initialized, tools/list, tools/call.
 * Exposes ONE tool: echo(text) -> text
 *
 * IRON RULE: stdout is the protocol channel. Never console.log anything else here.
 * Debug output goes to stderr.
 */
const readline = require('readline');

const SERVER_INFO = { name: 'shop-echo', version: '1.0.0' };

const TOOLS = [
  {
    name: 'echo',
    description: 'Echoes the given text back to the caller. Use to verify the MCP connection works.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string', description: 'Text to echo back' } },
      required: ['text'],
    },
  },
];

function reply(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function replyError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

function handle(req) {
  if (req.method === 'initialize') {
    return reply(req.id, {
      protocolVersion: req.params && req.params.protocolVersion ? req.params.protocolVersion : '2025-03-26',
      capabilities: { tools: {} },
      serverInfo: SERVER_INFO,
    });
  }
  if (req.method === 'notifications/initialized') return; // notification: no reply
  if (req.method === 'ping') return reply(req.id, {});
  if (req.method === 'tools/list') return reply(req.id, { tools: TOOLS });
  if (req.method === 'tools/call') {
    const { name, arguments: args } = req.params || {};
    if (name === 'echo') {
      const text = String((args && args.text) ?? '');
      return reply(req.id, { content: [{ type: 'text', text }] });
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
    process.stderr.write(`echo-server: bad message: ${err.message}\n`);
  }
});
