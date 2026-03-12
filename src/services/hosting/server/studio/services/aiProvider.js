'use strict';

const PROVIDERS = {
  openai:    () => require('./aiProviders/openai'),
  anthropic: () => require('./aiProviders/anthropic'),
  ollama:    () => require('./aiProviders/ollama'),
  custom:    () => require('./aiProviders/custom'),
};

function getProvider() {
  const name    = (process.env.STUDIO_AI_PROVIDER || 'openai').toLowerCase();
  const factory = PROVIDERS[name];
  if (!factory) {
    throw new Error(
      `Unknown STUDIO_AI_PROVIDER: "${name}". Valid options: ${Object.keys(PROVIDERS).join(', ')}`
    );
  }
  return factory();
}

module.exports = { getProvider };
