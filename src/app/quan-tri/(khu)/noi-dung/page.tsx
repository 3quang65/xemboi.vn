import type { Metadata } from 'next';
import Link from 'next/link';
import type { LoaiNoiDung, Prisma, TrangThaiNoiDung } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { laVaiTro, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import {
  docKiemTra,
  DS_LOAI_NOI_DUNG,
  DS_TRANG_THAI_ND,
  MA_MANG_HOP_LE,
  ngayNgan,
  nhanDiemOnpage,
  nhanTrangThaiNd,
  TEN_LOAI_NOI_DUNG,
  TEN_MANG,
  TEN_TRANG_THAI_ND,
  ThongBao,
} from './HienThi';

export const metadata: Metadata = { title: 'Nội dung' };
export const dynamic = 'force-dynamic';

const CO = 50;
const LOAI_HOP_LE = new Set<string>(DS_LOAI_NOI_DUNG);
const TT_HOP_LE = new Set<string>(DS_TRANG_THAI_ND);
const MANG_HOP_LE = new Set<string>(MA_MANG_HOP_LE);

type Tham = {
  q?: string;
  loai?: string;
  tt?: string;
  mang?: string;
  cuaToi?: string;
  denHan?: string;
  p?: string;
  bao?: string;
  loi?: string;
};

export default async function DanhSachNoiDung({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('noi_dung.xem');
  const sp = await searchParams;
  const duocSoan = coQuyen(nd.vaiTro, 'noi_dung.soan');
  const p = Math.max(1, Number(sp.p) || 1);

  const boLoc: Prisma.NoiDungWhereInput[] = [];
  if (sp.q?.trim()) {
    boLoc.push({ tieuDe: { contains: sp.q.trim(), mode: 'insensitive' } });
  }
  if (sp.loai && LOAI_HOP_LE.has(sp.loai)) {
    boLoc.push({ loai: sp.loai as LoaiNoiDung });
  }
  if (sp.tt && TT_HOP_LE.has(sp.tt)) {
    boLoc.push({ trangThai: sp.tt as TrangThaiNoiDung });
  }
  if (sp.mang && MANG_HOP_LE.has(sp.mang)) {
    boLoc.push({ mang: { has: sp.mang } });
  }
  if (sp.cuaToi === '1') {
    if (laVaiTro(nd, 'CHUYEN_GIA_DUYET') && !duocSoan) {
      boLoc.push({ chuyenGiaId: nd.id });
    } else {
      boLoc.push({ OR: [{ chuyenGiaId: nd.id }, { bienTapId: nd.id }] });
    }
  }
  if (sp.denHan === '1') {
    boLoc.push({ hanCapNhat: { lte: new Date() } });
  }

  const where: Prisma.NoiDungWhereInput = boLoc.length ? { AND: boLoc } : {};

  const [tong, ds] = await Promise.all([
    prisma.noiDung.count({ where }),
    prisma.noiDung.findMany({
      where,
      orderBy: [{ capNhatLuc: 'desc' }, { id: 'desc' }],
      skip: (p - 1) * CO,
      take: CO,
      include: {
        trang: { select: { id: true, maTrang: true, duongDan: true } },
        phienBan: {
          orderBy: { so: 'desc' },
          take: 1,
          select: { so: true, nguonTao: true, kiemTra: true, taoLuc: true },
        },
      },
    }),
  ]);

  const taiKhoanIds = [...new Set(ds.flatMap((x) => [x.bienTapId, x.chuyenGiaId]).filter((x): x is string => Boolean(x)))];
  const dsTk = taiKhoanIds.length
    ? await prisma.taiKhoan.findMany({ where: { id: { in: taiKhoanIds } }, select: { id: true, hoTen: true, email: true } })
    : [];
  const mapTk = new Map(dsTk.map((t) => [t.id, t]));

  const soTrang = Math.max(1, Math.ceil(tong / CO));
  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    const gop: Record<string, string | undefined> = {
      q: sp.q,
      loai: sp.loai,
      tt: sp.tt,
      mang: sp.mang,
      cuaToi: sp.cuaToi,
      denHan: sp.denHan,
      p: sp.p,
      ...thay,
    };
    for (const [k, v] of Object.entries(gop)) {
      if (v) u.set(k, v);
    }
    const s = u.toString();
    return s ? `?${s}` : '';
  };

  return (
    <>
      <div className="qt-loc" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1>Nội dung biên tập</h1>
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Tổng khớp bộ lọc: <b>{tong.toLocaleString('vi-VN')}</b> mục ({CO} dòng/trang).
          </p>
        </div>
        {duocSoan && (
          <Link className="qt-nut" href="/quan-tri/noi-dung/moi">
            + Tạo mới
          </Link>
        )}
      </div>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      <form className="qt-loc" method="get" style={{ marginTop: 12 }}>
        <input className="qt-o" name="q" defaultValue={sp.q} placeholder="Tìm theo tiêu đề" />
        <select className="qt-o" name="loai" defaultValue={sp.loai ?? ''}>
          <option value="">Mọi loại</option>
          {DS_LOAI_NOI_DUNG.map((l) => (
            <option key={l} value={l}>
              {TEN_LOAI_NOI_DUNG[l]}
            </option>
          ))}
        </select>
        <select className="qt-o" name="tt" defaultValue={sp.tt ?? ''}>
          <option value="">Mọi trạng thái</option>
          {DS_TRANG_THAI_ND.map((t) => (
            <option key={t} value={t}>
              {TEN_TRANG_THAI_ND[t]}
            </option>
          ))}
        </select>
        <select className="qt-o" name="mang" defaultValue={sp.mang ?? ''}>
          <option value="">Mọi mảng</option>
          {MA_MANG_HOP_LE.map((m) => (
            <option key={m} value={m}>
              {m} · {TEN_MANG[m]}
            </option>
          ))}
        </select>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <input type="checkbox" name="cuaToi" value="1" defaultChecked={sp.cuaToi === '1'} />
          Của tôi
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <input type="checkbox" name="denHan" value="1" defaultChecked={sp.denHan === '1'} />
          Đến hạn cập nhật
        </label>
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href="/quan-tri/noi-dung">
          Xóa lọc
        </Link>
      </form>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Loại</th>
              <th>Mảng</th>
              <th>Trạng thái</th>
              <th>Phiên bản</th>
              <th className="qt-cot-so">Onpage</th>
              <th>Biên tập</th>
              <th>Chuyên gia</th>
              <th>Hạn cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={9} style={{ color: 'var(--muted)' }}>
                  Chưa có mục nội dung nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {ds.map((item) => {
              const pb = item.phienBan[0] ?? null;
              const diem = pb ? docKiemTra(pb.kiemTra).onpage?.diem : undefined;
              const bt = item.bienTapId ? mapTk.get(item.bienTapId) : undefined;
              const cg = item.chuyenGiaId ? mapTk.get(item.chuyenGiaId) : undefined;
              const quaHan = item.hanCapNhat && item.hanCapNhat <= new Date();
              return (
                <tr key={item.id}>
                  <td>
                    <Link href={`/quan-tri/noi-dung/${item.id}`}>
                      <b>{item.tieuDe}</b>
                    </Link>
                    {item.trang && (
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {item.trang.maTrang ? `${item.trang.maTrang} · ` : ''}
                        {item.trang.duongDan}
                      </div>
                    )}
                  </td>
                  <td>{TEN_LOAI_NOI_DUNG[item.loai]}</td>
                  <td>{item.mang.length ? item.mang.join(', ') : '–'}</td>
                  <td>{nhanTrangThaiNd(item.trangThai)}</td>
                  <td>{pb ? `v${pb.so} (${pb.nguonTao})` : 'Chưa có'}</td>
                  <td className="qt-cot-so">{nhanDiemOnpage(diem)}</td>
                  <td>{bt ? bt.hoTen : '–'}</td>
                  <td>{cg ? cg.hoTen : '–'}</td>
                  <td>
                    {item.hanCapNhat ? (
                      <span className={quaHan ? 'qt-nhan xau' : undefined}>{ngayNgan(item.hanCapNhat)}</span>
                    ) : (
                      '–'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={`/quan-tri/noi-dung${qs({ p: String(p - 1) })}`}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {p}/{soTrang}
        </span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={`/quan-tri/noi-dung${qs({ p: String(p + 1) })}`}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}
