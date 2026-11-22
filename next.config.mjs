/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['msedge-tts', 'ws'],
  // Nhập tệp Keyword Planner ở /quan-tri/seo/tu-khoa/nhap (server action) cần quá mức 1 MB mặc định.
  experimental: { serverActions: { bodySizeLimit: '20mb' } },
  // Route v1 của bản lam-lai đã gỡ, chuyển sang trang v2 tương ứng (docs/v2/viec-can-anh mục 6.3).
  // Đặt ở đây thay vì SeoChuyenHuong vì bảng đó khớp theo tên miền xemboi.vn, còn các route này chỉ từng chạy ở bản thử.
  async redirects() {
    return [
      { source: '/tu-vi-tron-doi/:duong*', destination: '/tu-vi/tron-doi', statusCode: 301 },
      { source: '/tu-tru', destination: '/bat-tu/lap-la-so', statusCode: 301 },
      { source: '/boi-dich', destination: '/kinh-dich/gieo-que', statusCode: 301 },
      { source: '/la-so/:duong*', destination: '/tu-vi/lap-la-so', statusCode: 301 },
    ];
  },
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
