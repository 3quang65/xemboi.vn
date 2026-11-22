# Lệnh 24: trang xếp hạng Search Console và trang đánh giá RAG (Đợt 3)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity. Báo cáo ghi vào `docs/v2/lenh-antigravity/24-bao-cao.md`.

Đọc trước:
- `docs/v2/00-BAN-CU-BAN-MOI.md`, mục "Bẫy CSS";
- `docs/v2/17-backend-quan-tri.md`, các mục:
  - 1.5 (theo dõi xếp hạng);
  - 7.1 (dòng `/quan-tri/seo/xep-hang`);
  - phần "Đợt 3" cuối tệp, đoạn nói về tìm lai, bộ đo 100 câu và viết lại câu hỏi;
- `docs/v2/bao-cao-danh-gia-rag.md`: báo cáo bộ đo do script sinh ra; trang mới phải hiện được cùng các số này từ CSDL;
- phần lõi Claude Code đã làm (chỉ đọc, **không sửa**):
  - `src/lib/seo/gsc.ts`:
    - đồng bộ ghi hai bảng: `SeoGscNgay` (theo ngày × url × truy vấn × thiết bị) và `SeoGscTrangNgay` (tổng theo trang; số ở bảng này lớn hơn tổng theo truy vấn vì Google ẩn truy vấn hiếm).
    - `tinhCanhBaoGsc` ghi `SeoCanhBao` với `chiTiet.nguon = 'gsc'`, gồm hai loại:
      - `TUT_HANG`, `chiTiet.kieu = 'vi_tri'`: có `url, truyVan, viTri7, viTri28, hienThi7`.
      - `TUT_HANG`, `chiTiet.kieu = 'nhap'`: có `url, nhapNgay7, nhapNgay28`.
      - `TRUNG_Y_DINH`: có `truyVan`, `url` là mảng `{url, hienThi}`, và `tyLeUrl2`.
    - Báo cáo lần chạy cuối nằm ở `CaiDat` khóa `SEO_GSC_LAN_CUOI`. Nếu có `thu: true` thì đó là dữ liệu giả.
  - `src/lib/rag/tim-lai.ts`, `src/lib/rag/viet-lai-cau.ts`, `src/lib/rag/danh-gia.ts`: tìm lai, viết lại câu hỏi, chỉ số;
  - `scripts/rag-danh-gia.ts`: chạy bộ đo và ghi một dòng `rag_danh_gia` cho mỗi cấu hình. Cấu trúc dòng:
    - `moHinhNhung`: `'khong'` nghĩa là chỉ tìm theo từ khóa;
    - `cauHinh.ten`: tên cấu hình đọc được;
    - `cauHinh.nhanh`, `cauHinh.vietLai`, `cauHinh.hitAt10`, `cauHinh.msMoiCauVector`;
    - `soCau`, `recallAt10`, `mrr`, `tyLeDungNguon`, `luc`;
    - `chiTiet`: mảng `{ma, hang, recall10, dungNguonTop1, top5}`. `ma` là `rag_cau_hoi_chuan.id`, ví dụ `Q001`. `hang` là hạng của đoạn đúng đầu tiên trong top 100, `null` nếu không thấy. `top5` là mảng id đoạn dạng chuỗi.
- mẫu đã có:
  - `src/app/quan-tri/(khu)/rag/thu/page.tsx`: trang thử truy vấn. Mục 1.3 thêm nút vào trang này.
  - `src/app/quan-tri/(khu)/rag/doan/`: cách hiện đoạn, phạm vi, `HienThi.tsx`.
  - `src/app/quan-tri/(khu)/seo/lien-ket/`: Lệnh 23, cách chia tab bằng GET, `ThongBao`, `hanh-dong.ts`.

Dữ liệu ở máy trạm:
- **GSC chưa có khóa thật.** Claude Code đã nạp dữ liệu giả bằng `npx tsx --env-file=.env scripts/thu-gsc-gia.ts`:
  - 45 ngày, 3 URL `https://xemboi.vn/_thu-gsc/{a,b,c}`, các truy vấn bắt đầu bằng `[THỬ]`;
  - 450 dòng `SeoGscNgay` và 270 dòng `SeoGscTrangNgay`;
  - 4 cảnh báo mở: 3 `TUT_HANG` (một theo vị trí, hai theo nhấp) và 1 `TRUNG_Y_DINH`.

  Chạy lại lệnh đó thì dữ liệu giả được nạp lại từ đầu. Thêm `--xoa` thì xóa sạch. **Không** sửa tay các dòng này.
