import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Slim production image: `output: 'standalone'` (required by frontend/Dockerfile).
  // Rewrites (/api -> backend) keep working in standalone mode.
  output: 'standalone',
  // Allow local network devices to access Next.js dev resources without being blocked by CORS
  allowedDevOrigins: ['192.168.1.3', '192.168.1.5'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000'}/:path*`,
      },
    ]
  },
};
export default nextConfig;
