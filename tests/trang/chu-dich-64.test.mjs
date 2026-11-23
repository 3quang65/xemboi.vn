// Kinh văn Chu Dịch 64 quẻ (quẻ từ + hào từ) cho /kinh-dich/que/{nn}-{ten}.
// Chạy: ./node_modules/.bin/tsx --test tests/trang/chu-dich-64.test.mjs
// Phần đối chiếu đọc kho Kanripo cục bộ (KANRIPO_DIR, mặc định ../thu-vien-rag/kanripo); thiếu kho thì bỏ qua.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import DICH from '../../src/lib/trang/du-lieu/chu-dich-64.json' with { type: 'json' };
import { QUE_64 } from '../../src/lib/trang/kinh-dich.ts';

const { nguon, que } = DICH;

// Tên Hán → tên ngắn Hán Việt trong QUE_64 (tra theo tên, không theo thứ tự).
const HAN_VIET = {
  乾: 'Càn', 坤: 'Khôn', 屯: 'Truân', 蒙: 'Mông', 需: 'Nhu', 訟: 'Tụng', 師: 'Sư', 比: 'Tỷ',
  小畜: 'Tiểu Súc', 履: 'Lý', 泰: 'Thái', 否: 'Bĩ', 同人: 'Đồng Nhân', 大有: 'Đại Hữu', 謙: 'Khiêm', 豫: 'Dự',
  隨: 'Tùy', 蠱: 'Cổ', 臨: 'Lâm', 觀: 'Quán', 噬嗑: 'Phệ Hạp', 賁: 'Bí', 剝: 'Bác', 復: 'Phục',
  无妄: 'Vô Vọng', 大畜: 'Đại Súc', 頤: 'Di', 大過: 'Đại Quá', 坎: 'Khảm', 離: 'Ly', 咸: 'Hàm', 恆: 'Hằng',
  遯: 'Độn', 大壯: 'Đại Tráng', 晉: 'Tấn', 明夷: 'Minh Di', 家人: 'Gia Nhân', 睽: 'Khuê', 蹇: 'Kiển', 解: 'Giải',
  損: 'Tổn', 益: 'Ích', 夬: 'Quải', 姤: 'Cấu', 萃: 'Tụy', 升: 'Thăng', 困: 'Khốn', 井: 'Tỉnh',
  革: 'Cách', 鼎: 'Đỉnh', 震: 'Chấn', 艮: 'Cấn', 漸: 'Tiệm', 歸妹: 'Quy Muội', 豐: 'Phong', 旅: 'Lữ',
  巽: 'Tốn', 兌: 'Đoài', 渙: 'Hoán', 節: 'Tiết', 中孚: 'Trung Phu', 小過: 'Tiểu Quá', 既濟: 'Ký Tế', 未濟: 'Vị Tế',
};

const VI_TRI = ['初', '二', '三', '四', '五', '上'];
/** Nhãn hào theo âm dương: 9 = dương, 6 = âm. */
function nhanHao(i, duong) {
  const s = duong ? '九' : '六';
  if (i === 0) return '初' + s;
  if (i === 5) return '上' + s;
  return s + VI_TRI[i];
}
const CHI_HAN = /^\p{Script=Han}+$/u;

test('nguồn: Kanripo KR1a0001, ghi công CC BY-SA 4.0', () => {
  assert.equal(nguon.ma, 'KR1a0001');
  assert.equal(nguon.ghiCong, 'Văn bản: Kanripo, CC BY-SA 4.0');
  assert.equal(nguon.url, `https://github.com/kanripo/${nguon.ma}`);
  assert.ok(nguon.tenGoc && nguon.tenHanViet);
  assert.ok(Array.isArray(nguon.banDoiChieu) && nguon.banDoiChieu.length >= 1);
  for (const b of nguon.banDoiChieu) assert.equal(b.url, `https://github.com/kanripo/${b.ma}`);
});

test('64 quẻ theo thứ tự Văn Vương, tên khớp QUE_64 và ký hiệu Unicode', () => {
  assert.equal(que.length, 64);
  assert.equal(new Set(que.map((q) => q.ten)).size, 64);
  que.forEach((q, i) => {
    assert.equal(q.so, i + 1);
    assert.equal(q.kyHieu, String.fromCodePoint(0x4dc0 + i), `ký hiệu quẻ ${q.so}`);
    assert.ok(q.ten in HAN_VIET, `tên lạ: ${q.ten}`);
    assert.equal(HAN_VIET[q.ten], QUE_64[i].tenNgan, `quẻ ${q.so} ${q.ten}`);
  });
});

test('mỗi quẻ có quẻ từ và đúng 6 hào, nhãn khớp âm dương của QUE_64', () => {
  for (const q of que) {
    assert.match(q.queTu, CHI_HAN, `quẻ từ ${q.so}`);
    assert.equal(q.hao.length, 6, `số hào quẻ ${q.so}`);
    q.hao.forEach((h, i) => {
      assert.equal(h.viTri, nhanHao(i, QUE_64[q.so - 1].hao[i] === 1), `quẻ ${q.so} hào ${i + 1}`);
      assert.match(h.van, CHI_HAN, `quẻ ${q.so} ${h.viTri}`);
    });
  }
});

