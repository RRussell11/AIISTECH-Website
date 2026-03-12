const path = require('path');
const os   = require('os');
const fs   = require('fs');

// Point MULTIPLIC_REPO_PATH at a temp directory so tests are fully isolated
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'multiplic-fs-test-'));
process.env.MULTIPLIC_REPO_PATH = tmpRoot;

// Create some test fixtures inside the temp root
fs.mkdirSync(path.join(tmpRoot, 'sites', 'example.com', 'src'), { recursive: true });
fs.writeFileSync(path.join(tmpRoot, 'sites', 'example.com', 'src', 'App.jsx'), '// hello', 'utf8');
fs.writeFileSync(path.join(tmpRoot, 'README.md'), '# Test', 'utf8');

jest.resetModules();
const { assertSafePath, listDir, readFile, writeFile } = require('../../../server/studio/services/fileSystem');

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  delete process.env.MULTIPLIC_REPO_PATH;
});

describe('assertSafePath', () => {
  test('accepts a valid relative path inside REPO_ROOT', () => {
    expect(() => assertSafePath('sites/example.com/src/App.jsx')).not.toThrow();
  });

  test('rejects path containing .. segments', () => {
    let err;
    try { assertSafePath('../../../etc/passwd'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(403);
  });

  test('rejects .env file', () => {
    let err;
    try { assertSafePath('.env'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(403);
  });

  test('rejects .env.local file', () => {
    let err;
    try { assertSafePath('.env.local'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(403);
  });

  test('rejects .git directory', () => {
    let err;
    try { assertSafePath('.git/config'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(403);
  });

  test('rejects node_modules path', () => {
    let err;
    try { assertSafePath('node_modules/.bin/something'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(403);
  });

  test('rejects empty/falsy input', () => {
    let err;
    try { assertSafePath(''); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(400);
  });
});

describe('listDir', () => {
  test('returns entries for a valid directory', () => {
    const entries = listDir('sites');
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.some((e) => e.name === 'example.com')).toBe(true);
  });

  test('excludes deny-listed entries', () => {
    fs.mkdirSync(path.join(tmpRoot, 'node_modules'), { recursive: true });
    const entries = listDir('.');
    expect(entries.some((e) => e.name === 'node_modules')).toBe(false);
  });

  test('each entry has name, type, path properties', () => {
    const entries = listDir('sites');
    for (const entry of entries) {
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('type');
      expect(entry).toHaveProperty('path');
    }
  });
});

describe('readFile', () => {
  test('reads a valid file', () => {
    const content = readFile('README.md');
    expect(content).toBe('# Test');
  });

  test('throws 413 for files over 5 MB', () => {
    const bigFile = path.join(tmpRoot, 'big.txt');
    fs.writeFileSync(bigFile, Buffer.alloc(6 * 1024 * 1024, 'x'));
    let err;
    try { readFile('big.txt'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(413);
    fs.unlinkSync(bigFile);
  });
});

describe('writeFile', () => {
  test('writes content to a valid file path', () => {
    writeFile('sites/example.com/src/NewFile.js', 'export default {}');
    const written = fs.readFileSync(
      path.join(tmpRoot, 'sites/example.com/src/NewFile.js'),
      'utf8'
    );
    expect(written).toBe('export default {}');
  });

  test('throws 403 when writing to a path outside REPO_ROOT', () => {
    let err;
    try { writeFile('../outside.txt', 'bad'); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.status).toBe(403);
  });
});
