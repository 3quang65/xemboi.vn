import { NGUONG_MAC_DINH, type DanhGiaAnchor } from '@/lib/seo/anchor';

export const DS_LOAI_CANH_BAO_QUET = [
  'MO_COI',
  'QUA_SAU',
  'LOI_HTTP',
  'NOINDEX_TRONG_SITEMAP',
  'CANONICAL_LECH',
] as const;

export const DS_LOAI_CANH_BAO = [
  ...DS_LOAI_CANH_BAO_QUET,
  'TUT_HANG',
  'TRUNG_Y_DINH',
  'ANCHOR_LECH',
  'NGUON_BI_HA_PHAM_VI',
] as const;

export const TEN_LOAI_CANH_BAO: Record<string, string> = {
  MO_COI: 'Trang mồ côi',
  QUA_SAU: 'Trang quá sâu (> 3)',
  LOI_HTTP: 'Liên kết lỗi / chuyển hướng HTTP',
  NOINDEX_TRONG_SITEMAP: 'Noindex trong sitemap',
  CANONICAL_LECH: 'Canonical lệch',
  TUT_HANG: 'Tụt hạng',
  TRUNG_Y_DINH: 'Trùng ý định',
  ANCHOR_LECH: 'Anchor lệch',
  NGUON_BI_HA_PHAM_VI: 'Nguồn bị hạ phạm vi',
};

export const TEN_MUC_DO: Record<number, string> = {
  1: 'Cao',
  2: 'Trung bình',
  3: 'Thấp',
};

export function nhanMucDo(mucDo: number) {
  const lop = mucDo === 1 ? 'xau' : mucDo === 2 ? 'vua' : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_MUC_DO[mucDo] ?? `Mức ${mucDo}`}</span>;
}

export const TEN_CANH_BAO_ANCHOR: Record<string, string> = {
  CHINH_XAC_NHIEU: 'Khớp chính xác từ khóa quá nhiều (> 50%)',
  MOT_ANCHOR_AP_DAO: 'Một anchor áp đảo (> 60%)',
  CHUNG_CHUNG_NHIEU: 'Anchor chung chung quá nhiều (> 30%)',
};

export const TEN_NGUON_LK: Record<string, string> = {
  QUET: 'Quét',
  QUY_TAC: 'Quy tắc',
  NGU_NGHIA: 'Ngữ nghĩa',
  TAY: 'Tay',
};

export const TEN_TRANG_THAI_LK: Record<string, string> = {
  DANG_CO: 'Đang có',
  DE_XUAT: 'Đề xuất',
  DA_DUYET: 'Đã duyệt',
  BO_QUA: 'Bỏ qua',
};

export function nhanTrangThaiLk(tt: string) {
  const lop = tt === 'DANG_CO' ? 'tot' : tt === 'DE_XUAT' || tt === 'DA_DUYET' ? 'vua' : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_TRANG_THAI_LK[tt] ?? tt}</span>;
}

export const TEN_KIEU_QUY_TAC: Record<string, string> = {
  KE_HOACH: 'Kế hoạch',
  DICH_CO_DINH: 'Đích cố định',
  CUNG_NHOM: 'Cùng nhóm',
  NAM_KE: 'Năm kề',
  HIEN_THI: 'Hiển thị',
};

export function dinhDangGioVn(d: Date | string | null | undefined): string {
  if (!d) return '–';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '–';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dt);
}

export function dinhDangNgayUtc(d: Date | string | null | undefined): string {
  if (!d) return '–';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '–';
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dt);
}

export type ChiTietCanhBao = {
  duong: string | null;
  tu: string | null;
  den: string | null;
  ma: number | null;
  viTri: string | null;
  anchor: string | null;
  doSau: number | null;
  robots: string | null;
  kieu: string | null;
  thucTe: string | null;
  mongDoi: string | null;
  trongSitemap: boolean | null;
};

export function docChiTietCanhBao(raw: unknown): ChiTietCanhBao {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    duong: typeof o.duong === 'string' ? o.duong : null,
    tu: typeof o.tu === 'string' ? o.tu : null,
    den: typeof o.den === 'string' ? o.den : null,
    ma: typeof o.ma === 'number' ? o.ma : null,
    viTri: typeof o.viTri === 'string' ? o.viTri : null,
    anchor: typeof o.anchor === 'string' ? o.anchor : null,
    doSau: typeof o.doSau === 'number' ? o.doSau : null,
    robots: typeof o.robots === 'string' ? o.robots : null,
    kieu: typeof o.kieu === 'string' ? o.kieu : null,
    thucTe: typeof o.thucTe === 'string' ? o.thucTe : null,
    mongDoi: typeof o.mongDoi === 'string' ? o.mongDoi : null,
    trongSitemap: typeof o.trongSitemap === 'boolean' ? o.trongSitemap : null,
  };
}

export function CanhBaoAnchorBadges({ dg }: { dg: DanhGiaAnchor }) {
  if (dg.tong === 0) {
    return <span style={{ color: 'var(--muted)' }}>Chưa có liên kết đang có</span>;
  }
  if (dg.tong < NGUONG_MAC_DINH.toiThieu && dg.canhBao.length === 0) {
    return <span className="qt-nhan">Chưa đủ {NGUONG_MAC_DINH.toiThieu} liên kết</span>;
  }
  if (dg.canhBao.length === 0) {
    return <span className="qt-nhan tot">Ổn</span>;
  }
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, verticalAlign: 'middle' }}>
      {dg.canhBao.map((c) => (
        <span key={c} className="qt-nhan xau">
          {TEN_CANH_BAO_ANCHOR[c] ?? c}
        </span>
      ))}
    </span>
  );
}
