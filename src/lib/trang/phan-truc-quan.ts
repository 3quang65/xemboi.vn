// Dữ liệu trực quan cho thần số học, hướng nhà / bát trạch, cửu tinh (docs/v2/22, Lệnh 42).
// Chỉ ghép từ số liệu đã tính của các lib gốc; không lời luận, không cát hung ngoài điều sách đã ghi (du niên cát/hung theo Hiệp kỷ).
import { HAI_TU_SON, batPhuong, cungTheoSon, duNienGiua, tinhCungPhi, xetHuong, type CungBatTrach, type DuNien } from './phong-thuy';
import { cuuTinhNam, saoSo, thangTietTai, type BanCuuTinh } from './cuu-tinh';
import { bieuDoNgaySinh, bonDinhCao, namCaNhan, soChuDao, type DinhCao, type NgaySinh } from './than-so-hoc';
import type { Hanh } from './can-chi';

export type TheTrucQuan = { ma: string; nhan: string; giaTri: string; hanh?: Hanh; muc?: 'tot' | 'binh' | 'diu'; chiTiet: string };
export type DocNhanhChung = { cau: string; the: TheTrucQuan[] };

// ================= Thần số học =================

/** Tuổi tròn trong năm xét (đã qua sinh nhật năm đó): năm xét − năm sinh. */
export const tuoiTrongNam = (d: NgaySinh, namXet: number) => namXet - d.nam;

/** Chỉ số (0..3) của đỉnh cao chứa tuổi trong năm xét. */
export function dinhCaoHienTai(ds: DinhCao[], tuoi: number): number {
  const i = ds.findIndex((p) => tuoi >= p.tuTuoi && (p.denTuoi === null || tuoi <= p.denTuoi));
  return i < 0 ? 0 : i;
}

export function docNhanhThanSo(d: NgaySinh, namXet: number): DocNhanhChung & { dinhCao: DinhCao[]; chiSoDinhHienTai: number } {
  const scd = soChuDao(d);
  const ncn = namCaNhan(d.ngay, d.thang, namXet);
  const dc = bonDinhCao(d);
  const tuoi = tuoiTrongNam(d, namXet);
  const k = dinhCaoHienTai(dc, tuoi);
  const p = dc[k];
  const bd = bieuDoNgaySinh(d);
  const khoangTuoi = p.denTuoi === null ? `từ ${p.tuTuoi} tuổi` : `${p.tuTuoi}–${p.denTuoi} tuổi`;
  const cau = `Số chủ đạo ${scd.cach1.so}; năm ${namXet} là năm cá nhân ${ncn.so}; `
    + `đang ở đỉnh cao thứ ${p.thu} (số ${p.so}, ${khoangTuoi}); lưới ngày sinh ${bd.thieu.length ? `thiếu ${bd.thieu.join(', ')}` : 'đủ 1–9'}.`;
  return {
    cau,
    dinhCao: dc,
    chiSoDinhHienTai: k,
    the: [
      {
        ma: 'so-chu-dao', nhan: 'Số chủ đạo', giaTri: String(scd.cach1.so),
        chiTiet: `${scd.cach1.phepCong}${scd.cach1.buoc.length > 1 ? ` → ${scd.cach1.buoc.slice(1).join(' → ')}` : ''}.`
          + (scd.khac ? ` Cách rút từng phần ra ${scd.cach2.so}.` : ''),
      },
      { ma: 'nam-ca-nhan', nhan: `Năm cá nhân ${namXet}`, giaTri: String(ncn.so), chiTiet: `${ncn.phepCong}.` },
      {
        ma: 'dinh-cao', nhan: 'Đỉnh cao hiện tại', giaTri: `${p.thu} · số ${p.so}`,
        chiTiet: `Tuổi ${tuoi} trong năm ${namXet}, thuộc chặng ${khoangTuoi}. Phép cộng: ${p.phepCong}.`,
      },
      {
        ma: 'bieu-do', nhan: 'Lưới ngày sinh', giaTri: `${9 - bd.thieu.length}/9 số`,
        chiTiet: `${bd.thieu.length ? `Thiếu ${bd.thieu.join(', ')}.` : 'Đủ cả 9 số.'} ${bd.duongDay.length} đường đủ, ${bd.duongTrong.length} đường trống.`,
      },
    ],
  };
}

// ================= Hướng nhà, bát trạch =================

