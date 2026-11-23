// Bản đồ sao lúc sinh (natal chart) theo hoàng đạo nhiệt đới.
// Vị trí thiên thể: astronomy-engine 2.1.19 (MIT, Don Cross), kinh độ hoàng đạo biểu kiến theo hoàng đạo ngày đó,
// đối chiếu JPL Horizons DE441 trong tests/trang/ban-do-sao.test.mjs.
// Tọa độ 63 tỉnh: GeoNames (CC BY 4.0), du-lieu/tinh-toa-do.json.
// Lời sách: Tetrabiblos quyển I ch. IV (tính chất các hành tinh) và ch. XIII (bốn góc), bản Ashmand 1822, phạm vi công cộng.
// Không có phần luận giải tính cách: Tetrabiblos không luận theo kiểu đó, xemboi chưa có nguồn được phép trích (xem GHI_CHU_TINH_CACH).
import { Body, Ecliptic, GeoVector, MakeTime, SiderealTime, e_tilt } from 'astronomy-engine';
import TINH_JSON from './du-lieu/tinh-toa-do.json';
import { cungTheoThu, type CungHoangDao, type HanhTinh, type TrichAnh } from './chiem-tinh';

export const NGUON_BAN_DO = {
  lich: 'astronomy-engine 2.1.19 (Don Cross, giấy phép MIT), sai số so với JPL Horizons dưới 1 phút cung',
  toaDo: 'Tọa độ tỉnh lỵ: GeoNames (geonames.org), giấy phép CC BY 4.0',
  mucGio: 'Lịch sử múi giờ Việt Nam: cơ sở dữ liệu múi giờ IANA (vùng Asia/Ho_Chi_Minh)',
} as const;

// ---------- Thiên thể ----------

export type TenThienThe = HanhTinh | 'Sao Thiên Vương' | 'Sao Hải Vương' | 'Sao Diêm Vương';

export type ThienThe = {
  ten: TenThienThe;
  en: string;
  kyHieu: string;
  /** Có trong Tetrabiblos (7 thiên thể cổ). Ba hành tinh ngoài phát hiện sau Ptolemy. */
  coDien: boolean;
  /** Năm phát hiện, với 3 hành tinh ngoài. */
  phatHien?: number;
  body: Body;
};

export const THIEN_THE: readonly ThienThe[] = [
  { ten: 'Mặt Trời', en: 'Sun', kyHieu: '☉', coDien: true, body: Body.Sun },
  { ten: 'Mặt Trăng', en: 'Moon', kyHieu: '☽', coDien: true, body: Body.Moon },
  { ten: 'Sao Thủy', en: 'Mercury', kyHieu: '☿', coDien: true, body: Body.Mercury },
  { ten: 'Sao Kim', en: 'Venus', kyHieu: '♀', coDien: true, body: Body.Venus },
  { ten: 'Sao Hỏa', en: 'Mars', kyHieu: '♂', coDien: true, body: Body.Mars },
  { ten: 'Sao Mộc', en: 'Jupiter', kyHieu: '♃', coDien: true, body: Body.Jupiter },
  { ten: 'Sao Thổ', en: 'Saturn', kyHieu: '♄', coDien: true, body: Body.Saturn },
  { ten: 'Sao Thiên Vương', en: 'Uranus', kyHieu: '♅', coDien: false, phatHien: 1781, body: Body.Uranus },
  { ten: 'Sao Hải Vương', en: 'Neptune', kyHieu: '♆', coDien: false, phatHien: 1846, body: Body.Neptune },
  { ten: 'Sao Diêm Vương', en: 'Pluto', kyHieu: '♇', coDien: false, phatHien: 1930, body: Body.Pluto },
];

export const GHI_CHU_NGOAI =
  'Sao Thiên Vương (tìm ra năm 1781), Sao Hải Vương (1846) và Sao Diêm Vương (1930, nay xếp là hành tinh lùn) không có trong Tetrabiblos. Bản đồ vẫn ghi vị trí để đối chiếu với các bản đồ khác, nhưng không có lời sách đi kèm.';

