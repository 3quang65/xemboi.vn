// Cửu tinh năm/tháng: đối chiếu bảng 年表 (卷15–19) và bảng tháng (卷8) của Hiệp kỷ biện phương thư, Kanripo KR3g0051.
// Giá trị mẫu sao năm, tháng lấy từ voidforall/fengshui.skill tests/test_zibai.py (MIT, commit fe2a025).
// Chạy: npx tsx --test tests/trang/cuu-tinh.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CUU_CUNG, CUU_TINH, TRICH_CUU_TINH, banCuuTinh, cungCuaSao, cuuTinhNam, saoNam, saoThang, thangTietTai,
} from '../../src/lib/trang/cuu-tinh.ts';

const KANRIPO = process.env.KANRIPO_DIR ?? join(process.cwd(), '..', 'thu-vien-rag', 'kanripo');
// q là số quyển của sách. Kanripo thiếu 卷14 nên quyển 15 trở đi nằm ở tệp số q - 1.
const tep = (q) => join(KANRIPO, 'KR3g0051', `KR3g0051_${String(q >= 15 ? q - 1 : q).padStart(3, '0')}.txt`);
const sach = (q) => readFileSync(tep(q), 'utf8').replace(/<pb:[^>]*>/g, '').replace(/[¶\s]/g, '');
const boDau = (s) => s.replace(/[，。、：；]/g, '');
const coKanripo = existsSync(tep(8));

const SO_CUNG = { 坎: 1, 坤: 2, 震: 3, 巽: 4, 中: 5, 乾: 6, 兌: 7, 兑: 7, 兊: 7, 艮: 8, 離: 9 };
const SO_SAO = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const CAN_HAN = '甲乙丙丁戊己庚辛壬癸';
const CHI_HAN = '子丑寅卯辰巳午未申酉戌亥';
// Bản Tứ khố hay viết 巳 thay 己 ở vị trí can (vd 巳卯, 巳亥); can không thể là 巳 nên đọc là 己.
const stt60 = (can, chi) => {
  const c = CAN_HAN.indexOf(can === "巳" ? "己" : can), z = CHI_HAN.indexOf(chi);
  for (let i = 0; i < 60; i++) if (i % 10 === c && i % 12 === z) return i;
  return -1;
};

test('Sao năm: các năm đã biết và công thức rút gọn (fengshui.skill, MIT) khớp mọi năm 1684–2223', () => {
  const biet = { 1684: 1, 1864: 1, 1924: 4, 1984: 7, 2017: 1, 2020: 7, 2022: 5, 2023: 4, 2024: 3, 2025: 2, 2026: 1, 2027: 9 };
  for (const [y, s] of Object.entries(biet)) assert.equal(saoNam(Number(y)), s, y);
  for (let y = 1684; y < 2224; y++) assert.equal(saoNam(y), ((10 - (y % 9)) % 9) + 1, String(y));
});

test('Sao tháng: các ca đã biết', () => {
  assert.equal(saoThang(2026, 1), 8); // Ngọ, tháng giêng bát bạch
  assert.equal(saoThang(2024, 1), 5); // Thìn, ngũ hoàng
  assert.equal(saoThang(2025, 1), 2); // Tỵ, nhị hắc
  assert.equal(saoThang(2026, 9), 9);
  // Ba năm một vòng: 36 tháng liền nhau giảm đều một sao.
  let truoc = saoThang(2024, 12);
  for (const y of [2025, 2026, 2027]) for (let m = 1; m <= 12; m++) {
    const s = saoThang(y, m);
    assert.equal(s, truoc === 1 ? 9 : truoc - 1, `${y}/${m}`);
    truoc = s;
  }
});

test('Bàn thuận bố: câu Khang Hy 23 (nhất bạch nhập trung) và Lạc thư (ngũ hoàng nhập trung)', () => {
  const b = banCuuTinh(1);
  const theoCau = { Càn: 2, Đoài: 3, Cấn: 4, Ly: 5, Khảm: 6, Khôn: 7, Chấn: 8, Tốn: 9, 'Trung cung': 1 };
  for (const c of b.cung) assert.equal(c.sao.so, theoCau[c.ten], c.ten);
  for (const c of banCuuTinh(5).cung) assert.equal(c.sao.so, c.soLacThu, c.ten);
  for (let t = 1; t <= 9; t++) assert.equal(new Set(banCuuTinh(t).cung.map((c) => c.sao.so)).size, 9);
  assert.equal(CUU_CUNG.length, 9);
  assert.equal(cungCuaSao(banCuuTinh(9), 5).ten, 'Khảm'); // 2027: ngũ hoàng ở Bắc
});

