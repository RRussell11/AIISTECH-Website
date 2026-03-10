const fs = require('fs');
const path = require('path');

const defaultStorePath = path.resolve(__dirname, 'dns-records.mock.json');

function loadRecords(storePath) {
  if (!fs.existsSync(storePath)) {
    return { records: {} };
  }
  return JSON.parse(fs.readFileSync(storePath, 'utf8'));
}

function saveRecords(storePath, data) {
  const tempPath = `${storePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
  fs.renameSync(tempPath, storePath);
}

function createMockProvider() {
  const storePath = process.env.MOCK_DNS_RECORDS_PATH || defaultStorePath;

  return {
    async createCname(fqdn, target) {
      const data = loadRecords(storePath);
      if (data.records[fqdn]) {
        throw new Error(`DNS record already exists for ${fqdn}`);
      }
      data.records[fqdn] = { type: 'CNAME', target, createdAt: new Date().toISOString() };
      saveRecords(storePath, data);
      return data.records[fqdn];
    },

    async deleteCname(fqdn) {
      const data = loadRecords(storePath);
      if (data.records[fqdn]) {
        delete data.records[fqdn];
        saveRecords(storePath, data);
      }
      return true;
    },

    async getCname(fqdn) {
      const data = loadRecords(storePath);
      return data.records[fqdn] || null;
    },
  };
}

function createDnsAdapter() {
  const provider = (process.env.DNS_PROVIDER || 'mock').toLowerCase();

  if (provider === 'mock') {
    return createMockProvider();
  }

  throw new Error(`Unsupported DNS_PROVIDER "${provider}". Use "mock" for now.`);
}

module.exports = { createDnsAdapter };
