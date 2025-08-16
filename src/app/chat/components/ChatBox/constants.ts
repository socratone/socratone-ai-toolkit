import { AiModel } from '@/types';

export const devSystemMessage = {
  role: 'system',
  content: `한국말로 답변을 해줘야 해. 모르면 모른다고 해야 해.
너는 경험이 많은 시니어 개발자야. 다음 규칙을 따라야해.
- 한국말을 사용한다.
- 코드 생성시 주석을 같이 표시한다.`,
};

export const systemMessage = {
  role: 'system',
  content: `한국말로 답변을 해줘야 해. 모르면 모른다고 해야 해.`,
};

export const deepseekSystemMessage = {
  role: 'system',
  content: '',
};

export const modelOptions: { value: AiModel; label: string }[] = [
  {
    label: 'claude-sonnet-4',
    value: 'claude-sonnet-4-20250514',
  },
  {
    label: 'deepseek-to-exaone',
    value: 'deepseek-to-exaone',
  },
  {
    label: 'deepseek-r1:7b',
    value: 'deepseek-r1:7b',
  },
  {
    label: 'exaone3.5:latest',
    value: 'exaone3.5:latest',
  },
  {
    label: 'gpt-4o',
    value: 'gpt-4o',
  },
  {
    label: 'gpt-4.1-mini',
    value: 'gpt-4.1-mini',
  },
  {
    label: 'gpt-4.1',
    value: 'gpt-4.1',
  },
];
