import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import styles from './Markdown.module.scss';

import 'highlight.js/styles/github.css'; // 코드 하이라이팅 스타일 (원하는 테마 선택 가능)

interface MarkdownProps {
  content: string;
}

const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={styles.markdown}
      rehypePlugins={[rehypeHighlight]} // 코드 하이라이팅 플러그인
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