export type OSon = {
  son: string;
  /** Độ giữa của sơn (0 = Bắc, chiều kim đồng hồ). */
  goc: number;
  cung: CungBatTrach;
  /** Du niên của phương này với cung phi đang xét (nếu có cung phi). */
  duNien?: DuNien;
  laHuong: boolean;
  laToa: boolean;
};
export type LaBanCaNhan = {
  son: OSon[];
  /** 8 quái, mỗi quái 3 sơn liền nhau; `tu`/`den` theo độ la bàn. */
  quai: { cung: CungBatTrach; tu: number; den: number; goc: number; duNien?: DuNien }[];
  cungPhi?: string;
};

export function laBanCaNhan(cungPhi?: string, doHuong?: number): LaBanCaNhan {
  const xh = doHuong === undefined ? undefined : xetHuong(doHuong);
  const son = HAI_TU_SON.map((s, i): OSon => {
    const cung = cungTheoSon(s);
    return {
      son: s, goc: i * 15, cung,
      duNien: cungPhi ? duNienGiua(cungPhi, cung.ten) : undefined,
      laHuong: xh?.sonHuong === s, laToa: xh?.sonToa === s,
    };
  });
  const daCo = new Set<string>();
  const quai: LaBanCaNhan['quai'] = [];
  for (const o of son) {
    if (daCo.has(o.cung.ten)) continue;
    daCo.add(o.cung.ten);
    const giua = (o.cung.tuDo + ((o.cung.denDo - o.cung.tuDo + 360) % 360) / 2) % 360;
    quai.push({ cung: o.cung, tu: o.cung.tuDo, den: o.cung.denDo, goc: giua, duNien: o.duNien });
  }
  return { son, quai, cungPhi };
}

export function docNhanhHuongNha(nam: number, gioiTinh: 'nam' | 'nu', doHuong?: number): DocNhanhChung {
  const cp = tinhCungPhi(nam, gioiTinh);
  const bp = batPhuong(cp.cung.ten);
  const cat = bp.filter((x) => x.duNien.cat);
  const nguoi = `${gioiTinh === 'nam' ? 'Nam' : 'Nữ'} sinh ${nam} (${cp.canChi})`;
  let cau = `${nguoi}: cung phi ${cp.cung.ten}${cp.guiCung ? ' (số 5 gửi cung)' : ''}, ${cp.cung.nhom} tứ mệnh; `
    + `bốn phương du niên cát: ${cat.map((x) => `${x.cung.phuong} (${x.duNien.ten})`).join(', ')}.`;
  const the: TheTrucQuan[] = [
    { ma: 'cung-phi', nhan: 'Cung phi', giaTri: `${cp.cung.kyHieu} ${cp.cung.ten}`, hanh: cp.cung.hanh, chiTiet: `Số ${cp.so}, ${cp.cung.nhom} tứ mệnh. ${cp.nguyen}.` },
    { ma: 'phuong-cat', nhan: 'Bốn phương cát', giaTri: cat.map((x) => x.cung.phuong).join(' · '), muc: 'tot', chiTiet: cat.map((x) => `${x.duNien.ten}: ${x.cung.phuong}`).join('; ') + '.' },
  ];
  if (doHuong !== undefined) {
    const xh = xetHuong(doHuong);
    const dnHuong = duNienGiua(cp.cung.ten, xh.cungHuong.ten);
    const hop = xh.trach === cp.cung.nhom;
    cau += ` Nhà hướng ${xh.doHuong}° (sơn ${xh.sonHuong}, quái ${xh.cungHuong.ten}), tọa ${xh.sonToa}: ${xh.trach} tứ trạch, ${hop ? 'cùng' : 'khác'} nhóm với mệnh; phương hướng nhà ứng du niên ${dnHuong.ten} với cung phi.`;
    the.push(
      { ma: 'huong', nhan: 'Hướng nhà', giaTri: `${xh.doHuong}° · ${xh.sonHuong}`, chiTiet: `Quái ${xh.cungHuong.ten} (${xh.cungHuong.phuong}). Tọa ${xh.sonToa} ${xh.doToa}°.` },
      { ma: 'trach', nhan: 'Nhóm trạch (theo tọa)', giaTri: `${xh.trach} tứ trạch`, muc: hop ? 'tot' : 'diu', chiTiet: `Mệnh ${cp.cung.nhom} tứ mệnh: ${hop ? 'cùng nhóm' : 'khác nhóm'}.` },
      { ma: 'du-nien-huong', nhan: 'Du niên của hướng', giaTri: dnHuong.ten, muc: dnHuong.cat ? 'tot' : 'diu', chiTiet: `Sao ${dnHuong.sao}; Hiệp kỷ xếp vào nhóm ${dnHuong.cat ? 'cát' : 'không cát'}.` },
    );
  }
  return { cau, the };
}

// ================= Cửu tinh =================

