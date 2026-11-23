// Thần số học (numerology, hệ Pythagoras hiện đại): chỉ phần TÍNH, không có phần luận tính cách.
// Lý do: chưa có nguồn loại A (docs/v2/12-thu-vien-rag.md mục 3, docs/v2/16-seo-kien-truc.md bảng nguồn),
// nên trang chỉ trình bày quy ước cộng số và điều đếm được. Các quy ước khác nhau giữa các sách được ghi rõ.
// Tệp này nhẹ, không import gì: component client (công cụ tính theo tên) dùng được.

/** 12 số chủ đạo có trang riêng: 1–9 và 3 số "master" 11, 22, 33. */
export const SO_CHU_DAO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;
export const SO_MASTER = [11, 22, 33] as const;
export const NAM_CA_NHAN = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const tongChuSo = (n: number) => String(Math.abs(Math.trunc(n))).split('').reduce((s, c) => s + Number(c), 0);

/**
 * Rút gọn bằng cách cộng chữ số tới khi còn 1 chữ số. `giu` là các số dừng lại không rút tiếp (mặc định 11, 22, 33).
 * Trả cả chuỗi các bước để trang in "33 → giữ" hoặc "29 → 11 → giữ".
 */
export function rutGon(n: number, giu: readonly number[] = SO_MASTER): { so: number; buoc: number[] } {
  const buoc = [n];
  let x = n;
  while (x > 9 && !giu.includes(x)) { x = tongChuSo(x); buoc.push(x); }
  return { so: x, buoc };
}
/** Rút về 1–9, không giữ số master. */
export const rutDon = (n: number) => rutGon(n, []).so;

export type NgaySinh = { ngay: number; thang: number; nam: number };

export function ngayHopLe(ngay: number, thang: number, nam: number, tu = 1900, den = 2100): boolean {
  if (![ngay, thang, nam].every(Number.isInteger) || nam < tu || nam > den || thang < 1 || thang > 12 || ngay < 1) return false;
  return ngay <= new Date(Date.UTC(nam, thang, 0)).getUTCDate();
}

/** Đọc "1990-08-15" (ô input type=date) hoặc "15/08/1990". Sai thì undefined. */
export function docNgay(s: string | undefined | null): NgaySinh | undefined {
  if (!s) return undefined;
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s.trim()) ?? null;
  const v = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(s.trim()) ?? null;
  const [nam, thang, ngay] = m ? [+m[1], +m[2], +m[3]] : v ? [+v[3], +v[2], +v[1]] : [NaN, NaN, NaN];
  return ngayHopLe(ngay, thang, nam) ? { ngay, thang, nam } : undefined;
}
export const vietNgay = (d: NgaySinh) => `${String(d.ngay).padStart(2, '0')}/${String(d.thang).padStart(2, '0')}/${d.nam}`;
export const isoNgay = (d: NgaySinh) => `${d.nam}-${String(d.thang).padStart(2, '0')}-${String(d.ngay).padStart(2, '0')}`;

const chuSo = (d: NgaySinh) => `${d.ngay}${d.thang}${d.nam}`.split('').map(Number);

export type CachTinh = {
  /** Diễn giải từng bước bằng chữ số, vd "1 + 5 + 0 + 8 + 1 + 9 + 9 + 0 = 33". */
  phepCong: string;
  tong: number;
  buoc: number[];
  so: number;
};

/**
 * Số chủ đạo (life path). Hai quy ước hay gặp, cho kết quả khác nhau ở một số ngày:
 * - cách 1 "cộng dồn": cộng mọi chữ số của ngày, tháng, năm rồi rút gọn, giữ 11/22/33. Phần lớn công cụ tiếng Việt dùng cách này.
 * - cách 2 "rút từng phần": rút gọn riêng ngày, tháng, năm (giữ 11, 22) rồi cộng ba số và rút gọn, giữ 11/22/33.
 */
