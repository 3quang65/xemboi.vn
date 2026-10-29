import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const prisma = new PrismaClient();

function loadBrowserEngines() {
  const ctx = {};
  ctx.window = ctx;
  ctx.global = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of ['lich.js', 'tuvi.js', 'thayba.js', 'thuvien.js', 'trondoi.js', 'homnay.js']) {
    const code = fs.readFileSync(path.join(process.cwd(), 'public', f), 'utf8');
    vm.runInContext(code, ctx);
  }
  return ctx;
}

const HANH_ENUM = {
  Kim: 'KIM',
  Mộc: 'MOC',
  Thủy: 'THUY',
  Hỏa: 'HOA',
  Thổ: 'THO',
};

const HANH_COLOR = {
  Kim: '#5f5f66',
  Mộc: '#2e7d32',
  Thủy: '#1f4e9c',
  Hỏa: '#c0392b',
  Thổ: '#a0600c',
};

const PALACE_MAP = [
  { key: 'Mệnh', enumVal: 'MENH', field: 'menh' },
  { key: 'Phụ Mẫu', enumVal: 'PHU_MAU', field: 'phu' },
  { key: 'Phúc Đức', enumVal: 'PHUC_DUC', field: 'phuc' },
  { key: 'Điền Trạch', enumVal: 'DIEN_TRACH', field: 'dien' },
  { key: 'Quan Lộc', enumVal: 'QUAN_LOC', field: 'quan' },
  { key: 'Nô Bộc', enumVal: 'NO_BOC', field: 'no' },
  { key: 'Thiên Di', enumVal: 'THIEN_DI', field: 'di' },
  { key: 'Tật Ách', enumVal: 'TAT_ACH', field: 'tat' },
  { key: 'Tài Bạch', enumVal: 'TAI_BACH', field: 'tai' },
  { key: 'Tử Tức', enumVal: 'TU_TUC', field: 'tu' },
  { key: 'Phu Thê', enumVal: 'PHU_THE', field: 'phuThe' },
  { key: 'Huynh Đệ', enumVal: 'HUYNH_DE', field: 'huynh' },
];

