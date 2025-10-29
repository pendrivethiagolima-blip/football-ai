import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  experimental: {
    ppr: true
  }
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
})(baseConfig);


