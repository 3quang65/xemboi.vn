// Chấm onpage 17 tiêu chí (docs/v2/17 mục 1.2.2). Hàm thuần; từ cấm truyền vào từ layTuCam().
// Ngưỡng độ dài là [GIẢ ĐỊNH], sẽ đưa vào CaiDat. Tiêu chí 16 (liên kết) chỉ chấm khi người gọi có số liệu đồ thị (Đợt 3).
import { timTuCam, type MucCam, type PhamViTuCam } from '@/lib/seo/tu-cam';
import { kiemDuKhoi, noiKhoi, type KhoiMuc, type LoiNoiDung } from './khoi';

export type DauVaoOnpage = {
  loai: 'MUC_TU_DIEN' | 'BAI' | 'CONG_CU' | 'NGUON_SACH' | 'PHUONG_PHAP' | 'HUB';
  duongDan: string;
  tuKhoaChinh?: string | null;
  title?: string | null;
  meta?: string | null;
  h1?: string | null;
  khoi?: KhoiMuc | null;
  than?: string | null;
  /** Nhãn nút/CTA hiển thị trên trang. */
  nut?: string[];
  canonical?: string | null;
  /** Trạng thái trang mà canonical trỏ tới (khi khác chính nó). */
  canonicalDich?: { trangThai: string; noindex: boolean } | null;
  jsonLd?: string | null;
  /** Số trích dẫn hợp lệ (từ kiemTrichDan) và lỗi trích dẫn chặn. */
  soTrichHopLe: number;
  loiTrichDan?: LoiNoiDung[];
  coChuyenGiaDuyet: boolean;
  soLienKetRa?: number;
  soLienKetVao?: number;
  laTrangMoi?: boolean;
  tuCam: MucCam[];
};

const NC = (s: string) => s.normalize('NFC').toLowerCase();
const coTu = (s: string | null | undefined, k: string) => !!s && NC(s).includes(NC(k));
const HUA_HEN = /chính xác\s*100\s*%|linh ứng|đảm bảo (đổi vận|thành công)|cam kết hiệu quả/i;
const GIOI_HAN = /tham khảo|không thay thế|giới hạn|chưa có nghiên cứu/i;
const KIEU_JSONLD: Record<DauVaoOnpage['loai'], string[]> = {
  MUC_TU_DIEN: ['DefinedTerm', 'Article', 'WebPage'],
  BAI: ['Article', 'BlogPosting', 'WebPage'],
  CONG_CU: ['WebApplication', 'SoftwareApplication', 'WebPage'],
  NGUON_SACH: ['Book', 'WebPage'],
  PHUONG_PHAP: ['Article', 'WebPage'],
  HUB: ['CollectionPage', 'WebPage'],
};

