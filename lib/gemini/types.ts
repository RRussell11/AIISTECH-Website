// TypeScript types for Gemini AI integration

export interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

export interface GeminiChatHistory {
  messages: GeminiMessage[];
}

export interface GeminiRequest {
  prompt: string;
  history?: GeminiMessage[];
  stream?: boolean;
  model?: string;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

export interface GeminiStreamChunk {
  text: string;
  done: boolean;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export interface GeminiContextValue {
  messages: GeminiMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => void;
}
