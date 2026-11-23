// Dữ liệu cụm Lịch đợt P2 (Lệnh 47): giờ hoàng đạo, 24 tiết khí, ngày lễ âm lịch.
// - Giờ hoàng đạo: Hiệp kỷ biện phương thư quyển 5 (Kanripo KR3g0051, đoạn 5889): "ngày Tý thì giờ Thân khởi Thanh long".
//   Kết quả phải khớp bảng 6 mẫu GIO_HD đang dùng ở lich.ts (có test).
// - 24 tiết khí: thời điểm theo kinh độ Mặt Trời (VSOP87D, src/lib/tuvi-v2/tiet-khi.mjs), giờ Việt Nam.
//   72 hậu: Hiệp kỷ quyển 1 dẫn Cấp trủng Chu thư (đoạn 5765, 5767). Dịch nghĩa: xemboi. Hậu tả khí hậu
//   lưu vực Hoàng Hà, không phải Việt Nam: trang phải ghi rõ.
// - Ngày lễ: ngày âm cố định, đổi sang dương theo thuật toán Hồ Ngọc Đức (múi giờ +7); không tính tháng nhuận.
// Không có lời phong tục, mâm cúng: chưa có nguồn duyệt (viec-can-anh).
import { DIA_CHI, KHUNG_GIO, amSangDuong, canChiNam, duongSangAm, soNgayJulius, tuSoNgayJulius } from '@/lib/tuvi-v2/am-lich';
import { lietKeTietKhi } from '@/lib/tuvi-v2/tiet-khi.mjs';
import { NGUON_XEM_NGAY, THAN_12, chiKhoiThanhLong } from './xem-ngay';
import { THU, ngayHienTaiVN, ngayLich, type ChiTietNgay } from './lich';

const hai = (n: number) => String(n).padStart(2, '0');

export const NAM_LICH_MUA_TU = 2020;
export const NAM_LICH_MUA_DEN = 2035;

// ---------- Giờ hoàng đạo ----------

export const TRICH_GIO_HOANG_DAO = {
  nguon: NGUON_XEM_NGAY.hiepKy,
  doanId: 5889,
  viTriViet: 'Quyển 5 · Nhật thời tổng loại · Hoàng đạo, hắc đạo',
  nguyenVan:
    '黄黑二道者黄道六黑道六共十有二以配十有二辰一青龍二明堂三天刑四朱雀五金匱六天徳七白虎八玉堂九天牢十元武十一司命十二勾陳其法則寅申青龍起子卯酉起寅辰戌起辰巳亥起午子午起申丑未起戌順行十二辰月起日則建寅之月子日為青龍丑日為明堂日起時則子日申時起青龍酉時為明堂依次順數',
  dich:
    'Hoàng đạo và hắc đạo: hoàng đạo sáu, hắc đạo sáu, cộng mười hai, phối với mười hai chi. Một Thanh long, hai Minh đường, ba Thiên hình, bốn Chu tước, năm Kim quỹ, sáu Thiên đức, bảy Bạch hổ, tám Ngọc đường, chín Thiên lao, mười Huyền vũ, mười một Tư mệnh, mười hai Câu trần. Cách tính: Dần, Thân thì Thanh long khởi ở Tý; Mão, Dậu khởi ở Dần; Thìn, Tuất khởi ở Thìn; Tỵ, Hợi khởi ở Ngọ; Tý, Ngọ khởi ở Thân; Sửu, Mùi khởi ở Tuất; đi thuận mười hai chi. Lấy tháng khởi ngày thì tháng Dần, ngày Tý là Thanh long, ngày Sửu là Minh đường; lấy ngày khởi giờ thì ngày Tý, giờ Thân khởi Thanh long, giờ Dậu là Minh đường, cứ thế đếm thuận.',
} as const;

export const GHI_CHU_GIO_HOANG_DAO =
  'Giờ hoàng đạo là quy ước chọn giờ của sách lịch, không phải phép đo thiên văn. Chính Hiệp kỷ (quyển 7) nhận xét: không có lẽ nào chỉ lấy sáu chi ấy làm hoàng đạo; tên "hoàng đạo, hắc đạo" chỉ là tên khác của tốt và xấu. Giờ Tý tính từ 23:00 hôm trước.';

