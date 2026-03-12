'use strict';

const express  = require('express');
const termMgr  = require('../services/terminalManager');

const router = express.Router();

router.post('/create', (req, res) => {
  try {
    const { id } = termMgr.create();
    res.json({ id });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  termMgr.kill(req.params.id);
  res.sendStatus(204);
});

// WebSocket upgrade handler — attached to the HTTP server externally
function attachWebSocket(server) {
  const { WebSocketServer } = require('ws');
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    if (!request.url.startsWith('/_studio/api/terminal/')) return;
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws, req) => {
    const id      = req.url.split('/').pop();
    const session = termMgr.get(id);
    if (!session) {
      ws.close(4004, 'Terminal session not found');
      return;
    }

    const { pty: ptyProcess } = session;

    // PTY → browser
    ptyProcess.onData((data) => {
      if (ws.readyState === ws.OPEN) ws.send(Buffer.from(data));
    });

    // Browser → PTY
    ws.on('message', (msg) => {
      if (typeof msg === 'string') {
        try {
          const cmd = JSON.parse(msg);
          if (cmd.cols && cmd.rows) termMgr.resize(id, cmd.cols, cmd.rows);
        } catch { /* ignore non-JSON */ }
      } else {
        ptyProcess.write(msg.toString());
      }
    });

    ws.on('close', () => termMgr.kill(id));

    ptyProcess.onExit(() => {
      if (ws.readyState === ws.OPEN) ws.close(1000, 'Process exited');
    });
  });
}

module.exports = router;
module.exports.attachWebSocket = attachWebSocket;
