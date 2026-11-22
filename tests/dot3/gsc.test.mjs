// Đợt 3: đồng bộ Search Console (src/lib/seo/gsc.ts). Không gọi Google: khóa RSA tự sinh, fetch giả.
// Phần CSDL dùng ngày năm 2099 và URL /_thu-gsc ([THỬ]), dọn ở after. Không gọi ghiCanhBaoGsc ở đây vì nó đóng cảnh báo GSC thật.
// Chạy: npx tsx --env-file=.env --test tests/dot3/gsc.test.mjs
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { taoJwt, layToken, truyVan, duongTuUrl, dongBoGsc, tinhCanhBaoGsc } from '../../src/lib/seo/gsc.ts';

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const KHOA = { client_email: 'thu@thu.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) };

test('taoJwt: chữ ký RS256 đúng, đủ trường', () => {
  const jwt = taoJwt(KHOA, 1_000_000);
  const [d, t, k] = jwt.split('.');
  assert.ok(crypto.createVerify('RSA-SHA256').update(`${d}.${t}`).verify(publicKey, Buffer.from(k, 'base64url')));
  assert.deepEqual(JSON.parse(Buffer.from(d, 'base64url')), { alg: 'RS256', typ: 'JWT' });
  const than = JSON.parse(Buffer.from(t, 'base64url'));
  assert.equal(than.iss, KHOA.client_email);
  assert.equal(than.scope, 'https://www.googleapis.com/auth/webmasters.readonly');
  assert.equal(than.exp - than.iat, 3600);
});

test('layToken và truyVan: gửi đúng, tự phân trang', async () => {
  const goi = [];
  const f = async (url, init) => {
    goi.push({ url, init });
    if (url.includes('oauth2')) return new Response(JSON.stringify({ access_token: 'tk' }), { status: 200 });
    const b = JSON.parse(init.body);
    const n = b.startRow === 0 ? 25_000 : 3;
    return new Response(JSON.stringify({ rows: Array.from({ length: n }, () => ({ keys: ['x'], clicks: 1, impressions: 2, position: 3 })) }), { status: 200 });
  };
  assert.equal(await layToken(KHOA, f), 'tk');
  assert.match(goi[0].init.body, /grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer/);
  const ds = await truyVan('tk', 'sc-domain:xemboi.vn', { startDate: '2099-01-01', endDate: '2099-01-01', dimensions: ['page'] }, f);
  assert.equal(ds.length, 25_003);
  assert.ok(goi[1].url.includes('sites/sc-domain%3Axemboi.vn/searchAnalytics/query'));
  assert.equal(goi[1].init.headers.Authorization, 'Bearer tk');
  assert.equal(JSON.parse(goi[2].init.body).startRow, 25_000);
  await assert.rejects(layToken(KHOA, async () => new Response('{"error":"invalid_grant"}', { status: 400 })), /invalid_grant/);
});

test('duongTuUrl: bỏ tên miền, dấu / cuối, giải mã', () => {
  assert.equal(duongTuUrl('https://xemboi.vn/'), '/');
  assert.equal(duongTuUrl('https://xemboi.vn/tu-vi/'), '/tu-vi');
  assert.equal(duongTuUrl('https://xemboi.vn/van-khan/m%E1%BB%93ng-1?x=1'), '/van-khan/mồng-1');
});

const db = new PrismaClient();
const U = 'https://xemboi.vn/_thu-gsc';
const ngayD = (s) => new Date(`${s}T00:00:00Z`);
after(async () => {
  await db.seoGscNgay.deleteMany({ where: { url: { startsWith: U } } });
  await db.seoGscTrangNgay.deleteMany({ where: { url: { startsWith: U } } });
  await db.$disconnect();
});

test('dongBoGsc + tinhCanhBaoGsc: tụt hạng, tụt nhấp, trùng ý định', async () => {
  const daCo = await db.seoGscTrangNgay.count({ where: { ngay: { gte: ngayD('2099-01-01') } } });
  if (daCo) return test.skip?.('CSDL đã có dữ liệu GSC năm 2099');
  // Mốc 2099-02-04. A = 29/01–04/02, B = 01/01–28/01.
  const goi = async ({ startDate: ngay, dimensions }) => {
    const A = ngay >= '2099-01-29';
    if (dimensions.length === 4) return [
      { keys: [ngay, `${U}/a`, 'q1 [thử]', 'MOBILE'], clicks: 1, impressions: A ? 10 : 30, position: A ? 9 : 4 },
      { keys: [ngay, `${U}/a`, 'q2 [thử]', 'MOBILE'], clicks: 0, impressions: 4, position: 6 },
      { keys: [ngay, `${U}/b`, 'q2 [thử]', 'MOBILE'], clicks: 0, impressions: 2, position: 12 },
    ];
    return [{ keys: [ngay, `${U}/a/`, 'MOBILE'], clicks: A ? 1 : 5, impressions: 50, position: 5 }];
  };
  const bc = await dongBoGsc(db, { site: 'thu', tuNgay: '2099-01-01', denNgay: '2099-02-04', goi });
  assert.deepEqual(bc, { ngay: 35, dongTruyVan: 105, dongTrang: 35, tuNgay: '2099-01-01', denNgay: '2099-02-04' });
  // Chạy lại một ngày: thay chứ không nhân đôi.
  await dongBoGsc(db, { site: 'thu', tuNgay: '2099-02-04', denNgay: '2099-02-04', goi });
  assert.equal(await db.seoGscNgay.count({ where: { url: { startsWith: U } } }), 105);

  const { moc, canhBao } = await tinhCanhBaoGsc(db);
  assert.equal(moc, '2099-02-04');
  const cua = canhBao.filter((c) => JSON.stringify(c.chiTiet).includes('_thu-gsc'));
  const viTri = cua.find((c) => c.khoa === `q|${U}/a|q1 [thử]`);
  assert.ok(viTri, 'phải có TUT_HANG theo vị trí');
  assert.equal(viTri.chiTiet.viTri7, 9); assert.equal(viTri.chiTiet.viTri28, 4); assert.equal(viTri.chiTiet.hienThi7, 70);
  assert.ok(cua.some((c) => c.loai === 'TUT_HANG' && c.chiTiet.kieu === 'nhap' && c.chiTiet.nhapNgay7 === 1 && c.chiTiet.nhapNgay28 === 5));
  const trung = cua.find((c) => c.loai === 'TRUNG_Y_DINH');
  assert.ok(trung); assert.equal(trung.chiTiet.truyVan, 'q2 [thử]'); assert.equal(trung.chiTiet.tyLeUrl2, 0.33);
  assert.equal(cua.length, 3);
});
