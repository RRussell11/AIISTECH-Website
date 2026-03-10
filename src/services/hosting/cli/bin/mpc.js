#!/usr/bin/env node
const { program } = require('commander');
const pkg         = require('../../package.json');

program
  .name('mpc')
  .description('Multiplic CLI — manage your multi-site Node.js server')
  .version(pkg.version);

program
  .command('add <domain>')
  .description('Add a new site to multiplic.json and scaffold sites/<folder>/')
  .option('-f, --framework <type>', 'react or angular', 'react')
  .option('-p, --path <subpath>',   'mount at subpath, e.g. /lambdaproof')
  .action(require('../commands/add'));

program
  .command('remove <domain>')
  .description('Remove a site from multiplic.json')
  .action(require('../commands/remove'));

program
  .command('status')
  .description('Show all sites, active SHA, last deployed')
  .action(require('../commands/status'));

program
  .command('deploy [site]')
  .description('Trigger manual sync on server (re-pull built branch)')
  .action(require('../commands/deploy'));

program
  .command('logs [site]')
  .description('Tail server logs filtered by site domain')
  .action(require('../commands/logs'));

program.parse();
