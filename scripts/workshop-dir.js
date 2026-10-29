#!/usr/bin/env node
'use strict';

/**
 * Shared resolver for the workshop app path used by catch-up, verify-setup,
 * and check-solutions.
 *
 * Precedence (first win):
 *   1. process.env.WORKSHOP_DIR
 *   2. course-root `.env.local` → WORKSHOP_DIR=
 *   3. course-root `.env` → WORKSHOP_DIR=
 *   4. default `C:\dev\multi-agent-workshop`
 *
 * Prefer the default path in class so lab commands stay copy-pasteable.
 * Use `.env` / `.env.local` only when someone clones the workshop elsewhere.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_WORKSHOP_DIR = 'C:\\dev\\multi-agent-workshop';
const courseRoot = path.join(__dirname, '..');

/**
 * Parse a simple KEY=VALUE .env file (no export, no interpolation).
 *
 * @param {string} filePath Absolute path to the env file.
 * @returns {Record<string, string>}
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  /** @type {Record<string, string>} */
  const out = {};
  const text = fs.readFileSync(filePath, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"'))
      || (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

/**
 * Resolve the absolute workshop app directory.
 *
 * @returns {{ dir: string, source: 'env' | 'env.local' | '.env' | 'default' }}
 */
function resolveWorkshopDir() {
  const fromEnv = (process.env.WORKSHOP_DIR || '').trim();
  if (fromEnv) {
    return { dir: path.resolve(fromEnv), source: 'env' };
  }

  const local = loadEnvFile(path.join(courseRoot, '.env.local'));
  if ((local.WORKSHOP_DIR || '').trim()) {
    return { dir: path.resolve(local.WORKSHOP_DIR.trim()), source: 'env.local' };
  }

  const file = loadEnvFile(path.join(courseRoot, '.env'));
  if ((file.WORKSHOP_DIR || '').trim()) {
    return { dir: path.resolve(file.WORKSHOP_DIR.trim()), source: '.env' };
  }

  return { dir: DEFAULT_WORKSHOP_DIR, source: 'default' };
}

module.exports = {
  DEFAULT_WORKSHOP_DIR,
  resolveWorkshopDir,
};
