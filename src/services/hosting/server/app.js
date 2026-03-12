const express  = require('express');
const path     = require('path');
const { buildRouter } = require('./router');
const { loadConfig }  = require('./config');
const logger   = require('./logger');

const app = express();
app.use(express.json());

// Multiplic Studio — opt-in developer environment (only loaded when STUDIO_PASSWORD is set)
if (process.env.STUDIO_PASSWORD) {
  const studio = require('./studio');
  app.use('/_studio', studio);
}

const config = loadConfig();

app.use((req, res, next) => {
  const handler = buildRouter(config, req.hostname, req.path);
  if (!handler) {
    logger.warn({ hostname: req.hostname, path: req.path }, 'no site matched');
    return res.status(404).send('Site not found');
  }
  handler(req, res, next);
});

module.exports = app;
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => logger.info({ port }, 'multiplic server started'));
}
