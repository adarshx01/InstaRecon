/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/next-api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

export default nextConfig
