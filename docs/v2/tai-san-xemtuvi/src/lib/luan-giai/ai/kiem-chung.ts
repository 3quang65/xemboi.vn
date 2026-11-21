// Kiểm chứng năm 2025 và 2026: vài nhận định miễn phí về chính lá số để khách tự đối chiếu với năm mình đã sống, trước phần khóa của Vận 2027.
// Chỉ đọc vị trí lưu niên từ engine (qua src/lib/tuvi/index.ts), không dùng bộ quy tắc / nội dung 2027, không có mã quy tắc trong kết quả.
// Câu chữ do Hạnh duyệt (docs/san-pham/kiem-chung-mau.md); KIEM_CHUNG_CAU_TAM = false vì câu chữ đã được Thư duyệt.
import { luuNien, type LaSo } from '../../tuvi';
import { kiemTraNamXem, NAM_KIEM_CHUNG, xemTruocVanNam, type XemTruocVanNam } from './van-nam';

/** false: câu chữ đã là bản Thư duyệt (lần 2, 31/10/2026) và đã thay vào CHU_DE_CUNG / MAU_CAU. true chỉ khi quay lại câu tạm. */
export const KIEM_CHUNG_CAU_TAM = false;

export interface NhanDinhKiemChung { text: string; canCu: string }
export interface KiemChungNam { nam: number; canChi: string; nhanDinh: NhanDinhKiemChung[] }
export type XemTruocCoKiemChung = XemTruocVanNam & { kiemChung?: KiemChungNam[] };

/** Cờ môi trường, mặc định TẮT. Chỉ '1' mới bật. Đọc mỗi lần gọi (không cố định lúc nạp module). */
export const kiemChungBat = (): boolean => process.env.KIEM_CHUNG_QUA_KHU === '1';

/** Chủ đề 12 cung, cụm danh từ ghép sau "những chuyện về …". Câu chữ Hạnh viết, Thư duyệt (docs/san-pham/kiem-chung-mau.md mục 2.2). */
export const CHU_DE_CUNG: Record<string, string> = {
  'Mệnh': 'bản thân bạn, cách bạn nhìn nhận mình và những lựa chọn của riêng bạn',
  'Phụ Mẫu': 'cha mẹ, thầy cô, cấp trên và chuyện học hành, giấy tờ',
  'Phúc Đức': 'đời sống tinh thần, giá trị sống và sự gắn bó với gia đình, họ hàng',
  'Điền Trạch': 'nhà cửa, nơi ở, tổ ấm và tài sản tích lũy lâu dài',
  'Quan Lộc': 'công việc, chuyên môn và vị trí của bạn trong nghề',
  'Nô Bộc': 'bạn bè, đồng nghiệp, đối tác và mạng lưới quan hệ quanh bạn',
  'Thiên Di': 'việc đi xa, môi trường mới và cơ hội đến từ bên ngoài',
  'Tật Ách': 'nhịp sinh hoạt, cách bạn nghỉ ngơi và đối diện áp lực',
  'Tài Bạch': 'thu nhập, cách kiếm tiền và cách bạn chi tiêu, giữ tiền',
  'Tử Tức': 'những dự án sáng tạo, việc bạn ấp ủ và người nhỏ tuổi hơn mà bạn chăm lo',
  'Phu Thê': 'tình cảm, hôn nhân và người đồng hành bên bạn',
  'Huynh Đệ': 'anh chị em và những người ngang hàng cùng bạn hợp tác',
};

