/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['msedge-tts', 'ws'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.vietqr.io',
      },
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
      },
    ],
  },
};

export default nextConfig;
