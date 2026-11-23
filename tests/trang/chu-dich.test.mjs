// /kinh-dich/que/* và /kinh-dich/bat-quai/*: ghép nguyên văn, quẻ hỗ/đảo/đối, trích Thuyết quái đúng nguyên văn.
// Chạy: npx tsx --test tests/trang/chu-dich.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BAT_QUAI_CHI_TIET, KHAC_BAN, bang64, queChiTiet, queCoQuai, queDao, queDoi, quaiTheoSlug,
} from '../../src/lib/trang/chu-dich.ts';
import { QUE_64 } from '../../src/lib/trang/kinh-dich.ts';

const KANRIPO = process.env.KANRIPO_DIR ?? join(process.cwd(), '..', 'thu-vien-rag', 'kanripo');
const TEP_THUYET_QUAI = join(KANRIPO, 'KR1a0001', 'KR1a0001_067.txt');

test('Đủ 64 quẻ, ký hiệu Unicode đúng thứ tự Văn Vương, quẻ trước/sau', () => {
  const b = bang64();
  assert.equal(b.length, 64);
  b.forEach((x, i) => assert.equal(x.kyHieu, String.fromCodePoint(0x4dc0 + i)));
  const can = queChiTiet(QUE_64[0].slug);
  assert.equal(can.han.queTu, '元亨利貞');
  assert.equal(can.truoc, null);
  assert.equal(can.sau.so, 2);
  assert.equal(queChiTiet('khong-co'), null);
});

test('Quẻ đảo và quẻ đối: làm hai lần ra chính nó; ví dụ Truân ↔ Mông, Càn ↔ Khôn', () => {
  for (const q of QUE_64) {
    assert.equal(queDao(queDao(q.hao).hao).so, q.so);
    assert.equal(queDoi(queDoi(q.hao).hao).so, q.so);
  }
  assert.equal(queDao(QUE_64[2].hao).tenNgan, 'Mông');
  assert.equal(queDoi(QUE_64[0].hao).tenNgan, 'Khôn');
  assert.equal(QUE_64.filter((q) => queDao(q.hao).so === q.so).length, 8);
  assert.equal(queChiTiet(QUE_64[0].slug).ho.tenNgan, 'Càn');
});

test('Ghi chú khác bản gắn đúng quẻ', () => {
  for (const k of KHAC_BAN) {
    const ct = queChiTiet(QUE_64[k.so - 1].slug);
    const van = k.viTri === 'quẻ từ' ? ct.han.queTu : ct.han.hao.find((h) => h.viTri === '六五').van;
    assert.ok(van.includes(k.banGoc), `${k.so}`);
  }
});

test('8 quái: slug duy nhất, ký hiệu ☰…☷, mỗi quái nằm trong 15 quẻ', () => {
  assert.equal(new Set(BAT_QUAI_CHI_TIET.map((q) => q.slug)).size, 8);
  assert.deepEqual(BAT_QUAI_CHI_TIET.map((q) => q.kyHieu).join(''), '☰☱☲☳☴☵☶☷');
  for (const q of BAT_QUAI_CHI_TIET) {
    const { tren, duoi } = queCoQuai(q.ten);
    assert.equal(tren.length, 8);
    assert.equal(duoi.length, 8);
    assert.ok(q.thuyetQuai.tinh.startsWith(q.han) && q.tuongHan.startsWith(q.han) && q.tuong.length > 0);
  }
  assert.equal(quaiTheoSlug('can-son').ten, 'Cấn');
  assert.equal(quaiTheoSlug('can-thien').ten, 'Càn');
});

test('Câu Thuyết quái trích đúng nguyên văn KR1a0001 (bỏ qua khi máy không có kho Kanripo)', { skip: !existsSync(TEP_THUYET_QUAI) }, () => {
  const van = readFileSync(TEP_THUYET_QUAI, 'utf8').replace(/<pb:[^>]*>/g, '').replace(/[¶\s，。、：；《》]/g, '');
  for (const q of BAT_QUAI_CHI_TIET) {
    const cau = [q.tuongHan, ...Object.values(q.thuyetQuai).filter(Boolean)];
    for (const c of cau) {
      // 巽為木為風: hai vế nằm liền trong sách.
      assert.ok(van.includes(c), `${q.ten}: ${c}`);
    }
    // Phương sách ghi chỉ có khi có câu phương chỉ hướng (không tính Đoài 正秋).
    assert.equal(q.phuongSachGhi === null, q.thuyetQuai.phuong === null || q.thuyetQuai.phuong === '兌正秋也');
  }
});

test('Mọi câu Thuyết quái có phiên âm; tên vị trí hào; danh sách trang quẻ quái', async () => {
  const { PHIEN_AM_THUYET_QUAI, tenViTriHao, TRANG_KINH_DICH, daDungKinhDich } = await import('../../src/lib/trang/chu-dich.ts');
  for (const q of BAT_QUAI_CHI_TIET) {
    for (const c of [q.tuongHan, ...Object.values(q.thuyetQuai).filter(Boolean)]) assert.ok(PHIEN_AM_THUYET_QUAI[c], c);
  }
  assert.equal(Object.keys(PHIEN_AM_THUYET_QUAI).length, 47);
  assert.equal(tenViTriHao('初九'), 'Sơ Cửu');
  assert.equal(tenViTriHao('上六'), 'Thượng Lục');
  assert.equal(TRANG_KINH_DICH.length, 72);
  assert.ok(daDungKinhDich().has('/kinh-dich/que/01-thuan-can') && daDungKinhDich().has('/kinh-dich/64-que'));
});

test('Trang quẻ có phiên âm, cùng số hào với nguyên văn', () => {
  for (const { que } of bang64()) {
    const ct = queChiTiet(que.slug);
    assert.ok(ct.phienAm, que.slug);
    assert.equal(ct.phienAm.hao.length, ct.han.hao.length);
    assert.equal(Boolean(ct.phienAm.dung), Boolean(ct.han.dung));
  }
  assert.equal(queChiTiet('01-thuan-can').phienAm.queTu, 'nguyên hanh lợi trinh');
});
