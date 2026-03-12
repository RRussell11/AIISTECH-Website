'use strict';

// Custom OpenAI-compatible endpoint
async function stream(messages, res) {
  const baseUrl = process.env.STUDIO_AI_BASE_URL;
  if (!baseUrl) throw new Error('STUDIO_AI_BASE_URL is required for custom provider');

  const apiKey = process.env.STUDIO_AI_KEY;
  const model  = process.env.STUDIO_AI_MODEL || 'default';

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method:  'POST',
    headers,
    body:    JSON.stringify({ model, messages, stream: true }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Custom AI API error ${response.status}: ${text}`);
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') {
        res.write('data: [DONE]\n\n');
        return;
      }
      try {
        const parsed = JSON.parse(data);
        const token  = parsed.choices?.[0]?.delta?.content;
        if (token) res.write(`data: ${JSON.stringify(token)}\n\n`);
      } catch { /* skip malformed lines */ }
    }
  }
}

module.exports = { stream };
