const express = require('express');
const path    = require('path');
const fs      = require('fs');

function buildRouter(config, hostname, reqPath) {
  const host     = hostname.replace(/^www\./, '');
  const segment  = reqPath.split('/').filter(Boolean)[0] || '';

  // Try subpath match first: citizengardens.org/lambdaproof
  const subKey   = `${host}/${segment}`;
  const entry    = config.sites[subKey] || config.sites[host];

  if (!entry) return null;

  // AIISTECH project nodes: only serve entries with status 'active' (or no aiistech namespace)
  if (entry.aiistech && entry.aiistech.status !== 'active') return null;

  const root     = path.resolve(__dirname, '..', entry.root, 'dist');
  if (!fs.existsSync(root)) return null;

  return (req, res, next) => {
    // Strip subpath prefix for subpath-mounted sites
    if (config.sites[subKey] && segment) {
      req.url = req.url.replace(`/${segment}`, '') || '/';
    }
    express.static(root)(req, res, () => {
      res.sendFile(path.join(root, 'index.html'));
    });
  };
}

module.exports = { buildRouter };
