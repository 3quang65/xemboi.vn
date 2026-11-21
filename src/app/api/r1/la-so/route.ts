import { NextResponse } from 'next/server';
import { kiemTraThongTin, lapLaSo, luuNien, moTaQuyUoc, type ThongTinSinh } from '@/lib/tuvi-v2';
import { taoNhanDinhMienPhi, taoTongQuanKhongGioSinh } from '@/lib/r1/kho-cau-tinh';
import type { KetQuaR1 } from '@/lib/r1/types';

/**
 * POST /api/r1/la-so
 * Tính lá số thật (có giờ sinh) hoặc tổng quan theo ngày sinh (chưa rõ giờ sinh).
 * Quy tắc quyền riêng tư: KHÔNG lưu ngày giờ sinh vào cơ sở dữ liệu hay nhật ký.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const lich = body.lich === 'am' ? 'am' : 'duong';
    const ngay = Number(body.ngay);
    const thang = Number(body.thang);
    const nam = Number(body.nam);
    const nhuan = Boolean(body.nhuan);
    const gioiTinh = body.gioiTinh === 'nu' ? 'nu' : body.gioiTinh === 'nam' ? 'nam' : undefined;
    const chuaRoGioSinh = Boolean(body.chuaRoGioSinh);

    if (!gioiTinh) {
      return NextResponse.json({ ok: false, loi: 'Vui lòng chọn giới tính.' }, { status: 400 });
    }

    if (chuaRoGioSinh) {
      const tongQuan = taoTongQuanKhongGioSinh({
        lich,
        ngay,
        thang,
        nam,
        nhuan,
        gioiTinh,
      });
      return NextResponse.json({ ok: true, ketQua: tongQuan satisfies KetQuaR1 });
    }

    const gio = Number(body.gio);
    const phutRaw = body.phut;
    const phut = phutRaw === undefined || phutRaw === null || phutRaw === '' ? 0 : Number(phutRaw);

    const input: Partial<ThongTinSinh> = {
      lich,
      ngay,
      thang,
      nam,
      nhuan,
      gio,
      phut,
      gioiTinh,
    };

    const loi = kiemTraThongTin(input);
    if (loi) {
      return NextResponse.json({ ok: false, loi }, { status: 400 });
    }

    const laSo = lapLaSo(input as ThongTinSinh);
    const luuNien2027 = luuNien(laSo, 2027, false);
    const { nhanDinhMenhThan, chuDe2027 } = taoNhanDinhMienPhi(laSo, luuNien2027);

    const ketQua: KetQuaR1 = {
      loai: 'co_gio',
      laSo,
      luuNien2027,
      moTaQuyUoc: moTaQuyUoc(laSo),
      nhanDinhMenhThan,
      chuDe2027,
      anNut149k: false,
    };

    return NextResponse.json({ ok: true, ketQua });
  } catch (err) {
    const loi = err instanceof Error ? err.message : 'Không thể lập lá số. Vui lòng kiểm tra lại ngày giờ sinh.';
    return NextResponse.json({ ok: false, loi }, { status: 400 });
  }
}
