// AI soạn bản nháp (docs/v2/17 mục 2.3): mô hình giả, CSDL thật. Dữ liệu [THỬ] tạo rồi xóa (nhật ký chỉ-thêm giữ lại, gắn nhãn [THỬ]).
// Chạy: npx tsx --test tests/dot2/ai-soan.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { aiSoanNhap, docKetQua } from '../../src/lib/noi-dung/ai-soan.ts';

const db = new PrismaClient();
let nd, nguonId, doanCk, doanNb, noiDungId;
const goiGia = (traVe) => async (_viec, tin) => {
  goiGia.lan = tin;
  return { ok: true, vanBan: typeof traVe === 'function' ? traVe() : traVe, moHinh: 'cx/gpt-6-sol', ms: 5, tokenVao: 100, tokenRa: 50 };
};

before(async () => {
  const tk = await db.taiKhoan.findUnique({ where: { email: 'bt@xemboi.test' }, select: { id: true, email: true, hoTen: true, vaiTro: true, mangDuyet: true } });
  assert.ok(tk, 'cần tài khoản thử bt@xemboi.test');
  nd = tk;
  const [n] = await db.$queryRaw`INSERT INTO rag_nguon (ma, "tenGoc", "loaiNguon", "phapLy", "chiNoiBo", "xinPhep", "phamVi", "capNhatLuc")
    VALUES ('THU_AISOAN', '[THỬ] nguồn', 'sach_co', 'A'::"PhapLy", false, 'CHUA_XIN'::"TrangThaiXinPhep", 'CONG_KHAI'::"PhamVi", now()) RETURNING id`;
  nguonId = n.id;
  const [a] = await db.$queryRaw`INSERT INTO rag_doan ("nguonId", "duongDan", "thuTu", loai, "vanBan", "bamNoiDung", "phamVi", "capNhatLuc")
    VALUES (${nguonId}, ARRAY['thu'], 1, 'chinh_van', '紫微屬土，為帝星', md5('thu-aisoan-1'), 'CONG_KHAI'::"PhamVi", now()) RETURNING id`;
  doanCk = String(a.id);
  const [n2] = await db.$queryRaw`INSERT INTO rag_nguon (ma, "tenGoc", "loaiNguon", "phapLy", "chiNoiBo", "xinPhep", "phamVi", "capNhatLuc")
    VALUES ('THU_AISOAN_NB', '[THỬ] nội bộ', 'noi_bo_xemboi', 'C'::"PhapLy", true, 'CHUA_XIN'::"TrangThaiXinPhep", 'NOI_BO'::"PhamVi", now()) RETURNING id`;
  const [b] = await db.$queryRaw`INSERT INTO rag_doan ("nguonId", "duongDan", "thuTu", loai, "vanBan", "bamNoiDung", "phamVi", "capNhatLuc")
    VALUES (${n2.id}, ARRAY['thu'], 1, 'chinh_van', 'BI MAT NOI BO', md5('thu-aisoan-2'), 'NOI_BO'::"PhamVi", now()) RETURNING id`;
  doanNb = String(b.id);
  noiDungId = (await db.noiDung.create({ data: { loai: 'MUC_TU_DIEN', tieuDe: '[THỬ] Sao Tử Vi', mang: ['A'], trangThai: 'NHAP', bienTapId: nd.id } })).id;
});

after(async () => {
  try {
    if (noiDungId) await db.noiDung.delete({ where: { id: noiDungId } }).catch(() => {});
    await db.$executeRaw`DELETE FROM rag_nguon WHERE ma IN ('THU_AISOAN', 'THU_AISOAN_NB')`;
  } finally { await db.$disconnect(); }
});

test('docKetQua chịu rào ```json và bỏ khối rỗng', () => {
  const r = docKetQua('MUC_TU_DIEN', '```json\n{"khoi":{"k1":"Tử Vi","k2":"","k9":"x"}}\n```');
  assert.deepEqual(r, { khoi: { k1: 'Tử Vi', k9: 'x' } });
  assert.equal(docKetQua('BAI', 'không phải json'), null);
  assert.deepEqual(docKetQua('BAI', 'Đây: {"than":"# Bài"} hết'), { than: '# Bài' });
});

