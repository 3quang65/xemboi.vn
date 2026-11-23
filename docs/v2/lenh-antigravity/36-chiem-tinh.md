# Lệnh 36: Cụm `/chiem-tinh` (hub, 12 cung hoàng đạo + tra cung, 12 trang cung)

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/36-bao-cao.md`.

Ràng buộc như Lệnh 25, 31–35:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung;
- **không tự dịch** câu trích tiếng Anh;
- chỉ đặt liên kết tới trang có trong `trangDaDung()`;
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css` (đã chạm trần 60 KB), `ck-nen.css`;
- `src/components/ck/DauTrang.tsx` (nút "Thêm" đã làm ở Lệnh 35; mục "Chiêm tinh" đã có cờ `them`, tự vào nhóm "Thêm").

## Vì sao

Menu đã có mục "Chiêm tinh" (`/chiem-tinh`, `/chiem-tinh/cung-hoang-dao`), nhưng các trang này đang 404.

Dòng SEO: `CT`, `CT-CHD`, `CT-CUNG` trong `docs/v2/16-seo-trang.csv`; chữ đã sửa cho khớp nội dung dưới đây.

**Không làm** các trang sau:
- `/chiem-tinh/ban-do-sao` (chờ giấy phép ephemeris);
- `/chiem-tinh/ban-do-sao-doi`, `/chiem-tinh/hanh-tinh/*`, `/chiem-tinh/nha/*` (P3).

## Điều quan trọng nhất: chỉ có điều tính được và điều Tetrabiblos ghi

Nguồn duy nhất là *Tetrabiblos* của Ptolemy, bản dịch Anh J. M. Ashmand 1822 (phạm vi công cộng). Không viết những nội dung sau:
- tính cách, điểm mạnh yếu, "người cung X thường…";
- nghề hợp, tình yêu, "cung nào hợp cung nào", xếp hạng "nhất";
- nguyên tố Lửa/Đất/Khí/Nước, màu, đá, con số may mắn: Tetrabiblos không có;
- lịch sử, thần thoại, hình tượng của từng cung;
- dịch câu tiếng Anh sang tiếng Việt.

