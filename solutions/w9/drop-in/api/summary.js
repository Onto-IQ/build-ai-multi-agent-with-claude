'use strict';

const fs = require('fs');
const path = require('path');
const { parseCsv } = require('../lib/csv');
const { buildSummary } = require('../lib/summary');

const CSV_PATH = path.join(__dirname, '..', 'data', 'dataset.csv');

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(payload);
}

function handler(req, res) {
  try {
    const { records } = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'));
    send(res, 200, buildSummary(records));
  } catch (err) {
    console.error(err);
    send(res, 500, { error: 'SUMMARY_FAILED' });
  }
}

module.exports = handler;
