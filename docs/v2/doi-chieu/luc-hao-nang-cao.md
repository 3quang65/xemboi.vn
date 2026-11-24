# Khảo sát Lục hào nâng cao: phục thần, dụng thần, vượng suy, ứng kỳ (và vượng suy Mai hoa)

Ngày 24/11/2026. Người làm: Claude Code (agent khảo sát, chỉ đọc web, không sửa mã).
Mục đích: trước khi thêm 4 phần vào `src/lib/trang/luc-hao.ts` và vượng suy vào `src/lib/trang/mai-hoa.ts`, đối chiếu các trang Việt với sách gốc *Tăng san bốc Dịch* (增刪卜易, WS07) và *Mai hoa Dịch số* (梅花易數, WS06), rồi tách phần **tính được theo quy tắc sách** khỏi phần **phải luận**.

**Kết luận ngắn**
- **Phục thần:** các nguồn thống nhất, tính được hoàn toàn. Lấy từ quẻ bát thuần đứng đầu cung, cùng vị trí hào. Đã thử máy: 44/64 quẻ thiếu ít nhất một lục thân, và lục thân thiếu luôn chỉ có **một** vị trí trong quẻ thuần, nên không có trường hợp nhập nhằng.
- **Dụng thần theo việc:** bảng lục thân thống nhất. Riêng hôn nhân, bệnh, kiện tụng, thi cử, thời tiết thì các nguồn có chỗ lệch. Nguyên thần, kỵ thần, cừu thần tính được 100% từ hành.
- **Vượng suy:** bảng theo tháng của sách tính được. Sách **chỉ chia vượng / tướng / còn lại là hưu tù**; các trang Việt dùng 5 bậc (vượng, tướng, hưu, tù, tử), sách không có. Các trang lệch nhau về định nghĩa ám động / nhật phá, về nguyệt phá có hết hay không, và về việc dùng 4 hay cả 12 trạng thái trường sinh.
- **Ứng kỳ:** chỉ in được **các mốc sách nêu** (chi trị, chi xung, chi hợp, xung mộ, điền thực…). Chọn mốc nào, và tính theo ngày hay tháng hay năm, là **luận**, không được tự quyết.
- **Mai hoa, tứ quý:** đã gỡ được. Sách ghi rõ "Khôn, Cấn Thổ vượng ở tháng Thìn Tuất Sửu Mùi", và phần "thời lệnh chi ứng" (複明時令之應) xét theo **chi** của tháng và ngày. Vậy tháng Thìn tính là Thổ, không tính là Xuân/Mộc. Sách chỉ có 2 trạng thái: vượng và suy. Còn một việc phải quyết: chi tháng lấy theo tháng âm lịch hay theo tiết.

---

## 1. Các trang Việt đã đọc

