/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  publicRuntimeConfig: {
    backendUrl: process.env.backendUrl, // only for developers usage on localhost
    WS_BACKEND_URL: process.env.WS_BACKEND_URL,
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
    deviceSizes: [768, 1200, 1920],
    imageSizes: [96, 384],
    domains: ['127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**'
      }
    ]
  },
  i18n
};

module.exports = nextConfig;
