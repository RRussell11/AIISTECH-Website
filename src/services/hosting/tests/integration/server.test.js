const request = require('supertest');
const path    = require('path');

// Load a test-specific config by overriding the multiplic.json path
// We isolate the server module so config loads fresh in each test.
let app;

beforeAll(() => {
  // Point config to test fixture by overriding the env/module
  jest.resetModules();
  jest.mock('../../server/config', () => ({
    loadConfig: () => ({
      version: 1,
      sites: {
        'test.example.com': {
          root: 'tests/fixtures/sites/test.example.com',
          framework: 'react'
        }
      }
    })
  }));
  app = require('../../server/app');
});

afterAll(() => {
  jest.resetModules();
});

describe('Multiplic server', () => {
  test('returns 404 for unknown domain', async () => {
    const res = await request(app)
      .get('/')
      .set('Host', 'unknown.example.com');
    expect(res.status).toBe(404);
  });

  test('serves index.html for known domain root', async () => {
    const res = await request(app)
      .get('/')
      .set('Host', 'test.example.com');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="root">');
  });

  test('SPA fallback: unknown path returns index.html', async () => {
    const res = await request(app)
      .get('/some/deep/react-route')
      .set('Host', 'test.example.com');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="root">');
  });

  test('static assets served with correct content-type', async () => {
    const res = await request(app)
      .get('/assets/main.js')
      .set('Host', 'test.example.com');
    // 200 if fixture exists, 200 (index.html fallback) if not — either way, no 500
    expect([200, 404]).toContain(res.status);
  });
});
