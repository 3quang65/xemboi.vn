import { Lich } from './lich';

export interface TruCot {
  ten: string;
  can: string;
  chi: string;
  canChi: string;
  hanhCan: string;
  hanhChi: string;
  napAm: string;
  tangCan: string[];
  thapThan: string;
}

export interface KetQuaTuTru {
  hoTen: string;
  gioiTinh: string;
  duongLich: string;
  amLich: string;
  tietKhi: string;
  truNam: TruCot;
  truThang: TruCot;
  truNgay: TruCot;
  truGio: TruCot;
  nhatChu: {
    can: string;
    hanh: string;
    vuongSuy: string;
    dungThan: string;
    hyThan: string;
    kyThan: string;
  };
  nguHanhCount: Record<string, number>;
  luanGiai: {
    tinhCach: string;
    suNghiep: string;
    taiLoc: string;
    honNhan: string;
    loiKhuyen: string;
  };
}

const CAN_HANH_MAP: Record<string, string> = {
  Giáp: 'Mộc', Ất: 'Mộc',
  Bính: 'Hỏa', Đinh: 'Hỏa',
  Mậu: 'Thổ', Kỷ: 'Thổ',
  Canh: 'Kim', Tân: 'Kim',
  Nhâm: 'Thủy', Quý: 'Thủy',
};

const CHI_HANH_MAP: Record<string, string> = {
  Tý: 'Thủy', Sửu: 'Thổ', Dần: 'Mộc', Mão: 'Mộc',
  Thìn: 'Thổ', Tỵ: 'Hỏa', Ngọ: 'Hỏa', Mùi: 'Thổ',
  Thân: 'Kim', Dậu: 'Kim', Tuất: 'Thổ', Hợi: 'Thủy',
};

const TANG_CAN_MAP: Record<string, string[]> = {
  Tý: ['Quý'],
  Sửu: ['Kỷ', 'Quý', 'Tân'],
  Dần: ['Giáp', 'Bính', 'Mậu'],
  Mão: ['Ất'],
  Thìn: ['Mậu', 'Ất', 'Quý'],
  Tỵ: ['Bính', 'Mậu', 'Canh'],
  Ngọ: ['Đinh', 'Kỷ'],
  Mùi: ['Kỷ', 'Đinh', 'Ất'],
  Thân: ['Canh', 'Nhâm', 'Mậu'],
  Dậu: ['Tân'],
  Tuất: ['Mậu', 'Tân', 'Đinh'],
  Hợi: ['Nhâm', 'Giáp'],
};

const SINH_MAP: Record<string, string> = {
  Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc',
};
const KHAC_MAP: Record<string, string> = {
  Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc',
};

function tinhThapThan(nhatCan: string, targetCan: string): string {
  if (nhatCan === targetCan) return 'Tỷ Kiên';
  const h1 = CAN_HANH_MAP[nhatCan] || 'Mộc';
  const h2 = CAN_HANH_MAP[targetCan] || 'Mộc';
  const duongCans = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'];
  const samePol = duongCans.includes(nhatCan) === duongCans.includes(targetCan);
  if (h1 === h2) return samePol ? 'Tỷ Kiên' : 'Kiếp Tài';
  if (SINH_MAP[h1] === h2) return samePol ? 'Thực Thần' : 'Thương Quan';
  if (SINH_MAP[h2] === h1) return samePol ? 'Thiên Ấn' : 'Chính Ấn';
  if (KHAC_MAP[h1] === h2) return samePol ? 'Thiên Tài' : 'Chính Tài';
  return samePol ? 'Thất Sát' : 'Chính Quan';
}

