'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const logger   = require('../../logger');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body || {};
  const hash         = process.env.STUDIO_PASSWORD;

  if (!hash || !password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, hash);

  // Fixed 300 ms delay on failure to slow brute-force attempts
  if (!valid) {
    await new Promise((r) => setTimeout(r, 300));
    logger.warn('studio: failed login attempt');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.authenticated = true;
  logger.info('studio: successful login');
  return res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

module.exports = router;
