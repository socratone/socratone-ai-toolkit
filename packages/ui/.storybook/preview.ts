/**
 * Storybook Preview 설정 파일
 *
 * 모든 스토리에 적용되는 전역 설정을 정의합니다.
 * - 글로벌 스타일 (Tailwind CSS)
 * - Controls addon 설정
 * - 데코레이터 등
 */

import type { Preview } from '@storybook/react-vite';

// Tailwind CSS 기본 스타일 적용
// 모든 스토리에서 Tailwind 유틸리티 클래스가 동작합니다.
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    /**
     * controls: Controls 패널 설정
     * 컴포넌트 props를 UI에서 동적으로 조작할 수 있습니다.
     */
    controls: {
      matchers: {
        // color로 끝나는 prop은 컬러 피커로 표시
        color: /(background|color)$/i,
        // Date로 끝나는 prop은 날짜 피커로 표시
        date: /Date$/i,
      },
    },
  },
};

export default preview;
