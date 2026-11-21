// Đối chiếu engine v2 với 11 lá số mẫu và toàn bộ tùy chọn mục 10 (port từ tai-san-xemtuvi/tests/research-cases.test.cjs).
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../../src/lib/tuvi-v2/tuvi-raw.js');
const L = require('../../src/lib/tuvi-v2/am-lich.ts');
const { cases, testLich, testIztroTuViTheoGio, testLuuNien } = require('../../docs/v2/tai-san-xemtuvi/docs/nghien-cuu/tuvi-test-cases.json');

// Sao tùy chọn (đặc tả 5.4), engine chưa an
const KHONG_AN = new Set(['Thiên Nguyệt', 'Thiên Vu', 'Âm Sát']);
const TEN_ENGINE = { 'Bác Sĩ': 'Bác Sỹ' };

function lap(i, quyUoc) {
  return T.anLaSo({ lich: i.lich, ngay: i.ngay, thang: i.thang, nam: i.nam, nhuan: i.nhuan, gio: i.gio, phut: i.phut, gioiTinh: i.gioiTinh, quyUoc });
}
function viTriSao(ls) {
  const v = {};
  for (const cg of ls.cung) for (const s of cg.chinhTinh.concat(cg.phuTinh)) v[s.ten] = cg.tenChi;
  return v;
}

for (const c of cases) {
  const k = c.kyVong;
  test(`${c.id} ${c.ten}`, () => {
    const ls = lap(c.input);
    const v = viTriSao(ls);
    assert.deepEqual(ls.am, k.amLich, 'âm lịch');
    assert.deepEqual(ls.canChi, k.canChi, 'can chi');
    assert.equal(ls.amDuong, k.amDuong, 'âm dương');
    assert.equal(ls.banMenh, k.napAmNam, 'bản mệnh');
    assert.equal(ls.menhTai, k.menh, 'cung Mệnh');
    assert.equal(ls.thanTai, `${k.than} (cung ${k.thanCu})`, 'cung Thân');
    assert.equal(ls.cuc, k.cuc, 'Cục');
    for (const [sao, chi] of Object.entries(k.chinhTinh)) assert.equal(v[sao], chi, sao);
    for (const [hoa, sao] of Object.entries(k.tuHoa)) {
      const cg = ls.cung.find((x) => x.chinhTinh.concat(x.phuTinh).some((s) => s.ten === sao && s.hoa === hoa));
      assert.ok(cg, `${hoa} ${sao}`);
    }
    assert.equal(ls.tuan, k.tuan.join('–'), 'Tuần');
    assert.equal(ls.triet, k.triet.join('–'), 'Triệt');
    assert.deepEqual(ls.tuanCung, k.tuan.map((chi) => L.DIA_CHI.indexOf(chi)), 'tuanCung');
    assert.deepEqual(ls.trietCung, k.triet.map((chi) => L.DIA_CHI.indexOf(chi)), 'trietCung');
    for (const [sao, chi] of Object.entries(k.saoKhac)) {
      if (KHONG_AN.has(sao)) continue;
      assert.equal(v[TEN_ENGINE[sao] || sao], chi, sao);
    }
    for (const [ts, chi] of Object.entries(k.trangSinh)) assert.equal(ls.cung.find((x) => x.trangSinh === ts).tenChi, chi, ts);
    for (const [chi, tuoi] of Object.entries(k.daiHanTuoiBatDau)) assert.equal(ls.cung.find((x) => x.tenChi === chi).daiVanTu, tuoi, `đại hạn ${chi}`);
    for (const [chi, nam] of Object.entries(k.tieuHanNamChi)) assert.equal(ls.cung.find((x) => x.tenChi === chi).tieuHan, nam, `tiểu hạn ${chi}`);
    assert.equal(ls.thanChu, k.thanChu, 'Thân chủ');
    assert.equal(ls.menhChu, k.menhChu.theoChiNamSinh, 'Mệnh chủ');
    assert.deepEqual(ls.menhChuCach, { theoChiNam: k.menhChu.theoChiNamSinh, theoCungMenh: k.menhChu.theoChiCungMenh });
    assert.equal(lap(c.input, { menhChu: 'cungMenh' }).menhChu, k.menhChu.theoChiCungMenh, 'Mệnh chủ theo cung Mệnh');
  });
}

