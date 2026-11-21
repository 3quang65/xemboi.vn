// Chọn đoạn luận Cung Mệnh cho phần tóm tắt miễn phí: theo chính tinh thủ Mệnh và độ sáng.
// Dữ liệu chép nguyên văn từ docs/nghien-cuu/luan-giai-12-cung.md (xem tools/tao-du-lieu-luan-giai.cjs).
// Viết bằng JS thuần để cả trình duyệt lẫn kiểm thử node đều dùng được.
const DU_LIEU = require('./menh-chinh-tinh.json');

const TOI_DA = 2;
// Quy tắc chỉ đúng khi có thêm sao đi kèm (Kình, Đà, Hỏa, Linh…); hàm chưa xét sao phụ nên bỏ qua.
const CAN_SAO_KEM = new Set(['MENH-TS-02', 'MENH-TT-02']);

/** chinhTinh: [{ten, dacTinh}], dacTinh là M | V | Đ | B | H khớp chữ cái trong ngoặc của quy tắc. */
function chonDoanMenh(chinhTinh, duLieu) {
  const dl = duLieu || DU_LIEU;
  if (!chinhTinh || chinhTinh.length === 0) {
    return { voChinhDieu: true, doan: dl.voChinhDieu.slice(0, 1) };
  }
  const doan = [];
  for (const s of chinhTinh.slice(0, TOI_DA)) {
    const r = (dl.menh[s.ten] || []).find((x) => x.dacTinh.includes(s.dacTinh) && !CAN_SAO_KEM.has(x.ma));
    if (r) doan.push(r);
  }
  return { voChinhDieu: false, doan };
}

module.exports = { chonDoanMenh, TOI_DA, CAN_SAO_KEM };
