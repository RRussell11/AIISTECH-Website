# ADR-008: AI Provider Abstraction for Multiplic Studio

**Status:** Accepted
**Date:** 2026-03-09
**Depends on:** ADR-006, ADR-007

## Context

Studio includes an AI copilot that helps developers write and edit code. Different operators may prefer different AI providers (OpenAI, Anthropic, Ollama, or a custom OpenAI-compatible endpoint). The AI API key must never be exposed to the client browser.

## Decision

- **Server-side proxy**: All AI requests are proxied through the Express server. The client only sends a message; the server adds authentication headers with the API key
- **Provider factory** (`aiProvider.js`): Returns the correct provider module based on `STUDIO_AI_PROVIDER` env var
- **Supported providers**: `openai` (default), `anthropic`, `ollama`, `custom`
- **Streaming via SSE**: Tokens are streamed to the client as `text/event-stream` events using the `data: <token>` format
- **Context injection**: System prompt automatically includes the current file content and a `multiplic.json` site summary
- **Rate limiting**: 30 requests per minute per session; excess returns 429

## Consequences

- API key is never logged, never sent to client, stored only in environment variables
- Switching providers requires only an env var change and server restart
- `ollama` provider supports local/self-hosted models with no API key required
- `custom` provider enables OpenAI-compatible third-party or self-hosted endpoints
- Rate limiting prevents runaway API costs if a session is left open

## Rejected Alternatives

- **Client-side API calls**: API key would be exposed in browser; violates security model
- **WebSockets for streaming**: SSE is simpler and sufficient; no bidirectional protocol needed
- **Single hardcoded provider**: Limits operator choice; prevents local/air-gapped deployments