export function soChuDao(d: NgaySinh): { cach1: CachTinh; cach2: CachTinh & { phan: [number, number, number] }; khac: boolean } {
  const cs = chuSo(d);
  const tong1 = cs.reduce((a, b) => a + b, 0);
  const r1 = rutGon(tong1);
  const phan = [d.ngay, d.thang, d.nam].map((x) => rutGon(x, [11, 22]).so) as [number, number, number];
  const tong2 = phan[0] + phan[1] + phan[2];
  const r2 = rutGon(tong2);
  return {
    cach1: { phepCong: `${cs.join(' + ')} = ${tong1}`, tong: tong1, buoc: r1.buoc, so: r1.so },
    cach2: { phepCong: `${phan.join(' + ')} = ${tong2}`, tong: tong2, buoc: r2.buoc, so: r2.so, phan },
    khac: r1.so !== r2.so,
  };
}

/** Số master rút về 1 chữ số: 11 → 2, 22 → 4, 33 → 6. */
export const soGoc = (n: number) => rutDon(n);

/**
 * Năm cá nhân: chữ số của ngày sinh + tháng sinh + năm đang xét, rút về 1–9 (không giữ số master).
 * Mốc đổi năm cá nhân: sách lấy 1/1, sách lấy ngày sinh nhật. Hàm chỉ tính con số, trang ghi rõ hai mốc.
 */
export function namCaNhan(ngay: number, thang: number, namXet: number): CachTinh {
  const cs = `${ngay}${thang}${namXet}`.split('').map(Number);
  const tong = cs.reduce((a, b) => a + b, 0);
  const r = rutGon(tong, []);
  return { phepCong: `${cs.join(' + ')} = ${tong}`, tong, buoc: r.buoc, so: r.so };
}

/** Mọi ngày–tháng (gồm 29/2) có năm cá nhân `n` trong năm `namXet`, xếp theo tháng. */
export function ngayCoNamCaNhan(n: number, namXet: number): { thang: number; ngay: number[] }[] {
  const kq: { thang: number; ngay: number[] }[] = [];
  for (let t = 1; t <= 12; t++) {
    const soNgay = new Date(Date.UTC(2024, t, 0)).getUTCDate(); // năm nhuận để có 29/2
    const ds: number[] = [];
    for (let d = 1; d <= soNgay; d++) if (namCaNhan(d, t, namXet).so === n) ds.push(d);
    kq.push({ thang: t, ngay: ds });
  }
  return kq;
}

// ---------- Biểu đồ ngày sinh 3 × 3 ----------

/** Lưới hay dùng trong sách tiếng Việt: hàng trên 3-6-9, giữa 2-5-8, dưới 1-4-7 (số nhỏ ở góc trái dưới). */
export const LUOI: readonly (readonly number[])[] = [[3, 6, 9], [2, 5, 8], [1, 4, 7]];

/** 8 đường 3 ô. Tên chỉ tả vị trí; tên gọi riêng của từng "mũi tên" khác nhau giữa các sách nên không dùng. */
export const DUONG_BIEU_DO: readonly { ma: string; ten: string; so: readonly [number, number, number] }[] = [
  { ma: 'hang-tren', ten: 'Hàng trên', so: [3, 6, 9] },
  { ma: 'hang-giua', ten: 'Hàng giữa', so: [2, 5, 8] },
  { ma: 'hang-duoi', ten: 'Hàng dưới', so: [1, 4, 7] },
  { ma: 'cot-trai', ten: 'Cột trái', so: [1, 2, 3] },
  { ma: 'cot-giua', ten: 'Cột giữa', so: [4, 5, 6] },
  { ma: 'cot-phai', ten: 'Cột phải', so: [7, 8, 9] },
  { ma: 'cheo-1-5-9', ten: 'Đường chéo 1-5-9', so: [1, 5, 9] },
  { ma: 'cheo-3-5-7', ten: 'Đường chéo 3-5-7', so: [3, 5, 7] },
];

