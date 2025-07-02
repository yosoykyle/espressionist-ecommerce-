//Purpose: Next.js configuration file for the e-commerce application
// This file configures ESLint, TypeScript, image optimization, API rewrites, and more.

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // This is the base path for the application, useful if deploying to a subdirectory
  // basePath: '/espressionist-ecommerce',
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' }, // API requests to backend
      { source: '/admin/:path*', destination: 'http://localhost:8080/admin/:path*' }, // Admin requests to backend
      { source: '/uploads/:path*', destination: 'http://localhost:8080/uploads/:path*' }, // Image uploads to backend
    ];
  },
  
  // IMPORTANT: If you connect to another network and your IP changes,
  // update the IPs below to match your new local IP (find it with `ipconfig` or `ifconfig`).
  allowedDevOrigins: [
    'http://localhost:3000', 
   // 'http://192.168.1.7:3000', // <-- Change this to your new IP if it changes
    'http://172.24.0.1:3000',
    'https://localhost:3000',
   // 'https://192.168.1.7:3000', // <-- Change this to your new IP if it changes
    'https://172.24.0.1:3000',
  ],
}
// This is the Next.js configuration file for the e-commerce application.
export default nextConfig
