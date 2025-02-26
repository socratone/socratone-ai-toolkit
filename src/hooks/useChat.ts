import { useState } from 'react';

interface ChatParams {
  onMessageReceived: (text: string) => void;
  model?: string;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const useChat = ({ onMessageReceived, model = 'gpt-4o-mini' }: ChatParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const sendMessage = async (messages: Message[]) => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          model,
          stream: true,
        }),
        signal,
      });

      if (!response || !response.body) {
        throw new Error('Invalid response.');
      }

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        onMessageReceived(chunk);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      controller.abort();
    }
  };

  return {
    sendMessage,
    isLoading,
    isError,
  };
};

export default useChat;