export type GioThan = {
  chiSo: number;
  chi: string;
  khung: string;
  canChi: string;
  than: string;
  hoangDao: boolean;
};

/** Thần của giờ `chiGio` trong ngày có chi `chiNgay` (0 = Tý), theo Hiệp kỷ quyển 5. */
export function thanCuaGio(chiNgay: number, chiGio: number) {
  return THAN_12[(((chiGio - chiKhoiThanhLong(chiNgay)) % 12) + 12) % 12];
}

export type GioHoangDaoNgay = {
  ngay: ChiTietNgay;
  gio: GioThan[];
  hoangDao: GioThan[];
  /** "Tý, Sửu, Mão, Ngọ, Thân, Dậu" */
  tomTat: string;
};

export function gioHoangDaoNgay(d: number, m: number, y: number): GioHoangDaoNgay {
  const ngay = ngayLich(d, m, y);
  const c = ngay.canChiNgay.chi;
  const gio: GioThan[] = ngay.gio.map((g, i) => {
    const t = thanCuaGio(c, i);
    return { chiSo: i, chi: g.chi, khung: g.khung, canChi: g.canChi, than: t.ten, hoangDao: t.hoangDao };
  });
  const hoangDao = gio.filter((g) => g.hoangDao);
  return { ngay, gio, hoangDao, tomTat: hoangDao.map((g) => g.chi).join(', ') };
}

export function gioHoangDaoHomNay(luc = new Date()): GioHoangDaoNgay {
  const h = ngayHienTaiVN(luc);
  return gioHoangDaoNgay(h.ngay, h.thang, h.nam);
}

export type DongBangGio = { chiNgay: string[]; gio: { chi: string; khung: string; than: string }[] };

/** Bảng 6 dòng: mỗi cặp chi ngày xung nhau có chung 6 giờ hoàng đạo. Thứ tự Tý/Ngọ, Sửu/Mùi, … */
export function bangGioHoangDao(): DongBangGio[] {
  return [0, 1, 2, 3, 4, 5].map((c) => ({
    chiNgay: [DIA_CHI[c], DIA_CHI[c + 6]],
    gio: DIA_CHI.map((chi, i) => ({ chi, khung: KHUNG_GIO[i], than: thanCuaGio(c, i) }))
      .filter((g) => g.than.hoangDao)
      .map((g) => ({ chi: g.chi, khung: g.khung, than: g.than.ten })),
  }));
}

// ---------- 24 tiết khí ----------

export type Hau = { nguyenVan: string; dich: string };
export type TietKhi = {
  slug: string;
  ten: string;
  /** Kinh độ Mặt Trời (độ). */
  kinhDo: number;
  /** 'tiet': tiết đầu tháng (đổi tháng trong bát tự, xem ngày); 'khi': trung khí giữa tháng. */
  loai: 'tiet' | 'khi';
  /** Tháng âm theo tiết mà tiết khí này thuộc về, 1 = tháng Giêng (Dần). */
  thangTiet: number;
  /** Nghĩa của tên (dịch chữ). */
  nghiaTen: string;
  hau: [Hau, Hau, Hau];
};

const H = (nguyenVan: string, dich: string): Hau => ({ nguyenVan, dich });

