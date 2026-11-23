// Bát tự trực quan (Lệnh 40): quan hệ giữa các trụ, câu Đọc nhanh, nghĩa ngắn thuật ngữ.
// Bảng quan hệ được rút lại TỪ NGUYÊN VĂN sách (tests/trang/doi-chieu/quan-he-can-chi-nguon.json) rồi so với bảng trong mã.
// Chạy: npx tsx --test tests/trang/bat-tu-truc-quan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DIA_CHI, THIEN_CAN } from '../../src/lib/tuvi-v2/am-lich.ts';
import { THAP_THAN, lapLaSoBatTu } from '../../src/lib/trang/bat-tu.ts';
import {
  CAN_HOP, GIAI_NGHIA_BAT_TU, HINH, LUC_HAI, LUC_HOP, NGUON_BAT_TU, TAM_HOI, TAM_HOP, TEN_LOAI_QUAN_HE, TRICH_BAT_TU, TU_HINH,
  docNhanh, muaTheoChiThang, quanHeTru,
} from '../../src/lib/trang/bat-tu-truc-quan.ts';

const NGUON = JSON.parse(readFileSync(new URL('./doi-chieu/quan-he-can-chi-nguon.json', import.meta.url), 'utf8'));
const doan = (id) => NGUON.doan.find((d) => d.id === id);
// Bản Văn Uyên Các dùng chữ dị thể: 戍 cho 戌, 己 lẫn với 巳 ở vài chỗ.
const CHI_HAN = '子丑寅卯辰巳午未申酉戌亥';
const CAN_HAN = '甲乙丙丁戊己庚辛壬癸';
const chiHan = (c) => CHI_HAN.indexOf(c === '戍' ? '戌' : c);
const capKhoa = (a, b) => [a, b].sort((x, y) => x - y).join('-');

test('mọi câu trích đúng nguyên văn đoạn nguồn, đoạn thuộc phạm vi công khai', () => {
  for (const [ma, t] of Object.entries(TRICH_BAT_TU)) {
    const d = doan(t.doanId);
    assert.ok(d, `${ma}: thiếu đoạn ${t.doanId} trong tệp đối chiếu`);
    assert.equal(d.ma, NGUON_BAT_TU[t.nguon].ma, `${ma}: sai mã sách`);
    assert.equal(d.phamVi, 'CONG_KHAI', `${ma}: đoạn chưa công khai`);
    assert.ok(t.viTri.includes(d.duongDan[0]), `${ma}: vị trí ${t.viTri} khác quyển ${d.duongDan[0]}`);
    let tu = 0;
    for (const khuc of t.nguyenVan.split('…')) {
      const i = d.vanBan.indexOf(khuc, tu);
      assert.ok(i >= 0, `${ma}: không thấy "${khuc}" (theo đúng thứ tự) trong đoạn ${t.doanId}`);
      tu = i + khuc.length;
    }
  }
});

