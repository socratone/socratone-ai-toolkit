'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontSize } from './types';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import EllipsisLoader from '@/components/EllipsisLoader';
import Select from '@/components/Select';
import { Message, OpenAiModel } from '@/types';
import ZoomButton from './ZoomButton';
import ScrollButton from './ScrollButton';
import { devSystemMessage, modelOptions, systemMessage } from './constants';
import AnimatedButton from '@/components/AnimatedButton';
import {
  DEV_CHECKED_STORAGE_KEY,
  FONT_SIZE_STORAGE_KEY,
  MODEL_STORAGE_KEY,
  ASIDE_WIDTH_STORAGE_KEY,
} from '@/constants';
import useSavedMessages from '../../hooks/useSavedMessages';
import Checkbox from '@/components/Checkbox';
import Textarea from '@/components/Textarea';
import Header from '@/components/Header';

interface ChatBoxProps {
  onOpenMenu: () => void;
}

const ChatBox = ({ onOpenMenu }: ChatBoxProps) => {
  const asideRef = useRef<HTMLElement>(null);

  const {
    currentMessageKey,
    messagesByDateTime,
    saveMessages,
    updateNewCurrentMessageKey,
  } = useSavedMessages();

  const { register, handleSubmit, reset } = useForm<{ userMessage: string }>({
    defaultValues: { userMessage: '' },
  });
  const [fontSize, setFontSize] = useState<FontSize>('text-base');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] =
    useState<OpenAiModel>('gpt-4o-mini');
  const [devChecked, setDevChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // aside 너비 상태 (기본값: lg:w-96와 동일한 384px)
  const [asideWidth, setAsideWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);

  // asideWidth 값 불러오기
  useEffect(() => {
    const savedWidth = localStorage.getItem(ASIDE_WIDTH_STORAGE_KEY);
    if (savedWidth) {
      setAsideWidth(Number(savedWidth));
    }
  }, []);

  // 리사이징 이벤트 핸들러
  useEffect(() => {
    // 마우스 이동 시 aside 너비 계산
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // 현재 마우스 X 위치를 기준으로 새로운 너비 계산
      const newWidth = window.innerWidth - e.clientX;
      // 사용성을 위해 너비를 300px ~ 600px 사이로 제한
      const clampedWidth = Math.min(Math.max(newWidth, 300), 600);
      setAsideWidth(clampedWidth);
      // 로컬 스토리지에 너비 저장
      localStorage.setItem(ASIDE_WIDTH_STORAGE_KEY, clampedWidth.toString());
    };

    // 마우스 버튼을 놓으면 리사이징 종료
    const handleMouseUp = () => {
      setIsResizing(false);
    };

    // 리사이징 중일 때만 이벤트 리스너 등록
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

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
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({
      top: 1_000_000_000,
      behavior: 'smooth',
    });
  };

  const handleNewClick = () => {
    updateNewCurrentMessageKey();
  };

  return (
    <main className="flex flex-col h-screen lg:flex-row">
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto">
        <Header isMenu onOpenMenu={onOpenMenu}>
          <button
            className="min-h-8 px-2 block items-center text-lg w-full text-start font-semibold"
            onClick={handleNewClick}
          >
            새로운 채팅
          </button>
        </Header>
        <section className="flex flex-col gap-3 w-full p-3">
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
        </section>
        {isLoading ? (
          <div className="flex justify-center mt-3">
            <EllipsisLoader />
          </div>
        ) : null}
      </div>
      <aside
        ref={asideRef}
        style={{ width: asideWidth }}
        className="relative flex flex-col gap-2 p-3 border-t flex-shrink-0 lg:border-t-0 lg:border-l"
      >
        {/* 리사이징을 위한 드래그 핸들 */}
        <div
          className="absolute z-50 left-[-2px] top-0 w-[4px] h-full cursor-col-resize hover:bg-blue-300 active:bg-blue-300 transition-colors"
          onMouseDown={() => setIsResizing(true)}
        />
        <ScrollButton
          direction="down"
          onClick={handleScrollButtonClick}
          className="hidden absolute bottom-3 right-full mr-3 lg:flex"
        />
        <div className="flex items-center gap-2">
          <Checkbox
            checked={devChecked}
            onCheckedChange={handleDevCheckedChange}
            label="개발자"
            className="font-medium flex-shrink-0"
          />
          <ZoomButton value={fontSize} onChange={handleFontSizeChange} />
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            options={modelOptions}
            fullWidth
            maxWidth={220}
          />
        </div>
        <div className="w-full relative flex-grow">
          <Textarea
            {...register('userMessage')}
            ref={(e) => {
              (textareaRef.current as any) = e; // ref 업데이트
              register('userMessage').ref(e); // register을 통한 ref 설정
            }}
            disabled={isLoading}
            className={fontSize}
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
            fullWidth
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
    </main>
  );
};

export default ChatBox;
