// Bộ khớp quy tắc luận giải bản 2 (việc L-90ad99): điều kiện máy đọc theo tam phương tứ chính.
// Đặc tả định dạng: docs/luan-giai/quy-tac-v2/DINH-DANG.md. Chưa nối vào sinhLuanGiai (bước 3, Bảo).
import type { Cung, LaSo, Sao } from '@/lib/tuvi';

export type ViTri = 'chinh' | 'xung' | 'tam-hop' | 'tam-phuong' | 'hop-chieu' | 'giap';
export type DoSang = 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm';
/** Yếu tố quyết định mức 3 (thứ tự ưu tiên): sát tinh/Hóa Kỵ hãm tọa thủ, Hóa Kỵ hóa vào sao tạo cách, cộng điểm >= 4. */
export type LyDoPha = 'ham' | 'ky' | 'diem';
export type LoaiQuyTac = 'YN' | 'CT' | 'C' | 'SP' | 'CC' | 'HOA' | 'TUAN' | 'TRIET' | 'VCD';

export interface DieuKien {
  sao?: string[];
  /** Các sao rải trong cả vị trí (không cần cùng một cung). */
  rai?: boolean;
  /** Chỉ cần ít nhất n sao trong `sao` có mặt (rải trong vị trí). */
  toiThieu?: number;
  viTri?: ViTri;
  doSang?: DoSang[];
  hoa?: 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ';
  chi?: string[];
  tuan?: boolean;
  triet?: boolean;
  voChinhDieu?: boolean;
  gioiTinh?: 'Nam' | 'Nữ';
  /** Can năm sinh, vd ["Đinh"]. */
  canNam?: string[];
  /**
   * Mức thành/phá cách theo CHUNG-CC-08 của cung gốc: khớp khi mức >= `tuMuc`. Mức 3 (phá cách): sát tinh hoặc Hóa Kỵ hãm tọa thủ
   * cung chính, hoặc Hóa Kỵ hóa vào một sao tạo cách (`saoCach`), hoặc tổng điểm phá >= 4. Mức 2 (có khuyết): điểm phá > 0.
   * `dacLaTroLuc`: ngoại lệ Sát Phá Tham (TRANH-13), sát tinh đắc địa tính 0 điểm.
   */
  phaCach?: { tuMuc: 2 | 3; saoCach?: string[]; dacLaTroLuc?: boolean; lyDo?: LyDoPha };
  /** Số sát tinh đắc địa tối thiểu trong tam phương (TRANH-13: sát tinh đắc địa nhiều mà thiếu Lộc). */
  satDac?: number;
  /** Cung chứa yếu tố khớp phải có đủ các sao này (vd Hóa Lộc đồng cung Địa Kiếp). T-a4504a vòng 2. */
  cungCoSao?: string[];
  /** Thế giáp: hai cung kề cung gốc, mỗi cung một trong hai hóa này (Khoa–Quyền, CC-10). Mọi giá trị khác của điều kiện bị bỏ qua. */
  giapHoa?: [string, string];
  /** Chỉ khớp cung có đúng tên này (vd Phúc Đức: vô chính diệu nên gặp Tuần, kỵ Triệt). */
  tenCung?: string;
  /** Tính vị trí từ cung có tên này thay vì cung gốc (vd quy tắc đại vận so với chính tinh cung Mệnh: nhân hòa VAN-PP-12). */
  tuCung?: string;
  /** Với `rai`: mọi sao trong `sao` đều có mặt VÀ cùng thuộc các độ sáng này (vd ba sao chủ cách đều Hãm). */
  deuDoSang?: DoSang[];
  /** Với `sao` là chính tinh: chỉ xét sao chủ của cung (chính tinh sáng nhất, bằng nhau thì sao đứng trước). Cung hai nhóm sao theo nhóm của sao chủ. */
  chu?: boolean;
  /** Dùng với `chu`: cung vô chính diệu thì mượn chính tinh cung xung chiếu (như Mệnh vô chính diệu trong nhân hòa VAN-PP-12/14/15). */
  muonXung?: boolean;
  /** Chỉ khớp khi cung gốc (cung vận) có tuổi vào đại vận (`daiVanTu`) từ mức này trở lên, vd 16: tránh câu đi làm, tình cảm, vay mượn ở vận tuổi nhỏ. */
  tuoiVanTuMin?: number;
}

