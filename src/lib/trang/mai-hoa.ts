// Mai hoa Dịch số (trang /kinh-dich/mai-hoa-dich-so, Lệnh 51).
// Chỉ phần TÍNH ĐƯỢC theo đúng lời sách: lập quẻ theo năm, tháng, ngày, giờ (quyển 1, đoạn 7405) hoặc theo số vật đếm được (7406),
// quẻ hỗ (7404), thể và dụng, sinh khắc giữa thể với dụng, hỗ, biến (quyển 2, 7447, 7455–7460).
// Không tự đoán việc: trang chỉ in quan hệ ngũ hành và câu sách tương ứng.
// Phép lập quẻ dùng lại queMaiHoaTheoThoiGian ở kinh-dich.ts (đã khớp ví dụ Quán mai, Mẫu đơn trong sách: tests/trang/mai-hoa.test.mjs).
import { BAT_QUAI, queHo, queTheoHao, queMaiHoaHienTai, queMaiHoaTheoThoiGian, type Hao, type KetQuaGieo, type Quai, type Que } from './kinh-dich';
import { quanHeHanh, type Hanh } from './can-chi';

export const NGUON_MAI_HOA = {
  ma: 'WS06', tenHanViet: 'Mai hoa Dịch số', tacGia: 'tương truyền của Thiệu Ung (Thiệu Khang Tiết)', nienDai: 'tương truyền đời Tống',
  ghiCong: 'Văn bản: Wikisource, CC BY-SA 4.0', url: 'https://zh.wikisource.org/wiki/梅花易數',
} as const;

export type TrichMaiHoa = {
  doanId: number;
  /** Nguyên văn; các khúc không liền nhau nối bằng "…". Chỉ để đối chiếu, KHÔNG hiển thị. */
  nguyenVan: string;
  viTriViet: string;
  dich: string;
};

