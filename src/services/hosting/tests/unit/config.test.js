const { loadConfig } = require('../../server/config');
const path           = require('path');

describe('loadConfig', () => {
  test('loads valid multiplic.json', () => {
    const config = loadConfig(path.resolve(__dirname, '../fixtures/multiplic.json'));
    expect(config.version).toBe(1);
    expect(config.sites).toBeDefined();
  });

  test('throws on missing file', () => {
    expect(() => loadConfig('/nonexistent/multiplic.json')).toThrow();
  });

  test('throws on missing version', () => {
    const tmpFile = require('os').tmpdir() + '/multiplic-bad.json';
    require('fs').writeFileSync(tmpFile, JSON.stringify({ sites: {} }));
    expect(() => loadConfig(tmpFile)).toThrow('missing version');
  });

  test('throws on site missing root', () => {
    const tmpFile = require('os').tmpdir() + '/multiplic-bad2.json';
    require('fs').writeFileSync(tmpFile, JSON.stringify({
      version: 1,
      sites: { 'example.com': { framework: 'react' } }
    }));
    expect(() => loadConfig(tmpFile)).toThrow('missing root');
  });
});