test('Năm 2027 và mốc đổi năm, tháng theo tiết', () => {
  const n = cuuTinhNam(2027);
  assert.equal(n.canChi, 'Đinh Mùi');
  assert.equal(n.nguyen, 'Hạ nguyên');
  assert.equal(n.ban.trung, 9);
  assert.equal(n.thang[0].ban.trung, 5); // năm Mùi, tháng giêng ngũ hoàng
  assert.equal(n.thang[0].chi, 'Dần');
  assert.equal(n.thang[11].chi, 'Sửu');
  assert.ok(n.thang[11].batDau.getUTCFullYear() === 2028);
  assert.deepEqual(thangTietTai(new Date(Date.UTC(2027, 1, 3, 12))), { nam: 2026, thang: 12 });
  assert.deepEqual(thangTietTai(new Date(Date.UTC(2027, 1, 5, 12))), { nam: 2027, thang: 1 });
  assert.deepEqual(thangTietTai(new Date(Date.UTC(2027, 6, 15))), { nam: 2027, thang: 6 });
  for (let i = 1; i < 12; i++) assert.ok(n.thang[i].batDau > n.thang[i - 1].batDau);
});

test('Tên, hành 9 sao theo câu 卷2 tờ 28b', () => {
  const cau = TRICH_CUU_TINH.tenVaHanh.han;
  for (const s of CUU_TINH) assert.ok(cau.includes(s.han), s.ten);
  assert.deepEqual(CUU_TINH.map((s) => s.hanh), ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Hỏa']);
});

test('Trích dẫn khớp nguyên văn KR3g0051', { skip: !coKanripo }, () => {
  for (const t of Object.values(TRICH_CUU_TINH)) {
    assert.ok(sach(t.quyen).includes(boDau(t.han)), t.han);
    assert.ok(t.phienAm.length > t.han.length / 2);
  }
});

test('Khớp bảng tháng 卷8 (36 ô)', { skip: !coKanripo }, () => {
  const s = sach(8);
  const doan = s.slice(s.indexOf('三元月九星入中宫'), s.indexOf('攷原曰甲子年正月'));
  const sao = [...doan.matchAll(/([一二三四五六七八九])[白黑碧緑黄赤紫]/g)].map((m) => SO_SAO[m[1]]);
  assert.equal(sao.length, 36);
  const namMau = [1984, 1988, 1986]; // Tý, Thìn, Dần
  for (let m = 1; m <= 12; m++) for (let g = 0; g < 3; g++) {
    assert.equal(saoThang(namMau[g], m), sao[(m - 1) * 3 + g], `tháng ${m}, nhóm ${g}`);
  }
});

test('Khớp 年表 卷15–19: vị trí nhất, lục, bát bạch, cửu tử của 50 năm × 3 nguyên', { skip: !coKanripo }, () => {
  // Có năm ghi cung dạng chú thích nhỏ "(艮/)"; không cho khớp vượt sang mục năm sau.
  const o = String.raw`\(?(.)\/?\)?`;
  const nguyen = (ten) => ten + ['一白', '六白', '八白', '九紫'].map((s) => s + o).join('');
  const re = new RegExp(String.raw`太[嵗歲歳](.)(.)幹(?:(?!太[嵗歲歳]..幹)[\s\S])*?三元紫白` + ['上元', '中元', '下元'].map(nguyen).join(''), 'g');
  const da = new Set();
  let dem = 0;
  for (let q = 15; q <= 19; q++) {
    if (!existsSync(tep(q))) continue;
    for (const m of sach(q).matchAll(re)) {
      const i = stt60(m[1], m[2]);
      assert.ok(i >= 0, m[1] + m[2]);
      da.add(i);
      for (let nguyen = 0; nguyen < 3; nguyen++) {
        const nam = 1684 + nguyen * 60 + i;
        const ban = banCuuTinh(saoNam(nam));
        [1, 6, 8, 9].forEach((so, k) => {
          const cung = SO_CUNG[m[3 + nguyen * 4 + k]];
          assert.equal(cungCuaSao(ban, so).soLacThu, cung, `${m[1]}${m[2]} nguyên ${nguyen} sao ${so}`);
          dem++;
        });
      }
    }
  }
  // Kanripo không có 卷14 (年表一, 甲子–癸酉) nên còn 50 năm.
  assert.equal(da.size, 50);
  assert.equal(dem, 600);
});
