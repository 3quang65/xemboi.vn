// Bộ kiểm trích dẫn cho nháp AI và bản biên tập (docs/v2/17 mục 2.3 bước 4, tiêu chí onpage 9). Chạy bằng mã, không bằng LLM.
// Hàm thuần: người gọi truyền vào danh sách đoạn đã gửi cho AI (chỉ đoạn công khai) và thông tin nguồn.
import { tachDoanVan, type KhoiMuc, type LoiNoiDung, type MaKhoi } from './khoi';

export const RE_MA_DOAN = /\[D:(\d+)\]/g;
/** Ngưỡng trích nguyên văn (ký tự liền nhau giống hệt đoạn nguồn). `[GIẢ ĐỊNH]`, chỉnh trong CaiDat sau. */
export const NGUONG_NGUYEN_VAN = 40;

export type DoanDaGui = { id: string; vanBan: string; duocTrichDai: boolean };
export type MaHopLe = { doanId: string; khoi: MaKhoi | null };

export function timMaDoan(s: string): string[] {
  return [...s.matchAll(RE_MA_DOAN)].map((m) => m[1]);
}

/** Độ dài chuỗi con chung dài nhất (quy hoạch động, đủ nhanh cho đoạn vài nghìn ký tự). */
export function chuoiChungDaiNhat(a: string, b: string): number {
  if (!a || !b) return 0;
  let truoc = new Uint16Array(b.length + 1), nay = new Uint16Array(b.length + 1), max = 0;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      nay[j] = a[i - 1] === b[j - 1] ? truoc[j - 1] + 1 : 0;
      if (nay[j] > max) max = nay[j];
    }
    [truoc, nay] = [nay, truoc];
    nay.fill(0);
  }
  return max;
}

type DauVao = {
  /** Mục từ điển: các khối; loại khác: thân markdown. */
  khoi?: KhoiMuc | null;
  than?: string | null;
  doanDaGui: DoanDaGui[];
  nguongNguyenVan?: number;
};

/**
 * Kiểm trích dẫn:
 *  1. mọi mã [D:n] phải thuộc tập đoạn đã gửi, không có mã bịa;
 *  2. khối 3 (mục từ điển): mỗi đoạn văn có ít nhất một mã;
 *  3. trích nguyên văn dài hơn ngưỡng chỉ được khi nguồn cho phép trích dài.
 * Trả `dat=false` nếu có lỗi chặn; `maHopLe` dùng để ghi NoiDungTrichDan.
 */
export function kiemTrichDan({ khoi, than, doanDaGui, nguongNguyenVan = NGUONG_NGUYEN_VAN }: DauVao) {
  const theoId = new Map(doanDaGui.map((d) => [String(d.id), d]));
  const loi: LoiNoiDung[] = [];
  const maHopLe: MaHopLe[] = [];
  const phan: { khoi: MaKhoi | null; md: string }[] = khoi
    ? (Object.keys(khoi).filter((k) => /^k\d$/.test(k)) as MaKhoi[]).map((k) => ({ khoi: k, md: khoi[k] ?? '' }))
    : [{ khoi: null, md: than ?? '' }];

  for (const { khoi: k, md } of phan) {
    for (const doan of tachDoanVan(md)) {
      const ma = timMaDoan(doan);
      if (k === 'k3' && !ma.length) loi.push({ ma: 'K3_THIEU_NGUON', muc: 'CHAN', khoi: 'k3', thongBao: `Khối 3 có đoạn chưa có nguồn: "${doan.slice(0, 60)}…"` });
      for (const id of ma) {
        const d = theoId.get(id);
        if (!d) { loi.push({ ma: 'MA_DOAN_BIA', muc: 'CHAN', khoi: k ?? undefined, thongBao: `Mã đoạn [D:${id}] không nằm trong các đoạn đã chọn (có thể bị bịa)` }); continue; }
        if (!maHopLe.some((x) => x.doanId === id && x.khoi === k)) maHopLe.push({ doanId: id, khoi: k });
        const chuSach = doan.replace(RE_MA_DOAN, '');
        const dai = chuoiChungDaiNhat(chuSach, d.vanBan);
        if (dai > nguongNguyenVan && !d.duocTrichDai) {
          loi.push({ ma: 'TRICH_DAI', muc: 'CHAN', khoi: k ?? undefined, thongBao: `Trích nguyên văn ${dai} ký tự từ [D:${id}], vượt ${nguongNguyenVan}; nguồn này không cho trích dài` });
        }
      }
    }
  }
  return { dat: !loi.some((l) => l.muc === 'CHAN'), loi, maHopLe };
}
