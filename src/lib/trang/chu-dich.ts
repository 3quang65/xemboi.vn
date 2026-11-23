// Trang 64 quẻ và 8 quái (/kinh-dich/que/{slug}, /kinh-dich/bat-quai/{slug}). Chỉ nguyên văn có nguồn và phần tính được.
//  - Nguyên văn quẻ từ, hào từ: 周易 Kanripo KR1a0001 (bản TLS), CC BY-SA 4.0, đối chiếu từng chữ với KR1a0006 王弼注
//    (tests/trang/chu-dich-64.test.mjs). Dữ liệu: du-lieu/chu-dich-64.json.
//  - Phiên âm Hán Việt: du-lieu/chu-dich-64-phien-am.json (dựng từ kho song ngữ DS05, có danh sách chữ đa âm đã quyết).
//  - Tượng, tính, vật, thân thể, gia đình, phương của 8 quái: trích 《說卦》 cùng bản KR1a0001 (tệp KR1a0001_067).
//    Thuyết quái chỉ ghi phương cho 6 quái; Khôn không ghi phương, Đoài ghi theo mùa ("正秋"). Trang không tự điền.
//  - Ngũ hành của quái (BAT_QUAI.hanh) là cách quy thông dụng đời sau, không có trong Thuyết quái; trang phải ghi vậy.
// Chưa có bản dịch tiếng Việt và lời bình: các phần này chờ NoiDung đã duyệt.
import CHU_DICH from './du-lieu/chu-dich-64.json';
import PHIEN_AM from './du-lieu/chu-dich-64-phien-am.json';
import { trangDaDung } from './dieu-huong';
import { BAT_QUAI, QUE_64, queHo, queTheoHao, type Hao, type Quai, type Que } from './kinh-dich';

type VanHan = { viTri: string; van: string };
type DongJson = { so: number; kyHieu: string; ten: string; queTu: string; hao: VanHan[]; dung: VanHan | null };
type PhienAmJson = { so: number; queTu: string; hao: VanHan[]; dung: VanHan | null };

export const NGUON_CHU_DICH = {
  ma: 'KR1a0001', tenGoc: '周易', tenHanViet: 'Chu Dịch',
  ghiCong: 'Văn bản: Kanripo, CC BY-SA 4.0', url: 'https://github.com/kanripo/KR1a0001',
  doiChieu: 'Đã đối chiếu từng chữ với bản 周易註 Vương Bật chú (Kanripo KR1a0006); chỗ khác chỉ là dị thể, trừ hai chỗ khác bản đã ghi chú ngay dưới câu liên quan (quẻ Mông và quẻ Chấn).',
} as const;

/** Chỗ bản gốc khác các bản khác (trang nên ghi chú cạnh câu đó). */
export const KHAC_BAN: { so: number; viTri: string; banGoc: string; banKhac: string; ghiChu: string }[] = [
  { so: 4, viTri: 'quẻ từ', banGoc: '童蒙來求我', banKhac: '童蒙求我', ghiChu: 'năm bản khác (Vương Bật chú, Chu Dịch chú sớ, Tập giải, Bản nghĩa, Chiết trung) không có chữ 來.' },
  { so: 51, viTri: 'lục ngũ', banGoc: '意无喪有事', banKhac: '億无喪有事', ghiChu: 'năm bản khác ghi 億.' },
];

// ---------- 8 quái ----------

export type QuaiChiTiet = Quai & {
  slug: string;
  han: string;
  kyHieu: string;
  /** Câu Thuyết quái, chép nguyên văn (đã bỏ dấu câu của bản TLS ở giữa câu cho gọn, giữ chữ). */
  tuongHan: string;
  thuyetQuai: { tinh: string; vat: string; thanThe: string; giaDinh: string; phuong: string | null };
  /** Phương Hậu thiên khi Thuyết quái ghi thẳng; null nếu sách không ghi. */
  phuongSachGhi: string | null;
};

