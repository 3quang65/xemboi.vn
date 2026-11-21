// Nghiệm thu Đợt 2 phần lõi (docs/v2/17 mục 8, Đợt 2): hàm thuần, không cần CSDL.
// Chạy: npx tsx --test tests/dot2/noi-dung-thuan.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kiemDuKhoi } from '../../src/lib/noi-dung/khoi.ts';
import { kiemTrichDan, chuoiChungDaiNhat } from '../../src/lib/noi-dung/trich-dan.ts';
import { kiemChuyen, trangThaiSauKhiLuu, phaiNoindex } from '../../src/lib/noi-dung/quy-trinh.ts';
import { chamOnpage } from '../../src/lib/noi-dung/onpage.ts';

const DOAN = [
  { id: '101', vanBan: '天機星屬木，為益算之星，主善。化氣為善，乃南斗第三星。', duocTrichDai: false },
  { id: '102', vanBan: '天機入命，主人聰明機巧，善謀略。', duocTrichDai: false },
];
const KHOI_DU = {
  k1: 'Thiên Cơ (天機)', k2: 'Sao thứ ba của Nam Đẩu. Chủ về mưu trí.',
  k3: 'Sách cổ xếp Thiên Cơ thuộc hành Mộc [D:101].\n\nThiên Cơ ở Mệnh chủ người thông minh [D:102].',
  k4: 'Các phái không khác nhau đáng kể.', k5KhongApDung: true, k6: 'Chưa có nghiên cứu kiểm chứng.',
  k7: 'Thái Âm, Thiên Lương', k8: 'Tử Vi Đẩu Số Toàn Thư', k9: 'Duyệt: … · giới hạn: nội dung chỉ mang tính tham khảo.',
};

test('mục từ điển thiếu khối 3 không gửi duyệt được', () => {
  const { k3, ...thieu } = KHOI_DU;
  const loi = kiemDuKhoi(thieu);
  assert.ok(loi.some((l) => l.khoi === 'k3' && l.muc === 'CHAN'));
  assert.equal(kiemDuKhoi(KHOI_DU).length, 0, 'đủ 9 khối (k5 không áp dụng) thì không lỗi');
  const r = kiemChuyen('BIEN_TAP', 'CHO_CHUYEN_GIA', ctx({ phienBan: { id: 'p1', nguonTao: 'TAY', soLoiChan: loi.length } }));
  assert.equal(r.duoc, false);
});

test('nháp AI có mã đoạn bịa bị gắn cờ', () => {
  const r = kiemTrichDan({ khoi: { ...KHOI_DU, k3: 'Thiên Cơ hành Mộc [D:101] [D:999999].' }, doanDaGui: DOAN });
  assert.equal(r.dat, false);
  assert.ok(r.loi.some((l) => l.ma === 'MA_DOAN_BIA' && l.thongBao.includes('999999')));
  assert.ok(kiemTrichDan({ khoi: KHOI_DU, doanDaGui: DOAN }).dat, 'nháp đúng thì đạt');
});

test('khối 3 có đoạn không nguồn bị chặn; trích nguyên văn dài bị chặn khi nguồn không cho', () => {
  const r1 = kiemTrichDan({ khoi: { ...KHOI_DU, k3: 'Ý có nguồn [D:101].\n\nÝ không có nguồn.' }, doanDaGui: DOAN });
  assert.ok(r1.loi.some((l) => l.ma === 'K3_THIEU_NGUON'));
  const dai = DOAN[0].vanBan;
  const r2 = kiemTrichDan({ khoi: { ...KHOI_DU, k3: `「${dai}」 [D:101]` }, doanDaGui: DOAN, nguongNguyenVan: 20 });
  assert.ok(r2.loi.some((l) => l.ma === 'TRICH_DAI'));
  const r3 = kiemTrichDan({ khoi: { ...KHOI_DU, k3: `「${dai}」 [D:101]` }, doanDaGui: [{ ...DOAN[0], duocTrichDai: true }, DOAN[1]], nguongNguyenVan: 20 });
  assert.ok(!r3.loi.some((l) => l.ma === 'TRICH_DAI'), 'nguồn cho trích dài thì không chặn');
  assert.equal(chuoiChungDaiNhat('abcXYZdef', 'zzXYZdefq'), 6);
});

function ctx(sua = {}) {
  return { nguoiId: 'bt', coQuyen: () => true, phienBan: { id: 'p2', nguonTao: 'TAY', soLoiChan: 0 }, chuyenGiaId: 'cg', canDuyetPhapLy: false, duyet: [], ...sua };
}

