// Dữ liệu trực quan cho tử vi, kinh dịch, xem tuổi, bản đồ sao (docs/v2/22, Lệnh 43).
// Chỉ ghép số liệu đã tính của các lib gốc; không lời luận.
import type { Cung } from '@/lib/tuvi-v2';
import type { KetQuaLaSo } from './la-so';
import type { KetQuaGieo, Que } from './kinh-dich';
import type { KetQuaVoChong, MucDanhGia } from './xem-tuoi';
import type { DocNhanhChung, TheTrucQuan } from './phan-truc-quan';

// ================= Tử vi =================

export type TamPhuong = { ban: number; tamHop: [number, number]; xungChieu: number; tatCa: number[] };

/** Tam phương tứ chính của cung ở chi `chi` (0 = Tý): bản cung, hai cung tam hợp (+4, +8) và cung xung chiếu (+6). */
export function tamPhuongTuChinh(chi: number): TamPhuong {
  const m = (x: number) => ((x % 12) + 12) % 12;
  const ban = m(chi);
  const tamHop: [number, number] = [m(ban + 4), m(ban + 8)];
  const xungChieu = m(ban + 6);
  return { ban, tamHop, xungChieu, tatCa: [ban, tamHop[0], xungChieu, tamHop[1]] };
}

const tenSao = (c: Cung) => (c.chinhTinh.length
  ? c.chinhTinh.map((s) => `${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''}`).join(', ')
  : 'vô chính diệu');

export function docNhanhTuVi(kq: KetQuaLaSo): DocNhanhChung & { tamPhuongMenh: TamPhuong } {
  const ls = kq.laSo;
  const theoChi = (chi: number) => ls.cung.find((c) => c.chi === chi)!;
  const menh = ls.cung.find((c) => c.ten === 'Mệnh')!;
  const than = ls.cung.find((c) => c.laThan)!;
  const tp = tamPhuongTuChinh(menh.chi);
  const dv = kq.daiVan.find((d) => d.dangChay);
  const cau = `Mệnh an tại ${menh.tenChi}: ${tenSao(menh)}. Thân cư ${than.ten} tại ${than.tenChi}; `
    + `${ls.cuc}, bản mệnh ${ls.banMenh}`
    + (dv ? `; năm ${kq.namXem} đang ở đại vận cung ${dv.tenCung} (${dv.tuTuoi}–${dv.denTuoi} tuổi).` : '.');
  const the: TheTrucQuan[] = [
    { ma: 'menh', nhan: `Mệnh tại ${menh.tenChi}`, giaTri: menh.chinhTinh.map((s) => s.ten).join(' · ') || 'Vô chính diệu', hanh: menh.hanhCung, chiTiet: `${tenSao(menh)}.` },
    { ma: 'than', nhan: 'Thân cư', giaTri: than.ten, chiTiet: `Cung ${than.ten} tại ${than.tenChi}.` },
    { ma: 'cuc', nhan: 'Cục và bản mệnh', giaTri: ls.cuc, hanh: ls.cucHanh, chiTiet: `Bản mệnh ${ls.banMenh}. ${ls.sinhKhac}.` },
    {
      ma: 'tam-phuong', nhan: 'Tam phương tứ chính của Mệnh',
      giaTri: tp.tatCa.map((c) => theoChi(c).ten).join(' · '),
      chiTiet: `Xung chiếu ${theoChi(tp.xungChieu).ten} (${tenSao(theoChi(tp.xungChieu))}); tam hợp ${tp.tamHop.map((c) => `${theoChi(c).ten} (${tenSao(theoChi(c))})`).join(', ')}.`,
    },
  ];
  if (dv) {
    the.push({
      ma: 'dai-van', nhan: 'Đại vận đang chạy', giaTri: `${dv.tenCung} · ${dv.canChi}`,
      chiTiet: `${dv.tuTuoi}–${dv.denTuoi} tuổi mụ (${dv.tuNam}–${dv.denNam}). Chính tinh: ${dv.chinhTinh.join(', ') || 'vô chính diệu'}.`,
    });
  }
  return { cau, the, tamPhuongMenh: tp };
}

// ================= Kinh dịch =================

export type DongHao = { thu: number; hao: 0 | 1; dong: boolean; haoBien: 0 | 1; giaTri?: number };

/** 6 hào từ dưới lên, để vẽ quẻ chủ cạnh quẻ biến. */
export function sauHao(kq: KetQuaGieo): DongHao[] {
  return kq.queChu.hao.map((h, i) => {
    const dong = kq.haoDong.includes(i + 1);
    return { thu: i + 1, hao: h, dong, haoBien: (dong ? 1 - h : h) as 0 | 1, giaTri: kq.giaTriHao?.[i] };
  });
}

const TEN_HAO = ['sơ', 'nhị', 'tam', 'tứ', 'ngũ', 'thượng'];
const tenQue = (q: Que) => `${q.ten} (quẻ ${q.so})`;

