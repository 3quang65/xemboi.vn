# Pipeline RAG máy trạm (Đợt 1)

Pipeline Python chạy trên máy trạm Windows (RTX 2080 Ti). Nó nạp danh mục nguồn và xử lý văn bản sạch
Kanripo và Wikisource thành đoạn có vector bge-m3 trong Postgres (pgvector).
Thiết kế: `docs/v2/17-backend-quan-tri.md` mục 3.1, 3.2, 3.6 và `docs/v2/12-thu-vien-rag.md` mục 4, 5, 6.

## Cài đặt

Venv nằm ngoài repo, ở `D:\VibeCode\Antigravity\may-tram\venv`, dùng Python 3.15.2.
PyTorch đã có wheel CUDA cho 3.15 (cu130), nên không cần lùi về 3.14.

```powershell
C:\Python315\python.exe -I -m venv D:\VibeCode\Antigravity\may-tram\venv
$py = "D:\VibeCode\Antigravity\may-tram\venv\Scripts\python.exe"
& $py -I -m pip install torch==2.14.1 --index-url https://download.pytorch.org/whl/cu130
& $py -I -m pip install -r tools/rag-may-tram/requirements.txt
& $py -I -c "import torch; print(torch.cuda.is_available())"   # phải ra True
```

- Mô hình `BAAI/bge-m3` (MIT, 2,27 GB `pytorch_model.bin`) nằm ở `D:\VibeCode\Antigravity\may-tram\hf`. Đường này là `HF_HOME` mặc định trong `nhung.py`.
- Lần chạy đầu sẽ tự tải mô hình nếu chưa có. Đã dùng bản commit `5617a9f61b02`.
- `DATABASE_URL` được đọc từ biến môi trường, nếu không có thì từ `.env` ở gốc repo. Mật khẩu không bao giờ được in ra.

Luôn chạy bằng `python -I`. Script tự thêm thư mục của chính nó vào `sys.path`, ngoài ra không thêm gì.
Thư viện tải về (`D:\VibeCode\Antigravity\thu-vien-rag`) được coi là dữ liệu không tin cậy: pipeline chỉ đọc chữ, không chạy mã nào trong đó.

## Lệnh

```powershell
$py = "D:\VibeCode\Antigravity\may-tram\venv\Scripts\python.exe"
& $py -I tools/rag-may-tram/chay.py nap-danh-muc --xem-truoc   # in khác biệt, không ghi
& $py -I tools/rag-may-tram/chay.py nap-danh-muc               # upsert 314 dòng rag_nguon
& $py -I tools/rag-may-tram/chay.py xu-ly --nguon WS01 KR3g0041 # bước 1–6 cho từng nguồn
& $py -I tools/rag-may-tram/chay.py xu-ly --dot1               # mọi nguồn Kanripo/Wikisource của Đợt 1 đã tải
& $py -I tools/rag-may-tram/chay.py xu-ly --nguon WS01 --tu-buoc 4 --don-cu  # cắt lại, xóa đoạn cũ không còn
& $py -I tools/rag-may-tram/chay.py xu-ly --chay-lai-loi       # chạy lại mọi việc LOI
& $py -I tools/rag-may-tram/chay.py trang-thai
& $py -I tools/rag-may-tram/truy_van.py "Tử Vi tại Ngọ" "Thiên Phủ" "Hóa Kỵ" [--mo-rong] [--cong-khai] [--k 5]
```

`--dot1` lấy các nguồn pháp lý A, đã tải, thuộc một trong các nhóm sau (12 mục 4):
- KR3g\*, KR1a\*, KR3f0018;
- WS01–WS17, WS24, WS25.

Nguồn mảng **M Tướng số** bị bỏ qua, vì 12 mục 6 rủi ro 9 quy định chỉ giữ ở mức danh mục. Muốn xử lý thì thêm `--cho-mang-cam`.
Mã không phải KR hay WS thì bị từ chối, vì Đợt 1 chỉ làm văn bản sạch.

## Nạp danh mục (`danh_muc.py`)

- Ghép `docs/v2/12-thu-vien-rag.csv` với `thu-vien-rag\so-tai.csv` theo `ma`.
- **Dừng** khi `phap_ly` của hai tệp lệch nhau. Cũng dừng khi pháp lý trong CSV khác giá trị đang có trong CSDL, trừ khi chạy với `--chap-nhan-doi-phap-ly`.
- Upsert trên `ma`. Chạy lại thì dòng không đổi được giữ nguyên, nhờ điều kiện `WHERE (...) IS DISTINCT FROM`.
- Mặc định **chỉ áp lúc chèn**:
  - A: `chiNoiBo=false`, `xinPhep=KHONG_CAN`;
  - B, C và nguồn chưa xếp loại: `chiNoiBo=true`, `xinPhep=CHUA_XIN`. Nguồn chưa xếp loại được lưu tạm là C, kèm ghi chú.
