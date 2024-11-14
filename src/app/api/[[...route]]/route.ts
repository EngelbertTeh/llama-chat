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

    // const chatCompletion = await createChatCompletion('response', message);

    // const chatbotResponse =
    //   chatCompletion.choices[0]?.message?.content || 'No response from llama.';
    // console.log('chatbotREsponse is ', chatbotResponse);
    const rows = await proceduralCall(message);
    const chatCompletion = await createChatCompletion(
      'response',
      JSON.stringify(rows)
    );
    const chatbotResponse =
      chatCompletion.choices[0]?.message?.content || 'No response from llama.';

    const jsonObjArr = JSON.parse(chatbotResponse);

    return NextResponse.json({ data: jsonObjArr, error: null });
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
