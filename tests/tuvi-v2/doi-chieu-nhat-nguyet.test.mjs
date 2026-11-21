// Đối chiếu engine với bộ ca kiểm độc lập Nhat-Nguyet (CC BY 4.0, ghi nguồn trong fixture).
// - 14.735 ca lịch âm (UTC+7, +8, +9; dương→âm, âm→dương, can chi)
// - 777 lá số Tử Vi phái Việt: cục, Mệnh, Thân, tên cung, Tuần Triệt, ~110 sao, Tràng Sinh, Tứ hóa, đại vận, lưu niên.
// Họ theo một số quy ước khác mặc định của mình; test bật đúng các quy ước đó (QUY_UOC_NN) và liệt kê
// từng điểm khác còn lại (KHAC_BIET_DA_BIET). Mọi lệch ngoài danh sách là lỗi mới.
// Báo cáo: docs/v2/15-doi-chieu-engine.md
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as A from '../../src/lib/tuvi-v2/am-lich.ts';
import * as T from '../../src/lib/tuvi-v2/tuvi-raw.js';

const doc = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const AL = doc('./doi-chieu/nhat-nguyet-am-lich.json');
const TV = doc('./doi-chieu/nhat-nguyet-tu-vi.json');

// Ngày sóc sát nửa đêm. Theo DE440 (bảng 9 bài báo Nhat-Nguyet) mình đúng ở 6/1944, 12/2072; 11/2077 tùy mô hình ΔT;
// 7/1967 mình sớm 1 ngày ở UTC+7 thuần (sóc 00:00:04), còn chế độ lịch sử (UTC+8 trước 1968) đúng.
const LECH_SOC_DA_BIET = new Set([
  '7|29/6/1944', '7|12/7/1944', '7|10/7/1967', '7|23/7/1967', '7|5/8/1967',
  '7|11/12/2072', '7|24/12/2072', '7|6/1/2073', '7|22/11/2077', '7|5/12/2077',
  '8|18/8/2097', // sóc 00:00:15 UTC+8
  '9|4/12/2005', '9|8/7/2017', '9|6/8/2017', '9|27/1/2097', // lịch Hàn/Nhật cũ, không dùng
]);

test('[Nhat-Nguyet] lịch âm: dương→âm và can chi', () => {
  const lech = [];
  let n = 0;
  for (const c of AL.ca) {
    if (c.p !== 'da') continue;
    n++;
    const [d, m, y] = c.v;
    const am = A.duongSangAm(d, m, y, c.tz);
    const ok = am.ngay === c.am[0] && am.thang === c.am[1] && am.nam === c.am[2] && +am.nhuan === c.am[3];
    if (!ok && !LECH_SOC_DA_BIET.has(`${c.tz}|${d}/${m}/${y}`)) lech.push(`${c.tz}|${d}/${m}/${y}: ${JSON.stringify(am)} vs ${c.am}`);
    if (c.cc) {
      const jdn = A.soNgayJulius(d, m, y);
      assert.deepEqual(
        [A.canChiNgay(jdn).ten, A.canChiThang(am.thang, am.nam).ten, A.canChiNam(am.nam).ten],
        c.cc, `${d}/${m}/${y}: can chi`);
    }
  }
  assert.ok(n > 11000, `số ca ${n}`);
  assert.deepEqual(lech, []);
});

test('[Nhat-Nguyet] lịch âm: âm→dương (mình trả null cho ngày không tồn tại, họ cho tràn)', () => {
  const lech = [];
  for (const c of AL.ca) {
    if (c.p !== 'ad') continue;
    const [d, m, y, nh] = c.v;
    const kq = A.amSangDuong(d, m, y, !!nh, c.tz);
    if (kq === null) {
      // chỉ chấp nhận null khi ngày đó thật sự không có: ngày 30 của tháng thiếu, hoặc tháng nhuận không có năm đó
      const tonTai = d < 30 && (!nh || A.thangNhuan(y, c.tz) === m);
      if (tonTai) lech.push(`${d}/${m}${nh ? 'n' : ''}/${y} tz${c.tz}: mình null`);
      continue;
    }
    if (!c.duong || kq.ngay !== c.duong[0] || kq.thang !== c.duong[1] || kq.nam !== c.duong[2]) {
      lech.push(`${d}/${m}${nh ? 'n' : ''}/${y} tz${c.tz}: ${JSON.stringify(kq)} vs ${c.duong}`);
    }
  }
  assert.deepEqual(lech, []);
});

