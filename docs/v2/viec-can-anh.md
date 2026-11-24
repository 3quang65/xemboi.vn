# Việc cần anh Cường xử lý (gom một lần)

> Em (Claude Code) cứ làm tiếp theo kế hoạch ở máy trạm. Việc nào bắt buộc cần anh thì ghi vào đây; anh rảnh thì xử lý một lượt.
> Mỗi mục ghi: việc gì, vì sao cần anh, và **em đang tạm làm theo mặc định nào** để không chặn việc khác.
> Cập nhật lần cuối: 24/11/2026 (sửa mục 16, 18, 19 theo quy tắc chỉ tiếng Việt; thêm mục 23–26).

## Còn chờ anh

1. **Khóa Search Console của xemboi.vn** (anh đã đồng ý cấp). Các bước:
   1. Google Cloud Console → tạo project (hoặc dùng project có sẵn) → bật **Google Search Console API**.
   2. Tạo **tài khoản dịch vụ** (service account), tạo khóa dạng **JSON** và tải về.
   3. Search Console → property xemboi.vn → Cài đặt → Người dùng và quyền → thêm email của tài khoản dịch vụ (dạng `…@….iam.gserviceaccount.com`), quyền **Restricted** là đủ.
   4. Đặt tệp JSON vào `D:\VibeCode\Antigravity\may-tram\gsc-xemboi.json` (ngoài repo). Em không in nội dung tệp ra.

   Mã đồng bộ đã xong (`scripts/seo-gsc.ts`); chưa có tệp thì script tự bỏ qua. Có tệp rồi em chạy `--lan-dau` kéo 16 tháng, rồi đặt cron hằng ngày lúc deploy. Nếu property không phải dạng tên miền (`sc-domain:xemboi.vn`) mà là dạng URL thì báo em để đặt `GSC_SITE`.
2. **(Không gấp) Đổi mô hình nhúng sang Qwen3-0.6B.** Tìm trên VPS đã chốt theo lời anh: từ khóa + viết lại câu hỏi bằng `gx/qwen3.6-35b-nvfp4` của cụm máy nhà, đo 100 câu được 80 % (trước 31 %), không cần nhúng trên VPS. Đổi mô hình nhúng chỉ cần khi bật nhánh vector; nó vẫn hơn bge-m3 (70 % so với 58 %). Em để bge-m3 tới khi anh bảo đổi. Lưu ý: tìm trên VPS sẽ phụ thuộc cụm máy nhà; cụm tắt thì tự lùi về 31 %.
3. **Ngày dự kiến mở tên miền chính** (17 mục 9, câu 9), để đặt nhắc giấy phép. Không có mặc định.
4. **Tài khoản quản trị cho người thật** (17 mục 9, câu 11): trang `/quan-tri/tai-khoan` đã xong, anh tự tạo khi cần; hồ sơ tác giả tạm dùng bút danh.
6. **Frontend v2 (docs/v2/19).** Em đang tự làm theo mặc định dưới đây. Anh chỉ cần trả lời nếu muốn khác:
   1. **Chat "Hội đồng thầy" v1:** khung chat nổi đã bỏ khỏi mọi trang (component `CouncilChatEmbed` còn giữ trong mã, chưa trang nào dùng); API `/api/chat/*` giữ nguyên. Chỗ đặt giao diện chat xem mục 7.
   2. **Trang v2 dựng xong vẫn để `noindex`.** Trước ngày triển khai, em lập danh sách trang công cụ đủ điều kiện. Anh (hoặc biên tập viên) bấm xuất bản ở `/quan-tri/seo/trang`.
      - Trang từ điển chỉ index khi có diễn giải đã duyệt.
   3. **Đã làm (22/11):** gỡ trang v1. `/tu-vi-hom-nay`, `/tu-vi-ngay-mai` trả 410; `/tu-vi-tron-doi`, `/tu-tru`, `/boi-dich`, `/la-so/*` chuyển 301 sang trang v2. Service worker cũ thay bằng bản tự dọn bộ nhớ đệm.
   4. **Đã xong:** Bát tự (`/bat-tu/lap-la-so`) và Gieo quẻ (`/kinh-dich/gieo-que`) đã dựng ở F4, nên dùng 301 như mục 3.
