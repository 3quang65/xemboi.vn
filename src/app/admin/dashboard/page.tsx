'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = () => {
    fetch('/api/admin/analytics/overview')
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu thời gian thực...</div>;
  }

  const stats = [
    {
      title: 'Đang Online Thực Tế',
      value: data?.onlineCount || 1,
      badge: 'Real-time Redis',
      color: '#2e7d32',
      bg: 'rgba(46,125,50,0.1)',
      icon: '🟢',
    },
    {
      title: 'Lượt Xem Trang Hôm Nay',
      value: data?.todayPageViews || 0,
      badge: `Tổng: ${data?.totalPageViews || 0}`,
      color: '#1f4e9c',
      bg: 'rgba(31,78,156,0.1)',
      icon: '👁️',
    },
    {
      title: 'Lá Số Đã Lập',
      value: data?.chartsGenerated || 0,
      badge: 'Auto-Lead Capture',
      color: '#b3361f',
      bg: 'rgba(179,54,31,0.1)',
      icon: '📜',
    },
    {
      title: 'Tỷ Lệ Chuyển Đổi Chat',
      value: data?.conversionRate || '0%',
      badge: `${data?.chatOpened || 0} lượt hỏi Thầy Bói`,
      color: '#a0600c',
      bg: 'rgba(160,96,12,0.1)',
      icon: '🧙‍♂️',
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, fontFamily: "'Noto Serif', serif", color: 'var(--red)' }}>
            Bảng Điều Khiển Tổng Quan (Real-time Analytics)
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            Dữ liệu tự động làm mới mỗi 5 giây · Kết nối trực tiếp Tracking &amp; CRM Engine
          </p>
        </div>
        <button
          type="button"
          onClick={fetchOverview}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          🔄 Làm mới ngay
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {stats.map((s, idx) => (
          <div
            key={idx}
            style={{
              padding: 20,
              borderRadius: 12,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{s.title}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, margin: '10px 0 6px', color: s.color }}>
              {s.value}
            </div>
            <span
              style={{
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 10,
                background: s.bg,
                color: s.color,
                fontWeight: 600,
              }}
            >
              {s.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Action Banner */}
      <div
        style={{
          marginTop: 24,
          padding: 18,
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(179,54,31,0.12) 0%, rgba(242,199,107,0.15) 100%)',
          border: '1px solid var(--gold)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <strong style={{ fontSize: 16, color: 'var(--red)' }}>
            🧙‍♂️ AI Agent "Thầy Bói" (pgvector RAG) Đang Hoạt Động
          </strong>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink)' }}>
            Hệ thống đã nạp đầy đủ tri thức Tử Vi Nam Phái, Tứ Trụ, 64 Quẻ Kinh Dịch và sẵn sàng tự động đọc lá số của khách ngoài Frontend.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/admin/customers"
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink)',
            }}
          >
            👥 Xem CRM Khách Hàng
          </Link>
          <Link
            href="/admin/agents"
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              background: 'var(--red)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            Quản Lý Kho Tri Thức →
          </Link>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div style={{ marginTop: 24, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--line)', padding: 20 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 17, fontFamily: "'Noto Serif', serif" }}>
          Hoạt Động Khách Hàng Gần Nhất (Live Stream Events)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                <th style={{ padding: '8px 10px' }}>Thời Gian</th>
                <th style={{ padding: '8px 10px' }}>Hành Vi</th>
                <th style={{ padding: '8px 10px' }}>Đường Dẫn</th>
                <th style={{ padding: '8px 10px' }}>Thiết Bị</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentEvents || []).map((e: any, i: number) => {
                const badgeColor =
                  e.eventType === 'GENERATE_CHART'
                    ? '#b3361f'
                    : e.eventType === 'OPEN_CHAT'
                    ? '#a0600c'
                    : e.eventType === 'DOWNLOAD_IMAGE'
                    ? '#2e7d32'
                    : '#5f5f66';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px' }}>{new Date(e.createdAt).toLocaleTimeString('vi-VN')}</td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: `${badgeColor}18`,
                          color: badgeColor,
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        {e.eventType}
                      </span>
                    </td>
                    <td style={{ padding: '10px', color: 'var(--ink)' }}>{e.path}</td>
                    <td style={{ padding: '10px', color: 'var(--muted)' }}>
                      {e.session?.deviceType || 'Desktop'} · {e.session?.browser || 'Chrome'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
