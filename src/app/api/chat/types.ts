export type OpenAiMessage = {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: {
    index: number;
    delta: { content: string };
    logprobs: any;
    finish_reason: 'stop' | null;
  }[];
};
