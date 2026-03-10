const crypto = require('crypto');

function validateSignature(body, sig, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}

describe('HMAC validation', () => {
  const secret = 'test-secret-123';

  test('accepts valid signature', () => {
    const body = JSON.stringify({ sha: 'abc123' });
    const sig  = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    expect(validateSignature(body, sig, secret)).toBe(true);
  });

  test('rejects tampered body', () => {
    const body    = JSON.stringify({ sha: 'abc123' });
    const tampered = JSON.stringify({ sha: 'evil' });
    const sig     = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
    expect(validateSignature(tampered, sig, secret)).toBe(false);
  });

  test('rejects wrong secret', () => {
    const body = JSON.stringify({ sha: 'abc123' });
    const sig  = 'sha256=' + crypto.createHmac('sha256', 'wrong').update(body).digest('hex');
    expect(validateSignature(body, sig, secret)).toBe(false);
  });

  test('rejects missing signature', () => {
    expect(validateSignature('body', '', secret)).toBe(false);
  });
});
