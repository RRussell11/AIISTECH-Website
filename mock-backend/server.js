const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { randomUUID } = require('crypto');
const {
  startProvisioningSaga,
  startTeardownSaga,
  getSagaRunStatus,
} = require('../src/services/hosting/server/provisioning/saga');

const app = express();
const PORT = 3001;

// ── Secrets: always load from env; fall back to dev-only defaults ─────────────
const JWT_SECRET          = process.env.JWT_SECRET          || 'dev-only-jwt-secret-CHANGE-IN-PROD';
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET  || 'dev-only-refresh-secret-CHANGE-IN-PROD';
const NODE_ENV            = process.env.NODE_ENV            || 'development';
const IS_PROD             = NODE_ENV === 'production';

// ── CORS: dynamic origin validator for all *.aiistech.com subdomains ──────────
const AIISTECH_ORIGIN = /^https:\/\/([a-z0-9-]+\.)?aiistech\.com$/;
const DEV_ORIGINS     = ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl / server-to-server
    if (!IS_PROD && DEV_ORIGINS.includes(origin)) return callback(null, true);
    if (AIISTECH_ORIGIN.test(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Mock user database
const users = {
  'exec@aiistech.com': {
    id: '1',
    email: 'exec@aiistech.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Executive',
    role: 'EXECUTIVE',
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'finance@aiistech.com': {
    id: '2',
    email: 'finance@aiistech.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Finance',
    role: 'FINANCE',
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'ops@aiistech.com': {
    id: '3',
    email: 'ops@aiistech.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Operations',
    role: 'OPERATIONS',
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'it@aiistech.com': {
    id: '4',
    email: 'it@aiistech.com',
    password: 'password123',
    firstName: 'Alice',
    lastName: 'Tech',
    role: 'IT',
    tenantId: 'tenant-1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// ── Projects store (in-memory; replace with DB in production) ─────────────────
const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

const projects = {};  // keyed by slug

const dashboardSummaryByRole = {
  EXECUTIVE: [
    { id: 'cost-savings-ytd', label: 'Cost Savings YTD', value: '$1.2M', delta: '+12%', trend: 'up', severity: 'success' },
    { id: 'revenue-psa', label: 'Revenue (PSA)', value: '$4.8M', delta: '+5%', trend: 'up', severity: 'success' },
    { id: 'automation-rate', label: 'Automation Rate', value: '68%', delta: '+3%', trend: 'up', severity: 'success' },
    { id: 'compliance-score', label: 'Compliance Score', value: '94', delta: '-1', trend: 'down', severity: 'warn' }
  ],
  FINANCE: [
    { id: 'finance-revenue', label: 'Revenue', value: '$4.8M', delta: '+5%', trend: 'up', severity: 'success' },
    { id: 'finance-savings', label: 'Cost Savings', value: '$1.2M', delta: '+12%', trend: 'up', severity: 'success' },
    { id: 'finance-fte', label: 'FTE Hours Freed', value: '12400', delta: '+800', trend: 'up', severity: 'success' },
    { id: 'finance-roi', label: 'ROI', value: '3.4x', delta: '+0.2', trend: 'up', severity: 'success' }
  ],
  OPERATIONS: [
    { id: 'ops-volume', label: 'Process Volume', value: '34200', delta: '+8%', trend: 'up', severity: 'success' },
    { id: 'ops-cycle', label: 'Cycle Time', value: '4.2m', delta: '-0.4m', trend: 'up', severity: 'success' },
    { id: 'ops-success', label: 'Success Rate', value: '98.5%', delta: '+0.6%', trend: 'up', severity: 'success' },
    { id: 'ops-uptime', label: 'Bot Uptime', value: '99.8%', delta: '+0.1%', trend: 'up', severity: 'success' }
  ],
  IT: [
    { id: 'it-uptime', label: 'Bot Uptime', value: '99.8%', delta: '+0.1%', trend: 'up', severity: 'success' },
    { id: 'it-errors', label: 'Error Rate', value: '1.2%', delta: '+0.4%', trend: 'down', severity: 'warn' },
    { id: 'it-health', label: 'System Health', value: 'Optimal', delta: 'steady', trend: 'neutral', severity: 'success' },
    { id: 'it-alerts', label: 'Active Alerts', value: '3', delta: '+1', trend: 'down', severity: 'warn' }
  ]
};

// Helper function to generate tokens
function getProjectSlugsForUser(userId) {
  return Object.values(projects)
    .filter(p => p.ownerId === userId && p.status === 'deployed')
    .map(p => p.slug);
}

function generateTokens(user) {
  const userPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    projects: getProjectSlugsForUser(user.id),
  };

  const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(userPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

// Helper function to get user without password
function getUserWithoutPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Cookie-first (production); fall back to Bearer for dev/testing
  const token = req.cookies.access_token ||
    (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ── Cookie helpers ────────────────────────────────────────────────────────────
const ACCESS_COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? 'none' : 'lax',
  domain: IS_PROD ? '.aiistech.com' : undefined,
  maxAge: 15 * 60 * 1000,          // 15 minutes
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? 'none' : 'lax',
  domain: IS_PROD ? '.aiistech.com' : undefined,
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Routes

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log(`[LOGIN] Attempt for ${email}`);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = users[email];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  const userWithoutPassword = getUserWithoutPassword(user);

  console.log(`[LOGIN] Success for ${email} (${user.role})`);

  res
    .cookie('access_token', accessToken, ACCESS_COOKIE_OPTS)
    .cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTS)
    .json({ user: userWithoutPassword });
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refresh_token || req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const userEmail = user.email;
    const userData = users[userEmail];

    if (!userData) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(userData);

    console.log(`[REFRESH] Token refreshed for ${userEmail}`);

    res
      .cookie('access_token', accessToken, ACCESS_COOKIE_OPTS)
      .cookie('refresh_token', newRefresh, REFRESH_COOKIE_OPTS)
      .json({ message: 'Token refreshed' });
  });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const userEmail = req.user.email;
  const user = users[userEmail];

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userWithoutPassword = getUserWithoutPassword(user);

  console.log(`[GET ME] User info for ${userEmail}`);

  res.json(userWithoutPassword);
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const clearOpts = { httpOnly: true, secure: IS_PROD, sameSite: IS_PROD ? 'none' : 'lax', domain: IS_PROD ? '.aiistech.com' : undefined };
  res
    .clearCookie('access_token', clearOpts)
    .clearCookie('refresh_token', { ...clearOpts, path: '/api/auth/refresh' })
    .json({ message: 'Logged out successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Projects ──────────────────────────────────────────────────────────────────

// POST /api/projects — create a new undeployed project
app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) return res.status(400).json({ message: 'name and slug are required' });
  if (!SLUG_RE.test(slug)) return res.status(400).json({ message: 'invalid slug format (lowercase, hyphens, 3–50 chars)' });
  if (projects[slug]) return res.status(409).json({ message: `slug "${slug}" already exists` });

  const now = new Date().toISOString();
  const project = {
    id: randomUUID(),
    slug,
    name,
    tenantId: req.user.tenantId,
    ownerId: req.user.id,
    status: 'undeployed',
    url: null,
    deployedAt: null,
    provisioning: {
      runId: null,
      operation: null,
      currentStep: null,
      error: null,
    },
    createdAt: now,
    updatedAt: now,
  };
  projects[slug] = project;
  console.log(`[PROJECTS] Created "${slug}" for tenant ${req.user.tenantId}`);
  res.status(201).json(project);
});

// GET /api/projects — list all projects for the authenticated tenant
app.get('/api/projects', authenticateToken, (req, res) => {
  const tenantProjects = Object.values(projects).filter(p => p.tenantId === req.user.tenantId);
  res.json(tenantProjects);
});

// GET /api/projects/:slug
app.get('/api/projects/:slug', authenticateToken, (req, res) => {
  const project = projects[req.params.slug];
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.tenantId !== req.user.tenantId) return res.status(403).json({ message: 'Forbidden' });
  res.json(project);
});

// PATCH /api/projects/:slug — update name only (slug is immutable after first deploy)
app.patch('/api/projects/:slug', authenticateToken, (req, res) => {
  const project = projects[req.params.slug];
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user.id) return res.status(403).json({ message: 'Only the project owner can update it' });
  if (req.body.name) {
    project.name = req.body.name;
    project.updatedAt = new Date().toISOString();
  }
  res.json(project);
});

// DELETE /api/projects/:slug — delete only if undeployed or failed
app.delete('/api/projects/:slug', authenticateToken, (req, res) => {
  const project = projects[req.params.slug];
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user.id) return res.status(403).json({ message: 'Only the project owner can delete it' });
  if (project.status === 'provisioning') return res.status(409).json({ message: 'Cannot delete a project while provisioning is in progress' });
  if (project.status === 'deployed') return res.status(409).json({ message: 'Undeploy the project before deleting it' });
  delete projects[req.params.slug];
  console.log(`[PROJECTS] Deleted "${req.params.slug}"`);
  res.json({ message: 'Project deleted' });
});

// POST /api/projects/:slug/deploy — trigger provisioning (fire-and-poll)
app.post('/api/projects/:slug/deploy', authenticateToken, (req, res) => {
  const project = projects[req.params.slug];
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user.id) return res.status(403).json({ message: 'Only the project owner can deploy it' });
  if (project.status === 'provisioning') return res.status(409).json({ message: 'Deploy already in progress' });
  if (project.status === 'deployed') return res.status(409).json({ message: 'Project is already deployed' });

  project.status = 'provisioning';
  project.provisioning.operation = 'deploy';
  project.updatedAt = new Date().toISOString();
  console.log(`[DEPLOY] Saga provisioning started for "${project.slug}"`);

  const runId = startProvisioningSaga({
    slug: project.slug,
    projectId: project.id,
    tenantId: project.tenantId,
    ownerId: project.ownerId,
    onProjectUpdate: ({ status, currentStep, error, url, deployedAt, runId: cbRunId }) => {
      const target = projects[project.slug];
      if (!target) return;
      if (cbRunId) target.provisioning.runId = cbRunId;
      if (currentStep) target.provisioning.currentStep = currentStep;
      if (error) target.provisioning.error = error;
      if (status) target.status = status;
      if (url !== undefined) target.url = url;
      if (deployedAt !== undefined) target.deployedAt = deployedAt;
      target.updatedAt = new Date().toISOString();
    },
    onIdentityRefresh: async () => {
      // In a real backend this would trigger token refresh invalidation/rotation.
      return true;
    },
  });

  project.provisioning.runId = runId;
  project.provisioning.currentStep = 'queued';

  res.json({
    status: 'provisioning',
    runId,
    operation: 'deploy',
    message: 'Deploy initiated — poll /api/projects/:slug/status',
  });
});

// GET /api/projects/:slug/status — poll deploy pipeline state
app.get('/api/projects/:slug/status', authenticateToken, (req, res) => {
  const project = projects[req.params.slug];
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.tenantId !== req.user.tenantId) return res.status(403).json({ message: 'Forbidden' });

  const runStatus = project.provisioning.runId
    ? getSagaRunStatus(project.provisioning.runId)
    : null;

  res.json({
    slug: project.slug,
    status: project.status,
    url: project.url,
    deployedAt: project.deployedAt,
    provisioning: {
      runId: project.provisioning.runId,
      operation: project.provisioning.operation,
      currentStep: project.provisioning.currentStep,
      error: project.provisioning.error,
      saga: runStatus,
    },
  });
});