test('bảng trong mã khớp bảng rút từ nguyên văn sách', () => {
  // Lục hại: "子未相害" … (Tam mệnh thông hội 論六害).
  const hai = [...doan(4348).vanBan.matchAll(/(.)(.)相害者/g)].map((m) => capKhoa(chiHan(m[1]), chiHan(m[2])));
  assert.deepEqual(new Set(hai), new Set(LUC_HAI.map(([a, b]) => capKhoa(a, b))));
  assert.equal(hai.length, 6);

  // Lục hợp: "子合丑寅合亥" (4338) và "卯與戍合" … (4339).
  const hop = new Set(['0-1', '2-11']);
  for (const m of doan(4339).vanBan.matchAll(/(.)與(.)合/g)) hop.add(capKhoa(chiHan(m[1]), chiHan(m[2])));
  assert.ok(doan(4338).vanBan.includes('子合丑寅合亥'));
  assert.deepEqual(hop, new Set(LUC_HOP.map(([a, b]) => capKhoa(a, b))));

  // Can ngũ hợp và hành hóa (Hiệp kỷ 四序).
  const v6012 = doan(6012).vanBan;
  const canHop = [...v6012.matchAll(/(.)與(.)合/g)].slice(0, 5).map((m) => capKhoa(CAN_HAN.indexOf(m[1]), CAN_HAN.indexOf(m[2])));
  assert.deepEqual(canHop, CAN_HOP.map(([a, b]) => capKhoa(a, b)));
  const HANH_HAN = { 土: 'Thổ', 金: 'Kim', 水: 'Thủy', 木: 'Mộc', 火: 'Hỏa' };
  for (const [a, b, h] of CAN_HOP) assert.ok(v6012.includes(`${CAN_HAN[a]}${CAN_HAN[b]}化${Object.keys(HANH_HAN).find((k) => HANH_HAN[k] === h)}`), `${a}-${b} hóa ${h}`);

  // Tương hình: "子卯一刑也寅巳申二刑也丑未戍三刑也"; tự hình "辰午酉亥".
  assert.ok(doan(4350).vanBan.includes('子卯一刑也寅巳申二刑也丑未戍三刑也'));
  const nhom = (s) => [...s].map(chiHan);
  const capTuNhom = (ds) => ds.flatMap((x, i) => ds.slice(i + 1).map((y) => capKhoa(x, y)));
  assert.deepEqual(
    new Set([...capTuNhom(nhom('子卯')), ...capTuNhom(nhom('寅巳申')), ...capTuNhom(nhom('丑未戍'))]),
    new Set(HINH.map(([a, b]) => capKhoa(a, b))),
  );
  assert.deepEqual(new Set(nhom('辰午酉亥')), new Set(TU_HINH));

  // Tam hội theo phương (Hiệp kỷ): "寅卯辰屬木配東方" …; bản gốc viết "己午未" thay "巳午未".
  const v6007 = doan(6007).vanBan.replace('己午未', '巳午未');
  for (const [ba, h] of TAM_HOI) {
    const chu = ba.map((c) => CHI_HAN[c]).join('');
    const hanHanh = { Mộc: '木', Hỏa: '火', Kim: '金', Thủy: '水' }[h];
    assert.ok(v6007.includes(`${chu}屬${hanHanh}`), `tam hội ${chu} ${h}`);
  }

  // Tam hợp: mỗi chi thuộc đúng một bộ; mỗi bộ là sinh–vượng–mộ cách nhau 4 vị trí.
  const phu = TAM_HOP.flatMap(([ba]) => ba).sort((a, b) => a - b);
  assert.deepEqual(phu, [...Array(12).keys()]);
  for (const [ba] of TAM_HOP) assert.ok(ba.every((c, i) => i === 0 || (c - ba[i - 1] + 12) % 12 === 4));
  assert.ok(doan(4341).vanBan.includes('巳酉丑寅午戍亥卯未皆然'));
});

test('ca 01/06/1990 08:30 nữ: lục hợp Dậu–Thìn và tam hợp Kim thiếu Sửu (khớp ảnh mẫu fengshui.skill)', () => {
  const l = lapLaSoBatTu({ ngay: 1, thang: 6, nam: 1990, gio: 8, phut: 30, gioiTinh: 'nu', namXem: 2026 });
  assert.deepEqual(l.tru.map((t) => t.canChi), ['Canh Ngọ', 'Tân Tỵ', 'Đinh Dậu', 'Giáp Thìn']);
  const q = quanHeTru(l);
  assert.deepEqual(q.map((x) => [x.loai, x.tru.join(','), x.chu.join(' ')]), [
    ['luc-hop', '2,3', 'Dậu Thìn'],
    ['thieu-tam-hop', '1,2', 'Tỵ Dậu'],
  ]);
  assert.equal(q[1].thieu, 'Sửu');
  assert.equal(q[1].hanh, 'Kim');

  const d = docNhanh(l, q);
  assert.equal(d.cau, 'Nhật chủ Đinh Hỏa, sinh tháng Tỵ (mùa hạ); 8 chữ nhiều Hỏa và Kim nhất, chưa có Thủy; hiện đang ở đại vận Mậu Dần (2016–2025).'.replace('(2016–2025)', `(${l.daiVan.ds.find((x) => x.dangChay).tuNam}–${l.daiVan.ds.find((x) => x.dangChay).tuNam + 9})`));
  assert.deepEqual(d.the.map((t) => t.ma), ['nhat-chu', 'thang-sinh', 'ngu-hanh', 'dai-van', 'quan-he']);
  assert.equal(d.the[0].giaTri, 'Đinh');
  assert.equal(d.the[0].hanh, 'Hỏa');
});

