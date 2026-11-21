import type {
  BaoCaoPheuR1,
  DanhGiaNguongR1,
  DongPheuUtm,
  R1EventRecord,
  R1LeadRecord,
  WilsonInterval,
} from './types';

// Ngưỡng chuẩn theo docs/v2/04-dinh-vi-kinh-doanh.md mục 6.2 & 3.1 (R4)
export const NGUONG_R1 = {
  CO_MAU_TOI_THIEU: 300,
  CO_MAU_KHUYEN_NGHI: 400,
  CLICK_DAT: 0.06, // >= 6.0%
  CLICK_TRUOT: 0.025, // < 2.5%
  LEAD_DAT: 0.025, // >= 2.5%
  CHUA_RO_GIO_CANH_BAO: 0.5, // >= 50% (04 mục 3.1, R4)
} as const;

const Z_95 = 1.959963984540054; // phân vị chuẩn 97.5% cho khoảng tin cậy 95%

/**
 * Tính khoảng tin cậy Wilson score 95% cho tỷ lệ nhị thức k / n.
 * Nếu n <= 0 trả về 0 [0, 0]. Kẹp k vào [0, n] để tránh sai số đầu vào.
 */
export function wilson95(successes: number, total: number): WilsonInterval {
  if (!Number.isFinite(total) || total <= 0) {
    return { successes: 0, total: 0, rate: 0, lower: 0, upper: 0 };
  }
  const n = Math.floor(total);
  const k = Math.min(n, Math.max(0, Math.floor(successes)));
  const p = k / n;
  const z2 = Z_95 * Z_95;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const margin = (Z_95 * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) / denom;
  return {
    successes: k,
    total: n,
    rate: p,
    lower: k === 0 ? 0 : Math.max(0, center - margin),
    upper: k === n ? 1 : Math.min(1, center + margin),
  };
}

/**
 * Quyết định ĐẠT / CHƯA RÕ / TRƯỢT đúng 04 mục 6.2.
 * Lưu ý: Tiêu chí cuối cùng còn kết hợp phỏng vấn 20 người (03 mục 6); hàm này chấm phần dữ liệu định lượng R1.
 */
export function danhGiaNguongR1(input: {
  charts: number;
  clicks: number;
  leads: number;
}): DanhGiaNguongR1 {
  const { charts, clicks, leads } = input;
  const duMau = charts >= NGUONG_R1.CO_MAU_TOI_THIEU;
  if (charts <= 0) {
    return {
      trangThai: 'CHUA_RO',
      nhan: 'CHƯA ĐỦ DỮ LIỆU',
      duMau: false,
      lyDo: `Chưa có lá số nào được lập (cần tối thiểu ${NGUONG_R1.CO_MAU_TOI_THIEU} lá số).`,
    };
  }

  const clickRate = clicks / charts;
  const leadRate = leads / charts;
  const ghiChuMau = duMau
    ? `Đã đủ cỡ mẫu tối thiểu (${charts}/${NGUONG_R1.CO_MAU_TOI_THIEU} lá số).`
    : `Chưa đủ cỡ mẫu (${charts}/${NGUONG_R1.CO_MAU_TOI_THIEU} lá số — chỉ để theo dõi sớm).`;

  if (clickRate < NGUONG_R1.CLICK_TRUOT) {
    return {
      trangThai: 'TRUOT',
      nhan: 'TRƯỢT (PIVOT / STOP)',
      duMau,
      lyDo: `click_per_chart = ${dinhDangPhanTram(clickRate)} (< 2,5%). ${ghiChuMau}`,
    };
  }

  if (clickRate >= NGUONG_R1.CLICK_DAT && leadRate >= NGUONG_R1.LEAD_DAT) {
    return {
      trangThai: 'DAT',
      nhan: 'ĐẠT (GO — cần kèm tiêu chí phỏng vấn 03)',
      duMau,
      lyDo: `click_per_chart = ${dinhDangPhanTram(clickRate)} (≥ 6,0%) và lead_per_chart = ${dinhDangPhanTram(leadRate)} (≥ 2,5%). ${ghiChuMau}`,
    };
  }

  return {
    trangThai: 'CHUA_RO',
    nhan: 'CHƯA RÕ (ITERATE — tối đa 1 vòng)',
    duMau,
    lyDo: `click_per_chart = ${dinhDangPhanTram(clickRate)}, lead_per_chart = ${dinhDangPhanTram(leadRate)} (nằm giữa vùng TRƯỢT < 2,5% và vùng ĐẠT ≥ 6,0% + lead ≥ 2,5%). ${ghiChuMau}`,
  };
}