7. **Trang trả phí `/goi` và `/tu-vi/luan-giai`.** Kế hoạch SEO ghi đây là sản phẩm trả phí (79k / 149k / 299k, VietQR); giá hiện chỉ có trong bản thử nhu cầu R1, chưa có luồng thanh toán thật. Cần anh chốt: giá, nội dung từng gói, và `/tu-vi/luan-giai` là báo cáo trả phí hay chat với "Hội đồng thầy". **Em đang để:** cả hai trang chưa dựng, `/goi` ẩn khỏi menu (đợt 6).
8. **Thông tin liên hệ cho `/lien-he`:** email, Zalo hoặc số điện thoại muốn công khai, tên đơn vị chủ quản. **Em đang để:** trang hiện "Thông tin liên hệ đang cập nhật" và `noindex`.
9. **Ba trang chính sách** (bảo mật và cookie, sử dụng và khiếu nại, bản quyền): cần người viết và luật sư đọc trước khi đăng. **Em đang để:** chỗ giữ, `noindex`. Bản bảo mật bắt buộc có trước khi mở form thu email/Zalo hoặc thanh toán.
10. **Người duyệt học thuật** (`/phuong-phap/nguoi-duyet`): bảng hồ sơ tác giả đang trống. Cần tên (hoặc bút danh), lý lịch ngắn của người viết và người duyệt. **Em đang để:** chỗ giữ, `noindex`.
11. **Xuất bản nội dung nền:** các trang `/phuong-phap/*`, `/nguon`, `/tu-dien`, `/kien-thuc/*` đã có dòng SEO ở trạng thái nháp và chưa có bài. Trang có dữ liệu tính được (bảng quy ước, bảng tháng nhuận, thư mục 164 nguồn, 336 thuật ngữ) vẫn dùng được ngay nhưng để `noindex` tới khi biên tập viên viết phần bài và bấm xuất bản.
12. **Bốn bài cũ ở `/bai-viet/*`** đã đăng, giữ nguyên đường dẫn. Kế hoạch SEO định chuyển 301 hai bài sang `/tu-vi/cach-doc-la-so` và `/phuong-phap/gio-ty`; em chỉ bật khi trang đích có bài đã duyệt, để không chuyển người đọc sang trang trống.
13. **Trang P1 còn 404 lúc triển khai (7/55).** Các trang khác trong `16-seo-trang.csv` đều đã dựng. Bảy trang còn thiếu đều cần anh quyết hoặc cần người viết:
    - `/goi`, `/tu-vi/luan-giai`: chờ mục 7.
    - `/boi-tinh-yeu`: CSV ghi "cần anh duyệt". Từ khóa lớn nhưng dễ thành nội dung bói vui không có sách. **Em đang để:** chưa dựng. Nếu anh duyệt, em đề xuất dựng như một lối vào `/xem-tuoi/vo-chong` (cùng phép tính, ghi rõ hệ).
    - `/tu-vi/hop-la-so`: là Gói 3 (Q2/2027), cần quy tắc so hai lá số có sách dẫn. **Em đang để:** chưa dựng.
    - `/tu-vi/cach-doc-la-so`, `/kien-thuc/vi-sao-hai-trang-ra-hai-la-so-khac-nhau`, `/kien-thuc/vi-sao-cac-noi-xem-tuoi-khac-nhau`: trang bài viết, cần biên tập viên viết và duyệt (route đã có, dùng khung `TrangBaiViet`; bài xuất bản ở `/quan-tri` là trang tự hiện, chưa có bài thì 404).
