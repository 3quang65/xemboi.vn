import type { Metadata } from 'next';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen, MENU_QUAN_TRI, TEN_VAI_TRO } from '@/lib/quan-tri/quyen';
import MenuQuanTri from './MenuQuanTri';
import '../quan-tri.css';

export const metadata: Metadata = {
  title: { default: 'Quản trị', template: '%s · Quản trị XemBói' },
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function KhuQuanTriLayout({ children }: { children: React.ReactNode }) {
  const nd = await yeuCauQuyen();
  const menu = MENU_QUAN_TRI.map((n) => ({ nhom: n.nhom, muc: n.muc.filter((m) => coQuyen(nd.vaiTro, m.quyen)) })).filter((n) => n.muc.length);
  return (
    <div className="qt">
      <aside className="qt-ben">
        <div className="qt-logo">XemBói · Quản trị</div>
        <MenuQuanTri menu={menu.map((n) => ({ nhom: n.nhom, muc: n.muc.map(({ ten, href }) => ({ ten, href })) }))} />
        <div className="qt-nguoi">
          <b>{nd.hoTen}</b>
          {nd.vaiTro.map((v) => TEN_VAI_TRO[v]).join(', ')}
          <form action="/api/quan-tri/dang-xuat" method="post" style={{ marginTop: 8 }}>
            <button className="qt-nut phu" type="submit" formAction="/api/quan-tri/dang-xuat">Đăng xuất</button>
          </form>
        </div>
      </aside>
      <main className="qt-chinh">{children}</main>
    </div>
  );
}
