'use client';

import React, { useState } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { lapTuTru, type KetQuaTuTru } from '@/lib/core/tutru-boidich';

export default function TuTruPage() {
  const [hoTen, setHoTen] = useState('Nguyễn Văn An');
  const [ngay, setNgay] = useState(15);
  const [thang, setThang] = useState(6);
  const [nam, setNam] = useState(1990);
  const [gio, setGio] = useState(12);
  const [gioiTinh, setGioiTinh] = useState('nam');
  const [ketQua, setKetQua] = useState<KetQuaTuTru>(() =>
    lapTuTru({ hoTen: 'Nguyễn Văn An', ngay: 15, thang: 6, nam: 1990, gio: 12, gioiTinh: 'nam' })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKetQua(lapTuTru({ hoTen, ngay, thang, nam, gio, gioiTinh }));
  };

  return (
    <>
      <SubpageHeader
        title="Lập Lá Số Tứ Trụ (Bát Tự Hà Lạc) Chuẩn Xác"
        subtitle="Phân tích Niên trụ, Nguyệt trụ, Nhật trụ, Thời trụ, Thập Thần, Tàng Can và tìm Dụng Thần cân bằng Ngũ Hành"
      />
      <main className="wrap">
        <form className="card" onSubmit={handleSubmit}>
          <h2>Nhập Thông Tin Ngày Giờ Sinh Dương Lịch</h2>
          <div className="row">
            <div>
              <label>Họ và tên</label>
              <input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
            </div>
            <div>
              <label>Giới tính</label>
              <select value={gioiTinh} onChange={(e) => setGioiTinh(e.target.value)}>
                <option value="nam">Nam mạng</option>
                <option value="nu">Nữ mạng</option>
              </select>
            </div>
          </div>
          <div className="row3">
            <div>
              <label>Ngày dương</label>
              <input type="number" min={1} max={31} value={ngay} onChange={(e) => setNgay(Number(e.target.value))} />
            </div>
            <div>
              <label>Tháng dương</label>
              <input type="number" min={1} max={12} value={thang} onChange={(e) => setThang(Number(e.target.value))} />
            </div>
            <div>
              <label>Năm dương</label>
              <input type="number" min={1920} max={2035} value={nam} onChange={(e) => setNam(Number(e.target.value))} />
            </div>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <div>
              <label>Giờ sinh (0h - 23h)</label>
              <input type="number" min={0} max={23} value={gio} onChange={(e) => setGio(Number(e.target.value))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn red block">
                ⚖️ Lập Bàn Tứ Trụ Bát Tự
              </button>
            </div>
          </div>
        </form>

        <div className="card">
          <h2>Bàn Tứ Trụ Bát Tự: {ketQua.hoTen} ({ketQua.gioiTinh})</h2>
          <p className="small muted">
            Dương lịch: {ketQua.duongLich} · Âm lịch: {ketQua.amLich} · Tiết khí: <strong>{ketQua.tietKhi}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
            {[ketQua.truNam, ketQua.truThang, ketQua.truNgay, ketQua.truGio].map((t) => (
              <div
                key={t.ten}
                style={{
                  padding: 12,
                  borderRadius: 4,
                  border: '1px solid var(--line)',
                  background: 'var(--card)',
                  boxShadow: 'inset 0 0 0 2px var(--card), inset 0 0 0 3px var(--line), 0 1px 2px rgba(60,40,20,0.06)',
                  textAlign: 'center',
                }}
              >
                <div className="small muted">{t.ten}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)', marginTop: 4 }}>{t.thapThan}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Noto Serif', serif", margin: '6px 0' }}>
                  {t.canChi}
                </div>
                <div className="small">
                  Can: <b>{t.hanhCan}</b> · Chi: <b>{t.hanhChi}</b>
                </div>
                <div className="small muted" style={{ marginTop: 4 }}>
                  Tàng can: {t.tangCan.join(', ')}
                </div>
                <div className="small muted" style={{ marginTop: 4 }}>
                  {t.napAm}
                </div>
              </div>
            ))}
          </div>

          <div className="subcard" style={{ marginTop: 16 }}>
            <h3>🔥 Nhật Chủ &amp; Dụng Thần Bát Tự</h3>
            <p>
              <strong>Nhật Chủ (Can Ngày):</strong> {ketQua.nhatChu.can} ({ketQua.nhatChu.hanh}) — Trạng thái:{' '}
              <strong>{ketQua.nhatChu.vuongSuy}</strong>
            </p>
            <p>
              <strong>Dụng Thần:</strong> Hành <b style={{ color: 'var(--red)' }}>{ketQua.nhatChu.dungThan}</b> ·{' '}
              <strong>Hỷ Thần:</strong> Hành <b>{ketQua.nhatChu.hyThan}</b> ·{' '}
              <strong>Kỵ Thần:</strong> Hành {ketQua.nhatChu.kyThan}
            </p>
          </div>

          <div className="subcard">
            <h3>📖 Luận Giải Tứ Trụ Chi Tiết</h3>
            <p><strong>1. Tính cách &amp; Bản mệnh:</strong> {ketQua.luanGiai.tinhCach}</p>
            <p><strong>2. Công danh &amp; Sự nghiệp:</strong> {ketQua.luanGiai.suNghiep}</p>
            <p><strong>3. Tài lộc:</strong> {ketQua.luanGiai.taiLoc}</p>
            <p><strong>4. Hôn nhân &amp; Gia đạo:</strong> {ketQua.luanGiai.honNhan}</p>
            <p><strong>5. Lời khuyên cải vận:</strong> {ketQua.luanGiai.loiKhuyen}</p>
          </div>
        </div>
      </main>
      <SubpageFooter currentPath="/tu-tru" />
    </>
  );
}