14. **Cụm Xem ngày (F6) đã dựng, chờ xuất bản.** Gồm `/xem-ngay`, 6 trang việc (cưới hỏi, khai trương, động thổ, nhập trạch, mua xe, cắt tóc), trang tháng `/xem-ngay/thang-mm-yyyy` và `/xem-ngay/{việc}/thang-mm-yyyy`.
    - Ba lớp hiện cạnh nhau, không gộp điểm:
      - 12 trực: đã đối chiếu 716/716 ô bảng tháng của Hiệp kỷ.
      - 12 thần hoàng/hắc đạo: theo Hiệp kỷ.
      - Bảng nghi kỵ: của thư viện mở lunar-javascript. Trang ghi rõ thư viện không ghi sách gốc.
    - Trang mua xe: bảng không có mục "mua xe", nên trang dùng mục Giao dịch và ghi rõ điều đó.
    - **Cần anh:** bấm xuất bản các dòng `XN*` ở `/quan-tri/seo/trang` khi anh thấy ổn. Hiện đang `noindex`.
    - **Chưa làm:**
      - lọc theo tuổi (trang `/xem-ngay/chon-ngay`, chờ mục 7);
      - 28 sao;
      - các ngày kỵ dân gian Việt (Tam nương, Nguyệt kỵ…): kho sách công khai chưa có nguồn.
15. **Kim lâu, Tam tai, Hoang ốc (Xem tuổi P2):** kho sách công khai không có đoạn nào ghi các quy tắc này. Đây là tục Việt, mỗi nơi tính một kiểu. **Em đang để:** chưa dựng. Muốn làm thì cần một hai sách Việt dùng được công khai (hoặc anh cho phép ghi "theo tục truyền, không có sách gốc" và trình bày các cách tính song song).
16. **Chu Dịch 64 quẻ:** đã có nguyên văn quẻ từ và hào từ (Kanripo KR1a0001), đối chiếu từng chữ với bản Vương Bật. Bản gốc có hai chỗ khác mọi bản khác:
    - quẻ Mông "童蒙來求我" (các bản khác không có chữ 來);
    - Chấn lục ngũ "意" (các bản khác ghi "億").
    - Người duyệt cần quyết: giữ nguyên bản hay sửa theo đa số. **Em đang để:** giữ nguyên bản, trang ghi chú ngay dưới câu đó.
    - **Phiên âm Hán Việt** (`src/lib/trang/du-lieu/chu-dich-64-phien-am.json`): ghép từng chữ từ kho song ngữ DS05, chữ đa âm chọn tay (232 quyết định trong `quyetDinh`). **39 chỗ chưa chắc** (`chacChan: false`), ví dụ:
      - 亨 đọc "hưởng" ở ba câu "用亨于" (quẻ 14, 17, 46), có bản đọc "hanh";
      - 舍 "xá" (nghĩa là bỏ, có thể đọc "xả"), 次且 "tư thư" (nhiều bản "thứ thư"), 易 "dị" ở quẻ 34, 56;
      - chữ hiếm: 眇, 茹, 彙, 嗃, 掣, 頄, 汔, 鬯, 夤, 蔀…
      - Người duyệt cần đọc lại danh sách này. **Em đang để:** dùng âm đã chọn, chưa hiện dấu "chưa chắc" trên trang.
    - **Từ 24/11 (Lệnh 46):** trang không in chữ Hán nữa, chỉ in phần tiếng Việt. Nguyên văn và phiên âm giữ trong dữ liệu để đối chiếu; hai mục trên vẫn cần người duyệt vì bản dịch dựa vào nguyên văn.
    - **Cần anh:** bấm xuất bản các dòng `KD`, `KD-64`, `KD-QUE`, `KD-QUAI` ở `/quan-tri/seo/trang` khi anh thấy ổn.
