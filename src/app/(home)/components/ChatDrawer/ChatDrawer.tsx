'use client';

import Drawer from './Drawer';
import CloseIcon from './icons/CloseIcon';
import Link from 'next/link';
import useSavedMessages from '../../hooks/useSavedMessages';
import { useEffect } from 'react';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  const {
    updateCurrentMessageKey,
    updateNewCurrentMessageKey,
    messageHistories,
    refreshMessageHistories,
  } = useSavedMessages();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        refreshMessageHistories();
      }, 0);
    }
  }, [open]);

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
