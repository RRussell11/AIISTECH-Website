# Frontend-Backend Integration Guide

## 🎯 System Overview

The AIISTECH Website now features a **complete authentication system** with a React frontend connected to a Node.js/Express backend API. This integration enables secure user authentication, role-based access control, and protected routes.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         React Frontend (Port 8080)                      │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │                                                          │    │
│  │  • LoginForm.tsx          → User Interface             │    │
│  │  • AuthContext.tsx        → Global Auth State          │    │
│  │  • ProtectedRoute.tsx     → Route Guards               │    │
│  │  • DashboardPage.tsx      → Role-based Views           │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────┐       │    │
│  │  │     Services Layer                          │       │    │
│  │  ├─────────────────────────────────────────────┤       │    │
│  │  │  • api.ts           → HTTP Client + Interceptors   │    │
│  │  │  • authService.ts   → Auth API Calls       │       │    │
│  │  └─────────────────────────────────────────────┘       │    │
│  │                          │                              │    │
│  │                          │ HTTPS/REST API               │    │
│  │                          │ (axios)                      │    │
│  └──────────────────────────┼──────────────────────────────┘    │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────────────┐
         │    Express Backend API (Port 3001)             │
         ├────────────────────────────────────────────────┤
         │                                                 │
         │  ┌──────────────────────────────────────┐     │
         │  │   API Endpoints                      │     │
         │  ├──────────────────────────────────────┤     │
         │  │  POST /api/auth/login                │     │
         │  │  POST /api/auth/refresh              │     │
         │  │  GET  /api/auth/me                   │     │
         │  │  POST /api/auth/logout               │     │
         │  └──────────────────────────────────────┘     │
         │                                                 │
         │  ┌──────────────────────────────────────┐     │
         │  │   Authentication Layer               │     │
         │  ├──────────────────────────────────────┤     │
         │  │  • JWT Token Generation              │     │
         │  │  • Token Verification                │     │
         │  │  • User Validation                   │     │
         │  └──────────────────────────────────────┘     │
         │                                                 │
         │  ┌──────────────────────────────────────┐     │
         │  │   Data Layer                         │     │
         │  ├──────────────────────────────────────┤     │
         │  │  • Mock User Database                │     │
         │  │  • 4 Demo Users (roles)              │     │
         │  └──────────────────────────────────────┘     │
         │                                                 │
         └─────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Step 1: User Login

```typescript
// User enters credentials on LoginForm.tsx
const handleLogin = async (email, password) => {
  // 1. Frontend sends credentials to backend
  await authService.login({ email, password });
}
```

**HTTP Request:**
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "exec@aiistech.com",
  "password": "password123"
}
```

**Backend Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "1",
    "email": "exec@aiistech.com",
    "firstName": "John",
    "lastName": "Executive",
    "role": "EXECUTIVE",
    "tenantId": "tenant-1",
    "isActive": true
  }
}
```

### Step 2: Token Storage & State Management

```typescript
// AuthContext.tsx stores tokens and user data
const login = async (credentials: LoginCredentials) => {
  const response = await authService.login(credentials);
  
  // Store tokens in localStorage
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  
  // Update global state
  setToken(response.accessToken);
  setUser(response.user);
};
```

### Step 3: Protected API Requests

```typescript
// api.ts automatically adds auth token to all requests
this.api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Example Protected Request:**
```http
GET http://localhost:3001/api/auth/me
Authorization: ****** eyJhbGci...
```

### Step 4: Automatic Token Refresh

```typescript
// api.ts handles 401 errors and refreshes tokens automatically
this.api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Get refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Request new access token
      const { data } = await axios.post('/api/auth/refresh', {
        refreshToken
      });
      
      // Store new token
      localStorage.setItem('accessToken', data.accessToken);
      
      // Retry original request
      return this.api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

---

## 🛡️ Protected Routes

### Route Protection Flow

```
User Navigates to /dashboard
         │
         ▼
  ProtectedRoute Component
         │
         ├─► Check: Is user authenticated?
         │   └─► NO → Redirect to /login
         │
         ├─► Check: Does user have required role?
         │   └─► NO → Show "Access Denied"
         │
         └─► YES → Render Dashboard Component
```

### Code Implementation

```typescript
// ProtectedRoute.tsx
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !hasRole(roles)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
```

**Usage in App:**
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

---

## 📊 Data Flow Examples

### 1. Login Flow

```
Frontend                    Backend
   │                           │
   │  POST /api/auth/login     │
   ├──────────────────────────>│
   │  { email, password }       │
   │                           │
   │                           │ Validate credentials
   │                           │ Generate JWT tokens
   │                           │
   │  { tokens, user }         │
   │<──────────────────────────┤
   │                           │
   │ Store in localStorage     │
   │ Update AuthContext        │
   │ Redirect to /dashboard    │
   │                           │
```

### 2. Protected Page Access

```
Frontend                    Backend
   │                           │
   │  GET /api/auth/me         │
   ├──────────────────────────>│
   │  Authorization: Bearer... │
   │                           │
   │                           │ Verify JWT token
   │                           │ Extract user ID
   │                           │ Fetch user data
   │                           │
   │  { user details }         │
   │<──────────────────────────┤
   │                           │
   │ Display dashboard         │
   │ with user info            │
   │                           │
```

### 3. Token Refresh Flow

