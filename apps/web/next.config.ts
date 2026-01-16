import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 브라우저에서 프로덕션 번들까지 소스맵을 볼 수 있도록 설정
  productionBrowserSourceMaps: true,

  turbopack: {
    // SVG 파일을 React 컴포넌트로 불러올 수 있도록 설정
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
