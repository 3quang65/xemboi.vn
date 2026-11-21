// Kiểm thử ĐỘC LẬP cho 5 quy tắc P0 (05a mục 5):
//   #2 Sao lưu L.* (đặc tả 7.4)
//   #3 Lưu tứ hóa theo can năm xem (đặc tả 7.3 & bảng 5.8)
//   #4 Đại vận đang đi theo tuổi mụ năm xem (đặc tả 7.1 & 7.3)
//   #5 Lưu nguyệt / Đẩu Quân năm 2027 (đặc tả 7.5)
//   #9 Ranh giới năm Tết vs Lập Xuân (đặc tả 1.7 & 10.17)
//
// Nguồn kỳ vọng ĐỘC LẬP với engine JS:
//   - Engine tham chiếu Python tuvi-ref-engine.py (chạy qua `python -I`).
//   - Bảng công thức trong đặc tả tuvi-an-sao-spec.md.
//   - Bảng Tết Wikipedia 1984–2091 (tet-wikipedia-1984-2091.json).
//   - Thời điểm Lập Xuân từ tiet-khi.mjs (VSOP87D đã kiểm chứng JPL DE421).

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const T = require('../../src/lib/tuvi-v2/tuvi-raw.js');
const A = require('../../src/lib/tuvi-v2/am-lich.ts');
const { cases: TC_CASES } = require('../../docs/v2/tai-san-xemtuvi/docs/nghien-cuu/tuvi-test-cases.json');

const REF_PY_PATH = path.resolve(__dirname, '../../docs/v2/tai-san-xemtuvi/docs/nghien-cuu/tuvi-ref-engine.py');
const TET_WIKI = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../src/lib/tuvi-v2/data/tet-wikipedia-1984-2091.json'), 'utf8'),
);

/** Dò lệnh Python sẵn có theo thứ tự: python3 → python → py -3. */
function timPython() {
  const ungVien = [
    { cmd: 'python3', args: [] },
    { cmd: 'python', args: [] },
    { cmd: 'py', args: ['-3'] },
  ];
  for (const uv of ungVien) {
    try {
      execFileSync(uv.cmd, [...uv.args, '-I', '--version'], { encoding: 'utf8', stdio: 'pipe' });
      return uv;
    } catch {
      // thử lệnh tiếp theo
    }
  }
  return null;
}

const PYTHON = timPython();
const BO_QUA_PYTHON = PYTHON
  ? false
  : 'Bỏ qua: không tìm thấy python3, python hoặc py -3 để chạy tuvi-ref-engine.py';

/** Gọi engine tham chiếu Python độc lập bằng `-I` theo lô lệnh JSON. */
function chayPythonRef(scriptBody) {
  if (!PYTHON) throw new Error(BO_QUA_PYTHON);
  const code = `
import json, importlib.util
spec = importlib.util.spec_from_file_location('ref', r'''${REF_PY_PATH}''')
ref = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ref)
${scriptBody}
`;
  const out = execFileSync(PYTHON.cmd, [...PYTHON.args, '-I', '-c', code], { encoding: 'utf8' });
  return JSON.parse(out);
}

const m12 = (x) => ((x % 12) + 12) % 12;

// ============================================================================
// P0 #2 — SAO LƯU L.* (đặc tả mục 7.4)
// ============================================================================

test('[P0 #2 / độc lập] Sao lưu 60 năm Hoa Giáp (1984–2043, đủ 10 can × 12 chi) khớp tuvi-ref-engine.py', { skip: BO_QUA_PYTHON }, () => {
  const pyByYear = chayPythonRef(`
res = {str(y): ref.luu_nien(y) for y in range(1984, 2044)}
print(json.dumps(res, ensure_ascii=False))
`);
  const lsGoc = T.anLaSo({ lich: 'duong', ngay: 20, thang: 12, nam: 1995, gio: 18, gioiTinh: 'nam' });

  for (let namXem = 1984; namXem <= 2043; namXem++) {
    const ln = T.anLuuNien(lsGoc, namXem, { dayDu: true });
    assert.equal(ln.saoLuu.length, 15, `Năm ${namXem} phải đủ 15 sao lưu`);
    const jsMap = Object.fromEntries(
      ln.saoLuu.map((s) => [s.ten.replace('L. ', 'L.'), A.DIA_CHI[s.chi]]),
    );
    assert.deepEqual(jsMap, pyByYear[String(namXem)], `Lệch sao lưu năm ${namXem} (${ln.canChi})`);
  }
});