```
Frontend                    Backend
   │                           │
   │  GET /api/some-endpoint   │
   ├──────────────────────────>│
   │  Authorization: Bearer... │
   │                           │
   │                           │ Token expired!
   │                           │
   │  401 Unauthorized         │
   │<──────────────────────────┤
   │                           │
   │ Interceptor catches 401   │
   │                           │
   │  POST /api/auth/refresh   │
   ├──────────────────────────>│
   │  { refreshToken }          │
   │                           │
   │                           │ Validate refresh token
   │                           │ Generate new access token
   │                           │
   │  { accessToken }          │
   │<──────────────────────────┤
   │                           │
   │ Store new token           │
   │ Retry original request    │
   ├──────────────────────────>│
   │                           │
   │  Success response         │
   │<──────────────────────────┤
   │                           │
```

---

## 🔑 Key Components

### Frontend Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **LoginForm** | Login UI | `src/components/auth/LoginForm.tsx` |
| **AuthContext** | Global auth state | `src/contexts/AuthContext.tsx` |
| **ProtectedRoute** | Route guard | `src/components/auth/ProtectedRoute.tsx` |
| **DashboardPage** | Role-based UI | `src/pages/DashboardPage.tsx` |
| **api.ts** | HTTP client | `src/services/api.ts` |
| **authService** | Auth API calls | `src/services/authService.ts` |

### Backend Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **server.js** | Express app | `mock-backend/server.js` |
| **Mock DB** | User data | In-memory object |
| **JWT Helper** | Token generation | jsonwebtoken library |

---

## 🎭 Role-Based Access

The system supports 4 user roles with different dashboard views:

```typescript
enum UserRole {
  EXECUTIVE = 'EXECUTIVE',    // Cost Savings, Revenue, Automation Rate
  FINANCE = 'FINANCE',        // Revenue, Cost Savings, FTE Hours Freed, ROI
  OPERATIONS = 'OPERATIONS',  // Process Volume, Cycle Time, Success Rate
  IT = 'IT'                   // Bot Uptime, Error Rate, System Health
}
```

**Dashboard Configuration:**
```typescript
const getRoleDashboardConfig = (role: UserRole) => {
  switch (role) {
    case 'EXECUTIVE':
      return {
        title: 'Executive Dashboard',
        kpis: ['Cost Savings YTD', 'Revenue (PSA)', 'Automation Rate']
      };
    // ... other roles
  }
};
```

---

## 🔄 Complete User Journey

### First Time Login

1. **User visits** `http://localhost:8080/`
2. **Redirects to** `/login` (not authenticated)
3. **User enters credentials** on LoginForm
4. **Frontend sends** POST to `/api/auth/login`
5. **Backend validates** credentials
6. **Backend returns** JWT tokens + user data
7. **Frontend stores** tokens in localStorage
8. **AuthContext updates** global state
9. **Frontend redirects** to `/dashboard`
10. **ProtectedRoute checks** authentication
11. **Dashboard loads** role-specific view

### Subsequent Visits

1. **User visits** `http://localhost:8080/dashboard`
2. **ProtectedRoute checks** localStorage for token
3. **AuthContext fetches** user data (GET `/api/auth/me`)
4. **Backend validates** token
5. **Backend returns** user data
6. **Dashboard renders** with user info

### Token Expiry Handling

1. **User makes API request** (after 15 minutes)
2. **Backend returns** 401 Unauthorized
3. **API interceptor catches** 401
4. **Interceptor sends** refresh token to `/api/auth/refresh`
5. **Backend validates** refresh token
6. **Backend returns** new access token
7. **Interceptor stores** new token
8. **Interceptor retries** original request
9. **Request succeeds** seamlessly

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **CORS**: cors middleware

---

## 📝 Environment Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend
No environment file needed (mock server with hardcoded config)

---

## 🔐 Security Features

### Implemented
✅ JWT-based authentication  
✅ Token expiration (15 min access, 7 day refresh)  
✅ Automatic token refresh  
✅ Protected routes  
✅ Role-based access control  
✅ CORS configuration  
✅ ****** authentication  

### For Production
⚠️ Use httpOnly cookies instead of localStorage  
⚠️ Implement rate limiting  
⚠️ Add password hashing (bcrypt)  
⚠️ Use environment variables for secrets  
⚠️ Enable HTTPS  
⚠️ Add request logging  

---

## 🚀 Quick Start

### Terminal 1: Start Backend
```bash
cd mock-backend
npm install
npm start
# Server: http://localhost:3001
```

### Terminal 2: Start Frontend
```bash
npm install
npm run dev
# Frontend: http://localhost:8080
```

### Test Login
1. Navigate to `http://localhost:8080/login`
2. Use: `exec@aiistech.com` / `password123`
3. View Executive Dashboard

---

## 📚 Related Documentation

- **[BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md)** - Detailed API documentation
- **[README.md](./README.md)** - Project overview
- **[Mock Backend README](./mock-backend/README.md)** - Backend API specs

---

## 💡 Key Takeaways

1. **Separation of Concerns**: Frontend handles UI, backend handles auth logic
2. **Automatic Token Management**: No manual token handling needed
3. **Seamless UX**: Token refresh happens transparently
4. **Type Safety**: Full TypeScript coverage for auth types
5. **Security First**: JWT tokens, protected routes, role checks
6. **Developer Friendly**: Clear architecture, good documentation

---

**Last Updated**: February 17, 2026  
**Status**: ✅ Fully Functional & Documented
