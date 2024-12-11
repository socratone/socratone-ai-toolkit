'use client';

import { useEffect, useState } from 'react';
import Drawer from './Drawer';
import CloseIcon from './icons/CloseIcon';
import Link from 'next/link';
import { MESSAGES_STORAGE_KEY } from '@/constants';
import { MessagesByDateTime } from '@/types';
import useCurrentMessageKey from '../../hooks/useCurrentMessageKey';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  const { updateCurrentMessageKey, updateNewCurrentMessageKey } =
    useCurrentMessageKey();

  const [messageHistories, setMessageHistories] = useState<
    { date: string; title: string }[]
  >([]);

  // 메시지 히스토리 리스트 초기화
  useEffect(() => {
    const messagesByDateTimeString = localStorage.getItem(MESSAGES_STORAGE_KEY);
    try {
      // 저장된 값이 있는 경우
      if (messagesByDateTimeString) {
        const messagesByDateTime: MessagesByDateTime = JSON.parse(
          messagesByDateTimeString
        );

        const messageHistories = Object.entries(messagesByDateTime).map(
          ([dateKey, messages]) => {
            const firstUserContent =
              messages.find((message) => message.role === 'user')?.content ??
              '없음';

            return {
              date: dateKey,
              title: firstUserContent?.substring(0, 12),
            };
          }
        );

        setMessageHistories(messageHistories.reverse());
      }
    } catch {
      console.warn('Invalid saved messages.');
    }
  }, []);

  const handleClickNew = () => {
    updateNewCurrentMessageKey();
    onClose();
  };

  const handleClickMessageHistory = (date: string) => {
    updateCurrentMessageKey(date);
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="p-3 h-full flex flex-col">
        <button
          className="flex justify-center items-center size-10 mb-2"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <ul>
          <li>
            <button
              className="min-h-8 px-2 block items-center text-lg w-full text-start"
              onClick={handleClickNew}
            >
              새로운 채팅
            </button>
          </li>

          {messageHistories.map((message) => (
            <li key={message.date} className="min-h-8 flex justify-between">
              <button
                className="min-h-8 px-2 flex-grow flex items-center text-lg"
                onClick={() => handleClickMessageHistory(message.date)}
              >
                {message.title}
              </button>
              {/* TODO: */}
              {/* <button className="min-h-8 px-2 flex items-center text-sm text-gray-500">
              Del
            </button> */}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <Link
            className="min-h-8 px-2 flex items-center text-lg font-medium"
            href="https://platform.openai.com/settings/organization/usage"
          >
            사용량 확인
          </Link>
        </div>
      </div>
    </Drawer>
  );
};

export default ChatDrawer;
