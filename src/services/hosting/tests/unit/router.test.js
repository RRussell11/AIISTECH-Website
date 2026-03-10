const { buildRouter } = require('../../server/router');

const config = {
  sites: {
    'example.com': {
      root: 'tests/fixtures/sites/test.example.com',
      framework: 'react'
    },
    'example.com/app': {
      root: 'tests/fixtures/sites/test.example.com',
      framework: 'react'
    }
  }
};

describe('buildRouter', () => {
  test('returns null for unknown hostname', () => {
    expect(buildRouter(config, 'unknown.com', '/')).toBeNull();
  });

  test('matches root domain', () => {
    const handler = buildRouter(config, 'example.com', '/');
    expect(handler).toBeInstanceOf(Function);
  });

  test('matches www-prefixed domain', () => {
    const handler = buildRouter(config, 'www.example.com', '/');
    expect(handler).toBeInstanceOf(Function);
  });

  test('matches subpath site', () => {
    const handler = buildRouter(config, 'example.com', '/app/dashboard');
    expect(handler).toBeInstanceOf(Function);
  });

  test('returns null when dist folder missing', () => {
    const badConfig = {
      sites: { 'example.com': { root: 'sites/nonexistent', framework: 'react' } }
    };
    expect(buildRouter(badConfig, 'example.com', '/')).toBeNull();
  });
});
