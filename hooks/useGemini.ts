'use client';

import { useState, useCallback } from 'react';
import type { GeminiMessage } from '@/lib/gemini/types';

interface UseGeminiOptions {
  stream?: boolean;
  model?: string;
  onError?: (error: string) => void;
}

interface UseGeminiReturn {
  messages: GeminiMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => void;
}

export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const { stream = false, model, onError } = options;
  
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message to history
    const userMessage: GeminiMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      if (stream) {
        await handleStreamingRequest(message, messages, setMessages, model);
      } else {
        await handleNonStreamingRequest(message, messages, setMessages, model);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, stream, model, onError]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };
}

async function handleNonStreamingRequest(
  message: string,
  history: GeminiMessage[],
  setMessages: React.Dispatch<React.SetStateAction<GeminiMessage[]>>,
  model?: string
) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: message,
      history: history,
      stream: false,
      model,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get response');
  }

  const data = await response.json();
  
  const modelMessage: GeminiMessage = {
    role: 'model',
    content: data.text,
    timestamp: Date.now(),
  };
  
  setMessages(prev => [...prev, modelMessage]);
}

async function handleStreamingRequest(
  message: string,
  history: GeminiMessage[],
  setMessages: React.Dispatch<React.SetStateAction<GeminiMessage[]>>,
  model?: string
) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: message,
      history: history,
      stream: true,
      model,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get streaming response');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No reader available');
  }

  const decoder = new TextDecoder();
  let accumulatedText = '';
  
  // Add empty model message that we'll update
  const modelMessageIndex = history.length + 1; // +1 for the user message we just added
  setMessages(prev => [...prev, {
    role: 'model',
    content: '',
    timestamp: Date.now(),
  }]);

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.error) {
              throw new Error(data.error);
            }
            
            if (data.text) {
              accumulatedText += data.text;
              
              // Update the model message with accumulated text
              setMessages(prev => {
                const updated = [...prev];
                updated[modelMessageIndex] = {
                  role: 'model',
                  content: accumulatedText,
                  timestamp: Date.now(),
                };
                return updated;
              });
            }
            
            if (data.done) {
              break;
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
