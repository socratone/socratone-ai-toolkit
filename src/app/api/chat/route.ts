import { NextRequest, NextResponse } from 'next/server';
import {
  streamChatFromDeepSeek,
  streamChatFromExaOne,
  streamChatFromOpenAi,
} from './utils';
import { AiModel } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const model: AiModel = body.model;

    if (!model) {
      return NextResponse.json({ error: 'Invalid model.' }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format. 'messages' must be an array." },
        { status: 400 }
      );
    }

    let stream: ReadableStream | null = null;

    if (model === 'deepseek-r1:7b') {
      stream = await streamChatFromDeepSeek(messages);
    } else if (model === 'exaone3.5:latest') {
      stream = await streamChatFromExaOne(messages);
    } else {
      stream = await streamChatFromOpenAi(model, messages);
    }

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
