import { OpenAiModel } from '@/types';

export const devSystemMessage = {
  role: 'system',
  content: `너는 개발에 대해서 잘 알고 있고 한국말로 답변을 해줘야 해.
      친절하게 답변을 해줘야 해.
      이모지를 넣어도 좋아.
      javascript 코드로 답변을 해줄 기회가 있을 때에는 가능하면 typescript로 답변을 해줘야 해.
      모르면 모른다고 해야 해.`,
};

export const systemMessage = {
  role: 'system',
  content: `너는 한국말로 답변을 해줘야 해.
      친절하게 답변을 해줘야 해.
      이모지를 넣어도 좋아.
      모르면 모른다고 해야 해.`,
};

export const modelOptions: { value: OpenAiModel; label: string }[] = [
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