const chuan360 = (x: number) => ((x % 360) + 360) % 360;
const lechGoc = (a: number, b: number) => ((a - b + 540) % 360) - 180;
const RAD = Math.PI / 180;

/** Kinh độ hoàng đạo biểu kiến (độ, hoàng đạo ngày đó) của thiên thể, nhìn từ tâm Trái Đất. */
export function kinhDoThienThe(body: Body, luc: Date): number {
  return chuan360(Ecliptic(GeoVector(body, MakeTime(luc), true)).elon);
}

// ---------- Cung mọc, thiên đỉnh ----------

/** Thiên đỉnh (MC) và cung mọc (ASC), kinh độ hoàng đạo, tại vĩ độ, kinh độ địa lý (độ, Đông dương). */
export function gocChieu(luc: Date, viDo: number, kinhDo: number): { asc: number; mc: number } {
  const t = MakeTime(luc);
  const eps = e_tilt(t).tobl * RAD;
  const ramc = chuan360(SiderealTime(t) * 15 + kinhDo) * RAD; // giờ sao biểu kiến địa phương
  const mc = chuan360(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) / RAD);
  const asc = chuan360(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(viDo * RAD) * Math.sin(eps))) / RAD);
  return { asc, mc };
}

// ---------- Múi giờ Việt Nam ----------

/** Các mốc đổi múi giờ (UTC) của vùng Asia/Ho_Chi_Minh theo IANA, kèm độ lệch (giây) từ mốc đó. */
const MOC_MUI_GIO: readonly [number, number][] = [
  [-Infinity, 25590], // giờ địa phương Phù Liễn, +7:06:30
  [Date.UTC(1911, 3, 30, 16, 53, 30), 25200],
  [Date.UTC(1942, 11, 31, 16), 28800],
  [Date.UTC(1945, 2, 14, 15), 32400],
  [Date.UTC(1945, 8, 1, 15), 25200],
  [Date.UTC(1947, 2, 31, 17), 28800],
  [Date.UTC(1955, 5, 30, 17), 25200],
  [Date.UTC(1959, 11, 31, 16), 28800],
  [Date.UTC(1975, 5, 12, 16), 25200],
];
const lechIana = (msUtc: number) => {
  let g = MOC_MUI_GIO[0][1];
  for (const [moc, lech] of MOC_MUI_GIO) if (msUtc >= moc) g = lech;
  return g;
};

/** Vĩ tuyến 17: ranh giới hai miền 1954–1975. */
export const VI_TUYEN_17 = 17;

export type MucGio = {
  /** Độ lệch so với UTC, giây. */
  lechGiay: number;
  nhan: string;
  /** Lý do chọn độ lệch này, để trang in ra cho người dùng tự kiểm. */
  lyDo: string;
  /** false khi giờ thời đó còn chưa chắc, trang nên mời người dùng chọn lại nếu biết. */
  chacChan: boolean;
};

export const nhanLech = (giay: number) => {
  const d = giay < 0 ? '−' : '+', a = Math.abs(giay);
  const h = Math.floor(a / 3600), m = Math.floor((a % 3600) / 60), s = a % 60;
  return `UTC${d}${h}` + (m || s ? `:${String(m).padStart(2, '0')}` : '') + (s ? `:${String(s).padStart(2, '0')}` : '');
};

/** Các độ lệch người dùng được chọn lại (giây). */
export const LECH_CHON: readonly number[] = [25200, 28800, 32400, 25590];

/**
 * Múi giờ mặc định cho giờ sinh ghi theo đồng hồ Việt Nam.
 * Theo IANA (vùng Sài Gòn); riêng nơi sinh phía bắc vĩ tuyến 17 trong 1960–6/1975 lấy UTC+7,
 * vì thời đó miền Bắc dùng giờ UTC+7 còn miền Nam dùng UTC+8.
 */