| # | Trang (URL) | Trang làm gì | Sách dẫn | Quy tắc nêu (diễn lại ngắn) |
|---|---|---|---|---|
| 1 | bocdich.com/cac-yeu-to-co-ban-trong-du-doan-luc-hao/ | Bài giảng: bảng dụng thần, nguyên / kỵ / cừu, tiến thần, thoái thần | Không | Thế là mình, Ứng là người. Phụ mẫu: cha mẹ, nhà, xe, giấy tờ, hợp đồng. Quan quỷ: công danh, chồng. Huynh đệ: anh em, bạn. Thê tài: vợ, tiền. Tử tôn: con, thầy thuốc, tăng đạo, súc vật. Nguyên thần sinh dụng thần, kỵ thần khắc dụng thần, cừu thần sinh kỵ thần. Tiến thần có **Tuất→Sửu**, thoái thần có **Sửu→Tuất** (sách không có, xem §4.6). |
| 2 | bocdich.com/luc-hao-dung-than-luong-hien/ | Dụng thần xuất hiện hai lần | Có, dẫn "《Tăng》" | Thứ tự chọn: hào động trước; sau đó hào tuần không hoặc nguyệt phá; rồi hào gặp xung hoặc hợp; rồi hào lâm Thế hoặc Ứng; rồi hào lâm nhật nguyệt hoặc gần Thế; cuối cùng xét lục thần. |
| 3 | vuphac.com/khong-vong-trong-du-doan-luc-hao/ | Tuần không | Không | Hào không mà vượng, động, hoặc được nhật nguyệt hay hào động sinh thì vẫn có lực. Hào tĩnh hưu tù thì không thật. Có ba cách hết không: thực không (ngày hoặc tháng trùng chi), xung không, xuất không (sang tuần mới). Ví dụ ứng vào ngày xuất không. |
| 4 | vuphac.com/ung-ky-trong-du-doan-luc-hao/ | 20 quy tắc ứng kỳ, đánh số | Không (nội dung gần như trùng chương XX *Lục hào bảo điển*, dòng 5) | Tĩnh: chờ chi trị hoặc chi xung. Động: chờ chi trị hoặc chi hợp. Quá vượng: việc cát chờ nhập mộ, việc hung chờ lúc được sinh. Nhập mộ: chờ xung mộ. Gặp hợp: chờ xung. Nguyệt phá: chờ hợp, trị, hoặc tháng sau. Không vong: chờ trị hoặc xung. Phục tàng: chờ xung phi thần hoặc phục thần. Độc phát, độc tĩnh… |
| 5 | phanmem.tuvihuyenbi.com/truyen/luc-hao-bao-dien/ (bản dịch *Lục hào bảo điển*, trang không ghi tác giả; thường biết là của Vương Hổ Ứng) | Sách dịch, chia chương: IX dụng thần, phi phục; XI suy vượng; XII 12 trạng thái; XIII ám động, nhật phá; XX ứng kỳ | Bản thân là sách | Phục thần lấy từ "bản cung". Đánh giá phi và phục: phi sinh phục tốt; phục sinh phi là tiết; **phục khắc phi là xuất bạo, coi là tốt**; phi khắc phục xấu nhất. Tháng tính theo **tiết khí**. Nguyệt phá chỉ có hiệu lực trong tháng. Hào bị phá mà vượng và động thì vẫn có lực. **Dùng cả 12 trạng thái trường sinh** và cho rằng chỉ dùng 4 là "sai". Ám động: tĩnh, được tháng sinh phù / tỷ hòa / hợp / trường sinh, hoặc được hào động sinh, rồi bị nhật xung. |
| 6 | hocvienlyso.org/ban-ve-hao-am-dong.html | Ám động | Nhắc *Mai hoa* và Kinh Phòng, không nhắc Tăng san | Ám động là hào tĩnh, vượng tướng, **được hào động sinh**, bị nhật thần xung. Coi ám động như một loại thần sát. |
| 7 | xemboituvi.vn/nhat-than-la-gi | Nhật thần | Không (tác giả Lâm Huyền Cơ) | Nhật thần làm chủ sáu hào, vượng cả bốn mùa. Hào tĩnh vượng bị xung thì ám động, tĩnh hưu tù bị xung thì nhật phá. Xung hào không thì hết không, xung hào hợp thì mở hợp. Xung tán hiếm, khoảng 1–2 trên 100 (trùng ý chương Nhật thần của Tăng san nhưng không dẫn). |
| 8 | dodinhtruat.com/chu-dich-gia-tri-cua-nhat-nguyet/ | Nhật nguyệt | Không | Nguyệt kiến sinh, hợp, tỷ, phò thì hào mạnh lên; xung, khắc, hình, phá thì hào yếu đi; nguyệt xung là phá, hào vô dụng. Nhật xung hào tĩnh vượng là ám động, hào tĩnh suy là nhật phá. Hợp mà gặp nhật xung thì mở. |
| 9 | lyso.vn/xem-que/ung-ki-trong-boc-phe-t2531/ (diễn đàn) | Ứng kỳ | **Tăng san bốc Dịch, bản dịch Vĩnh Cao** | Đại tượng cát mà bị khắc: chờ lúc thần khắc bị khắc. Nhập mộ: chờ xung mộ. Động: chờ trị hoặc hợp. Quá vượng: chờ mộ hoặc xung. Tuần không: chờ điền thực. Thành viên còn tranh luận chọn dụng thần khi xem hộ người khác: lấy Ứng hay theo quan hệ. |
| 10 | votranh.com/hop-xung-cua-hao/ (Bài 13) | Hợp, xung | Không | Hào được nhật hoặc nguyệt hợp thì mạnh thêm nửa bậc. Hào động bị nhật hoặc nguyệt hợp thì tạm ngừng động, chờ ngày xung (trừ hào bị phá). Hai hào động xung nhau thì việc chia hai giai đoạn. |
| 11 | thayungkhiem.vn/lap-mai-hoa-dich-so | **Có tính máy** quẻ Mai hoa và vượng suy | Không | Bảng 5 bậc. Xuân (tháng 1–2): Mộc vượng, Hỏa tướng, Thủy hưu, Kim tù, Thổ tử… **Tứ quý tháng 3, 6, 9, 12**: Thổ vượng, Kim tướng, Hỏa hưu, Mộc tù, Thủy tử. Chỉ áp cho thể quái. |
| 12 | vatphamphongthuy.com/du-doan-theo-mai-hoa-dich-so-phan-ii-luan-doan.html | Luận Mai hoa | Không | Tứ quý là tháng 3, 6, 9, 12, Thổ vượng, tốt cho Cấn và Khôn. Xét vượng suy cho cả thể lẫn dụng. |
| 13 | lovingfamily.ucoz.com/forum/12-2303-1 (diễn đàn VNTamTay) | Mai hoa | Không | Theo mùa: Xuân thì Chấn, Tốn vượng và Khôn, Cấn suy… Theo **chi ngày hoặc tháng**: Thìn Tuất Sửu Mùi thì Thổ vượng, Thủy suy; Dần Mão thì Mộc vượng, Thổ suy… Đúng như sách (§5). |
| 14 | horos.vn/blog/post/mai-hoa-dich-so-la-gi-… | Mai hoa | Không | Chỉ so hành của tháng âm với hành của thể (tháng sinh thể, tháng khắc thể). Không có bảng, không nói tứ quý. |

Không đọc được: phongthuykybach.com (không phân giải tên miền), phongthuyanthinh.com.vn (không phân giải tên miền), tuvi.cohoc.net (trả về trang chặn), kinhdich.khosachquy.com (403), ikinhnghiem.com (trang rỗng). tuvilyso.org không hiện trong kết quả tìm kiếm; diễn đàn lyso.vn đứng thay.

**Nhận xét chung:** chỉ hai trang dẫn Tăng san (bocdich lưỡng hiện, lyso.vn ứng kỳ). Phần lớn quy tắc ứng kỳ và phi phục trên các trang Việt đi theo *Lục hào bảo điển* hoặc sách hiện đại, có chỗ khác Dã Hạc. Trang mình theo Tăng san nên **in quy tắc từ sách**, còn các chỗ lệch thì ghi chú, không trộn vào.

---

## 2. Vị trí trong sách gốc (Wikisource) để rút đoạn từ DB

Gốc: https://zh.wikisource.org/wiki/增刪卜易 (Textquality 50%, bản chép chưa hiệu đính). **Quyển 1 có trang con** `/1`…`/26又4`. **Quyển 2–4 không có trang con**: chữ nằm thẳng trên trang chính, sau mục `== 增刪卜易卷之二 ==`. Cần kiểm DB `rag_nguon 94` đã nạp phần này chưa. Sổ `12-thu-vien-rag.csv` ghi "quyển 3–4 thiếu", nhưng trang chính thực ra có chữ của nhiều chương quyển 2–4, ví dụ chương Cầu tài, Hôn nhân, Bệnh tật. Phần "原劍增訂說明" (gồm 生旺墓絕, 天乙, 反吟伏吟) là **người nhập liệu viết thêm**, không phải lời sách; không trích như lời sách.

