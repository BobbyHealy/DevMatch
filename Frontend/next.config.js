/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