test('soạn đạt: tạo phiên bản AI, trích dẫn, việc XONG; đoạn nội bộ không lọt vào lời nhắc', async () => {
  const traVe = () => JSON.stringify({ khoi: { k1: 'Tử Vi [D:' + doanCk + ']', k2: 'Đế tinh. [D:' + doanCk + ']', k3: 'Thuộc Thổ, là đế tinh. [D:' + doanCk + ']' } });
  const kq = await aiSoanNhap(db, nd, { noiDungId, maDoan: [doanCk, doanNb], yeuCau: 'viết ngắn' }, goiGia(traVe));
  assert.equal(kq.ok, true, kq.loi);
  assert.equal(kq.datTrichDan, true);
  assert.deepEqual(kq.biLoai, [doanNb]);
  const loiNhac = goiGia.lan.map((t) => t.content).join('\n');
  assert.ok(!loiNhac.includes('BI MAT NOI BO'), 'đoạn nội bộ không được gửi đi');
  assert.ok(loiNhac.includes(`[D:${doanCk}]`));
  const pb = await db.noiDungPhienBan.findUnique({ where: { id: kq.phienBanId }, include: { trichDan: true } });
  assert.equal(pb.nguonTao, 'AI');
  assert.equal(pb.trichDan.length, 3);
  assert.equal(pb.trichDan[0].nguonId, nguonId);
  const nd1 = await db.noiDung.findUnique({ where: { id: noiDungId } });
  assert.equal(nd1.trangThai, 'AI_SOAN');
  const viec = await db.aiSoanViec.findUnique({ where: { id: kq.viecId } });
  assert.equal(viec.trangThai, 'XONG');
  assert.equal(viec.tokenVao, 100);
  assert.deepEqual(viec.doanDaGui.map(String), [doanCk]);
  assert.equal(await db.nhatKyThaoTac.count({ where: { hanhDong: 'nd.ai_soan', doiTuongId: noiDungId } }), 1);
});

test('mã đoạn bịa: vẫn lưu nháp nhưng việc KHONG_DAT_TRICH_DAN', async () => {
  const traVe = JSON.stringify({ khoi: { k1: 'x [D:999999999]', k3: 'Câu không mã.' } });
  const kq = await aiSoanNhap(db, nd, { noiDungId, maDoan: [doanCk] }, goiGia(traVe));
  assert.equal(kq.ok, true);
  assert.equal(kq.datTrichDan, false);
  assert.equal(kq.so, 2);
  assert.equal((await db.aiSoanViec.findUnique({ where: { id: kq.viecId } })).trangThai, 'KHONG_DAT_TRICH_DAN');
});

test('mô hình trả sai khuôn → việc LOI, không tạo phiên bản', async () => {
  const kq = await aiSoanNhap(db, nd, { noiDungId, maDoan: [doanCk] }, goiGia('xin lỗi, tôi không thể'));
  assert.equal(kq.ok, false);
  assert.equal((await db.aiSoanViec.findUnique({ where: { id: kq.viecId } })).trangThai, 'LOI');
  assert.equal(await db.noiDungPhienBan.count({ where: { noiDungId } }), 2);
});

test('chỉ đoạn nội bộ → từ chối, không gọi mô hình; trạng thái chờ duyệt → từ chối', async () => {
  let goi = 0;
  const r1 = await aiSoanNhap(db, nd, { noiDungId, maDoan: [doanNb] }, async () => { goi++; return { ok: false, loi: '', ms: 0 }; });
  assert.equal(r1.ok, false);
  assert.equal(goi, 0);
  await db.noiDung.update({ where: { id: noiDungId }, data: { trangThai: 'CHO_CHUYEN_GIA' } });
  const r2 = await aiSoanNhap(db, nd, { noiDungId, maDoan: [doanCk] }, async () => { goi++; return { ok: false, loi: '', ms: 0 }; });
  assert.equal(r2.ok, false);
  assert.match(r2.loi, /CHO_CHUYEN_GIA/);
  assert.equal(goi, 0);
});
