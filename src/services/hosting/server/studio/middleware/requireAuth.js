'use strict';

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  const wantsJson =
    req.headers.accept && req.headers.accept.includes('application/json');
  if (wantsJson) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.redirect('/_studio/login');
}

module.exports = requireAuth;