export const TRICH_MAI_HOA = {
  soTienThien: {
    doanId: 7450, viTriViet: 'Quyển 2 · Thể dụng sinh khắc, Tiên thiên hậu thiên luận',
    nguyenVan: '數自成乾一、兌二、離三、震四、巽五、坎六、艮七、坤八。故占卜起卦，合以此數為用。',
    dich: 'Số tự thành: Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8. Cho nên khi bói lập quẻ, nên dùng số này.',
  },
  chiaTam: {
    doanId: 7402, viTriViet: 'Quyển 1 · Tượng số dịch lý, Quẻ chia 8',
    nguyenVan: '凡起卦不問數多少，即以此數作卦數，過八數即以八數遞除。一八除不盡，再除二八，三八，直至除盡，以餘數作卦。如得八數整，即坤卦，更不必除也。',
    dich: 'Phàm lập quẻ, không kể số nhiều hay ít, lấy ngay số ấy làm số quẻ; quá 8 thì lần lượt trừ đi 8. Trừ một lần 8 chưa hết thì trừ hai lần 8, ba lần 8, cho tới khi hết, lấy số dư làm quẻ. Nếu được đúng 8 thì là quẻ Khôn, không cần trừ nữa.',
  },
  chiaSau: {
    doanId: 7403, viTriViet: 'Quyển 1 · Tượng số dịch lý, Hào chia 6',
    nguyenVan: '凡起動爻，以重卦總數除六，以餘數作動爻。如不滿六，止用此數為動爻，不必再除。…若一爻動，則看此一爻，是陽爻則變陰爻，陰爻則變陽爻。取爻當以時加之。',
    dich: 'Phàm tìm hào động, lấy tổng số của quẻ kép chia 6, lấy số dư làm hào động. Nếu chưa đủ 6 thì dùng luôn số ấy làm hào động, không phải chia. … Nếu một hào động thì xem hào ấy: hào dương thì biến thành hào âm, hào âm thì biến thành hào dương. Tìm hào thì phải cộng thêm giờ.',
  },
  thoiGian: {
    doanId: 7405, viTriViet: 'Quyển 1 · Tượng số dịch lý, Lập quẻ theo năm tháng ngày giờ',
    nguyenVan: '年月日為上卦。年月日加時總數為下卦。又以年月日時總數取爻。如子年一數，丑年二數，直至亥年十二數。月如正月一數，直至十二月，亦作十二數。日數如初一一數，直至三十日，為三十數。以上年月日共計幾數，以八除之，以餘數作卦。如子時一數直至亥時十二數，就將年月日數加時之數，總計幾數，以八除之，餘數作下卦；以六除，餘數作動爻。',
    dich: 'Năm, tháng, ngày làm thượng quái. Tổng năm, tháng, ngày cộng giờ làm hạ quái. Lại lấy tổng năm, tháng, ngày, giờ để tìm hào. Như năm Tý là 1, năm Sửu là 2, cho tới năm Hợi là 12. Tháng như tháng Giêng là 1, cho tới tháng 12 là 12. Ngày như mồng 1 là 1, cho tới ngày 30 là 30. Năm, tháng, ngày cộng lại được bao nhiêu, chia 8, lấy số dư làm quẻ. Giờ như giờ Tý là 1 cho tới giờ Hợi là 12; lấy số năm, tháng, ngày cộng số giờ, được tổng bao nhiêu, chia 8, số dư làm hạ quái; chia 6, số dư làm hào động.',
  },
  soVat: {
    doanId: 7406, viTriViet: 'Quyển 1 · Tượng số dịch lý, Lệ bói theo số vật',
    nguyenVan: '凡見有可數之物，即以此數起作上卦，以時數配作下卦。即以卦數並時數總除六取動爻。',
    dich: 'Phàm thấy vật gì đếm được, lấy ngay số ấy làm thượng quái, lấy số giờ ghép làm hạ quái. Rồi lấy số quẻ cộng số giờ, tổng chia 6 để tìm hào động.',
  },
  queHo: {
    doanId: 7404, viTriViet: 'Quyển 1 · Tượng số dịch lý, Lệ lập quẻ hỗ',
    nguyenVan: '互卦只用八卦，不必取六十四卦名。互卦以重卦去了初爻及第六爻，以中間四爻分作兩卦，看得何卦。又云：乾坤無互，互其變卦。',
    dich: 'Quẻ hỗ chỉ dùng tám quái, không cần lấy tên 64 quẻ. Quẻ hỗ là quẻ kép bỏ hào đầu và hào thứ sáu, lấy bốn hào giữa chia làm hai quái, xem được quái gì. Lại nói: Càn, Khôn không có hỗ, lấy hỗ của quẻ biến.',
  },
  theDung: {
    doanId: 7447, viTriViet: 'Quyển 2 · Thể dụng sinh khắc, Chiêm bốc tổng quyết',
    nguyenVan: '次看卦之體用，以論五行生克。體用即動靜之說。體為主，用為事。應用生及比和，則吉；體生用及克體，則不吉。',
    dich: 'Kế đó xem thể và dụng của quẻ để luận ngũ hành sinh khắc. Thể dụng tức là thuyết động tĩnh. Thể là chủ, dụng là việc. Dụng sinh thể hoặc tỷ hòa thì cát; thể sinh dụng hoặc dụng khắc thể thì không cát.',
  },
  vaiTro: {
    doanId: 7455, viTriViet: 'Quyển 2 · Thể dụng sinh khắc, Thể dụng tổng quyết',
    nguyenVan: '大抵體用之說，體卦為主，用卦為事，互卦為事之中間，刻應變卦為事之終。',
    dich: 'Đại để thuyết thể dụng: quái thể là chủ, quái dụng là việc, quẻ hỗ là khoảng giữa của việc, khắc ứng và quẻ biến là kết cục của việc.',
  },
  sinhKhac: {
    doanId: 7460, viTriViet: 'Quyển 2 · Thể dụng sinh khắc, Thể dụng tổng quyết',
    nguyenVan: '體用之間，比和則吉，互乃中間之應，變乃末後之期。故用吉變凶者，先吉後凶；用凶變吉者，先凶後吉。體克用，諸事吉；用克體，諸事凶。體生用，有耗失之患；用生體，有進益之喜。',
    dich: 'Giữa thể và dụng, tỷ hòa thì cát; hỗ là ứng ở khoảng giữa, biến là kỳ sau cùng. Cho nên dụng cát mà biến hung thì trước cát sau hung; dụng hung mà biến cát thì trước hung sau cát. Thể khắc dụng, mọi việc cát; dụng khắc thể, mọi việc hung. Thể sinh dụng, có lo hao mất; dụng sinh thể, có mừng tiến ích.',
  },
  quaiKhac: {
    doanId: 7456, viTriViet: 'Quyển 2 · Thể dụng sinh khắc, Thể dụng tổng quyết',
    nguyenVan: '宜受他卦之生，不宜他卦之克。他卦者，謂用互變也。',
    dich: 'Thể nên được quái khác sinh, không nên bị quái khác khắc. Quái khác tức là dụng, hỗ, biến.',
  },
} as const satisfies Record<string, TrichMaiHoa>;

