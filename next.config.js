/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost','oujamlak'],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;