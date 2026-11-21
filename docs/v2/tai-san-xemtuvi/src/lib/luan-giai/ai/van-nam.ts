// Chuyên đề "Vận năm 2027" (mã cố định `van-nam-2027`): luận năm Đinh Mùi từ lá số thật, gồm đầu bài, tổng quan năm,
// bốn mảng và 12 tháng. Quy tắc do Hạnh soạn (docs/luan-giai/van-nam/DINH-DANG.md), đọc từ MỘT file:
// quy-tac-van/van-nam-2027.json (thay bản chốt chỉ cần chép đè file, không sửa code). Engine chỉ gọi qua src/lib/tuvi.
import fs from 'node:fs';
import path from 'node:path';
import type { Cung, LaSo, LuuNien, Sao } from '@/lib/tuvi';
import { luuNien } from '../../tuvi';
import { bam, doc, ghi } from './cache';
import { khopDieuKien, cungTheoViTri, type DieuKien } from './khop-v2';
import { locTuCam, type TuCamCauHinh } from './loc';
import tuCamJson from './tu-cam.json';
import quyTacVanJson from './quy-tac-van/van-10-nam.json';
import viecJson from './quy-tac-van/viec-nen-lam.json';
import ghiChuPhaiJson from './quy-tac-van/ghi-chu-truong-phai.json';
import nenCungThangJson from './quy-tac-van/nen-cung-thang.json';
import { nenQuanLoc, nenVcd, catTinhTamPhuong } from './nen-quan-loc';
import { GHI_CHU, PHIEN_BAN_QUY_TAC, khoaCache, maNghienCuuCua, sinhLuanGiai } from './index';

export const MA_VAN_NAM = 'van-nam-2027';
const NAM_HOP_LE = 2027;
const CAN_CHI_HOP_LE = 'Đinh Mùi';

type Lop = 'nam' | 'tieu-han' | 'thai-tue' | 'dai-van' | 'thang' | 'cung-goc';
/** Điều kiện bản 2 cộng các trường riêng của lớp năm (xem DINH-DANG.md, mục "Điều kiện mới"). */
type DieuKienNam = DieuKien & {
  tenCung?: string[];
  trung?: ('dai-van' | 'tieu-han' | 'thai-tue')[];
  saoLuu?: string[];
  luuHoa?: string;
  chiNamSinh?: string[];
  canNamSinh?: string[];
  /** Đúng khi ít nhất một điều kiện con đúng (bản 1.1). */
  motTrong?: DieuKienNam[];
  khongCoYeuToNam?: boolean;
  nhom?: string[][];
};
export interface QuyTacNam {
  id: string;
  chuyenDe: string;
  namXem?: number;
  lop: Lop;
  cung: string;
  loai: string;
  muc: string;
  phan?: string;
  dieuKien: DieuKienNam[];
  khong?: DieuKienNam[];
  noiDung: string;
  nguon: string[];
  truongPhai: string;
  uuTien?: number;
  maNghienCuu?: string[];
  tongHop?: boolean;
  /** Chữ riêng theo cung chức năng (L-5f6b69): có thì thay noiDung khi cung gốc trùng tên. */
  noiDungTheoCung?: Record<string, string>;
  /** Mã quy tắc 12 cung làm căn cứ cho từng chữ trong noiDungTheoCung (để duyệt, không đổi cách chọn việc). */
  maTheoCung?: Record<string, string[]>;
  /** Chữ dùng ở mục tháng (L-5f6b69): nói theo tháng, không "năm nay". Có thì ưu tiên hơn noiDung/noiDungTheoCung ở tháng. */
  noiDungThang?: string;
}

/** Điều kiện máy đọc của một mã bám trong viec-nen-lam.json (xem khung-doan-tra-phi.md, mục 6.0 điều 4). */
interface DieuKienViec {
  quyTacId?: string[];
  cung?: string[];
  /** Tất cả nhóm đều phải có mặt ở cung của đoạn; trong nhóm chỉ cần một: tên sao, "hoa:Hóa Kỵ" (hóa gốc), "luuHoa:Hóa Kỵ" (hóa của năm). */
  saoTrongCung?: string[][];
  /** Có sao khớp của đoạn mang hóa gốc này. */
  saoKhopHoaGoc?: string;
  /** Không được có sao nào trong danh sách (tên sao hoặc "hoa:Hóa Kỵ") ở cung của đoạn. */
  khongSaoTrongCung?: string[];
  /** Tam phương Quan Lộc có (true) hoặc không có (false) cát tinh hội về. */
  catTinhTamPhuong?: boolean;
}
interface MauViec {
  maMau: string;
  chuDe: string;
  maHuong: string[];
  maPhatHuy?: string[];
  cau: string;
  thuocDo: string;
  thoiHanThang: number;
  /** Bỏ qua mẫu khi tuổi người xem (năm xem − năm sinh dương) nhỏ hơn số này. */
  tuoiTu?: number;
  dieuKien?: Record<string, DieuKienViec>;
}
/** Việc nên làm (phần d): khách thấy cau, thuocDo, thoiHanThang; maMau và maHuong là mã ẩn. */
export interface ViecNenLam { maMau: string; maHuong: string; cau: string; thuocDo: string; thoiHanThang: number }

export interface NhanDinhNam {
  text: string;
  /** Vị trí trong mục: tổng quan có `phan`; bốn mảng có nen/nam-nay/goi-y. */
  phan?: string;
  /** (a) Một dòng "căn cứ trên lá số": sao, độ sáng, cung, chi, hóa, sao lưu. Thiếu ở câu dẫn. */
  canCu?: string;
  /** (c) Một dòng nguồn · trường phái (tên sách ngắn). */
  nguon?: string;
  /** Chỉ khi đoạn chạm chỗ các sách khác nhau. */
  ghiChuTruongPhai?: string;
  /** (d) Việc nên làm và cách đo. Thiếu ở câu dẫn. */
  viecNenLam?: ViecNenLam;
  /** Câu dẫn/khung (trọng điểm năm, bối cảnh, tóm lại): không thuộc đoạn 4 phần, không có (a)(c)(d). */
  cauDan?: true;
  thamChieu: { quyTacId: string; sao: string[]; cung: string; nguon: string; truongPhai: string; maNghienCuu?: string[]; tongHop?: boolean; viecBam?: string };
}
/** Đoạn bị giữ lại, không xuất ra bản trả phí vì thiếu (a) hoặc (d): chờ người viết bổ sung quy tắc hoặc mẫu việc. */
export interface DoanCho { quyTacId: string; cung: string; lyDo: string }
export interface ThangNam {
  thang: number;
  /** Ngày dương lịch bắt đầu tháng âm lịch, d/m/yyyy. */
  tuNgay: string;
  cung: string;
  thangMoc: boolean;
  nhanDinh: NhanDinhNam[];
}
export interface BaiVanNam {
  chuyenDe: typeof MA_VAN_NAM;
  namXem: number;
  canChi: string;
  tuoiMu: number;
  dauBai: { tuNgay: string; denNgay: string; nhanDinh: NhanDinhNam[] };
  /** Mục tổng quan và bốn mảng theo khung DINH-DANG.md. */
  muc: { id: string; tieuDe: string; nhanDinh: NhanDinhNam[] }[];
  thang: ThangNam[];
  ghiChuTruongPhai: string;
  ghiChu: string;
  phienBan: string;
}
type BangChu = Record<string, string>;
const NEN_CUNG_THANG = nenCungThangJson as unknown as {
  nen: BangChu; locGapKy: BangChu;
  chinhTinh: Record<string, BangChu>;
  cachCuc: Record<string, string | BangChu>;
  hoaGop: Record<string, BangChu>;
  locTonHoaLoc: BangChu;
  saoPhu: Record<string, string | BangChu>;
  thanCu: BangChu;
  hoaDoiChieu: Record<string, BangChu> & { gop: BangChu; gopCat: string; _kem: string };
  chinhTinhTheoCung: BangChu;
  doiChieu: { kinhLuu: string; tuanTriet: string };
};
/** Hóa Kỵ GỐC (từ can năm sinh) tại một cung: chính tinh hoặc sao khác mang Hóa Kỵ. */
export function coKyGocTaiCung(c: Cung): boolean {
  return [...c.chinhTinh, ...c.catTinh, ...c.phuTinh, ...c.hungTinh].some((s) => s.hoa === 'Hóa Kỵ');
}

/** Lưu hóa của năm (cả 12 cung); cauNenCungThang tự lọc theo cung tháng và cung đối. `true` = chỉ biết có Lộc lưu tại cung (không tên sao). */
export type LuuHoaNam = LuuNien['luuTuHoa'];
const SANG = new Set(['Miếu', 'Vượng', 'Đắc']);
const dien2 = (mau: string, bien: Record<string, string>) => mau.replace(/\{(\w+)\}/g, (m, k: string) => bien[k] ?? m);
const tuanTrietTen = (c: Cung) => (c.tuan && c.triet ? 'Tuần và Triệt' : c.tuan ? 'Tuần' : 'Triệt');
const saoDuyNhat = (ds: Sao[]): Sao[] => [...new Map(ds.map((s) => [s.key || s.ten, s])).values()];
const tatCaSao = (c: Cung): Sao[] => saoDuyNhat([...c.chinhTinh, ...c.catTinh, ...c.phuTinh, ...c.hungTinh]);
const coSao = (c: Cung, ten: string) => tatCaSao(c).some((s) => s.ten === ten);
const sangKem = (s: Sao): 'sang' | 'kem' | null => (s.dacTinhTen ? (SANG.has(s.dacTinhTen) ? 'sang' : 'kem') : null);

/**
 * Câu nền của cung tháng. Thứ tự (Hạnh, L-95d072 vòng 4): câu dữ kiện (kể cả Lộc gặp Kỵ có tên sao) -> cách cục hoặc chính tinh
 * -> Tuần/Triệt -> hóa gộp hoặc Lộc Tồn + Hóa Lộc -> tối đa một sao phụ -> cung Thân -> nen -> locGapKy (cuối, khi Lộc lưu gặp Kỵ gốc).
 * Chữ lấy nguyên văn từ quy-tac-van/nen-cung-thang.json, ở đây chỉ chọn khóa và thay chỗ giữ chỗ. Khóa chưa có nguồn chắc
 * (trùng hóa Lộc|Lộc, Khoa|Khoa, Quyền|Quyền; Thiên Không đứng một mình) cố ý không ghép.
 */