export function lapTuTru(input: {
  hoTen: string;
  ngay: number;
  thang: number;
  nam: number;
  gio: number;
  gioiTinh: string;
}): KetQuaTuTru {
  const { hoTen, ngay, thang, nam, gio, gioiTinh } = input;
  const am = Lich.duongSangAm(ngay, thang, nam);
  const jd = Lich.jdFromDate(ngay, thang, nam);
  const tk = Lich.tietKhi(jd);

  const ccNam = Lich.canChiNam(am.nam);
  const ccThang = Lich.canChiThang(am.thang, am.nam);
  const ccNgay = Lich.canChiNgay(jd);
  const chiGioIdx = Lich.chiGio(gio);
  const canGioIdx = (Lich.canGioTy(ccNgay.can) + chiGioIdx) % 10;
  const ccGio = { can: canGioIdx, chi: chiGioIdx };

  const nhatCan = Lich.CAN[ccNgay.can];
  const nhatHanh = CAN_HANH_MAP[nhatCan] || 'Mộc';

  const makeTru = (ten: string, cc: { can: number; chi: number }, isDay = false): TruCot => {
    const canStr = Lich.CAN[cc.can];
    const chiStr = Lich.CHI[cc.chi];
    return {
      ten,
      can: canStr,
      chi: chiStr,
      canChi: Lich.ten(cc),
      hanhCan: CAN_HANH_MAP[canStr] || 'Thổ',
      hanhChi: CHI_HANH_MAP[chiStr] || 'Thổ',
      napAm: Lich.napAm(cc.can, cc.chi),
      tangCan: TANG_CAN_MAP[chiStr] || [],
      thapThan: isDay ? 'Nhật Chủ' : tinhThapThan(nhatCan, canStr),
    };
  };

  const truNam = makeTru('Trụ Năm (Niên Trụ)', ccNam);
  const truThang = makeTru('Trụ Tháng (Nguyệt Trụ)', ccThang);
  const truNgay = makeTru('Trụ Ngày (Nhật Trụ)', ccNgay, true);
  const truGio = makeTru('Trụ Giờ (Thời Trụ)', ccGio);

  const counts: Record<string, number> = { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 };
  for (const t of [truNam, truThang, truNgay, truGio]) {
    counts[t.hanhCan] = (counts[t.hanhCan] || 0) + 1;
    counts[t.hanhChi] = (counts[t.hanhChi] || 0) + 1;
  }

  const meScore =
    counts[nhatHanh] +
    (counts[Object.keys(SINH_MAP).find((k) => SINH_MAP[k] === nhatHanh) || 'Thủy'] || 0);
  const vuongSuy = meScore >= 4 ? 'Thân Vượng' : 'Thân Nhược';
  const hanhSinhMe = Object.keys(SINH_MAP).find((k) => SINH_MAP[k] === nhatHanh) || 'Thủy';
  const hanhMeSinh = SINH_MAP[nhatHanh] || 'Hỏa';
  const hanhKhacMe = Object.keys(KHAC_MAP).find((k) => KHAC_MAP[k] === nhatHanh) || 'Kim';

  const dungThan = vuongSuy === 'Thân Vượng' ? hanhMeSinh : hanhSinhMe;
  const hyThan = vuongSuy === 'Thân Vượng' ? KHAC_MAP[nhatHanh] : nhatHanh;
  const kyThan = vuongSuy === 'Thân Vượng' ? hanhSinhMe : hanhKhacMe;

  return {
    hoTen: hoTen || 'Quý khách',
    gioiTinh: gioiTinh === 'nu' ? 'Nữ mạng' : 'Nam mạng',
    duongLich: `${String(ngay).padStart(2, '0')}/${String(thang).padStart(2, '0')}/${nam} (${String(gio).padStart(2, '0')}:00)`,
    amLich: `${am.ngay}/${am.thang}${am.nhuan ? ' nhuận' : ''}/${am.nam} (${Lich.ten(ccNam)})`,
    tietKhi: tk,
    truNam,
    truThang,
    truNgay,
    truGio,
    nhatChu: {
      can: nhatCan,
      hanh: nhatHanh,
      vuongSuy,
      dungThan,
      hyThan,
      kyThan,
    },
    nguHanhCount: counts,
    luanGiai: {
      tinhCach: `Nhật chủ ${nhatCan} (${nhatHanh}) sinh tháng ${truThang.chi} tiết ${tk}, cục diện ${vuongSuy}. Người mang khí ${nhatHanh} trọng chữ tín, tư duy rõ ràng, biết cương nhu đúng lúc.`,
      suNghiep: `Dụng thần bát tự nghiêng về hành ${dungThan}, Hỷ thần hành ${hyThan}. Hợp các ngành nghề hoặc phương vị thuộc ${dungThan} và ${hyThan}, làm việc có hệ thống, càng về trung vận (sau 32 tuổi) càng vững vàng.`,
      taiLoc: `Trong tứ trụ có ${truNam.thapThan} ở Niên trụ và ${truThang.thapThan} ở Nguyệt trụ. Tiền bạc tụ tán theo chu kỳ đại vận 10 năm; giữ kỷ luật tài chính và tránh đầu tư nóng vội vào năm hành ${kyThan}.`,
      honNhan: `Cung phu thê nằm tại Nhật chi ${truNgay.chi} (${truNgay.hanhChi}), tàng can ${truNgay.tangCan.join(', ')}. Gia đạo cần sự lắng nghe và nhường nhịn để giữ hòa khí bền lâu.`,
      loiKhuyen: `Bổ khuyết ngũ hành: ưu tiên màu sắc, hướng ngồi làm việc và đối tác mang hành ${dungThan} hoặc ${hyThan}; hạn chế thái quá hành ${kyThan}.`,
    },
  };
}

