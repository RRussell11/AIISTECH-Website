const path = require('path');
const os   = require('os');
const fs   = require('fs');

function makeTmpDnsPath() {
  return path.join(os.tmpdir(), `dns-${Date.now()}-${Math.random()}.json`);
}

describe('dnsAdapter (mock provider)', () => {
  let adapter;
  let dnsPath;

  beforeEach(() => {
    dnsPath = makeTmpDnsPath();
    process.env.DNS_PROVIDER = 'mock';
    process.env.MOCK_DNS_RECORDS_PATH = dnsPath;
    jest.resetModules();
    const { createDnsAdapter } = require('../../server/provisioning/dnsAdapter');
    adapter = createDnsAdapter();
  });

  afterEach(() => {
    delete process.env.DNS_PROVIDER;
    delete process.env.MOCK_DNS_RECORDS_PATH;
    if (fs.existsSync(dnsPath)) fs.unlinkSync(dnsPath);
  });

  test('createCname persists a new CNAME record', async () => {
    const record = await adapter.createCname('app.example.com', 'multiplic.local');
    expect(record.type).toBe('CNAME');
    expect(record.target).toBe('multiplic.local');

    const data = JSON.parse(fs.readFileSync(dnsPath, 'utf8'));
    expect(data.records['app.example.com']).toBeDefined();
  });

  test('createCname throws if record already exists', async () => {
    await adapter.createCname('dup.example.com', 'multiplic.local');
    await expect(adapter.createCname('dup.example.com', 'multiplic.local')).rejects.toThrow(
      'already exists'
    );
  });

  test('getCname returns null for unknown domain', async () => {
    const record = await adapter.getCname('unknown.example.com');
    expect(record).toBeNull();
  });

  test('getCname returns the record after creation', async () => {
    await adapter.createCname('get.example.com', 'multiplic.local');
    const record = await adapter.getCname('get.example.com');
    expect(record).not.toBeNull();
    expect(record.type).toBe('CNAME');
  });

  test('deleteCname removes an existing record', async () => {
    await adapter.createCname('del.example.com', 'multiplic.local');
    await adapter.deleteCname('del.example.com');
    const data = JSON.parse(fs.readFileSync(dnsPath, 'utf8'));
    expect(data.records['del.example.com']).toBeUndefined();
  });

  test('deleteCname is a no-op for a non-existent record', async () => {
    await expect(adapter.deleteCname('missing.example.com')).resolves.toBe(true);
  });

  test('creates records store file on first write when it does not exist', async () => {
    expect(fs.existsSync(dnsPath)).toBe(false);
    await adapter.createCname('new.example.com', 'target.local');
    expect(fs.existsSync(dnsPath)).toBe(true);
  });
});

describe('dnsAdapter (unsupported provider)', () => {
  test('throws for an unknown provider name', () => {
    process.env.DNS_PROVIDER = 'cloudflare';
    jest.resetModules();
    const { createDnsAdapter } = require('../../server/provisioning/dnsAdapter');
    expect(() => createDnsAdapter()).toThrow('Unsupported DNS_PROVIDER');
    delete process.env.DNS_PROVIDER;
  });
});