/** Ước bề rộng title ở cỡ chữ kết quả Google (Arial ~20px). [GIẢ ĐỊNH] bảng độ rộng thô. */
export function uocBeRong(s: string): number {
  let w = 0;
  for (const c of s.normalize('NFC')) {
    if (/[iljtfr.,:;'!|\s]/.test(c)) w += 5.5;
    else if (/[mwMW]/.test(c)) w += 16;
    else if (/\p{Lu}/u.test(c)) w += 13;
    else if (/[㐀-鿿]/.test(c)) w += 20;
    else w += 10;
  }
  return Math.round(w);
}

function anhTrongMd(md: string) {
  return [...md.matchAll(/!\[([^\]]*)\]\([^)]*\)|<img\b[^>]*>/g)].map((m) => m[1] ?? (m[0].match(/alt\s*=\s*"([^"]*)"/)?.[1] ?? ''));
}

export function chamOnpage(v: DauVaoOnpage): { diem: number; loi: LoiNoiDung[]; chan: boolean; chanIndex: boolean } {
  const loi: LoiNoiDung[] = [];
  const add = (ma: string, muc: LoiNoiDung['muc'], thongBao: string) => loi.push({ ma, muc, thongBao });
  const than = v.loai === 'MUC_TU_DIEN' ? noiKhoi(v.khoi) : v.than ?? '';
  const title = v.title?.trim() ?? '', meta = v.meta?.trim() ?? '', h1 = v.h1?.trim() ?? '';
  const k = v.tuKhoaChinh?.trim();

  // 1–2. Độ dài title, meta.
  if (title.length < 30 || title.length > 60 || uocBeRong(title) > 580) add('T1_TITLE', 'CANH_BAO', `Title ${title.length} ký tự, ~${uocBeRong(title)} px (nên 30–60 ký tự, ≤ 580 px)`);
  if (meta.length < 70 || meta.length > 160) add('T2_META', 'CANH_BAO', `Meta ${meta.length} ký tự (nên 70–160)`);
  // 3. Đúng một H1 (H1 của trang + H1 lỡ viết trong thân), có từ khóa.
  const h1Than = (than.match(/^#\s+\S/gm) ?? []).length;
  if (!h1 || h1Than > 0) add('T3_H1', 'CANH_BAO', !h1 ? 'Thiếu H1' : `Thân bài có ${h1Than} H1; trang chỉ nên có một H1`);
  else if (k && !coTu(h1, k)) add('T3_H1', 'CANH_BAO', `H1 chưa có từ khóa chính "${k}"`);
  // 4–5. Từ khóa trong title và 100 từ đầu.
  if (k && !coTu(title, k)) add('T4_TK_TITLE', 'CANH_BAO', `Title chưa có từ khóa chính "${k}"`);
  if (k && !coTu(than.split(/\s+/).slice(0, 100).join(' '), k)) add('T5_TK_100', 'CANH_BAO', 'Từ khóa chính chưa xuất hiện trong 100 từ đầu');
  // 6. Từ cấm ở title, meta, H1, nút, alt ảnh: chặn mọi mức.
  const anh = anhTrongMd(than);
  const vung: [string, PhamViTuCam][] = [[title, 'TIEU_DE'], [meta, 'META'], [h1, 'H1'], ...(v.nut ?? []).map((n) => [n, 'NUT'] as [string, PhamViTuCam]), ...anh.map((a) => [a, 'ANH'] as [string, PhamViTuCam])];
  for (const [s, pv] of vung) for (const vp of timTuCam(s, v.tuCam, pv)) add('T6_TU_CAM', 'CHAN', `Từ cấm "${vp.cum}" ở ${pv}`);
  // 7. Từ cấm thân bài: CHAN_CUNG chặn, nhóm khác gắn cờ.
  for (const vp of timTuCam(than, v.tuCam, 'THAN_BAI')) add('T7_TU_CAM_THAN', vp.xuLy === 'CHAN_CUNG' ? 'CHAN' : 'CANH_BAO', `Từ cấm "${vp.cum}" trong thân: …${vp.doan}…`);
  // 8. Đủ 9 khối.
  if (v.loai === 'MUC_TU_DIEN') loi.push(...kiemDuKhoi(v.khoi));
  // 9. Trích nguồn.
  if (v.loai === 'MUC_TU_DIEN' || v.loai === 'BAI') {
    if (v.soTrichHopLe < 1) add('T9_NGUON', 'CHAN', 'Chưa có trích nguồn hợp lệ nào');
    loi.push(...(v.loiTrichDan ?? []));
  }
  // 10. Người duyệt: thiếu thì vẫn xuất bản được nhưng phải noindex.
  if (!v.coChuyenGiaDuyet) add('T10_DUYET', 'CHAN_INDEX', 'Chưa có chuyên gia duyệt phiên bản này: trang sẽ noindex');
  // 11. Alt ảnh.
  anh.forEach((a, i) => { if (!a.trim()) add('T11_ALT', 'CANH_BAO', `Ảnh thứ ${i + 1} thiếu alt`); });
  // 12. Câu giới hạn.
  if (!GIOI_HAN.test(than)) add('T12_GIOI_HAN', 'CANH_BAO', 'Chưa có câu giới hạn (07 mục 3.3)');
  // 13. Hỏi đáp: cộng điểm, không tự gắn FAQPage.
  if (/^#{2,3}\s.*\?\s*$/m.test(than)) add('T13_FAQ', 'CONG', 'Có khối hỏi đáp');
  // 14. JSON-LD.
  if (v.jsonLd?.trim()) {
    let ld: unknown;
    try { ld = JSON.parse(v.jsonLd); } catch { add('T14_JSONLD', 'CHAN', 'JSON-LD không đọc được (JSON hỏng)'); }
    if (ld) {
      const ds = (Array.isArray(ld) ? ld : (ld as { '@graph'?: unknown[] })['@graph'] ?? [ld]) as Record<string, unknown>[];
      const kieu = ds.flatMap((x) => [x?.['@type']].flat()).map(String);
      if (!kieu.some((t) => KIEU_JSONLD[v.loai].includes(t))) add('T14_JSONLD', 'CANH_BAO', `JSON-LD nên có kiểu ${KIEU_JSONLD[v.loai].join('/')}`);
      if (JSON.stringify(ld).includes('AggregateRating')) add('T14_RATING', 'CHAN', 'Có AggregateRating khi chưa có đánh giá thật');
    }
  } else add('T14_JSONLD', 'CANH_BAO', 'Chưa có JSON-LD');
  // 15. Canonical.
  const can = v.canonical?.trim();
  if (can && can !== v.duongDan && !can.endsWith(v.duongDan)) {
    if (!v.canonicalDich || v.canonicalDich.trangThai !== 'XUAT_BAN' || v.canonicalDich.noindex) add('T15_CANONICAL', 'CHAN', `Canonical trỏ tới ${can} chưa xuất bản hoặc noindex`);
  }
  // 16. Liên kết nội bộ (khi có số liệu).
  if (v.soLienKetRa !== undefined && v.soLienKetRa < 3) add('T16_LK_RA', 'CANH_BAO', `Mới có ${v.soLienKetRa} liên kết ra nội bộ (nên ≥ 3)`);
  if (v.soLienKetVao !== undefined && !v.laTrangMoi && v.soLienKetVao < 1) add('T16_LK_VAO', 'CANH_BAO', 'Chưa có liên kết nào trỏ vào');
  // 17. Hứa hẹn quảng cáo ở title, meta.
  for (const s of [title, meta]) if (HUA_HEN.test(s)) add('T17_HUA_HEN', 'CHAN', `Hứa hẹn quảng cáo trong title/meta: "${s.match(HUA_HEN)?.[0]}"`);

  const tru = { CHAN: 15, CANH_BAO: 5, CHAN_INDEX: 10, CONG: -3 } as const;
  const diem = Math.max(0, Math.min(100, 100 - loi.reduce((s, l) => s + tru[l.muc], 0)));
  return { diem, loi, chan: loi.some((l) => l.muc === 'CHAN'), chanIndex: loi.some((l) => l.muc === 'CHAN_INDEX') };
}