export interface QueKinhDich {
  soHieu: number;
  tenQue: string;
  tenHan: string;
  thuongQuai: string;
  haQuai: string;
  hao6: number[];
  thoanTu: string;
  daiTuong: string;
  yNghia: string;
  loiKhuyen: {
    congDanh: string;
    taiLoc: string;
    tinhDuyen: string;
    giaDao: string;
  };
  catHung: 'Đại Cát' | 'Cát' | 'Bình Hòa' | 'Cẩn Trọng';
}

const BAT_QUAI = [
  { ten: 'Càn', hanh: 'Kim', hao: [1, 1, 1], tuong: 'Trời' },
  { ten: 'Đoài', hanh: 'Kim', hao: [1, 1, 0], tuong: 'Đầm' },
  { ten: 'Ly', hanh: 'Hỏa', hao: [1, 0, 1], tuong: 'Lửa' },
  { ten: 'Chấn', hanh: 'Mộc', hao: [1, 0, 0], tuong: 'Sấm' },
  { ten: 'Tốn', hanh: 'Mộc', hao: [0, 1, 1], tuong: 'Gió' },
  { ten: 'Khảm', hanh: 'Thủy', hao: [0, 1, 0], tuong: 'Nước' },
  { ten: 'Cấn', hanh: 'Thổ', hao: [0, 0, 1], tuong: 'Núi' },
  { ten: 'Khôn', hanh: 'Thổ', hao: [0, 0, 0], tuong: 'Đất' },
];

const QUE_64_NAMES: Array<{
  so: number;
  ten: string;
  han: string;
  catHung: 'Đại Cát' | 'Cát' | 'Bình Hòa' | 'Cẩn Trọng';
  thoan: string;
  yNghia: string;
}> = [
  { so: 1, ten: 'Thuần Càn', han: '乾為天', catHung: 'Đại Cát', thoan: 'Nguyên hanh lợi trinh. Rồng bay trên trời, đại sự hanh thông.', yNghia: 'Cương kiện trung chính, thời vận đang lên mạnh mẽ, làm việc lớn ắt thành nhưng chớ kiêu ngạo.' },
  { so: 2, ten: 'Thuần Khôn', han: '坤為地', catHung: 'Đại Cát', thoan: 'Hậu đức tải vật. Đất dày chở muôn vật, nhu thuận mà bền vững.', yNghia: 'Lấy nhu thắng cương, kiên nhẫn tích lũy, thuận theo thời thế và có quý nhân nâng đỡ.' },
  { so: 11, ten: 'Địa Thiên Thái', han: '地天泰', catHung: 'Đại Cát', thoan: 'Tiểu vãng đại lai, cát hanh. Âm dương giao hòa, vạn vật sinh sôi.', yNghia: 'Thời vận hanh thông, bế tắc đã qua, mưu sự thuận lợi, gia đạo bình an và tài lộc dồi dào.' },
  { so: 14, ten: 'Hỏa Thiên Đại Hữu', han: '火天大有', catHung: 'Đại Cát', thoan: 'Mặt trời chiếu sáng giữa trời cao, thu hoạch lớn lao.', yNghia: 'Tài lộc vượng phát, danh tiếng sáng rõ, hợp tác làm ăn thu về thành quả xứng đáng.' },
  { so: 15, ten: 'Địa Sơn Khiêm', han: '地山謙', catHung: 'Đại Cát', thoan: 'Khiêm tốn giữ mình, núi cao ẩn trong lòng đất.', yNghia: 'Càng khiêm nhường càng được trọng vọng, mọi việc tiến hành êm đẹp, tránh được thị phi.' },
  { so: 3, ten: 'Thủy Lôi Truân', han: '水雷屯', catHung: 'Cẩn Trọng', thoan: 'Vạn sự khởi đầu nan, mầm cây mới nhú còn gặp sấm mưa.', yNghia: 'Giai đoạn đầu còn nhiều thử thách, cần kiên trì củng cố nền tảng, chớ nóng vội.' },
  { so: 5, ten: 'Thủy Thiên Nhu', han: '水天需', catHung: 'Cát', thoan: 'Chờ đợi thời cơ, ăn uống yên vui đợi mây tan mưa xuống.', yNghia: 'Nên giữ tâm bình tĩnh, chuẩn bị kỹ lưỡng, đợi đúng thời điểm xuất phát sẽ thành công.' },
  { so: 46, ten: 'Địa Phong Thăng', han: '地風升', catHung: 'Đại Cát', thoan: 'Cây mọc từ trong đất vươn lên cao từng bước vững chắc.', yNghia: 'Công danh thăng tiến từng nấc, đi về phương Nam hoặc gặp bậc trưởng bối rất có lợi.' },
  { so: 50, ten: 'Hỏa Phong Đỉnh', han: '火風鼎', catHung: 'Đại Cát', thoan: 'Vạc nấu thức ăn nuôi người hiền, đổi mới bền vững.', yNghia: 'Cơ hội hợp tác ba bên vững như kiềng ba chân, khai trương hay chuyển đổi đều cát lợi.' },
  { so: 63, ten: 'Thủy Hỏa Ký Tế', han: '水火既濟', catHung: 'Cát', thoan: 'Nước trên lửa dưới, mọi việc đã hoàn thành đúng vị trí.', yNghia: 'Mưu sự bước đầu thành tựu trọn vẹn, nhưng lúc thành công càng phải phòng ngừa biến cố nhỏ.' },
  { so: 64, ten: 'Hỏa Thủy Vị Tế', han: '火水未濟', catHung: 'Bình Hòa', thoan: 'Việc chưa xong nhưng mở ra chu kỳ mới đầy hy vọng.', yNghia: 'Chưa thể vội kết thúc ngay, cần rà soát kỹ từng bước cuối cùng thì hậu vận mới hanh thông.' },
];

