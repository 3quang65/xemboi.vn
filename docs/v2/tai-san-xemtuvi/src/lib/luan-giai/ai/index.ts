// Sinh luận giải theo chuyên đề (Mệnh, Quan Lộc, Phu Thê, Tài Bạch, Điền Trạch): mỗi nhận định truy về một quy tắc có nguồn.
// Nhận định chỉ sinh từ quy tắc KHỚP với lá số. Nhà cung cấp mặc định "stub" (không mạng);
// "claude" chỉ bật khi LUANGIAI_AI=claude VÀ có hàm gọi được truyền vào (khung, chưa nối API thật).
import fs from 'node:fs';
import path from 'node:path';
import type { LaSo, Sao } from '@/lib/tuvi';
import chuyenDeJson from './chuyen-de.json';
import quyTacJson from './quy-tac.json';
import tuCamJson from './tu-cam.json';
import { bam, doc, ghi, thongKe, xoaBoNho } from './cache';
import { kiemTraMaSauViet, locTuCam, type TuCamCauHinh } from './loc';
import { cungKhopDieuKien, khopDieuKien, khopQuyTac, type QuyTacV2 } from './khop-v2';
import khungJson from './quy-tac-khung.json';
import quyTacVanJson from './quy-tac-van/van-10-nam.json';
import quyTacVanSpJson from './quy-tac-van/van-10-nam-sp.json';
import quyTacVanPpJson from './quy-tac-van/van-10-nam-pp.json';
import { tongHop, type NhanDinhTH } from './tong-hop';
import { namAmHienTai } from '../../tuvi';

export { xoaBoNho };
export const thongKeCache = thongKe;

export type ChuyenDeMa = 'menh' | 'quan-loc' | 'phu-the' | 'tai-bach' | 'dien-trach' | 'van-10-nam';

export interface QuyTac {
  id: string;
  chuyenDe: string;
  cung: string;
  sao: string[];
  dieuKien: { doSang?: string[]; hoa?: string; cungCo?: string };
  noiDung: string;
  nguon: string;
  truongPhai: string;
  muc?: string;
}

interface ChuyenDeCauHinh {
  ten: string;
  cungChinh: string;
  muc: { id: string; tieuDe: string; huongDan: string }[];
}

export interface NhanDinh {
  text: string;
  thamChieu: {
    quyTacId: string;
    sao: string[];
    cung: string;
    nguon: string;
    truongPhai: string;
    /** Cung thực sự chứa yếu tố khớp (chỉ quy tắc bản 2: sao ở cung hợp chiếu). Thiếu thì sao nằm ở `cung`. */
    cungLienQuan?: string[];
    /** Yếu tố không phải sao: Tuần, Triệt, Vô Chính Diệu, "Cách <tên>". */
    yeuTo?: string[];
  };
}
/** Đại vận đang đi (chỉ chuyên đề "van-10-nam"). Năm là năm âm lịch, tuổi là tuổi mụ. */
export interface ThongTinVan {
  cung: string;
  canChi: string; // can chi của cung vận, ví dụ "Kỷ Mùi"
  tuoiTu: number;
  tuoiDen: number;
  namTu: number;
  namDen: number;
}
export interface LuanGiai {
  chuyenDe: ChuyenDeMa;
  /** Chỉ có ở chuyên đề "van-10-nam"; null nếu chưa tới tuổi vào đại vận. */
  van?: ThongTinVan | null;
  muc: { id: string; tieuDe: string; nhanDinh: NhanDinh[] }[];
  ghiChu: string;
  phienBan: string;
}

export interface CauCap {
  id: string;
  noiDung: string;
}
/** Nhà cung cấp viết lại: nhận các câu được cấp, trả văn bản mỗi dòng một câu có đuôi [MÃ]. */
export interface NhaCungCapAI {
  ten: string;
  vietLai(cau: CauCap[], promptHeThong: string): Promise<string>;
}
export interface TuyChon {
  nhaCungCap?: 'stub' | 'claude' | NhaCungCapAI;
  /** Hàm gọi mô hình thật, chỉ dùng khi bật "claude". Chưa truyền thì tự về stub. */
  goiClaude?: (promptHeThong: string, duLieu: string) => Promise<string>;
  boQuaCache?: boolean;
  /** Bật lớp tổng hợp (Tóm lại, gộp sao, dung hòa; L-28bc46). Mặc định tắt vì các câu này chưa có mã quy tắc thật; bật thì không dùng cache. */
  tongHop?: boolean;
  /** Năm âm lịch cần xem (chỉ chuyên đề "van-10-nam"); mặc định năm âm lịch hiện tại. */
  namXem?: number;
}

