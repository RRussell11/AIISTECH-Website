'use strict';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function stream(messages, res) {
  const apiKey = process.env.STUDIO_AI_KEY;
  if (!apiKey) throw new Error('STUDIO_AI_KEY is not set');

  const model = process.env.STUDIO_AI_MODEL || 'gpt-4o';

  const response = await fetch(OPENAI_API_URL, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
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
