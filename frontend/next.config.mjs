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
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.25:3000', //change to your local IP if run needed npm run dev -- --hostname=0.0.0.0
    'https://localhost:3000',
    'https://192.168.1.25:3000',
  ],
}

export default nextConfig
