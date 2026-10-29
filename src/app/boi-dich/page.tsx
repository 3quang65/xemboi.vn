'use client';

import React, { useState } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { gieoQueDich } from '@/lib/core/tutru-boidich';

export default function BoiDichPage() {
  const [cauHoi, setCauHoi] = useState('Xin hỏi việc công danh và tài lộc trong thời gian tới?');
  const [que, setQue] = useState(() =>
    gieoQueDich({ cauHoi: 'Xin hỏi việc công danh và tài lộc trong thời gian tới?', so1: 111, so2: 888, so3: 333 })
  );

  const handleGieoQue = (e: React.FormEvent) => {
    e.preventDefault();
    setQue(gieoQueDich({ cauHoi }));
  };

  return (
    <>
      <SubpageHeader
        title="Gieo Quẻ Kinh Dịch 64 Quẻ Chuẩn Chu Dịch"
        subtitle="Thành tâm niệm câu hỏi về công danh, tài lộc, tình duyên hoặc gia đạo để thỉnh quẻ Kinh Dịch"
      />
      <main className="wrap">
        <form className="card" onSubmit={handleGieoQue}>
          <h2>Thành Tâm Khấn Nguyện &amp; Gieo Quẻ</h2>
          <div>
            <label>Việc bạn đang muốn hỏi quẻ Kinh Dịch</label>
            <input
              value={cauHoi}
              onChange={(e) => setCauHoi(e.target.value)}
              placeholder="Ví dụ: Tháng này ký kết hợp đồng mới có thuận lợi không?"
            />
          </div>
          <button type="submit" className="btn red block" style={{ marginTop: 14 }}>
            ☯️ Gieo Quẻ Kinh Dịch Ngay
          </button>
        </form>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <h2>
              Quẻ số {que.soHieu}: {que.tenQue} ({que.tenHan})
            </h2>
            <span className="pill ok">{que.catHung}</span>
          </div>
          <p className="small muted">
            <strong>Câu hỏi:</strong> {que.cauHoi}
          </p>
          <p className="small">
            <strong>Thượng quái:</strong> {que.thuongQuai} · <strong>Hạ quái:</strong> {que.haQuai} ·{' '}
            <strong>Hào động:</strong> Hào {que.haoDong}
          </p>

          <div
            style={{
              maxWidth: 220,
              margin: '16px auto',
              padding: 16,
              background: 'var(--bg)',
              borderRadius: 12,
              border: '1px solid var(--line)',
            }}
          >
            {[...que.hao6].reverse().map((v, idx) => {
              const haoNum = 6 - idx;
              const isDong = haoNum === que.haoDong;
              return (
                <div
                  key={haoNum}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span className="small muted" style={{ width: 48 }}>
                    Hào {haoNum}
                  </span>
                  {v === 1 ? (
                    <div
                      style={{
                        flex: 1,
                        height: 10,
                        background: isDong ? 'var(--red)' : 'var(--ink)',
                        borderRadius: 3,
                      }}
                    />
                  ) : (
                    <div style={{ flex: 1, display: 'flex', gap: 14 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          background: isDong ? 'var(--red)' : 'var(--ink)',
                          borderRadius: 3,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          background: isDong ? 'var(--red)' : 'var(--ink)',
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="subcard">
            <h3>📜 Thoán Từ &amp; Đại Tượng</h3>
            <p><strong>Thoán từ:</strong> {que.thoanTu}</p>
            <p><strong>Đại tượng:</strong> {que.daiTuong}</p>
            <p><strong>Ý nghĩa tổng quát:</strong> {que.yNghia}</p>
          </div>

          <div className="subcard">
            <h3>🔮 Lời Bàn Chi Tiết Từng Việc</h3>
            <ul>
              <li><strong>Công danh &amp; Sự nghiệp:</strong> {que.loiKhuyen.congDanh}</li>
              <li><strong>Tài lộc &amp; Giao dịch:</strong> {que.loiKhuyen.taiLoc}</li>
              <li><strong>Tình duyên:</strong> {que.loiKhuyen.tinhDuyen}</li>
              <li><strong>Gia đạo &amp; Sức khỏe:</strong> {que.loiKhuyen.giaDao}</li>
            </ul>
          </div>
        </div>
      </main>
      <SubpageFooter currentPath="/boi-dich" />
    </>
  );
}
