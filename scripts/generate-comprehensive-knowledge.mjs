// scripts/generate-comprehensive-knowledge.mjs
import fs from 'fs';
import path from 'path';

const KNOWLEDGE_ITEMS = [
  // ==========================================
  // NHÓM 1: TỬ VI ĐẨU SỐ NAM PHÁI (14 CHÍNH TINH & BỘ SAO)
  // ==========================================
  {
    title: 'Tinh Hoa 14 Chính Tinh Tử Vi Nam Phái Tại 12 Cung',
    category: 'TU_VI',
    tags: ['Chính Tinh', 'Vòng Tử Vi', 'Vòng Thiên Phủ', 'Miếu Vượng Hãm'],
    content: `14 Chính tinh trong Tử Vi Đẩu Số Nam Phái chia làm 2 hệ thống đối xứng qua trục Dần - Thân:
1. Vòng Tử Vi (thuận chiều kim đồng hồ):
   - Tử Vi (Dương Thổ): Đế tinh, chủ về uy quyền, phúc thọ và tài lãnh đạo.
   - Thiên Cơ (Âm Mộc): Mưu trí tinh, chủ về sự mẫn tiệp, linh hoạt, kế sách.
   - Thái Dương (Dương Hỏa): Nhật tinh, quang minh lỗi lạc, chủ về danh tiếng, quan lộc.
   - Vũ Khúc (Âm Kim): Tài tinh, cương nghị, quyết đoán, chủ về tiền bạc và tài chính.
   - Thiên Đồng (Dương Thủy): Phúc tinh, hiền hòa, thích an nhàn, nhân hậu.
   - Liêm Trinh (Âm Hỏa): Tù tinh, Đào hoa thứ, chính trực, kỷ luật nghiêm cẩn.
2. Vòng Thiên Phủ (nghịch chiều kim đồng hồ):
   - Thiên Phủ (Dương Thổ): Lệnh tinh, thủ kho trời, khoan dung, giữ của bền chắc.
   - Thái Âm (Âm Thủy): Nguyệt tinh, hiền dịu, phú tinh, chủ về điền sản và tích lũy.
   - Tham Lang (Dương Mộc đới Thủy): Đào hoa tinh, dục vọng, khát vọng kinh doanh.
   - Cự Môn (Âm Thủy): Ám tinh, chủ về khẩu tài, hùng biện, tư duy phê phán.
   - Thiên Tướng (Dương Thủy): Ấn tinh, chủ về lòng trắc ẩn, phụng sự, trợ tá đắc lực.
   - Thiên Lương (Dương Mộc): Ấm tinh, che chở, thọ tinh, nguyên tắc đạo đức.
   - Thất Sát (Dương Kim): Tướng tinh, sát phạt, dũng cảm, tiên phong mở đường.
   - Phá Quân (Âm Thủy): Hao tinh, dũng mãnh, phá cũ đổi mới, sáng tạo đột phá.
Trạng thái miếu vượng: Miếu (M) cực sáng, Vượng (V) sáng mạnh, Đắc (Đ) sáng vừa, Bình (B) trung hòa, Hãm (H) tối mờ cần cát tinh hoặc Tuần/Triệt cứu giải.`
  },
  {
    title: 'Luận Giải Sao Tử Vi - Đế Tinh Cực Hướng Ly Minh',
    category: 'TU_VI',
    tags: ['Tử Vi', 'Cung Mệnh', 'Đế Tinh', 'Ngọ Cung'],
    content: `Sao Tử Vi (Dương Thổ) là vua của các vì sao trên thiên bàn:
- Khi Tử Vi độc tọa tại Ngọ: Đắc thế "Cực Hướng Ly Minh", uy quyền tột bậc, danh tiếng vang lừng bốn bể, khí chất đế vương.
- Tại Cung Mệnh: Người đàng hoàng, có lòng tự trọng cao, có phong thái lãnh đạo, lời nói có trọng lượng.
- Tại Cung Phu Thê: Vợ/chồng là người danh giá, có học thức, gia giáo nghiêm cẩn; vợ chồng tôn trọng lẫn nhau.
- Tại Cung Tài Bạch: Tiền bạc đến từ vị thế xã hội, giữ chữ tín làm đầu, không làm ăn phi pháp.
- Tại Cung Quan Lộc: Hợp làm lãnh đạo cơ quan, quản lý cấp cao, đứng đầu tổ chức.`
  },
  {
    title: 'Luận Giải Sao Thiên Phủ - Thiên Kho Quốc Khố & Nghệ Thuật Giữ Của',
    category: 'TU_VI',
    tags: ['Thiên Phủ', 'Kho Tiền', 'Lệnh Tinh', 'Tài Sản'],
    content: `Thiên Phủ (Dương Thổ) là sao thứ nhất của Vòng Thiên Phủ, là "Ngân Khố của Trời":
- Đặc tính: Tính tình đôn hậu, điềm tĩnh, cẩn trọng, biết thu vén, có tài tổ chức và quản trị dòng tiền.
- Thiên Phủ kỵ nhất: Gặp Địa Không, Địa Kiếp hoặc Tuần/Triệt (gọi là "Không Khố" hay "Lộ Khố" - kho thủng, kho rỗng). Khi gặp Kiếp Không, tiền bạc dễ bị thất thoát do tin người hoặc đầu tư bất cẩn.
- Đắc cách: Khi hội Tả Phù, Hữu Bật, Hóa Lộc, Lộc Tồn, người mang Thiên Phủ hậu vận vô cùng sung túc, nhà cao cửa rộng, đất đai phì nhiêu.`
  },
  {
    title: 'Cách Cục "Vũ Tham Đồng Hành" Tại Sửu Mùi - Tiền Bần Hậu Phú',
    category: 'TU_VI',
    tags: ['Vũ Khúc', 'Tham Lang', 'Sửu Mùi', 'Hậu Vận'],
    content: `Cách cục "Vũ Tham đồng hành" xảy ra khi Vũ Khúc (Tài tinh) đồng cung với Tham Lang (Đào hoa/Kinh doanh) tại hai cung Sửu hoặc Mùi:
- Khẩu quyết cổ thư: "Vũ Tham đồng hành ư Sửu Mùi, tiền bần nhi hậu phú".
- Luận giải: Thời trẻ (trước 30-35 tuổi) đương số phải chịu nhiều sóng gió, khởi nghiệp thăng trầm, thử thách tài chính để tôi luyện ý chí. Từ 35-40 tuổi trở đi, thế cục Vũ Tham miếu địa bộc phát sức mạnh khủng khiếp, tài lộc ập đến như triều dâng.
- Lĩnh vực phát đạt: Thương mại, đầu tư, sản xuất, dịch vụ giải trí hoặc tư vấn chiến lược. Người có cách này càng sống khiêm nhường, phúc đức thì tài lộc càng lưu giữ truyền đời.`
  },
  {
    title: 'Luận Giải Sao Thái Dương - Nhật Tinh & Công Danh Lỗi Lạc',
    category: 'TU_VI',
    tags: ['Thái Dương', 'Mặt Trời', 'Quan Lộc', 'Danh Tiếng'],
    content: `Thái Dương (Dương Hỏa) biểu tượng cho vầng mặt trời soi rọi thế gian:
- Ban ngày từ Dần đến Ngọ: Thái Dương miếu vượng rực rỡ, đương số là người khẳng khái, quảng đại, danh tiếng vang xa, thích làm việc công ích.
- Ban đêm từ Thân đến Tý: Thái Dương lạc hãm, như mặt trời lặn dưới biển, làm nhiều hưởng ít, hay bị hiểu lầm. Cần Hóa Khoa hoặc Tuần/Triệt cứu giải.
- Ứng xử: Người có Thái Dương phải giữ lòng quang minh chính đại, tuyệt đối không làm việc khuất tất lén lút thì sự nghiệp mới bền lâu.`
  },
  {
    title: 'Luận Giải Sao Thái Âm - Nguyệt Tinh & Điền Sản Bất Động Sản',
    category: 'TU_VI',
    tags: ['Thái Âm', 'Mặt Trăng', 'Điền Trạch', 'Tài Sản'],
    content: `Thái Âm (Âm Thủy) biểu tượng cho mặt trăng dịu dàng và người phụ nữ:
- Miếu vượng tại Dậu, Tuất, Hợi, Tý (ban đêm trăng tròn sáng tỏ): Người thanh tú, thông minh, giàu lòng trắc ẩn, có duyên lớn với bất động sản, nhà đất, nông trang.
- Thái Âm ngộ Hóa Lộc hoặc Lộc Tồn: Cách "Phú gia địch quốc", tích lũy đất đai vô số, hậu vận an nhàn sung túc.
- Hãm địa tại Thìn, Tỵ, Ngọ: Dễ suy nghĩ lan man, nhạy cảm quá mức, tình duyên lận đận.`
  },
  {
    title: 'Luận Giải Sao Thiên Tướng - Ấn Tinh & Phò Tá Đại Nghiệp',
    category: 'TU_VI',
    tags: ['Thiên Tướng', 'Ấn Tinh', 'Phò Tá', 'Lòng Nhân Ái'],
    content: `Thiên Tướng (Dương Thủy) là sao coi về con dấu quyền lực và sự ủy thác:
- Tính cách: Đôn hậu, hay thương người, thích làm việc thiện, chu đáo, rất có năng lực tổ chức triển khai công việc.
- Thế đứng: Thiên Tướng luôn nằm trong tam hợp với Thiên Phủ (Phủ Tướng triều viên). Là trợ thủ đắc lực nhất cho người làm chủ, hoặc tự mình làm chủ với phong thái nhân từ.
- Điều cấm kỵ: Thiên Tướng rất sợ gặp Kình Dương, Đà La và Hóa Kỵ (cách Hình Tù Giáp Ấn) dễ vướng vào rắc rối pháp lý, kiện tụng hoặc bị người khác lừa gạt về giấy tờ.`
  },
  {
    title: 'Cách Cục "Tử Phủ Vũ Tướng" vs "Sát Phá Liêm Tham"',
    category: 'TU_VI',
    tags: ['Tử Phủ Vũ Tướng', 'Sát Phá Tham', 'Cách Cục', 'Mệnh Tài Quan'],
    content: `Hai hệ thống cách cục cốt lõi phân định đường lối đời người:
1. Bộ Tử Phủ Vũ Tướng (Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng):
   - Bản chất: Ôn hòa, chính đạo, kiến thiết thể chế, quản trị bền vững, bảo tồn thành quả.
   - Thích hợp: Doanh nghiệp quy mô lớn, tài chính ngân hàng, cơ quan nhà nước, quản lý nhân sự.
2. Bộ Sát Phá Liêm Tham (Thất Sát, Phá Quân, Liêm Trinh, Tham Lang):
   - Bản chất: Chiến binh, khai phá, xông pha trận mạc, chấp nhận rủi ro để giành thắng lợi đột phá.
   - Thích hợp: Khởi nghiệp sáng tạo, kinh doanh đột phá, công nghệ mới, thị trường biến động mạnh.`
  },
  {
    title: 'Tuần Trung Không Vong & Triệt Lộ Không Vong Toàn Thư',
    category: 'TU_VI',
    tags: ['Tuần', 'Triệt', 'Không Vong', 'Cứu Giải'],
    content: `Tuần và Triệt là hai vùng chân không tâm linh quyền năng trên địa bàn:
- Triệt Lộ Không Vong: Can thiệp mãnh liệt trong tiền vận (từ nhỏ đến 30-32 tuổi), sau đó giảm dần uy lực. Triệt làm sao sáng thành mờ, nhưng cứu giải sao hãm địa bớt hung hãn.
- Tuần Trung Không Vong: Ảnh hưởng êm dịu, bao trùm suốt cuộc đời, từ 32 tuổi trở đi tác động ngày càng sâu sắc.
- Mệnh Vô Chính Diệu đắc Tuần/Triệt: Được ví như tấm gương bắt sáng, người thông minh, nhạy bén, biết tùy cơ ứng biến trước thời cuộc.`
  },
  {
    title: 'Tứ Hóa Bí Điển: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ',
    category: 'TU_VI',
    tags: ['Tứ Hóa', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'],
    content: `Tứ Hóa là 4 dạng biến đổi năng lượng thần diệu của các sao theo Thiên Can năm sinh:
1. Hóa Lộc: Mùa Xuân, sinh sôi, lộc ăn, tài vận dồi dào, tâm tính vui vẻ, duyên làm ăn.
2. Hóa Quyền: Mùa Hạ, bùng cháy, quyền lực, ý chí thép, năng lực chỉ huy và kiểm soát.
3. Hóa Khoa: Mùa Thu, gặt hái, học vấn, danh tiếng, đỗ đạt, đệ nhất giải ách cứu nạn.
4. Hóa Kỵ: Mùa Đông, ẩn tàng, thị phi, trở ngại, dính mắc, thử thách tâm tính.
Khi Hóa Kỵ gặp sao sáng hoặc đắc địa, đương số có tư duy phản biện sắc bén, khả năng nhìn thấy kẽ hở người khác bỏ qua.`
  },
  {
    title: 'Luận Vòng Thái Tuế: Thái Tuế, Tang Môn, Bạch Hổ, Điếu Khách',
    category: 'TU_VI',
    tags: ['Thái Tuế', 'Bạch Hổ', 'Tang Môn', 'Vòng Sao'],
    content: `Vòng Thái Tuế phản ánh vị thế và thái độ ứng xử của con người với thời cuộc:
- Tam hợp Thái Tuế - Quan Phù - Bạch Hổ: Thế chính danh, đường hoàng, gánh vác trách nhiệm lớn, luôn hành xử theo lẽ phải.
- Tam hợp Tang Môn - Tuế Phá - Điếu Khách: Thế bất mãn, thích cải cách, không cam chịu trói buộc, hay đối đầu với quy củ cũ.
- Tam hợp Thiếu Âm - Long Đức - Trực Phù: Thế chịu thiệt thòi, lấy đức cảm hóa người, nhường nhịn hậu đãi.
- Tam hợp Thiếu Dương - Tử Phù - Phúc Đức: Thế thông minh, lanh lợi, nhìn xa trông rộng.`
  },
  {
    title: 'Luận Vòng Lộc Tồn: Bác Sĩ, Lực Sĩ, Thanh Long, Tướng Quân',
    category: 'TU_VI',
    tags: ['Lộc Tồn', 'Vòng Bác Sĩ', 'Tài Lộc'],
    content: `Lộc Tồn là sao Thiên Lộc trời ban, kẹp giữa Kình Dương (trước) và Đà La (sau):
- Ý nghĩa: Lộc Tồn tượng trưng cho của cải chân chính do phúc đức tạo nên. Vì có Kình Đà kẹp hai bên, người có Lộc Tồn giữ tiền phải hết sức khiêm tốn, tránh khoe khoang để khỏi bị kẻ xấu dòm ngó.
- Vòng Bác Sĩ đi kèm: Bác Sĩ (thông tuệ), Lực Sĩ (sức vóc), Thanh Long (may mắn), Tiểu Hao (hao tán nhỏ), Tướng Quân (oai phong), Tấu Thư (khéo văn chương), Phi Liêm (nhanh nhẹn), Hỷ Thần (tin vui), Bệnh Phù (ốm mệt), Đại Hao (hao tài lớn), Phục Binh (ngấm ngầm), Quan Phủ (pháp lý).`
  },
  {
    title: 'Luận Vòng Trường Sinh 12 Giai Đoạn Vận Khí Con Người',
    category: 'TU_VI',
    tags: ['Trường Sinh', 'Đế Vượng', 'Mộ', 'Khí Vận'],
    content: `Vòng Trường Sinh mô tả chu kỳ sinh - trưởng - tàn - lụi của vạn vật:
1. Trường Sinh: Khởi đầu non trẻ, đầy sức sống.
2. Mộc Dục: Tắm gội, dễ dao động, đam mê cảm xúc.
3. Quan Đới: Trưởng thành, bắt đầu gánh vác chức phận.
4. Lâm Quan: Vào đời làm việc, sung sức, tự lập.
5. Đế Vượng: Đỉnh cao năng lượng, cực thịnh, quyền uy.
6. Suy: Khí lực bắt đầu chùng xuống, cần tĩnh tại.
7. Bệnh: Thể chất hao mòn, cần dưỡng sinh.
8. Tử: Chấm dứt một chu kỳ hành động.
9. Mộ: Thu gom cất giữ, an nghỉ, tích lũy điền sản.
10. Tuyệt: Không còn dấu vết, thời kỳ tĩnh lặng tuyệt đối.
11. Thai: Mầm sống mới nhen nhóm trong bóng tối.
12. Dưỡng: Được nuôi dưỡng, chuẩn bị bước vào cuộc đời mới.`
  },
  {
    title: 'Bí Quyết Hóa Giải Sát Tinh: Kình, Đà, Hỏa, Linh, Không, Kiếp',
    category: 'TU_VI',
    tags: ['Sát Tinh', 'Kình Đà', 'Không Kiếp', 'Hóa Giải'],
    content: `Lục Sát Tinh là thử thách lớn nhất trong bản đồ số mệnh:
- Kình Dương (Kim): Lưỡi gươm sắc bén, tính nóng nảy, xốc nổi. Hóa giải: Rèn luyện tính kiên nhẫn, học nghề cơ khí, phẫu thuật y khoa hoặc võ thuật.
- Đà La (Kim): Mũi tên ngầm, dùng dằng, kéo dài, u sầu. Hóa giải: Minh bạch mục tiêu, dứt khoát trong quyết định, chia sẻ tâm tư với tri kỷ.
- Hỏa Tinh & Linh Tinh (Hỏa): Tia chớp và lửa ngầm, bộc phát dữ dội. Hóa giải: Học cách thở sâu, dưỡng tâm an tĩnh, ăn đồ mát.
- Địa Không & Địa Kiếp (Hỏa): Cơn lốc cuốn phăng tài sản vật chất. Hóa giải: Đừng tham lam của cải phi nghĩa, sống cống hiến, coi tiền tài như phương tiện phụng sự nhân sinh.`
  },
  {
    title: 'Cung Phu Thê Toàn Thư: Duyên Phận, Hòa Hợp & Hóa Giải Xung Khắc',
    category: 'TU_VI',
    tags: ['Phu Thê', 'Tình Duyên', 'Hôn Nhân', 'Gia Đạo'],
    content: `Cung Phu Thê phản ánh bản chất người phối ngẫu và đời sống hôn nhân:
- Gặp sao Cát (Tử Vi, Thiên Phủ, Thiên Đồng, Thái Âm miếu): Vợ chồng hòa thuận, hỗ trợ nhau công danh tài lộc.
- Gặp sao Sát/Hãm (Liêm Phá, Cự Môn hãm, Kình Đà, Không Kiếp): Dễ xảy ra tranh chấp khẩu thiệt do cái tôi cá nhân quá lớn.
- Bí quyết giữ lửa: Người xưa có câu "Chồng giận thì vợ bớt lời, cơm sôi bớt lửa chẳng đời nào khê". Người mang mệnh Hỏa cần bớt nóng nảy; người mang mệnh Thủy cần bớt đa nghi; người mang mệnh Kim cần bớt lạnh lùng.`
  },

  // ==========================================
  // NHÓM 2: KINH DỊCH 64 QUẺ & DỰ ĐOÁN HỌC (14 CHỦ ĐỀ)
  // ==========================================
  {
    title: 'Quẻ Thuần Càn (Bát Thuần Càn) - Rồng Bay Lên Trời & Đạo Cương Kiện',
    category: 'KINH_DICH',
    tags: ['Thuần Càn', 'Quẻ Dịch', 'Cương Kiện', 'Lãnh Đạo'],
    content: `Quẻ Thuần Càn (䷀) gồm 6 hào Dương, tượng trưng cho Trời, mặt trời và sức sáng tạo nguyên sơ:
- Thoán từ: "Càn: Nguyên, Hanh, Lợi, Trinh" (Khởi đầu lớn lao, hanh thông suôn sẻ, ích lợi bền vững, chính đạo kiên trinh).
- Ý nghĩa 6 hào Rồng:
  + Sơ Cửu: "Tiềm long vật dụng" (Rồng còn ẩn dưới vực sâu, chưa nên hành động vội vàng mà cần tích lũy tài đức).
  + Cửu Nhị: "Hiện long tại điền" (Rồng xuất hiện trên đồng ruộng, bắt đầu được người đời biết đến, lợi kiến đại nhân).
  + Cửu Tam: "Quân tử chung nhật càn càn" (Suốt ngày phấn đấu không ngừng, đêm về vẫn thận trọng tự xét mình).
  + Cửu Tứ: "Hoặc dược tại uyên" (Có lúc nhảy vọt lên cao, có lúc lui về vực thẳm tùy thời cơ).
  + Cửu Ngũ: "Phi long tại thiên" (Rồng bay giữa trời xanh, thời kỳ hoàng kim rực rỡ nhất của người quân tử).
  + Thượng Cửu: "Kháng long hữu hối" (Rồng bay quá cao sẽ kiêu ngạo mà sinh ân hận, cần biết điểm dừng).`
  },
  {
    title: 'Quẻ Thuần Khôn (Bát Thuần Khôn) - Đất Dày Chở Vật & Đạo Nhu Thuận',
    category: 'KINH_DICH',
    tags: ['Thuần Khôn', 'Đất Mẹ', 'Nhu Thuận', 'Bao Dung'],
    content: `Quẻ Thuần Khôn (䷁) gồm 6 hào Âm, tượng trưng cho Đất Mẹ bao la:
- Đại Tượng truyện: "Địa thế khôn, quân tử dĩ hậu đức tải vật" (Thế của đất dày dặn, người quân tử noi theo đất mà dùng đức dày để bao bọc vạn vật).
- Lời khuyên của Dịch: Người hiểu đạo Khôn biết lắng nghe, mềm mỏng, kiên nhẫn, đứng sau hậu thuẫn cho người khác thành công. "Nhu thắng cương, nhược thắng cường" chính là bí quyết trường tồn của đạo Khôn.`
  },
  {
    title: 'Quẻ Hỏa Phong Đỉnh (Đỉnh) - Nung Nấu Rèn Luyện & Kiến Tạo Cơ Nghiệp',
    category: 'KINH_DICH',
    tags: ['Hỏa Phong Đỉnh', 'Chiếc Đỉnh', 'Sự Nghiệp', 'Luyện Tài'],
    content: `Quẻ Hỏa Phong Đỉnh (䷱) gồm quẻ Ly (Lửa) ở trên, quẻ Tốn (Gió/Củi) ở dưới:
- Tượng quẻ: Chiếc vạc ba chân nấu chín thức ăn, luyện khoáng thạch thành đồng vàng nguyên chất.
- Ứng dụng: Báo hiệu thời kỳ tôi luyện bản lĩnh đã kết thúc, đây là lúc đương số xác lập vị thế vững chắc trong xã hội, nắm quyền điều hành doanh nghiệp hoặc tổ chức lớn. Cần dùng người hiền tài (hào Lục Ngũ Hoàng nhĩ kim huyễn) để duy trì nghiệp lớn.`
  },
  {
    title: 'Quẻ Địa Sơn Khiêm (Khiêm) - Đức Khiêm Nhường Cát Tường Bất Bại',
    category: 'KINH_DICH',
    tags: ['Địa Sơn Khiêm', 'Khiêm Tốn', 'Cát Tường'],
    content: `Quẻ Địa Sơn Khiêm (䷎) gồm quẻ Khôn (Đất) ở trên, quẻ Cấn (Núi) ở dưới:
- Tượng quẻ: Ngọn núi cao chọc trời nhưng lại tự nguyện cúi mình nằm dưới lòng đất bằng phẳng.
- Điểm độc nhất vô nhị: Trong toàn bộ 64 quẻ Kinh Dịch, chỉ có duy nhất quẻ Khiêm là cả 6 hào đều TỐT LÀNH (Đại cát), không có hào nào hung hiểm!
- Bài học: "Trời bớt chỗ thừa bù chỗ thiếu, Đất san bằng chỗ cao bồi chỗ trũng, Quỷ thần hại kẻ kiêu căng ban phúc cho người khiêm tốn". Càng thành công lớn, người lãnh đạo càng phải cúi đầu lắng nghe.`
  },
  {
    title: 'Hà Đồ & Lạc Thư: Nguồn Cội Huyền Học Phương Đông',
    category: 'KINH_DICH',
    tags: ['Hà Đồ', 'Lạc Thư', 'Âm Dương', 'Ngũ Hành'],
    content: `Hà Đồ và Lạc Thư là hai bản đồ ma phương thiên văn cổ xưa:
1. Hà Đồ (Sinh Thành số):
   - Bắc: 1 - 6 thuộc Thủy (Thiên nhất sinh Thủy, Địa lục thành chi).
   - Nam: 2 - 7 thuộc Hỏa (Địa nhị sinh Hỏa, Thiên thất thành chi).
   - Đông: 3 - 8 thuộc Mộc (Thiên tam sinh Mộc, Địa bát thành chi).
   - Tây: 4 - 9 thuộc Kim (Địa tứ sinh Kim, Thiên cửu thành chi).
   - Trung ương: 5 - 10 thuộc Thổ (Thiên ngũ sinh Thổ, Địa thập thành chi).
2. Lạc Thư (Ma trận 9 cung): "Đội 9 đạp 1, tả 3 hữu 7, 2 - 4 làm vai, 6 - 8 làm chân, số 5 ở giữa". Đây là gốc rễ của Huyền Không Phi Tinh và phong thủy Bát Trạch.`
  },
  {
    title: 'Quẻ Thủy Hỏa Ký Tế & Hỏa Thủy Vị Tế - Tròn Đầy & Khởi Đầu Mới',
    category: 'KINH_DICH',
    tags: ['Ký Tế', 'Vị Tế', 'Quy Luật Biến Dịch'],
    content: `Hai quẻ cuối cùng khép lại và mở ra vòng tuần hoàn bất tận của Kinh Dịch:
- Ký Tế (䷾): Lửa ở dưới đun sôi Nước ở trên, 6 hào âm dương đều đắc vị, việc đã thành tựu viên mãn. Dịch cảnh báo: "Khởi đầu hanh thông, về sau dễ loạn" (Sơ cát chung loạn) vì khi đã ở đỉnh cao thì mầm mống suy thoái bắt đầu nảy sinh.
- Vị Tế (䷿): Nước ở dưới, Lửa bốc lên trên, chưa xong, chưa hoàn tất. Dịch đặt Vị Tế ở cuối cùng 64 quẻ để khẳng định vũ trụ và cuộc đời không bao giờ có điểm kết thúc tuyệt đối; mọi sự việc luôn luôn tiếp nối, chuyển hóa sang chu kỳ mới.`
  },
  {
    title: 'Quẻ Thiên Hỏa Đồng Nhân & Hỏa Thiên Đại Hữu - Hợp Lực & Thịnh Vượng',
    category: 'KINH_DICH',
    tags: ['Đồng Nhân', 'Đại Hữu', 'Hợp Tác', 'Tài Lộc'],
    content: `Cặp quẻ tương hỗ về tinh thần đoàn kết và tài sản lớn:
- Đồng Nhân (䷌): Trời ở trên, Lửa ở dưới sáng soi cùng một hướng. Chủ về sự đồng lòng, không phân biệt ranh giới gia tộc, cùng chung lý tưởng vì đại nghĩa. Doanh nghiệp muốn đi xa phải có tinh thần Đồng Nhân.
- Đại Hữu (䷍): Lửa ở trên Trời, mặt trời giữa trưa tỏa sáng muôn loài. Biểu thị sự giàu có lớn, thu hoạch vụ mùa bội thu. Đại Hữu dạy: "Chặn điều ác, phát huy điều thiện, thuận theo mệnh trời thì tài lộc trường cửu".`
  },
  {
    title: 'Quẻ Địa Lôi Phục - Dương Khí Hồi Sinh Sau Đêm Đông Giá Lạnh',
    category: 'KINH_DICH',
    tags: ['Địa Lôi Phục', 'Hồi Sinh', 'Hy Vọng', 'Đông Chí'],
    content: `Quẻ Phục (䷗) gồm 1 hào Dương mới chớm sinh dưới đáy 5 hào Âm:
- Tượng quẻ: Sấm động sâu dưới lòng đất, thời điểm tiết Đông chí lạnh nhất nhưng mầm sống ấm áp của mùa Xuân đã bắt đầu cựa quậy.
- Ứng dụng: Khi gặp thất bại hay khủng hoảng chạm đáy, đừng bao giờ tuyệt vọng. Hãy kiên nhẫn tĩnh dưỡng, bởi "Hết cơn bĩ cực đến hồi thái lai", một chu kỳ phục hưng rực rỡ đang bắt đầu âm thầm trỗi dậy!`
  },

  // ==========================================
  // NHÓM 3: TỨ TRỤ BÁT TỰ & DỤNG THẦN HỌC (12 CHỦ ĐỀ)
  // ==========================================
  {
    title: 'Thập Can Nhật Chủ: Bản Sắc 10 Loại Năng Lượng Vũ Trụ',
    category: 'TU_TRU',
    tags: ['Nhật Chủ', 'Thập Can', 'Tính Cách', 'Bát Tự'],
    content: `Nhật Chủ (Thiên Can ngày sinh) đại diện cho Bản Thể cốt lõi của đương số:
1. Giáp Mộc: Cây đại thụ, cương trực, có chí vươn cao, ghét luồn cúi.
2. Ất Mộc: Dây leo, cỏ hoa, linh hoạt, mềm mại, sức sống dai dẳng.
3. Bính Hỏa: Mặt trời, ấm áp, nhiệt tình, hào sảng, thẳng thắn.
4. Đinh Hỏa: Ngọn đèn, bếp lửa, sâu sắc, cẩn trọng, sáng soi nội tâm.
5. Mậu Thổ: Đất núi cao, vững chãi, trọng chữ tín, điềm đạm, bao dung.
6. Kỷ Thổ: Đất ruộng vườn, màu mỡ, khéo léo, thích nuôi dưỡng người khác.
7. Canh Kim: Kim loại thô, kiếm sắt, nghĩa khí, dứt khoát, thích chiến đấu.
8. Tân Kim: Vàng bạc châu báu, tinh tế, thích hoàn mỹ, trọng thể diện.
9. Nhâm Thủy: Sông lớn, biển cả, trí tuệ bao la, khoáng đạt, thích tự do.
10. Quý Thủy: Nước mưa, sương mai, nhạy cảm, sâu sắc, trực giác tâm linh mạnh.`
  },
  {
    title: 'Thập Thần Mệnh Lý: Cấu Trúc Vận Mệnh Trong Tứ Trụ',
    category: 'TU_TRU',
    tags: ['Thập Thần', 'Chính Quan', 'Thất Sát', 'Chính Tài', 'Thực Thương'],
    content: `10 vị Thần được sinh ra từ mối quan hệ sinh khắc giữa Nhật Chủ và các can chi khác:
- Sinh ta: Chính Ấn (mẹ, học vấn, danh dự), Kiêu Thần / Thiên Ấn (nghệ thuật, tâm linh, huyền học).
- Cùng ta: Tỷ Kiên (bạn bè, anh em, đồng chí), Kiếp Tài (cạnh tranh, tranh đoạt, hào phóng).
- Ta sinh: Thực Thần (phúc lộc, sáng tạo, ẩm thực, con cái), Thương Quan (tài hoa, bộc phát, phản kháng).
- Ta khắc: Chính Tài (tiền lương, vợ, tài sản ổn định), Thiên Tài (tiền kinh doanh, đầu tư, cơ hội lớn).
- Khắc ta: Chính Quan (pháp luật, chức vụ, đạo đức, chồng), Thất Sát (quyền lực, áp lực, đối thủ, thử thách).`
  },
  {
    title: 'Nghệ Thuật Chọn Dụng Thần & Hỷ Thần Cải Mệnh Trong Bát Tự',
    category: 'TU_TRU',
    tags: ['Dụng Thần', 'Hỷ Thần', 'Cải Vận', 'Cân Bằng'],
    content: `Dụng Thần là chiếc chìa khóa ngũ hành giải cứu và cân bằng toàn bộ lá số Tứ Trụ:
1. Nguyên tắc Phù Ức (Nâng đỡ - Tiết giảm): Thân nhược cần Ấn Kiếp trợ sinh; Thân vượng cần Tài Quan Thực Thương tiết chế.
2. Nguyên tắc Điều Hầu (Ấm áp - Mát mẻ): Sinh vào mùa Đông lạnh giá (tháng Hợi, Tý, Sửu) cần Hỏa sưởi ấm; Sinh vào mùa Hè thiêu đốt (tháng Tỵ, Ngọ, Mùi) cần Thủy làm dịu mát.
3. Nguyên tắc Thông Quan (Hòa giải): Khi hai hành xung chiến khốc liệt (Kim khắc Mộc cần Thủy đứng giữa hòa giải; Thủy khắc Hỏa cần Mộc đứng giữa kết nối).
Ứng dụng: Chọn màu sắc trang phục, hướng nhà, ngành nghề và đối tác tương sinh với Dụng Thần để cải biến số mệnh!`
  },
  {
    title: 'Thần Sát Quý Hiển: Thiên Ất Quý Nhân, Văn Xương, Dịch Mã',
    category: 'TU_TRU',
    tags: ['Thần Sát', 'Thiên Ất Quý Nhân', 'Văn Xương', 'Dịch Mã'],
    content: `Các sao Thần Sát mang năng lượng bổ trợ đặc biệt trong Tứ Trụ:
- Thiên Ất Quý Nhân: Đệ nhất cát thần, gặp nguy hóa an, đi đâu cũng có người giúp đỡ, tai qua nạn khỏi.
- Văn Xương Quý Nhân: Chủ về học hành thông minh, thi cử đỗ đạt, có khiếu viết lách và nghiên cứu học thuật.
- Dịch Mã: Chủ về sự dịch chuyển, đi lại, xuất ngoại, công việc hay thay đổi, linh hoạt thích ứng.
- Đào Hoa (Hàm Trì): Duyên dáng, có sức hút giới tính, năng khiếu nghệ thuật; nếu không biết kiềm chế dễ vướng lụy tình.`
  },
  {
    title: 'Tam Hợp & Lục Hợp Địa Chi: Khoa Học Chọn Đối Tác & Bạn Đời',
    category: 'TU_TRU',
    tags: ['Tam Hợp', 'Lục Hợp', 'Hợp Tuổi', 'Đối Tác'],
    content: `Quy luật tương hợp năng lượng giữa 12 Địa Chi:
1. Bốn Cục Tam Hợp:
   - Thân - Tý - Thìn hóa Thủy cục (Trí tuệ, linh hoạt, thích ứng cao).
   - Dần - Ngọ - Tuất hóa Hỏa cục (Nhiệt huyết, sáng tạo, tiên phong, hành động quyết liệt).
   - Tỵ - Dậu - Sửu hóa Kim cục (Kỷ luật, nguyên tắc, tài chính, sắc bén).
   - Hợi - Mão - Mùi hóa Mộc cục (Nhân ái, giáo dục, phát triển bền vững).
2. Sáu Cặp Lục Hợp (Nhị Hợp):
   Tý - Sửu hóa Thổ; Dần - Hợi hóa Mộc; Mão - Tuất hóa Hỏa; Thìn - Dậu hóa Kim; Tỵ - Thân hóa Thủy; Ngọ - Mùi hóa Thổ.
Hợp tác với người nằm trong tam hợp hoặc lục hợp giúp giảm thiểu xung đột cái tôi, bù trừ khiếm khuyết cho nhau.`
  },

  // ==========================================
  // NHÓM 4: PHONG THỦY BÁT TRẠCH & HUYỀN KHÔNG (12 CHỦ ĐỀ)
  // ==========================================
  {
    title: 'Phong Thủy Bát Trạch: 4 Cung Cát Khí & 4 Cung Hung Khí',
    category: 'PHONG_THUY',
    tags: ['Bát Trạch', 'Sinh Khí', 'Diên Niên', 'Tuyệt Mệnh'],
    content: `Trường phái Bát Trạch chia không gian thành 8 phương vị phối hợp với Cung Phi của trạch chủ:
1. Bốn Hướng Cát (Nên đặt Cửa chính, Phòng khách, Phòng ngủ, Bàn làm việc):
   - Sinh Khí: Đứng đầu tài lộc, danh tiếng thăng tiến, sức sống mãnh liệt.
   - Thiên Y: Chủ về sức khỏe, trường thọ, gặp thầy gặp thuốc, tâm hồn thanh thản.
   - Diên Niên (Phước Đức): Chủ về tình cảm gia đạo hòa thuận, ngoại giao êm thấm.
   - Phục Vị: Chủ về nội lực, củng cố tinh thần, bình an, tĩnh tâm học tập.
2. Bốn Hướng Hung (Nên đặt Nhà vệ sinh, Bếp để trấn hung sát):
   - Tuyệt Mệnh: Sát khí nặng nề, tổn hại sức khỏe, tai ương bất ngờ.
   - Ngũ Quỷ: Dễ xảy ra tranh cãi, mất cắp, thị phi, tâm thần bất an.
   - Lục Sát: Trắc trở tình duyên, kiện tụng, hao tài tán lộc.
   - Họa Hại: Những chuyện vặt vãnh gây phiền toái, bất đồng nhỏ.`
  },
  {
    title: 'Dương Trạch Tam Yếu: Cửa Chính, Bếp Ăn & Phòng Ngủ',
    category: 'PHONG_THUY',
    tags: ['Dương Trạch Tam Yếu', 'Cửa Chính', 'Bếp', 'Phòng Ngủ'],
    content: `Ba yếu tố sống còn quyết định vượng suy của một ngôi nhà:
1. Môn (Cửa chính): Là khí khẩu tiếp nhận sinh khí của trời đất. Cửa chính phải sáng sủa, thông thoáng, không bị đường đâm thẳng vào (Thương sát), không đối diện góc nhọn hay cột điện.
2. Táo (Bếp ăn): "Bếp đặt tọa hung hướng cát". Lửa bếp (Hỏa) thiêu rụi tà khí ở phương vị xấu, và miệng bếp hướng về phương vị tốt để đón nhận phúc lộc, bảo vệ sức khỏe cho cả gia đình.
3. Chủ (Phòng ngủ trạch chủ): Nơi con người nghỉ ngơi tái tạo năng lượng suốt 8 tiếng mỗi ngày. Giường ngủ cần tựa vào tường vững chãi, tránh xà ngang đè lên đầu, không đối diện gương soi.`
  },
  {
    title: 'Huyền Không Vận 9 (2024 - 2043): Thời Kỳ Cửu Tử Ly Hỏa Vượng Phát',
    category: 'PHONG_THUY',
    tags: ['Vận 9', 'Cửu Tử Ly Hỏa', 'Huyền Không Phi Tinh', 'Thời Đại'],
    content: `Từ năm Giáp Thìn 2024 đến hết năm Quý Hợi 2043, vũ trụ chính thức bước vào Vận 9 (Cửu Vận), do sao Cửu Tử (Hành Hỏa, Quẻ Ly) làm chủ quản:
- Đặc điểm thời đại:
  + Năng lượng Hỏa bùng nổ: Công nghệ thông tin, trí tuệ nhân tạo (AI), năng lượng tái tạo, không gian vũ trụ, truyền thông số phát triển thần tốc.
  + Văn hóa & Tâm linh: Con người hướng nội nhiều hơn, quan tâm sâu sắc đến sức khỏe tinh thần, thiền định, đạo học và triết lý sống.
  + Vị thế phụ nữ: Quẻ Ly tượng trưng cho người phụ nữ trung niên; phụ nữ ngày càng nắm giữ nhiều trọng trách lãnh đạo xã hội.
- Ứng dụng phong thủy: Chú trọng phương vị Chính Nam (Ly) và Chính Bắc (Khảm) để cân bằng Thủy - Hỏa trong ngôi nhà.`
  },
  {
    title: 'Nghệ Thuật Kích Hoạt Cung Tài Lộc (Đông Nam) & Cung Quý Nhân (Tây Bắc)',
    category: 'PHONG_THUY',
    tags: ['Cung Tài Lộc', 'Cung Quý Nhân', 'Vật Phẩm', 'Chiêu Tài'],
    content: `Cách bố trí năng lượng kích hoạt vận may trong không gian sống và làm việc:
1. Cung Tài Lộc (Phương vị Đông Nam - Quẻ Tốn, hành Mộc):
   - Đặt cây xanh phong thủy lá tròn dày (Kim Tiền, Kim Ngân, Vạn Niên Thanh) hoặc đài phun nước mini luân chuyển.
   - Thủy sinh Mộc giúp tài khí sinh sôi liên tục, tuyệt đối không để rác hay góc tối bụi bặm ở đây.
2. Cung Quý Nhân Phù Trợ (Phương vị Tây Bắc - Quẻ Càn, hành Kim):
   - Đặt các vật phẩm bằng kim loại, đồng hồ chuông đồng, quả cầu đá Thạch anh trắng hoặc tượng ngọc.
   - Giúp lãnh đạo nhận được sự tin tưởng của cấp trên, sự kính trọng của đối tác và quý nhân nâng đỡ khi gặp hoạn nạn.`
  },
  {
    title: 'Nguyên Tắc Thờ Cúng Thần Tài - Thổ Địa Chiêu Tài Đúng Phép',
    category: 'PHONG_THUY',
    tags: ['Ban Thờ Thần Tài', 'Thổ Địa', 'Tài Lộc', 'Chiêu Tài'],
    content: `Ban thờ Thần Tài - Ông Địa là điểm tựa tâm linh kinh doanh của người Việt:
- Vị trí: Đặt dưới đất, nơi góc nhà thông thoáng, hướng nhìn ra cửa chính đón khí, lưng tựa vào tường vững chắc (không tựa vào tường nhà vệ sinh hay góc nhọn).
- Cách bài trí: Tượng Thần Tài bên trái (nhìn từ ngoài vào), Thổ Địa bên phải; giữa là hũ gạo, hũ muối, hũ nước đầy; bát hương ở giữa; đĩa ngũ quả và 5 chén nước xếp hình chữ thập.
- Cốt lõi chiêu tài: Thần Tài ưa sạch sẽ, thơm tho. Quan trọng nhất là tâm thành kính, mua bán công bằng, không gian dối cân đo đong đếm thì Thần Tài mới ngự và phù hộ lâu bền.`
  },

  // ==========================================
  // NHÓM 5: TÂM LINH, NHÂN TƯỚNG & NHÂN QUẢ (14 CHỦ ĐỀ)
  // ==========================================
  {
    title: 'Triết Lý Cốt Lõi: "Đức Năng Thắng Số" - Chuyển Hóa Số Mệnh',
    category: 'TAM_LINH',
    tags: ['Đức Năng Thắng Số', 'Nhân Quả', 'Tâm Linh', 'Cải Mệnh'],
    content: `Cổ nhân phương Đông đúc kết: "Nhất Mệnh, Nhị Vận, Tam Phong Thủy, Tứ Tích Âm Đức, Ngũ Độc Thư" (Thứ nhất là Mệnh, thứ nhì là Vận, thứ ba là Phong Thủy, thứ tư là Tích Đức, thứ năm là Đọc Sách):
- Bản chất số mệnh: Lá số Tử Vi giống như hạt giống đã gieo từ kiếp trước. Nhưng mảnh đất (Phước Đức) và cách tưới nước chăm bón (Hành Động Thiện) của kiếp này hoàn toàn do ta làm chủ.
- Liễu Phàm Tứ Huấn: Tiên sinh Viên Liễu Phàm từng được Khổng tiên sinh chấm số cả đời không con, không đỗ đạt lớn, chết năm 53 tuổi. Nhờ nghe lời Vân Cốc thiền sư, phát nguyện làm 10.000 việc thiện, sửa đổi từng ý nghĩ xấu xa, mà số mệnh thay đổi hoàn toàn: đỗ tiến sĩ, sinh quý tử và sống thọ đến 74 tuổi!
- Chân lý: Tâm còn chưa thiện, phong thủy vô ích; Bất hiếu cha mẹ, thờ cúng vô ích; Làm ăn gian dối, cúng kiếng vô ích!`
  },
  {
    title: 'Âm Phần & Mồ Mả Gia Tiên: Mối Giao Cảm Tâm Linh Với Con Cháu',
    category: 'TAM_LINH',
    tags: ['Mồ Mả Gia Tiên', 'Âm Phần', 'Phúc Đức', 'Hiếu Đạo'],
    content: `Mối liên kết giữa người đã khuất và hậu duệ đời sau dựa trên nguyên lý cộng hưởng huyết thống (ADN và trường sinh học tâm linh):
- "Cây có gốc mới nở cành xanh ngọn, nước có nguồn mới biển rộng sông sâu": Mồ mả tổ tiên yên ấm, sạch sẽ, không bị úng thủy hay rễ cây đâm xuyên thì con cháu ở cõi dương an ổn, trí tuệ minh mẫn.
- Tiết Thanh Minh, Vu Lan và ngày giỗ chạp: Là cơ hội để con cháu kết nối trường năng lượng biết ơn. Lòng tri ân chân thành tạo ra lực gia hộ vô hình lớn nhất, hóa giải vận xui rủi của dòng tộc.`
  },
  {
    title: 'Công Đức Phóng Sinh & Bố Thí Cúng Dường: Chuyển Hóa Nghiệp Lực',
    category: 'TAM_LINH',
    tags: ['Phóng Sinh', 'Bố Thí', 'Công Đức', 'Phước Thiện'],
    content: `Bí quyết chuyển hóa nghiệp chướng trong Phật giáo và Đạo giáo:
- Phóng sinh đúng cách: Xuất phát từ lòng từ bi cứu mạng chúng sinh sắp bị giết thịt. Không đặt hàng trước kẻo biến việc phóng sinh thành hành vi tiếp tay cho kẻ săn bắt; thả đúng môi trường để sinh vật sống sót. Phóng sinh giúp giải tỏa nghiệp sát, tăng trưởng tuổi thọ và giảm bớt tai nạn xe cộ, ốm đau.
- Bố thí Ba-la-mật: Gồm Tài thí (giúp đỡ tiền của), Pháp thí (chia sẻ kiến thức, lẽ sống thiện lành) và Vô úy thí (giúp người khác bớt sợ hãi, lo âu). Làm việc thiện với tâm không mong cầu đền đáp sẽ thu hút phước báu vô lượng.`
  },
  {
    title: 'Nhân Tướng Học: 12 Cung Trên Khuôn Mặt Định Đoán Họa Phúc',
    category: 'NHAN_TUONG',
    tags: ['Nhân Tướng', '12 Cung', 'Khuôn Mặt', 'Khí Sắc'],
    content: `Khuôn mặt con người là tấm gương phản chiếu trực tiếp tâm tính và vận mệnh:
1. Cung Mệnh (Ấn Đường - nằm giữa hai đầu lông mày): Cần sáng sủa, rộng rãi từ 1.5 - 2 ngón tay, không có sẹo hay nếp nhăn cắt ngang. Người có Ấn Đường sáng là người bao dung, vận khí thông suốt.
2. Cung Quan Lộc (Trán giữa): Trán cao rộng, đầy đặn, biểu hiện trí tuệ uyên bác, đường quan lộ thênh thang.
3. Cung Tài Bạch (Chuẩn Đầu - chóp mũi): Mũi thẳng, chuẩn đầu tròn trịa, cánh mũi (Gián Đài, Đình Úy) dày dặn nở nang, biểu tượng của người biết kiếm tiền và giữ của vững vàng.
4. Cung Phu Thê (Gian Môn - đuôi mắt): Đầy đặn, không có vết sẹo hay nếp nhăn chân vịt lộn xộn, biểu thị gia đạo yên ấm.`
  },
  {
    title: 'Đạo Dưỡng Sinh Đông Y & Tĩnh Tâm Cho Người Trọng Trách',
    category: 'TAM_LINH',
    tags: ['Dưỡng Sinh', 'Đông Y', 'Thiền Định', 'Tĩnh Tâm'],
    content: `Hoàng Đế Nội Kinh dạy: "Điềm đạm hư vô, chân khí tòng chi; Tinh thần nội thủ, bệnh an tòng lai" (Tâm hồn điềm đạm thanh thản thì chân khí thuận hòa; Giữ gìn tinh thần bên trong thì bệnh tật làm sao sinh ra được):
- Bệnh từ tâm sinh: Lo lắng hại Tỳ (tiêu hóa), Giận dữ hại Can (gan mật), Buồn rầu hại Phế (phổi), Sợ hãi hại Thận, Quá khích hại Tâm (tim mạch).
- Phép dưỡng sinh hàng ngày:
  + Sáng sớm: Uống một cốc nước ấm, hít thở sâu đón ánh bình minh để nạp dương khí.
  + Buổi tối: Buông bỏ công việc trước khi ngủ 1 tiếng, ngâm chân thảo dược nước ấm để dẫn hỏa quy nguyên, ngủ sâu giấc.
  + Mỗi ngày dành 15-20 phút ngồi tĩnh tọa, quan sát hơi thở. Khi Tâm định thì Tuệ sinh, mọi quyết định thương trường và đời sống đều chuẩn xác phi thường!`
  },
  {
    title: 'Nhân Tướng Học: Tướng Tùy Tâm Sinh & Thuật Đổi Vận Tướng',
    category: 'NHAN_TUONG',
    tags: ['Tướng Tùy Tâm Sinh', 'Ánh Mắt', 'Nụ Cười', 'Sắc Diện'],
    content: `Cổ nhân dạy: "Hữu tâm vô tướng, tướng tùy tâm sinh; Hữu tướng vô tâm, tướng tùy tâm diệt" (Có tâm mà chưa có tướng đẹp thì tướng mạo sẽ theo tâm thiện mà sinh ra tướng tốt; Có tướng mạo đẹp mà tâm địa bất hảo thì tướng tốt cũng theo đó mà tiêu biến):
- Đổi vận qua Ánh Mắt: Ánh mắt hiền hòa, đoan chính, không liếc xéo đảo điên sẽ chiêu cảm quý nhân và tạo dựng niềm tin tuyệt đối.
- Đổi vận qua Nụ Cười & Lời Nói: Nụ cười chân thành khởi từ lòng thương người giúp giãn nở cơ mặt, cung Tài Bạch sáng lên; lời nói hòa nhã, ái ngữ đẩy lùi thị phi khẩu nghiệp.`
  },
  {
    title: 'Luận Về Tuổi Hạn: Tam Tai, Kim Lâu, Hoang Ốc Dưới Góc Nhìn Khoa Học',
    category: 'TAM_LINH',
    tags: ['Tam Tai', 'Kim Lâu', 'Hoang Ốc', 'Hóa Giải'],
    content: `Hiểu đúng về các hạn truyền thống để không mê tín dị đoan:
1. Tam Tai (3 năm thử thách liên tiếp theo tam hợp): Là chu kỳ điều chỉnh tự nhiên của cơ thể và sự nghiệp sau 9 năm tăng trưởng. Cần thận trọng, tránh đầu tư mạo hiểm, không nên hoảng loạn.
2. Kim Lâu (1, 3, 6, 8): Tính theo tuổi mụ, thường kiêng kỵ khi dựng vợ gả chồng hoặc xây nhà. Nếu phải làm, có thể mượn tuổi người hợp mệnh có cung tốt đứng tên động thổ.
3. Hoang Ốc (Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc): Chọn tuổi rơi vào Nhất Cát, Nhì Nghi, Tứ Tấn Tài để khởi công làm nhà thuận buồm xuôi gió.`
  },

  // ==========================================
  // NHÓM 6: TRẠCH CÁT & XEM NGÀY TỐT XẤU (6 CHỦ ĐỀ)
  // ==========================================
  {
    title: 'Thập Nhị Kiến Trừ (12 Trực): Bí Quyết Chọn Ngày Cát Khí',
    category: 'XEM_NGAY',
    tags: ['Thập Nhị Kiến Trừ', '12 Trực', 'Trực Khai', 'Trực Mãn'],
    content: `12 Trực là vòng tuần hoàn khí tiết mặt trời qua từng ngày trong tháng:
1. Trực Kiến: Ngày khởi đầu, hợp lập kế hoạch, hội họp.
2. Trực Trừ: Trừ bỏ cái xấu, chữa bệnh, dọn dẹp, tẩy uế.
3. Trực Mãn: Tròn đầy, khai trương, mở cửa hàng, cầu tài.
4. Trực Bình: Cân bằng, san phẳng, tu sửa.
5. Trực Định: Ổn định, đính hôn, ký hợp đồng dài hạn.
6. Trực Chấp: Nắm giữ, gieo trồng, tuyển dụng nhân sự.
7. Trực Phá: Phá dỡ nhà cũ, giải quyết mâu thuẫn tồn đọng.
8. Trực Nguy: Nguy nan, nên cẩn trọng, kiêng đi biển, leo núi.
9. Trực Thành: Thành tựu trọn vẹn, cưới hỏi, nhập trạch, khai trương.
10. Trực Thâu: Thu hoạch tiền bạc, cất giữ của cải, thu nợ.
11. Trực Khai: Mở ra cơ hội mới, xuất hành, khởi công, đăng ký kinh doanh.
12. Trực Bế: Đóng cửa, an nghỉ, kiêng các việc đại sự khởi đầu.`
  },
  {
    title: 'Hệ Thống Giờ Hoàng Đạo & Hắc Đạo Trong Ngày',
    category: 'XEM_NGAY',
    tags: ['Giờ Hoàng Đạo', 'Thanh Long', 'Kim Quỹ', 'Xuất Hành'],
    content: `Mỗi ngày có 12 canh giờ chia làm 6 giờ Hoàng Đạo (tốt) và 6 giờ Hắc Đạo (xấu):
- 6 Giờ Hoàng Đạo: Thanh Long (đại cát), Minh Đường (quý nhân), Kim Quỹ (tài lộc), Kim Đường (hỷ sự), Ngọc Đường (danh vọng), Tư Mệnh (hanh thông mọi việc).
- 6 Giờ Hắc Đạo: Thiên Hình (tranh chấp), Chu Tước (thị phi khẩu thiệt), Bạch Hổ (tai nạn), Thiên Lao (giam hãm), Huyền Vũ (trộm cắp hao tài), Câu Trận (chậm trễ).
Xuất hành hay khai trương nên chọn giờ Hoàng Đạo kết hợp hướng xuất hành Hỷ Thần hoặc Tài Thần để vạn sự đắc thắng.`
  }
];

// Read existing seeded-knowledge.json and merge without duplicates
const SEED_FILE = path.join(process.cwd(), 'src/lib/ai/seeded-knowledge.json');
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
} catch (e) {
  existing = [];
}

const existingTitles = new Set(existing.map((x) => x.title));
const merged = [...existing];

for (const item of KNOWLEDGE_ITEMS) {
  if (!existingTitles.has(item.title)) {
    merged.push(item);
    existingTitles.add(item.title);
  }
}

fs.writeFileSync(SEED_FILE, JSON.stringify(merged, null, 2), 'utf8');
console.log(`✓ Nạp tri thức thành công! Tổng số tài liệu kho tri thức hiện tại: ${merged.length} tài liệu.`);
