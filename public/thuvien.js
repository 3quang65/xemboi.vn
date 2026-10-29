/*
 * thuvien.js — Thư viện lời luận viết sẵn cho BẢN MIỄN PHÍ (không gọi AI, không tốn phí).
 * Ghép lời luận từ ý nghĩa sao theo cung, độ sáng, cặp sao, tam phương và vận năm.
 * Cần lich.js và thayba.js. Chạy trên trình duyệt (window.ThuVien) và Node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./lich.js'), require('./thayba.js'));
  else root.ThuVien = factory(root.Lich, root.ThayBa);
})(typeof self !== 'undefined' ? self : this, function (L, TB) {
  'use strict';
  var CHI = L.CHI;

  // ---- 14 chính tinh: lời luận theo cung. "ham" dùng thêm khi sao bình hòa hoặc hãm địa.
  var SAO = {
    'Tử Vi': {
      menh: 'Tử Vi là đế tinh, vua của các sao. Mệnh có Tử Vi thì con có phong thái đứng đắn, tự trọng, thích làm chủ, nói ra người ta dễ nghe theo. Đi đâu cũng có người nâng đỡ, hợp ở vị trí dẫn dắt.',
      ham: 'Có điều sao đứng thế bình, uy có mà chưa trọn, dễ thành tự cao hoặc cô độc; mềm mỏng và chịu nghe người thì mới đắc thế.',
      phuThe: 'Người phối ngẫu có cốt cách, tự trọng, có khi hơi gia trưởng; vợ chồng biết nể nhau thì nhà êm.',
      taiBach: 'Tiền bạc ổn định, kiếm tiền bằng danh tiếng và vị trí; càng có chức phận thì tài càng vững.',
      quanLoc: 'Hợp làm quản lý, lãnh đạo, những công việc có địa vị; dễ được cấp trên tin dùng.',
      dienTrach: 'Nhà cửa khang trang, có phúc về đất đai, dễ có nhà đứng tên mình.',
      tuTuc: 'Con cái có chí, tự lập, sau dễ thành đạt, có điều tính bướng nên dạy bằng lời mềm.',
      phucDuc: 'Phúc đức dòng họ dày, tổ tiên có người hiển đạt, con được hưởng phần che chở.',
      thienDi: 'Ra ngoài được người trọng vọng, đi xa gặp quý nhân.'
    },
    'Thiên Cơ': {
      menh: 'Thiên Cơ là sao mưu trí. Con thông minh, nhanh nhạy, khéo tay, giỏi tính toán, thích học cái mới, hợp nghề cần đầu óc và sự tỉ mỉ.',
      ham: 'Sao ở thế yếu nên con hay nghĩ nhiều, dễ lo xa, đổi ý thất thường; chọn một việc mà theo đến cùng thì thành.',
      phuThe: 'Người phối ngẫu thông minh, khéo léo, hay lo toan; nên tìm hiểu kỹ rồi hãy cưới, vợ chồng có khi chênh tuổi khá nhiều.',
      taiBach: 'Tiền đến từ chất xám, kỹ thuật, buôn bán linh hoạt; tiền vào ra đều nhưng phải biết tích lũy.',
      quanLoc: 'Hợp nghề kỹ thuật, tư vấn, lập kế hoạch, giáo dục, công nghệ; công việc hay đổi, đổi có tính toán thì càng khá.',
      dienTrach: 'Nhà cửa hay sửa sang, đổi chỗ ở vài lần rồi mới yên.',
      tuTuc: 'Con cái lanh lợi, sáng dạ, cần dạy cho chúng tính kiên nhẫn.',
      phucDuc: 'Họ hàng có người làm nghề khéo; tâm con hay suy nghĩ, nên học cách thả lỏng.',
      thienDi: 'Ra ngoài nhanh nhẹn, hợp đi lại, giao dịch.'
    },
    'Thái Dương': {
      menh: 'Thái Dương là mặt trời, chủ sự sáng sủa và danh tiếng. Con hào phóng, ngay thẳng, thích giúp người, làm gì cũng muốn rõ ràng minh bạch.',
      ham: 'Mặt trời lặn thì vất vả hơn: làm nhiều mà ít người thấy công, dễ tự ái; bền bỉ và giữ sức thì về sau vẫn sáng.',
      phuThe: 'Người phối ngẫu cởi mở, hiếu thắng, coi trọng thể diện; vợ chồng nên nhường nhau lời nói.',
      taiBach: 'Tiền đến từ danh tiếng và giao thiệp, làm việc công khai thì tài lộc rộng; tay hào phóng nên phải để dành.',
      quanLoc: 'Hợp việc nhà nước, giáo dục, truyền thông, ngoại giao, những việc đứng trước đám đông.',
      dienTrach: 'Nhà cửa sáng sủa, được cha hoặc người đàn ông trong nhà giúp đỡ chuyện nhà đất.',
      tuTuc: 'Con cái tính thẳng, có chí, con trai thường khá.',
      phucDuc: 'Bên nội có người làm nên; tâm con rộng rãi, ít để bụng.',
      thienDi: 'Ra ngoài được tiếng tốt, hợp đi xa lập nghiệp.'
    },
    'Vũ Khúc': {
      menh: 'Vũ Khúc là tài tinh. Con cương nghị, thực tế, quyết đoán, giỏi xoay tiền, nói ít làm nhiều.',
      ham: 'Sao yếu thì tính dễ cứng nhắc, hay thấy cô đơn, tiền bạc lúc lên lúc xuống; mềm mỏng hơn thì người giúp mới đông.',
      phuThe: 'Người phối ngẫu giỏi giang, quyết đoán, có khi hơi khô khan; lập gia đình muộn một chút thì bền.',
      taiBach: 'Đây là chỗ đắc ý của Vũ Khúc: giỏi kinh doanh, tài chính, có thể tự lập mà khá giả.',
      quanLoc: 'Hợp tài chính, ngân hàng, kinh doanh, kỹ thuật, quân đội, những việc cần quyết đoán.',
      dienTrach: 'Có sức tự gây dựng nhà đất bằng chính đôi tay mình.',
      tuTuc: 'Con cái cứng cỏi, tự lập, không đông con nhưng con có chí.',
      phucDuc: 'Họ hàng có người giỏi làm ăn; con phải tự thân vận động nhiều.',
      thienDi: 'Ra ngoài làm ăn được, gặp người giúp về tiền bạc.'
    },
    'Thiên Đồng': {
      menh: 'Thiên Đồng là phúc tinh. Con hiền hòa, dễ gần, sống tình cảm, biết hưởng thụ; gặp chuyện khó thường có người gỡ giúp.',
      ham: 'Sao yếu thì dễ ngại khó, hay đổi ý; tuổi trẻ vất vả trước rồi về sau mới thong thả.',
      phuThe: 'Người phối ngẫu hiền lành, vui vẻ, có khi hơi ham chơi; cùng nhau lo việc nhà thì hôn nhân êm.',
      taiBach: 'Tiền đến từ việc nhẹ nhàng, dịch vụ, giao tiếp; tay trắng làm nên, về sau mới khá.',
      quanLoc: 'Hợp dịch vụ, chăm sóc, giáo dục, văn nghệ; lúc trẻ hay đổi việc.',
      dienTrach: 'Nhà cửa có được nhưng hay đổi, về già mới ổn định hẳn.',
      tuTuc: 'Con cái hiền, quấn quýt cha mẹ.',
      phucDuc: 'Phúc dày, tâm an, đời ít sóng gió lớn.',
      thienDi: 'Ra ngoài được người quý mến, dễ hòa nhập.'
    },
    'Liêm Trinh': {
      menh: 'Liêm Trinh là sao của sự liêm chính và ý chí. Con nguyên tắc, cương trực, làm việc có kỷ luật, tình cảm sâu nhưng ít nói ra.',
      ham: 'Sao hãm thì tính nóng, dễ va chạm, dễ dính chuyện giấy tờ; giữ mình đúng phép, tránh tranh chấp là yên.',
      phuThe: 'Người phối ngẫu cá tính mạnh, đa cảm; vợ chồng thẳng thắn với nhau, tránh ghen tuông thì bền.',
      taiBach: 'Tiền đến từ chức nghiệp, kỷ luật, công việc ổn định; tránh làm ăn mập mờ.',
      quanLoc: 'Hợp pháp lý, hành chính, kỹ thuật, quân đội, công an, những việc có quy chuẩn.',
      dienTrach: 'Nhà cửa phải tự gây dựng, giấy tờ nhà đất nên giữ cho chặt.',
      tuTuc: 'Con cái cá tính, dạy nghiêm mà có tình thì nên người.',
      phucDuc: 'Họ hàng có người nóng tính; con tu tâm thì lòng nhẹ, phúc dày.',
      thienDi: 'Ra ngoài cẩn thận lời ăn tiếng nói, giữ đúng phép tắc.'
    },
    'Thiên Phủ': {
      menh: 'Thiên Phủ là kho lộc. Con điềm đạm, chín chắn, biết lo xa, có tài giữ của và quản lý, đời sống thường đầy đủ.',
      ham: 'Sao ở thế bình thì lộc có mà chưa dồi dào, phải chăm chỉ tích góp và bớt bảo thủ.',
      phuThe: 'Người phối ngẫu đảm đang, biết vun vén, gia đình êm ấm.',
      taiBach: 'Tài lộc vững, biết tích lũy, có của để dành; hợp nghề quản lý tiền bạc, tài sản.',
      quanLoc: 'Hợp quản lý, hành chính, tài chính, công việc ổn định lâu dài.',
      dienTrach: 'Có phúc về nhà đất, dễ có tài sản cố định, nhà cửa vững.',
      tuTuc: 'Con cái hiền hậu, có hiếu.',
      phucDuc: 'Phúc đức dày, được hưởng của ông bà hoặc sự che chở của họ hàng.',
      thienDi: 'Ra ngoài được tin cậy, dễ gặp người có của giúp đỡ.'
    },
    'Thái Âm': {
      menh: 'Thái Âm là mặt trăng, chủ sự dịu dàng và tài sản. Con tinh tế, sâu sắc, giàu tình cảm, có khiếu thẩm mỹ, biết lo cho nhà cửa.',
      ham: 'Trăng mờ thì hay buồn lo, nhạy cảm quá, tiền khó giữ; sống chậm lại và chăm lo tinh thần thì tốt dần.',
      phuThe: 'Người phối ngẫu dịu dàng, đẹp người đẹp nết; hôn nhân thiên về tình cảm.',
      taiBach: 'Tiền đến đều, tích tiểu thành đại, có lộc về nhà đất; hợp làm ăn yên tĩnh, lâu dài.',
      quanLoc: 'Hợp tài chính, bất động sản, nghệ thuật, chăm sóc, những việc cần tỉ mỉ.',
      dienTrach: 'Rất có phúc về nhà đất, dễ tậu được nhà, được mẹ hoặc người phụ nữ trong nhà giúp.',
      tuTuc: 'Con cái hiền, tình cảm, con gái thường khá.',
      phucDuc: 'Bên ngoại có phúc; tâm con hiền, hay nghĩ cho người khác.',
      thienDi: 'Ra ngoài được người nữ giúp đỡ, hợp việc kín đáo, nhẹ nhàng.'
    },
    'Tham Lang': {
      menh: 'Tham Lang là sao đa tài đa dục. Con năng động, giao thiệp rộng, khéo ăn nói, có duyên với nghệ thuật, ăn uống, vui chơi.',
      ham: 'Sao hãm thì ham muốn nhiều, dễ sa vào chơi bời hoặc làm liều; giữ được chữ "đủ" thì yên.',
      phuThe: 'Người phối ngẫu duyên dáng, giao du rộng; tình cảm nồng nhiệt, cần sự chung thủy của cả hai.',
      taiBach: 'Tiền đến từ giao thiệp, buôn bán, giải trí; lúc trẻ kiếm được thì tiêu nhiều, trung niên mới giữ được.',
      quanLoc: 'Hợp kinh doanh, ngoại giao, quảng cáo, nghệ thuật, ẩm thực, làm đẹp.',
      dienTrach: 'Nhà cửa có lúc thăng lúc trầm, trung niên mới vững.',
      tuTuc: 'Con cái lanh lợi, nhiều tài, cần để ý chuyện chơi bời.',
      phucDuc: 'Họ hàng đông vui; con tiết chế được thì giữ được phúc.',
      thienDi: 'Ra ngoài nhiều bạn, nhiều cơ hội, nhưng phải chọn bạn mà chơi.'
    },
    'Cự Môn': {
      menh: 'Cự Môn là sao của lời nói. Con ăn nói sắc sảo, lý lẽ chặt chẽ, có đầu óc phân tích, hợp nghề dùng lời.',
      ham: 'Sao hãm thì dễ bị hiểu lầm, thị phi, khẩu thiệt; nói ít đi một câu là bớt mười điều phiền.',
      phuThe: 'Vợ chồng hay tranh luận nhưng nói ra rồi thôi; học cách nói nhẹ với nhau là êm.',
      taiBach: 'Tiền đến từ lời nói: tư vấn, giảng dạy, buôn bán; cạnh tranh nhiều nhưng có miếng ăn.',
      quanLoc: 'Hợp luật, giáo dục, truyền thông, bán hàng, y dược, nghiên cứu.',
      dienTrach: 'Nhà cửa có nhưng dễ vướng chuyện giấy tờ, ranh giới; làm gì cũng nên rõ ràng.',
      tuTuc: 'Con cái thông minh, hay cãi, dạy bằng lý lẽ thì nghe.',
      phucDuc: 'Họ hàng hay có chuyện lời qua tiếng lại; con giữ hòa khí thì phúc lành.',
      thienDi: 'Ra ngoài dễ gặp thị phi, cẩn trọng lời nói chỗ đông người.'
    },
    'Thiên Tướng': {
      menh: 'Thiên Tướng là ấn tinh. Con trọng nghĩa, ngay thẳng, thích bênh kẻ yếu, ăn mặc chỉn chu, được người tin giao việc.',
      ham: 'Sao hãm thì dễ ôm việc thiên hạ vào mình rồi bị liên lụy; giúp người cũng phải lượng sức.',
      phuThe: 'Người phối ngẫu đứng đắn, biết chăm lo; hôn nhân hòa hợp.',
      taiBach: 'Tiền đến đều, có người giúp về tài chính; hợp làm công ăn lương ổn định.',
      quanLoc: 'Hợp hành chính, nhân sự, pháp lý, phục vụ cộng đồng.',
      dienTrach: 'Nhà cửa gọn gàng, đẹp đẽ, có chốn yên ổn.',
      tuTuc: 'Con cái ngoan, biết phép tắc.',
      phucDuc: 'Có phúc, lúc khó được quý nhân che chở.',
      thienDi: 'Ra ngoài có quý nhân, được nể trọng.'
    },
    'Thiên Lương': {
      menh: 'Thiên Lương là ấm tinh. Con nhân hậu, chín chắn, thích làm thầy, làm anh chị, hay che chở người khác; gặp nạn thường được giải.',
      ham: 'Sao hãm thì hay lo chuyện bao đồng, lúc trẻ lận đận hoặc thấy cô đơn; về sau mới an.',
      phuThe: 'Người phối ngẫu hiền hậu, chín chắn, có khi hơn tuổi mình.',
      taiBach: 'Tiền đến từ nghề nghiệp có tiếng, không giàu vội nhưng không thiếu.',
      quanLoc: 'Hợp y, giáo dục, tư vấn, bảo hiểm, công tác xã hội, những việc giúp người.',
      dienTrach: 'Được hưởng nhà đất của ông bà hoặc có người che chở chuyện nhà.',
      tuTuc: 'Con cái hiền, có hiếu, về sau nhờ được.',
      phucDuc: 'Phúc đức rất dày, tổ tiên làm nhiều việc thiện, con được che chở.',
      thienDi: 'Ra ngoài hay gặp người lớn tuổi giúp đỡ.'
    },
    'Thất Sát': {
      menh: 'Thất Sát là tướng tinh. Con gan dạ, quyết liệt, dám nghĩ dám làm, không chịu đứng dưới người lâu, đời có những bước ngoặt lớn.',
      ham: 'Sao hãm thì nóng vội, dễ va vấp, nhiều phen làm lại từ đầu; bớt nóng một nhịp là đỡ hao.',
      phuThe: 'Vợ chồng đều cá tính mạnh; lấy muộn và biết nhường nhịn thì giữ được hòa khí.',
      taiBach: 'Tiền đến bằng xông pha, lúc được nhiều lúc hao, nhớ dành phần phòng thân.',
      quanLoc: 'Hợp quân đội, kỹ thuật, khởi nghiệp, kinh doanh mạo hiểm, việc cần quyết đoán.',
      dienTrach: 'Nhà cửa phải tự gây dựng, có đổi chỗ ở.',
      tuTuc: 'Con cái mạnh mẽ, bướng, cần dạy kỷ luật.',
      phucDuc: 'Con phải tự lập sớm, phúc nằm ở sự chịu khó của chính mình.',
      thienDi: 'Ra ngoài xông pha, đi xa dễ lập nghiệp, nhưng đi lại phải cẩn thận.'
    },
    'Phá Quân': {
      menh: 'Phá Quân là sao của đổi mới. Con thích cái mới, không ngại phá cũ dựng mới, tính thẳng, dám làm, đời có nhiều lần thay đổi lớn.',
      ham: 'Sao hãm thì dễ hao tán, bỏ dở giữa chừng; làm gì cũng nên có kế hoạch và có người bàn bạc.',
      phuThe: 'Hôn nhân lúc đầu có sóng gió; cưới muộn hoặc qua thử thách rồi mới bền.',
      taiBach: 'Tiền vào nhanh ra nhanh, hợp làm ăn đổi mới; cần học cách giữ tiền.',
      quanLoc: 'Hợp công việc sáng tạo, cải tiến, kỹ thuật, kinh doanh mạo hiểm; hay đổi nghề.',
      dienTrach: 'Nhà cửa hay sửa chữa, đổi chỗ, phải tự xây dựng.',
      tuTuc: 'Con cái cá tính, sáng tạo, cần được định hướng.',
      phucDuc: 'Họ hàng có biến động; con tu tâm, làm thiện thì vững.',
      thienDi: 'Ra ngoài xông pha, dễ có cơ hội ở nơi xa.'
    }
  };

  // ---- Các cặp chính tinh đồng cung kinh điển
  var CAP = {
    'Tử Vi+Thiên Phủ': 'Tử Phủ đồng cung: vua gặp kho, chủ phú quý, vừa có tài dẫn dắt vừa biết giữ của.',
    'Tử Vi+Thiên Tướng': 'Tử Tướng: có uy lại có người phò, hợp chức quyền, chỉ nên tránh ôm đồm.',
    'Tử Vi+Thất Sát': 'Tử Sát: có chí lớn, quyền biến, biết nhẫn thì chuyển nguy thành an.',
    'Tử Vi+Phá Quân': 'Tử Phá: tham vọng, thích cải cách, đời nhiều phen thay đổi lớn rồi mới đứng vững.',
    'Tử Vi+Tham Lang': 'Tử Tham: đa tài, giao thiệp rộng, cần giữ mình trước cám dỗ.',
    'Thiên Cơ+Thái Âm': 'Cơ Nguyệt: thông minh, khéo léo, hợp nghề chuyên môn, hay thay đổi.',
    'Thiên Cơ+Thiên Lương': 'Cơ Lương: mưu trí lại nhân hậu, hợp làm thầy, làm người cố vấn.',
    'Thiên Cơ+Cự Môn': 'Cơ Cự: lý lẽ sắc bén, hợp nghiên cứu, nói năng, có điều tâm hay động.',
    'Thái Dương+Thái Âm': 'Nhật Nguyệt đồng cung: lúc cương lúc nhu, đa tài, cần giữ thăng bằng trong lòng.',
    'Vũ Khúc+Thiên Tướng': 'Vũ Tướng: thực tế lại trọng nghĩa, giỏi kiếm tiền và được người tin.',
    'Vũ Khúc+Thiên Phủ': 'Vũ Phủ: tài lộc vững vàng, giỏi quản lý tiền, giàu từ từ mà chắc.',
    'Vũ Khúc+Thất Sát': 'Vũ Sát: quyết liệt trong làm ăn, kiếm tiền bằng xông pha.',
    'Vũ Khúc+Phá Quân': 'Vũ Phá: dám nghĩ dám làm về tiền bạc, thắng lớn thua lớn, phải biết chừng mực.',
    'Vũ Khúc+Tham Lang': 'Vũ Tham: trước khó sau dễ, từ ba mươi tuổi trở đi mới phát.',
    'Liêm Trinh+Thiên Phủ': 'Liêm Phủ: cương trực mà biết giữ, làm việc có nguyên tắc, tài sản bền.',
    'Liêm Trinh+Thiên Tướng': 'Liêm Tướng: trọng kỷ luật, hợp công việc có quy chuẩn.',
    'Liêm Trinh+Thất Sát': 'Liêm Sát: ý chí sắt đá, hợp việc khó, nên tránh nóng nảy.',
    'Liêm Trinh+Phá Quân': 'Liêm Phá: tính quyết liệt, đời nhiều biến động, hợp kỹ thuật và việc mạo hiểm.',
    'Liêm Trinh+Tham Lang': 'Liêm Tham: đa tình, đa tài, cần giữ mình trong các mối quan hệ.',
    'Thiên Đồng+Thiên Lương': 'Đồng Lương: hiền lành, phúc hậu, hợp nghề giúp người.',
    'Thiên Đồng+Thái Âm': 'Đồng Âm: dịu dàng, tình cảm, có phúc hưởng, hợp nghề nhẹ nhàng.',
    'Thiên Đồng+Cự Môn': 'Đồng Cự: tâm hay lo, lời nói cần mềm, trước khó sau dễ.',
    'Thái Dương+Cự Môn': 'Cự Nhật: ăn nói có sức thuyết phục, hợp nghề dùng lời, có danh.',
    'Thái Dương+Thiên Lương': 'Nhật Lương: quang minh nhân hậu, hợp việc phục vụ xã hội, có tiếng tốt.'
  };

  // ---- Sao phụ quan trọng
  var PHU = {
    'Tả Phù': 'được người giúp sức', 'Hữu Bật': 'có bạn bè, đồng nghiệp hỗ trợ',
    'Văn Xương': 'sáng dạ, giỏi học hành, chữ nghĩa', 'Văn Khúc': 'khéo ăn nói, có khiếu văn nghệ',
    'Thiên Khôi': 'có quý nhân bề trên nâng đỡ', 'Thiên Việt': 'có quý nhân giúp đúng lúc',
    'Lộc Tồn': 'có lộc, biết giữ của', 'Thiên Mã': 'năng động, đổi chỗ để phát triển',
    'Hóa Lộc': 'thêm lộc, thêm duyên làm ăn', 'Hóa Quyền': 'có tiếng nói, dễ được giao trọng trách',
    'Hóa Khoa': 'có danh tiếng tốt, học hành thi cử thuận', 'Hóa Kỵ': 'dễ gặp trắc trở, hiểu lầm, nên kiên nhẫn',
    'Kình Dương': 'mạnh mẽ nhưng dễ nóng, va chạm', 'Đà La': 'việc hay chậm, kéo dài, phải bền bỉ',
    'Địa Không': 'ý tưởng táo bạo nhưng dễ hao tiền', 'Địa Kiếp': 'tiền của dễ hao, chắc chân rồi hãy bước',
    'Hỏa Tinh': 'nóng vội, làm nhanh dễ hỏng việc', 'Linh Tinh': 'bốc đồng, cần bình tĩnh trước khi quyết',
    'Đào Hoa': 'có duyên, được người mến', 'Hồng Loan': 'duyên tình cảm đến dễ', 'Thiên Hỷ': 'có tin vui, tính vui vẻ',
    'Thiên Hình': 'nghiêm khắc, kỷ luật', 'Thiên Riêu': 'đa cảm, cần tỉnh táo chuyện tình cảm',
    'Cô Thần': 'thích tự lập, đôi lúc thấy cô đơn', 'Quả Tú': 'hay giữ ý, ít chia sẻ',
    'Tam Thai': 'có vị thế, được nể trọng', 'Bát Tọa': 'có chỗ đứng vững vàng',
    'Ân Quang': 'được ơn nghĩa, gặp người tốt giúp', 'Thiên Quý': 'có người thương giúp',
    'Long Trì': 'có khiếu thẩm mỹ', 'Phượng Các': 'có danh, thích cái đẹp',
    'Thiên Khốc': 'hay lo nghĩ, đa sầu', 'Thiên Hư': 'đôi lúc thấy trống trải, cần giữ lạc quan',
    'Thiên Đức': 'có sao giải, gặp nạn dễ qua', 'Nguyệt Đức': 'có đức, gặp nạn dễ qua',
    'Giải Thần': 'gặp rắc rối có người gỡ', 'Thiên Giải': 'có sao giải hạn', 'Địa Giải': 'có sao giải hạn',
    'Hoa Cái': 'có khí chất riêng, hơi kiêu', 'Thiên Tài': 'có tài riêng', 'Thiên Thọ': 'tâm an, sống thọ',
    'Quốc Ấn': 'có duyên với chức phận', 'Đường Phù': 'có danh vị', 'Thiên Quan': 'có quý nhân', 'Thiên Phúc': 'có phúc',
    'Thái Tuế': 'thẳng thắn, hay lý lẽ', 'Tang Môn': 'có lúc buồn phiền', 'Bạch Hổ': 'việc hay gấp gáp, cần bình tĩnh',
    'Thiên Không': 'ý tưởng nhiều mà khó thành', 'Phá Toái': 'dễ hao vặt'
  };
  var SAO_DUYEN = ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ'], SAO_TIEN = ['Lộc Tồn', 'Hóa Lộc', 'Vũ Khúc', 'Thiên Phủ', 'Thái Âm'],
    SAO_DANH = ['Hóa Quyền', 'Hóa Khoa', 'Tử Vi', 'Thái Dương', 'Thiên Khôi', 'Thiên Việt'], SAO_NHA = ['Thiên Phủ', 'Thái Âm', 'Lộc Tồn', 'Thiên Lương'];

  var SINH_KHAC = {
    'Mệnh sinh Cục': 'Mệnh sinh Cục: con hay lo cho người, làm nhiều hơn hưởng, nhưng tâm tốt nên phúc bền.',
    'Cục sinh Mệnh': 'Cục sinh Mệnh: được hoàn cảnh nâng đỡ, đời ít phải bươn chải quá sức.',
    'Mệnh khắc Cục': 'Mệnh khắc Cục: con có chí, tự tay cải tạo hoàn cảnh, thành công nhờ nỗ lực.',
    'Cục khắc Mệnh': 'Cục khắc Mệnh: hoàn cảnh hay thử thách, phải bền gan, càng về sau càng vững.',
    'Mệnh Cục bình hòa': 'Mệnh Cục bình hòa: đời cân bằng, ít biến động lớn.'
  };
  var HANH = { Kim: 'cứng cỏi, trọng nghĩa, quyết đoán', 'Mộc': 'nhân hậu, cầu tiến, ưa phát triển', 'Thủy': 'linh hoạt, thông minh, khéo thích nghi', 'Hỏa': 'nhiệt tình, sôi nổi, có tinh thần dẫn dắt', 'Thổ': 'chân thành, đáng tin, kiên nhẫn' };
  var THAN_CU = {
    'Mệnh': 'Thân cư Mệnh: con sống theo ý mình, tự quyết lấy đời mình.',
    'Phúc Đức': 'Thân cư Phúc Đức: coi trọng gia tộc, đời được phúc ông bà che chở.',
    'Quan Lộc': 'Thân cư Quan Lộc: đặt nặng sự nghiệp, càng làm càng lên.',
    'Thiên Di': 'Thân cư Thiên Di: hợp ra ngoài, đi xa, xã hội mang lại cơ hội.',
    'Tài Bạch': 'Thân cư Tài Bạch: chú trọng kinh tế, giỏi lo liệu tiền bạc.',
    'Phu Thê': 'Thân cư Phu Thê: hôn nhân ảnh hưởng lớn đến đời con, người bạn đời là chỗ dựa.'
  };
  var CHAO = [
    'Khà khà, ngồi xuống đây con. Thầy bấm đốt tay xem rồi, lá số con có mấy điều đáng nói lắm.',
    'Chà, có duyên mới ghé sạp thầy. Lá số con thầy coi rồi, nghe thầy nói từ từ nhé.',
    'Ngồi xuống chiếc chõng tre này đi con. Thầy xem lá số con thấy có sáng có tối, để thầy nói cho nghe.',
    'Đấy, lá số con đây rồi. Thầy nói những nét chính trước, con nghe xem có đúng không nhé.'
  ];


  /** Cảnh đời thường theo chính tinh thủ Mệnh: nói bằng chuyện cụ thể để người nghe thấy đúng mình */
  var CANH = {
    'Tử Vi': ['Ở chỗ làm hay trong họ hàng, lúc mọi người còn bàn ra tán vào thì người ta hay quay sang hỏi con "thế giờ tính sao?".', 'Con ghét bị sai bảo kiểu ra lệnh, nhưng ai nhờ khéo một câu thì con làm hết lòng.'],
    'Thiên Cơ': ['Con là người nằm xuống rồi vẫn còn nghĩ cách làm việc ngày mai sao cho gọn hơn.', 'Bạn bè gặp chuyện rối hay gọi con, vì con gỡ được đầu mối nhanh hơn người khác.'],
    'Thái Dương': ['Đi đâu con cũng là người bắt chuyện trước, thấy ai lúng túng là không đứng yên được.', 'Con hay nhận phần khó về mình rồi tối về mới thấy mệt, vì cả ngày lo cho người khác.'],
    'Vũ Khúc': ['Con tính tiền trong đầu nhanh, đi chợ hay đi làm đều biết khoản nào đáng, khoản nào phí.', 'Nói ít làm nhiều, có khi người ngoài thấy con lạnh, nhưng ai thân mới biết con lo cho người nhà chu đáo.'],
    'Thiên Đồng': ['Con dễ chịu, ở đâu cũng hòa được, nhưng việc gì phải ép mình quá thì con hay để "mai tính".', 'Nhà có chuyện căng, con thường là người pha trò cho mọi người dịu xuống.'],
    'Liêm Trinh': ['Con có nguyên tắc riêng, ai làm trái lẽ là con nhớ lâu, nói thẳng không vòng vo.', 'Việc gì con đã nhận là làm đến nơi đến chốn, có khi thức khuya cũng phải xong.'],
    'Thiên Phủ': ['Con thích mọi thứ có kế hoạch, trong nhà ngăn nào để gì con đều nhớ.', 'Người quen hay gửi gắm việc cho con vì con giữ lời và giữ của chắc tay.'],
    'Thái Âm': ['Con nhạy, ai buồn trong lòng con nhìn mặt là đoán được, nhưng chuyện của mình thì hay để bụng.', 'Con thích không gian yên tĩnh, một góc nhà gọn gàng là đủ thấy dễ chịu.'],
    'Tham Lang': ['Con học cái gì cũng nhanh, đi đâu cũng có thêm vài người quen mới.', 'Con thích thử cái mới, có lúc nhiều việc quá mà cái nào cũng muốn làm.'],
    'Cự Môn': ['Con nói chuyện có lý lẽ, cãi ai là phải có dẫn chứng, nên làm việc cần ăn nói là hợp.', 'Có khi con nói thật quá mà người nghe phật lòng, dù trong bụng con không có ý gì.'],
    'Thiên Tướng': ['Thấy ai bị bắt nạt hay thiệt thòi là con lên tiếng, không ngồi yên được.', 'Con chăm chút vẻ ngoài, ra đường quần áo gọn gàng, người ta nhìn vào thấy tin.'],
    'Thiên Lương': ['Bạn bè có chuyện khó nói hay tìm đến con, vì con nghe được và khuyên có tình có lý.', 'Con hay đứng ra dàn xếp khi hai bên căng thẳng, kể cả chuyện không phải của mình.'],
    'Thất Sát': ['Gặp việc khó con không lùi, càng bị nói là không làm được thì con càng phải làm cho bằng được.', 'Con quyết nhanh, đôi khi người bên cạnh chưa kịp hiểu thì con đã làm xong rồi.'],
    'Phá Quân': ['Con không chịu nổi cảnh cứ làm theo lối mòn, chỗ nào cũ kỹ là con muốn thay.', 'Cuộc đời con có vài lần rẽ ngoặt lớn, mỗi lần làm lại con lại mạnh hơn trước.']
  };
  var CV_TEN = { lamcong: 'đang đi làm công', kinhdoanh: 'đang tự kinh doanh', tudo: 'đang làm nghề tự do', dihoc: 'đang đi học', nghihuu: 'đã nghỉ ngơi, an hưởng tuổi già', noitro: 'đang lo việc nhà' };
  var HN_TEN = { docthan: 'chưa có đôi', dangyeu: 'đang có người thương', giadinh: 'đã yên bề gia thất' };
  function hc(ls) { return (ls && ls.hoanCanh) || {}; }
  /** Câu thầy nhắc lại hoàn cảnh để vào chuyện */
  function chaoHoanCanh(ls) {
    var h = hc(ls), ds = [];
    if (HN_TEN[h.hn]) ds.push(HN_TEN[h.hn]);
    if (CV_TEN[h.cv]) ds.push(CV_TEN[h.cv]);
    if (h.con === 'co') ds.push('đã có con');
    return ds.length ? 'Con kể con ' + ds.join(', ') + ', vậy thầy nói thẳng vào chuyện của con.' : '';
  }
  function tuoiNay(dl) { return dl && dl.tuoi ? dl.tuoi : 30; }
  /** Tình duyên theo hoàn cảnh: đã có gia đình thì nói chuyện giữ lửa, không hứa duyên mới */
  function duyenTheoHoanCanh(ls, dl) {
    var h = hc(ls), c = cungTen(ls, 'Phu Thê'), d = diemCung(c), tuoi = tuoiNay(dl);
    if (h.hn === 'giadinh') {
      return d >= 1
        ? 'Con đã có gia đình nên thầy không bàn chuyện tìm duyên. Cung Phu Thê sáng, vợ chồng con hợp nhau ở chỗ cùng chí hướng; giữ lửa bằng những việc nhỏ: bữa cơm chung không cầm điện thoại, chuyện tiền bạc bàn với nhau trước khi quyết.'
        : 'Con đã có gia đình nên thầy không bàn chuyện tìm duyên. Cung Phu Thê có sao làm chậm, làm nóng, nên hai người có lúc va nhau vì chuyện nhỏ hơn là chuyện lớn; lúc nóng thì một người nhường một câu, để hôm sau bình tĩnh hẵng nói. Vợ chồng càng về sau càng hiểu nhau.';
    }
    if (h.hn === 'dangyeu') {
      var gc = tuoi <= 45 ? giaiDoan(ls, SAO_DUYEN, Math.max(18, tuoi), 45, 'Phu Thê') : '';
      return 'Con đang có người thương. ' + (d >= 1 ? 'Cung Phu Thê sáng, mối này có cơ thành nếu hai đứa cùng tính chuyện lâu dài.' : 'Cung Phu Thê có sao trắc trở, tình cảm cần thêm thời gian thử thách; đừng vội, cũng đừng để lâu quá mà nguội.') + (gc ? ' Tính chuyện cưới xin thì thuận nhất ' + gc + '.' : '');
    }
    if (tuoi > 45) return 'Tuổi này chuyện duyên không còn là chuyện tìm người mới cho bằng được; có người bầu bạn hợp tính, sống vui với con cháu là phúc rồi.';
    return '';
  }
  function viecTheoHoanCanh(ls) {
    var h = hc(ls), qc = cungTen(ls, 'Quan Lộc'), d = diemCung(qc);
    switch (h.cv) {
      case 'lamcong': return d >= 1 ? 'Con đang làm công: lá số cho thấy con được cấp trên để ý nếu dám nhận việc khó. Đừng ngại xin thêm trách nhiệm, đó là đường lên của con.' : 'Con đang làm công: chỗ làm hiện tại có lúc làm con bức bối. Trước khi nghỉ, chuẩn bị chỗ mới và một khoản dự phòng đã, đừng nghỉ trong lúc nóng giận.';
      case 'kinhdoanh': return d >= 1 ? 'Con đang tự làm ăn: Quan Lộc vững, hợp làm chủ. Mở rộng thì mở từng bước, làm chắc phần đang có rồi mới thêm.' : 'Con đang tự làm ăn: Quan Lộc có sao trắc trở, việc buôn bán lúc lên lúc xuống. Giữ sổ sách rõ ràng, hợp tác với ai thì có giấy tờ.';
      case 'tudo': return 'Con làm nghề tự do: hợp với tính không thích gò bó, nhưng nhớ để riêng một khoản cho những tháng ít việc.';
      case 'dihoc': return 'Con đang đi học: lúc này là lúc gieo hạt. Chọn ngành theo cái con làm hoài không chán, đừng chọn theo phong trào.';
      case 'nghihuu': return 'Con đã nghỉ ngơi: lúc này công danh là ở chỗ truyền lại kinh nghiệm cho con cháu, giữ sức khỏe và vui với việc mình thích.';
      case 'noitro': return 'Con đang lo việc nhà: đó cũng là một nghề, và lá số cho thấy con có tay quán xuyến. Nếu muốn có thêm thu nhập, việc nhỏ làm tại nhà hợp với con.';
    }
    return '';
  }
  function conTheoHoanCanh(ls) {
    var h = hc(ls), c = cungTen(ls, 'Tử Tức'), d = diemCung(c);
    if (h.con === 'co') return d >= 1 ? 'Con đã có con: đường con cái sáng, con cháu biết điều, sau này là chỗ dựa. Dành cho con nhiều thời gian hơn là cho nhiều tiền.' : 'Con đã có con: con cái có lúc bướng, cha mẹ nói nhiều không bằng làm gương. Kiên nhẫn thì về sau con cháu hiếu thảo.';
    if (h.con === 'chua' && h.hn === 'giadinh') return 'Con chưa có con: chuyện con cái đến sớm hay muộn có duyên của nó, vợ chồng giữ sức khỏe, vui vẻ với nhau là chính.';
    return '';
  }

  function cungTen(ls, ten) { return ls.cung.filter(function (c) { return c.ten === ten; })[0]; }
  function cungChi(ls, chi) { return ls.cung[((chi % 12) + 12) % 12]; }
  function laYeu(s) { return s.dacTinh === 'H' || s.dacTinh === 'B'; }
  function tenSao(s) { return '**' + s.ten + '**' + (s.dacTinhTen ? ' (' + s.dacTinhTen.toLowerCase() + ')' : ''); }
  function capCua(ds) {
    if (ds.length < 2) return null;
    return CAP[ds[0].ten + '+' + ds[1].ten] || CAP[ds[1].ten + '+' + ds[0].ten] || null;
  }
  /** Chính tinh dùng để luận một cung: của chính nó, hoặc mượn cung xung chiếu nếu vô chính diệu */
  function chinhTinhLuan(ls, c) {
    if (c.chinhTinh.length) return { ds: c.chinhTinh, muon: false };
    return { ds: cungChi(ls, c.chi + 6).chinhTinh, muon: true };
  }
  /** Lời luận một cung theo trường (menh, phuThe, taiBach…) */
  function luanCung(ls, c, truong, dayDu) {
    var x = chinhTinhLuan(ls, c), out = [];
    if (!x.ds.length) return 'Cung ' + c.ten + ' trống chính tinh, đời phải tự lực là chính.';
    var mo = (x.muon ? 'Cung ' + c.ten + ' vô chính diệu, mượn ' : 'Cung ' + c.ten + ' có ') + x.ds.map(tenSao).join(', ') + (x.muon ? ' từ cung đối diện' : '') + '.';
    out.push(mo);
    var cap = capCua(x.ds); if (cap && truong === 'menh') out.push(cap);
    x.ds.forEach(function (s, k) {
      var g = SAO[s.ten]; if (!g) return;
      var cau = g[truong] || g.menh;
      if (k > 0 && truong !== 'menh') cau = 'Lại thêm sao ' + s.ten + ': ' + cau.charAt(0).toLowerCase() + cau.slice(1);
      out.push(cau);
      if (dayDu && laYeu(s) && g.ham) out.push(g.ham);
    });
    if (x.muon) out.push('Cung vô chính diệu thì đời ở mặt này hay thay đổi, tự mình vun đắp là chính.');
    if (c.tuan || c.triet) out.push('Cung này gặp ' + (c.tuan && c.triet ? 'cả Tuần lẫn Triệt' : c.tuan ? 'Tuần' : 'Triệt') + ', việc thường đến chậm hoặc trắc trở lúc đầu, kiên nhẫn thì về sau mới thông.');
    return out.join(' ');
  }
  function phuTinhNoiBat(c, max) {
    var tot = c.catTinh.filter(function (s) { return PHU[s.ten]; }).slice(0, max);
    var xau = c.hungTinh.filter(function (s) { return PHU[s.ten] && ['Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh', 'Hóa Kỵ', 'Thiên Hình', 'Thiên Riêu'].indexOf(s.ten) >= 0; }).slice(0, max);
    var out = [];
    if (tot.length) out.push('Cát tinh hội về có ' + tot.map(function (s) { return '**' + s.ten + '** (' + PHU[s.ten] + ')'; }).join(', ') + '.');
    if (xau.length) out.push('Lại có ' + xau.map(function (s) { return '**' + s.ten + '** (' + PHU[s.ten] + ')'; }).join(', ') + ', nên con để ý.');
    return out.join(' ');
  }
  function diemCung(c) {
    var d = 0;
    c.chinhTinh.forEach(function (s) { d += laYeu(s) ? -1 : 1; });
    c.catTinh.forEach(function (s) { if (['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'].indexOf(s.ten) >= 0) d += 1; });
    c.hungTinh.forEach(function (s) { if (['Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh', 'Hóa Kỵ'].indexOf(s.ten) >= 0) d -= 1; });
    if (c.tuan || c.triet) d -= 1;
    return d;
  }
  /**
   * Chọn đại vận thuận lợi cho một việc, CHỈ trong khoảng tuổi hợp lý của việc đó
   * (vd. tình duyên: các vận phủ tuổi 18–42). Chấm điểm: vận có sao chủ việc,
   * vận rơi vào cung chủ việc hoặc cung chiếu về nó, cộng điểm tốt xấu của cung.
   */
  function giaiDoan(ls, dsSao, tuoiMin, tuoiMax, tenCungChu) {
    var chu = tenCungChu ? cungTen(ls, tenCungChu) : null;
    var ung = ls.cung.filter(function (c) { return c.daiVanTu + 9 >= tuoiMin && c.daiVanTu <= tuoiMax; });
    if (!ung.length) return '';
    var cham = ung.map(function (c) {
      var d = diemCung(c);
      if (c.chinhTinh.concat(c.phuTinh).some(function (s) { return dsSao.indexOf(s.ten) >= 0; })) d += 3;
      if (chu) {
        if (c.chi === chu.chi) d += 3;
        else if ([4, 6, 8].indexOf(((c.chi - chu.chi) % 12 + 12) % 12) >= 0) d += 1; // tam hợp, xung chiếu
      }
      return { c: c, d: d };
    }).sort(function (a, b) { return b.d - a.d || a.c.daiVanTu - b.c.daiVanTu; });
    var tot = cham[0].c;
    var tu = Math.max(tot.daiVanTu, tuoiMin), den = Math.min(tot.daiVanTu + 9, tuoiMax + 5);
    return 'khoảng **' + tu + '–' + den + ' tuổi**';
  }

  var TRUONG = { 'Phu Thê': 'phuThe', 'Tài Bạch': 'taiBach', 'Quan Lộc': 'quanLoc', 'Điền Trạch': 'dienTrach', 'Tử Tức': 'tuTuc', 'Phúc Đức': 'phucDuc', 'Thiên Di': 'thienDi', 'Mệnh': 'menh' };

  function luanChuDe(ls, chuDe, dl) {
    var out = [];
    function cungSau(ten, extra) {
      var c = cungTen(ls, ten);
      out.push(luanCung(ls, c, TRUONG[ten] || 'menh', true));
      var p = phuTinhNoiBat(c, 3); if (p) out.push(p);
      if (extra) out.push(extra);
    }
    if (chuDe === 'tinhduyen') {
      cungSau('Phu Thê');
      var dhc = duyenTheoHoanCanh(ls, dl);
      var gd = (dhc || tuoiNay(dl) > 42) ? '' : giaiDoan(ls, SAO_DUYEN, 18, 42, 'Phu Thê');
      if (dhc) out.push(dhc);
      if (gd) out.push('Nhìn đường đại vận thì duyên tình vượng nhất ' + gd + ', đó là lúc dễ gặp người hợp ý hoặc có tin vui chuyện vợ chồng.');
    } else if (chuDe === 'tientai') {
      cungSau('Tài Bạch');
      cungSau('Điền Trạch');
      var gt = giaiDoan(ls, SAO_TIEN, 22, 60, 'Tài Bạch');
      if (gt) out.push('Tài lộc dễ khởi sắc ' + gt + '; giai đoạn ấy nên mạnh dạn làm ăn, còn lúc vận yếu thì giữ chắc của.');
    } else if (chuDe === 'congdanh') {
      cungSau('Quan Lộc');
      var tdi = cungTen(ls, 'Thiên Di'); out.push(luanCung(ls, tdi, 'thienDi', false));
      var vhc = viecTheoHoanCanh(ls); if (vhc) out.push(vhc);
      var gc = hc(ls).cv === 'nghihuu' ? '' : giaiDoan(ls, SAO_DANH, 22, 58, 'Quan Lộc');
      if (gc) out.push('Công danh dễ lên ' + gc + ', con chuẩn bị bằng cấp, quan hệ từ trước để đón vận.');
    } else if (chuDe === 'giadao') {
      cungSau('Điền Trạch');
      cungSau('Tử Tức');
      var chc2 = conTheoHoanCanh(ls); if (chc2) out.push(chc2);
      var gn = giaiDoan(ls, SAO_NHA, 25, 60, 'Điền Trạch');
      if (gn) out.push('Chuyện nhà cửa an cư thuận nhất ' + gn + '.');
    } else if (chuDe === 'vanhan') {
      out.push(luanNam(ls, dl, true));
    } else {
      cungSau('Phúc Đức');
      cungSau('Thiên Di');
    }
    return out.join('\n\n');
  }

  function nhanXet(d) { return d >= 2 ? 'khá thuận' : d >= 0 ? 'bình bình, giữ được' : 'cần thận trọng hơn mọi năm'; }
  function luanNam(ls, dl, ky) {
    var out = [];
    if (dl.daiVan) {
      var dv = dl.daiVan, x = chinhTinhLuan(ls, dv);
      out.push('Con đang đi đại vận **' + dv.daiVan + ' tuổi** ở cung ' + dv.ten + (x.ds.length ? ', gặp ' + x.ds.map(tenSao).join(', ') : '') + '. Mười năm này nhìn chung ' + nhanXet(diemCung(dv)) + '.');
    }
    var ccNay = L.canChiNam(dl.namAm), tt = cungChi(ls, ccNay.chi);
    var thc = ls.cung.filter(function (c) { return c.tieuHan === CHI[ccNay.chi]; })[0];
    var d = diemCung(tt) + (thc ? diemCung(thc) : 0);
    out.push('Năm ' + dl.namNay + ', Thái Tuế đóng ở cung **' + tt.ten + '**' + (thc ? ', tiểu hạn vào cung **' + thc.ten + '**' : '') + '. Thầy coi năm nay ' + nhanXet(d) + '.');
    if (ky) {
      var tx = chinhTinhLuan(ls, tt);
      if (tx.ds.length) out.push('Sao ' + tx.ds.map(function (s) { return '**' + s.ten + '**'; }).join(', ') + ' chiếu năm nay: ' + tx.ds.map(function (s) { return TB.NGHIA_SAO[s.ten]; }).join('; ') + ', nên việc gì hợp với tính chất ấy thì làm, không hợp thì chờ.');
      out.push(d >= 0 ? 'Năm nay nên chủ động: học thêm, mở rộng quan hệ, việc đã tính kỹ thì làm.' : 'Năm nay nên giữ chắc: tiền bạc chi tiêu cẩn thận, giấy tờ đọc kỹ, lời nói mềm, sức khỏe chăm lo đều đặn.');
    }
    return out.join(' ');
  }


  /* ---------- Tử vi năm theo tuổi (miễn phí, không cần giờ sinh) ---------- */
  var SINH = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  var KHAC = { Kim: 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
  function hanhVoiNam(hTuoi, hNam) {
    if (hTuoi === hNam) return 'Mệnh con cùng hành với năm: năm này con thấy quen tay, việc gì làm theo nếp cũ là thuận, chỉ cần tránh cảnh "hai cái tôi" va nhau.';
    if (SINH[hNam] === hTuoi) return 'Năm sinh cho mệnh con (' + hNam + ' sinh ' + hTuoi + '): năm được trời giúp, làm gì cũng dễ có người nâng đỡ, cơ hội tự tìm đến.';
    if (SINH[hTuoi] === hNam) return 'Mệnh con sinh cho năm (' + hTuoi + ' sinh ' + hNam + '): năm con cho đi nhiều, lo cho người nhà, giúp bạn bè. Vất vả hơn chút nhưng gieo được phúc, giữ sức là được.';
    if (KHAC[hTuoi] === hNam) return 'Mệnh con khắc năm (' + hTuoi + ' khắc ' + hNam + '): việc gì cũng phải tự tay làm mới xong, nhưng làm là được, thành quả là của mình.';
    return 'Năm khắc mệnh con (' + hNam + ' khắc ' + hTuoi + '): năm có áp lực, việc dễ bị thúc ép. Đi chậm mà chắc, giữ sức khỏe, việc lớn tính kỹ thì vẫn qua êm.';
  }
  var QH_LOI = {
    nam: '**Năm tuổi** (phạm Thái Tuế): dân gian dặn năm tuổi nên sống chậm lại, việc lớn bàn kỹ với người nhà. Năm tuổi cũng là năm nhìn lại mình, nhiều người đổi đời đúng năm tuổi.',
    xung: '**Tuổi xung với năm** (tuế phá): năm hay có thay đổi, chuyển chỗ làm, chỗ ở, đi xa. Thay đổi có chủ đích thì thành tốt, đừng để bị động.',
    hai: '**Tuổi hại với năm**: năm dễ gặp người nói một đằng làm một nẻo, hợp tác thì có giấy tờ, tiền bạc rõ ràng.',
    hinh: '**Tuổi hình với năm**: năm dễ vướng chuyện va chạm, giấy tờ, luật lệ. Đi đường cẩn thận, ký gì đọc kỹ.',
    tamHop: '**Tuổi tam hợp với năm**: năm có quý nhân, bạn bè đồng lòng, làm chung với người hợp ý là thuận.',
    lucHop: '**Tuổi lục hợp với năm**: năm có người giúp ngầm, chuyện tình cảm, hôn nhân dễ có tin vui.'
  };
  function dsThang(a) { return a.map(function (t) { return 'tháng ' + t; }).join(', '); }
  /** Bài luận vận năm theo tuổi. ls (tùy chọn): lá số đã lập để thêm lưu niên theo lá số */
  function luanNamTuoi(namSinhAm, gioiTinh, namXem, ls) {
    var cy = L.canChiNam(namSinhAm), cx = L.canChiNam(namXem);
    var tenTuoi = L.ten(cy), tenNam = L.ten(cx);
    var naTuoi = L.napAm(cy.can, cy.chi), naNam = L.napAm(cx.can, cx.chi);
    var sh = L.saoHan(namSinhAm, gioiTinh, namXem), xt = L.xemTuoi(namSinhAm, namXem);
    var qh = L.quanHeChi(cy.chi, cx.chi);
    var tet = L.amSangDuong(1, 1, namXem, false);
    var out = [];
    out.push('Năm **' + tenNam + ' ' + namXem + '** (' + naNam + ') bắt đầu từ Tết Nguyên Đán ' + tet.ngay + '/' + tet.thang + '/' + tet.nam + '. Con tuổi **' + tenTuoi + '**, ' + (gioiTinh === 'nu' ? 'nữ' : 'nam') + ' mạng, năm ấy **' + sh.tuoi + ' tuổi mụ**. Ngồi xuống thầy nói cho nghe.');

    out.push('## Tuổi ' + tenTuoi + ' gặp năm ' + tenNam);
    out.push('Con mệnh **' + naTuoi + '**, năm mệnh **' + naNam + '**. ' + hanhVoiNam(L.hanhCuaNapAm(naTuoi), L.hanhCuaNapAm(naNam)));
    if (qh.length) qh.forEach(function (k) { out.push('- ' + QH_LOI[k]); });
    else out.push('Tuổi con với năm không xung không hợp: năm bình hòa, mình làm tới đâu được tới đó, không bị ai cản cũng không ai cõng.');

    out.push('## Sao chiếu mệnh: ' + sh.sao.ten);
    var giong = sh.sao.tot === true ? 'Đây là **sao tốt**' : sh.sao.tot === false ? 'Đây là sao dân gian xếp vào loại **cần giữ mình**' : 'Đây là sao **nửa tốt nửa xấu**';
    out.push(giong + ': ' + sh.sao.y + '.' + (sh.sao.thangTot.length ? ' Sao này sáng nhất vào ' + dsThang(sh.sao.thangTot) + ' âm lịch, việc tốt nên dồn vào đó.' : '') + (sh.sao.thangXau.length ? ' Các tháng cần chậm lại một nhịp: ' + dsThang(sh.sao.thangXau) + ' âm lịch.' : ''));
    if (sh.sao.tot === false) out.push('Sao xấu không có nghĩa là năm xấu. Biết trước để giữ: nói ít lại một chút, tiền bạc rõ ràng, đi đường cẩn thận. Đầu năm ai muốn đi lễ cầu an cho yên lòng thì đi, nhưng không cần cúng giải tốn kém, làm việc thiện là cách giải tốt nhất.');

    if (sh.han) {
      out.push('## Vận hạn: ' + sh.han.ten);
      out.push('Năm này con gặp hạn **' + sh.han.ten + '**, ' + sh.han.y + '. Hạn là lời nhắc để mình chủ động, giữ được thì năm vẫn trọn vẹn.');
    }

    out.push('## Làm nhà, cưới hỏi năm ' + tenNam);
    var ds = [];
    ds.push('- **Tam Tai:** ' + (xt.tamTai ? 'năm này con **gặp Tam Tai**. Dân gian kiêng khởi sự việc rất lớn; nếu buộc phải làm thì chọn ngày tốt, mượn tuổi người nhà hợp tuổi đứng ra.' : 'không phạm.'));
    ds.push('- **Kim Lâu:** ' + (xt.kimLau ? 'phạm ' + xt.kimLau + '. Cưới hỏi, làm nhà nên cân nhắc, hoặc mượn tuổi.' : 'không phạm, cưới hỏi và làm nhà đều được.'));
    ds.push('- **Hoang Ốc:** ' + xt.hoangOc + (xt.hoangOcXau ? ', làm nhà năm này nên mượn tuổi.' : ', làm nhà được.'));
    out = out.concat(ds);

    if (ls) {
      var nam = TB.duLieuNam(ls, namXem);
      out.push('## Theo lá số của con');
      var dTT = diemCung(nam.thaiTue) + (nam.tieuHan ? diemCung(nam.tieuHan) : 0);
      out.push('Năm ' + tenNam + ', Thái Tuế vào cung **' + nam.thaiTue.ten + '**' + (nam.tieuHan ? ', tiểu hạn vào cung **' + nam.tieuHan.ten + '**' : '') + (nam.daiVan ? ', con đang đi đại vận **' + nam.daiVan.daiVan + ' tuổi** ở cung ' + nam.daiVan.ten : '') + '. Thầy coi năm ấy ' + nhanXet(dTT) + '.');
      var cham = nam.luuNguyet.map(function (t) { return { thang: t.thang, d: diemCung(t.cung), cung: t.cung.ten }; });
      var tot = cham.slice().sort(function (a, b) { return b.d - a.d || a.thang - b.thang; }).slice(0, 3).sort(function (a, b) { return a.thang - b.thang; });
      var giu = cham.slice().sort(function (a, b) { return a.d - b.d || a.thang - b.thang; }).slice(0, 2).sort(function (a, b) { return a.thang - b.thang; });
      out.push('- **Tháng thuận:** ' + tot.map(function (t) { return 'tháng ' + t.thang + ' (cung ' + t.cung + ')'; }).join(', ') + '. Việc lớn, ký kết, ra mắt nên nhắm vào đây.');
      out.push('- **Tháng nên giữ:** ' + giu.map(function (t) { return 'tháng ' + t.thang + ' (cung ' + t.cung + ')'; }).join(', ') + '. Không phải tháng xấu, chỉ là tháng nên làm chắc việc đang có.');
    }

    out.push('## Thầy dặn năm ' + tenNam);
    var dan = [];
    if (sh.sao.thangTot.length) dan.push('Dồn việc lớn vào ' + dsThang(sh.sao.thangTot) + ' âm lịch, lúc sao chiếu mệnh sáng nhất.');
    if (qh.indexOf('xung') >= 0 || qh.indexOf('nam') >= 0) dan.push('Năm có biến động: thay đổi gì thì có kế hoạch, có tiền dự phòng ít nhất vài tháng.');
    if (qh.indexOf('tamHop') >= 0 || qh.indexOf('lucHop') >= 0) dan.push('Năm có quý nhân: chủ động gặp gỡ, nhờ người giúp đúng việc, đừng ngại mở lời.');
    if (sh.han && /tiền|hao tài/.test(sh.han.y)) dan.push('Tiền bạc: không cho vay lớn, không đứng ra bảo lãnh, đầu tư thì chỉ dùng tiền nhàn rỗi.');
    else if (sh.han && /sức khỏe|tinh thần/.test(sh.han.y)) dan.push('Sức khỏe: ngủ đủ, đi khám định kỳ một lần đầu năm cho yên tâm.');
    else if (sh.han) dan.push('Đi đường, giấy tờ, lời nói: chậm một nhịp là đủ an.');
    dan.push('Đầu năm làm một việc thiện nhỏ (giúp người già, góp quỹ từ thiện, phóng sinh có ý thức). Đức năng thắng số, phúc tự sinh ra.');
    dan.forEach(function (d) { out.push('- ' + d); });
    return out.join('\n\n');
  }


  /* ---------- Xem tuổi hợp (miễn phí) ---------- */
  function thayTen(t, A, B) { return String(t).replace(/người thứ nhất/g, A).replace(/người thứ hai/g, B); }
  /** kq: kết quả L.xemHop; A, B: tên gọi hai người */
  function luanHop(kq, A, B) {
    var vc = kq.kieu === 'vochong', out = [];
    out.push(vc ? 'Hai đứa ngồi xuống đây, thầy so tuổi cho. Tuổi chỉ là một phần, phần lớn là ở cách hai đứa thương nhau, nhưng biết trước chỗ hợp chỗ kỵ thì dễ sống với nhau hơn.' : 'Làm ăn chung là chuyện lớn, so tuổi trước cho yên tâm. Tuổi hợp thì thuận buồm, tuổi kỵ thì biết đường mà chia việc cho khéo.');
    out.push('## ' + A + ' và ' + B + ': ' + kq.diem + '/10 điểm, ' + kq.muc.toLowerCase());
    out.push('**' + A + '** tuổi ' + kq.a.canChi + ' (' + kq.a.napAm + ', cung ' + kq.a.cungPhi.ten + '), **' + B + '** tuổi ' + kq.b.canChi + ' (' + kq.b.napAm + ', cung ' + kq.b.cungPhi.ten + ').');
    kq.tieuChi.forEach(function (t) { out.push('- **' + t.ten + '** (' + t.ct + '): ' + t.kq + ', ' + t.diem + '/2 điểm. ' + thayTen(t.giai, A, B)); });
    out.push('## Thầy nói về ' + (vc ? 'đôi này' : 'chuyện hợp tác này'));
    var tot = kq.tieuChi.filter(function (t) { return t.diem === 2; }).map(function (t) { return t.ten.split(' (')[0].toLowerCase(); });
    var yeu = kq.tieuChi.filter(function (t) { return t.diem === 0; });
    if (kq.diem >= 8) out.push(vc ? 'Đôi này hợp tuổi hiếm có. Ở với nhau thấy nhẹ lòng, việc nhà việc ngoài đều dễ bàn. Chỉ cần đừng vì thuận quá mà coi nhẹ nhau.' : 'Hai người hợp tuổi làm ăn, chí hướng gặp nhau, người này bù chỗ thiếu của người kia. Hợp tác được, nhớ vẫn phải có giấy tờ rõ ràng.');
    else if (kq.diem >= 6) out.push(vc ? 'Đôi này khá hợp. Có chỗ hợp, có chỗ phải nhường, như bao cặp vợ chồng hạnh phúc khác. Biết điểm yếu của nhau thì càng ở càng bền.' : 'Khá hợp để làm chung. Phần hợp nên dựa vào, phần kỵ thì chia việc rõ để khỏi giẫm chân nhau.');
    else if (kq.diem >= 4) out.push(vc ? 'Tuổi hai đứa hợp vừa phải. Không phải không lấy được nhau, mà là phải chủ động vun đắp hơn các đôi khác. Thầy thấy nhiều đôi tuổi trung bình mà sống với nhau đến đầu bạc răng long.' : 'Hợp vừa phải. Làm chung được nếu mỗi người giữ một phần việc riêng, chuyện tiền bạc minh bạch từ đầu.');
    else out.push(vc ? 'Tuổi hai đứa có nhiều chỗ khắc. Dân gian xem là phải nhường nhịn nhiều, nhưng tuổi không quyết định tất cả: hai đứa thương nhau thật, chịu nói chuyện với nhau, thì khắc cũng thành bù.' : 'Tuổi có nhiều chỗ khắc. Nếu vẫn muốn làm chung thì nên có người thứ ba đứng giữa, việc gì cũng giấy trắng mực đen.');
    if (tot.length) out.push('Chỗ mạnh của ' + (vc ? 'hai đứa' : 'hai người') + ' nằm ở: ' + tot.join(', ') + '.');
    out.push('## Cách vun đắp');
    var dan = [];
    yeu.forEach(function (t) {
      if (t.id === 'menh') dan.push('Tính hai người khác nhau: người nóng thì nói ít lại, người lặng thì chủ động mở lời. Có chuyện thì để qua đêm rồi hãy nói.');
      if (t.id === 'can') dan.push('Cách nghĩ hay lệch nhau: việc lớn (tiền, nhà, ' + (vc ? 'con cái' : 'vốn liếng') + ') nên viết ra giấy cùng bàn, đừng quyết một mình.');
      if (t.id === 'chi') dan.push('Con giáp có chỗ kỵ: chuyện nhỏ hằng ngày dễ thành to. Mỗi tuần dành một buổi ' + (vc ? 'đi chơi riêng hai đứa' : 'ngồi lại cùng nhau') + ' để nói hết những điều chưa vui.');
      if (t.id === 'phi') dan.push('Cung phi kỵ: dân gian hay chọn hướng nhà, hướng giường, hướng bàn làm việc hợp người chủ chính để hóa giải. Quan trọng hơn là tôn trọng khác biệt của nhau.');
      if (t.id === 'menhPhi') dan.push('Thiên mệnh khắc: chia việc rõ, ai giỏi việc gì người ấy lo, đừng tranh phần của nhau.');
    });
    if (!dan.length) dan.push('Tuổi đã hợp, cứ giữ thói quen tốt: nói lời cảm ơn, nhớ ngày quan trọng của nhau.');
    dan.push(vc ? 'Cưới hỏi thì chọn năm cô dâu không phạm Kim Lâu và ngày hoàng đạo hợp tuổi cả hai (xem ở mục Xem ngày).' : 'Ngày ký kết, khai trương chọn ngày hoàng đạo hợp tuổi cả hai (xem ở mục Xem ngày).');
    dan.forEach(function (d) { out.push('- ' + d); });
    out.push('## Muốn thầy xem kỹ hơn');
    out.push('So tuổi theo năm sinh mới là phần nổi. Có đủ ngày giờ sinh của cả hai, thầy lập hai lá số rồi xem cung Phu Thê, Mệnh, Phúc Đức của từng người soi vào nhau, ' + (vc ? 'năm nào nên cưới, chuyện tiền bạc con cái ai lo phần nào' : 'ai hợp giữ tiền, ai hợp ra ngoài, năm nào nên mở rộng') + '. Lễ tùy tâm.');
    return out.join('\n\n');
  }


  /* ---------- Lời thầy dặn tháng này (theo lưu nguyệt của lá số) ---------- */
  var CUNG_VIEC = {
    'Mệnh': ['bản thân', 'tháng này mọi chuyện xoay quanh chính con: sức khỏe, tinh thần, quyết định của riêng mình'],
    'Phụ Mẫu': ['cha mẹ, giấy tờ', 'tháng hay có việc liên quan cha mẹ, cấp trên, giấy tờ; năng hỏi thăm ông bà cha mẹ'],
    'Phúc Đức': ['phúc phần, họ hàng', 'tháng hợp đi lễ, thăm mộ phần, làm việc thiện, lo việc họ hàng'],
    'Điền Trạch': ['nhà cửa', 'tháng hợp sửa sang, dọn dẹp nhà cửa, bàn chuyện đất đai'],
    'Quan Lộc': ['công việc', 'tháng công việc nổi lên: có việc mới, có người giao trọng trách'],
    'Nô Bộc': ['bạn bè, đồng nghiệp', 'tháng gặp gỡ nhiều, nhờ bạn bè đồng nghiệp được việc, nhưng chọn người mà tin'],
    'Thiên Di': ['đi lại, ra ngoài', 'tháng hay đi lại, ra ngoài gặp cơ hội; đi đường cẩn thận'],
    'Tật Ách': ['sức khỏe', 'tháng nên để ý ăn ngủ, đừng làm quá sức; có gì không khỏe thì đi khám sớm'],
    'Tài Bạch': ['tiền bạc', 'tháng chuyện tiền nong nổi lên: có khoản vào, cũng có khoản ra, ghi chép cẩn thận'],
    'Tử Tức': ['con cái', 'tháng có chuyện vui buồn liên quan con cháu, người nhỏ tuổi; dành thời gian cho con'],
    'Phu Thê': ['tình cảm, vợ chồng', 'tháng chuyện tình cảm được chú ý: người độc thân dễ gặp người hợp ý, vợ chồng nên có thời gian riêng'],
    'Huynh Đệ': ['anh chị em', 'tháng hay có việc với anh chị em, bạn thân; giúp nhau thì được, cho vay thì cân nhắc']
  };
  /** Lời dặn cho tháng âm lịch hiện tại theo lá số. Trả về { tieuDe, text (markdown), ngayTot: [{d, m, y, thu, am}] } */
  function luanThang(ls, homNay) {
    homNay = homNay || new Date();
    var am = L.duongSangAm(homNay.getDate(), homNay.getMonth() + 1, homNay.getFullYear());
    var nam = TB.duLieuNam(ls, am.nam), t = nam.luuNguyet[am.thang - 1], c = t.cung, d = diemCung(c), x = chinhTinhLuan(ls, c);
    var gioi = ls.gioiTinh === 'Nữ' ? 'nu' : 'nam', sh = L.saoHan(ls.am.nam, gioi, am.nam);
    var cv = CUNG_VIEC[c.ten] || ['', ''];
    var out = [];
    out.push('Tháng ' + am.thang + (am.nhuan ? ' nhuận' : '') + ' âm lịch năm ' + nam.tenNam + ', lưu nguyệt vào cung **' + c.ten + '** (' + cv[0] + ')' + (x.ds.length ? ' có ' + x.ds.map(tenSao).join(', ') : '') + '. Thầy coi tháng này ' + (d >= 2 ? 'khá thuận' : d >= 0 ? 'bình bình, giữ được' : 'nên chậm lại một nhịp') + '.');
    out.push(cv[1].charAt(0).toUpperCase() + cv[1].slice(1) + '.' + (x.ds.length ? ' Sao ' + x.ds[0].ten + ' ' + TB.NGHIA_SAO[x.ds[0].ten] + ', việc gì hợp tính chất ấy thì đẩy lên.' : ''));
    if (sh.sao.thangXau.indexOf(am.thang) >= 0) out.push('Tháng này cũng là tháng sao **' + sh.sao.ten + '** chiếu mệnh hay quấy, nên nói ít lại một chút, giấy tờ đọc kỹ.');
    else if (sh.sao.thangTot.indexOf(am.thang) >= 0) out.push('Tháng này sao **' + sh.sao.ten + '** chiếu mệnh sáng nhất, việc tốt nên làm ngay.');
    out.push(d >= 1 ? '**Việc nên làm:** việc thuộc về ' + cv[0] + ' cứ mạnh dạn tiến hành, nhất là vào những ngày tốt dưới đây.' : '**Việc nên làm:** làm chắc việc đang có, việc lớn về ' + cv[0] + ' thì chuẩn bị kỹ, để sang tháng thuận hơn hẵng làm.');
    // ngày tốt còn lại trong tháng âm này
    var tu = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate()), den = new Date(tu); den.setDate(den.getDate() + 30);
    var ngayTot = L.timNgayTot(tu, den, 'kyket', ls.am.nam).filter(function (n) { return n.info.am.thang === am.thang && n.dg.muc === 'Tốt'; }).slice(0, 4)
      .map(function (n) { return { d: n.info.duong.ngay, m: n.info.duong.thang, y: n.info.duong.nam, thu: n.info.duong.thu, am: n.info.am.ngay + '/' + n.info.am.thang }; });
    return { tieuDe: 'Thầy dặn tháng ' + am.thang + ' âm lịch', text: out.join('\n\n'), ngayTot: ngayTot, cung: c.ten, diem: d };
  }

  /** Bản luận miễn phí ghép từ thư viện, không cần AI */
  function luan(ls, chuDe, homNay) {
    var cd = TB.CHU_DE[chuDe] || TB.CHU_DE.tongquan;
    var dl = TB.duLieuLuan(ls, homNay);
    var menh = cungTen(ls, 'Mệnh');
    var out = [];
    var chao = CHAO[(ls.duong.ngay + ls.duong.thang + ls.cung[0].daiVanTu) % CHAO.length], chc = chaoHoanCanh(ls);
    out.push(chc ? chao + ' ' + chc : chao);

    out.push('## Con người và mệnh cách');
    out.push('Con tuổi **' + ls.canChi.nam + '**, bản mệnh **' + ls.banMenh + '**: người mệnh ' + ls.hanhMenh + ' thường ' + HANH[ls.hanhMenh] + '. Cục là ' + ls.cuc + '. ' + (SINH_KHAC[ls.sinhKhac] || '') + ' ' + (ls.amDuongLy === 'Âm dương thuận lý' ? 'Âm dương thuận lý, việc thường thuận chiều, dễ được người giúp.' : 'Âm dương nghịch lý, đôi khi phải đi đường vòng, nhưng nhờ thế mà rèn được bản lĩnh.'));
    out.push(luanCung(ls, menh, 'menh', true));
    var canhMenh = chinhTinhLuan(ls, menh).ds.map(function (s) { return CANH[s.ten]; }).filter(Boolean);
    if (canhMenh.length) out.push('Thầy nói chuyện đời thường cho dễ hình dung: ' + canhMenh[0][0] + ' ' + (canhMenh[1] ? canhMenh[1][0] : canhMenh[0][1]));
    var p = phuTinhNoiBat(menh, 4); if (p) out.push(p);
    var than = ls.cung.filter(function (c) { return c.laThan; })[0];
    if (than && THAN_CU[than.ten]) out.push(THAN_CU[than.ten]);

    out.push('## ' + cd.ten);
    out.push(luanChuDe(ls, chuDe, dl));

    out.push('## Các mặt khác');
    var muc = [['tinhduyen', 'Tình duyên', 'Phu Thê', 'phuThe'], ['tientai', 'Tiền tài', 'Tài Bạch', 'taiBach'], ['congdanh', 'Công danh', 'Quan Lộc', 'quanLoc'], ['giadao', 'Gia đạo', 'Điền Trạch', 'dienTrach']];
    muc.forEach(function (m) {
      if (m[0] === chuDe) return;
      var c = cungTen(ls, m[2]), x = chinhTinhLuan(ls, c);
      var loi = x.ds.length ? x.ds.map(function (s) { return SAO[s.ten][m[3]]; }).join(' ') : 'Cung này không có chính tinh, phải tự mình vun đắp.';
      var them = c.phuTinh.filter(function (s) { return PHU[s.ten] && ['Đào Hoa', 'Hồng Loan', 'Lộc Tồn', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ', 'Thiên Mã', 'Địa Không', 'Địa Kiếp', 'Thiên Khôi', 'Thiên Việt', 'Tả Phù', 'Hữu Bật'].indexOf(s.ten) >= 0; }).slice(0, 2);
      if (them.length) loi += ' Thêm ' + them.map(function (s) { return s.ten + ' (' + PHU[s.ten] + ')'; }).join(', ') + '.';
      var themHc = m[0] === 'tinhduyen' ? duyenTheoHoanCanh(ls, dl) : m[0] === 'congdanh' ? viecTheoHoanCanh(ls) : m[0] === 'giadao' ? conTheoHoanCanh(ls) : '';
      if (themHc) loi += ' ' + themHc;
      out.push('- **' + m[1] + '** (cung ' + m[2] + (x.ds.length ? ' có ' + x.ds.map(function (s) { return s.ten; }).join(', ') + (x.muon ? ' mượn từ cung đối' : '') : '') + '): ' + loi);
    });

    out.push('## Thầy dặn nhanh');
    var dan = [];
    var yeu = chinhTinhLuan(ls, menh).ds.filter(laYeu)[0];
    if (yeu && SAO[yeu.ten]) dan.push(SAO[yeu.ten].ham);
    if (menh.tuan || menh.triet) dan.push('Mệnh gặp ' + (menh.tuan ? 'Tuần' : 'Triệt') + ': tuổi trẻ có trở ngại, đừng nản, càng về sau càng sáng.');
    if (menh.hungTinh.some(function (s) { return ['Kình Dương', 'Hỏa Tinh', 'Linh Tinh'].indexOf(s.ten) >= 0; })) dan.push('Tính hơi nóng, gặp chuyện thì đếm đến mười rồi hãy nói.');
    if (menh.hungTinh.some(function (s) { return ['Địa Không', 'Địa Kiếp'].indexOf(s.ten) >= 0; })) dan.push('Tiền bạc chắc chân rồi hãy bước, đừng đầu tư theo phong trào.');
    var hn = homNay || new Date(), amHn = L.duongSangAm(hn.getDate(), hn.getMonth() + 1, hn.getFullYear());
    var chonThang = function (ds, tu) { return ds.filter(function (t) { return t.thang >= tu; }).map(function (t) { return { thang: t.thang, d: diemCung(t.cung) }; }).sort(function (a, b) { return b.d - a.d || a.thang - b.thang; }).slice(0, 2).sort(function (a, b) { return a.thang - b.thang; }).map(function (t) { return 'tháng ' + t.thang; }); };
    var thangTot = chonThang(dl.luuNguyet || [], amHn.thang + 1), sangNam = '';
    if (thangTot.length < 2) { var nt = TB.duLieuNam(ls, dl.namAm + 1); thangTot = chonThang(nt.luuNguyet, 1); sangNam = ' năm ' + nt.tenNam; }
    if (thangTot.length) dan.push('Việc lớn sắp tới (ký kết, mua sắm, bắt đầu việc mới) thì nhắm vào ' + thangTot.join(' và ') + ' âm lịch' + sangNam + ' cho thuận.');
    dan.push('Sống thật thà, chịu khó học hỏi, năng làm việc thiện. Đức năng thắng số, con ạ.');
    dan.forEach(function (d) { out.push('- ' + d); });

    if (chuDe !== 'vanhan') { out.push('## Vận năm ' + dl.namNay); out.push(luanNam(ls, dl, false)); }

    var nsau = TB.namSauCuaNgay(homNay);
    if (nsau) {
      var ny = dl.namAm + 1, shs = L.saoHan(ls.am.nam, ls.gioiTinh === 'Nữ' ? 'nu' : 'nam', ny), nd = TB.duLieuNam(ls, ny);
      out.push('## Đón năm ' + nsau);
      out.push('Sang năm ' + nsau + ' con ' + shs.tuoi + ' tuổi mụ, sao **' + shs.sao.ten + '** chiếu mệnh (' + shs.sao.y + ')' + (shs.han ? ', hạn **' + shs.han.ten + '**' : '') + '. Theo lá số, Thái Tuế năm ấy vào cung **' + nd.thaiTue.ten + '**, thầy coi năm mới ' + nhanXet(diemCung(nd.thaiTue) + (nd.tieuHan ? diemCung(nd.tieuHan) : 0)) + '. Xem kỹ sao hạn, Tam Tai, Kim Lâu thì vào mục **Theo tuổi** ở thanh dưới, chọn **Vận năm**.');
    }
    out.push('## Bản đầy đủ có gì');
    out.push('Bấy nhiêu mới là phần nổi. Muốn thầy xem kỹ thì gửi lễ: thầy luận từng cung theo tam phương tứ chính, tìm cách cục của lá số, đi qua từng đại vận trong đời, xem vận năm nay và **từng tháng âm lịch**' + (TB.namSauCuaNgay(homNay) ? ', luận riêng **năm ' + TB.namSauCuaNgay(homNay) + '** từng tháng để con đón Tết' : '') + ', rồi dặn con cách hóa giải. Lễ bao nhiêu là tùy tâm con.');
    return out.join('\n\n');
  }

  return { luanThang: luanThang, luanHop: luanHop, luanNamTuoi: luanNamTuoi, luan: luan, SAO: SAO, CAP: CAP, PHU: PHU, CANH: CANH, HN_TEN: HN_TEN, CV_TEN: CV_TEN };
});