// Thứ tự như BAT_QUAI: Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn.
const QUAI_THEM: Omit<QuaiChiTiet, keyof Quai>[] = [
  { slug: 'can-thien', han: '乾', kyHieu: '☰', tuongHan: '乾為天', phuongSachGhi: 'Tây Bắc',
    thuyetQuai: { tinh: '乾健也', vat: '乾為馬', thanThe: '乾為首', giaDinh: '乾天也故稱乎父', phuong: '乾西北之卦也' } },
  { slug: 'doai-trach', han: '兌', kyHieu: '☱', tuongHan: '兌為澤', phuongSachGhi: null,
    thuyetQuai: { tinh: '兌說也', vat: '兌為羊', thanThe: '兌為口', giaDinh: '兌三索而得女故謂之少女', phuong: '兌正秋也' } },
  { slug: 'ly-hoa', han: '離', kyHieu: '☲', tuongHan: '離為火', phuongSachGhi: 'Nam',
    thuyetQuai: { tinh: '離麗也', vat: '離為雉', thanThe: '離為目', giaDinh: '離再索而得女故謂之中女', phuong: '南方之卦也' } },
  { slug: 'chan-loi', han: '震', kyHieu: '☳', tuongHan: '震為雷', phuongSachGhi: 'Đông',
    thuyetQuai: { tinh: '震動也', vat: '震為龍', thanThe: '震為足', giaDinh: '震一索而得男故謂之長男', phuong: '震東方也' } },
  { slug: 'ton-phong', han: '巽', kyHieu: '☴', tuongHan: '巽為木為風', phuongSachGhi: 'Đông Nam',
    thuyetQuai: { tinh: '巽入也', vat: '巽為雞', thanThe: '巽為股', giaDinh: '巽一索而得女故謂之長女', phuong: '巽東南也' } },
  { slug: 'kham-thuy', han: '坎', kyHieu: '☵', tuongHan: '坎為水', phuongSachGhi: 'Bắc',
    thuyetQuai: { tinh: '坎陷也', vat: '坎為豕', thanThe: '坎為耳', giaDinh: '坎再索而得男故謂之中男', phuong: '正北方之卦也' } },
  { slug: 'can-son', han: '艮', kyHieu: '☶', tuongHan: '艮為山', phuongSachGhi: 'Đông Bắc',
    thuyetQuai: { tinh: '艮止也', vat: '艮為狗', thanThe: '艮為手', giaDinh: '艮三索而得男故謂之少男', phuong: '艮東北之卦也' } },
  { slug: 'khon-dia', han: '坤', kyHieu: '☷', tuongHan: '坤為地', phuongSachGhi: null,
    thuyetQuai: { tinh: '坤順也', vat: '坤為牛', thanThe: '坤為腹', giaDinh: '坤地也故稱乎母', phuong: null } },
];

export const BAT_QUAI_CHI_TIET: QuaiChiTiet[] = BAT_QUAI.map((q, i) => ({ ...q, ...QUAI_THEM[i] }));

export const quaiTheoSlug = (slug: string) => BAT_QUAI_CHI_TIET.find((q) => q.slug === slug);
export const quaiTheoTenQ = (ten: string) => BAT_QUAI_CHI_TIET.find((q) => q.ten === ten)!;

/** Các quẻ có quái này ở trên hoặc dưới (14 quẻ + quẻ thuần tính một lần = 15). */
export function queCoQuai(ten: string): { tren: Que[]; duoi: Que[] } {
  return { tren: QUE_64.filter((q) => q.thuong.ten === ten), duoi: QUE_64.filter((q) => q.ha.ten === ten) };
}

// ---------- 64 quẻ ----------

const DS_HAN = (CHU_DICH as { que: DongJson[] }).que;
const DS_PHIEN_AM = (PHIEN_AM as unknown as { que: PhienAmJson[] }).que;

export type QueChiTiet = {
  que: Que;
  kyHieu: string;
  han: { ten: string; queTu: string; hao: VanHan[]; dung: VanHan | null };
  phienAm: { queTu: string; hao: VanHan[]; dung: VanHan | null } | null;
  /** Quẻ hỗ (2-3-4 / 3-4-5). */
  ho: Que;
  /** Quẻ đảo (綜, lật ngược 6 hào); trùng chính nó với 8 quẻ đối xứng. */
  dao: Que;
  /** Quẻ đối (錯, đổi âm dương cả 6 hào). */
  doi: Que;
  truoc: Que | null;
  sau: Que | null;
  khacBan: typeof KHAC_BAN;
};

export const queDao = (hao: Hao[]) => queTheoHao([...hao].reverse());
export const queDoi = (hao: Hao[]) => queTheoHao(hao.map((h) => (1 - h) as Hao));

export function queChiTiet(slug: string): QueChiTiet | null {
  const que = QUE_64.find((q) => q.slug === slug);
  if (!que) return null;
  const h = DS_HAN[que.so - 1];
  const p = DS_PHIEN_AM[que.so - 1] ?? null;
  return {
    que,
    kyHieu: h.kyHieu,
    han: { ten: h.ten, queTu: h.queTu, hao: h.hao, dung: h.dung },
    phienAm: p ? { queTu: p.queTu, hao: p.hao, dung: p.dung } : null,
    ho: queHo(que.hao),
    dao: queDao(que.hao),
    doi: queDoi(que.hao),
    truoc: que.so > 1 ? QUE_64[que.so - 2] : null,
    sau: que.so < 64 ? QUE_64[que.so] : null,
    khacBan: KHAC_BAN.filter((k) => k.so === que.so),
  };
}

/** Bảng 64 quẻ cho trang /kinh-dich/64-que: số, ký hiệu, tên, quái trên dưới, chữ Hán. */
export function bang64(): { que: Que; kyHieu: string; han: string }[] {
  return QUE_64.map((q) => ({ que: q, kyHieu: DS_HAN[q.so - 1].kyHieu, han: DS_HAN[q.so - 1].ten }));
}

export const duongDanQue = (q: Que) => `/kinh-dich/que/${q.slug}`;
export const duongDanQuai = (q: QuaiChiTiet) => `/kinh-dich/bat-quai/${q.slug}`;

