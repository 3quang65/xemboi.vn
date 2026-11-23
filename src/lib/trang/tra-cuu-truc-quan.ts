// Dữ liệu trực quan cho nhóm trang tra cứu: ngũ hành, con giáp, 60 hoa giáp, năm sinh (docs/v2/22, Lệnh 45).
// Chỉ ghép số liệu và quan hệ đã có nguồn (bảng quan hệ và trích dẫn ở bat-tu-truc-quan.ts); không lời luận.
import { DIA_CHI } from '@/lib/tuvi-v2/am-lich';
import { CON_GIAP, HOA_GIAP, namCuaHoaGiap, namSinh, quanHeHanh, type Hanh } from './can-chi';
import { HINH, LUC_HAI, LUC_HOP, TAM_HOI, TAM_HOP, TU_HINH, type MaTrichBatTu } from './bat-tu-truc-quan';
import type { DocNhanhChung, TheTrucQuan } from './phan-truc-quan';

// ================= Vòng ngũ hành =================

/** Thứ tự đặt trên vòng, theo chiều kim đồng hồ từ đỉnh: đi một bước là tương sinh, đi hai bước là tương khắc. */
export const VONG_NGU_HANH: Hanh[] = ['Hỏa', 'Thổ', 'Kim', 'Thủy', 'Mộc'];

export type CanhNguHanh = { tu: Hanh; den: Hanh; loai: 'sinh' | 'khac'; noiBat: boolean };
export type VongNguHanh = {
  dinh: { hanh: Hanh; goc: number; x: number; y: number; vaiTro?: 'chinh' | 'sinh-ra' | 'duoc-sinh' | 'khac' | 'bi-khac' }[];
  canh: CanhNguHanh[];
};

/**
 * 5 đỉnh trên đường tròn bán kính 1 (tâm 0,0; y hướng xuống như SVG), 5 cạnh tương sinh (vòng ngoài)
 * và 5 cạnh tương khắc (ngôi sao). `chon` làm nổi 4 cạnh nối với hành đó.
 */
export function vongNguHanh(chon?: Hanh): VongNguHanh {
  const qh = chon ? quanHeHanh(chon) : undefined;
  const vaiTro = (h: Hanh) => {
    if (!qh) return undefined;
    if (h === chon) return 'chinh' as const;
    if (h === qh.sinhRa) return 'sinh-ra' as const;
    if (h === qh.duocSinhBoi) return 'duoc-sinh' as const;
    if (h === qh.khac) return 'khac' as const;
    return 'bi-khac' as const;
  };
  const dinh = VONG_NGU_HANH.map((hanh, i) => {
    const goc = -90 + i * 72;
    const r = (goc * Math.PI) / 180;
    return { hanh, goc, x: Math.round(Math.cos(r) * 1e4) / 1e4, y: Math.round(Math.sin(r) * 1e4) / 1e4, vaiTro: vaiTro(hanh) };
  });
  const canh: CanhNguHanh[] = [];
  for (let i = 0; i < 5; i++) {
    const tu = VONG_NGU_HANH[i];
    for (const [buoc, loai] of [[1, 'sinh'], [2, 'khac']] as const) {
      const den = VONG_NGU_HANH[(i + buoc) % 5];
      canh.push({ tu, den, loai, noiBat: !!chon && (tu === chon || den === chon) });
    }
  }
  return { dinh, canh };
}

// ================= Con giáp =================

export type QuanHeConGiap = {
  chi: string;
  tamHop: { chi: string[]; hanh: Hanh };
  tamHoi: { chi: string[]; hanh: Hanh };
  lucHop: string;
  xung: string;
  hai: string;
  /** Nhóm tương hình chứa chi này (nếu có) và các chi cùng nhóm. */
  hinh: { nhom: 'vo-an' | 'tri-the' | 'vo-le'; chi: string[] } | null;
  tuHinh: boolean;
  /** Mã trích dẫn nguyên văn (TRICH_BAT_TU) cho từng loại quan hệ. */
  trich: Record<'tamHop' | 'tamHoi' | 'lucHop' | 'xung' | 'hai' | 'hinh', MaTrichBatTu[]>;
};

const cap = (ds: [number, number, ...unknown[]][], a: number) => {
  const c = ds.find(([x, y]) => x === a || y === a)!;
  return c[0] === a ? c[1] : c[0];
};

