/**
 * Tailwind CSS 설정 파일
 *
 * Tailwind CSS는 유틸리티 기반의 CSS 프레임워크입니다.
 * 이 설정을 통해 프로젝트에서 사용할 Tailwind 기능을 커스터마이징할 수 있습니다.
 */

/** @type {import('tailwindcss').Config} */
export default {
  /**
   * content: Tailwind가 클래스명을 스캔할 파일 경로
   * 여기에 지정된 파일들에서 사용된 클래스만 최종 CSS에 포함됩니다.
   */
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  /**
   * theme: 기본 테마 확장 설정
   * colors, spacing, fonts 등을 커스터마이징할 수 있습니다.
   */
  theme: {
    extend: {},
  },

  /**
   * plugins: Tailwind 플러그인 목록
   * 추가 유틸리티나 컴포넌트를 제공하는 플러그인을 등록합니다.
   */
  plugins: [],
};
