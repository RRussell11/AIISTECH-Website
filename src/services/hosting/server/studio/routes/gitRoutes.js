'use strict';

const express = require('express');
const git     = require('../services/gitOperations');

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    res.json(await git.status());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/diff', async (req, res) => {
  try {
    res.json({ diff: await git.diff(req.query.path) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/commit', async (req, res) => {
  try {
    res.json(await git.commit(req.body.message));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/push', async (req, res) => {
  try {
    res.json(await git.push());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
