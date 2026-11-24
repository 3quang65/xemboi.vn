// Văn khấn theo *Gia lễ giản yếu* (Dương Bá Trạc soạn, Đông-Tây Ấn-quán, Hà Nội, 4/1932).
// Dùng cho /van-khan/ngay-gio, và dùng lại ở /van-khan/gia-tien, /van-khan/cung-tuan-49-ngay.
// Vì sao chọn nguồn này: docs/v2/doi-chieu/van-khan-phong-tuc.md mục 0, 2.1, 4.1, 4.2.
//
// Văn bản lấy ngày 24/11/2026 từ bản chép vi.wikisource (wikitext các trang "Trang:Gia le gian yeu.pdf/5, 6, 14–19").
// Cách chép:
// - Giữ chính tả 1932 ("dỗ" = giỗ, "giồng" = trồng, "lậy", "giậy", "gập", "tiết lệ"…), giữ dấu gạch nối, giữ các chuỗi
//   dấu chấm làm chỗ điền tên đúng số chấm như bản chép.
// - Bỏ định dạng wiki (in đậm, in nghiêng, căn phải). Chú thích của tác giả (thẻ <ref>) tách sang `chuThich`,
//   `neoChuThich` là chữ mà chú thích gắn vào (nằm trong `van`, hoặc trong `ten`).
// - Lỗi gõ hiển nhiên đã sửa đều ghi ở comment ngay chỗ sửa. Chỗ ngờ mà không chắc thì giữ nguyên, có comment.
// - Sách không có chữ Hán trong các phần dưới đây (chữ Hán chỉ ở trang bìa 要簡禮家, không lấy).
// - Sách KHÔNG có lễ 49 ngày (chung thất), KHÔNG có văn khấn hằng ngày, KHÔNG có Thần Tài.

export const NGUON_GIA_LE = {
  tenSach: 'Gia lễ giản yếu',
  tacGia: 'Dương Bá Trạc',
  nam: 1932,
  nhaIn: 'Đông-Tây Ấn-quán, 193 phố Hàng Bông, Hà Nội (in tháng 4/1932)',
  giayPhep: 'Phạm vi công cộng (tác giả mất 1944). Bản chép trên Wikisource theo CC BY-SA 4.0.',
  ghiCong: 'Văn bản: Wikisource tiếng Việt, CC BY-SA 4.0',
  url: 'https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu',
} as const;

export const GHI_CHU_VAN_KHAN =
  'Bài văn trong sách Gia lễ giản yếu của Dương Bá Trạc, in năm 1932, soạn theo lối giản lược; lời văn khác các bài khấn phổ biến hiện nay. Trang chép nguyên văn, giữ chính tả của sách (như "dỗ" là giỗ), để tham khảo.';

const URL_VAN_KHAN = 'https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu/Văn_tế_và_văn_khấn';

// ---------- Trường điền ----------

/** Các chỗ trống trong sách. `xungHo` thay chữ tự xưng ("tôi", "hậu-tự", "tín-chủ"); chú thích của sách chỉ cách xưng. */
export type TruongDien = 'ngay' | 'thang' | 'nam' | 'xungHo' | 'ten' | 'vangLoi' | 'danhXung' | 'nhanVi';

export const TRUONG_DIEN: Record<TruongDien, string> = {
  ngay: 'Ngày',
  thang: 'Tháng',
  nam: 'Năm',
  xungHo: 'Tự xưng (thay chữ "tôi", ví dụ: tự tử, tự tôn, cô ai-tử)',
  ten: 'Tên người khấn',
  vangLoi: 'Vâng lời ai (người trên còn sống)',
  danhXung: 'Danh xưng người được khấn (ví dụ: hiển khảo tên… tự… hiệu…)',
  nhanVi: 'Nhân vì (lý do làm lễ)',
};

