interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <p className="p-4 rounded-lg whitespace-pre-wrap bg-blue-50 text-black">
      {content}
    </p>
  );
};

export default UserMessage;
