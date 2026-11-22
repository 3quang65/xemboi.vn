import type { Metadata, Viewport } from 'next';
import TrackerComponent from '@/lib/tracking/useTracker';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b3361f',
};

// Mặc định chung cho mọi trang (docs/v2/19). Trang v2 tự đặt title, mô tả, canonical, robots qua metaTrang();
// root KHÔNG đặt canonical, để trang nào quên đặt cũng không bị trỏ canonical về trang chủ.
export const metadata: Metadata = {
  metadataBase: new URL('https://xemboi.vn'),
  title: {
    default: 'XemBói.vn – Lá số tử vi, lịch âm, tra mệnh có căn cứ',
    template: '%s | XemBói.vn',
  },
  description:
    'Lập lá số tử vi, xem lịch âm hôm nay, tra năm sinh mệnh gì. Mỗi kết quả ghi rõ công thức, sách và trường phái. Miễn phí, không hù dọa.',
  openGraph: { type: 'website', locale: 'vi_VN', siteName: 'XemBói.vn' },
  twitter: { card: 'summary' },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TrackerComponent />
        {children}
      </body>
    </html>
  );
}
