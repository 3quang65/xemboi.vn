import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  choPhepDuPhongCucBo,
  docToanBoDuLieuR1,
  luuLeadR1,
  luuSuKienR1,
  R1DatabaseUnavailableError,
} from '../../src/lib/r1/store.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

function taoDbLoi(err) {
  return {
    r1Event: {
      create: async () => {
        throw err;
      },
      findMany: async () => {
        throw err;
      },
    },
    r1Lead: {
      create: async () => {
        throw err;
      },
      findMany: async () => {
        throw err;
      },
    },
  };
}

function taoThuMucTam() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'r1-store-test-'));
}

test('[store] production + DB lỗi → KHÔNG tạo tệp dự phòng, ném R1DatabaseUnavailableError (503)', async () => {
  const dir = taoThuMucTam();
  const filePath = path.join(dir, 'r1-store.json');
  const logs = [];
  const logger = { error: (...args) => logs.push(args.map(String).join(' ')) };

  const dbErr = Object.assign(new Error('Can not reach database server'), {
    name: 'PrismaClientInitializationError',
    code: 'P1001',
  });
  const db = taoDbLoi(dbErr);

  assert.equal(choPhepDuPhongCucBo('production'), false);

  await assert.rejects(
    () =>
      luuSuKienR1(
        {
          sessionId: 'r1_prod_sess',
          eventName: 'bam_mua_149',
          utmSource: 'facebook',
        },
        { db, nodeEnv: 'production', localStorePath: filePath, logger },
      ),
    (err) => err instanceof R1DatabaseUnavailableError && err.statusCode === 503 && err.code === 'P1001',
  );

  await assert.rejects(
    () =>
      luuLeadR1(
        {
          emailHoacZalo: 'khach.prod@example.com',
          nutGiaDaBam: '149k',
          dongY: true,
          utmSource: 'facebook',
        },
        { db, nodeEnv: 'production', localStorePath: filePath, logger },
      ),
    (err) => err instanceof R1DatabaseUnavailableError && err.statusCode === 503 && err.code === 'P1001',
  );

  await assert.rejects(
    () => docToanBoDuLieuR1({ db, nodeEnv: 'production', localStorePath: filePath, logger }),
    (err) => err instanceof R1DatabaseUnavailableError && err.statusCode === 503,
  );

  assert.equal(fs.existsSync(filePath), false, 'Ở production tuyệt đối không được tạo tệp dự phòng');
  assert.ok(logs.some((l) => l.includes('bam_mua_149') && l.includes('P1001')));
  assert.ok(logs.some((l) => l.includes('gui_lien_he') && l.includes('P1001')));

  fs.rmSync(dir, { recursive: true, force: true });
});

test('[store] development + DB lỗi → vẫn dùng tệp dự phòng và đọc lại được dữ liệu', async () => {
  const dir = taoThuMucTam();
  const filePath = path.join(dir, 'r1-store.json');
  const logs = [];
  const logger = { error: (...args) => logs.push(args.map(String).join(' ')) };

  const db = taoDbLoi(Object.assign(new Error('localhost:5432 offline'), { code: 'P1001' }));

  assert.equal(choPhepDuPhongCucBo('development'), true);

  const evRes = await luuSuKienR1(
    {
      sessionId: 'r1_dev_sess',
      eventName: 'lap_la_so',
      coGioSinh: true,
      utmSource: 'tiktok',
    },
    { db, nodeEnv: 'development', localStorePath: filePath, logger },
  );
  assert.equal(evRes.storage, 'local-fallback');

  const leadRes = await luuLeadR1(
    {
      emailHoacZalo: 'dev.test@example.com',
      nutGiaDaBam: '79k',
      dongY: true,
      utmSource: 'tiktok',
    },
    { db, nodeEnv: 'development', localStorePath: filePath, logger },
  );
  assert.equal(leadRes.storage, 'local-fallback');
  assert.equal(fs.existsSync(filePath), true, 'Ở development cần ghi vào tệp dự phòng khi DB tắt');

  const loaded = await docToanBoDuLieuR1({ db, nodeEnv: 'development', localStorePath: filePath, logger });
  assert.equal(loaded.storage, 'local-fallback');
  assert.equal(loaded.events.length, 1);
  assert.equal(loaded.leads.length, 1);
  assert.equal(loaded.leads[0].emailHoacZalo, 'dev.test@example.com');

  fs.rmSync(dir, { recursive: true, force: true });
});

test('[store] Log lỗi DB KHÔNG chứa email, số Zalo hay ngày sinh (kể cả khi err.message có chứa)', async () => {
  const dir = taoThuMucTam();
  const filePath = path.join(dir, 'r1-store.json');
  const logs = [];
  const logger = { error: (...args) => logs.push(args.map(String).join(' ')) };

  const emailBiMat = 'nguoidung.riengtu@example.com';
  const zaloBiMat = '0987654321';
  const ngaySinhBiMat = '15/08/1998';

  const errCoDuLieuNhayCam = Object.assign(
    new Error(`Insert failed for ${emailBiMat} / ${zaloBiMat} / ${ngaySinhBiMat}`),
    { code: 'P2002', name: 'PrismaClientKnownRequestError' },
  );
  const db = taoDbLoi(errCoDuLieuNhayCam);

  await assert.rejects(() =>
    luuLeadR1(
      {
        emailHoacZalo: emailBiMat,
        nutGiaDaBam: '149k',
        dongY: true,
        utmSource: 'facebook',
      },
      { db, nodeEnv: 'production', localStorePath: filePath, logger },
    ),
  );

  await assert.rejects(() =>
    luuLeadR1(
      {
        emailHoacZalo: zaloBiMat,
        nutGiaDaBam: '79k',
        dongY: true,
        utmSource: 'facebook',
      },
      { db, nodeEnv: 'production', localStorePath: filePath, logger },
    ),
  );

  assert.equal(logs.length, 2);
  const toanBoLog = logs.join('\n');
  assert.ok(toanBoLog.includes('gui_lien_he'), 'Log phải có tên sự kiện');
  assert.ok(toanBoLog.includes('P2002'), 'Log phải có mã lỗi DB');
  assert.equal(toanBoLog.includes(emailBiMat), false, 'Log không được chứa email');
  assert.equal(toanBoLog.includes(zaloBiMat), false, 'Log không được chứa số Zalo');
  assert.equal(toanBoLog.includes(ngaySinhBiMat), false, 'Log không được chứa ngày sinh');

  fs.rmSync(dir, { recursive: true, force: true });
});

test('[UI Guard] HopThoaiMua hiện thông báo lỗi chuẩn và QuanTriR1Client có cảnh báo đỏ ở production', () => {
  const modalSrc = fs.readFileSync(
    path.join(ROOT, 'src', 'components', 'r1', 'HopThoaiMua.tsx'),
    'utf8',
  );
  assert.ok(
    modalSrc.includes('Chưa lưu được, bạn thử lại sau ít phút'),
    'Hộp thoại mua phải hiện đúng thông báo lỗi khi gửi Email/Zalo thất bại',
  );

  const adminSrc = fs.readFileSync(
    path.join(ROOT, 'src', 'components', 'r1', 'QuanTriR1Client.tsx'),
    'utf8',
  );
  assert.ok(
    adminSrc.includes('canhBaoDoProduction') && adminSrc.includes('CẢNH BÁO PRODUCTION'),
    'Trang quản trị phải hiện cảnh báo đỏ khi production không dùng PostgreSQL',
  );
});
