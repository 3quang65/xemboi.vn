import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const thuMucGoc = path.resolve(__dirname, '../..');
const thuMucMau = path.join(thuMucGoc, 'data/tuvi/mau');

export const DS_14_CHINH_TINH = [
  'tuVi',
  'thienCo',
  'thaiDuong',
  'vuKhuc',
  'thienDong',
  'liemTrinh',
  'thienPhu',
  'thaiAm',
  'thamLang',
  'cuMon',
  'thienTuong',
  'thienLuong',
  'thatSat',
  'phaQuan'
];

export function kiemHopLe(laSo) {
  assert.ok(laSo && typeof laSo === 'object' && !Array.isArray(laSo), 'Lá số phải là đối tượng');

  // Kiểm cấm thông tin người thật
  function quetCamNguoiThat(obj, duongDan = '') {
    if (!obj || typeof obj !== 'object') return;
    for (const [k, v] of Object.entries(obj)) {
      const duongDanMoi = duongDan ? `${duongDan}.${k}` : k;
      if (['hoTen', 'soDienThoai', 'sdt'].includes(k)) {
        throw new Error(`Phát hiện trường nhạy cảm người thật: ${duongDanMoi}`);
      }
      if (k === 'ten' && !duongDanMoi.startsWith('mongDoi.nguonDoiChieu[')) {
        throw new Error(`Trường ten chỉ được dùng trong nguonDoiChieu: ${duongDanMoi}`);
      }
      if (typeof v === 'object' && v !== null) {
        if (Array.isArray(v)) {
          v.forEach((pt, idx) => quetCamNguoiThat(pt, `${duongDanMoi}[${idx}]`));
        } else {
          quetCamNguoiThat(v, duongDanMoi);
        }
      }
    }
  }
  quetCamNguoiThat(laSo);

  // id
  assert.ok(typeof laSo.id === 'string' && laSo.id.trim().length > 0, 'Thiếu hoặc sai trường id');
  assert.match(laSo.id, /^[a-z0-9-]+$/, 'Trường id phải là chuỗi chữ thường, số hoặc gạch ngang');

  // nhanCa
  assert.ok(Array.isArray(laSo.nhanCa) && laSo.nhanCa.length > 0, 'nhanCa phải là mảng không rỗng');
  for (const n of laSo.nhanCa) {
    assert.ok(typeof n === 'string' && n.trim().length > 0, 'Mỗi nhãn ca phải là chuỗi không rỗng');
  }

  // ngayGioSinhDuong
  const d = laSo.ngayGioSinhDuong;
  assert.ok(d && typeof d === 'object', 'Thiếu hoặc sai trường ngayGioSinhDuong');
  assert.ok(Number.isInteger(d.nam) && d.nam >= 1800 && d.nam <= 2200, 'nam sinh phải là số nguyên từ 1800 đến 2200');
  assert.ok(Number.isInteger(d.thang) && d.thang >= 1 && d.thang <= 12, 'thang sinh phải là số nguyên từ 1 đến 12');
  assert.ok(Number.isInteger(d.ngay) && d.ngay >= 1 && d.ngay <= 31, 'ngay sinh phải là số nguyên từ 1 đến 31');
  assert.ok(Number.isInteger(d.gio) && d.gio >= 0 && d.gio <= 23, 'gio sinh phải là số nguyên từ 0 đến 23');
  assert.ok(Number.isInteger(d.phut) && d.phut >= 0 && d.phut <= 59, 'phut sinh phải là số nguyên từ 0 đến 59');

  // gioiTinh
  assert.ok(['nam', 'nu'].includes(laSo.gioiTinh), 'gioiTinh phải là "nam" hoặc "nu"');

  // muiGio
  assert.ok(typeof laSo.muiGio === 'string', 'muiGio phải là chuỗi');
  assert.match(laSo.muiGio, /^[+-]\d{2}:\d{2}$/, 'muiGio phải theo định dạng ±HH:MM');

  // mongDoi
  const md = laSo.mongDoi;
  assert.ok(md && typeof md === 'object', 'Thiếu hoặc sai trường mongDoi');

  // amLich
  assert.ok(md.amLich && typeof md.amLich === 'object', 'Thiếu mongDoi.amLich');
  assert.ok(Number.isInteger(md.amLich.nam), 'mongDoi.amLich.nam phải là số');
  assert.ok(Number.isInteger(md.amLich.thang) && md.amLich.thang >= 1 && md.amLich.thang <= 12, 'mongDoi.amLich.thang phải từ 1-12');
  assert.ok(Number.isInteger(md.amLich.ngay) && md.amLich.ngay >= 1 && md.amLich.ngay <= 30, 'mongDoi.amLich.ngay phải từ 1-30');
  assert.ok(typeof md.amLich.nhuan === 'boolean', 'mongDoi.amLich.nhuan phải là boolean');

  // canChi
  assert.ok(md.canChi && typeof md.canChi === 'object', 'Thiếu mongDoi.canChi');
  for (const tru of ['nam', 'thang', 'ngay', 'gio']) {
    assert.ok(typeof md.canChi[tru] === 'string' && md.canChi[tru].trim().length > 0, `mongDoi.canChi.${tru} phải là chuỗi không rỗng`);
  }

  // menhThan
  assert.ok(md.menhThan && typeof md.menhThan === 'object', 'Thiếu mongDoi.menhThan');
  assert.ok(typeof md.menhThan.menh === 'string' && md.menhThan.menh.trim().length > 0, 'mongDoi.menhThan.menh phải là chuỗi không rỗng');
  assert.ok(typeof md.menhThan.than === 'string' && md.menhThan.than.trim().length > 0, 'mongDoi.menhThan.than phải là chuỗi không rỗng');

  // cuc
  assert.ok(typeof md.cuc === 'string' && md.cuc.trim().length > 0, 'mongDoi.cuc phải là chuỗi không rỗng');

  // chinhTinh
  assert.ok(md.chinhTinh && typeof md.chinhTinh === 'object', 'Thiếu mongDoi.chinhTinh');
  for (const tinh of DS_14_CHINH_TINH) {
    assert.ok(typeof md.chinhTinh[tinh] === 'string' && md.chinhTinh[tinh].trim().length > 0, `Thiếu chính tinh bắt buộc: ${tinh}`);
  }

  // nguonDoiChieu
  assert.ok(Array.isArray(md.nguonDoiChieu) && md.nguonDoiChieu.length > 0, 'mongDoi.nguonDoiChieu phải là mảng không rỗng');
  for (const [idx, nguon] of md.nguonDoiChieu.entries()) {
    assert.ok(nguon && typeof nguon === 'object', `nguonDoiChieu[${idx}] phải là đối tượng`);
    assert.ok(typeof nguon.ten === 'string' && nguon.ten.trim().length > 0, `nguonDoiChieu[${idx}].ten phải là chuỗi không rỗng`);
    assert.ok(typeof nguon.thamChieu === 'string' && nguon.thamChieu.trim().length > 0, `nguonDoiChieu[${idx}].thamChieu phải là chuỗi không rỗng`);
  }

  return true;
}

