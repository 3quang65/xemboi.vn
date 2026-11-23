// Âm Hán Việt cho kinh văn Chu Dịch 64 quẻ (chu-dich-64-phien-am.json), gióng từng chữ với chu-dich-64.json.
// Chạy: ./node_modules/.bin/tsx --test tests/trang/chu-dich-64-phien-am.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import DICH from '../../src/lib/trang/du-lieu/chu-dich-64.json' with { type: 'json' };
import PA from '../../src/lib/trang/du-lieu/chu-dich-64-phien-am.json' with { type: 'json' };
import { QUE_64 } from '../../src/lib/trang/kinh-dich.ts';

const NHAN = { 初: 'sơ', 九: 'cửu', 六: 'lục', 二: 'nhị', 三: 'tam', 四: 'tứ', 五: 'ngũ', 上: 'thượng', 用: 'dụng' };
const docNhan = (s) => [...s].map((c) => NHAN[c]).join(' ');

// Âm tiết tiếng Việt: phụ âm đầu + vần (1–3 nguyên âm + phụ âm cuối), tối đa một dấu thanh.
const DAU_THANH = /[̣̀́̃̉]/gu;
const KHUNG = /^(ngh|ng|gh|gi|kh|ph|th|tr|ch|nh|qu|[bcdđghklmnpqrstvx])?[aăâeêioôơuưy]{1,3}(ch|ng|nh|[cmnpt])?$/u;
function hopLe(am) {
  if (am !== am.normalize('NFC') || am !== am.toLowerCase()) return false;
  const tach = am.normalize('NFD');
  if ((tach.match(DAU_THANH) || []).length > 1) return false;
  return KHUNG.test(tach.replace(DAU_THANH, '').normalize('NFC'));
}

/** Mọi cặp (Hán, âm) của một quẻ, có khóa vị trí giống quyetDinh.viTri. */
function capChu(goc, pa) {
  const ra = [{ khoa: `${goc.so} quẻ từ`, han: goc.queTu, am: pa.queTu }];
  goc.hao.forEach((h, i) => ra.push({ khoa: `${goc.so} ${docNhan(h.viTri)}`, han: h.van, am: pa.hao[i].van }));
  if (goc.dung) ra.push({ khoa: `${goc.so} ${docNhan(goc.dung.viTri)}`, han: goc.dung.van, am: pa.dung.van });
  return ra;
}
const TAT_CA = DICH.que.flatMap((q, i) => capChu(q, PA.que[i]));

test('nguồn DS05, Apache-2.0', () => {
  assert.equal(PA.nguon.ma, 'DS05');
  assert.equal(PA.nguon.ten, 'KasaiDanto/vietnamese_nom_scripts');
  assert.equal(PA.nguon.giayPhep, 'Apache-2.0');
  assert.equal(PA.nguon.url, 'https://huggingface.co/datasets/KasaiDanto/vietnamese_nom_scripts');
  assert.ok(PA.nguon.ghiChu.length > 50);
});

test('64 quẻ gióng với chu-dich-64.json theo so', () => {
  assert.equal(PA.que.length, 64);
  PA.que.forEach((q, i) => {
    const goc = DICH.que[i];
    assert.equal(q.so, goc.so);
    assert.equal(q.hao.length, goc.hao.length, `số hào quẻ ${q.so}`);
    assert.equal(q.dung === null, goc.dung === null, `dụng quẻ ${q.so}`);
  });
});

test('số âm tiết bằng số chữ Hán ở mọi câu; mỗi âm tiết hợp lệ, cách nhau đúng một dấu cách', () => {
  for (const { khoa, han, am } of TAT_CA) {
    assert.equal(am, am.trim(), khoa);
    assert.ok(!/\s{2}|[^\S ]/u.test(am), `khoảng trắng lạ: ${khoa}`);
    const amTiet = am.split(' ');
    assert.equal(amTiet.length, [...han].length, `${khoa}: ${han} / ${am}`);
    for (const a of amTiet) assert.ok(hopLe(a), `âm tiết lạ "${a}" ở ${khoa}`);
  }
});

test('nhãn hào đọc đúng theo chữ Hán', () => {
  PA.que.forEach((q, i) => {
    const goc = DICH.que[i];
    q.hao.forEach((h, j) => assert.equal(h.viTri, docNhan(goc.hao[j].viTri), `quẻ ${q.so} hào ${j + 1}`));
    if (q.dung) assert.equal(q.dung.viTri, docNhan(goc.dung.viTri));
  });
  assert.equal(PA.que[0].hao[0].viTri, 'sơ cửu');
  assert.equal(PA.que[1].hao[1].viTri, 'lục nhị');
  assert.equal(PA.que[1].hao[5].viTri, 'thượng lục');
  assert.equal(PA.que[0].dung.viTri, 'dụng cửu');
  assert.equal(PA.que[1].dung.viTri, 'dụng lục');
});

