'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontSize } from './types';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import EllipsisLoader from './EllipsisLoader';
import classNames from 'classnames';
import Select from '@/components/Select';
import { Message, OpenAiModel } from '@/types';
import ZoomButton from './ZoomButton';
import MenuIcon from './icons/MenuIcon';
import ScrollButton from './ScrollButton';
import { devSystemMessage, modelOptions, systemMessage } from './constants';
import AnimatedButton from '@/components/AnimatedButton';
import {
  DEV_CHECKED_STORAGE_KEY,
  FONT_SIZE_STORAGE_KEY,
  MODEL_STORAGE_KEY,
} from '@/constants';
import useSavedMessages from '../../hooks/useSavedMessages';
import Checkbox from '@/components/Checkbox';

interface ChatBoxProps {
  onOpenMenu: () => void;
}

const ChatBox = ({ onOpenMenu }: ChatBoxProps) => {
  const { currentMessageKey, messagesByDateTime, saveMessages } =
    useSavedMessages();

  const { register, handleSubmit, reset } = useForm<{ userMessage: string }>({
    defaultValues: { userMessage: '' },
  });
  const [fontSize, setFontSize] = useState<FontSize>('text-base');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] =
    useState<OpenAiModel>('gpt-4o-mini');
  const [devChecked, setDevChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 키에 해당하는 messages 초기화
  useEffect(() => {
    if (currentMessageKey) {
      // 저장된 키에 해당하는 messages가 있는 경우
      if (messagesByDateTime[currentMessageKey]) {
        setMessages(messagesByDateTime[currentMessageKey]);
      } else {
        setMessages([]);
      }
    }
  }, [currentMessageKey, messagesByDateTime]);

  // model 값 불러오기
  useEffect(() => {
    const savedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    if (typeof savedModel === 'string') {
      setSelectedModel(savedModel as OpenAiModel);
    }
  }, []);

  // fontSize 값 불러오기
  useEffect(() => {
    const savedFontSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (typeof savedFontSize === 'string') {
      setFontSize(savedFontSize as FontSize);
    }
  }, []);

  // 개발자 체크박스 값 불러오기
  useEffect(() => {
    const savedDevChecked = localStorage.getItem(DEV_CHECKED_STORAGE_KEY);
    if (typeof savedDevChecked === 'string') {
      setDevChecked(savedDevChecked === 'true');
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

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
          messages: [
            devChecked ? devSystemMessage : systemMessage,
            ...updatedMessages,
          ],
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

            if (currentMessageKey) {
              saveMessages(currentMessageKey, updatedMessages);
            }

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

  const handleModelChange = (selectedModel: OpenAiModel) => {
    localStorage.setItem(MODEL_STORAGE_KEY, selectedModel);
    setSelectedModel(selectedModel);
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    setFontSize(fontSize);
  };

  const handleDevCheckedChange = (checked: boolean) => {
    localStorage.setItem(DEV_CHECKED_STORAGE_KEY, checked.toString());
    setDevChecked(checked);
  };

  const handleScrollButtonClick = () => {
    if (!mainRef.current) return;
    mainRef.current.scrollTo({
      top: 1_000_000_000,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col h-screen lg:flex-row mx-auto max-w-[1920px]">
      <main ref={mainRef} className="flex-grow overflow-y-auto p-3">
        <button
          className="fixed flex justify-center items-center top-3 left-3 z-10 size-10"
          onClick={onOpenMenu}
        >
          <MenuIcon />
        </button>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-end items-center gap-1">
            <Checkbox
              checked={devChecked}
              onCheckedChange={handleDevCheckedChange}
              label="개발자 모드"
            />
            <ZoomButton value={fontSize} onChange={handleFontSizeChange} />
            <Select
              value={selectedModel}
              onChange={handleModelChange}
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
      <aside className="relative flex flex-col gap-2 p-3 border-t flex-shrink-0 lg:border-t-0 lg:border-l lg:w-96">
        <ScrollButton
          direction="down"
          onClick={handleScrollButtonClick}
          className="hidden absolute bottom-3 right-full mr-3 lg:flex"
        />
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
          <AnimatedButton
            disabled={isLoading}
            onClick={handleSubmit(sendMessage)}
          >
            Chat <span className="text-xs">(CMD + Enter)</span>
          </AnimatedButton>
        </div>
      </aside>
    </div>
  );
};

export default ChatBox;