test('Mốc lịch đã kiểm chứng (đặc tả testLich)', () => {
  for (const t of testLich) {
    if (t.duong) {
      const [y, m, d] = t.duong.split('-').map(Number);
      assert.deepEqual(L.duongSangAm(d, m, y), t.am, t.duong);
    } else {
      assert.equal(L.thangNhuan(t.namAm), t.thangNhuan, `tháng nhuận ${t.namAm}`);
    }
  }
});

test('Âm lịch trước 01/01/1968 theo múi giờ +8 (đặc tả 1.5, 10.2)', () => {
  const ls = T.anLaSo({ lich: 'duong', ngay: 1, thang: 2, nam: 1965, gio: 12, gioiTinh: 'nu' });
  assert.deepEqual(ls.am, { ngay: 30, thang: 12, nam: 1964, nhuan: false });
  const cu = T.anLaSo({ lich: 'duong', ngay: 1, thang: 2, nam: 1965, gio: 12, gioiTinh: 'nu', quyUoc: { muiGioLich: 'utc7' } });
  assert.deepEqual(cu.am, { ngay: 1, thang: 1, nam: 1965, nhuan: false });
  const am = T.anLaSo({ lich: 'am', ngay: 30, thang: 12, nam: 1964, gio: 12, gioiTinh: 'nu' });
  assert.deepEqual(am.duong, { ngay: 1, thang: 2, nam: 1965 });
  assert.deepEqual(T.anLaSo({ lich: 'duong', ngay: 29, thang: 1, nam: 1968, gio: 12, gioiTinh: 'nam' }).am, { ngay: 1, thang: 1, nam: 1968, nhuan: false });
  assert.equal(ls.quyUoc.muiGioLich, 'lichSu');
});

test('Giờ Tý muộn 23:00–23:59 tính sang ngày hôm sau (đặc tả 1.4, 10.1)', () => {
  const t = testIztroTuViTheoGio;
  const tuVi = (gio, quyUoc) => viTriSao(T.anLaSo({ lich: 'duong', ngay: 1, thang: 8, nam: 2023, gio, gioiTinh: 'nam', quyUoc }))['Tử Vi'];
  const GIO = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  Object.values(t.tuViTheoGio).slice(0, 12).forEach((chi, i) => assert.equal(tuVi(GIO[i]), chi, `giờ ${GIO[i]}`));
  assert.equal(tuVi(23), t.tuViTheoGio['Tý muộn (23h-24h)'], 'Tý muộn');
  const giu = T.anLaSo({ lich: 'duong', ngay: 1, thang: 8, nam: 2023, gio: 23, gioiTinh: 'nam', quyUoc: { gioTyMuon: 'giuNgay' } });
  assert.deepEqual(giu.am, { ngay: 15, thang: 6, nam: 2023, nhuan: false });
  assert.equal(viTriSao(giu)['Tử Vi'], tuVi(0));
  // Tùy chọn iztro: cộng 1 ngày âm, giữ tháng âm
  const iz = T.anLaSo({ lich: 'duong', ngay: 19, thang: 2, nam: 2023, gio: 23, gioiTinh: 'nam', quyUoc: { gioTyMuon: 'congNgayAm' } });
  assert.deepEqual(iz.am, { ngay: 1, thang: 1, nam: 2023, nhuan: false });
  assert.equal(iz.menhTai, 'Dần', 'iztro giữ tháng 1 nên Mệnh ở Dần');
  // Mặc định: sang hẳn ngày dương kế tiếp (1/2 âm)
  const cuoi = T.anLaSo({ lich: 'duong', ngay: 19, thang: 2, nam: 2023, gio: 23, gioiTinh: 'nam' });
  assert.deepEqual(cuoi.am, { ngay: 1, thang: 2, nam: 2023, nhuan: false });
  assert.equal(cuoi.menhTai, 'Mão', 'Mệnh theo tháng 2');
  assert.equal(viTriSao(cuoi)['Tử Vi'], t.them.tuVi);
  assert.deepEqual(cuoi.duong, { ngay: 19, thang: 2, nam: 2023 });
  assert.equal(T.anLaSo({ lich: 'duong', ngay: 9, thang: 2, nam: 2024, gio: 23, gioiTinh: 'nu' }).canChi.nam, 'Giáp Thìn');
});

