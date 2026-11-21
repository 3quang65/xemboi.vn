// Lớp tổng hợp của bộ ghép luận giải (L-28bc46, docs/luan-giai/kiem-duyet-2.md mục 4 lỗi #3):
//  1. đoạn "Tóm lại" 2–3 câu đầu bài (cách cục chính, một điểm mạnh, một điểm cần chú ý), id TOM-LAI-*;
//  2. gộp sao cùng cung thành một câu (Hóa Lộc + Không/Kiếp, Hóa Quyền + Lộc Tồn, nhiều sát tinh), thay các câu sao phụ rời;
//  3. câu dung hòa khi Tuần/Triệt hay sát tinh nằm cùng cung với sao mang Hóa Lộc/Quyền/Khoa.
// Chỉ dùng sao và cung đã xuất hiện trong các nhận định đã khớp (pool); không thêm sao nào ngoài lá số.
import type { Cung, LaSo, Sao } from '@/lib/tuvi';

/** Một nhận định đã khớp (cùng hình dạng KetQuaKhop của index.ts). */
export interface MucKhop {
  sao: string[];
  yeuTo: string[];
  cungLienQuan?: string[];
  cau: string;
  uuTien: number;
  cungGoc: string;
  loai?: string;
  cachCuc?: string;
  phaCach?: boolean;
  q: { id: string; muc?: string; nguon: string; truongPhai: string };
}

export interface NhanDinhTH {
  text: string;
  thamChieu: { quyTacId: string; sao: string[]; cung: string; nguon: string; truongPhai: string; cungLienQuan?: string[]; yeuTo?: string[] };
}
export interface KetQuaTongHop {
  tomLai: NhanDinhTH[];
  /** Câu gộp/dung hòa, kèm mục đích đến. */
  them: { muc: string; n: NhanDinhTH }[];
  /** Mã nhận định rời được thay bằng câu gộp. */
  bo: Set<string>;
}

