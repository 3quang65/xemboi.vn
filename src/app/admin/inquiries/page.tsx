'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerInquiry } from '@/lib/ai/customer-inquiry-service';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCungTen, setSelectedCungTen] = useState<string>('ALL');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal New Inquiry
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('TINH_DUYEN');
  const [newCungTen, setNewCungTen] = useState<string>('Phu Thê');
  const [newPersona, setNewPersona] = useState<string>('');
  const [newPainPoint, setNewPainPoint] = useState<string>('');
  const [newApproach, setNewApproach] = useState<string>('');
  const [newStars, setNewStars] = useState<string>('');

  // Modal External Discovery
  const [showDiscoveryModal, setShowDiscoveryModal] = useState<boolean>(false);
  const [discoveryTopic, setDiscoveryTopic] = useState<string>('');
  const [discoveredItems, setDiscoveredItems] = useState<CustomerInquiry[]>([]);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const fetchInquiries = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
    if (selectedCungTen !== 'ALL') params.set('cungTen', selectedCungTen);
    if (selectedFrequency !== 'ALL') params.set('frequency', selectedFrequency);
    if (searchQuery) params.set('query', searchQuery);

    fetch(`/api/admin/inquiries?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setInquiries(data.inquiries || []);
          setStats(data.stats || {});
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, [selectedCategory, selectedCungTen, selectedFrequency]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestion,
          category: newCategory,
          userPersona: newPersona || 'Khách hàng quan tâm huyền học',
          corePainPoint: newPainPoint,
          thayBoiApproach: newApproach,
          keyStarsOrSigns: newStars.split(',').map((s) => s.trim()).filter(Boolean),
          frequency: 'VERY_HIGH',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setShowAddModal(false);
        setNewQuestion('');
        setNewPersona('');
        setNewPainPoint('');
        setNewApproach('');
        setNewStars('');
        fetchInquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchExternal = async () => {
    setIsDiscovering(true);
    setImportStatus('');
    try {
      const res = await fetch(`/api/admin/inquiries/external?q=${encodeURIComponent(discoveryTopic)}`);
      const data = await res.json();
      if (data.ok) {
        setDiscoveredItems(data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleImportDiscovered = async (itemsToImport: CustomerInquiry[]) => {
    try {
      const res = await fetch('/api/admin/inquiries/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToImport }),
      });
      const data = await res.json();
      if (data.ok) {
        setImportStatus(`✓ ${data.message}`);
        fetchInquiries();
        setTimeout(() => setImportStatus(''), 4000);
      }
    } catch (err: any) {
      setImportStatus('Lỗi: ' + err.message);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(inquiries, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kho_Cau_Hoi_Khach_Hang_XemBoi_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['ID', 'Danh Mục', 'Câu Hỏi Của Khách', 'Đối Tượng (Persona)', 'Nỗi Đau Cốt Lõi', 'Định Hướng Thầy Bói'];
      const rows = inquiries.map((i) => [
        `"${i.id}"`,
        `"${i.categoryName}"`,
        `"${i.question.replace(/"/g, '""')}"`,
        `"${i.userPersona.replace(/"/g, '""')}"`,
        `"${i.corePainPoint.replace(/"/g, '""')}"`,
        `"${i.thayBoiApproach.replace(/"/g, '""')}"`,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kho_Cau_Hoi_Khach_Hang_XemBoi_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Title & Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, fontFamily: "'Noto Serif', serif", color: 'var(--red)' }}>
            Kho Câu Hỏi &amp; Nhu Cầu Khách Hàng (Inquiry Knowledge Bank)
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            Nghiên cứu thị trường &amp; hành vi người dùng: Tổng hợp các nỗi đau, băn khoăn thực tế về Tử Vi, Tình Duyên, Công Danh, Vận Hạn 2026
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setShowDiscoveryModal(true);
              handleSearchExternal();
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 30,
              border: '1px solid #0284c7',
              background: 'rgba(2, 132, 199, 0.1)',
              color: '#0284c7',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🌐</span>
            <span>Tìm Kiếm &amp; Bổ Sung Từ Nguồn Ngoài</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: 30,
              border: 0,
              background: 'var(--red)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(179, 54, 31, 0.3)',
            }}
          >
            <span>+</span>
            <span>Thêm Câu Hỏi Mới</span>
          </button>
        </div>
      </div>

      {/* Market Research Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Tổng Số Câu Hỏi Đã Lưu</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{stats.TOTAL || inquiries.length}</div>
          <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>✓ Đã nạp vào Backend</div>
        </div>

        <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Chủ Đề Hot Trending 🔥</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--red)', marginTop: 4 }}>{stats.HOT_TRENDING || 8}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Lượng tìm kiếm cao nhất</div>
        </div>

        <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Tình Duyên &amp; Hôn Nhân</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#ec4899', marginTop: 4 }}>{stats.TINH_DUYEN || 4}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Chiếm ~32% thị trường</div>
        </div>

        <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Công Danh &amp; Tài Lộc</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gold)', marginTop: 4 }}>{(stats.CONG_DANH || 0) + (stats.TAI_LOC || 0)}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Chiếm ~46% thị trường</div>
        </div>

        <div style={{ background: 'var(--card)', padding: 14, borderRadius: 10, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Vận Hạn 2026 &amp; Phong Thủy</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0284c7', marginTop: 4 }}>{(stats.VAN_HAN || 0) + (stats.PHONG_THUY || 0)}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Chiếm ~22% thị trường</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: 'var(--card)',
          padding: 16,
          borderRadius: 12,
          border: '1px solid var(--line)',
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'ALL', label: 'Tất Cả' },
              { key: 'TINH_DUYEN', label: 'Tình Duyên' },
              { key: 'CONG_DANH', label: 'Công Danh' },
              { key: 'TAI_LOC', label: 'Tài Lộc & Đất Đai' },
              { key: 'VAN_HAN', label: 'Hạn Năm 2026' },
              { key: 'GIA_DAO_CON_CAI', label: 'Con Cái & Tổ Tiên' },
              { key: 'PHONG_THUY', label: 'Phong Thủy' },
              { key: 'TAM_LINH_GIAI_HAN', label: 'Tu Tâm Cải Mệnh' },
            ].map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCategory(c.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: selectedCategory === c.key ? '1px solid var(--red)' : '1px solid var(--line)',
                  background: selectedCategory === c.key ? 'var(--red)' : 'var(--bg)',
                  color: selectedCategory === c.key ? '#fff' : 'var(--ink)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Tìm câu hỏi, nỗi sợ, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid var(--line)', fontSize: 12, width: 220, background: 'var(--bg)' }}
            />
            <button
              type="submit"
              style={{ padding: '8px 16px', borderRadius: 20, border: 0, background: 'var(--ink)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Tìm
            </button>
          </form>
        </div>

        {/* 12 Cung Tử Vi Selector Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>
            🏛️ 12 Cung Tử Vi:
          </span>
          {[
            { key: 'ALL', label: 'Tất cả 12 Cung' },
            { key: 'Mệnh', label: '1. Mệnh' },
            { key: 'Phụ Mẫu', label: '2. Phụ Mẫu' },
            { key: 'Phúc Đức', label: '3. Phúc Đức' },
            { key: 'Điền Trạch', label: '4. Điền Trạch' },
            { key: 'Quan Lộc', label: '5. Quan Lộc' },
            { key: 'Nô Bộc', label: '6. Nô Bộc' },
            { key: 'Thiên Di', label: '7. Thiên Di' },
            { key: 'Tật Ách', label: '8. Tật Ách' },
            { key: 'Tài Bạch', label: '9. Tài Bạch' },
            { key: 'Tử Tức', label: '10. Tử Tức' },
            { key: 'Phu Thê', label: '11. Phu Thê' },
            { key: 'Huynh Đệ', label: '12. Huynh Đệ' },
            { key: 'Cung Thân', label: '13. Cung Thân' },
          ].map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCungTen(c.key)}
              style={{
                padding: '4px 10px',
                borderRadius: 16,
                border: selectedCungTen === c.key ? '1px solid var(--gold)' : '1px solid var(--line)',
                background: selectedCungTen === c.key ? 'rgba(242, 199, 107, 0.2)' : 'var(--bg)',
                color: selectedCungTen === c.key ? 'var(--gold)' : 'var(--ink)',
                fontSize: 11,
                fontWeight: selectedCungTen === c.key ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--muted)', paddingTop: 4, borderTop: '1px solid var(--line)' }}>
          <div>
            Hiển thị <strong>{inquiries.length}</strong> câu hỏi phù hợp tiêu chí
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => exportData('csv')}
              style={{ background: 'transparent', border: 0, color: 'var(--red)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
            >
              📥 Xuất CSV
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => exportData('json')}
              style={{ background: 'transparent', border: 0, color: 'var(--red)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
            >
              📥 Xuất JSON
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Đang tải kho câu hỏi từ Backend...</div>
        ) : inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <p style={{ color: 'var(--muted)' }}>Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          inquiries.map((inq) => {
            const isHot = inq.frequency === 'HOT_TRENDING';

            return (
              <div
                key={inq.id}
                style={{
                  background: 'var(--card)',
                  borderRadius: 12,
                  border: isHot ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid var(--line)',
                  padding: 18,
                  boxShadow: isHot ? '0 4px 14px rgba(220, 38, 38, 0.05)' : 'none',
                }}
              >
                {/* Header Tags */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'rgba(179, 54, 31, 0.1)',
                        color: 'var(--red)',
                      }}
                    >
                      {inq.categoryName}
                    </span>

                    {inq.cungTen && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(242, 199, 107, 0.2)',
                          color: 'var(--gold)',
                          border: '1px solid rgba(242, 199, 107, 0.4)',
                        }}
                      >
                        🏛️ Cung {inq.cungTen}
                      </span>
                    )}

                    {isHot && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: '#dc2626',
                          color: '#fff',
                        }}
                      >
                        🔥 HOT TRENDING
                      </span>
                    )}

                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      Đối tượng: <strong>{inq.userPersona}</strong>
                    </span>
                  </div>

                  <Link
                    href={`/admin/conversations`}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--red)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>💬 Đưa Vào Đối Thoại Thầy Bói →</span>
                  </Link>
                </div>

                {/* Main Question */}
                <h3 style={{ margin: '0 0 10px', fontSize: 16, color: 'var(--ink)', lineHeight: 1.5 }}>
                  &quot;{inq.question}&quot;
                </h3>

                {/* Core Pain Point Box */}
                <div
                  style={{
                    background: 'rgba(0,0,0,0.02)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    marginBottom: 10,
                    borderLeft: '3px solid #f2c76b',
                  }}
                >
                  <strong style={{ color: 'var(--ink)' }}>Nỗi Sợ / Băn Khoăn Tiềm Ẩn Của Khách: </strong>
                  <span style={{ color: 'var(--muted)' }}>{inq.corePainPoint}</span>
                </div>

                {/* Thầy Bói Approach */}
                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink)', marginBottom: 12 }}>
                  <strong style={{ color: 'var(--red)' }}>Định Hướng Luận Giải Của Thầy Bói: </strong>
                  {inq.thayBoiApproach}
                </div>

                {/* Related Stars & Keywords */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Dấu hiệu sao:</span>
                    {(inq.keyStarsOrSigns || []).map((star, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          background: 'var(--bg)',
                          border: '1px solid var(--line)',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {star}
                      </span>
                    ))}
                  </div>

                  {inq.source && (
                    <span style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic' }}>
                      Nguồn: {inq.source}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: ADD NEW INQUIRY */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 14,
              border: '1px solid var(--line)',
              maxWidth: 620,
              width: '100%',
              padding: 24,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: 'var(--red)' }}>Thêm Câu Hỏi Khách Hàng Vào Backend</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 0, fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Câu hỏi thực tế từ khách:</label>
                <input
                  type="text"
                  placeholder="VD: Tuổi 1986 năm 2026 có phạm thái tuế không..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Chuyên mục:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                  >
                    <option value="TINH_DUYEN">Tình Duyên &amp; Hôn Nhân</option>
                    <option value="CONG_DANH">Công Danh &amp; Sự Nghiệp</option>
                    <option value="TAI_LOC">Tài Lộc &amp; Đầu Tư</option>
                    <option value="VAN_HAN">Vận Hạn Năm Hiện Tại</option>
                    <option value="GIA_DAO_CON_CAI">Gia Đạo &amp; Con Cái</option>
                    <option value="PHONG_THUY">Phong Thủy Bát Trạch</option>
                    <option value="TAM_LINH_GIAI_HAN">Tâm Linh &amp; Tu Tâm Cải Mệnh</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Chân dung khách (Persona):</label>
                  <input
                    type="text"
                    placeholder="VD: Nam doanh nhân 40 tuổi..."
                    value={newPersona}
                    onChange={(e) => setNewPersona(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Nỗi sợ / Băn khoăn sâu kín (Pain Point):</label>
                <input
                  type="text"
                  placeholder="Khách đang thực sự sợ điều gì..."
                  value={newPainPoint}
                  onChange={(e) => setNewPainPoint(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Khung giải đáp của Thầy Bói:</label>
                <textarea
                  rows={3}
                  placeholder="Cách Thầy soi sao, cung vị và đưa ra lời khuyên đức năng thắng số..."
                  value={newApproach}
                  onChange={(e) => setNewApproach(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Các sao hoặc dấu hiệu (cách nhau dấu phẩy):</label>
                <input
                  type="text"
                  placeholder="VD: Thái Tuế, Thiên Phủ, Tam Tai..."
                  value={newStars}
                  onChange={(e) => setNewStars(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 18px', borderRadius: 6, border: '1px solid var(--line)', background: 'transparent', cursor: 'pointer' }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: 6, border: 0, background: 'var(--red)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Lưu Câu Hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EXTERNAL DISCOVERY & SEARCH TOOL */}
      {showDiscoveryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 14,
              border: '1px solid var(--line)',
              maxWidth: 750,
              width: '100%',
              padding: 24,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: '#0284c7' }}>
                  🌐 Tìm Kiếm &amp; Khai Thác Nhu Cầu Thị Trường (Market Discovery)
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                  Quét và tổng hợp câu hỏi thảo luận nóng từ Google Trends, Diễn đàn Tử Vi Việt Nam, Webtretho, Voz
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDiscoveryModal(false)}
                style={{ background: 'transparent', border: 0, fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Search Input for External Sources */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Nhập chủ đề muốn tìm kiếm (VD: chứng khoán 2026, sinh con, tuổi Thân, cắt duyên âm...)"
                value={discoveryTopic}
                onChange={(e) => setDiscoveryTopic(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 6, border: '1px solid var(--line)', fontSize: 13 }}
              />
              <button
                type="button"
                onClick={handleSearchExternal}
                disabled={isDiscovering}
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  border: 0,
                  background: '#0284c7',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {isDiscovering ? 'Đang Quét...' : 'Quét Thị Trường'}
              </button>
            </div>

            {importStatus && (
              <div style={{ marginBottom: 14, padding: 10, borderRadius: 6, background: '#f0fdf4', color: '#16a34a', fontSize: 13, fontWeight: 600 }}>
                {importStatus}
              </div>
            )}

            {/* Results List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
                  Kết Quả Tìm Thấy ({discoveredItems.length} câu hỏi trending):
                </span>

                {discoveredItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleImportDiscovered(discoveredItems)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: 0,
                      background: '#16a34a',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    📥 Nhập Tất Cả Vào Backend
                  </button>
                )}
              </div>

              {discoveredItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 700 }}>{item.categoryName}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)', background: 'var(--card)', padding: '2px 8px', borderRadius: 4 }}>
                      Nguồn: {item.source}
                    </span>
                  </div>

                  <strong style={{ fontSize: 14, color: 'var(--ink)' }}>&quot;{item.question}&quot;</strong>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    <strong>Nỗi sợ của khách: </strong> {item.corePainPoint}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => handleImportDiscovered([item])}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 4,
                        border: '1px solid #0284c7',
                        background: 'transparent',
                        color: '#0284c7',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Nhập Câu Này Vào Kho
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowDiscoveryModal(false)}
                style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid var(--line)', background: 'transparent', cursor: 'pointer' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