test('Giờ khai sinh miền Nam 1960–1975 quy về giờ chuẩn UTC+7 (đặc tả 1.2, 10.3)', () => {
  const lapMN = (ngay, thang, nam, gio, phut, mienNamTruoc1975, quyUoc) =>
    T.anLaSo({ lich: 'duong', ngay, thang, nam, gio, phut, gioiTinh: 'nam', mienNamTruoc1975, quyUoc });
  const mn = lapMN(1, 5, 1970, 11, 30, true);
  assert.equal(mn.gio.chi, 'Tỵ');
  assert.deepEqual(mn.gioChuan, { ngay: 1, thang: 5, nam: 1970, gio: '10:30', daQuyDoi: true });
  assert.equal(mn.gio.dongHo, '11:30');
  assert.equal(lapMN(1, 5, 1970, 11, 30, false).gio.chi, 'Ngọ');
  assert.equal(lapMN(1, 5, 1970, 11, 30, true, { chuanHoaGioMienNam: 'khong' }).gio.chi, 'Ngọ');
  assert.equal(lapMN(13, 6, 1975, 10, 30, true).gioChuan.daQuyDoi, false);
  assert.equal(lapMN(12, 6, 1975, 10, 30, true).gioChuan.daQuyDoi, true);
  assert.equal(lapMN(31, 12, 1959, 23, 30, true).gioChuan.daQuyDoi, false);
  const dem = lapMN(2, 3, 1970, 0, 30, true);
  assert.deepEqual(dem.gioChuan, { ngay: 1, thang: 3, nam: 1970, gio: '23:30', daQuyDoi: true });
  assert.deepEqual(dem.am, lapMN(2, 3, 1970, 0, 30, false).am);
  const giu = T.anLaSo({ lich: 'duong', ngay: 2, thang: 3, nam: 1970, gio: 0, phut: 30, gioiTinh: 'nam', mienNamTruoc1975: true, quyUoc: { gioTyMuon: 'giuNgay' } });
  assert.deepEqual(giu.am, lapMN(1, 3, 1970, 12, 0, false).am);
});

