const { spawn } = require('child_process');

module.exports = function logs(site, options) {
  const args = ['logs', '--lines', '100'];
  if (site) {
    console.log(`Tailing logs for site: ${site}\n`);
  } else {
    console.log('Tailing all multiplic logs\n');
  }

  const pm2 = spawn('pm2', args, { stdio: 'pipe' });

  pm2.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (!site || line.includes(site)) {
        process.stdout.write(line + '\n');
      }
    }
  });

  pm2.stderr.on('data', (data) => process.stderr.write(data));
  pm2.on('close', (code) => process.exit(code));
};