test('[P0 #2 / độc lập] Sao lưu năm Đinh Mùi 2027 (9 sao mặc định & 15 sao đầy đủ) khớp đặc tả 7.4 & Python', { skip: BO_QUA_PYTHON }, () => {
  const py2027 = chayPythonRef(`print(json.dumps(ref.luu_nien(2027), ensure_ascii=False))`);
  const ls = T.anLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1990, gio: 7, phut: 30, gioiTinh: 'nam' });

  // Mặc định phái Việt: 9 sao lưu cốt lõi
  const ln9 = T.anLuuNien(ls, 2027);
  assert.equal(ln9.canChi, 'Đinh Mùi');
  assert.equal(ln9.luuThaiTue, 7); // Mùi
  assert.equal(ln9.saoLuu.length, 9);
  const map9 = Object.fromEntries(ln9.saoLuu.map((s) => [s.ten.replace('L. ', 'L.'), A.DIA_CHI[s.chi]]));

  // Kỳ vọng độc lập từ công thức đặc tả 7.4 cho Đinh (C'=3) Mùi (Y'=7):
  // Thái Tuế Mùi(7), Tang Môn Dậu(9), Bạch Hổ Mão(3), Khốc Hợi(11), Hư Sửu(1),
  // Lộc Tồn Ngọ(6), Kình Dương Mùi(7), Đà La Tỵ(5), Thiên Mã Tỵ(5) (Hợi Mão Mùi -> Tỵ).
  const kyVong9 = {
    'L.Thái Tuế': 'Mùi',
    'L.Tang Môn': 'Dậu',
    'L.Bạch Hổ': 'Mão',
    'L.Thiên Khốc': 'Hợi',
    'L.Thiên Hư': 'Sửu',
    'L.Lộc Tồn': 'Ngọ',
    'L.Kình Dương': 'Mùi',
    'L.Đà La': 'Tỵ',
    'L.Thiên Mã': 'Tỵ',
  };
  assert.deepEqual(map9, kyVong9);

  // Đầy đủ 15 sao lưu khớp 100% tuvi-ref-engine.py
  const ln15 = T.anLuuNien(ls, 2027, { dayDu: true });
  const map15 = Object.fromEntries(ln15.saoLuu.map((s) => [s.ten.replace('L. ', 'L.'), A.DIA_CHI[s.chi]]));
  assert.deepEqual(map15, py2027);
});

// ============================================================================
// P0 #3 — LƯU TỨ HÓA THEO CAN NĂM XEM (đặc tả mục 7.3 & bảng 5.8)
// ============================================================================

