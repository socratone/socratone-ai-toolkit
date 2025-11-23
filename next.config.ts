import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 브라우저에서 프로덕션 번들까지 소스맵을 볼 수 있도록 설정
  productionBrowserSourceMaps: true,

  webpack(config, { dev, isServer }) {
    // 개발 환경에서 좀 더 디버깅 친화적인 소스맵 사용
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }

    // SVG 파일을 React 컴포넌트로 불러올 수 있도록 설정
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