- **RAG:**
  - 43 dòng `rag_danh_gia`. Các lần chạy trước có cấu hình trùng tên: nhóm theo `cauHinh.ten` và lấy lần mới nhất làm mặc định.
  - 100 dòng `rag_cau_hoi_chuan`, id `Q001…Q100`.
  - Khoảng 32.000 `rag_doan`.

## 1. Việc cần làm

Server action để trong `hanh-dong.ts` cùng thư mục trang. Đây là tệp mới. Không sửa `seo/hanh-dong.ts` hay `rag/hanh-dong.ts` sẵn có; nếu bắt buộc phải sửa thì ghi rõ trong báo cáo.

### 1.1. `/quan-tri/seo/xep-hang` (xem: `seo.xem`; thao tác cảnh báo: `seo.sua`)

Tệp đặt ở `src/app/quan-tri/(khu)/seo/xep-hang/`. Trang chia tab bằng `?tab=`, mặc định `tong-quan`. Tham số chung là `?ngay=7|28|90`, mặc định 28: khoảng ngày tính lùi từ **ngày mới nhất có dữ liệu**, không tính lùi từ hôm nay (GSC trễ 2–3 ngày).

- **Khung chung, đặt trên các tab:**
  - Dòng nhỏ từ `SEO_GSC_LAN_CUOI`: lúc chạy, site, khoảng ngày, số dòng.
  - Nếu không có khóa này: một `qt-the` báo "Chưa nối Search Console. Cần tệp khóa service account (xem `docs/v2/viec-can-anh.md`)". Trang vẫn hiện, các bảng rỗng có chữ "chưa có dữ liệu".
  - Nếu `thu: true`: dải cảnh báo vàng "Dữ liệu GIẢ để thử giao diện".
- **tong-quan:**
  - 4 ô `qt-so`: tổng hiển thị, tổng nhấp, CTR, vị trí trung bình. Cả bốn lấy từ `SeoGscTrangNgay` trong khoảng đã chọn. Vị trí trung bình là trung bình có trọng số theo lượt hiển thị.
  - Mỗi ô ghi thêm chênh lệch so với khoảng liền trước cùng độ dài, có mũi tên lên/xuống. Với vị trí, số nhỏ hơn là tốt hơn.
  - Biểu đồ đường hiển thị và nhấp theo ngày. Vẽ bằng **SVG tự vẽ**, không thêm thư viện, khoảng 720×200, hai trục, nhãn ngày thưa.
  - Bảng đếm cảnh báo GSC đang mở theo loại. Bấm vào một dòng thì sang tab `canh-bao` đã lọc theo loại đó.
- **trang:**
  - Bảng theo URL từ `SeoGscTrangNgay`, cột: đường dẫn, hiển thị, nhấp, CTR, vị trí TB, chênh vị trí so với khoảng trước.
  - Sắp theo hiển thị, cho đổi cột sắp bằng `?sap=`. Lọc thiết bị `?tb=MOBILE|DESKTOP|TABLET`. 50 dòng/trang.
  - Nếu `trangId` có giá trị thì đường dẫn là liên kết sang `/quan-tri/seo/trang/[id]`; nếu không thì in URL thuần.
  - Bấm vào một URL thì mở `?tab=trang&url=...`, hiện chi tiết trang:
    - biểu đồ theo ngày của URL đó;
    - bảng truy vấn của URL đó từ `SeoGscNgay`;
    - ghi chú nhỏ: "Tổng theo truy vấn nhỏ hơn tổng theo trang vì Google ẩn truy vấn hiếm."
- **truy-van:**
  - Bảng theo `truyVan` từ `SeoGscNgay`, cột: truy vấn, số URL, URL chính (nhiều hiển thị nhất), hiển thị, nhấp, CTR, vị trí TB, chênh vị trí.
  - Ô tìm `?q=` lọc chứa chuỗi, không phân biệt hoa thường. Truyền tham số qua `Prisma.sql`, không nối chuỗi.
  - 50 dòng/trang.
  - Bấm vào một truy vấn thì hiện các URL của nó kèm phần trăm hiển thị. Nếu URL thứ hai chiếm ≥ 20 % thì tô vàng và ghi "có thể trùng ý định".
