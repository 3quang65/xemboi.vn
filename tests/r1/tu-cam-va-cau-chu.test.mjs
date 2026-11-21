import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { R1_COPY } from '../../src/lib/r1/copy.ts';
import { BAN_MAU_BIEN_TAP } from '../../src/lib/r1/ban-mau-bien-tap.ts';
import { kiemTraTuCam } from '../../src/lib/r1/tu-cam.ts';
import { chuanHoaLeadR1, chuanHoaSuKienR1 } from '../../src/lib/r1/store.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

function gomChuoiTuObject(obj, kq = []) {
  if (typeof obj === 'string') {
    kq.push(obj);
  } else if (Array.isArray(obj)) {
    for (const x of obj) gomChuoiTuObject(x, kq);
  } else if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj)) gomChuoiTuObject(v, kq);
  }
  return kq;
}

test('[Quét từ cấm] Toàn bộ câu chữ hiển thị trên /tu-vi-2027 không chứa từ hù dọa, ép mua hay thu tiền', () => {
  const cacNguon = [
    { ten: 'R1_COPY', vanBan: gomChuoiTuObject(R1_COPY).join('\n') },
    { ten: 'BAN_MAU_BIEN_TAP', vanBan: gomChuoiTuObject(BAN_MAU_BIEN_TAP).join('\n') },
    {
      ten: 'kho-cau-tinh.ts',
      vanBan: fs.readFileSync(path.join(ROOT, 'src/lib/r1/kho-cau-tinh.ts'), 'utf8'),
    },
    {
      ten: 'tom-tat-mien-phi.json',
      vanBan: fs.readFileSync(path.join(ROOT, 'src/lib/r1/data/tom-tat-mien-phi.json'), 'utf8'),
    },
    {
      ten: 'menh-chinh-tinh.json',
      vanBan: fs.readFileSync(path.join(ROOT, 'src/lib/r1/data/menh-chinh-tinh.json'), 'utf8'),
    },
    {
      ten: 'TrangR1Client.tsx',
      vanBan: fs.readFileSync(path.join(ROOT, 'src/components/r1/TrangR1Client.tsx'), 'utf8'),
    },
    {
      ten: 'HopThoaiMua.tsx',
      vanBan: fs.readFileSync(path.join(ROOT, 'src/components/r1/HopThoaiMua.tsx'), 'utf8'),
    },
    {
      ten: 'LaSo12Cung.tsx',
      vanBan: fs.readFileSync(path.join(ROOT, 'src/components/r1/LaSo12Cung.tsx'), 'utf8'),
    },
  ];

  const tatCaViPham = [];
  for (const nguon of cacNguon) {
    const vp = kiemTraTuCam(nguon.vanBan);
    for (const item of vp) {
      tatCaViPham.push(`[${nguon.ten}] "${item.cumTu}" (${item.lyDo}) → "${item.doanTrich}"`);
    }
  }

  assert.deepEqual(tatCaViPham, [], `Phát hiện từ cấm:\n${tatCaViPham.join('\n')}`);
});

test('[Đúng từng chữ 04 mục 6.1] Khớp nguyên văn hộp thoại mua, nhãn bản mẫu, thông điệp giá và chỗ trống chủ thể', () => {
  assert.equal(
    BAN_MAU_BIEN_TAP.nhanBatBuoc,
    '[Bản mẫu có người biên tập — minh họa cấu trúc bản luận giải dự kiến]',
  );
  assert.equal(
    R1_COPY.gia.thongDiepChinh,
    'Luận giải Tử Vi 2027 rõ căn cứ từng sao–cung. Không hù dọa. Không bán lễ giải hạn. Chính sách dự kiến khi mở bán: hoàn tiền 100% trong 7 ngày.',
  );
  assert.equal(R1_COPY.gia.nut79, 'Đặt mua Vận 2027 — 79.000đ');
  assert.equal(R1_COPY.gia.nut149, 'Đặt mua Chuyên Sâu + Vận 2027 — 149.000đ');
  assert.equal(
    R1_COPY.hopThoaiMua.doanNguyenVan,
    'Sản phẩm chưa mở bán. Bạn vừa giúp bọn mình đo nhu cầu thực tế trước khi xây dựng hệ thống. Nếu đủ nhu cầu và ra mắt (dự kiến cuối tháng 12/2026 – đầu tháng 01/2027, chưa chắc chắn), bọn mình sẽ gửi thông báo cho bạn kèm ưu đãi giảm 30%. Nếu dự án không ra mắt, bọn mình sẽ gửi thông báo rõ kết quả và xóa toàn bộ dữ liệu bạn để lại sau tối đa 60 ngày.',
  );
  assert.equal(R1_COPY.chanTrang.chuThePlaceholder, '[ĐIỀN TÊN/ĐỊA CHỈ]');
  assert.ok(R1_COPY.chanTrang.chinhSachDuLieu.includes('60 ngày'));
});

test('[Quyền riêng tư Luật 91/2025] Sự kiện và Lead tuyệt đối không giữ ngày giờ sinh hay nối email với phiên', () => {
  const ev = chuanHoaSuKienR1({
    sessionId: 'r1_test_session',
    eventName: 'lap_la_so',
    coGioSinh: true,
    utmSource: 'facebook',
    // cố tình truyền thêm ngày sinh và email để kiểm tra việc lọc bỏ
    ngay: 15,
    thang: 8,
    nam: 1998,
    gio: 9,
    emailHoacZalo: 'khongduocluu@example.com',
  });
  assert.deepEqual(Object.keys(ev).sort(), [
    'coGioSinh',
    'eventName',
    'sessionId',
    'utmCampaign',
    'utmMedium',
    'utmSource',
  ]);

  const lead = chuanHoaLeadR1({
    emailHoacZalo: 'linh@example.com',
    nutGiaDaBam: '149k',
    dongY: true,
    utmSource: 'facebook',
    // cố tình truyền thêm sessionId và ngày sinh
    sessionId: 'r1_test_session',
    ngay: 15,
    thang: 8,
    nam: 1998,
  });
  assert.deepEqual(Object.keys(lead).sort(), [
    'emailHoacZalo',
    'nutGiaDaBam',
    'utmCampaign',
    'utmMedium',
    'utmSource',
  ]);
});