// DELETE /api/projects/:slug/deploy — undeploy (teardown)
app.delete('/api/projects/:slug/deploy', authenticateToken, (req, res) => {
  const project = projects[req.params.slug];
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user.id) return res.status(403).json({ message: 'Only the project owner can undeploy it' });
  if (project.status !== 'deployed') return res.status(409).json({ message: 'Project is not currently deployed' });

  project.status = 'provisioning';
  project.provisioning.operation = 'teardown';
  project.provisioning.currentStep = 'queued';
  project.provisioning.error = null;
  project.updatedAt = new Date().toISOString();

  const runId = startTeardownSaga({
    slug: project.slug,
    projectId: project.id,
    onProjectUpdate: ({ status, currentStep, error, url, deployedAt, runId: cbRunId }) => {
      const target = projects[project.slug];
      if (!target) return;
      if (cbRunId) target.provisioning.runId = cbRunId;
      if (currentStep) target.provisioning.currentStep = currentStep;
      if (error) target.provisioning.error = error;
      if (status) target.status = status;
      if (url !== undefined) target.url = url;
      if (deployedAt !== undefined) target.deployedAt = deployedAt;
      target.updatedAt = new Date().toISOString();
    },
  });

  project.provisioning.runId = runId;

  console.log(`[DEPLOY] Teardown saga started for "${project.slug}"`);
  res.json({
    message: 'Project teardown initiated',
    runId,
    operation: 'teardown',
    status: project.status,
  });
});