/** Thứ tự bắt đầu từ Lập xuân (315°), như lịch Á Đông. */
export const TIET_KHI_24: TietKhi[] = [
  { slug: 'lap-xuan', ten: 'Lập xuân', kinhDo: 315, loai: 'tiet', thangTiet: 1, nghiaTen: 'Bắt đầu mùa xuân',
    hau: [H('東風解凍', 'Gió đông làm tan băng'), H('蟄蟲始振', 'Sâu bọ ngủ đông bắt đầu cựa mình'), H('魚上冰', 'Cá ngoi lên sát lớp băng')] },
  { slug: 'vu-thuy', ten: 'Vũ thủy', kinhDo: 330, loai: 'khi', thangTiet: 1, nghiaTen: 'Mưa xuân, băng tuyết tan thành nước',
    hau: [H('獺祭魚', 'Rái cá bắt cá bày ra như bày lễ'), H('鴻雁來', 'Chim hồng nhạn bay về'), H('草木萌動', 'Cây cỏ nảy mầm')] },
  { slug: 'kinh-trap', ten: 'Kinh trập', kinhDo: 345, loai: 'tiet', thangTiet: 2, nghiaTen: 'Sâu bọ ngủ đông giật mình thức dậy',
    hau: [H('桃始華', 'Hoa đào bắt đầu nở'), H('倉庚鳴', 'Chim vàng anh hót'), H('鷹化為鳩', 'Chim ưng hóa thành chim cưu (lời sách xưa)')] },
  { slug: 'xuan-phan', ten: 'Xuân phân', kinhDo: 0, loai: 'khi', thangTiet: 2, nghiaTen: 'Giữa mùa xuân, ngày và đêm dài gần bằng nhau',
    hau: [H('元鳥至', 'Chim én bay đến'), H('雷乃發聲', 'Sấm bắt đầu vang'), H('始電', 'Bắt đầu có chớp')] },
  { slug: 'thanh-minh', ten: 'Thanh minh', kinhDo: 15, loai: 'tiet', thangTiet: 3, nghiaTen: 'Trời trong, sáng sủa',
    hau: [H('桐始華', 'Cây ngô đồng ra hoa'), H('田鼠化為鴽', 'Chuột đồng hóa thành chim cút (lời sách xưa)'), H('虹始見', 'Cầu vồng bắt đầu hiện')] },
  { slug: 'coc-vu', ten: 'Cốc vũ', kinhDo: 30, loai: 'khi', thangTiet: 3, nghiaTen: 'Mưa cho lúa và các loại hạt',
    hau: [H('萍始生', 'Bèo bắt đầu mọc'), H('鳴鳩拂其羽', 'Chim cưu rũ cánh'), H('戴勝降于桑', 'Chim đầu rìu đậu xuống cây dâu')] },
  { slug: 'lap-ha', ten: 'Lập hạ', kinhDo: 45, loai: 'tiet', thangTiet: 4, nghiaTen: 'Bắt đầu mùa hạ',
    hau: [H('螻蟈鳴', 'Ếch nhái kêu'), H('蚯蚓岀', 'Giun đất ngoi lên'), H('王瓜生', 'Dây vương qua (dưa trời) mọc')] },
  { slug: 'tieu-man', ten: 'Tiểu mãn', kinhDo: 60, loai: 'khi', thangTiet: 4, nghiaTen: 'Hạt lúa bắt đầu mẩy nhưng chưa đầy',
    hau: [H('苦菜秀', 'Rau đắng ra hoa'), H('靡草死', 'Các loài cỏ mềm lụi tàn'), H('小暑至', 'Cái nóng nhẹ đến')] },
  { slug: 'mang-chung', ten: 'Mang chủng', kinhDo: 75, loai: 'tiet', thangTiet: 5, nghiaTen: 'Gieo trồng lúa, các loại hạt có râu',
    hau: [H('螳螂生', 'Bọ ngựa nở'), H('鵙始鳴', 'Chim bách thanh bắt đầu kêu'), H('反舌無聲', 'Chim bách thiệt im tiếng')] },
  { slug: 'ha-chi', ten: 'Hạ chí', kinhDo: 90, loai: 'khi', thangTiet: 5, nghiaTen: 'Giữa mùa hạ, ngày dài nhất năm ở Bắc bán cầu',
    hau: [H('鹿角解', 'Hươu rụng sừng'), H('蜩始鳴', 'Ve sầu bắt đầu kêu'), H('半夏生', 'Cây bán hạ mọc')] },
  { slug: 'tieu-thu', ten: 'Tiểu thử', kinhDo: 105, loai: 'tiet', thangTiet: 6, nghiaTen: 'Nóng vừa',
    hau: [H('溫風至', 'Gió ấm thổi đến'), H('蟋蟀居壁', 'Dế ẩn trong vách'), H('鷹乃學習', 'Chim ưng non tập bay')] },
  { slug: 'dai-thu', ten: 'Đại thử', kinhDo: 120, loai: 'khi', thangTiet: 6, nghiaTen: 'Nóng gắt',
    hau: [H('腐草為螢', 'Cỏ mục hóa đom đóm (lời sách xưa)'), H('土潤溽暑', 'Đất ẩm, khí trời oi nồng'), H('大雨時行', 'Mưa lớn từng đợt')] },
  { slug: 'lap-thu', ten: 'Lập thu', kinhDo: 135, loai: 'tiet', thangTiet: 7, nghiaTen: 'Bắt đầu mùa thu',
    hau: [H('凉風至', 'Gió mát thổi đến'), H('白露降', 'Sương trắng xuống'), H('寒蟬鳴', 'Ve mùa lạnh kêu')] },
  { slug: 'xu-thu', ten: 'Xử thử', kinhDo: 150, loai: 'khi', thangTiet: 7, nghiaTen: 'Hết nóng',
    hau: [H('鷹乃祭鳥', 'Chim ưng bắt chim bày ra như bày lễ'), H('天地始肅', 'Trời đất bắt đầu se lạnh'), H('禾乃登', 'Lúa chín')] },
  { slug: 'bach-lo', ten: 'Bạch lộ', kinhDo: 165, loai: 'tiet', thangTiet: 8, nghiaTen: 'Sương trắng',
    hau: [H('鴻雁來', 'Chim hồng nhạn bay đến'), H('元鳥歸', 'Chim én bay đi'), H('羣鳥養羞', 'Bầy chim trữ thức ăn')] },
  { slug: 'thu-phan', ten: 'Thu phân', kinhDo: 180, loai: 'khi', thangTiet: 8, nghiaTen: 'Giữa mùa thu, ngày và đêm dài gần bằng nhau',
    hau: [H('雷始收聲', 'Sấm bắt đầu tắt tiếng'), H('蟄蟲坏戸', 'Sâu bọ đắp đất bít cửa hang'), H('水始涸', 'Nước bắt đầu cạn')] },
  { slug: 'han-lo', ten: 'Hàn lộ', kinhDo: 195, loai: 'tiet', thangTiet: 9, nghiaTen: 'Sương lạnh',
    hau: [H('鴻雁來賓', 'Chim hồng nhạn đến làm khách'), H('爵入大水為蛤', 'Chim sẻ xuống nước lớn hóa con nghêu (lời sách xưa)'), H('菊有黃華', 'Cúc nở hoa vàng')] },
  { slug: 'suong-giang', ten: 'Sương giáng', kinhDo: 210, loai: 'khi', thangTiet: 9, nghiaTen: 'Sương muối xuống',
    hau: [H('豺乃祭獸', 'Chó sói bắt thú bày ra như bày lễ'), H('草木黃落', 'Cây cỏ úa vàng, rụng lá'), H('蟄蟲咸俯', 'Sâu bọ đều nằm im')] },
  { slug: 'lap-dong', ten: 'Lập đông', kinhDo: 225, loai: 'tiet', thangTiet: 10, nghiaTen: 'Bắt đầu mùa đông',
    hau: [H('水始冰', 'Nước bắt đầu đóng băng'), H('地始凍', 'Đất bắt đầu đông cứng'), H('雉入大水為蜃', 'Chim trĩ xuống nước lớn hóa con trai lớn (lời sách xưa)')] },
  { slug: 'tieu-tuyet', ten: 'Tiểu tuyết', kinhDo: 240, loai: 'khi', thangTiet: 10, nghiaTen: 'Tuyết nhỏ',
    hau: [H('虹藏不見', 'Cầu vồng ẩn, không thấy nữa'), H('天氣上騰地氣下降', 'Khí trời bốc lên, khí đất hạ xuống'), H('閉塞而成冬', 'Trời đất đóng kín, thành mùa đông')] },
  { slug: 'dai-tuyet', ten: 'Đại tuyết', kinhDo: 255, loai: 'tiet', thangTiet: 11, nghiaTen: 'Tuyết lớn',
    hau: [H('鶚鳥不鳴', 'Chim hạt đán thôi kêu'), H('虎始交', 'Hổ bắt đầu giao phối'), H('茘挺生', 'Cỏ lệ trổ mầm')] },
  { slug: 'dong-chi', ten: 'Đông chí', kinhDo: 270, loai: 'khi', thangTiet: 11, nghiaTen: 'Giữa mùa đông, ngày ngắn nhất năm ở Bắc bán cầu',
    hau: [H('蚯蚓結', 'Giun đất cuộn mình'), H('麋角解', 'Nai rụng sừng'), H('水泉動', 'Mạch nước ngầm bắt đầu chảy')] },
  { slug: 'tieu-han', ten: 'Tiểu hàn', kinhDo: 285, loai: 'tiet', thangTiet: 12, nghiaTen: 'Rét vừa',
    hau: [H('雁北向', 'Chim nhạn hướng về phương bắc'), H('鵲始巢', 'Chim khách bắt đầu làm tổ'), H('雉始雊', 'Chim trĩ bắt đầu gáy')] },
  { slug: 'dai-han', ten: 'Đại hàn', kinhDo: 300, loai: 'khi', thangTiet: 12, nghiaTen: 'Rét đậm',
    hau: [H('鷄始乳', 'Gà bắt đầu ấp nở'), H('鷙鳥厲疾', 'Chim săn mồi bay nhanh, dữ'), H('水澤腹堅', 'Nước đầm đóng băng tới đáy')] },
];

