import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import styles from './Markdown.module.scss';
import { toast } from 'react-toastify';

import 'highlight.js/styles/github.css'; // 코드 하이라이팅 스타일 (원하는 테마 선택 가능)
import CopyButton from './CopyButton';

interface MarkdownProps {
  content: string;
}

const Markdown = ({ content }: MarkdownProps) => {
  const generateId = () => {
    // 36진수는 숫자(0-9)와 영어 알파벳 소문자(a-z)를 사용하여 표현
    return `code-${Math.random().toString(36).slice(2, 11)}`; // 유니크한 ID 생성
  };

  const handleCopy = (codeId: string) => {
    const codeElement = document.getElementById(codeId);
    if (codeElement) {
      const codeText = codeElement.innerText;
      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          toast.success('코드가 복사되었습니다.');
        })
        .catch(() => {
          toast.error('코드 복사에 실패했습니다.');
        });
    }
  };

  return (
    <ReactMarkdown
      className={styles.markdown}
      rehypePlugins={[rehypeHighlight]} // 코드 하이라이팅 플러그인
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeId = generateId();

          // Expect Code
          if (match) {
            return (
              <div>
                <CopyButton onClick={() => handleCopy(codeId)} />
                <pre>
                  <code id={codeId} className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          }

          // Inline
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
