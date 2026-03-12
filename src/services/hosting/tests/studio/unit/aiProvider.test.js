describe('aiProvider factory', () => {
  afterEach(() => {
    delete process.env.STUDIO_AI_PROVIDER;
    jest.resetModules();
  });

  test('returns openai provider by default', () => {
    jest.resetModules();
    const { getProvider } = require('../../../server/studio/services/aiProvider');
    const provider = getProvider();
    expect(typeof provider.stream).toBe('function');
  });

  test('returns anthropic provider when STUDIO_AI_PROVIDER=anthropic', () => {
    process.env.STUDIO_AI_PROVIDER = 'anthropic';
    jest.resetModules();
    const { getProvider } = require('../../../server/studio/services/aiProvider');
    const provider = getProvider();
    expect(typeof provider.stream).toBe('function');
  });

  test('returns ollama provider when STUDIO_AI_PROVIDER=ollama', () => {
    process.env.STUDIO_AI_PROVIDER = 'ollama';
    jest.resetModules();
    const { getProvider } = require('../../../server/studio/services/aiProvider');
    const provider = getProvider();
    expect(typeof provider.stream).toBe('function');
  });

  test('returns custom provider when STUDIO_AI_PROVIDER=custom', () => {
    process.env.STUDIO_AI_PROVIDER = 'custom';
    jest.resetModules();
    const { getProvider } = require('../../../server/studio/services/aiProvider');
    const provider = getProvider();
    expect(typeof provider.stream).toBe('function');
  });

  test('throws for unknown provider name', () => {
    process.env.STUDIO_AI_PROVIDER = 'unknownprovider';
    jest.resetModules();
    const { getProvider } = require('../../../server/studio/services/aiProvider');
    expect(() => getProvider()).toThrow('Unknown STUDIO_AI_PROVIDER');
  });

  test('provider lookup is case-insensitive', () => {
    process.env.STUDIO_AI_PROVIDER = 'OpenAI';
    jest.resetModules();
    const { getProvider } = require('../../../server/studio/services/aiProvider');
    const provider = getProvider();
    expect(typeof provider.stream).toBe('function');
  });
});
