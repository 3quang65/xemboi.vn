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
  var KHOI = [0, 2, 1, 12, 10, 8, 1, 8, 7, 6, 4];
  var THIEN_QUAN = [0, 8, 5, 6, 3, 4, 10, 12, 10, 11, 7], THIEN_PHUC = [0, 10, 9, 1, 12, 4, 3, 7, 6, 7, 6];
  var LUU_HA = [0, 10, 11, 8, 5, 6, 7, 9, 4, 12, 3], THIEN_TRU = [0, 6, 7, 1, 6, 7, 9, 3, 7, 10, 11];
  // Tứ hóa theo can năm: [Lộc, Quyền, Khoa, Kỵ]
  var TU_HOA = [null,
    ['liemTrinh', 'phaQuan', 'vuKhuc', 'thaiDuong'], ['thienCo', 'thienLuong', 'tuVi', 'thaiAm'],
    ['thienDong', 'thienCo', 'vanXuong', 'liemTrinh'], ['thaiAm', 'thienDong', 'thienCo', 'cuMon'],
    ['thamLang', 'thaiAm', 'huuBat', 'thienCo'], ['vuKhuc', 'thamLang', 'thienLuong', 'vanKhuc'],
    ['thaiDuong', 'vuKhuc', 'thienDong', 'thaiAm'], ['cuMon', 'thaiDuong', 'vanKhuc', 'vanXuong'],
    ['thienLuong', 'tuVi', 'thienPhu', 'vuKhuc'], ['phaQuan', 'cuMon', 'thaiAm', 'thamLang']];

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
   * opts: { lich: 'duong'|'am', ngay, thang, nam, nhuan, gio (0–23), gioiTinh: 'nam'|'nu', ten }
   */
  function anLaSo(opts) {
    var am, duong;
    if (opts.lich === 'am') {
      am = { ngay: +opts.ngay, thang: +opts.thang, nam: +opts.nam, nhuan: !!opts.nhuan };
      duong = L.amSangDuong(am.ngay, am.thang, am.nam, am.nhuan);
      if (!duong) throw new Error('Ngày âm lịch không tồn tại');
    } else {
      duong = { ngay: +opts.ngay, thang: +opts.thang, nam: +opts.nam };
      am = L.duongSangAm(duong.ngay, duong.thang, duong.nam);
    }
    var nn = am.ngay, tt = am.thang, nam = am.nam;   // tháng nhuận an như tháng chính
    var h = L.chiGio(+opts.gio), gio = h + 1;         // giờ: 1 = Tý … 12 = Hợi
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
    else if ([6, 10, 2].indexOf(chiNam) >= 0) { hk = 11; lk = 4; }
    else { hk = 10; lk = 11; }
    if (gt * amDuongNam === -1) { nhap(d(hk + 1, -gio), 'hoaTinh'); nhap(d(lk - 1, gio), 'linhTinh'); }
    else { nhap(d(hk - 1, gio), 'hoaTinh'); nhap(d(lk + 1, -gio), 'linhTinh'); }
    var longTri = d(5, chiNam - 1); nhap(longTri, 'longTri');
    var phuongCac = d(2, 2 - longTri); nhap(phuongCac, 'phuongCac'); nhap(phuongCac, 'giaiThan');
    var taPhu = d(5, tt - 1); nhap(taPhu, 'taPhu'); nhap(d(2, 2 - taPhu), 'huuBat');
    var vanKhuc = d(5, gio - 1); nhap(vanKhuc, 'vanKhuc'); var vanXuong = d(2, 2 - vanKhuc); nhap(vanXuong, 'vanXuong');
    var tamThai = d(5, tt + nn - 2); nhap(tamThai, 'tamThai'); nhap(d(2, 2 - tamThai), 'batToa');
    var anQuang = d(vanXuong, nn - 2); nhap(anQuang, 'anQuang'); nhap(d(2, 2 - anQuang), 'thienQuy');
    var khoi = KHOI[canNam]; nhap(khoi, 'thienKhoi'); nhap(d(5, 5 - khoi), 'thienViet');
    nhap(d(7, chiNam - 1), 'thienHu'); nhap(d(7, -chiNam + 1), 'thienKhoc');
    nhap(d(cungMenh, chiNam - 1), 'thienTai'); nhap(d(cungThan, chiNam - 1), 'thienTho');
    var hongLoan = d(4, -chiNam + 1); nhap(hongLoan, 'hongLoan'); nhap(d(hongLoan, 6), 'thienHy');
    nhap(THIEN_QUAN[canNam], 'thienQuan'); nhap(THIEN_PHUC[canNam], 'thienPhuc');
    var thienHinh = d(10, tt - 1); nhap(thienHinh, 'thienHinh'); nhap(d(thienHinh, 4), 'thienRieu'); nhap(d(thienHinh, 4), 'thienY');
    var coThan = [0, 3, 3, 6, 6, 6, 9, 9, 9, 12, 12, 12, 3][chiNam]; nhap(coThan, 'coThan'); nhap(d(coThan, -4), 'quaTu');
    var vanTinh = d(kd, 2); nhap(vanTinh, 'vanTinh'); var duongPhu = d(vanTinh, 2); nhap(duongPhu, 'duongPhu'); nhap(d(duongPhu, 3), 'quocAn');
    nhap(d(vanKhuc, 2), 'thaiPhu'); nhap(d(vanKhuc, -2), 'phongCao');
    nhap(d(9, 2 * tt - 2), 'thienGiai'); nhap(d(taPhu, 3), 'diaGiai');
    nhap(5, 'thienLa'); nhap(11, 'diaVong'); nhap(cungNoBoc, 'thienThuong'); nhap(cungTatAch, 'thienSu');
    var thienMa = [6, 3, 12, 9][chiNam % 4]; nhap(thienMa, 'thienMa');
    nhap(d(thienMa, 2), 'hoaCai'); var kiepSat = d(thienMa, 3); nhap(kiepSat, 'kiepSat'); nhap(d(kiepSat, 4), 'daoHoa');
    nhap([6, 10, 2][chiNam % 3], 'phaToai');
    nhap(d(chiNam, -tt + gio), 'dauQuan');

    // Tứ hóa
    var th = TU_HOA[canNam], HOA_KEY = ['hoaLoc', 'hoaQuyen', 'hoaKhoa', 'hoaKy'], HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
    var hoaCua = {};
    th.forEach(function (key, i) { nhap(VI[key], HOA_KEY[i]); hoaCua[key] = HOA_TEN[i]; });
    nhap(LUU_HA[canNam], 'luuHa'); nhap(THIEN_TRU[canNam], 'thienTru');

    // Tuần, Triệt
    var tuan1 = d(d(chiNam, 10 - canNam), 1), tuan2 = d(tuan1, 1);
    var triet = [[9, 10], [7, 8], [5, 6], [3, 4], [1, 2]][(canNam - 1) % 5];

    // Đại hạn, tiểu hạn
    function khoangCach(a, b, chieu) { return chieu === 1 ? (a - b + 12) % 12 : (b - a + 12) % 12; }
    var huongDH = gt * amDuongChi;
    var khoiHan = d(11, -3 * (chiNam - 1));
    var cungTy1 = d(khoiHan, -gt * (chiNam - 1));

    var ketQua = [];
    for (c = 1; c <= 12; c++) {
      var dsSao = cung[c].map(function (s) {
        var dt = DAC_TINH[s.key] ? DAC_TINH[s.key].charAt(c - 1) : '.';
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

    var jd = L.jdFromDate(duong.ngay, duong.thang, duong.nam);
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
      gio: { chi: CHI[h], khoang: L.GIO_KHOANG[h], canChi: CAN[canGio] + ' ' + CHI[h] },
      canChi: { nam: CAN[canNam - 1] + ' ' + CHI[chiNam - 1], thang: L.ten(ccM), ngay: L.ten(ccD), gio: CAN[canGio] + ' ' + CHI[h] },
      conGiap: L.CON_GIAP[chiNam - 1],
      banMenh: napAmNam, hanhMenh: hanhMenh,
      cuc: CUC_TEN[cuc], cucHanh: hanhCuc, sinhKhac: sinhKhac(hanhMenh, hanhCuc),
      menhTai: CHI[cungMenh - 1], thanTai: CHI[cungThan - 1] + ' (cung ' + cungChu[cungThan] + ')',
      menhChu: MENH_CHU[cungMenh - 1], thanChu: THAN_CHU[chiNam - 1],
      tuan: CHI[tuan1 - 1] + '–' + CHI[tuan2 - 1], triet: CHI[triet[0] - 1] + '–' + CHI[triet[1] - 1],
      cung: ketQua
    };
  }

  function fmt(s) { return s.ten + (s.dacTinh ? ' (' + s.dacTinh + ')' : ''); }

  /** Tóm tắt lá số thành văn bản gọn để gửi cho AI luận giải */
  function tomTat(ls) {
    var lines = [];
    lines.push('Giới tính: ' + ls.gioiTinh + ' (' + ls.amDuong + ', ' + ls.amDuongLy + ')');
    lines.push('Sinh dương lịch: ' + ls.duong.ngay + '/' + ls.duong.thang + '/' + ls.duong.nam + ', giờ ' + ls.gio.chi + ' (' + ls.gio.khoang + ')');
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

  return { anLaSo: anLaSo, tomTat: tomTat, CUNG: CUNG, DAC_TEN: DAC_TEN };
});