export const GHI_CHU =
  'Luận giải do hệ thống xemtuvi.vn tạo tự động từ các quy tắc Tử Vi có ghi nguồn; nội dung mang tính tham khảo, giúp hiểu mình và định hướng, không phải lời đoán chắc về tương lai.';

/** Quy tắc bản 2 (định dạng máy đọc, docs/luan-giai/quy-tac-v2/DINH-DANG.md) kèm vài trường của bộ ghép. */
type QuyTacBan2 = QuyTacV2 & { yeuTo?: string[] };

const CHUYEN_DE = chuyenDeJson as unknown as Record<string, ChuyenDeCauHinh>;

/** Bỏ đuôi khuôn của bộ quy tắc cũ (kiem-duyet-1.md, mục 5.7): "góp thêm sắc thái…", "Độ sáng tốt, nên phát huy chủ động". */
export function lamSachCau(cau: string): string {
  let kq = cau
    .replace(/,?\s*góp thêm sắc thái cho chuyên đề [^.]*\.?/g, '.')
    .replace(/\s*Độ sáng tốt, nên phát huy chủ động\.?/g, '')
    .replace(/\.\.+/g, '.')
    .trim();
  if (kq && !/[.!?]$/.test(kq)) kq += '.';
  return kq;
}
const QUY_TAC = (quyTacJson as unknown as QuyTac[]).map((q) => ({ ...q, noiDung: lamSachCau(q.noiDung) }));

/** Quy tắc bản 2: thư mục quy-tac-v2/ (Hạnh soạn) cộng bộ khung sinh bằng scripts/luan-giai/tao-khung.cjs. */
function napBan2(): QuyTacBan2[] {
  const dir = path.join(process.cwd(), 'src/lib/luan-giai/ai/quy-tac-v2');
  const tep = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
  const tuThuMuc = tep.flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as QuyTacBan2[]);
  return [...(khungJson as unknown as QuyTacBan2[]), ...tuThuMuc];
}
const QUY_TAC_2 = napBan2();
/** Quy tắc đại vận (VAN-): cung gốc là cung vận, điền khi sinh bài. `cungVan` giới hạn quy tắc chỉ dùng khi vận ở đúng cung đó ("*" = mọi cung). */
type QuyTacVan = QuyTacBan2 & { cungVan?: string };
/** Mã nghiên cứu của một quy tắc bản 2 hoặc đại vận (để bộ ghép Vận năm chọn "việc nên làm" bám đúng mã). */
export function maNghienCuuCua(id: string): string[] {
  return [...QUY_TAC_2, ...QUY_TAC_VAN].find((q) => q.id === id)?.maNghienCuu ?? [];
}
const QUY_TAC_VAN = [...(quyTacVanJson as unknown as QuyTacVan[]), ...(quyTacVanSpJson as unknown as QuyTacVan[]), ...(quyTacVanPpJson as unknown as QuyTacVan[])];
const TU_CAM = tuCamJson as unknown as TuCamCauHinh;
const PROMPT = fs.readFileSync(path.join(process.cwd(), 'src/lib/luan-giai/ai/prompt-he-thong.md'), 'utf8');
/**
 * Câu hợp chiếu của bộ quy tắc cũ: id ML/QL/PT-S<sao>-C<n> (độ sáng tốt: Miếu/Vượng/Đắc/Bình) và hậu tố -HAM (Hãm).
 * Sao Hãm mà chưa có câu -HAM thì không phát câu C nào cho sao đó (không tả sao hãm bằng nét tích cực); danh sách chờ ở docs/luan-giai/cho-hanh-C-HAM.md.
 */