/** 64 trang quẻ + 8 trang quái: được phép đặt liên kết (ngoài `trangDaDung`, vốn chỉ chứa trang có trong menu). */
export const TRANG_KINH_DICH: readonly string[] = [
  ...QUE_64.map(duongDanQue),
  ...BAT_QUAI_CHI_TIET.map(duongDanQuai),
];

/** `trangDaDung()` cộng các trang quẻ, quái. Chỉ dùng phía server (tệp này nạp JSON nguyên văn). */
export function daDungKinhDich(): Set<string> {
  return new Set([...trangDaDung(), ...TRANG_KINH_DICH]);
}

/** Ghi công phiên âm Hán Việt của 64 quẻ (dựng từ kho song ngữ; chữ đa âm đã chọn tay, xem du-lieu/chu-dich-64-phien-am.json). */
export const NGUON_PHIEN_AM = {
  ten: 'Phiên âm Hán Việt dựng từ kho vietnamese_nom_scripts (KasaiDanto)',
  ghiCong: 'Dữ liệu âm đọc: KasaiDanto/vietnamese_nom_scripts, Apache-2.0; xemboi.vn ghép theo từng chữ và chọn âm cho chữ đa âm',
  url: 'https://github.com/KasaiDanto/vietnamese_nom_scripts',
} as const;

/** Phiên âm các câu Thuyết quái dùng ở trang quái (khóa là đúng chuỗi Hán trong BAT_QUAI_CHI_TIET). */
export const PHIEN_AM_THUYET_QUAI: Record<string, string> = {
  乾為天: 'Càn vi thiên', 兌為澤: 'Đoài vi trạch', 離為火: 'Ly vi hỏa', 震為雷: 'Chấn vi lôi',
  巽為木為風: 'Tốn vi mộc, vi phong', 坎為水: 'Khảm vi thủy', 艮為山: 'Cấn vi sơn', 坤為地: 'Khôn vi địa',
  乾健也: 'Càn kiện dã', 兌說也: 'Đoài duyệt dã', 離麗也: 'Ly lệ dã', 震動也: 'Chấn động dã',
  巽入也: 'Tốn nhập dã', 坎陷也: 'Khảm hãm dã', 艮止也: 'Cấn chỉ dã', 坤順也: 'Khôn thuận dã',
  乾為馬: 'Càn vi mã', 兌為羊: 'Đoài vi dương', 離為雉: 'Ly vi trĩ', 震為龍: 'Chấn vi long',
  巽為雞: 'Tốn vi kê', 坎為豕: 'Khảm vi thỉ', 艮為狗: 'Cấn vi cẩu', 坤為牛: 'Khôn vi ngưu',
  乾為首: 'Càn vi thủ', 兌為口: 'Đoài vi khẩu', 離為目: 'Ly vi mục', 震為足: 'Chấn vi túc',
  巽為股: 'Tốn vi cổ', 坎為耳: 'Khảm vi nhĩ', 艮為手: 'Cấn vi thủ', 坤為腹: 'Khôn vi phúc',
  乾天也故稱乎父: 'Càn thiên dã, cố xưng hồ phụ',
  坤地也故稱乎母: 'Khôn địa dã, cố xưng hồ mẫu',
  震一索而得男故謂之長男: 'Chấn nhất sách nhi đắc nam, cố vị chi trưởng nam',
  巽一索而得女故謂之長女: 'Tốn nhất sách nhi đắc nữ, cố vị chi trưởng nữ',
  坎再索而得男故謂之中男: 'Khảm tái sách nhi đắc nam, cố vị chi trung nam',
  離再索而得女故謂之中女: 'Ly tái sách nhi đắc nữ, cố vị chi trung nữ',
  艮三索而得男故謂之少男: 'Cấn tam sách nhi đắc nam, cố vị chi thiếu nam',
  兌三索而得女故謂之少女: 'Đoài tam sách nhi đắc nữ, cố vị chi thiếu nữ',
  乾西北之卦也: 'Càn tây bắc chi quái dã', 兌正秋也: 'Đoài chính thu dã', 南方之卦也: 'Nam phương chi quái dã',
  震東方也: 'Chấn đông phương dã', 巽東南也: 'Tốn đông nam dã', 正北方之卦也: 'Chính bắc phương chi quái dã',
  艮東北之卦也: 'Cấn đông bắc chi quái dã',
};

/** Tên vị trí hào: 初九 → "Sơ Cửu", 六二 → "Lục Nhị", 用九 → "Dụng Cửu". */
const AM_VI_TRI: Record<string, string> = { 初: 'Sơ', 上: 'Thượng', 用: 'Dụng', 九: 'Cửu', 六: 'Lục', 二: 'Nhị', 三: 'Tam', 四: 'Tứ', 五: 'Ngũ' };
export const tenViTriHao = (viTri: string) => [...viTri].map((c) => AM_VI_TRI[c] ?? c).join(' ');
