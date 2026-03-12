/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.aadarshachaulagain.com.np/api/:path*",
      },
    ];
  },
  experimental: {
    proxyTimeout: 300000, // 5 minutes
  },
};
module.exports = nextConfig;