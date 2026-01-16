/**
 * SVG 파일을 React 컴포넌트로 import할 수 있도록 하는 타입 선언
 */
declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}
