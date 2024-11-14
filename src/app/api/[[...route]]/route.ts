import { proceduralCall } from '@/app/service/(dao)/db-service';
import { createChatCompletion } from '@/app/service/chat-service';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { NextResponse } from 'next/server';

const app = new Hono().basePath('/api');

app.post('/chat', async (c) => {
  // make api call to groq
  try {
    const { message } = await c.req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    const chatCompletion = await createChatCompletion(message);

    const chatbotResponse =
      chatCompletion.choices[0]?.message?.content || 'No response from llama.';

    try {
      const rows = await proceduralCall(chatbotResponse);
      return NextResponse.json({ data: rows, error: null });
    } catch (e) {
      console.log('Error in sql response: ', e);
      return NextResponse.json({ data: chatbotResponse, error: null });
    }
  } catch (e) {
    console.error('Error in chat API:', e);
    return NextResponse.json(
      {
        error: 'An error occured while processing your request',
      },
      { status: 500 }
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
