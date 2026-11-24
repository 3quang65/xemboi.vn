// Phong tục ngày lễ (Phan Kế Bính, Việt Nam phong tục 1915). Chạy: ./node_modules/.bin/tsx --test tests/trang/phong-tuc-ngay-le.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GHI_CHU_PHONG_TUC, NGUON_PHONG_TUC, PHONG_TUC_NGAY_LE, PHONG_TUC_TIET_KHI, phongTucLe,
} from '../../src/lib/trang/phong-tuc-ngay-le.ts';
import { LE_AM_NAM, TIET_KHI_24 } from '../../src/lib/trang/lich-mua.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

const SLUG_LE = new Set(LE_AM_NAM.map((l) => l.slug));
const SLUG_TIET = new Set(TIET_KHI_24.map((t) => t.slug));
const TAT_CA = [
  ...Object.entries(PHONG_TUC_NGAY_LE),
  ...Object.entries(PHONG_TUC_TIET_KHI),
];

test('nguồn và ghi chú', () => {
  assert.equal(NGUON_PHONG_TUC.nam, 1915);
  assert.equal(NGUON_PHONG_TUC.tacGia, 'Phan Kế Bính');
  assert.match(NGUON_PHONG_TUC.url, /^https:\/\/vi\.wikisource\.org\//);
  assert.ok(GHI_CHU_PHONG_TUC.includes('1915'));
  assert.equal(coChuHan(GHI_CHU_PHONG_TUC), false);
});

test('mọi khóa là slug lễ có thật', () => {
  for (const k of Object.keys(PHONG_TUC_NGAY_LE)) assert.ok(SLUG_LE.has(k), `không có lễ ${k}`);
  for (const k of Object.keys(PHONG_TUC_TIET_KHI)) assert.ok(SLUG_TIET.has(k), `không có tiết ${k}`);
  // Các lễ chính sách có tả
  for (const k of ['tet-nguyen-dan', 'tet-han-thuc', 'tet-doan-ngo', 'ram-thang-7', 'trung-thu', 'ong-cong-ong-tao', 'giao-thua']) {
    assert.ok(phongTucLe(k), `thiếu ${k}`);
  }
  // Sách không nói tới thì không có khóa
  for (const k of ['via-than-tai', 'gio-to-hung-vuong', 'phat-dan']) assert.equal(phongTucLe(k), undefined);
});

test('mỗi lễ có 1–5 trích, tóm tắt và trích không có chữ Hán', () => {
  for (const [k, v] of TAT_CA) {
    assert.ok(v.trich.length >= 1 && v.trich.length <= 5, `${k}: ${v.trich.length} trích`);
    assert.ok(v.tomTat.length > 20, `${k}: thiếu tóm tắt`);
    assert.equal(coChuHan(v.tomTat), false, `${k}: tóm tắt có chữ Hán`);
    for (const t of v.trich) {
      assert.equal(coChuHan(t.van), false, `${k}: có chữ Hán trong "${t.van.slice(0, 40)}"`);
      assert.equal(/​/.test(t.van), false, `${k}: còn ký tự rỗng`);
      assert.ok(t.van.trim().length > 0);
      assert.match(t.viTriViet, /^Thiên I{1,3}, mục [IVXL]+ · /);
    }
  }
});

test('doanId là số hoặc null; null thì có url Wikisource', () => {
  for (const [k, v] of TAT_CA) {
    for (const t of v.trich) {
      if (t.doanId === null) {
        assert.match(t.url ?? '', /^https:\/\/vi\.wikisource\.org\/wiki\/Việt_Nam_phong_tục\//, `${k}: thiếu url`);
      } else {
        assert.equal(typeof t.doanId, 'number');
        assert.ok(Number.isInteger(t.doanId) && t.doanId > 0);
      }
    }
  }
});

test('liên quan là đường dẫn nội bộ', () => {
  for (const [k, v] of TAT_CA) {
    for (const p of v.lienQuan ?? []) {
      assert.match(p, /^\/[a-z0-9/-]+$/, `${k}: ${p}`);
      const m = p.match(/^\/lich-am\/ngay-le\/(.+)$/);
      if (m) assert.ok(SLUG_LE.has(m[1]), `${k}: ${p}`);
      const t = p.match(/^\/tiet-khi\/(.+)$/);
      if (t) assert.ok(SLUG_TIET.has(t[1]), `${k}: ${p}`);
    }
  }
});
