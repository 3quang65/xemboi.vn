// Bản đồ sao: đối chiếu kinh độ hoàng đạo với JPL Horizons (DE441), kiểm cung mọc bằng phép quay sang hệ chân trời,
// múi giờ Việt Nam theo IANA, và lời trích Tetrabiblos với bản Gutenberg.
// Chạy: npx tsx --test tests/trang/ban-do-sao.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as A from 'astronomy-engine';
import {
  DS_TINH, LECH_CHON, THIEN_THE, TRICH_GOC, TRICH_THIEN_THE, gocChieu, kinhDoThienThe, lapBanDo, mucGioMacDinh, ngayHopLe,
  nhanLech, phamVi, tinhTheoMa, vietViTri,
} from '../../src/lib/trang/ban-do-sao.ts';
import { cungTheoThu } from '../../src/lib/trang/chiem-tinh.ts';

const JPL = JSON.parse(readFileSync(join(import.meta.dirname, 'doi-chieu', 'jpl-horizons-kinh-do.json'), 'utf8'));
const lech = (a, b) => ((a - b + 540) % 360) - 180;

test('Kinh độ 10 thiên thể khớp JPL Horizons dưới 1 phút cung (6 mốc 1901–2026)', () => {
  for (const tt of THIEN_THE) {
    const ds = JPL.kinhDo[tt.en];
    assert.equal(ds.length, JPL.moc.length, tt.en);
    JPL.moc.forEach((m, i) => {
      const d = Math.abs(lech(kinhDoThienThe(tt.body, new Date(m)), ds[i])) * 3600;
      assert.ok(d < 60, `${tt.en} ${m}: lệch ${d.toFixed(1)}″`);
    });
  }
});

const huong = (lon, luc, t) => {
  const at = A.MakeTime(luc);
  const obs = new A.Observer(t.viDo, t.kinhDo, 0);
  const v = A.VectorFromSphere(new A.Spherical(0, lon, 1), at);
  const eqd = A.RotateVector(A.Rotation_ECT_EQD(at), v);
  return A.HorizonFromVector(A.RotateVector(A.Rotation_EQD_HOR(at, obs), eqd), '');
};

test('Cung mọc nằm trên chân trời phía Đông, thiên đỉnh trên kinh tuyến (kiểm bằng phép quay độc lập)', () => {
  for (const [ma, iso] of [['ha-noi', '1990-07-04T05:30:00Z'], ['tp-ho-chi-minh', '1975-01-01T00:00:00Z'], ['ha-giang', '2026-11-23T14:10:00Z'], ['ca-mau', '1950-06-15T20:45:00Z'], ['da-nang', '2001-03-21T23:59:00Z']]) {
    const t = tinhTheoMa(ma);
    const luc = new Date(iso);
    const { asc, mc } = gocChieu(luc, t.viDo, t.kinhDo);
    const a = huong(asc, luc, t);
    assert.ok(Math.abs(a.lat) < 0.01, `${ma}: độ cao điểm mọc ${a.lat}`);
    assert.ok(a.lon > 0 && a.lon < 180, `${ma}: phương vị điểm mọc ${a.lon}`);
    const m = huong(mc, luc, t);
    assert.ok(Math.abs(lech(m.lon, 180)) < 0.01 || Math.abs(lech(m.lon, 0)) < 0.01, `${ma}: MC phương vị ${m.lon}`);
    assert.ok(m.lat > 0, `${ma}: MC phải ở trên chân trời`);
  }
});

