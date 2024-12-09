import classNames from 'classnames';
import Markdown from './Markdown';

interface AssistantMessageProps {
  content: string;
  className?: string;
}

const AssistantMessage = ({ content, className }: AssistantMessageProps) => {
  return (
    <div className={classNames('p-3 rounded-lg border', className)}>
      <Markdown content={content} />
    </div>
  );
};

export default AssistantMessage;
