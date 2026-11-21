import type { Metadata } from 'next';
import type { VaiTro } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { TEN_VAI_TRO } from '@/lib/quan-tri/quyen';
import ThongBao from '../seo/ThongBao';
import { datLaiMatKhau, suaTaiKhoan, taoTaiKhoan, thuHoiPhien } from './hanh-dong';

export const metadata: Metadata = { title: 'Tài khoản' };
export const dynamic = 'force-dynamic';

const VAI_TRO: VaiTro[] = ['QUAN_TRI', 'BIEN_TAP', 'CHUYEN_GIA_DUYET', 'XEM_SO_LIEU'];
const ngay = (d: Date | null) => (d ? d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '–');

function OVaiTro({ chon }: { chon: VaiTro[] }) {
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 8 }}>
      {VAI_TRO.map((v) => (
        <label key={v} style={{ whiteSpace: 'nowrap' }}><input type="checkbox" name="vaiTro" value={v} defaultChecked={chon.includes(v)} /> {TEN_VAI_TRO[v]}</label>
      ))}
    </span>
  );
}

export default async function TrangTaiKhoan({ searchParams }: { searchParams: Promise<{ bao?: string; loi?: string }> }) {
  const nd = await yeuCauQuyen('tai_khoan.quan_ly');
  const sp = await searchParams;
  const bayGio = new Date();
  const ds = await prisma.taiKhoan.findMany({
    orderBy: [{ dangHoatDong: 'desc' }, { email: 'asc' }],
    select: {
      id: true, email: true, hoTen: true, vaiTro: true, mangDuyet: true, dangHoatDong: true, lanDangNhapCuoi: true, khoaDen: true, soLanSai: true,
      _count: { select: { phien: { where: { thuHoiLuc: null, hetHan: { gt: bayGio } } } } },
    },
  });

  return (
    <>
      <h1>Tài khoản</h1>
      <p className="qt-phu">
        Bớt vai trò hoặc vô hiệu hóa sẽ đăng xuất người đó ngay. Mật khẩu ít nhất 12 ký tự; gửi mật khẩu tạm qua kênh riêng, không gửi kèm email đăng nhập.
        Họ tên phải là người thật (tên thật hoặc bút danh), vì sẽ hiện ở hồ sơ tác giả và người duyệt.
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />

      <div className="qt-the">
        <h2>Tạo tài khoản</h2>
        <form action={taoTaiKhoan} className="qt-loc" autoComplete="off">
          <input className="qt-o" name="email" type="email" placeholder="email" required />
          <input className="qt-o" name="hoTen" placeholder="Họ tên" required />
          <OVaiTro chon={[]} />
          <input className="qt-o" name="mangDuyet" placeholder="Mảng duyệt, ví dụ A,B" style={{ width: 170 }} />
          <input className="qt-o" name="matKhau" type="password" placeholder="Mật khẩu tạm (≥ 12 ký tự)" autoComplete="new-password" required minLength={12} />
          <button className="qt-nut" type="submit">Tạo</button>
        </form>
      </div>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr><th>Tài khoản</th><th>Vai trò, mảng, trạng thái</th><th>Đăng nhập cuối</th><th className="qt-cot-so">Phiên mở</th><th>Mật khẩu, phiên</th></tr>
          </thead>
          <tbody>
            {ds.map((t) => {
              const khoa = t.khoaDen && t.khoaDen > bayGio;
              return (
                <tr key={t.id} style={t.dangHoatDong ? undefined : { opacity: 0.6 }}>
                  <td>
                    <b>{t.email}</b>{t.id === nd.id && <> <span className="qt-nhan">bạn</span></>}
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.hoTen}</div>
                    {khoa && <span className="qt-nhan xau">tạm khóa tới {ngay(t.khoaDen)} ({t.soLanSai} lần sai)</span>}
                  </td>
                  <td>
                    <form action={suaTaiKhoan} style={{ display: 'grid', gap: 6 }}>
                      <input type="hidden" name="id" value={t.id} />
                      <input className="qt-o" name="hoTen" defaultValue={t.hoTen} aria-label={`Họ tên ${t.email}`} />
                      <OVaiTro chon={t.vaiTro} />
                      <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input className="qt-o" name="mangDuyet" defaultValue={t.mangDuyet.join(',')} placeholder="Mảng duyệt" aria-label={`Mảng duyệt ${t.email}`} style={{ width: 140 }} />
                        <label><input type="checkbox" name="dangHoatDong" defaultChecked={t.dangHoatDong} /> Đang hoạt động</label>
                        <button className="qt-nut phu" type="submit">Lưu</button>
                      </span>
                    </form>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{ngay(t.lanDangNhapCuoi)}</td>
                  <td className="qt-cot-so">{t._count.phien}</td>
                  <td>
                    <form action={datLaiMatKhau} style={{ display: 'flex', gap: 6 }} autoComplete="off">
                      <input type="hidden" name="id" value={t.id} />
                      <input className="qt-o" name="matKhau" type="password" placeholder="Mật khẩu mới" autoComplete="new-password" minLength={12} required aria-label={`Mật khẩu mới cho ${t.email}`} style={{ width: 150 }} />
                      <button className="qt-nut phu" type="submit">Đặt lại</button>
                    </form>
                    {t.id !== nd.id && t._count.phien > 0 && (
                      <form action={thuHoiPhien} style={{ marginTop: 6 }}>
                        <input type="hidden" name="id" value={t.id} />
                        <button className="qt-nut phu" type="submit">Đăng xuất mọi phiên</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