| Chủ đề | Chương (Hán-Việt) | URL | Dấu tìm (ngắn) | doanId đã biết |
|---|---|---|---|---|
| Dụng thần theo lục thân | Dụng thần chương đệ bát (用神章第八) | …/增刪卜易/8 | 父母爻爲用神 · 子孫爻爲制鬼之神 | ? |
| Nguyên, kỵ, cừu thần | Dụng thần nguyên thần kỵ thần cừu thần chương đệ cửu | …/增刪卜易/9 | 仇神者克元神而生忌神 | 23860, 23861 |
| Nguyên thần, kỵ thần có lực hay không | Nguyên thần kỵ thần suy vượng chương đệ thập | …/增刪卜易/10 | 元神能生用神者有五 · 忌神雖動不能克用神者有七 | ? |
| Động tĩnh sinh khắc | Động tĩnh sinh khắc chương đệ thập tứ | …/增刪卜易/14 | 旺相者有力之人 | ? |
| Hào biến chỉ tác động hào gốc của nó | Động biến sinh khắc xung hợp chương đệ thập ngũ | …/增刪卜易/15 | 變出之爻能生克沖合本位之動爻 | ? |
| **Vượng tướng theo tháng** | Tứ thời vượng tướng chương đệ hựu thập ngũ | …/增刪卜易/15又 | 正二月木爲旺 · 其餘俱作休囚 | ? |
| **Nguyệt kiến** | Nguyệt tướng chương đệ thập lục | …/增刪卜易/16 | 月合有用 · 爻逢月破而無功 · 卦無用神卽以月建爲用神 | ? |
| **Nhật thần** | Nhật thần chương đệ thập thất | …/增刪卜易/17 | 日辰爲六爻之主宰 · 沖空卽起，沖合卽開 | 23877 |
| **Ám động, nhật phá** | Ám động chương đệ nhị thập nhị | …/增刪卜易/22 | 靜爻旺相日辰沖之爲暗動 | 23887, 23891 |
| Động tán | Động tán chương đệ nhị thập tam | …/增刪卜易/23 | 旺相者沖之不散 | ? |
| Quẻ biến: sinh khắc, mộ, tuyệt | Quái biến sinh khắc mộ tuyệt chương đệ nhị thập tứ | …/增刪卜易/24 | — | ? |
| Tuần không | Tuần không chương đệ nhị thập lục | …/增刪卜易/26 | 月破為空 · 旺動不為空 | 23899 |
| **Sinh vượng mộ tuyệt** | Sinh vượng mộ tuyệt chương đệ hựu nhị thập lục | …/增刪卜易/26又1 | 只驗生旺墓絕 · 土寄生於申 | ? |
| Định nghĩa thuật ngữ (vượng, tam mộ, chủ tượng) | Các môn loại đề đầu tổng chú chương | …/增刪卜易/26又2 | 三墓 · 主象 | ? |
| **Ứng kỳ** | Các môn loại ứng kỳ tổng chú chương | …/增刪卜易/26又3 | 靜而逢值逢沖 · 動而逢合逢值 | ? |
| Nguyệt phá | Nguyệt phá chương đệ nhị thập thất | trang chính, quyển 2 | 月建沖之爲月破 · 出月則不破 | ? |
| **Phục thần** | Phi phục thần chương đệ nhị thập bát | trang chính, quyển 2 | 本宮首卦尋之 · 伏神有用者有六 · 伏神終不得出者有五 | ? |
| Tiến thần, thoái thần | Tiến thần thoái thần chương đệ nhị thập cửu | trang chính, quyển 2 | 亥化子，寅化卯 | ? |
| Tùy quỷ nhập mộ, độc phát, lưỡng hiện | Chương 30, 31, 32 | trang chính, quyển 2 | 兩現章 | ? |
| Thời tiết (dụng thần) | Thiên thời chương đệ tam thập ngũ | trang chính, quyển 2 | 子孫爲日月星斗 · 父母爲雨雪霧霜 · 兄弟爲風雲 | ? |
| Thi cử | Đồng thí chương đệ tứ thập cửu (và Cầu danh chương 48) | trang chính, quyển 3 | 父旺官興 | ? |
| Cầu tài | Cầu tài chương đệ lục thập bát | trang chính, quyển 3 | 公私占卜皆以財爲用神 | ? |
| Hôn nhân | Hôn nhân chương (第八十二) | trang chính, quyển 4 | 男家占女…以財爲用 · 女家占男，皆以官爲用 | ? |
| Vợ chồng | Phu phụ chương đệ tứ thập tam | trang chính, quyển 3 | 占妻財爻爲重，應爻次之 | ? |
| Xuất hành | Xuất hành chương (第九十一) | trang chính, quyển 4 | 世爲出行人 · 應爲地頭 | ? |
| Người đi xa | Hành nhân chương đệ cửu thập tứ | trang chính, quyển 4 | 疏者以應爻爲用神 | ? |
| Kiện tụng | Hưng từ cử tụng chương đệ cửu thập thất | trang chính, quyển 4 | 官父同興公庭有理 | ? |
| Bệnh tật | Tật bệnh chương đệ cửu thập cửu | trang chính, quyển 4 | 自占病，世爲用神 | ? |

Mai hoa: https://zh.wikisource.org/wiki/梅花易數/卷一 (mục **卦氣旺**, **卦氣衰**); `/卷二` (mục **衰旺論**, **八卦心易體用訣**, **複明時令之應**); `/卷三` (mục **體用衰旺之訣**, **日應** trong "論事十大應").

---

## 3. Phục thần (伏神)

### 3.1. Quy tắc lấy (các nguồn thống nhất, sách nói rõ)