export function mucGioMacDinh(nam: number, thang: number, ngay: number, gio: number, phut: number, viDo: number): MucGio {
  const dongHo = Date.UTC(nam, thang - 1, ngay, gio, phut);
  // Lấy độ lệch khớp với chính thời điểm UTC suy ra. Giờ lặp lại khi lùi đồng hồ: lấy lần đầu (độ lệch lớn hơn).
  // Giờ bị nhảy qua khi vặn đồng hồ tới: lấy độ lệch trước mốc.
  const ung = [32400, 28800, 25590, 25200].filter((l) => lechIana(dongHo - l * 1000) === l);
  const lech = ung[0] ?? lechIana(dongHo - 32400_000);
  const utc = dongHo - lech * 1000;
  const mien = viDo >= VI_TUYEN_17 ? 'Bắc' : 'Nam';
  if (utc >= Date.UTC(1959, 11, 31, 16) && utc < Date.UTC(1975, 5, 12, 16)) {
    if (mien === 'Bắc') return { lechGiay: 25200, nhan: nhanLech(25200), lyDo: 'Từ 1960 đến 13/6/1975 miền Bắc dùng giờ UTC+7, miền Nam dùng UTC+8. Nơi sinh ở phía bắc vĩ tuyến 17 nên lấy UTC+7.', chacChan: true };
    return { lechGiay: 28800, nhan: nhanLech(28800), lyDo: 'Từ 1960 đến 13/6/1975 miền Nam dùng giờ UTC+8. Nơi sinh ở phía nam vĩ tuyến 17 nên lấy UTC+8.', chacChan: true };
  }
  if (utc >= Date.UTC(1947, 2, 31, 17) && utc < Date.UTC(1955, 5, 30, 17)) {
    return { lechGiay: 28800, nhan: nhanLech(28800), lyDo: 'Từ 4/1947 đến 6/1955 giờ chính thức theo cơ sở dữ liệu múi giờ IANA là UTC+8 (giờ của chính quyền Pháp). Vùng kháng chiến có thể vẫn dùng UTC+7. Nếu biết giờ sinh ghi theo múi nào, hãy chọn lại.', chacChan: false };
  }
  if (utc >= Date.UTC(1945, 2, 14, 15) && utc < Date.UTC(1945, 8, 1, 15)) {
    return { lechGiay: 32400, nhan: nhanLech(32400), lyDo: 'Từ 15/3 đến 2/9/1945 Việt Nam dùng giờ Tokyo, UTC+9.', chacChan: true };
  }
  if (utc >= Date.UTC(1942, 11, 31, 16) && utc < Date.UTC(1945, 2, 14, 15)) {
    return { lechGiay: 28800, nhan: nhanLech(28800), lyDo: 'Từ 1/1/1943 đến 14/3/1945 Đông Dương dùng giờ UTC+8.', chacChan: true };
  }
  if (utc < Date.UTC(1911, 3, 30, 16, 53, 30)) {
    return { lechGiay: 25590, nhan: nhanLech(25590), lyDo: 'Trước 1/5/1911 Đông Dương dùng giờ địa phương Phù Liễn (Hải Phòng), UTC+7:06:30.', chacChan: false };
  }
  return { lechGiay: lech, nhan: nhanLech(lech), lyDo: 'Giờ Việt Nam theo cơ sở dữ liệu múi giờ IANA: UTC+7.', chacChan: true };
}

// ---------- Tỉnh ----------

export type Tinh = { ma: string; tinh: string; noiLay: string; viDo: number; kinhDo: number };
export const DS_TINH: readonly Tinh[] = (TINH_JSON as { tinh: (Tinh & { geonameid: number })[] }).tinh
  .map(({ ma, tinh, noiLay, viDo, kinhDo }) => ({ ma, tinh, noiLay, viDo, kinhDo }));
export const tinhTheoMa = (ma: string) => DS_TINH.find((t) => t.ma === ma);
export const GHI_CHU_TINH = (TINH_JSON as { ghiChu: string }).ghiChu;

// ---------- Lập bản đồ ----------

export type ViTriCung = { kinhDo: number; cung: CungHoangDao; doTrongCung: number };
const viTri = (kinhDo: number): ViTriCung => {
  const k = chuan360(kinhDo);
  return { kinhDo: k, cung: cungTheoThu(Math.floor(k / 30)), doTrongCung: k % 30 };
};