- Khi cập nhật, `chiNoiBo` và `xinPhep` **không** bị ghi đè, vì người có thể đã sửa chúng.
- **Không bao giờ gửi `phamVi`.** Trigger `rag_nguon_tinh_pham_vi` tự tính giá trị này.
- CSV không có cột riêng cho `giayPhep` và `ghiCong`, nên hai trường này được rút từ `ghi_chu_phap_ly`. Ví dụ: "Văn bản: Kanripo, CC BY-SA 4.0".
- `duongDanCucBo` chỉ được ghi khi so-tai ghi "đã tải". Với các trạng thái khác, cột `noi_luu_hoac_ly_do` là lý do lỗi chứ không phải đường dẫn.

## Các bước (`chay.py xu-ly`)

| # | Bước (`rag_viec.loai`) | Cấp | Đầu ra |
|--:|:--|:--|:--|
| 1 | `PHAT_HIEN` | nguồn | `rag_tep`: đường dẫn tương đối so với `thu-vien-rag`, cỡ, sha256, kiểu `TXT`/`JSON`. Bỏ `.git`, `Readme.org` |
| 2a | `TRICH` (`trich.py`) | tệp | `rag_van_ban`, mỗi quyển Kanripo hoặc mỗi trang wiki một dòng: `vanBanTho` là bản gốc, `vanBanSach` là bản đã bỏ mã đánh dấu |
| 3 | `LAM_SACH` (`lam_sach.py`) | tệp | Chuẩn hóa dị thể tối thiểu (xem dưới), tách chú nhỏ `(…/…)` khỏi chính văn |
| 4 | `CAT_DOAN` (`cat_doan.py`) | tệp | Danh sách đoạn kèm `duongDan`, `loai`, `chaIdx`, `meta.the` |
| 5 | `NHUNG` (`nhung.py`) | nguồn | bge-m3 dense 1024 chiều, L2, fp16 trên GPU, lô 32. Chuỗi đem nhúng là `tên sách · quyển · thiên · mục` + xuống dòng + `vanBanChuan` |
| 6 | `NAP_DB` | nguồn | `rag_doan`: `bamNoiDung = sha256(vanBan)`, bỏ qua đoạn trùng trong cùng nguồn, ghi `embedding`, `moHinhNhung`, `nhungLuc`, `chaId` |