export const NGUON_72_HAU = {
  nguon: NGUON_XEM_NGAY.hiepKy,
  doanId: [5765, 5767] as const,
  viTriViet: 'Quyển 1 · Tượng số bản yếu · dẫn Cấp trủng Chu thư',
  ketLuanNguyenVan: '是則五日一候一月六候一嵗七十二候所以驗天地之氣觀鳥獸草木之時',
  ketLuanDich:
    'Vậy năm ngày là một hậu, một tháng sáu hậu, một năm bảy mươi hai hậu; dùng để nghiệm khí trời đất, xem thời của chim muông cây cỏ. Nhưng mặt trời đi có nhanh chậm, nên khoảng giữa các hậu có khi bốn ngày, có khi sáu ngày.',
  ghiChuDiaLy:
    'Bảy mươi hai hậu tả thời tiết, cây cỏ, chim muông ở lưu vực Hoàng Hà (Trung Quốc) hơn hai nghìn năm trước, không phải khí hậu Việt Nam. Ở đây chỉ dịch để biết sách xưa ghi gì.',
  ghiChuTietKhi:
    'Tiết khí tính theo vị trí Mặt Trời: mỗi khi kinh độ Mặt Trời tăng 15° là sang một tiết khí. Nên tiết khí rơi vào gần như cùng ngày dương lịch mỗi năm, còn ngày âm lịch thì xê dịch.',
} as const;