/** Phẩm vị theo Tetrabiblos ch. XX, XXII: hành tinh ở nhà (house) của mình, ở vượng (exaltation) hay ở hãm (fall). */
export type PhamVi = 'nha' | 'vuong' | 'ham';
export function phamVi(ten: TenThienThe, cung: CungHoangDao): PhamVi | null {
  if (cung.chuNha === ten) return 'nha';
  if (cung.vuong === ten) return 'vuong';
  if (cung.ham === ten) return 'ham';
  return null;
}
export const TEN_PHAM_VI: Record<PhamVi, { ten: string; en: string; chuong: string }> = {
  nha: { ten: 'ở nhà của mình', en: 'house', chuong: 'XX' },
  vuong: { ten: 'ở vượng', en: 'exaltation', chuong: 'XXII' },
  ham: { ten: 'ở hãm', en: 'fall', chuong: 'XXII' },
};

export type ViTriThienThe = ViTriCung & {
  thienThe: ThienThe;
  /** Đang đi nghịch (kinh độ giảm dần), xét trong ±1 ngày. Mặt Trời, Mặt Trăng không bao giờ nghịch. */
  nghich: boolean;
  /** Số nhà (1–12) theo cách chia nhà trọn cung; null khi không có giờ sinh. */
  nha: number | null;
  phamVi: PhamVi | null;
  /** Khi không có giờ sinh: Mặt Trăng chạy khoảng 13° mỗi ngày nên trả khoảng trong ngày. */
  trongNgay?: { tu: ViTriCung; den: ViTriCung };
};

export type NhaTronCung = { so: number; cung: CungHoangDao };

export type BanDoSao = {
  /** Thời điểm sinh, UTC. Không có giờ sinh thì là 12:00 giờ địa phương. */
  luc: Date;
  coGio: boolean;
  mucGio: MucGio;
  /** Độ lệch đã dùng (mặc định hoặc người dùng chọn). */
  lechGiay: number;
  noiSinh: { ten: string; viDo: number; kinhDo: number };
  thienThe: ViTriThienThe[];
  /** Cung mọc và thiên đỉnh; null khi không có giờ sinh. */
  asc: ViTriCung | null;
  mc: ViTriCung | null;
  nha: NhaTronCung[] | null;
};

export const NAM_BAN_DO_TU = 1900;
export const NAM_BAN_DO_DEN = 2100;

export type DauVaoBanDo = {
  nam: number; thang: number; ngay: number;
  /** Bỏ trống khi không biết giờ sinh. */
  gio?: number; phut?: number;
  noiSinh: Tinh | { ten: string; viDo: number; kinhDo: number };
  /** Độ lệch múi giờ người dùng chọn (giây); bỏ trống thì dùng mucGioMacDinh. */
  lechGiay?: number;
};

const NGAY_MS = 86_400_000;

export function ngayHopLe(nam: number, thang: number, ngay: number): boolean {
  if (!Number.isInteger(nam) || !Number.isInteger(thang) || !Number.isInteger(ngay)) return false;
  if (nam < NAM_BAN_DO_TU || nam > NAM_BAN_DO_DEN || thang < 1 || thang > 12 || ngay < 1) return false;
  return ngay <= new Date(Date.UTC(nam, thang, 0)).getUTCDate();
}