export function nenCungThang(c: Cung, doi: Cung, luu: boolean | LuuHoaNam = false, saoLuu: { ten: string; chi: number }[] = []): { text: string; sao: string[] } {
  const ten = (s: Sao) => (s.hoa ? `${s.ten} ${s.hoa}` : s.ten);
  const luuHoa: LuuHoaNam = luu === true ? [{ hoa: 'Hóa Lộc', sao: '', chi: c.chi }] : luu === false ? [] : luu;
  const luuTai = (x: Cung, hoa?: string) => luuHoa.filter((h) => h.chi === x.chi && (!hoa || h.hoa === hoa));
  const tinh = saoDuyNhat(c.chinhTinh);
  const khac = saoDuyNhat([...c.catTinh, ...c.phuTinh, ...c.hungTinh]).filter((s) => s.hoa);
  const kyGoc = tatCaSao(c).find((s) => s.hoa === 'Hóa Kỵ');
  const locLuu = luuTai(c, 'Hóa Lộc')[0];
  const dung: string[] = [];
  const them = (m: string | undefined, bien: Record<string, string> = {}) => { if (m) dung.push(dien2(m, bien)); };
  const vcd = tinh.length === 0;
  const nguon = vcd ? saoDuyNhat(doi.chinhTinh) : tinh;
  const noi = vcd ? `cung đối chiếu ${doi.ten}` : `cung ${c.ten}`;
  const tt = c.tuan || c.triet ? tuanTrietTen(c) : '';
  const bien = { noi, cung: c.ten, tt };

  // 1. Câu dữ kiện.
  let cau: string;
  if (tinh.length) cau = `Cung ${c.ten} của tháng này có ${tinh.map(ten).join(', ')}${khac.length ? `, cùng ${khac.map(ten).join(', ')}` : ''} ngay từ lá số gốc; phần lưu niên tác động lên nền sẵn có ấy.`;
  else if (doi.chinhTinh.length) cau = `Cung ${c.ten} của tháng này vô chính diệu, nên xem chính tinh cung đối chiếu (${saoDuyNhat(doi.chinhTinh).map(ten).join(', ')}) làm nền${khac.length ? `; cung còn có ${khac.map(ten).join(', ')}` : ''}.`;
  else cau = `Cung ${c.ten} của tháng này vô chính diệu, cung đối chiếu cũng không có chính tinh${khac.length ? `; cung có ${khac.map(ten).join(', ')}` : ''}.`;
  const locGapKy = !!kyGoc && !!locLuu;
  if (locGapKy) cau += ` Tháng này có Hóa Lộc lưu${locLuu.sao ? ` (${locLuu.sao})` : ''} gặp ${ten(kyGoc)} từ lá số gốc cùng cung ${c.ten}.`;

  // 2. Cách cục (một câu) hoặc chính tinh.
  const tenNguon = nguon.map((s) => s.ten);
  const chiNguon = vcd ? doi.tenChi : c.tenChi;
  const saoDung: string[] = tenNguon.slice(0, 2);
  const co = (...t: string[]) => t.every((x) => tenNguon.includes(x));
  const CC = NEN_CUNG_THANG.cachCuc;
  let cachCucTuanTriet = false;
  let mauCach: string | undefined;
  if (co('Vũ Khúc', 'Tham Lang')) mauCach = CC['Vũ Khúc+Tham Lang'] as string;
  else if (co('Thái Dương', 'Thái Âm')) {
    const nn = CC['Thái Dương+Thái Âm'] as BangChu;
    if (nguon.some((s) => s.hoa === 'Hóa Kỵ')) mauCach = nn.hoaKy;
    else if (tt) { mauCach = nn.tuanTriet; cachCucTuanTriet = true; } else mauCach = nn.thuong;
  } else if (co('Thái Dương', 'Thiên Lương') && (chiNguon === 'Mão' || chiNguon === 'Dậu')) mauCach = (CC['Thái Dương+Thiên Lương'] as BangChu)[chiNguon];
  else if (co('Thái Dương', 'Cự Môn')) mauCach = CC['Thái Dương+Cự Môn'] as string;
  else if (co('Tử Vi', 'Thiên Phủ')) mauCach = CC['Tử Vi+Thiên Phủ'] as string;
  // H3: một câu nối chủ đề cung, đặt ngay sau câu sao đầu tiên, mỗi tháng một lần.
  const TC = NEN_CUNG_THANG.chinhTinhTheoCung;
  let daTheoCung = false;
  const chenTheoCung = (mau: string) => {
    if (daTheoCung || !TC[c.ten]) return;
    daTheoCung = true; them(mau, { ...bien, mang: TC[c.ten] });
  };
  if (mauCach) { them(mauCach, bien); chenTheoCung(vcd ? TC._doi : TC._tai); }
  else for (const s of nguon.slice(0, 2)) {
    const k = sangKem(s), m = k ? NEN_CUNG_THANG.chinhTinh[s.ten]?.[k] : undefined;
    them(m, bien); if (m) chenTheoCung(vcd ? TC._doi : TC._tai);
  }

  // B5: hóa của chính tinh ở cung đối chiếu (hoaDoiChieu), tối đa một câu mỗi tháng.
  const HD = NEN_CUNG_THANG.hoaDoiChieu;
  const coLocCungThang = coSao(c, 'Lộc Tồn') || tatCaSao(c).some((s) => s.hoa === 'Hóa Lộc') || luuTai(c, 'Hóa Lộc').length > 0;
  const catTen = (h: string) => h.replace(/^Hóa /, '');
  const ungHoa = saoDuyNhat(doi.chinhTinh).flatMap((s) => {
    const g = s.hoa ? catTen(s.hoa) : null, ds = luuTai(doi).filter((h) => h.sao === s.ten).map((h) => catTen(h.hoa));
    const out: { s: Sao; hang: number; mau: string }[] = [];
    const kem = sangKem(s) === 'kem';
    const them1 = (hang: number, mau: string | undefined, nhacKem: boolean) => { if (mau) out.push({ s, hang, mau: nhacKem && kem ? mau.replace(/\.$/, '') + HD._kem : mau }); };
    for (const l of ds.length ? ds : [null]) {
      if (g && l) {
        const cat = (x: string) => x !== 'Kỵ';
        if (HD.gop[`${g}|${l}`]) them1(0, HD.gop[`${g}|${l}`], false);
        else if (cat(g) && cat(l)) them1(0, HD.gopCat.replace('{hoaGoc}', g).replace('{hoaLuu}', l), true);
      } else if (g) {
        them1(g === 'Kỵ' ? 1 : g === 'Lộc' ? 2 : g === 'Quyền' ? 3 : 4, g === 'Kỵ' && coLocCungThang ? HD.Kỵ.xungLoc : HD[g]?.goc, g !== 'Kỵ');
      } else if (l) them1(l === 'Kỵ' ? 1 : l === 'Lộc' ? 2 : l === 'Quyền' ? 3 : 4, HD[l]?.luu, l !== 'Kỵ');
    }
    return out;
  }).sort((a, b) => a.hang - b.hang)[0];
  // Mục tháng nói theo tháng (L-5f6b69): khóa hoaDoiChieu còn chữ 'năm nay' nên đổi khi ghép.
  const themHoaDoi = () => { if (ungHoa) { them(ungHoa.mau.replace(/\bnăm nay\b/g, 'tháng này'), { ...bien, sao: ungHoa.s.ten, doi: doi.ten }); saoDung.push(ungHoa.s.ten); } };
  if (vcd) themHoaDoi();

  // 3. Tuần/Triệt đóng cung tháng (Nhật Nguyệt gặp Tuần/Triệt đã nằm trong câu cách cục).
  if (tt && !cachCucTuanTriet) {
    if (vcd) them(c.ten === 'Phúc Đức' && c.triet ? CC.vcdTriet_PhucDuc as string : CC.vcdTuanTriet as string, bien);
    else {
      const s = tinh[0], dt = s.dacTinhTen;
      const mau = dt === 'Hãm' ? CC.hamTuanTriet : dt === 'Bình' ? CC.binhTuanTriet : dt && SANG.has(dt) ? CC.sangTuanTriet : undefined;
      them(mau as string | undefined, { ...bien, sao: s.ten });
    }
  }

  // 4. Hóa gốc + hóa lưu cùng sao, hoặc Lộc Tồn + Hóa Lộc.
  const gop = tatCaSao(c).flatMap((s) => (s.hoa ? luuTai(c).filter((h) => h.sao === s.ten).map((h) => ({ s, key: `${s.hoa!.replace(/^Hóa /, '')}|${h.hoa.replace(/^Hóa /, '')}` })) : []))
    .filter((g) => NEN_CUNG_THANG.hoaGop[g.key] && !['Lộc|Lộc', 'Khoa|Khoa', 'Quyền|Quyền'].includes(g.key))[0];
  if (gop) {
    const k = sangKem(gop.s);
    if (k) { them(NEN_CUNG_THANG.hoaGop[gop.key][k], { ...bien, sao: gop.s.ten }); saoDung.push(gop.s.ten); }
  }
  // Lộc Tồn + Hóa Lộc vẫn nêu khi đã có câu hóa gộp (hai ý khác nhau); dongCung không gọi "song Lộc".
  if (coSao(c, 'Lộc Tồn') && luuTai(c, 'Hóa Lộc').length) { them(NEN_CUNG_THANG.locTonHoaLoc.dongCung, bien); saoDung.push('Lộc Tồn'); }
  else if ((coSao(c, 'Lộc Tồn') && luuTai(doi, 'Hóa Lộc').some((h) => !ungHoa || h.sao !== ungHoa.s.ten)) || (coSao(doi, 'Lộc Tồn') && luuTai(c, 'Hóa Lộc').length)) them(NEN_CUNG_THANG.locTonHoaLoc.xungChieu, bien);

  // 5. Tối đa một câu sao phụ.
  const SP = NEN_CUNG_THANG.saoPhu;
  const dsSao = tatCaSao(c);
  const mongLoc = dsSao.some((s) => s.ten === 'Lộc Tồn' || s.hoa === 'Hóa Lộc') || luuTai(c, 'Hóa Lộc').length > 0;
  const khongKiep = dsSao.some((s) => s.ten === 'Địa Không' || s.ten === 'Địa Kiếp');
  const ma = dsSao.find((s) => s.ten === 'Thiên Mã'), hl = dsSao.find((s) => s.ten === 'Hỏa Tinh' || s.ten === 'Linh Tinh');
  const xk = dsSao.find((s) => (s.ten === 'Văn Xương' || s.ten === 'Văn Khúc') && sangKem(s));
  // B4: Kình Dương / Đà La (gốc, lưu, trùng) ưu tiên hơn Thiên Mã và các sao phụ khác; cả hai cùng có thì lấy Kình, trừ khi Đà trùng.
  const kd = (['Kình Dương', 'Đà La'] as const).map((t) => {
    const goc = dsSao.find((s) => s.ten === t), l = saoLuu.some((s) => s.chi === c.chi && s.ten.replace(/^L\. /, '') === t);
    return { t, goc, trang: goc && l ? 'trung' : l ? 'luu' : goc ? 'goc' : null };
  }).filter((x) => x.trang);
  const kdChon = kd.length === 2 && kd[1].trang === 'trung' && kd[0].trang !== 'trung' ? kd[1] : kd[0];
  if (kdChon) {
    const m = SP[kdChon.t] as BangChu, bk = { ...bien, sao: hl?.ten ?? '' };
    let mau: string;
    if (kdChon.trang === 'trung') mau = m.trung;
    else if (hl) mau = kdChon.trang === 'luu' ? m.luuGapHoaLinh : m.gapHoaLinh;
    else if (kdChon.trang === 'luu') mau = m.luu;
    else mau = tt ? m.tuanTriet : sangKem(kdChon.goc!) === 'sang' ? m.dac : m.ham;
    them(mau, bk); saoDung.push(kdChon.t);
  } else if (ma) { const m = SP['Thiên Mã'] as BangChu; them(tt || khongKiep ? m.gapKhong : mongLoc ? m.gapLoc : m.thuong, bien); saoDung.push(ma.ten); }
  else if (hl) {
    const m = SP['Hỏa Tinh|Linh Tinh'] as BangChu, k = hl.dacTinhTen;
    them(tt ? m.tuanTriet : k && SANG.has(k) ? m.dac : k === 'Hãm' ? m.ham : m.binh, { ...bien, sao: hl.ten }); saoDung.push(hl.ten);
  } else if (xk) { them((SP['Văn Xương|Văn Khúc'] as BangChu)[sangKem(xk)!], { ...bien, sao: xk.ten }); saoDung.push(xk.ten); }
  else if (coSao(c, 'Thiên Không') && coSao(c, 'Đào Hoa')) { them(SP['Thiên Không+Đào Hoa'] as string, bien); saoDung.push('Thiên Không', 'Đào Hoa'); }

  // 5b. Cung tháng có chính tinh: tối đa một câu về chính tinh (hoặc Hỏa/Linh) ở cung đối chiếu, dùng khóa sẵn có.
  if (!vcd) {
    // B8: cung đối chiếu có 2 chính tinh thì nêu cả hai (không chỉ .find một sao).
    const tDoiDs = saoDuyNhat(doi.chinhTinh).filter((s) => sangKem(s) && NEN_CUNG_THANG.chinhTinh[s.ten]).slice(0, 2);
    const hlDoi = saoDuyNhat(doi.hungTinh.concat(doi.phuTinh)).find((s) => s.ten === 'Hỏa Tinh' || s.ten === 'Linh Tinh');
    const nDoi = `cung đối chiếu ${doi.ten}`;
    for (const t of tDoiDs) { them(NEN_CUNG_THANG.chinhTinh[t.ten][sangKem(t)!], { ...bien, noi: nDoi }); chenTheoCung(TC._doi); saoDung.push(t.ten); }
    // B7: Hỏa/Linh, Kình lưu, Tuần/Triệt ở cung đối chiếu vẫn ghép khi đã có câu chính tinh đối chiếu.
    if (hlDoi && !hl) {
      const m = SP['Hỏa Tinh|Linh Tinh'] as BangChu, k = hlDoi.dacTinhTen;
      them(k && SANG.has(k) ? m.dac : k === 'Hãm' ? m.ham : m.binh, { ...bien, sao: hlDoi.ten, cung: `${doi.ten} (đối chiếu)` }); saoDung.push(hlDoi.ten);
    }
    const DC = NEN_CUNG_THANG.doiChieu;
    if (!kdChon && saoLuu.some((x) => x.chi === doi.chi && x.ten.replace(/^L\. /, '') === 'Kình Dương')) { them(DC.kinhLuu, { ...bien, doi: doi.ten }); saoDung.push('Kình Dương'); }
    if (doi.tuan || doi.triet) them(DC.tuanTriet, { ...bien, doi: doi.ten, ttDoi: tuanTrietTen(doi) });
    themHoaDoi();
  }

  // 6. Cung Thân, 7. nen, 8. locGapKy.
  if (c.laThan) them(NEN_CUNG_THANG.thanCu[c.ten] ?? NEN_CUNG_THANG.thanCu.thuong, bien);
  them(NEN_CUNG_THANG.nen[c.ten], bien);
  if (locGapKy) them(NEN_CUNG_THANG.locGapKy[c.ten], bien);
  return { text: [cau, ...dung].join(' '), sao: [...new Set(saoDung)] };
}
/** Chuỗi câu nền của cung tháng (xem nenCungThang). */
export function cauNenCungThang(c: Cung, doi: Cung, luu: boolean | LuuHoaNam = false, saoLuu: { ten: string; chi: number }[] = []): string {
  return nenCungThang(c, doi, luu, saoLuu).text;
}

