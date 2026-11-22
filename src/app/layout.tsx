import type { Metadata, Viewport } from 'next';
import TrackerComponent from '@/lib/tracking/useTracker';
import './globals.css';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('ctv_theme');var d=m?m==='dark':(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <TrackerComponent />
        {children}
      </body>
    </html>
  );
}
