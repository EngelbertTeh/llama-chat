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

    const responseMessage =
      chatCompletion.choices[0]?.message?.content || 'No response from llama.';

    console.log(proceduralCall());

    return NextResponse.json({ response: responseMessage });
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
