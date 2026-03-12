'use strict';

const express            = require('express');
const { getProvider }    = require('../services/aiProvider');
const { readFile }       = require('../services/fileSystem');
const { loadConfig }     = require('../../config');

const router = express.Router();

// Rate limiter: 30 requests per minute per session
const rateMap     = new Map();
const RATE_WINDOW = 60 * 1000;
const RATE_LIMIT  = 30;

function rateLimit(req, res, next) {
  const key = req.session.id;
  const now = Date.now();
  const rec = rateMap.get(key) || { count: 0, reset: now + RATE_WINDOW };
  if (now > rec.reset) {
    rec.count = 0;
    rec.reset = now + RATE_WINDOW;
  }
  rec.count++;
  rateMap.set(key, rec);
  if (rec.count > RATE_LIMIT) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
}

router.get('/stream', rateLimit, async (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const userMessage = req.query.message || '';
  const filePath    = req.query.file;

  // Build system context
  let systemContent =
    'You are Multiplic Studio AI, a coding assistant for the Multiplic platform.';

  // Inject current file content
  if (filePath) {
    try {
      const content = readFile(filePath);
      systemContent += `\n\nCurrent file (${filePath}):\n\`\`\`\n${content}\n\`\`\``;
    } catch { /* file unreadable or out of scope — omit */ }
  }

  // Inject compact multiplic.json summary
  try {
    const config      = loadConfig();
    const siteSummary = Object.entries(config.sites)
      .map(([k, v]) => `${k}: ${v.framework}${v.wpBase ? ` (wpBase: ${v.wpBase})` : ''}`)
      .join(', ');
    systemContent += `\n\nRepository sites: ${siteSummary}`;
  } catch { /* config unreadable — omit */ }

  const messages = [
    { role: 'system', content: systemContent },
    { role: 'user',   content: userMessage },
  ];

  try {
    const provider = getProvider();
    await provider.stream(messages, res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

module.exports = router;
