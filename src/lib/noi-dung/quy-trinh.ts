// Quy trình trạng thái nội dung (docs/v2/17 mục 2.2). Hàm thuần: người gọi nạp ngữ cảnh từ CSDL rồi hỏi "có được chuyển không".
// Quy tắc cứng:
//  - AI chỉ viết nháp: phiên bản xuất bản phải do người lưu (nguonTao !== 'AI').
//  - Phiên bản được duyệt phải đúng là phiên bản xuất bản; lưu phiên bản mới sau khi duyệt thì quay về chờ duyệt.
//  - Mảng rủi ro Vừa trở lên (canDuyetPhapLy) cần thêm duyệt PHAP_LY trên đúng phiên bản đó.
//  - Chưa có chuyên gia đồng ý trên phiên bản xuất bản thì trang phải noindex (tiêu chí onpage 10).
import type { TrangThaiNoiDung } from '@prisma/client';

export type Duyet = { phienBanId: string; vaiTro: 'BIEN_TAP' | 'CHUYEN_GIA' | 'PHAP_LY'; ketLuan: 'DONG_Y' | 'YEU_CAU_SUA' | 'TU_CHOI'; nguoiDuyetId: string };
export type NguCanhChuyen = {
  nguoiId: string;
  coQuyen: (q: 'noi_dung.soan' | 'noi_dung.duyet' | 'noi_dung.xuat_ban') => boolean;
  /** Phiên bản mới nhất (null nếu chưa có). */
  phienBan: { id: string; nguonTao: 'TAY' | 'AI' | 'NHAP_CU'; soLoiChan: number } | null;
  /** Việc AI gần nhất đạt kiểm trích dẫn (chỉ dùng khi rời AI_SOAN). */
  aiDatTrichDan?: boolean;
  chuyenGiaId: string | null;
  canDuyetPhapLy: boolean;
  duyet: Duyet[];
};
export type KetQuaChuyen = { duoc: true } | { duoc: false; lyDo: string };

const SAU: Record<TrangThaiNoiDung, TrangThaiNoiDung[]> = {
  NHAP: ['AI_SOAN', 'BIEN_TAP', 'LUU_TRU'],
  AI_SOAN: ['BIEN_TAP', 'NHAP', 'LUU_TRU'],
  BIEN_TAP: ['CHO_CHUYEN_GIA', 'AI_SOAN', 'LUU_TRU'],
  CHO_CHUYEN_GIA: ['DA_DUYET', 'CAN_SUA', 'BIEN_TAP'],
  CAN_SUA: ['BIEN_TAP', 'LUU_TRU'],
  DA_DUYET: ['DA_XUAT_BAN', 'BIEN_TAP'],
  DA_XUAT_BAN: ['CAN_CAP_NHAT', 'LUU_TRU'],
  CAN_CAP_NHAT: ['BIEN_TAP', 'LUU_TRU'],
  LUU_TRU: ['NHAP'],
};

const khong = (lyDo: string): KetQuaChuyen => ({ duoc: false, lyDo });

/** Duyệt đồng ý còn hiệu lực = trên đúng phiên bản mới nhất. */
export function dongYTren(duyet: Duyet[], phienBanId: string | undefined, vaiTro: Duyet['vaiTro']) {
  return !!phienBanId && duyet.some((d) => d.phienBanId === phienBanId && d.vaiTro === vaiTro && d.ketLuan === 'DONG_Y');
}

export function kiemChuyen(tu: TrangThaiNoiDung, den: TrangThaiNoiDung, c: NguCanhChuyen): KetQuaChuyen {
  if (!SAU[tu]?.includes(den)) return khong(`Không chuyển thẳng từ ${tu} sang ${den}`);
  const pb = c.phienBan;
  switch (den) {
    case 'AI_SOAN':
    case 'NHAP':
      return c.coQuyen('noi_dung.soan') ? { duoc: true } : khong('Thiếu quyền soạn');
    case 'BIEN_TAP':
      if (!c.coQuyen('noi_dung.soan')) return khong('Thiếu quyền soạn');
      if (tu === 'AI_SOAN' && !c.aiDatTrichDan) return khong('Nháp AI chưa qua kiểm trích dẫn');
      return { duoc: true };
    case 'CHO_CHUYEN_GIA':
      if (!c.coQuyen('noi_dung.soan')) return khong('Thiếu quyền soạn');
      if (!pb) return khong('Chưa có phiên bản nào');
      if (pb.nguonTao === 'AI') return khong('Phiên bản mới nhất do AI tạo; biên tập viên phải lưu một phiên bản của người trước khi gửi duyệt');
      if (pb.soLoiChan > 0) return khong(`Còn ${pb.soLoiChan} lỗi chặn`);
      if (!c.chuyenGiaId) return khong('Chưa giao chuyên gia duyệt');
      return { duoc: true };
    case 'DA_DUYET':
    case 'CAN_SUA':
      if (!c.coQuyen('noi_dung.duyet')) return khong('Thiếu quyền duyệt');
      if (c.chuyenGiaId !== c.nguoiId) return khong('Chỉ chuyên gia được giao mới duyệt được mục này');
      if (den === 'DA_DUYET' && !dongYTren(c.duyet, pb?.id, 'CHUYEN_GIA')) return khong('Chưa ghi ý kiến đồng ý trên phiên bản mới nhất');
      return { duoc: true };
    case 'DA_XUAT_BAN':
      if (!c.coQuyen('noi_dung.xuat_ban')) return khong('Thiếu quyền xuất bản');
      if (!pb) return khong('Chưa có phiên bản nào');
      if (pb.nguonTao === 'AI') return khong('AI chỉ được viết nháp; không xuất bản phiên bản do AI tạo');
      if (pb.soLoiChan > 0) return khong(`Còn ${pb.soLoiChan} lỗi chặn`);
      if (!dongYTren(c.duyet, pb.id, 'CHUYEN_GIA')) return khong('Phiên bản mới nhất chưa được chuyên gia duyệt (sửa sau khi duyệt thì phải duyệt lại)');
      if (c.canDuyetPhapLy && !dongYTren(c.duyet, pb.id, 'PHAP_LY')) return khong('Mảng này cần thêm duyệt pháp lý trên đúng phiên bản');
      return { duoc: true };
    case 'CAN_CAP_NHAT':
    case 'LUU_TRU':
      return c.coQuyen('noi_dung.xuat_ban') ? { duoc: true } : khong('Thiếu quyền xuất bản');
  }
}

/** Trạng thái sau khi lưu một phiên bản mới. Sửa sau khi đã duyệt/xuất bản thì quay về chờ duyệt. */
export function trangThaiSauKhiLuu(hienTai: TrangThaiNoiDung, nguonTao: 'TAY' | 'AI' | 'NHAP_CU'): TrangThaiNoiDung {
  if (nguonTao === 'AI') return hienTai === 'NHAP' || hienTai === 'BIEN_TAP' ? 'AI_SOAN' : hienTai;
  switch (hienTai) {
    case 'DA_DUYET':
    case 'DA_XUAT_BAN':
      return 'CHO_CHUYEN_GIA';
    case 'CAN_CAP_NHAT':
    case 'NHAP':
      return 'BIEN_TAP';
    default:
      return hienTai;
  }
}

/** Trang phải noindex khi phiên bản đang xuất bản chưa có chuyên gia đồng ý (tiêu chí 10). */
export function phaiNoindex(phienBanXuatBanId: string | null, duyet: Duyet[]): boolean {
  return !dongYTren(duyet, phienBanXuatBanId ?? undefined, 'CHUYEN_GIA');
}
