// Đợt 3: tìm lai RAG (src/lib/rag/tim-lai.ts) và chỉ số đánh giá (src/lib/rag/danh-gia.ts).
// Phần CSDL chỉ đọc kho rag_doan của máy trạm. Chạy: npx tsx --env-file=.env --test tests/dot3/rag-tim-lai.test.mjs
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient, Prisma } from '@prisma/client';
import { chuanCau, moRongThuatNgu, tuKhoaViet, gopRrf, timTuKhoa } from '../../src/lib/rag/tim-lai.ts';
import { chiSoCau, tongHop, docCsv } from '../../src/lib/rag/danh-gia.ts';

const BANG = [
  { han: '天梁', hanViet: 'thiên lương', bienThe: [], mang: 'tu-vi' },
  { han: '天', hanViet: 'thiên', bienThe: [], mang: 'chung' },
  { han: '午', hanViet: 'ngọ', bienThe: [], mang: 'chung' },
  { han: '申', hanViet: 'thân', bienThe: [], mang: 'chung' },
  { han: '身', hanViet: 'thân', bienThe: [], mang: 'tu-vi' },
  { han: '身弱', hanViet: 'thân nhược', bienThe: [], mang: 'bat-tu' },
  { han: '謙', hanViet: 'khiêm', bienThe: ['địa sơn khiêm'], mang: 'kinh-dich' },
  { han: '革', hanViet: 'cách', bienThe: [], mang: 'kinh-dich' },
  { han: '水', hanViet: 'thủy', bienThe: [], mang: 'chung' },
  { han: '風水', hanViet: 'phong thủy', bienThe: [], mang: 'phong-thuy' },
];

test('chuanCau: chữ thường, bỏ dấu câu, dấu kiểu cũ → mới', () => {
  assert.equal(chuanCau('  Phong Thuỷ, HOÀ hợp?? '), 'phong thủy hòa hợp');
  assert.equal(chuanCau('天梁「午」'), '天梁 午');
});

test('moRongThuatNgu: khớp dài trước, một cụm nhiều chữ Hán, hào, ngữ cảnh quẻ', () => {
  assert.deepEqual(moRongThuatNgu('Thiên Lương ở Ngọ nghĩa là gì', BANG).han, ['天梁', '午']);
  assert.deepEqual(moRongThuatNgu('Thân nhược thì sao', BANG).han, ['身弱']);
  assert.deepEqual(moRongThuatNgu('Mệnh thân ở Thân', BANG).han.sort(), ['申', '身'].sort());
  assert.deepEqual(moRongThuatNgu('Phong thủy nhà ở', BANG).han, ['風水']);
  assert.deepEqual(moRongThuatNgu('Quẻ Khiêm hào 3 nói gì', BANG).han, ['九三', '六三', '謙']);
  assert.deepEqual(moRongThuatNgu('hào thượng quẻ Cách', BANG).han, ['上九', '上六', '革']);
  assert.deepEqual(moRongThuatNgu('Tính cách người khiêm tốn', BANG).han, [], 'không có ngữ cảnh Kinh Dịch thì bỏ quẻ một âm');
  assert.deepEqual(moRongThuatNgu('Địa Sơn Khiêm là gì', BANG).han, ['謙'], 'tên quẻ đầy đủ không cần ngữ cảnh');
  assert.equal(moRongThuatNgu('Thiên Lương ở Ngọ', BANG).conLai, 'ở');
});

test('tuKhoaViet: cặp âm tiết, bỏ hư từ', () => {
  assert.deepEqual(tuKhoaViet('quẻ khiêm nói gì về người quân tử'), ['quẻ khiêm', 'quân tử']);
  assert.deepEqual(tuKhoaViet('là gì'), []);
});

test('gopRrf: cộng 1/(60+hạng), giữ hạng từng nhánh', () => {
  const g = gopRrf([{ ten: 'a', ketQua: [{ id: 1n }, { id: 2n }] }, { ten: 'b', ketQua: [{ id: 2n }, { id: 3n }] }]);
  assert.deepEqual(g.map((x) => x.id), [2n, 1n, 3n]);
  assert.deepEqual(g[0].hang, { a: 2, b: 1 });
  assert.ok(Math.abs(g[0].diem - (1 / 62 + 1 / 61)) < 1e-12);
});

test('chiSoCau và tongHop', () => {
  const a = chiSoCau([5n, 7n, 9n], [9n, 100n], 'WS01', ['WS01']);
  assert.deepEqual(a, { hang: 3, recall10: 0.5, trung10: true, dungNguonTop1: true });
  const b = chiSoCau([1n], [2n], 'KR1', ['WS01']);
  assert.deepEqual(tongHop([a, b]), { soCau: 2, recallAt10: 0.25, hitAt10: 0.5, mrr: 0.1667, tyLeDungNguon: 0.5 });
});

test('docCsv: ngoặc kép, dấu phẩy và xuống dòng trong ô, BOM', () => {
  const r = docCsv('﻿ma,ghi_chu\r\nQ1,"a, ""b""\nc"\r\nQ2,x\n');
  assert.deepEqual(r, [{ ma: 'Q1', ghi_chu: 'a, "b"\nc' }, { ma: 'Q2', ghi_chu: 'x' }]);
});

const db = new PrismaClient();
after(() => db.$disconnect());

test('timTuKhoa: mọi kết quả chứa từ khóa, điểm giảm dần, theo phạm vi', async () => {
  const r = await timTuKhoa(db, { tuKhoa: ['天梁', '午'], phamVi: Prisma.sql`d."phamVi" = 'CONG_KHAI'::"PhamVi"`, k: 20 });
  if (!r.length) return; // CSDL chưa có kho RAG
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].diem >= r[i].diem);
  const vb = await db.$queryRaw`SELECT id, "vanBanChuan" AS v, "phamVi"::text AS p FROM rag_doan WHERE id = ANY(${r.map((x) => x.id)}::bigint[])`;
  for (const x of vb) { assert.ok(x.v.includes('天梁') || x.v.includes('午')); assert.equal(x.p, 'CONG_KHAI'); }
  assert.ok(vb.find((x) => x.id === r[0].id).v.includes('天梁'), 'đoạn đầu có thuật ngữ hiếm hơn');
  assert.deepEqual(await timTuKhoa(db, { tuKhoa: [], phamVi: Prisma.sql`TRUE` }), []);
});
