'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontSize, Message } from './types';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import EllipsisLoader from './EllipsisLoader';
import classNames from 'classnames';
import Select from '@/components/Select';
import { OpenAiModel } from '@/types';
import ZoomButton from './ZoomButton';
import MenuIcon from './icons/MenuIcon';
import Drawer from './Drawer';
import Link from 'next/link';

const systemMessage = {
  role: 'system',
  content: `너는 개발에 대해서 잘 알고 있고 한국말로 답변을 해줘야 해.
    친절하게 답변을 해줘야 해.
    이모지를 넣어도 좋아.
    javascript 코드로 답변을 해줄 기회가 있을 때에는 가능하면 typescript로 답변을 해줘야 해.
    모르면 모른다고 해야 해.`,
};

const modelOptions: { value: OpenAiModel; label: string }[] = [
  {
    label: 'gpt-4o',
    value: 'gpt-4o',
  },
  {
    label: 'gpt-4o-mini',
    value: 'gpt-4o-mini',
  },
  {
    label: 'gpt-4',
    value: 'gpt-4',
  },
];

const ChatBox = () => {
  const { register, handleSubmit, reset } = useForm<{ userMessage: string }>({
    defaultValues: { userMessage: '' },
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('text-base');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] =
    useState<OpenAiModel>('gpt-4o-mini');

  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // messages 값 불러오기
  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    try {
      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    } catch {
      console.warn('Invalid saved messages.');
    }
  }, []);

  // model 값 불러오기
  useEffect(() => {
    const savedModel = localStorage.getItem('model');
    if (typeof savedModel === 'string') {
      setSelectedModel(savedModel as OpenAiModel);
    }
  }, []);

  // fontSize 값 불러오기
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    if (typeof savedFontSize === 'string') {
      setFontSize(savedFontSize as FontSize);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  const resetMessage = () => {
    setMessages([]);
    localStorage.removeItem('messages');
  };

  const sendMessage = async (data: { userMessage: string }) => {
    const userMessage = data.userMessage.trim();
    if (!userMessage) return;

    setIsLoading(true);

    const newMessage: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [systemMessage, ...updatedMessages],
          model: selectedModel,
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
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          assistantMessage += decoder.decode(value, { stream: true });

          setMessages((prevMessages) => {
            // user의 메시지는 그대로 둔다.
            if (prevMessages[prevMessages.length - 1].role !== 'user') {
              prevMessages.pop();
            }

            const updatedMessages: Message[] = [
              ...prevMessages,
              { role: 'assistant', content: assistantMessage },
            ];

            localStorage.setItem('messages', JSON.stringify(updatedMessages));

            return updatedMessages;
          });
        }
      }

      reset(); // 폼 리셋
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    if (
      (isMac ? event.metaKey : event.ctrlKey) && // Command (Mac) 또는 Ctrl (Windows)
      event.key === 'Enter'
    ) {
      handleSubmit(sendMessage)();
    }
  };

  const handleChangeModel = (selectedModel: OpenAiModel) => {
    localStorage.setItem('model', selectedModel);
    setSelectedModel(selectedModel);
  };

  const handleChangeFontSize = (fontSize: FontSize) => {
    localStorage.setItem('fontSize', fontSize);
    setFontSize(fontSize);
  };

  return (
    <>
      <div className="flex flex-col h-screen lg:flex-row mx-auto max-w-[1920px]">
        <main className="flex-grow overflow-y-auto p-3">
          <button
            className="fixed flex justify-center items-center top-3 left-3 z-10 size-10"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </button>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-end items-center gap-1">
              <ZoomButton value={fontSize} onChange={handleChangeFontSize} />
              <Select
                value={selectedModel}
                onChange={handleChangeModel}
                options={modelOptions}
              />
            </div>
            {messages.map((msg, index) => {
              if (msg.role === 'user') {
                return (
                  <UserMessage
                    key={index}
                    className={fontSize}
                    content={msg.content}
                  />
                );
              }

              return (
                <AssistantMessage
                  key={index}
                  className={fontSize}
                  content={msg.content}
                />
              );
            })}
          </div>
          {isLoading ? (
            <div className="flex justify-center mt-3">
              <EllipsisLoader />
            </div>
          ) : null}
        </main>
        <aside className="flex gap-2 p-3 border-t flex-shrink-0 lg:border-t-0 lg:border-l lg:flex-col lg:w-96">
          <div className="w-full relative flex-grow">
            <textarea
              {...register('userMessage')}
              ref={(e) => {
                (textareaRef.current as any) = e; // ref 업데이트
                register('userMessage').ref(e); // register을 통한 ref 설정
              }}
              disabled={isLoading}
              className={classNames(
                'border rounded-lg p-2 resize-none w-full h-full focus:border-gray-600 focus:outline-none',
                {
                  'bg-gray-200 cursor-not-allowed border-gray-200 focus:border-gray-200 text-white':
                    isLoading,
                },
                fontSize
              )}
              placeholder="Type your message..."
              onKeyDown={handleKeyDown}
              rows={3}
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <button
              disabled={isLoading}
              className={classNames(
                'bg-blue-400 text-white rounded-md px-3 py-2',
                {
                  'bg-gray-200 cursor-not-allowed': isLoading,
                }
              )}
              onClick={handleSubmit(sendMessage)}
            >
              Send{' '}
              <span className="hidden text-xs lg:inline">(CMD + Enter)</span>
            </button>
            <button
              disabled={isLoading}
              className={classNames(
                'border border-blue-400 text-blue-400 rounded-md px-3 py-2',
                {
                  'border-gray-200 text-gray-200 cursor-not-allowed': isLoading,
                }
              )}
              onClick={resetMessage}
            >
              Reset
            </button>
          </div>
        </aside>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="p-3">
          <button
            className="flex justify-center items-center size-10"
            onClick={() => setDrawerOpen(false)}
          >
            <MenuIcon />
          </button>
          <Link
            className="min-h-8 px-2 flex items-center"
            href="https://platform.openai.com/settings/organization/usage"
          >
            사용량 확인
          </Link>
        </div>
      </Drawer>
    </>
  );
};

export default ChatBox;
