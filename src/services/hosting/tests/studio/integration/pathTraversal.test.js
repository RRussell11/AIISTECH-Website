const request = require('supertest');
const bcrypt  = require('bcryptjs');
const express = require('express');
const path    = require('path');
const os      = require('os');
const fs      = require('fs');

const TEST_PASSWORD      = 'test-studio-pass';
const TEST_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 1);
const SESSION_SECRET     = 'test-session-secret-32chars-long';

let tmpRoot;
let app;
let agent;

beforeAll(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'multiplic-traversal-'));
  fs.writeFileSync(path.join(tmpRoot, 'README.md'), '# ok', 'utf8');

  process.env.MULTIPLIC_REPO_PATH = tmpRoot;
  process.env.STUDIO_PASSWORD     = TEST_PASSWORD_HASH;
  process.env.SESSION_SECRET      = SESSION_SECRET;

  jest.resetModules();
  const studioApp = require('../../../server/studio');
  app = express();
  app.use('/_studio', studioApp);

  agent = request.agent(app);
});

// Log in once before all traversal tests
beforeAll(async () => {
  const res = await agent
    .post('/_studio/auth/login')
    .send({ password: TEST_PASSWORD });
  expect(res.status).toBe(200);
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  delete process.env.MULTIPLIC_REPO_PATH;
  delete process.env.STUDIO_PASSWORD;
  delete process.env.SESSION_SECRET;
});

describe('Path traversal protection', () => {
  test('GET /api/fs/read?path=../../../etc/passwd returns 403', async () => {
    const res = await agent.get('/_studio/api/fs/read?path=../../../etc/passwd');
    expect(res.status).toBe(403);
  });

  test('GET /api/fs/read?path=.env returns 403', async () => {
    const res = await agent.get('/_studio/api/fs/read?path=.env');
    expect(res.status).toBe(403);
  });

  test('GET /api/fs/read?path=.git/config returns 403', async () => {
    const res = await agent.get('/_studio/api/fs/read?path=.git/config');
    expect(res.status).toBe(403);
  });

  test('GET /api/fs/read?path=node_modules/.bin/node returns 403', async () => {
    const res = await agent.get('/_studio/api/fs/read?path=node_modules/.bin/node');
    expect(res.status).toBe(403);
  });

  test('PUT /api/fs/write with path containing .. returns 403', async () => {
    const res = await agent
      .put('/_studio/api/fs/write')
      .send({ path: '../../outside.txt', content: 'bad' });
    expect(res.status).toBe(403);
  });

  test('GET /api/fs/list?path=../.. returns 403', async () => {
    const res = await agent.get('/_studio/api/fs/list?path=../..');
    expect(res.status).toBe(403);
  });

  test('GET /api/fs/read?path=README.md returns 200 for valid path', async () => {
    const res = await agent.get('/_studio/api/fs/read?path=README.md');
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('# ok');
  });
});