export const LA_CAU_C = /^(ML|QL|PT)-S\d+-C\d+(-HAM)?$/;
/** Tăng khi đổi cách ghép/lọc câu (không đổi quy tắc) để bản lưu cũ không bị dùng lại. */
const PHIEN_BAN_BO_GHEP = 'ghep-10';
export const PHIEN_BAN_QUY_TAC = bam(JSON.stringify([QUY_TAC, QUY_TAC_2, QUY_TAC_VAN, CHUYEN_DE, TU_CAM, PROMPT, PHIEN_BAN_BO_GHEP])).slice(0, 12);

export function nhaCungCapDangDung(yeuCau: TuyChon['nhaCungCap']): 'stub' | 'claude' | string {
  if (typeof yeuCau === 'object' && yeuCau) return yeuCau.ten;
  return yeuCau === 'claude' && process.env.LUANGIAI_AI === 'claude' ? 'claude' : 'stub';
}

export function khoaCache(ls: LaSo, chuyenDe: string, phienBan: string): string {
  const sinh = [ls.duong.nam, ls.duong.thang, ls.duong.ngay, ls.gio.dongHo, ls.gioChuan.gio, ls.gioiTinh, JSON.stringify(ls.quyUoc)];
  // Sinh nước ngoài: hai múi giờ khác nhau 24 giờ (vd. −10 và +14) cho cùng giờ chuẩn nhưng khác ngày; khóa cũ giữ nguyên cho khách trong nước
  if (ls.gioChuan.nguon === 'nuocNgoai') sinh.push(`nn${ls.gioChuan.nam}-${ls.gioChuan.thang}-${ls.gioChuan.ngay}`);
  return bam([...sinh, chuyenDe, phienBan].join('|'));
}

/** Khóa cache chuyên đề Vận 10 năm: theo lá số và đại vận (cung vận), không theo năm xem. */
export function khoaVan(ls: LaSo, cungVan: string): string {
  return khoaCache(ls, `van-10-nam@${cungVan}`, PHIEN_BAN_QUY_TAC);
}

/** Đại vận đang đi của lá số ở năm âm lịch namXem; null nếu chưa tới tuổi vào đại vận. */
export function timDaiVan(ls: LaSo, namXem: number): { cung: LaSo['cung'][number]; thongTin: ThongTinVan } | null {
  const tuoiMu = namXem - ls.am.nam + 1;
  const cung = ls.cung.find((c) => tuoiMu >= c.daiVanTu && tuoiMu <= c.daiVanTu + 9);
  if (!cung) return null;
  const tuoiDen = cung.daiVanTu + 9;
  return {
    cung,
    thongTin: {
      cung: cung.ten, canChi: `${cung.can} ${cung.tenChi}`, tuoiTu: cung.daiVanTu, tuoiDen,
      namTu: ls.am.nam + cung.daiVanTu - 1, namDen: ls.am.nam + tuoiDen - 1,
    },
  };
}

function tatCaSao(ls: LaSo, tenCung: string): { sao: Sao[]; tuan: boolean; triet: boolean } | null {
  const c = ls.cung.find((x) => x.ten === tenCung);
  return c ? { sao: [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh], tuan: c.tuan, triet: c.triet } : null;
}

interface KetQuaKhop {
  sao: string[];
  yeuTo: string[];
  cungLienQuan?: string[];
  cau: string;
  uuTien: number;
  cungGoc: string;
  /** Loại quy tắc bản 2 (CT, C, SP, CC, HOA, VCD…); quy tắc cũ không có. */
  loai?: string;
  cachCuc?: string;
  phaCach?: boolean;
  q: { id: string; chuyenDe: string; muc?: string; nguon: string; truongPhai: string };
}