17. **Cụm Phong thủy (F6) đã dựng, chờ xuất bản.** Gồm `/phong-thuy`, công cụ tra cung phi, 8 trang cung, `/phong-thuy/bat-trach`, công cụ hướng nhà.
    - Nguồn: Hiệp kỷ biện phương thư (Kanripo KR3g0051), không phải Bát trạch minh kính như kế hoạch SEO cũ ghi. Kho chỉ có bản quét Bát trạch minh kính, OCR không đọc được.
      - Cung phi: câu "九宫建宅" quyển 35. Công thức đang dùng khớp bản đã sửa năm Khang Hy 56.
      - 8 du niên: phép "大遊年變卦, 相宅家用之" quyển 2. Bảng tính từ hào biến khớp đủ 64 ô với bảng ở trang Xem tuổi.
      - Số 5 gửi Khôn (nam), Cấn (nữ): Hiệp kỷ không chép. Trang ghi rõ đây là quy ước của các sách Bát trạch.
    - Đã sửa chữ SEO nhóm PT cho khớp nội dung: bỏ "Bát trạch minh kính", "hướng bếp, bàn thờ" vì không có nguồn. CSDL máy trạm đã sửa; lần deploy tới phải sửa trên VPS bằng `may-tram/seo-pt-moi.json`.
    - **Chưa làm:** thước Lỗ Ban (số đo chưa kiểm được nguồn), hỏi đáp phong thủy nhà ở (cần người viết).
    - **Cần anh quyết (không gấp):** trang Xem tuổi vợ chồng đang dùng bảng đại du niên (bảng xem nhà) để xét hợp hôn. Hiệp kỷ (quyển đầu, tờ 7b) ghi hợp hôn dùng tiểu du niên, tên khác (Phúc đức, Tuyệt thể, Du hồn, Quy hồn), và chê cách ghép này là "牽合非倫" (gán ghép không đúng lẽ). **Em đang để:** giữ nguyên, chưa ghi chú trên trang.
    - **Cần anh:** bấm xuất bản các dòng `PT`, `PT-CUNGPHI`, `PT-CUNGPHI-LEAF`, `PT-BATTRACH`, `PT-HUONGNHA` ở `/quan-tri/seo/trang` khi anh thấy ổn.
18. **Cụm Thần số học (F6) đã dựng, chờ xuất bản.** Gồm `/than-so-hoc`, công cụ số chủ đạo, 12 trang số (1–9, 11, 22, 33), biểu đồ ngày sinh (lưới 3×3, 4 đỉnh cao), theo tên, 9 trang năm cá nhân.
    - **Đã có phần ý nghĩa (23/11, Lệnh 37):** lời Việt của Nhật Nguyệt (điểm mạnh, yếu, công việc, tình cảm, tiền bạc, sức khỏe, lời nhắc) và 159 đoạn trích từ 8 sách 1905–1926. Từ 24/11 trang in bản dịch tiếng Việt của xemboi (ghi "Dịch nghĩa: xemboi"), không in nguyên văn tiếng Anh; người duyệt nên đọc lại 159 đoạn dịch ở `src/lib/trang/du-lieu/than-so-hoc-trich-vi.json`. Em đã đối chiếu 195/195 đoạn với bản quét archive.org, sửa 14 lỗi OCR hiển nhiên. Mỗi khối ghi "Dữ liệu: Nhật Nguyệt (nhatnguyet.org)". Anh cho dùng trước, xin phép sau (mục 20).
    - Trang biểu đồ ngày sinh có thêm 4 số thách thức, số thái độ, số ngày sinh, nợ nghiệp (13, 14, 16, 19); phép tính khớp 600/600 ca của Nhật Nguyệt. Ba phương án (a), (b), (c) hỏi anh trước đây không còn cần.
    - Quy ước tính ghi công khai trên trang: số chủ đạo hiện cả hai cách (cộng dồn và rút từng phần), khác nhau ở 4.725/36.890 ngày sinh 1930–2030; giữ 11, 22, 33; tên tiếng Việt bỏ dấu, Đ = D, Y là nguyên âm.
    - Menu: thêm nút "Thêm" ở desktop gom các hub phụ (cờ `them` trong `dieu-huong.ts`), bỏ mục "Trang chủ" trên desktop vì logo đã dẫn về trang chủ. Chiêm tinh, Phong tục sau này cũng vào nhóm này.
    - SEO nhóm TSH: title, meta của `TSH`, `TSH-SO`, `TSH-BIEUDO`, `TSH-NAMCANHAN` thêm lại chữ "ý nghĩa" vì nay trang có thật. CSDL máy trạm đã sửa; deploy tới sửa VPS bằng `may-tram/seo-tsh-moi.json`.
    - **Cần anh:** bấm xuất bản các dòng `TSH`, `TSH-TINH`, `TSH-SO`, `TSH-TEN`, `TSH-BIEUDO`, `TSH-NAMCANHAN` khi anh thấy ổn.
