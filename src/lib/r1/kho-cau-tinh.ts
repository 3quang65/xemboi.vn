import {
  canChiNam,
  canChiNgay,
  canChiThang,
  duongSangAm,
  amSangDuong,
  hanhNapAm,
  napAm,
  soNgayJulius,
  TEN_CON_GIAP,
  type NguHanh,
} from '@/lib/tuvi-v2/am-lich';
import type { LaSo, LuuNien, Sao } from '@/lib/tuvi-v2';
import type { KetQuaChuaRoGio, NhanDinhMienPhi } from './types';
import tomTatRaw from './data/tom-tat-mien-phi.json';
import menhChinhTinhRaw from './data/menh-chinh-tinh.json';

type MucCau = {
  y: string;
  ma?: string[];
  nguon: string[];
  treEm?: string;
};

type CachCucMuc = MucCau & {
  ten: string;
  can: string[];
  chi?: string[];
  dieuKienPha?: string[];
  pha?: MucCau;
};

const KHO_TOM_TAT = tomTatRaw as unknown as {
  chinhTinh: Record<string, Record<string, MucCau>>;
  thanCu: Record<string, MucCau & { kem?: MucCau }>;
  tuHoa: Record<string, MucCau & { gapKhongKiep?: MucCau }>;
  tuanTriet: Record<string, { y: string; nguon: string[]; sang: MucCau; ham: MucCau }>;
  phuTinh: Record<string, MucCau & { H?: MucCau }>;
  voChinhDieu: MucCau & { xungTuanTriet?: MucCau };
  cachCuc?: CachCucMuc[];
};

const KHO_MENH_CHINH_TINH = menhChinhTinhRaw as unknown as {
  menh: Record<string, { ma: string; cau: string; dacTinh: string[]; nguon: string[] }[]>;
};

const SAT_TINH = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];

// Chủ đề nổi bật theo cung vận/lưu niên — trích trung thực từ quy tắc VAN-CUNG-02..13 trong dai-van.md (nguồn Tân Biên, Khảo Luận).
const CHU_DE_THEO_CUNG_2027: Record<
  string,
  { chuDe: string; moTa: string; nguon: string[] }
