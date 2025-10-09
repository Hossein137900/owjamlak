/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 👈 add this

  images: {
    domains: ['localhost', 'oujamlak.ir'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oujamlak.ir',
        pathname: '/api/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/**',
      },
    ],
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
