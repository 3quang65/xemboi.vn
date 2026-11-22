// Lập lá số cho trang công khai v2 /tu-vi/lap-la-so (docs/v2/19, F1). Hàm thuần, route /api/v2/la-so chỉ bọc lại.
// Không lưu gì vào CSDL; lá số chỉ sống trên trình duyệt người dùng.
import { kiemTraThongTin, lapLaSo, luuNien, moTaQuyUoc, namAmHienTai, tomTatLaSo, type LaSo, type LuuNien, type ThongTinSinh } from '@/lib/tuvi-v2';

export type DaiVan = { tuTuoi: number; denTuoi: number; tuNam: number; denNam: number; chi: number; tenCung: string; canChi: string; chinhTinh: string[]; dangChay: boolean };
export type KetQuaLaSo = { laSo: LaSo; luuNien: LuuNien; namXem: number; moTaQuyUoc: string[]; tomTat: string; daiVan: DaiVan[] };

/**
 * 12 đại vận theo tuổi âm (tuổi mụ): vận bắt đầu ở `daiVanTu`, kéo dài 10 năm. Năm dương tương ứng tính theo năm âm sinh.
 * `dangChay` đánh dấu vận chứa năm xem.
 */
export function bangDaiVan(ls: LaSo, namXem: number): DaiVan[] {
  const tuoiXem = namXem - ls.am.nam + 1;
  return ls.cung
    .filter((c) => Number.isInteger(c.daiVanTu) && c.daiVanTu > 0)
    .map((c) => ({
      tuTuoi: c.daiVanTu, denTuoi: c.daiVanTu + 9,
      tuNam: ls.am.nam + c.daiVanTu - 1, denNam: ls.am.nam + c.daiVanTu + 8,
      chi: c.chi, tenCung: c.ten, canChi: `${c.can} ${c.tenChi}`, chinhTinh: c.chinhTinh.map((x) => x.ten),
      dangChay: tuoiXem >= c.daiVanTu && tuoiXem <= c.daiVanTu + 9,
    }))
    .sort((a, b) => a.tuTuoi - b.tuTuoi);
}
export type PhanHoiLaSo = { ok: true; ketQua: KetQuaLaSo } | { ok: false; loi: string };

const so = (x: unknown) => (x === undefined || x === null || x === '' ? NaN : Number(x));

/** Nhận body thô từ form, kiểm tra và lập lá số kèm lưu niên của `namXem` (mặc định năm âm hiện tại). */
export function lapLaSoCongKhai(body: Record<string, unknown>, namMacDinh = namAmHienTai()): PhanHoiLaSo {
  const gioiTinh = body.gioiTinh === 'nu' ? 'nu' : body.gioiTinh === 'nam' ? 'nam' : undefined;
  const phut = so(body.phut);
  const input: Partial<ThongTinSinh> = {
    lich: body.lich === 'am' ? 'am' : 'duong',
    ngay: so(body.ngay), thang: so(body.thang), nam: so(body.nam), nhuan: body.nhuan === true,
    gio: so(body.gio), phut: Number.isNaN(phut) ? 0 : phut, gioiTinh,
    ten: typeof body.ten === 'string' ? body.ten.trim().slice(0, 60) : undefined,
    mienNamTruoc1975: body.mienNamTruoc1975 === true,
  };
  const loi = kiemTraThongTin(input);
  if (loi) return { ok: false, loi };
  const namXemRaw = so(body.namXem);
  const namXem = Number.isInteger(namXemRaw) && namXemRaw >= 1900 && namXemRaw <= 2100 ? namXemRaw : namMacDinh;
  try {
    const laSo = lapLaSo(input as ThongTinSinh);
    return { ok: true, ketQua: { laSo, luuNien: luuNien(laSo, namXem, false), namXem, moTaQuyUoc: moTaQuyUoc(laSo), tomTat: tomTatLaSo(laSo), daiVan: bangDaiVan(laSo, namXem) } };
  } catch (e) {
    return { ok: false, loi: e instanceof Error ? e.message : 'Không lập được lá số. Vui lòng kiểm tra ngày giờ sinh.' };
  }
}
