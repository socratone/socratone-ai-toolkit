import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];

export default config;
