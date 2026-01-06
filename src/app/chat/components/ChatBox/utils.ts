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
