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
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' },
      { source: '/admin/:path*', destination: 'http://localhost:8080/admin/:path*' },
      { source: '/uploads/:path*', destination: 'http://localhost:8080/uploads/:path*' },
    ];
  },
  // IMPORTANT: If you connect to another network and your IP changes,
  // update the IPs below to match your new local IP (find it with `ipconfig` or `ifconfig`).
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.7:3000', // <-- Change this to your new IP if it changes
    'https://localhost:3000',
    'https://192.168.1.7:3000', // <-- Change this to your new IP if it changes
  ],
}

export default nextConfig