/**
 * Quy tắc R4 (docs/v2/04-dinh-vi-kinh-doanh.md mục 3.1):
 * Người chọn "chưa rõ giờ sinh" KHÔNG thấy nút gói 149.000đ (luận 12 cung).
 */
export function hienNut149k(coGioSinh: boolean): boolean {
  return coGioSinh === true;
}

export function dinhDangPhanTram(tyLe: number, chuSo = 1): string {
  return `${(tyLe * 100).toFixed(chuSo).replace('.', ',')}%`;
}

function chuanHoaUtm(s?: string | null, macDinh = ''): string {
  const v = (s ?? '').trim();
  return v || macDinh;
}

function khoaUtm(src: string, med: string, camp: string): string {
  return `${src}|||${med}|||${camp}`;
}

function tinhDongPheu(
  utmSource: string,
  utmMedium: string,
  utmCampaign: string,
  events: R1EventRecord[],
  soLeadTrongBang: number,
): DongPheuUtm {
  const tap = {
    xem_trang: new Set<string>(),
    bat_dau_form: new Set<string>(),
    bo_form: new Set<string>(),
    lap_la_so: new Set<string>(),
    co_gio_sinh: new Set<string>(),
    chua_ro_gio: new Set<string>(),
    xem_gia: new Set<string>(),
    bam_mua_79: new Set<string>(),
    bam_mua_149: new Set<string>(),
    bam_mua_tong: new Set<string>(),
    gui_lien_he: new Set<string>(),
  };

  for (const e of events) {
    const sid = e.sessionId;
    if (!sid) continue;
    switch (e.eventName) {
      case 'xem_trang':
        tap.xem_trang.add(sid);
        break;
      case 'bat_dau_form':
        tap.bat_dau_form.add(sid);
        break;
      case 'bo_form':
        tap.bo_form.add(sid);
        break;
      case 'lap_la_so':
        tap.lap_la_so.add(sid);
        if (e.coGioSinh === false) {
          tap.chua_ro_gio.add(sid);
        } else if (e.coGioSinh === true) {
          tap.co_gio_sinh.add(sid);
        }
        break;
      case 'xem_gia':
        tap.xem_gia.add(sid);
        break;
      case 'bam_mua_79':
        tap.bam_mua_79.add(sid);
        tap.bam_mua_tong.add(sid);
        break;
      case 'bam_mua_149':
        tap.bam_mua_149.add(sid);
        tap.bam_mua_tong.add(sid);
        break;
      case 'gui_lien_he':
        tap.gui_lien_he.add(sid);
        break;
    }
  }

  // Một phiên nếu cuối cùng đã lập lá số (kể cả vừa chọn có giờ vừa chọn chưa rõ giờ)
  // vẫn chỉ tính 1 trong mẫu số lap_la_so; nếu phiên đã từng lập có giờ thì ưu tiên xếp vào co_gio_sinh.
  for (const sid of tap.co_gio_sinh) {
    tap.chua_ro_gio.delete(sid);
  }
  // Nếu phiên đã lập lá số thì không tính là bỏ form
  for (const sid of tap.lap_la_so) {
    tap.bo_form.delete(sid);
  }

  const lapLaSo = tap.lap_la_so.size;
  const coGioSinh = tap.co_gio_sinh.size;
  const chuaRoGio = tap.chua_ro_gio.size;
  const batDauForm = tap.bat_dau_form.size;
  const boForm = tap.bo_form.size;
  const bamMua79 = tap.bam_mua_79.size;
  const bamMua149 = tap.bam_mua_149.size;
  const bamMuaTong = tap.bam_mua_tong.size;
  const guiLienHe = tap.gui_lien_he.size;

  // So sánh 79k vs 149k trên riêng nhóm CÓ giờ sinh (công bằng vì nhóm chưa rõ giờ bị ẩn nút 149k)
  let coGioBam79 = 0;
  let coGioBam149 = 0;
  for (const sid of tap.bam_mua_79) if (tap.co_gio_sinh.has(sid)) coGioBam79++;
  for (const sid of tap.bam_mua_149) if (tap.co_gio_sinh.has(sid)) coGioBam149++;

  const tongLuaChonNut = bamMua79 + bamMua149;

  return {
    utmKey: khoaUtm(utmSource, utmMedium, utmCampaign),
    utmSource,
    utmMedium,
    utmCampaign,
    xemTrang: tap.xem_trang.size,
    batDauForm,
    boForm,
    tyLeBoForm: batDauForm > 0 ? boForm / batDauForm : 0,
    lapLaSo,
    coGioSinh,
    chuaRoGio,
    tyLeChuaRoGio: wilson95(chuaRoGio, lapLaSo),
    xemGia: tap.xem_gia.size,
    bamMua79,
    bamMua149,
    bamMuaTong,
    guiLienHe,
    soLeadTrongBang,
    clickPerChart: wilson95(bamMuaTong, lapLaSo),
    leadPerChart: wilson95(guiLienHe, lapLaSo),
    tyLe79TrongClick: tongLuaChonNut > 0 ? bamMua79 / tongLuaChonNut : 0,
    tyLe149TrongClick: tongLuaChonNut > 0 ? bamMua149 / tongLuaChonNut : 0,
    coGioBam79,
    coGioBam149,
    danhGia: danhGiaNguongR1({
      charts: lapLaSo,
      clicks: bamMuaTong,
      leads: guiLienHe,
    }),
  };
}

