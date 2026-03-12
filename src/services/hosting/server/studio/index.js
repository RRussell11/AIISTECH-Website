'use strict';

const express        = require('express');
const session        = require('express-session');
const path           = require('path');
const requireAuth    = require('./middleware/requireAuth');
const authRoutes     = require('./routes/authRoutes');
const fsRoutes       = require('./routes/fsRoutes');
const gitRoutes      = require('./routes/gitRoutes');
const terminalRoutes = require('./routes/terminalRoutes');
const aiRoutes       = require('./routes/aiRoutes');

const app = express();

// Body parsing
app.use(express.json());

// Session
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET environment variable is required when Studio is enabled');
}
app.use(
  session({
    secret:            sessionSecret,
    resave:            false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   86400000, // 24 hours
    },
  })
);

// Public routes (no auth required)
app.use('/auth', authRoutes);

// Serve login page (static)
app.get('/login', (req, res) => {
  const distIndex = path.join(__dirname, '../../sites/multiplic-studio/dist/index.html');
  res.sendFile(distIndex);
});

// Auth-gated static frontend
const studioDistPath = path.join(__dirname, '../../sites/multiplic-studio/dist');
app.use(requireAuth, express.static(studioDistPath));

// Auth-gated API routes
app.use('/api/fs',       requireAuth, fsRoutes);
app.use('/api/git',      requireAuth, gitRoutes);
app.use('/api/terminal', requireAuth, terminalRoutes);
app.use('/api/ai',       requireAuth, aiRoutes);

// SPA fallback (auth-gated)
app.get('*', requireAuth, (req, res) => {
  const distIndex = path.join(__dirname, '../../sites/multiplic-studio/dist/index.html');
  res.sendFile(distIndex);
});

module.exports = app;
