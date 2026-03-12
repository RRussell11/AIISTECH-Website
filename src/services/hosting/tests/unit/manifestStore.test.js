const path = require('path');
const os   = require('os');
const fs   = require('fs');

// Each test suite gets its own isolated multiplic.json to avoid collisions
function makeTmpConfig(sites) {
  const tmp = path.join(os.tmpdir(), `multiplic-test-${Date.now()}-${Math.random()}.json`);
  fs.writeFileSync(tmp, JSON.stringify({ version: 1, sites: sites || {} }, null, 2));
  return tmp;
}

describe('manifestStore', () => {
  let store;
  let tmpConfig;

  beforeEach(() => {
    tmpConfig = makeTmpConfig();
    process.env.MULTIPLIC_CONFIG_PATH = tmpConfig;
    jest.resetModules();
    store = require('../../server/provisioning/manifestStore');
  });

  afterEach(() => {
    delete process.env.MULTIPLIC_CONFIG_PATH;
    if (fs.existsSync(tmpConfig)) fs.unlinkSync(tmpConfig);
  });

  describe('domainForSlug', () => {
    test('generates <slug>.aiistech.com', () => {
      expect(store.domainForSlug('myproject')).toBe('myproject.aiistech.com');
    });
  });

  describe('getEntry', () => {
    test('returns null when slug does not exist', () => {
      expect(store.getEntry('nonexistent')).toBeNull();
    });

    test('returns entry when slug exists', async () => {
      await store.createPendingEntry({ slug: 'alpha', projectId: 'p1', tenantId: 't1', ownerId: 'u1' });
      const entry = store.getEntry('alpha');
      expect(entry).not.toBeNull();
      expect(entry.aiistech.status).toBe('pending');
    });
  });

  describe('createPendingEntry', () => {
    test('writes a pending entry to multiplic.json', async () => {
      await store.createPendingEntry({ slug: 'beta', projectId: 'p2', tenantId: 't2', ownerId: 'u2' });
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(config.sites['beta.aiistech.com']).toBeDefined();
      expect(config.sites['beta.aiistech.com'].aiistech.status).toBe('pending');
    });

    test('throws if slug already exists', async () => {
      await store.createPendingEntry({ slug: 'gamma', projectId: 'p3', tenantId: 't3', ownerId: 'u3' });
      await expect(
        store.createPendingEntry({ slug: 'gamma', projectId: 'p4', tenantId: 't4', ownerId: 'u4' })
      ).rejects.toThrow('already exists');
    });
  });

  describe('activateEntry', () => {
    test('sets status to active and records deployedAt', async () => {
      await store.createPendingEntry({ slug: 'delta', projectId: 'p5', tenantId: 't5', ownerId: 'u5' });
      await store.activateEntry('delta');
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(config.sites['delta.aiistech.com'].aiistech.status).toBe('active');
      expect(config.sites['delta.aiistech.com'].aiistech.deployedAt).not.toBeNull();
    });

    test('throws if slug does not exist', async () => {
      await expect(store.activateEntry('nosuchslug')).rejects.toThrow('does not exist');
    });
  });

  describe('setEntryStatus', () => {
    test('updates status field', async () => {
      await store.createPendingEntry({ slug: 'epsilon', projectId: 'p6', tenantId: 't6', ownerId: 'u6' });
      await store.setEntryStatus('epsilon', 'disabled');
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(config.sites['epsilon.aiistech.com'].aiistech.status).toBe('disabled');
    });
  });

  describe('removeEntry', () => {
    test('removes entry from multiplic.json', async () => {
      await store.createPendingEntry({ slug: 'zeta', projectId: 'p7', tenantId: 't7', ownerId: 'u7' });
      await store.removeEntry('zeta');
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(config.sites['zeta.aiistech.com']).toBeUndefined();
    });

    test('is a no-op if slug does not exist', async () => {
      await expect(store.removeEntry('nonexistent')).resolves.toBe(true);
    });
  });

  describe('assertSlugAvailable', () => {
    test('does not throw when slug is free', async () => {
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(() => store.assertSlugAvailable(config, 'free-slug')).not.toThrow();
    });

    test('throws when slug is taken', async () => {
      await store.createPendingEntry({ slug: 'taken', projectId: 'p8', tenantId: 't8', ownerId: 'u8' });
      const config = JSON.parse(fs.readFileSync(tmpConfig, 'utf8'));
      expect(() => store.assertSlugAvailable(config, 'taken')).toThrow('already exists');
    });
  });
});