export function docNhanhQue(kq: KetQuaGieo): DocNhanhChung {
  const dong = kq.haoDong.map((n) => `hào ${TEN_HAO[n - 1]}`);
  const { queChu: q } = kq;
  const cau = `Quẻ chủ ${tenQue(q)}: trên ${q.thuong.ten} (${q.thuong.tuong}), dưới ${q.ha.ten} (${q.ha.tuong}); `
    + (kq.queBien ? `động ${dong.join(', ')}, biến thành ${tenQue(kq.queBien)}; ` : 'không có hào động; ')
    + `quẻ hỗ ${tenQue(kq.queHo)}.`;
  const the: TheTrucQuan[] = [
    { ma: 'que-chu', nhan: 'Quẻ chủ', giaTri: q.ten, chiTiet: `Quẻ số ${q.so}. Thượng quái ${q.thuong.ten}, hạ quái ${q.ha.ten}.` },
    {
      ma: 'hao-dong', nhan: 'Hào động', giaTri: kq.haoDong.length ? kq.haoDong.join(', ') : 'Không',
      chiTiet: kq.haoDong.length ? `${dong.join(', ')} (đếm từ dưới lên).` : 'Sáu hào đều tĩnh.',
    },
  ];
  if (kq.queBien) the.push({ ma: 'que-bien', nhan: 'Quẻ biến', giaTri: kq.queBien.ten, chiTiet: `Quẻ số ${kq.queBien.so}, do hào động đổi âm dương.` });
  the.push({ ma: 'que-ho', nhan: 'Quẻ hỗ', giaTri: kq.queHo.ten, chiTiet: `Quẻ số ${kq.queHo.so}, lấy hào 2–4 làm hạ quái, hào 3–5 làm thượng quái.` });
  return { cau, the };
}

// ================= Xem tuổi =================

const MUC_THE: Record<MucDanhGia, TheTrucQuan['muc']> = { tot: 'tot', binh: 'binh', xau: 'diu' };
const TEN_MUC: Record<MucDanhGia, string> = { tot: 'Hợp', binh: 'Bình thường', xau: 'Chưa hợp' };

export function docNhanhXemTuoi(kq: KetQuaVoChong): DocNhanhChung {
  const cau = `Chồng ${kq.chong.canChi} ${kq.chong.nam}, vợ ${kq.vo.canChi} ${kq.vo.nam}: trong ${kq.tieuChi.length} tiêu chí, `
    + `${kq.dem.tot} hợp, ${kq.dem.binh} bình thường, ${kq.dem.xau} chưa hợp.`;
  const the = kq.tieuChi.map((t): TheTrucQuan => ({
    ma: t.ma, nhan: t.ten.split(':')[0], giaTri: TEN_MUC[t.muc], muc: MUC_THE[t.muc], chiTiet: t.giaiThich,
  }));
  return { cau, the };
}

// ================= Bản đồ sao: giãn nhãn =================

/**
 * Giãn các nhãn đặt trên vòng tròn để hai nhãn liền nhau cách ít nhất `khoang` độ, mỗi nhãn
 * lệch khỏi vị trí thật ít nhất có thể và giữ thứ tự. Trả góc vẽ nhãn, cùng thứ tự với đầu vào.
 * Vị trí thật của thiên thể không đổi; khi nhãn lệch, trang vẽ một vạch nối nhãn về điểm thật.
 */
export function gianNhan(goc: number[], khoang = 8): number[] {
  const chuan = (g: number) => ((g % 360) + 360) % 360;
  const n = goc.length;
  if (n < 2) return goc.map(chuan);
  const k = Math.min(khoang, 360 / n);
  const thuTu = goc.map((g, i) => ({ g: chuan(g), i })).sort((a, b) => a.g - b.g);
  // Cắt vòng ở khe rộng nhất để thành bài toán trên đoạn thẳng.
  let cat = 0;
  let rong = -1;
  for (let j = 0; j < n; j++) {
    const kh = j === n - 1 ? thuTu[0].g + 360 - thuTu[j].g : thuTu[j + 1].g - thuTu[j].g;
    if (kh > rong) { rong = kh; cat = (j + 1) % n; }
  }
  const day = Array.from({ length: n }, (_, j) => thuTu[(cat + j) % n]);
  const x = day.map((d) => d.g + (d.g < day[0].g ? 360 : 0));
  // Gộp cụm: mỗi cụm đặt cách đều k, giữa cụm bằng trung bình vị trí thật (đã trừ phần dịch trong cụm).
  type Cum = { dau: number; so: number; tong: number };
  const batDau = (c: Cum) => c.tong / c.so - (k * (c.so - 1)) / 2;
  const cum: Cum[] = [];
  for (let j = 0; j < n; j++) {
    cum.push({ dau: j, so: 1, tong: x[j] });
    while (cum.length > 1) {
      const b = cum[cum.length - 1];
      const a = cum[cum.length - 2];
      if (batDau(a) + k * a.so <= batDau(b) + 1e-9) break;
      cum.pop();
      // tong là tổng vị trí thật; batDau trừ phần dịch k·t nên chỉ cần cộng dồn.
      a.tong += b.tong;
      a.so += b.so;
    }
  }
  const ra = new Array<number>(n);
  for (const c of cum) {
    const s = batDau(c);
    for (let t = 0; t < c.so; t++) ra[day[c.dau + t].i] = chuan(s + t * k);
  }
  return ra;
}
