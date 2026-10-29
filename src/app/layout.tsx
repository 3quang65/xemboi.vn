import type { Metadata, Viewport } from 'next';
import TrackerComponent from '@/lib/tracking/useTracker';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b3361f',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://xemboi.vn'),
  title: {
    default: 'XemBoi.vn – Xem lá số tử vi chuẩn Nam Phái cùng Bát Đại Danh Sư',
    template: '%s | XemBoi.vn',
  },
  description:
    'Lập lá số tử vi 12 cung chuẩn Nam Phái, bình giải lá số chuyên sâu cùng Hội đồng Bát Đại Danh Sư, xem hạn năm 2026 Bính Ngọ, xem hợp tuổi, tứ trụ bát tự, bói dịch, lịch âm dương Hồ Ngọc Đức và chọn ngày tốt tại XemBoi.vn.',
  keywords: [
    'xem bói',
    'xem tử vi',
    'lá số tử vi',
    'tử vi nam phái',
    'xemboi.vn',
    'lịch âm dương hồ ngọc đức',
    'tử vi 2026 bính ngọ',
    'tử vi trọn đời',
    'tử vi hôm nay',
    'tứ trụ bát tự',
    'bói kinh dịch',
  ],
  alternates: {
    canonical: 'https://xemboi.vn/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://xemboi.vn/',
    siteName: 'XemBoi.vn',
    title: 'XemBoi.vn – Xem lá số tử vi chuẩn Nam Phái cùng Bát Đại Danh Sư',
    description:
      'Lập lá số tử vi 12 cung, bình giải miễn phí, xem hạn năm 2026, xem hợp tuổi, tứ trụ bát tự, lịch vạn niên và chọn ngày tốt.',
    images: [
      {
        url: '/icons/icon.svg',
        width: 512,
        height: 512,
        alt: 'XemBoi.vn – Xem lá số tử vi chuẩn Nam Phái',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'XemBoi.vn – Xem lá số tử vi chuẩn Nam Phái',
    description:
      'Lập lá số tử vi 12 cung, xem hạn năm, xem hợp tuổi, lịch âm dương và chọn ngày tốt.',
  },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'XemBoi.vn',
        alternateName: 'XemBoi.vn – Xem lá số cùng Bát Đại Danh Sư',
        url: 'https://xemboi.vn/',
      },
      {
        '@type': 'WebApplication',
        name: 'XemBoi.vn – Xem lá số tử vi Nam Phái',
        url: 'https://xemboi.vn/',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'All',
        inLanguage: 'vi-VN',
        description:
          'Lập lá số tử vi 12 cung chuẩn Nam Phái, bình giải lá số miễn phí, xem hạn năm, xem hợp tuổi, lịch âm dương và chọn ngày tốt.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'VND',
        },
      },
    ],
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <TrackerComponent />
        {children}
      </body>
    </html>
  );
}
