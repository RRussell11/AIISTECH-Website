const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'mock-jwt-secret-key-for-testing';
const JWT_REFRESH_SECRET = 'mock-jwt-refresh-secret-key';

// Middleware
app.use(cors());
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
function generateTokens(user) {
  const userPayload = {
    id: user.id,
    email: user.email,
    role: user.role
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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

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

  res.json({
    accessToken,
    refreshToken,
    user: userWithoutPassword
  });
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const userEmail = user.email;
    const userData = users[userEmail];

    if (!userData) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { accessToken } = generateTokens(userData);

    console.log(`[REFRESH] Token refreshed for ${userEmail}`);

    res.json({ accessToken });
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
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  console.log(`[LOGOUT] User ${req.user.email} logged out`);
  res.json({ message: 'Logged out successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
  console.log(`\n🚀 Mock Backend API Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Available endpoints:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/refresh`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   POST   /api/auth/logout`);
  console.log(`   GET    /api/dashboard/:tenantId/summary`);
  console.log(`   GET    /api/dashboard/:tenantId/trends`);
  console.log(`   GET    /api/dashboard/:tenantId/bots`);
  console.log(`   GET    /api/dashboard/:tenantId/processes`);
  console.log(`   GET    /api/dashboard/:tenantId/alerts`);
  console.log(`   GET    /api/dashboard/:tenantId/compliance`);
  console.log(`   GET    /api/health`);
  console.log(`\n👥 Demo users:`);
  Object.values(users).forEach(user => {
    console.log(`   ${user.email} / password123 (${user.role})`);
  });
  console.log(`\n`);
});