| Bước | Quy tắc | Nguồn |
|---|---|---|
| 0 | Nếu lục thân cần làm dụng thần **không có trong 6 hào quẻ chính**: trước hết xét **chi tháng và chi ngày**. Chi nào mang đúng hành của lục thân ấy thì lấy nhật hoặc nguyệt làm dụng thần, **không cần tìm phục**. | Tăng san ch.28 (若用神不現，卽以日月爲用神); ch.16 (卦無用神卽以月建爲用神，不必尋伏神) |
| 1 | Nếu nhật nguyệt không mang hành ấy: tìm trong **quẻ đứng đầu cung (bát thuần) của quẻ**, vì quẻ thuần đủ 5 lục thân. | Tăng san ch.28 (本宮首卦); Bảo điển IX; các trang Việt |
| 2 | Lục thân ấy nằm ở hào thứ *n* của quẻ thuần thì **phục dưới hào thứ *n*** của quẻ chính. Hào của quẻ chính ở vị trí đó gọi là **phi thần**. | Ví dụ sách: Thiên Phong Cấu (cung Càn) thiếu Thê tài, nên Dần Mộc Thê tài ở hào 2 quẻ Càn phục dưới Hợi Thủy hào 2 quẻ Cấu. Thiên Sơn Độn thiếu Tử tôn, nên Tý Thủy hào 1 quẻ Càn phục dưới Thìn Thổ hào 1. |
| 3 | Lục thân của phục thần tính theo hành cung. Quẻ thuần và quẻ chính cùng cung nên kết quả như nhau. | Hệ quả của ch.5 |
| (ngoại lệ) | *Hoàng Kim Sách*, được Dã Hạc dẫn: hào chính và **hào biến** đều không có dụng thần thì mới tìm phục. Nếu hào biến có thì dùng hào biến. | Tăng san ch.28, đoạn ví dụ quẻ Khốn biến Đoài |
| (bác bỏ) | Phép cũ: nếu dụng thần trong quẻ thuần lại không hoặc phá thì sang cung khác tìm (乾坤來往). Dã Hạc **bác**. | ch.28 |

**Ý riêng của Dã Hạc, các trang Việt không nhắc:** ông thường **không dùng phục thần** mà gieo thêm quẻ khác cho dụng thần hiện ra (予於用神不現，卽有伏神亦不用之). Trang mình vẫn an phục được, nhưng nên in kèm câu này như lời sách.

### 3.2. Đã kiểm bằng máy (Python, theo đúng thuật dựng cung của `luc-hao.ts`)
- **44/64 quẻ** thiếu ít nhất một lục thân; 20 quẻ đủ cả năm.
- Cả 8 quẻ bát thuần đều đủ 5 lục thân.
- Lục thân bị thiếu **luôn chỉ xuất hiện một lần** trong quẻ thuần của cung, nên mỗi lục thân thiếu chỉ có một vị trí phục, không phải chọn.
- Kết quả khớp hai ví dụ sách: Cấu thiếu Tài ở hào 2; Độn thiếu Tài ở hào 2 và Tử tôn ở hào 1.
- Gợi ý test: dùng hai ví dụ trên, cùng quẻ Sơn Hỏa Bí (sách: Phụ mẫu Ngọ Hỏa phục dưới hào 2 Sửu Thổ) và Địa Lôi Phục (Phụ mẫu Tỵ Hỏa phục dưới hào 2 Dần Mộc).

### 3.3. Cách in
Phần mềm Trung Quốc và Việt Nam thường có một cột "Phục thần" bên trái hào phi, ghi "Lục thân + chi + hành", ví dụ "Thê tài Dần Mộc", ngang hàng hào phi. Sách in quẻ thuần riêng rồi nói bằng lời "phục ở hào 2 dưới Hợi Thủy". Chỉ in phục cho **các lục thân thiếu**. Không in phục cho mọi hào.

### 3.4. Phục thần có dùng được không: sách liệt kê điều kiện, nhưng kết luận là luận

| Tăng san ch.28: **6 trường hợp phục thần dùng được** | Tăng san ch.28: **5 trường hợp không ra được** |
|---|---|
| 1. được nhật hoặc nguyệt sinh | 1. phục hưu tù vô khí |
| 2. phục vượng tướng | 2. bị nhật hoặc nguyệt xung khắc |
| 3. được phi thần sinh (飛來生伏) | 3. bị phi thần vượng tướng khắc |
| 4. được hào động sinh | 4. mộ hoặc tuyệt ở nhật, nguyệt, hoặc hào phi |
| 5. nhật, nguyệt hoặc hào động xung khắc phi thần | 5. phục hưu tù lại gặp tuần không hoặc nguyệt phá |
| 6. phi thần gặp không, phá, hưu tù, mộ, tuyệt | |

Mỗi điều kiện trên đều **kiểm được bằng máy** (sinh, khắc, xung, mộ, tuyệt, không, phá, vượng theo tháng). Trang có thể in thành bảng tích "điều kiện nào thỏa". **Không được in "phục thần hữu dụng nên cát"**: sách tự nói phục tuần không thì chờ ngày xuất không, nên cát hay hung tùy việc.

**Chỗ các trang lệch nhau: phục khắc phi.** *Bảo điển* gọi là "xuất bạo", coi là tốt. Kết quả tìm kiếm cho thấy có trang gọi là "vô sự", có trang "mạnh dạn hành động", có trang "hung tới nhanh". Tăng san **không xếp hạng** phục khắc phi. Trang mình chỉ nên in nhãn quan hệ (phi sinh phục, phi khắc phục, phục sinh phi, phục khắc phi, tỷ hòa), không đánh giá.

---

## 4. Vượng suy (旺衰)

### 4.1. Theo tháng (nguyệt kiến): bảng sách (ch. 15又). Tính được

| Chi tháng | Vượng | Tướng | Ghi chú của sách |
|---|---|---|---|
| Dần, Mão | Mộc (chi trùng tháng mạnh nhất, chi Mộc kia đứng thứ) | Hỏa | các hành còn lại "hưu tù" |
| **Thìn** | Thổ (Thìn mạnh nhất; Sửu, Mùi đứng thứ) | Kim | "tướng tuy không vượng vẫn còn dư khí" |
| Tỵ, Ngọ | Hỏa | Thổ | |
| **Mùi** | Thổ (Mùi; Thìn, Tuất đứng thứ) | Kim | "Hỏa tuy suy còn dư khí" |
| Thân, Dậu | Kim | Thủy | |
| **Tuất** | Thổ (Tuất; Sửu, Mùi đứng thứ) | Kim | |
| Hợi, Tý | Thủy | Mộc | |
| **Sửu** | Thổ (Sửu; Thìn, Tuất đứng thứ) | Kim | "Thủy tuy suy còn dư khí" |

