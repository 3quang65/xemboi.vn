// Kiểm thử HỒI QUY (hoi-quy) cho P0 #1 — Độ sáng Miếu/Vượng/Đắc/Bình/Hãm (đặc tả mục 6).
//
// CẢNH BÁO MINH BẠCH (chưa kiểm độc lập):
//   Bảng độ sáng trong đặc tả mục 6 (tuvi-an-sao-spec.md dòng 555–581) được chép từ bảng của
//   ansaotuvi (cùng nguồn với tuvi-raw.js); engine tham chiếu Python (tuvi-ref-engine.py) chưa
//   tính độ sáng và chưa có bản in sách cổ (Thái Thứ Lang / Đỗ Văn Lưu) đối chiếu độc lập.
//   Do đó toàn bộ test trong tệp này là test HỒI QUY (khóa chặt engine JS khớp 100% bảng đặc tả
//   mục 6, tránh lỗi hồi quy khi sửa mã), KHÔNG thay thế bước chuyên gia duyệt bản in sách cổ.

const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../../src/lib/tuvi-v2/tuvi-raw.js');

// Bảng độ sáng chép nguyên từ đặc tả mục 6 (tuvi-an-sao-spec.md dòng 557–581), thứ tự 12 cung Tý..Hợi.
const BANG_SPEC_CHINH_TINH = {
  'Tử Vi':       ['B', 'Đ', 'M', 'B', 'V', 'M', 'M', 'Đ', 'M', 'B', 'V', 'B'],
  'Liêm Trinh':  ['V', 'Đ', 'V', 'H', 'M', 'H', 'V', 'Đ', 'V', 'H', 'M', 'H'],
  'Thiên Đồng':  ['V', 'H', 'M', 'Đ', 'H', 'Đ', 'H', 'H', 'M', 'H', 'H', 'Đ'],
  'Vũ Khúc':     ['V', 'M', 'V', 'Đ', 'M', 'H', 'V', 'M', 'V', 'Đ', 'M', 'H'],
  'Thái Dương':  ['H', 'Đ', 'V', 'V', 'V', 'M', 'M', 'Đ', 'H', 'H', 'H', 'H'],
  'Thiên Cơ':    ['Đ', 'Đ', 'H', 'M', 'M', 'V', 'Đ', 'Đ', 'V', 'M', 'M', 'H'],
  'Thiên Phủ':   ['M', 'B', 'M', 'B', 'V', 'Đ', 'M', 'Đ', 'M', 'B', 'V', 'Đ'],
  'Thái Âm':     ['V', 'Đ', 'H', 'H', 'H', 'H', 'H', 'Đ', 'V', 'M', 'M', 'M'],
  'Tham Lang':   ['H', 'M', 'Đ', 'H', 'V', 'H', 'H', 'M', 'Đ', 'H', 'V', 'H'],
  'Cự Môn':      ['V', 'H', 'V', 'M', 'H', 'H', 'V', 'H', 'Đ', 'M', 'H', 'Đ'],
  'Thiên Tướng': ['V', 'Đ', 'M', 'H', 'V', 'Đ', 'V', 'Đ', 'M', 'H', 'V', 'Đ'],
  'Thiên Lương': ['Đ', 'Đ', 'V', 'V', 'M', 'H', 'M', 'Đ', 'V', 'H', 'M', 'H'],
  'Thất Sát':    ['M', 'Đ', 'M', 'H', 'H', 'V', 'M', 'Đ', 'M', 'H', 'H', 'H'],
  'Phá Quân':    ['M', 'V', 'H', 'H', 'V', 'H', 'M', 'V', 'H', 'H', 'V', 'H'],
};

const BANG_SPEC_PHU_TINH = {
  'Kình Dương':  ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Đà La':       ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Hỏa Tinh':    ['H', 'B', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'B', 'H', 'H', 'H', 'H'],
  'Linh Tinh':   ['H', 'B', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'B', 'H', 'H', 'H', 'H'],
  'Văn Xương':   ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Văn Khúc':    ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Địa Không':   ['H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ'],
  'Địa Kiếp':    ['H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ'],
  'Hóa Lộc':     ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Hóa Quyền':   ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Hóa Khoa':    ['Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ'],
  'Hóa Kỵ':      ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Đại Hao':     ['H', 'H', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'Đ', 'Đ', 'H', 'H'],
  'Tiểu Hao':    ['H', 'H', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'Đ', 'Đ', 'H', 'H'],
  'Thiên Khốc':  ['Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H'],
  'Thiên Hư':    ['Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H'],
  'Thiên Mã':    [null, null, 'Đ', null, null, 'Đ', null, null, 'Đ', null, null, 'Đ'],
  'Thiên Hình':  [null, null, 'Đ', 'Đ', null, null, null, null, 'Đ', 'Đ', null, null],
  'Thiên Riêu':  [null, null, 'Đ', 'Đ', null, null, null, null, null, 'Đ', 'Đ', null],
};

