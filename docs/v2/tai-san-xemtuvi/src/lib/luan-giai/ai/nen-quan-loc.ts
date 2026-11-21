// Đoạn nền Quan Lộc cho Vận năm 2027 (mảng Sự nghiệp): S4/S5, nenVcd, nguồn N1 (L-5e7bce, L-608305).
import type { Cung, LaSo, Sao } from '@/lib/tuvi';
import quyTac1 from './quy-tac.json';
import maNC12 from './quy-tac-van/ma-nghien-cuu-12-cung.json';
import nguonMa from './quy-tac-van/nguon-ma-12-cung.json';
import { lamSachCau } from './index';

const Q1 = quyTac1 as unknown as { id: string; noiDung: string; nguon: string }[];
const MA = maNC12 as Record<string, string[]>;
const NG = nguonMa as Record<string, string[]>;
export const SAT = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];
const PS_ID: Record<string, string> = { 'Kình Dương': 'QL-PS-8', 'Đà La': 'QL-PS-9', 'Hỏa Tinh': 'QL-PS-10', 'Linh Tinh': 'QL-PS-11', 'Địa Không': 'QL-PS-12', 'Địa Kiếp': 'QL-PS-13' };
export const CAT = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt'];
const CHAN_DUOI_18 = /^QL-S04-|^QL-S07-BINH$|^QL-S14-(BINH|HAM)$/;
const saoCua = (c: Cung): Sao[] => [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh];
const noi = (id: string) => lamSachCau(Q1.find((q) => q.id === id)!.noiDung);
// Đoạn nền theo sao và độ sáng: QL-Snn-TOT (Miếu/Vượng/Đắc), -BINH, -HAM (bộ 14 đoạn trong quy-tac.json).
const DO_SANG_HAU_TO: Record<string, string> = { 'Miếu': 'TOT', 'Vượng': 'TOT', 'Đắc': 'TOT', 'Bình': 'BINH', 'Hãm': 'HAM' };
const Q_SAO = Q1 as unknown as { id: string; noiDung: string; sao: string[] }[];
function doanSao(s: Sao): { id: string; noiDung: string } | undefined {
  const hau = DO_SANG_HAU_TO[s.dacTinhTen ?? ''] ?? 'TOT';
  return Q_SAO.find((q) => q.id.endsWith('-' + hau) && /^QL-S\d\d-/.test(q.id) && q.sao[0] === s.ten);
}
/** Vế "sau dấu hai chấm" của câu đầu: "Thái Dương hãm tại Quan Lộc: <vế>. Nên…" → "<vế>". */
const veCauDau = (noiDung: string) => noiDung.split(/(?<=\.)\s/)[0].replace(/^[^:]+:\s*/, '').replace(/\.$/, '');
const tenSao = (s: Sao) => {
  const t = [s.dacTinhTen?.toLowerCase(), s.hoa].filter(Boolean).join(', ');
  return t ? `${s.ten} (${t})` : s.ten;
};
export function catTinhTamPhuong(ls: LaSo): string[] {
  return ['Quan Lộc', 'Mệnh', 'Tài Bạch', 'Phu Thê'].flatMap((ten) => {
    const c = ls.cung.find((x) => x.ten === ten)!;
    return saoCua(c).filter((s) => CAT.includes(s.ten)).map((s) => `${s.ten} ở ${c.ten}`);
  });
}

