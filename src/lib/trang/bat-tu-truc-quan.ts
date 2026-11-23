// Dữ liệu cho phần trình bày trực quan của lá số Bát tự (docs/v2/21, Lệnh 40).
// Chỉ gồm điều TÍNH ĐƯỢC hoặc TRÍCH ĐƯỢC:
//  - quanHeTru(): các quan hệ hợp / xung / hình / hại giữa 4 trụ, mỗi loại kèm đoạn nguyên văn có số đoạn trong kho RAG.
//  - docNhanh(): câu tóm tắt và thẻ sự kiện ghép từ số liệu lá số (mẫu câu cố định, không lời luận).
//  - GIAI_NGHIA_BAT_TU: nghĩa ngắn của thuật ngữ, chỉ nói cách tính, không nói tốt xấu.
// Không có "phá" (六破): kho sách hiện chưa có đoạn nguồn nói về lục phá, nên chưa hiện.
// Nguyên văn lưu kèm ở tests/trang/doi-chieu/quan-he-can-chi-nguon.json; test kiểm từng câu trích có đúng nguyên văn.
import { DIA_CHI, THIEN_CAN } from '@/lib/tuvi-v2/am-lich';
import type { Hanh } from './can-chi';
import { HANH_CHI, type LaSoBatTu, type ThapThan } from './bat-tu';

// ---------- Nguồn ----------

export const NGUON_BAT_TU = {
  tamMenh: {
    ma: 'KR3g0042', tenGoc: '三命通會', tenHanViet: 'Tam mệnh thông hội', tacGia: 'Vạn Dân Anh', nienDai: 'Minh',
    ghiCong: 'Văn bản: Kanripo, CC BY-SA 4.0', url: 'https://github.com/kanripo/KR3g0042',
  },
  hiepKy: {
    ma: 'KR3g0051', tenGoc: '欽定協紀辨方書', tenHanViet: 'Khâm định Hiệp kỷ biện phương thư', tacGia: 'Doãn Lộc và cộng sự', nienDai: 'Thanh, Càn Long',
    ghiCong: 'Văn bản: Kanripo, CC BY-SA 4.0', url: 'https://github.com/kanripo/KR3g0051',
  },
} as const;
export type MaNguonBatTu = keyof typeof NGUON_BAT_TU;

export type TrichDoan = {
  nguon: MaNguonBatTu;
  /** Số đoạn trong bảng rag_doan. */
  doanId: number;
  viTri: string;
  /** Nguyên văn; các khúc không liền nhau nối bằng "…". */
  nguyenVan: string;
};

