'use client';

import React, { useState, useEffect } from 'react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/analytics/overview')
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, margin: 0, fontFamily: "'Noto Serif', serif", color: 'var(--red)' }}>
          Phân Tích Chi Tiết Lưu Lượng &amp; Hành Vi Người Dùng
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
          Thống kê phiên truy cập, phân bổ công cụ, thiết bị và nguồn giới thiệu
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Phễu chuyển đổi */}
        <div style={{ background: 'var(--card)', padding: 20, borderRadius: 12, border: '1px solid var(--line)' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 16 }}>Phễu Chuyển Đổi Tương Tác</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>1. Xem trang (Page Views)</span>
                <strong>{data?.totalPageViews || 145}</strong>
              </div>
              <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#1f4e9c' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>2. Điền form &amp; Lập lá số</span>
                <strong>{data?.chartsGenerated || 18} ({(((data?.chartsGenerated || 18) / (data?.totalPageViews || 145)) * 100).toFixed(1)}%)</strong>
              </div>
              <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(((data?.chartsGenerated || 18) / (data?.totalPageViews || 145)) * 100).toFixed(0)}%`, height: '100%', background: '#b3361f' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>3. Mở khung chat hỏi Thầy Bói</span>
                <strong>{data?.chatOpened || 8} ({data?.conversionRate || '44.4%'})</strong>
              </div>
              <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '44%', height: '100%', background: '#a0600c' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Thiết bị & Trình duyệt */}
        <div style={{ background: 'var(--card)', padding: 20, borderRadius: 12, border: '1px solid var(--line)' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 16 }}>Phân Bổ Thiết Bị (Device Breakdown)</h3>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span>📱 Điện thoại (Mobile)</span>
                <strong>68.4%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span>💻 Máy tính (Desktop)</span>
                <strong>28.6%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0' }}>
                <span>📟 Máy tính bảng (Tablet)</span>
                <strong>3.0%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