/** Bản xem trước miễn phí: không có mã quy tắc, không có nội dung tháng. */
export interface XemTruocVanNam {
  chuyenDe: typeof MA_VAN_NAM;
  namXem: number;
  canChi: string;
  dauBai: { tuNgay: string; denNgay: string; cau: string[] };
  thaiTue: string[];
  diemThuan: string | null;
  cungThang: { thang: number; cung: string }[];
  /** Một tháng mở làm mẫu (L-bb82af): chỉ chữ luận đã lọc từ cấm; không mã quy tắc, không việc nên làm. 11 tháng còn lại chỉ có tên cung ở cungThang. */
  thangMau: { thang: number; tuNgay: string; cung: string; thangMoc: boolean; cau: string[] } | null;
  ghiChu: string;
  phienBan: string;
}

const TU_CAM = tuCamJson as unknown as TuCamCauHinh;
const QUY_TAC_VAN_10 = quyTacVanJson as unknown as (QuyTacNam & { cungVan?: string })[];

/** Đọc mỗi lần nạp module từ một file; bản chốt thay bằng cách chép đè file này. */
function napQuyTac(): QuyTacNam[] {
  const tep = path.join(process.cwd(), 'src/lib/luan-giai/ai/quy-tac-van/van-nam-2027.json');
  return JSON.parse(fs.readFileSync(tep, 'utf8')) as QuyTacNam[];
}
const QUY_TAC = napQuyTac();
/** Tăng số này mỗi khi đổi cách ghép bài để cache cũ không bị dùng lại. */
const NGUON_NEN_CUNG = ['Đặc tả an sao xemtuvi.vn', 'Tử Vi Đẩu Số Tân Biên', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)', 'Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)'];
const PHIEN_BAN_GHEP = 'gh9-nen-cung-thang-v6';
const MAU_VIEC = viecJson as unknown as MauViec[];
const GHI_CHU_PHAI = ghiChuPhaiJson as unknown as Record<string, string>;
export const PHIEN_BAN_VAN_NAM = bam(JSON.stringify([QUY_TAC, MAU_VIEC, GHI_CHU_PHAI, PHIEN_BAN_QUY_TAC, PHIEN_BAN_GHEP, nenCungThangJson])).slice(0, 12);
const NAM_CO_QUY_TAC = new Set(QUY_TAC.map((q) => q.namXem ?? NAM_HOP_LE));

// Ngày dương lịch bắt đầu 12 tháng âm lịch và hết năm (engine lịch; test đối chiếu lại bằng engine).
const NGAY_THANG: Record<number, { thang: string[]; het: string }> = {
  2027: {
    thang: ['6/2/2027', '8/3/2027', '7/4/2027', '6/5/2027', '5/6/2027', '4/7/2027', '2/8/2027', '1/9/2027', '30/9/2027', '29/10/2027', '28/11/2027', '28/12/2027'],
    het: '25/1/2028',
  },
};

const TEN_MUC: Record<string, string> = {
  'tong-quan': 'Tổng quan năm', 'su-nghiep': 'Sự nghiệp', 'tai-chinh': 'Tài chính', 'tinh-cam': 'Tình cảm', 'suc-khoe': 'Sức khỏe',
};
const MANG: { id: string; cung: string }[] = [
  { id: 'su-nghiep', cung: 'Quan Lộc' }, { id: 'tai-chinh', cung: 'Tài Bạch' }, { id: 'tinh-cam', cung: 'Phu Thê' }, { id: 'suc-khoe', cung: 'Tật Ách' },
];
const PHAN_TONG_QUAN = ['boi-canh', 'thai-tue', 'tieu-han', 'tu-hoa', 'sao-luu'];
/** Số đoạn tối đa mỗi phần (NAM-PP-10: cắt theo ưu tiên, đoạn cung nền `-01-` luôn giữ). */
const TOI_DA: Record<string, number> = { 'thai-tue': 5, 'tieu-han': 5, 'tu-hoa': 4, 'sao-luu': 3 };
const TOI_DA_NAM_NAY = 3;
const THU_TU_LOAI: Record<string, number> = { CT: 0, CC: 1, HOA: 2, SP: 3, YN: 4 };

// ---------------------------------------------------------------- lá số mở rộng với sao lưu

const SAO_GIA = (ten: string): Sao => ({ key: ten, ten, hanh: 'Kim', loai: 'cat', dacTinh: null, dacTinhTen: null, hoa: null });

