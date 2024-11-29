import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    // 요청 데이터 파싱
    const body = await req.json();
    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format. 'messages' must be an array." },
        { status: 400 }
      );
    }

    // OpenAI API 요청 데이터 구성
    const apiRequestBody = {
      model: 'gpt-4o-mini', // 사용하려는 모델 (gpt-3.5-turbo 또는 gpt-4)
      messages: messages, // ChatGPT 대화 형식에 맞는 메시지 배열
      temperature: 0.7, // 응답 다양성을 조절하는 옵션 (0~1)
    };

    // OpenAI API 호출
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

    const data = await openAiResponse.json();

    // OpenAI의 응답에서 생성된 메시지를 추출
    const responseMessage =
      data.choices[0]?.message?.content || 'No response from OpenAI.';

    return NextResponse.json({ content: responseMessage });
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