export type BieuDo = {
  /** Số lần xuất hiện của 1–9 (chỉ số 0 bị bỏ). */
  dem: Record<number, number>;
  soKhong: number;
  thieu: number[];
  /** Đường đủ cả 3 số và đường trống cả 3 số. */
  duongDay: (typeof DUONG_BIEU_DO)[number][];
  duongTrong: (typeof DUONG_BIEU_DO)[number][];
};

export function bieuDoNgaySinh(d: NgaySinh, themSoChuDao = false): BieuDo {
  const cs = chuSo(d);
  if (themSoChuDao) { const s = soChuDao(d).cach1.so; String(s).split('').forEach((c) => cs.push(+c)); }
  const dem: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) dem[i] = 0;
  let soKhong = 0;
  for (const c of cs) { if (c === 0) soKhong++; else dem[c]++; }
  const thieu = Object.keys(dem).map(Number).filter((k) => dem[k] === 0);
  return {
    dem, soKhong, thieu,
    duongDay: DUONG_BIEU_DO.filter((l) => l.so.every((s) => dem[s] > 0)),
    duongTrong: DUONG_BIEU_DO.filter((l) => l.so.every((s) => dem[s] === 0)),
  };
}

// ---------- 4 đỉnh cao ----------

export type DinhCao = { thu: number; so: number; phepCong: string; tuTuoi: number; denTuoi: number | null };

/**
 * 4 đỉnh cao (pinnacles) theo quy ước phổ biến: ngày, tháng, năm rút về 1–9 trước;
 * đỉnh 1 = tháng + ngày, đỉnh 2 = ngày + năm, đỉnh 3 = đỉnh 1 + đỉnh 2, đỉnh 4 = tháng + năm (giữ 11, 22, 33).
 * Tuổi: đỉnh 1 đến năm 36 − (số chủ đạo rút về 1 chữ số); mỗi đỉnh sau cách 9 năm.
 */
export function bonDinhCao(d: NgaySinh): DinhCao[] {
  const [n, t, y] = [rutDon(d.ngay), rutDon(d.thang), rutDon(d.nam)];
  const p1 = rutGon(t + n).so, p2 = rutGon(n + y).so;
  const p3 = rutGon(rutDon(p1) + rutDon(p2)).so, p4 = rutGon(t + y).so;
  const moc = 36 - soGoc(soChuDao(d).cach1.so);
  const phep = [`${t} + ${n}`, `${n} + ${y}`, `${rutDon(p1)} + ${rutDon(p2)}`, `${t} + ${y}`];
  return [p1, p2, p3, p4].map((so, i) => ({
    thu: i + 1, so, phepCong: phep[i],
    tuTuoi: i === 0 ? 0 : moc + 9 * (i - 1) + 1,
    denTuoi: i === 3 ? null : moc + 9 * i,
  }));
}

// ---------- Theo tên ----------

/** Bảng Pythagoras: A=1 … I=9, J=1 … R=9, S=1 … Z=8. */
export const BANG_CHU: readonly { so: number; chu: string[] }[] = Array.from({ length: 9 }, (_, i) => ({
  so: i + 1,
  chu: [i, i + 9, i + 18].filter((k) => k < 26).map((k) => String.fromCharCode(65 + k)),
}));
export const giaTriChu = (c: string) => ((c.charCodeAt(0) - 65) % 9) + 1;

/** Tiếng Việt: Y luôn là nguyên âm. Chữ có dấu quy về chữ gốc (Ă, Â → A; Ê → E; Ô, Ơ → O; Ư → U; Đ → D). */
export const NGUYEN_AM = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

export function boDauTen(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ').trim();
}

export type ChuTen = { goc: string; chu: string; so: number; nguyenAm: boolean };
export type KetQuaTen = {
  chu: ChuTen[];
  /** Chỉ số tên (expression): mọi chữ. Linh hồn (soul urge): nguyên âm. Nhân cách (personality): phụ âm. */
  ten: CachTinh; linhHon: CachTinh; nhanCach: CachTinh;
};