/**
 * Lá số mở rộng: mỗi cung có thêm sao lưu (tên "L. …") và sao giả "@Hóa Lộc" / "@Hóa Lộc:Thái Âm" cho lưu hóa,
 * để dùng nguyên bộ khớp bản 2 (khop-v2) cho điều kiện của lớp năm.
 */
function moRong(ls: LaSo, ln: LuuNien): LaSo {
  return {
    ...ls,
    cung: ls.cung.map((c) => ({
      ...c,
      phuTinh: [
        ...c.phuTinh,
        ...ln.saoLuu.filter((s) => s.chi === c.chi).map((s) => SAO_GIA(s.ten)),
        ...ln.luuTuHoa.filter((h) => h.chi === c.chi).flatMap((h) => [SAO_GIA(`@${h.hoa}`), SAO_GIA(`@${h.hoa}:${h.sao}`)]),
      ],
    })),
  };
}

const saoCua = (c: Cung): Sao[] => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];
const sang = (s?: Sao) => !!s?.dacTinhTen && ['Miếu', 'Vượng', 'Đắc'].includes(s.dacTinhTen);

interface Ngu {
  ls: LaSo; // đã mở rộng
  ln: LuuNien;
  chiNamSinh: string;
  canNamSinh: string;
}

/** Một điều kiện lớp năm tại cung gốc g → tên sao khớp (có thể rỗng); null nếu không khớp. */
function khopMotDieuKien(n: Ngu, g: Cung, k: DieuKienNam): string[] | null {
  if (k.tenCung && !k.tenCung.includes(g.ten)) return null;
  if (k.chiNamSinh && !k.chiNamSinh.includes(n.chiNamSinh)) return null;
  if (k.canNamSinh && !k.canNamSinh.includes(n.canNamSinh)) return null;
  if (k.motTrong && !k.motTrong.some((m) => khopMotDieuKien(n, g, m) !== null)) return null;
  if (k.trung) {
    const chi = { 'dai-van': n.ln.daiVan, 'tieu-han': n.ln.tieuHan, 'thai-tue': n.ln.luuThaiTue };
    if (!k.trung.every((l) => chi[l] === g.chi)) return null;
  }
  if (k.khongCoYeuToNam) {
    const xung = (g.chi + 6) % 12;
    const chamNam = [n.ln.daiVan, n.ln.tieuHan, n.ln.luuThaiTue].some((x) => x === g.chi || x === xung)
      || n.ln.luuTuHoa.some((h) => h.chi === g.chi || h.chi === xung)
      || n.ln.saoLuu.some((s) => s.chi === g.chi || s.chi === xung);
    if (chamNam) return null;
  }
  const ds = cungTheoViTri(n.ls, g, k.viTri);
  if (k.nhom) {
    const co = (e: string) => {
      const [loai, ten = ''] = e.split(':');
      return ds.some((c) => saoCua(c).some((x) => {
        if (loai === 'hoa') return x.hoa === ten;
        if (loai === 'luuHoa') return x.ten === `@${ten}`;
        return x.ten === loai && (ten !== 'sáng' || sang(x));
      }));
    };
    if (k.nhom.filter((nhom) => nhom.some(co)).length < (k.toiThieu ?? k.nhom.length)) return null;
    return [];
  }
  // Chuyển điều kiện riêng của lớp năm sang điều kiện bản 2 trên lá số mở rộng.
  const { tenCung: _a, trung: _b, saoLuu, luuHoa, chiNamSinh: _c, canNamSinh: _f, motTrong: _g, khongCoYeuToNam: _d, nhom: _e, ...chuan } = k;
  const std: DieuKien = { ...chuan };
  if (saoLuu) {
    std.sao = [...(std.sao ?? []), ...saoLuu];
    std.toiThieu = k.toiThieu ?? saoLuu.length;
  }
  if (luuHoa) {
    // Có sao: sao đầu phải mang lưu hóa này, cùng cung (giữ nguyên độ sáng của sao đầu).
    std.sao = std.sao?.length ? [...std.sao, `@${luuHoa}:${std.sao[0]}`] : [`@${luuHoa}`];
  }
  const r = khopDieuKien(n.ls, g, std);
  return r === null ? null : r.filter((s) => !s.startsWith('@'));
}

/** Quy tắc khớp tại cung gốc g → sao khớp; null nếu không khớp. */
function khopQuyTacNam(n: Ngu, g: Cung, q: QuyTacNam): string[] | null {
  const sao = new Set<string>();
  for (const k of q.dieuKien) {
    const r = khopMotDieuKien(n, g, k);
    if (r === null) return null;
    r.forEach((s) => sao.add(s));
  }
  for (const k of q.khong ?? []) if (khopMotDieuKien(n, g, k) !== null) return null;
  return [...sao];
}

// ---------------------------------------------------------------- ghép bài

interface Khop {
  q: QuyTacNam;
  text: string;
  sao: string[];
  cung: Cung;
  /** Lớp của đoạn (khác q.lop khi đoạn chính tinh mượn từ bộ đại vận). */
  phan?: string;
}

const cungTheoTen = (ls: LaSo, ten: string) => ls.cung.find((c) => c.ten === ten)!;

/** Cung gốc cần thử cho một quy tắc (thang: 12 tháng xử lý ở nơi gọi). */
function cungGocCua(n: Ngu, q: QuyTacNam): Cung[] {
  const { ls, ln } = n;
  switch (q.lop) {
    case 'nam': return [ls.cung[0]];
    case 'tieu-han': return ln.tieuHan == null ? [] : [ls.cung[ln.tieuHan]];
    case 'thai-tue': return [ls.cung[ln.luuThaiTue]];
    case 'dai-van': return ln.daiVan == null ? [] : [ls.cung[ln.daiVan]];
    case 'thang': return [];
    case 'cung-goc': return q.cung === '*' ? ls.cung : [cungTheoTen(ls, q.cung)];
  }
}

/**
 * NAM-LUU-03 (quý nhân Khôi Việt lưu): từ tuổi âm (mụ) tuoiTu trở lên thay noiDungTheoCung bằng bảng quyNhanLuuTuoi50 (nen-cung-thang.json).
 * Tuổi âm = năm xem − năm âm lịch sinh + 1 (ln.tuoiMu, cùng quy ước đại vận). Cung thiếu khóa dùng câu gốc.
 */
const QUY_NHAN_TUOI = nenCungThangJson.quyNhanLuuTuoi50 as unknown as { tuoiTu: number } & Record<string, string | number>;
export function quyTacTheoTuoi<T extends { id: string; noiDungTheoCung?: Record<string, string> }>(q: T, tuoiMu: number): T {
  if (q.id !== 'NAM-LUU-03' || tuoiMu < QUY_NHAN_TUOI.tuoiTu) return q;
  const moi: Record<string, string> = { ...q.noiDungTheoCung };
  for (const [cung, chu] of Object.entries(QUY_NHAN_TUOI)) if (!cung.startsWith('_') && typeof chu === 'string') moi[cung] = chu;
  return { ...q, noiDungTheoCung: moi };
}

/** {sao} = mọi sao khớp; {sao:A|B} = chỉ những sao trong danh sách A|B có thật trên lá số (bỏ tiền tố "L. "), nối bằng " và ". */
function dien(q: QuyTacNam, sao: string[], g: Cung, thang = false): string {
  const bo = (s: string) => s.replace(/^L\. /, '');
  const goc = (thang ? q.noiDungThang : undefined) ?? q.noiDungTheoCung?.[g.ten] ?? q.noiDung;
  return goc
    .replace(/\{sao:([^}]+)\}/g, (_m, ds: string) => { const loc = ds.split('|'); return sao.filter((s) => loc.includes(s)).map(bo).join(' và '); })
    .replaceAll('{sao}', sao.join(', '))
    .replaceAll('{cung}', g.ten);
}

/** Đổi chữ "10 năm / giai đoạn / cung vận" của bộ đại vận thành "năm nay" (NAM-PP-06). */
function doiSangNam(s: string, nhan: string): string {
  return s
    .replace(/[Cc]ung vận/g, (m) => (m[0] === 'C' ? 'Cung ' : 'cung ') + nhan)
    .replace(/tọa vận/g, `tọa ở cung ${nhan}`)
    .replace(/chủ đề nổi bật của 10 năm này/g, 'chủ đề nổi bật của năm nay')
    .replace(/10 năm này/g, 'năm nay')
    .replace(/vận rèn/g, 'năm rèn')
    .replace(/giai đoạn/g, 'năm');
}

const xepHang = (a: Khop, b: Khop) => (THU_TU_LOAI[a.q.loai] ?? 9) - (THU_TU_LOAI[b.q.loai] ?? 9) || (b.q.uuTien ?? 0) - (a.q.uuTien ?? 0);
const laNen = (k: Khop) => /^NAM-(TT|TH)-01/.test(k.q.id);

function chinhTinhCuaCung(n: Ngu, g: Cung, nhan: string, phan: string): Khop[] {
  return QUY_TAC_VAN_10
    .filter((q) => q.id.startsWith('VAN-CT-') && (!q.cungVan || q.cungVan === '*' || q.cungVan === g.ten))
    .flatMap((q) => {
      const sao = khopQuyTacNam(n, g, q);
      if (sao === null) return [];
      const qNam = { ...q, lop: phan as Lop, cung: g.ten, noiDung: doiSangNam(q.noiDung, nhan) };
      return [{ q: qNam, text: dien(qNam, sao, g), sao, cung: g, phan }];
    });
}

function thamChieu(k: Khop) {
  return { quyTacId: k.q.id, sao: k.sao, cung: k.cung.ten, nguon: k.q.nguon.join('; '), truongPhai: k.q.truongPhai, maNghienCuu: k.q.maNghienCuu ?? [], ...(k.q.tongHop ? { tongHop: true } : {}) };
}
function nhanDinh(k: Khop, phan?: string): NhanDinhNam | null {
  const text = locTuCam(k.text, TU_CAM);
  if (text === null) return null;
  return { text, ...(phan ? { phan } : {}), thamChieu: thamChieu(k) };
}
const gom = (ds: Khop[], phan?: string) => ds.flatMap((k) => { const x = nhanDinh(k, phan); return x ? [x] : []; });

