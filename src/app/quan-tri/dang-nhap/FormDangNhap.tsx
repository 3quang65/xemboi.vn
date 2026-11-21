'use client';

import { useState } from 'react';

export default function FormDangNhap() {
  const [loi, setLoi] = useState('');
  const [dang, setDang] = useState(false);

  async function gui(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoi('');
    setDang(true);
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch('/api/quan-tri/dang-nhap', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: f.get('email'), matKhau: f.get('matKhau') }),
      });
      const j = (await r.json()) as { ok: boolean; loi?: string };
      if (j.ok) window.location.href = '/quan-tri';
      else setLoi(j.loi || 'Đăng nhập không được.');
    } catch {
      setLoi('Không kết nối được máy chủ.');
    } finally {
      setDang(false);
    }
  }

  return (
    <form onSubmit={gui}>
      <div className="qt-logo" style={{ padding: 0 }}>XemBói.vn · Quản trị</div>
      <label>
        Email
        <input className="qt-o" name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Mật khẩu
        <input className="qt-o" name="matKhau" type="password" autoComplete="current-password" required />
      </label>
      {loi && <div className="qt-bao loi" role="alert">{loi}</div>}
      <button className="qt-nut" type="submit" disabled={dang}>{dang ? 'Đang kiểm…' : 'Đăng nhập'}</button>
    </form>
  );
}
