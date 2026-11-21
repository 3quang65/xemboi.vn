/*
 * tuvi.js — An lá số Tử Vi Đẩu Số theo cách an sao Việt Nam.
 *
 * Bộ quy tắc an sao, bảng đặc tính (miếu, vượng, đắc, bình, hãm) và ngũ hành
 * của sao được chuyển sang JavaScript từ bộ máy "ansaotuvi" trong dự án
 * TuViMCP (c) 2026 Manh Ha Nguyen, giấy phép Apache-2.0:
 * https://github.com/nmhaaa3218/TuViMCP — theo sách của cụ Thiên Lương.
 * Kết quả đã được đối chiếu tự động với bản gốc Python.
 *
 * Cần lich.js. Chạy trên trình duyệt (window.TuVi) và Node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./lich-raw.js'));
  else root.TuVi = factory(root.Lich);
})(typeof self !== 'undefined' ? self : this, function (L) {
  'use strict';
  L = (L && L.default) ? L.default : L;
  var CAN = L.CAN, CHI = L.CHI;

  // dịch cung trên địa bàn đánh số 1 (Tý) … 12 (Hợi)
  function d(c) { var x = +c; for (var i = 1; i < arguments.length; i++) x += +arguments[i]; x = ((x % 12) + 12) % 12; return x === 0 ? 12 : x; }

  // ---- Danh mục sao: [tên, hành, loại]  loại 1 = chính tinh, 2–8 cát, ≥11 hung
  var SAO = {
    tuVi: ['Tử Vi', 'O', 1], liemTrinh: ['Liêm Trinh', 'H', 1], thienDong: ['Thiên Đồng', 'T', 1], vuKhuc: ['Vũ Khúc', 'K', 1],
    thaiDuong: ['Thái Dương', 'H', 1], thienCo: ['Thiên Cơ', 'M', 1], thienPhu: ['Thiên Phủ', 'O', 1], thaiAm: ['Thái Âm', 'T', 1],
    thamLang: ['Tham Lang', 'T', 1], cuMon: ['Cự Môn', 'T', 1], thienTuong: ['Thiên Tướng', 'T', 1], thienLuong: ['Thiên Lương', 'O', 1],
    thatSat: ['Thất Sát', 'K', 1], phaQuan: ['Phá Quân', 'T', 1],
    thaiTue: ['Thái Tuế', 'H', 15], thieuDuong: ['Thiếu Dương', 'H', 5], tangMon: ['Tang Môn', 'M', 12], thieuAm: ['Thiếu Âm', 'T', 5],
    quanPhu3: ['Quan Phù', 'H', 12], tuPhu: ['Tử Phù', 'K', 12], tuePha: ['Tuế Phá', 'H', 12], longDuc: ['Long Đức', 'T', 5],
    bachHo: ['Bạch Hổ', 'K', 12], phucDuc: ['Phúc Đức', 'O', 5], dieuKhach: ['Điếu Khách', 'H', 12], trucPhu: ['Trực Phù', 'K', 16],
    locTon: ['Lộc Tồn', 'O', 3], bacSy: ['Bác Sỹ', 'T', 5], lucSi: ['Lực Sĩ', 'H', 2], thanhLong: ['Thanh Long', 'T', 5],
    tieuHao: ['Tiểu Hao', 'H', 12], tuongQuan: ['Tướng Quân', 'M', 4], tauThu: ['Tấu Thư', 'K', 3], phiLiem: ['Phi Liêm', 'H', 2],
    hyThan: ['Hỷ Thần', 'H', 5], benhPhu: ['Bệnh Phù', 'O', 12], daiHao: ['Đại Hao', 'H', 12], phucBinh: ['Phục Binh', 'H', 13],
    quanPhu2: ['Quan Phủ', 'H', 12],
    daLa: ['Đà La', 'K', 11], kinhDuong: ['Kình Dương', 'K', 11], diaKhong: ['Địa Không', 'H', 11], diaKiep: ['Địa Kiếp', 'H', 11],
    linhTinh: ['Linh Tinh', 'H', 11], hoaTinh: ['Hỏa Tinh', 'H', 11], vanXuong: ['Văn Xương', 'K', 6], vanKhuc: ['Văn Khúc', 'T', 6],
    thienKhoi: ['Thiên Khôi', 'H', 6], thienViet: ['Thiên Việt', 'H', 6], taPhu: ['Tả Phù', 'O', 2], huuBat: ['Hữu Bật', 'T', 2],
    longTri: ['Long Trì', 'T', 3], phuongCac: ['Phượng Các', 'O', 3], tamThai: ['Tam Thai', 'O', 7], batToa: ['Bát Tọa', 'O', 7],
    anQuang: ['Ân Quang', 'M', 3], thienQuy: ['Thiên Quý', 'O', 3], thienKhoc: ['Thiên Khốc', 'T', 12], thienHu: ['Thiên Hư', 'T', 12],
    thienDuc: ['Thiên Đức', 'H', 5], nguyetDuc: ['Nguyệt Đức', 'H', 5], thienHinh: ['Thiên Hình', 'H', 15], thienRieu: ['Thiên Riêu', 'T', 13],
    thienY: ['Thiên Y', 'T', 5], quocAn: ['Quốc Ấn', 'O', 6], duongPhu: ['Đường Phù', 'M', 4], daoHoa: ['Đào Hoa', 'M', 8],
    hongLoan: ['Hồng Loan', 'T', 8], thienHy: ['Thiên Hỷ', 'T', 5], thienGiai: ['Thiên Giải', 'H', 5], diaGiai: ['Địa Giải', 'O', 5],
    giaiThan: ['Giải Thần', 'M', 5], thaiPhu: ['Thai Phụ', 'O', 6], phongCao: ['Phong Cáo', 'O', 4], thienTai: ['Thiên Tài', 'O', 2],
    thienTho: ['Thiên Thọ', 'O', 5], thienThuong: ['Thiên Thương', 'O', 12], thienSu: ['Thiên Sứ', 'T', 12], thienLa: ['Thiên La', 'O', 12],
    diaVong: ['Địa Võng', 'O', 12], hoaKhoa: ['Hóa Khoa', 'K', 5], hoaQuyen: ['Hóa Quyền', 'H', 4], hoaLoc: ['Hóa Lộc', 'M', 3],
    hoaKy: ['Hóa Kỵ', 'T', 13], coThan: ['Cô Thần', 'O', 13], quaTu: ['Quả Tú', 'O', 13], thienMa: ['Thiên Mã', 'H', 3],
    phaToai: ['Phá Toái', 'H', 12], thienQuan: ['Thiên Quan', 'H', 5], thienPhuc: ['Thiên Phúc', 'H', 5], luuHa: ['Lưu Hà', 'T', 12],
    thienTru: ['Thiên Trù', 'O', 5], kiepSat: ['Kiếp Sát', 'H', 11], hoaCai: ['Hoa Cái', 'K', 14], vanTinh: ['Văn Tinh', 'H', 6],
    dauQuan: ['Đẩu Quân', 'H', 5], thienKhong: ['Thiên Không', 'H', 11]
  };
  var TRANG_SINH = ['Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];

  // ---- Đặc tính sao theo cung Tý…Hợi (M miếu, V vượng, Đ đắc, B bình hòa, H hãm)
  var DAC_TINH = {
    tuVi: 'BĐMBVMMĐMBVB', liemTrinh: 'VĐVHMHVĐVHMH', thienDong: 'VHMĐHĐHHMHHĐ', vuKhuc: 'VMVĐMHVMVĐMH',
    thaiDuong: 'HĐVVVMMĐHHHH', thienCo: 'ĐĐHMMVĐĐVMMH', thienPhu: 'MBMBVĐMĐMBVĐ', thaiAm: 'VĐHHHHHĐVMMM',
    thamLang: 'HMĐHVHHMĐHVH', cuMon: 'VHVMHHVHĐMHĐ', thienTuong: 'VĐMHVĐVĐMHVĐ', thienLuong: 'ĐĐVVMHMĐVHMH',
    thatSat: 'MĐMHHVMĐMHHH', phaQuan: 'MVHHVHMVHHVH',
    daLa: 'HĐHHĐHHĐHHĐH', kinhDuong: 'HĐHHĐHHĐHHĐH', linhTinh: 'HBĐĐĐĐĐBHHHH', hoaTinh: 'HBĐĐĐĐĐBHHHH',
    vanXuong: 'HĐHHĐHHĐHHĐH', vanKhuc: 'HĐHHĐHHĐHHĐH', diaKhong: 'HHĐHHĐHHĐHHĐ', diaKiep: 'HHĐHHĐHHĐHHĐ',
    hoaKhoa: 'ĐĐĐĐĐĐĐĐĐĐĐĐ', hoaQuyen: 'HĐHHĐHHĐHHĐH', hoaLoc: 'HĐHHĐHHĐHHĐH', hoaKy: 'HĐHHĐHHĐHHĐH',
    daiHao: 'HHĐĐHHHHĐĐHH', tieuHao: 'HHĐĐHHHHĐĐHH', thienKhoc: 'ĐHHĐHHĐHHĐHH', thienHu: 'ĐHHĐHHĐHHĐHH',
    thienMa: '..Đ..Đ..Đ..Đ', thienHinh: '..ĐĐ....ĐĐ..', thienRieu: '..ĐĐ.....ĐĐ.'
  };
  var DAC_TEN = { M: 'Miếu', V: 'Vượng', 'Đ': 'Đắc', B: 'Bình', H: 'Hãm' };
  var HANH_TEN = { K: 'Kim', M: 'Mộc', T: 'Thủy', H: 'Hỏa', O: 'Thổ' };

  var CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
  var MENH_CHU = ['Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];
  var THAN_CHU = ['Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'];
  var CUC_TEN = { 2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục' };
  var HANH_CUC = { 'Thủy': 2, 'Mộc': 3, 'Kim': 4, 'Thổ': 5, 'Hỏa': 6 };
  var LOC_TON = [0, 3, 4, 6, 7, 6, 7, 9, 10, 12, 1];          // theo can năm 1…10
  var THIEN_QUAN = [0, 8, 5, 6, 3, 4, 10, 12, 10, 11, 7], THIEN_PHUC = [0, 10, 9, 1, 12, 4, 3, 7, 6, 7, 6];
  var LUU_HA = { trungQuoc: [0, 10, 11, 8, 9, 6, 7, 5, 4, 12, 3], ansaotuvi: [0, 10, 11, 8, 5, 6, 7, 9, 4, 12, 3] };
  var THIEN_TRU = [0, 6, 7, 1, 6, 7, 9, 3, 7, 10, 11];
  // Tứ hóa theo can năm: [Lộc, Quyền, Khoa, Kỵ]
  var TU_HOA = [null,
    ['liemTrinh', 'phaQuan', 'vuKhuc', 'thaiDuong'], ['thienCo', 'thienLuong', 'tuVi', 'thaiAm'],
    ['thienDong', 'thienCo', 'vanXuong', 'liemTrinh'], ['thaiAm', 'thienDong', 'thienCo', 'cuMon'],
    ['thamLang', 'thaiAm', 'huuBat', 'thienCo'], ['vuKhuc', 'thamLang', 'thienLuong', 'vanKhuc'],
    ['thaiDuong', 'vuKhuc', 'thienDong', 'thaiAm'], ['cuMon', 'thaiDuong', 'vanKhuc', 'vanXuong'],
    ['thienLuong', 'tuVi', 'thienPhu', 'vuKhuc'], ['phaQuan', 'cuMon', 'thaiAm', 'thamLang']];

  // ---- Quy ước an sao. Mỗi điểm các trường phái khác nhau là một tùy chọn, mặc định theo đặc tả
  // docs/nghien-cuu/tuvi-an-sao-spec.md (mục 10). Lá số trả về kèm quy ước đã dùng.
  var QUY_UOC_MAC_DINH = {
    muiGioLich: 'lichSu',   // 10.2: 'lichSu' = âm lịch theo UTC+8 trước 01/01/1968, UTC+7 từ đó; 'utc7' = UTC+7 mọi năm
    gioTyMuon: 'ngaySau',   // 10.1: sinh 23:00–23:59 'ngaySau' = tính sang ngày hôm sau; 'giuNgay' = giữ ngày, chỉ đổi giờ Tý
    hoaLinh: 'cauPhu',      // 10.6: tuổi Tỵ Dậu Sửu 'cauPhu' = Hỏa khởi Mão, Linh khởi Tuất; 'ansaotuvi' = Hỏa Tuất, Linh Mão (engine cũ)
    khoiViet: 'toanThu',    // 10.8: 'toanThu' = "Giáp Mậu Canh ngưu dương…"; 'canhTanMaHo' = như trên nhưng Canh ở Ngọ/Dần;
                            //       'ansaotuvi' = engine cũ (Khôi/Việt đảo nhau ở can Đinh, Mậu, Canh, Nhâm)
    phaToai: 'iztro',       // 10.9: 'iztro' = Tý Ngọ Mão Dậu → Tỵ, Dần Thân Tỵ Hợi → Dậu, Thìn Tuất Sửu Mùi → Sửu; 'ansaotuvi' = đổi Tỵ và Dậu
    luuHa: 'trungQuoc',     // 10.10: 'trungQuoc' = Đinh Thân, Canh Thìn; 'ansaotuvi' = Đinh Thìn, Canh Thân
    thienTruQuy: 'tuat',    // 10.11: Thiên Trù can Quý 'tuat' (sách Việt, engine cũ) | 'hoi' (iztro)
    thienGiai: 'thienLuong', // 10.7: 'thienLuong' = Thân + 2(M−1); 'capThang' = tháng 1–2 Thân, 3–4 Tuất…; 'thanThuan' = Thân + (M−1)
    menhChu: 'chiNam',      // 10.14: Mệnh chủ tra theo 'chiNam' (chi năm sinh, phái Việt) | 'cungMenh' (chi cung Mệnh, engine cũ, iztro)
    tuViTyNgo: 'ansaotuvi', // 6: độ sáng Tử Vi ở Tý, Ngọ: 'ansaotuvi' = Tý Bình, Ngọ Miếu | 'cungMieu' | 'cungBinh'
    dacTinhHoa: 'ansaotuvi' // 6: độ sáng Hóa Lộc, Quyền, Kỵ: 'ansaotuvi' = đắc ở tứ mộ, hãm nơi khác | 'an' = không ghi
  };
  // Thiên Khôi, Thiên Việt theo can 0…9, cung 0 = Tý
  var KHOI_VIET = {
    toanThu: { khoi: [1, 0, 11, 11, 1, 0, 1, 6, 3, 3], viet: [7, 8, 9, 9, 7, 8, 7, 2, 5, 5] },
    canhTanMaHo: { khoi: [1, 0, 11, 11, 1, 0, 6, 6, 3, 3], viet: [7, 8, 9, 9, 7, 8, 2, 2, 5, 5] },
    ansaotuvi: { khoi: [1, 0, 11, 9, 7, 0, 7, 6, 5, 3], viet: [7, 8, 9, 11, 1, 8, 1, 2, 3, 5] }
  };
  function bangKhoiViet(qu) { return KHOI_VIET[qu.khoiViet] || KHOI_VIET.toanThu; }
  var JD_1968 = L.jdFromDate(1, 1, 1968);
  // Miền Nam dùng đồng hồ UTC+8 từ 01/01/1960 đến 13/06/1975 (cơ sở dữ liệu IANA, Asia/Ho_Chi_Minh)
  var PHUT_MN_TU = L.jdFromDate(1, 1, 1960) * 1440, PHUT_MN_DEN = L.jdFromDate(13, 6, 1975) * 1440;
  function jdCua(x) { return L.jdFromDate(x.ngay, x.thang, x.nam); }
  function tzLich(qu, jd) { return qu.muiGioLich === 'lichSu' && jd < JD_1968 ? 8 : 7; }
  function layQuyUoc(rieng) {
    var qu = {}, k;
    for (k in QUY_UOC_MAC_DINH) qu[k] = rieng && rieng[k] != null ? rieng[k] : QUY_UOC_MAC_DINH[k];
    return qu;
  }
  // Âm → dương theo quy ước múi giờ: ngày trước 1968 đổi theo lịch UTC+8
  function amSangDuong(am, qu) {
    var r = L.amSangDuong(am.ngay, am.thang, am.nam, am.nhuan, 7);
    if (qu.muiGioLich === 'lichSu' && (!r || jdCua(r) < JD_1968)) {
      var r8 = L.amSangDuong(am.ngay, am.thang, am.nam, am.nhuan, 8);
      if (r8 && jdCua(r8) < JD_1968) return r8;
    }
    return r;
  }

  var SINH = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  var KHAC = { Kim: 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
  function sinhKhac(menh, cuc) {
    if (menh === cuc) return 'Mệnh Cục bình hòa';
    if (SINH[menh] === cuc) return 'Mệnh sinh Cục';
    if (SINH[cuc] === menh) return 'Cục sinh Mệnh';
    if (KHAC[menh] === cuc) return 'Mệnh khắc Cục';
    return 'Cục khắc Mệnh';
  }

  /**
   * opts: { lich: 'duong'|'am', ngay, thang, nam, nhuan, gio (0–23), phut (0–59), gioiTinh: 'nam'|'nu', ten,
   *         mienNamTruoc1975: sinh ở miền Nam, giờ khai sinh theo đồng hồ thời đó,
   *         sinhNuocNgoai + muiGioUTC (−12…+14, bước 0,25): giờ khai sinh theo đồng hồ nơi sinh, quy về UTC+7; chỉ khi lich = 'duong',
   *         quyUoc: một phần của QUY_UOC_MAC_DINH (không bắt buộc) }
   */
  function anLaSo(opts) {
    var qu = layQuyUoc(opts.quyUoc);
    var duong;
    if (opts.lich === 'am') {
      duong = amSangDuong({ ngay: +opts.ngay, thang: +opts.thang, nam: +opts.nam, nhuan: !!opts.nhuan }, qu);
      if (!duong) throw new Error('Ngày âm lịch không tồn tại');
    } else {
      duong = { ngay: +opts.ngay, thang: +opts.thang, nam: +opts.nam };
    }
    // Giờ chuẩn UTC+7 (đặc tả 1.2): giờ khai sinh miền Nam 1960–1975 theo đồng hồ UTC+8, lùi 1 giờ
    var phutSinh = jdCua(duong) * 1440 + (+opts.gio) * 60 + (+opts.phut || 0);
    var daQuyDoi = !!opts.mienNamTruoc1975 && phutSinh >= PHUT_MN_TU && phutSinh < PHUT_MN_DEN;
    if (daQuyDoi) phutSinh -= 60;
    // Sinh ở nước ngoài (chỉ khi nhập dương lịch): UTC+7 = giờ địa phương − muiGioUTC + 7; hai cờ loại trừ nhau
    var nuocNgoai = !!opts.sinhNuocNgoai && opts.lich !== 'am';
    if (opts.sinhNuocNgoai && opts.mienNamTruoc1975) throw new Error('Không thể chọn cùng lúc sinh ở nước ngoài và sinh ở miền Nam trước 1975 (hai lựa chọn loại trừ nhau)');
    if (nuocNgoai) {
      if (typeof opts.muiGioUTC !== 'number' || !isFinite(opts.muiGioUTC) || opts.muiGioUTC < -12 || opts.muiGioUTC > 14) throw new Error('Múi giờ nơi sinh cần trong khoảng UTC−12 đến UTC+14');
      phutSinh -= Math.round((opts.muiGioUTC - 7) * 60);
      daQuyDoi = true;
    }
    var ngayChuan = L.jdToDate(Math.floor(phutSinh / 1440)), gioChuan = Math.floor(phutSinh % 1440 / 60), phutChuan = phutSinh % 60;
    // Ngày dùng để đổi âm lịch và tính can chi ngày: giờ Tý muộn (23h) thuộc ngày hôm sau
    var jdLich = Math.floor(phutSinh / 1440) + (gioChuan === 23 && qu.gioTyMuon === 'ngaySau' ? 1 : 0);
    var nl = L.jdToDate(jdLich), ngayLich = { ngay: nl[0], thang: nl[1], nam: nl[2] };
    var tzAm = tzLich(qu, jdLich);
    var am = L.duongSangAm(ngayLich.ngay, ngayLich.thang, ngayLich.nam, tzAm);
    var nn = am.ngay, tt = am.thang, nam = am.nam;   // tháng nhuận an như tháng chính
    var h = L.chiGio(gioChuan), gio = h + 1;         // giờ: 1 = Tý … 12 = Hợi
    var nu = opts.gioiTinh === 'nu', gt = nu ? -1 : 1;
    var canNam = (nam + 6) % 10 + 1, chiNam = (nam + 8) % 12 + 1;
    var amDuongNam = canNam % 2 === 1 ? 1 : -1;
    var amDuongChi = chiNam % 2 === 1 ? 1 : -1;
    var huong = gt * amDuongNam;                       // 1: thuận (dương nam, âm nữ), -1: nghịch

    // Mệnh, Thân, 12 cung chủ
    var cungMenh = d(3, tt - 1, -gio + 1), cungThan = d(3, tt - 1, gio - 1);
    var cungChu = {}, k;
    var CUNG_THUAN = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
    for (k = 0; k < 12; k++) cungChu[d(cungMenh, k)] = CUNG_THUAN[k];
    var cungNoBoc = d(cungMenh, 5), cungTatAch = d(cungMenh, 7);

    // Can các cung (ngũ hổ độn: can tháng Giêng ở Dần)
    var canDan = ((canNam - 1) % 5) * 2 + 2;            // chỉ số 0…9 của can cung Dần
    function canCung(c) { return (canDan + ((c - 3 + 12) % 12)) % 10; }

    // Cục
    var napAmMenh = L.napAm(canCung(cungMenh), cungMenh - 1);
    var hanhCuc = L.hanhCuaNapAm(napAmMenh), cuc = HANH_CUC[hanhCuc];

    var cung = {}; for (var c = 1; c <= 12; c++) cung[c] = [];
    var VI = {};
    function nhap(pos, key) { VI[key] = pos; var s = SAO[key]; cung[pos].push({ key: key, ten: s[0], hanh: s[1], loaiSo: s[2] }); }

    // Tử vi tinh hệ
    var q = cuc, dan = 3; while (q < nn) { q += cuc; dan++; }
    var lech = q - nn; if (lech % 2 === 1) lech = -lech;
    var tv = d(dan, lech);
    nhap(tv, 'tuVi'); nhap(d(tv, 4), 'liemTrinh'); nhap(d(tv, 7), 'thienDong'); nhap(d(tv, 8), 'vuKhuc');
    nhap(d(tv, 9), 'thaiDuong'); nhap(d(tv, 11), 'thienCo');
    var tp = d(3, 3 - tv);
    nhap(tp, 'thienPhu'); nhap(d(tp, 1), 'thaiAm'); nhap(d(tp, 2), 'thamLang'); nhap(d(tp, 3), 'cuMon');
    nhap(d(tp, 4), 'thienTuong'); nhap(d(tp, 5), 'thienLuong'); nhap(d(tp, 6), 'thatSat'); nhap(d(tp, 10), 'phaQuan');

    // Vòng Lộc Tồn – Bác Sỹ
    var lt = LOC_TON[canNam];
    nhap(lt, 'locTon'); nhap(lt, 'bacSy');
    ['lucSi', 'thanhLong', 'tieuHao', 'tuongQuan', 'tauThu', 'phiLiem', 'hyThan', 'benhPhu', 'daiHao', 'phucBinh', 'quanPhu2']
      .forEach(function (key, i) { nhap(d(lt, (i + 1) * huong), key); });

    // Vòng Thái Tuế
    nhap(chiNam, 'thaiTue');
    nhap(d(chiNam, 1), 'thieuDuong'); nhap(d(chiNam, 1), 'thienKhong'); nhap(d(chiNam, 2), 'tangMon'); nhap(d(chiNam, 3), 'thieuAm');
    nhap(d(chiNam, 4), 'quanPhu3'); nhap(d(chiNam, 5), 'tuPhu'); nhap(d(chiNam, 5), 'nguyetDuc'); nhap(d(chiNam, 6), 'tuePha');
    nhap(d(chiNam, 7), 'longDuc'); nhap(d(chiNam, 8), 'bachHo'); nhap(d(chiNam, 9), 'phucDuc'); nhap(d(chiNam, 9), 'thienDuc');
    nhap(d(chiNam, 10), 'dieuKhach'); nhap(d(chiNam, 11), 'trucPhu');

    // Vòng Tràng Sinh
    var tsStart = cuc === 6 ? 3 : cuc === 4 ? 6 : cuc === 3 ? 12 : 9;
    var trangSinh = {}; for (k = 0; k < 12; k++) trangSinh[d(tsStart, huong * k)] = TRANG_SINH[k];

    // Lục sát, sao đôi
    nhap(d(lt, -1), 'daLa'); var kd = d(lt, 1); nhap(kd, 'kinhDuong');
    var kiep = d(11, gio); nhap(kiep, 'diaKiep'); nhap(d(12, 12 - kiep), 'diaKhong');
    var hk, lk;
    if ([3, 7, 11].indexOf(chiNam) >= 0) { hk = 2; lk = 4; }
    else if ([1, 5, 9].indexOf(chiNam) >= 0) { hk = 3; lk = 11; }
    else if ([6, 10, 2].indexOf(chiNam) >= 0) { if (qu.hoaLinh === 'ansaotuvi') { hk = 11; lk = 4; } else { hk = 4; lk = 11; } }
    else { hk = 10; lk = 11; }
    if (gt * amDuongNam === -1) { nhap(d(hk + 1, -gio), 'hoaTinh'); nhap(d(lk - 1, gio), 'linhTinh'); }
    else { nhap(d(hk - 1, gio), 'hoaTinh'); nhap(d(lk + 1, -gio), 'linhTinh'); }
    var longTri = d(5, chiNam - 1); nhap(longTri, 'longTri');
    var phuongCac = d(2, 2 - longTri); nhap(phuongCac, 'phuongCac'); nhap(phuongCac, 'giaiThan');
    var taPhu = d(5, tt - 1); nhap(taPhu, 'taPhu'); nhap(d(2, 2 - taPhu), 'huuBat');
    var vanKhuc = d(5, gio - 1); nhap(vanKhuc, 'vanKhuc'); var vanXuong = d(2, 2 - vanKhuc); nhap(vanXuong, 'vanXuong');
    var tamThai = d(5, tt + nn - 2); nhap(tamThai, 'tamThai'); nhap(d(2, 2 - tamThai), 'batToa');
    var anQuang = d(vanXuong, nn - 2); nhap(anQuang, 'anQuang'); nhap(d(2, 2 - anQuang), 'thienQuy');
    var kv = bangKhoiViet(qu); nhap(kv.khoi[canNam - 1] + 1, 'thienKhoi'); nhap(kv.viet[canNam - 1] + 1, 'thienViet');
    nhap(d(7, chiNam - 1), 'thienHu'); nhap(d(7, -chiNam + 1), 'thienKhoc');
    nhap(d(cungMenh, chiNam - 1), 'thienTai'); nhap(d(cungThan, chiNam - 1), 'thienTho');
    var hongLoan = d(4, -chiNam + 1); nhap(hongLoan, 'hongLoan'); nhap(d(hongLoan, 6), 'thienHy');
    nhap(THIEN_QUAN[canNam], 'thienQuan'); nhap(THIEN_PHUC[canNam], 'thienPhuc');
    var thienHinh = d(10, tt - 1); nhap(thienHinh, 'thienHinh'); nhap(d(thienHinh, 4), 'thienRieu'); nhap(d(thienHinh, 4), 'thienY');
    var coThan = [0, 3, 3, 6, 6, 6, 9, 9, 9, 12, 12, 12, 3][chiNam]; nhap(coThan, 'coThan'); nhap(d(coThan, -4), 'quaTu');
    var vanTinh = d(kd, 2); nhap(vanTinh, 'vanTinh'); var duongPhu = d(vanTinh, 2); nhap(duongPhu, 'duongPhu'); nhap(d(duongPhu, 3), 'quocAn');
    nhap(d(vanKhuc, 2), 'thaiPhu'); nhap(d(vanKhuc, -2), 'phongCao');
    var thienGiai = qu.thienGiai === 'capThang' ? d(9, 2 * Math.floor((tt - 1) / 2)) : qu.thienGiai === 'thanThuan' ? d(9, tt - 1) : d(9, 2 * tt - 2);
    nhap(thienGiai, 'thienGiai'); nhap(d(taPhu, 3), 'diaGiai');
    nhap(5, 'thienLa'); nhap(11, 'diaVong'); nhap(cungNoBoc, 'thienThuong'); nhap(cungTatAch, 'thienSu');
    var thienMa = [6, 3, 12, 9][chiNam % 4]; nhap(thienMa, 'thienMa');
    nhap(d(thienMa, 2), 'hoaCai'); var kiepSat = d(thienMa, 3); nhap(kiepSat, 'kiepSat'); nhap(d(kiepSat, 4), 'daoHoa');
    nhap((qu.phaToai === 'ansaotuvi' ? [6, 10, 2] : [10, 6, 2])[chiNam % 3], 'phaToai');
    nhap(d(chiNam, -tt + gio), 'dauQuan');

    // Tứ hóa
    var th = TU_HOA[canNam], HOA_KEY = ['hoaLoc', 'hoaQuyen', 'hoaKhoa', 'hoaKy'], HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
    var hoaCua = {};
    th.forEach(function (key, i) { nhap(VI[key], HOA_KEY[i]); hoaCua[key] = HOA_TEN[i]; });
    nhap((LUU_HA[qu.luuHa] || LUU_HA.trungQuoc)[canNam], 'luuHa');
    nhap(canNam === 10 && qu.thienTruQuy === 'hoi' ? 12 : THIEN_TRU[canNam], 'thienTru');

    // Tuần, Triệt
    var tuan1 = d(d(chiNam, 10 - canNam), 1), tuan2 = d(tuan1, 1);
    var triet = [[9, 10], [7, 8], [5, 6], [3, 4], [1, 2]][(canNam - 1) % 5];

    // Đại hạn, tiểu hạn
    function khoangCach(a, b, chieu) { return chieu === 1 ? (a - b + 12) % 12 : (b - a + 12) % 12; }
    var huongDH = gt * amDuongChi;
    var khoiHan = d(11, -3 * (chiNam - 1));
    var cungTy1 = d(khoiHan, -gt * (chiNam - 1));

    // Độ sáng sao tại cung c (1 = Tý … 12 = Hợi), theo quy ước ở các điểm sách chưa thống nhất
    function dacTinh(key, c) {
      if (qu.dacTinhHoa === 'an' && (key === 'hoaLoc' || key === 'hoaQuyen' || key === 'hoaKy')) return '.';
      if (key === 'tuVi' && (c === 1 || c === 7) && qu.tuViTyNgo !== 'ansaotuvi') return qu.tuViTyNgo === 'cungMieu' ? 'M' : 'B';
      return DAC_TINH[key] ? DAC_TINH[key].charAt(c - 1) : '.';
    }

    var ketQua = [];
    for (c = 1; c <= 12; c++) {
      var dsSao = cung[c].map(function (s) {
        var dt = dacTinh(s.key, c);
        return {
          key: s.key, ten: s.ten, hanh: HANH_TEN[s.hanh],
          loai: s.loaiSo === 1 ? 'chinh' : s.loaiSo < 10 ? 'cat' : 'sat',
          dacTinh: dt !== '.' ? dt : null, dacTinhTen: dt !== '.' ? DAC_TEN[dt] : null,
          hoa: hoaCua[s.key] || null
        };
      });
      var dh = cuc + khoangCach(c, cungMenh, huongDH) * 10;
      ketQua[c - 1] = {
        chi: c - 1, tenChi: CHI[c - 1], can: CAN[canCung(c)], ten: cungChu[c], hanhCung: ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'][c - 1],
        laThan: c === cungThan, tuan: c === tuan1 || c === tuan2, triet: c === triet[0] || c === triet[1],
        chinhTinh: dsSao.filter(function (s) { return s.loai === 'chinh'; }),
        catTinh: dsSao.filter(function (s) { return s.loai === 'cat'; }),
        hungTinh: dsSao.filter(function (s) { return s.loai === 'sat'; }),
        phuTinh: dsSao.filter(function (s) { return s.loai !== 'chinh'; }),
        trangSinh: trangSinh[c],
        daiVan: dh + '–' + (dh + 9), daiVanTu: dh,
        tieuHan: CHI[khoangCach(c, cungTy1, gt)]
      };
    }

    var jd = jdCua(ngayLich);
    var ccD = L.canChiNgay(jd), ccM = L.canChiThang(am.thang, am.nam);
    var canGio = (L.canGioTy(ccD.can) + h) % 10;
    var napAmNam = L.napAm(canNam - 1, chiNam - 1), hanhMenh = L.hanhCuaNapAm(napAmNam);
    var amDuongCung = cungMenh % 2 === 1 ? 1 : -1;

    return {
      ten: opts.ten || '',
      gioiTinh: nu ? 'Nữ' : 'Nam',
      amDuong: (amDuongNam === 1 ? 'Dương ' : 'Âm ') + (nu ? 'Nữ' : 'Nam'),
      amDuongLy: amDuongCung * amDuongChi === 1 ? 'Âm dương thuận lý' : 'Âm dương nghịch lý',
      duong: duong, am: am,
      gio: { chi: CHI[h], khoang: L.GIO_KHOANG[h], canChi: CAN[canGio] + ' ' + CHI[h], dongHo: hhmm(+opts.gio, +opts.phut || 0) },
      canChi: { nam: CAN[canNam - 1] + ' ' + CHI[chiNam - 1], thang: L.ten(ccM), ngay: L.ten(ccD), gio: CAN[canGio] + ' ' + CHI[h] },
      conGiap: L.CON_GIAP[chiNam - 1],
      banMenh: napAmNam, hanhMenh: hanhMenh,
      cuc: CUC_TEN[cuc], cucHanh: hanhCuc, sinhKhac: sinhKhac(hanhMenh, hanhCuc),
      menhTai: CHI[cungMenh - 1], thanTai: CHI[cungThan - 1] + ' (cung ' + cungChu[cungThan] + ')',
      menhChu: qu.menhChu === 'cungMenh' ? MENH_CHU[cungMenh - 1] : MENH_CHU[chiNam - 1], thanChu: THAN_CHU[chiNam - 1],
      menhChuCach: { theoChiNam: MENH_CHU[chiNam - 1], theoCungMenh: MENH_CHU[cungMenh - 1] },
      tuan: CHI[tuan1 - 1] + '–' + CHI[tuan2 - 1], triet: CHI[triet[0] - 1] + '–' + CHI[triet[1] - 1],
      // nguon chỉ có khi sinh nước ngoài (miền Nam giữ nguyên hình dạng cũ); nuocNgoai giữ giờ nhập để viết câu quy ước
      gioChuan: nuocNgoai
        ? { ngay: ngayChuan[0], thang: ngayChuan[1], nam: ngayChuan[2], gio: hhmm(gioChuan, phutChuan), daQuyDoi: true, nguon: 'nuocNgoai' }
        : { ngay: ngayChuan[0], thang: ngayChuan[1], nam: ngayChuan[2], gio: hhmm(gioChuan, phutChuan), daQuyDoi: daQuyDoi },
      nuocNgoai: nuocNgoai ? { muiGioUTC: opts.muiGioUTC, ngay: duong.ngay, thang: duong.thang, nam: duong.nam, gio: hhmm(+opts.gio, +opts.phut || 0) } : null,
      amLichTz: tzAm,
      chiSo: { canNam: canNam - 1, chiNam: chiNam - 1, thang: tt, gio: h },   // dùng cho anLuuNien
      quyUoc: qu,
      cung: ketQua
    };
  }

  // ---- Lưu niên (đặc tả mục 7.3–7.5): sao lưu theo can chi năm xem, lưu tứ hóa, đại vận, tiểu hạn, lưu nguyệt
  var VAN_KHUC_LUU = [9, 8, 6, 5, 6, 5, 3, 2, 0, 11];
  var SAO_LUU_TEN = {
    thaiTue: 'L. Thái Tuế', tangMon: 'L. Tang Môn', bachHo: 'L. Bạch Hổ', thienKhoc: 'L. Thiên Khốc', thienHu: 'L. Thiên Hư',
    locTon: 'L. Lộc Tồn', kinhDuong: 'L. Kình Dương', daLa: 'L. Đà La', thienMa: 'L. Thiên Mã',
    thienKhoi: 'L. Thiên Khôi', thienViet: 'L. Thiên Việt', vanXuong: 'L. Văn Xương', vanKhuc: 'L. Văn Khúc',
    hongLoan: 'L. Hồng Loan', thienHy: 'L. Thiên Hỷ'
  };

  /**
   * An sao lưu cho năm âm lịch namXem trên lá số ls (kết quả của anLaSo).
   * tuyChon.dayDu: thêm 6 sao lưu ít dùng ở phái Việt (Khôi, Việt, Xương, Khúc, Hồng Loan, Thiên Hỷ).
   * Chỉ số cung: 0 = Tý … 11 = Hợi.
   */
  function anLuuNien(ls, namXem, tuyChon) {
    var dayDu = !!(tuyChon && tuyChon.dayDu);
    var c = (namXem + 6) % 10, y = (namXem + 8) % 12;
    var m = function (x) { return ((x % 12) + 12) % 12; };
    var lt = LOC_TON[c + 1] - 1;
    var vt = {
      thaiTue: y, tangMon: m(y + 2), bachHo: m(y + 8), thienKhoc: m(6 - y), thienHu: m(6 + y),
      locTon: lt, kinhDuong: m(lt + 1), daLa: m(lt - 1), thienMa: [2, 11, 8, 5][y % 4]
    };
    if (dayDu) {
      var kv = bangKhoiViet(ls.quyUoc);
      vt.thienKhoi = kv.khoi[c]; vt.thienViet = kv.viet[c];
      vt.vanXuong = m(lt + 3); vt.vanKhuc = VAN_KHUC_LUU[c];
      vt.hongLoan = m(3 - y); vt.thienHy = m(9 - y);
    }
    var saoLuu = Object.keys(vt).map(function (k) { return { key: 'luu_' + k, ten: SAO_LUU_TEN[k], chi: vt[k] }; });

    var viTri = {};
    ls.cung.forEach(function (cg) { cg.chinhTinh.concat(cg.phuTinh).forEach(function (s) { viTri[s.key] = cg.chi; }); });
    var HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
    var luuTuHoa = TU_HOA[c + 1].map(function (k, i) { return { hoa: HOA_TEN[i], sao: SAO[k][0], chi: viTri[k] }; });

    var tuoiMu = namXem - ls.am.nam + 1;
    var daiVan = null, tieuHan = null;
    ls.cung.forEach(function (cg) {
      if (tuoiMu >= cg.daiVanTu && tuoiMu <= cg.daiVanTu + 9) daiVan = cg.chi;
      if (cg.tieuHan === CHI[y]) tieuHan = cg.chi;
    });
    // Lưu nguyệt (Đẩu Quân năm xem): tháng t ở cung Y' − (M − 1) + H + (t − 1)
    var luuNguyet = [];
    for (var t = 1; t <= 12; t++) luuNguyet.push(m(y - (ls.chiSo.thang - 1) + ls.chiSo.gio + t - 1));

    return {
      namXem: namXem, canChi: CAN[c] + ' ' + CHI[y], tuoiMu: tuoiMu,
      saoLuu: saoLuu, luuTuHoa: luuTuHoa,
      luuThaiTue: y, daiVan: daiVan, tieuHan: tieuHan, luuNguyet: luuNguyet
    };
  }

  function hhmm(g, p) { return (g < 10 ? '0' : '') + g + ':' + (p < 10 ? '0' : '') + p; }
  function fmt(s) { return s.ten + (s.dacTinh ? ' (' + s.dacTinh + ')' : ''); }

  /** Tóm tắt lá số thành văn bản gọn để gửi cho AI luận giải */
  function tomTat(ls) {
    var lines = [];
    lines.push('Giới tính: ' + ls.gioiTinh + ' (' + ls.amDuong + ', ' + ls.amDuongLy + ')');
    lines.push('Sinh dương lịch: ' + ls.duong.ngay + '/' + ls.duong.thang + '/' + ls.duong.nam + ', ' + ls.gio.dongHo + ' giờ ' + ls.gio.chi + ' (' + ls.gio.khoang + ')');
    lines.push('Âm lịch: ngày ' + ls.am.ngay + ' tháng ' + ls.am.thang + (ls.am.nhuan ? ' (nhuận)' : '') + ' năm ' + ls.canChi.nam + ', giờ ' + ls.gio.canChi);
    lines.push('Bản mệnh: ' + ls.banMenh + '. Cục: ' + ls.cuc + ' (' + ls.sinhKhac + '). Mệnh an tại ' + ls.menhTai + ', Thân cư ' + ls.thanTai + '.');
    lines.push('Mệnh chủ: ' + ls.menhChu + '. Thân chủ: ' + ls.thanChu + '. Tuần tại ' + ls.tuan + ', Triệt tại ' + ls.triet + '.');
    lines.push('Ký hiệu đặc tính sao: M = miếu, V = vượng, Đ = đắc địa, B = bình hòa, H = hãm.');
    var order = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
    order.forEach(function (tenCung) {
      var c = ls.cung.filter(function (x) { return x.ten === tenCung; })[0];
      var chinh = c.chinhTinh.length ? c.chinhTinh.map(fmt).join(', ') : 'Vô chính diệu';
      lines.push('- ' + c.ten + ' (' + c.can + ' ' + c.tenChi + (c.laThan ? ', có Thân' : '') + (c.tuan ? ', bị Tuần' : '') + (c.triet ? ', bị Triệt' : '') +
        ', đại vận ' + c.daiVan + ', ' + c.trangSinh + '): ' + chinh +
        ' | Cát: ' + (c.catTinh.map(fmt).join(', ') || 'không') + ' | Hung: ' + (c.hungTinh.map(fmt).join(', ') || 'không'));
    });
    return lines.join('\n');
  }

  return { anLaSo: anLaSo, anLuuNien: anLuuNien, tomTat: tomTat, CUNG: CUNG, DAC_TEN: DAC_TEN, QUY_UOC_MAC_DINH: QUY_UOC_MAC_DINH };
});
