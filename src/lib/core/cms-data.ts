export interface CmsCategory {
  slug: string;
  name: string;
  description: string;
}

export interface CmsArticle {
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  contentHtml: string;
}

export const CMS_CATEGORIES: CmsCategory[] = [
  {
    slug: 'tu-vi-nam-phai',
    name: 'Tử Vi Nam Phái',
    description: 'Kiến thức chính thống về 14 Chính tinh, hơn 100 Phụ tinh, Tam phương tứ chính và cách cục Tử Vi Đẩu Số.',
  },
  {
    slug: 'lich-van-nien-am-duong',
    name: 'Lịch Vạn Niên & Tiết Khí',
    description: 'Thuật toán Âm Dương lịch Hồ Ngọc Đức, 24 Tiết khí, 12 Trực và nguyên lý chọn ngày lành tháng tốt.',
  },
  {
    slug: 'tu-tru-bat-tu',
    name: 'Tứ Trụ Bát Tự',
    description: 'Phân tích Thiên Can Địa Chi của Năm, Tháng, Ngày, Giờ sinh, Dụng thần và cân bằng Ngũ hành.',
  },
  {
    slug: 'kinh-dich-phong-thuy',
    name: 'Kinh Dịch & Phong Thủy',
    description: 'Ứng dụng 64 Quẻ Kinh Dịch, Cung Phi Bát Trạch và nguyên tắc bài trí phong thủy nhà ở, bàn làm việc.',
  },
];

