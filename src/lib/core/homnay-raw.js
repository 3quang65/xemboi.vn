/*
 * homnay.js — Tử vi hằng ngày cho 12 con giáp, tính hoàn toàn bằng lịch (không gọi AI).
 * Dựa trên: quan hệ chi của tuổi với chi của ngày (tam hợp, lục hợp, xung, hại, hình),
 * ngũ hành can ngày với hành của tuổi, ngày hoàng đạo / hắc đạo, trực ngày.
 * Lời văn chọn theo ngày nên mỗi ngày mỗi khác, nhưng cùng một ngày thì luôn giống nhau.
 * Dùng chung cho trình duyệt (window.HomNay) và máy chủ.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./lich-raw.js'));
  else root.HomNay = factory(root.Lich);
})(typeof self !== 'undefined' ? self : this, function (L) {
  'use strict';
  L = (L && L.default) ? L.default : L;
  var SLUG = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'];
  var HANH_CHI = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
  var HANH_CAN = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
  var SINH = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  var KHAC = { Kim: 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
  var MAU = { Kim: 'trắng, bạc', 'Mộc': 'xanh lá', 'Thủy': 'đen, xanh dương', 'Hỏa': 'đỏ, cam, hồng', 'Thổ': 'vàng, nâu' };
  // Hướng xuất hành theo can ngày (theo lịch vạn niên dân gian)
  var HY_THAN = ['Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam', 'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam'];
  var TAI_THAN = ['Đông Nam', 'Đông Nam', 'Chính Đông', 'Chính Đông', 'Chính Bắc', 'Chính Nam', 'Tây Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc'];

  var LOI = {
    congViec: {
      tot: ['Việc đang dở hôm nay trôi chảy, cấp trên hoặc khách hàng dễ gật đầu. Việc cần ký, cần trình thì nên làm trong buổi sáng.', 'Đầu óc sáng, xử lý việc khó nhanh hơn mọi ngày. Ai nhờ góp ý thì cứ nói, lời của con hôm nay có trọng lượng.', 'Có người chủ động tìm đến bàn việc. Nghe kỹ, có khi là cơ hội mới chứ không phải thêm việc.', 'Làm theo nhóm thuận lợi, được đồng nghiệp đỡ lời. Hợp mở đầu dự án hoặc đề xuất ý tưởng.', 'Hôm nay con nói người ta nghe. Việc gì đã chuẩn bị kỹ thì mạnh dạn đưa ra.'],
      binh: ['Công việc đều đều, không có biến lớn. Làm cho xong phần của mình, đừng ôm thêm việc người khác.', 'Việc nhiều mà vụn. Ghi ra giấy, làm lần lượt thì cuối ngày vẫn xong.', 'Có chút chậm trễ do người khác, con chịu khó nhắc nhẹ là được việc.', 'Hợp làm việc giấy tờ, sắp xếp lại kế hoạch hơn là quyết việc lớn.', 'Ngày bình thường, làm chắc tay. Chuyện đổi việc, xin tăng lương để hôm khác thuận hơn.'],
      giu: ['Dễ có hiểu lầm trong lời nói ở chỗ làm. Gửi tin nhắn, email thì đọc lại trước khi bấm gửi.', 'Việc dễ bị trì hoãn hoặc phải làm lại. Kiểm tra kỹ từng bước, đừng vội.', 'Hôm nay không hợp tranh luận với cấp trên. Ý kiến để mai nói, lúc mọi người bình tĩnh hơn.', 'Tránh ký kết vội vàng. Đọc kỹ điều khoản, chỗ nào chưa rõ thì hỏi lại.', 'Áp lực hơi nhiều, giữ nhịp đều, làm xong việc nào chắc việc đó.']
    },
    taiLoc: {
      tot: ['Tiền bạc có lộc nhỏ: khoản được trả, món hời hay lời mời làm thêm. Nhận rồi nhớ để dành một phần.', 'Hợp buôn bán, chốt đơn, thu nợ. Khách dễ chịu, mặc cả ít.', 'Có người giúp chuyện tiền nong đúng lúc. Ghi nhớ ơn, sau này trả lại.', 'Mua sắm đồ dùng cần thiết hôm nay được giá. Đồ không cần thì đừng mua.', 'Tài lộc vượng, việc làm thêm, bán hàng online đều thuận.'],
      binh: ['Thu chi cân bằng. Chi tiêu theo kế hoạch là yên.', 'Tiền vào không nhiều nhưng đều. Ghi lại các khoản chi trong ngày cho dễ quản lý.', 'Không hợp đầu tư lớn, hợp tiết kiệm và trả các khoản nhỏ còn nợ.', 'Có khoản chi cho gia đình hoặc bạn bè, chi vui vẻ trong khả năng là được.', 'Ngày bình bình về tiền bạc, giữ ví chặt một chút là đủ.'],
      giu: ['Dễ hao tiền vì mua theo cảm hứng. Đợi một đêm rồi hãy quyết món đồ đắt tiền.', 'Không cho vay, không đứng ra bảo lãnh hôm nay. Người hỏi vay mấy thì cũng từ chối khéo.', 'Cẩn thận tin nhắn lạ, cuộc gọi lạ hỏi chuyện tiền. Không chuyển khoản khi chưa xác minh.', 'Đầu tư, chơi hụi, góp vốn để hôm khác. Hôm nay giữ tiền là thắng.', 'Có khoản chi bất ngờ (sửa xe, sửa đồ). Để sẵn một ít dự phòng.']
    },
    tinhCam: {
      tot: ['Chuyện tình cảm ấm áp. Người có đôi nên dành buổi tối cho nhau; người độc thân dễ được để ý.', 'Lời nói dễ lọt tai người thương. Điều gì muốn bày tỏ thì hôm nay là lúc.', 'Gia đình vui vẻ, hợp rủ cả nhà ăn cơm chung hoặc thăm ông bà.', 'Gặp lại bạn cũ, có tin vui từ người thân ở xa.', 'Hợp hẹn hò, ra mắt, gặp gỡ. Ăn mặc chỉn chu một chút thì càng thuận.'],
      binh: ['Tình cảm êm, không sóng gió. Hỏi han nhau một câu là đủ ấm.', 'Người thương có chút bận, con thông cảm thì mọi chuyện nhẹ nhàng.', 'Ngày bình yên trong nhà. Đừng mang chuyện công việc về trút lên người thân.', 'Người độc thân nên mở lòng với bạn bè mới, duyên đến từ chỗ quen biết.', 'Không có gì đặc biệt, nhưng một lời khen nhỏ sẽ làm người thương vui cả ngày.'],
      giu: ['Dễ giận nhau vì chuyện nhỏ. Nóng thì im lặng trước, nói sau.', 'Đừng nhắc chuyện cũ khi đang không vui. Hôm nay nhường một câu là êm cả nhà.', 'Có người thứ ba xen vào chuyện hai người. Tin nhau và nói thẳng với nhau.', 'Không hợp quyết chuyện lớn trong tình cảm. Để vài hôm cho lòng lắng lại.', 'Người thân có chút trách móc, con nghe cho hết rồi hãy giải thích.']
    },
    sucKhoe: {
      tot: ['Sức khỏe tốt, tinh thần sảng khoái. Hợp bắt đầu thói quen tập luyện mới.', 'Ăn ngon ngủ yên. Đi bộ thêm một chút thì người càng nhẹ.', 'Năng lượng dồi dào, nhưng đừng thức khuya vì thấy mình còn khỏe.', 'Tinh thần vui, nhìn đâu cũng thấy thuận mắt.', 'Cơ thể khỏe khoắn, hợp vận động ngoài trời.'],
      binh: ['Sức khỏe ổn. Uống đủ nước, ăn đúng bữa là được.', 'Hơi mỏi vai gáy nếu ngồi lâu. Đứng dậy đi lại mỗi giờ một lần.', 'Ngủ sớm hơn thường lệ một chút để mai tỉnh táo.', 'Ăn uống điều độ, bớt đồ cay nóng.', 'Không có gì đáng lo, chỉ cần giữ nếp sinh hoạt đều đặn.'],
      giu: ['Dễ mệt vì làm quá sức. Nghỉ giữa giờ, đừng gồng.', 'Đi đường cẩn thận, nhất là lúc trời tối hoặc mưa.', 'Tâm trạng dễ bức bối. Hít thở chậm, ra ngoài đi dạo một vòng.', 'Ăn uống cẩn thận, đồ lạ đồ để lâu thì tránh.', 'Thấy trong người không khỏe thì nghỉ ngơi, đi khám nếu kéo dài.']
    }
  };
  var TEN_MAT = { congViec: 'Công việc', taiLoc: 'Tài lộc', tinhCam: 'Tình cảm', sucKhoe: 'Sức khỏe' };
  var QH_TEN = { tamHop: 'tam hợp', lucHop: 'lục hợp', xung: 'xung', hai: 'hại', hinh: 'hình', nam: 'trùng chi' };

  function bam(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function kep(x) { return Math.max(1, Math.min(5, Math.round(x))); }
  function muc(d) { return d >= 4 ? 'tot' : d >= 3 ? 'binh' : 'giu'; }

  /** Ngày theo giờ Việt Nam (UTC+7), lệch thêm soNgay */
  function ngayVN(soNgay, goc) {
    var t = new Date((goc ? goc.getTime() : Date.now()) + 7 * 3600 * 1000 + (soNgay || 0) * 86400000);
    return { d: t.getUTCDate(), m: t.getUTCMonth() + 1, y: t.getUTCFullYear() };
  }

  /** Thông tin chung của ngày */
  function ngay(d, m, y) {
    var info = L.thongTinNgay(d, m, y);
    var nen = [], kieng = [];
    Object.keys(L.VIEC).forEach(function (k) {
      var dg = L.danhGiaNgay(info, k, null), ten = L.VIEC[k].ten;
      if (dg.muc === 'Tốt') nen.push(ten); else if (dg.muc === 'Xấu') kieng.push(ten);
    });
    return { info: info, nen: nen, kieng: kieng, gioTot: info.gio.filter(function (g) { return g.tot; }), hyThan: HY_THAN[info.ccNgay.can], taiThan: TAI_THAN[info.ccNgay.can] };
  }

  /** Tử vi ngày của một con giáp (chi 0..11) */
  function tuoi(chi, d, m, y, n) {
    n = n || ngay(d, m, y);
    var info = n.info, cd = info.ccNgay, khoa = y + '-' + m + '-' + d + '-' + chi;
    var hT = HANH_CHI[chi], hN = HANH_CAN[cd.can];
    var qh = L.quanHeChi(chi, cd.chi);
    var goc = 3 + (info.hoangDao.tot ? 0.4 : -0.4);
    if (qh.indexOf('tamHop') >= 0) goc += 1.2;
    if (qh.indexOf('lucHop') >= 0) goc += 1.4;
    if (qh.indexOf('xung') >= 0) goc -= 1.8;
    if (qh.indexOf('hai') >= 0) goc -= 0.9;
    if (qh.indexOf('hinh') >= 0) goc -= 0.7;
    var sinhMinh = SINH[hN] === hT, minhKhac = KHAC[hT] === hN, biKhac = KHAC[hN] === hT;
    if (sinhMinh) goc += 0.5; if (biKhac) goc -= 0.5;
    var nhieu = function (ten) { return ((bam(khoa + ten) % 100) / 100 - 0.5) * 1.7; };
    var mat = {
      congViec: kep(goc + nhieu('cv') + (biKhac ? -0.3 : 0) + (info.hoangDao.tot ? 0.3 : 0)),
      taiLoc: kep(goc + nhieu('tl') + (minhKhac ? 0.8 : 0)),
      tinhCam: kep(goc + nhieu('tc') + (qh.indexOf('lucHop') >= 0 ? 0.6 : 0) + (qh.indexOf('xung') >= 0 ? -0.4 : 0)),
      sucKhoe: kep(goc + nhieu('sk') + (qh.indexOf('hinh') >= 0 || qh.indexOf('hai') >= 0 ? -0.5 : 0) + (sinhMinh ? 0.3 : 0))
    };
    var chung = kep((mat.congViec + mat.taiLoc + mat.tinhCam + mat.sucKhoe) / 4 + (goc - 3) * 0.3);
    var loi = {};
    Object.keys(mat).forEach(function (k) { var ds = LOI[k][muc(mat[k])]; loi[k] = ds[bam(khoa + k) % ds.length]; });
    // giờ tốt riêng cho tuổi: giờ hoàng đạo không xung tuổi, ưu tiên giờ hợp tuổi
    var gio = n.gioTot.filter(function (g) { return L.quanHeChi(chi, g.chi).indexOf('xung') < 0; })
      .sort(function (a, b) { var ha = L.quanHeChi(chi, a.chi), hb = L.quanHeChi(chi, b.chi); return (hb.indexOf('tamHop') >= 0 || hb.indexOf('lucHop') >= 0) - (ha.indexOf('tamHop') >= 0 || ha.indexOf('lucHop') >= 0); }).slice(0, 3)
      .sort(function (a, b) { return a.chi - b.chi; });
    var hanhMay = Object.keys(SINH).filter(function (k) { return SINH[k] === hT; })[0];
    var so1 = bam(khoa + 's') % 9 + 1, so2 = (so1 + bam(khoa + 'S') % 8) % 9 + 1;
    var tomTat;
    if (qh.indexOf('xung') >= 0) tomTat = 'Ngày ' + info.canChi.ngay + ' xung tuổi ' + L.CHI[chi] + ': làm chậm lại, việc lớn để hôm khác.';
    else if (qh.indexOf('lucHop') >= 0) tomTat = 'Ngày lục hợp với tuổi ' + L.CHI[chi] + ': có người giúp ngầm, việc dễ thành.';
    else if (qh.indexOf('tamHop') >= 0) tomTat = 'Ngày tam hợp với tuổi ' + L.CHI[chi] + ': được bạn bè, đồng nghiệp đỡ lời.';
    else if (qh.indexOf('hai') >= 0 || qh.indexOf('hinh') >= 0) tomTat = 'Ngày có chỗ kỵ với tuổi ' + L.CHI[chi] + ': giữ lời nói, cẩn thận giấy tờ.';
    else tomTat = chung >= 4 ? 'Ngày khá thuận cho tuổi ' + L.CHI[chi] + ', cứ mạnh dạn làm việc đã tính.' : chung >= 3 ? 'Ngày bình hòa với tuổi ' + L.CHI[chi] + ', làm đều tay là được.' : 'Ngày nên giữ mình với tuổi ' + L.CHI[chi] + ', làm chắc việc đang có.';
    var dan = qh.indexOf('xung') >= 0 ? 'Hôm nay tránh khởi sự việc lớn, ký kết hay đi xa nếu dời được. Nói ít, nghe nhiều, ngày sẽ qua êm.'
      : chung >= 4 ? 'Ngày thuận, việc gì đã chuẩn bị thì làm ngay trong giờ tốt. Nhớ cảm ơn người giúp mình.'
      : chung >= 3 ? 'Giữ nhịp đều, làm xong việc nào chắc việc đó. Buổi tối dành thời gian cho gia đình.'
      : 'Hôm nay sống chậm một chút: tiền bạc chặt tay, lời nói mềm, đi đường cẩn thận. Qua ngày là ổn.';
    return {
      chi: chi, ten: L.CHI[chi], conGiap: L.CON_GIAP[chi], slug: SLUG[chi], sao: chung, mat: mat, loi: loi, tomTat: tomTat, dan: dan,
      quanHe: qh.map(function (x) { return QH_TEN[x]; }), gio: gio, mau: MAU[hT] + (hanhMay ? ', ' + MAU[hanhMay] : ''), so: [so1, so2],
      xung: info.chiXung === L.CHI[chi]
    };
  }
  function tatCa(d, m, y) { var n = ngay(d, m, y); return { ngay: n, tuoi: L.CHI.map(function (_, i) { return tuoi(i, d, m, y, n); }) }; }
  function chiTuSlug(s) { return SLUG.indexOf(String(s || '').replace(/^tuoi-/, '')); }

  return { ngayVN: ngayVN, ngay: ngay, tuoi: tuoi, tatCa: tatCa, SLUG: SLUG, chiTuSlug: chiTuSlug, TEN_MAT: TEN_MAT };
});