const DAC_TEN = { M: 'Miếu', V: 'Vượng', 'Đ': 'Đắc', B: 'Bình', H: 'Hãm' };

test('[P0 #1 / hoi-quy] Phủ đủ 14 chính tinh × 12 cung = 168 ô khớp bảng đặc tả mục 6 (chưa kiểm sách cổ)', () => {
  // Dùng Thủy Nhị Cục (tháng 1, giờ Sửu, năm Giáp 1984 → Mệnh Sửu, Thủy Nhị Cục):
  // ngày âm 22, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 đặt Tử Vi lần lượt vào đủ 12 cung Tý(0)..Hợi(11)
  const NGAY_12_CUNG = [22, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  const daKiem = new Set();

  for (let chiTv = 0; chiTv < 12; chiTv++) {
    const ls = T.anLaSo({
      lich: 'am', ngay: NGAY_12_CUNG[chiTv], thang: 1, nam: 1984, gio: 2, gioiTinh: 'nam',
    });
    const cungTv = ls.cung.find((cg) => cg.chinhTinh.some((s) => s.ten === 'Tử Vi'));
    assert.equal(cungTv.chi, chiTv, `Ngày ${NGAY_12_CUNG[chiTv]} phải đưa Tử Vi vào cung ${chiTv}`);

    for (const cg of ls.cung) {
      for (const s of cg.chinhTinh) {
        const kyVong = BANG_SPEC_CHINH_TINH[s.ten][cg.chi];
        assert.equal(s.dacTinh, kyVong, `${s.ten} tại cung ${cg.tenChi}`);
        assert.equal(s.dacTinhTen, DAC_TEN[kyVong], `${s.ten} dacTinhTen tại ${cg.tenChi}`);
        daKiem.add(`${s.ten}|${cg.chi}`);
      }
    }
  }
  assert.equal(daKiem.size, 14 * 12, 'Phải phủ đủ đúng 168 ô chính tinh');
});

test('[P0 #1 / hoi-quy] Phủ đủ phụ tinh chủ chốt trong bảng đặc tả mục 6 & kiểm sao không xét độ sáng (chưa kiểm sách cổ)', () => {
  // Quét các tổ hợp năm (1984–1995), tháng (1–12), giờ (0..22 bước 2), ngày (1, 6, 15, 22)
  // để mỗi phụ tinh trong bảng đặc tả đều xuất hiện tại mọi cung hợp lệ của nó.
  const daKiem = new Set();
  const kiemLaSo = (ls) => {
    for (const cg of ls.cung) {
      for (const s of cg.phuTinh) {
        if (Object.prototype.hasOwnProperty.call(BANG_SPEC_PHU_TINH, s.ten)) {
          const kyVong = BANG_SPEC_PHU_TINH[s.ten][cg.chi];
          assert.equal(s.dacTinh, kyVong, `${s.ten} tại ${cg.tenChi}`);
          assert.equal(s.dacTinhTen, kyVong ? DAC_TEN[kyVong] : null, `${s.ten} ten tại ${cg.tenChi}`);
          daKiem.add(`${s.ten}|${cg.chi}`);
        } else {
          // Sao ngoài bảng mục 6 không xét độ sáng
          assert.equal(s.dacTinh, null, `${s.ten} ngoài bảng mục 6 phải null`);
          assert.equal(s.dacTinhTen, null);
        }
      }
    }
  };

  for (let nam = 1984; nam <= 1995; nam++) {
    for (let thang = 1; thang <= 12; thang += 3) {
      kiemLaSo(T.anLaSo({ lich: 'am', ngay: 15, thang, nam, gio: (nam % 12) * 2, gioiTinh: nam % 2 ? 'nam' : 'nu' }));
    }
  }
  for (let thang = 1; thang <= 12; thang++) {
    kiemLaSo(T.anLaSo({ lich: 'am', ngay: 10, thang, nam: 1990, gio: (thang - 1) * 2, gioiTinh: 'nam' }));
  }
  for (let gio = 0; gio < 24; gio += 2) {
    kiemLaSo(T.anLaSo({ lich: 'am', ngay: 1, thang: 1, nam: 1984, gio, gioiTinh: 'nam' }));
    kiemLaSo(T.anLaSo({ lich: 'am', ngay: 22, thang: 1, nam: 1984, gio, gioiTinh: 'nu' }));
  }

  // 10 phụ tinh đi qua đủ 12 cung phải phủ 12/12 cung:
  for (const ten of [
    'Hỏa Tinh', 'Linh Tinh', 'Văn Xương', 'Văn Khúc', 'Địa Không', 'Địa Kiếp',
    'Thiên Khốc', 'Thiên Hư', 'Thiên Hình', 'Thiên Riêu',
  ]) {
    let dem = 0;
    for (let c = 0; c < 12; c++) if (daKiem.has(`${ten}|${c}`)) dem++;
    assert.equal(dem, 12, `${ten} phải phủ đủ 12 cung (hiện có ${dem})`);
  }
  // Lộc Tồn chỉ nằm ở 8 cung (không bao giờ ở Tứ Mộ 1,4,7,10):
  // → Đại Hao / Tiểu Hao (±3 từ Lộc Tồn) xuất hiện đúng 8 cung {0,2,3,5,6,8,9,11}
  for (const ten of ['Đại Hao', 'Tiểu Hao']) {
    for (const c of [0, 2, 3, 5, 6, 8, 9, 11]) {
      assert.ok(daKiem.has(`${ten}|${c}`), `${ten} tại cung ${c} chưa phủ`);
    }
  }
  // Kình Dương (+1 từ LT): 8 cung {0,1,3,4,6,7,9,10}; Đà La (−1 từ LT): 8 cung {1,2,4,5,7,8,10,11}
  for (const c of [0, 1, 3, 4, 6, 7, 9, 10]) {
    assert.ok(daKiem.has(`Kình Dương|${c}`), `Kình Dương tại cung ${c} chưa phủ`);
  }
  for (const c of [1, 2, 4, 5, 7, 8, 10, 11]) {
    assert.ok(daKiem.has(`Đà La|${c}`), `Đà La tại cung ${c} chưa phủ`);
  }
  // Thiên Mã chỉ xuất hiện ở Tứ Sinh (Dần 2, Tỵ 5, Thân 8, Hợi 11) → 4/4 cung
  for (const c of [2, 5, 8, 11]) {
    assert.ok(daKiem.has(`Thiên Mã|${c}`), `Thiên Mã tại cung ${c} chưa phủ`);
  }
});

test('[P0 #1 / hoi-quy] Quy luật nhất quán bảng độ sáng Việt (Nhật/Nguyệt sáng-hãm, Tứ Mộ, tùy chọn tuViTyNgo & dacTinhHoa)', () => {
  // Thái Dương: sáng từ Sửu(1) đến Mùi(7), hãm từ Thân(8) đến Tý(0)
  for (let c = 1; c <= 7; c++) assert.notEqual(BANG_SPEC_CHINH_TINH['Thái Dương'][c], 'H');
  for (const c of [8, 9, 10, 11, 0]) assert.equal(BANG_SPEC_CHINH_TINH['Thái Dương'][c], 'H');

  // Thái Âm: hãm từ Dần(2) đến Ngọ(6), sáng từ Mùi(7) đến Sửu(1)
  for (let c = 2; c <= 6; c++) assert.equal(BANG_SPEC_CHINH_TINH['Thái Âm'][c], 'H');
  for (const c of [7, 8, 9, 10, 11, 0, 1]) assert.notEqual(BANG_SPEC_CHINH_TINH['Thái Âm'][c], 'H');

  // Kình, Đà, Xương, Khúc đắc ở Tứ Mộ (Sửu 1, Thìn 4, Mùi 7, Tuất 10), hãm ở 8 cung còn lại
  for (const sao of ['Kình Dương', 'Đà La', 'Văn Xương', 'Văn Khúc']) {
    for (let c = 0; c < 12; c++) {
      assert.equal(BANG_SPEC_PHU_TINH[sao][c], [1, 4, 7, 10].includes(c) ? 'Đ' : 'H', `${sao} cung ${c}`);
    }
  }

  // Kiểm tùy chọn tuViTyNgo ('ansaotuvi' | 'cungMieu' | 'cungBinh') và dacTinhHoa ('ansaotuvi' | 'an')
  const laySao = (ls, ten) => ls.cung.flatMap((c) => c.chinhTinh.concat(c.phuTinh)).find((s) => s.ten === ten);
  const tyMieu = T.anLaSo({ lich: 'am', ngay: 22, thang: 1, nam: 1984, gio: 2, gioiTinh: 'nam', quyUoc: { tuViTyNgo: 'cungMieu' } });
  const ngoBinh = T.anLaSo({ lich: 'am', ngay: 10, thang: 1, nam: 1984, gio: 2, gioiTinh: 'nam', quyUoc: { tuViTyNgo: 'cungBinh' } });
  assert.equal(laySao(tyMieu, 'Tử Vi').dacTinh, 'M');
  assert.equal(laySao(ngoBinh, 'Tử Vi').dacTinh, 'B');

  const anHoa = T.anLaSo({ lich: 'am', ngay: 10, thang: 1, nam: 1984, gio: 2, gioiTinh: 'nam', quyUoc: { dacTinhHoa: 'an' } });
  for (const h of ['Hóa Lộc', 'Hóa Quyền', 'Hóa Kỵ']) assert.equal(laySao(anHoa, h).dacTinh, null);
  assert.equal(laySao(anHoa, 'Hóa Khoa').dacTinh, 'Đ');
});
