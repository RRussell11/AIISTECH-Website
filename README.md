[![generated from google-gemini/aistudio-repository-template](https://img.shields.io/badge/generated%20from-google--gemini%2Faistudio--repository--template-blue?style=flat-square&logo=github)](https://github.com/google-gemini/aistudio-repository-template)

# AIISTECH Website

**AI-Native Automation + PSA Platform for Mid-Market Enterprises**

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-18.x-green)
![Next.js](https://img.shields.io/badge/next.js-14.x-black)

---

## 📋 Overview

This is the public-facing website for **AIISTECH Automation** – an intelligent automation consulting and PSA platform company targeting mid-market enterprises (500–5,000 employees) in healthcare, manufacturing, and BFSI verticals.

### Key Objectives
- Generate qualified leads (5–10/month target) via assessment sign-ups
- Educate market on intelligent automation (agentic AI + RPA)
- Build thought leadership through blog + case studies
- Showcase platform capabilities and service offerings
- Drive 280% ROI narrative

### Website URL
- **Production**: [AIISTECH.com](https://AIISTECH.com)
- **Staging**: [staging.AIISTECH.com](https://staging.AIISTECH.com)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher (or yarn/pnpm)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/AIISTECH/website.git
cd website

# Install dependencies
npm install

# Create .env.local from template
cp .env.example .env.local

# Add required environment variables
# See Configuration section below

# Run development server
npm run dev

# Open browser
# Visit http://localhost:8080
```

---

## 🔐 Authentication

### Local Development

**See [BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md) for complete setup guide**

1. Start the mock backend API:
   ```bash
   cd mock-backend
   npm install  # First time only
   npm start
   ```

2. Start the frontend:
   ```bash
   npm install  # First time only
   npm run dev
   ```

3. Login with demo credentials:
   - **Executive**: exec@aiistech.com / password123
   - **Finance**: finance@aiistech.com / password123
   - **Operations**: ops@aiistech.com / password123
   - **IT**: it@aiistech.com / password123

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🔗 API Integration

The frontend is now connected to the backend Identity & Access Service:

- ✅ JWT Authentication
- ✅ Multi-tenant support
- ✅ Role-based access control
- ✅ Auto token refresh
- ✅ Protected routes

### API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

## 📖 System Documentation

### Understanding the Architecture

- **[HOW_IT_WORKS.md](./HOW_IT_WORKS.md)** - Quick summary of frontend-backend integration
- **[SYSTEM_INTEGRATION_GUIDE.md](./SYSTEM_INTEGRATION_GUIDE.md)** - Comprehensive technical guide with diagrams
- **[BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md)** - Backend API setup and testing
- **[GOOGLE_AI_INTEGRATION.md](./GOOGLE_AI_INTEGRATION.md)** - Google AI Studio integration status

### Quick Links

| Document | Description | Best For |
|----------|-------------|----------|
| [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) | 5-minute overview | Quick understanding |
| [SYSTEM_INTEGRATION_GUIDE.md](./SYSTEM_INTEGRATION_GUIDE.md) | Complete architecture | Developers |
| [BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md) | API documentation | Testing & Setup |

---