test('Sao lưu niên (đặc tả 7.4, testLuuNien từ bộ test iztro)', () => {
  const ls = T.anLaSo({ lich: 'duong', ngay: 6, thang: 3, nam: 2023, gio: 8, gioiTinh: 'nam' });
  const viTriLuu = (namXem, dayDu) => {
    const ln = T.anLuuNien(ls, namXem, { dayDu });
    return Object.fromEntries(ln.saoLuu.map((s) => [s.ten.replace('L. ', 'L.'), L.DIA_CHI[s.chi]]));
  };
  assert.deepEqual(viTriLuu(2023, true), { ...viTriLuu(2023, true), ...testLuuNien[0].kyVong });
  const canh = viTriLuu(2000, true);
  for (const [sao, chi] of Object.entries(testLuuNien[1].kyVong)) assert.equal(canh['L.' + sao], chi, sao);
  const ln = T.anLuuNien(ls, 2026);
  assert.equal(ln.canChi, 'Bính Ngọ');
  assert.equal(ln.saoLuu.length, 9);
  const v = viTriLuu(2026);
  assert.deepEqual([v['L.Thái Tuế'], v['L.Tang Môn'], v['L.Bạch Hổ'], v['L.Thiên Khốc'], v['L.Thiên Hư']], ['Ngọ', 'Thân', 'Dần', 'Tý', 'Tý']);
  assert.deepEqual([v['L.Lộc Tồn'], v['L.Kình Dương'], v['L.Đà La'], v['L.Thiên Mã']], ['Tỵ', 'Ngọ', 'Thìn', 'Thân']);
  const goc = (ten) => ls.cung.find((c) => c.chinhTinh.concat(c.phuTinh).some((s) => s.ten === ten)).chi;
  assert.deepEqual(ln.luuTuHoa.map((h) => [h.hoa, h.sao, h.chi]),
    [['Hóa Lộc', 'Thiên Đồng', goc('Thiên Đồng')], ['Hóa Quyền', 'Thiên Cơ', goc('Thiên Cơ')], ['Hóa Khoa', 'Văn Xương', goc('Văn Xương')], ['Hóa Kỵ', 'Liêm Trinh', goc('Liêm Trinh')]]);
  assert.equal(ln.tuoiMu, 4);
  assert.equal(ln.daiVan, ls.cung.find((c) => c.ten === 'Mệnh').chi, 'tuổi 4 còn ở đại vận cung Mệnh (Thủy nhị cục: 2–11)');
  assert.equal(L.DIA_CHI[ln.tieuHan], ls.cung.find((c) => c.tieuHan === 'Ngọ').tenChi);
  const dauQuan = ls.cung.find((c) => c.phuTinh.some((s) => s.ten === 'Đẩu Quân')).chi;
  assert.equal(T.anLuuNien(ls, 2023).luuNguyet[0], dauQuan);
  assert.equal(ln.luuNguyet.length, 12);
});

function kiemTraCachCu(saoDs, quyUoc) {
  let soCa = 0;
  for (const c of cases) {
    if (c.id === 'TC06' || c.id === 'TC07') continue;
    const v = viTriSao(lap(c.input, quyUoc));
    for (const l of c.repoXemboi.lech) {
      const sao = l.truong.replace('sao.', '');
      if (saoDs.includes(sao)) { assert.equal(v[sao], l.repo, `${c.id} ${sao}`); soCa++; }
    }
  }
  assert.ok(soCa > 0);
}

test('Tùy chọn Hỏa Tinh, Linh Tinh tuổi Tỵ Dậu Sửu và chiều đếm (đặc tả 5.10, 10.5–10.6)', () => {
  kiemTraCachCu(['Hỏa Tinh', 'Linh Tinh'], { hoaLinh: 'ansaotuvi' });
  const tc11 = cases.find((c) => c.id === 'TC11').input;
  const v = viTriSao(lap(tc11));
  assert.deepEqual([v['Hỏa Tinh'], v['Linh Tinh']], ['Dần', 'Hợi']);
  // 10.5: chiều thuận cho cả hai (phái Trung Quốc) — tuổi Dậu giờ Hợi (H=11): Hỏa Mão+11=Dần, Linh Tuất+11=Dậu
  const vt = viTriSao(lap(tc11, { chieuHoaLinh: 'thuan' }));
  assert.deepEqual([vt['Hỏa Tinh'], vt['Linh Tinh']], ['Dần', 'Dậu']);
});