test('Thư mục data/tuvi/mau tồn tại và có ≥1 tệp json', () => {
  assert.ok(fs.existsSync(thuMucMau), `Thư mục không tồn tại: ${thuMucMau}`);
  const cacTep = fs.readdirSync(thuMucMau).filter((t) => t.endsWith('.json'));
  assert.ok(cacTep.length >= 1, `Thư mục ${thuMucMau} phải có ít nhất 1 tệp json, hiện có ${cacTep.length}`);
});

test('Tất cả các tệp data/tuvi/mau/*.json đều hợp lệ và không trùng id', () => {
  assert.ok(fs.existsSync(thuMucMau), `Thư mục không tồn tại: ${thuMucMau}`);
  const cacTep = fs.readdirSync(thuMucMau).filter((t) => t.endsWith('.json'));
  const tapId = new Set();

  for (const tep of cacTep) {
    const duongDan = path.join(thuMucMau, tep);
    const noiDung = JSON.parse(fs.readFileSync(duongDan, 'utf8'));
    // Tệp là một lá (đối tượng) hoặc một nhóm lá (mảng đối tượng)
    const cacLa = Array.isArray(noiDung) ? noiDung : [noiDung];
    assert.ok(cacLa.length > 0, `Tệp ${tep} không có lá nào`);
    for (const la of cacLa) {
      kiemHopLe(la);
      if (la.nguon !== undefined) {
        assert.ok(typeof la.nguon === 'string' && la.nguon.trim().length > 0, `nguon rỗng ở lá ${la.id} (${tep})`);
      }
      assert.ok(!tapId.has(la.id), `Trùng lặp id: "${la.id}" trong tệp ${tep}`);
      tapId.add(la.id);
    }
  }
});

test('Bộ kiểm hợp lệ ném lỗi (test đỏ) khi thiếu các trường bắt buộc', () => {
  const tepMau = path.join(thuMucMau, 'vi-du.json');
  assert.ok(fs.existsSync(tepMau), `Tệp mẫu ${tepMau} phải tồn tại để chạy kiểm thử đỏ`);
  const mauChuan = JSON.parse(fs.readFileSync(tepMau, 'utf8'));

  // 1. Thiếu id
  const thieuId = structuredClone(mauChuan);
  delete thieuId.id;
  assert.throws(() => kiemHopLe(thieuId), /id/);

  // 2. Thiếu nhanCa
  const thieuNhanCa = structuredClone(mauChuan);
  delete thieuNhanCa.nhanCa;
  assert.throws(() => kiemHopLe(thieuNhanCa), /nhanCa/);

  // 3. Thiếu ngayGioSinhDuong
  const thieuNgayGio = structuredClone(mauChuan);
  delete thieuNgayGio.ngayGioSinhDuong;
  assert.throws(() => kiemHopLe(thieuNgayGio), /ngayGioSinhDuong/);

  // 4. Thiếu mongDoi.cuc
  const thieuCuc = structuredClone(mauChuan);
  delete thieuCuc.mongDoi.cuc;
  assert.throws(() => kiemHopLe(thieuCuc), /mongDoi\.cuc/);

  // 5. Thiếu 1 chính tinh (thienDong)
  const thieuChinhTinh = structuredClone(mauChuan);
  delete thieuChinhTinh.mongDoi.chinhTinh.thienDong;
  assert.throws(() => kiemHopLe(thieuChinhTinh), /thienDong/);

  // 6. Thiếu nguonDoiChieu
  const thieuNguon = structuredClone(mauChuan);
  delete thieuNguon.mongDoi.nguonDoiChieu;
  assert.throws(() => kiemHopLe(thieuNguon), /nguonDoiChieu/);

  // 7. Cố tình đưa trường người thật
  const coHoTen = structuredClone(mauChuan);
  coHoTen.hoTen = 'Nguyễn Văn A';
  assert.throws(() => kiemHopLe(coHoTen), /hoTen/);
});
