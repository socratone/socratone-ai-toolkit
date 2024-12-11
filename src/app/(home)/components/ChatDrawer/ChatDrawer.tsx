'use client';

import Drawer from './Drawer';
import CloseIcon from './icons/CloseIcon';
import Link from 'next/link';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <div className="p-3">
        <button
          className="flex justify-center items-center size-10 mb-2"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <Link
          className="min-h-8 px-2 flex items-center text-lg font-medium"
          href="https://platform.openai.com/settings/organization/usage"
        >
          사용량 확인
        </Link>
      </div>
    </Drawer>
  );
};

export default ChatDrawer;
