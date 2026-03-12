'use strict';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

async function stream(messages, res) {
  const apiKey = process.env.STUDIO_AI_KEY;
  if (!apiKey) throw new Error('STUDIO_AI_KEY is not set');

  const model = process.env.STUDIO_AI_MODEL || 'claude-3-5-sonnet-20241022';

  // Separate system message from user/assistant messages
  const systemMsg = messages.find((m) => m.role === 'system');
  const chatMsgs  = messages.filter((m) => m.role !== 'system');

  const body = {
    model,
    max_tokens: 4096,
    stream:     true,
    messages:   chatMsgs,
  };
  if (systemMsg) body.system = systemMsg.content;

  const response = await fetch(ANTHROPIC_API_URL, {
    method:  'POST',
    headers: {
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${text}`);
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
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          res.write(`data: ${JSON.stringify(parsed.delta.text)}\n\n`);
        } else if (parsed.type === 'message_stop') {
          res.write('data: [DONE]\n\n');
          return;
        }
      } catch { /* skip malformed lines */ }
    }
  }
}

module.exports = { stream };