19. **Cụm Chiêm tinh (F6) đã dựng, chờ xuất bản.** Gồm `/chiem-tinh`, `/chiem-tinh/cung-hoang-dao` (tra cung theo ngày giờ sinh, bảng 12 cung) và 12 trang cung.
    - Nguồn duy nhất là *Tetrabiblos* của Ptolemy, bản dịch Anh Ashmand 1822 (Gutenberg, phạm vi công cộng). Trang trích sách (từ 24/11 in bản dịch tiếng Việt, không in nguyên văn tiếng Anh): loại cung, dương/âm, nhà của hành tinh, tam hợp, vượng/hãm.
    - Giờ Mặt Trời vào cung tính bằng VSOP87D, khớp tiết khí chẵn 30° tới dưới 2 giây (2000–2030).
    - **Không có** tính cách 12 cung, hợp cung, nguyên tố: Tetrabiblos không viết những thứ này. Trang ghi rõ vì sao.
    - Chưa làm: bản đồ sao (sẽ làm bằng `astronomy-engine`, MIT, theo 20-hoc-tu-4-repo), trang hành tinh, trang nhà.
    - **Cần anh:** bấm xuất bản các dòng `CT`, `CT-CHD`, `CT-CUNG` khi anh thấy ổn. Deploy tới sửa VPS bằng `may-tram/seo-ct-moi.json`.
20. **Xin phép tác giả sau khi xong sản phẩm** (anh cho dùng trước ngày 23/11/2026). Danh sách đầy đủ ở `14-so-giay-phep.md` mục 1, cột "CẦN XIN PHÉP". Hiện có:
    - **Nhật Nguyệt** (nhatnguyet.org, lienhe@nhatnguyet.org): lời ý nghĩa thần số học, CC BY-NC 4.0. Dùng ở mọi trang `/than-so-hoc/*`. Kho của họ còn lời luận tử vi (2.016 dòng sao tại cung) và bát tự, chưa dùng.
    - **taibu** (hhszzzz): ý 8 điều luận giải cho chat, viết lại bằng tiếng Việt (AGPL).
    - Chat cũ: ba API thời v1 (`/api/hoi-thay`, `/api/chat/stream`, `/api/chat/council`) không còn giao diện nào gọi, chưa có xác thực và giới hạn lượt, vẫn trả đoạn mẫu "vật phẩm", "cải vận". Từ 23/11/2026 em tắt mặc định (trả 410, bật lại bằng `BAT_CHAT_CU=1`). Khoảng 150 đoạn mẫu trong `src/lib/ai` (`council-orchestrator.ts`, `dialogue-simulation.ts`, `conversation-store.ts`, các tệp `seeded-knowledge*.json`, `customer-inquiry-bank.json`, `few-shot-dialogues.json`) em viết lại khi làm phần chat trả phí. Khu quản trị (giả lập tọa đàm) vẫn đọc các đoạn này.
