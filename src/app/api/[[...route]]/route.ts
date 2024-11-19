import { proceduralCall } from '@/app/service/(dao)/db-service';
import { generateChatResponse } from '@/app/service/chat-service';
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

    const { chatResponse, isRerun, isSql } = await generateChatResponse(
      message
    );

    console.log('chat response is', chatResponse);
    if (isSql) {
      try {
        const rows = await proceduralCall(chatResponse);
        return NextResponse.json({
          data: { chatResponse, rows, isSql, isRerun },
          error: null,
        });
      } catch (e) {
        console.error(e);
        return NextResponse.json({ data: 'Incorrect sql syntax.', error: e });
      }
    } else {
      return NextResponse.json({
        data: { chatResponse, rows: [], isRerun, isSql },
        error: null,
      });
    }
  } catch (e) {
    return NextResponse.json(
      {
        message: 'An error occured while processing your request',
        error: e,
      },
      { status: 500 }
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
