import type { ReactNode } from 'react';
import { Alegreya, Be_Vietnam_Pro } from 'next/font/google';
import { SvgSpriteE3 } from '@/components/r1/TranhDauTrang';
import { DefBieuTuongCk } from '@/components/ck/BieuTuongE3';
import DauTrang from '@/components/ck/DauTrang';
import ChanTrang from '@/components/ck/ChanTrang';
import { chanTrang, menuChinh } from '@/lib/trang/dieu-huong';
import './ck-nen.css';
import './ck.css';

const alegreya = Alegreya({
  subsets: ['vietnamese', 'latin'],
  weight: ['500', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--ck-font-tieu',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--ck-font-chu',
});

export default function V2Layout({ children }: { children: ReactNode }) {
  const mucMenu = menuChinh();
  const cotChan = chanTrang();

  return (
    <div className={`ck ${alegreya.variable} ${beVietnamPro.variable}`}>
      <SvgSpriteE3 />
      <DefBieuTuongCk />
      <a href="#noi-dung-chinh" className="ck-bo-qua">
        Chuyển tới nội dung chính
      </a>
      <DauTrang mucMenu={mucMenu} />
      <main id="noi-dung-chinh">{children}</main>
      <ChanTrang cotChan={cotChan} />
    </div>
  );
}