const TP = 'Tam hợp phái Việt';
const NGUON_TT_TB = 'Tử Vi Đẩu Số Toàn Thư (Hy Di Trần Đoàn); Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)';
const NGUON_TUAN = 'Tử Vi Nghiệm Lý Toàn Thư (Thiên Lương); Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)';
const SAT = ['Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];
const KK = ['Địa Không', 'Địa Kiếp'];
const SANG = ['Miếu', 'Vượng', 'Đắc'];
const HOA_TOT = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'];
const CHU_DE: Record<string, string> = {
  menh: 'tính cách và hướng đi', 'quan-loc': 'công việc và sự nghiệp', 'phu-the': 'chuyện tình cảm và hôn nhân', 'tai-bach': 'tiền bạc', 'dien-trach': 'nhà cửa và gia đạo',
};
const Y_HOA: Record<string, string> = {
  'Hóa Lộc': 'mở thêm cơ hội và nguồn lực',
  'Hóa Quyền': 'tăng khả năng chủ động và dẫn dắt',
  'Hóa Khoa': 'thêm sự tinh tế, danh tiếng tốt và người giúp đỡ',
};
/** Lời chuyện hao tán khi Hóa Lộc đồng cung Không/Kiếp (cùng ý KHUNG-*-HOA-Lộc-HT-* của tao-khung.cjs). */
const HAO_TAN: Record<string, string> = {
  menh: 'cơ hội có mở ra nhưng dễ hụt hoặc tan nhanh nếu hành động vội; nên chia việc thành bước nhỏ và chốt phần chắc trước',
  'quan-loc': 'cơ hội việc có nhưng dễ đổi hướng hoặc hụt giữa chừng; nên đặt mốc rõ và giữ phần việc chắc tay',
  'phu-the': 'duyên và điều kiện thuận nhưng dễ nghĩ khác lạ hoặc muốn đổi hướng; nên nói rõ điều mình cần và giữ cam kết',
  'tai-bach': 'dám chi để thu, nhưng thu chi dễ lên xuống; nên đặt quỹ dự phòng trước khi mở rộng',
  'dien-trach': 'điều kiện nhà cửa có thuận nhưng dễ hao phí khi sửa sang hay đổi chỗ ở; nên tính kỹ chi phí trước khi quyết',
};

const saoCua = (c: Cung): Sao[] => {
  const thay = new Set<string>();
  return [...c.chinhTinh, ...c.catTinh, ...c.hungTinh, ...c.phuTinh].filter((s) => !thay.has(s.ten) && !!thay.add(s.ten));
};
const hop = (v: string[]) => (v.length <= 1 ? v.join('') : `${v.slice(0, -1).join(', ')} và ${v[v.length - 1]}`);
// Khối "Tóm lại": mỗi nhận định một câu ≤ 20 từ (3 câu ≤ 60 từ). Lấy phương án đầu vừa giới hạn, hết thì lấy phương án ngắn nhất (cuối danh sách).
const SO_TU_TOI_DA = 20;
const demTu = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
const ngan = (...ds: string[]) => ds.find((t) => demTu(t) <= SO_TU_TOI_DA) ?? ds[ds.length - 1];
const duy = <T,>(v: T[]) => [...new Set(v)];

function viTri(goc: Cung, c: Cung): string | null {
  const d = (c.chi - goc.chi + 12) % 12;
  return d === 0 ? 'cung chính' : d === 6 ? 'cung xung chiếu' : d === 4 || d === 8 ? 'cung tam hợp' : null;
}
const nhan = (goc: Cung, c: Cung) => {
  const v = viTri(goc, c);
  return v && v !== 'cung chính' ? `${c.ten} (${v} của ${goc.ten})` : c.ten;
};
const nguonCua = (ds: MucKhop[]) => duy(ds.flatMap((x) => x.q.nguon.split('; '))).join('; ');

/** Thứ tự ưu tiên cung: cung chính, xung chiếu, tam hợp. */
const hangCung = (goc: Cung, c: Cung) => { const d = (c.chi - goc.chi + 12) % 12; return d === 0 ? 0 : d === 6 ? 1 : 2; };

interface SaoViTri { s: Sao; c: Cung }

export function tongHop(ls: LaSo, chuyenDe: string, cungChinh: string, pool: MucKhop[], dangCo: MucKhop[]): KetQuaTongHop {
  const goc = ls.cung.find((c) => c.ten === cungChinh);
  const kq: KetQuaTongHop = { tomLai: [], them: [], bo: new Set() };
  if (!goc) return kq;
  const cd = CHU_DE[chuyenDe] ?? 'bản thân';
  const theoChi = (d: number) => ls.cung.find((c) => c.chi === (goc.chi + d) % 12)!;
  const tamPhuong = [goc, theoChi(6), theoChi(4), theoChi(8)];

  // Sao nằm trong các nhận định đã khớp (không lấy sao ngoài nhận định), kèm cung chứa.
  const tenTrongPool = new Set(pool.flatMap((x) => x.sao));
  const cungTrongPool = (x: MucKhop) => (x.cungLienQuan?.length ? x.cungLienQuan : [x.cungGoc]).map((t) => ls.cung.find((c) => c.ten === t)).filter((c): c is Cung => !!c);
  const cacSao: SaoViTri[] = [];
  const thay = new Set<string>();
  for (const c of tamPhuong) for (const s of saoCua(c)) {
    if (!tenTrongPool.has(s.ten) || thay.has(`${s.ten}@${c.ten}`)) continue;
    // sao chỉ tính khi có nhận định nói đến chính cung đó (hoặc cung gốc của quy tắc cũ)
    if (!pool.some((x) => x.sao.includes(s.ten) && cungTrongPool(x).includes(c))) continue;
    thay.add(`${s.ten}@${c.ten}`);
    cacSao.push({ s, c });
  }
  cacSao.sort((a, b) => hangCung(goc, a.c) - hangCung(goc, b.c));
  const itemSao = (ten: string, c: Cung) => pool.filter((x) => x.sao.includes(ten) && cungTrongPool(x).includes(c));
  const coTrongCung = (c: Cung, ds: string[]) => cacSao.filter((x) => x.c === c && ds.includes(x.s.ten)).map((x) => x.s.ten);
  const mucCho = (id: string) => (id === 'tu-hoa' ? 'tu-hoa' : 'phu-tinh');

  // ---- 2. Gộp sao cùng cung ----
  const daGop = new Set<string>(); // "ten@cung" đã nằm trong câu gộp
  const them = (muc: string, id: string, text: string, sao: string[], c: Cung, nguon: string, yeuTo: string[] = []) => {
    kq.them.push({
      muc: mucCho(muc),
      n: { text, thamChieu: { quyTacId: id, sao, cung: goc.ten, nguon, truongPhai: TP, cungLienQuan: [c.ten], ...(yeuTo.length ? { yeuTo } : {}) } },
    });
  };
  const boRoi = (c: Cung, ten: string[]) => {
    for (const x of pool) {
      if (/^KHUNG-[a-z-]+-SP-/.test(x.q.id) && x.sao.every((t) => ten.includes(t)) && cungTrongPool(x).length === 1 && cungTrongPool(x)[0] === c) kq.bo.add(x.q.id);
    }
  };
  for (const c of [...tamPhuong].sort((a, b) => hangCung(goc, a) - hangCung(goc, b))) {
    const sat = coTrongCung(c, SAT);
    const loc = cacSao.filter((x) => x.c === c && x.s.hoa === 'Hóa Lộc').map((x) => x.s.ten);
    const quyen = cacSao.filter((x) => x.c === c && x.s.hoa === 'Hóa Quyền').map((x) => x.s.ten);
    const tonTai = coTrongCung(c, ['Lộc Tồn']);
    const kk = coTrongCung(c, KK);
    const vt = nhan(goc, c);
    // (a) Hóa Lộc đồng cung Không/Kiếp. Cung hợp chiếu đã có câu KHUNG-*-HOA-Lộc-HT-* cùng ý thì không gộp lại.
    const daCoHT = pool.some((x) => /-HOA-Lộc-HT-/.test(x.q.id) && cungTrongPool(x).includes(c));
    if (loc.length && kk.length && !daCoHT) {
      const ten = duy([...sat]);
      them('tu-hoa', `TOM-LAI-GOP-LocKiep-${c.ten.replaceAll(' ', '')}`,
        `Tại ${vt}, ${hop(loc)} mang Hóa Lộc đồng cung với ${hop(ten)}: ${HAO_TAN[chuyenDe] ?? HAO_TAN.menh}.`,
        duy([...loc, ...ten]), c, NGUON_TT_TB);
      ten.forEach((t) => daGop.add(`${t}@${c.ten}`));
      boRoi(c, ten);
      continue;
    }
    // (b) Hóa Quyền đồng cung Lộc Tồn.
    if (quyen.length && tonTai.length) {
      them('phu-tinh', `TOM-LAI-GOP-QuyenLocTon-${c.ten.replaceAll(' ', '')}`,
        `Tại ${vt}, ${hop(quyen)} mang Hóa Quyền đồng cung Lộc Tồn: quyền chủ động đi cùng thói quen giữ gìn, nên quyết đoán vừa đủ và vẫn chừa chỗ linh hoạt để không bỏ lỡ cơ hội.`,
        duy([...quyen, 'Lộc Tồn']), c, NGUON_TT_TB);
      boRoi(c, ['Lộc Tồn']);
      continue;
    }
    // (c) Nhiều sát tinh cùng cung.
    if (sat.length >= 2) {
      them('phu-tinh', `TOM-LAI-GOP-SatTinh-${c.ten.replaceAll(' ', '')}`,
        `Tại ${vt}, ${hop(sat)} cùng đóng một cung: nhịp thúc đẩy ở đây mạnh và nhiều biến động, vừa tiếp thêm quyết tâm vừa dễ nóng vội hay đổi hướng; nên chia việc thành bước nhỏ, tiết chế phản ứng đầu tiên và giữ nhịp nghỉ.`,
        sat, c, NGUON_TT_TB);
      sat.forEach((t) => daGop.add(`${t}@${c.ten}`));
      boRoi(c, sat);
    }
  }

  // ---- 3. Câu dung hòa: Tuần/Triệt hay sát tinh cùng cung với sao mang Lộc/Quyền/Khoa ----
  for (const { s, c } of cacSao) {
    if (!s.hoa || !HOA_TOT.includes(s.hoa)) continue;
    const tt = [...(c.tuan ? ['Tuần'] : []), ...(c.triet ? ['Triệt'] : [])];
    // Lộc đồng cung Không/Kiếp và Quyền đồng cung Lộc Tồn đã có câu gộp riêng
    const sat = coTrongCung(c, SAT).filter((t) => !(s.hoa === 'Hóa Lộc' && KK.includes(t)));
    if (!tt.length && !sat.length) continue;
    const yeu = [...tt, ...sat];
    const cungCau = nhan(goc, c);
    const dau = `Tại ${cungCau}, ${s.ten} mang ${s.hoa} (${Y_HOA[s.hoa]}) lại đồng cung với ${hop(yeu)}`;
    const duoi = tt.length
      ? `${hop(tt)} làm mặt thuận đến chậm và dịu hơn, đồng thời cũng làm mặt vướng nhẹ đi; nên kiên nhẫn, đừng đặt kỳ vọng bứt phá nhanh${sat.length ? `, và tiết chế sự nóng vội do ${hop(sat)}` : ''}.`
      : `${s.hoa} cho đà thuận lợi còn ${hop(sat)} thêm sức ép và sự nóng vội; nên tận dụng cơ hội nhưng chia việc, giữ nhịp và cân nhắc kỹ trước khi quyết.`;
    them('tu-hoa', `TOM-LAI-DUNG-HOA-${s.hoa.split(' ')[1]}-${c.ten.replaceAll(' ', '')}`, `${dau}: ${duoi}`, [s.ten, ...sat], c, tt.length ? NGUON_TUAN : NGUON_TT_TB, tt);
  }

  // ---- 1. Tóm lại ----
  const cau: NhanDinhTH[] = [];
  const mot = (id: string, text: string, sao: string[], c: Cung | null, nguon: string, yeuTo: string[] = []) => cau.push({
    text, thamChieu: { quyTacId: id, sao, cung: goc.ten, nguon, truongPhai: TP, ...(c ? { cungLienQuan: [c.ten] } : {}), ...(yeuTo.length ? { yeuTo } : {}) },
  });

  // (1) Cách cục chính, theo mức ưu tiên; Không Kiếp chiếu là điểm cần chú ý nên không làm cách cục chính.
  const cc = dangCo.filter((x) => x.loai === 'CC' && x.cachCuc && !x.cachCuc.startsWith('Không Kiếp')).sort((a, b) => b.uuTien - a.uuTien)[0];
  if (cc) {
    const ten = cc.cachCuc!;
    const m = cc.cau.match(new RegExp(`${ten.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^:.;]*:\\s*([^;.]+)`));
    const y = m && m[1].length <= 170 && !m[1].includes('{') ? m[1].trim() : '';
    const phaVua = /-PHA3/.test(cc.q.id), phaNhe = !phaVua && /-PHA/.test(cc.q.id);
    const text = phaVua ? ngan(`Về ${cd}, lá số có dáng dấp thế ${ten}${y ? ` (${y})` : ''}, nhưng chưa vững vì có yếu tố cản.`, `Về ${cd}, lá số có dáng dấp thế ${ten}, nhưng chưa vững vì có yếu tố cản.`, `Về ${cd}, có dáng dấp thế ${ten} nhưng chưa vững.`)
      : phaNhe ? ngan(`Về ${cd}, nét nổi bật nhất là thế ${ten} thành cách nhưng có khuyết${y ? `: ${y}` : ''}.`, `Về ${cd}, nổi bật là thế ${ten} thành cách nhưng có khuyết.`, `Về ${cd}, nổi bật là thế ${ten}, có khuyết.`)
      : ngan(`Về ${cd}, nét nổi bật nhất là thế ${ten}${y ? `: ${y}` : ''}.`, `Về ${cd}, nét nổi bật nhất là thế ${ten}.`, `Về ${cd}, nổi bật là thế ${ten}.`);
    mot('TOM-LAI-CACH-CUC', text, cc.sao, null, cc.q.nguon, [`Cách ${ten}`]);
  } else {
    const chinh = dangCo.filter((x) => x.cungGoc === goc.ten && !x.loai?.match(/^(CC|HOA|SP)$/));
    const ct = goc.chinhTinh;
    if (ct.length && chinh.some((x) => ct.some((s) => x.sao.includes(s.ten)))) {
      const mo = ct.map((s) => (s.dacTinhTen ? `${s.ten} (${s.dacTinhTen})` : s.ten));
      mot('TOM-LAI-CHINH-TINH', ngan(`Về ${cd}, nền của lá số là ${hop(mo)} tọa thủ ${goc.ten}.`, `Về ${cd}, nền là ${hop(ct.map((s) => s.ten))} tọa thủ ${goc.ten}.`), ct.map((s) => s.ten), goc, nguonCua(chinh.filter((x) => ct.some((s) => x.sao.includes(s.ten)))));
    } else if (!ct.length) {
      const vcd = dangCo.find((x) => /VCD/.test(x.q.id) && x.yeuTo.includes('Vô Chính Diệu') && x.sao.length);
      if (vcd) mot('TOM-LAI-VO-CHINH-DIEU', ngan(`Về ${cd}, ${goc.ten} không có chính tinh nên luận qua cung đối diện (${hop(vcd.sao)}) và phụ tinh.`, `Về ${cd}, ${goc.ten} vô chính tinh nên luận qua cung đối diện.`), vcd.sao, goc, vcd.q.nguon, ['Vô Chính Diệu']);
    }
  }

  // (2) Điểm mạnh: Hóa Lộc/Quyền/Khoa không bị Không/Kiếp đồng cung; không có thì chính tinh sáng.
  const manhHoa = cacSao.find(({ s, c }) => s.hoa && HOA_TOT.includes(s.hoa) && !coTrongCung(c, KK).length);
  const manhSang = cacSao.find(({ s, c }) => c.chinhTinh.includes(s) && !!s.dacTinhTen && ['Miếu', 'Vượng'].includes(s.dacTinhTen));
  if (manhHoa) {
    const { s, c } = manhHoa;
    mot('TOM-LAI-DIEM-MANH', ngan(`Điểm mạnh là ${s.ten} mang ${s.hoa} ở ${nhan(goc, c)}: ${Y_HOA[s.hoa!]}.`, `Điểm mạnh là ${s.ten} mang ${s.hoa} ở ${c.ten}: ${Y_HOA[s.hoa!]}.`, `Điểm mạnh là ${s.ten} mang ${s.hoa} ở ${c.ten}.`), [s.ten], c, nguonCua(itemSao(s.ten, c)));
  } else if (manhSang) {
    const { s, c } = manhSang;
    mot('TOM-LAI-DIEM-MANH', ngan(`Điểm mạnh là ${s.ten} sáng (${s.dacTinhTen}) ở ${nhan(goc, c)}, một chỗ dựa tốt.`, `Điểm mạnh là ${s.ten} sáng (${s.dacTinhTen}) ở ${c.ten}.`), [s.ten], c, nguonCua(itemSao(s.ten, c)));
  }

  // (3) Điểm cần chú ý: Hóa Kỵ, rồi sát tinh (hãm/bình trước), rồi Tuần/Triệt, rồi chính tinh hãm tọa thủ.
  const ky = cacSao.find(({ s }) => s.hoa === 'Hóa Kỵ');
  const satKhop = cacSao.filter(({ s }) => SAT.includes(s.ten) && !daGop.has(`${s.ten}@${cacSao.find((x) => x.s === s)!.c.ten}`));
  const satTim = satKhop.find(({ s }) => !(s.dacTinhTen && SANG.includes(s.dacTinhTen))) ?? satKhop[0];
  const cungTT = duy(pool.filter((x) => x.yeuTo.some((t) => t === 'Tuần' || t === 'Triệt')).flatMap((x) => cungTrongPool(x).map((c) => ({ c, x })))
    .filter(({ c }) => c.tuan || c.triet).map(({ c }) => c)).sort((a, b) => hangCung(goc, a) - hangCung(goc, b))[0];
  const hamChinh = goc.chinhTinh.find((s) => s.dacTinhTen === 'Hãm' && tenTrongPool.has(s.ten));
  if (ky) {
    const { s, c } = ky;
    mot('TOM-LAI-CAN-CHU-Y', ngan(`Cần để ý ${s.ten} mang Hóa Kỵ ở ${nhan(goc, c)}: dễ vướng bận, nên đặt kỳ vọng vừa phải.`, `Cần để ý ${s.ten} mang Hóa Kỵ ở ${c.ten}: nên đặt kỳ vọng vừa phải.`, `Cần để ý ${s.ten} mang Hóa Kỵ ở ${c.ten}.`), [s.ten], c, nguonCua(itemSao(s.ten, c)));
  } else if (satTim) {
    const c = satTim.c;
    const cung = satKhop.filter((x) => x.c === c).map((x) => x.s.ten);
    mot('TOM-LAI-CAN-CHU-Y', ngan(`Cần để ý ${hop(cung)} ở ${nhan(goc, c)}: dễ nóng vội, nên cân nhắc trước khi quyết.`, `Cần để ý ${hop(cung)} ở ${c.ten}: dễ nóng vội, nên cân nhắc.`, `Cần để ý ${hop(cung)} ở ${c.ten}.`), cung, c, nguonCua(itemSao(cung[0], c)));
  } else if (cungTT) {
    const tt = [...(cungTT.tuan ? ['Tuần'] : []), ...(cungTT.triet ? ['Triệt'] : [])];
    mot('TOM-LAI-CAN-CHU-Y', ngan(`Cần để ý ${hop(tt)} đóng ở ${nhan(goc, cungTT)}: kết quả đến chậm hơn, nên kiên trì.`, `Cần để ý ${hop(tt)} đóng ở ${cungTT.ten}: kết quả đến chậm, nên kiên trì.`, `Cần để ý ${hop(tt)} đóng ở ${cungTT.ten}.`), [], cungTT, NGUON_TUAN, tt);
  } else if (hamChinh) {
    mot('TOM-LAI-CAN-CHU-Y', ngan(`Cần để ý ${hamChinh.ten} hãm ở ${goc.ten}: nên bù bằng sự chuẩn bị kỹ và học hỏi thêm.`, `Cần để ý ${hamChinh.ten} hãm ở ${goc.ten}: nên chuẩn bị kỹ.`), [hamChinh.ten], goc, nguonCua(itemSao(hamChinh.ten, goc)));
  }
  kq.tomLai = cau.filter((x) => x.thamChieu.nguon);
  return kq;
}
