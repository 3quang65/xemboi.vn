'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { dinhDangPhanTram } from '@/lib/r1/metrics';
import type { BaoCaoPheuR1, R1LeadRecord, WilsonInterval } from '@/lib/r1/types';

interface ApiQuanTriResponse {
  ok: boolean;
  storage: 'postgres' | 'local-fallback' | 'unavailable';
  isProduction: boolean;
  tongSuKienTho?: number;
  soLeadQuaHan?: number;
  baoCao?: BaoCaoPheuR1;
  leads?: R1LeadRecord[];
  loi?: string;
}

function dinhDangWilson(w: WilsonInterval): string {
  if (w.total === 0) return '0,0% (n=0)';
  return `${dinhDangPhanTram(w.rate)} [${dinhDangPhanTram(w.lower)} – ${dinhDangPhanTram(w.upper)}]`;
}

export default function QuanTriR1Client({ daDangNhapBanDau }: { daDangNhapBanDau: boolean }) {
  const [daDangNhap, setDaDangNhap] = useState(daDangNhapBanDau);
  const [khoa, setKhoa] = useState('');
  const [loiDangNhap, setLoiDangNhap] = useState('');
  const [dangTai, setDangTai] = useState(daDangNhapBanDau);
  const [duLieu, setDuLieu] = useState<ApiQuanTriResponse | null>(null);
  const [loiTai, setLoiTai] = useState<{ storage: 'unavailable'; isProduction: boolean; loi: string } | null>(null);

  const taiBaoCao = useCallback(async () => {
    setDangTai(true);
    setLoiTai(null);
    try {
      const res = await fetch('/api/r1/quan-tri', { cache: 'no-store' });
      if (res.status === 401) {
        setDaDangNhap(false);
        setDuLieu(null);
        return;
      }
      const data = (await res.json().catch(() => null)) as ApiQuanTriResponse | null;
      if (res.ok && data?.ok) {
        setDuLieu(data);
        setDaDangNhap(true);
      } else {
        setDuLieu(null);
        setDaDangNhap(true);
        setLoiTai({
          storage: 'unavailable',
          isProduction: Boolean(data?.isProduction),
          loi: data?.loi || 'Không thể tải dữ liệu từ kho PostgreSQL.',
        });
      }
    } catch {
      setDuLieu(null);
      setLoiTai({
        storage: 'unavailable',
        isProduction: false,
        loi: 'Kết nối tới máy chủ quản trị bị gián đoạn.',
      });
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    if (daDangNhapBanDau) {
      taiBaoCao();
    }
  }, [daDangNhapBanDau, taiBaoCao]);

  async function handleDangNhap(e: React.FormEvent) {
    e.preventDefault();
    setLoiDangNhap('');
    const res = await fetch('/api/r1/quan-tri/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: khoa }),
    });
    const data = (await res.json()) as { ok?: boolean; loi?: string };
    if (!res.ok || !data.ok) {
      setLoiDangNhap(data.loi || 'Khóa quản trị không hợp lệ.');
      return;
    }
    setKhoa('');
    await taiBaoCao();
  }

  async function handleDangXuat() {
    await fetch('/api/r1/quan-tri/auth', { method: 'DELETE' });
    setDaDangNhap(false);
    setDuLieu(null);
  }

  if (!daDangNhap) {
    return (
      <div className="r1-root">
        <header className="r1-topbar">
          <div className="r1-container r1-topbar-inner">
            <span className="r1-brand">xemboi.vn · Quản trị R1</span>
            <span className="r1-pill">Nội bộ</span>
          </div>
        </header>
        <main className="r1-section">
          <div className="r1-container-narrow" style={{ maxWidth: 440, marginTop: 32 }}>
            <div className="r1-panel">
              <h1 className="r1-section-title">Đăng nhập Quản trị Thí nghiệm R1</h1>
              <p className="r1-section-desc">
                Nhập khóa <code>ADMIN_KEY</code> đã cấu hình trên máy chủ để xem phễu đo lường và danh sách liên hệ.
              </p>
              {loiDangNhap && (
                <div className="r1-alert-error" role="alert">
                  {loiDangNhap}
                </div>
              )}
              <form onSubmit={handleDangNhap}>
                <div className="r1-field">
                  <label htmlFor="r1-admin-key">Khóa quản trị (ADMIN_KEY)</label>
                  <input
                    id="r1-admin-key"
                    type="password"
                    className="r1-input"
                    value={khoa}
                    onChange={(e) => setKhoa(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="r1-btn r1-btn-primary r1-btn-full">
                  Mở bảng đo lường R1
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tong = duLieu?.baoCao?.tongHop;
  const clickPct = tong ? Math.min(10, tong.clickPerChart.rate * 100) : 0; // thang đo 0%..10%
  const storageHienTai = duLieu?.storage ?? loiTai?.storage ?? 'unavailable';
  const isProdHienTai = duLieu?.isProduction ?? loiTai?.isProduction ?? false;
  const canhBaoDoProduction = isProdHienTai && storageHienTai !== 'postgres';
  const tenKhoDuLieu =
    storageHienTai === 'postgres'
      ? 'PostgreSQL'
      : storageHienTai === 'local-fallback'
        ? 'Tệp cục bộ dự phòng (scratch/r1-store.json — chỉ dùng ở môi trường phát triển)'
        : 'Không kết nối được PostgreSQL';

  return (
    <div className="r1-root">
      <header className="r1-topbar">
        <div className="r1-container r1-topbar-inner">
          <span className="r1-brand">xemboi.vn · Quản trị Thí nghiệm R1</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="r1-tab-btn" onClick={taiBaoCao}>
              Làm mới
            </button>
            <a className="r1-tab-btn" href="/api/r1/quan-tri/csv?loai=pheu" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Xuất CSV phễu
            </a>
            <a className="r1-tab-btn" href="/api/r1/quan-tri/csv?loai=leads" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Xuất CSV lead
            </a>
            <button type="button" className="r1-tab-btn" onClick={handleDangXuat}>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="r1-section">
        <div className="r1-container" style={{ maxWidth: 1140 }}>
          {canhBaoDoProduction && (
            <div className="r1-alert-error" role="alert" data-testid="canh-bao-kho-prod">
              <strong>CẢNH BÁO PRODUCTION:</strong> Kho dữ liệu hiện không phải PostgreSQL ({tenKhoDuLieu}). Vui lòng kiểm tra biến môi trường <code>DATABASE_URL</code> và tình trạng máy chủ PostgreSQL ngay trước khi chạy traffic.
            </div>
          )}

          {loiTai ? (
            <div className="r1-panel">
              <h1 className="r1-section-title" style={{ marginBottom: 6 }}>
                Chưa đọc được kho dữ liệu R1
              </h1>
              <p style={{ margin: '0 0 8px', color: 'var(--r1-muted)' }}>
                Kho dữ liệu hiện tại: <strong>{tenKhoDuLieu}</strong>
              </p>
              <div className="r1-alert-error" role="alert" style={{ marginBottom: 0 }}>
                {loiTai.loi}
              </div>
            </div>
          ) : dangTai && !duLieu ? (
            <div className="r1-panel">Đang tải số liệu thí nghiệm R1...</div>
          ) : duLieu && duLieu.baoCao && duLieu.leads && tong ? (
            <div className="r1-admin-stack">
              {/* Vạch ngưỡng ĐẠT / CHƯA RÕ / TRƯỢT theo 04 mục 6.2 */}
              <section className="r1-panel" aria-labelledby="r1-verdict-heading">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h1 id="r1-verdict-heading" className="r1-section-title" style={{ marginBottom: 4 }}>
                      Quyết định R1 theo 04 mục 6.2
                    </h1>
                    <div style={{ fontSize: 13.5, color: 'var(--r1-muted)' }}>
                      Kho lưu trữ: <strong>{tenKhoDuLieu}</strong> · Tổng sự kiện thô: {duLieu.tongSuKienTho ?? 0} · Lead quá hạn 60 ngày: {duLieu.soLeadQuaHan ?? 0}
                    </div>
                  </div>
                  <span className={`r1-status-badge r1-status-${tong.danhGia.trangThai}`}>
                    {tong.danhGia.nhan}
                  </span>
                </div>

                <p style={{ margin: '12px 0 8px', fontSize: 14.5 }}>{tong.danhGia.lyDo}</p>

                {/* Thước đo trực quan 0% – 2,5% (TRƯỢT) – 6,0% (ĐẠT) – 10%+ */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--r1-muted)' }}>
                    <span>0% (TRƯỢT &lt; 2,5%)</span>
                    <span>2,5% (CHƯA RÕ)</span>
                    <span>6,0% (ĐẠT ≥ 6,0% + lead ≥ 2,5%)</span>
                    <span>10%+</span>
                  </div>
                  <div className="r1-gauge-bar" aria-label={`Vị trí click_per_chart hiện tại ${dinhDangPhanTram(tong.clickPerChart.rate)}`}>
                    <div
                      className="r1-gauge-marker"
                      style={{ left: `${(clickPct / 10) * 100}%` }}
                      title={`click_per_chart = ${dinhDangPhanTram(tong.clickPerChart.rate)}`}
                    />
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--r1-muted)' }}>
                    Tiến độ cỡ mẫu tối thiểu: <strong>{tong.lapLaSo} / 300 lá số</strong> (khuyến nghị 400–500). Để kết luận GO cần đồng thời đạt tiêu chí (b) của 03 mục 6 (≥ 6/20 người phỏng vấn đã chi ≥ 50.000đ trong 12 tháng).
                  </div>
                </div>
              </section>

              {/* 4 thẻ chỉ số cốt lõi */}
              <section className="r1-meta-grid">
                <div className="r1-panel" style={{ padding: 16 }}>
                  <div className="r1-meta-label">click_per_chart (Wilson 95%)</div>
                  <div className="r1-meta-value" style={{ fontSize: 18 }}>
                    {dinhDangWilson(tong.clickPerChart)}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--r1-muted)', marginTop: 4 }}>
                    {tong.bamMuaTong} phiên bấm mua / {tong.lapLaSo} phiên lập lá số
                  </div>
                </div>

                <div className="r1-panel" style={{ padding: 16 }}>
                  <div className="r1-meta-label">lead_per_chart (Wilson 95%)</div>
                  <div className="r1-meta-value" style={{ fontSize: 18 }}>
                    {dinhDangWilson(tong.leadPerChart)}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--r1-muted)', marginTop: 4 }}>
                    {tong.guiLienHe} phiên gửi liên hệ ({tong.soLeadTrongBang} bản ghi lead) / {tong.lapLaSo} lá số
                  </div>
                </div>

                <div className="r1-panel" style={{ padding: 16 }}>
                  <div className="r1-meta-label">Tỷ lệ chọn &ldquo;Chưa rõ giờ sinh&rdquo; (R4)</div>
                  <div className="r1-meta-value" style={{ fontSize: 18 }}>
                    {dinhDangWilson(tong.tyLeChuaRoGio)}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--r1-muted)', marginTop: 4 }}>
                    {tong.chuaRoGio} chưa rõ giờ / {tong.coGioSinh} có giờ
                    {tong.lapLaSo > 0 && tong.tyLeChuaRoGio.rate >= 0.5
                      ? ' · CẢNH BÁO ≥ 50%: cần bổ sung gói ngày sinh sau Tết'
                      : ''}
                  </div>
                </div>

                <div className="r1-panel" style={{ padding: 16 }}>
                  <div className="r1-meta-label">Tỷ lệ bấm 79k so với 149k</div>
                  <div className="r1-meta-value" style={{ fontSize: 18 }}>
                    79k: {dinhDangPhanTram(tong.tyLe79TrongClick)} · 149k: {dinhDangPhanTram(tong.tyLe149TrongClick)}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--r1-muted)', marginTop: 4 }}>
                    Tổng: {tong.bamMua79} (79k) vs {tong.bamMua149} (149k) · Riêng nhóm có giờ: {tong.coGioBam79} vs {tong.coGioBam149}
                  </div>
                </div>
              </section>

              {/* Bảng phễu theo từng nguồn UTM */}
              <section className="r1-panel" aria-labelledby="r1-funnel-heading">
                <h2 id="r1-funnel-heading" className="r1-section-title" style={{ fontSize: 19 }}>
                  Phễu chi tiết theo từng nguồn UTM
                </h2>
                <p className="r1-section-desc">
                  Số liệu đếm theo phiên ẩn danh duy nhất để đảm bảo tỷ lệ nằm trong [0%, 100%] và tính chuẩn khoảng tin cậy Wilson 95%.
                </p>

                <div className="r1-table-wrap">
                  <table className="r1-table">
                    <thead>
                      <tr>
                        <th>utm_source / medium / campaign</th>
                        <th>Xem trang</th>
                        <th>Bắt đầu form</th>
                        <th>Bỏ form</th>
                        <th>Lập lá số (có giờ / chưa rõ)</th>
                        <th>Xem giá</th>
                        <th>Bấm 79k / 149k</th>
                        <th>click_per_chart (Wilson 95%)</th>
                        <th>lead_per_chart (Wilson 95%)</th>
                        <th>Ngưỡng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[duLieu.baoCao.tongHop, ...duLieu.baoCao.theoUtm].map((d, i) => (
                        <tr key={`${d.utmKey}-${i}`} className={i === 0 ? 'is-total' : undefined}>
                          <td>
                            {d.utmSource}
                            {d.utmMedium ? ` / ${d.utmMedium}` : ''}
                            {d.utmCampaign ? ` / ${d.utmCampaign}` : ''}
                          </td>
                          <td>{d.xemTrang}</td>
                          <td>{d.batDauForm}</td>
                          <td>
                            {d.boForm} ({dinhDangPhanTram(d.tyLeBoForm)})
                          </td>
                          <td>
                            {d.lapLaSo} ({d.coGioSinh} / {d.chuaRoGio})
                          </td>
                          <td>{d.xemGia}</td>
                          <td>
                            {d.bamMua79} / {d.bamMua149}
                          </td>
                          <td>{dinhDangWilson(d.clickPerChart)}</td>
                          <td>{dinhDangWilson(d.leadPerChart)}</td>
                          <td>
                            <span className={`r1-status-badge r1-status-${d.danhGia.trangThai}`}>
                              {d.danhGia.trangThai}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Danh sách Lead */}
              <section className="r1-panel" aria-labelledby="r1-leads-heading">
                <h2 id="r1-leads-heading" className="r1-section-title" style={{ fontSize: 19 }}>
                  Danh sách đăng ký nhận thông báo ({duLieu.leads.length})
                </h2>
                <p className="r1-section-desc">
                  Bảng độc lập hoàn toàn với phiên lập lá số (không chứa ngày giờ sinh). Chạy <code>npm run r1:xoa-han</code> để xóa các bản ghi quá hạn 60 ngày.
                </p>

                <div className="r1-table-wrap">
                  <table className="r1-table">
                    <thead>
                      <tr>
                        <th>Email / Zalo</th>
                        <th>Nút giá đã bấm</th>
                        <th>UTM</th>
                        <th>Thời điểm đồng ý</th>
                        <th>Hạn xóa (+60 ngày)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {duLieu.leads.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ color: 'var(--r1-muted)' }}>
                            Chưa có đăng ký nào.
                          </td>
                        </tr>
                      ) : (
                        duLieu.leads.map((l) => (
                          <tr key={l.id}>
                            <td>{l.emailHoacZalo}</td>
                            <td>{l.nutGiaDaBam}</td>
                            <td>
                              {l.utmSource}
                              {l.utmMedium ? ` / ${l.utmMedium}` : ''}
                              {l.utmCampaign ? ` / ${l.utmCampaign}` : ''}
                            </td>
                            <td>{new Date(l.dongYLuc).toLocaleString('vi-VN')}</td>
                            <td>{new Date(l.hanXoa).toLocaleDateString('vi-VN')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
