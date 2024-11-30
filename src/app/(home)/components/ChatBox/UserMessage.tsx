interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <p className="p-3 rounded-lg whitespace-pre-wrap bg-blue-50 text-black ml-auto max-w-lg">
      {content}
    </p>
  );
};

export default UserMessage;
