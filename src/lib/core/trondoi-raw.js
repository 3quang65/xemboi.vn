/*
 * trondoi.js — Tử vi trọn đời theo năm sinh và giới tính (không cần giờ sinh, không gọi AI).
 * Lời văn do XemBoi.vn tự soạn theo tính chất can, chi, nạp âm; phần tuổi hợp, tuổi kỵ,
 * năm cưới, năm làm nhà, năm cần giữ mình, hướng hợp đều do máy tính theo công thức.
 * Dùng chung cho trình duyệt (window.TronDoi) và Node (tạo trang tĩnh).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./lich-raw.js'));
  else root.TronDoi = factory(root.Lich);
})(typeof self !== 'undefined' ? self : this, function (L) {
  'use strict';
  L = (L && L.default) ? L.default : L;

  /* ---------- 12 con giáp ---------- */
  var CHI = [
    { // Tý
      tinh: 'Người tuổi Tý nhanh nhạy, tinh ý, nhìn đâu cũng thấy cơ hội. Nói chuyện có duyên, biết lựa lời, nhưng trong lòng ít khi để lộ hết.',
      canh: 'Đi chợ con nhớ chỗ nào rẻ chỗ nào đắt; trong nhóm bạn, con thường là người biết tin tức trước nhất.',
      duyen: 'Trong tình cảm, tuổi Tý chung thủy và lo xa, thích vun vén cho tổ ấm. Có điều hay giữ chuyện trong lòng, nên nói thẳng với người thương thì đỡ hiểu lầm.',
      nghe: 'Hợp việc cần sự nhanh nhạy, tính toán, buôn bán, tài chính, kinh doanh nhỏ mà chắc.',
      dan: 'Đừng ôm nhiều việc cùng lúc chỉ vì thấy chỗ nào cũng có lợi. Chọn một hai việc làm cho thật chắc.'
    },
    { // Sửu
      tinh: 'Người tuổi Sửu chăm chỉ, bền bỉ, nói ít làm nhiều. Đã nhận việc gì là làm đến nơi, ghét nhất sự hời hợt.',
      canh: 'Việc người khác bỏ dở, con lặng lẽ làm nốt; ai nhờ một lần, con nhớ và giúp lâu dài.',
      duyen: 'Tuổi Sửu yêu chậm mà chắc, không giỏi nói lời ngọt nhưng thương thì thương bằng việc làm. Người bạn đời cần hiểu cái tình lặng lẽ ấy.',
      nghe: 'Hợp nghề cần sự bền bỉ, tỉ mỉ: kỹ thuật, nông nghiệp, xây dựng, kế toán, sản xuất, những việc càng làm lâu càng giỏi.',
      dan: 'Bớt cố chấp một chút. Nghe thêm ý người khác không làm mình yếu đi mà còn giúp đi đường tắt.'
    },
    { // Dần
      tinh: 'Người tuổi Dần mạnh mẽ, dám nghĩ dám làm, có khí chất của người dẫn đầu. Thẳng tính, ghét bị ép buộc.',
      canh: 'Thấy chuyện bất bình là con lên tiếng; việc khó người khác né, con lại muốn thử sức.',
      duyen: 'Tuổi Dần yêu nồng nhiệt, che chở người mình thương. Cái tôi hơi lớn, nên khi giận nhớ hạ giọng trước để giữ hòa khí.',
      nghe: 'Hợp vị trí dẫn dắt, tự làm chủ, quản lý, kinh doanh, những nghề cần sự quyết đoán và bản lĩnh.',
      dan: 'Nóng vội dễ hỏng việc lớn. Trước khi quyết, ngủ một đêm cho kỹ rồi hãy làm.'
    },
    { // Mão
      tinh: 'Người tuổi Mão hiền hòa, tinh tế, có óc thẩm mỹ, đi đâu cũng được lòng người. Không thích tranh cãi, chuộng sự êm ấm.',
      canh: 'Nhà con lúc nào cũng gọn gàng, có góc đẹp; bạn bè cãi nhau thường nhờ con đứng giữa nói cho êm.',
      duyen: 'Tuổi Mão lãng mạn, chu đáo trong tình cảm, nhớ từng ngày kỷ niệm. Hay nhường nhịn quá mà tủi, nên điều gì không vui cứ nói nhẹ nhàng.',
      nghe: 'Hợp nghề cần sự khéo léo, thẩm mỹ, giao tiếp: thiết kế, giáo dục, chăm sóc, dịch vụ, ngoại giao.',
      dan: 'Hiền là quý nhưng cần biết nói "không". Giữ ranh giới rõ ràng thì người khác mới tôn trọng mình.'
    },
    { // Thìn
      tinh: 'Người tuổi Thìn có chí lớn, tự tin, nhiều năng lượng, đi đâu cũng nổi bật. Thích làm việc lớn, không chịu sống tầm thường.',
      canh: 'Con hay có ý tưởng lớn giữa bữa cơm; đến chỗ đông người, tự nhiên người ta để ý đến con.',
      duyen: 'Tuổi Thìn yêu hết mình, nhưng đòi hỏi cao ở người bạn đời. Học cách khen nhiều hơn chê thì nhà luôn ấm.',
      nghe: 'Hợp vị trí lãnh đạo, khởi nghiệp, công việc có tầm nhìn, cần sự sáng tạo và dám chịu trách nhiệm.',
      dan: 'Chí lớn cần đi cùng kế hoạch nhỏ. Mỗi năm đặt một mục tiêu cụ thể, làm xong rồi hãy mơ tiếp.'
    },
    { // Tỵ
      tinh: 'Người tuổi Tỵ sâu sắc, điềm tĩnh, suy nghĩ kỹ trước khi làm. Ít nói nhưng nói câu nào chắc câu ấy.',
      canh: 'Người khác còn bàn tán, con đã âm thầm tính xong đường đi nước bước.',
      duyen: 'Tuổi Tỵ yêu sâu và giữ gìn, nhưng hay ghen ngầm. Tin người mình thương thì tình càng bền.',
      nghe: 'Hợp nghề cần suy tính, nghiên cứu, phân tích: tài chính, luật, y dược, chiến lược, nghiên cứu khoa học.',
      dan: 'Đừng để lo nghĩ ăn mất giấc ngủ. Việc gì đã tính kỹ thì cứ yên tâm mà làm.'
    },
    { // Ngọ
      tinh: 'Người tuổi Ngọ phóng khoáng, nhiệt tình, yêu tự do, làm việc nhanh nhẹn. Thẳng thắn, vui vẻ, dễ kết bạn.',
      canh: 'Con là người rủ cả nhóm đi chơi; việc gì cũng muốn làm ngay, chờ đợi lâu là thấy bứt rứt.',
      duyen: 'Tuổi Ngọ yêu nhanh, nhiệt thành, cần người bạn đời cho mình khoảng trời riêng. Có gia đình rồi thì nhớ dành thời gian ở nhà nhiều hơn.',
      nghe: 'Hợp nghề năng động, đi lại nhiều: kinh doanh, bán hàng, truyền thông, du lịch, vận tải, thể thao.',
      dan: 'Làm gì cũng cần có trước có sau. Bắt đầu nhanh thì càng phải giữ sức để về đích.'
    },
    { // Mùi
      tinh: 'Người tuổi Mùi hiền lành, nhân hậu, giàu tình cảm, sống có trước có sau. Khéo tay, có năng khiếu nghệ thuật.',
      canh: 'Ai buồn con ngồi nghe hàng giờ; nhà có giỗ chạp, con là người lo cơm nước chu toàn.',
      duyen: 'Tuổi Mùi chung tình, chăm lo gia đình hết lòng. Hay lo nghĩ cho người khác mà quên mình, nên vợ chồng cần chia sẻ gánh nặng.',
      nghe: 'Hợp nghề cần sự tận tâm, khéo léo: nghệ thuật, ẩm thực, giáo dục, y tế, chăm sóc, thủ công.',
      dan: 'Thương người cũng phải thương mình. Biết từ chối việc quá sức thì mới giữ được sức lâu dài.'
    },
    { // Thân
      tinh: 'Người tuổi Thân thông minh, linh hoạt, hoạt bát, xoay xở giỏi. Học gì cũng nhanh, gặp khó là nghĩ ra cách.',
      canh: 'Đồ trong nhà hỏng con tự sửa được; đến chỗ mới vài hôm là con đã quen hết mọi người.',
      duyen: 'Tuổi Thân vui tính, biết làm người thương cười, nhưng dễ thay đổi khi chán. Giữ chữ tín trong tình cảm thì hạnh phúc dài lâu.',
      nghe: 'Hợp nghề cần sự nhanh trí: kinh doanh, công nghệ, kỹ thuật, marketing, giao tiếp, những việc đổi mới liên tục.',
      dan: 'Thông minh là lợi thế, đừng để thành tật khôn vặt. Làm ăn đường dài thì giữ chữ tín trên hết.'
    },
    { // Dậu
      tinh: 'Người tuổi Dậu chỉn chu, ngăn nắp, có nguyên tắc, chăm chút từng chi tiết. Thẳng thắn, nói được làm được.',
      canh: 'Giấy tờ trong nhà con xếp đâu ra đấy; hẹn giờ nào con đến đúng giờ đó.',
      duyen: 'Tuổi Dậu thương người bằng sự chu đáo, nhưng hay góp ý thẳng nên dễ làm người kia tự ái. Khen trước góp sau thì êm.',
      nghe: 'Hợp nghề cần sự chính xác, kỷ luật: kế toán, hành chính, kỹ thuật, kiểm tra chất lượng, quản lý.',
      dan: 'Không phải ai cũng cầu toàn như mình. Rộng lòng với cái chưa hoàn hảo thì lòng mình cũng nhẹ.'
    },
    { // Tuất
      tinh: 'Người tuổi Tuất trung thành, ngay thẳng, trọng nghĩa, sẵn lòng bảo vệ người yếu. Sống thật, ghét giả dối.',
      canh: 'Bạn bè gặp nạn, con là người có mặt đầu tiên; ai nói xấu người vắng mặt, con không hùa theo.',
      duyen: 'Tuổi Tuất yêu ai là một lòng một dạ, là chỗ dựa vững chắc cho gia đình. Bớt lo xa, bớt nghi ngờ thì nhà vui hơn.',
      nghe: 'Hợp nghề cần sự tận tụy, đáng tin: bảo vệ, công an, quân đội, luật, y tế, công tác xã hội, quản lý nhân sự.',
      dan: 'Lòng tốt cần đặt đúng chỗ. Giúp người nhưng cũng nên xem người ấy có thật lòng không.'
    },
    { // Hợi
      tinh: 'Người tuổi Hợi chân thành, rộng lượng, lạc quan, sống hồn hậu. Không thích mưu mô, được nhiều người quý.',
      canh: 'Con hay mời bạn về nhà ăn cơm; có món ngon thường để phần người khác trước.',
      duyen: 'Tuổi Hợi yêu chân thành, dễ tin người, gặp đúng người thì rất hạnh phúc. Tìm hiểu kỹ trước khi trao lòng là đủ.',
      nghe: 'Hợp nghề cần sự chân thành, phục vụ: ẩm thực, dịch vụ, bán hàng, chăm sóc, nông nghiệp, kinh doanh gia đình.',
      dan: 'Tiền bạc đừng dễ dãi cho vay, đứng ra bảo lãnh. Rộng rãi đúng chỗ thì phúc mới bền.'
    }
  ];
  var CHI_GIOI = {
    nam: ['Đàn ông tuổi Tý khéo lo toan, là trụ cột biết tính đường dài cho cả nhà.', 'Đàn ông tuổi Sửu là bờ vai vững, ít lời mà đáng tin cậy.', 'Đàn ông tuổi Dần có uy, ra ngoài được nể, về nhà nên mềm mỏng hơn.', 'Đàn ông tuổi Mão hiền, chiều vợ thương con, dễ được nhà vợ quý.', 'Đàn ông tuổi Thìn có chí, hợp lập nghiệp lớn, cần người vợ hiểu và đồng hành.', 'Đàn ông tuổi Tỵ trầm tĩnh, biết giữ của, thương gia đình theo cách lặng lẽ.', 'Đàn ông tuổi Ngọ phóng khoáng, nhiều bạn bè, nhớ giữ thời gian cho gia đình.', 'Đàn ông tuổi Mùi hiền hậu, thương vợ con, sống tình cảm với hai bên nội ngoại.', 'Đàn ông tuổi Thân lanh lợi, kiếm tiền giỏi, cần chữ tín để giữ hạnh phúc.', 'Đàn ông tuổi Dậu chu đáo, cẩn thận, lo cho nhà từng việc nhỏ.', 'Đàn ông tuổi Tuất trọng nghĩa, chung thủy, là chỗ dựa vững của vợ con.', 'Đàn ông tuổi Hợi rộng rãi, vui vẻ, nhà có anh là có tiếng cười.'],
    nu: ['Phụ nữ tuổi Tý đảm đang, giỏi vun vén, tiền trong nhà vào tay là giữ được.', 'Phụ nữ tuổi Sửu chịu thương chịu khó, là người giữ lửa bền bỉ của gia đình.', 'Phụ nữ tuổi Dần mạnh mẽ, độc lập, ra ngoài làm việc giỏi không kém ai.', 'Phụ nữ tuổi Mão dịu dàng, khéo léo, nhà cửa qua tay luôn ấm cúng.', 'Phụ nữ tuổi Thìn bản lĩnh, có chính kiến, hợp làm chủ hoặc giữ vị trí quan trọng.', 'Phụ nữ tuổi Tỵ duyên dáng, sâu sắc, biết nhìn người và giữ gìn hạnh phúc.', 'Phụ nữ tuổi Ngọ nhanh nhẹn, vui tươi, việc nhà việc ngoài đều xoay xở được.', 'Phụ nữ tuổi Mùi nết na, thương chồng con, khéo tay hay làm.', 'Phụ nữ tuổi Thân thông minh, tháo vát, kiếm tiền giỏi, nói chuyện có duyên.', 'Phụ nữ tuổi Dậu ngăn nắp, chu toàn, chăm sóc gia đình chu đáo.', 'Phụ nữ tuổi Tuất chung thủy, thẳng thắn, sống hết lòng với người thân.', 'Phụ nữ tuổi Hợi hiền hậu, lạc quan, có phúc với con cái.']
  };

  /* ---------- 10 thiên can ---------- */
  var CAN = [
    { tinh: 'Can Giáp (Mộc dương) cho con tính ngay thẳng, cầu tiến, như cây lớn vươn lên, thích được làm người đi đầu.', nghe: 'Làm việc có tầm, có lộ trình thăng tiến rõ ràng thì con phát huy hết sức.' },
    { tinh: 'Can Ất (Mộc âm) cho con sự mềm mỏng, khéo léo, như dây leo biết tìm chỗ bám mà vươn cao.', nghe: 'Con hợp làm cùng người khác, biết dựa thế mà đi, càng có quan hệ tốt càng lên.' },
    { tinh: 'Can Bính (Hỏa dương) cho con sự nhiệt tình, rạng rỡ, như mặt trời ấm áp, đi đâu cũng mang theo không khí vui.', nghe: 'Con hợp những việc đứng trước đám đông, truyền cảm hứng cho người khác.' },
    { tinh: 'Can Đinh (Hỏa âm) cho con sự tinh tế, ấm áp từ bên trong, như ngọn đèn soi sáng cho người gần mình.', nghe: 'Con hợp việc cần sự tỉ mỉ, chăm chút, đào sâu một lĩnh vực.' },
    { tinh: 'Can Mậu (Thổ dương) cho con sự vững chãi, đáng tin, như núi đất lớn, ai đứng cạnh cũng thấy yên tâm.', nghe: 'Con hợp làm người gánh vác, quản lý, giữ của, xây dựng những thứ lâu bền.' },
    { tinh: 'Can Kỷ (Thổ âm) cho con sự bao dung, thực tế, như ruộng vườn màu mỡ nuôi dưỡng người khác.', nghe: 'Con hợp việc vun trồng lâu dài: giáo dục, chăm sóc, kinh doanh ổn định.' },
    { tinh: 'Can Canh (Kim dương) cho con sự cứng cỏi, quyết đoán, như thanh kiếm, việc gì cũng dứt khoát.', nghe: 'Con hợp việc cần bản lĩnh, kỷ luật, xử lý tình huống khó.' },
    { tinh: 'Can Tân (Kim âm) cho con sự sắc sảo, tinh tế, như trang sức quý, chuộng cái đẹp và sự chỉn chu.', nghe: 'Con hợp việc cần con mắt tinh: tài chính, thẩm định, làm đẹp, thiết kế.' },
    { tinh: 'Can Nhâm (Thủy dương) cho con trí tuệ rộng, ham hiểu biết, như sông lớn, đi xa mới thấy hết tài.', nghe: 'Con hợp việc giao thương, đi lại, làm ăn rộng, càng ra ngoài càng gặp thời.' },
    { tinh: 'Can Quý (Thủy âm) cho con sự nhạy cảm, sâu sắc, như mưa móc thấm dần, hiểu lòng người.', nghe: 'Con hợp việc cần trực giác và sự kiên nhẫn: nghiên cứu, tư vấn, chăm sóc tinh thần.' }
  ];

  /* ---------- 30 nạp âm (theo thứ tự trong lich.js) ---------- */
  var NAP_AM = {
    'Hải Trung Kim': 'vàng trong biển: tài năng ẩn sâu, cần thời gian và cơ hội mới lộ ra. Càng về sau càng sáng',
    'Lô Trung Hỏa': 'lửa trong lò: nhiệt huyết bền bỉ, có lửa nghề, biết rèn mình thành người giỏi',
    'Đại Lâm Mộc': 'cây trong rừng lớn: sống có tập thể, có chỗ dựa, lớn lên vững chãi cùng nhiều người',
    'Lộ Bàng Thổ': 'đất ven đường: chân thành, chịu khó, đi đâu cũng mở đường cho người khác',
    'Kiếm Phong Kim': 'vàng mũi kiếm: sắc sảo, quyết đoán, mài giũa càng nhiều càng sáng',
    'Sơn Đầu Hỏa': 'lửa trên núi: nổi bật, nhiệt tình, được nhiều người biết đến',
    'Giản Hạ Thủy': 'nước khe suối: trong trẻo, khéo léo, chảy chậm mà bền, không bao giờ cạn',
    'Thành Đầu Thổ': 'đất trên thành: vững vàng, có trách nhiệm, là người che chắn cho gia đình',
    'Bạch Lạp Kim': 'vàng chân đèn: hiền hậu, cẩn trọng, tỏa sáng một cách khiêm nhường',
    'Dương Liễu Mộc': 'gỗ cây dương liễu: mềm dẻo, uyển chuyển, gió to cũng không gãy',
    'Tuyền Trung Thủy': 'nước trong giếng: sâu sắc, điềm đạm, là nguồn tin cậy của người thân',
    'Ốc Thượng Thổ': 'đất trên mái nhà: che chở, lo cho tổ ấm, đời gắn với chuyện nhà cửa',
    'Tích Lịch Hỏa': 'lửa sấm sét: mạnh mẽ, bất ngờ, dễ tạo bước ngoặt lớn trong đời',
    'Tùng Bách Mộc': 'gỗ tùng bách: cứng cỏi, chịu đựng, trải gió sương vẫn xanh',
    'Trường Lưu Thủy': 'nước chảy dài: kiên trì, bền bỉ, làm gì cũng đi đường dài',
    'Sa Trung Kim': 'vàng trong cát: giá trị thật lẫn trong đời thường, người tinh mới nhận ra',
    'Sơn Hạ Hỏa': 'lửa dưới chân núi: ấm áp, gần gũi, giữ lửa cho cả nhà',
    'Bình Địa Mộc': 'cây đồng bằng: hiền hòa, dễ gần, mọc ở đâu cũng xanh tốt',
    'Bích Thượng Thổ': 'đất trên vách: kín đáo, cẩn thận, giữ gìn những gì mình có',
    'Kim Bạch Kim': 'vàng pha bạc: sáng giá, sang trọng, biết làm đẹp cho đời',
    'Phú Đăng Hỏa': 'lửa ngọn đèn: soi sáng cho người khác, hợp việc dẫn dắt, dạy dỗ',
    'Thiên Hà Thủy': 'nước trên trời (mưa): rộng lượng, mang lại sinh khí cho muôn nơi',
    'Đại Trạch Thổ': 'đất đầm lầy lớn: bao dung, chứa được nhiều, có phúc về đất đai',
    'Thoa Xuyến Kim': 'vàng trang sức: duyên dáng, tinh tế, được người quý mến',
    'Tang Đố Mộc': 'gỗ cây dâu: siêng năng, nuôi dưỡng người khác, có lộc từ sự chăm chỉ',
    'Đại Khê Thủy': 'nước khe lớn: mạnh mẽ, có sức vượt khó, đi tới đâu mở đường tới đó',
    'Sa Trung Thổ': 'đất pha cát: linh hoạt, thích nghi giỏi, sống được ở nhiều nơi',
    'Thiên Thượng Hỏa': 'lửa trên trời: rạng rỡ, có tầm nhìn, dễ nổi danh',
    'Thạch Lựu Mộc': 'gỗ cây thạch lựu: bền bỉ, sai quả, con cháu đông vui',
    'Đại Hải Thủy': 'nước biển lớn: rộng lượng, nhiều hoài bão, lòng chứa được nhiều'
  };

  /* ---------- Ngũ hành ---------- */
  var HANH = {
    'Kim': { mau: 'trắng, xám, bạc, ánh kim', nghe: 'tài chính, ngân hàng, cơ khí, kim hoàn, luật, quản lý', ky: 'đỏ, hồng, tím', tre: 'Thời trẻ hay phải tự mài giũa, va chạm nhiều mà học được nhiều.', trung: 'Trung niên cứng cáp, có chỗ đứng, tiền bạc dần vững.', hau: 'Hậu vận có của để dành, được con cháu kính nể.' },
    'Mộc': { mau: 'xanh lá, xanh lục', nghe: 'giáo dục, y dược, nông lâm nghiệp, nội thất, thiết kế, xuất bản', ky: 'trắng, xám, bạc', tre: 'Thời trẻ như cây non, cần thầy giỏi bạn tốt để lớn đúng hướng.', trung: 'Trung niên đơm hoa kết trái, công sức bắt đầu thành quả.', hau: 'Hậu vận sum suê, con cháu quây quần.' },
    'Thủy': { mau: 'đen, xanh nước biển', nghe: 'thương mại, vận tải, du lịch, truyền thông, dịch vụ, ngành nước, thủy sản', ky: 'vàng, nâu đất', tre: 'Thời trẻ hay thay đổi chỗ học chỗ làm, đi nhiều biết nhiều.', trung: 'Trung niên gặp thời, làm ăn rộng, quen biết nhiều.', hau: 'Hậu vận an nhàn nếu biết tích lũy từ trung niên.' },
    'Hỏa': { mau: 'đỏ, hồng, cam, tím', nghe: 'điện, năng lượng, ẩm thực, làm đẹp, quảng cáo, giải trí, công nghệ', ky: 'đen, xanh nước biển', tre: 'Thời trẻ sôi nổi, nhiều nhiệt huyết, đôi khi nóng vội.', trung: 'Trung niên rực rỡ nhất, dễ có danh tiếng và địa vị.', hau: 'Hậu vận nên giữ sức khỏe, sống chậm lại thì hưởng phúc lâu.' },
    'Thổ': { mau: 'vàng, nâu đất, cam đất', nghe: 'bất động sản, xây dựng, nông nghiệp, gốm sứ, quản lý, kho vận', ky: 'xanh lá, xanh lục', tre: 'Thời trẻ chịu khó, làm nhiều hưởng ít, nhưng đó là lúc đắp nền.', trung: 'Trung niên vững vàng, có nhà có đất, tiếng nói có trọng lượng.', hau: 'Hậu vận yên ổn, của cải để lại cho con cháu.' }
  };
  var SINH = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  function hanhSinhRa(h) { for (var k in SINH) if (SINH[k] === h) return k; return null; }

  function tenTuoi(nam) { return L.ten(L.canChiNam(nam)); }
  /** Danh sách tuổi hợp / kỵ quanh năm sinh */
  function dsTuoi(nam, gioi, gioiKia, kieu, tu, den) {
    var out = [];
    for (var y = nam + tu; y <= nam + den; y++) {
      if (y === nam && gioiKia === gioi) continue;
      var kq = L.xemHop({ nam: nam, gioi: gioi }, { nam: y, gioi: gioiKia }, kieu);
      out.push({ nam: y, ten: tenTuoi(y), diem: kq.diem });
    }
    return out;
  }
  function moTaTuoi(ds) { return ds.map(function (x) { return x.ten + ' ' + x.nam + ' (' + x.diem + '/10)'; }).join(', '); }
  function noiNam(ds) {
    if (!ds.length) return '';
    return ds.map(function (x) { return x.tuoi + ' tuổi (' + x.nam + ')'; }).join(', ');
  }

  /**
   * Bài tử vi trọn đời.
   * namAm: năm sinh âm lịch; gioi: 'nam' | 'nu'.
   * Trả về { tieuDe, moTa, text (markdown), canChi, napAm, cungPhi, conGiap, slug }
   */
  function luan(namAm, gioi) {
    gioi = gioi === 'nu' ? 'nu' : 'nam';
    var cc = L.canChiNam(namAm), tenCC = L.ten(cc), na = L.napAm(cc.can, cc.chi), hanh = L.hanhCuaNapAm(na);
    var ch = CHI[cc.chi], cn = CAN[cc.can], h = HANH[hanh];
    var huong = L.huongTheoCung(namAm, gioi), cp = huong.cungPhi;
    var tet = L.amSangDuong(1, 1, namAm, false), tetSau = L.amSangDuong(1, 1, namAm + 1, false);
    var cuoiNam = new Date(tetSau.nam, tetSau.thang - 1, tetSau.ngay - 1);
    var gioiTen = gioi === 'nu' ? 'nữ' : 'nam', gioiKia = gioi === 'nu' ? 'nam' : 'nu';
    var out = [];

    out.push('Ngồi xuống đây con. Tuổi **' + tenCC + ' ' + namAm + '**, ' + gioiTen + ' mạng, thầy nói cho nghe chuyện cả một đời: tính nết, duyên phận, công danh, tuổi hợp tuổi kỵ, năm nào nên làm việc lớn. Đây là lời theo năm sinh, ai cùng tuổi cùng giới đều giống nhau; muốn biết riêng mình thì phải lập lá số theo ngày giờ sinh.');

    out.push('## Tổng quan tuổi ' + tenCC + ' ' + namAm);
    out.push('- **Năm sinh dương lịch:** từ ' + tet.ngay + '/' + tet.thang + '/' + tet.nam + ' đến ' + cuoiNam.getDate() + '/' + (cuoiNam.getMonth() + 1) + '/' + cuoiNam.getFullYear() + '. Sinh trước Tết thì thuộc tuổi năm trước.');
    out.push('- **Con giáp:** tuổi ' + L.CHI[cc.chi] + ' (con ' + L.CON_GIAP[cc.chi].toLowerCase() + '), thiên can ' + L.CAN[cc.can] + '.');
    out.push('- **Mệnh:** ' + na + ', hành ' + hanh + '. Hình tượng là ' + NAP_AM[na] + '.');
    out.push('- **Cung phi:** ' + cp.ten + ' (hành ' + cp.hanh + '), thuộc ' + cp.nhom + '.');
    out.push('- **Màu hợp:** ' + h.mau + (hanhSinhRa(hanh) ? ', và ' + HANH[hanhSinhRa(hanh)].mau + ' (hành ' + hanhSinhRa(hanh) + ' sinh ' + hanh + ')' : '') + '. Màu nên hạn chế: ' + h.ky + '.');

    out.push('## Tính cách');
    out.push(ch.tinh + ' ' + cn.tinh);
    out.push('Mệnh ' + na + ' như ' + NAP_AM[na] + '. ' + CHI_GIOI[gioi][cc.chi]);
    out.push('Nói chuyện đời thường cho dễ hình dung: ' + ch.canh);

    out.push('## Tình duyên và gia đạo');
    out.push(ch.duyen);
    var vc = dsTuoi(namAm, gioi, gioiKia, 'vochong', -12, 12);
    var hop = vc.filter(function (x) { return x.diem >= 7; }).sort(function (a, b) { return b.diem - a.diem || Math.abs(a.nam - namAm) - Math.abs(b.nam - namAm); }).slice(0, 6).sort(function (a, b) { return a.nam - b.nam; });
    var ky = vc.filter(function (x) { return x.diem <= 2; }).sort(function (a, b) { return a.diem - b.diem || Math.abs(a.nam - namAm) - Math.abs(b.nam - namAm); }).slice(0, 4).sort(function (a, b) { return a.nam - b.nam; });
    if (hop.length) out.push('- **Tuổi hợp kết duyên:** ' + moTaTuoi(hop) + '.');
    if (ky.length) out.push('- **Tuổi nên tìm hiểu kỹ:** ' + moTaTuoi(ky) + '. Tuổi khắc không có nghĩa là không lấy được nhau, chỉ là cần nhường nhịn nhiều hơn.');
    var cuoi = [];
    for (var t = (gioi === 'nu' ? 18 : 20); t <= 36; t++) { var xt = L.xemTuoi(namAm, namAm + t - 1); if (!xt.kimLau) cuoi.push({ tuoi: t, nam: namAm + t - 1 }); }
    out.push('- **Tuổi đẹp để cưới** (không phạm Kim Lâu, tính theo tuổi mụ' + (gioi === 'nam' ? '; dân gian chủ yếu xét Kim Lâu của cô dâu' : '') + '): ' + noiNam(cuoi.slice(0, 9)) + '.');

    out.push('## Sự nghiệp và tiền bạc');
    out.push(ch.nghe + ' ' + cn.nghe);
    out.push('Theo mệnh ' + hanh + ', những ngành hợp gồm: ' + h.nghe + '.');
    var la = dsTuoi(namAm, gioi, gioi, 'laman', -12, 12).filter(function (x) { return x.diem >= 7; }).sort(function (a, b) { return b.diem - a.diem || Math.abs(a.nam - namAm) - Math.abs(b.nam - namAm); }).slice(0, 5).sort(function (a, b) { return a.nam - b.nam; });
    if (la.length) out.push('- **Tuổi hợp làm ăn, hợp tác:** ' + moTaTuoi(la) + '.');

    out.push('## Các giai đoạn trong đời');
    out.push('- **Thời trẻ:** ' + h.tre);
    out.push('- **Trung niên:** ' + h.trung);
    out.push('- **Hậu vận:** ' + h.hau);
    var nha = [];
    for (var t2 = 25; t2 <= 65; t2++) { var x2 = L.xemTuoi(namAm, namAm + t2 - 1); if (!x2.kimLau && !x2.hoangOcXau && !x2.tamTai) nha.push({ tuoi: t2, nam: namAm + t2 - 1 }); }
    if (nha.length) out.push('- **Tuổi đẹp làm nhà, mua đất** (không Kim Lâu, không Hoang Ốc xấu, không Tam Tai): ' + noiNam(nha.slice(0, 10)) + '.');
    var giu = [];
    for (var t3 = 20; t3 <= 80; t3++) {
      var y3 = namAm + t3 - 1, sh = L.saoHan(namAm, gioi, y3), x3 = L.xemTuoi(namAm, y3), qh = L.quanHeChi(cc.chi, L.canChiNam(y3).chi);
      var saoNang = gioi === 'nu' ? sh.sao.ten === 'Kế Đô' || sh.sao.ten === 'La Hầu' : sh.sao.ten === 'La Hầu' || sh.sao.ten === 'Kế Đô';
      if (saoNang && (x3.tamTai || qh.indexOf('nam') >= 0 || qh.indexOf('xung') >= 0)) giu.push({ tuoi: t3, nam: y3, sao: sh.sao.ten });
    }
    giu = giu.slice(0, 8);
    if (giu.length) out.push('- **Những năm nên sống chậm lại** (sao ' + (gioi === 'nu' ? 'Kế Đô, La Hầu' : 'La Hầu, Kế Đô') + ' gặp Tam Tai hoặc năm tuổi, năm xung): ' + noiNam(giu) + '. Năm như vậy không phải năm xấu, chỉ là năm nên làm chắc, giữ sức khỏe, việc lớn bàn kỹ với người nhà.');

    out.push('## Hướng hợp tuổi');
    out.push('Cung ' + cp.ten + ' thuộc ' + cp.nhom + '. Làm nhà, kê bàn làm việc, đặt giường nên quay về các hướng tốt:');
    huong.tot.forEach(function (x) { out.push('- **' + x.huong + '** (' + x.ten + ')'); });
    out.push('Các hướng nên tránh nếu có thể chọn: ' + huong.xau.map(function (x) { return x.huong + ' (' + x.ten + ')'; }).join(', ') + '.');

    out.push('## Lời thầy dặn tuổi ' + tenCC);
    out.push('- ' + ch.dan);
    out.push('- Mệnh ' + hanh + ' nên gần màu ' + h.mau.split(', ')[0] + ', làm việc lớn thì chọn ngày hoàng đạo hợp tuổi (xem ở mục Xem ngày).');
    out.push('- Mỗi năm có sao hạn khác nhau, xem ở mục **Theo tuổi**, chọn **Vận năm**, để biết năm nay nên làm gì.');
    out.push('- Tuổi chỉ là cái khung, phúc đức và sự chăm chỉ mới là cái nhân. Đức năng thắng số, con ạ.');

    out.push('## Muốn thầy xem riêng cho con');
    out.push('Bấy nhiêu là lời chung cho người cùng tuổi. Mỗi người sinh khác ngày, khác giờ thì lá số khác nhau: sao nào ở cung Mệnh, duyên đến năm nào, tiền vào lúc nào. Con nhập ngày giờ sinh để thầy lập lá số, xem miễn phí phần chính, muốn kỹ hơn thì lễ tùy tâm.');

    var conGiap = L.CON_GIAP[cc.chi].toLowerCase();
    return {
      tieuDe: 'Tử vi trọn đời tuổi ' + tenCC + ' ' + namAm + ' ' + gioiTen + ' mạng',
      moTa: 'Tuổi ' + tenCC + ' ' + namAm + ' ' + gioiTen + ' mạng (mệnh ' + na + ', cung ' + cp.ten + '): tính cách, tình duyên, sự nghiệp, tuổi hợp kết hôn và làm ăn, tuổi đẹp cưới, làm nhà, hướng hợp. Luận giải chi tiết miễn phí tại XemBoi.vn.',
      text: out.join('\n\n'), canChi: tenCC, napAm: na, hanh: hanh, cungPhi: cp.ten, conGiap: conGiap,
      slug: slug(namAm, gioi)
    };
  }
  function boDau(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'); }
  function slug(namAm, gioi) { return boDau(tenTuoi(namAm)).toLowerCase().replace(/\s+/g, '-') + '-' + namAm + '-' + (gioi === 'nu' ? 'nu' : 'nam'); }

  return { luan: luan, slug: slug, boDau: boDau };
});
