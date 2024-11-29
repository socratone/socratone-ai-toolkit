import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import 'highlight.js/styles/github.css'; // 코드 하이라이팅 스타일 (원하는 테마 선택 가능)

interface AssistantMessageProps {
  content: string;
}

const AssistantMessage = ({ content }: AssistantMessageProps) => {
  return (
    <div className="p-2 rounded-lg border">
      <ReactMarkdown
        className="whitespace-pre-wrap"
        rehypePlugins={[rehypeHighlight]} // 코드 하이라이팅 플러그인
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AssistantMessage;