export const TRICH_BAT_TU = {
  nhatChu: { nguon: 'tamMenh', doanId: 5374, viTri: '卷十 · 看命口訣', nguyenVan: '凡㸔命專以日干為主取提綱所用之物為命' },
  deCuong: { nguon: 'tamMenh', doanId: 4948, viTri: '卷七', nguyenVan: '其年為鈎時為權月為提綱日為銖兩八字以日為主' },
  canHop: {
    nguon: 'hiepKy', doanId: 6012, viTri: '卷一 · 四序',
    nguyenVan: '甲與己合乙與庚合丙與辛合丁與壬合戊與癸合甲己化土乙庚化金丙辛化水丁壬化木戊癸化火',
  },
  lucHop: {
    nguon: 'tamMenh', doanId: 4338, viTri: '卷二 · 論支元六合',
    nguyenVan: '夫合者和也乃隂陽相和其氣自合…是以一隂一陽和而謂之合子合丑寅合亥',
  },
  lucHop2: {
    nguon: 'tamMenh', doanId: 4339, viTri: '卷二 · 論支元六合',
    nguyenVan: '故卯與戍合…故辰與酉合…此巳與申合之數…此午與未合之數',
  },
  tamHop: {
    nguon: 'tamMenh', doanId: 4341, viTri: '卷二 · 論支元三合',
    nguyenVan: '如申子辰申乃子之母辰乃子之子…若三字缺其一則化不成局不可以三合化局論…巳酉丑寅午戍亥卯未皆然',
  },
  tamHoi: {
    nguon: 'hiepKy', doanId: 6007, viTri: '卷一 · 四序',
    nguyenVan: '寅卯辰屬木配東方也己午未屬火配南方也申酉戌屬金配西方也亥子丑屬水配北方也',
  },
  xung: { nguon: 'tamMenh', doanId: 4360, viTri: '卷二 · 論衝擊', nguyenVan: '地支取七位為衝猶天干取七位為煞之義如子午對衝' },
  xungKhongVoiDoan: { nguon: 'tamMenh', doanId: 4362, viTri: '卷二 · 論衝擊', nguyenVan: '觀諸詩見衝破有吉有凶不可槩論' },
  hinh: { nguon: 'tamMenh', doanId: 4350, viTri: '卷二 · 論三刑', nguyenVan: '子卯一刑也寅巳申二刑也丑未戍三刑也' },
  hinhVoAn: { nguon: 'tamMenh', doanId: 4351, viTri: '卷二 · 論三刑', nguyenVan: '然寅巳申何以謂之無恩' },
  hinhTriThe: { nguon: 'tamMenh', doanId: 4352, viTri: '卷二 · 論三刑', nguyenVan: '丑戌未何以謂之恃勢…子卯何以謂之無禮' },
  tuHinh: { nguon: 'tamMenh', doanId: 4353, viTri: '卷二 · 論三刑', nguyenVan: '辰午酉亥何以謂之自刑' },
  hinhKhongVoiDoan: { nguon: 'tamMenh', doanId: 4354, viTri: '卷二 · 論三刑', nguyenVan: '凡見刑不可便以凶論' },
  hai: {
    nguon: 'tamMenh', doanId: 4348, viTri: '卷二 · 論六害',
    nguyenVan: '六害者十二支凌戰之辰也子未相害者…丑午相害者…寅巳相害者…卯辰相害者…申亥相害者…酉戍相害者',
  },
} as const satisfies Record<string, TrichDoan>;
export type MaTrichBatTu = keyof typeof TRICH_BAT_TU;

// ---------- Quan hệ giữa các trụ ----------

/** Nhóm dùng cho màu và kiểu nét (giao diện phải phân biệt được cả khi không thấy màu). */
export type NhomQuanHe = 'hop' | 'chua-thanh' | 'xung' | 'hinh' | 'hai';
export type LoaiQuanHe = 'can-hop' | 'luc-hop' | 'tam-hop' | 'tam-hoi' | 'thieu-tam-hop' | 'xung' | 'hinh' | 'tu-hinh' | 'hai';

export const TEN_LOAI_QUAN_HE: Record<LoaiQuanHe, string> = {
  'can-hop': 'Thiên can ngũ hợp',
  'luc-hop': 'Lục hợp',
  'tam-hop': 'Tam hợp',
  'tam-hoi': 'Tam hội',
  'thieu-tam-hop': 'Tam hợp thiếu một chữ',
  xung: 'Lục xung',
  hinh: 'Tương hình',
  'tu-hinh': 'Tự hình',
  hai: 'Lục hại',
};
export const NHOM_CUA_LOAI: Record<LoaiQuanHe, NhomQuanHe> = {
  'can-hop': 'hop', 'luc-hop': 'hop', 'tam-hop': 'hop', 'tam-hoi': 'hop', 'thieu-tam-hop': 'chua-thanh',
  xung: 'xung', hinh: 'hinh', 'tu-hinh': 'hinh', hai: 'hai',
};
export const TEN_NHOM_QUAN_HE: Record<NhomQuanHe, string> = {
  hop: 'Hợp', 'chua-thanh': 'Chưa thành cục', xung: 'Xung', hinh: 'Hình', hai: 'Hại',
};

export type ViTriTru = 0 | 1 | 2 | 3; // 0 năm, 1 tháng, 2 ngày, 3 giờ (thứ tự trong LaSoBatTu.tru)
export type QuanHeTru = {
  loai: LoaiQuanHe;
  nhom: NhomQuanHe;
  ten: string;
  /** Quan hệ nằm ở hàng thiên can hay địa chi. */
  hang: 'can' | 'chi';
  /** Các trụ tham gia, theo thứ tự năm → giờ. */
  tru: ViTriTru[];
  /** Các chữ tham gia, cùng thứ tự với `tru`. */
  chu: string[];
  /** Hành của cục (tam hợp, tam hội) hoặc hành sách ghi là "hóa" (can hợp). */
  hanh?: Hanh;
  /** Với "thiếu một chữ": chữ còn thiếu. */
  thieu?: string;
  /** Câu mô tả sự kiện, không lời luận. */
  moTa: string;
  trich: MaTrichBatTu[];
};

