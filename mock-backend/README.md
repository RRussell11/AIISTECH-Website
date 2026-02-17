# AIISTECH Mock Backend API

This is a lightweight mock backend server for testing the AIISTECH frontend authentication integration.

## Features

- JWT authentication (access + refresh tokens)
- User login endpoint
- Token refresh endpoint
- Get current user endpoint
- Logout endpoint
- CORS enabled for frontend development

## Demo Users

- **Executive**: exec@aiistech.com / password123
- **Finance**: finance@aiistech.com / password123
- **Operations**: ops@aiistech.com / password123
- **IT**: it@aiistech.com / password123

## Installation

```bash
cd mock-backend
npm install
```

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### POST /api/auth/login
Login with email and password

**Request:**
```json
{
  "email": "exec@aiistech.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "jwt-token...",
  "refreshToken": "jwt-refresh-token...",
  "user": {
    "id": "1",
    "email": "exec@aiistech.com",
    "firstName": "John",
    "lastName": "Executive",
    "role": "EXECUTIVE",
    "tenantId": "tenant-1",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### POST /api/auth/refresh
Refresh access token using refresh token

**Request:**
```json
{
  "refreshToken": "jwt-refresh-token..."
}
```

**Response:**
```json
{
  "accessToken": "new-jwt-token..."
}
```

### GET /api/auth/me
Get current user (requires authentication)

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "id": "1",
  "email": "exec@aiistech.com",
  "firstName": "John",
  "lastName": "Executive",
  "role": "EXECUTIVE",
  "tenantId": "tenant-1",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### POST /api/auth/logout
Logout user (requires authentication)

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## Notes

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- All passwords are "password123" for demo purposes
- This is a mock server for development/testing only