- **canh-bao:**
  - Bảng `SeoCanhBao` với `trangThai = 'MO'`, loại `TUT_HANG` hoặc `TRUNG_Y_DINH`, và `chiTiet->>'nguon' = 'gsc'`. Lọc theo loại.
  - Câu tiếng Việt dễ hiểu cho từng kiểu:
    - kiểu `vi_tri`: "«truy vấn» trên URL: vị trí 4,3 → 10,4 (hiển thị 7 ngày: 590)";
    - kiểu `nhap`: "URL: nhấp/ngày 28 ngày trước 30,1 → 7 ngày gần nhất 5,2";
    - `TRUNG_Y_DINH`: liệt kê các URL kèm lượt hiển thị.
  - Hai nút giống Lệnh 23: **Đã xử lý** và **Bỏ qua**.
    - Cần quyền `seo.sua`. Đọc lại bản ghi trong giao dịch.
    - Ghi `xuLyLuc` và `xuLyBoiId`.
    - Ghi nhật ký `seo.canh_bao` có trước/sau, cùng giao dịch.
  - Ghi chú: "Lần đồng bộ sau tự đóng cảnh báo không còn đúng; ngưỡng là giả định (doc 17 mục 1.5)."

Truy vấn tổng hợp dùng `prisma.$queryRaw` với template hoặc `Prisma.sql`, hoặc dùng `groupBy`. So cột `ngay` (kiểu DATE) bằng chuỗi `'YYYY-MM-DD'::date`, **không** truyền đối tượng `Date`: Postgres đổi theo múi giờ phiên nên lệch một ngày. Mẫu có trong `src/lib/seo/gsc.ts`, hàm `tinhCanhBaoGsc`.

### 1.2. `/quan-tri/rag/danh-gia` (xem: `rag.xem_cong_khai`; sửa câu hỏi chuẩn: `rag.sua_doan`)

Tệp đặt ở `src/app/quan-tri/(khu)/rag/danh-gia/`. Trang chia tab bằng `?tab=`, mặc định `bang`.

- **bang (bảng so sánh):**
  - Mỗi `cauHinh.ten` kết hợp `moHinhNhung` là một dòng, lấy lần chạy mới nhất.
  - Cột: tên cấu hình, mô hình nhúng, viết lại (`cauHinh.vietLai`, bỏ tiền tố `gx/`), hit@10 (`cauHinh.hitAt10`), recall@10, MRR, đúng nguồn, ms/câu vector, lúc chạy.
  - Sắp theo hit@10 giảm dần, cho đổi cột sắp.
  - Tô nổi dòng có hit@10 cao nhất.
  - Đánh dấu dòng **"đang dùng trên VPS"**: `moHinhNhung = 'khong'`, `vietLai = 'gx/qwen3.6-35b-nvfp4'` và không có `capChuCauMau`. Lấy tên mô hình từ `MO_HINH_VIET_LAI` trong `viet-lai-cau.ts` (import được, chỉ đọc).
  - Dòng phụ "N lần chạy" mở được lịch sử các lần chạy của cấu hình đó (link `?tab=lan&ten=...`).
  - Ghi chú dưới bảng, viết đúng nghĩa:
    - "hit@10: tỷ lệ câu có ít nhất một đoạn đúng trong 10 đoạn đầu";
    - "recall@10: số đoạn đúng tìm được trong top 10 chia cho min(số đoạn đúng, 10)";
    - "MRR: trung bình 1/hạng của đoạn đúng đầu tiên (top 100)";
    - "đúng nguồn: đoạn top 1 thuộc đúng sách".
- **so-sanh:**
  - Hai ô chọn lấy id `rag_danh_gia` (A và B), mặc định là "đang dùng trên VPS" và "tốt nhất".
  - Ghép `chiTiet` theo `ma` và hiện:
    - số câu B hơn A, A hơn B, bằng nhau; một câu "hơn" khi hạng nhỏ hơn, và `null` là tệ nhất;
    - bảng các câu khác nhau, cột: mã, mảng, độ khó (từ `rag_cau_hoi_chuan`, xem 1.2 bên dưới), câu hỏi, hạng A, hạng B.
  - Lọc theo mảng.
- **cau (từng câu):**
  - `?ma=Q001` hiện câu hỏi, mảng, ghi chú, đoạn đúng (`doanDung`, đọc `rag_doan` để hiện 200 chữ đầu `vanBan` và mã nguồn), vị trí đúng.
  - Bảng hạng của câu này qua mọi cấu hình mới nhất.
  - Với một cấu hình chọn bằng `?ch=`: `top5` kèm 120 chữ đầu mỗi đoạn và nguồn của nó, đoạn đúng tô xanh.
  - Đoạn phạm vi `NOI_BO` chỉ hiện chữ khi người xem có `rag.xem_noi_bo`; nếu không thì ghi "(nội bộ)". Cách làm giống `rag/doan`.
