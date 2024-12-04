import { NextRequest, NextResponse } from 'next/server';
import { parseOpenAIStreamChunk } from './utils';

export async function POST(req: NextRequest) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const messages = body.messages;
    const model = body.model ?? 'gpt-4o-mini';

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format. 'messages' must be an array." },
        { status: 400 }
      );
    }

    // https://platform.openai.com/docs/api-reference/chat/create
    const apiRequestBody = {
      model, // 사용하려는 모델
      messages, // ChatGPT 대화 형식에 맞는 메시지 배열
      temperature: 0.7, // 응답 다양성을 조절하는 옵션 (0~1)
      stream: true, // 스트리밍을 활성화합니다.
    };

    const openAiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(apiRequestBody),
      }
    );

    if (!openAiResponse.ok) {
      const errorResponse = await openAiResponse.json();
      return NextResponse.json(
        {
          error: errorResponse.error.message || 'Failed to fetch from OpenAI.',
        },
        { status: openAiResponse.status }
      );
    }

    // 스트리밍 응답을 클라이언트에 전달
    const stream = new ReadableStream({
      // 스트림이 시작될 때 실행되는 함수
      async start(controller) {
        if (!openAiResponse.body) {
          throw new Error('openAiResponse.body is null.');
        }

        // ReadableStreamDefaultReader를 생성하여 스트림 데이터를 읽기 위한 준비
        const reader = openAiResponse.body.getReader();
        // 바이트 데이터를 문자열로 변환하기 위한 TextDecoder 생성
        const decoder = new TextDecoder();

        // 스트림 데이터를 반복적으로 읽는 루프
        while (true) {
          // reader.read()를 호출하여 스트림에서 데이터를 읽음
          const { done, value } = await reader.read();
          // 스트림 끝에 도달하면 반복 종료
          if (done) break;

          // 읽은 바이트 데이터를 문자열로 디코딩
          const chunk = decoder.decode(value, { stream: true });

          // 청크 데이터를 파싱하고 메시지를 스트림에 추가
          const parsedMessages = parseOpenAIStreamChunk(chunk);

          parsedMessages.forEach((message) => {
            const content = message?.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(content); // 유효한 경우에만 enqueue
            }
          });
        }

        controller.close();
      },
    });

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
