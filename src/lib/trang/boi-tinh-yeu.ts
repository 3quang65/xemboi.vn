// Bói tình yêu theo ngày sinh hai người (trang /boi-tinh-yeu, XT-BOITINHYEU; Lệnh 54).
// Đối chiếu thị trường: docs/v2/doi-chieu/tinh-yeu-goi-bai.md mục 1.
// Nguyên tắc: mỗi hệ một khối riêng, ghi hệ và sách; KHÔNG cộng điểm chung, không phần trăm, không phán "hợp/tan", không bói theo tên.
// - Khối A: quan hệ hai địa chi năm sinh (cap-con-giap.ts, theo Tam mệnh thông hội / Hiệp kỷ). Năm âm đổi ở Tết.
// - Khối C: cung Mặt Trời hai người và góc giữa hai cung (Tetrabiblos quyển I ch. XVI, XXI, XV).
// - Khối E: số chủ đạo hai người, mỗi người một đoạn "Tình cảm" (Nhật Nguyệt). Không có bảng ghép hai số có nguồn nên không chấm cặp.
// Chưa làm (chờ anh, viec-can-anh mục 28): khối B (xem tuổi 4 tầng, vướng đại/tiểu du niên) và khối D (Tetrabiblos IV.5 so Mặt Trời, Mặt Trăng hai người).
import { duongSangAmLichSu } from '@/lib/tuvi-v2/am-lich';
import { capConGiap, type CapConGiap } from './cap-con-giap';
import { TRICH as TRICH_CT, traCung, type CungHoangDao, type KetQuaTraCung, type TrichAnh } from './chiem-tinh';
import { soChuDao, type NgaySinh } from './than-so-hoc';
import { yNghia, NGUON_Y_NGHIA } from './than-so-hoc-y-nghia';

/** Tetrabiblos, quyển I, ch. XVI (bản Ashmand 1822, tr. 25–26; bản quét archive.org ptolemystetrabib00ptol, kiểm 24/11/2026). */
export const TRICH_GOC_CHIEU: TrichAnh = {
  en: 'Of these configurations, the trine and the sextile are each called harmonious, because they are constituted between signs of the same kind; being formed between either all feminine or all masculine signs. The opposition and quartile are considered to be discordant, because they are configurations made between signs not of the same kind, but of different natures and sexes.',
  vi: 'Trong các góc chiếu này, góc tam hợp và góc lục hợp được gọi là hòa, vì chúng nối các cung cùng loại: hoặc toàn cung âm, hoặc toàn cung dương. Góc đối xung và góc vuông được coi là không hòa, vì chúng nối các cung không cùng loại, khác tính và khác âm dương.',
  chuong: 'XVI',
  trang: 25,
};

export type LoaiGoc = 'trung' | 'luc-hop' | 'vuong' | 'tam-hop' | 'doi-xung' | 'khong-chieu';

/** Tên góc và độ, theo ch. XVI. "Trùng cung" không có trong chương này (Ptolemy chỉ bàn các phần cách nhau). */
export const TEN_GOC: Record<LoaiGoc, { ten: string; do: number | null; hoa: boolean | null }> = {
  trung: { ten: 'Cùng một cung', do: 0, hoa: null },
  'luc-hop': { ten: 'Lục hợp (cách 2 cung, 60°)', do: 60, hoa: true },
  vuong: { ten: 'Vuông (cách 3 cung, 90°)', do: 90, hoa: false },
  'tam-hop': { ten: 'Tam hợp (cách 4 cung, 120°)', do: 120, hoa: true },
  'doi-xung': { ten: 'Đối xung (cách 6 cung, 180°)', do: 180, hoa: false },
  'khong-chieu': { ten: 'Không thành góc chiếu (cách 1 hoặc 5 cung)', do: null, hoa: null },
};

/** Góc giữa hai cung theo số cung cách nhau (0–6). */
export function gocGiuaHaiCung(a: CungHoangDao, b: CungHoangDao): { cach: number; loai: LoaiGoc } {
  const d = Math.abs(a.thu - b.thu);
  const cach = Math.min(d, 12 - d);
  const loai: LoaiGoc = ({ 0: 'trung', 2: 'luc-hop', 3: 'vuong', 4: 'tam-hop', 6: 'doi-xung' } as Record<number, LoaiGoc>)[cach] ?? 'khong-chieu';
  return { cach, loai };
}

