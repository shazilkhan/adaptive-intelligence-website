/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or comment out the distDir line
  // distDir: 'build',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  sassOptions: {
    includePaths: ['./src/styles', './node_modules/bootstrap/scss'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/home', // Common old path
        destination: '/',
        permanent: true,
      },
      {
        source: '/old-site/:path*',
        destination: '/',
        permanent: true,
      },
      // Add more specific redirects here as needed
    ];
  },
};

export default nextConfig;