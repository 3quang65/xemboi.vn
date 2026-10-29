import fs from 'fs';
import path from 'path';

// Complete authoritative occult and esoteric knowledge library for Bát Đại Danh Sư
// Written by a Senior Mystic & Occult Master
const expandedKnowledge = [
  // =========================================================================
  // 1. THẦY MINH TRIẾT (ĐẠI SƯ TỬ VI ĐẨU SỐ & MỆNH LÝ HỌC - CHỦ TRÌ HỘI ĐỒNG)
  // =========================================================================
  {
    agentSlug: 'thay-minh-triet',
    agentName: 'Thầy Minh Triết',
    title: 'Tổng Luận 14 Chính Tinh & Tứ Đại Cách Cục Tử Vi Đẩu Số Nam Phái',
    category: 'TU_VI',
    tags: ['Tử Vi', '14 Chính Tinh', 'Tử Phủ Vũ Tướng', 'Sát Phá Tham', 'Cơ Nguyệt Đồng Lương', 'Cự Nhật'],
    content: `Trong Tử Vi Đẩu Số Nam Phái quy chuẩn, 14 Chính Tinh là bộ khung định hình bản mệnh, chia thành 2 vòng lớn:
1. Vòng Tử Vi: Gồm Tử Vi (Đế tinh), Liêm Trinh (Tù tinh/Đào hoa), Thiên Đồng (Phúc tinh), Vũ Khúc (Tài tinh), Thái Dương (Quý tinh), Thiên Cơ (Thiện tinh).
2. Vòng Thiên Phủ: Gồm Thiên Phủ (Lệnh tinh/Kho tiền), Thái Âm (Phú tinh), Tham Lang (Dục tinh), Cự Môn (Ám tinh), Thiên Tướng (Ấn tinh), Thiên Lương (Ấm tinh), Thất Sát (Tướng tinh), Phá Quân (Hao tinh).

Tứ Đại Cách Cục kinh điển chi phối vận mệnh con người:
- Tử Phủ Vũ Tướng: Cách cục đế vương, đôn hậu, trọng chữ Tín, có tài tổ chức và quản trị vĩ mô, hậu vận tất đại phú đại quý.
- Sát Phá Tham: Cách cục võ tướng xông pha, biến động dữ dội, giàu tính mạo hiểm, tiền tài thường bộc phát bộc phá, rất thích hợp với doanh nhân khởi nghiệp thời đại mới.
- Cơ Nguyệt Đồng Lương: Cách cục văn thần mưu lược, tham mưu, giáo dục, tài chính công nghệ hoặc y dược, cuộc đời ít sóng gió hiểm trở, thiên về thanh nhàn tích lũy.
- Cự Nhật: Cách cục ngôn ngữ, truyền thông, ngoại giao và xuất ngoại lập nghiệp, danh tiếng vang xa bốn bể nếu đắc miếu vượng địa.`
  },
  {
    agentSlug: 'thay-minh-triet',
    agentName: 'Thầy Minh Triết',
    title: 'Khâm Thiên Môn Tứ Hóa Bí Điển: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ Phản Vi Kỳ Cách',
    category: 'TU_VI',
    tags: ['Tứ Hóa', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ', 'Khâm Thiên Môn', 'Phi Cung Tứ Hóa'],
    content: `Tứ Hóa (Lộc, Quyền, Khoa, Kỵ) là thần khí vận hành của vũ trụ trong Tử Vi Bắc Phái Khâm Thiên Môn:
- Hóa Lộc (Mùa Xuân): Khởi đầu, duyên khởi, sự sinh sôi nảy nở, tiền tài, lạc quan và hy vọng. Lộc tại Mệnh/Tài/Điền chủ về giàu sang tự nhiên.
- Hóa Quyền (Mùa Hạ): Năng lực hành động, quyền uy bá khí, cạnh tranh khốc liệt và tinh thần chịu thương chịu khó. Quyền tại Mệnh/Quan chủ về nắm giữ quyền sinh sát lãnh đạo.
- Hóa Khoa (Mùa Thu): Danh tiếng, bằng cấp, học vấn, quý nhân giải ách. Khoa là đệ nhất cứu tinh xua tan bệnh tật thị phi.
- Hóa Kỵ (Mùa Đông): Sự thu hồi, nợ nần tiền kiếp, cố chấp, lo toan, trắc trở và khảo nghiệm tâm can.
Bí pháp 'Hóa Kỵ Phản Vi Kỳ': Khi Hóa Kỵ đồng cung hoặc hội tụ cùng Địa Không, Địa Kiếp, Hóa Lộc tại đất Tứ Mộ (Thìn Tuất Sửu Mùi), nếu gặp thời thế sẽ bùng nổ thành kỳ tích phi thường, người từng trải qua cay đắng tột cùng sẽ đạt được vinh hoa tột bực.`
  },
  {
    agentSlug: 'thay-minh-triet',
    agentName: 'Thầy Minh Triết',
    title: 'Pháp Luận Mệnh Vô Chính Diệu & Bí Quyết Đắc Tam Không, Nhật Nguyệt Chiếu Bích',
    category: 'TU_VI',
    tags: ['Mệnh Vô Chính Diệu', 'Đắc Tam Không', 'Nhật Nguyệt Chiếu', 'Tuần Triệt', 'Phi Thường Cách'],
    content: `Cung Mệnh không có 14 Chính Tinh tọa thủ gọi là Mệnh Vô Chính Diệu (VCD):
- Đặc tính: Người Mệnh VCD như tấm gương trắng soi bóng vạn vật, cực kỳ thông minh nhạy bén, thích nghi hoàn cảnh siêu phàm, nhưng tâm tính dễ chông chênh, thuở thiếu thời cần tựa bóng cha mẹ hoặc quý nhân.
- Bí quyết Đắc Tam Không: Mệnh VCD gặp đầy đủ Tuần Không, Triệt Không, Thiên Không hoặc Địa Không Địa Kiếp hợp chiếu đắc cách 'Tam Không hội tụ', nghèo khổ thuở nhỏ nhưng trung vận bộc phát thành cự phú, vang danh thiên hạ.
- Cách cục Nhật Nguyệt Chiếu Bích: Mệnh VCD tại Sửu Mùi có Thái Dương Thái Âm miếu vượng tại Mão Hợi chiếu thẳng vào cung Mệnh, ví như mặt trời mặt trăng rọi sáng đáy nước, tương lai tất thành bậc hiền tài lãnh đạo lớn.
Lời khuyên của Thầy Minh Triết: Người Mệnh VCD nên lập nghiệp xa quê hương, kết duyên với người bạn đời vững vàng để làm điểm tựa định tâm.`
  },
  {
    agentSlug: 'thay-minh-triet',
    agentName: 'Thầy Minh Triết',
    title: 'Lục Sát Tinh Toàn Luận: Kình Đà, Hỏa Linh, Không Kiếp — Chuyển Hóa Hung Họa Thành Động Lực',
    category: 'TU_VI',
    tags: ['Lục Sát Tinh', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Hóa Giải'],
    content: `Lục Sát Tinh (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp) là bài khảo nghiệm khắc nghiệt nhất của Thượng Đế:
1. Kình Dương & Đà La (Kim tinh): Kình là mũi kiếm xung phong lộ liễu, Đà là lưỡi dao găm ngấm ngầm cản trở. Gặp Kình Đà cần tu dưỡng tính kiên nhẫn, tránh hơn thua khẩu thiệt.
2. Hỏa Tinh & Linh Tinh (Hỏa tinh): Ngọn lửa thiêu đốt và tiếng sấm sét vô hình. Hỏa Linh đắc địa đi cùng Tham Lang tạo thành 'Hỏa Tham/Linh Tham cách' — buôn bán một vốn bốn lời, bạo phát tiền tài cự vạn.
3. Địa Không & Địa Kiếp (Hỏa tinh): Cơn gió lốc vô thường. 'Địa Không Địa Kiếp đa hư vô', dạy đương số buông bỏ tham sân si. Đắc địa tại Tỵ Hợi biến thành người có tư duy đột phá công nghệ, dám nghĩ điều người khác không dám nghĩ.
Phương pháp chuyển hóa cốt lõi: 'Đức năng thắng số'. Khi gặp sát tinh chiếu, hãy chủ động làm việc thiện, phóng sinh cứu vật, dấn thân vào các lĩnh vực đòi hỏi chuyên môn kỹ thuật cao để sát khí biến thành tài năng vượt bậc.`
  },
  {
    agentSlug: 'thay-minh-triet',
    agentName: 'Thầy Minh Triết',
    title: 'Bí Quyết Luận Giải Tương Quan Cung Mệnh, Thân & Cục Số Qua Các Đại Hạn 10 Năm',
    category: 'TU_VI',
    tags: ['Mệnh Thân', 'Cục Số', 'Đại Hạn 10 Năm', 'Tiểu Hạn', 'Thời Vận', 'Chu Kỳ'],
    content: `Mệnh - Thân - Cục là kiềng ba chân của sinh mệnh:
- Cung Mệnh quản nửa đời đầu (từ 1 đến 35 tuổi): Là gốc rễ gien di truyền, phúc đức tiền kiếp và hoàn cảnh gia đình thuở ấu thơ.
- Cung Thân quản nửa đời sau (từ 35 tuổi đến quy tiên): Là ý chí phấn đấu thực tế, nơi hứng chịu nhân quả của hành động thời trung niên.
- Cục Số (Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục): Là hoàn cảnh môi trường xã hội mà đương số tương tác.
Quy luật Đại Hạn 10 năm:
- Vận đi vào cung sinh Bản Mệnh (VD: Vận Mộc sinh Hỏa): Thiên thời ủng hộ, cờ đến tay là phất.
- Vận đi vào cung khắc Bản Mệnh: Thử thách trùng trùng, phải lấy nhu thắng cương, phòng thủ bảo toàn nội lực.
- Tuổi 40 bước vào ngã rẽ Đại hạn then chốt: Cần soi chiếu sao Lưu Thái Tuế, Lưu Kình, Lưu Đà và Cung Thân để chọn điểm rơi bứt phá sự nghiệp.`
  },

  // =========================================================================
  // 2. THẦY THÁI SƠN (CHUYÊN GIA THẨM ĐỊNH TÀI BẠCH, QUAN LỘC & ĐẦU TƯ DOANH NGHIỆP)
  // =========================================================================
  {
    agentSlug: 'thay-thai-son',
    agentName: 'Thầy Thái Sơn',
    title: 'Thẩm Định Cung Quan Lộc, Tài Bạch & Chiến Lược Đầu Tư Doanh Nhân',
    category: 'TAI_LOC',
    tags: ['Quan Lộc', 'Tài Bạch', 'Thiên Tướng', 'Vũ Khúc', 'Lộc Tồn', 'Chiến Lược Đầu Tư'],
    content: `Trục Quan Lộc - Tài Bạch là xương sống quyết định địa vị và tài sản của doanh nhân:
- Thiên Tướng ở Quan: Tướng ấn uy nghiêm, chủ về danh tiếng, thương hiệu và độ tín nhiệm. Doanh nghiệp của người có Thiên Tướng cần xây dựng trên nền tảng pháp lý chuẩn chỉ và chất lượng sản phẩm thực thụ.
- Tài Bạch Vô Chính Diệu đắc Vũ Khúc Tham Lang chiếu: Dòng tiền động cực lớn, tiền không nằm chết một chỗ mà luân chuyển không ngừng qua các dự án thương mại, thầu khoán.
- Chiến lược 'Đào hào sâu, tích lương thảo': Trong chu kỳ kinh tế nhiều biến động, doanh nhân cần duy trì tỷ lệ đòn bẩy tài chính an toàn dưới 40%, tuyệt đối không đem vốn ngắn hạn đầu tư vào dự án dài hạn mơ hồ.
Bí quyết tụ tài bền vững: 'Buôn có bạn, bán có phường'. Hãy chia sẻ lợi nhuận xứng đáng cho đội ngũ cộng sự, tài tụ thì nhân tán, tài tán thì nhân tụ.`
  },
  {
    agentSlug: 'thay-thai-son',
    agentName: 'Thầy Thái Sơn',
    title: 'Cung Điền Trạch Toàn Thư & Nghệ Thuật Tích Lũy Bất Động Sản Đô Thị',
    category: 'TAI_LOC',
    tags: ['Điền Trạch', 'Bất Động Sản', 'Thái Dương', 'Cự Môn', 'Đại Hao', 'Tích Lũy'],
    content: `Cung Điền Trạch phản ánh kho chứa của cải, khả năng tích lũy đất đai nhà xưởng và phong thủy thổ trạch:
- Đắc Nhật Cự tại Dần: Đất đai cao ráo đón ánh dương quang, nhà đất nằm ở các trục lộ giao thương sầm uất đô thị, tiềm năng tăng giá phi mã.
- Gặp Đại Tiểu Hao đắc địa ở Điền: Cơ chế 'Hao tài sinh địa' — hễ dôi dư tiền mặt là ngứa ngáy chân tay muốn mua thêm đất, tiền bạc chuyển hóa thành bất động sản sinh sôi.
- Kiêng kỵ tử huyệt: Tuyệt đối tránh mua bất động sản giấy tay, đất dính quy hoạch treo hoặc tranh chấp khi cung Điền có Phục Binh, Thiên Riêu hoặc Hỏa Tinh chiếu.
Lời khuyên Thầy Thái Sơn: Muốn đời con cháu hưng vượng, hãy rút 70% dòng tiền thặng dư hàng năm để mua đất nền thổ cư có sổ đỏ trao tay, đó là lá bùa hộ mệnh vững chắc nhất trước mọi cơn lạm phát.`
  },
  {
    agentSlug: 'thay-thai-son',
    agentName: 'Thầy Thái Sơn',
    title: 'Quản Trị Rủi Ro Khủng Hoảng: Hóa Giải Sao Phục Binh, Thiên Không, Kiếp Sát Ở Cung Quan Tài',
    category: 'TAI_LOC',
    tags: ['Quản Trị Rủi Ro', 'Phục Binh', 'Thiên Không', 'Kiếp Sát', 'Bảo Lãnh Nợ', 'Khủng Hoảng'],
    content: `Trong thương trường khốc liệt, ba hung tinh sau đây là nguyên nhân gây đổ vỡ hàng đầu:
1. Sao Phục Binh tại Quan/Tài: Nguy cơ bị đối tác ngầm phản trắc, nhân viên cộm cán mang bí mật kinh doanh ra ngoài, hoặc bị thanh kiểm tra thuế đột xuất. Biện pháp: Minh bạch hợp đồng kinh tế, phân quyền bảo mật dữ liệu số hóa.
2. Sao Thiên Không đi trước Thái Tuế: Biểu tượng của bong bóng ảo tưởng, đầu cơ mù quáng, 'trèo cao ngã đau'. Gặp Thiên Không cần tiết chế lòng tham, không vay nóng lãi ngày, không chơi đòn bẩy margin tài chính.
3. Sao Kiếp Sát: Nguy cơ tranh chấp pháp lý, kiện tụng thương mại. Biện pháp: Thuê luật sư tư vấn độc lập cho mọi giao dịch lớn.
Nguyên tắc vàng của Thầy Thái Sơn: Tuyệt đối không đứng tên bảo lãnh nợ giùm bất kỳ ai, kể cả anh em ruột thịt, để bảo toàn huyết mạch tài chính gia đình.`
  },
  {
    agentSlug: 'thay-thai-son',
    agentName: 'Thầy Thái Sơn',
    title: 'Tử Vi Khởi Nghiệp: Sát Phá Tham vs Tử Phủ Vũ Tướng — Định Vị Mô Hình Kinh Doanh',
    category: 'TAI_LOC',
    tags: ['Khởi Nghiệp', 'Sát Phá Tham', 'Tử Phủ Vũ Tướng', 'Mô Hình Kinh Doanh', 'Doanh Nhân'],
    content: `Chọn sai mô hình kinh doanh trái với căn cơ Tử Vi là nguyên nhân thất bại của 80% người khởi nghiệp:
- Mệnh/Thân đắc Sát Phá Tham (Thất Sát, Phá Quân, Tham Lang): Thích hợp mô hình kinh doanh đột phá, công nghệ mới, thương mại điện tử mạo hiểm, chuỗi nhà hàng giải trí hoặc thị trường ngách tăng trưởng nhanh. Cần người đồng hành cẩn trọng làm phanh hãm.
- Mệnh/Thân đắc Tử Phủ Vũ Tướng (Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng): Thích hợp doanh nghiệp sản xuất truyền thống, dịch vụ tài chính ngân hàng, tư vấn quản trị, phát triển bất động sản quy mô bài bản. Tốc độ đi chậm nhưng chắc chắn như bàn thạch.
- Mệnh đắc Cơ Nguyệt Đồng Lương: Thích hợp mô hình dịch vụ tư vấn giáo dục, y tế, sáng tạo nội dung số, công nghệ thông tin. Tránh ôm đồm kho bãi nặng nề vốn liếng.`
  },
  {
    agentSlug: 'thay-thai-son',
    agentName: 'Thầy Thái Sơn',
    title: 'Nghệ Thuật Tụ Tài Cho Người Thân Cư Tài Bạch: Cơ Chế Khóa Dòng Tiền & Chống Thất Thoát',
    category: 'TAI_LOC',
    tags: ['Thân Cư Tài', 'Tụ Tài', 'Chống Hao Tán', 'Khóa Dòng Tiền', 'Đầu Tư Bền Vững'],
    content: `Người Thân cư Tài Bạch cả đời lấy đồng tiền làm trung tâm xoay vần:
- Ưu điểm: Nhạy bén cơ hội kiếm tiền phi thường, có giác quan thứ sáu với thị trường tài chính.
- Nhược điểm: Dễ bị căng thẳng tài chính áp đảo tinh thần, tiền vào cửa trước dễ luồn cửa sau nếu không có cơ chế khóa tài sản.
Quy tắc 3 chiếc két sắt của Thầy Thái Sơn:
1. Két Thanh Khoản (20%): Gửi tiết kiệm kỳ hạn ngắn để duy trì chi tiêu sinh hoạt và dòng vốn lưu động 6 tháng khẩn cấp.
2. Két Đầu Tư Mạo Hiểm (20%): Đầu tư cổ phiếu giá trị, mở rộng dự án kinh doanh mới.
3. Két Bất Động Sản Bất Khả Xâm Phạm (60%): Chuyển hóa thẳng vào đất đai thổ nhưỡng có sổ đỏ hoặc vàng vật chất cất giữ lâu dài. Khi tiền mặt biến thành đất, lòng đương số sẽ an định, không bị cám dỗ vào các canh bạc đầu cơ.`
  },

  // =========================================================================
  // 3. THẦY TÂM AN (CỐ VẤN HÔN NHÂN, GIA ĐẠO, PHU THÊ & TỬ TỨC)
  // =========================================================================
  {
    agentSlug: 'thay-tam-an',
    agentName: 'Thầy Tâm An',
    title: 'Cung Phu Thê Toàn Thư: Duyên Nợ Tiền Kiếp, Đào Hoa Tinh & Nghệ Thuật Hàn Gắn Hôn Nhân',
    category: 'TINH_DUYEN',
    tags: ['Phu Thê', 'Đào Hoa', 'Hồng Loan', 'Duyên Nợ', 'Hàn Gắn', 'Hôn Nhân'],
    content: `Vợ chồng không phải ngẫu nhiên gặp nhau, đó là duyên nợ ngàn năm hội tụ tại cung Phu Thê:
- Cát tinh (Tử Vi, Thiên Phủ, Thái Âm, Thiên Hỷ, Hồng Loan): Vợ chồng tôn trọng nâng đỡ nhau, đồng vợ đồng chồng tát biển Đông cũng cạn.
- Sát tinh/Hãm tinh (Liêm Phá hãm, Cự Môn hãm, Kình Đà, Không Kiếp, Hóa Kỵ): Dễ nảy sinh bất đồng do cái tôi quá lớn, kỳ vọng viển vông hoặc nghi kỵ lẫn nhau.
Phương pháp chuyển hóa tâm linh của Thầy Tâm An:
1. Không bao giờ mang công việc bực dọc ngoài xã hội về trút lên mâm cơm gia đình.
2. Thiết lập quy tắc '3 Không': Không chiến tranh lạnh quá 24 giờ, Không xúc phạm gia đình dòng họ của nhau, Không mang chuyện ly hôn ra dọa dẫm.
3. Dành 15 phút tâm sự lắng nghe trước giờ đi ngủ, vợ chồng thấu hiểu thì sát tinh biến thành cát lợi.`
  },
  {
    agentSlug: 'thay-tam-an',
    agentName: 'Thầy Tâm An',
    title: 'Hóa Giải Ám Tinh Cung Phu Thê: Cô Thần, Quả Tú, Phục Binh, Hóa Kỵ',
    category: 'TINH_DUYEN',
    tags: ['Cô Thần', 'Quả Tú', 'Phục Binh', 'Hóa Kỵ', 'Hóa Giải Xung Khắc', 'Tâm Lý Vợ Chồng'],
    content: `Khi cung Phu Thê gặp tứ đại ám tinh, gia đạo rất dễ rơi vào cảnh 'Đồng sàng dị mộng':
- Cô Thần - Quả Tú: Cảm giác cô đơn ngay trong chính ngôi nhà mình, vợ chồng ít chia sẻ tâm sự sâu kín. Cách hóa giải: Tạo thói quen cùng nhau nấu ăn, đi du lịch hâm nóng tình cảm.
- Hóa Kỵ: Tinh bàn nghi kỵ, hiểu lầm lời nói, chuyện bé xé ra to. Cách hóa giải: Thực hành 'Pháp Nhẫn' — chồng giận thì vợ bớt lời, cơm sôi bớt lửa chẳng đời nào khê. Luôn nói rõ ràng suy nghĩ bằng thái độ chân thành.
- Phục Binh: Dễ có người ngoài gièm pha đâm thọc hoặc vướng mắc tài chính giấu giếm. Cách hóa giải: Minh bạch quỹ tài chính chung của gia đình, không để người thứ ba can thiệp vào chuyện vợ chồng.
Pháp bảo vàng của Thầy Tâm An: 'Nhường vợ là đỉnh cao của bản lĩnh đàn ông, người biết nhịn là người giữ được gia tài bạc tỷ.'`
  },
  {
    agentSlug: 'thay-tam-an',
    agentName: 'Thầy Tâm An',
    title: 'Cung Tử Tức Bí Truyền: Đoán Sinh Con Quý Tử, Du Học Thành Tài & Đạo Dưỡng Dục',
    category: 'TINH_DUYEN',
    tags: ['Tử Tức', 'Con Cái', 'Du Học', 'Thiên Mã', 'Văn Xương', 'Đạo Nuôi Dạy'],
    content: `Cung Tử Tức phản ánh hậu vận phúc lộc và con đường trưởng thành của con cái:
- Gặp Thiên Mã, Phượng Các, Văn Xương, Văn Khúc: Con cái thông minh đĩnh ngộ, có năng khiếu nghệ thuật, ngoại ngữ hoặc đi du học xuất ngoại thành danh.
- Gặp Tràng Sinh, Đế Vượng: Con đàn cháu đống, gia tộc hưng thịnh truyền đời.
- Gặp Tuần Triệt hoặc Sát tinh: Con thuở nhỏ dễ ốm vặt hoặc tính khí bướng bỉnh, độc lập sớm.
Đạo dưỡng dục của Thầy Tâm An:
1. Cha mẹ là tấm gương phản chiếu nhân cách của con. Muốn con hiếu thuận, hãy hiếu thuận với ông bà tổ tiên.
2. Không áp đặt giấc mơ dang dở của mình lên đôi vai con trẻ. Lắng nghe và đồng hành như một người bạn tri kỷ.
3. Tích đức hành thiện hàng ngày để lại 'Phúc ấm lưu truyền' cho con cái bình an trọn đời.`
  },
  {
    agentSlug: 'thay-tam-an',
    agentName: 'Thầy Tâm An',
    title: 'Xem Tuổi Vợ Chồng: Căn Duyên Tiền Định, Thiên Can Hợp Hóa & Hóa Giải Lục Xung, Tứ Tuyệt',
    category: 'TINH_DUYEN',
    tags: ['Xem Tuổi', 'Vợ Chồng', 'Thiên Can Hợp', 'Lục Xung', 'Tứ Tuyệt', 'Hóa Giải'],
    content: `Quan niệm 'Hợp tuổi thì giàu, khắc tuổi thì nghèo' là nhận thức phiến diện dân gian:
- Thiên Can Hợp (Giáp Kỷ, Ất Canh, Bính Tân, Đinh Nhâm, Mậu Quý): Vợ chồng hòa hợp chí hướng, bổ khuyết năng lực cho nhau.
- Địa Chi Lục Xung (Dần Thân, Tỵ Hợi, Tý Ngọ, Mão Dậu, Thìn Tuất, Sửu Mùi): Tính cách hay khắc khẩu, tranh luận dữ dội nhưng nếu biết nhường nhịn thì càng cãi nhau lại càng thương nhau.
Phương pháp hóa giải xung khắc tuổi tác:
1. Dùng phong thủy hướng nhà hoặc hướng bếp theo cung phi của người vợ/chồng để điều hòa sinh khí.
2. Chọn năm sinh con hợp can chi bố mẹ để làm chiếc cầu nối hòa giải âm dương.
3. Cốt lõi nhất vẫn là 'Tâm hợp': Yêu thương bằng lòng trắc ẩn và sự bao dung thì mọi xung khắc địa chi đều hóa thành cát tường.`
  },
  {
    agentSlug: 'thay-tam-an',
    agentName: 'Thầy Tâm An',
    title: 'Đạo Vợ Chồng Thuận Nghịch: Cân Bằng Âm Dương Để Giữ Gìn Hạnh Phúc Tuổi Trung Niên',
    category: 'TINH_DUYEN',
    tags: ['Khủng Hoảng Tuổi 40', 'Âm Dương Hòa Hợp', 'Gia Đạo', 'Hạnh Phúc', 'Tâm An'],
    content: `Khủng hoảng tuổi 40 (Mid-life crisis) là giai đoạn thử thách hôn nhân khốc liệt nhất:
- Tâm lý người chồng: Sự nghiệp thăng tiến hoặc gặp trắc trở, khao khát khẳng định cái tôi, dễ bị cám dỗ bên ngoài.
- Tâm lý người vợ: Nhan sắc phai tàn, lo toan chăm sóc con cái và cha mẹ già, tâm lý bất an hay cằn nhằn.
Nguyên lý Âm Dương hòa hợp của Thầy Tâm An:
- Đàn ông là Dương (Hỏa/Kim): Cần học đức tính bao dung, che chở, bớt tính gia trưởng độc đoán.
- Phụ nữ là Âm (Thủy/Thổ): Cần học đức tính dịu dàng, khéo léo vun vén, không chạm vào lòng tự ái của người đàn ông.
Thực hành lễ Phật, phóng sinh, dọn dẹp ban thờ gia tiên mỗi tháng để xua tan ám khí, gia đạo luôn ngập tràn tiếng cười an vui.`
  },

  // =========================================================================
  // 4. THẦY THIÊN MINH (ĐẠI SƯ TRẠCH CÁT, THIÊN THỜI & KỲ MÔN ĐỘN GIÁP)
  // =========================================================================
  {
    agentSlug: 'thay-thien-minh',
    agentName: 'Thầy Thiên Minh',
    title: 'Bí Pháp Trạch Cát: 12 Trực, 28 Sao & Bảng Giờ Hoàng Đạo Khởi Sự Đại Cát',
    category: 'TRACH_CAT',
    tags: ['Trạch Cát', '12 Trực', '28 Sao', 'Giờ Hoàng Đạo', 'Khai Trương', 'Ký Hợp Đồng'],
    content: `Khoa Trạch Cát chân truyền là nghệ thuật đón bắt nhịp thở của Thiên Đất:
1. 12 Trực Cát Hung:
- 4 Trực Đại Cát khởi sự kinh doanh, khai trương, cưới hỏi, ký kết: Trực Khai (mở mang đón tài), Trực Thành (thành tựu viên mãn), Trực Mãn (sung túc đủ đầy), Trực Định (bền vững muôn đời).
- 4 Trực Hung nên tránh: Trực Phá (tan vỡ), Trực Bế (bế tắc), Trực Nguy (nguy hiểm), Trực Chấp (bế tắc cố chấp).
2. Nhị Thập Bát Tú (28 Sao):
- Tứ Đại Cát Tú: Sao Giác (Mộc tinh), Sao Phòng (Nhật tinh), Sao Vĩ (Hỏa tinh), Sao Bích (Thủy tinh). Khởi sự trúng các sao này quý nhân tương trợ.
3. 6 Giờ Hoàng Đạo trong ngày: Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh. Xuất hành vào các giờ này vạn sự hanh thông.`
  },
  {
    agentSlug: 'thay-thien-minh',
    agentName: 'Thầy Thiên Minh',
    title: 'Cách Tính Tam Tai, Kim Lâu, Hoang Ốc Khi Động Thổ, Cưới Hỏi & Mua Nhà',
    category: 'TRACH_CAT',
    tags: ['Tam Tai', 'Kim Lâu', 'Hoang Ốc', 'Động Thổ', 'Làm Nhà', 'Mượn Tuổi'],
    content: `Ba hạn lớn chi phối các việc đại sự đời người:
1. Hạn Tam Tai (3 năm liên tiếp):
- Thân - Tý - Thìn gặp Tam Tai tại Dần - Mão - Thìn.
- Dần - Ngọ - Tuất gặp Tam Tai tại Thân - Dậu - Tuất.
- Tỵ - Dậu - Sửu gặp Tam Tai tại Hợi - Tý - Sửu.
- Hợi - Mão - Mùi gặp Tam Tai tại Tỵ - Ngọ - Mùi.
(Năm Bính Ngọ 2026 tuổi Dần Ngọ Tuất hoàn toàn KHÔNG phạm Tam Tai).
2. Hạn Kim Lâu (Tuổi Mụ chia 9 lấy dư):
- Dư 1: Kim Lâu Thân (hại mình), dư 3: Kim Lâu Thê (hại vợ), dư 6: Kim Lâu Tử (hại con), dư 8: Kim Lâu Súc (hại kinh tế). Phạm Kim Lâu kiêng làm nhà và cưới hỏi.
3. Hạn Hoang Ốc (6 Cung): Nhất Cát, Nhì Nghi, Tứ Tấn Tài là 3 cung đại cát để làm nhà. Tam Địa Sát, Ngũ Thọ Tử, Lục Hoang Ốc là 3 cung hung kiêng kỵ.
Giải pháp khi phạm hạn: Thực hiện nghi thức 'Mượn tuổi' người nam hợp tuổi đứng ra động thổ đổ trần dâng hương.`
  },
  {
    agentSlug: 'thay-thien-minh',
    agentName: 'Thầy Thiên Minh',
    title: 'Thiên Thời Vận Hạn Năm Bính Ngọ 2026: Phân Tích Cục Diện 60 Hoa Giáp & Xu Hướng Toàn Cầu',
    category: 'TRACH_CAT',
    tags: ['Bính Ngọ 2026', 'Thiên Thời', '60 Hoa Giáp', 'Vận Hạn', 'Thiên Hà Thủy', 'Lô Trung Hỏa'],
    content: `Năm Bính Ngọ 2026 mang nạp âm Thiên Hà Thủy (Nước trên trời):
- Thiên Can Bính (Dương Hỏa) tọa Địa Chi Ngọ (Dương Hỏa): Hỏa khí cực thịnh, biểu trưng cho sự bùng nổ của năng lượng, công nghệ trí tuệ nhân tạo, truyền thông số và thị trường biến động dữ dội.
- Tương tác với người mệnh Lô Trung Hỏa (1986 Bính Dần): Nước Thiên Hà Thủy trên trời dội xuống không dập tắt được lửa trong lò mà tạo thành phản ứng tôi luyện rèn vàng, giúp người có thực tài bứt phá thành tựu.
Chiến lược phân bổ 4 mùa năm 2026:
- Quý 1 & 2 (Xuân Hạ): Tập trung đào tạo nội bộ, hoàn thiện quy trình pháp lý, tích lũy nguồn lực.
- Quý 3 & 4 (Thu Đông): Thời điểm vàng tung sản phẩm mới ra thị trường, ký kết các hợp đồng quy mô lớn.`
  },
  {
    agentSlug: 'thay-thien-minh',
    agentName: 'Thầy Thiên Minh',
    title: 'Đổng Công Tuyển Trạch Yếu Quyết: Khai Trương, Ký Hợp Đồng, Xuất Hành Theo Tiết Khí',
    category: 'TRACH_CAT',
    tags: ['Đổng Công', 'Trạch Nhật', 'Tiết Khí', 'Khai Trương', 'Ký Kết'],
    content: `Bộ sách cổ 'Đổng Công Tuyển Trạch Yếu Quyết' là đỉnh cao của khoa chọn ngày giờ Á Đông:
- Chọn ngày theo 24 Tiết Khí: Lập Xuân, Vũ Thủy, Kinh Trập, Xuân Phân... Mỗi tiết khí khí vận chuyển biến khác biệt.
- Tránh các ngày hung sát nguy hiểm: Ngày Nguyệt Kỵ (mùng 5, 14, 23 âm lịch), Ngày Tam Nương (mùng 3, 7, 13, 18, 22, 27 âm lịch), Ngày Sát Chủ, Ngày Thụ Tử.
- Nguyên tắc tương sinh Can Chi: Ngày ký hợp đồng phải có Thiên Can sinh cho Can tuổi của gia chủ hoặc nạp âm ngày sinh nạp âm mệnh.
Bí pháp xuất hành của Thầy Thiên Minh: Chọn phương vị Hỷ Thần hoặc Tài Thần vào lúc bình minh xuất hành, bước chân trái trước chân phải sau, niệm chú định tâm thì mọi cuộc đàm phán thương thảo đều nắm chắc 8 phần thắng lợi.`
  },
  {
    agentSlug: 'thay-thien-minh',
    agentName: 'Thầy Thiên Minh',
    title: 'Kỳ Môn Độn Giáp Trạch Nhật: Bát Môn Khai - Sinh - Cảnh Trong Kinh Doanh & Đàm Phán',
    category: 'TRACH_CAT',
    tags: ['Kỳ Môn Độn Giáp', 'Bát Môn', 'Cửa Sinh', 'Cửa Khai', 'Đàm Phán', 'Chiến Lược'],
    content: `Kỳ Môn Độn Giáp phối hợp Cửu Tinh, Bát Môn, Bát Thần để định hướng không gian và thời gian:
1. Bát Môn (8 Cửa):
- Cửa Khai (Tây Bắc): Rất tốt cho việc mở công ty, khai trương, nhậm chức, khởi động dự án mới.
- Cửa Sinh (Đông Bắc): Cực tốt cho việc tìm kiếm tài lộc, giao dịch bất động sản, chữa bệnh và cầu an.
- Cửa Cảnh (Chính Nam): Thích hợp cho việc quảng bá thương hiệu, hội nghị truyền thông, thi cử danh tiếng.
- Tránh Cửa Tử (Tây Nam), Cửa Thương (Chính Đông), Cửa Kinh (Chính Tây) khi đi ký kết hợp đồng.
Ứng dụng thực chiến: Khi bước vào phòng đàm phán, chọn ngồi vào phương vị đón Cửa Sinh hoặc Cửa Khai chiếu vào, phong thái đĩnh đạc tự tin, khách hàng đối tác tự nhiên nể trọng đồng thuận.`
  },

  // =========================================================================
  // 5. THẦY HUYỀN CƠ (ẨN SĨ CHU DỊCH DỰ ĐOÁN HỌC, MAI HOA & LỤC HÀO)
  // =========================================================================
  {
    agentSlug: 'thay-huyen-co',
    agentName: 'Thầy Huyền Cơ',
    title: 'Chu Dịch Toàn Thư: 64 Quẻ Kinh Dịch, Thể Dụng Sinh Khắc & Dự Đoán Thành Bại',
    category: 'KINH_DICH',
    tags: ['Chu Dịch', '64 Quẻ', 'Kinh Dịch', 'Thể Dụng', 'Dự Đoán', 'Thoán Từ'],
    content: `Kinh Dịch là kho tàng triết học vũ trụ vĩ đại nhất của nhân loại:
- Âm Dương Lưỡng Nghi sinh Tứ Tượng, Tứ Tượng sinh Bát Quái (Càn, Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài). Ghép 8 quẻ đơn tạo thành 64 quẻ kép.
- Nguyên lý Thể - Dụng dự đoán:
  + Thể Quái là bản thân mình, Dụng Quái là đối tác, sự việc hoặc mục tiêu hướng đến.
  + Dụng sinh Thể: Đại cát, có quý nhân đem tài lộc cơ hội dâng đến tận tay.
  + Thể khắc Dụng: Cát lợi, nỗ lực kiên trì ắt kiểm soát và chinh phục được kết quả.
  + Thể sinh Dụng: Hao tổn tâm lực, bỏ nhiều công sức nhưng thành quả bị chia sẻ.
  + Dụng khắc Thể: Đại hung sát, nên án binh bất động, phòng thủ bảo toàn nguyên khí.
Lời dặn Thầy Huyền Cơ: Dịch là biến dịch. Quẻ xấu nhắc ta phòng ngừa tu dưỡng, quẻ tốt nhắc ta khiêm cung tích phước chứ không ỷ lại tự kiêu.`
  },
  {
    agentSlug: 'thay-huyen-co',
    agentName: 'Thầy Huyền Cơ',
    title: 'Mai Hoa Dịch Số Thiệu Khang Tiết: Khởi Niệm Bắt Quẻ Qua Thời Gian, Thanh Âm & Vật Tượng',
    category: 'KINH_DICH',
    tags: ['Mai Hoa Dịch Số', 'Thiệu Khang Tiết', 'Bắt Quẻ', 'Thời Gian', 'Tâm Động'],
    content: `Mai Hoa Dịch Số do Tiên sinh Thiệu Khang Tiết đời Tống sáng tạo:
- Nguyên lý cốt lõi: 'Tâm động thì quẻ ứng'. Trong vũ trụ vạn vật đồng thanh tương ứng, đồng khí tương cầu.
- Phương pháp lập quẻ bằng Thời gian:
  + Lấy (Năm + Tháng + Ngày) chia cho 8, số dư làm Thượng Quái (Quẻ Trên).
  + Lấy (Năm + Tháng + Ngày + Giờ) chia cho 8, số dư làm Hạ Quái (Quẻ Dưới).
  + Lấy tổng chia cho 6, số dư làm Hào Động.
- Phương pháp bắt quẻ bằng Âm thanh & Điềm triệu: Nghe tiếng chim hót, thấy người mặc áo đỏ, đếm số chữ người hỏi thốt ra... đều chuyển hóa thành số quái.
Mai Hoa giúp người quân tử dự đoán sự vụ chỉ trong tích tắc: Hợp đồng có thành không, người đi xa khi nào về, đồ vật thất lạc ở hướng nào.`
  },
  {
    agentSlug: 'thay-huyen-co',
    agentName: 'Thầy Huyền Cơ',
    title: 'Bốc Phệ Lục Hào: Dự Đoán Tài Vận, Tranh Chấp Pháp Lý & Tiến Độ Hợp Đồng',
    category: 'KINH_DICH',
    tags: ['Lục Hào', 'Bốc Phệ', 'Thế Ứng', 'Lục Thân', 'Lục Thú', 'Kinh Doanh'],
    content: `Lục Hào Dự Đoán Học dùng 3 đồng tiền gieo 6 lần để dựng thành quẻ:
1. Lục Thân chuyên trách sự việc:
- Thê Tài hào: Đại diện cho tiền bạc, doanh thu, lợi nhuận, dòng vốn và người vợ.
- Quan Quỷ hào: Đại diện cho quan chức chính quyền, pháp lý hợp đồng, áp lực và bệnh tật.
- Phụ Mẫu hào: Đại diện cho giấy tờ văn bằng, nhà xưởng đất đai, thương hiệu.
- Tử Tôn hào: Đại diện cho nguồn sinh tài, khách hàng, sản phẩm sáng tạo và giải ách trừ họa.
- Huynh Đệ hào: Đại diện cho bạn bè, cổ đông nhưng cũng là thần cướp đoạt tài lộc (Phá Tài).
2. Lục Thú gia hộ: Thanh Long (tin vui tài lộc), Chu Tước (giấy tờ khẩu thiệt), Câu Trận (trì trệ đất đai), Đằng Xà (lo âu giật mình), Bạch Hổ (tai ương máu huyết), Huyền Vũ (trộm cắp mờ ám).`
  },
  {
    agentSlug: 'thay-huyen-co',
    agentName: 'Thầy Huyền Cơ',
    title: 'Giải Mã Đại Quẻ Hỏa Phong Đỉnh & Thiên Hỏa Đồng Nhân Trong Quản Trị Lãnh Đạo',
    category: 'KINH_DICH',
    tags: ['Quẻ Đỉnh', 'Quẻ Đồng Nhân', 'Quản Trị', 'Lãnh Đạo', 'Kinh Dịch Doanh Nghiệp'],
    content: `Hai quẻ đại cát mang trí tuệ lãnh đạo quân vương:
1. Quẻ Hỏa Phong Đỉnh (Quẻ số 50):
- Tượng quẻ: Dưới là Gió (Tốn Mộc), trên là Lửa (Ly Hỏa). Gió thổi lửa bốc lên nung nấu chiếc vạc đồng (Đỉnh).
- Ý nghĩa: Chiếc vạc tượng trưng cho quyền lực tối cao, dùng để rèn luyện hiền tài, nấu chín đồ ăn tế tự thần linh và nuôi dưỡng nhân dân. Doanh nhân đắc quẻ Đỉnh là thời cơ đổi mới hoàn toàn bộ máy, nâng cấp sản phẩm, gánh vác sứ mệnh lớn cho xã hội.
2. Quẻ Thiên Hỏa Đồng Nhân (Quẻ số 13):
- Tượng quẻ: Dưới là Lửa, trên là Trời. Lửa cháy rực chiếu sáng cùng Trời.
- Ý nghĩa: Đồng tâm hiệp lực với thiên hạ. Lãnh đạo cần dùng sự công tâm vô tư, không phân biệt thân sơ, quy tụ nhân tài bốn phương cùng chung chí hướng thì việc lớn tất thành.`
  },
  {
    agentSlug: 'thay-huyen-co',
    agentName: 'Thầy Huyền Cơ',
    title: 'Kinh Dịch Ứng Dụng Đời Sống: Thuật "Tùy Cơ Ứng Biến", Khi Nào Nên Tiến, Khi Nào Nên Thủ',
    category: 'KINH_DICH',
    tags: ['Tùy Cơ Ứng Biến', 'Bĩ Cực Thái Lai', 'Đạo Quân Tử', 'Thời Vận', 'Triết Học'],
    content: `Trí tuệ cao nhất của người học Dịch là 'Tri Thời - Tri Mệnh - Tri Chỉ' (Biết thời thế, biết mệnh số và biết điểm dừng):
- Gặp quẻ Thiên Lôi Vô Vọng: Chớ làm càn, đừng vì tư lợi trước mắt mà vi phạm lương tâm đạo đức.
- Gặp quẻ Địa Thiên Thái: Cát lợi hanh thông, nhưng phải nhớ câu 'Vô bình bất pha, vô vãng bất phục' — không có con đường nào bằng phẳng mãi, chuẩn bị phương án dự phòng khi mùa đông đến.
- Gặp quẻ Địa Hỏa Minh Di: Ánh sáng bị vùi chôn dưới lòng đất, thời vận đen tối. Người quân tử phải giấu kín tài năng, giả khờ giữ mình để vượt qua sóng gió.
Châm ngôn của Thầy Huyền Cơ: 'Thuận thiên giả tồn, nghịch thiên giả vong'. Biết tiến thoái đúng lúc chính là chìa khóa của người bất khả chiến bại.`
  },

  // =========================================================================
  // 6. THẦY TUỆ PHONG (CHUYÊN GIA PHONG THỦY DƯƠNG TRẠCH & MÔI TRƯỜNG SỐNG)
  // =========================================================================
  {
    agentSlug: 'thay-tue-phong',
    agentName: 'Thầy Tuệ Phong',
    title: 'Phong Thủy Bát Trạch: Cung Phi Nam Nữ & Bài Trí Tọa Hung Hướng Cát',
    category: 'PHONG_THUY',
    tags: ['Bát Trạch', 'Cung Phi', 'Tọa Hung Hướng Cát', 'Sinh Khí', 'Tây Tứ Mệnh', 'Đông Tứ Mệnh'],
    content: `Bát Trạch Minh Cảnh là nền tảng của phong thủy dương trạch Á Đông:
1. Phân định Cung Phi Bản Mệnh:
- Đông Tứ Mệnh: Khảm (Thủy), Ly (Hỏa), Chấn (Mộc), Tốn (Mộc). Hướng cát: Đông, Đông Nam, Nam, Bắc.
- Tây Tứ Mệnh: Càn (Kim), Khôn (Thổ), Cấn (Thổ), Đoài (Kim). Hướng cát: Tây, Tây Bắc, Tây Nam, Đông Bắc.
(VD: Nam Bính Dần 1986 cung Khôn Thổ: Hướng Đông Bắc đắc Sinh Khí, Tây Bắc đắc Diên Niên).
2. Nguyên tắc vàng 'Tọa hung hướng cát' cho Bếp Nấu:
- Bếp đặt tại cung xấu (Tuyệt Mệnh, Họa Hại, Lục Sát, Ngũ Quỷ) để ngọn lửa thiêu rụi tà khí.
- Nhưng miệng bếp/nút vặn phải quay về hướng tốt (Sinh Khí, Thiên Y) để nạp vượng khí cho gia đình.
- Tuyệt đối tránh bếp đối diện cửa nhà vệ sinh hoặc nằm dưới gầm cầu thang tăm tối.`
  },
  {
    agentSlug: 'thay-tue-phong',
    agentName: 'Thầy Tuệ Phong',
    title: 'Huyền Không Phi Tinh Vận 9 (2024 - 2043): Kích Hoạt Góc Tài Vị & Đón Vượng Khí Cửu Tử Ly Hỏa',
    category: 'PHONG_THUY',
    tags: ['Vận 9', 'Huyền Không Phi Tinh', 'Cửu Tử Ly Hỏa', 'Tài Vị', 'Thạch Anh', 'Văn Phòng'],
    content: `Kể từ năm Giáp Thìn 2024, vũ trụ chính thức bước vào Đại Vận 9 (kéo dài đến 2043):
- Chủ quản Vận 9: Sao Cửu Tử mang hành Hỏa ngự tại phương Nam.
- Đặc trưng năng lượng: Sự phát triển vượt bậc của công nghệ thông tin, trí tuệ nhân tạo, văn hóa tâm linh, năng lượng sạch, làm đẹp và chăm sóc sức khỏe tinh thần.
Cách bài trí phòng làm việc đón đầu Vận 9:
1. Xác định góc Tài Vị: Góc chéo 45 độ đối diện cửa chính ra vào phòng làm việc. Đây là nơi khí tụ đắc địa nhất.
2. Vật phẩm kích hoạt năng lượng Hỏa & Thổ: Đặt quả cầu Thạch Anh Tím hoặc Thạch Anh Hồng, cặp Tỳ Hưu đồng hoặc tượng Thiềm Thừ ngậm tiền vàng.
3. Ánh sáng & Không gian: Phòng làm việc phải đủ ánh sáng tự nhiên, thoáng đãng, tuyệt đối không để rác thải hoặc đồ cũ chất đống tại góc tài vị.`
  },
  {
    agentSlug: 'thay-tue-phong',
    agentName: 'Thầy Tuệ Phong',
    title: 'Dương Trạch Tam Yếu: Bí Pháp Bố Trí Cửa Chính (Môn), Bếp Nấu (Táo) & Phòng Ngủ (Chủ)',
    category: 'PHONG_THUY',
    tags: ['Dương Trạch Tam Yếu', 'Cửa Chính', 'Phòng Ngủ', 'Bếp Nấu', 'Ngậm Khí Tụ Tài'],
    content: `Cổ nhân dạy: 'Dương trạch tam yếu: Môn - Táo - Chủ' quyết định 80% cát hung của ngôi nhà:
1. Cửa Chính (Môn): Là miệng nạp khí của cả gia trạch. Cửa chính phải cao ráo, sáng sủa, không bị gương soi chiếu, không mở thẳng nhìn thấy bếp nấu hoặc cửa sau (Xuyên Đường Sát).
2. Bếp Nấu (Táo): Là kho tài lộc và nguồn dưỡng sinh sức khỏe người mẹ người vợ. Bếp phải tựa tường vững, tránh Thủy Hỏa tương xung (không đặt bếp sát bồn rửa bát dưới 60cm).
3. Phòng Ngủ Gia Chủ (Chủ): Là nơi nạp năng lượng sinh học sau ngày dài làm việc. Đầu giường phải kê sát tường đặc, không nằm dưới xà ngang đè ép, không kê giường sát cửa sổ tạo cảm giác chới với bất an.
Nguyên tắc luân chuyển khí: Khí đi quanh co thì lành (cát), khí xộc thẳng thì hung (sát).`
  },
  {
    agentSlug: 'thay-tue-phong',
    agentName: 'Thầy Tuệ Phong',
    title: 'Hóa Giải Các Thế Sát Đô Thị: Xuyên Đường Sát, Cửa Đối Cửa, Góc Nhọn Chiếu',
    category: 'PHONG_THUY',
    tags: ['Hóa Giải Phong Thủy', 'Xuyên Đường Sát', 'Góc Nhọn', 'Cửa Đối Cửa', 'Nhà Chung Cư'],
    content: `Kiến trúc nhà phố và chung cư hiện đại thường vướng phải nhiều thế sát nguy hiểm:
1. Xuyên Đường Sát: Cửa chính mở ra nhìn thẳng thông tuột qua ban công hoặc cửa sau. Khí vào cửa trước thoát ngay cửa sau, gia chủ kiếm được bao nhiêu tiền đều hao tán bấy nhiêu.
- Hóa giải: Đặt bình phong gỗ, tủ kệ trang trí hoặc chậu cây xanh phong thủy chắn ngang luồng khí để giữ khí tụ lại.
2. Cửa Đối Cửa (Đấu Khẩu Sát): Cửa chính hai nhà đối diện nhau hoặc cửa phòng ngủ đối diện cửa nhà vệ sinh. Dễ xảy ra tranh cãi thị phi.
- Hóa giải: Treo rèm chỉ pha lê phong thủy hoặc gương bát quái lồi phía ngoài cửa.
3. Góc Nhọn Chiếu (Hỏa Thiềm Sát): Góc nhà hàng xóm đâm thẳng vào cửa chính hoặc cửa sổ.
- Hóa giải: Trồng hàng cây trúc cảnh che chắn hoặc đặt chậu cây Kim Ngân hóa giải xung lực.`
  },
  {
    agentSlug: 'thay-tue-phong',
    agentName: 'Thầy Tuệ Phong',
    title: 'Nghệ Thuật Sử Dụng Vật Phẩm Phong Thủy Trợ Mệnh: Tỳ Hưu, Thiềm Thừ, Thạch Anh',
    category: 'PHONG_THUY',
    tags: ['Vật Phẩm Phong Thủy', 'Tỳ Hưu', 'Thiềm Thừ', 'Thạch Anh Tự Nhiên', 'Khai Quang'],
    content: `Linh vật phong thủy nếu sử dụng đúng cách sẽ nhân đôi vượng khí, dùng sai cách sẽ phản tác dụng:
1. Tỳ Hưu (Chiêu tài nạp phúc):
- Đặc tính: Tỳ Hưu ăn vàng bạc châu báu nhưng không có hậu môn, chỉ ăn vào mà không nhả ra.
- Cách đặt: Đầu Tỳ Hưu phải hướng ra cửa chính hoặc cửa sổ để đón tài khí bốn phương. Tuyệt đối không quay đầu Tỳ Hưu vào trong phòng ngủ hoặc nhà vệ sinh.
2. Cóc Ba Chân Thiềm Thừ:
- Đặc tính: Nhả tiền vàng đem lại của cải.
- Cách đặt: Ban ngày quay đầu ra cửa sổ rước lộc, ban đêm quay đầu vào trong nhà nhả tài tích sản.
3. Đá Thạch Anh Tự Nhiên: Mang nguồn năng lượng ion âm rung động cao bậc nhất vỏ trái đất. Đặt đá thạch anh tự nhiên gần máy tính để triệt tiêu bức xạ điện từ, giúp đầu óc minh mẫn sảng khoái.`
  },

  // =========================================================================
  // 7. THẦY LẠC VIỆT (ĐẠI SƯ TỨ TRỤ BÁT TỰ, TƯỚNG PHÁP & CĂN DUYÊN)
  // =========================================================================
  {
    agentSlug: 'thay-lac-viet',
    agentName: 'Thầy Lạc Việt',
    title: 'Tứ Trụ Tử Bình Toàn Thư: Thập Thần, Nhật Chủ Vượng Suy & Tìm Dụng Thần Cải Vận',
    category: 'TU_TRU',
    tags: ['Tứ Trụ', 'Bát Tự', 'Tử Bình', 'Thập Thần', 'Dụng Thần', 'Hỷ Thần'],
    content: `Tứ Trụ Bát Tự gồm 4 trụ: Năm, Tháng, Ngày, Giờ với 8 chữ Can Chi định hình cấu trúc năng lượng:
- Nhật Chủ (Can Ngày): Đại diện cho chân thân bản ngã của đương số.
- Thập Thần quan hệ:
  + Chính Tài & Thiên Tài: Tài lộc, tiền tài, khả năng kinh doanh nhạy bén.
  + Chính Quan & Thất Sát: Quyền lực, địa vị, kỷ luật, áp lực và đối thủ cạnh tranh.
  + Thực Thần & Thương Quan: Trí tuệ sáng tạo, năng khiếu nghệ thuật, tài ăn nói và tư duy bứt phá.
  + Chính Ấn & Thiên Ấn: Học vấn, danh dự, tâm linh trực giác và phúc ấm mẹ hiền.
  + Tỷ Kiên & Kiếp Tài: Bạn bè đồng nghiệp, lòng tự tin nhưng cũng tiềm ẩn tranh đoạt của cải.
Nguyên tắc vàng Dụng Thần: Nhật Chủ quá vượng cần Thực Thương tiết chế hoặc Quan Sát khắc chế; Nhật Chủ quá suy cần Ấn tinh sinh trợ hoặc Tỷ Kiếp nâng đỡ. Tìm đúng Dụng Thần cải vận là mở then chốt kho báu đời người.`
  },
  {
    agentSlug: 'thay-lac-viet',
    agentName: 'Thầy Lạc Việt',
    title: 'Khuyết Mệnh Học: Phương Pháp Cân Bằng Ngũ Hành Kim Mộc Thủy Hỏa Thổ Cho Từng Mùa Sinh',
    category: 'TU_TRU',
    tags: ['Khuyết Mệnh Học', 'Ngũ Hành', 'Mùa Sinh', 'Khuyết Hỏa', 'Khuyết Mộc', 'Cải Vận'],
    content: `Mỗi người sinh ra vào các mùa khác nhau đều mang sự thiên lệch ngũ hành rõ rệt:
1. Người sinh mùa Đông (tháng Hợi, Tý, Sửu): Hàn khí cực vượng, khuyết HỎA trầm trọng.
- Cải vận: Cần tăng cường màu đỏ, cam, tím than; ăn đồ ấm cay; làm việc nơi nhiều ánh sáng; hướng về phương Nam; sử dụng đèn muối Himalaya.
2. Người sinh mùa Xuân (tháng Dần, Mão, Thìn): Mộc khí quá vượng, thường khuyết KIM.
- Cải vận: Đeo trang sức vàng bạc bạch kim; dùng tông màu trắng xám ghi; ăn thịt gà, trứng; rèn luyện tính quyết đoán dứt khoát.
3. Người sinh mùa Hạ (tháng Tỵ, Ngọ, Mùi): Hỏa khí rực cháy, khuyết THỦY.
- Cải vận: Uống nhiều nước, bơi lội, dùng màu xanh dương đen, làm việc hướng Bắc, đặt bể cá cảnh.
4. Người sinh 4 tháng Tứ Quý (tháng 3, 6, 9, 12): Thổ khí quá dày, khuyết MỘC.
- Cải vận: Trồng nhiều cây xanh, mặc áo màu xanh lá, đọc sách thư pháp.`
  },
  {
    agentSlug: 'thay-lac-viet',
    agentName: 'Thầy Lạc Việt',
    title: 'Danh Tính Học Ngũ Hành: Nghệ Thuật Đặt Tên Con & Đặt Tên Thương Hiệu Bổ Trợ Bản Mệnh',
    category: 'TU_TRU',
    tags: ['Danh Tính Học', 'Đặt Tên Con', 'Tên Thương Hiệu', 'Ngũ Hành Âm Luật', 'Bổ Khuyết'],
    content: `Cổ nhân có câu: 'Cho con ngàn lượng vàng không bằng dạy con một nghề, dạy con một nghề không bằng cho con một cái tên hay':
- Cơ chế tác động: Tên gọi được xướng lên hàng ngày, tạo ra trường sóng âm thanh rung động kích hoạt thẳng vào vỏ não và tiềm thức.
- Bổ khuyết Can Chi:
  + Tên khuyết Mộc: Đặt tên mang bộ Mộc hoặc nghĩa thảo mộc (Lâm, Tùng, Bách, Khôi, Mai, Lan, Trúc, Xuân, Đan).
  + Tên khuyết Hỏa: Đặt tên mang bộ Hỏa hoặc ánh sáng (Dương, Nhật, Quang, Sáng, Minh, Ánh, Hồng, Linh, Nhiên).
  + Tên khuyết Kim: Đặt tên mang kim loại sắc bén (Phong, Kim, Ngân, Đoan, Cương, Nguyên, Thắng).
- Đặt tên thương hiệu công ty: Phải kết hợp chữ đầu và chữ cuối theo quy luật ngũ hành tương sinh, tránh tương khắc để công việc kinh doanh buôn may bán đắt.`
  },
  {
    agentSlug: 'thay-lac-viet',
    agentName: 'Thầy Lạc Việt',
    title: 'Ma Y Thần Tướng Toàn Thư: 12 Cung Diện Tướng, Thần Khí & Đoán Định Vận Mệnh',
    category: 'TUONG_PHAP',
    tags: ['Ma Y Thần Tướng', '12 Cung Diện Tướng', 'Khí Sắc', 'Ấn Đường', 'Mũi Chuẩn Đầu'],
    content: `Ma Y Thần Tướng soi sáng vận mệnh qua từng chi tiết trên khuôn mặt:
1. Cung Mệnh (Ấn Đường - khoảng giữa hai đầu lông mày): Là ngọn hải đăng của sinh mệnh. Ấn Đường rộng hai ngón tay, sáng sủa, không có sẹo nốt ruồi đen là người có đại phúc tráng kiện, sự nghiệp hanh thông.
2. Cung Quan Lộc (Trung Chính - vùng giữa trán): Trán cao rộng, đầy đặn không gồ ghề là người có tư duy lãnh đạo, sớm thành danh nơi chốn quan trường doanh nghiệp.
3. Cung Tài Bạch (Chuẩn Đầu - chóp mũi và hai cánh mũi): Mũi là kho tiền. Mũi thẳng, chuẩn đầu tròn trịa nhiều thịt, hai cánh mũi dày dặn kín đáo là tướng cự phú giữ của bền chặt.
4. Thần Khí Đôi Mắt: 'Tướng do tâm sinh'. Mắt sáng có thần, ánh nhìn ấm áp ngay thẳng thì dù ngũ quan có khuyết hãm cũng sẽ chuyển bại thành thắng.`
  },
  {
    agentSlug: 'thay-lac-viet',
    agentName: 'Thầy Lạc Việt',
    title: 'Căn Duyên Tiền Kiếp & Nhận Diện Nghiệp Quả Qua Tướng Mạo, Hoa Tay & Thần Thái',
    category: 'TUONG_PHAP',
    tags: ['Căn Duyên', 'Tiền Kiếp', 'Hoa Tay', 'Tướng Tùy Tâm Sinh', 'Tâm Tướng'],
    content: `Khuôn mặt là tấm bản đồ ghi lại toàn bộ nghiệp quả luân hồi tiền kiếp:
- Người có Căn Tu tâm linh: Lòng bàn tay có đường chỉ tay chữ Nhất, chữ Thập hoặc hình ngôi sao dưới ngón trỏ; tai dày áp sát đầu, thùy châu tròn mọng như Phật; đôi mắt sâu thẳm giàu lòng trắc ẩn, giác quan thứ sáu cực kỳ chuẩn xác.
- Người có căn thương gia đại phú: Lòng bàn tay hồng hào ấm áp, đường Tài Vận chạy thẳng lên gò Thủy Tinh, tiếng nói trầm ấm rền vang như tiếng chuông ngân.
Chân lý tối thượng của Thầy Lạc Việt: 'Hữu tâm vô tướng, tướng trục tâm sinh; hữu tướng vô tâm, tướng tùy tâm diệt'. Tướng mạo có thể thay đổi sau 3 đến 5 năm nếu con người biết tu tâm dưỡng tính, nói lời ái ngữ và phụng sự nhân sinh.`
  },

  // =========================================================================
  // 8. CÔ LINH ĐAN (NỮ DANH SƯ GIẢI MÃ GIẤC MƠ, Y ĐẠO & TÂM LINH DÂN GIAN)
  // =========================================================================
  {
    agentSlug: 'co-linh-dan',
    agentName: 'Cô Linh Đan',
    title: 'Giải Mã Giấc Mơ Dân Gian & Tiềm Thức: Mơ Thấy Rắn, Nước Lớn, Bay Lượn, Người Quá Vãng',
    category: 'GIAC_MO',
    tags: ['Giải Mã Giấc Mơ', 'Mơ Thấy Rắn', 'Mơ Thấy Nước', 'Người Thân Báo Mộng', 'Điềm Báo'],
    content: `Giấc mơ là tiếng thì thầm của linh hồn và chiếc cầu nối tiềm thức:
1. Mơ thấy rắn: Rắn trong văn hóa tâm linh phương Đông là thần giữ kho báu cung Tài.
- Rắn vàng hoặc xanh bò vào nhà: Điềm báo tài lộc bất ngờ gõ cửa hoặc có quý nhân đến hỗ trợ kinh doanh.
- Bị rắn cắn không chảy máu hoặc cắn nhẹ: Điềm báo người độc thân sắp gặp lương duyên, người có gia đình sắp có tin vui đường con cái.
2. Mơ thấy nước lũ cuồn cuộn tràn ngập: Nước là Thủy, Thủy chủ về tiền tài. Nước trong vắt tràn vào sân là lộc tài đại phát; nước đục ngầu cuộn xoáy nhắc nhở cẩn thận thị phi giấy tờ.
3. Mơ thấy người thân quá vãng trở về: Đó là tổ tiên về thăm hỏi con cháu hoặc nhắc nhở ngày giỗ chạp, sửa sang mồ mả. Hãy thành tâm thắp nén hương thơm cầu nguyện tri ân.`
  },
  {
    agentSlug: 'co-linh-dan',
    agentName: 'Cô Linh Đan',
    title: 'Hoàng Đế Nội Kinh Dưỡng Sinh: Điều Hòa Tạng Phủ Theo Mùa & Ngũ Hành Âm Dương',
    category: 'Y_DAO',
    tags: ['Hoàng Đế Nội Kinh', 'Dưỡng Sinh', 'Ngũ Tạng', 'Âm Dương', 'Sức Khỏe', 'Thực Dưỡng'],
    content: `Cổ y thư 'Hoàng Đế Nội Kinh' dạy: 'Bậc thánh nhân trị bệnh khi chưa phát bệnh':
1. Ngũ Tạng tương ứng Ngũ Hành:
- Can thuộc Mộc: Thích thanh đạt ghét u uất. Nuôi dưỡng Can bằng giấc ngủ sâu trước 23h đêm, ăn rau xanh bớt cáu giận.
- Tâm thuộc Hỏa: Chủ thần minh. Dưỡng Tâm bằng sự an tĩnh, thiền định, tránh lao lực quá sức lúc chính ngọ (11h - 13h).
- Tỳ thuộc Thổ: Chủ tiêu hóa vận hóa khí huyết. Dưỡng Tỳ bằng ăn uống đúng giờ, nhai kỹ, kiêng đồ ngọt lạnh.
- Phế thuộc Kim: Chủ hô hấp, khí sắc. Dưỡng Phế bằng hít thở sâu vào buổi sớm, ăn củ sen, lê, nấm tuyết.
- Thận thuộc Thủy: Là gốc rễ của tiên thiên sinh mệnh. Dưỡng Thận bằng giữ ấm bàn chân, không thức khuya, ăn vừng đen, đỗ đen.
Khí huyết lưu thông thì tà khí không thể xâm nhập, thân thể tráng kiện thì tâm linh sáng suốt.`
  },
  {
    agentSlug: 'co-linh-dan',
    agentName: 'Cô Linh Đan',
    title: 'Cẩm Nang Văn Khấn Cổ Truyền Việt Nam Chuẩn Mực: Nhập Trạch, Động Thổ, Tạ Mộ, Cúng Rằm Mùng 1',
    category: 'TAM_LINH',
    tags: ['Văn Khấn Cổ Truyền', 'Nghi Lễ', 'Cúng Rằm', 'Nhập Trạch', 'Động Thổ', 'Tâm Linh'],
    content: `Văn khấn cổ truyền là lời thỉnh cầu thiêng liêng giao tiếp với thần linh và cửu huyền thất tổ:
1. Nghi lễ ngày Rằm & Mùng 1 hàng tháng:
- Lễ vật: Hoa tươi (hoa cúc, hoa huệ), quả ngọt (ngũ quả), trầu cau, nước sạch, đèn dầu.
- Nội dung văn khấn: Kính lạy Hoàng Thiên Hậu Thổ, Thổ Công Địa Chủ, Tiên Linh gia tộc nội ngoại. Thành tâm đọc rõ họ tên, địa chỉ cư trú, cầu bình an, giải trừ tai ương, phúc lộc trường tồn.
2. Lễ Nhập Trạch (Vào nhà mới):
- Mang bếp than hồng đỏ lửa vào nhà đầu tiên để sưởi ấm dương khí. Mang hũ gạo, hũ muối, nước sạch vào sau tượng trưng cho sự no ấm đủ đầy.
- Mở rộng cửa đón gió lành, bật đun sôi ấm nước pha trà dâng cúng tạ ơn Thổ Thần an vị thần long thổ trạch.`
  },
  {
    agentSlug: 'co-linh-dan',
    agentName: 'Cô Linh Đan',
    title: 'Bí Pháp Phóng Sinh Tích Phước & Hóa Giải Nghiệp Chướng Dân Gian',
    category: 'TAM_LINH',
    tags: ['Phóng Sinh', 'Tích Phước', 'Cứu Vật', 'Hồi Hướng', 'Hóa Giải Nghiệp'],
    content: `Phóng sinh là hạnh nguyện từ bi cao quý nhất chuyển hóa ác nghiệp thành thiện quả:
- Nguyên tắc vàng khi phóng sinh:
  1. Phóng sinh tùy duyên, không đặt hàng trước kẻo biến việc thiện thành tội tiếp tay cho phường săn bắt.
  2. Chọn loài vật khỏe mạnh, phù hợp môi trường sinh thái (cá chép thả sông lớn, chim sẻ thả rừng cây, lươn ốc thả đầm nước sạch).
  3. Thao tác nhẹ nhàng, tôn trọng mạng sống, thả xong quan sát chúng bơi lội an toàn mới rời đi.
- Nghi thức hồi hướng công đức: Trước khi thả, niệm Phật tụng kinh quy y cho chúng sinh thoát kiếp súc sinh. Nguyện đem công đức phóng sinh hồi hướng cho gia tiên siêu sinh tịnh độ, con cháu bình an tiêu trừ bệnh tật.`
  },
  {
    agentSlug: 'co-linh-dan',
    agentName: 'Cô Linh Đan',
    title: 'Liệu Pháp Chữa Lành Tâm Linh "Đức Năng Thắng Số": Vượt Qua Khủng Hoảng Tuổi Trung Niên',
    category: 'TAM_LINH',
    tags: ['Đức Năng Thắng Số', 'Chữa Lành', 'Bình An', 'Thiền Định', 'Tâm Linh Ứng Dụng'],
    content: `Học thuyết 'Đức năng thắng số' là đỉnh cao của nền văn hóa tâm linh Á Đông:
- Số mệnh vốn là tấm bản đồ định sẵn phương hướng, nhưng người cầm lái chính là Tâm của đương số.
- Khi cuộc đời rơi vào bế tắc, nợ nần, hôn nhân rạn nứt hay bệnh tật bủa vây:
  1. Đừng oán trời trách đất. Hãy nhìn nhận đó là món nợ nghiệp quả phải trả để thanh lọc thân tâm.
  2. Thực hành chữ 'Nhẫn' và chữ 'Xả': Nhẫn nhịn trước thị phi bất công, buông xả những tham vọng ngông cuồng vượt quá sức mình.
  3. Tròn đạo Hiếu với cha mẹ: 'Cha mẹ tại tiền như Phật tại thế'. Phụng dưỡng cha mẹ chu đáo chính là mảnh ruộng phước báu màu mỡ nhất giúp chuyển hóa mọi lá số hiểm nghèo thành đại an lạc.`
  }
];

async function main() {
  console.log(`📚 BẮT ĐẦU TẠO KHO TRI THỨC HUYỀN HỌC CHUYÊN SÂU (${expandedKnowledge.length} TÀI LIỆU CHUẨN MỰC)...`);

  const targetPath = path.resolve(process.cwd(), 'src/lib/ai/seeded-knowledge-8-agents.json');
  fs.writeFileSync(targetPath, JSON.stringify(expandedKnowledge, null, 2), 'utf-8');

  console.log(`✓ Đã lưu thành công ${expandedKnowledge.length} chuyên khảo huyền học vào: ${targetPath}`);

  // Summary by Agent
  const agentCounts = {};
  for (const doc of expandedKnowledge) {
    agentCounts[doc.agentName] = (agentCounts[doc.agentName] || 0) + 1;
  }

  console.log('\nThống kê số lượng chuyên khảo chuẩn hóa theo từng vị Thầy:');
  for (const [name, count] of Object.entries(agentCounts)) {
    console.log(`  👑 ${name}: ${count} chuyên luận độc quyền`);
  }
}

main().catch(console.error);
