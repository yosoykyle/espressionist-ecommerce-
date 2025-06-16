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
}

export default nextConfig