export type MaMau = 'tang-ong-ba-cha-me' | 'tang-chu-bac-anh-chi' | 'ngay-gio' | 'ngay-tiet-le' | 'than-trong-nha';

export type MauVanKhan = {
  ma: MaMau;
  ten: string;
  url: string;
  /** Số trang in trong sách (đầu trang "— 15 —"). */
  trangSach: number;
  /** Nguyên văn. Đoạn cách nhau bằng dòng trống. */
  van: string;
  /** Từng chuỗi dấu chấm trong `van`, theo thứ tự, là chỗ trống nào; `null` = dấu chấm không phải chỗ điền (bỏ lửng). */
  truong: (TruongDien | null)[];
  /** Chữ tự xưng trong `van` mà trường `xungHo` thay vào. */
  xungHoGoc: string;
  /** Chỗ sách không in dấu chấm nhưng chú thích bảo phải nói thêm: chèn giá trị ngay sau `neo`. */
  chenSau?: { neo: string; truong: TruongDien }[];
  chuThich?: string[];
  neoChuThich?: string[];
  /**
   * Chỉ mẫu "ngày tiết lệ": sách in tắt "Trộm nghĩ……" và chú thích "chỉ đổi hai chữ « kỵ nhật » làm hai chữ « tiết lệ »".
   * Đây là văn ráp theo đúng chú thích ấy (xemboi ráp, không phải sách in), trang phải ghi rõ.
   */
  vanTheoChuThich?: string;
  truongTheoChuThich?: (TruongDien | null)[];
};

const TROM_NGHI_GIO = 'Trộm nghĩ: đời nay ăn quả, người trước giồng cây. Công ơn để bụng, kỵ-nhật nhớ ngày. Kính dâng lễ mọn, xin chứng lòng ngay.';

