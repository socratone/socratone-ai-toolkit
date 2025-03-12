import { OpenAiModel } from '@/types';
import { Message } from './types';

/**
 * 스트리밍 청크를 파싱하는 함수
 */
const parseOpenAIStreamChunk = (chunk: string): Message[] => {
  // 스트림 데이터를 줄 단위로 분리
  const lines = chunk.split('\n').filter((line) => line.trim() !== '');

  // 각 줄을 처리
  return lines
    .map((line) => {
      // [DONE] 라인은 무시
      if (line === 'data: [DONE]') {
        return null;
      }

      try {
        // 'data: ' 제거 후 JSON 파싱
        const jsonString = line.replace('data: ', '');
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('Failed to parse line:', line, error);
        return null; // 파싱 실패 시 null 반환
      }
    })
    .filter(Boolean); // null 값을 필터링하여 반환
};

export const streamChatFromDeepSeek = async (messages: any[]) => {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key is not configured.');
  }

  // https://platform.openai.com/docs/api-reference/chat/create
  const apiRequestBody = {
    model: 'deepseek-chat',
    messages, // ChatGPT 대화 형식에 맞는 메시지 배열
    stream: true, // 스트리밍을 활성화합니다.
  };

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(apiRequestBody),
  });

  return new ReadableStream({
    // 스트림이 시작될 때 실행되는 함수
    async start(controller) {
      if (!response.body) {
        throw new Error('response.body is null.');
      }

      // ReadableStreamDefaultReader를 생성하여 스트림 데이터를 읽기 위한 준비
      const reader = response.body.getReader();
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
};

export const streamChatFromOpenAi = async (
  model: OpenAiModel,
  messages: any[]
) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured.');
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
    throw new Error(
      errorResponse.error.message || 'Failed to fetch from OpenAI.'
    );
  }

  return new ReadableStream({
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
};