const TEN_TRU = ['năm', 'tháng', 'ngày', 'giờ'] as const;

export const CAN_HOP: [number, number, Hanh][] = [[0, 5, 'Thổ'], [1, 6, 'Kim'], [2, 7, 'Thủy'], [3, 8, 'Mộc'], [4, 9, 'Hỏa']];
export const LUC_HOP: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
export const LUC_HAI: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
export const TAM_HOP: [number[], Hanh][] = [[[8, 0, 4], 'Thủy'], [[5, 9, 1], 'Kim'], [[2, 6, 10], 'Hỏa'], [[11, 3, 7], 'Mộc']];
export const TAM_HOI: [number[], Hanh][] = [[[2, 3, 4], 'Mộc'], [[5, 6, 7], 'Hỏa'], [[8, 9, 10], 'Kim'], [[11, 0, 1], 'Thủy']];
/** Tương hình theo cặp; nhóm 'vo-an' (Dần Tỵ Thân), 'tri-the' (Sửu Tuất Mùi), 'vo-le' (Tý Mão). */
export const HINH: [number, number, 'vo-an' | 'tri-the' | 'vo-le'][] = [
  [2, 5, 'vo-an'], [5, 8, 'vo-an'], [8, 2, 'vo-an'],
  [1, 10, 'tri-the'], [10, 7, 'tri-the'], [7, 1, 'tri-the'],
  [0, 3, 'vo-le'],
];
const TEN_HINH = { 'vo-an': 'hình vô ân (Dần, Tỵ, Thân)', 'tri-the': 'hình trì thế (Sửu, Tuất, Mùi)', 'vo-le': 'hình vô lễ (Tý, Mão)' };
export const TU_HINH = [4, 6, 9, 11]; // Thìn Ngọ Dậu Hợi

const laCap = (ds: [number, number, ...unknown[]][], a: number, b: number) =>
  ds.find(([x, y]) => (x === a && y === b) || (x === b && y === a));

const viTriTrongTru = (laSo: LaSoBatTu) => ({
  can: laSo.tru.map((t) => (THIEN_CAN as readonly string[]).indexOf(t.can)),
  chi: laSo.tru.map((t) => (DIA_CHI as readonly string[]).indexOf(t.chi)),
});

/** Tổ hợp chập k của [0..n-1]. */
function toHop(k: number, n: number): number[][] {
  const kq: number[][] = [];
  const di = (bd: number, ds: number[]) => {
    if (ds.length === k) { kq.push(ds); return; }
    for (let i = bd; i < n; i++) di(i + 1, [...ds, i]);
  };
  di(0, []);
  return kq;
}

/** Các quan hệ hợp / xung / hình / hại giữa 4 trụ của một lá số. */
export function quanHeTru(laSo: LaSoBatTu): QuanHeTru[] {
  const { can, chi } = viTriTrongTru(laSo);
  return quanHeMang(can, chi, TEN_TRU.map((t) => `trụ ${t}`)) as QuanHeTru[];
}

/**
 * Lõi dò quan hệ trên n vị trí bất kỳ (can[k], chi[k]; -1 = vị trí trống, bỏ qua).
 * `tenViTri[k]` dùng trong câu mô tả, vd "trụ năm", "lưu niên". `tru` trả về là chỉ số vị trí.
 */
