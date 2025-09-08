/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 👈 add this

  images: {
    domains: ['localhost', 'oujamlak'],
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
