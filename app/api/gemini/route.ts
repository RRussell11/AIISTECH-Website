import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGeminiModel, getDefaultModelName } from '@/lib/gemini/client';
import type { GeminiMessage } from '@/lib/gemini/types';

// Request validation schema
const geminiRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(10000, 'Prompt is too long'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
    timestamp: z.number().optional(),
  })).optional(),
  stream: z.boolean().optional().default(false),
  model: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = geminiRequestSchema.parse(body);
    
    const { prompt, history = [], stream = false, model } = validatedData;
    
    // Get the Gemini model
    const modelName = model || getDefaultModelName();
    const geminiModel = getGeminiModel(modelName);
    
    // Handle streaming responses
    if (stream) {
      return handleStreamingResponse(geminiModel, prompt, history);
    }
    
    // Handle non-streaming responses
    return handleNonStreamingResponse(geminiModel, prompt, history);
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

async function handleNonStreamingResponse(
  model: any,
  prompt: string,
  history: GeminiMessage[]
) {
  try {
    // Start a chat session with history
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });
    
    // Send the message
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

async function handleStreamingResponse(
  model: any,
  prompt: string,
  history: GeminiMessage[]
) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Start a chat session with history
        const chat = model.startChat({
          history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          })),
        });
        
        // Send the message with streaming
        const result = await chat.sendMessageStream(prompt);
        
        // Stream the response chunks
        for await (const chunk of result.stream) {
          const text = chunk.text();
          const data = JSON.stringify({ text, done: false });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        
        // Send completion signal
        const doneData = JSON.stringify({ text: '', done: true });
        controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
        
        controller.close();
      } catch (error) {
        console.error('Streaming error:', error);
        const errorData = JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Streaming failed',
          done: true 
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.close();
      }
    },
  });
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