// GET /api/dashboard/:tenantId/summary
app.get('/api/dashboard/:tenantId/summary', authenticateToken, (req, res) => {
  const { tenantId } = req.params;
  const role = req.user.role;

  const metrics = dashboardSummaryByRole[role] || dashboardSummaryByRole.EXECUTIVE;

  res.json({
    tenantId,
    role,
    generatedAt: new Date().toISOString(),
    metrics
  });
});

// GET /api/dashboard/:tenantId/trends
app.get('/api/dashboard/:tenantId/trends', authenticateToken, (req, res) => {
  const { tenantId } = req.params;

  res.json({
    tenantId,
    generatedAt: new Date().toISOString(),
    points: [
      { date: 'Jan', savings: 45000, automationRate: 45, errorRate: 2.1 },
      { date: 'Feb', savings: 52000, automationRate: 48, errorRate: 1.8 },
      { date: 'Mar', savings: 61000, automationRate: 52, errorRate: 1.5 }
    ]
  });
});

// GET /api/dashboard/:tenantId/bots
app.get('/api/dashboard/:tenantId/bots', authenticateToken, (req, res) => {
  const { tenantId } = req.params;

  res.json({
    tenantId,
    generatedAt: new Date().toISOString(),
    bots: [
      { id: 'b1', name: 'Invoice_Bot_01', processName: 'AP Processing', status: 'Running', uptimePct: 99.9, errorCount7d: 0 },
      { id: 'b2', name: 'Logistics_Sync', processName: 'Inventory Sync', status: 'Error', uptimePct: 85.4, errorCount7d: 14 }
    ]
  });
});

