import Image from 'next/image';
import aiImage from './images/ai-512x512.png';
import { cn } from '@/utils/cn';
import Markdown from '@/components/Markdown';

interface AssistantMessageProps {
  content: string;
  className?: string;
}

const AssistantMessage = ({ content, className }: AssistantMessageProps) => {
  return (
    <div className={cn('flex gap-3', className)}>
      <div className="flex-shrink-0">
        <div className="size-12 rounded-full border border-gray-200 flex justify-center items-center">
          <Image
            className="block"
            src={aiImage}
            alt="AI"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="p-3 rounded-lg border overflow-x-auto">
        <Markdown content={content} />
      </div>
    </div>
  );
};

export default AssistantMessage;
