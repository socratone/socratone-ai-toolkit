import { cn } from '@/utils/cn';

interface UserMessageProps {
  content: string;
  className?: string;
}

const UserMessage = ({ content, className }: UserMessageProps) => {
  return (
    <p
      style={{
        wordBreak: 'break-all',
      }}
      className={cn(
        'p-3 rounded-lg whitespace-pre-wrap bg-blue-50 text-black ml-32 white',
        className
      )}
    >
      {content}
    </p>
  );
};

export default UserMessage;
