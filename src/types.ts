export type AiModel =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4'
  | 'deepseek-r1:7b'
  | 'exaone3.5:latest';

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type MessagesByDateTime = Record<string, Message[]>;

export type MessageHistory = {
  date: string;
  title: string;
};

export type AsrModel =
  | 'openai/whisper-tiny'
  | 'openai/whisper-small'
  | 'openai/whisper-large-v3-turbo';
