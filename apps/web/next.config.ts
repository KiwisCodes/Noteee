import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@noteee/core', '@noteee/database', '@noteee/editor', '@noteee/ui'],
  reactStrictMode: true
};

export default nextConfig;
