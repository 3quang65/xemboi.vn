import type { LaSo, Sao } from '@/lib/tuvi';
import { chonDoanMenh, type DoanLuan } from './chon-doan';
import { chonDoanMau, type DoanMau } from './doan-mau';
import duLieu from './menh-chinh-tinh.json';
import boCau from './tom-tat-mien-phi.json';

export interface TomTatMienPhi {
  banMenh: string; // nạp âm
  cuc: string;
  chinhTinhMenh: { ten: string; dacTinhTen: string | null }[];
  voChinhDieu: boolean;
  /** Cung chính tinh được mượn khi Mệnh vô chính diệu (xung chiếu) */
  chinhTinhXungChieu: string[];
  thanCu: string; // tên cung có Thân
  doan: DoanLuan[];
  /** Các nhận định riêng của lá số, theo thứ tự hiện cho khách (bộ câu tom-tat-mien-phi.json). */
  cau: CauTomTat[];
  /** Câu dẫn sang bản chuyên sâu, nêu sao tam hợp của chính lá số. */
  dan: string;
  /** Ghi chú cuối: hệ thống chọn câu theo những sao nào. */
  ghiChu: string;
}

export interface CauTomTat {
  loai: 'cachCuc' | 'chinhTinh' | 'voChinhDieu' | 'tuHoa' | 'tuanTriet' | 'phuTinh' | 'thanCu';
  /** Phần nêu sao/cung của lá số, in đậm trước nhận định, ví dụ "Thái Dương (Vượng) thủ Mệnh tại Mão" */
  nhan: string;
  y: string;
  nguon: string[];
}

type Muc = { y: string; nguon: string[]; treEm?: string };
type CachCuc = Muc & { ten: string; can: string[]; chi?: string[]; dieuKienPha?: string[]; pha?: Muc };
const BO = boCau as unknown as {
  chinhTinh: Record<string, Record<string, Muc>>;
  thanCu: Record<string, Muc & { kem?: Muc }>;
  tuHoa: Record<string, Muc & { gapKhongKiep?: Muc }>;
  tuanTriet: Record<string, { sang: Muc; ham: Muc }>;
  phuTinh: Record<string, Muc & { H?: Muc }>;
  voChinhDieu: Muc & { xungTuanTriet?: Muc };
  cachCuc?: CachCuc[];
};
/** Tối đa số câu điểm nhấn (Tuần/Triệt, Tứ hóa, sao phụ) để tóm tắt vẫn ngắn. */
const TOI_DA_DIEM_NHAN = 3;
/** Dưới tuổi này dùng câu viết cho cha mẹ đọc về bé (trường treEm). */
const TUOI_TRE_EM = 15;
const SAT_TINH = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];

const lietKe = (ds: string[]) => (ds.length > 1 ? `${ds.slice(0, -1).join(', ')} và ${ds[ds.length - 1]}` : ds[0] ?? '');
const nhanSao = (s: Sao) => {
  const kem = [s.dacTinhTen, s.hoa].filter(Boolean);
  return kem.length ? `${s.ten} (${kem.join(', ')})` : s.ten;
};
const yeu = (s: Sao) => s.dacTinh === 'B' || s.dacTinh === 'H';