test('用九 chỉ ở Càn, 用六 chỉ ở Khôn', () => {
  assert.deepEqual(que[0].dung?.viTri, '用九');
  assert.deepEqual(que[1].dung?.viTri, '用六');
  assert.match(que[0].dung.van, CHI_HAN);
  assert.match(que[1].dung.van, CHI_HAN);
  for (const q of que.slice(2)) assert.equal(q.dung, null, `quẻ ${q.so}`);
});

test('vài câu quen thuộc nằm đúng chỗ', () => {
  assert.equal(que[0].queTu, '元亨利貞');
  assert.equal(que[0].hao[0].van, '潛龍勿用');
  assert.equal(que[1].hao[0].van, '履霜堅冰至');
  assert.equal(que[9].queTu, '履虎尾不咥人亨');
  assert.equal(que[28].queTu, '習坎有孚維心亨行有尚');
  assert.equal(que[51].queTu, '艮其背不獲其身行其庭不見其人无咎');
  assert.equal(que[62].queTu, '亨小利貞初吉終亂');
});

// ---------------------------------------------------------------- đối chiếu Kanripo
const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const KANRIPO = process.env.KANRIPO_DIR ?? path.resolve(GOC, '../thu-vien-rag/kanripo');
const coKho = fs.existsSync(path.join(KANRIPO, 'KR1a0001')) && fs.existsSync(path.join(KANRIPO, 'KR1a0006'));
const boQua = coKho ? false : `không thấy kho Kanripo ở ${KANRIPO}`;

function docTep(f) {
  return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => !l.startsWith('#') && !l.startsWith('**'))
    .join('').replace(/<pb:[^>]*>/g, '').replace(/¶/g, '');
}
const boDau = (s) => s.replace(/[，。、：；「」『』《》？！（）\s　]/gu, '');
const POS = [/^初[九六]$/, /^[九六]二$/, /^[九六]三$/, /^[九六]四$/, /^[九六]五$/, /^上[九六]$/];

/** Dựng lại 1 quẻ từ bản TLS (KR1a0001, mỗi quẻ một tệp) đúng như cách tạo JSON. */
function trichTls(so) {
  const s = docTep(path.join(KANRIPO, 'KR1a0001', `KR1a0001_${String(so).padStart(3, '0')}.txt`));
  const tag = [...s.matchAll(/[䷀-䷿].下.上/gu)];
  assert.equal(tag.length, 1, `tag quái ${so}`);
  let rest = s.slice(tag[0].index + tag[0][0].length);
  const mTen = /^《([^》]+)》/u.exec(rest);
  rest = rest.slice(mTen[0].length);
  const iVanNgon = rest.indexOf('《文言》');
  if (iVanNgon >= 0) rest = rest.slice(0, iVanNgon);
  const mk = [...rest.matchAll(/《彖》曰：|《象》曰：|(初[九六]|[九六][二三四五]|上[九六]|用[九六])[：、]/gu)];
  let ten = mTen[1];
  let queTu = boDau(rest.slice(0, mk[0].index));
  if (ten === '習坎') { ten = '坎'; queTu = '習坎' + queTu; }
  if (ten === '艮' && !queTu.startsWith('艮')) queTu = '艮' + queTu;
  const hao = [];
  let dung = null;
  mk.forEach((m, k) => {
    if (!m[1]) return;
    const van = boDau(rest.slice(m.index + m[0].length, mk[k + 1]?.index ?? rest.length));
    if (m[1].startsWith('用')) dung = { viTri: m[1], van };
    // nhãn hào trích lại trong 《象》 (vd. 比之初六…) không đúng thứ tự thì bỏ
    else if (hao.length < 6 && POS[hao.length].test(m[1])) hao.push({ viTri: m[1], van });
  });
  return { ten, queTu, hao, dung };
}

test('JSON dựng lại đúng từ bản gốc KR1a0001 (TLS)', { skip: boQua }, () => {
  for (const q of que) {
    const { kyHieu, so, ...conLai } = q;
    assert.deepEqual(conLai, trichTls(so), `quẻ ${so}`);
  }
});

// Bản thứ hai: KR1a0006 周易 王弼注, bản SBCK (四部叢刊). Chú nhỏ nằm trong (…).
function docSbck() {
  const thuMuc = path.join(KANRIPO, 'KR1a0006');
  const s = fs.readdirSync(thuMuc).filter((f) => /^KR1a0006_\d{3}\.txt$/.test(f)).sort()
    .map((f) => docTep(path.join(thuMuc, f))).join('')
    .replace(/\([^()]*\)/g, '').replace(/[\s　]/g, '').replace(/&KR\d+;/g, '〓'); // 〓 = chữ ngoài Unicode
  const vt = [...s.matchAll(/[䷀-䷿]/gu)];
  return vt.slice(0, 64).map((m, k) => s.slice(m.index + 1, vt[k + 1]?.index ?? s.length));
}

