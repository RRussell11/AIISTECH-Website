const requireAuth = require('../../../server/studio/middleware/requireAuth');

function makeReq(sessionData, acceptHeader) {
  return {
    session: sessionData || {},
    headers: { accept: acceptHeader || 'text/html' },
  };
}

describe('requireAuth', () => {
  test('calls next() when session is authenticated', () => {
    const next = jest.fn();
    requireAuth(makeReq({ authenticated: true }), {}, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('returns 401 JSON for unauthenticated API request', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    requireAuth(makeReq({}, 'application/json'), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
  });

  test('redirects browser request to /_studio/login', () => {
    const res = { redirect: jest.fn() };
    requireAuth(makeReq({}), res, jest.fn());
    expect(res.redirect).toHaveBeenCalledWith('/_studio/login');
  });

  test('does not call next() when unauthenticated', () => {
    const next = jest.fn();
    const res  = { redirect: jest.fn() };
    requireAuth(makeReq({}), res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() when session exists with authenticated=true', () => {
    const next = jest.fn();
    requireAuth(makeReq({ authenticated: true, userId: 'u1' }), {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('rejects when authenticated is false', () => {
    const res = { redirect: jest.fn() };
    const next = jest.fn();
    requireAuth(makeReq({ authenticated: false }), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/_studio/login');
  });
});