test('Câu GHI_CHU_NOI_SINH: dời 50 km Đông Tây làm điểm mọc xê dịch 0,4°–0,7° ở vĩ độ Việt Nam', () => {
  let min = 99, max = 0;
  for (const ma of ['ha-giang', 'ha-noi', 'da-nang', 'ca-mau']) {
    const t = tinhTheoMa(ma);
    const dLon = 50 / (111.32 * Math.cos((t.viDo * Math.PI) / 180));
    for (let h = 0; h < 24 * 4; h++) {
      const luc = new Date(Date.UTC(2026, 0, 1) + h * 15 * 60_000);
      const d = Math.abs(lech(gocChieu(luc, t.viDo, t.kinhDo + dLon).asc, gocChieu(luc, t.viDo, t.kinhDo).asc));
      min = Math.min(min, d); max = Math.max(max, d);
    }
  }
  assert.ok(min > 0.4 && max < 0.7, `${min} – ${max}`);
});

test('Múi giờ Việt Nam theo IANA, tách hai miền 1960–1975', () => {
  const hn = tinhTheoMa('ha-noi'), sg = tinhTheoMa('tp-ho-chi-minh'), hue = tinhTheoMa('thua-thien-hue'), qt = tinhTheoMa('quang-tri');
  assert.equal(mucGioMacDinh(1990, 7, 4, 12, 0, hn.viDo).lechGiay, 25200);
  assert.equal(mucGioMacDinh(1968, 1, 31, 3, 0, sg.viDo).lechGiay, 28800);
  assert.equal(mucGioMacDinh(1968, 1, 31, 3, 0, hn.viDo).lechGiay, 25200);
  assert.equal(mucGioMacDinh(1968, 1, 31, 3, 0, hue.viDo).lechGiay, 28800); // Huế phía nam vĩ tuyến 17
  assert.ok(qt.viDo < 17); // Đông Hà 16,8°: phía nam vĩ tuyến
  assert.equal(mucGioMacDinh(1945, 5, 1, 8, 0, hn.viDo).lechGiay, 32400);
  assert.equal(mucGioMacDinh(1944, 5, 1, 8, 0, hn.viDo).lechGiay, 28800);
  const k = mucGioMacDinh(1950, 1, 1, 8, 0, hn.viDo);
  assert.equal(k.lechGiay, 28800); assert.equal(k.chacChan, false);
  assert.equal(mucGioMacDinh(1905, 1, 1, 8, 0, hn.viDo).lechGiay, 25590);
  assert.equal(mucGioMacDinh(1975, 6, 13, 1, 0, sg.viDo).lechGiay, 25200); // đã về +7 từ 0:00 ngày 13/6/1975 (giờ +8)
  assert.equal(mucGioMacDinh(1975, 6, 12, 23, 0, sg.viDo).lechGiay, 28800);
  assert.equal(nhanLech(25590), 'UTC+7:06:30');
  assert.equal(nhanLech(28800), 'UTC+8');
  assert.ok(LECH_CHON.includes(25200));
  // Miền Nam khớp ICU của Node ở mọi mốc thử 1901–2030.
  const f = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Ho_Chi_Minh', timeZoneName: 'longOffset' });
  const icu = (ms) => {
    const s = f.formatToParts(new Date(ms)).find((p) => p.type === 'timeZoneName').value.slice(3);
    const [h, m, x] = s.slice(1).split(':').map(Number);
    return (s[0] === '-' ? -1 : 1) * (h * 3600 + (m || 0) * 60 + (x || 0));
  };
  for (let y = 1901; y <= 2030; y++) for (const mo of [1, 4, 7, 10]) {
    const g = mucGioMacDinh(y, mo, 15, 12, 0, 10.8);
    assert.equal(g.lechGiay, icu(Date.UTC(y, mo - 1, 15, 12) - g.lechGiay * 1000), `${y}-${mo}`);
  }
});