- **Sách chỉ có 3 bậc:** vượng, tướng, và "hưu tù" gộp chung. Bảng 5 bậc (vượng, tướng, hưu, tù, tử) trên các trang Việt (thayungkhiem; phần lớn bài lục hào) là lý ngũ hành chung, **không có trong chương này**. Nếu trang muốn in 5 bậc thì phải ghi rõ nguồn khác. Đề xuất: in đúng 3 bậc của sách.
- Ghi chú "dư khí" ở tháng Thìn trỏ vào **Kim (tướng)**, còn ở Mùi và Sửu trỏ vào **hành của mùa trước** (Hỏa, Thủy); tháng Tuất không ghi. Có thể bản chép lệch. Cần đối với bản quét AR16 trước khi in.
- Tháng lấy theo **tiết**: lib hiện dùng `thoiGianAnQue` theo trụ tháng Bát tự; *Bảo điển* cũng nói rõ tính theo tiết. Các trang Việt không ai cãi điểm này.

### 4.2. Nguyệt kiến tác động lên hào (ch.16). Tính được nhãn, kết luận là luận
- Tháng **sinh, hợp, tỷ (trùng chi), củng, phù** thì hào yếu được nâng. Tháng **xung, khắc, hình, phá** thì hào mạnh bị hạ.
- **Nguyệt hợp** (chi tháng hợp chi hào) thì hào có tác dụng. **Nguyệt xung là nguyệt phá**, lib đã có.
- Hào trùng chi tháng mà vẫn ở trong tuần không thì **vẫn là không**. Dã Hạc bác thuyết "gặp không mà không không"; nhiều sách khác lại cho lâm nguyệt thì không bị không.

### 4.3. Nhật thần (ch.17). Tính được
- Nhật thần **vượng cả bốn mùa**, quyền ngang nguyệt kiến.
- Nhật **sinh, phù, hợp, củng** hào thì có lợi; nhật **khắc, hình, xung** thì có hại.
- Hào **trùng chi ngày** thì "gặp phá mà không phá". Ví dụ sách: tháng Dậu ngày Mão, hào Mão không bị phá.
- **Xung không thì không thành thực** (沖空則實). **Xung hợp thì hợp mở** (沖合則散 / 沖合卽開).
- **Xung tán:** Dã Hạc gần như không nhận; ông nói hào hưu tù "trăm trường hợp mới có một, hai" (ch.17, ch.23). Các sách khác (*Dịch mạo*) coi trọng xung tán. Trang không nên in nhãn "xung tán".
- Phần "tổng chú" định nghĩa: **vượng** là đế vượng ở nhật hoặc nguyệt; **tỷ** là trùng chi; **phù, củng** là cùng loại; **mộ, tuyệt** là mộ hoặc tuyệt ở nhật nguyệt.

### 4.4. Ám động, nhật phá (ch.22). Tính được nhưng phải chốt định nghĩa "vượng"
- **Sách:** hào tĩnh, vượng tướng, bị nhật xung thì **ám động**; hào tĩnh, hưu tù, bị nhật xung thì **phá** (nhật phá).
- **Các trang lệch nhau ở cách hiểu "vượng":**
  - hocvienlyso: phải **được hào động sinh** nữa;
  - *Bảo điển*: vượng xét theo **tháng** (được tháng sinh phù, tỷ, hợp, trường sinh) hoặc được hào động sinh;
  - Tăng san ch.26又2 định nghĩa vượng rộng: lâm nhật nguyệt; được nhật, nguyệt, hào động, hào biến sinh phù; trường sinh hoặc đế vượng.
- **Đề xuất cho máy:** "vượng" xét theo **tháng** (vượng hoặc tướng theo bảng 4.1, hoặc nguyệt sinh, hoặc nguyệt hợp), cộng thêm **hào động sinh**. Không xét nhật, vì nhật chính là cái xung. Đây là **một lựa chọn cần anh duyệt**; in kèm câu sách.
- Hào **động** bị nhật xung thì sách **không gọi là ám động** (ám động chỉ dành cho hào tĩnh) và cũng không nhận là tán (ch.23).

### 4.5. Sinh vượng mộ tuyệt (ch.26又1). Tính được

| Hành | Trường sinh | Đế vượng | Mộ | Tuyệt |
|---|---|---|---|---|
| Kim | Tỵ | Dậu | Sửu | Dần |
| Mộc | Hợi | Mão | Mùi | Thân |
| Hỏa | Dần | Ngọ | Tuất | Hợi |
| Thủy | Thân | Tý | Thìn | Tỵ |
| **Thổ** | **Thân** (sách: "Thổ ký sinh ở Thân", đi theo Thủy) | Tý | Thìn | Tỵ |

- **Chỗ lệch 1: dùng mấy trạng thái.** Dã Hạc **chỉ dùng 4** (只驗生旺墓絕). *Bảo điển* dùng đủ 12 và gọi việc chỉ dùng 4 là "hiểu sai". Theo sách, trang chỉ in 4.
- **Chỗ lệch 2: Thổ.** Sách theo Thân. Thuyết khác cho Thổ trường sinh ở Dần, đi theo Hỏa; Lý Ngã Bình có nhắc. *Bảo điển* cũng theo Thân. Hàng Hỏa trong bảng là thứ tự chuẩn; trang chương không liệt kê riêng Hỏa, cần đối khi rút đoạn.
- Áp cho: **nhật** (hào trường sinh, vượng, mộ, tuyệt ở ngày); **hào động hóa** (hóa trường sinh, hóa vượng, hóa mộ, hóa tuyệt). Ch.26又2 định nghĩa **tam mộ**: nhập nhật mộ, nhập mộ hào động, động hóa mộ. Sách bỏ thuyết cũ "thế mộ, thân mộ, mệnh mộ".

