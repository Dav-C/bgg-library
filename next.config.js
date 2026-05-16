/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cf.geekdo-images.com' },
      // { protocol: 'http', hostname: 'localhost', port: '3000' }, // if needed for dev
    ],
    qualities: [25, 75],
  },
};

module.exports = nextConfig;