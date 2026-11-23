// Quy tắc 24/11/2026: frontend chỉ hiện tiếng Việt, không chữ Hán. Test này giữ phía dữ liệu:
// mọi trường được phép hiển thị (dich, viTriViet, tenBaiViet, ghiChuViet, tên nguồn, tên nghi kỵ/thần sát) không có chữ Hán.
// Phía giao diện kiểm bằng scripts/kiem-chu-han.mjs (bò trang dev).
// Chạy: npx tsx --test tests/trang/khong-chu-han.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { LunarUtil } from 'lunar-javascript';
import { BAT_QUAI_CHI_TIET, DICH_THUYET_QUAI, KHAC_BAN, NGUON_DICH, queChiTiet } from '../../src/lib/trang/chu-dich.ts';
import { QUE_64 } from '../../src/lib/trang/kinh-dich.ts';
import { TRICH_BAT_TU } from '../../src/lib/trang/bat-tu-truc-quan.ts';
import { DU_NIEN_8, NGUON_HIEP_KY, TRICH } from '../../src/lib/trang/phong-thuy.ts';
import { TRICH_CUU_TINH } from '../../src/lib/trang/cuu-tinh.ts';
import { BAI_CA_HUONG } from '../../src/lib/trang/xuat-hanh.ts';
import { TRICH_DOAN } from '../../src/lib/trang/xem-ngay.ts';
import { TEN_NGHI_KY, TEN_THAN_SAT } from '../../src/lib/trang/xem-ngay-thuat-ngu.ts';
import NAP_AM from '../../src/lib/tuvi-v2/data/nap-am.json' with { type: 'json' };

const HAN = /[㐀-鿿豈-﫿《》]/;
const viet = (s, ten) => {
  assert.equal(typeof s, 'string', `${ten}: thiếu`);
  assert.ok(s.trim().length > 0, `${ten}: rỗng`);
  assert.ok(!HAN.test(s), `${ten}: có chữ Hán: ${s}`);
};

test('Kinh Dịch: 64 quẻ đều có lời quẻ, 6 lời hào dịch tiếng Việt; dụng có ở Càn, Khôn', () => {
  for (const q of QUE_64) {
    const ct = queChiTiet(q.slug);
    viet(ct.dich.queTu, `quẻ ${q.so} lời quẻ`);
    assert.equal(ct.dich.hao.length, 6, `quẻ ${q.so}`);
    ct.dich.hao.forEach((h, i) => viet(h, `quẻ ${q.so} hào ${i + 1}`));
    assert.equal(ct.dich.dung !== null, ct.han.dung !== null, `quẻ ${q.so} dụng`);
    if (ct.dich.dung) viet(ct.dich.dung, `quẻ ${q.so} dụng`);
    viet(NGUON_DICH[ct.dich.nguon].nhan, `quẻ ${q.so} nguồn`);
  }
  // Bản Ngô Tất Tố chỉ có 9 quẻ trên Wikisource.
  assert.deepEqual(QUE_64.filter((q) => queChiTiet(q.slug).dich.nguon === 'ngo-tat-to').map((q) => q.so), [1, 2, 3, 4, 5, 6, 7, 31, 32]);
});

test('Kinh Dịch: mọi câu Thuyết quái của 8 quái có bản dịch; ghi chú khác bản bằng tiếng Việt', () => {
  for (const q of BAT_QUAI_CHI_TIET) {
    for (const cau of [q.tuongHan, ...Object.values(q.thuyetQuai)].filter(Boolean)) viet(DICH_THUYET_QUAI[cau], `${q.ten}: ${cau}`);
  }
  for (const k of KHAC_BAN) viet(k.ghiChuViet, `khác bản quẻ ${k.so}`);
});

