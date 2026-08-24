import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  transpilePackages: [
    '@portfolio-ai/types',
    '@portfolio-ai/schemas',
    '@portfolio-ai/portfolio-ui',
  ],
};

export default nextConfig;
