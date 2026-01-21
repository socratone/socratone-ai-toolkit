/**
 * Tailwind CSS 설정 파일
 *
 * Tailwind CSS는 유틸리티 기반의 CSS 프레임워크입니다.
 * 이 설정을 통해 프로젝트에서 사용할 Tailwind 기능을 커스터마이징할 수 있습니다.
 */

import type { Config } from 'tailwindcss';

export default {
  /**
   * content: Tailwind가 클래스명을 스캔할 파일 경로
   * 여기에 지정된 파일들에서 사용된 클래스만 최종 CSS에 포함됩니다.
   * 사용하지 않는 클래스는 자동으로 제거되어 번들 크기를 최소화합니다.
   */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // ui 패키지의 컴포넌트에서 사용하는 Tailwind 클래스를 빌드에 포함
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],

  /**
   * theme: 기본 테마 확장 설정
   * extend를 사용하면 기본 Tailwind 테마를 유지하면서 추가 설정만 확장합니다.
   */
  theme: {
    extend: {
      /**
       * colors: 커스텀 색상 정의
       * CSS 변수를 사용하여 다크모드 등 테마 전환을 지원합니다.
       * 사용 예: bg-background, text-foreground
       */
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },

  /**
   * plugins: Tailwind 플러그인 목록
   * 추가 유틸리티나 컴포넌트를 제공하는 플러그인을 등록합니다.
   * 예: @tailwindcss/forms, @tailwindcss/typography
   */
  plugins: [],
} satisfies Config;