test('Lập bản đồ: Hà Nội 4/7/1990 12:00, có giờ và không giờ, chọn lại múi giờ', () => {
  const b = lapBanDo({ nam: 1990, thang: 7, ngay: 4, gio: 12, phut: 0, noiSinh: tinhTheoMa('ha-noi') });
  assert.equal(b.luc.toISOString(), '1990-07-04T05:00:00.000Z');
  assert.equal(b.thienThe.length, 10);
  const mt = b.thienThe[0];
  assert.equal(mt.cung.ten, cungTheoThu(3).ten); // Mặt Trời ~102°: Cự Giải
  assert.equal(b.nha.length, 12);
  assert.equal(b.nha[0].cung.thu, b.asc.cung.thu);
  for (const t of b.thienThe) assert.equal(t.nha, ((t.cung.thu - b.asc.cung.thu + 12) % 12) + 1);
  assert.ok(!b.thienThe[0].nghich && !b.thienThe[1].nghich);
  assert.match(vietViTri(mt), /^\d+°\d\d′ /);
  const k = lapBanDo({ nam: 1990, thang: 7, ngay: 4, noiSinh: tinhTheoMa('ha-noi') });
  assert.equal(k.asc, null); assert.equal(k.nha, null);
  assert.ok(k.thienThe[1].trongNgay);
  assert.ok(k.thienThe.every((t) => t.nha === null));
  const c = lapBanDo({ nam: 1968, thang: 1, ngay: 31, gio: 3, phut: 0, noiSinh: tinhTheoMa('ha-noi'), lechGiay: 28800 });
  assert.equal(c.luc.toISOString(), '1968-01-30T19:00:00.000Z');
  assert.equal(c.mucGio.lechGiay, 25200);
});

test('Nghịch hành: Sao Thủy nghịch 7/3/2026, thuận 15/4/2026', () => {
  const ve = (n, t, d) => lapBanDo({ nam: n, thang: t, ngay: d, gio: 12, phut: 0, noiSinh: tinhTheoMa('ha-noi') });
  assert.equal(ve(2026, 3, 7).thienThe[2].nghich, true);
  assert.equal(ve(2026, 4, 15).thienThe[2].nghich, false);
});

test('Phẩm vị theo ch. XX, XXII', () => {
  assert.equal(phamVi('Sao Hỏa', cungTheoThu(0)), 'nha');
  assert.equal(phamVi('Mặt Trời', cungTheoThu(0)), 'vuong');
  assert.equal(phamVi('Sao Thổ', cungTheoThu(0)), 'ham');
  assert.equal(phamVi('Sao Mộc', cungTheoThu(0)), null);
});

test('Ngày hợp lệ, 63 tỉnh', () => {
  assert.ok(ngayHopLe(2000, 2, 29)); assert.ok(!ngayHopLe(1900, 2, 29)); assert.ok(!ngayHopLe(1899, 12, 31)); assert.ok(!ngayHopLe(2026, 13, 1));
  assert.throws(() => lapBanDo({ nam: 2026, thang: 2, ngay: 30, noiSinh: tinhTheoMa('ha-noi') }), RangeError);
  assert.equal(DS_TINH.length, 63);
  assert.equal(new Set(DS_TINH.map((t) => t.ma)).size, 63);
  for (const t of DS_TINH) {
    assert.ok(t.viDo > 8.5 && t.viDo < 23.4 && t.kinhDo > 102 && t.kinhDo < 110, t.tinh);
    assert.doesNotMatch(t.noiLay + t.tinh, /Ð|City|Thành Phố/, t.tinh);
  }
});

const SACH = process.env.GUTENBERG_DIR ?? join(process.cwd(), '..', 'thu-vien-rag', 'gutenberg');
const tep = join(SACH, 'TX01__pg70850.txt');
const chuan = (s) => s.replace(/\[\d+\]/g, '').replace(/_/g, '').replace(/\s+/g, ' ').trim();

test('Trích Tetrabiblos ch. IV, XIII khớp nguyên văn Ashmand (bỏ qua khi máy không có kho Gutenberg)', { skip: !existsSync(tep) }, () => {
  const sach = chuan(readFileSync(tep, 'utf8'));
  for (const [k, t] of [...Object.entries(TRICH_THIEN_THE), ...Object.entries(TRICH_GOC)]) assert.ok(sach.includes(chuan(t.en)), k);
  assert.equal(Object.keys(TRICH_THIEN_THE).length, 7);
});