test('Tùy chọn Thiên Khôi, Thiên Việt (đặc tả 5.7, 10.8)', () => {
  kiemTraCachCu(['Thiên Khôi', 'Thiên Việt'], { khoiViet: 'ansaotuvi' });
  const kv = (nam, khoiViet) => {
    const v = viTriSao(T.anLaSo({ lich: 'duong', ngay: 1, thang: 6, nam, gio: 12, gioiTinh: 'nam', quyUoc: { khoiViet } }));
    return [v['Thiên Khôi'], v['Thiên Việt']];
  };
  const MAC_DINH = [['Sửu', 'Mùi'], ['Tý', 'Thân'], ['Hợi', 'Dậu'], ['Hợi', 'Dậu'], ['Sửu', 'Mùi'], ['Tý', 'Thân'], ['Sửu', 'Mùi'], ['Ngọ', 'Dần'], ['Mão', 'Tỵ'], ['Mão', 'Tỵ']];
  for (let i = 0; i < 10; i++) assert.deepEqual(kv(1984 + i), MAC_DINH[i], `can ${L.THIEN_CAN[i]}`);
  assert.deepEqual(kv(1990, 'canhTanMaHo'), ['Ngọ', 'Dần'], 'Canh theo "Canh Tân phùng Mã Hổ"');
  assert.deepEqual(kv(1992, 'ansaotuvi'), ['Tỵ', 'Mão'], 'engine cũ đảo cả can Nhâm');
  const ls = T.anLaSo({ lich: 'duong', ngay: 1, thang: 6, nam: 1990, gio: 12, gioiTinh: 'nam', quyUoc: { khoiViet: 'canhTanMaHo' } });
  const luu = T.anLuuNien(ls, 2030, { dayDu: true }).saoLuu;
  assert.deepEqual(['L. Thiên Khôi', 'L. Thiên Việt'].map((t) => L.DIA_CHI[luu.find((s) => s.ten === t).chi]), ['Ngọ', 'Dần']);
});