### 4.6. Tiến thần, thoái thần (ch.29). Tính được, có lệch
- Sách liệt kê **7 cặp tiến**: Hợi→Tý, Dần→Mão, Tỵ→Ngọ, Thân→Dậu, Sửu→Thìn, Thìn→Mùi, Mùi→Tuất. Thoái là 7 cặp ngược lại.
- bocdich.com thêm **Tuất→Sửu** (tiến) và **Sửu→Tuất** (thoái). Bản Wikisource **không có** hai cặp này. Cần đối bản quét AR16 trước khi quyết.

### 4.7. Hồi đầu sinh, hồi đầu khắc (ch.15). Tính được
Hào biến chỉ sinh, khắc, xung, hợp **hào động gốc của nó**; hào khác không tác động lên hào biến; chỉ nhật nguyệt tác động được lên hào biến.

### 4.8. Nguyệt phá (ch.27). Nhãn tính được, "còn phá hay hết" là luận
- Các trang và sách cũ: hào bị phá thì vô dụng ("cây khô rễ").
- **Dã Hạc sửa lại:** hào bị phá mà **động** vẫn gây tác dụng. Phá hết khi **ra tháng**, vào **ngày thực phá** (trùng chi) hoặc **ngày hợp**. Chỉ hào tĩnh không có ai sinh trợ mới "phá đến cùng".
- *Bảo điển*: phá chỉ hiệu lực trong tháng; hào phá mà vượng và động vẫn có lực.
- Máy in được: "nguyệt phá (tháng X xung)", và các mốc "hết phá theo sách" là chi trùng hào và chi hợp hào. Không in "vô dụng".

### 4.9. Tuần không (ch.26 và ch.16). Lib đã có nhãn; thêm phân loại theo sách
- **Không tính là không:** hào vượng, hào động, hào có nhật hoặc hào động sinh phù, hào động hóa không, phục mà vượng tướng.
- **Tính là không:** hào bị nguyệt phá, hào tĩnh, phục bị khắc. Thuyết "chân không" theo mùa (xuân Thổ, hạ Kim, thu Mộc, đông Hỏa) được sách chép lại nhưng chê là rườm.
- Mốc hết không: **xuất không** (ngày đầu tuần kế); **xung không** (ngày xung); **thực không** (ngày trùng chi). Đều tính được.

---

## 5. Mai hoa Dịch số: vượng suy của quái

**Nguyên văn sách (chỉ dấu tìm):**
- 卷一 · 卦氣旺: Chấn, Tốn vượng mùa xuân; Ly mùa hạ; Càn, Đoài mùa thu; Khảm mùa đông; **坤、艮土旺於辰戌丑未月**.
- 卷一 · 卦氣衰: xuân thì Khôn, Cấn suy; hạ thì Càn, Đoài; thu thì Chấn, Tốn; đông thì Ly; **tháng Thìn Tuất Sửu Mùi thì Khảm suy**.
- 卷二 · 複明時令之應: Dần Mão **tháng hoặc ngày** thì Mộc vượng; Tỵ Ngọ thì Hỏa; Thân Dậu thì Kim; Hợi Tý thì Thủy; Thìn Tuất Sửu Mùi thì Thổ. Suy là hành bị hành vượng khắc (Mộc vượng thì Thổ suy…).
- 卷二 · 衰旺論, 卷三 · 體用衰旺之訣: thể nên vượng; quái khắc thể nên suy; quái sinh thể nên vượng.

**Gỡ chỗ "tứ quý chồng lên mùa":** chính sách định nghĩa vượng suy theo **chi** của tháng (và ngày), không theo "mùa" ba tháng. Tháng Thìn, tức tháng 3, thuộc **Thổ**: Khôn, Cấn vượng, Khảm suy. Trong tháng ấy Chấn, Tốn **không** vượng, Khôn, Cấn **không** suy. "Xuân" ở câu Chấn Tốn vượng chỉ gồm Dần và Mão. Cách đọc này khớp cả ba đoạn sách, khớp bảng tháng của Tăng san (4.1), khớp diễn đàn VNTamTay và thayungkhiem (tứ quý tháng 3, 6, 9, 12, tức Thìn, Mùi, Tuất, Sửu theo lịch kiến Dần).

**Bảng tính được (theo sách, 2 trạng thái):**

| Chi tháng (hoặc chi ngày) | Quái vượng | Quái suy |
|---|---|---|
| Dần, Mão | Chấn, Tốn | Khôn, Cấn |
| Tỵ, Ngọ | Ly | Càn, Đoài |
| Thân, Dậu | Càn, Đoài | Chấn, Tốn |
| Hợi, Tý | Khảm | Ly |
| Thìn, Tuất, Sửu, Mùi | Khôn, Cấn | Khảm |

Quái không nằm ở cột nào thì là bình (sách không đặt tên).

**Chỗ lệch và việc cần anh quyết:**
1. **5 bậc hay 2 bậc.** thayungkhiem dùng vượng, tướng, hưu, tù, tử. Sách Mai hoa chỉ có vượng và suy. Đề xuất: in 2 bậc theo sách.
2. **Chi tháng lấy theo âm lịch hay theo tiết.** Trang mình lập quẻ Mai hoa theo **số tháng âm** (đúng sách). Các trang Việt nói "tháng 3, 6, 9, 12" (âm). maihoa.kabala.vn lấy tháng theo tiết. Sách không nói rõ cho phần vượng suy. Hai cách lệch nhau khoảng nửa tháng. Đề xuất: theo **tháng âm** cho thống nhất với cách lập quẻ, ghi chú rằng có trang dùng tiết. Cần anh duyệt.
3. **Ngày:** sách xét cả chi ngày ("thời lệnh" lẫn "nhật ứng"). Trang có thể in thêm dòng vượng suy theo ngày.
4. **Áp cho quái nào:** sách áp cho **thể**, và cho cả quái sinh thể, quái khắc thể (dụng, hỗ, biến). Trang in vượng suy cho cả bốn quái; chỉ trích câu sách về ý nghĩa, không tự xếp hạng cát hung.

---

## 6. Dụng thần theo việc (用神)

### 6.1. Bảng lục thân (Tăng san ch.8; các trang Việt thống nhất)

