'use client';

import { useEffect, useRef, useState } from 'react'; // useRef 추가
import { Message } from './types';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import EllipsisLoader from './EllipsisLoader';

const systemMessage = {
  role: 'system',
  content:
    '너는 개발에 대해서 잘 알고 있고 한국말로 답변을 해줘야 해. 모르면 모른다고 해야 해.',
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // 메시지 끝을 참조하는 ref

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);

    const newMessage: Message = { role: 'user', content: inputValue };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue(''); // 입력 필드 초기화

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [systemMessage, ...messages, newMessage],
        }),
      });

      if (!response.body) {
        throw new Error('Response body is null.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantMessage = '';

      while (!done) {
        console.log('!!');
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          assistantMessage += decoder.decode(value, { stream: true });

          setMessages((prevMessages) => {
            // user의 메시지는 그대로 둔다.
            if (prevMessages[prevMessages.length - 1].role !== 'user') {
              prevMessages.pop();
            }

            return [
              ...prevMessages,
              { role: 'assistant', content: assistantMessage },
            ];
          });
        }
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

  // messages가 변경될 때마다 스크롤을 아래로 내린다.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col gap-3 max-w-[1080px] w-full mx-auto">
          {messages.map((msg, index) => {
            if (msg.role === 'user') {
              return <UserMessage key={index} content={msg.content} />;
            }

            return <AssistantMessage key={index} content={msg.content} />;
          })}
          {isLoading ? (
            <div className="flex justify-center">
              <EllipsisLoader />
            </div>
          ) : null}
          {/* 스크롤을 위한 div */}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="flex p-4 border-t">
        <div className="max-w-[1080px] w-full mx-auto">
          <textarea
            className="border rounded-lg p-2 resize-none w-full focus:border-gray-600 focus:outline-none"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3} // 기본 높이 설정
          />
        </div>
      </footer>
    </div>
  );
};

export default ChatBox;