function cauCuaLaSo(ls: LaSo, namXem = new Date().getFullYear()): { cau: CauTomTat[]; dan: string; ghiChu: string } {
  const tre = namXem - ls.duong.nam < TUOI_TRE_EM;
  const lay = (m: Muc) => (tre && m.treEm ? m.treEm : m.y);
  const theoTen = (ten: string) => ls.cung.find((c) => c.ten === ten)!;
  const menh = theoTen('Mệnh');
  const xung = ls.cung[(menh.chi + 6) % 12];
  const saoMenh = [...menh.chinhTinh, ...menh.catTinh, ...menh.hungTinh, ...menh.phuTinh];
  const tim = (ten: string) => saoMenh.find((x) => x.ten === ten);
  const cau: CauTomTat[] = [];
  const them = (loai: CauTomTat['loai'], nhan: string, m: Muc, thay: Record<string, string> = {}) => {
    let y = lay(m);
    for (const [k, v] of Object.entries(thay)) y = y.split(`{${k}}`).join(v);
    cau.push({ loai, nhan, y, nguon: m.nguon });
  };

  // Cách cục tại Mệnh (cặp chính tinh đồng cung, Thạch trung ẩn ngọc, Hỏa Tham…): thay câu rời của các sao trong cách.
  const dieuKien = (tk: string) => {
    if (tk === 'Tuần') return menh.tuan;
    if (tk === 'Triệt') return menh.triet;
    const [loai, ten] = tk.includes(':') ? tk.split(':') : ['', tk];
    const s = tim(ten);
    if (loai === 'ham') return !!s && yeu(s);
    if (loai === 'khongMieuVuong') return !!s && s.dacTinh !== 'M' && s.dacTinh !== 'V';
    return !!s || saoMenh.some((x) => x.hoa === ten);
  };
  const cc = (BO.cachCuc ?? []).find((c) => c.can.every((t) => tim(t)) && (!c.chi || c.chi.includes(menh.tenChi)));
  const daNoi = new Set(cc?.can ?? []);
  if (cc) {
    const pha = !!cc.pha && (cc.dieuKienPha ?? []).some(dieuKien);
    them('cachCuc', `${cc.ten}${pha ? ' (phá cách)' : ''} tại Mệnh ${menh.tenChi}: ${lietKe(cc.can.map((t) => nhanSao(tim(t)!)))}`, pha ? cc.pha! : cc);
  }

  if (menh.chinhTinh.length === 0) {
    const saoXung = xung.chinhTinh.length ? lietKe(xung.chinhTinh.map((s) => s.ten)) : 'các chính tinh ở tam hợp';
    const m = (xung.tuan || xung.triet) && BO.voChinhDieu.xungTuanTriet ? BO.voChinhDieu.xungTuanTriet : BO.voChinhDieu;
    them('voChinhDieu', `Mệnh vô chính diệu tại ${menh.tenChi}`, m, { saoXung });
    // Luận mượn chính tinh cung xung chiếu (lực yếu hơn tọa thủ, đã nói trong câu trên).
    const tt = [xung.tuan && 'Tuần', xung.triet && 'Triệt'].filter(Boolean).join(', ');
    for (const s of xung.chinhTinh.slice(0, 2)) {
      const m2 = BO.chinhTinh[s.ten]?.[s.dacTinh ?? 'B'];
      if (m2) them('chinhTinh', `Mượn ${nhanSao(s)} từ Thiên Di tại ${xung.tenChi}${tt ? ` (có ${tt})` : ''}`, m2);
    }
  }
  for (const s of menh.chinhTinh.slice(0, 2)) {
    const m = BO.chinhTinh[s.ten]?.[s.dacTinh ?? 'B'];
    if (m && !daNoi.has(s.ten)) them('chinhTinh', `${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''} thủ Mệnh tại ${menh.tenChi}`, m);
  }

  let conLai = TOI_DA_DIEM_NHAN;
  // Tuần/Triệt đặt ngay sau câu sao, nêu tên sao bị ảnh hưởng để không trái chiều với câu trên.
  for (const [co, ten] of [[menh.tuan, 'Tuần'], [menh.triet, 'Triệt']] as const) {
    const bien = BO.tuanTriet[ten];
    if (!co || !bien || conLai <= 0) continue;
    const chiu = saoMenh.filter((s) => s.loai === 'chinh' || BO.phuTinh[s.ten] || s.ten.startsWith('Hóa ')).map((s) => s.ten);
    const ham = menh.chinhTinh.some(yeu) || saoMenh.some((s) => SAT_TINH.includes(s.ten));
    const sao = lietKe([...new Set(chiu)]) || 'các sao tại Mệnh';
    const nhan = `${ten} án ngữ Mệnh`;
    const m = ham ? bien.ham : bien.sang;
    them('tuanTriet', lay(m).includes('{sao}') ? nhan : `${nhan} (${sao})`, m, { sao });
    conLai--;
  }
  const coKhongKiep = !!(tim('Địa Không') || tim('Địa Kiếp'));
  for (const s of saoMenh) {
    const m = s.hoa ? BO.tuHoa[s.hoa] : undefined;
    if (!m || conLai <= 0) continue;
    them('tuHoa', `${s.hoa} đi cùng ${s.ten} tại Mệnh`, s.hoa === 'Hóa Lộc' && coKhongKiep && m.gapKhongKiep ? m.gapKhongKiep : m, { sao: s.ten });
    conLai--;
  }
  // Sao phụ theo thứ tự ưu tiên trong bộ câu (sát tinh trước, rồi cát tinh, rồi đào hoa).
  for (const ten of Object.keys(BO.phuTinh)) {
    const s = tim(ten);
    if (!s || daNoi.has(ten) || conLai <= 0) continue;
    const m = BO.phuTinh[ten];
    them('phuTinh', `${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''} đồng cung Mệnh`, s.dacTinh === 'H' && m.H ? m.H : m);
    conLai--;
  }

  const than = ls.cung.find((c) => c.laThan);
  const mThan = than ? BO.thanCu[than.ten] : undefined;
  if (than && mThan) {
    const saoThan = [...than.chinhTinh, ...than.hungTinh];
    const kem = than.ten !== 'Mệnh' && (than.chinhTinh.some((s) => s.dacTinh === 'H') || saoThan.filter((s) => SAT_TINH.includes(s.ten)).length >= 2);
    const nhan = than.ten === 'Mệnh' ? 'Thân cư Mệnh' : `Thân cư ${than.ten}${than.chinhTinh.length ? ` (${lietKe(than.chinhTinh.map(nhanSao))})` : ''}`;
    them('thanCu', nhan, kem && mThan.kem ? mThan.kem : mThan);
  }

  const moTa = (ten: string) => {
    const c = theoTen(ten);
    return c.chinhTinh.length ? `${lietKe(c.chinhTinh.map((s) => s.ten))} ở ${ten}` : `${ten} vô chính diệu`;
  };
  const dan = `Bản chuyên sâu xét tiếp thế tam hợp chiếu về Mệnh: ${moTa('Quan Lộc')}, ${moTa('Tài Bạch')}, ${moTa('Thiên Di')} (xung chiếu), cùng đại vận từng giai đoạn.`;
  // Bỏ phần ngoặc kể cả ngoặc lồng, vd "Thân cư Tài Bạch (Vũ Khúc (Miếu))": bỏ ngoặc trong trước để không sót ')'.
  const boNgoac = (s: string) => { let t = s; while (/ ?\([^()]*\)/.test(t)) t = t.replace(/ ?\([^()]*\)/g, ''); return t; };
  const daXet = [...new Set(cau.map((c) => boNgoac(c.nhan).replace(/^Mượn /, '').replace(/ (thủ|đi cùng|đồng cung|án ngữ|từ|tại).*$/, '')))];
  const ghiChu = `Các câu trên do hệ thống chọn từ bộ quy tắc luận giải theo ${lietKe(daXet)} trong lá số của bạn. Phần tóm tắt chỉ đọc cung Mệnh và cung an Thân, chưa xét đủ thế tam hợp chiếu; diễn biến từng giai đoạn 10 năm xem ở mục Vận 10 năm.`;
  return { cau, dan, ghiChu };
}