/** Quy tắc cũ khớp lá số → danh sách sao thực sự khớp (rỗng nếu quy tắc không đòi sao) và yếu tố Tuần/Triệt/Vô chính diệu; null nếu không khớp. */
function khop(ls: LaSo, q: QuyTac): { sao: string[]; yeuTo: string[] } | null {
  const c = ls.cung.find((x) => x.ten === q.cung);
  const t = tatCaSao(ls, q.cung);
  if (!c || !t) return null;
  const co = (ten: string) => t.sao.find((s) => s.ten === ten);
  for (const s of q.sao) if (!co(s)) return null;
  const k = q.dieuKien ?? {};
  const dau = q.sao[0] ? co(q.sao[0]) : undefined;
  if (k.doSang && !(dau?.dacTinhTen && k.doSang.includes(dau.dacTinhTen))) return null;
  let saoKhop = [...q.sao];
  const yeuTo: string[] = [];
  if (k.hoa) {
    if (dau) { if (dau.hoa !== k.hoa) return null; }
    else {
      saoKhop = t.sao.filter((s) => s.hoa === k.hoa).map((s) => s.ten);
      if (!saoKhop.length) return null;
    }
  }
  if (k.cungCo) {
    if (k.cungCo === 'Tuần') { if (!t.tuan) return null; }
    else if (k.cungCo === 'Triệt') { if (!t.triet) return null; }
    else if (k.cungCo === 'Vô Chính Diệu') { if (c.chinhTinh.length) return null; }
    else if (!co(k.cungCo)) return null;
    if (['Tuần', 'Triệt', 'Vô Chính Diệu'].includes(k.cungCo)) yeuTo.push(k.cungCo);
  }
  return { sao: saoKhop, yeuTo };
}

/** Quy tắc bản 2 khớp lá số → câu đã điền tên sao, tên cung; null nếu không khớp. */
function khopBan2(ls: LaSo, q: QuyTacBan2): KetQuaKhop | null {
  const sao = khopQuyTac(ls, q);
  if (sao === null) return null;
  const goc = ls.cung.find((c) => c.ten === q.cung)!;
  const cung = [...new Set(q.dieuKien.flatMap((k) => cungKhopDieuKien(ls, goc, k).map((c) => c.ten)))];
  // {pha}: tên yếu tố quyết định mức phá cách (điều kiện phaCach), vd "Hỏa Tinh".
  const dkPha = q.dieuKien.find((k) => k.phaCach);
  const pha = dkPha ? khopDieuKien(ls, goc, dkPha) ?? [] : [];
  const dkDac = q.dieuKien.find((k) => k.satDac !== undefined);
  const dac = dkDac ? khopDieuKien(ls, goc, dkDac) ?? [] : [];
  // {sao_muon}: vô chính diệu mượn chính tinh cung đối diện (xung chiếu) để luận (CHUNG-VCD-01); nêu tên sao được mượn và cung của chúng.
  const muon = q.noiDung.includes('{sao_muon}')
    ? cung.map((ten) => {
        const c = ls.cung.find((x) => x.ten === ten)!;
        const d = ls.cung.find((x) => x.chi === (c.chi + 6) % 12)!;
        return { d, chuoi: d.chinhTinh.length ? `${d.chinhTinh.map((s) => s.ten).join(', ')} ở ${d.ten}` : `${d.ten} cũng không có chính tinh` };
      })
    : [];
  const cau = q.noiDung.replaceAll('{sao_muon}', muon.map((m) => m.chuoi).join('; ')).replaceAll('{dac}', dac.join(', ')).replaceAll('{pha}', pha.join(', ')).replaceAll('{sao}', sao.join(', ')).replaceAll('{cung}', cung.join(' và '));
  // Quy tắc cấp cung (không điều kiện, vd VAN-CUNG-*): căn cứ là chính tinh tọa thủ cung gốc; vô chính diệu thì
  // mượn chính tinh cung xung chiếu (như VAN-CT-VCD-01) và ghi yếu tố Vô Chính Diệu (L-6e89d7).
  const capCung = !q.dieuKien.length && !sao.length && !q.yeuTo?.length;
  const vcd = capCung && !goc.chinhTinh.length;
  const xung = ls.cung.find((c) => c.chi === (goc.chi + 6) % 12)!;
  return {
    sao: capCung ? (vcd ? xung : goc).chinhTinh.map((s) => s.ten) : muon.length ? [...new Set(muon.flatMap((m) => m.d.chinhTinh.map((s) => s.ten)))] : sao,
    yeuTo: vcd ? ['Vô Chính Diệu'] : q.yeuTo ?? [], cungLienQuan: capCung ? (vcd ? [goc.ten, xung.ten] : [goc.ten]) : muon.length ? [...new Set([...cung, ...muon.map((m) => m.d.ten)])] : cung, cau, uuTien: q.uuTien ?? 0, cungGoc: q.cung,
    loai: q.loai, cachCuc: q.cachCuc, phaCach: q.phaCach,
    q: { id: q.id, chuyenDe: q.chuyenDe, muc: q.muc, nguon: q.nguon.join('; '), truongPhai: q.truongPhai },
  };
}

