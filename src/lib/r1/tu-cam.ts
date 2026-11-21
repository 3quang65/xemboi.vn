// Danh sách từ/cụm từ bị cấm theo docs/v2/03-khach-hang.md & 04-dinh-vi-kinh-doanh.md.
// Dùng cho bộ test tự động quét toàn bộ câu chữ hiển thị trên trang /tu-vi-2027.

export interface ViPhamTuCam {
  cumTu: string;
  lyDo: string;
  doanTrich: string;
}

export const DANH_SACH_TU_CAM: readonly { cumTu: string; lyDo: string }[] = [
  // Nhóm 1: Từ hù dọa, mê tín, bán lễ (03 chủ đề 1 & 04 mục 3.4)
  { cumTu: 'hạn nặng', lyDo: 'Từ hù dọa gây hoang mang (03)' },
  { cumTu: 'tai ương', lyDo: 'Từ hù dọa gây hoang mang (03)' },
  { cumTu: 'phá giải', lyDo: 'Ngôn ngữ giải hạn/mê tín bị cấm (04 mục 3.4)' },
  { cumTu: 'cúng giải hạn', lyDo: 'Bán lễ giải hạn bị cấm (04 mục 3.4)' },
  { cumTu: 'dâng sao giải hạn', lyDo: 'Bán lễ giải hạn bị cấm (04 mục 3.4)' },
  { cumTu: 'làm lễ giải hạn', lyDo: 'Bán lễ giải hạn bị cấm (04 mục 3.4)' },
  { cumTu: 'cắt duyên âm', lyDo: 'Dịch vụ mê tín bị cấm (04 mục 3.4)' },
  { cumTu: 'cao số', lyDo: 'Phán gây lo âu cho P1 (03 #54, #55)' },
  { cumTu: 'đại hung', lyDo: 'Phán cực đoan bị cấm (03 #86, 04)' },
  { cumTu: 'xui tận mạng', lyDo: 'Từ hù dọa (03)' },
  { cumTu: 'tai họa', lyDo: 'Từ hù dọa (03)' },
  { cumTu: 'trừ tà', lyDo: 'Vật phẩm/lễ mê tín bị cấm (04 mục 3.4)' },
  { cumTu: 'đổi vận', lyDo: 'Cam kết đổi vận bị cấm (04 mục 3.4)' },
  { cumTu: 'bùa chú', lyDo: 'Mê tín bị cấm (04 mục 3.4)' },
  { cumTu: 'vong theo', lyDo: 'Từ hù dọa (03)' },
  { cumTu: 'chết yểu', lyDo: 'Phán sinh tử bị cấm (04 mục 3.4)' },
  { cumTu: 'tuyệt tự', lyDo: 'Phán cực đoan bị cấm' },
  { cumTu: 'tù tội', lyDo: 'Phán cực đoan bị cấm' },
  { cumTu: 'sát phu', lyDo: 'Phán gây lo âu hôn nhân bị cấm' },
  { cumTu: 'sát thê', lyDo: 'Phán gây lo âu hôn nhân bị cấm' },
  { cumTu: 'không lấy chồng được', lyDo: 'Câu hù dọa gây sợ cho P1 (03 #54)' },

  // Nhóm 2: Thủ thuật ép mua, khan hiếm giả, gạch giá ảo (04 mục 3.2 & 6.1)
  { cumTu: 'chỉ còn', lyDo: 'Cấm thông điệp khan hiếm giả "chỉ còn X suất"' },
  { cumTu: 'suất cuối', lyDo: 'Cấm khan hiếm giả' },
  { cumTu: 'đếm ngược', lyDo: 'Cấm đồng hồ đếm ngược giả' },
  { cumTu: 'giá gốc', lyDo: 'Cấm gạch giá ảo' },
  { cumTu: 'giảm sốc', lyDo: 'Cấm tạo cảm giác ép mua' },
  { cumTu: 'ưu đãi sắp hết', lyDo: 'Cấm tạo áp lực thời gian giả' },

  // Nhóm 3: Quà mồi / mời phỏng vấn bị cấm trong hộp thoại R1 (04 mục 6.1 bước 4, sửa C1)
  { cumTu: 'bản thử miễn phí', lyDo: 'Cấm kèm quà miễn phí làm nhiễu chỉ số R1 (04 C1)' },
  { cumTu: 'góp ý 10 phút', lyDo: 'Cấm kèm lời mời phỏng vấn trong hộp thoại R1 (04 C1)' },
  { cumTu: 'phỏng vấn 15 phút', lyDo: 'Cấm trộn luồng phỏng vấn vào hộp thoại mua R1' },

  // Nhóm 4: Thu tiền / thanh toán bị cấm hoàn toàn ở R1
  { cumTu: 'vietqr', lyDo: 'Không được gắn cổng thanh toán ở trang R1' },
  { cumTu: 'sepay', lyDo: 'Không được gắn cổng thanh toán ở trang R1' },
  { cumTu: 'số tài khoản', lyDo: 'Không được hiện số tài khoản thu tiền ở trang R1' },
  { cumTu: 'chuyển khoản ngay', lyDo: 'Không được thu tiền ở trang R1' },
];

/**
 * Quét văn bản tiếng Việt để phát hiện cụm từ cấm.
 * Lưu ý: cụm "không bán lễ giải hạn" được phép vì là cam kết phủ định bắt buộc của 04 mục 1 & 6.1.
 */
export function kiemTraTuCam(vanBan: string): ViPhamTuCam[] {
  const chuanHoa = vanBan.toLocaleLowerCase('vi');
  const viPham: ViPhamTuCam[] = [];

  for (const muc of DANH_SACH_TU_CAM) {
    const tu = muc.cumTu.toLocaleLowerCase('vi');
    let idx = chuanHoa.indexOf(tu);
    while (idx !== -1) {
      const batDau = Math.max(0, idx - 30);
      const ketThuc = Math.min(vanBan.length, idx + tu.length + 30);
      viPham.push({
        cumTu: muc.cumTu,
        lyDo: muc.lyDo,
        doanTrich: vanBan.slice(batDau, ketThuc).replace(/\s+/g, ' ').trim(),
      });
      idx = chuanHoa.indexOf(tu, idx + tu.length);
    }
  }

  // Kiểm tra riêng "giải hạn": chỉ được phép xuất hiện trong cụm cam kết "không bán lễ giải hạn"
  const reGiaiHan = /giải hạn/gi;
  let m: RegExpExecArray | null;
  while ((m = reGiaiHan.exec(vanBan)) !== null) {
    const truoc = vanBan.slice(Math.max(0, m.index - 20), m.index).toLocaleLowerCase('vi');
    if (!truoc.includes('không bán lễ')) {
      const batDau = Math.max(0, m.index - 30);
      const ketThuc = Math.min(vanBan.length, m.index + 38);
      viPham.push({
        cumTu: 'giải hạn',
        lyDo: 'Từ "giải hạn" chỉ được xuất hiện trong cam kết phủ định "không bán lễ giải hạn"',
        doanTrich: vanBan.slice(batDau, ketThuc).replace(/\s+/g, ' ').trim(),
      });
    }
  }

  return viPham;
}
