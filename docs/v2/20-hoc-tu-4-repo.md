# 20. Học gì từ 4 repo: fengshui.skill, taibu, Nhật Nguyệt, numerologist_skills

Ngày 23/11/2026. Mỗi repo có một agent đọc. Cả bốn được clone vào thư mục tạm và chỉ đọc, không chạy mã nào của repo. Phần đối chiếu số liệu ở mục 3 do em tự viết script và chạy trên engine xemboi. Dữ liệu của repo ngoài chỉ được đọc như dữ liệu.

## 1. Tóm tắt từng repo

| | [voidforall/fengshui.skill](https://github.com/voidforall/fengshui.skill) | [hhszzzz/taibu](https://github.com/hhszzzz/taibu) (R095) | [Nhat-Nguyet/…numerology](https://github.com/Nhat-Nguyet/nhatnguyet-lunar-ziwei-bazi-numerology) (R042) | [fanzr-arch/numerologist_skills](https://github.com/fanzr-arch/numerologist_skills) |
|---|---|---|---|---|
| Là gì | Bộ Claude Agent Skills: phong thủy, bát tự, bản đồ ngũ hành thành phố. Script Python tính, SKILL.md làm prompt | Nền tảng tự host (Next.js 16, Postgres, Redis), agent, MCP, gói `taibu-core` tính 15 hệ | Thư viện âm lịch, tử vi, bát tự, thần số học bản Việt (TS + Python), kèm bộ ca kiểm và bài báo âm lịch | 3 Claude Skills: tử vi, kỳ môn (có script), bát tự (chỉ prompt) |
| Giấy phép | MIT, nhưng **chỉ từ commit fe2a025 (23/11/2026)**. Bản trước không có LICENSE. Dữ liệu bản đồ theo ODbL / CC BY | MIT cho `packages/core`, `mcp`, `mcp-server`; **AGPL-3.0** cho `src/`, `skills/` | Mã MIT. Ca kiểm, thuật ngữ, ai-eval theo CC BY 4.0. **Lời luận, tri thức theo CC BY-NC 4.0** (từ 20/11, có câu cài dấu để nhận bản chép) | **Không có LICENSE**, coi như giữ mọi quyền |
| Độ tin cậy | Khá. Có bảng xuất xứ 5 trạng thái, khoảng 160 test, golden file. Eval của chính họ: bát tự đúng 4/16 | Khá. Có tài liệu khẩu quyết `ALGORITHM_RULES.md`, 50 file test core, 35 ca eval agent. Tự khai điểm yếu | Tốt nhất về số liệu: 17.291 ca kiểm, khớp IMCCE / DE440 | Trung bình. Bảng miếu vượng bản đầu sai 150 ô (do LLM sinh). Nhãn phương pháp kỳ môn sai. Hai skill mâu thuẫn quy ước giờ Tý |

Điểm chung của cả bốn: **máy tính lập lá số, AI chỉ diễn giải**. xemboi cũng đang theo hướng này. Họ khác nhau ở độ chặt của rào chắn chống bịa và ở nguồn.

## 2. So với xemboi hiện nay

| Mảng | xemboi | Bốn repo | Nhận xét |
|---|---|---|---|
| Âm lịch, tiết khí | VSOP87D tự viết. Đã khớp 14.735 ca Nhật Nguyệt (xem 15-doi-chieu-engine) | Nhật Nguyệt mạnh nhất. taibu và numerologist dựa lunar-javascript (lịch Trung Quốc) | Mình ngang Nhật Nguyệt, hơn hẳn ba repo kia về lịch Việt |
| Tử vi | Engine riêng, 777 lá số khớp Nhật Nguyệt | taibu và numerologist chỉ bọc hoặc đối chiếu iztro | Không cần mượn engine. Mượn **cách kiểm** (bất biến, nguồn bảng miếu vượng) |
| Phong thủy | Bát trạch và hướng nhà, nguồn Hiệp kỷ biện phương thư | fengshui.skill có thêm Huyền không phi tinh, Tử bạch năm/tháng, Tam sát | Mình có nguồn gốc tốt hơn (họ ghi rõ là chưa có nguyên văn Hiệp kỷ). Họ có **phạm vi rộng hơn** |
| Thần số học | Chỉ tính, không luận (chờ anh quyết, việc 18) | Nhật Nguyệt tính đủ hơn: thái độ, thách thức, nợ nghiệp, tháng/ngày cá nhân. Lời luận theo CC BY-NC | Phần tính của mình khớp (mục 3). Lời luận của họ **không dùng được** cho site thương mại |
| Chiêm tinh | 12 cung, giờ vào cung, Tetrabiblos. Bản đồ sao hoãn vì chưa có ephemeris | taibu dùng `astronomy-engine` (MIT, em đã xác minh trên npm: bản 2.1.19) và đối chiếu JPL Horizons | Thư viện này đã có trong danh sách (R108). taibu cho thấy nó dùng được trong Next.js và cách kiểm với JPL. **Không còn gì chặn phần bản đồ sao** |
| AI trả phí | RAG, quy tắc "tính được hoặc trích được" | Hợp đồng JSON engine→LLM, tool tra chi tiết chỉ trả sự kiện, bảng xuất xứ, eval có assertion cứng | Nhiều ý đáng học nhất nằm ở đây |

## 3. Đối chiếu bằng số (em vừa chạy)

| Phép kiểm | Kết quả |
|---|---|
| Cung phi (mệnh quái) 1684–2223, cả nam và nữ, theo công thức của fengshui.skill | **1080/1080 khớp** |
| Thần số học, 600 ca Nhật Nguyệt: số chủ đạo (cách cộng mọi chữ số), số tên (sứ mệnh), năm cá nhân | **600/600 khớp** |
| Linh hồn và nhân cách | 380/380 khớp với các tên không có chữ Y. 220 ca có Y lệch vì quy ước: họ coi Y là phụ âm, mình coi là nguyên âm |
| Bốn đỉnh cao và tuổi chuyển đỉnh | Tuổi khớp 600/600. Số khớp sau khi rút về một chữ số. 153 ca lệch đều do họ giữ 11/22 khi cộng chữ số thô (ví dụ 28/10: họ ra 11, mình ra 2) |
| Tiết khí 1900–2100 so với IMCCE (4.824 mốc, giờ UT) | Lệch trung bình 3 giây quanh 2000–2024; khoảng 11–30 giây giai đoạn 1950–1999; tối đa 49 giây năm 1900 và 126 giây năm 2100. Lệch đổi chiều quanh năm 2000, có vẻ do mô hình ΔT |

Đã thêm test hồi quy `tests/trang/than-so-hoc.test.mjs` (ca "Đối chiếu 600 ca Nhật Nguyệt"), dùng tệp `tests/trang/doi-chieu/nhat-nguyet-than-so-hoc.json` (CC BY 4.0, đã ghi sổ 14).

Lệch tiết khí chỉ ảnh hưởng người sinh trong khoảng một phút quanh mốc giao tiết (trụ tháng bát tự, ngày vào cung chiêm tinh). Em ghi thành việc sau: thay mô hình ΔT bằng Espenak–Meeus, rồi lấy tệp IMCCE làm test.

## 4. Nên học, xếp theo giá trị

### A. Làm được ngay, không vướng giấy phép

1. **Bản đồ sao chiêm tinh bằng `astronomy-engine`** (R108, MIT, không phụ thuộc gì). Làm tiếp phần đang hoãn của cụm Chiêm tinh: vị trí 7 hành tinh cổ điển theo ngày giờ sinh. Kiểm bằng JPL Horizons như taibu đã làm. Lời trên trang vẫn chỉ trích Tetrabiblos. Cần cài một gói npm, nên em sẽ tự làm phần lib, giao trang cho Antigravity.
2. **Cửu tinh / Tử bạch năm, tháng** (sao nào bay tới phương nào năm 2027). Nguồn của mình đủ. Em đã kiểm bản kanripo: Hiệp kỷ biện phương thư bàn nguồn gốc Tử bạch ở quyển 2 và chép mục "三元紫白" theo từng năm ở quyển 14–18. Dùng `tests/golden` và `test_sanyuan.py` của fengshui.skill (MIT từ fe2a025) làm vector đối chiếu. Từ khóa "cửu tinh 2027", "sao chiếu phương" có lượng tìm kiếm theo mùa.
3. **Hợp đồng engine → LLM cho chat trả phí** (học ý từ numerologist và taibu, tự viết lại). Mỗi lần tính trả kèm `quyUoc` (giờ Tý, tháng nhuận, Y nguyên âm…), `canhBao` và `tuKiem`. LLM phải nói đang dùng quy ước nào. Thiếu dữ liệu thì trả lời "chưa đủ dữ kiện". Cấm dùng chữ "chắc chắn". Cấm phán kiểu đe dọa.
4. **Tool tra chi tiết chỉ trả sự kiện** (mẫu `taibu/packages/core/src/domains/ziwei/palace.ts`, MIT): tam phương tứ chính, giáp cung, phi hóa vào/ra. LLM tra qua tool thay vì tự nhìn bảng mà suy.
5. **Bảng xuất xứ 5 trạng thái** (ý của fengshui.skill): đã đối chiếu nguyên văn / đã kiểm bằng tính toán / xuất xứ phổ biến / khẩu quyết riêng một phái / đã loại. Áp lên RAG: câu nào không có trạng thái "đã đối chiếu" thì không được gọi là lời kinh điển.
6. **Eval có assertion cứng**: 1.520 câu `ai-eval/questions.jsonl` của Nhật Nguyệt (CC BY 4.0) cộng kiểu "tứ trụ phải là …" của taibu. Ghép vào `rag-cau-hoi-chuan.csv` để chấm AI đọc lá số.
7. **Hỏi trước rồi mới tính**. Giờ sinh không chắc thì lập hai lá số theo hai giờ ứng viên rồi nói chỗ khác nhau, không âm thầm điền mặc định. Không biết giờ thì bát tự chỉ lập 3 trụ.

### B. Đáng làm, cần thêm bước

8. **Bảng miếu vượng của mình**: đối chiếu với 《紫微斗數全書》 quyển 2 trên Wikisource (bản công cộng). numerologist đã làm như vậy, có ghi oldid.
9. **《穷通宝鉴》 nguyên văn theo nhật can × tháng** (`data/qiongtong.json` của fengshui.skill; văn bản là public domain, bản biên tập theo MIT). Dùng được cho RAG và cho trang bát tự kiểu "điều hậu", trích nguyên văn kèm số dòng.
10. **Thần số học bổ sung phần tính**: thái độ, thách thức, nợ nghiệp, tháng/ngày cá nhân. Đều là phép tính, kiểm được bằng bộ 600 ca. Chỉ làm nếu anh giữ phương án (a) ở việc 18.
11. **Kinh Dịch: luận "theo điều kiện có thứ tự, không chấm điểm"** của taibu (`domains/meihua`, `domains/liuyao`, MIT), mỗi bước ghi căn cứ. Hợp nếu sau này làm chat gieo quẻ trả phí.

## 5. Không nên lấy

- Mọi thứ trong `taibu/src/` và `taibu/skills/` (AGPL): chạy trên mạng thì phải công khai mã.
- `du-lieu/knowledge/` và các bộ `*-readings` của Nhật Nguyệt (CC BY-NC, có câu cài dấu). Tên và thương hiệu "Nhật Nguyệt" cũng không nằm trong giấy phép.
- Toàn bộ numerologist_skills ở dạng chép, vì không có LICENSE. Chỉ học ý tưởng.
- fengshui.skill trước commit fe2a025. Mục "常见煞气与化解" (bình phong, cây xanh…) vì trái luật không bán hóa giải của mình. Phần chấm điểm chọn ngày kiểu heuristic. Các câu "主…" về tổ hợp sao.
- Nhãn hiện đại không có nguồn: `nature` trong `hexagrams.ts` của taibu, từ khóa sao trong `stars.md`, nghĩa tarot.
- Mẫu prompt "đoán chuyện đã xảy ra" (có ở cả taibu và numerologist). Dùng để thuyết phục khách là kỹ thuật cold reading. Nếu cần định giờ sinh thì hỏi thẳng, không dùng nó làm bằng chứng.
- Kê tên sách kinh điển để tạo uy tín mà không trích được nội dung (prompt bát tự của numerologist kê cả 《果老星宗》 và 《协纪辨方书》).

## 6. Đề xuất thứ tự

1. Làm xong và đóng cụm Chiêm tinh (Lệnh 36, Antigravity đang làm).
2. Bản đồ sao bằng `astronomy-engine` (mục A1), nối vào cụm Chiêm tinh.
3. Cửu tinh năm/tháng (mục A2), nối vào cụm Phong thủy.
4. Hợp đồng engine → LLM, tool chỉ trả sự kiện, bảng xuất xứ, eval (mục A3–A6). Làm khi quay lại phần chat trả phí.
5. Sửa ΔT tiết khí và thêm test IMCCE (việc nhỏ, em tự làm xen vào).