export function lapBanDo(v: DauVaoBanDo): BanDoSao {
  if (!ngayHopLe(v.nam, v.thang, v.ngay)) throw new RangeError('Ngày sinh không hợp lệ hoặc ngoài khoảng 1900–2100');
  const coGio = v.gio !== undefined;
  const gio = coGio ? v.gio! : 12, phut = coGio ? (v.phut ?? 0) : 0;
  if (!Number.isInteger(gio) || gio < 0 || gio > 23 || !Number.isInteger(phut) || phut < 0 || phut > 59) throw new RangeError('Giờ sinh không hợp lệ');
  const ns = 'tinh' in v.noiSinh ? { ten: v.noiSinh.tinh, viDo: v.noiSinh.viDo, kinhDo: v.noiSinh.kinhDo } : v.noiSinh;
  const mucGio = mucGioMacDinh(v.nam, v.thang, v.ngay, gio, phut, ns.viDo);
  const lechGiay = v.lechGiay ?? mucGio.lechGiay;
  const dongHo = Date.UTC(v.nam, v.thang - 1, v.ngay, gio, phut);
  const luc = new Date(dongHo - lechGiay * 1000);

  const goc = coGio ? gocChieu(luc, ns.viDo, ns.kinhDo) : null;
  const asc = goc ? viTri(goc.asc) : null;
  const mc = goc ? viTri(goc.mc) : null;
  const nha = asc ? Array.from({ length: 12 }, (_, i) => ({ so: i + 1, cung: cungTheoThu(asc.cung.thu + i) })) : null;

  const thienThe = THIEN_THE.map((tt): ViTriThienThe => {
    const k = kinhDoThienThe(tt.body, luc);
    const p = viTri(k);
    const nghich = tt.body !== Body.Sun && tt.body !== Body.Moon
      && lechGoc(kinhDoThienThe(tt.body, new Date(luc.getTime() + NGAY_MS)), kinhDoThienThe(tt.body, new Date(luc.getTime() - NGAY_MS))) < 0;
    const kq: ViTriThienThe = {
      ...p, thienThe: tt, nghich,
      nha: asc ? ((p.cung.thu - asc.cung.thu + 12) % 12) + 1 : null,
      phamVi: tt.coDien ? phamVi(tt.ten, p.cung) : null,
    };
    if (!coGio && tt.body === Body.Moon) {
      const dau = dongHo - 12 * 3600_000 - lechGiay * 1000;
      kq.trongNgay = { tu: viTri(kinhDoThienThe(Body.Moon, new Date(dau))), den: viTri(kinhDoThienThe(Body.Moon, new Date(dau + NGAY_MS - 60_000))) };
    }
    return kq;
  });

  return { luc, coGio, mucGio, lechGiay, noiSinh: ns, thienThe, asc, mc, nha };
}

/** "15°23′ Bạch Dương" (làm tròn xuống tới phút cung). */
export function vietViTri(p: ViTriCung): string {
  const phutCung = Math.floor(p.doTrongCung * 60 + 1e-9);
  return `${Math.floor(phutCung / 60)}°${String(phutCung % 60).padStart(2, '0')}′ ${p.cung.ten}`;
}

// ---------- Lời sách ----------

/** Tetrabiblos quyển I ch. IV: câu mở đầu về tính chất từng thiên thể cổ. */
export const TRICH_THIEN_THE: Record<HanhTinh, TrichAnh> = {
  'Mặt Trời': { en: 'The Sun is found to produce heat and moderate dryness.', vi: 'Mặt Trời được thấy là sinh ra nóng và khô vừa phải.', chuong: 'IV', trang: 13 },
  'Mặt Trăng': { en: 'The Moon principally generates moisture; her proximity to the earth renders her highly capable of exciting damp vapours, and of thus operating sensibly upon animal bodies by relaxation and putrefaction.', vi: 'Mặt Trăng chủ yếu sinh ra ẩm; vì ở gần trái đất nên rất dễ bốc lên hơi ẩm, và do đó tác động rõ lên cơ thể sinh vật, làm mềm nhão và làm thối rữa.', chuong: 'IV', trang: 13 },
  'Sao Thổ': { en: 'Saturn produces cold and dryness, for he is most remote both from the Sun’s heat and from the earth’s vapours.', vi: 'Sao Thổ sinh ra lạnh và khô, vì ở xa nhất cả sức nóng của Mặt Trời lẫn hơi ẩm của trái đất.', chuong: 'IV', trang: 13 },
  'Sao Hỏa': { en: 'Mars chiefly causes dryness, and is also strongly heating, by means of his own fiery nature, which is indicated by his colour, and in consequence of his vicinity to the Sun; the sphere of which is immediately below him.', vi: 'Sao Hỏa chủ yếu gây khô, và cũng rất nóng, do tính lửa của chính nó, điều mà màu sắc của nó cho thấy, và do ở gần Mặt Trời, tầng của Mặt Trời nằm ngay dưới nó.', chuong: 'IV', trang: 13 },
  'Sao Mộc': { en: 'Jupiter revolves in an intermediate sphere between the extreme cold of Saturn and the burning heat of Mars, and has consequently a temperate influence: he therefore at once promotes both warmth and moisture.', vi: 'Sao Mộc đi trên tầng ở giữa cái lạnh cực độ của Sao Thổ và cái nóng cháy của Sao Hỏa, nên có ảnh hưởng ôn hòa: vì vậy cùng lúc làm ấm và làm ẩm.', chuong: 'IV', trang: 13 },
  'Sao Kim': { en: 'To Venus also the same temperate quality belongs, although it exists conversely; since the heat she produces by her vicinity to the Sun is not so great as the moisture which she generates by the magnitude of her light, and by appropriating to herself the moist vapours of the earth, in the same manner that the Moon does.', vi: 'Sao Kim cũng có tính ôn hòa như vậy, nhưng theo chiều ngược lại; vì sức nóng nó sinh ra do gần Mặt Trời không lớn bằng độ ẩm nó sinh ra nhờ ánh sáng lớn và nhờ thu lấy hơi ẩm của trái đất, giống như Mặt Trăng.', chuong: 'IV', trang: 13 },
  'Sao Thủy': { en: 'Mercury sometimes produces dryness, and at other times moisture, and each with equal vigour.', vi: 'Sao Thủy khi thì sinh ra khô, khi thì sinh ra ẩm, mỗi bên đều mạnh như nhau.', chuong: 'IV', trang: 13 },
};