export function tomTatMienPhi(ls: LaSo): TomTatMienPhi {
  const menh = ls.cung.find((c) => c.ten === 'Mệnh')!;
  const than = ls.cung.find((c) => c.laThan);
  const { voChinhDieu, doan } = chonDoanMenh(menh.chinhTinh.map((s) => ({ ten: s.ten, dacTinh: s.dacTinh })));
  const xung = ls.cung[(menh.chi + 6) % 12];
  return {
    banMenh: ls.banMenh,
    cuc: ls.cuc,
    chinhTinhMenh: menh.chinhTinh.map((s) => ({ ten: s.ten, dacTinhTen: s.dacTinhTen })),
    voChinhDieu,
    chinhTinhXungChieu: voChinhDieu ? xung.chinhTinh.map((s) => s.ten) : [],
    thanCu: than ? than.ten : '',
    doan,
    ...cauCuaLaSo(ls),
  };
}

/** Bỏ vế điều kiện độ sáng đầu câu ("Miếu ở Dần, Thân (M), …: ") để khách đọc thẳng phần nhận định. */
export function nhanDinh(cau: string): string {
  const i = cau.indexOf(': ');
  return /^(Miếu|Vượng|Đắc|Bình|Hãm)/.test(cau) && i > 0 ? cau.slice(i + 2) : cau;
}

/** Tên chính tinh của một quy tắc (theo mã), để ghi trước đoạn luận. */
export function saoCuaQuyTac(ma: string): string | null {
  for (const [ten, ds] of Object.entries(duLieu.menh)) if (ds.some((r) => r.ma === ma)) return ten;
  return null;
}

export { tachDoanMau, type DoanMau } from './doan-mau';

/** Đoạn mẫu màn chọn gói lấy từ chính lá số (Quan Lộc / Phu Thê); null nếu không có quy tắc khớp. */
export function doanMauCuaLaSo(ls: LaSo): DoanMau | null {
  return chonDoanMau(ls.cung.map((c) => ({ ten: c.ten, chi: c.chi, tenChi: c.tenChi, chinhTinh: c.chinhTinh.map((s) => s.ten) })));
}

/** Đoạn mẫu dự phòng khi lá số không có quy tắc khớp (ví dụ minh họa, không phải lá số của khách). */
export const DOAN_MAU = (duLieu.menh['Thái Âm'] ?? []).find((r) => r.ma === 'MENH-TA-01')!;


/** Các đoạn chữ của phần luận trong tóm tắt miễn phí, đúng thứ tự khách thấy (dùng để đo câu trùng). */
export function vanBanTomTat(t: TomTatMienPhi): string[] {
  return [...t.cau.map((c) => `${c.nhan}: ${c.y}`), t.dan, t.ghiChu];
}
