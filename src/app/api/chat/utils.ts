import { Message } from './types';

/**
 * 스트리밍 청크를 파싱하는 함수
 */
export function parseOpenAIStreamChunk(chunk: string): Message[] {
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
}
