// scripts/generate-full-12-palaces-bank.mjs
import fs from 'fs';
import path from 'path';

const FULL_INQUIRIES = [
  // ========================================================
  // 1. CUNG MỆNH (Bản Thân, Tính Cách, Căn Số, Định Mệnh)
  // ========================================================
  {
    id: 'inq_menh_01',
    category: 'CUNG_MENH',
    categoryName: 'Cung Mệnh (Bản Thân & Định Mệnh)',
    cungTen: 'Mệnh',
    question: 'Mệnh của con là Vô Chính Diệu (không có chính tinh tọa thủ) thì có phải số khổ, đoản thọ, cả đời chìm nổi không?',
    userPersona: 'Người xem lá số thấy cung Mệnh trống, hoang mang sợ cuộc đời không có chỗ dựa',
    corePainPoint: 'Tự ti về số mệnh, sợ cuộc đời vô định, sợ chết yểu hoặc không làm nên trò trống gì',
    thayBoiApproach: 'Phá bỏ định kiến: Mệnh Vô Chính Diệu ví như mảnh đất màu mỡ chưa xây nhà, đắc Tam Không (Tuần, Triệt, Thiên Không, Địa Không) hoặc đắc Nhật Nguyệt chiếu hư không thì phát dã như lôi, thông minh kiệt xuất, tùy thời ứng biến cực kỳ tài tình.',
    keyStarsOrSigns: ['Mệnh Vô Chính Diệu', 'Đắc Tam Không', 'Nhật Nguyệt Chiếu', 'Tuần Triệt Mệnh'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['menh vo chinh dieu tot hay xau', 'menh vo chinh dieu dac tam khong', 'menh vo chinh dieu doan tho khong'],
    suggestedQuestions: ['Mệnh Vô Chính Diệu nên làm nghề tự do hay công chức?']
  },
  {
    id: 'inq_menh_02',
    category: 'CUNG_MENH',
    categoryName: 'Cung Mệnh (Bản Thân & Định Mệnh)',
    cungTen: 'Mệnh',
    question: 'Mệnh của con có sao nào chủ về "Căn Đồng Số Lính", có duyên tu hành, giác quan thứ 6 hay làm thầy tâm linh không?',
    userPersona: 'Người hay nằm mơ kỳ lạ, có linh cảm nhạy bén hoặc đi xem bói bị phán phải mở phủ lập điện',
    corePainPoint: 'Hoang mang sợ bị hành căn, sợ không hầu đồng thì gặp hoạn nạn bệnh tật',
    thayBoiApproach: 'Xem các sao tâm linh: Thiên Khôi, Thiên Việt, Thiên Đồng, Tham Lang, Thiên Riêu, Hóa Kỵ, Hoa Cái, Giải Thần. Khuyên hiểu đúng về "Căn số": Căn chính là hạt giống thiện lương từ tiền kiếp, tốt nhất là tu tâm dưỡng tính tại gia, hiếu kính mẹ cha, không cần tốn tiền triệu mở phủ theo lời thầy mo.',
    keyStarsOrSigns: ['Căn Đồng Số Lính', 'Hoa Cái', 'Thiên Riêu', 'Giác Quan Thứ Sáu', 'Căn Tu'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['dau hieu co can dong so linh tu vi', 'sao chu ve tam linh tu vi', 'can tu hanh trong tu vi'],
    suggestedQuestions: ['Có phải ai có sao Hoa Cái cũng phải hầu đồng không Thầy?']
  },
  {
    id: 'inq_menh_03',
    category: 'CUNG_MENH',
    categoryName: 'Cung Mệnh (Bản Thân & Định Mệnh)',
    cungTen: 'Mệnh',
    question: 'Mệnh có Địa Không, Địa Kiếp hoặc Kình Dương, Đà La hãm địa thì cả đời có lúc nào vươn lên giàu có được không?',
    userPersona: 'Người có sát tinh đóng ở Mệnh, gặp nhiều sóng gió trắc trở trong cuộc sống',
    corePainPoint: 'Cảm giác số phận bất công, nản chí muốn buông xuôi vì liên tục gặp tai ương',
    thayBoiApproach: 'Phân tích bản chất: Sát tinh là thanh bảo kiếm sắc bén. Người có Không Kiếp, Kình Đà là người can đảm, dám nghĩ dám làm, có tư duy đột phá. Nếu biết hướng vào kinh doanh mạo hiểm, công nghệ, cứu nạn hoặc làm việc thiện thì biến nghịch cảnh thành đại nghiệp.',
    keyStarsOrSigns: ['Không Kiếp Đắc Địa', 'Kình Dương Cung Mệnh', 'Đà La Hãm Địa', 'Nghịch Cảnh Thành Tài'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['khong kiep o menh co giau duoc khong', 'kinh duong doc toa menh', 'hoa giai sat tinh cung menh'],
    suggestedQuestions: ['Kình Dương đắc địa ở Thìn Tuất Sửu Mùi phát như thế nào?']
  },

  // ========================================================
  // 2. CUNG PHỤ MẪU (Cha Mẹ, Mối Quan Hệ, Hiếu Đạo)
  // ========================================================
  {
    id: 'inq_pm_01',
    category: 'CUNG_PHU_MAU',
    categoryName: 'Cung Phụ Mẫu (Cha Mẹ & Hiếu Nghĩa)',
    cungTen: 'Phụ Mẫu',
    question: 'Con có khắc tuổi cha mẹ không? Cung Phụ Mẫu có sao nào báo hiệu cha mẹ ly tán hoặc bất hòa không?',
    userPersona: 'Người con hay cãi vã với bố mẹ, cảm thấy không tìm được tiếng nói chung trong gia đình',
    corePainPoint: 'Cảm giác tội lỗi vì bất hiếu nhưng không kiềm chế được mâu thuẫn thế hệ',
    thayBoiApproach: 'Xem Cung Phụ Mẫu có Thái Dương (cha), Thái Âm (mẹ), Hóa Kỵ hay Cự Môn không. Giải thích: "Khắc tuổi thực chất là sự khác biệt về trường năng lượng và tư duy". Khuyên người con nên tập lắng nghe, nhường nhịn, nếu quá xung khắc có thể ở riêng hoặc lập nghiệp xa để giữ trọn đạo hiếu.',
    keyStarsOrSigns: ['Thái Dương Cung Phụ Mẫu', 'Thái Âm', 'Hóa Kỵ Phụ Mẫu', 'Khắc Cha Mẹ'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['cung phu mau tu vi khac cha me', 'thai duong thai am phu mau', 'hoa giai khac tuoi bo me'],
    suggestedQuestions: ['Ở riêng có giúp cha mẹ sống thọ và hòa hợp hơn không Thầy?']
  },
  {
    id: 'inq_pm_02',
    category: 'CUNG_PHU_MAU',
    categoryName: 'Cung Phụ Mẫu (Cha Mẹ & Hiếu Nghĩa)',
    cungTen: 'Phụ Mẫu',
    question: 'Con có được hưởng phúc phần hay di sản, nhà đất cha mẹ để lại không hay phải tự lực cánh sinh 100%?',
    userPersona: 'Người trẻ đang lập nghiệp tò mò về sự hậu thuẫn tài chính từ gia đình',
    corePainPoint: 'Muốn biết có được dựa dẫm kinh tế gia đình hay phải tự bươn chải',
    thayBoiApproach: 'Xem Cung Phụ Mẫu hội tụ Cát tinh (Thiên Phủ, Hóa Lộc, Lộc Tồn, Tả Hữu) thì được cha mẹ để lại của cải dồi dào, cơ nghiệp vững chắc. Nếu gặp Tuần/Triệt hoặc Song Hao, Kình Đà thì là số tự thân lập nghiệp, không nên trông chờ ỷ lại.',
    keyStarsOrSigns: ['Phụ Mẫu Hóa Lộc', 'Triệt Phụ Mẫu', 'Thừa Kế Tài Sản', 'Tự Thân Vận Động'],
    frequency: 'HIGH',
    searchKeywords: ['so duoc thua ke dat dai tu vi', 'cung phu mau giau co', 'tu than lap nghiep tu vi'],
    suggestedQuestions: ['Phụ Mẫu gặp Triệt có phải nên nhận cha mẹ nuôi không?']
  },

  // ========================================================
  // 3. CUNG PHÚC ĐỨC (Âm Phần, Tổ Tiên, Phúc Nghiệp Dòng Họ)
  // ========================================================
  {
    id: 'inq_pd_01',
    category: 'CUNG_PHUC_DUC',
    categoryName: 'Cung Phúc Đức (Tổ Tiên & Phúc Nghiệp)',
    cungTen: 'Phúc Đức',
    question: 'Cung Phúc Đức của con có đẹp không? Dòng họ có ai làm quan hiển đạt, và âm phần mồ mả có trợ lực cho con không?',
    userPersona: 'Người tin vào tâm linh gia tiên, muốn biết phúc ấm dòng tộc của mình',
    corePainPoint: 'Băn khoăn về phúc phần của tổ tiên, muốn biết tại sao gia tộc có giai đoạn sa sút',
    thayBoiApproach: 'Cung Phúc Đức là gốc rễ của 11 cung còn lại. Có Thiên Đồng (phúc tinh), Thiên Lương (ấm tinh), Tử Phủ Vũ Tham miếu địa thì phúc tổ tiên dày vô lượng, con cháu đi đâu cũng gặp may mắn. Nếu có sao hãm, khuyên con cháu tích cực chăm lo mồ mả từ đường và năng làm việc thiện hồi hướng.',
    keyStarsOrSigns: ['Thiên Đồng Phúc Đức', 'Vũ Tham Cư Phúc', 'Âm Phần Gia Tiên', 'Phúc Lộc Dòng Họ'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['cung phuc duc dep nhat la sao gi', 'phuc duc to tien tu vi', 'mo ma to tien gia ho'],
    suggestedQuestions: ['Thân cư Phúc Đức ảnh hưởng đến hậu vận thế nào?']
  },
  {
    id: 'inq_pd_02',
    category: 'CUNG_PHUC_DUC',
    categoryName: 'Cung Phúc Đức (Tổ Tiên & Phúc Nghiệp)',
    cungTen: 'Phúc Đức',
    question: 'Thân cư Phúc Đức có ý nghĩa gì? Cuộc đời của con có phải luôn gắn liền với họ hàng dòng tộc và việc tâm linh không?',
    userPersona: 'Người có lá số Thân cư Phúc Đức bước vào độ tuổi trung niên 32+',
    corePainPoint: 'Cảm thấy luôn phải gánh vác việc gia đình nội ngoại, tâm tư nặng gánh chuyện tâm linh',
    thayBoiApproach: 'Luận giải: Thân cư Phúc Đức là người sống tình cảm, coi trọng nguồn cội, hậu vận phụ thuộc 100% vào phúc đức tự tạo và phúc ấm tổ tiên. Càng chăm lo mồ mả tổ tiên, hiếu thảo mẹ cha thì sự nghiệp hậu vận càng rực rỡ.',
    keyStarsOrSigns: ['Thân Cư Phúc Đức', 'Hậu Vận Cuộc Đời', 'Gia Tộc Họ Hàng'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['than cu phuc duc tot hay xau', 'y nghia than cu phuc duc', 'hau van than cu phuc'],
    suggestedQuestions: ['Thân cư Phúc Đức có Vũ Khúc Tham Lang miếu thì giàu mức nào?']
  },

  // ========================================================
  // 4. CUNG ĐIỀN TRẠCH (Nhà Cửa, Đất Đai, Bất Động Sản)
  // ========================================================
  {
    id: 'inq_dt_01',
    category: 'CUNG_DIEN_TRACH',
    categoryName: 'Cung Điền Trạch (Nhà Cửa & Bất Động Sản)',
    cungTen: 'Điền Trạch',
    question: 'Cả đời con có duyên với đất đai không? Con có mua được nhà riêng hay phải đi ở trọ, ở nhờ suốt đời?',
    userPersona: 'Người trẻ hoặc người lao động đang đi thuê trọ, khao khát có một mái nhà an cư',
    corePainPoint: 'Áp lực giá nhà đất quá cao, sợ không bao giờ mua nổi nhà ở thành phố',
    thayBoiApproach: 'Soi Cung Điền Trạch: Xem có Thái Âm (chủ điền sản), Thiên Phủ (ngân kho), Hóa Lộc, Lộc Tồn, Vũ Khúc không. Nếu gặp Triệt hoặc Song Hao tiền vận thì trước 35 tuổi hay đổi chỗ ở, từ trung vận tích lũy tiền mua được nhà đất đàng hoàng.',
    keyStarsOrSigns: ['Thái Âm Điền Trạch', 'Thiên Phủ', 'Hóa Lộc Điền Sản', 'Triệt Cung Điền'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['cung dien trach co nha dat khong', 'bao gio mua duoc nha tu vi', 'so co nhieu nha dat tu vi'],
    suggestedQuestions: ['Năm nào là năm con có lộc mua đất làm nhà?']
  },
  {
    id: 'inq_dt_02',
    category: 'CUNG_DIEN_TRACH',
    categoryName: 'Cung Điền Trạch (Nhà Cửa & Bất Động Sản)',
    cungTen: 'Điền Trạch',
    question: 'Con có số làm "trùm bất động sản", buôn đất lãi lớn không hay đụng vào đất đai là dính quy hoạch kiện tụng?',
    userPersona: 'Nhà đầu tư bất động sản cá nhân muốn biết bản mệnh có duyên với nghề môi giới/đầu tư đất',
    corePainPoint: 'Sợ mua phải đất tranh chấp, đất quy hoạch, bị chôn vốn phá sản',
    thayBoiApproach: 'Soi bộ sao buôn đất cự phú: Thái Âm miếu vượng ngộ Lộc Tồn/Hóa Lộc, Tử Vi Cư Ngọ chiếu Điền, Thiên Khôi Thiên Việt. Cảnh báo nếu Điền Trạch có Thiên Hình, Kình Dương, Hóa Kỵ thì giấy tờ mua bán phải kiểm tra pháp lý 100%, không mua đất giấy tay.',
    keyStarsOrSigns: ['Thái Âm Miếu Địa', 'Thiên Hình Điền Trạch', 'Tranh Chấp Đất Đai', 'Buôn Đất Đại Phú'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['so buon bat dong san giau tu vi', 'la so co duyen voi dat dai', 'tranh chap dat dai trong tu vi'],
    suggestedQuestions: ['Điền Trạch có Cự Môn có bị hàng xóm kiện tụng ranh giới không?']
  },

  // ========================================================
  // 5. CUNG QUAN LỘC (Công Danh, Chức Vụ, Sự Nghiệp, Nghề Nghiệp)
  // ========================================================
  {
    id: 'inq_ql_01',
    category: 'CUNG_QUAN_LOC',
    categoryName: 'Cung Quan Lộc (Sự Nghiệp & Công Danh)',
    cungTen: 'Quan Lộc',
    question: 'Con hợp với ngành nghề gì nhất theo lá số? Nên làm công chức nhà nước, làm chuyên môn kỹ thuật hay kinh doanh buôn bán?',
    userPersona: 'Học sinh, sinh viên mới ra trường hoặc người 25-30 tuổi đang mất phương hướng nghề nghiệp',
    corePainPoint: 'Làm việc không thấy vui, không phát huy được thế mạnh, thu nhập bấp bênh',
    thayBoiApproach: 'Phân tích ngũ hành bản mệnh phối với Cung Quan Lộc: Sao Thái Dương, Tử Vi hợp nhà nước/quản lý; Sao Vũ Khúc, Thiên Phủ hợp tài chính, ngân hàng, thương mại; Sao Thiên Cơ, Xương Khúc hợp công nghệ, IT, kế hoạch, giáo dục; Sao Liêm Phá, Thất Sát hợp tiên phong, sáng lập, kỹ thuật.',
    keyStarsOrSigns: ['Chọn Nghề Theo Tử Vi', 'Cung Quan Lộc', 'Định Hướng Nghề Nghiệp'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['chon nghe theo cung quan loc tu vi', 'nghe nghiep hop menh hoa', 'lam nha nuoc hay kinh doanh tu vi'],
    suggestedQuestions: ['Mệnh có Thiên Tướng ở Quan Lộc hợp làm ngành nghề gì?']
  },
  {
    id: 'inq_ql_02',
    category: 'CUNG_QUAN_LOC',
    categoryName: 'Cung Quan Lộc (Sự Nghiệp & Công Danh)',
    cungTen: 'Quan Lộc',
    question: 'Bao giờ con mới có bước đột phá lớn trong sự nghiệp? Thời điểm nào thăng quan tiến chức huy hoàng nhất?',
    userPersona: 'Người có hoài bão lớn đang nỗ lực cống hiến muốn biết khi nào vận may mỉm cười',
    corePainPoint: 'Sốt ruột vì nỗ lực chưa thấy đền đáp, sợ tuổi trẻ trôi qua lãng phí',
    thayBoiApproach: 'Xem Đại Vận 10 năm chuyển cung: Thời điểm đại vận bước vào các cung có Hóa Quyền, Tướng Quân, Quốc Ấn, Khôi Việt hoặc vòng Thái Tuế chính danh. Đó là thập niên công thành danh toại, tiếng tăm vang dội.',
    keyStarsOrSigns: ['Thăng Quan Tiến Chức', 'Hóa Quyền Quan Lộc', 'Đại Vận Đột Phá'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['nam nao duoc thang chuc tu vi', 'dai van thanh cong nhat cuoc doi', 'xem han quan loc'],
    suggestedQuestions: ['Năm 2026 này con có được cất nhắc lên vị trí quản lý không?']
  },

  // ========================================================
  // 6. CUNG NÔ BỘC (Bạn Bè, Cấp Dưới, Đối Tác, Tiểu Nhân)
  // ========================================================
  {
    id: 'inq_nb_01',
    category: 'CUNG_NO_BOC',
    categoryName: 'Cung Nô Bộc (Bạn Bè & Nhân Sự)',
    cungTen: 'Nô Bộc',
    question: 'Tại sao con luôn bị bạn bè, cấp dưới phản bội, cướp khách hàng hoặc đâm sau lưng?',
    userPersona: 'Chủ doanh nghiệp, người làm quản lý hoặc người hay giúp đỡ bạn bè nhưng bị trả oán',
    corePainPoint: 'Đau đớn vì bị người tin tưởng nhất phản bội, mất tiền mất bạn, thất vọng về lòng người',
    thayBoiApproach: 'Soi Cung Nô Bộc: Có sao Phục Binh (ngấm ngầm hại), Hóa Kỵ (đố kỵ ghen ghét), Không Kiếp (cướp đoạt), Kiếp Sát không. Khuyên cách quản trị nhân sự bằng quy trình và pháp lý minh bạch, không dùng tình cảm thay thế nguyên tắc công việc.',
    keyStarsOrSigns: ['Phục Binh Nô Bộc', 'Hóa Kỵ', 'Địa Không Địa Kiếp Nô Bộc', 'Bị Bạn Bè Phản Bội'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['cung no boc xau bi ban phan boi', 'sao phuc binh o no boc', 'tranh tieu nhan ham hai tu vi'],
    suggestedQuestions: ['Làm thế nào để thu phục được nhân sự tài năng, trung thành?']
  },
  {
    id: 'inq_nb_02',
    category: 'CUNG_NO_BOC',
    categoryName: 'Cung Nô Bộc (Bạn Bè & Nhân Sự)',
    cungTen: 'Nô Bộc',
    question: 'Cung Nô Bộc có Tả Phù, Hữu Bật, Khôi Việt thì có phải con luôn có quý nhân bốn phương nâng đỡ?',
    userPersona: 'Người thích kết giao bạn bè, muốn biết mạng lưới quan hệ có giúp ích cho sự nghiệp không',
    corePainPoint: 'Muốn biết nên đầu tư vào các mối quan hệ ngoại giao nào để cùng phát triển',
    thayBoiApproach: 'Khẳng định: Đây là cách cục "Quý nhân phù trợ, bằng hữu đắc lực". Đương số đi đâu cũng có bạn tốt giúp đỡ chí tình, cấp dưới hết lòng phò tá, dễ xây dựng cộng đồng hoặc hệ thống kinh doanh lớn mạnh.',
    keyStarsOrSigns: ['Tả Phụ Hữu Bật Nô Bộc', 'Quý Nhân Phù Trợ', 'Bạn Bè Trợ Lực'],
    frequency: 'HIGH',
    searchKeywords: ['ta huu cung no boc', 'co quy nhan phu tro tu vi', 'ban be giup do trong tu vi'],
    suggestedQuestions: ['Có nên mở công ty chung cổ phần với bạn thân không?']
  },

  // ========================================================
  // 7. CUNG THIÊN DI (Xuất Ngoại, Đi Xa, Định Cư, Tai Nạn)
  // ========================================================
  {
    id: 'inq_tdi_01',
    category: 'CUNG_THIEN_DI',
    categoryName: 'Cung Thiên Di (Xuất Ngoại & Đi Xa)',
    cungTen: 'Thiên Di',
    question: 'Con có số xuất ngoại, định cư nước ngoài, làm việc ở công ty đa quốc gia không hay nên ở quê nhà?',
    userPersona: 'Du học sinh, người lao động xuất khẩu hoặc người trẻ muốn tìm kiếm cơ hội ở nước ngoài',
    corePainPoint: 'Đắn đo giữa đi xa hay ở lại, sợ xuất ngoại gặp trắc trở thất bại',
    thayBoiApproach: 'Xem Cung Thiên Di đối chiếu Cung Mệnh: Có sao Dịch Mã (chủ di chuyển), Thiên Khôi, Thiên Việt, Hóa Khoa, Thanh Long thì đi xa cực kỳ hanh thông, ra nước ngoài mở mày mở mặt. Nếu Thiên Di gặp Sát tinh hãm thì nên ở quê hương phát triển vững chắc hơn.',
    keyStarsOrSigns: ['Dịch Mã Thiên Di', 'Số Xuất Ngoại Tu Vi', 'Định Cư Nước Ngoài'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['so xuat ngoai trong tu vi', 'dinh cu nuoc ngoai la so nao', 'sao dich ma cung thien di'],
    suggestedQuestions: ['Năm nào là năm con xuất ngoại thuận lợi nhất?']
  },
  {
    id: 'inq_tdi_02',
    category: 'CUNG_THIEN_DI',
    categoryName: 'Cung Thiên Di (Xuất Ngoại & Đi Xa)',
    cungTen: 'Thiên Di',
    question: 'Ra ngoài đường con có dễ bị tai nạn giao thông, va quẹt hay hình thương không? Cần kiêng cữ điều gì?',
    userPersona: 'Người làm nghề hay phải di chuyển lái xe, hoặc người vừa gặp va quẹt xe cộ bất an',
    corePainPoint: 'Nỗi sợ tai nạn thương tích, nguy hiểm tính mạng khi tham gia giao thông',
    thayBoiApproach: 'Soi Thiên Di có sao Thiên Mã ngộ Triệt (Ngựa què), Thiên Hình (dao kéo, thương tật), Kình Dương, Địa Kiếp không. Khuyên lái xe điềm tĩnh, không phóng nhanh vượt ẩu, không lái xe khi đã uống rượu bia, và thường xuyên phóng sinh chim cá để giải hạn đường xa.',
    keyStarsOrSigns: ['Thiên Mã Ngộ Triệt', 'Thiên Hình Thiên Di', 'Tai Nạn Xe Cộ', 'Hóa Giải Hình Thương'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['han tai nan giao thong tu vi', 'thien ma ngo triet tai nan', 'sao thien hinh o thien di'],
    suggestedQuestions: ['Treo vật phẩm phong thủy gì trên xe ô tô để thượng lộ bình an?']
  },

  // ========================================================
  // 8. CUNG TẬT ÁCH (Bệnh Tật, Sức Khỏe, Đại Phẫu, Dưỡng Sinh)
  // ========================================================
  {
    id: 'inq_ta_01',
    category: 'CUNG_TAT_ACH',
    categoryName: 'Cung Tật Ách (Sức Khỏe & Bệnh Tật)',
    cungTen: 'Tật Ách',
    question: 'Bản mệnh của con theo lá số dễ mắc bệnh về cơ quan nào nhất? Tuổi trung niên cần phòng ngừa bệnh gì?',
    userPersona: 'Người tuổi 35–60 bắt đầu thấy cơ thể mệt mỏi, đau nhức xương khớp, huyết áp',
    corePainPoint: 'Nỗi sợ bệnh tật nan y hiểm nghèo, muốn biết để phòng bệnh từ sớm',
    thayBoiApproach: 'Đối chiếu Ngũ Hành của các sao ở Cung Tật Ách và Mệnh: Sao Hỏa (Liêm Trinh, Hỏa Tinh) chủ tim mạch, huyết áp; Sao Mộc (Thiên Cơ, Thiên Lương) chủ gan mật, gân cốt; Sao Thủy (Thái Âm, Thiên Đồng) chủ thận, bàng quang, phụ khoa; Sao Kim (Vũ Khúc, Thất Sát) chủ phổi, hô hấp, da; Sao Thổ (Tử Vi, Thiên Phủ) chủ dạ dày, tiêu hóa. Chỉ dẫn phương pháp ăn uống dưỡng sinh Đông Y tương ứng.',
    keyStarsOrSigns: ['Cung Tật Ách Ngũ Hành', 'Bệnh Tim Mạch', 'Bệnh Gan Thận', 'Dưỡng Sinh Đông Y'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['xem benh tat qua cung tat ach tu vi', 'ngu hanh benh tat tu vi', 'phong benh theo la so'],
    suggestedQuestions: ['Năm nào con có hạn phẫu thuật mổ xẻ đụng dao kéo?']
  },
  {
    id: 'inq_ta_02',
    category: 'CUNG_TAT_ACH',
    categoryName: 'Cung Tật Ách (Sức Khỏe & Bệnh Tật)',
    cungTen: 'Tật Ách',
    question: 'Người nhà con đang ốm nặng nằm viện, xem lá số có qua khỏi cơn nguy kịch này không thưa Thầy?',
    userPersona: 'Người thân trong gia đình đang trong cơn bạo bệnh, lòng như lửa đốt tìm kiếm hy vọng',
    corePainPoint: 'Đau đớn tột cùng, sợ mất người thân yêu nhất, tìm điểm tựa tâm linh',
    thayBoiApproach: 'Tận tâm, từ bi, không phán xét đoạt mạng gây tuyệt vọng. Soi sao Thiên Thọ, Thiên Giải, Giải Thần, Quang Quý (các sao cứu giải y khoa gặp thầy gặp thuốc). Khuyên gia đình toàn tâm phối hợp với y bác sĩ, đồng thời con cháu cùng nhau ăn chay, phóng sinh, niệm Phật hồi hướng phước đức cho người bệnh.',
    keyStarsOrSigns: ['Thiên Giải', 'Giải Thần', 'Ân Quang Thiên Quý', 'Hồi Hướng Phóng Sinh'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['xem han om nang tu vi', 'sao giai han benh tat', 'hoi huong phuoc duc cho nguoi benh'],
    suggestedQuestions: ['Cách tụng kinh Dược Sư và phóng sinh cầu an cho người bệnh?']
  },

  // ========================================================
  // 9. CUNG TÀI BẠCH (Tiền Tệ, Đầu Tư, Dòng Tiền, Tích Lũy)
  // ========================================================
  {
    id: 'inq_tb_01',
    category: 'CUNG_TAI_BACH',
    categoryName: 'Cung Tài Bạch (Tiền Bạc & Dòng Tiền)',
    cungTen: 'Tài Bạch',
    question: 'Cung Tài Bạch có Song Hao (Đại Hao, Tiểu Hao) thì có phải số nghèo kiết xác, làm bao nhiêu tiêu bấy nhiêu?',
    userPersona: 'Người làm ra tiền nhưng không giữ được, tiền cứ tự động bốc hơi vì trăm thứ chi tiêu',
    corePainPoint: 'Bất an vì không có khoản tiết kiệm phòng thân, lo sợ tương lai tuổi già',
    thayBoiApproach: 'Khai mở góc nhìn mới: Song Hao đắc địa ở Dần Thân Mão Dậu là cách "Đào hoa hải ngoại", buôn bán thương mại cực kỳ năng động, tiền vào như nước tiền ra như sông. Chỉ cần học cách quản trị: khi tiền về tài khoản, lập tức chuyển 50% vào đất đai hoặc vàng tích lũy thì sẽ biến Song Hao thành cỗ máy sinh lời phi thường.',
    keyStarsOrSigns: ['Song Hao Tài Bạch', 'Đại Hao Tiểu Hao', 'Cách Tụ Tài', 'Tiền Bạc Luân Chuyển'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['song hao o tai bach co ngheo khong', 'cach giu tien khi co song hao', 'song hao dac dia dan than'],
    suggestedQuestions: ['Nên đầu tư vàng hay mua đất thổ cư để giữ tiền?']
  },
  {
    id: 'inq_tb_02',
    category: 'CUNG_TAI_BACH',
    categoryName: 'Cung Tài Bạch (Tiền Bạc & Dòng Tiền)',
    cungTen: 'Tài Bạch',
    question: 'Con có số trúng số độc đắc, hoặc phát tài nhanh chóng nhờ thừa kế, trúng đất không?',
    userPersona: 'Người hay mua vé số, người chờ đợi cơ hội đổi đời nhanh chóng sau một đêm',
    corePainPoint: 'Áp lực mưu sinh nặng nề, mơ ước được giải thoát khỏi gánh nặng nợ nần',
    thayBoiApproach: 'Phân tích cách cục "Hoạch phát" (Tham Lang ngộ Hỏa Tinh/Linh Tinh - Hỏa Tham bộc phát, hoặc Lộc Tồn ngộ Hóa Lộc). Tuy nhiên, Thầy Bói cảnh tỉnh: Của cải bất minh hoặc tiền từ trên trời rơi xuống nếu không có đức dày chống đỡ thì "hoạch phát hoạch phá" (nhanh giàu thì cũng nhanh phá sản tán gia). Khuyên kiếm tiền chân chính.',
    keyStarsOrSigns: ['Hỏa Tham Bộc Phát', 'Hoạch Phát Hoạch Phá', 'Tham Lang Linh Tinh', 'Trúng Số Tu Vi'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['so trung so trong tu vi', 'hoa tham cach phat tai bat ngo', 'hoach phat hoach pha tu vi'],
    suggestedQuestions: ['Sau khi trúng quả đậm thì nên làm việc thiện thế nào để giữ phúc?']
  },

  // ========================================================
  // 10. CUNG TỬ TỨC (Con Cái, Sinh Nở, Hiếu Thảo, Hậu Duệ)
  // ========================================================
  {
    id: 'inq_tt_01',
    category: 'CUNG_TU_TUC',
    categoryName: 'Cung Tử Tức (Con Cái & Hậu Duệ)',
    cungTen: 'Tử Tức',
    question: 'Chúng con kết hôn nhiều năm chưa có con, cung Tử Tức có sao nào báo hiệu hiếm muộn, và làm sao để sớm đón con yêu?',
    userPersona: 'Cặp vợ chồng hiếm muộn đang chạy chữa Tây y nhiều nơi, tinh thần kiệt quệ',
    corePainPoint: 'Áp lực khủng khiếp từ dòng họ nội ngoại, sợ hôn nhân đổ vỡ vì không có con',
    thayBoiApproach: 'Xem Cung Tử Tức có Tuần/Triệt, Cô Thần, Quả Tú, Không Kiếp, Hóa Kỵ không. Khuyên vợ chồng trước hết giữ tinh thần thoải mái, kiên trì theo phác đồ y khoa hiện đại. Về mặt tâm linh: phóng sinh loài mang thai (cá chép bầu), chăm sóc trẻ mồ côi, cầu nguyện Quan Âm Bồ Tát ban quý tử.',
    keyStarsOrSigns: ['Hiếm Muộn Cung Tử Tức', 'Triệt Tử Tức', 'Cô Thần Quả Tú', 'Cầu Con Tâm Linh'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['cung tu tuc hiem muon tu vi', 'cach cau con theo phong thuy', 'tu tuc gap triet co con khong'],
    suggestedQuestions: ['Nhận con nuôi có giúp kích hoạt cung Tử Tức sớm có con ruột không?']
  },
  {
    id: 'inq_tt_02',
    category: 'CUNG_TU_TUC',
    categoryName: 'Cung Tử Tức (Con Cái & Hậu Duệ)',
    cungTen: 'Tử Tức',
    question: 'Con cái sau này có thành đạt, có hiếu với cha mẹ không hay là đứa con nghịch ngợm, phá gia chi tử?',
    userPersona: 'Cha mẹ đang lo lắng vì con cái mải chơi, không chịu học hành, bướng bỉnh',
    corePainPoint: 'Nỗi sợ con cái hư hỏng, sau này về già cô đơn không nơi nương tựa',
    thayBoiApproach: 'Soi Cung Tử Tức: Gặp sao Xương Khúc, Khôi Việt, Hóa Khoa con thông minh xuất chúng, sau này làm rạng danh dòng tộc. Gặp Kình Đà, Phá Quân thì tính con mạnh bạo, cha mẹ phải dạy con bằng sự lắng nghe và làm gương, không dùng đòn roi bạo lực kẻo đẩy con ra xa.',
    keyStarsOrSigns: ['Văn Xương Văn Khúc Tử Tức', 'Khôi Việt', 'Phá Quân Tử Tức', 'Con Cái Thành Đạt'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['xem con cai co hieu thao tu vi', 'con pha gia chi tu la so nao', 'tu tuc co xuong khuc'],
    suggestedQuestions: ['Sinh con hợp tuổi bố mẹ có giúp con ngoan ngoãn hơn không?']
  },

  // ========================================================
  // 11. CUNG PHU THÊ (Hôn Nhân, Duyên Nợ, Vợ Chồng, Hòa Hợp)
  // ========================================================
  {
    id: 'inq_pthe_01',
    category: 'CUNG_PHU_THE',
    categoryName: 'Cung Phu Thê (Hôn Nhân & Tình Duyên)',
    cungTen: 'Phu Thê',
    question: 'Chồng/Vợ con sau này hình dáng, tính cách thế nào? Là người ở gần hay ở xa quê hương?',
    userPersona: 'Người trẻ độc thân tò mò về hình bóng người bạn đời trong tương lai',
    corePainPoint: 'Khao khát tìm thấy đúng mảnh ghép định mệnh, sợ cưới nhầm người',
    thayBoiApproach: 'Đọc chính tinh ở Phu Thê: Có Thiên Phủ, Thái Âm vợ hiền thục chu đáo; Có Tử Vi, Thiên Tướng bạn đời có tài lãnh đạo; Có Thất Sát, Phá Quân bạn đời cá tính mạnh mẽ quyết đoán; Có Thiên Mã thì lấy vợ/chồng ở phương xa hoặc quen nhau khi đi du lịch, công tác.',
    keyStarsOrSigns: ['Thiên Mã Phu Thê', 'Chân Dung Bạn Đời', 'Tử Vi Phu Thê', 'Thái Âm Phu Thê'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['chan dung nguoi yeu tuong lai qua tu vi', 'lay chong o xa trong tu vi', 'cung phu the dep'],
    suggestedQuestions: ['Năm 2026 này cung Phu Thê có sao Lưu nào kích hoạt hôn nhân không?']
  },
  {
    id: 'inq_pthe_02',
    category: 'CUNG_PHU_THE',
    categoryName: 'Cung Phu Thê (Hôn Nhân & Tình Duyên)',
    cungTen: 'Phu Thê',
    question: 'Vợ chồng con đang trên bờ vực ly hôn, lá số có còn duyên nợ để cứu vãn không hay nên buông tay?',
    userPersona: 'Người đang trải qua khủng hoảng hôn nhân nghiêm trọng, bế tắc tột cùng',
    corePainPoint: 'Đau đớn giằng xé giữa buông bỏ và níu kéo vì con cái, sợ tổn thương lâu dài',
    thayBoiApproach: 'Lắng nghe thấu cảm, không khuyên bừa bãi. Xem Cung Phu Thê và hạn năm hiện tại có rơi vào cung Tuyệt, Không Kiếp hay Thiên Hình không. Nếu còn Cát tinh cứu giải (Hóa Khoa, Thiên Giải) khuyên hai vợ chồng ngồi lại đối thoại chân thành, cùng đi tư vấn tâm lý. Nếu hết duyên nợ, khuyên chia tay trong văn minh, bảo vệ con cái.',
    keyStarsOrSigns: ['Thiên Giải', 'Hóa Khoa Phu Thê', 'Hạn Ly Hôn', 'Cứu Vãn Hôn Nhân'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['la so co ly hon khong', 'cach cuu van hon nhan theo tu vi', 'het duyen no trong tu vi'],
    suggestedQuestions: ['Sau ly hôn con có tìm được hạnh phúc mới tốt hơn không?']
  },

  // ========================================================
  // 12. CUNG HUYNH ĐỆ (Anh Chị Em, Tình Cảm, Tranh Chấp Tài Sản)
  // ========================================================
  {
    id: 'inq_hd_01',
    category: 'CUNG_HUYNH_DE',
    categoryName: 'Cung Huynh Đệ (Anh Em Ruột Thịt)',
    cungTen: 'Huynh Đệ',
    question: 'Anh chị em trong nhà có hòa thuận thương yêu nhau không? Có xảy ra cảnh tranh giành đất đai, tài sản của cha mẹ không?',
    userPersona: 'Người sống trong gia đình đông con, đang có dấu hiệu rạn nứt vì phân chia tài sản thừa kế',
    corePainPoint: 'Nỗi đau anh em ruột thịt từ mặt nhau vì tiền tài, nhà cửa',
    thayBoiApproach: 'Soi Cung Huynh Đệ: Gặp Thiên Lương, Thiên Phủ, Tả Hữu anh em đoàn kết đùm bọc, giúp nhau làm giàu. Gặp Hóa Kỵ, Kình Dương, Địa Kiếp thì anh em dễ bất đồng quyền lợi. Khuyên phân chia tài sản minh bạch từ sớm trên giấy tờ pháp lý để giữ trọn tình máu mủ.',
    keyStarsOrSigns: ['Hóa Kỵ Huynh Đệ', 'Kình Dương Huynh Đệ', 'Tranh Chấp Thừa Kế', 'Anh Em Hòa Thuận'],
    frequency: 'VERY_HIGH',
    searchKeywords: ['cung huynh de tu vi tranh chap dat', 'anh em khong hoa thuan tu vi', 'xem tinh cam anh em'],
    suggestedQuestions: ['Có nên làm ăn kinh doanh chung cổ phần với anh em ruột không?']
  },
  {
    id: 'inq_hd_02',
    category: 'CUNG_HUYNH_DE',
    categoryName: 'Cung Huynh Đệ (Anh Em Ruột Thịt)',
    cungTen: 'Huynh Đệ',
    question: 'Trong số các anh chị em, ai là người có số giàu sang hiển đạt nhất để có thể tương trợ cho cả dòng họ?',
    userPersona: 'Gia đình muốn biết vận mệnh của từng anh chị em để định hướng tương lai',
    corePainPoint: 'Kỳ vọng vào sự thành công của anh em trong nhà để nâng đỡ gia đình',
    thayBoiApproach: 'Xem cung Huynh Đệ có Tử Vi, Hóa Lộc, Khôi Việt: Biểu thị trong nhà có anh em thông minh xuất chúng, sau này làm rạng danh tổ tông, có lòng bao dung nâng đỡ anh chị em khó khăn.',
    keyStarsOrSigns: ['Khôi Việt Huynh Đệ', 'Tử Vi Huynh Đệ', 'Anh Em Thành Đạt'],
    frequency: 'HIGH',
    searchKeywords: ['xem anh em thanh dat tu vi', 'cung huynh de dep nhat', 'ai giau nhat trong nha tu vi'],
    suggestedQuestions: ['Người có cung Huynh Đệ đẹp có nên hỗ trợ vốn cho anh em không?']
  },

  // ========================================================
  // 13. CUNG THÂN & HẬU VẬN ĐỜI NGƯỜI (CUỘC SỐNG SAU 32 TUỔI)
  // ========================================================
  {
    id: 'inq_than_01',
    category: 'CUNG_THAN',
    categoryName: 'Cung Thân (Hậu Vận Đời Người)',
    cungTen: 'Cung Thân',
    question: 'Thân cư Mệnh, Thân cư Quan, Thân cư Tài, Thân cư Phu, Thân cư Di khác nhau thế nào? Hậu vận con sướng hay khổ?',
    userPersona: 'Người ngoài 30 tuổi tò mò về sự chuyển dịch vận mệnh từ Cung Mệnh sang Cung Thân',
    corePainPoint: 'Muốn biết tương lai hậu vận có an nhàn sung sướng hay vất vả hơn thời trẻ',
    thayBoiApproach: 'Giảng giải nguyên lý: Tiền vận (trước 32 tuổi) nhìn Cung Mệnh; Hậu vận (sau 32 tuổi) Cung Thân nắm quyền điều khiển. Thân cư Quan coi trọng sự nghiệp; Thân cư Tài cả đời gắn với tiền bạc; Thân cư Phu/Thê hạnh phúc phụ thuộc vào bạn đời; Thân cư Di hay bôn ba đi lại; Thân cư Phúc tâm linh phúc đức dồi dào.',
    keyStarsOrSigns: ['Cung Thân Tử Vi', 'Thân Cư Quan Lộc', 'Thân Cư Tài Bạch', 'Hậu Vận Cuộc Đời'],
    frequency: 'HOT_TRENDING',
    searchKeywords: ['y nghia cung than trong tu vi', 'than cu menh la gi', 'than cu phu the tot hay xau', 'hau van cuoc doi tu vi'],
    suggestedQuestions: ['Thân cư Tài Bạch có Vũ Khúc miếu địa thì hậu vận giàu thế nào?']
  }
];

// Read existing customer-inquiry-bank.json and merge seamlessly
const BANK_FILE = path.join(process.cwd(), 'src/lib/ai/customer-inquiry-bank.json');
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(BANK_FILE, 'utf8'));
} catch (e) {
  existing = [];
}

const existingQuestions = new Set(existing.map((x) => x.question.trim().toLowerCase()));
const merged = [...existing];

for (const item of FULL_INQUIRIES) {
  if (!existingQuestions.has(item.question.trim().toLowerCase())) {
    merged.push(item);
    existingQuestions.add(item.question.trim().toLowerCase());
  }
}

fs.writeFileSync(BANK_FILE, JSON.stringify(merged, null, 2), 'utf8');
console.log(`✓ Đã nạp thành công! Tổng số câu hỏi trong kho hiện tại: ${merged.length} câu hỏi bao quát toàn diện 12 cung!`);