export const MAU_VAN_KHAN: MauVanKhan[] = [
  {
    ma: 'tang-ong-ba-cha-me',
    ten: 'Văn tế (hoặc khấn) ông bà cha mẹ khi làm lễ tang',
    url: URL_VAN_KHAN,
    trangSach: 15,
    // "công tây hóa-dục": có thể là "công tầy" (tầy = bằng), nhưng không chắc nên giữ như bản chép.
    van:
      'Ngày... tháng.... năm... tôi tên... vâng lời... cùng cả nhà lớn nhỏ cúi xin dâng hương hoa dầu rượu kính cáo trước linh vị..... rằng: nhân vì.....\n\n' +
      'Trộm nghĩ: đức cả sinh thành, công tây hóa-dục, một phút bể dâu trăm năm sương móc. Tưởng nhớ âm dung, ngậm ngùi thương khóc, lễ điện ba tuần, ruột sầu chín khúc.\n\n' +
      'kính cáo.',
    truong: ['ngay', 'thang', 'nam', 'ten', 'vangLoi', 'danhXung', 'nhanVi'],
    xungHoGoc: 'tôi',
    neoChuThich: ['ông bà', 'tôi', 'vâng lời', 'linh vị', 'nhân vì'],
    chuThich: [
      'Cha mất rồi mà gặp tang ông bà thì cháu phải đứng chủ tang vào làm chủ lễ.',
      'Cha mẹ cùng mất rồi thì tự xưng là cô ai-tử. Mẹ mất mà cha còn thì tự xưng là ai-tử. Cha mất mà mẹ còn thì tự xưng là cô-tử. Cha mất rồi đứng chủ tang ông bà thì tự xưng là thừa trọng tôn.',
      'Gặp tang ông, cha mất rồi mà bà và mẹ còn thì nói vâng lời bà và mẹ. Tang mẹ mà còn cha thì nói vâng lời cha. Tang cha mà còn mẹ thì nói vâng lời mẹ. Không còn ai là người trên trong nhà nữa thì thôi không phải nói vâng lời ai.',
      'Tang ông thì kêu cố-tổ-phụ tên.... tự.... hiệu..... Tang bà thì kêu cố-tổ-mẫu tên.... tự.... hiệu... Tang cha thì kêu cố phụ tên.... tự... hiệu..... Tang mẹ thì kêu cố mẫu tên.... tự.... hiệu....',
      // Sửa: thêm dấu chấm trước "Lễ đại-tường" (bản chép "nên cáo lễ vậy Lễ đại-tường").
      'Lễ nhập quan thì nói nhân vì đến giờ nhập quan nên cáo lễ vậy. Lễ thành phục thì nói nhân vì ngày nay thành phục nên cáo lễ vậy. Lễ đem táng thì nói nhân vì ngày nay đem táng nên cáo lễ vậy. Lễ ngu (ba ngày) thì nói nhân vì tống táng xong rồi, phụng an thần vị, nên cáo lễ vậy. Lễ trăm ngày thì nói nhân vì ngày nay đến trăm ngày nên cáo lễ vậy. Lễ tiểu-tường (dỗ đầu) thì nói nhân vì đến ngày tiểu tường nên cáo lễ vậy. Lễ đại-tường (dỗ hết) thì nói nhân vì đến ngày đại-tường nên cáo lễ vậy. Lễ trừ phục thì nói nhân vì đến ngày trừ phục nên cáo lễ vậy.',
    ],
  },
  {
    ma: 'tang-chu-bac-anh-chi',
    ten: 'Văn tế (hoặc khấn) chú, bác, cô, dì, cậu, anh, em (không có con đến mình phải chủ tang) khi làm lễ táng',
    url: URL_VAN_KHAN,
    trangSach: 16,
    van:
      'Ngày..... tháng.... năm.... tôi tên.... cúi dâng hương hoa dầu rượu kính cáo trước linh vị..... rằng: nhân vì.....\n\n' +
      'Trộm nghĩ: di luân nghĩa trọng, cốt nhục tình thâm; vô thường một phút, cách biệt muôn năm. Kính dâng điện lễ, khôn xiết thương tâm.\n\n' +
      'Kính cáo',
    truong: ['ngay', 'thang', 'nam', 'ten', 'danhXung', 'nhanVi'],
    xungHoGoc: 'tôi',
    neoChuThich: ['tôi', 'linh vị', 'nhân vì'],
    chuThich: [
      'Tang bác chú thì tự xưng là điệt. Tang cô thì tự xưng là biểu điệt, Tang dì thì tự xưng là di-tử. Tang cậu thì tự xưng là sanh. Tang anh thì tự xưng là em. Tang em thì xưng là anh.',
      // Sửa: "ố thúc mẫu" → "cố thúc mẫu" (bản chép đã đánh dấu {{SIC|ố|cố}}).
      'Bác thì kêu là cố bá-phụ. Bác gái thì kêu là cố bá-mẫu. Chú thì kêu là cố thúc-phụ, Thím thì kêu là cố thúc mẫu. Cô thì kêu là cố cô-mẫu Dì thì kêu là cố di-mẫu. Cậu thì kêu là cố cữu-phụ. Anh thì xưng là cố huynh. Chị dâu thì xưng là cố tẩu. Chị ruột thì xưng là cố tỉ. Em ruột gái thì xưng là cố muội. Em thì xưng là cố đệ. Em dâu thì xưng là cố đệ-phụ.',
      'Cũng như bài trên, lễ nào thì nói nhân vì lễ ấy.',
    ],
  },
  {
    ma: 'ngay-gio',
    ten: 'Văn tế (hoặc khấn) ngày dỗ',
    url: URL_VAN_KHAN,
    trangSach: 16,
    van:
      'Ngày..... tháng.... năm..... tôi tên.... cùng cả nhà lớn nhỏ cúi dâng hương hoa dầu rượu kính cáo trước thần-vị..... rằng: nhân vì......\n\n' +
      TROM_NGHI_GIO + '\n\n' +
      'Kính cáo',
    truong: ['ngay', 'thang', 'nam', 'ten', 'danhXung', 'nhanVi'],
    xungHoGoc: 'tôi',
    neoChuThich: ['tôi', 'thần-vị', 'nhân vì'],
    chuThich: [
      'Dỗ ông bà trở lên thì tự xưng là tự tôn. Dỗ cha mẹ thì tự xưng là tự tử.',
      'Cụ tằng-tổ thì xưng hiển tằng tổ. Cụ bà tằng-tổ thì xưng tằng tổ tỉ; bà đích thì xưng đích tằng tổ tỉ, bà kế thì xưng kế tằng tổ tỉ, bà thứ thì xưng thứ tằng tổ tỉ. Ông thì xưng hiển tổ, bà thì xưng tổ tỉ, (bà đích thì xưng đích tổ tỉ, bà kế thì xưng kế tổ tỉ, bà thứ thì xưng thứ tổ tỉ). Cha thì xưng hiển khảo, mẹ thì xưng hiển tỉ (mẹ đích thì xưng đích hiển tỉ, mẹ kế thì xưng kế hiển tỉ, mẹ thứ thì xưng thứ hiển tỉ).',
      'Hôm tiền nhất nhật thì nói nhân vì mai đến ngày dỗ nên cáo lễ trước vậy. Hôm dỗ thì nói nhân vì nay là ngày dỗ nên cáo lễ vậy',
    ],
  },
  {
    ma: 'ngay-tiet-le',
    ten: 'Văn tế (hoặc khấn) ngày tiết lệ',
    url: URL_VAN_KHAN,
    trangSach: 17,
    // Bản chép không có chỗ trống sau "năm" ("năm hậu-tự tên……"), giữ nguyên; trường `nam` không điền được ở mẫu này.
    // Sách in tắt, không có "Kính cáo" ở cuối.
    van:
      'Ngày...... tháng...... năm hậu-tự tên...... cùng cả nhà lớn nhỏ cúi dâng hương hoa dầu rượu kính cáo trước thần vị các đấng cao tằng tổ khảo tỉ rằng: nhân vì......\n\n' +
      'Trộm nghĩ........',
    truong: ['ngay', 'thang', 'ten', 'nhanVi', null],
    xungHoGoc: 'hậu-tự',
    neoChuThich: ['nhân vì', 'Trộm nghĩ'],
    chuThich: [
      'Tết nguyên đán thì nói nhân vì gặp tiết nguyên đán nên cáo lễ vậy. Tiết thanh minh thì nói nhân vì gặp tiết thanh minh nên cáo lễ vậy. Tiết cơm mới thì nói nhân vì gập tiết cơm mới nên cáo lễ vậy.',
      'Văn cũng như văn cúng ngày dỗ, chỉ đổi hai chữ « kỵ nhật » làm hai chữ « tiết lệ » mà thôi.',
    ],
    vanTheoChuThich:
      'Ngày...... tháng...... năm hậu-tự tên...... cùng cả nhà lớn nhỏ cúi dâng hương hoa dầu rượu kính cáo trước thần vị các đấng cao tằng tổ khảo tỉ rằng: nhân vì......\n\n' +
      TROM_NGHI_GIO.replace('kỵ-nhật', 'tiết lệ') + '\n\n' +
      'Kính cáo',
    truongTheoChuThich: ['ngay', 'thang', 'ten', 'nhanVi'],
  },
  {
    ma: 'than-trong-nha',
    ten: 'Văn tế (hoặc khấn) các vị thánh thần thờ ở nhà mình',
    url: URL_VAN_KHAN,
    trangSach: 17,
    // Sửa: "Rằng; nhân vì" → "Rằng: nhân vì" (dấu chấm phẩy gõ nhầm; các mẫu khác đều là dấu hai chấm).
    // Sách không in dấu chấm sau "nhân vì" nhưng chú thích bảo nói tên tiết, nên dùng `chenSau`.
    van:
      'Ngày..... tháng..... năm.... tín-chủ tên.... cùng cả nhà lớn nhỏ cúi dâng hương hoa dầu rượu kính cáo trước thần vị.............\n\n' +
      'Rằng: nhân vì\n\n' +
      'Trộm nghĩ: cao dày đức cả, phù hộ ơn thâm; nhớ ngày tiết lệ, dâng cúng thành tâm.\n\n' +
      'Kính cáo',
    truong: ['ngay', 'thang', 'nam', 'ten', 'danhXung'],
    xungHoGoc: 'tín-chủ',
    chenSau: [{ neo: 'Rằng: nhân vì', truong: 'nhanVi' }],
    neoChuThich: ['thần vị', 'nhân vì'],
    chuThich: ['Lễ vị nào thì kêu danh hiệu vị ấy.', 'Cũng như bài trên gập tiết nào thì nói tiết ấy.'],
  },
];

