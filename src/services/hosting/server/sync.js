const express    = require('express');
const crypto     = require('crypto');
const { execFile } = require('child_process');
const logger     = require('./logger');

const app = express();
app.use(express.raw({ type: '*/*' }));   // raw body for HMAC

// Simple in-memory rate limiter: max 10 requests per minute per IP
const rateLimitWindow = 60 * 1000;
const rateLimitMax    = 10;
const rateLimitMap    = new Map();

function rateLimit(req, res, next) {
  const ip  = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const rec = rateLimitMap.get(ip) || { count: 0, reset: now + rateLimitWindow };

  if (now > rec.reset) {
    rec.count = 0;
    rec.reset = now + rateLimitWindow;
  }
  rec.count += 1;
  rateLimitMap.set(ip, rec);

  if (rec.count > rateLimitMax) {
    logger.warn({ ip }, 'sync: rate limit exceeded');
    return res.status(429).send('Too Many Requests');
  }
  next();
}

app.post('/sync', rateLimit, (req, res) => {
  const sig      = req.headers['x-hub-signature-256'] || '';
  const secret   = process.env.SYNC_SECRET;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { valid = false; }

  if (!valid) {
    logger.warn('sync: rejected unsigned request');
    return res.status(403).send('Forbidden');
  }

  res.sendStatus(202);  // respond immediately, don't block Actions runner

  const repoPath = process.env.MULTIPLIC_REPO_PATH || '/var/www/multiplic';
  execFile('git', ['-C', repoPath, 'pull', 'origin', 'built'], (err, stdout, stderr) => {
    if (err) logger.error({ err, stderr }, 'sync: git pull failed');
    else     logger.info({ stdout }, 'sync: pulled built branch');
  });
});

const port = process.env.SYNC_PORT || 9000;
app.listen(port, () => logger.info({ port }, 'multiplic sync listener started'));