/** "chủ đề nổi lên là X." của rule NAM-THANG-03-* → X, để viết câu Tóm lại. */
function chuDeCung(ten: string): string {
  const q = QUY_TAC.find((x) => x.lop === 'thang' && x.dieuKien.some((k) => k.tenCung?.includes(ten)));
  const m = q?.noiDung.match(/chủ đề nổi lên là (.+?)\.?$/);
  return m ? m[1] : ten;
}

function tomLai(n: Ngu): Khop {
  const { ls, ln } = n;
  const ten = (chi: number | null) => (chi == null ? '' : ls.cung[chi].ten);
  const tt = ten(ln.luuThaiTue), th = ten(ln.tieuHan);
  const hoa = (h: string) => ln.luuTuHoa.find((x) => x.hoa === h);
  const lop = hoa('Hóa Lộc'), ky = hoa('Hóa Kỵ');
  const cau = [
    `Năm ${ln.namXem}: trọng điểm của năm nằm ở cung ${tt} (${chuDeCung(tt)}), còn việc riêng của bạn dễ được khơi lên ở cung ${th} (${chuDeCung(th)}).`,
    lop ? `Nguồn lợi, cơ hội của năm dễ đến qua lĩnh vực của cung ${ten(lop.chi)}` : '',
    ky ? `${lop ? ', ' : ''}còn cung ${ten(ky.chi)} là nơi nên làm chậm, ghi rõ và kiểm lại trước khi chốt.` : lop ? '.' : '',
  ].join('');
  const q: QuyTacNam = {
    id: 'NAM-PP-10-TOM-LAI', chuyenDe: 'van-nam', lop: 'nam', cung: 'Năm', loai: 'YN', muc: 'tong-quan', phan: 'tom-lai', dieuKien: [],
    noiDung: cau, nguon: ['Đặc tả an sao xemtuvi.vn'], truongPhai: 'Tam hợp phái Việt',
  };
  return { q, text: cau, sao: [], cung: ls.cung[ln.luuThaiTue], phan: 'tom-lai' };
}

function thangMoc(n: Ngu, c: Cung): boolean {
  const { ln } = n;
  return [ln.tieuHan, ln.luuThaiTue, ln.daiVan].includes(c.chi) || ln.luuTuHoa.some((h) => h.chi === c.chi && (h.hoa === 'Hóa Lộc' || h.hoa === 'Hóa Kỵ'));
}

/** Sao lưu mang tính vướng (sát tinh, bại tinh, Thái Tuế) và nghĩa ngắn để người đọc hiểu; Hóa Kỵ xử lý riêng. */
const SAO_VUONG: Record<string, string> = {
  'Kình Dương': 'va chạm, nóng vội', 'Đà La': 'trì trệ, dây dưa', 'Tang Môn': 'chuyện buồn phiền', 'Bạch Hổ': 'căng thẳng, va chạm',
  'Thiên Khốc': 'buồn lo', 'Thiên Hư': 'hụt hẫng, lo nghĩ', 'Thái Tuế': 'lời ra tiếng vào',
};

/**
 * Cung tháng đóng Tuần/Triệt mà có sao lưu hoặc lưu hóa nhập vào (L-91613b, phiếu Thư L-5f6b69 lỗi 2).
 * Phái Việt: Tuần/Triệt không đổi tính sao, chỉ đổi cường độ (CHUNG-TUAN-02): sao thuận và Lộc/Quyền/Khoa đến chậm, rõ dần;
 * sát tinh và Hóa Kỵ thì phần vướng nhẹ đi (CHUNG-TUAN-05); cung có cả hai thì nói cả hai chiều (CHUNG-TUAN-06).
 * Câu tự nêu tên sao nên không dựa vào câu đứng trước ("các điểm nêu trên").
 */
function cauTuanTriet(n: Ngu, c: Cung): Khop | null {
  if (!c.tuan && !c.triet) return null;
  const ten = (s: string) => s.replace(/^L\. /, '');
  const luu = n.ln.saoLuu.filter((s) => s.chi === c.chi).map((s) => ten(s.ten));
  const hoa = n.ln.luuTuHoa.filter((h) => h.chi === c.chi);
  if (!luu.length && !hoa.length) return null;
  const dong = c.tuan && c.triet ? 'Tuần và Triệt' : c.tuan ? 'Tuần' : 'Triệt';
  const noi = (ds: string[]) => (ds.length > 1 ? `${ds.slice(0, -1).join(', ')} và ${ds[ds.length - 1]}` : ds[0]);
  const thuan = [...luu.filter((s) => !SAO_VUONG[s]).map((s) => `${s} lưu`), ...hoa.filter((h) => h.hoa !== 'Hóa Kỵ').map((h) => `${h.sao} ${h.hoa}`)];
  const vuong = [...luu.filter((s) => SAO_VUONG[s]).map((s) => `${s} lưu (${SAO_VUONG[s]})`), ...hoa.filter((h) => h.hoa === 'Hóa Kỵ').map((h) => `${h.sao} ${h.hoa} (${h.sao === 'Cự Môn' ? 'hiểu lầm, tranh luận' : 'vướng bận'})`)];
  const nhip = [c.tuan ? 'làm từng bước, tránh nôn nóng' : '', c.triet ? 'kiên nhẫn chờ kết quả' : ''].filter(Boolean).join(' và ');
  const cau = [
    thuan.length ? `phần thuận từ ${noi(thuan)} đến chậm hơn, rõ dần theo thời gian, nên bạn ${nhip}.` : '',
    vuong.length ? `${thuan.length ? 'Phần vướng từ' : 'phần vướng từ'} ${noi(vuong)} ${thuan.length ? 'cũng ' : ''}nhẹ đi, vì ${dong} làm dịu các sao này.` : '',
  ].filter(Boolean).join(' ');
  const text = `Cung ${c.ten} của tháng này đóng ${dong}: ${cau}`;
  const q: QuyTacNam = {
    id: 'NAM-THANG-04-TUAN-TRIET', chuyenDe: 'van-nam', lop: 'thang', cung: c.ten, loai: 'YN', muc: 'tong-quan', phan: 'thang', dieuKien: [],
    noiDung: text, truongPhai: 'Tam hợp phái Việt', maNghienCuu: ['CHUNG-TUAN-02', 'CHUNG-TUAN-05', 'CHUNG-TUAN-06'],
    nguon: ['Đặc tả an sao xemtuvi.vn', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)', 'Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn)'],
  };
  return { q, text, sao: [...luu, ...hoa.map((h) => h.sao)], cung: c };
}


/** Năm đã qua được phép xem ở đường kiểm chứng (src/lib/luan-giai/ai/kiem-chung.ts); mọi đường khác vẫn chỉ nhận 2027. */
export const NAM_KIEM_CHUNG = [2025, 2026] as const;

export function kiemTraNamXem(namXem: number, ls: LaSo, tuyChon: { kiemChung?: boolean } = {}): void {
  if (tuyChon.kiemChung) {
    // Đường kiểm chứng chỉ đọc vị trí lưu niên của engine, không dùng bộ quy tắc 2027 nên không cần kiểm Đinh Mùi.
    if (!(NAM_KIEM_CHUNG as readonly number[]).includes(namXem)) throw new Error(`Đường kiểm chứng chỉ nhận năm ${NAM_KIEM_CHUNG.join(', ')}, không phải ${namXem}.`);
    return;
  }
  if (!Number.isInteger(namXem) || !NAM_CO_QUY_TAC.has(namXem) || !NGAY_THANG[namXem]) {
    throw new Error(`Chuyên đề Vận năm chưa có bộ quy tắc cho năm ${namXem}; hiện chỉ có năm ${NAM_HOP_LE} (${CAN_CHI_HOP_LE}).`);
  }
  const cc = luuNien(ls, namXem).canChi;
  if (cc !== CAN_CHI_HOP_LE) throw new Error(`Quy tắc Vận năm chỉ hợp lệ cho năm ${CAN_CHI_HOP_LE}, không phải ${cc}.`);
}