test('các trường hợp đặc biệt: đủ tam hợp, xung, hình, tự hình, can hợp', () => {
  // Lá số giả: chỉ cần tru[].can/chi cho quanHeTru.
  const gia = (ccs) => ({ tru: ccs.map((s) => { const [can, chi] = s.split(' '); return { can, chi }; }) });
  const loai = (ccs) => quanHeTru(gia(ccs)).map((x) => `${x.loai}:${x.tru.join('')}`);

  // Thân Tý Thìn đủ: tam hợp, không còn "thiếu một chữ" của cục đó.
  assert.deepEqual(loai(['Giáp Thân', 'Bính Tý', 'Mậu Thìn', 'Canh Ngọ']).filter((x) => x.startsWith('tam') || x.startsWith('thieu')), ['tam-hop:012']);
  // Tý–Ngọ xung; Tý–Mão hình vô lễ; Giáp–Kỷ hợp.
  const ds = loai(['Giáp Tý', 'Kỷ Ngọ', 'Bính Mão', 'Đinh Dậu']);
  assert.ok(ds.includes('xung:01'));
  assert.ok(ds.includes('hinh:02'));
  assert.ok(ds.includes('can-hop:01'));
  assert.ok(ds.includes('xung:23')); // Mão–Dậu
  // Ngọ gặp Ngọ: tự hình; Tý gặp Tý: không có gì.
  assert.deepEqual(loai(['Giáp Ngọ', 'Canh Ngọ', 'Bính Tý', 'Mậu Tý']).filter((x) => x.startsWith('tu-hinh')), ['tu-hinh:01']);
  // Dần–Tỵ vừa hại vừa hình.
  const dt = loai(['Giáp Dần', 'Kỷ Tỵ', 'Bính Tý', 'Mậu Tý']);
  assert.ok(dt.includes('hinh:01') && dt.includes('hai:01'));
});

test('quét 1900–2100: không trùng quan hệ, trụ hợp lệ, không chữ cấm trong Đọc nhanh', () => {
  const CAM = /hóa giải|vật phẩm|sát khí|cải vận|đại hung|tai họa|xui/i;
  for (let nam = 1900; nam <= 2100; nam += 7) {
    for (const [thang, ngay, gio] of [[1, 15, 0], [4, 3, 6], [7, 22, 12], [11, 9, 23]]) {
      const l = lapLaSoBatTu({ ngay, thang, nam, gio, gioiTinh: nam % 2 ? 'nam' : 'nu', namXem: 2026 });
      const q = quanHeTru(l);
      const khoa = q.map((x) => `${x.loai}:${x.tru.join('')}`);
      assert.equal(new Set(khoa).size, khoa.length, `trùng quan hệ ${nam}`);
      for (const x of q) {
        assert.ok(x.tru.every((t, i) => t >= 0 && t <= 3 && (i === 0 || t > x.tru[i - 1])), `trụ sai ${nam}`);
        assert.equal(x.chu.length, x.tru.length);
        assert.ok(x.trich.length > 0 && x.trich.every((m) => TRICH_BAT_TU[m]));
        for (const [i, t] of x.tru.entries()) assert.equal(x.chu[i], x.hang === 'can' ? l.tru[t].can : l.tru[t].chi);
      }
      const d = docNhanh(l, q);
      assert.ok(!CAM.test(d.cau + d.the.map((t) => t.chiTiet).join(' ')), `chữ cấm ${nam}`);
      assert.ok(d.cau.startsWith(`Nhật chủ ${l.nhatChu.can} ${l.nhatChu.hanh}`));
    }
  }
});

test('nghĩa ngắn phủ đủ thập thần và các loại quan hệ; mùa theo chi tháng', () => {
  for (const t of THAP_THAN) assert.ok(GIAI_NGHIA_BAT_TU[t], t);
  for (const ten of Object.values(TEN_LOAI_QUAN_HE)) if (ten !== 'Tam hợp thiếu một chữ') assert.ok(GIAI_NGHIA_BAT_TU[ten], ten);
  assert.deepEqual(DIA_CHI.map(muaTheoChiThang).join(','), 'đông,đông,xuân,xuân,xuân,hạ,hạ,hạ,thu,thu,thu,đông');
  assert.equal(THIEN_CAN.length, 10);
});

test('ca 19/04/1975 02:00 nam (ca thứ hai của Lệnh 40): đủ 5 nhóm quan hệ', () => {
  const l = lapLaSoBatTu({ ngay: 19, thang: 4, nam: 1975, gio: 2, gioiTinh: 'nam', namXem: 2026 });
  assert.deepEqual(l.tru.map((t) => t.canChi), ['Ất Mão', 'Canh Thìn', 'Ất Mùi', 'Đinh Sửu']);
  assert.deepEqual(quanHeTru(l).map((x) => `${x.loai}:${x.tru.join('')}:${x.chu.join('-')}`), [
    'can-hop:01:Ất-Canh', 'can-hop:12:Canh-Ất', 'thieu-tam-hop:02:Mão-Mùi', 'xung:23:Mùi-Sửu', 'hinh:23:Mùi-Sửu', 'hai:01:Mão-Thìn',
  ]);
});