/** Câu đuôi theo độ sáng của bộ quy tắc cũ (quy-tac.json, lặp ở 42 quy tắc mỗi mức). Gộp: mỗi mức tối đa một lần mỗi bài, lời theo chuyên đề. */
const DUOI_DO_SANG: { re: RegExp; muc: 'trung-binh' | 'kem'; loi: Record<string, string> }[] = [
  {
    re: /\s*Độ sáng trung bình, hiệu quả phụ thuộc vào sự rèn luyện và hoàn cảnh\.?/,
    muc: 'trung-binh',
    loi: {
      menh: 'Các sao ở độ sáng trung bình trong bài này cho kết quả tùy vào mức rèn luyện bản thân và hoàn cảnh.',
      'quan-loc': 'Các sao ở độ sáng trung bình trong bài này cho kết quả tùy vào mức rèn luyện nghề và môi trường làm việc.',
      'phu-the': 'Các sao ở độ sáng trung bình trong bài này cho kết quả tùy vào sự vun đắp của hai người và hoàn cảnh.',
      'tai-bach': 'Các sao ở độ sáng trung bình trong bài này cho kết quả tùy vào kỷ luật tài chính và hoàn cảnh.',
      'dien-trach': 'Các sao ở độ sáng trung bình trong bài này cho kết quả tùy vào sự vun vén của gia đình và hoàn cảnh.',
    },
  },
  {
    re: /\s*Độ sáng kém, nên bù đắp bằng sự chuẩn bị kỹ và học hỏi thêm\.?/,
    muc: 'kem',
    loi: {
      menh: 'Với các sao kém sáng nêu trong bài, nên bù bằng sự chuẩn bị kỹ và học hỏi thêm về chính mình.',
      'quan-loc': 'Với các sao kém sáng nêu trong bài, nên bù bằng sự chuẩn bị kỹ và học thêm kỹ năng cho công việc.',
      'phu-the': 'Với các sao kém sáng nêu trong bài, nên bù bằng sự kiên nhẫn và trao đổi cởi mở trong quan hệ.',
      'tai-bach': 'Với các sao kém sáng nêu trong bài, nên bù bằng kế hoạch tài chính cẩn trọng và kiến thức quản lý tiền.',
      'dien-trach': 'Với các sao kém sáng nêu trong bài, nên bù bằng sự chuẩn bị kỹ và hỏi ý người có kinh nghiệm về nhà đất.',
    },
  },
];

/**
 * Gỡ câu đuôi độ sáng khỏi nhận định; lần đầu mỗi mức trong bài thì thay bằng một câu chung theo chuyên đề (`da` ghi các mức đã nói).
 */
export function gopDuoiDoSang(text: string, da: Set<string>, chuyenDe: string): string {
  let kq = text;
  for (const d of DUOI_DO_SANG) {
    if (!d.re.test(kq)) continue;
    kq = kq.replace(d.re, '').trim();
    if (!da.has(d.muc)) {
      da.add(d.muc);
      kq = `${kq} ${d.loi[chuyenDe] ?? d.loi.menh}`;
    }
  }
  return kq;
}

/**
 * Một bài không được nói hai lần cùng một câu (T-a4504a/T-080e3a): câu từ 30 ký tự trở lên đã xuất hiện ở nhận định trước
 * thì bỏ khỏi nhận định sau; nhận định chỉ còn lại rỗng thì bỏ hẳn.
 */