export const mauTheoMa = (ma: MaMau): MauVanKhan | undefined => MAU_VAN_KHAN.find((m) => m.ma === ma);

// ---------- Điền mẫu ----------

const CHUOI_CHAM = /\.{3,}/g;

/** Số chỗ dấu chấm trong một văn (để test đối chiếu với `truong`). */
export const soChoCham = (van: string) => (van.match(CHUOI_CHAM) ?? []).length;

export type GiaTriDien = Partial<Record<TruongDien, string>>;

/**
 * Thay chỗ trống của mẫu bằng giá trị người dùng nhập. Trường không nhập (hoặc chỉ khoảng trắng) thì giữ nguyên dấu chấm.
 * Trường có ở từng mẫu: xem `truong`, `xungHoGoc`, `chenSau`. `dayDu`: dùng `vanTheoChuThich` nếu mẫu có.
 */
export function dienMau(ma: MaMau, giaTri: GiaTriDien, tuyChon: { dayDu?: boolean } = {}): string {
  const mau = mauTheoMa(ma);
  if (!mau) throw new Error(`Không có mẫu văn khấn "${ma}"`);
  const dungDayDu = !!tuyChon.dayDu && !!mau.vanTheoChuThich;
  let van = dungDayDu ? mau.vanTheoChuThich! : mau.van;
  const truong = dungDayDu ? mau.truongTheoChuThich! : mau.truong;
  const lay = (t: TruongDien | null) => (t ? giaTri[t]?.trim() || '' : '');

  let i = 0;
  van = van.replace(CHUOI_CHAM, (cham, viTri: number, toanBo: string) => {
    const v = lay(truong[i++] ?? null);
    if (!v) return cham;
    const truoc = viTri > 0 ? toanBo[viTri - 1] : ' ';
    return (/\s/.test(truoc) ? '' : ' ') + v;
  });

  for (const c of mau.chenSau ?? []) {
    const v = lay(c.truong);
    if (v) van = van.replace(c.neo, `${c.neo} ${v}`);
  }

  const xung = lay('xungHo');
  if (xung) van = van.replace(new RegExp(`(^|\\s)${mau.xungHoGoc}(?= tên)`), `$1${xung}`);
  return van;
}