test('[P0 #3 / độc lập] Lưu tứ hóa đủ 10 Thiên Can năm xem (2024–2033) khớp tuvi-ref-engine.py', { skip: BO_QUA_PYTHON }, () => {
  const pyData = chayPythonRef(`
base = ref.chart(1995, 12, 20, 18, 0, 'nam')
tu_hoa_10 = {}
for y in range(2024, 2034):
    c = ref.chart(y, 6, 15, 12, 0, 'nam')
    tu_hoa_10[str(y)] = c['tuHoa']
print(json.dumps({'baseSao': base['sao'], 'tuHoa10': tu_hoa_10}, ensure_ascii=False))
`);

  const ls = T.anLaSo({ lich: 'duong', ngay: 20, thang: 12, nam: 1995, gio: 18, gioiTinh: 'nam' });
  const HOA_ORDER = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];

  for (let namXem = 2024; namXem <= 2033; namXem++) {
    const ln = T.anLuuNien(ls, namXem);
    const pyHoa = pyData.tuHoa10[String(namXem)];
    assert.equal(ln.luuTuHoa.length, 4);
    HOA_ORDER.forEach((hoa, idx) => {
      const saoMongDoi = pyHoa[hoa];
      const chiMongDoi = pyData.baseSao[saoMongDoi];
      assert.equal(ln.luuTuHoa[idx].hoa, hoa, `Năm ${namXem}`);
      assert.equal(ln.luuTuHoa[idx].sao, saoMongDoi, `Năm ${namXem} ${hoa}`);
      assert.equal(A.DIA_CHI[ln.luuTuHoa[idx].chi], chiMongDoi, `Năm ${namXem} ${hoa} (${saoMongDoi})`);
    });
  }
});

test('[P0 #3 / độc lập] Lưu tứ hóa năm Đinh Mùi 2027 (Âm Đồng Cơ Cự) trên 4 lá khác nhau & chế độ TQ', { skip: BO_QUA_PYTHON }, () => {
  // 4 lá mẫu (TC01, TC02, TC03, TC08) lấy vị trí 4 sao gốc từ Python
  const mau = [
    { id: 'TC01', y: 1973, m: 12, d: 30, h: 22, mi: 30, g: 'nu' },
    { id: 'TC02', y: 2023, m: 3, d: 6, h: 8, mi: 0, g: 'nam' },
    { id: 'TC03', y: 1995, m: 12, d: 20, h: 18, mi: 0, g: 'nam' },
    { id: 'TC08', y: 1990, m: 8, d: 15, h: 7, mi: 30, g: 'nam' },
  ];
  const pyCharts = chayPythonRef(`
mau = ${JSON.stringify(mau)}
out = {}
for x in mau:
    c = ref.chart(x['y'], x['m'], x['d'], x['h'], x['mi'], x['g'])
    out[x['id']] = c['sao']
print(json.dumps(out, ensure_ascii=False))
`);

  // Bảng 5.8 đặc tả can Đinh: Thái Âm Hóa Lộc, Thiên Đồng Hóa Quyền, Thiên Cơ Hóa Khoa, Cự Môn Hóa Kỵ
  const DINH_2027 = [
    ['Hóa Lộc', 'Thái Âm'],
    ['Hóa Quyền', 'Thiên Đồng'],
    ['Hóa Khoa', 'Thiên Cơ'],
    ['Hóa Kỵ', 'Cự Môn'],
  ];

  for (const x of mau) {
    const ls = T.anLaSo({ lich: 'duong', ngay: x.d, thang: x.m, nam: x.y, gio: x.h, phut: x.mi, gioiTinh: x.g });
    const ln = T.anLuuNien(ls, 2027);
    assert.deepEqual(
      ln.luuTuHoa.map((h) => [h.hoa, h.sao, A.DIA_CHI[h.chi]]),
      DINH_2027.map(([hoa, sao]) => [hoa, sao, pyCharts[x.id][sao]]),
      `${x.id} năm 2027`,
    );
  }

  // Kiểm thêm quy ước Tứ hóa Trung Quốc (10.4) ở năm xem Canh (2030) và Nhâm (2032)
  const lsTQ = T.anLaSo({
    lich: 'duong', ngay: 20, thang: 12, nam: 1995, gio: 18, gioiTinh: 'nam',
    quyUoc: { tuHoa: 'trungQuoc' },
  });
  assert.deepEqual(
    T.anLuuNien(lsTQ, 2030).luuTuHoa.map((h) => h.sao),
    ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],
  );
  assert.deepEqual(
    T.anLuuNien(lsTQ, 2032).luuTuHoa.map((h) => h.sao),
    ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],
  );
});