export function boCauLap<T extends { text: string }>(muc: { nhanDinh: T[] }[]): void {
  const daNoi = new Set<string>();
  for (const m of muc) {
    m.nhanDinh = m.nhanDinh.flatMap((n) => {
      const con = n.text.split(/(?<=[.!?])\s+/).filter((c) => {
        if (c.length < 30) return true;
        if (daNoi.has(c)) return false;
        daNoi.add(c);
        return true;
      });
      return con.length ? [{ ...n, text: con.join(' ') }] : [];
    });
  }
}

/** Câu tắt theo chuyên đề (lời khuyên công việc/sao phụ lạc đề bài tình cảm). Danh sách ở docs/nghien-cuu/bang-cham-chat-luong.md, Phiếu 3c. */
export const TAT_O_BAI: Record<string, Set<string>> = {
  'phu-the': new Set([
    'PT-PS-4', 'PT-PS-5', 'PT-HOA-0',
    'KHUNG-phu-the-SP-ThienKhong-chinh', 'KHUNG-phu-the-SP-ĐịaKiếp-tam-hop', 'KHUNG-phu-the-SP-ĐịaKhông-xung',
    'KHUNG-phu-the-SP-ThiênKhông-xung', 'KHUNG-phu-the-SP-LộcTồn-tam-hop', 'KHUNG-phu-the-SP-ĐịaKiếp-xung', 'KHUNG-phu-the-CC-KhongKiepChieu',
  ]),
};

// Bộ đếm mục cấu hình bị mất (rỗng) theo chuyên đề: { chuyenDe: { soLuot, mat: { idMuc: soLan } } }. Cảnh báo log 1 lần/mục/tiến trình.
const MUC_MAT: Record<string, { soLuot: number; mat: Record<string, number> }> = {};
const DA_CANH_BAO = new Set<string>();
export function ghiNhanMucMat(chuyenDe: string, idCauHinh: string[], mucRa: { id: string; nhanDinh: unknown[] }[]): string[] {
  const co = new Set(mucRa.filter((m) => m.nhanDinh.length).map((m) => m.id));
  const mat = idCauHinh.filter((id) => !co.has(id));
  const tk = (MUC_MAT[chuyenDe] ??= { soLuot: 0, mat: {} });
  tk.soLuot++;
  for (const id of mat) {
    tk.mat[id] = (tk.mat[id] ?? 0) + 1;
    const k = `${chuyenDe}|${id}`;
    if (!DA_CANH_BAO.has(k)) { DA_CANH_BAO.add(k); console.warn(`[luan-giai] chuyên đề ${chuyenDe} mất mục cấu hình "${id}" (không có nhận định nào)`); }
  }
  return mat;
}
export function thongKeMucMat() { return JSON.parse(JSON.stringify(MUC_MAT)) as typeof MUC_MAT; }
export function xoaThongKeMucMat() { for (const k of Object.keys(MUC_MAT)) delete MUC_MAT[k]; DA_CANH_BAO.clear(); }

