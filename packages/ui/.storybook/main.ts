/**
 * Storybook 메인 설정 파일
 *
 * Storybook의 핵심 설정을 정의합니다.
 * - 스토리 파일 위치
 * - 사용할 addon 목록
 * - 프레임워크 설정
 */

import type { StorybookConfig } from '@storybook/react-vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * 모노레포에서 패키지의 절대 경로를 구하는 헬퍼 함수
 * pnpm workspace나 Yarn PnP 환경에서 필요합니다.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  /**
   * stories: 스토리 파일을 찾을 경로 패턴
   * - *.mdx: MDX 문서 파일
   * - *.stories.*: 컴포넌트 스토리 파일
   */
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  /**
   * addons: Storybook 기능을 확장하는 addon 목록
   * - chromatic: Chromatic 시각적 테스트 통합
   * - vitest: Vitest 테스트 러너 통합
   * - a11y: 접근성 검사 도구
   * - docs: 자동 문서 생성
   * - onboarding: 초보자 가이드
   */
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
  ],

  /**
   * framework: 사용할 프레임워크
   * React + Vite 조합을 사용합니다.
   */
  framework: getAbsolutePath('@storybook/react-vite'),
};

export default config;