test('câu mẫu', () => {
  assert.equal(PA.que[0].queTu, 'nguyên hanh lợi trinh');
  assert.equal(PA.que[0].hao[0].van, 'tiềm long vật dụng');
  assert.equal(PA.que[0].hao[1].van, 'hiện long tại điền lợi kiến đại nhân');
  assert.equal(PA.que[0].hao[2].van, 'quân tử chung nhật kiền kiền tịch dịch nhược lệ vô cữu');
  assert.equal(PA.que[0].dung.van, 'hiện quần long vô thủ cát');
  assert.ok(PA.que[3].hao[0].van.split(' ').includes('thoát'), '4 sơ lục: 用說桎梏');
  assert.ok(PA.que[11].queTu.startsWith('bĩ '), '12 quẻ từ');
  assert.equal(PA.que[1].queTu.split(' ').at(-5), 'táng', '東北喪朋');
  assert.equal(PA.que[20].hao[3].van.split(' ')[1], 'can', '噬乾胏');
});

test('tên quẻ trong kinh văn đọc khớp QUE_64.tenNgan (trừ 乾乾 kiền kiền, 觀 động từ quan)', () => {
  const NGOAI_LE = { 1: 'kiền', 20: 'quan' };
  for (const goc of DICH.que) {
    const ten = [...goc.ten];
    const mong = NGOAI_LE[goc.so] ?? QUE_64[goc.so - 1].tenNgan.toLowerCase();
    for (const { khoa, han, am } of capChu(goc, PA.que[goc.so - 1])) {
      const chu = [...han];
      const amTiet = am.split(' ');
      for (let k = 0; k + ten.length <= chu.length; k++) {
        if (chu.slice(k, k + ten.length).join('') !== goc.ten) continue;
        assert.equal(amTiet.slice(k, k + ten.length).join(' '), mong, `${khoa}: ${goc.ten}`);
      }
    }
  }
  assert.ok(PA.que[9].queTu.startsWith('lý '));
  assert.ok(PA.que[12].queTu.startsWith('đồng nhân '));
});

test('quyetDinh: đủ trường, âm hợp lệ, ngữ cảnh khớp đúng chỗ', () => {
  const LOAI = new Set(['sua-bang', 'bo-sung', 'da-am', 'ngu-canh']);
  assert.ok(PA.quyetDinh.length > 0);
  const theoKhoa = new Map(TAT_CA.map((x) => [x.khoa, x]));
  const nguCanh = new Set();
  for (const q of PA.quyetDinh) {
    assert.match(q.chu, /^\p{Script=Han}$/u);
    assert.ok(hopLe(q.am), `âm lạ ${q.am}`);
    assert.ok(q.lyDo && q.viTri, q.chu);
    assert.equal(typeof q.chacChan, 'boolean');
    assert.ok(LOAI.has(q.loai), q.loai);
    if (q.loai !== 'ngu-canh') continue;
    const cau = theoKhoa.get(q.viTri);
    assert.ok(cau, `không có vị trí ${q.viTri}`);
    const chu = [...cau.han];
    const amTiet = cau.am.split(' ');
    assert.ok(chu.some((c, k) => c === q.chu && amTiet[k] === q.am), `${q.viTri}: ${q.chu} ≠ ${q.am}`);
    nguCanh.add(`${q.viTri}|${q.chu}`);
  }
  // Chữ sửa bảng / nhập tay: mọi chỗ (trừ chỗ có quyết định ngữ cảnh) đọc đúng âm đã ghi.
  for (const q of PA.quyetDinh.filter((x) => x.loai === 'sua-bang' || x.loai === 'bo-sung' || x.loai === 'da-am')) {
    for (const { khoa, han, am } of TAT_CA) {
      if (nguCanh.has(`${khoa}|${q.chu}`)) continue;
      const amTiet = am.split(' ');
      [...han].forEach((c, k) => { if (c === q.chu) assert.equal(amTiet[k], q.am, `${khoa}: ${c}`); });
    }
  }
});

test('một chữ một âm trừ chữ có quyết định ngữ cảnh', () => {
  const nguCanhChu = new Set(PA.quyetDinh.filter((x) => x.loai === 'ngu-canh').map((x) => x.chu));
  const am = new Map();
  for (const { han, am: s } of TAT_CA) {
    const amTiet = s.split(' ');
    [...han].forEach((c, k) => {
      if (nguCanhChu.has(c)) return;
      if (!am.has(c)) am.set(c, amTiet[k]);
      assert.equal(amTiet[k], am.get(c), `chữ ${c}`);
    });
  }
});
