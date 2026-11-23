// /xem-ngay: trực, 12 thần hoàng/hắc đạo, nghi kỵ. Đối chiếu với nguyên văn sách và với một bản cài đặt độc lập (lunar-javascript).
// Chạy: npx tsx --test tests/trang/xem-ngay.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import L from 'lunar-javascript';
import {
  TRUC, THAN_12, TRICH_DOAN, chiSoTruc, chiSoThan, chiKhoiThanhLong, thangTiet, xemNgay, ngayTheoViec, VIEC,
} from '../../src/lib/trang/xem-ngay.ts';
import { TEN_NGHI_KY, TEN_THAN_SAT } from '../../src/lib/trang/xem-ngay-thuat-ngu.ts';
import { lietKeTietKhi } from '../../src/lib/tuvi-v2/tiet-khi.mjs';

const { LunarUtil, Solar } = L;
const CHI = '子丑寅卯辰巳午未申酉戌亥';
const TRUC_HAN = '建除滿平定執破危成收開閉';

test('Trực khớp 716 ô 月表 của Hiệp kỷ (12 tháng tiết)', () => {
  const j = JSON.parse(readFileSync(new URL('./doi-chieu/hiep-ky-nguyet-bieu.json', import.meta.url), 'utf8'));
  let dem = 0;
  for (const [k, t] of Object.entries(j.thang)) {
    const chiThang = (Number(k) + 1) % 12; // tháng 1 = Dần
    for (const [gz, o] of Object.entries(t.ngay)) {
      assert.equal(TRUC_HAN[chiSoTruc(chiThang, CHI.indexOf(gz[1]))], o.truc, `tháng ${k} ngày ${gz}`);
      dem++;
    }
  }
  assert.equal(dem, 716);
  assert.deepEqual(TRUC.map((t) => t.han).join(''), TRUC_HAN);
});

test('Nhóm hoàng/hắc của trực khớp câu ca Ngọc hạp ký', () => {
  const v = TRICH_DOAN.ngocHapTruc.nguyenVan;
  const lay = (re) => [...re.exec(v)[1]];
  const nhom = Object.fromEntries(TRUC.map((t) => [t.han, t.nhom]));
  for (const c of lay(/([建滿平收]+)黑/)) assert.equal(nhom[c], 'hac', c);
  for (const c of lay(/([除危定執]+)黃/)) assert.equal(nhom[c], 'hoang', c);
  for (const c of lay(/([成開]+)皆可用/)) assert.equal(nhom[c], 'kha-dung', c);
  for (const c of lay(/([閉破]+)不相當/)) assert.equal(nhom[c], 'bat-tuong', c);
  for (const t of TRUC) if (t.viecHan) for (const p of t.viecHan.split('；')) assert.ok(v.includes(p), p);
});

test('Quy tắc khởi Thanh long khớp nguyên văn Hiệp kỷ 卷七', () => {
  const v = TRICH_DOAN.hiepKyThan.nguyenVan;
  const thuTu = v.match(/一(.{2})，二(.{2})，三(.{2})，四(.{2})，五(.{2})，六(.{2})，七(.{2})，八(.{2})，九(.{2})，十(.{2})，十一(.{2})，十二(.{2})/).slice(1);
  assert.deepEqual(THAN_12.map((t) => t.han), thuTu);
  for (const m of v.matchAll(/([子丑寅卯辰巳午未申酉戌亥]{2})(?:青龍)?起([子丑寅卯辰巳午未申酉戌亥])/g)) {
    for (const c of m[1]) assert.equal(chiKhoiThanhLong(CHI.indexOf(c)), CHI.indexOf(m[2]), `tháng ${c}`);
  }
  // Sáu hoàng đạo: sách ghi ứng với Tý Ngọ Mão Dậu Dần Mùi khi Tư mệnh = Tý (rag_doan 6240–6241).
  const hoang = THAN_12.filter((t) => t.hoangDao).map((t) => CHI[(t.chiSo + 2) % 12]).sort().join('');
  assert.equal(hoang, [...'子午卯酉寅未'].sort().join(''));
});

test('12 thần khớp lunar-javascript (getDayTianShen) mọi ngày 2025–2027, dùng tháng của chính thư viện', () => {
  const gian = { 青龙: '青龍', 金匮: '金匱', 玄武: '元武', 勾陈: '勾陳' };
  for (let t = Date.UTC(2025, 0, 1); t < Date.UTC(2028, 0, 1); t += 86400000) {
    const d = new Date(t);
    const lu = Solar.fromYmd(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()).getLunar();
    const chiNgay = CHI.indexOf(lu.getDayZhi());
    const than = THAN_12[chiSoThan(lu.getMonthZhiIndex(), chiNgay)];
    const ts = lu.getDayTianShen();
    assert.equal(than.han, gian[ts] ?? ts, d.toISOString().slice(0, 10));
  }
});

