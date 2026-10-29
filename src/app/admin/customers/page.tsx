'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const fetchCustomers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedTag) params.set('tag', selectedTag);

    fetch(`/api/admin/customers?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setCustomers(json.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, [selectedTag]);

  const handleExportCSV = () => {
    if (customers.length === 0) return;
    const headers = ['ID,HoTen,SoDienThoai,Email,GioiTinh,BanMenh,LeadScore,Tags,NgayTao'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.fullName || ''}"`,
      c.phone || '',
      c.email || '',
      c.gender || '',
      `"${c.lunarBirthInfo?.banMenh || ''}"`,
      c.leadScore,
      `"${(c.tags || []).join('; ')}"`,
      new Date(c.createdAt).toLocaleDateString('vi-VN'),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `xemboi_crm_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, fontFamily: "'Noto Serif', serif", color: 'var(--red)' }}>
            Quản Lý Khách Hàng Tương Tác (CRM XemBoi.vn)
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            Tự động trích xuất hồ sơ bản mệnh, tính điểm Lead Score và lưu trữ lịch sử lá số, chat Thầy Bói
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            background: 'var(--card)',
            border: '1px solid var(--gold)',
            color: 'var(--ink)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          📥 Xuất Danh Sách Excel/CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: 'var(--card)', padding: 16, borderRadius: 12, border: '1px solid var(--line)', marginBottom: 20 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCustomers();
          }}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo họ tên, số điện thoại, email..."
            style={{
              flex: '1 1 260px',
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid var(--line)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 18px',
              borderRadius: 6,
              background: 'var(--red)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔍 Tìm Kiếm
          </button>
        </form>

        {/* Tag pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {['', 'Đã lập lá số', 'VIP', 'Quan tâm Tình duyên', 'Cần xem hạn 2026'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: '4px 12px',
                borderRadius: 16,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: selectedTag === tag ? 700 : 500,
                background: selectedTag === tag ? 'var(--red)' : 'var(--bg)',
                color: selectedTag === tag ? '#fff' : 'var(--ink)',
                border: '1px solid var(--line)',
              }}
            >
              {tag || 'Tất Cả Khách Hàng'}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
              <th style={{ padding: '12px 14px' }}>Khách Hàng</th>
              <th style={{ padding: '12px 14px' }}>Liên Hệ</th>
              <th style={{ padding: '12px 14px' }}>Bản Mệnh Nạp Âm</th>
              <th style={{ padding: '12px 14px' }}>Lead Score</th>
              <th style={{ padding: '12px 14px' }}>Phân Loại (Tags)</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
                  Đang tải danh sách khách hàng...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
                  Chưa tìm thấy khách hàng nào.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: 14 }}>
                      {c.fullName || 'Khách Vãng Lai'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      Giới tính: {c.gender === 'NU' ? 'Nữ' : 'Nam'} · {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div>{c.phone || <span style={{ color: 'var(--muted)' }}>Chưa có SĐT</span>}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.email || ''}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <strong>{c.lunarBirthInfo?.banMenh || 'Chưa lập lá số'}</strong>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {c.lunarBirthInfo?.canChiYear ? `Tuổi ${c.lunarBirthInfo.canChiYear}` : ''}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        background: c.leadScore >= 20 ? 'rgba(179,54,31,0.15)' : 'rgba(46,125,50,0.15)',
                        color: c.leadScore >= 20 ? 'var(--red)' : '#2e7d32',
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      ★ {c.leadScore} pts
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(c.tags || []).slice(0, 3).map((t: string) => (
                        <span
                          key={t}
                          style={{
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: 'var(--bg)',
                            border: '1px solid var(--line)',
                            fontSize: 11,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <Link
                      href={`/admin/customers/${c.id}`}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        background: 'var(--card)',
                        border: '1px solid var(--line)',
                        textDecoration: 'none',
                        color: 'var(--ink)',
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      Chi Tiết 360° →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