- Đầu ra trung gian của bước 2–5 nằm ở `D:\VibeCode\Antigravity\may-tram\rag-tam\<ma>\`, ngoài repo:
  - `*.trich.json`, `*.sach.json`, `*.doan.json`;
  - `nhung.npz`, là vector được khóa theo sha256 của chuỗi nhúng. Chạy lại thì không phải nhúng lại.
- **Hàng việc.** Mỗi bước là một dòng `rag_viec` (`noiChay=MAY_TRAM`), đi theo trạng thái `CHO → DANG_CHAY → XONG | LOI`.
  - Lỗi được ghi vào cột `loi` kèm traceback, đồng thời tăng `soLanThu`. Mặc định `toiDaThu` = 3.
  - Việc được nhận bằng `SELECT … FOR UPDATE SKIP LOCKED`.
  - `thamSo` gồm sha256 của tệp và phiên bản của mọi công cụ phía trước. Tệp hoặc công cụ đổi thì bước sau tự chạy lại. Không đổi gì thì bước được bỏ qua (`bo_qua`).
  - `--tu-buoc N` làm lại từ bước N. `--chay-lai-loi` đặt lại lượt thử của các việc đã hết lượt.
- **Máy xử lý.** Lúc khởi động, máy tự đăng ký vào `rag_may_xu_ly` (`may-tram-1`, đổi được qua `RAG_MAY_ID`). Cột `phienBan` ghi phiên bản Python, torch, CUDA, GPU và công cụ. Trong lúc chạy, máy gửi nhịp tim mỗi 60 giây.
- **Phạm vi.** `phamVi` của đoạn do trigger `rag_doan_dat_pham_vi` lấy từ nguồn. Pipeline không gửi giá trị này.

### Cắt đoạn (12 mục 5.2)

- **Văn xuôi:** 150–400 chữ (chữ Hán, cộng số từ La-tinh với tiếng Việt).
  - Không cắt giữa câu. Gối đầu 1 câu (≤ 60 chữ) khi cùng thiên.
  - Văn không chấm câu (bản Tứ khố) thì cắt cứng khoảng 300 chữ, ưu tiên cắt ngay sau một chú.
- **Phú** (tiêu đề có 賦/歌/訣/謠): 2–4 cặp câu một đoạn, không cắt giữa cặp. Mỗi cặp là một câu kết bằng 。！？.
- **Vấn đáp** (tiêu đề bắt đầu bằng 問): mỗi sao một đoạn. Dài quá 800 chữ thì tách.
- **Kinh Dịch** (mục có từ 2 dòng hào 初九/六二/…/用六 trở lên):
  - lời quẻ và mỗi hào là một đoạn;
  - 彖曰/象曰/文言曰 là đoạn `loai='chu'`, có `chaId` và `meta.cha` trỏ về hào có câu trùng (≥ 4 chữ), nếu không có thì trỏ về lời quẻ.
- **Chú nhỏ trong ngoặc** được tách thành đoạn `chu` nối về chính văn. Việc này giúp không nhầm lời chú đời sau thành lời kinh.
- **Bảng** (wikitable, hoặc chuỗi dòng rất ngắn không dấu câu): `loai='bang'`, **không nhúng**, dòng bảng để trong `meta.bang`.
- **Đường dẫn:**
  - Kanripo: quyển (`JUAN`), rồi tiêu đề `**`/thiên/mục. Tiêu đề trong bản không chấm câu được đoán theo lề thụt, độ dài và chữ khóa (論, 歌, 訣, 圖…).
  - Wikisource: trang con, rồi các tiêu đề `==`.

### Chuẩn hóa (`vanBanChuan`)

- `vanBan` giữ nguyên chữ của bản gốc để trích.
- `vanBanChuan` dùng để tìm, và được tạo như sau:
  - OpenCC giản → phồn, **chỉ** khi đoạn là giản thể. Cách đoán: s2t đổi nhiều chữ hơn t2s.
  - Các chữ vốn cũng là phồn thể có nghĩa riêng được giữ nguyên: 斗 巨 干 台 云 余 卷… Nhờ vậy 紫微斗數 và 巨門 không bị hỏng.
  - Áp bảng dị thể nhỏ: 爲→為, 禄→祿, 隂→陰, 无→無…
  - Chữ tương thích CJK được chuyển về chữ thống nhất. Mã chữ thiếu của Kanripo `&KR0008;` được thay bằng 〓.

## Nghiệm thu Đợt 1 (chạy 22/11/2026)

Lệnh đã chạy: `chay.py nap-danh-muc`, rồi `chay.py xu-ly --dot1`. Sau đó chạy lại lần nữa với `--don-cu`, vì `catdoan v1.1` bỏ các chú quá ngắn.

| Chỉ số | Kết quả |
|:--|--:|
| `rag_nguon` | 314 dòng. Trigger tính ra 164 dòng `CONG_KHAI` (đúng 164 nguồn A); 150 dòng `chiNoiBo` |
| Nguồn đã xử lý (`DA_NAP`) | 72: WS01–WS17, WS24, WS25; 43 sách KR3g; 10 sách KR1a; KR3f0018 |
| Bỏ qua | KR3g0043–0046 (mảng M Tướng số, chỉ giữ ở danh mục). Các mã so-tai ghi "lỗi" (KR3g0002, 0008, 0009, 0010, 0011) |
| `rag_tep` / `rag_van_ban` | 671 tệp / 983 trang |
| `rag_doan` | 32.061 đoạn: 22.173 `chinh_van`, 9.860 `chu`, 28 `bang` |
| Đoạn có vector | 32.033. Chỉ 28 đoạn bảng không có vector, đúng như thiết kế |
| Đoạn `chu` nối về chính văn (`chaId`) | 9.300, không có `chaId` nào trỏ vào đoạn không tồn tại |
| `rag_viec` | Mọi việc `XONG`. Đường lỗi đã được thử: việc `LOI` ghi traceback và `soLanThu`, sau đó `--chay-lai-loi` chạy lại thành công |
| Test phạm vi | `node --test tests/dot1/rag-pham-vi.test.mjs`: 11/11 |
| Chạy lại không đổi gì | Mọi bước `bo_qua`, không chèn trùng |

Sách thuật số nhóm KR3g đã có vector, ví dụ:
- 李虛中命書 (KR3g0033), 星學大成 (KR3g0041), 三命通會 (KR3g0042);
- 珞琭子賦註 (KR3g0036), 星命溯源 (KR3g0035), 唐開元占經 (KR3g0018);
- 欽定協紀辨方書 (KR3g0051), 六壬大全 (KR3g0031).

### Tốc độ nhúng (RTX 2080 Ti, fp16, lô 32, bge-m3 dense)

| Đo | Đoạn | Giây GPU | Đoạn/giây | Token/giây |
|:--|--:|--:|--:|--:|
| Cộng dồn toàn Đợt 1 (72 nguồn) | 32.628 | 108,5 | **≈ 300** | **≈ 53.700** (5,83 triệu token) |
| WS01 紫微斗數全書 (đoạn dài, ~270 token) | 264 | 1,71 | 154 | 41.400 |
| KR3g0041 星學大成 (~240 token) | 1.463 | 5,83 | 251 | 59.700 |
| KR3g0042 三命通會 (~280 token) | 1.632 | 7,85 | 208 | 58.600 |
| KR1a0008 周易集解 (hào ngắn, ~50 token) | 3.329 | 3,46 | 963 | 48.400 |

- Giây GPU đo quanh `model.encode` có `cuda.synchronize`, không tính thời gian nạp mô hình (khoảng 5 giây).
- Với đoạn văn xuôi dài 150–400 chữ, nên tính khoảng **150–250 đoạn/giây**.
- Nạp 40.000 đoạn (17 mục 3.2.1) mất khoảng 3–4 phút GPU.
- Chi phí API: 0 đồng.

## Giới hạn còn lại

- **Tiêu đề trong bản Tứ khố (không chấm câu) là đoán.**
  - Có thể sót: đoạn dính vào thiên trước.
  - Có thể bắt nhầm: câu thơ thụt lề thành tiêu đề.
  - Lời chú không đặt trong ngoặc (bản WYG in chú thành dòng thụt lề) không tách được khỏi chính văn. Ví dụ: 珞琭子賦註.
- **Vẫn còn đoạn rất ngắn.**
  - Có đoạn chưa tới 8 chữ, như "天七地八" hay chú thích hình. Phần lớn là lời hào Kinh Dịch, đúng như thiết kế.
  - Các đoạn ngắn ngoài Kinh Dịch đôi khi lọt vào top 5. Nên lọc theo độ dài hoặc gộp ở bản cắt sau.
- **Bảng chỉ nhận ra wikitable và các chuỗi dòng ngắn.**
  - Bảng vẽ bằng ký tự `| | |` trong WS01 卷二 "安身命例" vẫn bị nhúng như văn xuôi.
  - Bảng chưa được dựng thành JSON có cấu trúc để đối chiếu engine.
- **Văn bản Wikisource giản thể (WS04, một phần WS01) giữ khoảng trắng gãy dòng của bản gốc** trong `vanBan`. `vanBanChuan` không bị ảnh hưởng.
  - Chuẩn hóa dị thể mới ở mức tối thiểu, chưa có bảng dị thể đầy đủ.
- **Câu hỏi tiếng Việt khớp kém với văn ngôn** nếu không mở rộng thuật ngữ. Ví dụ "Thiên Phủ" trần ra toàn 唐開元占經.
  - Thêm `--mo-rong` (Thiên Phủ → 天府) thì kết quả đúng sách 紫微斗數全書 hơn.
  - Bảng `thuat_ngu` còn trống; `truy_van.py` đang dùng một bảng tạm khoảng 40 mục.
  - Cần nạp `thuat_ngu` (114 sao, can chi…) và làm bộ thử 100 câu (12 mục 5.3) trước khi chốt mô hình.
- **Chưa làm ở bước này:**
  - vector thưa của bge-m3;
  - tìm lai vector + `tsv` theo RRF;
  - bigram chữ Hán cho `tsv`;
  - đẩy lên VPS qua đường hầm SSH bằng vai trò `xemboi_worker`.
  - Hiện pipeline ghi thẳng vào Postgres cục bộ bằng `DATABASE_URL`.
- **Trùng giữa các nguồn được giữ lại.** Có 2.404 đoạn trùng nguyên văn với nguồn khác, ví dụ Kinh Dịch giữa KR1a và WS13. Lý do giữ: phạm vi và nguồn gốc tính theo từng nguồn. Chỉ bỏ trùng trong cùng một nguồn.
- **`--don-cu` chỉ xóa đoạn chưa ai đụng tới,** tức chưa có `rag_doan_sua`, `rag_doan_nhan` hay `NoiDungTrichDan`. Chưa có bước áp lại phần sửa tay ở `RagDoanSua`.
