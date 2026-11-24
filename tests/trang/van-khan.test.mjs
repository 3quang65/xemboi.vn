// Văn khấn theo Gia lễ giản yếu (Dương Bá Trạc 1932). Chạy: ./node_modules/.bin/tsx --test tests/trang/van-khan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GHI_CHU_VAN_KHAN, MAU_VAN_KHAN, NGHI_THUC, NGUON_GIA_LE, TRUONG_DIEN, dienMau, mauTheoMa, soChoCham,
} from '../../src/lib/trang/van-khan.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

test('đủ 5 mẫu, đúng mã, có nguồn', () => {
  assert.deepEqual(MAU_VAN_KHAN.map((m) => m.ma), [
    'tang-ong-ba-cha-me', 'tang-chu-bac-anh-chi', 'ngay-gio', 'ngay-tiet-le', 'than-trong-nha',
  ]);
  assert.equal(NGUON_GIA_LE.tacGia, 'Dương Bá Trạc');
  assert.equal(NGUON_GIA_LE.nam, 1932);
  for (const m of MAU_VAN_KHAN) {
    assert.match(m.url, /^https:\/\/vi\.wikisource\.org\/wiki\/Gia_lễ_giản_yếu\//);
    assert.ok(m.van.startsWith('Ngày'), m.ma);
    assert.ok(m.van.includes('hương hoa dầu rượu kính cáo'), m.ma);
  }
});

test('số chỗ dấu chấm khớp danh sách trường; chú thích có neo', () => {
  for (const m of MAU_VAN_KHAN) {
    assert.equal(soChoCham(m.van), m.truong.length, m.ma);
    if (m.vanTheoChuThich) assert.equal(soChoCham(m.vanTheoChuThich), m.truongTheoChuThich.length, m.ma);
    assert.equal((m.chuThich ?? []).length, (m.neoChuThich ?? []).length, m.ma);
    for (const neo of m.neoChuThich ?? []) assert.ok(m.van.includes(neo) || m.ten.includes(neo), `${m.ma}: ${neo}`);
    for (const c of m.chenSau ?? []) assert.ok(m.van.includes(c.neo), m.ma);
    assert.ok(new RegExp(`(^|\\s)${m.xungHoGoc} tên`).test(m.van), m.ma);
    for (const t of m.truong) if (t) assert.ok(t in TRUONG_DIEN);
  }
});

test('nguyên văn: câu then chốt và chú thích 100 ngày', () => {
  assert.ok(mauTheoMa('ngay-gio').van.includes('đời nay ăn quả, người trước giồng cây'));
  assert.ok(mauTheoMa('tang-ong-ba-cha-me').chuThich.some((c) => c.includes('Lễ trăm ngày thì nói nhân vì ngày nay đến trăm ngày')));
  assert.ok(mauTheoMa('tang-ong-ba-cha-me').chuThich.some((c) => c.includes('Lễ nhập quan')));
  assert.ok(mauTheoMa('ngay-tiet-le').vanTheoChuThich.includes('tiết lệ nhớ ngày'));
  assert.ok(!mauTheoMa('ngay-tiet-le').vanTheoChuThich.includes('kỵ-nhật'));
  assert.ok(NGHI_THUC.some((d) => d.van.includes('hôm chính dỗ làm lễ sớm')));
  assert.ok(NGHI_THUC.some((d) => d.van.includes('lậy bốn lạy nghênh thần')));
  // Lỗi gõ đã sửa không còn
  const tatCa = JSON.stringify({ MAU_VAN_KHAN, NGHI_THUC });
  for (const sai of ['lốn lạy', 'bốn ạy', 'là ố thúc', 'Rằng;', 'cúng thi ', '{{', '<ref']) assert.ok(!tatCa.includes(sai), sai);
});

test('không có chữ Hán ở mọi trường hiển thị', () => {
  const chuoi = [GHI_CHU_VAN_KHAN, ...Object.values(NGUON_GIA_LE).map(String), ...Object.values(TRUONG_DIEN)];
  for (const m of MAU_VAN_KHAN) chuoi.push(m.ten, m.van, m.vanTheoChuThich ?? '', ...(m.chuThich ?? []), ...(m.neoChuThich ?? []));
  for (const d of NGHI_THUC) chuoi.push(d.chuDe, d.viTri, d.van, ...(d.chuThich ?? []));
  for (const s of chuoi) assert.equal(coChuHan(s), false, s);
});

test('dienMau: thay đúng trường, giữ nguyên chỗ không nhập', () => {
  const v = dienMau('ngay-gio', {
    ngay: 'mồng 5', thang: 'ba', nam: 'Bính Ngọ', xungHo: 'tự tử', ten: 'Nguyễn Văn An',
    danhXung: 'hiển khảo tên Nguyễn Văn Bình', nhanVi: 'nay là ngày dỗ nên cáo lễ vậy',
  });
  assert.ok(v.startsWith(
    'Ngày mồng 5 tháng ba năm Bính Ngọ tự tử tên Nguyễn Văn An cùng cả nhà lớn nhỏ cúi dâng hương hoa dầu rượu kính cáo trước thần-vị hiển khảo tên Nguyễn Văn Bình rằng: nhân vì nay là ngày dỗ nên cáo lễ vậy\n\n',
  ), v);
  assert.equal(soChoCham(v), 0);
  assert.ok(v.endsWith('Kính cáo'));

  // Không nhập gì: giữ nguyên văn
  for (const m of MAU_VAN_KHAN) assert.equal(dienMau(m.ma, {}), m.van);
  // Nhập một phần, khoảng trắng coi như không nhập
  const p = dienMau('tang-ong-ba-cha-me', { ten: 'Lê Văn C', vangLoi: '  ' });
  assert.ok(p.startsWith('Ngày... tháng.... năm... tôi tên Lê Văn C vâng lời... cùng'), p);

  // vâng lời ở mẫu tang
  assert.ok(dienMau('tang-ong-ba-cha-me', { vangLoi: 'mẹ' }).includes('vâng lời mẹ cùng cả nhà'));

  // Tiết lệ: "Trộm nghĩ……" không phải chỗ điền; bản đầy đủ theo chú thích
  const tl = dienMau('ngay-tiet-le', { ngay: 'mồng một', thang: 'Giêng', ten: 'Trần D', nhanVi: 'gặp tiết nguyên đán nên cáo lễ vậy', xungHo: 'hậu-tự' });
  assert.ok(tl.endsWith('Trộm nghĩ........'), tl);
  const tlDu = dienMau('ngay-tiet-le', { ngay: 'mồng một', ten: 'Trần D' }, { dayDu: true });
  assert.ok(tlDu.startsWith('Ngày mồng một tháng...... năm hậu-tự tên Trần D cùng'), tlDu);
  assert.ok(tlDu.includes('tiết lệ nhớ ngày') && tlDu.endsWith('Kính cáo'));
  // dayDu với mẫu không có bản đầy đủ thì dùng nguyên văn
  assert.equal(dienMau('ngay-gio', {}, { dayDu: true }), mauTheoMa('ngay-gio').van);

  // Thần trong nhà: chèn sau "Rằng: nhân vì", thay "tín-chủ"
  const th = dienMau('than-trong-nha', { xungHo: 'gia chủ', danhXung: 'Thổ công', nhanVi: 'gặp tiết thanh minh nên cáo lễ vậy' });
  assert.ok(th.includes('năm.... gia chủ tên.... cùng'), th);
  assert.ok(th.includes('trước thần vị Thổ công\n\nRằng: nhân vì gặp tiết thanh minh nên cáo lễ vậy\n\n'), th);

  assert.throws(() => dienMau('khong-co', {}));
});