function ghepBai(ls: LaSo, namXem: number) {
  const ln = luuNien(ls, namXem, true);
  const n: Ngu = { ls: moRong(ls, ln), ln, chiNamSinh: ls.canChi.nam.split(' ')[1], canNamSinh: ls.canChi.nam.split(' ')[0] };
  const cungN = (chi: number) => n.ls.cung[chi];

  // Mọi đoạn khớp của các lớp (trừ tháng).
  const tatCa: Khop[] = [];
  for (const q0 of QUY_TAC) {
    if (q0.lop === 'thang') continue;
    const q = quyTacTheoTuoi(q0, ln.tuoiMu);
    for (const g of cungGocCua(n, q)) {
      const sao = khopQuyTacNam(n, g, q);
      if (sao !== null) tatCa.push({ q, text: dien(q, sao, g), sao, cung: g });
    }
  }
  // Chính tinh tại cung Lưu Thái Tuế và cung tiểu hạn (bộ VAN-CT đổi chữ sang "năm nay").
  const chinhTinh = [
    ...chinhTinhCuaCung(n, cungN(ln.luuThaiTue), 'Lưu Thái Tuế', 'thai-tue'),
    ...(ln.tieuHan == null ? [] : chinhTinhCuaCung(n, cungN(ln.tieuHan), 'tiểu hạn', 'tieu-han')),
  ];
  // Bối cảnh 10 năm: cung đại vận đang đi (bộ VAN-CUNG, giữ nguyên chữ vì đây đúng là chuyện 10 năm).
  const dv = ln.daiVan == null ? null : cungN(ln.daiVan);
  const boiCanhVan: Khop[] = dv
    ? QUY_TAC_VAN_10.filter((q) => /^VAN-CUNG-\d+$/.test(q.id) && q.cungVan === dv.ten).map((q) => ({ q: { ...q, cung: dv.ten }, text: q.noiDung, sao: [], cung: dv, phan: 'boi-canh' }))
    : [];
  const phanCua = (k: Khop) => k.phan ?? k.q.phan;
  const tongQuan = [...tatCa, ...chinhTinh, ...boiCanhVan].filter((k) => k.q.muc === 'tong-quan' || k.phan);

  const muc: BaiVanNam['muc'] = [];
  // 1. Tổng quan: theo thứ tự phan, mỗi phan cắt theo ưu tiên; NAM-TT-06 tối đa một câu cả bài.
  const phanRa: NhanDinhNam[] = [];
  let daTo = false;
  for (const phan of PHAN_TONG_QUAN) {
    let ds = tongQuan.filter((k) => phanCua(k) === phan);
    ds = [...ds.filter(laNen), ...ds.filter((k) => !laNen(k)).sort(xepHang)];
    ds = ds.filter((k) => {
      if (k.q.id !== 'NAM-TT-06') return true;
      if (daTo) return false;
      daTo = true;
      return true;
    });
    // Đoạn theo bảng Tứ hóa can năm sinh (NAM-HOA-08-*) luôn giữ, không tính vào giới hạn của phần.
    if (TOI_DA[phan]) { const rieng = ds.filter((k) => /^NAM-HOA-08-/.test(k.q.id)); ds = [...rieng, ...ds.filter((k) => !rieng.includes(k)).slice(0, TOI_DA[phan])]; }
    phanRa.push(...gom(ds, phan));
  }
  phanRa.push(...gom([tomLai(n)], 'tom-lai'));
  muc.push({ id: 'tong-quan', tieuDe: TEN_MUC['tong-quan'], nhanDinh: phanRa });

  // 2. Bốn mảng: nền (bộ 12 cung) + năm nay + gợi ý.
  const dichNen: Record<string, 'quan-loc' | 'phu-the' | undefined> = { 'su-nghiep': 'quan-loc', 'tinh-cam': 'phu-the' };
  for (const m of MANG) {
    const g = cungTheoTen(n.ls, m.cung);
    const lienQuan = new Set([g.ten, cungN((g.chi + 6) % 12).ten]);
    const rieng3 = new Set([g.ten]); // yếu tố năm của lớp tổng quan chỉ lấy tại chính cung của mảng
    if (m.id === 'su-nghiep' && [ln.tieuHan, ln.luuThaiTue].some((x) => x != null && n.ls.cung[x].ten === 'Phụ Mẫu')) { lienQuan.add('Phụ Mẫu'); rieng3.add('Phụ Mẫu'); }
    const rieng = tatCa.filter((k) => k.q.muc === m.id && !(k.q.cung === '*' && !lienQuan.has(k.cung.ten)));
    const goiY = rieng.filter((k) => k.q.phan === 'goi-y' || /-NHIP$/.test(k.q.id));
    const namNayRieng = rieng.filter((k) => !goiY.includes(k)).sort(xepHang);
    // Yếu tố năm tại cung của mảng (và xung chiếu) lấy từ lớp tổng quan, không lặp đoạn đã có.
    const tuTongQuan = tatCa.filter((k) => k.q.muc === 'tong-quan' && k.q.lop === 'cung-goc' && rieng3.has(k.cung.ten)).sort(xepHang);
    // Cung của mảng chính là Lưu Thái Tuế / tiểu hạn: câu chủ đề của lớp đó (NAM-TT-01, NAM-TH-01).
    const lopCung = tatCa.filter((k) => laNen(k) && k.cung.ten === g.ten);
    // Cung của mảng là Lưu Thái Tuế / tiểu hạn: kéo thêm đoạn của lớp đó tại cung này (NAM-TT-02, VAN-CT-*...), trừ câu dẫn đã có ở lopCung.
    const lopNam: (Lop | null)[] = [ln.luuThaiTue === g.chi ? 'thai-tue' : null, ln.tieuHan === g.chi ? 'tieu-han' : null];
    const theoLop = tatCa.filter((k) => !laNen(k) && k.cung.ten === g.ten && lopNam.includes(k.q.lop)).sort(xepHang);
    let namNay = [...new Map([...namNayRieng, ...lopCung, ...tuTongQuan, ...theoLop].map((k) => [k.q.id + '|' + k.cung.ten, k])).values()].slice(0, TOI_DA_NAM_NAY);
    if (!namNay.length) {
      // Không có yếu tố nào chạm trực tiếp: dùng câu NAM-MANG-01 (nền của lá số, giữ nhịp đều).
      const q = QUY_TAC.find((x) => /^NAM-MANG-01-.+-NEN$/.test(x.id) && x.muc === m.id && x.cung === g.ten);
      if (q) namNay = [{ q, text: dien(q, [], g), sao: [], cung: g }];
    }
    const nen: NhanDinhNam[] = [];
    muc.push({ id: m.id, tieuDe: TEN_MUC[m.id], nhanDinh: [...nen, ...gom(namNay, 'nam-nay'), ...gom(goiY, 'goi-y')] });
  }

  // 3. Mười hai tháng.
  const ngay = NGAY_THANG[namXem];
  const thang: ThangNam[] = ln.luuNguyet.map((chi, i) => {
    const c = cungN(chi);
    const chuDe = QUY_TAC.filter((q) => q.lop === 'thang').flatMap((q) => {
      const sao = khopQuyTacNam(n, c, q);
      return sao === null ? [] : [{ q, text: dien(q, sao, c), sao, cung: c } as Khop];
    });
    // Một điểm từ sao lưu / lưu hóa tại cung tháng (ưu tiên hóa rồi sao lưu, không dùng câu tô thêm NAM-TT-06).
    const ungVien = tatCa.filter((k) => k.cung.chi === chi && k.q.lop === 'cung-goc' && k.q.id !== 'NAM-TT-06' && k.q.muc !== 'su-nghiep' && !/-NHIP$/.test(k.q.id) && !/-NEN$/.test(k.q.id)).sort(xepHang);
    // Tháng có cả Hóa Quyền và Hóa Kỵ: nêu cả hai (bản trả phí), không bỏ sót Kỵ như khi chỉ lấy một điểm.
    const quyen = ungVien.find((k) => /^NAM-HOA-QUYEN/.test(k.q.id)), ky = ungVien.find((k) => /^NAM-HOA-KY/.test(k.q.id));
    const diem = (quyen && ky ? [quyen, ky] : ungVien.slice(0, 1)).map((k) => ({ ...k, text: dien(k.q, k.sao, k.cung, true) }));
    const tt = cauTuanTriet(n, c);
    // Câu nền của cung tháng (cùng một câu ở xem trước và bài trả phí).
    const nenC = nenCungThang(c, n.ls.cung[(chi + 6) % 12], ln.luuTuHoa, ln.saoLuu);
    const nenNd = nhanDinh({
      q: { id: 'NAM-THANG-05-NEN-CUNG', chuyenDe: 'van-nam', lop: 'thang', cung: c.ten, loai: 'YN', muc: 'tong-quan', phan: 'thang', dieuKien: [], noiDung: nenC.text, truongPhai: 'Tam hợp phái Việt', maNghienCuu: [], nguon: NGUON_NEN_CUNG } as QuyTacNam,
      text: nenC.text, sao: nenC.sao, cung: c,
    } as Khop);
    return { thang: i + 1, tuNgay: ngay.thang[i], cung: c.ten, thangMoc: thangMoc(n, c), nhanDinh: [...gom([...chuDe.slice(0, 1), ...diem, ...(tt ? [tt] : [])]), ...(nenNd ? [nenNd] : [])] };
  });

  const dauBai = {
    tuNgay: ngay.thang[0], denNgay: ngay.het,
    nhanDinh: gom(tatCa.filter((k) => k.q.muc === 'dau-bai'), 'dau-bai'),
  };
  return { ln, tatCa, muc, thang, dauBai, n };
}


// ---------------------------------------------------------------- bốn phần của đoạn trả phí (khung-doan-tra-phi.md)

const SO_CHU_TOI_DA_CAN_CU = 35;
/** Chủ đề của đoạn tổng quan theo cung nó rơi vào (khung mục 2.1); bốn mảng dùng chủ đề của mảng. */
const CHU_DE_THEO_CUNG: Record<string, string[]> = {
  'Mệnh': ['cong-viec', 'hoc-tap', 'tinh-cam', 'gia-dao'], 'Thiên Di': ['cong-viec', 'hoc-tap'],
  'Quan Lộc': ['cong-viec', 'hoc-tap'], 'Nô Bộc': ['cong-viec'], 'Tài Bạch': ['tai-chinh'],
  'Phu Thê': ['tinh-cam'], 'Tật Ách': ['suc-khoe'], 'Phúc Đức': ['suc-khoe', 'gia-dao'],
  'Phụ Mẫu': ['gia-dao', 'cong-viec', 'hoc-tap'], 'Huynh Đệ': ['gia-dao', 'tai-chinh'],
  'Điền Trạch': ['gia-dao'], 'Tử Tức': ['gia-dao', 'cong-viec', 'hoc-tap'],
};
const CHU_DE_THEO_MANG: Record<string, string[]> = {
  'su-nghiep': ['cong-viec', 'hoc-tap'], 'tai-chinh': ['tai-chinh'], 'tinh-cam': ['tinh-cam'], 'suc-khoe': ['suc-khoe'],
};
const NGUOI_THEO_CUNG: Record<string, string> = {
  'Phụ Mẫu': 'cha mẹ hoặc cấp trên', 'Huynh Đệ': 'anh chị em', 'Phu Thê': 'người đồng hành', 'Tử Tức': 'con cái',
  'Nô Bộc': 'bạn bè, đồng nghiệp', 'Điền Trạch': 'người trong nhà', 'Phúc Đức': 'người thân',
};
const NGUOI_THEO_CHU_DE: Record<string, string> = {
  'cong-viec': 'cấp trên hoặc đồng nghiệp', 'tinh-cam': 'người đồng hành', 'gia-dao': 'người thân trong nhà',
};
/** Câu dẫn/khung: mã phương pháp, không phải một điểm trên lá số nên không đòi đủ 4 phần. */
const LA_CAU_DAN = /^(NAM-(TT|TH)-01|NAM-PP-|NAM-MANG-01-)/;
const TEN_NGAN_SACH: [string, string][] = [
  ['Nghiệm Lý', 'Nghiệm Lý'], ['Tân Biên', 'Tân Biên'], ['Toàn Thư', 'Toàn Thư'], ['Khảo Luận', 'Khảo Luận'],
  ['Trung Châu', 'Trung Châu'], ['Đặc tả an sao', 'Đặc tả an sao xemtuvi.vn'], ['Tư liệu web', 'Tư liệu tham khảo trực tuyến'],
];
const soChu = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Thứ tự ưu tiên CHUNG-PP-10 áp cho mã bám: chính tinh > cách cục > Tứ hóa > sát/cát tinh, sao lưu > mảng > ý nghĩa cung. */
function bacMa(ma: string): number {
  if (/-CC-|^NAM-TH-04/.test(ma)) return 1;
  if (/-HOA-|^NAM-TH-03/.test(ma)) return 2;
  if (/-SP-|^NAM-LUU|^NAM-TT-0[2-6]/.test(ma)) return 3;
  if (/^NAM-MANG/.test(ma)) return 4;
  if (/-YN-/.test(ma)) return 5;
  return 0;
}