function toSlug(s) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const engines = loadBrowserEngines();
  const { TuVi, ThuVien } = engines;

  console.log('1. Seeding Stars (14 Chính tinh + Phụ tinh)...');
  const sampleChart = TuVi.anLaSo({
    ten: 'Seed',
    ngay: 15,
    thang: 6,
    nam: 1990,
    gio: 12,
    gioiTinh: 'nam',
  });

  const starMap = new Map();
  for (const c of sampleChart.cung) {
    for (const s of c.chinhTinh) {
      starMap.set(s.ten, { ten: s.ten, hanh: s.hanh, loai: 'CHINH_TINH', isGood: true });
    }
    for (const s of c.catTinh) {
      starMap.set(s.ten, {
        ten: s.ten,
        hanh: s.hanh,
        loai: /^Hóa /.test(s.ten) ? 'TU_HOA' : 'PHU_TINH_TOT',
        isGood: true,
      });
    }
    for (const s of c.hungTinh) {
      starMap.set(s.ten, {
        ten: s.ten,
        hanh: s.hanh,
        loai: s.ten === 'Hóa Kỵ' ? 'TU_HOA' : 'PHU_TINH_XAU',
        isGood: false,
      });
    }
  }

  const dbStars = new Map();
  for (const [, info] of starMap.entries()) {
    const slug = toSlug(info.ten);
    const saoData = ThuVien.SAO?.[info.ten] || null;
    const phuData = ThuVien.PHU?.[info.ten] || null;
    const star = await prisma.star.upsert({
      where: { slug },
      update: {
        name: info.ten,
        type: info.loai,
        nguHanh: HANH_ENUM[info.hanh] || 'THO',
        colorHex: HANH_COLOR[info.hanh] || '#a0600c',
        isGood: info.isGood,
        summary: saoData?.khai || phuData?.y || `Sao ${info.ten} thuộc hành ${info.hanh} trong Tử Vi Nam Phái.`,
      },
      create: {
        slug,
        name: info.ten,
        type: info.loai,
        nguHanh: HANH_ENUM[info.hanh] || 'THO',
        colorHex: HANH_COLOR[info.hanh] || '#a0600c',
        isGood: info.isGood,
        summary: saoData?.khai || phuData?.y || `Sao ${info.ten} thuộc hành ${info.hanh} trong Tử Vi Nam Phái.`,
      },
    });
    dbStars.set(info.ten, star);
  }

  console.log(`Seeded ${dbStars.size} stars. Seeding StarInterpretations across 12 palaces...`);
  let interpCount = 0;
  for (const [starName, saoObj] of Object.entries(ThuVien.SAO || {})) {
    const starRecord = dbStars.get(starName);
    if (!starRecord) continue;
    for (const p of PALACE_MAP) {
      const text =
        saoObj[p.field] ||
        `${starName} đóng tại cung ${p.key}: ${saoObj.khai || ''} Khi sáng sủa (Miếu/Vượng/Đắc): ${saoObj.sang || ''} Khi hãm địa: ${saoObj.toi || ''}`;
      await prisma.starInterpretation.upsert({
        where: {
          starId_palace_brightness_gender: {
            starId: starRecord.id,
            palace: p.enumVal,
            brightness: 'KHONG_XAC_DINH',
            gender: 'NAM',
          },
        },
        update: {
          title: `${starName} tọa thủ cung ${p.key}`,
          generalMeaning: text,
          positiveTraits: saoObj.sang || null,
          negativeTraits: saoObj.toi || null,
          advice: saoObj.luyen || null,
        },
        create: {
          starId: starRecord.id,
          palace: p.enumVal,
          brightness: 'KHONG_XAC_DINH',
          gender: 'NAM',
          title: `${starName} tọa thủ cung ${p.key}`,
          generalMeaning: text,
          positiveTraits: saoObj.sang || null,
          negativeTraits: saoObj.toi || null,
          advice: saoObj.luyen || null,
        },
      });
      interpCount++;
    }
  }

  console.log(`Seeded ${interpCount} StarInterpretations. Seeding CachCucInterpretations...`);
  for (const [capKey, capMeaning] of Object.entries(ThuVien.CAP || {})) {
    const code = 'CAP_' + toSlug(capKey).toUpperCase().replace(/-/g, '_');
    const stars = capKey.split('+').map((s) => toSlug(s));
    await prisma.cachCucInterpretation.upsert({
      where: { code },
      update: {
        name: `Cách cục ${capKey.replace('+', ' đồng cung ')}`,
        isGoodPattern: true,
        requiredStars: stars,
        description: String(capMeaning),
        detailedReading: String(capMeaning),
      },
      create: {
        code,
        name: `Cách cục ${capKey.replace('+', ' đồng cung ')}`,
        isGoodPattern: true,
        requiredStars: stars,
        description: String(capMeaning),
        detailedReading: String(capMeaning),
      },
    });
  }

  console.log('Seeding TransitInterpretations (Đại hạn & Lưu niên tiểu hạn)...');
  for (const p of PALACE_MAP) {
    await prisma.transitInterpretation.create({
      data: {
        transitType: 'DAI_HAN_10_NAM',
        palace: p.enumVal,
        readingText: `Đại vận 10 năm đi vào cung ${p.key}: cần kết hợp xét chính tinh tọa thủ, tam hợp chiếu và tứ hóa lưu đại vận để định cát hung.`,
      },
    });
  }

  console.log('Seeding Categories & SEO Posts...');
  const cat = await prisma.category.upsert({
    where: { slug: 'tu-vi-nam-phai' },
    update: { name: 'Tử Vi Nam Phái' },
    create: {
      slug: 'tu-vi-nam-phai',
      name: 'Tử Vi Nam Phái',
      description: 'Kiến thức chính thống Tử Vi Đẩu Số Nam Phái tại XemBoi.vn',
    },
  });

  await prisma.post.upsert({
    where: { slug: 'huong-dan-doc-la-so-tu-vi-nam-phai-cho-nguoi-moi' },
    update: { title: 'Hướng Dẫn Đọc Lá Số Tử Vi Nam Phái Chuẩn Xác Cho Người Mới Bắt Đầu' },
    create: {
      slug: 'huong-dan-doc-la-so-tu-vi-nam-phai-cho-nguoi-moi',
      title: 'Hướng Dẫn Đọc Lá Số Tử Vi Nam Phái Chuẩn Xác Cho Người Mới Bắt Đầu',
      excerpt: 'Nắm vững cấu trúc 12 cung địa bàn, Thiên bàn, 14 Chính tinh và Tam hợp Mệnh – Tài – Quan.',
      content: '<p>Hướng dẫn chi tiết đọc lá số Tử Vi Nam Phái tại XemBoi.vn.</p>',
      categoryId: cat.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
