/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or comment out the distDir line
  // distDir: 'build',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'admin.adaptiveintelligence.online', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'adaptive-strapi.s3.us-east-1.amazonaws.com', pathname: '/**' },
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
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/resources',
        destination: '/case-studies',
        permanent: true,
      },
      // Add more specific redirects here as needed
    ];
  },
};

export default nextConfig;