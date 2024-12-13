'use client';

import Drawer from './Drawer';
import CloseIcon from './icons/CloseIcon';
import Link from 'next/link';
import useSavedMessages from '../../hooks/useSavedMessages';
import { useEffect, useState } from 'react';
import { MessageHistory, MessagesByDateTime } from '@/types';
import { MESSAGES_STORAGE_KEY } from '@/constants';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  const [messageHistories, setMessageHistories] = useState<MessageHistory[]>(
    []
  );

  const {
    updateCurrentMessageKey,
    updateNewCurrentMessageKey,
    deleteMessages,
  } = useSavedMessages();

  const convertToTitle = (content: string) => {
    return content.substring(0, 18);
  };

  const convertToMessageHistories = (
    messagesByDateTime: MessagesByDateTime
  ) => {
    return Object.entries(messagesByDateTime).map(([dateKey, messages]) => {
      const firstUserContent =
        messages.find((message) => message.role === 'user')?.content ?? '없음';

      return {
        date: dateKey,
        title: convertToTitle(firstUserContent),
      };
    });
  };

  // messageHistories 초기화
  useEffect(() => {
    if (open) {
      const messagesByDateTimeString =
        localStorage.getItem(MESSAGES_STORAGE_KEY);

      try {
        // localStorage에 저장된 값이 있는 경우
        if (messagesByDateTimeString) {
          const messagesByDateTime: MessagesByDateTime = JSON.parse(
            messagesByDateTimeString
          );

          const messageHistories =
            convertToMessageHistories(messagesByDateTime);

          setMessageHistories(messageHistories.reverse());
        }
      } catch {
        console.warn('Invalid saved messages.');
      }
    }
  }, [open]);

  const handleNewClick = () => {
    updateNewCurrentMessageKey();
    onClose();
  };

  const handleMessageHistoryClick = (date: string) => {
    updateCurrentMessageKey(date);
    onClose();
  };

  const handleMessageDelete = (date: string) => {
    deleteMessages(date);
    setMessageHistories(
      messageHistories.filter((history) => history.date !== date)
    );
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="px-3 h-full flex flex-col overflow-y-auto">
        <header className="bg-white py-2 flex-shrink-0 sticky top-0 border-b">
          <button
            className="flex justify-center items-center size-10 mb-1"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
          <button
            className="min-h-8 px-2 block items-center text-lg w-full text-start"
            onClick={handleNewClick}
          >
            새로운 채팅
          </button>
        </header>

        <ul className="flex-shrink-0 py-2">
          {messageHistories.map((message) => (
            <li key={message.date} className="min-h-8 flex justify-between">
              <button
                className="min-h-8 px-2 flex-grow flex items-center text-lg"
                onClick={() => handleMessageHistoryClick(message.date)}
              >
                {message.title}
              </button>
              <button
                className="min-h-8 px-2 flex items-center text-sm text-gray-500"
                onClick={() => handleMessageDelete(message.date)}
              >
                Del
              </button>
            </li>
          ))}
        </ul>

        <footer className="mt-auto bg-white py-2 sticky bottom-0 border-t">
          <Link
            className="min-h-8 px-2 flex items-center text-lg font-medium"
            href="https://platform.openai.com/settings/organization/usage"
          >
            사용량 확인
          </Link>
        </footer>
      </div>
    </Drawer>
  );
};

export default ChatDrawer;
