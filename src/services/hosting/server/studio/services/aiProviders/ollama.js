'use strict';

async function stream(messages, res) {
  const baseUrl = process.env.STUDIO_AI_BASE_URL || 'http://localhost:11434';
  const model   = process.env.STUDIO_AI_MODEL    || 'llama3.2';

  const response = await fetch(`${baseUrl}/api/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ model, messages, stream: true }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama API error ${response.status}: ${text}`);
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        const token  = parsed.message?.content;
        if (token) res.write(`data: ${JSON.stringify(token)}\n\n`);
        if (parsed.done) {
          res.write('data: [DONE]\n\n');
          return;
        }
      } catch { /* skip malformed lines */ }
    }
  }
}

module.exports = { stream };