// ============================================================================
// P0 #4 — ĐẠI VẬN ĐANG ĐI THEO TUỔI MỤ NĂM XEM (đặc tả mục 7.1 & 7.3)
// ============================================================================

test('[P0 #4 / độc lập] Đại vận đang đi đủ 5 Cục × 2 chiều (trước khởi, đầu/giữa/cuối khoảng, bước chuyển)', { skip: BO_QUA_PYTHON }, () => {
  // 5 lá mẫu đại diện đủ 5 Cục và đủ cả 2 chiều thuận/nghịch:
  // TC01 Thủy 2 (Âm Nữ, thuận), TC09 Mộc 3 (Âm Nữ, thuận), TC10 Kim 4 (Dương Nam, thuận),
  // TC03 Thổ 5 (Âm Nam, nghịch), TC04 Hỏa 6 (Dương Nữ, nghịch)
  const dsId = ['TC01', 'TC09', 'TC10', 'TC03', 'TC04'];
  const dsMau = dsId.map((id) => TC_CASES.find((c) => c.id === id));

  const pyRes = chayPythonRef(`
ds = ${JSON.stringify(dsMau.map((c) => ({ id: c.id, i: c.input })))}
out = {}
for x in ds:
    i = x['i']
    c = ref.chart(i['nam'], i['thang'], i['ngay'], i['gio'], i.get('phut', 0), i['gioiTinh'])
    out[x['id']] = {'lunarNam': c['lunar']['nam'], 'cuc': c['cuc'], 'daiHan': c['daiHan'], 'menh': c['menh']}
print(json.dumps(out, ensure_ascii=False))
`);

  const SO_CUC = {
    'Thủy Nhị Cục': 2, 'Mộc Tam Cục': 3, 'Kim Tứ Cục': 4, 'Thổ Ngũ Cục': 5, 'Hỏa Lục Cục': 6,
  };

  for (const mau of dsMau) {
    const i = mau.input;
    const py = pyRes[mau.id];
    const k = SO_CUC[py.cuc];
    const ls = T.anLaSo({
      lich: i.lich, ngay: i.ngay, thang: i.thang, nam: i.nam, gio: i.gio, phut: i.phut, gioiTinh: i.gioiTinh,
    });

    // Hàm tìm cung đại vận từ bảng daiHan độc lập của Python
    const cungDaiVanPy = (tuoiMu) => {
      for (const [chiTen, tu] of Object.entries(py.daiHan)) {
        if (tuoiMu >= tu && tuoiMu <= tu + 9) return chiTen;
      }
      return null;
    };

    // Kiểm từng tuổi mụ từ 1 đến 65 (gồm tuổi trước khởi đại vận, mọi biên đầu/cuối khoảng, bước chuyển)
    for (let tuoiMu = 1; tuoiMu <= 65; tuoiMu++) {
      const namXem = py.lunarNam + tuoiMu - 1;
      const ln = T.anLuuNien(ls, namXem);
      assert.equal(ln.tuoiMu, tuoiMu, `${mau.id} năm ${namXem}`);
      const kyVongChi = cungDaiVanPy(tuoiMu);
      if (tuoiMu < k) {
        assert.equal(ln.daiVan, null, `${mau.id} tuổi ${tuoiMu} < cục ${k} phải là null`);
      } else {
        assert.notEqual(ln.daiVan, null);
        assert.equal(A.DIA_CHI[ln.daiVan], kyVongChi, `${mau.id} tuổi ${tuoiMu} (${namXem})`);
      }
    }
  }
});