- **cau-hoi (bộ câu hỏi chuẩn):**
  - Danh sách `rag_cau_hoi_chuan`: mã, mảng, câu hỏi, số đoạn đúng, nguồn đúng, ghi chú. Lọc theo mảng. 50 dòng/trang.
  - Ghi chú đầu trang: "Bộ đo chính thức là `docs/v2/rag-cau-hoi-chuan.csv`; script `rag-danh-gia.ts` nạp lại từ tệp đó và ghi đè các mã Q001–Q100. Câu thêm từ giao diện có mã khác và **không** vào bộ đo cho tới khi Claude Code chép vào CSV."
  - Chỉ những câu **không** khớp `^Q\d{3}$` mới có nút sửa ghi chú và nút **Xóa**. Cần quyền `rag.sua_doan`, xác nhận bằng `confirm`, và ghi nhật ký `rag.cau_hoi_chuan` có trước/sau.
  - Độ khó: CSV có cột `do_kho` nhưng bảng không có cột này. Đọc `docs/v2/rag-cau-hoi-chuan.csv` bằng `docCsv` (`src/lib/rag/danh-gia.ts`) ở phía máy chủ để lấy `do_kho` theo `ma`. Nếu thiếu tệp thì để trống.

### 1.3. Trang `/quan-tri/rag/thu`: thêm nút "Lưu thành câu hỏi chuẩn"

Thêm một khối mới **dưới** bảng kết quả, không đổi logic tìm đang có.

- Khối chỉ hiện khi có câu hỏi và người xem có quyền `rag.sua_doan`.
- Form gồm:
  - câu hỏi, điền sẵn;
  - mảng, ô chọn: `tu-vi | kinh-dich | bat-tu | chon-ngay | phong-thuy | ngu-hanh`;
  - ô đánh dấu cạnh từng dòng kết quả để chọn đoạn đúng (giới hạn 10 ô);
  - vị trí đúng, ô chữ tùy chọn;
  - ghi chú, ô chữ tùy chọn.
- Server action:
  - `yeuCauQuyen('rag.sua_doan')`;
  - đọc lại các đoạn đã chọn trong giao dịch để lấy `nguonDungMa` (mã `rag_nguon`). Không tin mã nguồn gửi từ form;
  - tạo `rag_cau_hoi_chuan` với `id = 'G' + 6 số tăng dần` (G000001…), `taoBoiId = nd.id`;
  - ghi nhật ký `rag.cau_hoi_chuan` có sau, cùng giao dịch;
  - xong thì chuyển sang `/quan-tri/rag/danh-gia?tab=cau-hoi`.
- Câu hỏi giới hạn 500 ký tự, ghi chú 1000 ký tự, phải chọn ít nhất 1 đoạn.

Bảng `rag_cau_hoi_chuan` có model Prisma `RagCauHoiChuan`. Dùng `prisma.ragCauHoiChuan`, không viết SQL thô.

## 2. Quy tắc bắt buộc (như Lệnh 21–23)

1. **Không sửa:**
   - `prisma/schema.prisma`, `prisma/migrations/`;
   - `src/lib/**` (mọi thư mục con);
   - `src/middleware.ts`;
   - `src/app/api/**`;
   - `docs/v2/tai-san-xemtuvi/`;
   - `scripts/**` và `docs/v2/rag-cau-hoi-chuan.csv`.

   Thấy cần đổi phần lõi thì ghi vào báo cáo, mục "Đề nghị sửa lõi".
