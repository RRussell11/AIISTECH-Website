# How the System Works - Quick Summary

## 🎯 One-Sentence Summary

The AIISTECH website uses a **React frontend** (port 8080) that communicates with an **Express backend API** (port 3001) via REST/HTTP requests to handle user authentication with JWT tokens.

---

## 📱 Simple Flow Diagram

```
┌──────────┐         HTTPS          ┌──────────┐
│          │   ─────────────>       │          │
│  React   │   JSON + JWT Tokens    │ Express  │
│ Frontend │   <─────────────       │ Backend  │
│          │                         │          │
└──────────┘                         └──────────┘
Port 8080                            Port 3001
```

---

## 🔐 Authentication in 3 Steps

### 1. **Login**
```
User → Frontend (LoginForm) → Backend (/api/auth/login)
Backend validates → Returns JWT tokens + user data
Frontend stores tokens → Redirects to dashboard
```

### 2. **Access Protected Pages**
```
Frontend → Reads token from localStorage
Frontend → Sends request with token in header
Backend → Validates token → Returns data
Frontend → Displays dashboard
```

### 3. **Token Expires?**
```
Backend → Returns 401 error
Frontend → Automatically refreshes token
Frontend → Retries request
User → Doesn't notice anything!
```

---

## 🏗️ Frontend Structure

```
src/
├── services/
│   ├── api.ts              → HTTP client (axios)
│   └── authService.ts      → Auth API calls
├── contexts/
│   └── AuthContext.tsx     → Global auth state
├── components/auth/
│   ├── LoginForm.tsx       → Login UI
│   └── ProtectedRoute.tsx  → Route guard
└── pages/
    └── DashboardPage.tsx   → Role-based dashboard
```

**Key Concept**: Services handle API calls, Context manages state, Components handle UI.

---

## 🔧 Backend Structure

```
mock-backend/
└── server.js  → Express API with 5 endpoints
    ├── POST /api/auth/login     (login user)
    ├── POST /api/auth/refresh   (refresh token)
    ├── GET  /api/auth/me        (get user info)
    ├── POST /api/auth/logout    (logout)
    └── GET  /api/health         (health check)
```

**Key Concept**: Backend validates credentials, generates tokens, and protects endpoints.

---

## 🔑 JWT Tokens Explained

### Access Token (15 minutes)
- Short-lived
- Used for API requests
- Sent in Authorization header

### Refresh Token (7 days)
- Long-lived
- Used to get new access token
- Only sent to /refresh endpoint

**Why two tokens?**  
Security! If access token is stolen, it expires quickly. Refresh token stays safe.

---

## 📊 How Data Flows

### User Logs In

```typescript
// 1. Frontend sends credentials
POST /api/auth/login
Body: { email: "exec@aiistech.com", password: "password123" }

// 2. Backend responds with tokens and user data
Response: {
  accessToken: "eyJhbGci...",
  refreshToken: "eyJhbGci...",
  user: { id: "1", email: "exec@aiistech.com", role: "EXECUTIVE", ... }
}

// 3. Frontend stores and redirects
localStorage.setItem('accessToken', token)
navigate('/dashboard')
```

### User Accesses Dashboard

```typescript
// 1. Frontend adds token to request
GET /api/auth/me
Headers: { Authorization: "****** eyJhbGci..." }

// 2. Backend validates token and returns user
Response: {
  id: "1",
  email: "exec@aiistech.com",
  role: "EXECUTIVE",
  firstName: "John",
  ...
}

// 3. Frontend displays dashboard
<DashboardPage user={user} />
```

---

## 🎭 Role-Based Dashboards

Each user role sees different KPIs:

| Role | Dashboard KPIs |
|------|----------------|
| **Executive** | Cost Savings, Revenue, Automation Rate, Compliance |
| **Finance** | Revenue, Cost Savings, FTE Hours, ROI |
| **Operations** | Process Volume, Cycle Time, Success Rate, Uptime |
| **IT** | Bot Uptime, Error Rate, System Health, Alerts |

**How it works:**  
Frontend checks `user.role` and shows different metrics.

---

## 🛡️ Protected Routes

```typescript
// Without login → Redirect to /login
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />

// ProtectedRoute checks:
1. Is user authenticated? → No → Redirect to /login
2. Does user have required role? → No → Show "Access Denied"
3. Everything OK? → Show dashboard
```

---

## 🔄 Automatic Token Refresh

This is the **magic** that makes the UX seamless:

```typescript
// API interceptor watches for 401 errors
if (response.status === 401) {
  // 1. Get refresh token
  const refresh = localStorage.getItem('refreshToken')
  
  // 2. Request new access token
  const newToken = await POST('/api/auth/refresh', { refresh })
  
  // 3. Store new token
  localStorage.setItem('accessToken', newToken)
  
  // 4. Retry original request (user doesn't notice!)
  return retryRequest()
}
```

**User experience**: Seamless! They never see an error.

---

## 🚀 Start the System

**Terminal 1** (Backend):
```bash
cd mock-backend
npm start
```

**Terminal 2** (Frontend):
```bash
npm run dev
```

**Browser**: `http://localhost:8080/login`

---

## 🔐 Security Summary

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ Implemented |
| Token Expiration | ✅ 15min / 7days |
| Auto Token Refresh | ✅ Automatic |
| Protected Routes | ✅ Guards in place |
| Role-Based Access | ✅ By role |
| CORS Protection | ✅ Configured |

---

## 📚 Want More Details?

- **[SYSTEM_INTEGRATION_GUIDE.md](./SYSTEM_INTEGRATION_GUIDE.md)** - Complete technical guide
- **[BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md)** - API documentation
- **[README.md](./README.md)** - Project overview

---

## 💡 The Big Picture

```
Frontend                Backend             Storage
   │                       │                   │
   │  1. Login request     │                   │
   ├──────────────────────>│                   │
   │                       │ 2. Validate       │
   │                       │    Generate JWT   │
   │  3. Return tokens     │                   │
   │<──────────────────────┤                   │
   │                       │                   │
   │  4. Store tokens      │                   │
   ├───────────────────────────────────────────>│
   │                       │                   │
   │  5. Request data      │                   │
   │  + token              │                   │
   ├──────────────────────>│                   │
   │                       │ 6. Verify token   │
   │                       │    Return data    │
   │  7. Receive data      │                   │
   │<──────────────────────┤                   │
   │                       │                   │
   │  8. Display UI        │                   │
   │                       │                   │
```

**That's it!** Simple client-server architecture with JWT authentication.

---

**Last Updated**: February 17, 2026  
**Status**: ✅ System Working
