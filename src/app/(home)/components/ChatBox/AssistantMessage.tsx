import Markdown from './Markdown';

interface AssistantMessageProps {
  content: string;
}

const AssistantMessage = ({ content }: AssistantMessageProps) => {
  return (
    <div className="p-3 rounded-lg border">
      <Markdown content={content} />
    </div>
  );
};

export default AssistantMessage;