> = {
  'Mệnh': {
    chuDe: 'Tự nhìn lại nền tảng cá nhân và nhịp sống',
    moTa: 'Cung vận năm 2027 đi qua chính cung Mệnh: trọng tâm năm xoay quanh định hướng cá nhân, thói quen sống và việc củng cố điểm mạnh sẵn có.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Phụ Mẫu': {
    chuDe: 'Gia đình, học hỏi và quan hệ với người đi trước',
    moTa: 'Trọng tâm năm 2027 chạm cung Phụ Mẫu: các việc nổi bật thường liên quan đến cha mẹ, cấp trên, người hướng dẫn hoặc kế hoạch học tập, giấy tờ.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Phúc Đức': {
    chuDe: 'Đời sống tinh thần và sự cân bằng bên trong',
    moTa: 'Trọng tâm năm 2027 chạm cung Phúc Đức: năm thuận cho việc sắp xếp lại giá trị sống, chăm chút đời sống tinh thần và kết nối gia đình, họ hàng.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Điền Trạch': {
    chuDe: 'Nơi ở, tổ ấm và tích lũy nền tảng ổn định',
    moTa: 'Trọng tâm năm 2027 chạm cung Điền Trạch: các quyết định đáng chú ý thường xoay quanh chỗ ở, không gian làm việc, nhà cửa hoặc tài sản ổn định lâu dài.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Quan Lộc': {
    chuDe: 'Công việc, vai trò nghề nghiệp và bước tiến chuyên môn',
    moTa: 'Trọng tâm năm 2027 chạm cung Quan Lộc: công việc, vị trí đảm nhận và định hướng sự nghiệp là mảng dễ có nhiều chuyển động nhất trong năm.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Nô Bộc': {
    chuDe: 'Đồng nghiệp, bạn bè và mạng lưới cộng tác',
    moTa: 'Trọng tâm năm 2027 chạm cung Nô Bộc: kết quả công việc năm nay chịu ảnh hưởng khá rõ từ người cộng tác, bạn bè và cách bạn chọn lọc các mối quan hệ xung quanh.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Thiên Di': {
    chuDe: 'Môi trường mới, dịch chuyển và cơ hội bên ngoài',
    moTa: 'Trọng tâm năm 2027 chạm cung Thiên Di: năm có nhiều yếu tố liên quan đến đi lại, mở rộng giao tiếp bên ngoài hoặc thay đổi môi trường học tập, làm việc.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Tật Ách': {
    chuDe: 'Nhịp sinh hoạt, sức bền và quản lý áp lực',
    moTa: 'Trọng tâm năm 2027 chạm cung Tật Ách: giai đoạn nên ưu tiên chăm sóc sức khỏe, giữ lịch nghỉ ngơi điều độ, khám định kỳ và tránh ôm việc quá sức.',
    nguon: ['Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)', 'Quy ước luận giải trung tính (Tử Vi Đẩu Số Tân Biên)'],
  },
  'Tài Bạch': {
    chuDe: 'Thu nhập, dòng tiền và kế hoạch tài chính',
    moTa: 'Trọng tâm năm 2027 chạm cung Tài Bạch: cách kiếm tiền, quản lý chi tiêu và cơ cấu khoản tích lũy là chủ đề nổi bật cần được tính toán rõ ràng.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Tử Tức': {
    chuDe: 'Con cái, người nhỏ tuổi hoặc dự án sáng tạo',
    moTa: 'Trọng tâm năm 2027 chạm cung Tử Tức: chủ đề nổi bật xoay quanh gia đình nhỏ, người bạn chăm lo hoặc các dự án sáng tạo, hợp tác cần nuôi dưỡng từng bước.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Phu Thê': {
    chuDe: 'Tình cảm, sự đồng hành và cam kết lâu dài',
    moTa: 'Trọng tâm năm 2027 chạm cung Phu Thê: chuyện tình cảm, cách lắng nghe nhau hoặc quyết định gắn bó với người đồng hành là điểm đáng chú ý trong năm.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
  'Huynh Đệ': {
    chuDe: 'Anh chị em, bạn đồng trang lứa và phối hợp ngang hàng',
    moTa: 'Trọng tâm năm 2027 chạm cung Huynh Đệ: sự kết nối với anh chị em, đồng nghiệp ngang hàng hoặc các kế hoạch hợp tác chung dễ trở thành điểm nhấn của năm.',
    nguon: ['Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang)', 'Tử Vi Khảo Luận (Hoàng Thường, Hàm Chương)'],
  },
};

function vietHoaDauCau(s: string): string {
  const t = s.trim();
  if (!t) return '';
  return t.charAt(0).toLocaleUpperCase('vi') + t.slice(1);
}

function lietKe(ds: string[]): string {
  if (ds.length <= 1) return ds[0] ?? '';
  return `${ds.slice(0, -1).join(', ')} và ${ds[ds.length - 1]}`;
}

function nhanSao(s: Sao): string {
  const kem = [s.dacTinhTen, s.hoa].filter(Boolean);
  return kem.length ? `${s.ten} (${kem.join(', ')})` : s.ten;
}

function laSaoYeu(s: Sao): boolean {
  return s.dacTinh === 'B' || s.dacTinh === 'H';
}

function thayBien(mau: string, thay: Record<string, string>): string {
  let kq = mau;
  for (const [k, v] of Object.entries(thay)) {
    kq = kq.split(`{${k}}`).join(v);
  }
  return kq;
}

/**
 * Rút ra tối đa 3 nhận định Mệnh–Thân và 1 chủ đề năm 2027 từ kho câu tĩnh có ghi nguồn sách.
 * Quy tắc: câu nào thiếu trong kho thì bỏ, tuyệt đối không bịa.
 */
export function taoNhanDinhMienPhi(
  ls: LaSo,
  ln2027: LuuNien,
): {
  nhanDinhMenhThan: NhanDinhMienPhi[];
  chuDe2027: NhanDinhMienPhi | null;
} {
  const menh = ls.cung.find((c) => c.ten === 'Mệnh');
  const than = ls.cung.find((c) => c.laThan);
  const nhanDinhMenhThan: NhanDinhMienPhi[] = [];

  if (menh) {
    const xung = ls.cung[(menh.chi + 6) % 12];
    const saoMenh = [...menh.chinhTinh, ...menh.catTinh, ...menh.hungTinh, ...menh.phuTinh];
    const tim = (ten: string) => saoMenh.find((x) => x.ten === ten);

    const kiemTraDieuKien = (tk: string): boolean => {
      if (tk === 'Tuần') return menh.tuan;
      if (tk === 'Triệt') return menh.triet;
      const [loai, ten] = tk.includes(':') ? tk.split(':') : ['', tk];
      const s = tim(ten);
      if (loai === 'ham') return !!s && laSaoYeu(s);
      if (loai === 'khongMieuVuong') return !!s && s.dacTinh !== 'M' && s.dacTinh !== 'V';
      return !!s || saoMenh.some((x) => x.hoa === ten);
    };

    // 1. Chính tinh / Cách cục / Vô Chính Diệu tại cung Mệnh
    const cachCuc = (KHO_TOM_TAT.cachCuc ?? []).find(
      (c) => c.can.every((t) => tim(t)) && (!c.chi || c.chi.includes(menh.tenChi)),
    );
    const saoDaNoi = new Set<string>(cachCuc?.can ?? []);

    if (cachCuc) {
      const biPha = !!cachCuc.pha && (cachCuc.dieuKienPha ?? []).some(kiemTraDieuKien);
      const muc = biPha ? cachCuc.pha! : cachCuc;
      const tenSao = lietKe(cachCuc.can.map((t) => nhanSao(tim(t)!)));
      nhanDinhMenhThan.push({
        id: 'menh-cach-cuc',
        nhom: 'menh_than',
        canCu: `[Căn cứ: Cung Mệnh (${menh.tenChi}) – ${tenSao}]`,
        tieuDe: `${cachCuc.ten}${biPha ? ' (có yếu tố phá cách)' : ''} tại cung Mệnh`,
        noiDung: vietHoaDauCau(muc.y),
        nguon: muc.nguon,
        ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
      });
    } else if (menh.chinhTinh.length === 0) {
      const saoXung = xung.chinhTinh.length
        ? lietKe(xung.chinhTinh.map((s) => s.ten))
        : 'các chính tinh ở tam hợp';
      const mucVcd =
        (xung.tuan || xung.triet) && KHO_TOM_TAT.voChinhDieu.xungTuanTriet
          ? KHO_TOM_TAT.voChinhDieu.xungTuanTriet
          : KHO_TOM_TAT.voChinhDieu;
      nhanDinhMenhThan.push({
        id: 'menh-vo-chinh-dieu',
        nhom: 'menh_than',
        canCu: `[Căn cứ: Cung Mệnh (${menh.tenChi}) Vô Chính Diệu – mượn ${saoXung} tại Thiên Di (${xung.tenChi})]`,
        tieuDe: 'Cung Mệnh vô chính diệu (mượn sao xung chiếu)',
        noiDung: vietHoaDauCau(thayBien(mucVcd.y, { saoXung })),
        nguon: mucVcd.nguon,
        ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
      });

      // Nếu cung xung chiếu có chính tinh nằm trong kho, thêm 1 nhận định mượn sao nếu chưa đủ 2 ý Mệnh
      const saoMuon = xung.chinhTinh[0];
      if (saoMuon) {
        const mucMuon = KHO_TOM_TAT.chinhTinh[saoMuon.ten]?.[saoMuon.dacTinh ?? 'B'];
        if (mucMuon) {
          nhanDinhMenhThan.push({
            id: `menh-muon-${saoMuon.key}`,
            nhom: 'menh_than',
            canCu: `[Căn cứ: Cung Thiên Di (${xung.tenChi}) chiếu Mệnh – ${nhanSao(saoMuon)}]`,
            tieuDe: `Ảnh hưởng mượn từ ${saoMuon.ten}`,
            noiDung: vietHoaDauCau(mucMuon.y),
            nguon: mucMuon.nguon,
            ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
          });
        }
      }
    }

    // Chính tinh tọa thủ tại Mệnh (nếu chưa nói trong cách cục)
    for (const s of menh.chinhTinh.slice(0, 2)) {
      if (saoDaNoi.has(s.ten) || nhanDinhMenhThan.length >= 2) continue;
      const muc = KHO_TOM_TAT.chinhTinh[s.ten]?.[s.dacTinh ?? 'B'];
      if (muc) {
        nhanDinhMenhThan.push({
          id: `menh-ct-${s.key}`,
          nhom: 'menh_than',
          canCu: `[Căn cứ: Cung Mệnh (${menh.tenChi}) – ${nhanSao(s)}]`,
          tieuDe: `${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''} thủ Mệnh`,
          noiDung: vietHoaDauCau(muc.y),
          nguon: muc.nguon,
          ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
        });
      } else {
        // Fallback sang menh-chinh-tinh.json nếu kho tom-tat thiếu khóa độ sáng
        const mucDuPhong = (KHO_MENH_CHINH_TINH.menh[s.ten] ?? []).find(
          (r) => s.dacTinh && r.dacTinh.includes(s.dacTinh),
        );
        if (mucDuPhong) {
          const i = mucDuPhong.cau.indexOf(': ');
          const text =
            /^(Miếu|Vượng|Đắc|Bình|Hãm)/.test(mucDuPhong.cau) && i > 0
              ? mucDuPhong.cau.slice(i + 2)
              : mucDuPhong.cau;
          nhanDinhMenhThan.push({
            id: `menh-ct-dp-${s.key}`,
            nhom: 'menh_than',
            canCu: `[Căn cứ: Cung Mệnh (${menh.tenChi}) – ${nhanSao(s)}]`,
            tieuDe: `${s.ten}${s.dacTinhTen ? ` (${s.dacTinhTen})` : ''} thủ Mệnh`,
            noiDung: vietHoaDauCau(text),
            nguon: mucDuPhong.nguon,
            ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
          });
        }
      }
    }

    // 2. Nếu mới có 1 nhận định ở Mệnh, bổ sung 1 điểm nhấn nổi bật nhất tại Mệnh (Tứ Hóa -> Tuần/Triệt -> Phụ tinh)
    if (nhanDinhMenhThan.length < 2) {
      const coKhongKiep = !!(tim('Địa Không') || tim('Địa Kiếp'));
      const saoHoa = saoMenh.find((s) => s.hoa && KHO_TOM_TAT.tuHoa[s.hoa]);
      if (saoHoa && saoHoa.hoa) {
        const mHoa = KHO_TOM_TAT.tuHoa[saoHoa.hoa];
        const chon = saoHoa.hoa === 'Hóa Lộc' && coKhongKiep && mHoa.gapKhongKiep ? mHoa.gapKhongKiep : mHoa;
        nhanDinhMenhThan.push({
          id: `menh-hoa-${saoHoa.key}`,
          nhom: 'menh_than',
          canCu: `[Căn cứ: Cung Mệnh (${menh.tenChi}) – ${saoHoa.hoa} đi cùng ${saoHoa.ten}]`,
          tieuDe: `${saoHoa.hoa} tại cung Mệnh`,
          noiDung: vietHoaDauCau(thayBien(chon.y, { sao: saoHoa.ten })),
          nguon: chon.nguon,
          ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
        });
      }
    }

    if (nhanDinhMenhThan.length < 2 && (menh.tuan || menh.triet)) {
      const tenTt = menh.tuan ? 'Tuần' : 'Triệt';
      const bien = KHO_TOM_TAT.tuanTriet[tenTt];
      if (bien) {
        const chiu = saoMenh
          .filter((s) => s.loai === 'chinh' || KHO_TOM_TAT.phuTinh[s.ten] || s.ten.startsWith('Hóa '))
          .map((s) => s.ten);
        const ham = menh.chinhTinh.some(laSaoYeu) || saoMenh.some((s) => SAT_TINH.includes(s.ten));
        const sao = lietKe([...new Set(chiu)]) || 'các sao tại Mệnh';
        const muc = ham ? bien.ham : bien.sang;
        nhanDinhMenhThan.push({
          id: `menh-tt-${tenTt}`,
          nhom: 'menh_than',
          canCu: `[Căn cứ: Cung Mệnh (${menh.tenChi}) – ${tenTt} án ngữ]`,
          tieuDe: `${tenTt} án ngữ tại cung Mệnh`,
          noiDung: vietHoaDauCau(thayBien(muc.y, { sao })),
          nguon: muc.nguon,
          ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
        });
      }
    }

    if (nhanDinhMenhThan.length < 2) {
      for (const tenPhu of Object.keys(KHO_TOM_TAT.phuTinh)) {
        const s = tim(tenPhu);
        if (!s || saoDaNoi.has(tenPhu)) continue;
        const mPhu = KHO_TOM_TAT.phuTinh[tenPhu];
        const chon = s.dacTinh === 'H' && mPhu.H ? mPhu.H : mPhu;
        nhanDinhMenhThan.push({
          id: `menh-phu-${s.key}`,
          nhom: 'menh_than',
          canCu: `[Căn cứ: Cung Mệnh (${menh.tenChi}) – ${nhanSao(s)}]`,
          tieuDe: `${s.ten} đồng cung Mệnh`,
          noiDung: vietHoaDauCau(chon.y),
          nguon: chon.nguon,
          ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
        });
        break;
      }
    }
  }

  // 3. Nhận định cung an Thân (luôn lấy từ kho thanCu nếu có; tối đa đủ 3 nhận định Mệnh–Thân)
  if (than && nhanDinhMenhThan.length < 3) {
    const mThan = KHO_TOM_TAT.thanCu[than.ten];
    if (mThan) {
      const saoThan = [...than.chinhTinh, ...than.hungTinh];
      const kem =
        than.ten !== 'Mệnh' &&
        (than.chinhTinh.some((s) => s.dacTinh === 'H') ||
          saoThan.filter((s) => SAT_TINH.includes(s.ten)).length >= 2);
      const chon = kem && mThan.kem ? mThan.kem : mThan;
      const saoTen = than.chinhTinh.length
        ? ` – ${lietKe(than.chinhTinh.map(nhanSao))}`
        : '';
      nhanDinhMenhThan.push({
        id: `than-cu-${than.chi}`,
        nhom: 'menh_than',
        canCu: `[Căn cứ: Cung ${than.ten} (${than.tenChi}) – Thân cư ${than.ten}${saoTen}]`,
        tieuDe: than.ten === 'Mệnh' ? 'Thân cư Mệnh' : `Thân cư ${than.ten}`,
        noiDung: vietHoaDauCau(chon.y),
        nguon: chon.nguon,
        ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
      });
    }
  }

  // 4. 1 chủ đề năm 2027 (Đinh Mùi) từ cung Lưu Thái Tuế 2027 + Lưu Hóa Lộc (Thái Âm) nếu có trong kho tĩnh
  let chuDe2027: NhanDinhMienPhi | null = null;
  const cungLuuThaiTue = ls.cung[ln2027.luuThaiTue];
  const mucCung2027 = cungLuuThaiTue ? CHU_DE_THEO_CUNG_2027[cungLuuThaiTue.ten] : undefined;
  const hoaLoc2027 = ln2027.luuTuHoa.find((h) => h.hoa === 'Hóa Lộc');
  const cungHoaLoc = hoaLoc2027 ? ls.cung[hoaLoc2027.chi] : undefined;

  if (cungLuuThaiTue && mucCung2027) {
    const saoChinhCung = cungLuuThaiTue.chinhTinh.length
      ? `, ${lietKe(cungLuuThaiTue.chinhTinh.map(nhanSao))}`
      : '';
    const themLuuLoc =
      hoaLoc2027 && cungHoaLoc
        ? ` Đồng thời, Lưu Hóa Lộc năm Đinh Mùi (sao ${hoaLoc2027.sao}) rơi vào cung ${cungHoaLoc.ten} (${cungHoaLoc.tenChi}), gợi ý hướng dễ mở thêm cơ hội thuận lợi nếu bạn chủ động tập trung vào mảng này.`
        : '';

    const cungDaiVan = ln2027.daiVan != null ? ls.cung[ln2027.daiVan] : null;
    const thongTinDaiVan = cungDaiVan
      ? ` (đặt trong nền Đại vận ${cungDaiVan.daiVan} tuổi tại cung ${cungDaiVan.ten})`
      : '';

    chuDe2027 = {
      id: 'chu-de-2027',
      nhom: 'nam_2027',
      canCu: `[Căn cứ: Cung ${cungLuuThaiTue.ten} (${cungLuuThaiTue.tenChi}) – Lưu Thái Tuế 2027${saoChinhCung}${hoaLoc2027 && cungHoaLoc ? `; Lưu Hóa Lộc tại ${hoaLoc2027.sao} – Cung ${cungHoaLoc.ten}` : ''}]`,
      tieuDe: `Chủ đề năm Đinh Mùi 2027: ${mucCung2027.chuDe}`,
      noiDung: `${mucCung2027.moTa}${thongTinDaiVan}.${themLuuLoc}`,
      nguon: mucCung2027.nguon,
      ghiChuKiemDuyet: 'Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt).',
    };
  }

  return {
    nhanDinhMenhThan: nhanDinhMenhThan.slice(0, 3),
    chuDe2027,
  };
}

// Bảng tương quan Ngũ Hành giữa Bản Mệnh và năm Đinh Mùi 2027 (Thiên Hà Thủy — hành Thủy)
const QUAN_HE_VOI_THUY_2027: Record<
  NguHanh,
  { quanHe: string; moTa: string; goiY: string }
> = {
  Kim: {
    quanHe: 'Bản mệnh Kim sinh xuất cho hành Thủy năm 2027',
    moTa: 'Theo quy luật Ngũ Hành, Kim sinh Thủy: bạn có xu hướng chủ động bỏ công sức, chia sẻ năng lực hoặc đầu tư cho các mục tiêu mới trong năm 2027.',
    goiY: 'Nên phân bổ sức lực và ngân sách theo từng chặng ngắn để tránh dàn trải, ưu tiên việc tạo giá trị tích lũy lâu dài.',
  },
  Mộc: {
    quanHe: 'Hành Thủy năm 2027 tương sinh cho bản mệnh Mộc',
    moTa: 'Theo quy luật Ngũ Hành, Thủy sinh Mộc: nhịp năm 2027 mang tính bồi đắp, khá thuận để học thêm kỹ năng mới, nuôi dưỡng dự định đã ấp ủ và mở rộng kết nối.',
    goiY: 'Tận dụng đà thuận bằng cách đặt một mục tiêu trọng tâm rõ ràng từ đầu năm thay vì chờ đợi hoàn cảnh tự tới.',
  },
  Thủy: {
    quanHe: 'Bản mệnh Thủy bình hòa với hành Thủy năm 2027',
    moTa: 'Cùng hành Thủy tạo trạng thái đồng điệu, dễ giữ nhịp ổn định và nhìn nhận vấn đề linh hoạt hơn trong công việc lẫn quan hệ cá nhân.',
    goiY: 'Giữ kỷ luật kế hoạch để sự linh hoạt chuyển thành kết quả đo được, đồng thời rà soát kỹ các cam kết dài hạn.',
  },
  Hỏa: {
    quanHe: 'Hành Thủy năm 2027 tương khắc với bản mệnh Hỏa',
    moTa: 'Theo quy luật Ngũ Hành, Thủy khắc Hỏa: năm 2027 có thể đòi hỏi bạn tiết chế nhịp độ, rà soát kỹ rủi ro và chuẩn bị phương án dự phòng trước các quyết định lớn.',
    goiY: 'Đi chậm lại một nhịp khi gặp áp lực, ưu tiên củng cố nền tảng hiện có và cân bằng thời gian nghỉ ngơi thay vì chạy theo bước nhảy vội.',
  },
  Thổ: {
    quanHe: 'Bản mệnh Thổ chế khắc hành Thủy năm 2027',
    moTa: 'Theo quy luật Ngũ Hành, Thổ khắc Thủy: bạn có khả năng chủ động kiểm soát tình huống và biến thách thức thành cơ hội nếu bỏ công sức bền bỉ.',
    goiY: 'Chọn ít đầu việc nhưng làm chắc tay; duy trì kế hoạch tài chính rõ ràng để giữ thế chủ động suốt năm.',
  },
};

/**
 * Tổng quan miễn phí cho người chọn "Chưa rõ giờ sinh" (theo ngày–tháng–năm sinh, không an 12 cung).
 */
export function taoTongQuanKhongGioSinh(input: {
  lich: 'duong' | 'am';
  ngay: number;
  thang: number;
  nam: number;
  nhuan?: boolean;
  gioiTinh: 'nam' | 'nu';
}): KetQuaChuaRoGio {
  if (!Number.isInteger(input.nam) || input.nam < 1900 || input.nam > 2100) {
    throw new Error('Năm sinh cần trong khoảng 1900–2100.');
  }
  if (!Number.isInteger(input.thang) || input.thang < 1 || input.thang > 12) {
    throw new Error('Tháng sinh không hợp lệ.');
  }
  if (!Number.isInteger(input.ngay) || input.ngay < 1 || input.ngay > 31) {
    throw new Error('Ngày sinh không hợp lệ.');
  }

  let duong: { ngay: number; thang: number; nam: number };
  let am: { ngay: number; thang: number; nam: number; nhuan: boolean };

  if (input.lich === 'duong') {
    const check = new Date(Date.UTC(input.nam, input.thang - 1, input.ngay));
    if (check.getUTCDate() !== input.ngay || check.getUTCMonth() + 1 !== input.thang) {
      throw new Error('Ngày dương lịch không tồn tại.');
    }
    duong = { ngay: input.ngay, thang: input.thang, nam: input.nam };
    am = duongSangAm(input.ngay, input.thang, input.nam, 'lichSu');
  } else {
    if (input.ngay > 30) throw new Error('Tháng âm lịch chỉ có tối đa 30 ngày.');
    const d = amSangDuong(input.ngay, input.thang, input.nam, Boolean(input.nhuan), 'lichSu');
    if (!d) {
      throw new Error('Ngày âm lịch không tồn tại (hãy kiểm tra lại ngày 30 hoặc tháng nhuận).');
    }
    duong = d;
    am = { ngay: input.ngay, thang: input.thang, nam: input.nam, nhuan: Boolean(input.nhuan) };
  }

  const jdn = soNgayJulius(duong.ngay, duong.thang, duong.nam);
  const ccNam = canChiNam(am.nam);
  const ccThang = canChiThang(am.thang, am.nam);
  const ccNgay = canChiNgay(jdn);
  const banMenh = napAm(ccNam.can, ccNam.chi);
  const hanhMenh = hanhNapAm(banMenh);
  const tuoiMu2027 = 2027 - am.nam + 1;
  const qh = QUAN_HE_VOI_THUY_2027[hanhMenh];

  return {
    loai: 'chua_ro_gio',
    duong,
    am,
    gioiTinh: input.gioiTinh === 'nam' ? 'Nam' : 'Nữ',
    canChiNam: ccNam.ten,
    canChiThang: ccThang.ten,
    canChiNgay: ccNgay.ten,
    conGiap: TEN_CON_GIAP[ccNam.chi],
    banMenh,
    hanhMenh,
    tuoiMu2027,
    tongQuan2027: {
      namXem: 'Đinh Mùi (2027)',
      napAm2027: 'Thiên Hà Thủy (hành Thủy)',
      quanHeNguHanh: qh.quanHe,
      moTaQuanHe: qh.moTa,
      goiYDinhHuong: qh.goiY,
      canCu: `[Căn cứ: Năm sinh ${ccNam.ten} (${banMenh}) – Năm 2027 Đinh Mùi (Thiên Hà Thủy)]`,
    },
    lyDoKhongAn12Cung:
      'Trong Tử Vi Nam Phái, giờ sinh quyết định trực tiếp vị trí cung Mệnh và cung Thân, từ đó mới an được 12 cung chức năng (Quan Lộc, Tài Bạch, Phu Thê...) và toàn bộ 14 chính tinh cùng phụ tinh. Chỉ lệch 1 canh giờ (2 tiếng), 12 cung đã dịch chuyển sang một lá số khác hoàn toàn. Vì vậy, khi chưa rõ giờ sinh, xemboi.vn không tự đoán hay lập 12 cung để tránh đưa ra thông tin sai lệch.',
    anNut149k: true,
  };
}