21. **Cửu tinh năm, tháng (cụm Phong thủy) đã dựng, chờ xuất bản.** Gồm `/phong-thuy/cuu-tinh` (chọn năm 1901–2099) và 16 trang năm 2020–2035.
    - Tính theo Hiệp kỷ biện phương thư quyển 8 (sao năm, sao tháng, thuận bố cửu cung), khớp 600 ô bảng từng năm (quyển 15–19; bản Kanripo thiếu quyển 14) và 36 ô bảng tháng.
    - Năm đổi ở Lập xuân, tháng theo tiết; trang ghi rõ Hiệp kỷ chỉ chép "chính nguyệt", cách tính theo tiết là cách các sách lịch dùng.
    - Chỉ cho biết sao ở phương nào và sách nói gì. Không có "hóa giải", vật phẩm, "sát khí".
    - **Cần anh:** bấm xuất bản `PT-CUUTINH`, `PT-CUUTINH-NAM` khi thấy ổn. Hai dòng này đã nạp ở CSDL máy trạm dạng NHAP.
    - **Lưu ý deploy:** đừng chạy lại cả `scripts/seo-nap-ban-dau.ts` trên VPS. Script tự chuyển XUAT_BAN mọi dòng có trang đang chạy, tức sẽ tự xuất bản luôn TSH, CT, PT-CUUTINH khi anh chưa duyệt. Em sẽ nạp riêng 2 dòng Cửu tinh bằng `napTrangCsv` với tập trang rỗng như đã làm ở máy trạm.
22. **Bản đồ sao (cụm Chiêm tinh) đang dựng, chờ xuất bản.** Trang `/chiem-tinh/ban-do-sao`: nhập ngày, giờ (có thể bỏ trống), tỉnh sinh.
    - Vị trí 10 thiên thể tính bằng astronomy-engine (MIT), khớp JPL Horizons dưới 1 phút cung; cung mọc, thiên đỉnh, 12 nhà chia trọn cung.
    - Múi giờ tự chọn theo năm và nơi sinh (vd 1960–6/1975 miền Nam UTC+8, miền Bắc UTC+7); 1947–1955 ghi rõ "chưa chắc" và cho chọn lại.
    - Chỉ ghi vị trí, phẩm vị và câu Tetrabiblos; không luận tính cách. Tọa độ tỉnh từ GeoNames (CC BY 4.0, trang có ghi công).
    - Dòng SEO `CT-BANDOSAO` để NHAP, anh duyệt xuất bản.
23. **Cụm Lịch P2 (Lệnh 47) đang dựng, chờ xuất bản.** `/lich-am/gio-hoang-dao`, `/tiet-khi` và 24 trang tiết, `/lich-am/ngay-le` và 10 trang lễ.
    - Giờ hoàng đạo theo Hiệp kỷ quyển 5, khớp bảng đang dùng ở trang lịch mọi ngày năm 2026. Các trang lịch lớn khác cho kết quả khác nhau cùng một ngày; trang mình ghi quy tắc và sách.
    - 72 hậu (Cấp trủng Chu thư, dẫn trong Hiệp kỷ quyển 1) do em dịch; người duyệt nên đọc lại (`TIET_KHI_24` trong `src/lib/trang/lich-mua.ts`).
    - **Cần người viết:** phần phong tục, mâm cúng của 10 ngày lễ. Trang hiện "Phần phong tục đang biên tập, chưa đăng."
    - **Cần anh:** bấm xuất bản `LICH-GHD`, `LICH-TIETKHI-IDX`, `LICH-TIETKHI`, `LICH-NGAYLE-IDX`, `LICH-NGAYLE`, `LE-RAMGIENG`, `LE-VIATHANTAI`, `LE-RAM7`, `LE-TRUNGTHU` khi thấy ổn.
