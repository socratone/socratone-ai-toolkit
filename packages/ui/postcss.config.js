/**
 * PostCSS 설정 파일
 *
 * PostCSS는 CSS를 변환하는 도구입니다.
 * Tailwind CSS는 PostCSS 플러그인으로 동작하며,
 * @tailwind 지시문을 실제 CSS로 변환합니다.
 */

export default {
  plugins: {
    /**
     * tailwindcss: Tailwind CSS 플러그인
     * @tailwind base, components, utilities를 실제 CSS로 변환합니다.
     */
    tailwindcss: {},
  },
};
