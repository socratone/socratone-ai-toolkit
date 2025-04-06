import { OpenAiModel } from '@/types';

export const devSystemMessage = {
  role: 'system',
  content: `너는 타입스크립트 경험이 많은 시니어 개발자야. 다음 규칙을 따라야해.
- 한국말을 사용한다.
- 자바스크립트 대신 타입스크립트를 쓴다.
- 코드 생성시 주석을 같이 표시한다.`,
};

export const systemMessage = {
  role: 'system',
  content: `너는 한국말로 답변을 해줘야 해.
      친절하게 답변을 해줘야 해.
      이모지를 넣어도 좋아.
      모르면 모른다고 해야 해.`,
};

export const deepseekSystemMessage = {
  role: 'system',
  content: '',
};

export const modelOptions: { value: OpenAiModel; label: string }[] = [
  {
    label: 'deepseek-r1:7b',
    value: 'deepseek-r1:7b',
  },
  {
    label: 'gpt-4o',
    value: 'gpt-4o',
  },
  {
    label: 'gpt-4o-mini',
    value: 'gpt-4o-mini',
  },
  {
    label: 'gpt-4',
    value: 'gpt-4',
  },
];
