// Gemini AI client configuration
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Get the Gemini API client instance
 * This should only be used on the server side
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Get the Gemini model instance
 * @param modelName - The model name (default: gemini-pro)
 */
export function getGeminiModel(modelName: string = 'gemini-pro') {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
}

/**
 * Get the default model name from environment or fallback
 */
export function getDefaultModelName(): string {
  return process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-pro';
}
