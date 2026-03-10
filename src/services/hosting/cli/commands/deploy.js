const crypto = require('crypto');
const https  = require('https');
const http   = require('http');

module.exports = function deploy(site, options) {
  const syncUrl    = process.env.SERVER_SYNC_URL;
  const syncSecret = process.env.SYNC_SECRET;

  if (!syncUrl || !syncSecret) {
    console.error('Missing SERVER_SYNC_URL or SYNC_SECRET environment variables');
    process.exit(1);
  }

  const payload = JSON.stringify({ site: site || 'all', manual: true });
  const sig     = 'sha256=' + crypto
    .createHmac('sha256', syncSecret)
    .update(payload)
    .digest('hex');

  const url     = new URL(`${syncUrl}/sync`);
  const lib     = url.protocol === 'https:' ? https : http;
  const reqOpts = {
    hostname: url.hostname,
    port:     url.port || (url.protocol === 'https:' ? 443 : 80),
    path:     url.pathname,
    method:   'POST',
    headers:  {
      'Content-Type':          'application/json',
      'Content-Length':        Buffer.byteLength(payload),
      'X-Hub-Signature-256':   sig
    }
  };

  const req = lib.request(reqOpts, (res) => {
    console.log(`✓ Sync triggered: HTTP ${res.statusCode}`);
  });
  req.on('error', (err) => {
    console.error('Deploy failed:', err.message);
    process.exit(1);
  });
  req.write(payload);
  req.end();
};