24. **Con giáp từng cặp và Tứ Hóa (Lệnh 48) đang dựng.** `/xem-tuoi/con-giap` (ma trận 12 × 12), 78 trang `/xem-tuoi/{a}-va-{b}`, `/tu-vi/tu-hoa`.
    - Cặp con giáp chỉ nêu quan hệ địa chi có sách dẫn (Tam mệnh thông hội), không chấm hợp/không hợp, không tả tính cách.
    - Tứ Hóa: câu phú Tử Vi Đẩu Số toàn thư quyển 2 ghi can Canh "Nhật Vũ Âm Đồng" (Khoa Thái Âm, Kỵ Thiên Đồng), khác bảng sách Việt mình đang dùng ("Nhật Vũ Đồng Âm"). Can Nhâm thì Toàn thư khớp sách Việt (Khoa Thiên Phủ). Trang hiện cả ba cách ghi. **Em đang để:** lá số vẫn dùng bảng Việt. Người duyệt nên xem lại.
    - **Cần anh:** bấm xuất bản `XT-CAP-IDX`, `XT-CAP`, `TUVI-TUHOA` khi thấy ổn.
25. **Trang trong kế hoạch SEO còn chưa dựng vì cần người viết hoặc cần anh quyết** (rà 24/11):
    - Văn khấn: 21 trang `/van-khan/*` và hub. Cần nguồn văn khấn dùng được công khai hoặc người soạn; em không tự viết lời khấn.
    - Phong tục: `/phong-tuc`, `/phong-tuc/cung-duong`, `/phong-tuc/xin-xam`; phần phong tục của trang ngày lễ (mục 23).
    - Xem tuổi: `/xem-tuoi/kim-lau`, `tam-tai`, `hoang-oc`, `lam-nha`, `nam-tuoi`, `lam-an` (mục 15).
    - Bài viết: `/bat-tu/ngu-hanh-khuyet`, `/tu-vi/cach-doc-la-so`, các bài `/kien-thuc/*`, `/tu-vi-theo-tuoi` và trang tử vi năm theo tuổi (cần lời luận đã duyệt).
    - Cần anh quyết: `/boi-tinh-yeu` (mục 13), `/goi` và `/tu-vi/luan-giai` (mục 7), `/tu-vi/hop-la-so` (Gói 3).
    - Chiêm tinh `/chiem-tinh/nha/{n}` (12 trang): Tetrabiblos không đặt tên, nghĩa cho 12 nhà; cần nguồn khác dùng được công khai.
    - Các trang P3 khác em chưa làm (trừ 10 trang hành tinh, Lệnh 50; Mai hoa Dịch số, Lệnh 51; Lục hào, Lệnh 52).
26. **Bước deploy lên VPS cho các đợt 24/11** (em làm khi đưa lên VPS một lần, ghi đây để anh biết):
    - chạy `scripts/seo-chi-tieng-viet.ts` (sửa chữ SEO theo quy tắc chỉ tiếng Việt);
    - nạp riêng các dòng SEO mới bằng `scripts/seo-nap-dong.ts` (để NHAP, không tự xuất bản): các dòng ở mục 23, 24, 27 (lệnh đủ ở 19 nhật ký).
    - xuất bản lại trên VPS các trang anh đã cho: `scripts/seo-xuat-ban.ts KD-MAIHOA KD-LUCHAO` (sau khi nạp dòng).
27. **Kinh Dịch: Mai hoa Dịch số và Lục hào (Lệnh 51, 52) đã dựng (commit d6ece9e), chờ xuất bản.** `/kinh-dich/mai-hoa-dich-so`, `/kinh-dich/luc-hao` (SEO `KD-MAIHOA`, `KD-LUCHAO` để NHAP).
    - Cả hai chỉ tính quẻ theo sách, không luận việc. Mai hoa khớp hai ví dụ chép trong sách (xem hoa mai, xem hoa mẫu đơn). Lục hào khớp bảng an sẵn 64 quẻ của *Tăng san bốc Dịch* 383/384 hào; hào lệch là lỗi chép của bảng (hào đầu quẻ Khốn), em theo quy tắc nạp chi của chính sách.
    - Cần người am hiểu đọc lại bản dịch các câu sách (Mai hoa 10 câu, Lục hào 8 câu) trước khi xuất bản.
    - Chưa làm, cần người duyệt: phục thần, dụng thần theo việc hỏi, vượng suy theo mùa, ứng kỳ (lục hào); vượng suy theo mùa (Mai hoa: sách ghi tháng tứ quý chồng lên mùa, chưa rõ cách lấy).
    - **Đã xuất bản 24/11** (anh cho xuất bản nếu đối chiếu đạt): khớp daogiao.io.vn, maihoa.kabala.vn, thayungkhiem.vn; biên bản `docs/v2/doi-chieu/mai-hoa-luc-hao.md`. Mới xuất bản trên máy anh; khi đưa lên VPS em chạy lại bước ở mục 26.
