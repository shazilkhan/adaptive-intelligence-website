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
      // Pages renamed 2026-07: keep the original URLs working (they shipped live).
      {
        source: '/adaptive-beats',
        destination: '/adaptive-playlist',
        permanent: true,
      },
      {
        source: '/non-compliant-industries',
        destination: '/divestments',
        permanent: true,
      },
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
      // --- Vanity / legacy URL redirects (from Stacy's redirect list, 2026-07) ---
      // Home (/home already handled above)
      { source: '/homepage', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      // About (/about-us already handled above)
      { source: '/aboutus', destination: '/about', permanent: true },
      { source: '/our-story', destination: '/about', permanent: true },
      { source: '/who-we-are', destination: '/about', permanent: true },
      // Services
      { source: '/service', destination: '/services', permanent: true },
      { source: '/our-services', destination: '/services', permanent: true },
      { source: '/what-we-do', destination: '/services', permanent: true },
      { source: '/solutions', destination: '/services', permanent: true },
      // Case Studies
      { source: '/casestudies', destination: '/case-studies', permanent: true },
      { source: '/case-study', destination: '/case-studies', permanent: true },
      { source: '/portfolio', destination: '/case-studies', permanent: true },
      { source: '/our-work', destination: '/case-studies', permanent: true },
      { source: '/work', destination: '/case-studies', permanent: true },
      { source: '/projects', destination: '/case-studies', permanent: true },
      // Preferred Partners
      { source: '/partners', destination: '/preferred-partners', permanent: true },
      { source: '/partner', destination: '/preferred-partners', permanent: true },
      { source: '/preferredpartners', destination: '/preferred-partners', permanent: true },
      { source: '/partnerships', destination: '/preferred-partners', permanent: true },
      // Divestments
      { source: '/divestment', destination: '/divestments', permanent: true },
      { source: '/divest', destination: '/divestments', permanent: true },
      { source: '/divesting', destination: '/divestments', permanent: true },
      // Eco
      { source: '/sustainability', destination: '/eco', permanent: true },
      { source: '/sustainable', destination: '/eco', permanent: true },
      { source: '/environment', destination: '/eco', permanent: true },
      { source: '/environmental', destination: '/eco', permanent: true },
      // Contact (/contact-us already handled above)
      { source: '/contacus', destination: '/contact', permanent: true },
      { source: '/contactus', destination: '/contact', permanent: true },
      { source: '/get-in-touch', destination: '/contact', permanent: true },
      { source: '/getintouch', destination: '/contact', permanent: true },
      { source: '/reach-out', destination: '/contact', permanent: true },
      // Privacy Policy (/privacy-policy/ trailing slash is handled by Next.js automatically)
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/privacypolicy', destination: '/privacy-policy', permanent: true },
      // Terms & Conditions — the live page is /terms-conditions; point the aliases there.
      // (Doc listed /terms-and-conditions as primary, but no such page exists — see note to Stacy.)
      { source: '/terms', destination: '/terms-conditions', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms-conditions', permanent: true },
      { source: '/termsandconditions', destination: '/terms-conditions', permanent: true },
      // Terms of Use
      { source: '/termsofuse', destination: '/terms-of-use', permanent: true },
      { source: '/terms-use', destination: '/terms-of-use', permanent: true },
      // Cookie Policy
      { source: '/cookies', destination: '/cookie-policy', permanent: true },
      { source: '/cookiepolicy', destination: '/cookie-policy', permanent: true },
      { source: '/cookies-policy', destination: '/cookie-policy', permanent: true },
      // HELD (need target): /client, /our-clients, /client-list — the doc points these
      // at /clients, which is a nav dropdown with no landing page. Awaiting confirmation.

      // Add more specific redirects here as needed
    ];
  },
};

export default nextConfig;