| Lục thân | Người | Vật, việc |
|---|---|---|
| **Phụ mẫu** | cha mẹ, ông bà, chú bác cô dì, thầy, cha mẹ vợ; người hầu hỏi về chủ | trời đất, thành trì, tường, **nhà cửa**, **xe thuyền**, quần áo, áo mưa, vải lụa, tấu chương, **văn thư, giấy tờ, khế ước**; "mọi thứ che chở ta" |
| **Quan quỷ** | **chồng** (vợ hỏi) | **công danh**, quan phủ, sấm sét, quỷ thần, giặc cướp, tà ma; "mọi thứ ràng buộc ta" |
| **Huynh đệ** | anh chị em, anh em họ, anh em kết nghĩa | là thần cướp tài (khi hỏi tiền), thần cản (khi mưu sự) |
| **Thê tài** | **vợ** (chồng hỏi), thiếp, người làm | **tiền của**, châu báu, kho |
| **Tử tôn** | con cháu, con rể, cháu, học trò | trung thần, lương tướng, **thuốc men**, tăng đạo, binh lính, **gia súc**; "phúc thần, chế quỷ"; **kỵ khi hỏi công danh** |
| **Thế** | bản thân; *riêng* anh rể, em rể cũng lấy Thế (ý riêng của sách) | |
| **Ứng** | người sơ, không thân (ch. Hành nhân) | |

### 6.2. Theo loại việc

| Việc | Dụng thần | Nguồn | Chỗ lệch |
|---|---|---|---|
| Cầu tài | Thê tài (Tử tôn là nguyên thần, Huynh đệ là thần cướp tài) | Tăng san ch.68; tất cả trang | không |
| Công danh, việc làm | Quan quỷ | ch.8; tất cả | không |
| Thi cử | **Phụ mẫu (bài văn) và Quan quỷ (đỗ)** cùng xét; Tử tôn động khắc Quan, Thê tài động khắc Phụ là xấu | ch.49 (父旺官興) | Các trang Việt không có. Máy không chọn được **một** dụng thần, chỉ đánh dấu được cả hai. |
| Hôn nhân | Nam hỏi lấy **Thê tài**, nữ hỏi lấy **Quan quỷ**; người nhà hỏi hộ cũng theo phía nam hay nữ | ch.82 (男家占女…以財爲用；女家占男，皆以官爲用) | *Hoàng Kim Sách*, *Dịch mạo* lấy **Ứng** làm vợ; Dã Hạc bác, chỉ cho Ứng làm phụ (ch.43). Các trang Việt: nam Tài, nữ Quan; Ứng là đối phương hoặc nhà họ. |
| Bệnh tật | Tự xem lấy **Thế**; xem cho người thì lấy theo quan hệ (cha mẹ lấy Phụ mẫu…) | ch.99 (自占病，世爲用神) | vuphac viết "sức khỏe lấy Quan quỷ". Theo sách, Quan quỷ là bệnh, là thần hại, **không phải dụng thần**. |
| Kiện tụng | Thế (mình), Ứng (đối phương); Quan quỷ (quan xử) và Phụ mẫu (đơn từ) cùng động là có lý | ch.97 | Nhiều hào cùng xét, thuộc phần luận. |
| Xuất hành | **Thế** là người đi; **Ứng** là nơi đến hoặc người đi cùng | ch.91 | không |
| Người đi xa, chờ người về | Theo quan hệ; người sơ thì lấy **Ứng** | ch.94 | Thành viên lyso.vn tranh luận (Ứng hay Tử tôn khi xem cho người ngoài). |
| Thời tiết | **Tử tôn**: nắng (nhật nguyệt tinh đẩu); **Phụ mẫu**: mưa, tuyết, sương mù; **Huynh đệ**: gió mây; Tử tôn còn là gió thuận | ch.35 | *Hoàng Kim Sách* cho Thê tài động là nắng; Dã Hạc chỉnh lại: Thê tài chỉ là phụ. Dòng Quan quỷ (sấm, sương mù) **chưa kiểm** trong bản chép. |
| Nhà cửa, xe, giấy tờ | Phụ mẫu | ch.8 | không |
| Con cái, thuốc | Tử tôn | ch.8 | bocdich thêm "thầy thuốc". Sách ghi 醫藥 (thuốc); "thầy thuốc" chưa kiểm ở ch. Diên y. |
| Anh em, bạn | Huynh đệ | ch.8 | không |

### 6.3. Nguyên thần, kỵ thần, cừu thần (ch.9). Tính được 100%
- **Nguyên thần:** hành sinh dụng thần.
- **Kỵ thần:** hành khắc dụng thần.
- **Cừu thần:** hành khắc nguyên thần, và cũng là hành sinh kỵ thần.
- Ví dụ: dụng thần Mộc thì nguyên Thủy, kỵ Kim, cừu Thổ.
- Ch.10 liệt kê điều kiện nguyên thần **có lực** (5) và **không lực** (6), kỵ thần **có lực** (5) và **không lực** (7). Từng điều kiện kiểm được bằng máy, như phục thần ở §3.4. Kết luận cát hung là luận.

### 6.4. Dụng thần hiện hai lần trở lên
- Ch.9, ví dụ: ba hào Phụ mẫu thì "chọn hào vượng"; hào lâm nguyệt kiến được chọn.
- bocdich (dẫn 《Tăng》) xếp thứ tự: động, rồi không hoặc phá, rồi xung hoặc hợp, rồi Thế hoặc Ứng, rồi lâm nhật nguyệt.
- Cần rút **ch.32 (兩現章)** từ DB để đối trước khi cho máy tự chọn. Đề xuất: máy **chỉ đánh dấu mọi hào ứng viên**, không tự chọn.

---

## 7. Ứng kỳ (應期)

### 7.1. Danh sách mốc sách nêu (ch.26又3). Máy tính được **các mốc**, không chọn được mốc nào đúng