/** Vị trí ô trên lưới 3×3, Nam ở trên (theo cách vẽ Lạc thư trong sách cổ): [hàng, cột]. */
export const VI_TRI_LUOI_CUU_TINH: Record<string, [number, number]> = {
  'Tốn': [0, 0], 'Ly': [0, 1], 'Khôn': [0, 2],
  'Chấn': [1, 0], 'Trung cung': [1, 1], 'Đoài': [1, 2],
  'Cấn': [2, 0], 'Khảm': [2, 1], 'Càn': [2, 2],
};

/** Đường sao bay (thuận bố): theo số sao tăng dần từ sao trung cung; mỗi bước kèm ô lưới để vẽ. */
export function duongBay(ban: BanCuuTinh): { so: number; cung: string; o: [number, number] }[] {
  return ban.cung.map((c) => ({ so: c.sao.so, cung: c.ten, o: VI_TRI_LUOI_CUU_TINH[c.ten] }));
}

export function docNhanhCuuTinh(nam: number, luc = new Date()): DocNhanhChung {
  const n = cuuTinhNam(nam);
  const trung = saoSo(n.ban.trung);
  const nguHoang = n.ban.cung.find((c) => c.sao.so === 5)!;
  const hien = thangTietTai(luc);
  const thangNay = hien.nam === nam ? n.thang[hien.thang - 1] : undefined;
  const vn = (d: Date) => new Date(d.getTime() + 7 * 3600000).toISOString().slice(0, 10).split('-').reverse().join('/');
  const cau = `Năm ${n.canChi} ${nam} (từ ${vn(n.batDau)} tới ${vn(n.ketThuc)}), ${n.nguyen}: ${trung.ten} vào trung cung${trung.so === 5 ? '' : `; Ngũ hoàng ở ${nguHoang.phuong} (${nguHoang.ten})`}`
    + (thangNay ? `; tháng này (tháng ${thangNay.chi}, từ ${thangNay.tiet}) ${saoSo(thangNay.ban.trung).ten} vào trung cung.` : '.');
  const the: TheTrucQuan[] = [
    { ma: 'trung-nam', nhan: `Trung cung năm ${nam}`, giaTri: `${trung.so} ${trung.ten}`, hanh: trung.hanh, chiTiet: `Sao ${trung.tenBacDau}. Năm đổi ở Lập xuân.` },
    { ma: 'ngu-hoang', nhan: 'Ngũ hoàng năm nay', giaTri: nguHoang.ten === 'Trung cung' ? 'Trung cung' : nguHoang.phuong, chiTiet: `Ô ${nguHoang.ten}.` },
  ];
  if (thangNay) {
    const s = saoSo(thangNay.ban.trung);
    the.push({ ma: 'trung-thang', nhan: `Tháng ${thangNay.chi} (tháng này)`, giaTri: `${s.so} ${s.ten}`, hanh: s.hanh, chiTiet: `Từ tiết ${thangNay.tiet} (${vn(thangNay.batDau)}).` });
  }
  return { cau, the };
}

/**
 * Hướng đo sát ranh giới hai sơn (mỗi sơn 15°, ranh ở 7,5° + 15°·k): báo sơn kề bên và quái của nó,
 * để người xem biết đo lệch một chút thì kết quả đổi. Chỉ là số đo, không thêm lời luận.
 */
export function ganRanhSon(doHuong: number, nguong = 2): { gan: boolean; cachDo: number; sonKe: string; doiQuai: boolean; cau: string | null } {
  const d = ((doHuong % 360) + 360) % 360;
  const trong = (d + 7.5) % 15; // vị trí trong sơn hiện tại, 0..15
  const sangPhai = trong >= 7.5;
  const cachDo = Math.round((sangPhai ? 15 - trong : trong) * 10) / 10;
  const iNay = Math.floor((d + 7.5) / 15) % 24;
  const iKe = (iNay + (sangPhai ? 1 : 23)) % 24;
  const sonNay = HAI_TU_SON[iNay];
  const sonKe = HAI_TU_SON[iKe];
  const doiQuai = cungTheoSon(sonNay).ten !== cungTheoSon(sonKe).ten;
  const gan = cachDo <= nguong;
  const cau = gan
    ? `Hướng ${d}° chỉ cách ranh giới sơn ${sonKe} ${String(cachDo).replace('.', ',')}°; đo lệch chừng đó là sang sơn ${sonKe}`
      + (doiQuai ? ` (quái ${cungTheoSon(sonKe).ten}), kết quả du niên sẽ khác. Nên đo lại vài lần.` : ', cùng quái nên du niên không đổi.')
    : null;
  return { gan, cachDo, sonKe, doiQuai, cau };
}