function dieuKienViecDung(n: Ngu, nd: NhanDinhNam, c: Cung, dk?: DieuKienViec): boolean {
  if (!dk) return true;
  if (dk.quyTacId && !dk.quyTacId.includes(nd.thamChieu.quyTacId)) return false;
  if (dk.cung && !dk.cung.includes(c.ten)) return false;
  const ds = saoCua(c);
  if (dk.saoTrongCung) {
    const co = (tok: string) => {
      const [loai, ten = ''] = tok.split(':');
      return ds.some((x) => (loai === 'hoa' ? x.hoa === ten : loai === 'luuHoa' ? x.ten === `@${ten}` : x.ten === tok));
    };
    if (!dk.saoTrongCung.every((nhom) => nhom.some(co))) return false;
  }
  if (dk.khongSaoTrongCung) {
    const co = (tok: string) => { const [loai, ten = ''] = tok.split(':'); return ds.some((x) => (loai === 'hoa' ? x.hoa === ten : x.ten === tok)); };
    if (dk.khongSaoTrongCung.some(co)) return false;
  }
  if (dk.catTinhTamPhuong !== undefined && (catTinhTamPhuong(n.ls).length > 0) !== dk.catTinhTamPhuong) return false;
  if (dk.saoKhopHoaGoc) {
    const goc = nd.thamChieu.sao.some((ten) => n.ls.cung.some((cc) => saoCua(cc).some((x) => x.ten === ten && x.hoa === dk.saoKhopHoaGoc)));
    if (!goc) return false;
  }
  return true;
}

function dienViec(m: MauViec, nd: NhanDinhNam, c: Cung, chuDe: string): string[] {
  const nguoi = NGUOI_THEO_CUNG[c.ten] && chuDe !== 'cong-viec' ? NGUOI_THEO_CUNG[c.ten] : NGUOI_THEO_CHU_DE[chuDe] ?? 'người thân';
  return [m.cau, m.thuocDo].map((t) => t.replaceAll('{nguoiLienQuan}', nguoi).replace(/\{([^}]+)\}/g, '$1'));
}

/** Chọn mẫu việc (phần d): chủ đề đúng, mã bám ∩ mã nghiên cứu của đoạn, điều kiện/vế đúng trên lá số, mỗi mẫu một lần mỗi bài. */
function chonViec(n: Ngu, nd: NhanDinhNam, mucId: string, daDung: Set<string>): { m: MauViec; ma: string; chuDe: string } | null {
  const c = cungTheoTen(n.ls, nd.thamChieu.cung);
  const tap = new Set([nd.thamChieu.quyTacId, ...(nd.thamChieu.maNghienCuu ?? [])]);
  const chuDe = mucId === 'tong-quan'
    ? [...(CHU_DE_THEO_CUNG[c.ten] ?? []), ...(/^NAM-TH-04/.test(nd.thamChieu.quyTacId) ? ['hoc-tap'] : [])]
    : CHU_DE_THEO_MANG[mucId] ?? [];
  const tuoi = n.ln.namXem - n.ls.duong.nam;
  const uuHocTap = tuoi < 18 && mucId === 'su-nghiep'; // dưới 18: Sự nghiệp ưu tiên chủ đề học tập
  let tot: { m: MauViec; ma: string; bac: number; thu: number; hocTap: number } | null = null;
  MAU_VIEC.forEach((m, thu) => {
    if (daDung.has(m.maMau) || !chuDe.includes(m.chuDe) || (m.tuoiTu !== undefined && tuoi < m.tuoiTu)) return;
    const hocTap = uuHocTap && m.chuDe !== 'hoc-tap' ? 1 : 0;
    for (const ma of m.maHuong) {
      if (!tap.has(ma.split('/')[0]) || !dieuKienViecDung(n, nd, c, m.dieuKien?.[ma])) continue;
      const bac = bacMa(ma);
      if (!tot || hocTap < tot.hocTap || (hocTap === tot.hocTap && (bac < tot.bac || (bac === tot.bac && thu < tot.thu)))) tot = { m, ma, bac, thu, hocTap };
    }
  });
  const t = tot as { m: MauViec; ma: string } | null;
  return t ? { m: t.m, ma: t.ma, chuDe: t.m.chuDe } : null;
}

/** (a) Một dòng căn cứ từ yếu tố đã khớp: cung và chi, vai trò năm, sao + độ sáng, hóa gốc, lưu hóa. */
function canCuDong(n: Ngu, nd: NhanDinhNam): string {
  const g = cungTheoTen(n.ls, nd.thamChieu.cung);
  const vai = nd.phan === 'thai-tue' ? ', cung Lưu Thái Tuế (trọng điểm năm)' : nd.phan === 'tieu-han' ? ', cung tiểu hạn (việc riêng của năm)' : '';
  const dau = `Cung ${g.ten} (${g.tenChi})${vai}`;
  const parts: string[] = [];
  const thay = new Set<string>();
  for (const ten of nd.thamChieu.sao) {
    if (thay.has(ten)) continue;
    thay.add(ten);
    const luu = ten.startsWith('L. ');
    const c = n.ls.cung.find((x) => saoCua(x).some((y) => y.ten === ten));
    const sao = c?.chinhTinh.concat(c.catTinh, c.hungTinh, c.phuTinh).find((y) => y.ten === ten);
    if (!c || !sao) { parts.push(luu ? `${ten.slice(3)} của năm` : ten); continue; }
    let t = luu ? `${ten.slice(3)} của năm` : sao.dacTinhTen ? `${sao.ten} (${sao.dacTinhTen.toLowerCase()})` : sao.ten;
    if (!luu && sao.hoa) t += `, mang ${sao.hoa} gốc`;
    const lh = luu ? undefined : n.ln.luuTuHoa.find((h) => h.sao === ten && h.chi === c.chi);
    if (lh) t += `, nhận ${lh.hoa} của năm`;
    if (c.chi !== g.chi) t += ` ở cung ${c.ten} (${c.tenChi})`;
    parts.push(t);
  }
  if (!parts.length) {
    for (const h of n.ln.luuTuHoa.filter((x) => x.chi === g.chi)) parts.push(`${h.sao} nhận ${h.hoa} của năm`);
    if (!parts.length && !g.chinhTinh.length) parts.push('cung vô chính diệu (không có chính tinh)');
  }
  const dong = () => `${dau}${parts.length ? ': ' + parts.join('; ') : ''}.`;
  while (parts.length > 1 && soChu(dong()) > SO_CHU_TOI_DA_CAN_CU) parts.pop();
  return dong();
}

/** (c) Một dòng "tên sách ngắn · trường phái"; đoạn tổng hợp thêm nhãn nhận xét tổng hợp của xemtuvi.vn. */
function nguonDong(nd: NhanDinhNam): string {
  const sach: string[] = [];
  for (const nguon of nd.thamChieu.nguon.split('; ')) {
    const ten = TEN_NGAN_SACH.find(([khoa]) => nguon.includes(khoa))?.[1];
    if (ten && !sach.includes(ten)) sach.push(ten);
  }
  const tongHop = !!nd.thamChieu.tongHop || nd.thamChieu.truongPhai === 'tổng hợp';
  const phai = nd.thamChieu.truongPhai === 'tổng hợp' ? 'Tam hợp phái Việt' : nd.thamChieu.truongPhai;
  return [sach.slice(0, 3).join(', ') || 'Đặc tả an sao xemtuvi.vn', phai, ...(tongHop ? ['nhận xét tổng hợp của xemtuvi.vn'] : [])].join(' · ');
}

/**
 * Gắn đủ 4 phần cho từng đoạn của các mục (tổng quan, bốn mảng). Đoạn thiếu (a) hoặc (d) bị loại khỏi bản trả phí và
 * ghi vào danh sách chờ; câu dẫn/khung (mã phương pháp) giữ nguyên, đánh dấu cauDan.
 */
function lamGiauMuc(n: Ngu, muc: BaiVanNam['muc']): { muc: BaiVanNam['muc']; doanCho: DoanCho[] } {
  const daDung = new Set<string>();
  const doanCho: DoanCho[] = [];
  const ra = muc.map((m) => ({
    ...m,
    nhanDinh: m.nhanDinh.flatMap((nd): NhanDinhNam[] => {
      const id = nd.thamChieu.quyTacId;
      const maNC = nd.thamChieu.maNghienCuu ?? maNghienCuuCua(id);
      const dayDu: NhanDinhNam = { ...nd, thamChieu: { ...nd.thamChieu, maNghienCuu: maNC } };
      const chon = chonViec(n, dayDu, m.id, daDung);
      const ghi = [id, ...maNC].map((k) => GHI_CHU_PHAI[k]).find(Boolean);
      if (!chon) {
        if (LA_CAU_DAN.test(id) || dayDu.phan === 'boi-canh' || dayDu.phan === 'tom-lai' || dayDu.phan === 'nen') return [{ ...dayDu, cauDan: true, ...(ghi ? { ghiChuTruongPhai: ghi } : {}) }];
        doanCho.push({ quyTacId: id, cung: nd.thamChieu.cung, lyDo: 'thiếu (d): không mẫu việc nào bám mã nghiên cứu của đoạn' });
        return [];
      }
      const canCu = nd.canCu ?? canCuDong(n, dayDu);
      if (!canCu) {
        doanCho.push({ quyTacId: id, cung: nd.thamChieu.cung, lyDo: 'thiếu (a): không dựng được căn cứ' });
        return [];
      }
      daDung.add(chon.m.maMau);
      const [cau, thuocDo] = dienViec(chon.m, dayDu, cungTheoTen(n.ls, nd.thamChieu.cung), chon.chuDe);
      return [{
        ...dayDu, canCu, nguon: nguonDong(dayDu), ...(ghi ? { ghiChuTruongPhai: ghi } : {}),
        viecNenLam: { maMau: chon.m.maMau, maHuong: chon.ma, cau, thuocDo, thoiHanThang: chon.m.thoiHanThang },
        thamChieu: { ...dayDu.thamChieu, viecBam: `${chon.m.maMau} bám ${chon.ma}` },
      }];
    }),
  }));
  return { muc: ra, doanCho };
}

