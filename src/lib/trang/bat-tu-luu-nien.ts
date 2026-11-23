// Lưu niên và tam trụ cho trang bát tự (docs/v2/22, sau Lệnh 40). Chỉ số liệu, không lời luận.
import { DIA_CHI, THIEN_CAN, canChiNam } from '@/lib/tuvi-v2/am-lich';
import type { Hanh } from './can-chi';
import { HANH_CAN, HANH_CHI, lapLaSoBatTu, thapThan, type DauVaoBatTu, type LaSoBatTu, type ThapThan } from './bat-tu';
import { quanHeMang, type QuanHeTru, type ViTriTru } from './bat-tu-truc-quan';

const TEN_TRU = ['năm', 'tháng', 'ngày', 'giờ'] as const;

const viTri = (laSo: LaSoBatTu) => ({
  can: laSo.tru.map((t) => (THIEN_CAN as readonly string[]).indexOf(t.can)),
  chi: laSo.tru.map((t) => (DIA_CHI as readonly string[]).indexOf(t.chi)),
});

// ================= Lưu niên =================

/** Vị trí 4 là lưu niên (năm đang xem); 0..3 là bốn trụ. */
export type QuanHeLuuNien = Omit<QuanHeTru, 'tru'> & { tru: (ViTriTru | 4)[] };
export type LuuNienBatTu = {
  nam: number;
  canChi: string;
  hanhCan: Hanh;
  hanhChi: Hanh;
  thapThanCan: ThapThan;
  /** Chỉ các quan hệ có lưu niên tham gia. */
  quanHe: QuanHeLuuNien[];
  cau: string;
};

/**
 * Năm `nam` (can chi đổi ở Lập xuân năm đó) đặt cạnh 4 trụ: can hợp, lục hợp, xung, hình, hại,
 * tam hợp / tam hội mà lưu niên góp chữ. Không lời luận.
 */
export function luuNienBatTu(laSo: LaSoBatTu, nam: number): LuuNienBatTu {
  const { can, chi } = viTri(laSo);
  const cc = canChiNam(nam);
  const ds = quanHeMang([...can, cc.can], [...chi, cc.chi], [...TEN_TRU.map((t) => `trụ ${t}`), `năm ${nam}`])
    .filter((q) => q.tru.includes(4)) as QuanHeLuuNien[];
  const nhatChu = can[2];
  const thapThanCan = thapThan(nhatChu, cc.can);
  const cau = `Năm ${nam} là năm ${cc.ten} (tính từ Lập xuân), can ${cc.tenCan} là `
    + `${thapThanCan} của nhật chủ${cc.can === nhatChu ? ' (cùng can)' : ''}; `
    + (ds.length
      ? `${ds.length} quan hệ với lá số: ${ds.map((q) => `${q.ten.toLowerCase()} ${q.chu.join('–')}`).join(', ')}.`
      : 'không có hợp, xung, hình, hại với bốn trụ.');
  return { nam, canChi: cc.ten, hanhCan: HANH_CAN[cc.can], hanhChi: HANH_CHI[cc.chi], thapThanCan, quanHe: ds, cau };
}

/** 10 năm của một bước đại vận (`thuTu` 1..8), kèm can chi từng năm. */
export function namTrongDaiVan(laSo: LaSoBatTu, thuTu: number): { nam: number; canChi: string }[] {
  const dv = laSo.daiVan.ds.find((d) => d.thuTu === thuTu);
  if (!dv) return [];
  return Array.from({ length: 10 }, (_, i) => ({ nam: dv.tuNam + i, canChi: canChiNam(dv.tuNam + i).ten }));
}

// ================= Tam trụ (không rõ giờ) =================

export type TamTru = {
  /** Lá số lập với giờ 12:00 để lấy 3 trụ năm, tháng, ngày; trụ giờ KHÔNG dùng. */
  laSo: LaSoBatTu;
  demNguHanh: Record<Hanh, number>;
  thieuHanh: Hanh[];
  quanHe: QuanHeTru[];
  /** Các điểm có thể đổi tùy giờ sinh trong ngày (trụ năm / tháng đổi ở tiết, tuổi khởi vận). */
  chuaChac: string[];
  cau: string;
};

/**
 * Lập tam trụ khi không rõ giờ sinh: lấy năm, tháng, ngày; đếm ngũ hành trên 6 chữ; dò quan hệ
 * giữa 3 trụ. Thử hai đầu ngày (00:00 và 22:59) để báo trụ nào đổi nếu tiết rơi đúng ngày sinh.
 */
export function lapTamTru(v: Omit<DauVaoBatTu, 'gio' | 'phut'>): TamTru {
  const giua = lapLaSoBatTu({ ...v, gio: 12, phut: 0 });
  const dau = lapLaSoBatTu({ ...v, gio: 0, phut: 0 });
  const cuoi = lapLaSoBatTu({ ...v, gio: 22, phut: 59 });
  const chuaChac: string[] = [];
  for (const [k, ten] of [[0, 'năm'], [1, 'tháng']] as const) {
    if (dau.tru[k].canChi !== cuoi.tru[k].canChi) {
      chuaChac.push(`Trụ ${ten} đổi trong ngày sinh (${dau.tru[k].canChi} trước tiết, ${cuoi.tru[k].canChi} sau tiết); cần giờ sinh để biết chắc.`);
    }
  }
  const kv = (l: LaSoBatTu) => l.daiVan.khoiVan.nam * 12 + l.daiVan.khoiVan.thang;
  const [a, b] = [kv(dau), kv(cuoi)].sort((x, y) => x - y);
  if (a !== b) chuaChac.push(`Tuổi khởi vận dao động từ ${Math.floor(a / 12)} năm ${a % 12} tháng tới ${Math.floor(b / 12)} năm ${b % 12} tháng tùy giờ sinh.`);
  const demNguHanh: Record<Hanh, number> = { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 };
  for (const t of giua.tru.slice(0, 3)) { demNguHanh[t.hanhCan]++; demNguHanh[t.hanhChi]++; }
  const thieuHanh = (Object.keys(demNguHanh) as Hanh[]).filter((h) => demNguHanh[h] === 0);
  const { can, chi } = viTri(giua);
  const quanHe = quanHeMang(can.slice(0, 3), chi.slice(0, 3), TEN_TRU.slice(0, 3).map((t) => `trụ ${t}`)) as QuanHeTru[];
  const nc = giua.nhatChu;
  const cau = `Chưa rõ giờ sinh nên chỉ lập ba trụ: ${giua.tru.slice(0, 3).map((t) => t.canChi).join(', ')}. `
    + `Nhật chủ ${nc.can} ${nc.hanh}; ngũ hành đếm trên 6 chữ${thieuHanh.length ? `, chưa có ${thieuHanh.join(', ')}` : ''}. `
    + 'Trụ giờ còn trống, khi biết giờ sinh sẽ thêm một can một chi.';
  return { laSo: giua, demNguHanh, thieuHanh, quanHe, chuaChac, cau };
}
