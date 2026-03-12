'use strict';

const fs   = require('fs');
const path = require('path');

const REPO_ROOT = process.env.MULTIPLIC_REPO_PATH
  ? path.resolve(process.env.MULTIPLIC_REPO_PATH)
  : path.resolve(__dirname, '../../..');

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

const DENY_PATTERNS = [
  /^\.env(\.|$)/i,        // .env, .env.local, etc.
  /^\.git(\/|$)/,         // .git directory
  /node_modules(\/|$)/,   // node_modules at any depth
];

function assertSafePath(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    const err = new Error('Invalid path');
    err.status = 400;
    throw err;
  }

  // Reject raw ../ traversal before any resolution
  const segments = userInput.split(/[/\\]/);
  if (segments.some((s) => s === '..')) {
    const err = new Error('Path traversal rejected');
    err.status = 403;
    throw err;
  }

  const abs = path.resolve(REPO_ROOT, userInput);

  // startsWith check (abs must be inside REPO_ROOT)
  const rootWithSep = REPO_ROOT.endsWith(path.sep)
    ? REPO_ROOT
    : REPO_ROOT + path.sep;
  if (abs !== REPO_ROOT && !abs.startsWith(rootWithSep)) {
    const err = new Error('Path outside repository root');
    err.status = 403;
    throw err;
  }

  // Symlink resolution (re-check after resolving)
  let real;
  try {
    real = fs.realpathSync(abs);
  } catch {
    // Path does not exist yet (e.g. new file write) — skip symlink check
    real = abs;
  }
  if (real !== REPO_ROOT && !real.startsWith(rootWithSep)) {
    const err = new Error('Symlink escapes repository root');
    err.status = 403;
    throw err;
  }

  // Deny-list check against the relative portion
  const rel = path.relative(REPO_ROOT, real);
  for (const pattern of DENY_PATTERNS) {
    if (pattern.test(rel) || pattern.test(path.basename(rel))) {
      const err = new Error('Access to this path is denied');
      err.status = 403;
      throw err;
    }
  }

  return real;
}

function listDir(userInput) {
  const safePath = assertSafePath(userInput || '.');
  const entries = fs.readdirSync(safePath, { withFileTypes: true });
  return entries
    .filter((entry) => {
      const rel = path.relative(REPO_ROOT, path.join(safePath, entry.name));
      return !DENY_PATTERNS.some((p) => p.test(rel) || p.test(entry.name));
    })
    .map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file',
      path: path.join(path.relative(REPO_ROOT, safePath), entry.name),
    }));
}

function readFile(userInput) {
  const safePath = assertSafePath(userInput);
  const stat = fs.statSync(safePath);
  if (stat.size > FILE_SIZE_LIMIT) {
    const err = new Error('File too large');
    err.status = 413;
    throw err;
  }
  return fs.readFileSync(safePath, 'utf8');
}

function writeFile(userInput, content) {
  const safePath = assertSafePath(userInput);
  fs.writeFileSync(safePath, content, 'utf8');
}

module.exports = { assertSafePath, listDir, readFile, writeFile, REPO_ROOT };