/**
 * Tổng hợp phễu R1 theo từng nhóm UTM (utm_source, utm_medium, utm_campaign) và dòng tổng hợp toàn bộ.
 */
export function tinhPheuR1(
  events: R1EventRecord[],
  leads: R1LeadRecord[] = [],
): BaoCaoPheuR1 {
  const nhomSuKien = new Map<
    string,
    { utmSource: string; utmMedium: string; utmCampaign: string; events: R1EventRecord[] }
  >();
  const demLeadTheoUtm = new Map<string, number>();

  for (const e of events) {
    const src = chuanHoaUtm(e.utmSource, '(trực tiếp)');
    const med = chuanHoaUtm(e.utmMedium, '');
    const camp = chuanHoaUtm(e.utmCampaign, '');
    const k = khoaUtm(src, med, camp);
    let nhom = nhomSuKien.get(k);
    if (!nhom) {
      nhom = { utmSource: src, utmMedium: med, utmCampaign: camp, events: [] };
      nhomSuKien.set(k, nhom);
    }
    nhom.events.push(e);
  }

  for (const l of leads) {
    const src = chuanHoaUtm(l.utmSource, '(trực tiếp)');
    const med = chuanHoaUtm(l.utmMedium, '');
    const camp = chuanHoaUtm(l.utmCampaign, '');
    const k = khoaUtm(src, med, camp);
    demLeadTheoUtm.set(k, (demLeadTheoUtm.get(k) ?? 0) + 1);
    if (!nhomSuKien.has(k)) {
      nhomSuKien.set(k, { utmSource: src, utmMedium: med, utmCampaign: camp, events: [] });
    }
  }

  const theoUtm: DongPheuUtm[] = Array.from(nhomSuKien.entries())
    .map(([k, nhom]) =>
      tinhDongPheu(
        nhom.utmSource,
        nhom.utmMedium,
        nhom.utmCampaign,
        nhom.events,
        demLeadTheoUtm.get(k) ?? 0,
      ),
    )
    .sort((a, b) => b.lapLaSo - a.lapLaSo || b.xemTrang - a.xemTrang);

  const tongHop = tinhDongPheu('TỔNG CỘNG', '', '', events, leads.length);

  return {
    tongHop,
    theoUtm,
    nguong: {
      coMauToiThieu: NGUONG_R1.CO_MAU_TOI_THIEU,
      coMauKhuyenNghi: NGUONG_R1.CO_MAU_KHUYEN_NGHI,
      clickDat: NGUONG_R1.CLICK_DAT,
      clickTruot: NGUONG_R1.CLICK_TRUOT,
      leadDat: NGUONG_R1.LEAD_DAT,
      chuaRoGioCanhBao: NGUONG_R1.CHUA_RO_GIO_CANH_BAO,
    },
  };
}

