// scripts/generate-inquiry-bank.mjs
import fs from 'fs';
import path from 'path';

const INQUIRIES = [
  // ========================================================
  // 1. TÌNH DUYÊN, HÔN NHÂN & GIA ĐẠO (TINH_DUYEN)
  // ========================================================
  {
    id: 'inq_td_01',
    category: 'TINH_DUYEN',
    categoryName: 'Tình Duyên & Hôn Nhân',
    question: 'Bao giờ con mới lấy chồng/lấy vợ? Người phối ngẫu sau này ngoại hình, tính cách và gia thế thế nào?',
    userPersona: 'Người trẻ độc thân 22–32 tuổi, đang bị gia đình hối thúc cưới xin',
    corePainPoint: 'Lo lắng bị ế, sợ muộn duyên, tò mò về chân dung người bạn đời tương lai',
    thayBoiApproach: 'Soi chiếu Cung Phu Thê và Đại Vận 10 năm, xem thời điểm đào hoa kích hoạt (sao Đào Hoa, Hồng Loan, Thiên Hỷ). Luận hình dáng, tính cách bạn đời qua chính tinh đóng ở Phu Thê (Tử Vi, Thiên Phủ, Thái Âm hay Thất Sát, Phá Quân).',
    keyStarsOrSigns: ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ', 'Cung Phu Thê', 'Lưu Đại Vận'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['bao gio lay chong', 'ket hon nam nao', 'tuoi ket hon dep', 'chong tuong lai the nao'],
    suggestedQuestions: [
      'Năm 2026 này con có gặp được ý trung nhân không Thầy?',
      'Cung Phu Thê của con có sao nào chủ về lấy người phương xa không?',
      'Người yêu hiện tại của con có phải là duyên định số kiếp không?'
    ]
  },
  {
    id: 'inq_td_02',
    category: 'TINH_DUYEN',
    categoryName: 'Tình Duyên & Hôn Nhân',
    question: 'Hai tuổi chúng con có phạm Tứ Hành Xung (Dần Thân Tỵ Hợi / Tý Ngọ Mão Dậu) không? Có lấy nhau được không?',
    userPersona: 'Cặp đôi chuẩn bị tiến tới hôn nhân nhưng bị cha mẹ hai bên phản đối vì khắc tuổi',
    corePainPoint: 'Sợ hôn nhân đứt gánh, sợ phạm biệt ly tuyệt mạng, tìm phương án hóa giải để được cưới',
    thayBoiApproach: 'Giải thích khoa học về Tứ Hành Xung (chỉ xung theo cặp đối diện, không phải cả 4 con giáp đều xung nhau). Soi chiếu toàn diện Cung Mệnh, Cung Phi Bát Tự và Ngũ Hành nạp âm. Hướng dẫn chọn năm sinh con hợp mệnh để làm cầu nối hóa giải.',
    keyStarsOrSigns: ['Tứ Hành Xung', 'Lục Xung', 'Cung Phi Bát Tự', 'Hóa Giải Khắc Tuổi'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['tuoi ty ngo khac nhau', 'dan than ty hoi lay nhau duoc khong', 'hoa giai khac tuoi vo chong', 'xem hop tuoi cuoi'],
    suggestedQuestions: [
      'Chúng con mệnh Hỏa và mệnh Kim thì cách hóa giải thế nào?',
      'Chọn ngày giờ đón dâu thế nào để hóa giải xung khắc?',
      'Sinh con năm nào để hòa giải mệnh bố mẹ?'
    ]
  },
  {
    id: 'inq_td_03',
    category: 'TINH_DUYEN',
    categoryName: 'Tình Duyên & Hôn Nhân',
    question: 'Cung Phu Thê có Liêm Trinh, Phá Quân, Cự Môn hoặc Tuần/Triệt thì có phải số hai lần đò không Thầy?',
    userPersona: 'Người từng lận đận tình cảm, hoặc người xem lá số thấy cung Phu Thê có sát tinh lo sợ ly hôn',
    corePainPoint: 'Nỗi ám ảnh về sự đổ vỡ hôn nhân, tự ti và hoang mang về hạnh phúc gia đình',
    thayBoiApproach: 'Phân tích bản chất: Sát tinh ở Phu Thê chỉ biểu thị cá tính mạnh, dễ có xung đột khẩu thiệt, KHÔNG đồng nghĩa 100% phải bỏ nhau. Khuyên giải pháp lấy chồng/vợ muộn hơn (sau 30 tuổi), hoặc cùng nhau tu tâm dưỡng tính, tôn trọng không gian riêng.',
    keyStarsOrSigns: ['Liêm Trinh', 'Phá Quân', 'Cự Môn', 'Tuần Triệt Phu Thê', 'Cô Thần Quả Tú'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['so hai lan do tu vi', 'phu the triet', 'liem pha phu the', 'hoa giai ly hon tu vi'],
    suggestedQuestions: [
      'Lấy chồng muộn có hóa giải được số hai lần đò không Thầy?',
      'Làm lễ giải duyên âm hoặc dâng sao có hết không?',
      'Vợ chồng con nên xưng hô và nhường nhịn thế nào để qua khỏi hạn này?'
    ]
  },
  {
    id: 'inq_td_04',
    category: 'TINH_DUYEN',
    categoryName: 'Tình Duyên & Hôn Nhân',
    question: 'Chồng/người yêu con có tính trăng hoa ngoại tình không? Lá số có dấu hiệu người thứ ba chen chân không?',
    userPersona: 'Phụ nữ đang có nghi ngờ trong mối quan hệ, muốn tìm câu trả lời từ huyền học',
    corePainPoint: 'Mất niềm tin, bất an, sợ bị phản bội và tan vỡ tổ ấm',
    thayBoiApproach: 'Thận trọng trong luận đoán, không gây hoang mang chia rẽ gia đình. Soi các bộ sao đa tình (Tham Lang miếu/hãm, Thiên Diêu, Hóa Kỵ, Mộc Dục, Đào Hoa ngộ Kiếp Không). Hướng dẫn đương số kiểm soát cảm xúc, củng cố sự ấm áp trong gia đình và phong thủy phòng ngủ.',
    keyStarsOrSigns: ['Tham Lang', 'Thiên Diêu', 'Hóa Kỵ', 'Mộc Dục', 'Người Thứ Ba'],
    frequency: 'HIGH',
    searchKeywords: ['sao trang hoa ngoai tinh', 'dau hieu ngoai tinh trong tu vi', 'giu chong phong thuy', 'cung phu the dao hoa'],
    suggestedQuestions: [
      'Gương phòng ngủ đối diện giường có phải nguyên nhân thu hút người thứ ba không?',
      'Làm thế nào để kích hoạt cung Diên Niên hòa hợp vợ chồng?'
    ]
  },

  // ========================================================
  // 2. CÔNG DANH, SỰ NGHIỆP & DOANH NGHIỆP (CONG_DANH)
  // ========================================================
  {
    id: 'inq_cd_01',
    category: 'CONG_DANH',
    categoryName: 'Công Danh & Sự Nghiệp',
    question: 'Năm 2026 này con có nên nhảy việc, chuyển đổi ngành nghề hoặc mở công ty khởi nghiệp riêng không?',
    userPersona: 'Nhân viên công sở 28–42 tuổi đang chán nản công việc cũ hoặc ấp ủ dự án kinh doanh riêng',
    corePainPoint: 'Sợ thất bại khi nghỉ việc, băn khoăn thời điểm chín muồi của vận khí',
    thayBoiApproach: 'Xem Lưu Niên Đại Hạn và Tiểu Hạn năm 2026 (Bính Ngọ), xem cung Quan Lộc và Tài Bạch có sao Lưu Lộc Tồn, Lưu Thái Tuế hay sao Dịch Mã dịch chuyển không. Đưa ra lời khuyên cụ thể về thời điểm tháng tốt trong năm để nộp đơn hoặc đăng ký kinh doanh.',
    keyStarsOrSigns: ['Lưu Dịch Mã', 'Lưu Thái Tuế', 'Cung Quan Lộc', 'Tiểu Hạn 2026'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['co nen nhay viec nam 2026', 'khoi nghiep nam 2026', 'thang nao nhay viec tot', 'xem van han cong danh'],
    suggestedQuestions: [
      'Con hợp làm kinh doanh tự do hay tiếp tục làm công ăn lương an toàn?',
      'Tháng mấy trong năm 2026 khởi sự kinh doanh thì đắc lộc?',
      'Mệnh con hợp mở ngành nghề ẩm thực, công nghệ hay bất động sản?'
    ]
  },
  {
    id: 'inq_cd_02',
    category: 'CONG_DANH',
    categoryName: 'Công Danh & Sự Nghiệp',
    question: 'Tại sao con làm việc chăm chỉ, có năng lực mà mãi không được thăng chức hay công nhận?',
    userPersona: 'Người đi làm lâu năm bị kẹt ở vị trí cấp trung, cảm thấy bị đồng nghiệp chèn ép hoặc sếp bỏ quên',
    corePainPoint: 'Ấm ức, mất phương hướng, nghi ngờ năng lực bản thân, cảm thấy bất công',
    thayBoiApproach: 'Tìm nguyên nhân tại Cung Quan Lộc hoặc Mệnh: Có gặp Tuần/Triệt cản trở khí lực tiền vận không, có sao Ám Tinh Cự Môn, Hóa Kỵ gây thị phi khẩu thiệt, hay Phục Binh ám hại không. Khuyên chuyển hóa cách giao tiếp, nhẫn nại chờ vận chuyển và phong thủy vị trí ngồi làm việc.',
    keyStarsOrSigns: ['Hóa Kỵ Quan Lộc', 'Triệt Lộ', 'Cự Môn', 'Phục Binh', 'Thiên Không'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['tai sao khong duoc thang chuc', 'hoa giai tieu nhan ham hai', 'sao hoa ky o quan loc', 'phong thuy ban lam viec'],
    suggestedQuestions: [
      'Bàn làm việc của con ngồi quay lưng ra cửa sổ có phải phong thủy xấu không?',
      'Đặt vật phẩm phong thủy gì trên bàn để hóa giải tiểu nhân hãm hại?'
    ]
  },
  {
    id: 'inq_cd_03',
    category: 'CONG_DANH',
    categoryName: 'Công Danh & Sự Nghiệp',
    question: 'Con nên chọn đối tác làm ăn tuổi nào để hợp tác kinh doanh đại thắng, tránh bị lừa gạt?',
    userPersona: 'Chủ doanh nghiệp, nhà sáng lập đang tìm kiếm cổ đông, giám đốc điều hành hoặc đối tác chiến lược',
    corePainPoint: 'Sợ hợp tác gãy gánh, mất tiền mất bạn, bị lừa đảo phản bội',
    thayBoiApproach: 'Phân tích Tam Hợp (Dần Ngọ Tuất, Thân Tý Thìn, Hợi Mão Mùi, Tỵ Dậu Sửu) và Lục Hợp Địa Chi. Đối chiếu Cung Nô Bộc trên lá số: xem có sao Hung (Không Kiếp, Phục Binh, Kiếp Sát) không. Đưa ra nguyên tắc: "Hợp tuổi là phụ, hợp đạo đức và minh bạch pháp lý mới là trường cửu".',
    keyStarsOrSigns: ['Tam Hợp', 'Lục Hợp', 'Cung Nô Bộc', 'Phục Binh', 'Không Kiếp'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['chon tuoi hop tac lam an', 'tuoi nao hop mo cong ty', 'cung no boc tu vi', 'tranh bi doi tac lua'],
    suggestedQuestions: [
      'Người mệnh Thủy và người mệnh Hỏa làm ăn chung thì chia việc thế nào?',
      'Hợp đồng kinh doanh nên để ai đứng tên đại diện pháp luật?'
    ]
  },

  // ========================================================
  // 3. TÀI LỘC, ĐẦU TƯ & DÒNG TIỀN (TAI_LOC)
  // ========================================================
  {
    id: 'inq_tl_01',
    category: 'TAI_LOC',
    categoryName: 'Tài Lộc & Đầu Tư',
    question: 'Cả đời con có giàu có lớn không? Con có số trúng số, hưởng lộc bất ngờ hay phải tự tay làm nên?',
    userPersona: 'Đông đảo người xem bói ở mọi lứa tuổi tò mò về mức độ giàu sang của bản thân',
    corePainPoint: 'Khát khao tự do tài chính, muốn biết trước tiền đồ giàu nghèo để phấn đấu',
    thayBoiApproach: 'Xem Cung Tài Bạch, Mệnh và Phúc Đức: Phân định cách cục "Tự lực cánh sinh" (Vũ Khúc, Thất Sát, Thiên Tướng) hay "Thiên tài hoạch phát" (Tham Lang ngộ Hỏa Tinh/Linh Tinh - Hỏa Tham bộc phát). Khuyên hướng đi chân chính, không mơ mộng cờ bạc làm giàu nhanh.',
    keyStarsOrSigns: ['Vũ Khúc', 'Hóa Lộc', 'Lộc Tồn', 'Hỏa Tham Cách', 'Cung Tài Bạch'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['so giau co trong tu vi', 'la so phu gia dich quoc', 'hoa tham cach phat tai', 'cung tai bach giau'],
    suggestedQuestions: [
      'Mệnh của con giữ tiền bằng cách mua đất hay gửi ngân hàng thì tụ tài?',
      'Cách cục Hỏa Tham của con phát vào năm nào?'
    ]
  },
  {
    id: 'inq_tl_02',
    category: 'TAI_LOC',
    categoryName: 'Tài Lộc & Đầu Tư',
    question: 'Tại sao con kiếm được nhiều tiền mà không giữ được, tiền vào cửa trước lại ra cửa sau?',
    userPersona: 'Người có thu nhập tốt (chủ shop, chuyên viên, freelancer) nhưng cuối năm tích lũy bằng không',
    corePainPoint: 'Hoang mang vì hao tài liên tục, xe hỏng, người ốm, chi tiêu ngoài dự tính',
    thayBoiApproach: 'Chỉ rõ vị trí của cặp sao Đại Hao và Tiểu Hao (Song Hao) tại Mệnh hoặc Tài Bạch. Người có Song Hao là người phóng khoáng, thích chi tiêu. Phương pháp hóa giải triệt để nhất: "Chủ động chi tiền vào tài sản cố định" (mua đất, mua vàng, mua bảo hiểm) trước khi tiền mặt bốc hơi.',
    keyStarsOrSigns: ['Đại Hao', 'Tiểu Hao', 'Song Hao', 'Không Kiếp Tài Bạch', 'Hao Tài'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['tai sao khong giu duoc tien', 'song hao o tai bach', 'cach hoa giai hao tai', 'phong thuy giu tien'],
    suggestedQuestions: [
      'Đặt két sắt hướng nào để khóa tài khí không bị hao hụt?',
      'Người có Song Hao làm nghề kinh doanh thương mại có thuận lợi không?'
    ]
  },
  {
    id: 'inq_tl_03',
    category: 'TAI_LOC',
    categoryName: 'Tài Lộc & Đầu Tư',
    question: 'Năm 2026 này con có lộc mua đất, xây nhà hay đầu tư bất động sản không?',
    userPersona: 'Nhà đầu tư cá nhân, gia đình đang tích lũy tiền muốn mua nhà an cư hoặc gom đất sinh lời',
    corePainPoint: 'Sợ đu đỉnh bất động sản, sợ vướng quy hoạch tranh chấp pháp lý',
    thayBoiApproach: 'Soi chiếu Cung Điền Trạch và sao Lưu hạn năm 2026: Xem có các sao Thái Âm (Đất đai), Thiên Phủ (Kho tàng), Hóa Lộc, Thanh Long hội tụ không. Cảnh báo nếu gặp Tuần/Triệt Điền Trạch hoặc sao Thiên Hình thì phải soi kỹ sổ đỏ, quy hoạch.',
    keyStarsOrSigns: ['Cung Điền Trạch', 'Thái Âm', 'Hóa Lộc Điền Trạch', 'Hạn Mua Nhà 2026'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['nam 2026 co nen mua nha', 'xem han mua dat tu vi', 'cung dien trach dep', 'sao thai am mua dat'],
    suggestedQuestions: [
      'Vay ngân hàng mua nhà năm 2026 có áp lực nợ nần không Thầy?',
      'Hướng nhà nào hợp cung mệnh của con nhất?'
    ]
  },

  // ========================================================
  // 4. VẬN HẠN NĂM 2026, TAM TAI, KIM LÂU (VAN_HAN)
  // ========================================================
  {
    id: 'inq_vh_01',
    category: 'VAN_HAN',
    categoryName: 'Vận Hạn Năm Hiện Tại',
    question: 'Năm 2026 (Bính Ngọ) tuổi nào phạm Tam Tai? Hạn Tam Tai có nguy hiểm chết người như lời đồn không?',
    userPersona: 'Người thuộc nhóm tuổi Thân - Tý - Thìn (năm thứ 3 Tam Tai) đang vô cùng bất an',
    corePainPoint: 'Nỗi sợ hãi do nghe các tin đồn tiêu cực trên mạng về tai nạn, phá sản',
    thayBoiApproach: 'Lý giải khoa học: Tam Tai là chu kỳ biến đổi sinh học và thời vận 3 năm liên tiếp sau 9 năm tăng trưởng. Năm 2026 là năm Tam Tai cuối (năm phục hồi) của tuổi Thân - Tý - Thìn. Khuyên kiêng kỵ kết thúc việc lớn đột ngột, giữ tâm bình thản, làm từ thiện phóng sinh giải nghiệp.',
    keyStarsOrSigns: ['Tam Tai 2026', 'Thân Tý Thìn', 'Hóa Giải Tam Tai', 'Hạn Năm Bính Ngọ'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['nam 2026 tuoi nao tam tai', 'hoa giai tam tai 2026', 'tam tai co chet nguoi khong', 'cung tam tai the nao'],
    suggestedQuestions: [
      'Làm lễ cúng Tam Tai ở đâu hay cúng tại nhà thì đúng phép?',
      'Năm cuối Tam Tai có được cưới xin hay mở rộng kinh doanh không?'
    ]
  },
  {
    id: 'inq_vh_02',
    category: 'VAN_HAN',
    categoryName: 'Vận Hạn Năm Hiện Tại',
    question: 'Năm nay con bị sao Thái Bạch (Thái Bạch sạch cửa nhà), Kế Đô hoặc La Hầu chiếu mệnh thì làm sao để tai qua nạn khỏi?',
    userPersona: 'Người xem bảng Sao Cửu Diệu đầu năm thấy gặp hung tinh, sợ mất sạch tiền của',
    corePainPoint: 'Hoang mang về câu ca dao "Thái Bạch quét sạch cửa nhà", sợ ốm đau bệnh tật',
    thayBoiApproach: 'Phân tích bản chất: Sao Thái Bạch thuộc hành Kim, nếu biết "chủ động xuất tiền" làm việc thiện, mua sắm đồ dùng gia đình hoặc đầu tư tài sản thì biến thế hao tài thành thế đắc lộc. Kế Đô, La Hầu kỵ nhất thị phi khẩu nghiệp, khuyên bớt nói lời cay đắng, giữ tâm thanh tịnh thì vạn sự an.',
    keyStarsOrSigns: ['Sao Thái Bạch', 'Sao Kế Đô', 'Sao La Hầu', 'Sao Cửu Diệu', 'Hóa Giải Sao'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['sao thai bach 2026', 'sao ke do chieu menh', 'sao la hau hoa giai', 'cung sao giai han dau nam'],
    suggestedQuestions: [
      'Có nhất thiết phải đi chùa làm lễ dâng sao giải hạn tốn tiền triệu không?',
      'Tháng mấy là tháng xấu nhất của sao Thái Bạch?'
    ]
  },
  {
    id: 'inq_vh_03',
    category: 'VAN_HAN',
    categoryName: 'Vận Hạn Năm Hiện Tại',
    question: 'Năm 2026 này tuổi con có làm nhà được không? Có phạm Kim Lâu, Hoang Ốc hay Tam Tai không?',
    userPersona: 'Gia chủ đang có kế hoạch khởi công xây nhà trong năm 2026',
    corePainPoint: 'Sợ xây nhà xong gặp đại hạn chết chóc, phá sản như lời đồn dân gian',
    thayBoiApproach: 'Tính toán chuẩn xác 3 yếu tố: Tam Tai, Kim Lâu (1, 3, 6, 8 tuổi mụ) và Hoang Ốc (Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc). Nếu phạm tuổi, hướng dẫn thủ tục "Mượn tuổi làm nhà" chuẩn mực tâm linh từ người thân hợp tuổi.',
    keyStarsOrSigns: ['Tuổi Xây Nhà 2026', 'Kim Lâu', 'Hoang Ốc', 'Mượn Tuổi Làm Nhà'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['tuoi lam nha nam 2026', 'pham kim lau co xay nha duoc khong', 'thu tuc muon tuoi lam nha', 'hoang oc 2026'],
    suggestedQuestions: [
      'Mượn tuổi làm nhà thì chuộc nhà lại vào thời điểm nào?',
      'Tháng nào năm 2026 động thổ xây nhà tốt nhất?'
    ]
  },

  // ========================================================
  // 5. GIA ĐẠO, CON CÁI & TỔ TIÊN (GIA_DAO_CON_CAI)
  // ========================================================
  {
    id: 'inq_gd_01',
    category: 'GIA_DAO_CON_CAI',
    categoryName: 'Gia Đạo & Con Cái',
    question: 'Cung Tử Tức của con thế nào? Con cái sau này có thông minh, đỗ đạt và hiếu thảo không?',
    userPersona: 'Cha mẹ quan tâm đến tương lai, học hành thi cử và tính cách của con cái',
    corePainPoint: 'Lo lắng con cái ngỗ nghịch, học hành sa sút, sau này không nhờ cậy được',
    thayBoiApproach: 'Xem Cung Tử Tức: Gặp cát tinh (Xương Khúc, Khôi Việt, Tả Hữu, Hóa Khoa) con cái học hành đỗ đạt cao, hiếu kính. Nếu gặp sát tinh (Kình Đà, Không Kiếp, Hóa Kỵ) khuyên cha mẹ không nên áp đặt kỳ vọng quá mức, học cách làm bạn cùng con và tôn trọng sự khác biệt của trẻ.',
    keyStarsOrSigns: ['Cung Tử Tức', 'Văn Xương', 'Văn Khúc', 'Hóa Khoa', 'Khôi Việt'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['xem cung tu tuc tu vi', 'con cai co hieu thao khong', 'so con do dat', 'tu tuc triet'],
    suggestedQuestions: [
      'Cung Tử Tức gặp Triệt có phải muộn con hoặc hiếm muộn không Thầy?',
      'Con gái con hợp ngành y dược hay sư phạm kinh tế?'
    ]
  },
  {
    id: 'inq_gd_02',
    category: 'GIA_DAO_CON_CAI',
    categoryName: 'Gia Đạo & Con Cái',
    question: 'Mồ mả gia tiên và âm phần dòng họ có yên ổn không? Có dấu hiệu bị động mồ động mả làm con cháu lụn bại không?',
    userPersona: 'Gia đình trung niên gặp nhiều biến cố liên tiếp (ốm đau, làm ăn thua lỗ) nghi ngờ do âm phần',
    corePainPoint: 'Bất an về tổ tiên, sợ bị quở phạt, muốn tìm cách tu sửa mồ mả đúng phong thủy',
    thayBoiApproach: 'Xem Cung Phúc Đức và sao Thái Âm (mẹ/bên ngoại), Thái Dương (cha/bên nội), Thiên Cơ, Tả Hữu. Khuyên con cháu trước hết phải giữ đạo hiếu, chăm sóc từ đường sạch sẽ, thăm viếng ngày giỗ tiết Thanh Minh. Tuyệt đối không mê tín đào bới tùy tiện kẻo phạm sát khí.',
    keyStarsOrSigns: ['Cung Phúc Đức', 'Âm Phần', 'Mồ Mả Tổ Tiên', 'Động Mồ Mả'],
    frequency: 'HIGH',
    searchKeywords: ['xem mo ma qua tu vi', 'cung phuc duc dep', 'dau hieu dong mo ma', 'phuc duc to tien'],
    suggestedQuestions: [
      'Tu sửa lăng mộ gia tiên nên chọn ngày giờ tiết khí nào?',
      'Cung Phúc Đức có Thiên Đồng thì phúc ấm tổ tiên thế nào?'
    ]
  },

  // ========================================================
  // 6. PHONG THỦY BÁT TRẠCH & BỐ TRÍ KHÔNG GIAN (PHONG_THUY)
  // ========================================================
  {
    id: 'inq_pt_01',
    category: 'PHONG_THUY',
    categoryName: 'Phong Thủy Bát Trạch',
    question: 'Tôi thuộc Đông Tứ Mệnh hay Tây Tứ Mệnh? Chọn hướng nhà và hướng bếp thế nào để tài lộc đại vượng?',
    userPersona: 'Người đang mua căn hộ, xây nhà hoặc thuê văn phòng kinh doanh',
    corePainPoint: 'Sợ mua nhầm hướng Tuyệt Mệnh, Ngũ Quỷ gây tiêu tán tài sản',
    thayBoiApproach: 'Tính toán Cung Phi Bát Tự theo năm sinh chuẩn xác (Nam/Nữ khác nhau). Phân loại 4 hướng Cát (Sinh Khí, Diên Niên, Thiên Y, Phục Vị) và 4 hướng Hung. Chỉ rõ nguyên tắc Bếp "Tọa hung hướng cát" để thiêu rụi tà khí và đón cát khí.',
    keyStarsOrSigns: ['Cung Phi Bát Trạch', 'Đông Tứ Mệnh', 'Tây Tứ Mệnh', 'Hướng Bếp'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['tinh cung phi bat tu', 'dong tu menh tay tu menh', 'huong nha hop tuoi', 'dat bep toa hung huong cat'],
    suggestedQuestions: [
      'Chồng Đông Tứ Mệnh vợ Tây Tứ Mệnh thì chọn hướng nhà theo ai?',
      'Căn hộ chung cư tính hướng nhà theo hướng cửa chính hay ban công?'
    ]
  },
  {
    id: 'inq_pt_02',
    category: 'PHONG_THUY',
    categoryName: 'Phong Thủy Bát Trạch',
    question: 'Ban thờ Thần Tài – Ông Địa đặt ở đâu và bài trí thế nào để kinh doanh buôn bán tấp nập khách hàng?',
    userPersona: 'Chủ cửa hàng, nhà hàng, công ty thương mại kinh doanh buôn bán',
    corePainPoint: 'Kinh doanh ế ẩm, sợ thờ cúng sai cách phạm thần linh làm mất lộc',
    thayBoiApproach: 'Hướng dẫn chuẩn phong thủy: Đặt dưới đất nơi góc chéo cửa ra vào (Cung Tài Lộc), lưng tựa vững chãi, hướng nhìn ra cửa đón khách. Bài trí ngũ quả, hũ muối gạo nước, bát hương sạch sẽ. Nhấn mạnh: "Tâm chân thành và bán hàng uy tín là phong thủy chiêu tài mạnh nhất".',
    keyStarsOrSigns: ['Ban Thờ Thần Tài', 'Chiêu Tài Hút Lộc', 'Phong Thủy Cửa Hàng'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['vi tri dat ban tho than tai', 'cach bai tri ban tho than tai', 'cung than tai dung cach', 'chieu tai phong thuy'],
    suggestedQuestions: [
      'Thay bát hương Thần Tài vào ngày nào trong năm?',
      'Có nên đặt cóc ngậm tiền (Thiềm Thừ) và Tỳ Hưu trên ban Thần Tài không?'
    ]
  },

  // ========================================================
  // 7. TÂM LINH, NHÂN QUẢ & TU TÂM CẢI MỆNH (TAM_LINH_GIAI_HAN)
  // ========================================================
  {
    id: 'inq_tlgh_01',
    category: 'TAM_LINH_GIAI_HAN',
    categoryName: 'Tâm Linh & Tu Tâm Cải Mệnh',
    question: 'Lá số của con xấu quá, toàn sao hãm địa và sát tinh. Số phận con có thể thay đổi được không Thầy?',
    userPersona: 'Người vừa đi xem bói về bị phán số xấu, tâm trạng u ám, bi quan, tuyệt vọng',
    corePainPoint: 'Nỗi tuyệt vọng vì tin rằng số mệnh đã bị trói buộc cố định, không lối thoát',
    thayBoiApproach: 'Khai sáng tư duy: "Lá số chỉ là dự báo thời tiết, người quyết định mang ô hay mặc áo mưa là chính con". Giảng dạy câu chuyện Liễu Phàm Tứ Huấn và đạo lý "Đức năng thắng số". Hướng dẫn 3 phương pháp cải mệnh thực tế: Sửa đổi tính nết (Ý nghiệp), Giúp đỡ người khó khăn (Thân nghiệp), Ái ngữ động viên người khác (Khẩu nghiệp).',
    keyStarsOrSigns: ['Đức Năng Thắng Số', 'Liễu Phàm Tứ Huấn', 'Cải Biến Vận Mệnh', 'Tu Tâm'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['la so tu vi xau phai lam sao', 'co thay doi duoc so phan khong', 'duc nang thang so la gi', 'phuong phap cai menh'],
    suggestedQuestions: [
      'Phóng sinh và làm từ thiện có thực sự hóa giải được nghiệp xấu không Thầy?',
      'Cách nào để giữ tâm bình thản khi cuộc đời liên tục gặp nghịch cảnh?'
    ]
  },
  {
    id: 'inq_tlgh_02',
    category: 'TAM_LINH_GIAI_HAN',
    categoryName: 'Tâm Linh & Tu Tâm Cải Mệnh',
    question: 'Có vong theo hay duyên âm cản trở đường tình duyên của con không? Có nên cắt duyên âm không?',
    userPersona: 'Phụ nữ lận đận tình cảm nhiều năm, nghe người ngoài dọa có tiền duyên theo quấy phá',
    corePainPoint: 'Sợ hãi thế giới vô hình, mất tiền oan cho các thầy mo làm lễ cắt duyên lừa đảo',
    thayBoiApproach: 'Bác bỏ mê tín dị đoan thương mại hóa. Giải thích: Duyên lận đận phần lớn do tính cách khép kín, tiêu chuẩn quá cao hoặc chưa mở rộng môi trường giao tiếp. Nếu có duyên âm (người thân đã khuất yêu thương che chở), chỉ cần làm việc phước thiện hồi hướng cho họ, tuyệt đối không làm bùa ngải xua đuổi.',
    keyStarsOrSigns: ['Duyên Âm', 'Cắt Duyên Âm', 'Hồi Hướng Phước Đức', 'Mê Tín Dị Đoan'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['co nen cat duyen am', 'dau hieu co vong theo', 'duyen am can tro tinh duyen', 'hoi huong phuoc duc'],
    suggestedQuestions: [
      'Làm lễ cầu siêu và phóng sinh hồi hướng thế nào cho đúng chính pháp?',
      'Làm sao để nhận biết tình duyên lận đận là do tâm lý hay số mệnh?'
    ]
  }
];

const TARGET_FILE = path.join(process.cwd(), 'src/lib/ai/customer-inquiry-bank.json');
fs.writeFileSync(TARGET_FILE, JSON.stringify(INQUIRIES, null, 2), 'utf8');
console.log(`✓ Đã tạo thành công Customer Inquiry Bank với ${INQUIRIES.length} câu hỏi thị trường chuyên sâu!`);