export type NguoiTinhYeu = {
  ngay: NgaySinh;
  /** Năm âm lịch (đổi ở Tết, giờ Việt Nam theo múi giờ lịch sử) và chi năm, Tý = 0. */
  namAm: number;
  chiNam: number;
  /** Sinh trong tháng 1–2 dương lịch mà trước Tết: con giáp theo năm âm trước. */
  truocTet: boolean;
  cung: KetQuaTraCung;
  /** Số chủ đạo cách 1 (cộng dồn), cách 2 nếu khác. */
  soChuDao: number;
  soChuDaoCach2: number | null;
  /** Lời "Tình cảm" của Nhật Nguyệt cho số chủ đạo cách 1; null nếu kho không có. */
  tinhCam: string | null;
};

export type KetQuaTinhYeu = {
  a: NguoiTinhYeu;
  b: NguoiTinhYeu;
  /** Khối A. */
  conGiap: CapConGiap;
  /** Khối C. Nếu một trong hai người sinh đúng ngày Mặt Trời đổi cung mà không nhập giờ thì `chacChan` là false. */
  hoangDao: {
    goc: { cach: number; loai: LoaiGoc };
    cungTamHop: boolean;
    cungAmDuong: boolean;
    chacChan: boolean;
  };
  /** Khối E. */
  thanSo: { nguon: typeof NGUON_Y_NGHIA };
};

const chiCuaNam = (namAm: number) => (((namAm - 4) % 12) + 12) % 12;

export function nguoiTinhYeu(ngay: NgaySinh, gio?: number): NguoiTinhYeu {
  const am = duongSangAmLichSu(ngay.ngay, ngay.thang, ngay.nam);
  const s = soChuDao(ngay);
  const yn = yNghia('so-chu-dao', s.cach1.so);
  return {
    ngay,
    namAm: am.nam,
    chiNam: chiCuaNam(am.nam),
    truocTet: am.nam < ngay.nam,
    cung: traCung(ngay.ngay, ngay.thang, ngay.nam, gio),
    soChuDao: s.cach1.so,
    soChuDaoCach2: s.khac ? s.cach2.so : null,
    tinhCam: yn?.loi.find((l) => l.k === 'tinhCam')?.vb ?? null,
  };
}

/** Kết quả cho hai người. `gioA`, `gioB` (0–23) không bắt buộc, chỉ dùng khi sinh đúng ngày Mặt Trời đổi cung. */
export function boiTinhYeu(a: NgaySinh, b: NgaySinh, gioA?: number, gioB?: number): KetQuaTinhYeu {
  const A = nguoiTinhYeu(a, gioA), B = nguoiTinhYeu(b, gioB);
  const ca = A.cung.cung, cb = B.cung.cung;
  return {
    a: A,
    b: B,
    conGiap: capConGiap(A.chiNam, B.chiNam),
    hoangDao: {
      goc: gocGiuaHaiCung(ca, cb),
      cungTamHop: ca.tamHop === cb.tamHop,
      cungAmDuong: ca.duong === cb.duong,
      chacChan: !(A.cung.chuyen && !A.cung.coGio) && !(B.cung.chuyen && !B.cung.coGio),
    },
    thanSo: { nguon: NGUON_Y_NGHIA },
  };
}

/** Câu sách cho khối C: góc chiếu (XVI), tam hợp (XXI) và âm dương (XV). */
export const TRICH_HOANG_DAO = { gocChieu: TRICH_GOC_CHIEU, amDuong: TRICH_CT.amDuong } as const;

export const GHI_CHU_TINH_YEU =
  'Trang đặt từng hệ cạnh nhau, ghi rõ hệ và sách. Các hệ không cộng thành một điểm chung, và không hệ nào ở đây nói hai người có nên ở bên nhau hay không. Không có sách nào trong kho cho phép ghép hai tên hay hai số chủ đạo thành một kết quả, nên trang không làm việc đó.';