export const TRICH_TIET_THANG = {
  nguon: NGUON_XEM_NGAY.hiepKy,
  doanId: 6557,
  viTriViet: 'Quyển 20 · Nguyệt biểu',
  nguyenVan: '立春正月節',
  dich: 'Lập xuân là tiết của tháng Giêng.',
  giaiThich:
    'Mười hai "tiết" mở đầu mười hai tháng theo tiết (Lập xuân mở tháng Giêng, Kinh trập mở tháng Hai, …); mười hai "trung khí" nằm giữa tháng. Bát tự và các phép chọn ngày đổi tháng ở tiết, không ở ngày mùng 1 âm lịch.',
} as const;

const TEN_THANG = ['', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Chạp'];
export const tenThangTiet = (t: number) => `tháng ${TEN_THANG[t]} (tháng ${DIA_CHI[(t + 1) % 12]})`;

export const tietTheoSlug = (slug: string) => TIET_KHI_24.find((t) => t.slug === slug);

export type MocTiet = {
  slug: string;
  ten: string;
  /** 'YYYY-MM-DD' giờ Việt Nam. */
  ngay: string;
  /** 'HH:mm' giờ Việt Nam. */
  gio: string;
  thu: string;
  iso: string;
};

const ganMoc = (t: TietKhi, d: Date): MocTiet => {
  const v = new Date(d.getTime() + 7 * 3600_000);
  const ngay = `${v.getUTCFullYear()}-${hai(v.getUTCMonth() + 1)}-${hai(v.getUTCDate())}`;
  const jdn = soNgayJulius(v.getUTCDate(), v.getUTCMonth() + 1, v.getUTCFullYear());
  return { slug: t.slug, ten: t.ten, ngay, gio: `${hai(v.getUTCHours())}:${hai(v.getUTCMinutes())}`, thu: THU[(jdn + 1) % 7], iso: d.toISOString() };
};

/** 24 tiết khí trong năm dương `nam`, theo thời gian. */
export function tietKhiTrongNam(nam: number): MocTiet[] {
  const ds: { kinhDo: number; thoiDiem: Date }[] = lietKeTietKhi(nam);
  return ds
    .map((m) => ganMoc(TIET_KHI_24.find((t) => t.kinhDo === m.kinhDo)!, m.thoiDiem))
    .sort((a, b) => a.iso.localeCompare(b.iso));
}

/** Thời điểm một tiết khí trong năm dương `nam`. */
export function mocTiet(slug: string, nam: number): MocTiet | undefined {
  return tietKhiTrongNam(nam).find((m) => m.slug === slug);
}

/** Tiết khí đang hiệu lực và tiết kế tiếp tại thời điểm `luc`. */
export function tietHienTai(luc = new Date()): { dang: MocTiet; ke: MocTiet } {
  const nam = new Date(luc.getTime() + 7 * 3600_000).getUTCFullYear();
  const ds = [...tietKhiTrongNam(nam - 1), ...tietKhiTrongNam(nam), ...tietKhiTrongNam(nam + 1)];
  const t = luc.toISOString();
  let i = ds.findIndex((m) => m.iso > t);
  if (i <= 0) i = 1;
  return { dang: ds[i - 1], ke: ds[i] };
}

export function tietKe(slug: string): { truoc: TietKhi; sau: TietKhi } {
  const i = TIET_KHI_24.findIndex((t) => t.slug === slug);
  return { truoc: TIET_KHI_24[(i + 23) % 24], sau: TIET_KHI_24[(i + 1) % 24] };
}

// ---------- Ngày lễ âm lịch ----------

export type LeAm = {
  slug: string;
  ten: string;
  /** Ngày, tháng âm; tháng 12 ngày 0 nghĩa là ngày cuối tháng Chạp (Giao thừa). */
  ngayAm: number;
  thangAm: number;
  tenKhac?: string;
  /** Trang riêng ngoài cụm (vd Tết đã có /tet). */
  trangRieng?: string;
};

export const LE_AM_NAM: LeAm[] = [
  { slug: 'tet-nguyen-dan', ten: 'Tết Nguyên Đán', ngayAm: 1, thangAm: 1, trangRieng: '/tet' },
  { slug: 'via-than-tai', ten: 'Vía Thần Tài', ngayAm: 10, thangAm: 1 },
  { slug: 'ram-thang-gieng', ten: 'Rằm tháng Giêng', ngayAm: 15, thangAm: 1, tenKhac: 'Tết Nguyên tiêu' },
  { slug: 'tet-han-thuc', ten: 'Tết Hàn thực', ngayAm: 3, thangAm: 3 },
  { slug: 'gio-to-hung-vuong', ten: 'Giỗ Tổ Hùng Vương', ngayAm: 10, thangAm: 3 },
  { slug: 'phat-dan', ten: 'Lễ Phật đản', ngayAm: 15, thangAm: 4 },
  { slug: 'tet-doan-ngo', ten: 'Tết Đoan ngọ', ngayAm: 5, thangAm: 5 },
  { slug: 'ram-thang-7', ten: 'Rằm tháng Bảy', ngayAm: 15, thangAm: 7, tenKhac: 'Lễ Vu Lan' },
  { slug: 'trung-thu', ten: 'Tết Trung thu', ngayAm: 15, thangAm: 8, tenKhac: 'Rằm tháng Tám' },
  { slug: 'ong-cong-ong-tao', ten: 'Ông Công ông Táo', ngayAm: 23, thangAm: 12 },
  { slug: 'giao-thua', ten: 'Giao thừa', ngayAm: 0, thangAm: 12, tenKhac: 'Đêm cuối tháng Chạp' },
];

export const GHI_CHU_LE =
  'Ngày dương tính bằng thuật toán âm lịch Việt Nam (múi giờ UTC+7), nên có năm lệch một ngày so với lịch Trung Quốc (UTC+8). Năm có tháng nhuận, lễ vẫn tính theo tháng chính, không theo tháng nhuận. Giao thừa là đêm ngày cuối tháng Chạp, tháng Chạp có thể 29 hoặc 30 ngày.';

export const leTheoSlug = (slug: string) => LE_AM_NAM.find((l) => l.slug === slug);

export type LeTrongNamAm = {
  slug: string;
  ten: string;
  namAm: number;
  canChiNam: string;
  /** '15/1' */
  am: string;
  /** 'YYYY-MM-DD' */
  duong: string;
  thu: string;
};

/** Ngày dương của lễ `le` trong năm âm `namAm`. */
export function ngayLeTrongNamAm(le: LeAm, namAm: number): LeTrongNamAm | null {
  let dg: { ngay: number; thang: number; nam: number } | null;
  let ngayAm = le.ngayAm;
  if (ngayAm === 0) {
    const tetSau = amSangDuong(1, 1, namAm + 1);
    if (!tetSau) return null;
    dg = tuSoNgayJulius(soNgayJulius(tetSau.ngay, tetSau.thang, tetSau.nam) - 1);
    ngayAm = duongSangAm(dg.ngay, dg.thang, dg.nam).ngay;
  } else {
    dg = amSangDuong(ngayAm, le.thangAm, namAm);
    if (!dg) return null;
  }
  const jdn = soNgayJulius(dg.ngay, dg.thang, dg.nam);
  return {
    slug: le.slug, ten: le.ten, namAm, canChiNam: canChiNam(namAm).ten,
    am: `${ngayAm}/${le.thangAm}`,
    duong: `${dg.nam}-${hai(dg.thang)}-${hai(dg.ngay)}`,
    thu: THU[(jdn + 1) % 7],
  };
}

/** Các lễ trong năm âm, theo thứ tự ngày dương. */
export function leTrongNamAm(namAm: number): LeTrongNamAm[] {
  return LE_AM_NAM.map((l) => ngayLeTrongNamAm(l, namAm)).filter((x): x is LeTrongNamAm => !!x)
    .sort((a, b) => a.duong.localeCompare(b.duong));
}

/** Một lễ qua các năm âm `tu`–`den`. */
export function leQuaCacNam(slug: string, tu = NAM_LICH_MUA_TU, den = NAM_LICH_MUA_DEN): LeTrongNamAm[] {
  const le = leTheoSlug(slug);
  if (!le) return [];
  const kq: LeTrongNamAm[] = [];
  for (let n = tu; n <= den; n++) {
    const x = ngayLeTrongNamAm(le, n);
    if (x) kq.push(x);
  }
  return kq;
}

/** Lần tới (tính cả hôm nay) của lễ, kèm giờ hoàng đạo ngày đó. */
export function leSapToi(slug: string, luc = new Date()): (LeTrongNamAm & { conNgay: number; gioHoangDao: string }) | null {
  const le = leTheoSlug(slug);
  if (!le) return null;
  const h = ngayHienTaiVN(luc);
  const homNay = `${h.nam}-${hai(h.thang)}-${hai(h.ngay)}`;
  const namAmNay = ngayLich(h.ngay, h.thang, h.nam).am.nam;
  for (const n of [namAmNay - 1, namAmNay, namAmNay + 1]) {
    const x = ngayLeTrongNamAm(le, n);
    if (x && x.duong >= homNay) {
      const [y, m, d] = x.duong.split('-').map(Number);
      const conNgay = soNgayJulius(d, m, y) - soNgayJulius(h.ngay, h.thang, h.nam);
      return { ...x, conNgay, gioHoangDao: gioHoangDaoNgay(d, m, y).tomTat };
    }
  }
  return null;
}