Ở chỗ người đọc mong thấy tính cách (trang cung, kết quả tra cung), hiện **đúng câu `GHI_CHU_TINH_CACH`**.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/chiem-tinh.ts`

Tệp này import `tiet-khi.mjs`, nên **chỉ dùng ở server**. Công cụ tra cung render ở server theo tham số URL.

| Tên | Trả về |
|---|---|
| `CUNG_HOANG_DAO` | 12 cung, xếp theo thứ tự Bạch Dương → Song Ngư. Mỗi cung có:<br>`thu`, `ten`, `tenKhac` (vd `['Thiên Yết','Hổ Cáp']`), `en`, `la`, `kyHieu` (♈︎…), `slug`, `tuDo`;<br>`loai` (`chi` \| `phan` \| `co-dinh` \| `song-the`), `duong` (dương/âm), `chuNha`, `tamHop` (1–4);<br>`vuong`, `ham` (hành tinh hoặc null), `trichNha`, `trichVuong` |
| `cungTheoSlug(s)` | một cung hoặc `undefined` |
| `TEN_LOAI[loai]` | `{ ten: 'Chí', en: 'tropical' }`… |
| `trichLoai(loai)` | câu trích ch. XIV của nhóm đó |
| `TAM_HOP` | 4 tam hợp: `thu`, `chuNgay`, `chuDem`, `phuong`, `trich` |
| `tamHopCua(c)` | tam hợp của cung `c` |
| `cungCungTamHop(c)` | 3 cung cùng tam hợp |
| `cungDoi(c)` | cung đối |
| `nhaCuaHanhTinh(h)` | các cung hành tinh `h` làm chủ nhà |
| `TEN_ANH_HANH_TINH[h]` | tên tiếng Anh của hành tinh |
| `TRICH.*` | câu trích `{ en, chuong, trang }`; `TRICH.amDuong` dùng cho mục dương/âm |
| `viTriTrich(t)` | "Tetrabiblos, quyển I, chương XX (bản Ashmand 1822, tr. 28)" |
| `NGUON_TETRABIBLOS` | `ten, ban, url, giayPhep, ghiCong, ghiChuTrich` |
| `mocVaoCung(nam)` | 12 `Date`: lúc Mặt Trời vào từng cung trong năm dương lịch `nam` (thứ tự cung; Bảo Bình, Song Ngư rơi vào tháng 1, 2) |
| `sangGioVN(d)`, `vietGioVN(g)` | đổi sang giờ VN; vd "03:46 ngày 21/03/2026" |
| `khoangCungTrongNam(thu, nam)` | `{ batDau, ketThuc }` theo giờ VN |
| `khoangNgayVaoCung(thu)` | `{ som, muon, tu: 1930, den: 2030 }`: ngày vào cung sớm nhất, muộn nhất |
| `traCung(ngay, thang, nam, gio?, phut?)` | `{ cung, kinhDo, chuyen, coGio }`. `chuyen` khác null khi ngày đó Mặt Trời đổi cung: `{ truoc, sau, luc }` |
| `duongDanCung(c)` | `/chiem-tinh/cung-hoang-dao/{slug}` |
| `GIOI_HAN`, `GHI_CHU_TINH_CACH`, `GHI_CHU_HOANG_DAO` | câu bắt buộc |

Lấy năm hiện tại bằng `ngayHienTaiVN().nam` (`src/lib/trang/lich.ts`).

## Điều bắt buộc khi hiện

- **Mỗi câu trích**:
  - tiếng Anh nguyên văn trong `<blockquote lang="en">`;
  - dòng nhỏ `viTriTrich(t)` ngay dưới;
  - không thêm bản dịch.
- Cuối mỗi trang:
  - `NGUON_TETRABIBLOS.ghiCong` (liên kết `url`);
  - `NGUON_TETRABIBLOS.ghiChuTrich`;
  - `GIOI_HAN`.
- Câu tự viết bằng tiếng Việt chỉ được **tả dữ liệu**, vd "Chủ nhà: Sao Hỏa (Mars)", "Tam hợp thứ 1: Bạch Dương, Sư Tử, Nhân Mã".
- Nhãn tiếng Việt kèm tiếng Anh trong ngoặc:
  - Chí (tropical), Phân (equinoctial), Cố định (fixed), Song thể (bicorporeal);
  - Dương (masculine, diurnal), Âm (feminine, nocturnal);
  - Vượng (exaltation), Hãm (fall).
- Ký hiệu cung (♈︎…) dùng `kyHieu` (đã kèm U+FE0E để không thành emoji), font serif sẵn có.

## 1. Việc cần làm

### 1.1. Route

| Đường dẫn | Dòng SEO | Ghi chú |
|---|---|---|
| `src/app/(v2)/chiem-tinh/page.tsx` | `CT` | hub |
| `src/app/(v2)/chiem-tinh/cung-hoang-dao/page.tsx` | `CT-CHD` | bảng 12 cung + công cụ tra cung: `?ngay=1990-08-15&gio=14:30`, `gio` không bắt buộc |
| `src/app/(v2)/chiem-tinh/cung-hoang-dao/[cung]/page.tsx` | `CT-CUNG` | 12 trang |

- Trang `[cung]`: `cungTheoSlug` undefined → `notFound()`. Có `generateStaticParams`.
- `revalidate = 3600`.
- Có tham số thì `robots: { index: false, follow: true }`, canonical sạch, làm như cụm Thần số học.
- Form `method="get"`:
  - `<input type="date" name="ngay" min="1900-01-01" max="2100-12-31">`;
  - `<input type="time" name="gio">` không bắt buộc.

  Ngày hoặc giờ sai thì báo lỗi trong form, không 500. Đọc ngày bằng `docNgay` của `src/lib/trang/than-so-hoc.ts` (dùng chung được).

### 1.2. Metadata

| Trang | `mau` | `thamSo` |
|---|---|---|
| hub, cung-hoang-dao | — | — |
| trang cung | `/chiem-tinh/cung-hoang-dao/{cung}` | `{ cung: slug, Tên: ten, 'tên': ten.toLowerCase(), English: en, khoang: '20/3 – 19/4' }` |

`khoang` lấy theo **năm nay**: `khoangCungTrongNam(thu, namNay)`, từ `batDau` tới ngày của `ketThuc` trừ 1, dạng "d/m – d/m".

JSON-LD (escape `<`):
- hub: `CollectionPage`;
- cung-hoang-dao: `WebApplication` + `DefinedTermSet` (12 cung);
- trang cung: `DefinedTerm` (`inDefinedTermSet` = URL cung-hoang-dao, `alternateName` = tên Anh + tên khác) + `WebPage`.

`BreadcrumbList` để `KhungTrang` lo, như Lệnh 35.

Breadcrumb `tenCuoi` = "Cung {ten}".

### 1.3. Hub `/chiem-tinh`

1. Thẻ lớn **Tra cung hoàng đạo** → `/chiem-tinh/cung-hoang-dao`, kèm form ngày sinh nhỏ gửi sang đó.
2. **Vòng 12 cung** (SVG):
   - 12 ô 30°, Bạch Dương bắt đầu ở bên trái (vị trí 9 giờ), đi ngược chiều kim đồng hồ;
   - mỗi ô có ký hiệu và tên Việt, bấm vào thì sang trang cung;
   - vành trong ghi 4 mốc Xuân phân, Hạ chí, Thu phân, Đông chí ở đầu Bạch Dương, Cự Giải, Thiên Bình, Ma Kết;
   - nếu là năm nay thì kèm ngày giờ VN của 4 mốc (`mocVaoCung(namNay)` chỉ số 0, 3, 6, 9);
   - chữ đọc được ở 375 px.
3. **Bốn nhóm theo Tetrabiblos**, mỗi nhóm một khối có câu trích:
   - Chí / Phân / Cố định / Song thể (`trichLoai`);
   - Dương / Âm (`TRICH.amDuong`);
   - 4 tam hợp (`TAM_HOP`, mỗi tam hợp: 3 cung, chủ ngày, chủ đêm, phương, câu trích);
   - **Nhà của hành tinh**: bảng 7 hành tinh → cung (`nhaCuaHanhTinh`), kèm câu trích của từng hành tinh.
4. `GHI_CHU_HOANG_DAO`.
5. `KhoiDienGiai` với `noiDungTheoDuongDan('/chiem-tinh')`, chỉ khi có nội dung đã duyệt.
6. Khối nguồn và `GIOI_HAN`.

### 1.4. 12 cung + tra cung `/chiem-tinh/cung-hoang-dao`

1. Form: ngày sinh dương lịch, giờ sinh (không bắt buộc). Dưới form ghi: "Giờ Việt Nam (UTC+7). Không nhập giờ thì tính lúc 12:00."
2. Khi có kết quả:
   - thẻ lớn: ký hiệu, "Cung {ten}" ({en}), liên kết trang cung;
   - dòng "Kinh độ Mặt Trời lúc đó: {kinhDo, 2 số lẻ}°";
   - nếu `chuyen`: khối nổi bật "Ngày {d/m/y} Mặt Trời chuyển từ {truoc.ten} sang {sau.ten} lúc {gio:phut} giờ Việt Nam." Thêm "Sinh trước giờ này là {truoc.ten}, từ giờ này là {sau.ten}." Nếu `!coGio`, nhắc nhập giờ sinh để biết chắc;
   - `GHI_CHU_TINH_CACH`.
3. **Bảng 12 cung** (luôn hiện). Cột:
   - ký hiệu;
   - tên Việt (kèm `tenKhac` nhỏ);
   - tiếng Anh;
   - **năm nay** từ ngày giờ → tới ngày giờ (`khoangCungTrongNam`);
   - chủ nhà;
   - tam hợp.

   Mỗi dòng liên kết trang cung. 375 px: bảng gọn (ẩn bớt cột hoặc thành thẻ), không tràn ngang trang.
4. Một dòng: "Ngày vào cung xê dịch 1–2 ngày giữa các năm vì năm dương lịch không khớp đúng một vòng Mặt Trời (năm nhuận, giờ chuyển). Muốn biết chắc với người sinh sát ngày chuyển, hãy nhập cả giờ sinh."
5. `GHI_CHU_HOANG_DAO`, nguồn, `GIOI_HAN`.

### 1.5. Trang cung `/chiem-tinh/cung-hoang-dao/{cung}`

1. Đầu trang:
   - ký hiệu lớn, "Cung {ten}", tên khác, tiếng Anh, tên Latinh (`la`);
   - "Từ {tuDo}° đến {tuDo + 30}° kinh độ hoàng đạo".
2. **Ngày Mặt Trời ở cung {ten}**:
   - năm nay và năm sau: từ … tới … (giờ VN);
   - bảng 11 năm (năm nay − 5 tới năm nay + 5): năm, giờ vào cung;
   - một dòng từ `khoangNgayVaoCung(thu)`: "Trong các năm 1930–2030, Mặt Trời vào cung {ten} sớm nhất ngày {som}, muộn nhất ngày {muon}";
   - liên kết công cụ tra cung.
3. **Theo Tetrabiblos**: bảng gồm:
   - nhóm (`TEN_LOAI`) + câu `trichLoai`;
   - Dương/Âm;
   - chủ nhà (+ cung còn lại của hành tinh đó, liên kết) + `trichNha`;
   - tam hợp: 3 cung (liên kết), chủ ngày/đêm, phương + câu trích tam hợp;
   - vượng/hãm nếu có (`vuong`: "Cung vượng của {vuong}"; `ham`: "Cung hãm của {ham}") + `trichVuong`. Cung hãm không có trichVuong riêng thì lấy câu của hành tinh đó: tìm cung có `vuong === ham`, dùng `trichVuong` của cung ấy;
   - cung đối (liên kết).
4. `GHI_CHU_TINH_CACH`.
5. Thanh 12 cung chuyển nhanh; liên kết hub, bảng 12 cung.
6. Nguồn, `GIOI_HAN`.

### 1.6. CSS

- Tệp mới `src/app/(v2)/chiem-tinh/chiem-tinh.css` (trần 30 KB), lớp `ck-ct-*`, nạp bằng `layout.tsx` của cụm.
- Màu, font lấy biến của `ck.css`. Giữ phong cách cổ điển như các cụm trước.
- Không dùng ảnh nền vũ trụ, tinh vân, ánh sáng huyền bí, emoji.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua, có `chiem-tinh.test.mjs`.
- Dev trả 200:
  - `/chiem-tinh`, `/chiem-tinh/cung-hoang-dao`;
  - `?ngay=1990-08-15`, `?ngay=2026-03-20`, `?ngay=2026-03-20&gio=23:30`;
  - 12 trang cung `bach-duong`, `kim-nguu`, `song-tu`, `cu-giai`, `su-tu`, `xu-nu`, `thien-binh`, `bo-cap`, `nhan-ma`, `ma-ket`, `bao-binh`, `song-ngu`.
- Dev trả 404: `/chiem-tinh/cung-hoang-dao/abc`.
- `?ngay=abc`, `?ngay=2023-02-29`, `?gio=25:00` trả 200 có báo lỗi.
- Đối chiếu:
  - 15/08/1990 ra Sư Tử;
  - 01/01/2000 ra Ma Kết;
  - ngày Mặt Trời vào Bạch Dương năm 2026 (lấy `mocVaoCung(2026)[0]`) có khối chuyển cung Song Ngư → Bạch Dương và giờ chuyển;
  - Bọ Cạp: chủ nhà Sao Hỏa (cùng Bạch Dương), tam hợp 4 (Cự Giải, Bọ Cạp, Song Ngư), hãm của Mặt Trăng, cung đối Kim Ngưu;
  - Ma Kết: Chí, Âm, chủ nhà Sao Thổ, vượng của Sao Hỏa, hãm của Sao Mộc.
- Không câu nào tả tính cách, nguyên tố, hợp cung, và không có bản dịch câu trích. Tự rà và ghi vào báo cáo.
- Title không còn `{...}`; 0 lỗi console; không tràn ngang ở 375 px; không liên kết 404; menu "Thêm" có "Chiêm tinh".
- Chụp ở 1366 và 375, lưu `docs/v2/bang-chung/ck-chiem-tinh-*.png`: hub, cung-hoang-dao có kết quả chuyển cung, Bọ Cạp, Ma Kết.
- Báo cáo theo mẫu Lệnh 25.