/** Hai ví dụ lập quẻ theo thời gian chép trong sách (quyển 1), dùng làm ví dụ trên trang và làm test. */
export const VI_DU_SACH = [
  {
    ma: 'quan-mai', ten: 'Xem hoa mai', chiNam: 4, thang: 12, ngay: 17, chiGio: 8,
    trich: {
      doanId: 7419, viTriViet: 'Quyển 1 · Tượng số dịch lý, Quán mai chiêm',
      nguyenVan: '辰年十二月十七日申時，康節先生偶觀梅，見二雀爭枝墜地。…辰年五數，十二月十二數，十七日十七數，共三十四數，除四八三十二，餘二，屬兌，為上卦，加申時九數，總得四十三數，五八除四十，餘得三數，為離，作下卦。又上下總四十三數，以六除，六七四十二，餘一為動爻，是為澤火革。初爻變咸，互見乾巽。…右兌金為體，離火克之。…幸變為艮土，兌金得生',
      dich: 'Năm Thìn, tháng 12, ngày 17, giờ Thân, tiên sinh Khang Tiết tình cờ ngắm hoa mai, thấy hai con sẻ tranh cành rơi xuống đất. … Năm Thìn số 5, tháng 12 số 12, ngày 17 số 17, cộng 34; trừ bốn lần 8 là 32, dư 2, thuộc Đoài, làm thượng quái. Cộng giờ Thân số 9, tổng 43; trừ năm lần 8 là 40, dư 3, là Ly, làm hạ quái. Lại tổng trên dưới 43, chia 6, sáu lần bảy là 42, dư 1 là hào động, được quẻ Trạch Hỏa Cách. Hào đầu biến thành Hàm, hỗ thấy Càn, Tốn. … Đoài Kim là thể, Ly Hỏa khắc nó. … May biến thành Cấn Thổ, Đoài Kim được sinh.',
    } satisfies TrichMaiHoa,
  },
  {
    ma: 'mau-don', ten: 'Xem hoa mẫu đơn', chiNam: 5, thang: 3, ngay: 16, chiGio: 3,
    trich: {
      doanId: 7420, viTriViet: 'Quyển 1 · Tượng số dịch lý, Mẫu đơn chiêm',
      nguyenVan: '巳年三月十六日卯時，先生與客往司馬公家共觀牡丹。…以巳年六數，三月三數，十六日十六數，總得二十五數，除三八二十四數，餘一數為乾，為上卦。卯時四數，共得二十九數，又除三八二十四數，餘五為巽卦，作下卦，得天風姤。又以總計二十九數，以六除之，四六除二十四，得五爻動，變鼎卦，互見重乾。…巽木為體，乾金克之，互卦又見重乾，克體之卦多矣',
      dich: 'Năm Tỵ, tháng 3, ngày 16, giờ Mão, tiên sinh cùng khách tới nhà Tư Mã công xem hoa mẫu đơn. … Năm Tỵ số 6, tháng 3 số 3, ngày 16 số 16, tổng 25; trừ ba lần 8 là 24, dư 1 là Càn, làm thượng quái. Giờ Mão số 4, cộng được 29; lại trừ ba lần 8 là 24, dư 5 là quẻ Tốn, làm hạ quái, được Thiên Phong Cấu. Lại lấy tổng 29 chia 6, bốn lần 6 trừ 24, được hào 5 động, biến quẻ Đỉnh, hỗ thấy hai lần Càn. … Tốn Mộc là thể, Càn Kim khắc nó; quẻ hỗ lại thấy hai lần Càn, quái khắc thể nhiều.',
    } satisfies TrichMaiHoa,
  },
] as const;

export type QuanHeTheDung = 'ty-hoa' | 'the-khac' | 'khac-the' | 'the-sinh' | 'sinh-the';

export const TEN_QUAN_HE: Record<QuanHeTheDung, string> = {
  'ty-hoa': 'Tỷ hòa (cùng hành)',
  'the-khac': 'Thể khắc',
  'khac-the': 'Khắc thể',
  'the-sinh': 'Thể sinh',
  'sinh-the': 'Sinh thể',
};

/** Câu sách (7460) ứng với quan hệ giữa thể và dụng. */
export const LOI_SACH_THE_DUNG: Record<QuanHeTheDung, string> = {
  'ty-hoa': 'Tỷ hòa thì cát.',
  'the-khac': 'Thể khắc dụng, mọi việc cát.',
  'khac-the': 'Dụng khắc thể, mọi việc hung.',
  'the-sinh': 'Thể sinh dụng, có lo hao mất.',
  'sinh-the': 'Dụng sinh thể, có mừng tiến ích.',
};

/** Quan hệ của quái `khac` đối với quái thể. */
export function quanHeVoiThe(hanhThe: Hanh, hanhKhac: Hanh): QuanHeTheDung {
  if (hanhThe === hanhKhac) return 'ty-hoa';
  const q = quanHeHanh(hanhThe);
  if (q.khac === hanhKhac) return 'the-khac';
  if (q.biKhacBoi === hanhKhac) return 'khac-the';
  if (q.sinhRa === hanhKhac) return 'the-sinh';
  return 'sinh-the';
}