test('sửa sau khi duyệt thì quay lại chờ duyệt, và không xuất bản được phiên bản chưa duyệt', () => {
  assert.equal(trangThaiSauKhiLuu('DA_DUYET', 'TAY'), 'CHO_CHUYEN_GIA');
  assert.equal(trangThaiSauKhiLuu('DA_XUAT_BAN', 'TAY'), 'CHO_CHUYEN_GIA');
  // p1 được duyệt, sau đó lưu p2: xuất bản p2 bị chặn.
  const duyet = [{ phienBanId: 'p1', vaiTro: 'CHUYEN_GIA', ketLuan: 'DONG_Y', nguoiDuyetId: 'cg' }];
  const r = kiemChuyen('DA_DUYET', 'DA_XUAT_BAN', ctx({ duyet }));
  assert.equal(r.duoc, false);
  assert.match(r.lyDo, /duyệt lại|chưa được chuyên gia duyệt/);
  assert.equal(kiemChuyen('DA_DUYET', 'DA_XUAT_BAN', ctx({ duyet: [{ ...duyet[0], phienBanId: 'p2' }] })).duoc, true);
});

test('AI chỉ viết nháp; chỉ chuyên gia được giao mới duyệt; mảng rủi ro cần duyệt pháp lý', () => {
  const duyetP2 = [{ phienBanId: 'p2', vaiTro: 'CHUYEN_GIA', ketLuan: 'DONG_Y', nguoiDuyetId: 'cg' }];
  assert.equal(kiemChuyen('DA_DUYET', 'DA_XUAT_BAN', ctx({ phienBan: { id: 'p2', nguonTao: 'AI', soLoiChan: 0 }, duyet: duyetP2 })).duoc, false);
  assert.equal(kiemChuyen('AI_SOAN', 'BIEN_TAP', ctx({ aiDatTrichDan: false })).duoc, false);
  assert.equal(kiemChuyen('CHO_CHUYEN_GIA', 'DA_DUYET', ctx({ nguoiId: 'nguoi-khac', duyet: duyetP2 })).duoc, false);
  assert.equal(kiemChuyen('CHO_CHUYEN_GIA', 'DA_DUYET', ctx({ nguoiId: 'cg', duyet: duyetP2 })).duoc, true);
  assert.equal(kiemChuyen('DA_DUYET', 'DA_XUAT_BAN', ctx({ canDuyetPhapLy: true, duyet: duyetP2 })).duoc, false);
  assert.equal(kiemChuyen('NHAP', 'DA_XUAT_BAN', ctx()).duoc, false, 'không nhảy cóc');
});

test('trang chưa có người duyệt tự noindex', () => {
  assert.equal(phaiNoindex('p2', []), true);
  assert.equal(phaiNoindex(null, []), true);
  assert.equal(phaiNoindex('p2', [{ phienBanId: 'p2', vaiTro: 'CHUYEN_GIA', ketLuan: 'DONG_Y', nguoiDuyetId: 'cg' }]), false);
  const o = chamOnpage({ loai: 'MUC_TU_DIEN', duongDan: '/tu-dien/thien-co', khoi: KHOI_DU, soTrichHopLe: 2, coChuyenGiaDuyet: false, tuCam: [] });
  assert.equal(o.chanIndex, true);
});

test('onpage: từ cấm và hứa hẹn ở title bị chặn; trang tốt đạt điểm cao', () => {
  const tuCam = [{ cum: 'giải hạn', nhom: 'LE_VAT_PHAM', xuLy: 'CHAN_CUNG', thayBang: null, phamVi: [] }];
  const xau = chamOnpage({ loai: 'BAI', duongDan: '/bai/x', title: 'Giải hạn chính xác 100% cho tuổi Tý năm 2027 tại nhà', meta: 'x', h1: 'X', than: 'abc', soTrichHopLe: 0, coChuyenGiaDuyet: true, tuCam });
  assert.ok(xau.chan);
  for (const ma of ['T6_TU_CAM', 'T17_HUA_HEN', 'T9_NGUON']) assert.ok(xau.loi.some((l) => l.ma === ma), ma);
  const tot = chamOnpage({
    loai: 'MUC_TU_DIEN', duongDan: '/tu-dien/thien-co', tuKhoaChinh: 'Thiên Cơ',
    title: 'Sao Thiên Cơ là gì: ý nghĩa theo sách cổ và các phái', meta: 'Sao Thiên Cơ trong Tử Vi: sách cổ nói gì, các phái khác nhau ở đâu, nguồn trích dẫn và giới hạn khi đọc.',
    h1: 'Sao Thiên Cơ', khoi: KHOI_DU, soTrichHopLe: 2, coChuyenGiaDuyet: true, tuCam,
    jsonLd: JSON.stringify({ '@context': 'https://schema.org', '@type': 'DefinedTerm', name: 'Thiên Cơ' }),
  });
  assert.equal(tot.chan, false, JSON.stringify(tot.loi));
  assert.ok(tot.diem >= 85, `điểm ${tot.diem}: ${JSON.stringify(tot.loi)}`);
});