export function quanHeMang(can: number[], chi: number[], tenViTri: string[]): (Omit<QuanHeTru, 'tru'> & { tru: number[] })[] {
  const n = can.length;
  type Q = Omit<QuanHeTru, 'tru'> & { tru: number[] };
  const kq: Q[] = [];
  const tenCap = (i: number, j: number, a: string, b: string) => `${a} (${tenViTri[i]}) và ${b} (${tenViTri[j]})`;
  const them = (q: Omit<Q, 'nhom' | 'ten'>) => kq.push({ ...q, nhom: NHOM_CUA_LOAI[q.loai], ten: TEN_LOAI_QUAN_HE[q.loai] });

  // Tam hợp, tam hội trước (đủ ba chữ khác nhau).
  const daDuCuc = new Set<string>();
  for (const [bo, loai] of [[TAM_HOP, 'tam-hop'], [TAM_HOI, 'tam-hoi']] as const) {
    for (const [ba, hanh] of bo) {
      const tru = ba.map((c) => chi.findIndex((x) => x === c));
      if (tru.every((t) => t >= 0)) {
        const sx = [...tru].sort((x, y) => x - y);
        daDuCuc.add(ba.join(','));
        them({
          loai, hang: 'chi', tru: sx, chu: sx.map((t) => DIA_CHI[chi[t]]), hanh,
          moTa: `${ba.map((c) => DIA_CHI[c]).join(', ')} đủ ba chữ, thành ${loai === 'tam-hop' ? 'tam hợp' : 'tam hội'} ${hanh} ${loai === 'tam-hop' ? 'cục' : '(phương)'}.`,
          trich: loai === 'tam-hop' ? ['tamHop'] : ['tamHoi'],
        });
      }
    }
  }
  // Tam hợp thiếu một chữ (có đúng 2 trong 3 chữ khác nhau).
  for (const [ba, hanh] of TAM_HOP) {
    if (daDuCuc.has(ba.join(','))) continue;
    const co = ba.filter((c) => chi.includes(c));
    if (co.length !== 2) continue;
    const thieu = ba.find((c) => !chi.includes(c))!;
    const tru = co.map((c) => chi.indexOf(c)).sort((x, y) => x - y);
    them({
      loai: 'thieu-tam-hop', hang: 'chi', tru, chu: tru.map((t) => DIA_CHI[chi[t]]), hanh, thieu: DIA_CHI[thieu],
      moTa: `Có ${co.map((c) => DIA_CHI[c]).join(' và ')} của tam hợp ${hanh} cục, thiếu ${DIA_CHI[thieu]}. Sách ghi thiếu một chữ thì không thành cục.`,
      trich: ['tamHop'],
    });
  }

  for (const [i, j] of toHop(2, n)) {
    if (chi[i] < 0 || chi[j] < 0) continue;
    const ten = (k: number) => THIEN_CAN[can[k]];
    const tc = (k: number) => DIA_CHI[chi[k]];
    const ch = laCap(CAN_HOP, can[i], can[j]);
    if (ch) {
      them({
        loai: 'can-hop', hang: 'can', tru: [i, j], chu: [ten(i), ten(j)], hanh: ch[2] as Hanh,
        moTa: `${tenCap(i, j, ten(i), ten(j))} là một cặp ngũ hợp; Hiệp kỷ ghi cặp này "hóa ${ch[2]}".`,
        trich: ['canHop'],
      });
    }
    const a = chi[i];
    const b = chi[j];
    if (laCap(LUC_HOP, a, b)) {
      them({ loai: 'luc-hop', hang: 'chi', tru: [i, j], chu: [tc(i), tc(j)], moTa: `${tenCap(i, j, tc(i), tc(j))} là một cặp lục hợp.`, trich: ['lucHop', 'lucHop2'] });
    }
    if (a !== b && (a - b + 12) % 12 === 6) {
      them({ loai: 'xung', hang: 'chi', tru: [i, j], chu: [tc(i), tc(j)], moTa: `${tenCap(i, j, tc(i), tc(j))} cách nhau bảy vị trí, là một cặp lục xung.`, trich: ['xung', 'xungKhongVoiDoan'] });
    }
    const h = laCap(HINH, a, b);
    if (h && a !== b) {
      them({ loai: 'hinh', hang: 'chi', tru: [i, j], chu: [tc(i), tc(j)], moTa: `${tenCap(i, j, tc(i), tc(j))} thuộc ${TEN_HINH[h[2] as keyof typeof TEN_HINH]}.`, trich: ['hinh', h[2] === 'vo-an' ? 'hinhVoAn' : 'hinhTriThe', 'hinhKhongVoiDoan'] });
    }
    if (a === b && TU_HINH.includes(a)) {
      them({ loai: 'tu-hinh', hang: 'chi', tru: [i, j], chu: [tc(i), tc(j)], moTa: `${tc(i)} gặp ${tc(j)} (${tenViTri[i]} và ${tenViTri[j]}): ${tc(i)} thuộc bốn chi tự hình.`, trich: ['tuHinh', 'hinhKhongVoiDoan'] });
    }
    if (laCap(LUC_HAI, a, b)) {
      them({ loai: 'hai', hang: 'chi', tru: [i, j], chu: [tc(i), tc(j)], moTa: `${tenCap(i, j, tc(i), tc(j))} là một cặp lục hại.`, trich: ['hai'] });
    }
  }
  const thuTu: LoaiQuanHe[] = ['tam-hop', 'tam-hoi', 'can-hop', 'luc-hop', 'thieu-tam-hop', 'xung', 'hinh', 'tu-hinh', 'hai'];
  return kq.sort((x, y) => thuTu.indexOf(x.loai) - thuTu.indexOf(y.loai) || x.tru[0] - y.tru[0]);
}

