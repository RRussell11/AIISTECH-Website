const fs   = require('fs');
const path = require('path');

module.exports = function remove(domain, options) {
  const configPath = path.resolve(process.cwd(), 'multiplic.json');
  const config     = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (!config.sites[domain]) {
    console.error(`Site "${domain}" not found in multiplic.json`);
    process.exit(1);
  }

  delete config.sites[domain];
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✓ Removed ${domain} from multiplic.json`);
  console.log(`  Note: sites folder not deleted. Remove manually if desired.`);
};
