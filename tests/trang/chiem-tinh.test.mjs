// /chiem-tinh/*: 12 cung hoàng đạo, giờ Mặt Trời vào cung, dữ liệu Tetrabiblos quyển I.
// Chạy: npx tsx --test tests/trang/chiem-tinh.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CUNG_HOANG_DAO, TAM_HOP, TRICH, TRANG_CHIEM_TINH, cungCungTamHop, cungDoi, cungTheoSlug, khoangCungTrongNam, khoangNgayVaoCung,
  mocVaoCung, nhaCuaHanhTinh, sangGioVN, traCung,
} from '../../src/lib/trang/chiem-tinh.ts';
import { lietKeTietKhi } from '../../src/lib/tuvi-v2/tiet-khi.mjs';

const SACH = process.env.GUTENBERG_DIR ?? join(process.cwd(), '..', 'thu-vien-rag', 'gutenberg');
const tep = join(SACH, 'TX01__pg70850.txt');
const chuan = (s) => s.replace(/\[\d+\]/g, '').replace(/_/g, '').replace(/\s+/g, ' ').trim();

test('Giờ vào cung trùng tiết khí chẵn 30° (Xuân phân = Bạch Dương…) trong 2000–2030', () => {
  for (let y = 2000; y <= 2030; y++) {
    const tk = lietKeTietKhi(y);
    const moc = mocVaoCung(y);
    for (let i = 0; i < 12; i++) {
      const t = tk.find((x) => x.kinhDo === i * 30).thoiDiem;
      assert.ok(Math.abs(t - moc[i]) < 2000, `${y} cung ${i}: ${t.toISOString()} vs ${moc[i].toISOString()}`);
    }
  }
});

test('Thứ tự thời gian và khoảng ngày vào cung 1930–2030', () => {
  const m = mocVaoCung(2026).map(sangGioVN);
  assert.equal(m[0].thang, 3); assert.equal(m[9].thang, 12); assert.equal(m[10].thang, 1); assert.equal(m[11].thang, 2);
  const k = khoangNgayVaoCung(0);
  assert.equal(k.som.thang, 3); assert.equal(k.muon.thang, 3);
  assert.ok(k.som.ngay >= 20 && k.muon.ngay <= 21, `${k.som.ngay}–${k.muon.ngay}`);
  const ma = khoangCungTrongNam(9, 2026);
  assert.equal(ma.batDau.nam, 2026); assert.equal(ma.ketThuc.nam, 2027); assert.equal(ma.ketThuc.thang, 1);
  const ngu = khoangCungTrongNam(11, 2026);
  assert.equal(ngu.batDau.thang, 2); assert.equal(ngu.ketThuc.thang, 3); assert.equal(ngu.ketThuc.nam, 2026);
});

test('Tra cung theo ngày sinh, ngày chuyển cung', () => {
  assert.equal(traCung(15, 8, 1990).cung.slug, 'su-tu');
  assert.equal(traCung(1, 1, 2000).cung.slug, 'ma-ket');
  assert.equal(traCung(25, 12, 1995).chuyen, null);
  const g = sangGioVN(mocVaoCung(2026)[0]);
  const r = traCung(g.ngay, g.thang, 2026);
  assert.ok(r.chuyen); assert.equal(r.chuyen.truoc.slug, 'song-ngu'); assert.equal(r.chuyen.sau.slug, 'bach-duong');
  assert.equal(traCung(g.ngay, g.thang, 2026, g.gio, Math.max(0, g.phut - 2)).cung.slug, g.phut >= 2 ? 'song-ngu' : 'bach-duong');
});

test('Dữ liệu đúng các chương Tetrabiblos', () => {
  const s = (slug) => cungTheoSlug(slug);
  assert.deepEqual(CUNG_HOANG_DAO.filter((c) => c.loai === 'chi').map((c) => c.en), ['Cancer', 'Capricorn']);
  assert.deepEqual(CUNG_HOANG_DAO.filter((c) => c.loai === 'phan').map((c) => c.en), ['Aries', 'Libra']);
  assert.deepEqual(CUNG_HOANG_DAO.filter((c) => c.loai === 'co-dinh').map((c) => c.en), ['Taurus', 'Leo', 'Scorpio', 'Aquarius']);
  assert.equal(CUNG_HOANG_DAO.filter((c) => c.duong).length, 6);
  assert.ok(s('bach-duong').duong && !s('kim-nguu').duong && s('thien-binh').duong);
  assert.deepEqual(nhaCuaHanhTinh('Sao Thổ').map((c) => c.en), ['Capricorn', 'Aquarius']);
  assert.deepEqual(nhaCuaHanhTinh('Mặt Trời').map((c) => c.en), ['Leo']);
  assert.deepEqual(cungCungTamHop(s('bach-duong')).map((c) => c.en), ['Aries', 'Leo', 'Sagittarius']);
  assert.deepEqual(cungCungTamHop(s('cu-giai')).map((c) => c.en), ['Cancer', 'Scorpio', 'Pisces']);
  assert.equal(TAM_HOP[2].chuNgay, 'Sao Thổ');
  const vuong = Object.fromEntries(CUNG_HOANG_DAO.filter((c) => c.vuong).map((c) => [c.vuong, c.en]));
  assert.deepEqual(vuong, { 'Mặt Trời': 'Aries', 'Mặt Trăng': 'Taurus', 'Sao Mộc': 'Cancer', 'Sao Thủy': 'Virgo', 'Sao Thổ': 'Libra', 'Sao Hỏa': 'Capricorn', 'Sao Kim': 'Pisces' });
  // Hãm (fall) luôn ở cung đối với vượng.
  for (const c of CUNG_HOANG_DAO.filter((x) => x.vuong)) assert.equal(cungDoi(c).ham, c.vuong);
  assert.equal(new Set(CUNG_HOANG_DAO.map((c) => c.slug)).size, 12);
  assert.equal(TRANG_CHIEM_TINH.length, 14);
});

test('Trích dẫn khớp nguyên văn Ashmand (bỏ qua khi máy không có kho Gutenberg)', { skip: !existsSync(tep) }, () => {
  const sach = chuan(readFileSync(tep, 'utf8'));
  for (const [k, t] of Object.entries(TRICH)) assert.ok(sach.includes(chuan(t.en)), k);
  // Mọi cung có trích chủ nhà nhắc đúng tên cung.
  for (const c of CUNG_HOANG_DAO) assert.ok(c.trichNha.en.includes(c.en), c.en);
});