function escapeCsvCell(val: string | number | boolean | null | undefined): string {
  const s = val == null ? '' : String(val);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function xuatCsvPheu(baoCao: BaoCaoPheuR1): string {
  const headers = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'xem_trang',
    'bat_dau_form',
    'bo_form',
    'ty_le_bo_form_%',
    'lap_la_so',
    'co_gio_sinh',
    'chua_ro_gio',
    'ty_le_chua_ro_gio_%',
    'xem_gia',
    'bam_mua_79',
    'bam_mua_149',
    'bam_mua_tong',
    'click_per_chart_%',
    'click_wilson95_thap_%',
    'click_wilson95_cao_%',
    'gui_lien_he',
    'lead_per_chart_%',
    'lead_wilson95_thap_%',
    'lead_wilson95_cao_%',
    'so_lead_trong_bang',
    'danh_gia',
  ];

  const rows = [baoCao.tongHop, ...baoCao.theoUtm].map((d) => [
    d.utmSource,
    d.utmMedium,
    d.utmCampaign,
    d.xemTrang,
    d.batDauForm,
    d.boForm,
    (d.tyLeBoForm * 100).toFixed(2),
    d.lapLaSo,
    d.coGioSinh,
    d.chuaRoGio,
    (d.tyLeChuaRoGio.rate * 100).toFixed(2),
    d.xemGia,
    d.bamMua79,
    d.bamMua149,
    d.bamMuaTong,
    (d.clickPerChart.rate * 100).toFixed(2),
    (d.clickPerChart.lower * 100).toFixed(2),
    (d.clickPerChart.upper * 100).toFixed(2),
    d.guiLienHe,
    (d.leadPerChart.rate * 100).toFixed(2),
    (d.leadPerChart.lower * 100).toFixed(2),
    (d.leadPerChart.upper * 100).toFixed(2),
    d.soLeadTrongBang,
    d.danhGia.trangThai,
  ]);

  return (
    '\uFEFF' +
    [headers, ...rows].map((r) => r.map(escapeCsvCell).join(',')).join('\r\n') +
    '\r\n'
  );
}

export function xuatCsvLeads(leads: R1LeadRecord[]): string {
  const headers = [
    'id',
    'email_hoac_zalo',
    'nut_gia_da_bam',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'thoi_diem_dong_y',
    'han_xoa',
    'ngay_tao',
  ];
  const rows = leads.map((l) => [
    l.id,
    l.emailHoacZalo,
    l.nutGiaDaBam,
    l.utmSource,
    l.utmMedium,
    l.utmCampaign,
    l.dongYLuc,
    l.hanXoa,
    l.createdAt,
  ]);
  return (
    '\uFEFF' +
    [headers, ...rows].map((r) => r.map(escapeCsvCell).join(',')).join('\r\n') +
    '\r\n'
  );
}