export function quanHeConGiap(chi: number): QuanHeConGiap {
  const i = ((chi % 12) + 12) % 12;
  const th = TAM_HOP.find(([ba]) => ba.includes(i))!;
  const thoi = TAM_HOI.find(([ba]) => ba.includes(i))!;
  const h = HINH.filter(([a, b]) => a === i || b === i);
  const hinh = h.length
    ? { nhom: h[0][2], chi: [...new Set(HINH.filter((x) => x[2] === h[0][2]).flatMap(([a, b]) => [a, b]))].map((k) => DIA_CHI[k]) }
    : null;
  return {
    chi: DIA_CHI[i],
    tamHop: { chi: th[0].map((k) => DIA_CHI[k]), hanh: th[1] },
    tamHoi: { chi: thoi[0].map((k) => DIA_CHI[k]), hanh: thoi[1] },
    lucHop: DIA_CHI[cap(LUC_HOP, i)],
    xung: DIA_CHI[(i + 6) % 12],
    hai: DIA_CHI[cap(LUC_HAI, i)],
    hinh,
    tuHinh: TU_HINH.includes(i),
    trich: {
      tamHop: ['tamHop'], tamHoi: ['tamHoi'], lucHop: ['lucHop', 'lucHop2'], xung: ['xung', 'xungKhongVoiDoan'], hai: ['hai'],
      hinh: hinh
        ? ['hinh', ...(hinh.nhom === 'vo-an' ? ['hinhVoAn' as const] : hinh.nhom === 'tri-the' ? ['hinhTriThe' as const] : []), 'hinhKhongVoiDoan']
        : TU_HINH.includes(i) ? ['tuHinh', 'hinhKhongVoiDoan'] : [],
    },
  };
}

/** 12 con giáp trên vòng tròn: Tý ở đỉnh, đi theo chiều kim đồng hồ, mỗi chi 30°. */
export function vongConGiap(): { chi: string; ten: string; slug: string; goc: number; hanh: Hanh }[] {
  return CON_GIAP.map((c, i) => ({ chi: c.chi, ten: c.ten, slug: c.slug, goc: i * 30, hanh: c.hanhChi }));
}

// ================= 60 hoa giáp =================

export type OHoaGiap = { stt: number; ten: string; slug: string; napAm: string; hanh: Hanh; cacNam: number[]; laNamNay: boolean };

/** 60 ô theo thứ tự hoa giáp (Giáp Tý = 1), mỗi ô kèm các năm âm trong khoảng; đánh dấu năm âm `namNay`. */
export function luoi60HoaGiap(namNay: number, tu = 1924, den = 2043): OHoaGiap[] {
  return HOA_GIAP.map((h) => {
    const cacNam = namCuaHoaGiap(h, tu, den);
    return { stt: h.stt, ten: h.ten, slug: h.slug, napAm: h.napAm, hanh: h.hanh, cacNam, laNamNay: cacNam.includes(namNay) };
  });
}

// ================= Năm sinh =================

export function docNhanhNamSinh(nam: number, namXem: number): DocNhanhChung {
  const t = namSinh(nam);
  const tuoi = t.tuoiAm(namXem);
  const vn = (iso: string) => iso.split('-').reverse().join('/');
  const qh = conGiapChi(t.chi);
  const cau = `Sinh năm âm ${nam} là tuổi ${t.canChi} (${t.conGiap}), nạp âm ${t.napAm} hành ${t.hanh}; `
    + `năm âm này tính từ Tết ${vn(t.tuNgay)} tới ${vn(t.denNgay)}. Năm ${namXem} tròn ${tuoi} tuổi mụ.`;
  const the: TheTrucQuan[] = [
    { ma: 'can-chi', nhan: 'Can chi', giaTri: t.canChi, hanh: t.hanh, chiTiet: `Thứ ${t.hoaGiap.stt}/60 trong vòng hoa giáp. Tuổi ${t.conGiap}.` },
    { ma: 'nap-am', nhan: 'Nạp âm', giaTri: t.napAm, hanh: t.hanh, chiTiet: `Hành ${t.hanh}: sinh ${t.quanHe.sinhRa}, được ${t.quanHe.duocSinhBoi} sinh; khắc ${t.quanHe.khac}, bị ${t.quanHe.biKhacBoi} khắc.` },
    { ma: 'cung-phi', nhan: 'Cung phi', giaTri: `Nam ${t.cungPhiNam.ten} · Nữ ${t.cungPhiNu.ten}`, chiTiet: `Nam: ${t.cungPhiNam.nhom}. Nữ: ${t.cungPhiNu.nhom}.` },
    { ma: 'tuoi', nhan: `Tuổi mụ năm ${namXem}`, giaTri: String(tuoi), chiTiet: `Theo bát tự, tuổi đổi ở Lập xuân (${vn(t.lapXuan)}), không ở Tết.` },
    { ma: 'quan-he', nhan: 'Tam hợp · lục hợp · xung', giaTri: `${qh.tamHop.chi.join(' ')} · ${qh.lucHop} · ${qh.xung}`, chiTiet: `Tam hợp ${qh.tamHop.hanh} cục ${qh.tamHop.chi.join(', ')}; lục hợp với ${qh.lucHop}; xung với ${qh.xung}; hại với ${qh.hai}.` },
  ];
  return { cau, the };
}

const conGiapChi = (chi: string) => quanHeConGiap((DIA_CHI as readonly string[]).indexOf(chi));