export async function sinhLuanGiai(ls: LaSo, chuyenDe: ChuyenDeMa, tuyChon: TuyChon = {}): Promise<LuanGiai> {
  const cfg = CHUYEN_DE[chuyenDe];
  if (!cfg) throw new Error(`Chuyên đề không hợp lệ: ${chuyenDe}`);
  const laVan = chuyenDe === 'van-10-nam';
  const bat = !!tuyChon.tongHop && !laVan;
  const dv = laVan ? timDaiVan(ls, tuyChon.namXem ?? namAmHienTai()) : null;
  if (laVan && !dv) {
    // Chưa tới tuổi vào đại vận (nhỏ hơn số cục): không có gì để luận.
    return { chuyenDe, van: null, muc: [], ghiChu: GHI_CHU, phienBan: PHIEN_BAN_QUY_TAC };
  }
  const khoa = dv ? khoaVan(ls, dv.thongTin.cung) : khoaCache(ls, chuyenDe, PHIEN_BAN_QUY_TAC);
  if (!tuyChon.boQuaCache && !bat) {
    const co = doc<LuanGiai>(khoa);
    if (co) return co;
  }

  // Quy tắc đại vận: gắn cung gốc = cung vận rồi khớp như quy tắc bản 2; quy tắc riêng một cung chỉ dùng khi đúng cung.
  const quyTacBan2 = dv
    ? QUY_TAC_VAN.filter((q) => !q.cungVan || q.cungVan === '*' || q.cungVan === dv.thongTin.cung).map((q) => ({ ...q, cung: dv.thongTin.cung }))
    : QUY_TAC_2.filter((q) => q.chuyenDe === chuyenDe);

  const khopDs: KetQuaKhop[] = [
    ...(dv ? [] : QUY_TAC.filter((q) => q.chuyenDe === chuyenDe).flatMap((q) => {
      const r = khop(ls, q);
      return r ? [{ ...r, cau: q.noiDung, uuTien: 0, cungGoc: q.cung, q }] : [];
    })),
    ...quyTacBan2.flatMap((q) => {
      const r = khopBan2(ls, q);
      return r ? [r] : [];
    }),
  ];
  // Có câu "Hóa Kỵ hóa vào <sao>" (bộ khung) thì bỏ câu chung "Hóa Kỵ tại <cung> là điểm nhạy cảm" của bộ quy tắc cũ (T-a4504a vòng 2).
  if (khopDs.some((x) => /^KHUNG-[a-z-]+-KY-/.test(x.q.id))) {
    const chung = new Set(QUY_TAC.filter((q) => q.chuyenDe === chuyenDe && !q.sao.length && q.dieuKien?.hoa === 'Hóa Kỵ').map((q) => q.id));
    for (let i = khopDs.length - 1; i >= 0; i--) if (chung.has(khopDs[i].q.id)) khopDs.splice(i, 1);
  }
  // Có câu vô chính diệu cung chính (bộ khung, nêu tên sao được mượn) thì bỏ câu chung "<cung> không có chính tinh" của bộ quy tắc cũ (L-28bc46).
  if (khopDs.some((x) => /^KHUNG-[a-z-]+-VCD-chinh/.test(x.q.id))) {
    const chung = new Set(QUY_TAC.filter((q) => q.chuyenDe === chuyenDe && !q.sao.length && q.dieuKien?.cungCo === 'Vô Chính Diệu').map((q) => q.id));
    for (let i = khopDs.length - 1; i >= 0; i--) if (chung.has(khopDs[i].q.id)) khopDs.splice(i, 1);
  }
  // Câu hợp chiếu (C) cũ nhường cho quy tắc C bản 2 cùng sao, cùng cung (Hạnh viết lại thì dùng bản của Hạnh).
  const c2 = khopDs.filter((x) => x.loai === 'C');
  if (c2.length) {
    for (let i = khopDs.length - 1; i >= 0; i--) {
      const x = khopDs[i];
      if (LA_CAU_C.test(x.q.id) && c2.some((y) => y.sao.some((t) => x.sao.includes(t)) && y.cungLienQuan?.includes(x.cungGoc))) khopDs.splice(i, 1);
    }
  }
  // Pool tổng hợp: mọi nhận định đã khớp, kể cả câu bị tắt ở bài này (sao vẫn có trên lá số, Tóm lại/gộp có thể nhắc).
  const poolTH = laVan ? [] : [...khopDs];
  // Câu sao phụ dùng chung lạc đề với bài tình cảm (Phiếu 3c, T-a4504a vòng 3): tắt đến khi Hạnh viết bản Phu Thê.
  const tat = TAT_O_BAI[chuyenDe];
  if (tat) for (let i = khopDs.length - 1; i >= 0; i--) if (tat.has(khopDs[i].q.id)) khopDs.splice(i, 1);
  // Lớp tổng hợp (L-28bc46): Tóm lại, gộp sao cùng cung, câu dung hòa. Không áp cho chuyên đề Vận 10 năm.
  const th = bat ? tongHop(ls, chuyenDe, cfg.cungChinh, poolTH, khopDs) : null;
  if (th?.bo.size) for (let i = khopDs.length - 1; i >= 0; i--) if (th.bo.has(khopDs[i].q.id)) khopDs.splice(i, 1);
  const theoId = new Map(khopDs.map((x) => [x.q.id, x]));

  // Câu cấp cho nhà cung cấp; mặc định "stub" ghép thẳng từ quy tắc.
  const cap: CauCap[] = khopDs.map((x) => ({ id: x.q.id, noiDung: x.cau }));
  let cau: { text: string; id: string }[] = cap.map((c) => ({ text: c.noiDung, id: c.id }));
  const ncc = tuyChon.nhaCungCap;
  const dung = nhaCungCapDangDung(ncc);
  if (dung !== 'stub') {
    try {
      const van = typeof ncc === 'object' && ncc ? await ncc.vietLai(cap, PROMPT)
        : tuyChon.goiClaude ? await tuyChon.goiClaude(PROMPT, cap.map((c) => `${c.noiDung} [${c.id}]`).join('\n'))
        : null;
      if (van !== null) cau = kiemTraMaSauViet(van, new Set(theoId.keys()));
    } catch {
      // Lỗi nhà cung cấp: giữ bản stub, không để khách thấy lỗi.
    }
  }

  const muc = cfg.muc.map((m) => ({ id: m.id, tieuDe: m.tieuDe, nhanDinh: [] as { n: NhanDinh; u: number }[] }));
  const mucDau = muc.find((m) => m.id !== 'cach-cuc') ?? muc[0];
  const daCo = new Set<string>();
  const daDuoiDoSang = new Set<string>();
  for (const c of cau) {
    const x = theoId.get(c.id);
    if (!x || daCo.has(c.id)) continue;
    const loc = locTuCam(c.text, TU_CAM);
    if (loc === null) continue;
    const text = gopDuoiDoSang(loc, daDuoiDoSang, chuyenDe);
    daCo.add(c.id);
    const dich = muc.find((m) => m.id === x.q.muc) ?? mucDau;
    dich.nhanDinh.push({
      u: x.uuTien,
      n: {
        text,
        thamChieu: {
          quyTacId: x.q.id, sao: x.sao, cung: x.cungGoc, nguon: x.q.nguon, truongPhai: x.q.truongPhai,
          ...(x.cungLienQuan ? { cungLienQuan: x.cungLienQuan } : {}),
          ...(x.yeuTo.length ? { yeuTo: x.yeuTo } : {}),
        },
      },
    });
  }

  const choPhep = (n: NhanDinhTH): NhanDinh | null => {
    const loc = locTuCam(n.text, TU_CAM);
    return loc === null ? null : { ...n, text: loc };
  };
  for (const x of th?.them ?? []) {
    const n = choPhep(x.n);
    if (n) (muc.find((m) => m.id === x.muc) ?? mucDau).nhanDinh.push({ u: -1, n });
  }

  // Cách cục (mục đầu) xếp theo mức ưu tiên giảm dần; thứ tự ghép còn lại giữ nguyên.
  const mucRa = muc.map((m) => ({ id: m.id, tieuDe: m.tieuDe, nhanDinh: [...m.nhanDinh].sort((a, b) => b.u - a.u).map((x) => x.n) }));

  boCauLap(mucRa);
  const tomLai = (th?.tomLai ?? []).map(choPhep).filter((n): n is NhanDinh => n !== null);
  if (tomLai.length) mucRa.unshift({ id: 'tom-lai', tieuDe: 'Tóm lại', nhanDinh: tomLai });

  // Mục có trong cấu hình nhưng rỗng vẫn ẩn khỏi khách (đúng UX), nhưng phải đếm + cảnh báo để biết nội dung thiếu (L-6f7e17).
  ghiNhanMucMat(chuyenDe, cfg.muc.map((m) => m.id), mucRa);
  const kq: LuanGiai = { chuyenDe, ...(dv ? { van: dv.thongTin } : {}), muc: mucRa.filter((m) => m.nhanDinh.length), ghiChu: GHI_CHU, phienBan: PHIEN_BAN_QUY_TAC };
  if (!tuyChon.boQuaCache && !bat && dung === 'stub') ghi(khoa, kq);
  return kq;
}
