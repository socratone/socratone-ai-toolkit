export type AiModel =
  | 'claude-sonnet-4-20250514'
  | 'gpt-5.1'
  | 'gpt-5-mini'
  | 'gpt-4o'
  | 'gpt-4.1-mini'
  | 'gpt-4.1'
  | 'deepseek-r1:7b'
  | 'exaone3.5:latest'
  | 'deepseek-to-exaone';

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
