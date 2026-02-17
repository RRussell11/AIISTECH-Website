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

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock Backend API Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Available endpoints:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/refresh`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   POST   /api/auth/logout`);
  console.log(`   GET    /api/health`);
  console.log(`\n👥 Demo users:`);
  Object.values(users).forEach(user => {
    console.log(`   ${user.email} / password123 (${user.role})`);
  });
  console.log(`\n`);
});
