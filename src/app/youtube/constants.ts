import { AsrModel } from '@/types';

export const modelOptions: { value: AsrModel; label: string }[] = [
  {
    value: 'facebook/wav2vec2-base-960h',
    label: 'facebook/wav2vec2-base-960h',
  },
  {
    value: 'openai/whisper-tiny',
    label: 'openai/whisper-tiny',
  },
  {
    value: 'openai/whisper-small',
    label: 'openai/whisper-small',
  },
  {
    value: 'openai/whisper-large-v3-turbo',
    label: 'openai/whisper-large-v3-turbo',
  },
];
