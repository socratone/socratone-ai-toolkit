'use client';

import axios from 'axios';

import { useState } from 'react';
import { Message } from './types';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';

const systemMessage = {
  role: 'system',
  content:
    '너는 개발에 대해서 잘 알고 있고 한국말로 답변을 해줘야 해. 모르면 모른다고 해야 해.',
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);

    const newMessage: Message = { role: 'user', content: inputValue };
    setMessages([...messages, newMessage]);

    setInputValue(''); // 입력 필드 초기화

    try {
      const response = await axios.post('/api/chat', {
        messages: [systemMessage, ...messages, newMessage],
      });

      if (response.data.content) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data.content },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault(); // 기본 동작 방지 (줄바꿈 방지)
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, index) => {
          if (msg.role === 'user') {
            return <UserMessage key={index} content={msg.content} />;
          }

          return <AssistantMessage key={index} content={msg.content} />;
        })}
        {isLoading ? <p>Loading...</p> : null}
      </div>
      <footer className="flex p-4 border-t">
        <textarea
          className="flex-grow border rounded-lg p-2 resize-none"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3} // 기본 높이 설정
        />
      </footer>
    </div>
  );
};

export default ChatBox;