export const CMS_ARTICLES: CmsArticle[] = [
  {
    slug: 'huong-dan-doc-la-so-tu-vi-nam-phai-cho-nguoi-moi',
    title: 'Hướng Dẫn Đọc Lá Số Tử Vi Nam Phái Chuẩn Xác Cho Người Mới Bắt Đầu',
    categorySlug: 'tu-vi-nam-phai',
    categoryName: 'Tử Vi Nam Phái',
    excerpt: 'Nắm vững cấu trúc 12 cung địa bàn, Thiên bàn, 14 Chính tinh, Tam hợp Mệnh – Tài – Quan và quy tắc Âm Dương Thuận Nghịch Lý.',
    publishedAt: '2026-01-15',
    readingMinutes: 8,
    contentHtml: `
      <p>Trong hệ thống <strong>Tử Vi Đẩu Số Nam Phái</strong> tại <strong>XemBoi.vn</strong>, một lá số hoàn chỉnh gồm <strong>Thiên Bàn</strong> (ô trung tâm ghi thông tin đương số, Bản mệnh Nạp âm, Cục, Chủ Mệnh, Chủ Thân) và <strong>12 Cung Địa Bàn</strong> cố định từ Tý đến Hợi.</p>
      <h3>1. Nguyên lý Tam Phương Tứ Chính</h3>
      <p>Khi luận bất kỳ cung nào — đặc biệt là <strong>Cung Mệnh</strong> — người xem không bao giờ chỉ nhìn một cung đơn lẻ mà phải xét tổng hòa 4 cung:</p>
      <ul>
        <li><strong>Bản cung (Cung Mệnh):</strong> Nền tảng tính cách, tư chất và định hướng gốc.</li>
        <li><strong>Cung Xung Chiếu (Thiên Di):</strong> Môi trường xã hội bên ngoài tác động ngược lại đương số.</li>
        <li><strong>Hai Cung Tam Hợp (Tài Bạch &amp; Quan Lộc):</strong> Phương thức kiếm tiền, quản lý tài chính và con đường công danh sự nghiệp.</li>
      </ul>
      <h3>2. Phân biệt 14 Chính Tinh và Trạng Thái Đắc / Hãm</h3>
      <p>14 Chính tinh chia làm 2 vòng: <strong>Vòng Tử Vi</strong> (Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh) và <strong>Vòng Thiên Phủ</strong> (Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân). Mỗi sao khi đóng tại từng địa chi sẽ có độ sáng khác nhau: <em>Miếu địa (M), Vượng địa (V), Đắc địa (Đ), Bình hòa (B), Hãm địa (H)</em>.</p>
      <h3>3. Vai trò của Tuần, Triệt và Tứ Hóa</h3>
      <p><strong>Tuần Trung Không Vong</strong> và <strong>Triệt Lộ Không Vong</strong> đóng vai trò như chiếc cầu đóng/mở khí lực của các sao trong cung. Trong khi đó, <strong>Tứ Hóa</strong> (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) là động lực biến hóa mạnh nhất thúc đẩy cát hung trong từng Đại vận 10 năm và Tiểu hạn từng năm.</p>
    `,
  },
  {
    slug: 'thuat-toan-am-lich-ho-ngoc-duc-va-cach-tinh-gio-ty-dem',
    title: 'Thuật Toán Âm Lịch Hồ Ngọc Đức, Tháng Nhuận Và Quy Tắc Giờ Tý Đêm (23h–01h)',
    categorySlug: 'lich-van-nien-am-duong',
    categoryName: 'Lịch Vạn Niên & Tiết Khí',
    excerpt: 'Giải thích chi tiết cách tính Sóc (New Moon), Trung khí, xác định tháng nhuận Âm lịch và cách quy đổi giờ Tý (23h–01h) chuẩn lịch pháp Việt Nam.',
    publishedAt: '2026-01-20',
    readingMinutes: 6,
    contentHtml: `
      <p>Hệ thống chuyển đổi ngày Âm – Dương của <strong>XemBoi.vn</strong> sử dụng <strong>Thuật toán Âm lịch Hồ Ngọc Đức</strong> theo múi giờ chuẩn Việt Nam (UTC+7).</p>
      <h3>1. Nguyên tắc xác định ngày Mùng 1 (Sóc) và Tháng Nhuận</h3>
      <p>Điểm Sóc được tính theo kinh độ mặt trời và mặt trăng thiên văn. Một năm âm lịch có 13 tháng (năm nhuận) khi giữa hai tháng 11 âm lịch liên tiếp có 13 điểm Sóc; tháng đầu tiên không chứa <em>Trung khí</em> được định danh là <strong>Tháng Nhuận</strong>.</p>
      <h3>2. Cách phân chia Tháng Nhuận trong Tử Vi Nam Phái</h3>
      <p>Khi đương số sinh vào tháng nhuận âm lịch, nguyên tắc truyền thống của Tử Vi Nam Phái xử lý chuẩn xác theo nửa đầu tháng (từ mùng 1 đến hết ngày 15 tính theo tháng chính) hoặc phân định rõ trên lá số để an sao Tháng đúng chuẩn.</p>
      <h3>3. Lưu ý đặc biệt với người sinh Giờ Tý (23h00 – 00h59)</h3>
      <p>Trong lịch pháp phương Đông, một ngày mới theo Địa Chi bắt đầu từ <strong>23h00 (Đầu giờ Tý)</strong>. Do đó, khi chọn khung giờ sinh từ 23h–01h tại XemBoi.vn, hệ thống tự động đối chiếu chính xác chỉ số Địa Chi giờ Tý (<code>chiGio = 0</code>) để an cung Mệnh và cung Thân đồng cung tại đúng vị trí.</p>
    `,
  },
  {
    slug: 'cach-cuc-tu-phu-vu-tuong-va-sat-pha-tham-trong-tu-vi',
    title: 'So Sánh Hai Cách Cục Lớn: Tử Phủ Vũ Tướng Và Sát Phá Tham Trong Tử Vi',
    categorySlug: 'tu-vi-nam-phai',
    categoryName: 'Tử Vi Nam Phái',
    excerpt: 'Tìm hiểu sự đối lập và bổ khuyết giữa mẫu người lãnh đạo ổn định (Tử Phủ Vũ Tướng) và mẫu người tiên phong đột phá (Sát Phá Tham).',
    publishedAt: '2026-02-02',
    readingMinutes: 7,
    contentHtml: `
      <p>Trong 12 cung lá số Tử Vi, hai tam hợp đối lập rõ nét nhất về khí chất chính là <strong>Tử Phủ Vũ Tướng</strong> và <strong>Sát Phá Tham</strong>.</p>
      <h3>1. Cách cục Tử Phủ Vũ Tướng: Quản trị và Ổn định</h3>
      <p>Quy tụ 4 đế tinh và tài tinh: <em>Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng</em>. Khi hội thêm Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Lộc Tồn thì hình thành cách cục <strong>Quân Thần Khánh Hội</strong> — mẫu người có năng lực tổ chức, trọng chữ tín, giữ kỷ cương và phát triển bền vững trong các tổ chức lớn.</p>
      <h3>2. Cách cục Sát Phá Tham: Khai phá và Biến革</h3>
      <p>Gồm ba sao <em>Thất Sát, Phá Quân, Tham Lang</em> luôn luôn hội chiếu nhau trong tam hợp Mệnh – Tài – Quan. Đây là mẫu người hành động quyết liệt, dám nghĩ dám làm, càng đi qua nghịch cảnh càng bứt phá mạnh mẽ.</p>
    `,
  },
  {
    slug: 'ung-dung-tu-tru-bat-tu-va-chon-dung-than-cai-van',
    title: 'Tứ Trụ Bát Tự Là Gì? Cách Tìm Dụng Thần, Hỷ Thần Để Cân Bằng Ngũ Hành',
    categorySlug: 'tu-tru-bat-tu',
    categoryName: 'Tứ Trụ Bát Tự',
    excerpt: 'Phương pháp phân tích Nhật Chủ vượng suy qua 4 trụ Năm, Tháng, Ngày, Giờ và ứng dụng Dụng thần vào chọn nghề nghiệp, màu sắc.',
    publishedAt: '2026-02-10',
    readingMinutes: 6,
    contentHtml: `
      <p><strong>Tứ Trụ (Bát Tự)</strong> xét trực tiếp khí lực Ngũ Hành của 8 chữ Thiên Can và Địa Chi thuộc 4 trụ: <em>Niên trụ, Nguyệt trụ, Nhật trụ, Thời trụ</em>.</p>
      <h3>1. Nhật Chủ (Can Ngày) là trung tâm</h3>
      <p>Thiên Can của ngày sinh đại diện cho chính bản thân đương số. Bằng cách so sánh Nhật Chủ với lệnh tháng (Nguyệt lệnh) và các can chi xung quanh, ta xác định được mệnh cục thuộc <strong>Thân Vượng</strong> hay <strong>Thân Nhược</strong>.</p>
      <h3>2. Chọn Dụng Thần và Hỷ Thần</h3>
      <p>Nếu Thân Vượng, cần dùng hành tiết khí (Thực Thương), khắc chế (Quan Sát) hoặc hao khí (Tài tinh) làm <strong>Dụng thần</strong>. Ngược lại, nếu Thân Nhược, Dụng thần sẽ là hành sinh trợ (Ấn tinh) và đồng hành (Tỷ Kiếp).</p>
    `,
  },
];
