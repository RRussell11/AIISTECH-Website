# Backend API Connection Guide

## Overview

The AIISTECH frontend is now fully connected to a backend API for authentication and user management.

## Quick Start

### 1. Start the Mock Backend Server

```bash
cd mock-backend
npm install  # Only needed first time
npm start
```

The server will start on `http://localhost:3001` with the following endpoints:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout
- `GET /api/health` - Health check

### 2. Start the Frontend

```bash
# In the root directory
npm install  # Only needed first time
npm run dev
```

The frontend will start on `http://localhost:8080`

### 3. Test the Integration

Navigate to `http://localhost:8080/login` and use one of the demo credentials:

- **Executive**: exec@aiistech.com / password123
- **Finance**: finance@aiistech.com / password123
- **Operations**: ops@aiistech.com / password123
- **IT**: it@aiistech.com / password123

## What's Connected

### Authentication Flow ✅
- Login with email/password
- JWT access token (expires in 15 minutes)
- JWT refresh token (expires in 7 days)
- Automatic token refresh on 401 errors
- Protected route redirects

### API Endpoints ✅
- **POST /api/auth/login**: Authenticates user and returns tokens
- **GET /api/auth/me**: Returns current user information (requires auth)
- **POST /api/auth/refresh**: Refreshes the access token
- **POST /api/auth/logout**: Logs out the user

### Role-Based Access ✅
Each role has a customized dashboard view:
- **Executive**: Cost Savings YTD, Revenue (PSA), Automation Rate, Compliance Score
- **Finance**: Revenue, Cost Savings, FTE Hours Freed, ROI
- **Operations**: Process Volume, Cycle Time, Success Rate, Bot Uptime
- **IT**: Bot Uptime, Error Rate, System Health, Active Alerts

## Environment Configuration

The frontend uses the `.env` file to configure the API URL:

```env
VITE_API_URL=http://localhost:3001/api
```

For production, update this to point to your production backend API.

## Mock Backend Details

The mock backend is a lightweight Node.js/Express server that provides:

- **JWT Authentication**: Uses jsonwebtoken library
- **CORS Support**: Enabled for frontend development
- **Four Demo Users**: One for each role
- **Stateless**: No database required
- **Development Only**: Not suitable for production

### Mock Backend Files

- `mock-backend/server.js` - Main server implementation
- `mock-backend/package.json` - Dependencies
- `mock-backend/README.md` - Detailed API documentation

## Testing the Connection

### 1. Test Backend Health

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-17T19:05:38.510Z"
}
```

### 2. Test Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"exec@aiistech.com","password":"password123"}'
```

Expected response:
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
    ...
  }
}
```

### 3. Test Protected Endpoint

```bash
# First login to get a token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"exec@aiistech.com","password":"password123"}' | jq -r '.accessToken')

# Then use the token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/auth/me
```

## Frontend Integration Points

### 1. API Service (`src/services/api.ts`)
- Axios instance with base URL from environment
- Request interceptor: Adds Authorization header
- Response interceptor: Handles token refresh on 401

### 2. Auth Service (`src/services/authService.ts`)
- `login()` - Authenticates user
- `getCurrentUser()` - Fetches user info
- `logout()` - Logs out user

### 3. Auth Context (`src/contexts/AuthContext.tsx`)
- Global auth state management
- User object and token storage
- isAuthenticated flag
- Role checking utilities

### 4. Protected Routes (`src/components/auth/ProtectedRoute.tsx`)
- Wraps routes that require authentication
- Redirects to /login if not authenticated
- Shows loading state during auth check

## Next Steps

### Phase 2: Dashboard Data API

To complete the integration, implement these additional endpoints:

1. **GET /api/dashboard/executive** - Executive KPIs
2. **GET /api/dashboard/finance** - Finance metrics
3. **GET /api/dashboard/operations** - Operations data
4. **GET /api/dashboard/it** - IT metrics

### Production Deployment

When deploying to production:

1. Replace mock backend with production API
2. Update `VITE_API_URL` in `.env`
3. Implement proper user database
4. Add password hashing (bcrypt)
5. Use secure JWT secrets
6. Implement rate limiting
7. Add proper logging and monitoring
8. Consider httpOnly cookies for token storage

## Troubleshooting

### Backend not starting
```bash
cd mock-backend
rm -rf node_modules
npm install
npm start
```

### Frontend can't connect to backend
1. Check `.env` file exists with `VITE_API_URL=http://localhost:3001/api`
2. Restart frontend dev server after creating/updating `.env`
3. Check backend is running on port 3001
4. Check CORS errors in browser console

### Token expired errors
- Normal behavior after 15 minutes
- Frontend should auto-refresh
- If it doesn't, try logging out and back in

### Protected routes not working
1. Check localStorage has `accessToken`
2. Check browser console for errors
3. Verify backend /auth/me endpoint works

## Success Indicators

You know the integration is working when:

✅ Login page accepts demo credentials  
✅ Dashboard displays user name and role  
✅ Dashboard shows role-specific KPIs  
✅ Logout redirects to login page  
✅ Accessing /dashboard without login redirects to /login  
✅ Backend logs show successful API calls  

## Support

For issues or questions:
1. Check backend console logs
2. Check browser developer console
3. Review API endpoint documentation in `mock-backend/README.md`