test('Ngày 23/11/2026: tháng Kỷ Hợi, ngày Tân Sửu, trực Mãn, Ngọc đường hoàng đạo', () => {
  const x = xemNgay(23, 11, 2026);
  assert.equal(x.thangTiet.han, '己亥');
  assert.equal(x.ngayHan, '辛丑');
  assert.equal(x.truc.ten, 'Mãn');
  assert.equal(x.than.ten, 'Ngọc đường');
  assert.equal(x.than.hoangDao, true);
  assert.ok(x.nghi.length > 0 && x.ky.length > 0);
  assert.ok(x.catThan.some((m) => m.han === '玉堂'));
});

test('Tháng tiết theo giờ Việt Nam: ngày có tiết thuộc tháng mới; tiết rơi 23–24h Bắc Kinh thì lệch lịch Trung Quốc một ngày', () => {
  let lech = 0;
  for (let nam = 1950; nam <= 2060; nam++) {
    for (const tk of lietKeTietKhi(nam)) {
      if (tk.kinhDo % 30 !== 15) continue; // chỉ 12 "tiết" (kinh độ 315 + 30k), bỏ 12 "khí"
      const t = tk.thoiDiem.getTime();
      const vn = new Date(t + 7 * 3600000);
      const [y, m, d] = [vn.getUTCFullYear(), vn.getUTCMonth() + 1, vn.getUTCDate()];
      const truoc = new Date(Date.UTC(y, m - 1, d) - 86400000);
      const a = thangTiet(d, m, y);
      const b = thangTiet(truoc.getUTCDate(), truoc.getUTCMonth() + 1, truoc.getUTCFullYear());
      assert.equal((a.thuTu - b.thuTu + 12) % 12, 1, `${tk.ten} ${y}-${m}-${d}`);
      const gioUTC = (t % 86400000) / 3600000;
      if (gioUTC >= 16 && gioUTC < 17) {
        // 23:00–24:00 VN, nhưng đã sang ngày sau ở Bắc Kinh: lunar-javascript còn để tháng cũ.
        const lu = Solar.fromYmd(y, m, d).getLunar();
        assert.notEqual(lu.getMonthInGanZhi(), a.han, `${y}-${m}-${d}`);
        assert.equal(lu.getMonthInGanZhi(), b.han);
        lech++;
      }
    }
  }
  assert.ok(lech > 0, 'phải có ít nhất một ngày lệch trong 1950–2060');
});

test('Có tên tiếng Việt cho mọi mục nghi kỵ và thần sát của lunar-javascript', () => {
  for (const h of LunarUtil.YI_JI) assert.ok(TEN_NGHI_KY[h], `thiếu nghi kỵ ${h}`);
  for (const h of LunarUtil.SHEN_SHA) assert.ok(TEN_THAN_SAT[h], `thiếu thần sát ${h}`);
  // Mục chính và phụ của từng việc phải thật sự xuất hiện trong bảng nghi theo ngày (vd 买车 chỉ có ở bảng theo giờ).
  const G = '甲乙丙丁戊己庚辛壬癸';
  const gz = [...Array(60)].map((_, i) => G[i % 10] + CHI[i % 12]);
  const co = new Set();
  for (const m of gz) for (const d of gz) for (const y of LunarUtil.getDayYi(m, d)) co.add(y);
  for (const v of Object.values(VIEC)) for (const h of [...v.chinh, ...v.phu]) assert.ok(co.has(h), `${v.ma}: ${h}`);
});

test('Ngày theo việc: ngày hợp có mục chính trong nghi, mỗi việc đều có ngày hợp trong năm 2027', () => {
  const t = ngayTheoViec('cuoi-hoi', 2027, 2);
  assert.equal(t.ngay.length, 28);
  for (const n of t.hop) assert.ok(xemNgay(n.ngay, 2, 2027).nghi.some((m) => m.han === '嫁娶'));
  for (const n of t.ky) assert.ok(xemNgay(n.ngay, 2, 2027).ky.some((m) => m.han === '嫁娶'));
  for (const ma of Object.keys(VIEC)) {
    let hop = 0;
    for (let th = 1; th <= 12; th++) hop += ngayTheoViec(ma, 2027, th).hop.length;
    assert.ok(hop >= 6, `${ma}: ${hop}`);
  }
});

test('Báo lỗi ngoài phạm vi', () => {
  assert.throws(() => xemNgay(30, 2, 2027), RangeError);
  assert.throws(() => xemNgay(1, 1, 1899), RangeError);
  assert.throws(() => ngayTheoViec('cuoi-hoi', 2027, 13), RangeError);
});
