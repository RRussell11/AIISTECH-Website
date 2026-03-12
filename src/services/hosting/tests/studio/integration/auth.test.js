const request = require('supertest');
const bcrypt  = require('bcryptjs');
const express = require('express');
const session = require('express-session');

const TEST_PASSWORD      = 'test-studio-pass';
const TEST_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 1); // cost 1 for test speed
const SESSION_SECRET     = 'test-session-secret-32chars-long';

function buildTestApp() {
  process.env.STUDIO_PASSWORD = TEST_PASSWORD_HASH;
  process.env.SESSION_SECRET  = SESSION_SECRET;
  jest.resetModules();
  const studioApp = require('../../../server/studio');

  const wrapper = express();
  wrapper.use('/_studio', studioApp);
  return wrapper;
}

describe('Studio auth integration', () => {
  let app;

  beforeAll(() => {
    app = buildTestApp();
  });

  afterAll(() => {
    delete process.env.STUDIO_PASSWORD;
    delete process.env.SESSION_SECRET;
  });

  test('POST /_studio/auth/login with correct password returns 200', async () => {
    const res = await request(app)
      .post('/_studio/auth/login')
      .send({ password: TEST_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('POST /_studio/auth/login with wrong password returns 401', async () => {
    const res = await request(app)
      .post('/_studio/auth/login')
      .send({ password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  test('Unauthenticated API request returns 401 JSON', async () => {
    const res = await request(app)
      .get('/_studio/api/fs/list')
      .set('Accept', 'application/json');
    expect(res.status).toBe(401);
  });

  test('POST /_studio/auth/logout destroys session', async () => {
    const agent = request.agent(app);
    await agent.post('/_studio/auth/login').send({ password: TEST_PASSWORD });
    await agent.post('/_studio/auth/logout');
    const res = await agent
      .get('/_studio/api/fs/list')
      .set('Accept', 'application/json');
    expect(res.status).toBe(401);
  });
});

describe('Studio mount guard', () => {
  test('app.js does NOT mount studio when STUDIO_PASSWORD is unset', () => {
    delete process.env.STUDIO_PASSWORD;
    delete process.env.SESSION_SECRET;
    jest.resetModules();
    // Ensure config is findable by pointing to hosting root
    process.env.MULTIPLIC_CONFIG_PATH = require('path').resolve(
      __dirname, '../../multiplic.json'
    );
    const appModule = require('../../../server/app');
    // Studio route should not exist — /_studio/* should return 404 from domain router
    const allRoutes = appModule._router
      ? appModule._router.stack.map((l) => l.regexp && l.regexp.toString())
      : [];
    const hasStudioMount = allRoutes.some(
      (r) => r && r.includes('_studio')
    );
    expect(hasStudioMount).toBe(false);
    delete process.env.MULTIPLIC_CONFIG_PATH;
  });
});