5. **xemtuvi.vn** (site riêng của anh, em không sửa): `horoscopes.xml` đang công khai lá số người dùng (giới tính, giờ, ngày sinh) và cho index.

## Anh đã trả lời ngày 22/11/2026

| Việc | Trả lời | Em làm thế nào |
|---|---|---|
| Push và deploy `lam-lai-v2` lên v3.xemtuvi.vn | Đồng ý | **Đã deploy 22/11** (bản `20261122-2118`, xem 19 nhật ký). Đã push nhánh lên GitHub 23/11 |
| Thêm `NINEROUTER_API_KEY` vào env web trên VPS | Đồng ý | Làm lúc deploy; cổng trên VPS gọi thẳng `http://127.0.0.1:20128/v1` |
| Chạy script chuyển dữ liệu và đặt cron trên VPS | Đồng ý | Lúc deploy: chạy `--thu` trước rồi mới chạy thật (`chuyen-bai-cu.ts`, `chuyen-tri-thuc-cu.ts`); cron đêm `seo-quet.ts` rồi `seo-goi-y-lien-ket.ts`, sáng `seo-gsc.ts` (khi có khóa); nạp một lần `seo-nap-lich-mua.ts`; sao lưu `sao-luu-csdl.mjs` 3 giờ sáng, giữ 7 bản ngày + 4 bản tuần, chưa mã hóa |
| 5 URL cũ `CHO_QUYET` | Anh giao em quyết | **Đã làm:** giữ slug cũ `/lien-he` và 3 trang `/chinh-sach-*` (thêm vào `16-seo-trang.csv`: `PL-LIENHE`, `PL-BAOMAT`, `PL-DIEUKHOAN`, `PL-BANQUYEN`); `/chinh-sach-binh-luan-va-gop-y` 301 về `/lien-he`. Hai trang bảo mật và điều khoản cần luật sư đọc trước khi xuất bản |
| Rủi ro điều khoản khi chat công khai đi qua Codex thuê bao | Không sao | Giữ 9router + Codex |
| Đổi `prisma db push` sang `prisma migrate` | Đồng ý | Máy trạm đã dùng migrate (`0000_nen` → `0002`). Trên VPS: sao lưu, thử `migrate resolve --applied 0000_nen` + `migrate deploy` trên bản sao CSDL trước, rồi mới làm trên CSDL thật |
| Các câu còn mở ở 17 mục 9 | Đồng ý theo mặc định | Xem bảng dưới |
| `PTUC-XINXAM` (17 URL xin xăm) | (đã chốt trước: xin xăm làm sau) | Chuyển hướng để **tắt**; có bài thì bật, bỏ hẳn thì đổi 410 |

### 17 mục 9: các mặc định đã được duyệt

- Máy trạm: chạy OCR và nhúng khi máy bật, không hẹn giờ (câu 2).
- Nhúng câu hỏi lúc chạy thật: (c) chỉ tìm theo từ khóa và thuật ngữ; Đợt 3 đo thử (b) bge-m3 ONNX trên VPS (câu 3).
- Chuyên gia ngoài **không** đọc đoạn nguồn C (câu 4).
- Trang công khai **không** ghi tên sách C (câu 5).
- Văn bản nguồn C **chỉ ở máy trạm** (câu 6).
- Tài liệu RAG cũ thành `NOI_BO` (câu 7).
- Giữ một tiến trình, chưa tách `quantri.xemboi.vn` tới hết Đợt 3 (câu 8).
- Không bật Ahrefs (câu 13).