export function nenQuanLoc(ls: LaSo, namXem: number, nen: { quyTacId: string; text: string; nguon: string }) {
  const tuoi = namXem - ls.duong.nam;
  const id = nen.quyTacId;
  if (tuoi < 15 || /-HAM$/.test(id) || (tuoi < 18 && CHAN_DUOI_18.test(id)) || !MA[id]) return null;
  const g = ls.cung.find((c) => c.ten === 'Quan Lộc')!;
  const ma = [...MA[id]];
  const cau = [id === 'QL-VCD' && tuoi >= 30 ? nen.text.replace('nên thử vài vai trò khác nhau giai đoạn đầu rồi chọn hướng', 'nên chọn hướng') : nen.text];
  const tt = [g.tuan ? 'Tuần' : '', g.triet ? 'Triệt' : ''].filter(Boolean);
  const ky = saoCua(g).filter((s) => s.hoa === 'Hóa Kỵ');
  const sat = SAT.filter((t) => saoCua(g).some((s) => s.ten === t));
  const a: string[] = [];
  if (g.chinhTinh.length) a.push(g.chinhTinh.map(tenSao).join(', '));
  // S5 (phiếu Thư L-5e7bce): hai chính tinh đồng cung thì nối một câu ngắn của sao thứ hai theo độ sáng của nó.
  const saoNen = (Q1.find((q) => q.id === id) as unknown as { sao?: string[] } | undefined)?.sao?.[0];
  for (const s of g.chinhTinh.filter((x) => x.ten !== saoNen)) {
    const d = doanSao(s);
    if (!d) continue;
    const ham = s.dacTinhTen === 'Hãm';
    cau.push(ham ? `${s.ten} cùng cung ở thế hãm: ${veCauDau(d.noiDung)}.` : `${s.ten} cùng cung thêm nét: ${veCauDau(d.noiDung)}.`);
    ma.push(...(MA[d.id] ?? []));
  }
  const kyPhu = ky.filter((s) => !g.chinhTinh.includes(s));
  if (kyPhu.length) a.push(kyPhu.map((s) => `${s.ten} (Hóa Kỵ)`).join(', '));
  if (sat.length) a.push(sat.join(', '));
  if (tt.length) a.push('có ' + tt.join(' và '));
  if (!g.chinhTinh.length) {
    const doi = ls.cung[(g.chi + 6) % 12];
    a.unshift('vô chính diệu');
    a.push(`mượn ${doi.chinhTinh.map(tenSao).join(', ')} ở ${doi.ten} (${doi.tenChi})`);
    cau.push(`Vì cung không có chính tinh, phần này mượn ${doi.chinhTinh.map((s) => s.ten).join(', ')} từ cung ${doi.ten} để luận, lực yếu hơn sao đóng ngay tại cung.`);
    // S4 (phiếu Thư L-5e7bce): sao mượn ở thế hãm hoặc mang Hóa Kỵ thì nói mặt cần chú ý, nhẹ hơn khi sao ở ngay cung (CHUNG-VCD-01).
    for (const s of doi.chinhTinh.filter((x) => x.dacTinhTen === 'Hãm')) {
      const d = doanSao(s);
      if (!d) continue;
      cau.push(`${s.ten} mượn về ở thế hãm, nên mang theo mặt cần chú ý của sao này, ở mức nhẹ hơn so với khi sao đóng ngay tại Quan Lộc: ${veCauDau(d.noiDung)}.`);
      ma.push(...(MA[d.id] ?? []), 'CHUNG-VCD-01');
    }
    const kyMuon = doi.chinhTinh.filter((x) => x.hoa === 'Hóa Kỵ');
    const nhatNguyetSuuMui = ['Sửu', 'Mùi'].includes(doi.tenChi) && ['Thái Dương', 'Thái Âm'].every((t) => doi.chinhTinh.some((x) => x.ten === t));
    if (kyMuon.length && !nhatNguyetSuuMui) {
      cau.push(`${kyMuon.map((x) => x.ten).join(', ')} mang Hóa Kỵ chiếu sang: công việc có lúc gặp chuyện phiền lòng, dễ trắc trở, nhưng ở mức nhẹ hơn so với khi Hóa Kỵ đóng ngay tại Quan Lộc.`);
      ma.push('QUAN-HOA-03', 'CHUNG-VCD-01');
    }
    const cat = catTinhTamPhuong(ls);
    if (cat.length) {
      a.push(`cát tinh hội về: ${cat.join(', ')}`);
      cau.push(`Có ${cat.join(', ')} hội về (nhóm sao trợ lực, học vấn, quý nhân), nên thế này vẫn có thể tốt.`);
      ma.push('CHUNG-SP-01');
    } else cau.push('Tam phương không có cát tinh hội về, nên việc chính là xây nền tảng vững trước.');
    if (tt.length) cau.push(`Cung vô chính diệu gặp ${tt.join(' và ')} được phái Việt coi là thế thuận hơn: lúc đầu thường chậm, về sau rõ dần; khi việc tiến nhanh, nên giữ nhịp đều.`);
    else ma.splice(0, ma.length, ...ma.filter((m) => m !== 'CHUNG-VCD-03')); // VCD-03 chỉ dùng khi có Tuần/Triệt (N1)
  } else if (tt.length) {
    if (ky.length || sat.length) { cau.push(`Cung Quan Lộc có ${tt.join(' và ')}: cả mặt mạnh lẫn mặt cần chú ý đều dịu đi, ít bứt phá lớn mà cũng ít vấp lớn.`); ma.push('CHUNG-TUAN-02', 'CHUNG-TUAN-06'); }
    else { cau.push(`Cung Quan Lộc có ${tt.join(' và ')}: những nét trên thường bộc lộ chậm hơn, thuận lợi đến chậm và cần tự lực.`); ma.push('CHUNG-TUAN-02', 'CHUNG-TUAN-05'); }
  }
  if (ky.length) { cau.push(noi('QL-HOA-3')); ma.push(...MA['QL-HOA-3']); }
  for (const s of sat) { cau.push(noi(PS_ID[s])); ma.push(...MA[PS_ID[s]]); }
  const maU = [...new Set(ma)];
  // (c) chỉ in 3 tên sách đầu: nguồn của câu Tuần/Triệt (CHUNG-VCD-03, CHUNG-TUAN-05) đưa lên trước để câu đó có nguồn (N1).
  const uuTien = maU.filter((m) => m === 'CHUNG-VCD-03' || m === 'CHUNG-TUAN-05');
  const nguon = [...new Set([nen.nguon, ...uuTien.flatMap((m) => NG[m] ?? []), ...maU.flatMap((m) => NG[m] ?? [])])].join('; ');
  return { text: cau.join(' '), canCu: `Cung Quan Lộc (${g.tenChi}): ${a.join('; ')}.`, nguon, maNghienCuu: maU };
}

/** Từ L-28bc46 (2a81acf) Quan Lộc vô chính diệu không còn câu QL-VCD ở mục phong-cach (nhường KHUNG-quan-loc-VCD-chinh*):
 * NAM-MANG-07 lấy thẳng QL-VCD từ quy-tac.json làm đoạn nền. */
export function nenVcd(ls: LaSo) {
  const g = ls.cung.find((c) => c.ten === 'Quan Lộc')!;
  if (g.chinhTinh.length) return undefined;
  const q = (Q1 as unknown as { id: string; noiDung: string; nguon: string; truongPhai: string }[]).find((x) => x.id === 'QL-VCD')!;
  return { text: lamSachCau(q.noiDung), thamChieu: { quyTacId: q.id, sao: [] as string[], cung: 'Quan Lộc', nguon: q.nguon, truongPhai: q.truongPhai } };
}
