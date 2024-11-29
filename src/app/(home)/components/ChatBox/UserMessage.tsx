interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <p className="p-2 rounded-lg whitespace-pre-line bg-blue-100 text-black">
      {content}
    </p>
  );
};

export default UserMessage;
