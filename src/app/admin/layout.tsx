'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: '📊 Tổng Quan Dashboard', href: '/admin/dashboard' },
    { label: '📈 Phân Tích Lưu Lượng', href: '/admin/analytics' },
    { label: '👥 Khách Hàng (CRM)', href: '/admin/customers' },
    { label: '❓ Kho Câu Hỏi Khách Hàng', href: '/admin/inquiries' },
    { label: '🧙‍♂️ Quản Lý AI Agent & RAG', href: '/admin/agents' },
    { label: '💬 Hội Thoại & Trực Tuyến', href: '/admin/conversations' },
    { label: '🔮 Xem Trang Chủ', href: '/' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: 'var(--card)',
          borderRight: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 14px',
        }}
      >
        <div style={{ padding: '0 8px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontFamily: "'Noto Serif', serif", fontWeight: 700, fontSize: 18, color: 'var(--red)' }}>
            XEMBOI.VN ADMIN
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            Hệ Thống Quản Trị, CRM &amp; AI Agent
          </div>
        </div>

        <nav style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'var(--ink)',
                  background: isActive ? 'var(--red)' : 'transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--line)', fontSize: 11, color: 'var(--muted)' }}>
          Phiên bản 2.0 · PostgreSQL pgvector
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 60,
            background: 'var(--card)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600 }}>Trung Tâm Điều Hành XemBoi.vn</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(46,125,50,0.15)',
                color: '#2e7d32',
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#2e7d32',
                  display: 'inline-block',
                }}
              />
              Hệ Thống Đang Trực Tuyến
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Admin: Cuong</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