const congChu = (ds: ChuTen[]): CachTinh => {
  const tong = ds.reduce((a, c) => a + c.so, 0);
  const r = rutGon(tong);
  return { phepCong: ds.length ? `${ds.map((c) => c.so).join(' + ')} = ${tong}` : '0', tong, buoc: r.buoc, so: r.so };
};

/** Tính theo họ tên (đủ dấu hoặc không dấu). Tên rỗng sau khi bỏ ký tự lạ → undefined. */
export function theoTen(hoTen: string): KetQuaTen | undefined {
  const chu: ChuTen[] = [];
  for (const goc of hoTen.normalize('NFC')) {
    const c = boDauTen(goc);
    if (!/^[A-Z]$/.test(c)) continue;
    chu.push({ goc, chu: c, so: giaTriChu(c), nguyenAm: NGUYEN_AM.has(c) });
  }
  if (!chu.length) return undefined;
  return { chu, ten: congChu(chu), linhHon: congChu(chu.filter((c) => c.nguyenAm)), nhanCach: congChu(chu.filter((c) => !c.nguyenAm)) };
}

// ---------- Thống kê, ví dụ cho trang từng số ----------

export const NAM_THONG_KE_TU = 1930;
export const NAM_THONG_KE_DEN = 2030;

/** Đếm số ngày dương lịch (1930–2030) cho từng số chủ đạo theo hai cách. */
export function thongKeSoChuDao(tu = NAM_THONG_KE_TU, den = NAM_THONG_KE_DEN) {
  const c1: Record<number, number> = {}, c2: Record<number, number> = {};
  let tongNgay = 0, soNgayKhac = 0, tongMin = Infinity, tongMax = 0;
  for (const s of SO_CHU_DAO) { c1[s] = 0; c2[s] = 0; }
  for (let y = tu; y <= den; y++) for (let t = 1; t <= 12; t++) {
    const soNgay = new Date(Date.UTC(y, t, 0)).getUTCDate();
    for (let n = 1; n <= soNgay; n++) {
      const r = soChuDao({ ngay: n, thang: t, nam: y });
      c1[r.cach1.so]++; c2[r.cach2.so]++; tongNgay++; if (r.khac) soNgayKhac++;
      tongMin = Math.min(tongMin, r.cach1.tong); tongMax = Math.max(tongMax, r.cach1.tong);
    }
  }
  /** tongMin, tongMax: tổng chữ số (cách 1, trước khi rút) nhỏ nhất và lớn nhất gặp trong khoảng năm. */
  return { tu, den, tongNgay, soNgayKhac, tongMin, tongMax, cach1: c1, cach2: c2 };
}

/** Vài ngày ví dụ trong năm `nam` có số chủ đạo `so` theo cách 1. */
export function viDuNgay(so: number, nam: number, toiDa = 4): NgaySinh[] {
  const kq: NgaySinh[] = [];
  for (let t = 1; t <= 12 && kq.length < toiDa; t++) {
    const soNgay = new Date(Date.UTC(nam, t, 0)).getUTCDate();
    for (let n = 1; n <= soNgay && kq.length < toiDa; n++) {
      const d = { ngay: n, thang: t, nam };
      if (soChuDao(d).cach1.so === so) kq.push(d);
    }
  }
  return kq;
}

/**
 * Năm gần `goc` nhất (xét lần lượt goc, goc+10, goc−10, goc+1, goc−1, …) có ví dụ cho số `so`, lấy `soNam` năm.
 * Vd số 2 không có ngày nào năm 1990 (tổng chữ số năm đã là 19), số 33 không có ngày nào năm 2000.
 */