// ---------- Nghi thức ----------

export type DoanNghiThuc = {
  chuDe: string;
  /** Mục và trang in trong sách. */
  viTri: string;
  url: string;
  van: string;
  chuThich?: string[];
};

const URL_LE_DO = 'https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu/Lễ_dỗ';
const URL_LE_TET = 'https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu/Lễ_tết';
const URL_LAM_LE = 'https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu/Làm_lễ';
const URL_LE_TANG = 'https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu/Lễ_tang';

export const NGHI_THUC: DoanNghiThuc[] = [
  {
    chuDe: 'Lễ giỗ: cúng mấy đời, ngày nào',
    viTri: 'Lễ dỗ, trang 12',
    url: URL_LE_DO,
    van: 'Từ cụ tổ năm đời trở lên thì thôi không phải cúng dỗ nữa, chỉ từ cụ tằng-tổ trở xuống phải nhớ ngày dỗ, hôm tiền nhất nhật lễ cáo, hôm chính dỗ làm lễ sớm.',
  },
  {
    chuDe: 'Lễ giỗ: lễ vật và cách làm',
    viTri: 'Lễ dỗ, trang 12–13',
    url: URL_LE_DO,
    van: 'Lễ chỉ cốt thành kính hương hoa dầu nước, hợp cả người trong nhà lại trước ban thờ, trước khi làm lễ, người gia trưởng thuật lại những chuyện hồi sinh-thời người chết dỗ hôm ấy và bảo ban người nhà ghi nhớ cái ơn đức người ấy đối với mình bây giờ là thế nào, rồi kính cẩn chỉnh-tề vào làm lễ, lễ xong lại cùng ngồi lẳng-lặng ngẫm-nghĩ trong vài mươi phút.',
  },
  {
    chuDe: 'Lễ tết: giữ ngày nào',
    viTri: 'Lễ tết, trang 13',
    url: URL_LE_TET,
    van: 'Các ngày tiết lệ vô ý nghĩa như Đoan-ngũ, thượng-nguyên, trung-nguyên, trung-thu, nên thôi cả, chỉ những ngày tết nguyên đán, tết Thanh-minh (trong tháng ba ngày nào tạnh ráo đi tảo mộ cũng được), tết cơm mới (trong tháng chín ngày nào tùy tiện cũng được) thì nhớ tiết lệ làm lễ với tổ tiên.',
  },
  {
    chuDe: 'Lễ tết: thần thờ trong nhà',
    viTri: 'Lễ tết, trang 13',
    url: URL_LE_TET,
    van: 'Như trong nhà vốn không thờ vị thần nào thì thôi; nếu có thờ vị thần nào với thổ công, thổ-thần thì những ngày tiết lệ kể trên cũng nên tế (hoặc cúng) cáo.',
  },
  {
    chuDe: 'Làm lễ ở đâu',
    viTri: 'Làm lễ, trang 13',
    url: URL_LAM_LE,
    van: 'Các ngày dỗ tết, con cháu trong nhà, như họp cả được nhà người trưởng mà làm lễ là nhất, nếu không thể được thì tùy liệu ai ở đâu thiết vị ở đấy làm lễ cũng được.',
  },
  {
    chuDe: 'Đồ lễ',
    viTri: 'Làm lễ, trang 13',
    url: URL_LAM_LE,
    van: 'Đồ lễ cốt có đèn nến, hương, hoa, dầu, rượu (rượu trời tức nước lã), còn cỗ bàn tùy ý làm thế nào cũng được hay không có cũng không sao.',
  },
  {
    chuDe: 'Nơi đặt bàn lễ',
    viTri: 'Làm lễ, trang 13',
    url: URL_LAM_LE,
    van: 'Nơi thiết vị làm lễ phải quét dọn bày biện tại giữa nhà chỗ tôn nghiêm nhất, hết sức làm cho được sạch-sẽ trang trọng uy-nghi.',
  },
  {
    chuDe: 'Trình tự làm lễ',
    viTri: 'Làm lễ, trang 13–14',
    url: URL_LAM_LE,
    // Sửa: "ứng cúi đầu" → "đứng cúi đầu" (bản chép đánh dấu {{SIC|ứng|đứng}}); "lạy lốn lạy" → "lạy bốn lạy".
    van: 'Khi làm lễ hoặc tế hoặc cúng cũng vậy, cũng trước hết thì đốt nến, đốt hương, rồi lậy bốn lạy nghênh thần, rồi đứng cúi đầu vái dâng rượu, rồi quì đọc văn tế hoặc khấn; rồi vái, đứng giậy, lại lạy bốn lạy tạ thần, thế là lễ tất.',
  },
  {
    chuDe: 'Tế và cúng khác nhau thế nào',
    viTri: 'Làm lễ, trang 14',
    url: URL_LAM_LE,
    // Sửa: "bốn ạy" → "bốn lạy" (bản chép đánh dấu {{SIC|ạy|lạy}}). Câu trong sách còn tiếp (phần xướng lễ), cắt ở dấu chấm phẩy.
    van: 'Chỉ khác: tế thì đội mũ mặc áo giài, cả nhà lớn nhỏ đều vào làm lễ một lượt, người chủ tế đứng trên, còn mọi người theo thứ tự đứng bồi tế, và có văn tế cắt hẳn một người tuyên đọc; cúng thì đội khăn mặc áo thường cũng được; một người chủ tế vào làm lễ, khấn trước, rồi mọi người trong nhà vào làm lễ lần lượt sau, chỉ lạy bốn lạy thôi; …',
  },
  {
    chuDe: 'Thứ tự xướng khi tế',
    viTri: 'Làm lễ, trang 14',
    url: URL_LAM_LE,
    // Sửa: "cúng thi mọi việc" → "cúng thì mọi việc".
    van: '… tế thì có nhờ mấy người ngoài tướng lễ: một người xướng lễ, đầu tiên xướng « đốt hương nến », rồi xướng « lạy nghênh thần » lạy bốn lạy, xướng bốn lần, rồi xướng « dâng rượu », rồi xướng « cúi đầu vái », rồi xướng « quì », rồi xướng « độc văn tế », rồi xướng « vái dậy », rồi xướng « lạy tạ thần », lạy bốn lạy xướng bốn lần, rồi xướng « đốt văn tế », rồi xướng « lễ tất ». … cúng thì mọi việc đó người chủ tế một mình làm lấy cả mà thôi.',
  },
  {
    chuDe: 'Các lễ trong tang: nhập quan đến trừ phục',
    viTri: 'Lễ tang, trang 3',
    url: URL_LE_TANG,
    van: 'Khi rủi trong nhà có tang thì sửa soạn áo quan đồ liệm cẩn thận rồi làm lễ nhập quan, xong sửa soạn đủ đồ tang-phục cho cả người nhà. Theo như phục-chế, con thì mũ sô, áo gai, giây lưng chuối; cháu thì mũ vải to, áo vải to; anh em thì khăn vải trắng, áo vải trắng, mặc vào đâu đấy cả rồi làm lễ thành phục; trước khi đem táng một giờ thì làm lễ đem táng; táng xong đến ngày thứ ba thì làm lễ ngu; (an vi) sau khi mất trăm ngày thì làm lễ tốt khốc; dỗ đầu thì làm lễ tiểu-tường; dỗ hết thì làm lễ đại-tường; sau dỗ hết ba tháng thì cả người nhà đều bỏ đồ để tang rồi làm lễ trừ-phục.',
    // Chú thích theo thứ tự: thành phục, ngu, tốt khốc, tiểu-tường, trừ-phục.
    // "(việc giữ)" có lẽ là "việc dữ", "áo chở" là "áo trở"; giữ như bản chép.
    chuThich: [
      'nghĩa là đã xong các thứ áo chở thì làm lễ để mặc (tục gọi là lễ phát tang).',
      'ngu nghĩa là an, làm lễ an thần.',
      'nghĩa là từ hôm ấy thì thôi không khóc bất thời như trước. Tục ta thường tính từ khi táng giở đi đủ 3 tháng 10 ngày thì làm lễ này.',
      'tường nghĩa là lành. Vì tang là hung sự (việc giữ), đến đây đã dần dần biến đi thành lành.',
      'gọi là đạm tất cũng được. Đạm nghĩa là nhạt bớt nguôi dần',
    ],
  },
];