test('Trích sách bát tự, phong thủy, cửu tinh, xuất hành, xem ngày: đều có dịch nghĩa và vị trí tiếng Việt', () => {
  for (const [ma, t] of Object.entries(TRICH_BAT_TU)) { viet(t.dich, `bát tự ${ma}`); viet(t.viTriViet, `bát tự ${ma} vị trí`); }
  for (const [ma, t] of Object.entries(TRICH)) viet(t.dich, `phong thủy ${ma}`);
  for (const d of DU_NIEN_8) { viet(d.ten, d.ten); viet(d.sao, d.ten); viet(d.trich.dich, `du niên ${d.ten}`); }
  for (const [ma, t] of Object.entries(TRICH_CUU_TINH)) viet(t.dich, `cửu tinh ${ma}`);
  for (const b of BAI_CA_HUONG) { viet(b.dich, `xuất hành ${b.tenBaiViet}`); viet(b.tenBaiViet, 'tên bài'); viet(b.viTriViet, 'vị trí'); }
  const doan = Object.entries(TRICH_DOAN).flatMap(([ma, v]) => (Array.isArray(v) ? v.map((x, i) => [`${ma}[${i}]`, x]) : [[ma, v]]));
  for (const [ma, t] of doan) { viet(t.dich, `xem ngày ${ma}`); viet(t.viTriViet, `xem ngày ${ma} vị trí`); }
  viet(NGUON_HIEP_KY.ten, 'tên Hiệp kỷ');
});

test('Xem ngày: mọi tên nghi kỵ, thần sát của lunar-javascript đều có tên tiếng Việt', () => {
  const thieu = LunarUtil.YI_JI.filter((h) => h !== '无' && !TEN_NGHI_KY[h]);
  assert.deepEqual(thieu, [], 'nghi kỵ chưa dịch');
  const thieuTs = LunarUtil.SHEN_SHA.filter((h) => h && h !== '无' && !TEN_THAN_SAT[h]);
  assert.deepEqual(thieuTs, [], 'thần sát chưa dịch');
  for (const [h, v] of [...Object.entries(TEN_NGHI_KY), ...Object.entries(TEN_THAN_SAT)]) viet(v, h);
});

test('Nguồn bảng nạp âm ghi bằng tiếng Việt', () => {
  for (const n of NAP_AM.nguon) viet(n, 'nguồn nạp âm');
});

test('boChuHan: bỏ chữ Hán và dọn ngoặc, dấu thừa', async () => {
  const { boChuHan, coChuHan } = await import('../../src/lib/trang/chu-viet.ts');
  assert.equal(boChuHan('陳摶 Trần Đoàn (thác danh); 潘希尹 Phan Hy Doãn bổ tập'), 'Trần Đoàn (thác danh); Phan Hy Doãn bổ tập');
  assert.equal(boChuHan('Lộ Bàng Thổ (路旁土)'), 'Lộ Bàng Thổ');
  assert.equal(boChuHan('《三命通会》 (Tam Mệnh Thông Hội, 1578)'), '(Tam Mệnh Thông Hội, 1578)');
  assert.equal(boChuHan('許真人'), '');
  assert.equal(coChuHan('Giáp'), false);
  assert.equal(coChuHan('甲'), true);
});

test('Chiêm tinh: mọi đoạn Tetrabiblos có bản dịch tiếng Việt', async () => {
  const { TRICH: TRICH_CT, NGUON_TETRABIBLOS } = await import('../../src/lib/trang/chiem-tinh.ts');
  const { TRICH_THIEN_THE, TRICH_GOC, GHI_CHU_NHA } = await import('../../src/lib/trang/ban-do-sao.ts');
  const ds = [...Object.entries(TRICH_CT), ...Object.entries(TRICH_THIEN_THE), ...Object.entries(TRICH_GOC)];
  assert.equal(ds.length, 31);
  for (const [ma, t] of ds) {
    viet(t.vi, `Tetrabiblos ${ma}`);
    assert.ok(!/\b(the|and|of|is)\b/.test(t.vi), `${ma}: còn chữ Anh`);
  }
  assert.ok(!/\(whole sign\)/.test(GHI_CHU_NHA));
  assert.ok(NGUON_TETRABIBLOS.ghiChuTrich.includes('dịch nghĩa'));
});