/** Tetrabiblos quyển I ch. XIII: góc mọc và thiên đỉnh (nguyên văn, kể cả chữ "meridan" của bản in; trang hiện `vi`). */
export const TRICH_GOC: { asc: TrichAnh; mc: TrichAnh } = {
  asc: { en: 'the eastern point, or angle of the ascendant, is chiefly dry in its nature; because, on the Sun’s arrival therein, the damps occasioned by the night begin to be dried up', vi: 'điểm phía đông, tức góc mọc, chủ yếu có tính khô; vì khi Mặt Trời tới đó, hơi ẩm do ban đêm gây ra bắt đầu khô đi', chuong: 'XIII', trang: 21 },
  mc: { en: 'The southern point, or angle of the mid-heaven, is the most hot; because the Sun’s meridan position, which produces greater warmth and heat, declines (in this part of the earth) towards the south.', vi: 'Điểm phía nam, tức góc thiên đỉnh, là nóng nhất; vì vị trí giữa trưa của Mặt Trời, nơi sinh ra ấm và nóng nhiều hơn, nghiêng (ở phần này của trái đất) về phía nam.', chuong: 'XIII', trang: 21 },
};

export const GHI_CHU_NHA =
  'Nhà ở đây chia theo cách trọn cung: nhà 1 là cả cung chứa điểm mọc, nhà 2 là cung kế tiếp, cứ thế đủ 12. Đây là cách chia xưa nhất; các phần mềm phương Tây hiện nay hay dùng cách Placidus nên số nhà có thể khác. Tetrabiblos không đặt tên hay nghĩa cho 12 nhà, nên trang chỉ ghi số nhà.';

export const GHI_CHU_KHONG_GIO =
  'Không có giờ sinh thì không tính được cung mọc, thiên đỉnh và nhà. Vị trí các hành tinh lấy lúc 12:00; Mặt Trăng đi khoảng 13° mỗi ngày nên trang ghi khoảng từ đầu tới cuối ngày.';

export const GHI_CHU_NOI_SINH =
  'Nơi sinh chỉ dùng tọa độ tỉnh lỵ. Sinh cách tỉnh lỵ 50 km theo chiều Đông Tây thì điểm mọc xê dịch chừng nửa độ (0,4° tới 0,7°), chỉ đổi cung khi điểm mọc nằm sát ranh giới hai cung.';

export const DUONG_DAN_BAN_DO = '/chiem-tinh/ban-do-sao';