export function viDuTheoNam(so: number, goc: readonly number[] = [1990, 2000], soNam = 2, toiDa = 3): { nam: number; ds: NgaySinh[] }[] {
  const thu: number[] = [];
  for (let k = 0; k <= 40; k++) for (const g of goc) for (const y of k === 0 ? [g] : [g + k, g - k]) if (y >= NAM_THONG_KE_TU && y <= NAM_THONG_KE_DEN && !thu.includes(y)) thu.push(y);
  const kq: { nam: number; ds: NgaySinh[] }[] = [];
  for (const y of thu) {
    if (kq.length >= soNam) break;
    const ds = viDuNgay(so, y, toiDa);
    if (ds.length) kq.push({ nam: y, ds });
  }
  return kq.sort((a, b) => a.nam - b.nam);
}

/** Tổng chữ số (trước khi rút) cho ra số chủ đạo `so` theo cách 1, trong khoảng [tongMin, tongMax] (lấy từ thongKeSoChuDao). */
export function tongDanToi(so: number, tongMin = 1, tongMax = 54): number[] {
  const kq: number[] = [];
  for (let t = tongMin; t <= tongMax; t++) if (rutGon(t).so === so) kq.push(t);
  return kq;
}

// ---------- Đường dẫn ----------

export const duongDanSoChuDao = (n: number) => `/than-so-hoc/so-chu-dao/${n}`;
export const duongDanNamCaNhan = (n: number) => `/than-so-hoc/nam-ca-nhan/${n}`;
export const soTuSlug = (s: string, ds: readonly number[]) => (/^[1-9]\d?$/.test(s) && ds.includes(+s) ? +s : undefined);

export const TRANG_THAN_SO_HOC = [
  '/than-so-hoc', '/than-so-hoc/so-chu-dao', '/than-so-hoc/theo-ten', '/than-so-hoc/bieu-do-ngay-sinh',
  ...SO_CHU_DAO.map(duongDanSoChuDao), ...NAM_CA_NHAN.map(duongDanNamCaNhan),
];

/** Câu giới hạn cuối mỗi trang: đúng câu mẫu docs/v2/07-bach-khoa-huyen-hoc.md mục 3.3 (loại tử vi, bát tự, thần số, chiêm tinh). */
export const GIOI_HAN =
  'Đây là tri thức văn hóa phương Tây để tham khảo và tự suy ngẫm. Chưa có nghiên cứu khoa học nào chứng minh khả năng dự báo. Không thay tư vấn y tế, tài chính, pháp lý.';

/**
 * Các điểm quy ước khác nhau, để trang ghi rõ. Câu về Taylor đã đối chiếu bản quét archive.org (numerologymadepl00tayl_0, tr. 56):
 * sách chỉ nêu hai số master 11, 22 và không cộng ngày với năm để lấy số master. Chỉ tả lại quy tắc, không trích, không dịch.
 */
export const QUY_UOC: readonly string[] = [
  'Số chủ đạo tính theo ngày sinh dương lịch.',
  'Cách 1 cộng dồn mọi chữ số; cách 2 rút gọn riêng ngày, tháng, năm rồi mới cộng. Hai cách cho kết quả khác nhau ở một phần ngày sinh, trang hiện cả hai khi khác.',
  'Số 11, 22, 33 được giữ, không rút tiếp. Có sách chỉ giữ 11 và 22: Numerology Made Plain (Ariel Yvon Taylor, 1926) nêu hai số này và không cộng ngày với năm để ra số master.',
  'Năm cá nhân rút về 1–9. Sách lấy mốc đổi năm cá nhân là 1/1, sách lấy ngày sinh nhật.',
  'Tên tiếng Việt: bỏ dấu, Đ tính như D, Y tính là nguyên âm.',
];

/** Vì sao trang không có phần "ý nghĩa", "hợp nghề gì". */
export const GHI_CHU_Y_NGHIA =
  'Các sách thần số học mô tả tính cách, nghề hợp cho từng số, nhưng mỗi sách một kiểu và xemboi chưa có bản nào được phép trích. Vì vậy trang chưa đăng phần ý nghĩa, chỉ đăng cách tính và số liệu đếm được.';
