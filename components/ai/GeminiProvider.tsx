'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GeminiMessage, GeminiContextValue } from '@/lib/gemini/types';

const GeminiContext = createContext<GeminiContextValue | undefined>(undefined);

interface GeminiProviderProps {
  children: React.ReactNode;
  stream?: boolean;
  model?: string;
}

export function GeminiProvider({ 
  children, 
  stream = false,
  model 
}: GeminiProviderProps) {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: GeminiMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
          history: messages,
          stream,
          model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (stream) {
        await handleStreamingResponse(response, setMessages);
      } else {
        const data = await response.json();
        const modelMessage: GeminiMessage = {
          role: 'model',
          content: data.text,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, modelMessage]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [messages, stream, model]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const value: GeminiContextValue = {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
}

export function useGeminiContext() {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGeminiContext must be used within a GeminiProvider');
  }
  return context;
}

async function handleStreamingResponse(
  response: Response,
  setMessages: React.Dispatch<React.SetStateAction<GeminiMessage[]>>
) {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No reader available');
  }

  const decoder = new TextDecoder();
  let accumulatedText = '';
  
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
              
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
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
            // Ignore parse errors
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
