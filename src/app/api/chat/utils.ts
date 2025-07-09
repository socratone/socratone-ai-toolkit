import { Message, AiModel } from '@/types';
import { OpenAiMessage } from './types';

/**
 * 스트리밍 청크를 파싱하는 함수
 */
const parseOpenAIStreamChunk = (chunk: string): OpenAiMessage[] => {
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

/**
 * Ollama 스트리밍 청크를 파싱하는 함수
 */
const parseOllamaStreamChunk = (chunk: string): any[] => {
  // 스트림 데이터를 줄 단위로 분리
  const lines = chunk.split('\n').filter((line) => line.trim() !== '');

  // 각 줄을 처리
  return lines
    .map((line) => {
      try {
        // JSON 파싱
        return JSON.parse(line);
      } catch (error) {
        console.error('Failed to parse line:', line, error);
        return null; // 파싱 실패 시 null 반환
      }
    })
    .filter(Boolean); // null 값을 필터링하여 반환
};

/**
 * DeepSeek 모델에서 비스트리밍 방식으로 채팅 응답을 받는 함수
 * @param messages - 사용자와 AI 간의 대화 메시지 배열
 * @returns 모델의 응답 텍스트
 * TODO: 성능 개선을 위해 추론만 할 수 있도록 변경
 */
export const chatFromDeepSeek = async (
  messages: Message[]
): Promise<string> => {
  // API 요청 본문 구성 (stream: false로 설정하여 비스트리밍 방식 사용)
  const apiRequestBody = {
    model: 'deepseek-r1:7b',
    prompt: messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n'), // 메시지 배열을 텍스트로 변환
    stream: false, // 스트리밍 비활성화
  };

  try {
    // Ollama API에 POST 요청 전송
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });

    // 응답이 성공적이지 않은 경우 에러 처리
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'DeepSeek API 요청 실패');
    }

    // JSON 응답 파싱
    const data = await response.json();

    // Ollama API는 response 필드에 텍스트를 직접 반환
    return data.response || '';
  } catch (error) {
    console.error('DeepSeek 모델 호출 중 오류 발생:', error);
    throw new Error(
      `DeepSeek API 호출 실패: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const streamChatFromDeepSeek = async (messages: Message[]) => {
  const apiRequestBody = {
    model: 'deepseek-r1:7b',
    prompt: messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n'), // 메시지 배열을 텍스트로 변환
    stream: true,
  };

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
        const parsedMessages = parseOllamaStreamChunk(chunk);

        parsedMessages.forEach((message) => {
          // Ollama API는 response 필드에 텍스트를 직접 반환합니다
          const content = message?.response;
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
  model: AiModel,
  messages: Message[]
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

/**
 * ExaOne 모델에서 스트리밍 방식으로 채팅 응답을 받는 함수
 * @param messages - 사용자와 AI 간의 대화 메시지 배열
 * @returns 스트리밍 응답을 처리하는 ReadableStream
 */
export const streamChatFromExaOne = async (messages: Message[]) => {
  // API 요청 본문 구성 (stream: true로 설정하여 스트리밍 방식 사용)
  const apiRequestBody = {
    model: 'exaone3.5:latest', // ExaOne 모델 지정
    prompt: messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n'), // 메시지 배열을 텍스트로 변환
    stream: true, // 스트리밍 활성화
  };

  // Ollama API에 POST 요청 전송
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiRequestBody),
  });

  // 응답이 성공적이지 않은 경우 에러 처리
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`ExaOne API 요청 실패: ${errorData}`);
  }

  // ReadableStream을 반환하여 스트리밍 응답 처리
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
        const parsedMessages = parseOllamaStreamChunk(chunk);

        parsedMessages.forEach((message) => {
          // Ollama API는 response 필드에 텍스트를 직접 반환합니다
          const content = message?.response;
          if (content) {
            controller.enqueue(content); // 유효한 경우에만 enqueue
          }
        });
      }

      // 모든 데이터를 처리한 후 스트림 종료
      controller.close();
    },
  });
};

/**
 * <think> 태그와 </think> 태그 사이의 텍스트를 추출하는 함수
 * @param text - 추출할 텍스트가 포함된 문자열
 * @returns <think>와 </think> 사이의 텍스트. 태그가 없는 경우 '' 반환
 */
export const extractThinkContent = (text: string): string => {
  // 정규식을 사용하여 <think>와 </think> 사이의 내용을 추출
  const regex = /<think>([\s\S]*?)<\/think>/;
  const match = text.match(regex);

  // 매칭된 결과가 있으면 첫 번째 캡처 그룹(태그 사이의 내용) 반환, 없으면 '' 반환
  return match ? match[1] : '';
};

/**
 * Anthropic API로부터 스트리밍 챗 응답을 받아 ReadableStream으로 반환합니다.
 * @param model - 사용할 AI 모델
 * @param messages - 대화 메시지 배열
 * @returns ReadableStream 객체
 */
export const streamChatFromAnthropic = async (
  model: AiModel,
  messages: Message[]
) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key is not configured.');
  }

  // Anthropic API는 'system' 역할을 메시지 배열에서 직접 지원하지 않습니다.
  // 대신, 최상위 'system' 파라미터를 사용해야 합니다.
  const systemMessage = messages.find((msg) => msg.role === 'system');
  const userMessages = messages.filter((msg) => msg.role !== 'system');

  const apiRequestBody = {
    model, // Anthropic 모델명
    system: systemMessage?.content, // 시스템 메시지
    messages: userMessages, // 사용자 및 어시스턴트 메시지
    max_tokens: 1024, // 최대 토큰 수
    stream: true, // 스트리밍 활성화
  };

  const anthropicResponse = await fetch(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(apiRequestBody),
    }
  );

  if (!anthropicResponse.ok) {
    const errorResponse = await anthropicResponse.json();
    throw new Error(
      errorResponse.error.message || 'Failed to fetch from Anthropic.'
    );
  }

  return new ReadableStream({
    async start(controller) {
      if (!anthropicResponse.body) {
        throw new Error('anthropicResponse.body is null.');
      }

      const reader = anthropicResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const eventBlocks = chunk.split('\n\n').filter((block) => block.trim());

        for (const block of eventBlocks) {
          const lines = block.split('\n');
          const eventLine = lines.find((line) => line.startsWith('event:'));
          const dataLine = lines.find((line) => line.startsWith('data:'));

          if (!dataLine) continue;

          const eventType = eventLine
            ? eventLine.substring(7).trim()
            : 'message';

          try {
            const jsonStr = dataLine.substring(5).trim();
            const parsedData = JSON.parse(jsonStr);

            if (eventType === 'content_block_delta') {
              if (parsedData.delta?.type === 'text_delta') {
                const content = parsedData.delta.text;
                if (content) {
                  controller.enqueue(content);
                }
              }
            }
          } catch (e) {
            console.error('Error parsing Anthropic stream chunk:', e);
          }
        }
      }

      controller.close();
    },
  });
};
