const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_PATH = path.resolve(__dirname, '..', '..', 'multiplic.json');
let writeQueue = Promise.resolve();

function getConfigPath() {
  return process.env.MULTIPLIC_CONFIG_PATH || DEFAULT_CONFIG_PATH;
}

function loadConfig() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    throw new Error(`multiplic.json not found at ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function saveConfig(config) {
  const configPath = getConfigPath();
  const tempPath = `${configPath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(config, null, 2));
  fs.renameSync(tempPath, configPath);
}

function withConfigWrite(fn) {
  writeQueue = writeQueue.then(async () => {
    const config = loadConfig();
    const result = await fn(config);
    saveConfig(config);
    return result;
  });
  return writeQueue;
}

function domainForSlug(slug) {
  return `${slug}.aiistech.com`;
}

function assertSlugAvailable(config, slug) {
  const key = domainForSlug(slug);
  const existing = config.sites[key];
  if (existing) {
    throw new Error(`Manifest entry already exists for ${key}`);
  }
}

function assertSlugExists(config, slug) {
  const key = domainForSlug(slug);
  if (!config.sites[key]) {
    throw new Error(`Manifest entry does not exist for ${key}`);
  }
}

function createPendingEntry({ slug, projectId, tenantId, ownerId }) {
  return withConfigWrite(async (config) => {
    assertSlugAvailable(config, slug);
    const key = domainForSlug(slug);
    config.sites[key] = {
      root: `sites/${key}`,
      framework: 'react',
      description: `AIISTECH project ${slug}`,
      aiistech: {
        type: 'project',
        projectId,
        tenantId,
        ownerId,
        status: 'pending',
        deployedAt: null,
      },
    };
    return config.sites[key];
  });
}

function activateEntry(slug) {
  return withConfigWrite(async (config) => {
    assertSlugExists(config, slug);
    const key = domainForSlug(slug);
    config.sites[key].aiistech = config.sites[key].aiistech || {};
    config.sites[key].aiistech.status = 'active';
    config.sites[key].aiistech.deployedAt = new Date().toISOString();
    return config.sites[key];
  });
}

function setEntryStatus(slug, status) {
  return withConfigWrite(async (config) => {
    assertSlugExists(config, slug);
    const key = domainForSlug(slug);
    config.sites[key].aiistech = config.sites[key].aiistech || {};
    config.sites[key].aiistech.status = status;
    return config.sites[key];
  });
}

function removeEntry(slug) {
  return withConfigWrite(async (config) => {
    const key = domainForSlug(slug);
    if (config.sites[key]) {
      delete config.sites[key];
    }
    return true;
  });
}

function getEntry(slug) {
  const config = loadConfig();
  return config.sites[domainForSlug(slug)] || null;
}

module.exports = {
  domainForSlug,
  getEntry,
  createPendingEntry,
  activateEntry,
  setEntryStatus,
  removeEntry,
  assertSlugAvailable,
};