export interface QuyTacV2 {
  id: string;
  chuyenDe: string;
  /** Cung gốc để tính vị trí (thường là cung chính của chuyên đề). */
  cung: string;
  loai: LoaiQuyTac;
  maNghienCuu: string[];
  dieuKien: DieuKien[];
  khong?: DieuKien[];
  cachCuc?: string;
  phaCach?: boolean;
  uuTien?: number;
  muc: string;
  noiDung: string;
  nguon: string[];
  nguonChiTiet?: string;
  truongPhai: string;
  ghiChu?: string;
}

/** Sao của cung, loại trùng theo tên (sát tinh có thể nằm cả hungTinh lẫn phuTinh). */
const saoCua = (c: Cung): Sao[] => {
  const thay = new Set<string>();
  return [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].filter((s) => !thay.has(s.ten) && !!thay.add(s.ten));
};

export function cungTheoViTri(ls: LaSo, goc: Cung, viTri: ViTri = 'chinh'): Cung[] {
  const theoChi = (d: number) => ls.cung.find((c) => c.chi === (goc.chi + d + 12) % 12)!;
  switch (viTri) {
    case 'chinh': return [goc];
    case 'xung': return [theoChi(6)];
    case 'tam-hop': return [theoChi(4), theoChi(8)];
    case 'hop-chieu': return [theoChi(6), theoChi(4), theoChi(8)];
    case 'tam-phuong': return [goc, theoChi(6), theoChi(4), theoChi(8)];
    case 'giap': return [theoChi(-1), theoChi(1)];
  }
}

function cungDat(c: Cung, k: DieuKien, dau?: Sao): boolean {
  if (k.tenCung && c.ten !== k.tenCung) return false;
  if (k.chi && !k.chi.includes(c.tenChi)) return false;
  if (k.tuan !== undefined && c.tuan !== k.tuan) return false;
  if (k.triet !== undefined && c.triet !== k.triet) return false;
  if (k.voChinhDieu !== undefined && (c.chinhTinh.length === 0) !== k.voChinhDieu) return false;
  if (k.cungCoSao && !k.cungCoSao.every((t) => saoCua(c).some((s) => s.ten === t))) return false;
  if (k.doSang && !(dau?.dacTinhTen && k.doSang.includes(dau.dacTinhTen))) return false;
  if (k.hoa) {
    if (dau) { if (dau.hoa !== k.hoa) return false; }
    else if (!saoCua(c).some((s) => s.hoa === k.hoa)) return false;
  }
  return true;
}

const THU_TU_SANG: string[] = ['Miếu', 'Vượng', 'Đắc', 'Bình', 'Hãm'];

/** Chính tinh được xét của cung theo `chu` / `muonXung`: sao chủ (sáng nhất) hoặc cả chính tinh; vô chính diệu + muonXung thì lấy cung xung. */
function chinhTinhXet(ls: LaSo, c: Cung, k: DieuKien): { cung: Cung; sao: Sao[] } {
  const nguon = !c.chinhTinh.length && k.muonXung ? ls.cung.find((x) => x.chi === (c.chi + 6) % 12) ?? c : c;
  if (!k.chu) return { cung: nguon, sao: nguon.chinhTinh };
  const chu = [...nguon.chinhTinh].sort((a, b) => THU_TU_SANG.indexOf(a.dacTinhTen ?? 'Hãm') - THU_TU_SANG.indexOf(b.dacTinhTen ?? 'Hãm'))[0];
  return { cung: nguon, sao: chu ? [chu] : [] };
}