| Tình trạng của hào chủ sự | Mốc sách nêu (ví dụ hào Tý) |
|---|---|
| Tĩnh | chi **trị** (trùng chi, Tý) hoặc chi **xung** (Ngọ) |
| Động | chi **hợp** (Sửu) hoặc chi **trị** (Tý) |
| Quá vượng | chi **mộ** hoặc chi **xung** |
| Suy, tuyệt | lúc gặp **sinh, vượng** (tháng, ngày sinh nó hoặc tháng đắc lệnh) |
| Nhập tam mộ | chi **xung mộ** (Hỏa mộ ở Tuất thì ứng ngày Thìn) |
| Gặp lục hợp | chi **xung mở hợp** (Tý hợp Sửu thì ứng Ngọ hoặc Mùi) |
| Nguyệt phá | **điền thực** (trùng chi) hoặc **hợp** ("phá mà gặp hợp") |
| Tuần không | điền thực hoặc xung (chi tiết ở ch.26) |
| Đại tượng cát mà bị khắc | lúc **thần khắc bị khắc** |
| Đại tượng hung mà bị khắc | lúc **thần khắc được sinh hoặc trị** |
| Hóa tiến thần | trị hoặc hợp ("có khi ứng tháng Thân, có khi tháng Tỵ") |
| Hóa thoái thần | trị hoặc xung |
| Động và biến | chi của hào động **hoặc** chi của hào biến |
| Thế không, nguyên thần động | lúc nguyên thần gặp trị |
| Thế suy, nguyên thần tĩnh | lúc nguyên thần gặp xung |
| Gần hay xa | **"việc xa định bằng năm tháng, việc gần bằng ngày giờ"**; có khi hỏi xa mà ứng gần. **Đây là luận.** |
| Quẻ không rõ | **gieo lại**, không đoán bừa |

### 7.2. Chỗ lệch giữa các nguồn
- **Quá vượng:** sách chỉ nói "gặp mộ, gặp xung". *Bảo điển* và vuphac tách thêm: việc cát thì chờ mộ, việc hung thì chờ lúc được sinh. Lấy cát hay hung để chọn mốc thì phải luận trước.
- **Nguyệt phá:** sách nói điền thực hoặc hợp (ch.27 thêm "ra tháng"). *Bảo điển* thêm "tháng sau".
- **Hợp:** *Hoàng Kim Sách* "gặp hợp chờ xung mở". *Bảo điển* thêm "xung chính hào hợp". votranh: hào động bị nhật nguyệt hợp thì tạm dừng đến ngày xung.
- **Phục tàng:** *Bảo điển* lấy chi dụng thần, hoặc chi xung phục, xung phi. Tăng san (ch.28): ví dụ ngày xuất không của phi hoặc phục.
- **Độc phát, độc tĩnh:** *Bảo điển* có quy tắc riêng; Tăng san để ở ch.31, cần rút đoạn.

### 7.3. Cách làm an toàn
Cho hào dụng thần đã chọn, máy liệt kê: chi trị, chi xung, chi hợp, chi mộ của hành, chi xung mộ, ngày xuất không, ngày điền thực hoặc hợp phá (nếu bị phá). Tính **ngày gần nhất** cho mỗi chi, dựa vào lịch can chi đã có. Đầu bảng in **nguyên câu sách** của từng mốc. **Không** in "ứng vào ngày X".

---

## 8. Phần tính được và phần phải luận

| Phần | Tính được theo quy tắc sách (dựng máy tính được) | Phải luận (không được tự chế) |
|---|---|---|
| Phục thần | lục thân nào thiếu; nhật nguyệt có mang hành ấy không; phục ở hào nào, chi gì, phi là hào nào; quan hệ phi và phục (sinh, khắc, tỷ); bảng tích 6 điều kiện dùng được và 5 điều kiện không ra được | phục có "dùng được" không; cát hay hung; Dã Hạc khuyên gieo lại |
| Dụng thần | bảng việc → lục thân (§6.1, 6.2); nguyên, kỵ, cừu thần; đánh dấu mọi hào ứng viên | chọn **một** hào khi hiện nhiều lần (chờ ch.32); thi cử, kiện tụng phải xét nhiều hào; hỏi hộ thì lấy Ứng hay theo quan hệ |
| Vượng suy | bảng vượng, tướng, hưu tù theo chi tháng (3 bậc); nguyệt sinh, khắc, hợp, xung, phá; nhật sinh, khắc, hợp, xung, trùng chi; ám động hoặc nhật phá (sau khi chốt định nghĩa vượng); sinh, vượng, mộ, tuyệt ở nhật và hóa; tam mộ; tiến, thoái (sau khi chốt danh sách); hồi đầu sinh, khắc; tuần không và phân loại "không tính là không" | tổng hợp "hào này mạnh hay yếu" khi các lực ngược chiều (sách nói "sinh nhiều khắc ít", "ít không địch nổi nhiều", không có công thức); hào bị phá có còn tác dụng không; xung tán |
| Ứng kỳ | danh sách mốc theo tình trạng hào; ngày gần nhất của mỗi chi | chọn mốc nào; ngày, tháng hay năm; tình trạng "quá vượng" hay "đại tượng cát" |
| Mai hoa | vượng hoặc suy của thể, dụng, hỗ, biến theo chi tháng và ngày (2 bậc) | thể vượng mà bị khắc thì cát hay hung bao nhiêu; ứng kỳ "tháng ngày của quái khắc thể" (sách có nêu, có thể in làm mốc như §7.3) |

**Việc chờ anh duyệt**, cùng việc đã ghi ở `viec-can-anh.md`:
1. In bảng vượng suy **3 bậc theo sách** hay 5 bậc như thị trường.
2. Định nghĩa "vượng" để phân ám động với nhật phá (đề xuất ở §4.4).
3. Tiến, thoái thần: 7 cặp như bản chép, hay 8 cặp như bocdich. Cần đối bản quét AR16.
4. Mai hoa: chi tháng theo **âm lịch** (đề xuất) hay theo tiết.
5. In thêm câu Dã Hạc "không dùng phục thần, gieo thêm quẻ" cạnh phần phục thần.
6. Kiểm DB đã nạp chữ quyển 2–4 (phần nằm trên trang chính Wikisource) chưa, nhất là **ch.27 Nguyệt phá, ch.28 Phi phục, ch.29 Tiến thoái, ch.32 Lưỡng hiện**.