// Quy ước Nhat-Nguyet khác mặc định của mình (đều là tùy chọn có sẵn trong QuyUoc)
const QUY_UOC_NN = { thienGiai: 'thanThuan', khoiViet: 'canhTanMaHo', luuHa: 'ansaotuvi', muiGioLich: 'utc7' };
// Khác biệt còn lại, đã biết: bảng độ sáng 4 ô và Hóa Khoa can Nhâm
const SANG_KHAC = new Set(['Phá Quân@4', 'Phá Quân@10', 'Thiên Lương@0', 'Thất Sát@11']);
const BI_DANH = { 'Thiên Diêu': 'Thiên Riêu', 'Lưu Niên Văn Tinh': 'Văn Tinh' };
const chuan = (t) => { t = t.replace(/^L\. /, 'Lưu '); return BI_DANH[t] ?? t; };

test('[Nhat-Nguyet] 777 lá số Tử Vi phái Việt', () => {
  assert.equal(TV.ca.length, 777);
  const lech = [];
  const kt = (ok, msg) => { if (!ok && lech.length < 30) lech.push(msg); };
  for (const c of TV.ca) {
    const [d, m, y, chi, gt] = c.v;
    const tag = `${d}/${m}/${y} ${chi} ${gt}`;
    const ls = T.anLaSo({ lich: 'duong', ngay: d, thang: m, nam: y, gio: chi * 2, phut: 0, gioiTinh: gt === 'Nam' ? 'nam' : 'nu', quyUoc: QUY_UOC_NN });
    kt(ls.am.ngay === c.am[0] && ls.am.thang === c.am[1] && ls.am.nam === c.am[2] && +ls.am.nhuan === c.am[3], `${tag}: ngày âm`);
    kt(ls.canChi.nam === c.canChiNam, `${tag}: can chi năm`);
    kt(ls.cuc === c.cuc, `${tag}: cục ${ls.cuc} vs ${c.cuc}`);
    kt(ls.cung.find((x) => x.ten === 'Mệnh').chi === c.menh, `${tag}: Mệnh`);
    kt(ls.cung.find((x) => x.laThan).chi === c.than, `${tag}: Thân`);
    const sao = new Map(), sang = new Map(), hoa = {};
    ls.cung.forEach((cg, i) => {
      kt(cg.ten === c.tenCung[i], `${tag}: tên cung ${i}`);
      kt(cg.tuan === c.tuan.includes(i) && cg.triet === c.triet.includes(i), `${tag}: Tuần/Triệt ở ${i}`);
      kt(String(cg.daiVanTu) === String(c.daiVan[i]), `${tag}: đại vận ở ${i}: ${cg.daiVanTu} vs ${c.daiVan[i]}`);
      sao.set('TS:' + (cg.trangSinh === 'Trường Sinh' ? 'Tràng Sinh' : cg.trangSinh), cg.chi);
      for (const s of [...cg.chinhTinh, ...cg.phuTinh]) {
        if (s.ten.startsWith('Hóa ')) continue;
        sao.set(chuan(s.ten), cg.chi);
        if (s.hoa) hoa[s.hoa] = s.ten;
      }
      for (const s of cg.chinhTinh) sang.set(s.ten, s.dacTinhTen);
    });
    for (const [ten, viTri] of Object.entries(c.sao)) kt(sao.get(chuan(ten)) === viTri, `${tag}: sao ${ten} ${sao.get(chuan(ten))} vs ${viTri}`);
    for (const [ten, s] of Object.entries(c.sang)) {
      const viTri = c.sao[ten];
      kt(sang.get(ten) === s || SANG_KHAC.has(`${ten}@${viTri}`), `${tag}: độ sáng ${ten}@${viTri} ${sang.get(ten)} vs ${s}`);
    }
    const nhamKhoa = ls.canChi.nam.startsWith('Nhâm');
    for (const [h, ten] of Object.entries(c.hoa)) kt(hoa[h] === ten || (nhamKhoa && h === 'Hóa Khoa'), `${tag}: ${h} ${hoa[h]} vs ${ten}`);
    const ln = T.anLuuNien(ls, c.namXem, { dayDu: true });
    if (y < c.namXem) kt(ln.tieuHan === c.tieuHan, `${tag}: tiểu hạn`);
    kt(ln.luuThaiTue === c.luuThaiTue, `${tag}: lưu Thái Tuế`);
    for (const [h, [ten, viTri]] of Object.entries(c.luuHoa)) {
      const x = ln.luuTuHoa.find((t) => h.endsWith(t.hoa) || t.hoa === h);
      kt(!!x && x.sao === ten && x.chi === viTri, `${tag}: lưu ${h}`);
    }
    for (const [ten, viTri] of Object.entries(c.saoLuu)) {
      const x = ln.saoLuu.find((s) => chuan(s.ten) === ten);
      kt(!!x && x.chi === viTri, `${tag}: ${ten}`);
    }
    kt(JSON.stringify(ln.luuNguyet) === JSON.stringify(c.luuNguyet), `${tag}: lưu nguyệt`);
  }
  assert.deepEqual(lech, []);
});
