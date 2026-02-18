# Production Testing Checklist

Quick reference for testing before production deployment.

---

## ⚡ Quick Test (15 minutes)

### Build & Security
- [ ] `npm run build` - Production build succeeds
- [ ] `npm audit` - No HIGH vulnerabilities
- [ ] `npm run lint` - No errors (warnings OK)

### Authentication Flow
- [ ] Login with `exec@aiistech.com` / `password123`
- [ ] Dashboard displays with user info
- [ ] Logout redirects to login
- [ ] Accessing `/dashboard` without login redirects to `/login`

### Browser Check
- [ ] Chrome - Works
- [ ] Firefox - Works
- [ ] Safari - Works

---

## 🔍 Comprehensive Test (1-2 hours)

### 1. Build Process ✅
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```
- [ ] Build completes without errors
- [ ] Preview server starts
- [ ] Application loads
- [ ] No console errors
- [ ] Bundle size < 500KB

### 2. Authentication Tests 🔐

#### Login
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Redirects to `/dashboard`
- [ ] User info displays (name, role)
- [ ] Role-specific dashboard loads

#### Invalid Login
- [ ] Enter wrong password
- [ ] Error message displays
- [ ] Stays on login page
- [ ] Can retry

#### Protected Routes
- [ ] Clear localStorage
- [ ] Try accessing `/dashboard` directly
- [ ] Redirects to `/login`
- [ ] After login, can access dashboard

#### Token Refresh (Requires 15min wait)
- [ ] Login successfully
- [ ] Wait for token expiry (15 min)
- [ ] Make API request (navigate pages)
- [ ] Token refreshes automatically
- [ ] No errors shown to user

#### Logout
- [ ] Click logout button
- [ ] Redirects to `/login`
- [ ] localStorage cleared
- [ ] Can't access `/dashboard`
- [ ] Must login again

### 3. Role-Based Access 👥

Test each role shows correct dashboard:

#### Executive
- [ ] Login: `exec@aiistech.com` / `password123`
- [ ] See: Cost Savings YTD, Revenue (PSA), Automation Rate, Compliance Score
- [ ] Role badge shows "EXECUTIVE"

#### Finance
- [ ] Login: `finance@aiistech.com` / `password123`
- [ ] See: Revenue, Cost Savings, FTE Hours Freed, ROI
- [ ] Role badge shows "FINANCE"

#### Operations
- [ ] Login: `ops@aiistech.com` / `password123`
- [ ] See: Process Volume, Cycle Time, Success Rate, Bot Uptime
- [ ] Role badge shows "OPERATIONS"

#### IT
- [ ] Login: `it@aiistech.com` / `password123`
- [ ] See: Bot Uptime, Error Rate, System Health, Active Alerts
- [ ] Role badge shows "IT"

### 4. Browser Compatibility 🌐

Test on each browser:

**Desktop:**
- [ ] Chrome (latest) - All features work
- [ ] Firefox (latest) - All features work
- [ ] Safari (latest) - All features work
- [ ] Edge (latest) - All features work

**Mobile:**
- [ ] Safari iOS - All features work
- [ ] Chrome Android - All features work

**Check for each browser:**
- [ ] Login works
- [ ] Dashboard displays correctly
- [ ] Logout works
- [ ] No console errors
- [ ] Responsive design works

### 5. Performance Tests ⚡

#### Load Time
- [ ] First load < 3 seconds
- [ ] Subsequent loads < 1 second
- [ ] Dashboard loads < 2 seconds

#### Bundle Size (from npm run build)
- [ ] JS bundle < 500KB (target: ~400KB) ✅ Currently 407KB
- [ ] CSS bundle < 100KB (target: ~80KB) ✅ Currently 77KB
- [ ] Total size < 600KB

#### Lighthouse Score (Chrome DevTools)
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 80
- [ ] SEO > 80

### 6. Network Conditions 🌐

Test with Chrome DevTools throttling:

**Fast 3G:**
- [ ] Application loads
- [ ] Login works
- [ ] Reasonable user experience

**Slow 3G:**
- [ ] Application eventually loads
- [ ] Loading indicators show
- [ ] Doesn't crash

**Offline:**
- [ ] Shows appropriate error
- [ ] Doesn't crash
- [ ] Recovers when online

### 7. Security Tests 🔒

#### Input Validation
- [ ] Try XSS in email field: `<script>alert('xss')</script>`
- [ ] Try SQL injection: `' OR '1'='1`
- [ ] Try long passwords (>1000 chars)
- [ ] All handled gracefully

#### Token Security
- [ ] Tokens stored in localStorage (⚠️ OK for demo, use httpOnly for production)
- [ ] Token expires after 15 minutes
- [ ] Refresh token works
- [ ] Old tokens don't work after logout

#### CORS
- [ ] API accepts requests from frontend
- [ ] API rejects requests from other origins (when backend configured)

### 8. Error Handling 🚨

#### Network Errors
- [ ] Stop backend server
- [ ] Try to login
- [ ] See appropriate error message
- [ ] Application doesn't crash

#### Invalid Responses
- [ ] Mock 500 error from backend
- [ ] Application handles gracefully
- [ ] Shows user-friendly message

#### Missing Data
- [ ] Delete localStorage while logged in
- [ ] Refresh page
- [ ] Redirects to login
- [ ] No crashes

### 9. User Experience 💫

#### Loading States
- [ ] Login button shows "Signing in..." while loading
- [ ] Dashboard shows loading spinner while fetching
- [ ] No blank screens

#### Error Messages
- [ ] Clear error messages
- [ ] User-friendly language
- [ ] Actionable (tells user what to do)

#### Navigation
- [ ] Back button works
- [ ] Forward button works
- [ ] Direct URL access works
- [ ] Refresh preserves state (if logged in)

### 10. Accessibility ♿

#### Keyboard Navigation
- [ ] Tab through login form
- [ ] Enter submits login
- [ ] Can navigate dashboard with keyboard
- [ ] Focus indicators visible

#### Screen Reader
- [ ] Form labels are read correctly
- [ ] Error messages are announced
- [ ] Button purposes are clear

#### Color Contrast
- [ ] Text readable against background
- [ ] Links distinguishable
- [ ] Error messages stand out

---

## 🐛 Known Issues

Document any issues found:

### Issues Found
1. **Issue**: [Description]
   - **Severity**: [Critical/High/Medium/Low]
   - **Steps to Reproduce**: [Steps]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]
   - **Status**: [Fixed/In Progress/Pending]

---

## ✅ Sign-off

### Tested By
- **Name**: ___________________
- **Date**: ___________________
- **Environment**: Production Build / Dev Server (circle one)
- **Browser**: ___________________

### Test Results
- [ ] All critical tests passed
- [ ] All high priority tests passed
- [ ] Issues documented
- [ ] **Ready for production**: YES / NO (circle one)

### Notes
_____________________________________
_____________________________________
_____________________________________

---

## 🚀 Pre-Deployment Final Check

Before deploying to production:

- [ ] All HIGH security vulnerabilities fixed (`npm audit`)
- [ ] Production build tested (`npm run build`)
- [ ] Backend API is production-ready (NOT mock)
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] All critical tests passed

**If all checked**: ✅ **GO FOR PRODUCTION**

**If any unchecked**: ❌ **DO NOT DEPLOY** - Complete remaining items first

---

**Last Updated**: February 17, 2026  
**Version**: 1.0