test('[P0 #4 / độc lập] Đại vận đang đi năm Đinh Mùi 2027 trên toàn bộ 11 lá chuẩn TC01–TC11', { skip: BO_QUA_PYTHON }, () => {
  const pyRes = chayPythonRef(`
ds = ${JSON.stringify(TC_CASES.map((c) => ({ id: c.id, i: c.input })))}
out = {}
for x in ds:
    i = x['i']
    c = ref.chart(i['nam'], i['thang'], i['ngay'], i['gio'], i.get('phut', 0), i['gioiTinh'])
    tuoi = 2027 - c['lunar']['nam'] + 1
    dv = None
    for chi, tu in c['daiHan'].items():
        if tu <= tuoi <= tu + 9:
            dv = chi
            break
    out[x['id']] = {'tuoiMu': tuoi, 'daiVan': dv}
print(json.dumps(out, ensure_ascii=False))
`);

  for (const c of TC_CASES) {
    const i = c.input;
    const ls = T.anLaSo({
      lich: i.lich, ngay: i.ngay, thang: i.thang, nam: i.nam, gio: i.gio, phut: i.phut, gioiTinh: i.gioiTinh,
    });
    const ln = T.anLuuNien(ls, 2027);
    assert.equal(ln.tuoiMu, pyRes[c.id].tuoiMu, `${c.id} tuoiMu 2027`);
    assert.equal(ln.daiVan === null ? null : A.DIA_CHI[ln.daiVan], pyRes[c.id].daiVan, `${c.id} daiVan 2027`);
  }
});

// ============================================================================
// P0 #5 — LƯU NGUYỆT / ĐẨU QUÂN NĂM 2027 (đặc tả mục 7.5)
// ============================================================================

test('[P0 #5 / độc lập] Lưu nguyệt 12 tháng năm Đinh Mùi 2027 (nam & nữ, đủ 12 tháng × 12 giờ) khớp đặc tả 7.5 & Python', { skip: BO_QUA_PYTHON }, () => {
  // Lấy vị trí Đẩu Quân năm 2027 (chi Mùi = 7) từ tuvi-ref-engine.py cho 12 tháng × 12 giờ (144 tổ hợp)
  // Dùng ngày mùng 10 của từng tháng âm năm 2027 đổi sang dương để đưa vào Python chart()
  const ds2027 = [];
  for (let thangAm = 1; thangAm <= 12; thangAm++) {
    const d = A.amSangDuong(10, thangAm, 2027, false, 7);
    ds2027.push({ thangAm, ngay: d.ngay, thang: d.thang, nam: d.nam });
  }
  const pyDauQuan2027 = chayPythonRef(`
ds = ${JSON.stringify(ds2027)}
HOURS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
out = {}
for x in ds:
    for h_idx, h in enumerate(HOURS):
        c = ref.chart(x['nam'], x['thang'], x['ngay'], h, 0, 'nam')
        out[f"{x['thangAm']}|{h_idx}"] = c['sao']['Đẩu Quân']
print(json.dumps(out, ensure_ascii=False))
`);

  const GIO_CHUAN = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  for (let thangAm = 1; thangAm <= 12; thangAm++) {
    for (let hIdx = 0; hIdx < 12; hIdx++) {
      const lsNam = T.anLaSo({ lich: 'am', ngay: 10, thang: thangAm, nam: 1995, gio: GIO_CHUAN[hIdx], gioiTinh: 'nam' });
      const lsNu = T.anLaSo({ lich: 'am', ngay: 10, thang: thangAm, nam: 1995, gio: GIO_CHUAN[hIdx], gioiTinh: 'nu' });
      const lnNam = T.anLuuNien(lsNam, 2027);
      const lnNu = T.anLuuNien(lsNu, 2027);

      // Lưu nguyệt phái Việt (Đẩu Quân) không phụ thuộc giới tính
      assert.deepEqual(lnNam.luuNguyet, lnNu.luuNguyet, `tháng ${thangAm} giờ ${hIdx}: nam ≠ nữ`);
      assert.equal(lnNam.luuNguyet.length, 12);
      assert.equal(new Set(lnNam.luuNguyet).size, 12);

      // Tháng 1 lưu nguyệt 2027 khớp Đẩu Quân năm 2027 từ tuvi-ref-engine.py
      const dauQuanPy = pyDauQuan2027[`${thangAm}|${hIdx}`];
      assert.equal(A.DIA_CHI[lnNam.luuNguyet[0]], dauQuanPy, `tháng ${thangAm} giờ ${hIdx}: lệch Python Đẩu Quân`);

      // Đủ 12 tháng t = 1..12 khớp công thức đặc tả 7.5: m12(7 - (M - 1) + H + (t - 1))
      for (let t = 1; t <= 12; t++) {
        assert.equal(
          lnNam.luuNguyet[t - 1],
          m12(7 - (thangAm - 1) + hIdx + (t - 1)),
          `M=${thangAm}, H=${hIdx}, t=${t}`,
        );
      }
    }
  }
});

