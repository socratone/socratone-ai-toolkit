import classNames from 'classnames';

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
      className={classNames(
        'p-3 rounded-lg whitespace-pre-wrap bg-blue-50 text-black ml-auto max-w-lg white',
        className
      )}
    >
      {content}
    </p>
  );
};

export default UserMessage;
