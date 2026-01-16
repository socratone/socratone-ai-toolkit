import { FLASK_API_URL } from '@/constants';
import { AiModel, Message } from '@/types';

export const postChatGpt = async (model: AiModel, messages: Message[]) => {
  const response = await fetch(`${FLASK_API_URL}/chat-gpt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  return response;
};

/**
 * 스트리밍 방식으로 ChatGPT API를 호출하는 함수
 * @param model - 사용할 AI 모델
 * @param messages - 전송할 메시지 배열
 * @param onChunk - 각 청크를 받을 때마다 호출되는 콜백 함수
 */
export const postChatGptStream = async (
  model: AiModel,
  messages: Message[],
  onChunk: (chunk: string) => void
) => {
  const response = await fetch(`${FLASK_API_URL}/chat-gpt/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // 버퍼에 새 데이터 추가
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // 마지막 줄은 불완전할 수 있으므로 버퍼에 유지
      buffer = lines.pop() || '';

      for (const line of lines) {
        // SSE 형식: "data: " 접두사 제거
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          // 스트리밍 종료 신호
          if (data === '[DONE]') {
            return;
          }

          // 에러 처리
          if (data.startsWith('{') && data.includes('error')) {
            try {
              const errorData = JSON.parse(data);
              throw new Error(errorData.error);
            } catch {
              // JSON 파싱 실패 시 원본 데이터 전달
              onChunk(data);
            }
          } else {
            // 정상 데이터 전달 - JSON으로 인코딩된 문자열을 파싱
            try {
              const parsedData = JSON.parse(data);
              onChunk(parsedData);
            } catch {
              // JSON 파싱 실패 시 원본 데이터 전달
              onChunk(data);
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};
