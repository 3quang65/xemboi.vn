/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['msedge-tts', 'ws'],
  // Nhập tệp Keyword Planner ở /quan-tri/seo/tu-khoa/nhap (server action) cần quá mức 1 MB mặc định.
  experimental: { serverActions: { bodySizeLimit: '20mb' } },
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