/** So từng chữ (LCS); trả về các cặp [chữ bản gốc, chữ bản 2] khác nhau. */
function soChu(a, b) {
  a = Array.from(a); b = Array.from(b);
  const L = Array.from({ length: a.length + 1 }, () => new Int32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ra = []; let i = 0, j = 0, da = '', db = '';
  const day = () => { if (da || db) ra.push([da, db]); da = db = ''; };
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { day(); i++; j++; }
    else if (j < b.length && (i === a.length || L[i][j + 1] >= L[i + 1][j])) db += b[j++];
    else da += a[i++];
  }
  day();
  return ra;
}

// Dị thể chữ (bản gốc → SBCK): cùng một chữ, khác tự hình.
const DI_THE = new Set([
  '潛濳', '群羣', '喪䘮', '乘乗', '寇宼', '婚㛰', '無无', '舍舎', '苞包', '為爲', '涉渉', '恆恒', '戶户', '戶戸',
  '內内', '既旣', '往徃', '彙彚', '高髙', '歲歳', '遲遟', '裕𥙿', '賓賔', '剝剥', '床牀', '宮宫', '遠逺', '祗祇',
  '衹祇', '菑葘', '頤頥', '朵朶', '顛顚', '耋耊', '茲兹', '眾衆', '鼠䑕', '出岀', '曳曵', '慍愠', '杞𣏌', '虛虚',
  '冥㝠', '洌冽', '薰薫', '宜冝', '闃閴', '兌兊', '陰隂', '鼓鼔',
]);
// Khác biệt KHÔNG phải dị thể, đã xem từng chỗ. Khóa: "số|vị trí|bản gốc|SBCK".
const DA_BIET = {
  '4|queTu|來|': 'TLS 童蒙來求我; SBCK, 注疏, 集解, 本義, 折中 đều 童蒙求我',
  '26|初九|己|已': 'TLS 利己 (集解 WYG cũng 己); SBCK, 注疏 利已',
  '41|初九|已|巳': 'TLS 已事遄往; SBCK 巳事遄往 (己/已/巳 hay lẫn)',
  '51|六五|意|億': 'TLS 意无喪有事; SBCK, 注疏, 集解, 本義, 折中 đều 億',
  '61|上九|音|青': 'SBCK chép sai 翰青 (các bản khác 翰音)',
  '62|queTu|音|昔': 'SBCK chép sai 飛鳥遺之昔',
};
// Nhãn hào bản SBCK không có: 臨 khuyết đoạn (mất 彖 sau, 大象, 初九–六三); 中孚 九五 chép thành 丸五.
const KHUYET = new Set(['19|初九', '19|九二', '19|六三','61|九五']);

test('đối chiếu bản thứ hai KR1a0006 (SBCK): chỉ khác dị thể chữ và các chỗ đã biết', { skip: boQua }, () => {
  const sb = docSbck();
  assert.equal(sb.length, 64);
  const la = [];
  const daGap = new Set();
  const ghi = (so, vt, a, b) => {
    const A = Array.from(a), B = Array.from(b);
    if (A.length === B.length && A.every((c, k) => B[k] === '〓' || DI_THE.has(c + B[k]))) return;
    const khoa = `${so}|${vt}|${a}|${b}`;
    if (khoa in DA_BIET) daGap.add(khoa);
    else la.push(khoa);
  };
  for (const q of que) {
    const seg = sb[q.so - 1];
    const ten = /^(習坎|履|否|同人|艮)/u.test(q.queTu) ? '' : q.ten;
    const mHet = /彖曰|象曰|[初𥘉][九六]/u.exec(seg);
    for (const [a, b] of soChu(ten + q.queTu, seg.slice(0, mHet.index))) ghi(q.so, 'queTu', a, b);
    const muc = [...q.hao, ...(q.dung ? [q.dung] : [])];
    const reNhan = (vt) => (vt[0] === '初' ? '[初𥘉]' : vt[0]) + vt.slice(1);
    let tu = mHet.index;
    muc.forEach((h, k) => {
      const re = new RegExp(reNhan(h.viTri), 'gu');
      re.lastIndex = tu;
      const m = re.exec(seg);
      if (!m) { if (KHUYET.has(`${q.so}|${h.viTri}`)) return; la.push(`${q.so}|${h.viTri}|không thấy nhãn`); return; }
      const dau = m.index + m[0].length;
      const re2 = new RegExp('彖曰|象曰|文言曰' + (muc[k + 1] ? '|' + reNhan(muc[k + 1].viTri) : ''), 'gu');
      re2.lastIndex = dau;
      const m2 = re2.exec(seg);
      for (const [a, b] of soChu(h.van, seg.slice(dau, m2 ? m2.index : seg.length))) ghi(q.so, h.viTri, a, b);
      tu = dau;
    });
  }
  assert.deepEqual(la, [], 'khác biệt mới chưa phân loại');
  assert.deepEqual([...daGap].sort(), Object.keys(DA_BIET).sort(), 'danh sách DA_BIET phải còn đúng');
});