export function gieoQueDich(seedInput?: {
  cauHoi?: string;
  so1?: number;
  so2?: number;
  so3?: number;
}): QueKinhDich & { haoDong: number; cauHoi: string } {
  const s1 = seedInput?.so1 || Math.floor(Math.random() * 900) + 100;
  const s2 = seedInput?.so2 || Math.floor(Math.random() * 900) + 100;
  const s3 = seedInput?.so3 || Math.floor(Math.random() * 900) + 100;

  const thuongIdx = s1 % 8;
  const haIdx = s2 % 8;
  const haoDong = (s3 % 6) + 1;

  const thuong = BAT_QUAI[thuongIdx];
  const ha = BAT_QUAI[haIdx];
  const idxQue = (thuongIdx * 8 + haIdx) % QUE_64_NAMES.length;
  const meta = QUE_64_NAMES[idxQue];

  return {
    soHieu: meta.so,
    tenQue: meta.ten,
    tenHan: meta.han,
    thuongQuai: `${thuong.ten} (${thuong.tuong} - ${thuong.hanh})`,
    haQuai: `${ha.ten} (${ha.tuong} - ${ha.hanh})`,
    hao6: [...ha.hao, ...thuong.hao],
    thoanTu: meta.thoan,
    daiTuong: `Thượng quái là ${thuong.ten} (${thuong.tuong}), Hạ quái là ${ha.ten} (${ha.tuong}). Hào động tại hào ${haoDong}.`,
    yNghia: meta.yNghia,
    catHung: meta.catHung,
    haoDong,
    cauHoi: seedInput?.cauHoi || 'Xin quẻ tổng quan vận trình công danh, tài lộc và gia đạo',
    loiKhuyen: {
      congDanh:
        meta.catHung === 'Đại Cát' || meta.catHung === 'Cát'
          ? 'Thuận lợi triển khai kế hoạch, dễ gặp quý nhân đồng hành và cấp trên ghi nhận.'
          : 'Nên giữ vững vị trí hiện tại, chuẩn bị kỹ hồ sơ và chờ thời điểm thuận lợi hơn.',
      taiLoc:
        meta.catHung === 'Đại Cát'
          ? 'Tài khí vượng, có lộc từ công việc chính và hợp tác làm ăn minh bạch.'
          : 'Quản lý dòng tiền thận trọng, ưu tiên tích lũy hơn là mạo hiểm lướt sóng.',
      tinhDuyen: 'Chân thành chia sẻ và lắng nghe sẽ giúp đôi bên tháo gỡ mọi khúc mắc.',
      giaDao: 'Gia đạo yên ấm, nên dành thời gian chăm sóc sức khỏe người lớn tuổi trong nhà.',
    },
  };
}
