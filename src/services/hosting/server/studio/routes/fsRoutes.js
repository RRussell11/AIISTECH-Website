'use strict';

const express                    = require('express');
const { listDir, readFile, writeFile } = require('../services/fileSystem');

const router = express.Router();

router.get('/list', (req, res) => {
  try {
    const entries = listDir(req.query.path || '');
    res.json(entries);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/read', (req, res) => {
  try {
    const content = readFile(req.query.path);
    res.json({ content });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.put('/write', (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    writeFile(filePath, content);
    res.json({ ok: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
