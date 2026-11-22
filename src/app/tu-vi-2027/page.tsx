import type { Metadata } from 'next';
import { Alegreya, Be_Vietnam_Pro } from 'next/font/google';
import { R1_COPY } from '@/lib/r1/copy';
import TrangR1Client from '@/components/r1/TrangR1Client';
import './r1-nen.css';
import './r1.css';

const alegreya = Alegreya({
  subsets: ['vietnamese', 'latin'],
  weight: ['500', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-r1e-tieu',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-r1e-chu',
});

export const metadata: Metadata = {
  title: R1_COPY.tieuDeTrang,
  description: R1_COPY.moTaMeta,
  alternates: {
    canonical: 'https://xemboi.vn/tu-vi-2027',
  },
  openGraph: {
    title: R1_COPY.tieuDeTrang,
    description: R1_COPY.moTaMeta,
    url: 'https://xemboi.vn/tu-vi-2027',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function TuVi2027Page() {
  return <TrangR1Client fontClassName={`${alegreya.variable} ${beVietnamPro.variable}`} />;
}