const GHI_CHU_TRUONG_PHAI =
  'Xemtuvi.vn luận năm theo phái Việt: đọc cả cung Lưu Thái Tuế (trọng điểm năm) lẫn cung tiểu hạn (việc riêng), không xếp lại 12 cung lưu niên như phái Trung Quốc; tháng tính theo Đẩu Quân. Bảng Tứ hóa can Đinh giống nhau giữa các phái.';

/** Ghép bài đầy đủ không qua cache: bài trả phí và danh sách đoạn chờ (thiếu (a) hoặc (d)). */
async function taoBai(ls: LaSo, namXem: number, boQuaCache?: boolean): Promise<{ bai: BaiVanNam; doanCho: DoanCho[] }> {
  const { ln, muc, thang, dauBai, n } = ghepBai(ls, namXem);
  const mucNen = await Promise.all(muc.map(async (m) => {
    const loai = ({ 'su-nghiep': 'quan-loc', 'tinh-cam': 'phu-the' } as Record<string, 'quan-loc' | 'phu-the'>)[m.id];
    if (!loai) return m;
    // Quan Lộc vô chính diệu không còn QL-VCD ở mục phong-cach (nhường KHUNG-quan-loc-VCD-chinh*): lấy thẳng QL-VCD (nenVcd).
    const nen = (await sinhLuanGiai(ls, loai, { boQuaCache })).muc.find((x) => x.id === 'phong-cach')?.nhanDinh[0] ?? (loai === 'quan-loc' ? nenVcd(ls) : undefined);
    // Đoạn nền độ sáng Hãm: câu đầu còn tả như sao sáng (Đ5), nên không chèn làm câu dẫn; mảng giữ nhận định năm.
    if (nen && /-HAM$/.test(nen.thamChieu.quyTacId ?? '')) return m;
    if (nen && m.id === 'su-nghiep' && m.nhanDinh.every((x) => x.phan !== 'nam-nay' || /^NAM-MANG-01-/.test(x.thamChieu.quyTacId))) {
      const r = nenQuanLoc(ls, namXem, { quyTacId: nen.thamChieu.quyTacId, text: nen.text, nguon: nen.thamChieu.nguon });
      if (r) {
        const dan = m.nhanDinh.filter((x) => x.phan === 'nam-nay'), con = m.nhanDinh.filter((x) => x.phan !== 'nam-nay');
        return { ...m, nhanDinh: [...dan, { text: r.text, phan: 'nen', canCu: r.canCu, thamChieu: { quyTacId: nen.thamChieu.quyTacId, sao: nen.thamChieu.sao, cung: 'Quan Lộc', nguon: r.nguon, truongPhai: nen.thamChieu.truongPhai, maNghienCuu: r.maNghienCuu } }, ...con] };
      }
    }
    return nen ? { ...m, nhanDinh: [{ text: nen.text, phan: 'nen', thamChieu: { quyTacId: nen.thamChieu.quyTacId, sao: nen.thamChieu.sao, cung: nen.thamChieu.cung, nguon: nen.thamChieu.nguon, truongPhai: nen.thamChieu.truongPhai } }, ...m.nhanDinh] } : m;
  }));
  const { muc: mucDu, doanCho } = lamGiauMuc(n, mucNen);
  if (doanCho.length && process.env.VAN_NAM_LOG) console.info(`[van-nam] ${doanCho.length} đoạn chờ (thiếu (a)/(d)):`, doanCho.map((d) => `${d.quyTacId}@${d.cung}`).join(', '));
  const bai: BaiVanNam = {
    chuyenDe: MA_VAN_NAM, namXem, canChi: ln.canChi, tuoiMu: ln.tuoiMu, dauBai, muc: mucDu, thang,
    ghiChuTruongPhai: GHI_CHU_TRUONG_PHAI, ghiChu: GHI_CHU, phienBan: PHIEN_BAN_VAN_NAM,
  };
  return { bai, doanCho };
}

/** Danh sách đoạn chờ của một lá số (không dùng cache): đoạn thiếu (a) hoặc (d) không được xuất ra bản trả phí. */
export async function doanChoVanNam(ls: LaSo, tuyChon: { namXem?: number } = {}): Promise<DoanCho[]> {
  const namXem = tuyChon.namXem ?? NAM_HOP_LE;
  kiemTraNamXem(namXem, ls);
  return (await taoBai(ls, namXem, true)).doanCho;
}

/** Bài Vận năm đầy đủ (gói trả phí). Cache theo lá số + năm xem. Năm khác 2027 (Đinh Mùi) bị từ chối. */
export async function sinhVanNam(ls: LaSo, tuyChon: { namXem?: number; boQuaCache?: boolean } = {}): Promise<BaiVanNam> {
  const namXem = tuyChon.namXem ?? NAM_HOP_LE;
  kiemTraNamXem(namXem, ls);
  const khoa = khoaCache(ls, `${MA_VAN_NAM}@${namXem}`, PHIEN_BAN_VAN_NAM);
  if (!tuyChon.boQuaCache) {
    const co = doc<BaiVanNam>(khoa);
    if (co) return co;
  }
  const { bai } = await taoBai(ls, namXem, tuyChon.boQuaCache);
  if (!tuyChon.boQuaCache) ghi(khoa, bai);
  return bai;
}

/** Điểm thuận ưu tiên cho bản xem trước (NAM-CAM-03: không dùng câu gây lo để kéo mua). */
const DIEM_THUAN = ['NAM-HOA-LOC-SANG', 'NAM-HOA-KHOA-SANG', 'NAM-HOA-QUYEN-SANG', 'NAM-TH-04', 'NAM-TH-04-TT', 'NAM-LUU-03', 'NAM-LUU-04', 'NAM-LUU-05-PHU', 'NAM-LUU-01', 'NAM-TH-03-LOC', 'NAM-TH-03-KHOA', 'NAM-TH-03-QUYEN'];

export interface UngVienThangMau { thang: number; thangMoc: boolean; coKy: boolean; cau: string[]; coTenSao: boolean }
/**
 * Chọn tháng mẫu cho bản xem trước. Bậc ưu tiên: không Hóa Kỵ, lưu hoặc gốc tại cung tháng (NAM-CAM-03) > nhiều câu hơn (4 điểm mỗi câu) > có câu nêu tên sao > tháng mốc;
 * hòa bậc thì nhiều câu hơn, rồi tháng sớm hơn. Không tháng nào đạt cả thì lấy tháng tốt nhất còn lại;
 * null chỉ khi mọi tháng đều không có câu.
 */
export function chonThangMau<T extends UngVienThangMau>(ds: T[]): T | null {
  const diem = (x: T) => (x.coKy ? 0 : 100) + x.cau.length * 4 + (x.coTenSao ? 2 : 0) + (x.thangMoc ? 1 : 0);
  return ds.filter((x) => x.cau.length > 0).reduce<T | null>((tot, x) => (tot === null || diem(x) > diem(tot) || (diem(x) === diem(tot) && x.cau.length > tot.cau.length) ? x : tot), null);
}

/** Bản xem trước miễn phí: đầu bài + trọng điểm Lưu Thái Tuế + một điểm thuận + tên 12 cung tháng, không nội dung tháng, không mã quy tắc. */
export function xemTruocVanNam(ls: LaSo, tuyChon: { namXem?: number } = {}): XemTruocVanNam {
  const namXem = tuyChon.namXem ?? NAM_HOP_LE;
  kiemTraNamXem(namXem, ls);
  const { ln, tatCa, thang, dauBai, n } = ghepBai(ls, namXem);
  const locCau = (ds: string[]) => ds.flatMap((x) => { const t = locTuCam(x, TU_CAM); return t ? [t] : []; });
  const van = (k: Khop[]) => locCau(k.map((x) => x.text));
  const thaiTue = tatCa.filter((k) => k.q.lop === 'thai-tue' && /^NAM-TT-01-/.test(k.q.id));
  const ungVien = thang.map((t) => {
    const cau = t.nhanDinh.flatMap((x) => { const c = locCau([x.text])[0]; return c ? [{ c, sao: x.thamChieu.sao.map((s) => s.replace(/^L\. /, '')) }] : []; });
    const chi = ln.luuNguyet[t.thang - 1], cg = n.ls.cung[chi];
    const coKy = ln.luuTuHoa.some((h) => h.hoa === 'Hóa Kỵ' && chi === h.chi) || coKyGocTaiCung(cg);
    const dsCau = cau.map((x) => x.c);
    return { thang: t.thang, thangMoc: t.thangMoc, coKy, cau: dsCau, coTenSao: cau.some((x) => x.sao.some((s) => x.c.includes(s))), goc: t };
  });
  const chon = chonThangMau(ungVien);
  const tm = chon ? { t: chon.goc, cau: chon.cau } : null;
  const thuan = DIEM_THUAN.flatMap((id) => tatCa.filter((k) => k.q.id === id))[0];
  return {
    chuyenDe: MA_VAN_NAM, namXem, canChi: ln.canChi,
    dauBai: { tuNgay: dauBai.tuNgay, denNgay: dauBai.denNgay, cau: dauBai.nhanDinh.map((x) => x.text) },
    thaiTue: van(thaiTue),
    diemThuan: thuan ? van([thuan])[0] ?? null : null,
    cungThang: thang.map((t) => ({ thang: t.thang, cung: t.cung })),
    thangMau: tm ? { thang: tm.t.thang, tuNgay: tm.t.tuNgay, cung: tm.t.cung, thangMoc: tm.t.thangMoc, cau: tm.cau } : null,
    ghiChu: GHI_CHU, phienBan: PHIEN_BAN_VAN_NAM,
  };
}
