// Ngũ hành "khuyết" theo ba cách đếm (bài /bat-tu/ngu-hanh-khuyet). Đối chiếu: docs/v2/doi-chieu/tinh-yeu-goi-bai.md mục 3.2.
// Mục đích: cho người đọc thấy "khuyết" phụ thuộc cách đếm. Không chấm, không "bổ khuyết", không gợi ý vật phẩm.
// - Cách 1: 8 chữ (4 can, 4 chi), như lá số bát tự đang in.
// - Cách 2: 4 can + tàng can của 4 chi (mỗi can tàng đếm một lần, không trọng số; chi không đếm riêng để khỏi tính bản khí hai lần).
// - Cách 3: vượng, tướng, hưu, tù, tử của năm hành theo tháng sinh, Tam mệnh thông hội quyển 2 (đoạn 23391).
import { DIA_CHI, THIEN_CAN } from '@/lib/tuvi-v2/am-lich';
import { HANH_CAN, TANG_CAN, type LaSoBatTu } from './bat-tu';
import { quanHeHanh, type Hanh } from './can-chi';

export const NAM_HANH: readonly Hanh[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

export type DemHanh = Record<Hanh, number>;
const rong = (): DemHanh => ({ Mộc: 0, Hỏa: 0, Thổ: 0, Kim: 0, Thủy: 0 });
const thieu = (d: DemHanh) => NAM_HANH.filter((h) => d[h] === 0);

export type TrangThaiMua = 'Vượng' | 'Tướng' | 'Hưu' | 'Tù' | 'Tử';

/** Tam mệnh thông hội, quyển 2, "Luận ngũ hành vượng tướng hưu tù tử" (đoạn 23391). `nguyenVan` chỉ để đối chiếu, KHÔNG hiển thị. */
export const TRICH_VUONG_TUONG = {
  nguon: 'WS04', doanId: 23391, viTriViet: 'Tam mệnh thông hội, quyển 2 · Luận ngũ hành vượng tướng hưu tù tử',
  nguyenVan: '如春木旺，旺則生火…故火相；木用水生…故水休…火能克金…故金囚…所以春木克土則死。夏火旺…六月土旺…秋金旺…冬水旺',
  dich: 'Mùa xuân Mộc vượng; Mộc sinh Hỏa nên Hỏa tướng; Thủy sinh ra Mộc, con đã đắc thời thì cha mẹ lui, nên Thủy hưu; Hỏa khắc Kim nên Kim tù; Mộc khắc Thổ nên Thổ tử. Mùa hạ Hỏa vượng, tháng Sáu Thổ vượng, mùa thu Kim vượng, mùa đông Thủy vượng, các hành còn lại suy ra theo cùng lẽ ấy.',
} as const;

/** Cùng chương (đoạn 23392): sách dặn không vội luận cát hung theo vượng suy. */
export const TRICH_KHONG_VOI_LUAN = {
  nguon: 'WS04', doanId: 23392, viTriViet: 'Tam mệnh thông hội, quyển 2 · Luận ngũ hành vượng tướng hưu tù tử',
  nguyenVan: '凡推造化，見生旺者未必便作吉論，見休囚死絕未必便作凶言。如生旺太過，宜乎制伏，死絕不及，宜乎生扶，妙在識其通變。',
  dich: 'Phàm xét tạo hóa, thấy sinh vượng chưa chắc đã luận là tốt, thấy hưu tù tử tuyệt chưa chắc đã nói là xấu. Sinh vượng quá thì nên chế bớt, tử tuyệt không đủ thì nên sinh thêm; cái khéo là biết biến thông.',
} as const;

/**
 * Hành vượng theo chi tháng (tháng tiết): Dần Mão Thìn xuân (Mộc), Tỵ Ngọ hạ (Hỏa), Mùi tháng Sáu (Thổ),
 * Thân Dậu Tuất thu (Kim), Hợi Tý Sửu đông (Thủy). Sách chỉ nêu riêng tháng Sáu cho Thổ; Thìn, Tuất, Sửu xếp theo mùa (`theoMua` = true).
 */
export function hanhVuongTheoThang(chiThang: number): { hanh: Hanh; theoMua: boolean } {
  const bang: Hanh[] = ['Thủy', 'Thủy', 'Mộc', 'Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Kim', 'Thủy'];
  return { hanh: bang[chiThang], theoMua: [1, 4, 10].includes(chiThang) };
}

/** Vượng, tướng, hưu, tù, tử của năm hành khi hành `vuong` đang vượng (23391). */
export function nguTrangThai(vuong: Hanh): Record<Hanh, TrangThaiMua> {
  // Vượng sinh ra là tướng; sinh ra vượng là hưu; bị tướng khắc là tù; bị vượng khắc là tử.
  const tuong = quanHeHanh(vuong).sinhRa;
  const kq = {} as Record<Hanh, TrangThaiMua>;
  for (const h of NAM_HANH) {
    kq[h] = h === vuong ? 'Vượng' : h === tuong ? 'Tướng' : quanHeHanh(h).sinhRa === vuong ? 'Hưu' : quanHeHanh(tuong).khac === h ? 'Tù' : 'Tử';
  }
  return kq;
}

export type BaCachDem = {
  cach1: { dem: DemHanh; thieu: Hanh[] };
  cach2: { dem: DemHanh; thieu: Hanh[]; chiTiet: { tru: string; chi: string; tangCan: { can: string; hanh: Hanh }[] }[] };
  cach3: { chiThang: string; hanhVuong: Hanh; theoMua: boolean; trangThai: Record<Hanh, TrangThaiMua> };
};

export function baCachDem(ls: LaSoBatTu): BaCachDem {
  const d1 = rong(), d2 = rong();
  for (const t of ls.tru) { d1[t.hanhCan]++; d1[t.hanhChi]++; d2[t.hanhCan]++; }
  const chiTiet = ls.tru.map((t) => {
    const c = DIA_CHI.indexOf(t.chi as never);
    const tc = TANG_CAN[c].map((x) => ({ can: THIEN_CAN[x], hanh: HANH_CAN[x] }));
    for (const x of tc) d2[x.hanh]++;
    return { tru: t.ten, chi: t.chi, tangCan: tc };
  });
  const chiThang = DIA_CHI.indexOf(ls.tru[1].chi as never);
  const v = hanhVuongTheoThang(chiThang);
  return {
    cach1: { dem: d1, thieu: thieu(d1) },
    cach2: { dem: d2, thieu: thieu(d2), chiTiet },
    cach3: { chiThang: DIA_CHI[chiThang], hanhVuong: v.hanh, theoMua: v.theoMua, trangThai: nguTrangThai(v.hanh) },
  };
}
