import React from 'react';
import Link from 'next/link';

export default function SubpageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="xb-subpage-header" style={{ padding: '24px 14px 18px', textAlign: 'center' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ marginBottom: 10 }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              color: 'var(--red)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              padding: '5px 14px',
              borderRadius: 20,
              border: '1px solid var(--line)',
              background: 'var(--card)',
              boxShadow: '0 1px 2px rgba(42,29,20,0.06)',
            }}
          >
            <span>🏠 Về Trang Chủ Lập Lá Số</span>
          </Link>
        </div>

        <Link href="/" style={{ textDecoration: 'none', color: 'var(--gold)' }}>
          <div
            style={{
              fontFamily: "'Noto Serif', Georgia, serif",
              fontSize: 'clamp(24px, 5vw, 30px)',
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            XEMBOI.VN — BÁT ĐẠI DANH SƯ
          </div>
        </Link>
        <h1 style={{ marginTop: 8, fontSize: 'clamp(20px, 4.5vw, 25px)', color: 'var(--ink)' }}>{title}</h1>
        {subtitle ? <p className="sub" style={{ marginTop: 4 }}>{subtitle}</p> : null}
      </div>
    </header>
  );
}