// ---------- Đọc nhanh ----------

export type MuaSinh = 'xuân' | 'hạ' | 'thu' | 'đông';
/** Mùa theo chi tháng (tháng tiết): Dần Mão Thìn xuân, Tỵ Ngọ Mùi hạ, Thân Dậu Tuất thu, Hợi Tý Sửu đông. */
export function muaTheoChiThang(chi: string): MuaSinh {
  const i = (DIA_CHI as readonly string[]).indexOf(chi);
  if (i < 0) throw new RangeError(`Chi không hợp lệ: ${chi}`);
  return (['đông', 'đông', 'xuân', 'xuân', 'xuân', 'hạ', 'hạ', 'hạ', 'thu', 'thu', 'thu', 'đông'] as const)[i];
}

export type TheDocNhanh = {
  ma: 'nhat-chu' | 'thang-sinh' | 'ngu-hanh' | 'dai-van' | 'quan-he';
  nhan: string;
  /** Chữ lớn trên thẻ. */
  giaTri: string;
  /** Hành để tô màu chữ lớn (nếu có). */
  hanh?: Hanh;
  /** Một hai dòng giải thích bằng số liệu. */
  chiTiet: string;
  trich?: MaTrichBatTu;
};
export type DocNhanhBatTu = { cau: string; the: TheDocNhanh[] };