// GET /api/dashboard/:tenantId/processes
app.get('/api/dashboard/:tenantId/processes', authenticateToken, (req, res) => {
  const { tenantId } = req.params;

  res.json({
    tenantId,
    generatedAt: new Date().toISOString(),
    processes: [
      { id: 'p1', name: 'AP Invoice Processing', volume30d: 12400, avgCycleTime: '4.2m', successRate: 98.5, savingsYtd: '$142k' },
      { id: 'p2', name: 'Lead Qualification', volume30d: 8500, avgCycleTime: '1.8m', successRate: 92.1, savingsYtd: '$88k' }
    ]
  });
});

// GET /api/dashboard/:tenantId/alerts
app.get('/api/dashboard/:tenantId/alerts', authenticateToken, (req, res) => {
  const { tenantId } = req.params;

  res.json({
    tenantId,
    generatedAt: new Date().toISOString(),
    alerts: [
      { id: 'a1', severity: 'HIGH', title: 'Bot Failure: Logistics_Sync', createdAt: new Date().toISOString() },
      { id: 'a2', severity: 'MEDIUM', title: 'Cycle Time Increase on AP Processing', createdAt: new Date().toISOString() }
    ]
  });
});

// GET /api/dashboard/:tenantId/compliance
app.get('/api/dashboard/:tenantId/compliance', authenticateToken, (req, res) => {
  const { tenantId } = req.params;

  res.json({
    tenantId,
    generatedAt: new Date().toISOString(),
    score: 94,
    certifications: ['SOC2', 'HIPAA']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 AIISTECH Backend API running on http://localhost:${PORT} [${NODE_ENV}]`);
  console.log(`\n📝 Available endpoints:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/refresh`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   POST   /api/auth/logout`);
  console.log(`   POST   /api/projects`);
  console.log(`   GET    /api/projects`);
  console.log(`   GET    /api/projects/:slug`);
  console.log(`   PATCH  /api/projects/:slug`);
  console.log(`   DELETE /api/projects/:slug`);
  console.log(`   POST   /api/projects/:slug/deploy`);
  console.log(`   GET    /api/projects/:slug/status`);
  console.log(`   DELETE /api/projects/:slug/deploy`);
  console.log(`   GET    /api/dashboard/:tenantId/summary`);
  console.log(`   GET    /api/dashboard/:tenantId/trends`);
  console.log(`   GET    /api/dashboard/:tenantId/bots`);
  console.log(`   GET    /api/dashboard/:tenantId/processes`);
  console.log(`   GET    /api/dashboard/:tenantId/alerts`);
  console.log(`   GET    /api/dashboard/:tenantId/compliance`);
  console.log(`   GET    /api/health`);
  console.log(`\n👥 Demo users (password: password123):`);
  Object.values(users).forEach(user => {
    console.log(`   ${user.email} (${user.role})`);
  });
  console.log(`\n`);
});
