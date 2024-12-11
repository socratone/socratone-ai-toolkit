export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type MessagesByDateTime = Record<string, Message[]>;

export type FontSize =
  | 'text-xs'
  | 'text-sm'
  | 'text-base'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'
  | 'text-4xl'
  | 'text-5xl'
  | 'text-6xl'
  | 'text-7xl';
