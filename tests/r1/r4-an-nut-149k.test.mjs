import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hienNut149k } from '../../src/lib/r1/metrics.ts';
import { lapLaSo, luuNien } from '../../src/lib/tuvi-v2/index.ts';
import {
  taoNhanDinhMienPhi,
  taoTongQuanKhongGioSinh,
} from '../../src/lib/r1/kho-cau-tinh.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

test('[R4 - 04 mục 3.1] Hàm hienNut149k ẩn nút 149k khi chưa rõ giờ sinh', () => {
  assert.equal(hienNut149k(false), false);
  assert.equal(hienNut149k(true), true);
});

test('[R4] Chế độ chưa rõ giờ sinh: trả Can Chi, Ngũ Hành, tổng quan 2027, giải thích không an 12 cung và anNut149k = true', () => {
  const kq = taoTongQuanKhongGioSinh({
    lich: 'duong',
    ngay: 15,
    thang: 8,
    nam: 1998,
    gioiTinh: 'nu',
  });
  assert.equal(kq.loai, 'chua_ro_gio');
  assert.equal(kq.anNut149k, true);
  assert.equal(kq.canChiNam, 'Mậu Dần');
  assert.equal(kq.banMenh, 'Thành Đầu Thổ');
  assert.equal(kq.hanhMenh, 'Thổ');
  assert.equal(kq.tuoiMu2027, 30);
  assert.ok(kq.tongQuan2027.canCu.startsWith('[Căn cứ:'));
  assert.ok(kq.lyDoKhongAn12Cung.includes('12 cung'));
  assert.ok(!('laSo' in kq), 'Không được trả về lá số 12 cung khi chưa rõ giờ sinh');
});

test('[Có giờ sinh] Trả đủ lá số thật + tối đa 3 nhận định Mệnh–Thân + 1 chủ đề 2027 có nhãn [Căn cứ: ...]', () => {
  const ls = lapLaSo({
    lich: 'duong',
    ngay: 15,
    thang: 8,
    nam: 1998,
    gio: 9,
    phut: 30,
    gioiTinh: 'nu',
  });
  const ln2027 = luuNien(ls, 2027);
  const { nhanDinhMenhThan, chuDe2027 } = taoNhanDinhMienPhi(ls, ln2027);

  assert.ok(nhanDinhMenhThan.length >= 1 && nhanDinhMenhThan.length <= 3);
  for (const item of nhanDinhMenhThan) {
    assert.ok(item.canCu.startsWith('[Căn cứ:'), `Thiếu nhãn căn cứ: ${item.canCu}`);
    assert.ok(item.nguon.length > 0, `Thiếu nguồn sách: ${item.id}`);
  }
  assert.ok(chuDe2027 !== null);
  assert.ok(chuDe2027.canCu.startsWith('[Căn cứ:'));
  assert.ok(chuDe2027.nguon.length > 0);
});

test('[UI Guard] TrangR1Client ràng buộc nút 149k bằng hienNut149k và ẩn khi chưa rõ giờ sinh', () => {
  const src = fs.readFileSync(
    path.join(ROOT, 'src', 'components', 'r1', 'TrangR1Client.tsx'),
    'utf8',
  );
  assert.ok(src.includes('hienNut149k('), 'TrangR1Client phải gọi hienNut149k');
  assert.ok(
    src.includes('{duocHien149k && (') && src.includes('data-testid="btn-mua-149"'),
    'Nút 149k phải được render có điều kiện theo duocHien149k',
  );
  assert.ok(
    src.includes('data-testid="ghi-chu-an-149"'),
    'Phải có ghi chú minh bạch khi ẩn nút 149k',
  );
});
