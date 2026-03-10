const fs   = require('fs');
const path = require('path');

function loadConfig(configPath) {
  const file = configPath || path.resolve(__dirname, '..', 'multiplic.json');
  if (!fs.existsSync(file)) throw new Error(`multiplic.json not found at ${file}`);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  validate(raw);
  return raw;
}

function validate(config) {
  if (!config.version) throw new Error('multiplic.json: missing version field');
  if (!config.sites || typeof config.sites !== 'object')
    throw new Error('multiplic.json: missing sites object');
  for (const [key, entry] of Object.entries(config.sites)) {
    if (!entry.root)      throw new Error(`site "${key}": missing root`);
    if (!entry.framework) throw new Error(`site "${key}": missing framework`);
  }
}

module.exports = { loadConfig };
