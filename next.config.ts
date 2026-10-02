import type { NextConfig } from "next";

const backendUrl = process.env.NODE_ENV === 'production'
  ? (process.env.BACKEND_URL && !process.env.BACKEND_URL.includes('localhost') && !process.env.BACKEND_URL.includes('127.0.0.1')
      ? process.env.BACKEND_URL
      : 'https://swaddesh.onrender.com')
  : (process.env.BACKEND_URL || 'http://127.0.0.1:8080');

const nextConfig: NextConfig = {
  compress: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
