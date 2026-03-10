const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

module.exports = function status() {
  const configPath = path.resolve(process.cwd(), 'multiplic.json');
  const config     = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  console.log('Multiplic sites status\n');
  console.log(
    'Domain'.padEnd(40),
    'Framework'.padEnd(12),
    'Root'.padEnd(45),
    'Dist'
  );
  console.log('─'.repeat(105));

  for (const [key, entry] of Object.entries(config.sites)) {
    const distPath = path.resolve(process.cwd(), entry.root, 'dist');
    const distExists = fs.existsSync(distPath) ? '✓' : '✗';
    console.log(
      key.padEnd(40),
      entry.framework.padEnd(12),
      entry.root.padEnd(45),
      distExists
    );
  }
};