test('[P0 #5 / độc lập] Lưu nguyệt năm sinh trùng Đẩu Quân gốc & xử lý tháng nhuận theo 3 quy ước', { skip: BO_QUA_PYTHON }, () => {
  const pyTC04 = chayPythonRef(`
out = {
  'same': ref.chart(2020, 6, 10, 10, 0, 'nu', 'next_day', 'same')['sao']['Đẩu Quân'],
  'split15': ref.chart(2020, 6, 10, 10, 0, 'nu', 'next_day', 'split15')['sao']['Đẩu Quân'],
  'next': ref.chart(2020, 6, 10, 10, 0, 'nu', 'next_day', 'next')['sao']['Đẩu Quân'],
}
print(json.dumps(out, ensure_ascii=False))
`);

  // TC04: nữ 10/06/2020 10:00 (19/4 nhuận Canh Tý, giờ Tỵ H=5)
  const nhuanMac = T.anLaSo({ lich: 'duong', ngay: 10, thang: 6, nam: 2020, gio: 10, gioiTinh: 'nu' });
  const nhuanChia15 = T.anLaSo({
    lich: 'duong', ngay: 10, thang: 6, nam: 2020, gio: 10, gioiTinh: 'nu',
    quyUoc: { thangNhuan: 'chiaNgay15' },
  });
  const nhuanSau = T.anLaSo({
    lich: 'duong', ngay: 10, thang: 6, nam: 2020, gio: 10, gioiTinh: 'nu',
    quyUoc: { thangNhuan: 'thangSau' },
  });

  // Năm xem = năm sinh (2020) → tháng 1 lưu nguyệt phải khớp Đẩu Quân bản mệnh từ Python
  assert.equal(A.DIA_CHI[T.anLuuNien(nhuanMac, 2020).luuNguyet[0]], pyTC04.same);
  assert.equal(A.DIA_CHI[T.anLuuNien(nhuanChia15, 2020).luuNguyet[0]], pyTC04.split15);
  assert.equal(A.DIA_CHI[T.anLuuNien(nhuanSau, 2020).luuNguyet[0]], pyTC04.next);

  // Năm 2027 (Mùi = 7), giờ Tỵ (H = 5):
  // tháng 4 (thangChinh): m12(7 - 3 + 5) = 9 (Dậu); tháng 5 (chiaNgay15 ngày 19 / thangSau): m12(7 - 4 + 5) = 8 (Thân)
  assert.equal(A.DIA_CHI[T.anLuuNien(nhuanMac, 2027).luuNguyet[0]], 'Dậu');
  assert.equal(A.DIA_CHI[T.anLuuNien(nhuanChia15, 2027).luuNguyet[0]], 'Thân');
  assert.equal(A.DIA_CHI[T.anLuuNien(nhuanSau, 2027).luuNguyet[0]], 'Thân');
});

// ============================================================================
// P0 #9 — RANH GIỚI NĂM TẾT VS LẬP XUÂN (đặc tả mục 1.7 & 10.17)
// ============================================================================