/** Câu mẫu M2–M6 chép nguyên văn từ kiem-chung-mau.md mục 2.1 (M1, M7 là câu tĩnh nằm ở KIEM_CHUNG_NHAN). */
export const MAU_CAU = {
  m2: (nam: number, canChi: string, tt: string, chuDe: string) =>
    `Năm ${nam} (${canChi}), Lưu Thái Tuế đi vào cung ${tt} trên lá số của bạn. xemtuvi.vn lấy cung này làm trọng điểm năm, nên những chuyện về ${chuDe} thường nổi rõ hơn các mảng khác.`,
  m3: (nam: number, tt: string) =>
    `Căn cứ: Lưu Thái Tuế năm ${nam} ở cung có chi trùng chi năm, trên lá số của bạn là cung ${tt}. Lấy cung này làm trọng điểm năm là quy ước của xemtuvi.vn; sách Việt như Tân Biên, Khảo Luận lấy cung tiểu hạn làm cung năm chính. Bài Vận 2027 đọc cả hai cung.`,
  m4: (nam: number, cl: string, chuDe: string) =>
    `Cũng trong năm ${nam}, Hóa Lộc của năm ${nam} rơi vào cung ${cl}, nên cơ hội dễ đến hơn qua những chuyện về ${chuDe}. Đây là khả năng nghiêng về; mức độ còn tùy cả lá số và lựa chọn của bạn.`,
  m5: (nam: number, can: string, sao: string, cl: string) =>
    `Căn cứ: can ${can} của năm ${nam} cho Hóa Lộc vào sao ${sao}, sao này nằm ở cung ${cl}. Đây là Hóa Lộc của năm, khác Tứ hóa gốc của lá số. Đọc Tứ hóa của năm là quy ước của xemtuvi.vn; sách Việt như Tân Biên, Khảo Luận không dùng lớp này.`,
  m6: (nam: number, tt: string) =>
    `Năm ${nam}, Hóa Lộc của năm cũng rơi vào chính cung ${tt}, nên mảng này vừa nổi rõ vừa là nơi cơ hội dễ đến hơn. Đây là khả năng nghiêng về, không phải điều chắc xảy ra.`,
};

/** Cung (tên) ứng với chi của lưu niên. */
const tenCung = (ls: LaSo, chi: number | null) => (chi == null ? '' : ls.cung[chi].ten);

/**
 * Nhận định kiểm chứng của một lá số, mỗi năm (2025, 2026): M2 + căn cứ M3 về cung Lưu Thái Tuế; M4 (hoặc M6 khi trùng cung) + căn cứ M5 về Hóa Lộc của năm.
 * Nói về xu hướng truy về cung/sao, không khẳng định sự kiện, không đe dọa, không kêu gọi mua.
 */
export function kiemChungQuaKhu(ls: LaSo): KiemChungNam[] {
  return NAM_KIEM_CHUNG.map((nam) => {
    kiemTraNamXem(nam, ls, { kiemChung: true });
    const ln = luuNien(ls, nam, true);
    const tt = tenCung(ls, ln.luuThaiTue);
    const can = ln.canChi.split(' ')[0];
    const nhanDinh: NhanDinhKiemChung[] = [{
      text: MAU_CAU.m2(nam, ln.canChi, tt, CHU_DE_CUNG[tt] ?? tt),
      canCu: MAU_CAU.m3(nam, tt),
    }];
    const loc = ln.luuTuHoa.find((h) => h.hoa === 'Hóa Lộc');
    if (loc) {
      const cl = tenCung(ls, loc.chi);
      nhanDinh.push({
        text: loc.chi === ln.luuThaiTue ? MAU_CAU.m6(nam, tt) : MAU_CAU.m4(nam, cl, CHU_DE_CUNG[cl] ?? cl),
        canCu: MAU_CAU.m5(nam, can, loc.sao, cl),
      });
    }
    return { nam, canChi: ln.canChi, nhanDinh };
  });
}

/** Bản xem trước Vận 2027 (đã cắt như cũ) kèm phần kiểm chứng khi cờ bật. Cờ tắt: không có khóa kiemChung. */
export function xemTruocCoKiemChung(ls: LaSo, tuyChon: { namXem?: number } = {}): XemTruocCoKiemChung {
  const xt = xemTruocVanNam(ls, tuyChon);
  return kiemChungBat() ? { ...xt, kiemChung: kiemChungQuaKhu(ls) } : xt;
}
