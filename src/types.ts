export type OpenAiModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4';

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type MessagesByDateTime = Record<string, Message[]>;

export type MessageHistory = {
  date: string;
  title: string;
};