test('[P0 #9 / độc lập] Sinh trong khoảng [Lập Xuân, Tết) tính theo năm âm cũ — đối chiếu Python, Wikipedia & VSOP87D', { skip: BO_QUA_PYTHON }, async () => {
  const { timMoc, dinhDangVN } = await import('../../src/lib/tuvi-v2/tiet-khi.mjs');
  const tetByYear = new Map(TET_WIKI.rows.map((r) => [r.nam, r.duong]));

  // Các ngày dương sinh SAU Lập Xuân (315°) nhưng TRƯỚC mùng 1 Tết âm lịch Việt Nam
  const caRanhGioi = [
    { y: 2008, m: 2, d: 5, h: 10, mi: 0, g: 'nam', namAmDung: 2007, canChiNamDung: 'Đinh Hợi' }, // Tết VN 07/02/2008
    { y: 1994, m: 2, d: 7, h: 14, mi: 0, g: 'nu', namAmDung: 1993, canChiNamDung: 'Quý Dậu' },  // Tết VN 10/02/1994
    { y: 1996, m: 2, d: 15, h: 9, mi: 0, g: 'nam', namAmDung: 1995, canChiNamDung: 'Ất Hợi' },  // Tết VN 19/02/1996
    { y: 2027, m: 2, d: 5, h: 10, mi: 0, g: 'nu', namAmDung: 2026, canChiNamDung: 'Bính Ngọ' }, // Tết VN 06/02/2027
  ];

  const pyCharts = chayPythonRef(`
ds = ${JSON.stringify(caRanhGioi)}
out = [ref.chart(x['y'], x['m'], x['d'], x['h'], x['mi'], x['g']) for x in ds]
print(json.dumps(out, ensure_ascii=False))
`);

  for (let idx = 0; idx < caRanhGioi.length; idx++) {
    const ca = caRanhGioi[idx];
    const py = pyCharts[idx];

    // Xác minh độc lập bằng VSOP87D (tiet-khi.mjs) và bảng Tết Wikipedia:
    // ngày sinh thật sự nằm sau Lập Xuân và trước mùng 1 Tết.
    const lapXuan = timMoc(315, ca.y);
    const sinhUtc = new Date(Date.UTC(ca.y, ca.m - 1, ca.d, ca.h - 7, ca.mi));
    assert.ok(sinhUtc > lapXuan, `${ca.d}/${ca.m}/${ca.y} phải sau Lập Xuân (${dinhDangVN(lapXuan)})`);
    const [td, tm, ty] = tetByYear.get(ca.y).split('/').map(Number);
    const tetUtc = new Date(Date.UTC(ty, tm - 1, td, -7, 0));
    assert.ok(sinhUtc < tetUtc, `${ca.d}/${ca.m}/${ca.y} phải trước Tết VN ${tetByYear.get(ca.y)}`);

    // Đối chiếu toàn bộ trụ cột lá số JS với tuvi-ref-engine.py
    const ls = T.anLaSo({
      lich: 'duong', ngay: ca.d, thang: ca.m, nam: ca.y, gio: ca.h, phut: ca.mi, gioiTinh: ca.g,
    });
    assert.equal(ls.am.nam, ca.namAmDung);
    assert.equal(ls.canChi.nam, ca.canChiNamDung);
    assert.equal(ls.quyUoc.ranhGioiNam, 'tet');
    assert.deepEqual(ls.am, py.lunar);
    assert.deepEqual(ls.canChi, py.canChi);
    assert.equal(ls.menhTai, py.menh);
    assert.equal(ls.thanTai.split(' ')[0], py.than);
    assert.equal(ls.cuc, py.cuc);
    const chinhJS = Object.fromEntries(ls.cung.flatMap((cg) => cg.chinhTinh.map((s) => [s.ten, cg.tenChi])));
    assert.deepEqual(chinhJS, py.chinhTinh);
    const hoaJS = Object.fromEntries(
      ls.cung.flatMap((cg) => cg.chinhTinh.concat(cg.phuTinh).filter((s) => s.hoa).map((s) => [s.hoa, s.ten])),
    );
    assert.deepEqual(hoaJS, py.tuHoa);
    assert.equal(ls.tuan, py.tuan.join('–'));
    assert.equal(ls.triet, py.triet.join('–'));
  }
});