2. Mọi page và server action gọi `yeuCauQuyen(...)` ở **dòng đầu**. Mọi thao tác ghi có `ghiNhatKy` **trong cùng giao dịch** (`prisma.$transaction`). Server action phải đọc lại bản ghi trong giao dịch, không tin dữ liệu trong form ngoài `id` và những gì người dùng gõ.
3. Cấm `$queryRawUnsafe` và `$executeRawUnsafe`. Mọi tham số lọc hoặc sắp đi qua danh sách cho phép (whitelist), không đưa thẳng chuỗi GET vào SQL.
4. **CSS:** chỉ dùng lớp `qt-*` có trong `src/app/quan-tri/quan-tri.css`, hoặc thêm lớp mới ở cuối tệp đó với tiền tố `qt-`. **Cấm** lớp `so`, `nhan`, `gia-tri` và biến `var(--paper)`. Màu biểu đồ SVG lấy từ biến CSS quản trị sẵn có, không đặt màu cứng ngoài ý đồ.
5. Không thêm thư viện npm. Không chạy migration. Không commit.
6. **Không đụng menu** (`MENU_QUAN_TRI`): Claude Code sẽ thêm "Xếp hạng" và "Đánh giá" khi duyệt.
7. **Không gọi LLM** trong trang đánh giá. Trang chỉ đọc kết quả đã lưu. Trang `rag/thu` vẫn gọi như hiện nay.
8. Chạy test theo **từng tệp, có giới hạn thời gian** (tự dừng sau 3 phút). Không để tác vụ nền chạy quá 10 phút.
9. Dữ liệu thử phải có `[THỬ]` và xóa sau khi kiểm.
   - Câu hỏi chuẩn thử tạo từ `rag/thu` phải bắt đầu bằng `[THỬ]` và xóa bằng nút Xóa trên giao diện.
   - **Không** bấm Đã xử lý/Bỏ qua trên cảnh báo thật (loại khác). Với cảnh báo GSC giả thì được bấm. Kiểm xong chạy lại `npx tsx --env-file=.env scripts/thu-gsc-gia.ts` để nạp lại 4 cảnh báo; Claude Code cần chúng khi duyệt.

## 3. Kiểm trước khi báo xong

1. `.\node_modules\.bin\tsc.cmd --noEmit -p .` thoát mã 0.
2. `node scripts/kiem-dot1-quyen.mjs http://localhost:3047` vẫn đạt. Mật khẩu thử ở `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`; **không in mật khẩu**.
3. Chạy tay trên `http://localhost:3047`:
   - **Quyền:**
     - quản trị, biên tập và xem số liệu mở được `seo/xep-hang`; xem số liệu không dùng được nút cảnh báo, và gửi thẳng form bằng tài khoản đó phải bị máy chủ từ chối;
     - chuyên gia bị chặn ở `seo/xep-hang` nhưng mở được `rag/danh-gia`;
     - xem số liệu bị chặn ở `rag/danh-gia`.
   - **`seo/xep-hang`:**
     - có dải "dữ liệu GIẢ";
     - tab tổng quan có 4 ô số và biểu đồ;
     - tab trang có 3 URL `_thu-gsc`;
     - tab truy vấn với `q=xem tuổi` hiện 2 URL, URL thứ hai tô vàng;
     - tab cảnh báo hiện 4 cảnh báo bằng câu tiếng Việt;
     - bấm "Bỏ qua" một cảnh báo thì có dòng `seo.canh_bao` trong `/quan-tri/nhat-ky`;
     - đổi `ngay=7` thì số trên các ô đổi.
   - **`rag/danh-gia`:**
     - bảng so sánh có dòng hit@10 cao nhất 0,87 (Qwen3-0.6B + DeepSeek câu mẫu) và dòng "đang dùng trên VPS" 0,72;
     - các số khớp `docs/v2/bao-cao-danh-gia-rag.md`;
     - tab so sánh, chọn hai cấu hình đó: ghi lại số câu B hơn / A hơn / bằng nhau vào báo cáo, và kiểm tay 3 câu bất kỳ bằng cách so với `chiTiet` trong CSDL;
     - `?tab=cau&ma=Q001` hiện đoạn đúng và top 5.
   - **`rag/thu` → lưu câu hỏi chuẩn:**
     - tạo một câu `[THỬ] Thiên Lương ở Ngọ`, chọn 2 đoạn, thì có `G000001` trong tab câu hỏi và có nhật ký;
     - xóa câu đó thì có nhật ký xóa;
     - các câu `Q…` không có nút Xóa.
   - **Grep** thư mục mới và `quan-tri.css`: không có `$queryRawUnsafe`, `className="so"`, `var(--paper)`.
4. Báo cáo `24-bao-cao.md` gồm:
   - danh sách tệp;
   - cách đã kiểm và kết quả từng bước ở mục 3;
   - những gì chưa làm được và lý do;
   - đề nghị sửa lõi (nếu có);
   - xác nhận đã dọn câu hỏi `[THỬ]` và đã nạp lại dữ liệu GSC giả.