const SAT_TINH = ['Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];
const DAC_DIA = ['Miếu', 'Vượng', 'Đắc'];

const laPha = (s: Sao) => SAT_TINH.includes(s.ten) || s.hoa === 'Hóa Kỵ';
const laSatDac = (s: Sao) => SAT_TINH.includes(s.ten) && !!s.dacTinhTen && DAC_DIA.includes(s.dacTinhTen);

/**
 * Mức theo CC-08 và tên các yếu tố phá. Điểm: yếu tố phá (sát tinh, Không Kiếp, Hóa Kỵ) tọa thủ cung chính tính 2, ở xung chiếu /
 * tam hợp tính 1; Tuần, Triệt chỉ tính khi đóng ở chính cung (không chiếu, CHUNG-TP-04), 2 điểm mỗi yếu tố.
 * Sát tinh đắc địa tính 0 khi `dacLaTroLuc`.
 */
export function mucCachCuc(ls: LaSo, goc: Cung, saoCach: string[] = [], dacLaTroLuc = false): { muc: 1 | 2 | 3; ten: string[]; lyDo?: LyDoPha; tenLyDo: string[] } {
  const tinh = (s: Sao) => laPha(s) && !(dacLaTroLuc && laSatDac(s));
  const ten = new Set<string>();
  let diem = (goc.tuan ? 2 : 0) + (goc.triet ? 2 : 0);
  const tp = cungTheoViTri(ls, goc, 'tam-phuong');
  for (const c of tp) {
    const pha = saoCua(c).filter(tinh);
    pha.forEach((s) => ten.add(s.ten));
    diem += (c === goc ? 2 : 1) * pha.length;
  }
  const ham = saoCua(goc).filter((s) => laPha(s) && s.dacTinhTen === 'Hãm').map((s) => s.ten);
  const ky = tp.flatMap((c) => saoCua(c).filter((s) => saoCach.includes(s.ten) && s.hoa === 'Hóa Kỵ').map((s) => s.ten));
  const lyDo: LyDoPha | undefined = ham.length ? 'ham' : ky.length ? 'ky' : diem >= 4 ? 'diem' : undefined;
  const tenLyDo = lyDo === 'ham' ? ham : lyDo === 'ky' ? ky : lyDo === 'diem' ? [...ten] : [];
  return { muc: lyDo ? 3 : diem > 0 ? 2 : 1, ten: [...ten], lyDo, tenLyDo };
}

/** Thế giáp bởi hai hóa (Khoa–Quyền, CC-10): hai cung kề, mỗi cung mang một hóa. Trả về tên sao mang hóa; null nếu không giáp. */
function giapHoaKhop(ls: LaSo, goc: Cung, hoa: [string, string]): string[] | null {
  const [a, b] = cungTheoViTri(ls, goc, 'giap');
  const lay = (c: Cung, h: string) => saoCua(c).filter((s) => s.hoa === h).map((s) => s.ten);
  const x = [lay(a, hoa[0]), lay(b, hoa[1])];
  const y = [lay(a, hoa[1]), lay(b, hoa[0])];
  const ok = (v: string[][]) => v[0].length > 0 && v[1].length > 0;
  return ok(x) ? [...x[0], ...x[1]] : ok(y) ? [...y[0], ...y[1]] : null;
}

/** Một điều kiện → tên các sao khớp (mảng rỗng nếu điều kiện không đòi sao); null nếu không khớp. */
export function khopDieuKien(ls: LaSo, gocQT: Cung, k: DieuKien): string[] | null {
  const goc = k.tuCung ? ls.cung.find((c) => c.ten === k.tuCung) : gocQT;
  if (!goc) return null;
  if (k.tuoiVanTuMin !== undefined && !(goc.daiVanTu >= k.tuoiVanTuMin)) return null;
  if (k.gioiTinh && ls.gioiTinh !== k.gioiTinh) return null;
  if (k.canNam && !k.canNam.includes(ls.canChi.nam.split(' ')[0])) return null;
  if (k.phaCach) {
    const r = mucCachCuc(ls, goc, k.phaCach.saoCach, k.phaCach.dacLaTroLuc);
    if (r.muc < k.phaCach.tuMuc) return null;
    if (k.phaCach.lyDo) return r.lyDo === k.phaCach.lyDo ? r.tenLyDo : null;
    return r.ten;
  }
  if (k.satDac !== undefined) {
    const n = cungTheoViTri(ls, goc, 'tam-phuong').flatMap((c) => saoCua(c).filter(laSatDac).map((s) => s.ten));
    return n.length >= k.satDac ? n : null;
  }
  if (k.giapHoa) return giapHoaKhop(ls, goc, k.giapHoa);
  const ds = cungTheoViTri(ls, goc, k.viTri);
  const sao = k.sao ?? [];
  if (k.chu || k.muonXung) {
    const co = ds.flatMap((c) => chinhTinhXet(ls, c, k).sao).filter((s) => sao.includes(s.ten) && (!k.doSang || (!!s.dacTinhTen && k.doSang.includes(s.dacTinhTen))));
    if (co.length < (k.toiThieu ?? 1)) return null;
    // cungCoSao tính trên cung nguồn (đã mượn xung nếu vô chính diệu): vd Mệnh Cự Nhật = Cự Môn, Thái Dương đồng cung.
    const dat = (c: Cung) => cungDat(c, { ...k, doSang: undefined, hoa: undefined, cungCoSao: undefined })
      && (!k.cungCoSao || k.cungCoSao.every((t) => saoCua(chinhTinhXet(ls, c, k).cung).some((s) => s.ten === t)));
    return ds.some(dat) ? [...new Set(co.map((s) => s.ten))] : null;
  }
  if (k.rai || k.toiThieu !== undefined) {
    const dungSang = (s: Sao) => !k.doSang || (!!s.dacTinhTen && k.doSang.includes(s.dacTinhTen));
    const co = sao.filter((t) => ds.some((c) => saoCua(c).some((s) => s.ten === t && dungSang(s))));
    if (co.length < (k.toiThieu ?? sao.length)) return null;
    if (k.deuDoSang && !sao.every((t) => ds.some((c) => saoCua(c).some((s) => s.ten === t && s.dacTinhTen && k.deuDoSang!.includes(s.dacTinhTen))))) return null;
    return ds.some((c) => cungDat(c, { ...k, doSang: undefined, hoa: undefined })) ? co : null;
  }
  for (const c of ds) {
    const tat = saoCua(c);
    if (!sao.every((t) => tat.some((s) => s.ten === t))) continue;
    const dau = sao[0] ? tat.find((s) => s.ten === sao[0]) : undefined;
    if (!cungDat(c, k, dau)) continue;
    if (!sao.length && k.hoa) return tat.filter((s) => s.hoa === k.hoa).map((s) => s.ten);
    return [...sao];
  }
  return null;
}

/** Quy tắc khớp lá số → sao khớp (gộp, không trùng); null nếu không khớp. */
export function khopQuyTac(ls: LaSo, q: QuyTacV2): string[] | null {
  const goc = ls.cung.find((c) => c.ten === q.cung);
  if (!goc) return null;
  const sao = new Set<string>();
  for (const k of q.dieuKien) {
    const r = khopDieuKien(ls, goc, k);
    if (r === null) return null;
    r.forEach((s) => sao.add(s));
  }
  for (const k of q.khong ?? []) if (khopDieuKien(ls, goc, k) !== null) return null;
  return [...sao];
}

/** Các cung (trong vị trí của điều kiện) thực sự chứa yếu tố khớp: dùng điền tên cung vào câu luận. Chỉ gọi khi điều kiện đã khớp. */
export function cungKhopDieuKien(ls: LaSo, gocQT: Cung, k: DieuKien): Cung[] {
  const goc = k.tuCung ? ls.cung.find((c) => c.ten === k.tuCung) ?? gocQT : gocQT;
  if (k.phaCach || k.satDac !== undefined) return cungTheoViTri(ls, goc, 'tam-phuong').filter((c) => saoCua(c).some(k.satDac !== undefined ? laSatDac : laPha));
  if (k.giapHoa) return cungTheoViTri(ls, goc, 'giap');
  const ds = cungTheoViTri(ls, goc, k.viTri);
  const sao = k.sao ?? [];
  if (k.chu || k.muonXung) return ds.map((c) => chinhTinhXet(ls, c, k).cung).filter((c, i, a) => a.indexOf(c) === i && c.chinhTinh.some((s) => sao.includes(s.ten)));
  if (k.rai || k.toiThieu !== undefined) return ds.filter((c) => saoCua(c).some((s) => sao.some((t) => t === s.ten && (!k.doSang || (!!s.dacTinhTen && k.doSang.includes(s.dacTinhTen))))));
  return ds.filter((c) => {
    const tat = saoCua(c);
    if (!sao.every((t) => tat.some((s) => s.ten === t))) return false;
    return cungDat(c, k, sao[0] ? tat.find((s) => s.ten === sao[0]) : undefined);
  });
}