test('[P0 #9 / độc lập] Chuyển năm tại mùng 1 Tết, đêm Giao thừa 23:30, và ca bẫy lịch Việt vs TQ 10/02/1985', { skip: BO_QUA_PYTHON }, () => {
  const py = chayPythonRef(`
out = {
  'tet2008': ref.chart(2008, 2, 7, 10, 0, 'nam'),
  'giaoThua2008_sau': ref.chart(2008, 2, 6, 23, 30, 'nam', 'next_day'),
  'giaoThua2008_giu': ref.chart(2008, 2, 6, 23, 30, 'nam', 'same_day'),
  'tet2027': ref.chart(2027, 2, 6, 10, 0, 'nu'),
  'giaoThua2027_sau': ref.chart(2027, 2, 5, 23, 30, 'nu', 'next_day'),
  'vn1985': ref.chart(1985, 2, 10, 10, 0, 'nam'),
}
print(json.dumps(out, ensure_ascii=False))
`);

  // Mùng 1 Tết 2008 (07/02/2008) & 2027 (06/02/2027) chuyển sang năm mới
  const tet08 = T.anLaSo({ lich: 'duong', ngay: 7, thang: 2, nam: 2008, gio: 10, gioiTinh: 'nam' });
  assert.equal(tet08.canChi.nam, 'Mậu Tý');
  assert.deepEqual(tet08.am, py.tet2008.lunar);

  const tet27 = T.anLaSo({ lich: 'duong', ngay: 6, thang: 2, nam: 2027, gio: 10, gioiTinh: 'nu' });
  assert.equal(tet27.canChi.nam, 'Đinh Mùi');
  assert.deepEqual(tet27.am, py.tet2027.lunar);

  // Đêm Giao thừa giờ Tý muộn 23:30: mặc định sang mùng 1 Tết năm mới; giuNgay giữ năm cũ
  const gt08Sau = T.anLaSo({ lich: 'duong', ngay: 6, thang: 2, nam: 2008, gio: 23, phut: 30, gioiTinh: 'nam' });
  assert.equal(gt08Sau.canChi.nam, 'Mậu Tý');
  assert.deepEqual(gt08Sau.am, py.giaoThua2008_sau.lunar);

  const gt08Giu = T.anLaSo({
    lich: 'duong', ngay: 6, thang: 2, nam: 2008, gio: 23, phut: 30, gioiTinh: 'nam',
    quyUoc: { gioTyMuon: 'giuNgay' },
  });
  assert.equal(gt08Giu.canChi.nam, 'Đinh Hợi');
  assert.deepEqual(gt08Giu.am, py.giaoThua2008_giu.lunar);

  const gt27Sau = T.anLaSo({ lich: 'duong', ngay: 5, thang: 2, nam: 2027, gio: 23, phut: 30, gioiTinh: 'nu' });
  assert.equal(gt27Sau.canChi.nam, 'Đinh Mùi');
  assert.deepEqual(gt27Sau.am, py.giaoThua2027_sau.lunar);

  // Ca bẫy 10/02/1985: Tết Việt Nam là 21/01/1985 (không phải 20/02/1985 như Trung Quốc),
  // nên 10/02/1985 theo lịch Việt là 21/01/1985 âm (năm Ất Sửu), khớp tuvi-ref-engine.py.
  const vn85 = T.anLaSo({ lich: 'duong', ngay: 10, thang: 2, nam: 1985, gio: 10, gioiTinh: 'nam' });
  assert.equal(vn85.canChi.nam, 'Ất Sửu');
  assert.deepEqual(vn85.am, { ngay: 21, thang: 1, nam: 1985, nhuan: false });
  assert.deepEqual(vn85.am, py.vn1985.lunar);
  assert.deepEqual(vn85.canChi, py.vn1985.canChi);
});
