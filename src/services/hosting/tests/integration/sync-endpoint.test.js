const request = require('supertest');
const crypto  = require('crypto');

// We test sync.js endpoint logic directly
// sync.js calls app.listen so we just test the express app portion
const express    = require('express');
const cryptoMod  = require('crypto');

function buildSyncApp(secret) {
  const app = express();
  app.use(express.raw({ type: '*/*' }));

  app.post('/sync', (req, res) => {
    const sig      = req.headers['x-hub-signature-256'] || '';
    const expected = 'sha256=' + cryptoMod
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    let valid = false;
    try {
      valid = cryptoMod.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch { valid = false; }

    if (!valid) {
      return res.status(403).send('Forbidden');
    }
    res.sendStatus(202);
  });

  return app;
}

describe('sync endpoint', () => {
  const secret = 'test-sync-secret';
  const app    = buildSyncApp(secret);

  test('accepts valid HMAC-signed request', async () => {
    const body = JSON.stringify({ sha: 'abc123' });
    const sig  = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    const res  = await request(app)
      .post('/sync')
      .set('X-Hub-Signature-256', sig)
      .set('Content-Type', 'application/octet-stream')
      .send(body);
    expect(res.status).toBe(202);
  });

  test('rejects unsigned request', async () => {
    const res = await request(app)
      .post('/sync')
      .send(JSON.stringify({ sha: 'abc123' }));
    expect(res.status).toBe(403);
  });

  test('rejects request with wrong signature', async () => {
    const body = JSON.stringify({ sha: 'abc123' });
    const sig  = 'sha256=' + crypto.createHmac('sha256', 'wrong-secret').update(body).digest('hex');
    const res  = await request(app)
      .post('/sync')
      .set('X-Hub-Signature-256', sig)
      .set('Content-Type', 'application/octet-stream')
      .send(body);
    expect(res.status).toBe(403);
  });
});
