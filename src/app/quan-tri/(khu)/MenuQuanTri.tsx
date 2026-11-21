'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Menu = { nhom: string; muc: { ten: string; href: string }[] }[];

export default function MenuQuanTri({ menu }: { menu: Menu }) {
  const duong = usePathname();
  const dangMo = (href: string) => (href === '/quan-tri' ? duong === href : duong === href || duong.startsWith(href + '/'));
  return (
    <nav aria-label="Menu quản trị">
      {menu.map((n) => (
        <div key={n.nhom} style={{ marginBottom: 12 }}>
          <div className="qt-nhom">{n.nhom}</div>
          {n.muc.map((m) => (
            <Link key={m.href} href={m.href} aria-current={dangMo(m.href) ? 'page' : undefined}>
              {m.ten}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