const quaiTheoHao = (h: Hao[]): Quai => BAT_QUAI.find((q) => q.hao.every((x, i) => x === h[i]))!;

export type VaiQuai = { vai: 'dung' | 'ho-ha' | 'ho-thuong' | 'bien'; tenVai: string; quai: Quai; quanHe: QuanHeTheDung };

export type PhanTichMaiHoa = {
  ketQua: KetQuaGieo;
  /** Quái không có hào động. */
  the: Quai;
  /** Quái có hào động. */
  dung: Quai;
  viTriDung: 'thuong' | 'ha';
  /** Quẻ hỗ theo sách: Càn, Khôn lấy hỗ của quẻ biến. */
  queHo: Que;
  hoTuQueBien: boolean;
  /** Quái dụng sau khi biến. */
  bien: Quai;
  /** Dụng, hỗ hạ, hỗ thượng, biến: mỗi quái với quan hệ ngũ hành đối với thể. */
  cacQuai: VaiQuai[];
  /** Câu sách cho quan hệ thể và dụng (7460). */
  loiSachTheDung: string;
};

export function phanTichMaiHoa(kq: KetQuaGieo): PhanTichMaiHoa {
  const dong = kq.haoDong[0];
  const hao = kq.queChu.hao;
  const viTriDung = dong >= 4 ? 'thuong' : 'ha';
  const the = viTriDung === 'thuong' ? kq.queChu.ha : kq.queChu.thuong;
  const dung = viTriDung === 'thuong' ? kq.queChu.thuong : kq.queChu.ha;
  const bienHao = hao.map((x, i) => (i + 1 === dong ? ((1 - x) as Hao) : x));
  const bien = quaiTheoHao(viTriDung === 'thuong' ? bienHao.slice(3) : bienHao.slice(0, 3));
  const hoTuQueBien = kq.queChu.so === 1 || kq.queChu.so === 2;
  const ho = hoTuQueBien ? queHo(bienHao) : kq.queHo;
  const h = the.hanh as Hanh;
  const vai = (v: VaiQuai['vai'], tenVai: string, quai: Quai): VaiQuai => ({ vai: v, tenVai, quai, quanHe: quanHeVoiThe(h, quai.hanh as Hanh) });
  const cacQuai = [vai('dung', 'Dụng', dung), vai('ho-ha', 'Hỗ dưới', ho.ha), vai('ho-thuong', 'Hỗ trên', ho.thuong), vai('bien', 'Biến', bien)];
  return { ketQua: kq, the, dung, viTriDung, queHo: ho, hoTuQueBien, bien, cacQuai, loiSachTheDung: LOI_SACH_THE_DUNG[cacQuai[0].quanHe] };
}

const du = (n: number, m: number) => (n % m === 0 ? m : n % m);

/** Lập quẻ theo số vật đếm được (7406): số ấy làm thượng quái, số giờ làm hạ quái, tổng chia 6 lấy hào động. */
export function queMaiHoaTheoSo(soVat: number, chiGio: number): KetQuaGieo {
  if (!Number.isInteger(soVat) || soVat < 1) throw new RangeError('Số phải là số nguyên dương.');
  const soGio = chiGio + 1;
  const thuong = BAT_QUAI.find((q) => q.soTienThien === du(soVat, 8))!;
  const ha = BAT_QUAI.find((q) => q.soTienThien === du(soGio, 8))!;
  const tong = soVat + soGio;
  const dong = du(tong, 6);
  const hao = [...ha.hao, ...thuong.hao] as Hao[];
  const bien = hao.map((x, i) => (i + 1 === dong ? ((1 - x) as Hao) : x));
  return {
    cach: 'mai-hoa', haoDong: [dong], queChu: queTheoHao(hao), queBien: queTheoHao(bien), queHo: queHo(hao),
    moTa: [
      `Số ${soVat} chia 8 dư ${du(soVat, 8)} → thượng quái ${thuong.ten}.`,
      `Số giờ (chi) ${soGio} chia 8 dư ${du(soGio, 8)} → hạ quái ${ha.ten}.`,
      `${soVat} + ${soGio} = ${tong}; chia 6 dư ${dong} → hào ${dong} động.`,
    ],
  };
}

/** Lập quẻ theo thời gian cho một ngày giờ dương lịch (giờ Việt Nam). */
export function queMaiHoaLuc(ngay: number, thang: number, nam: number, gio: number, phut = 0) {
  return queMaiHoaHienTai(new Date(Date.UTC(nam, thang - 1, ngay, gio - 7, phut)));
}

export { queMaiHoaTheoThoiGian };