const THU_TU_HANH: Hanh[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

/** Câu tóm tắt và thẻ sự kiện; mọi câu ghép từ số liệu của lá số. */
export function docNhanh(laSo: LaSoBatTu, quanHe: QuanHeTru[] = quanHeTru(laSo)): DocNhanhBatTu {
  const nc = laSo.nhatChu;
  const truThang = laSo.tru[1];
  const mua = muaTheoChiThang(truThang.chi);
  const dem = laSo.demNguHanh;
  const max = Math.max(...THU_TU_HANH.map((h) => dem[h]));
  const nhieuNhat = THU_TU_HANH.filter((h) => dem[h] === max);
  const dvChay = laSo.daiVan.ds.find((d) => d.dangChay);
  const demNhom = (n: NhomQuanHe) => quanHe.filter((q) => q.nhom === n).length;

  const vePhanHanh = laSo.thieuHanh.length
    ? `8 chữ nhiều ${nhieuNhat.join(' và ')} nhất, chưa có ${laSo.thieuHanh.join(', ')}`
    : `8 chữ đủ cả năm hành, nhiều ${nhieuNhat.join(' và ')} nhất`;
  const veVan = dvChay ? `; hiện đang ở đại vận ${dvChay.canChi} (${dvChay.tuNam}–${dvChay.tuNam + 9})` : '';
  const cau = `Nhật chủ ${nc.can} ${nc.hanh}, sinh tháng ${truThang.chi} (mùa ${mua}); ${vePhanHanh}${veVan}.`;

  const the: TheDocNhanh[] = [
    {
      ma: 'nhat-chu', nhan: 'Nhật chủ (can ngày)', giaTri: nc.can, hanh: nc.hanh,
      chiTiet: `${nc.amDuong} ${nc.hanh}. Sách lấy can ngày làm chủ khi xem bát tự; các trụ khác đối chiếu với can này để ra thập thần.`,
      trich: 'nhatChu',
    },
    {
      ma: 'thang-sinh', nhan: 'Tháng sinh (lệnh tháng)', giaTri: truThang.canChi, hanh: truThang.hanhChi,
      chiTiet: `Tháng ${truThang.chi}, mùa ${mua}, tính từ tiết ${laSo.tiet.truoc.ten} (${laSo.tiet.truoc.luc}) tới ${laSo.tiet.sau.ten}. Chi tháng hành ${truThang.hanhChi}.`,
      trich: 'deCuong',
    },
    {
      ma: 'ngu-hanh', nhan: 'Đếm ngũ hành 8 chữ', giaTri: THU_TU_HANH.map((h) => `${h} ${dem[h]}`).join(' · '),
      chiTiet: laSo.thieuHanh.length
        ? `Chưa có ${laSo.thieuHanh.join(', ')} trong 8 chữ. Đây là đếm số chữ, chưa tính tàng can và mùa sinh.`
        : 'Đủ năm hành trong 8 chữ. Đây là đếm số chữ, chưa tính tàng can và mùa sinh.',
    },
  ];
  if (dvChay) {
    the.push({
      ma: 'dai-van', nhan: 'Đại vận đang chạy', giaTri: dvChay.canChi, hanh: dvChay.hanhCan,
      chiTiet: `Vận ${dvChay.thuTu}/8, từ ${dvChay.tuNam} tới ${dvChay.tuNam + 9} (${dvChay.tuTuoi}–${dvChay.tuTuoi + 9} tuổi mụ). Đại vận đi ${laSo.daiVan.chieu}, khởi lúc ${laSo.daiVan.khoiVan.nam} tuổi ${laSo.daiVan.khoiVan.thang} tháng.`,
    });
  }
  const tongQH = quanHe.length;
  the.push({
    ma: 'quan-he', nhan: 'Quan hệ giữa các trụ', giaTri: tongQH ? `${tongQH} quan hệ` : 'Không có',
    chiTiet: tongQH
      ? (['hop', 'chua-thanh', 'xung', 'hinh', 'hai'] as NhomQuanHe[])
        .filter((n) => demNhom(n)).map((n) => `${TEN_NHOM_QUAN_HE[n]} ${demNhom(n)}`).join(', ') + '. Tam mệnh thông hội ghi gặp hình, xung không thể vội luận là dữ.'
      : 'Bốn trụ không có cặp hợp, xung, hình, hại nào theo các bảng đang dùng.',
    trich: tongQH ? 'hinhKhongVoiDoan' : undefined,
  });
  return { cau, the };
}

// ---------- Nghĩa ngắn của thuật ngữ (chỉ nói cách tính) ----------

export const GIAI_NGHIA_BAT_TU: Record<string, string> = {
  'Bát tự': 'Tám chữ can chi của năm, tháng, ngày, giờ sinh; mỗi trụ một can một chi.',
  'Nhật chủ': 'Thiên can của trụ ngày. Các can khác được gọi tên (thập thần) theo quan hệ ngũ hành với can này.',
  'Thập thần': 'Mười tên gọi quan hệ giữa một can với nhật chủ, xét theo sinh khắc và cùng hay khác âm dương.',
  'Tàng can': 'Các thiên can ẩn trong một địa chi: bản khí, trung khí, dư khí.',
  'Nạp âm': 'Hành gán cho cả cặp can chi theo bảng 60 hoa giáp, khác với hành riêng của can và của chi.',
  'Lệnh tháng': 'Chi của trụ tháng, tính theo tiết khí chứ không theo tháng âm lịch.',
  'Đại vận': 'Các chặng 10 năm, can chi đi tiếp hoặc đi lùi từ trụ tháng; chiều đi theo năm sinh âm dương và giới tính.',
  'Tiết khí': 'Hai mươi bốn mốc theo kinh độ Mặt Trời; 12 "tiết" trong đó là mốc đổi tháng của bát tự.',
  'Tỷ kiên': 'Can cùng hành, cùng âm dương với nhật chủ.',
  'Kiếp tài': 'Can cùng hành, khác âm dương với nhật chủ.',
  'Thực thần': 'Can do nhật chủ sinh ra, cùng âm dương.',
  'Thương quan': 'Can do nhật chủ sinh ra, khác âm dương.',
  'Thiên tài': 'Can bị nhật chủ khắc, cùng âm dương.',
  'Chính tài': 'Can bị nhật chủ khắc, khác âm dương.',
  'Thất sát': 'Can khắc nhật chủ, cùng âm dương.',
  'Chính quan': 'Can khắc nhật chủ, khác âm dương.',
  'Thiên ấn': 'Can sinh ra nhật chủ, cùng âm dương.',
  'Chính ấn': 'Can sinh ra nhật chủ, khác âm dương.',
  'Thiên can ngũ hợp': 'Năm cặp can: Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý.',
  'Lục hợp': 'Sáu cặp chi: Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi.',
  'Tam hợp': 'Bốn bộ ba chi: Thân Tý Thìn (Thủy), Tỵ Dậu Sửu (Kim), Dần Ngọ Tuất (Hỏa), Hợi Mão Mùi (Mộc).',
  'Tam hội': 'Bốn bộ ba chi cùng phương: Dần Mão Thìn (Đông, Mộc), Tỵ Ngọ Mùi (Nam, Hỏa), Thân Dậu Tuất (Tây, Kim), Hợi Tý Sửu (Bắc, Thủy).',
  'Lục xung': 'Sáu cặp chi đối nhau, cách bảy vị trí: Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi.',
  'Tương hình': 'Dần Tỵ Thân (vô ân), Sửu Tuất Mùi (trì thế), Tý Mão (vô lễ).',
  'Tự hình': 'Bốn chi Thìn, Ngọ, Dậu, Hợi khi gặp chính nó.',
  'Lục hại': 'Sáu cặp chi: Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn, Thân–Hợi, Dậu–Tuất.',
};

/** Nghĩa ngắn của một thập thần (dùng dưới tên thập thần trong trụ). */
export const nghiaThapThan = (t: ThapThan | 'Nhật chủ') => GIAI_NGHIA_BAT_TU[t];

/** Hành của chi tháng, dùng cho tiêu đề thẻ. */
export const hanhChiThang = (laSo: LaSoBatTu): Hanh => HANH_CHI[(DIA_CHI as readonly string[]).indexOf(laSo.tru[1].chi)];

// ================= Mốc giao vận =================

export type GiaoVan = {
  /** Năm, tháng (tuổi thực) từ lúc sinh tới lúc khởi vận. */
  sauSinh: { nam: number; thang: number };
  /** Tháng, năm dương lịch ước tính lúc giao vận (chỉ chính xác tới tháng vì phép tính làm tròn theo tháng). */
  thangDuong: number;
  namDuong: number;
  cau: string;
};

/**
 * Mốc giao vận đầu tiên theo dương lịch. Lá số ghi tuổi đại vận theo tuổi mụ, còn khởi vận
 * tính theo thời gian thực từ lúc sinh; câu này nói rõ cả hai để người xem không lẫn
 * (khảo sát thị trường thấy có trang trộn hai loại tuổi).
 */
export function giaoVan(laSo: LaSoBatTu): GiaoVan {
  const { thang, nam } = laSo.dauVao;
  const kv = laSo.daiVan.khoiVan;
  const tong = (thang - 1) + kv.thang;
  const thangDuong = (tong % 12) + 1;
  const namDuong = nam + kv.nam + Math.floor(tong / 12);
  const dv0 = laSo.daiVan.ds[0];
  const cau = `Đại vận đi ${laSo.daiVan.chieu}. Khởi vận sau khi sinh ${kv.nam} năm ${kv.thang} tháng`
    + ` (3 ngày tính 1 năm), tức khoảng tháng ${thangDuong}/${namDuong}.`
    + ` Vận đầu ${dv0.canChi} tính từ năm ${dv0.tuNam}, ghi theo tuổi mụ là ${dv0.tuTuoi} tuổi.`;
  return { sauSinh: { ...kv }, thangDuong, namDuong, cau };
}
