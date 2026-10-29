'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [newTag, setNewTag] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const fetchDetail = () => {
    fetch(`/api/admin/customers/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setCustomer(json.data);
          setNotes(json.data.adminNotes || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [resolvedParams.id]);

  const handleSaveNotes = async () => {
    setSavedMsg('Đang lưu...');
    try {
      const res = await fetch(`/api/admin/customers/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notes }),
      });
      if (res.ok) {
        setSavedMsg('✓ Đã cập nhật ghi chú thành công!');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch {
      setSavedMsg('Lỗi cập nhật');
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || !customer) return;
    const updatedTags = Array.from(new Set([...(customer.tags || []), newTag.trim()]));
    try {
      const res = await fetch(`/api/admin/customers/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: updatedTags }),
      });
      if (res.ok) {
        setCustomer({ ...customer, tags: updatedTags });
        setNewTag('');
      }
    } catch {}
  };

  if (loading && !customer) {
    return <div style={{ padding: 20 }}>Đang tải hồ sơ 360° khách hàng...</div>;
  }

  if (!customer) {
    return (
      <div style={{ padding: 20 }}>
        <p>Không tìm thấy khách hàng.</p>
        <Link href="/admin/customers">← Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/customers" style={{ textDecoration: 'none', color: 'var(--red)', fontSize: 13, fontWeight: 600 }}>
          ← Quay lại danh sách CRM
        </Link>
        <h1 style={{ fontSize: 24, margin: '8px 0 0', fontFamily: "'Noto Serif', serif", color: 'var(--red)' }}>
          Hồ Sơ 360°: {customer.fullName || 'Khách Vãng Lai'}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
          Mã định danh: <code>{customer.id}</code> · Điểm tương tác: <strong>{customer.leadScore} điểm</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Personal & Birth Profile */}
        <div style={{ background: 'var(--card)', padding: 20, borderRadius: 12, border: '1px solid var(--line)' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 16, color: 'var(--red)' }}>Thông Tin Bản Mệnh &amp; Liên Hệ</h3>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--muted)', width: 140 }}>Số Điện Thoại:</td>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>{customer.phone || 'Chưa cung cấp'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--muted)' }}>Email:</td>
                <td style={{ padding: '8px 0' }}>{customer.email || 'Chưa cung cấp'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--muted)' }}>Giới tính:</td>
                <td style={{ padding: '8px 0' }}>{customer.gender === 'NU' ? 'Nữ mạng' : 'Nam mạng'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--muted)' }}>Bản Mệnh Nạp Âm:</td>
                <td style={{ padding: '8px 0', fontWeight: 700, color: 'var(--red)' }}>
                  {customer.lunarBirthInfo?.banMenh || 'Chưa lập lá số'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', color: 'var(--muted)' }}>Năm Sinh Can Chi:</td>
                <td style={{ padding: '8px 0' }}>{customer.lunarBirthInfo?.canChiYear || ''}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: 'var(--muted)' }}>Cục:</td>
                <td style={{ padding: '8px 0' }}>{customer.lunarBirthInfo?.cucName || ''}</td>
              </tr>
            </tbody>
          </table>

          {/* Tags */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>Phân Loại (Tags):</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {(customer.tags || []).map((t: string) => (
                <span key={t} style={{ padding: '3px 10px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--gold)', fontSize: 12 }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Thêm tag mới (VD: VIP, Cần tư vấn thêm)..."
                style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--line)', fontSize: 12 }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--red)', color: '#fff', border: 0, fontSize: 12, cursor: 'pointer' }}
              >
                + Thêm
              </button>
            </div>
          </div>
        </div>

        {/* Admin Notes & Charts */}
        <div style={{ background: 'var(--card)', padding: 20, borderRadius: 12, border: '1px solid var(--line)' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 16, color: 'var(--red)' }}>Ghi Chú Quản Trị Viên (Admin Notes)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Ghi chú về nhu cầu của khách hàng, điểm cần lưu ý khi tư vấn..."
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)', fontSize: 13 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--green, #2e7d32)' }}>{savedMsg}</span>
            <button
              type="button"
              onClick={handleSaveNotes}
              style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--red)', color: '#fff', border: 0, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
            >
              Lưu Ghi Chú
            </button>
          </div>

          <h4 style={{ margin: '20px 0 8px', fontSize: 14 }}>Danh Sách Lá Số Khách Đã Lập ({customer.chartIds?.length || 0})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(customer.chartIds || []).map((cid: string) => (
              <div key={cid} style={{ padding: '8px 10px', background: 'var(--bg)', borderRadius: 6, border: '1px solid var(--line)', fontSize: 12 }}>
                <Link href={`/la-so/${cid}`} target="_blank" style={{ color: 'var(--red)', fontWeight: 600, textDecoration: 'none' }}>
                  📜 /la-so/{cid} ↗
                </Link>
              </div>
            ))}
            {(!customer.chartIds || customer.chartIds.length === 0) && (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Chưa có lá số nào được lưu.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