test('Tùy chọn Phá Toái, Lưu Hà, Thiên Trù can Quý, Thiên Giải (đặc tả 5.4, 5.7, 5.9, 10.7, 10.9–10.11)', () => {
  kiemTraCachCu(['Phá Toái', 'Lưu Hà'], { phaToai: 'ansaotuvi', luuHa: 'ansaotuvi' });
  const sao = (nam, thang, quyUoc, ten) =>
    viTriSao(T.anLaSo({ lich: 'am', ngay: 10, thang, nam, gio: 12, gioiTinh: 'nu', quyUoc }))[ten];
  const PHA_TOAI = ['Tỵ', 'Sửu', 'Dậu', 'Tỵ', 'Sửu', 'Dậu', 'Tỵ', 'Sửu', 'Dậu', 'Tỵ', 'Sửu', 'Dậu'];
  for (let i = 0; i < 12; i++) assert.equal(sao(1984 + i, 1, undefined, 'Phá Toái'), PHA_TOAI[i], `tuổi ${L.DIA_CHI[i]}`);
  const LUU_HA = ['Dậu', 'Tuất', 'Mùi', 'Thân', 'Tỵ', 'Ngọ', 'Thìn', 'Mão', 'Hợi', 'Dần'];
  for (let i = 0; i < 10; i++) assert.equal(sao(1984 + i, 1, undefined, 'Lưu Hà'), LUU_HA[i], `can ${L.THIEN_CAN[i]}`);
  assert.equal(sao(1987, 1, { luuHa: 'ansaotuvi' }, 'Lưu Hà'), 'Thìn');
  assert.equal(sao(1993, 1, undefined, 'Thiên Trù'), 'Tuất');
  assert.equal(sao(1993, 1, { thienTruQuy: 'hoi' }, 'Thiên Trù'), 'Hợi');
  assert.equal(sao(1992, 1, { thienTruQuy: 'hoi' }, 'Thiên Trù'), 'Dậu', 'chỉ đổi can Quý');
  const giai = (thienGiai) => Array.from({ length: 12 }, (_, i) => sao(1990, i + 1, { thienGiai }, 'Thiên Giải'));
  assert.deepEqual(giai(undefined), ['Thân', 'Tuất', 'Tý', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Tuất', 'Tý', 'Dần', 'Thìn', 'Ngọ']);
  assert.deepEqual(giai('capThang'), ['Thân', 'Thân', 'Tuất', 'Tuất', 'Tý', 'Tý', 'Dần', 'Dần', 'Thìn', 'Thìn', 'Ngọ', 'Ngọ']);
  assert.deepEqual(giai('thanThuan'), ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi']);
});

test('Tùy chọn độ sáng Tử Vi ở Tý, Ngọ và độ sáng Hóa Lộc, Quyền, Kỵ (đặc tả mục 6)', () => {
  const dacTinh = (ls, ten) => ls.cung.flatMap((c) => c.chinhTinh.concat(c.phuTinh)).find((s) => s.ten === ten).dacTinh;
  const tc06 = cases.find((c) => c.id === 'TC06').input, tc02 = cases.find((c) => c.id === 'TC02').input;
  assert.equal(dacTinh(lap(tc06), 'Tử Vi'), 'M');
  assert.equal(dacTinh(lap(tc06, { tuViTyNgo: 'cungBinh' }), 'Tử Vi'), 'B');
  assert.equal(dacTinh(lap(tc06, { tuViTyNgo: 'cungMieu' }), 'Tử Vi'), 'M');
  assert.equal(dacTinh(lap(tc02, { tuViTyNgo: 'cungBinh' }), 'Tử Vi'), 'M', 'Tử Vi ở Thân giữ nguyên');
  const tuViTy = { lich: 'duong', ngay: 11, thang: 2, nam: 1985, gio: 9, gioiTinh: 'nam' };
  assert.equal(viTriSao(lap(tuViTy))['Tử Vi'], 'Tý');
  assert.equal(dacTinh(lap(tuViTy), 'Tử Vi'), 'B');
  assert.equal(dacTinh(lap(tuViTy, { tuViTyNgo: 'cungMieu' }), 'Tử Vi'), 'M');
  const an = lap(tc06, { dacTinhHoa: 'an' });
  for (const h of ['Hóa Lộc', 'Hóa Quyền', 'Hóa Kỵ']) {
    assert.ok(dacTinh(lap(tc06), h), h);
    assert.equal(dacTinh(an, h), null, h);
  }
  assert.equal(dacTinh(an, 'Hóa Khoa'), 'Đ');
});

test('Quy ước mặc định đủ mọi mục 10 đặc tả và được trả kèm lá số', () => {
  const ls = lap(cases[0].input);
  assert.deepEqual(ls.quyUoc, {
    gioTyMuon: 'ngaySau',
    muiGioLich: 'lichSu',
    chuanHoaGioMienNam: 'iana',
    tuHoa: 'viet',
    chieuHoaLinh: 'viet',
    hoaLinh: 'cauPhu',
    thienGiai: 'thienLuong',
    khoiViet: 'toanThu',
    phaToai: 'iztro',
    luuHa: 'trungQuoc',
    thienTruQuy: 'tuat',
    thuongSu: 'coDinh',
    thangNhuan: 'thangChinh',
    menhChu: 'chiNam',
    tuanTriet: 'haiCung',
    bangDoSang: 'viet',
    tuViTyNgo: 'ansaotuvi',
    dacTinhHoa: 'ansaotuvi',
    ranhGioiNam: 'tet',
    gioMatTroiThuc: false,
  });
  assert.equal(lap(cases[0].input, { khoiViet: 'ansaotuvi', khongCo: 1 }).quyUoc.khoiViet, 'ansaotuvi');
  assert.equal('khongCo' in lap(cases[0].input, { khongCo: 1 }).quyUoc, false);
});

test('Tháng nhuận: đổi tháng làm đổi cung Mệnh, cục và vị trí Tử Vi (SPEC 1.6, 10.13)', () => {
  const mac = T.anLaSo({ lich: 'am', ngay: 19, thang: 4, nam: 2020, nhuan: true, gio: 8, phut: 0, gioiTinh: 'nu' });
  const chia15 = T.anLaSo({ lich: 'am', ngay: 19, thang: 4, nam: 2020, nhuan: true, gio: 8, phut: 0, gioiTinh: 'nu', quyUoc: { thangNhuan: 'chiaNgay15' } });
  const thangSau = T.anLaSo({ lich: 'am', ngay: 19, thang: 4, nam: 2020, nhuan: true, gio: 8, phut: 0, gioiTinh: 'nu', quyUoc: { thangNhuan: 'thangSau' } });
  const chi = (ls, ten) => ls.cung.find((c) => c.chinhTinh.some((s) => s.ten === ten)).tenChi;
  const menh = (ls) => ls.cung.find((c) => c.ten === 'Mệnh').tenChi;
  assert.deepEqual([menh(mac), mac.cuc, chi(mac, 'Tử Vi')], ['Sửu', 'Hỏa Lục Cục', 'Tý']);
  assert.deepEqual([menh(chia15), chia15.cuc, chi(chia15, 'Tử Vi')], ['Dần', 'Thổ Ngũ Cục', 'Thìn']);
  assert.deepEqual([menh(thangSau), thangSau.cuc, chi(thangSau, 'Tử Vi')], ['Dần', 'Thổ Ngũ Cục', 'Thìn']);
  // Ngày 10 (≤ 15): chiaNgay15 giữ tháng chính
  const ngay10 = T.anLaSo({ lich: 'am', ngay: 10, thang: 4, nam: 2020, nhuan: true, gio: 8, phut: 0, gioiTinh: 'nu', quyUoc: { thangNhuan: 'chiaNgay15' } });
  assert.equal(menh(ngay10), 'Sửu');
});

test('Tùy chọn Tứ Hóa TQ (10.4), Thiên Thương/Sứ Trung Châu (10.12) và Tuần/Triệt 1 cung (10.15)', () => {
  // 10.4: can Canh (1990) & Nhâm (1992)
  const hoaCua = (ls) => Object.fromEntries(ls.cung.flatMap((c) => c.chinhTinh.concat(c.phuTinh)).filter((s) => s.hoa).map((s) => [s.hoa, s.ten]));
  const canhVN = hoaCua(T.anLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1990, gio: 8, gioiTinh: 'nam' }));
  const canhTQ = hoaCua(T.anLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1990, gio: 8, gioiTinh: 'nam', quyUoc: { tuHoa: 'trungQuoc' } }));
  assert.equal(canhVN['Hóa Khoa'], 'Thiên Đồng');
  assert.equal(canhVN['Hóa Kỵ'], 'Thái Âm');
  assert.equal(canhTQ['Hóa Khoa'], 'Thái Âm');
  assert.equal(canhTQ['Hóa Kỵ'], 'Thiên Đồng');
  const nhamTQ = hoaCua(T.anLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1992, gio: 8, gioiTinh: 'nam', quyUoc: { tuHoa: 'trungQuoc' } }));
  assert.equal(nhamTQ['Hóa Khoa'], 'Tả Phù');

  // 10.12: Âm Nam (Ất Hợi 1995, TC03) đổi chỗ Thương/Sứ khi chọn trungChau
  const tc03 = cases.find((c) => c.id === 'TC03').input;
  const vCoDinh = viTriSao(lap(tc03));
  const vTC = viTriSao(lap(tc03, { thuongSu: 'trungChau' }));
  assert.equal(vTC['Thiên Thương'], vCoDinh['Thiên Sứ']);
  assert.equal(vTC['Thiên Sứ'], vCoDinh['Thiên Thương']);

  // 10.15: Tuần/Triệt một cung (cùng âm dương năm sinh)
  const motCung = lap(tc03, { tuanTriet: 'motCung' });
  assert.equal(motCung.tuanCung.length, 1);
  assert.equal(motCung.trietCung.length, 1);
  // Ất Hợi là năm âm → chọn cung chi âm (chỉ số 0-based lẻ: Dậu=9, Mùi=7)
  assert.equal(motCung.tuan, 'Dậu');
  assert.equal(motCung.triet, 'Mùi');
});
