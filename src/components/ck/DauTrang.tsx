'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrienXemBoi } from '@/components/r1/HoaVanE3';
import type { MucMenu } from '@/lib/trang/dieu-huong';

export interface DauTrangProps {
  mucMenu: MucMenu[];
}

function khopMuc(pathname: string, muc: MucMenu): boolean {
  if (pathname === muc.href) return true;
  if (muc.con?.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`))) return true;
  return muc.href !== '/' && pathname.startsWith(`${muc.href}/`);
}

export default function DauTrang({ mucMenu }: DauTrangProps) {
  const pathname = usePathname() || '/';
  const [moSubHref, setMoSubHref] = useState<string | null>(null);
  const [moDrawer, setMoDrawer] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const nutMenuRef = useRef<HTMLButtonElement | null>(null);
  const nutDongRef = useRef<HTMLButtonElement | null>(null);
  const mucThemRef = useRef<HTMLLIElement | null>(null);
  const nutThemRef = useRef<HTMLButtonElement | null>(null);

  const KHOA_THEM = '__them__';
  const mucChinhDesktop = mucMenu.filter((m) => !m.them);
  const mucThemDesktop = mucMenu.filter((m) => m.them);
  const dangMoThem = moSubHref === KHOA_THEM;
  const dangChonThem = mucThemDesktop.some((m) => khopMuc(pathname, m));

  const coNutLapLaSo = mucMenu.some(
    (m) => m.href === '/tu-vi/lap-la-so' || m.con?.some((c) => c.href === '/tu-vi/lap-la-so'),
  );

  // Đóng menu con & ngăn kéo khi đổi trang
  useEffect(() => {
    setMoSubHref(null);
    setMoDrawer(false);
  }, [pathname]);

  // Đóng menu con desktop khi bấm ngoài hoặc nhấn Esc
  useEffect(() => {
    if (!moSubHref) return;
    const onPointerDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMoSubHref(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const dangLaThem = moSubHref === KHOA_THEM;
        setMoSubHref(null);
        if (dangLaThem && mucThemRef.current?.contains(document.activeElement)) {
          nutThemRef.current?.focus();
        }
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [moSubHref]);

  // Khóa cuộn nền, xử lý Esc và focus khi mở ngăn kéo mobile
  useEffect(() => {
    if (!moDrawer) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nutDongRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoDrawer(false);
        nutMenuRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [moDrawer]);

  const dongDrawer = () => {
    setMoDrawer(false);
    nutMenuRef.current?.focus();
  };

  return (
    <>
      <div className="ck-dai-tren">
        <div className="ck-w ck-dai-tren-in">
          <span>XemBói.vn · Lá số tử vi &amp; lịch âm</span>
          <span className="ck-dai-tren-phai">Không hù dọa · Không bán lễ giải hạn</span>
        </div>
      </div>

      <header className="ck-dau ck-toi">
        <div className="ck-w ck-dau-in">
          <Link href="/" className="ck-logo" aria-label="xemboi.vn, trang chủ">
            <TrienXemBoi className="ck-trien-o" />
            <span className="ck-logo-vach" aria-hidden="true" />
            <span className="ck-logo-chu">
              <b className="ck-chu-vang">xemboi.vn</b>
              <small>
                <i />
                Tử vi · Lịch âm · Huyền học
                <i />
              </small>
            </span>
          </Link>

          <div className="ck-dau-hanh-dong">
            {coNutLapLaSo && (
              <Link href="/tu-vi/lap-la-so" className="ck-nut ck-dau-cta">
                Lập lá số
              </Link>
            )}
            <button
              ref={nutMenuRef}
              type="button"
              className="ck-nut-menu"
              aria-expanded={moDrawer}
              aria-controls="ck-ngan-keo"
              aria-label="Mở menu điều hướng"
              onClick={() => setMoDrawer(true)}
            >
              <span aria-hidden="true">☰</span>
              <span>Menu</span>
            </button>
          </div>
        </div>

        <div className="ck-hoi-van" aria-hidden="true" />

        <nav ref={navRef} className="ck-menu" aria-label="Điều hướng chính">
          <div className="ck-w">
            <ul className="ck-menu-ds">
              {mucChinhDesktop.map((m) => {
                const coCon = Boolean(m.con && m.con.length > 0);
                const dangMo = moSubHref === m.href;
                const dangChon = khopMuc(pathname, m);

                return (
                  <li
                    key={m.href}
                    className={`ck-menu-muc${dangMo ? ' ck-menu-mo' : ''}`}
                    onMouseEnter={() => {
                      if (coCon) setMoSubHref(m.href);
                    }}
                    onMouseLeave={() => {
                      if (coCon && moSubHref === m.href) setMoSubHref(null);
                    }}
                  >
                    <Link
                      href={m.href}
                      className={`ck-menu-link${dangChon ? ' ck-on' : ''}`}
                      aria-current={pathname === m.href ? 'page' : undefined}
                    >
                      {m.ten}
                    </Link>

                    {coCon && (
                      <>
                        <button
                          type="button"
                          className="ck-menu-nut-con"
                          aria-label={`Mở mục con ${m.ten}`}
                          aria-expanded={dangMo}
                          aria-haspopup="menu"
                          onClick={() => setMoSubHref(dangMo ? null : m.href)}
                        >
                          <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                            <path
                              d="M1 1.5l5 5 5-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <ul className="ck-menu-con" aria-label={`Các trang trong ${m.ten}`}>
                          {m.con!.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className={pathname === c.href ? 'ck-on' : undefined}
                                aria-current={pathname === c.href ? 'page' : undefined}
                              >
                                {c.ten}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                );
              })}

              {mucThemDesktop.length > 0 && (
                <li
                  ref={mucThemRef}
                  className={`ck-menu-muc${dangMoThem ? ' ck-menu-mo' : ''}`}
                  onMouseEnter={() => setMoSubHref(KHOA_THEM)}
                  onMouseLeave={() => {
                    if (moSubHref === KHOA_THEM) setMoSubHref(null);
                  }}
                >
                  <button
                    ref={nutThemRef}
                    type="button"
                    className={`ck-menu-link ck-menu-them-nut${dangChonThem ? ' ck-on' : ''}`}
                    aria-expanded={dangMoThem}
                    aria-haspopup="menu"
                    aria-controls="ck-menu-them-con"
                    onClick={() => setMoSubHref(dangMoThem ? null : KHOA_THEM)}
                  >
                    <span>Thêm</span>
                    <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                      <path
                        d="M1 1.5l5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <ul
                    id="ck-menu-them-con"
                    className="ck-menu-con ck-menu-con-phai"
                    aria-label="Các chuyên mục khác"
                  >
                    {mucThemDesktop.map((m) => (
                      <li key={m.href} className="ck-menu-them-nhom">
                        <Link
                          href={m.href}
                          className={`ck-menu-them-hub${pathname === m.href ? ' ck-on' : ''}`}
                          aria-current={pathname === m.href ? 'page' : undefined}
                        >
                          {m.ten}
                        </Link>
                        {m.con && m.con.length > 0 && (
                          <ul className="ck-menu-them-con-ds">
                            {m.con.map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className={`ck-menu-them-con-link${pathname === c.href ? ' ck-on' : ''}`}
                                  aria-current={pathname === c.href ? 'page' : undefined}
                                >
                                  {c.ten}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {moDrawer && (
        <>
          <div className="ck-nen-mo" aria-hidden="true" onClick={dongDrawer} />
          <div
            id="ck-ngan-keo"
            className="ck-ngan-keo"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
          >
            <div className="ck-ngan-keo-dau">
              <b>xemboi.vn</b>
              <button
                ref={nutDongRef}
                type="button"
                className="ck-nut-dong"
                aria-label="Đóng menu"
                onClick={dongDrawer}
              >
                ×
              </button>
            </div>

            <ul className="ck-ngan-keo-ds">
              <li>
                <Link
                  href="/"
                  className={pathname === '/' ? 'ck-on' : undefined}
                  aria-current={pathname === '/' ? 'page' : undefined}
                  onClick={() => setMoDrawer(false)}
                >
                  Trang chủ
                </Link>
              </li>
              {mucMenu.map((m) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    className={pathname === m.href ? 'ck-on' : undefined}
                    aria-current={pathname === m.href ? 'page' : undefined}
                    onClick={() => setMoDrawer(false)}
                  >
                    {m.ten}
                  </Link>
                  {m.con && m.con.length > 0 && (
                    <ul className="ck-ngan-keo-con">
                      {m.con.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className={pathname === c.href ? 'ck-on' : undefined}
                            aria-current={pathname === c.href ? 'page' : undefined}
                            onClick={() => setMoDrawer(false)}
                          >
                            {c.ten}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
