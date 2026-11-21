// Đoạn mẫu cho màn chọn gói: một quy tắc thật áp đúng lá số của khách.
// Dữ liệu: doan-mau.json, sinh bởi tools/tao-du-lieu-luan-giai.cjs (chỉ giữ quy tắc có điều kiện máy đọc được).
const DU_LIEU = require('./doan-mau.json');

// Ưu tiên "Thiên hướng và phong cách" ở Quan Lộc: luận chung, trung tính, không mở đầu bằng câu nặng nề
// (quy tắc Phu Thê ở cung hãm hay bắt đầu bằng "trắc trở", "biến động" — không hợp màn chào bán).
const THU_TU = [['Quan Lộc', true], ['Phu Thê', false], ['Quan Lộc', false]];
const VIET_TAT = { TT: 'Toàn Thư', TB: 'Tân Biên', NL: 'Nghiệm Lý', KL: 'Khảo Luận', CN: 'Chỉ Nam', TC: 'Trung Châu' };

/** dk: {sao, chi, chung}; cung: {chi, chinhTinh: [tên]}. Riêng: cung có đúng các sao đó (và đúng chi nếu ghi). Chung: cung có sao đó. */
function khop(dk, cung) {
  const co = new Set(cung.chinhTinh);
  if (dk.chung) return co.has(dk.sao[0]);
  if (co.size !== dk.sao.length || !dk.sao.every((s) => co.has(s))) return false;
  return !dk.chi || dk.chi.includes(cung.chi);
}

/** cacCung: [{ten, chi, tenChi, chinhTinh: [tên sao]}]. Trả quy tắc đầu tiên khớp theo THU_TU, không khớp thì null. */
function chonDoanMau(cacCung, duLieu) {
  const dl = duLieu || DU_LIEU;
  for (const [ten, chung] of THU_TU) {
    const cung = cacCung.find((c) => c.ten === ten);
    if (!cung || cung.chinhTinh.length === 0) continue;
    const r = (dl[ten] || []).find((x) => x.dieuKien.some((d) => !!d.chung === chung && khop(d, cung)));
    if (r) return { cung: ten, tenChi: cung.tenChi, chinhTinh: cung.chinhTinh, ma: r.ma, cau: r.cau, nguon: r.nguon };
  }
  return null;
}

/** Bỏ vế điều kiện ("Thái Âm ở Dậu, Tuất, Hợi (M): "), mở chữ viết tắt sách; tách câu đầu (hiện rõ) và phần sau (làm mờ). */
function tachDoanMau(cau) {
  const i = cau.indexOf(': ');
  let s = (i > 0 ? cau.slice(i + 2) : cau).replace(/\b(TT|TB|NL|KL|CN|TC)\b(?=[\s:,.])/g, (m) => VIET_TAT[m]);
  s = s.replace(/\s*\*\([^)]*\)\*/g, '').replace(/\*\*/g, '').trim();
  s = s.charAt(0).toLocaleUpperCase('vi') + s.slice(1);
  let cat = s.search(/[.;](\s|$)/) + 1;
  if (cat <= 0 || cat >= s.length - 1) { const p = s.indexOf(', '); cat = p > 0 ? p + 1 : Math.ceil(s.length / 2); }
  return { ro: s.slice(0, cat).trim(), mo: s.slice(cat).trim() };
}

module.exports = { chonDoanMau, tachDoanMau, khop };
