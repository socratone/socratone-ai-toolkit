import { NextRequest, NextResponse } from 'next/server';
import {
  chatFromDeepSeek,
  extractThinkContent,
  streamChatFromAnthropic,
  streamChatFromDeepSeek,
  streamChatFromExaOne,
  streamChatFromOpenAi,
} from './utils';
import { AiModel, Message } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages;
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

    if (model === 'deepseek-to-exaone') {
      const deepSeekMessage = await chatFromDeepSeek(messages);

      const thinkContent = extractThinkContent(deepSeekMessage);

      if (thinkContent.trim() && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        lastMessage.content = `${lastMessage.content}\n\n아래 추론 내용을 참고해서 한국말로 답해줘.\n\n${thinkContent}`;
      }

      stream = await streamChatFromExaOne(messages);
    } else if (model === 'deepseek-r1:7b') {
      stream = await streamChatFromDeepSeek(messages);
    } else if (model === 'exaone3.5:latest') {
      stream = await streamChatFromExaOne(messages);
    } else if (model === 'claude-sonnet-4-20250514') {
      stream = await streamChatFromAnthropic(model, messages);
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
