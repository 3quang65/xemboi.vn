# Lệnh 34: Cụm `/phong-thuy` (hub, tra cung phi, 8 trang cung, bát trạch, hướng nhà)

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/34-bao-cao.md`.

Ràng buộc như Lệnh 25, 31, 32, 33:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung, **không tự dịch, không tự giảng** nguyên văn chữ Hán;
- không viết lời khuyên kiểu "nên đặt cửa/bếp/giường/bàn thờ ở…", "hóa giải", "kích tài lộc", "mua vật phẩm";
- chỉ đặt liên kết tới trang có trong `trangDaDung()`;
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css` (đã chạm trần 60 KB);
- component `src/components/ck/*` (dùng lại được, không sửa).

## Vì sao

Menu đã có mục "Phong thủy" (`/phong-thuy`, `/phong-thuy/cung-phi`, `/phong-thuy/bat-trach`, `/phong-thuy/huong-nha`), nhưng các trang này đang 404. Dòng SEO: `PT`, `PT-CUNGPHI`, `PT-CUNGPHI-LEAF`, `PT-BATTRACH`, `PT-HUONGNHA` trong `docs/v2/16-seo-trang.csv` (đã sửa chữ cho khớp nội dung dưới đây). **Không làm** `/phong-thuy/thuoc-lo-ban` và `/phong-thuy/hoi-dap` (chưa có nguồn, chưa có bài).

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/phong-thuy.ts`

Mọi thứ trên trang là **nguyên văn có nguồn** (Hiệp kỷ biện phương thư, Kanripo KR3g0051) hoặc **phần tính được**.

| Tên | Trả về |
|---|---|
| `BAT_CUNG` | 8 cung: `ten, han, slug, kyHieu (☰…☷), hao, so (số Lạc thư), hanh, phuong ("Tây Bắc"…), son [3 sơn], tuDo, denDo (độ la bàn), nhom ('Đông' \| 'Tây'), loai` |
| `cungTheoSlug(slug)`, `cungTheoTen(ten)` | một cung hoặc `undefined` |
| `DU_NIEN_8` | 8 du niên, 4 cát trước: `ten, han, sao, saoHan, cat, bien, moTaBien ("biến hào trên cùng"…), trich` |
| `duNienGiua(a, b)` | du niên giữa hai cung (tên) |
| `batPhuong(tenCung)` | 8 dòng `{ duNien, cung }`: phương nào ứng du niên nào với cung đó, cát trước hung sau |
| `phienQuai(tenCung)` | 8 bước phiên quái `{ cung, sao }` |
| `tinhCungPhi(namAm, 'nam' \| 'nu')` | `{ so, ten, hanh, nhom ('Đông tứ mệnh'…), canChi, nguyen, cung (CungBatTrach), guiCung }` |
| `namTheoCung(ten)` | `{ nam: [{nam, canChi, guiCung}], nu: [...] }` trong khoảng 1930–2030 |
| `xetHuong(do)` | `{ doHuong, sonHuong, cungHuong, doToa, sonToa, cungToa, trach ('Đông' \| 'Tây') }` |
| `HAI_TU_SON` | 24 sơn từ Tý theo chiều kim đồng hồ, mỗi sơn 15° |
| `NGUYEN` | 3 nguyên với năm đầu, năm cuối (1864–1923, 1924–1983, 1984–2043) |
| `TRICH.*` | các câu trích `{ han, phienAm, quyen, trang }`: `cuuCungKienTrach`, `caiChinh`, `khangHy23`, `daiDuNien`, `dongTayTuTrach`, `phienQuai`, `thuTuSao`, `sonHuong`, `batCung` |
| `viTriTrich(t)` | "Hiệp kỷ biện phương thư, quyển 2, tờ 44a" |
| `NGUON_HIEP_KY` | `ten, nam, ban, url, giayPhep, ghiCong, ngatCau` |
| `GHI_CHU_GUI_CUNG` | câu bắt buộc khi cung phi rơi vào số 5 |
| `duongDanCungPhi(cung)` | `/phong-thuy/cung-phi/{slug}` |

Điều bắt buộc khi hiện:
- **Mỗi câu trích**: chữ Hán trong phần tử `lang="zh-Hant"`, phiên âm ngay dưới `lang="vi"`, dòng nhỏ `viTriTrich(t)`. Không thêm bản dịch.
- Cuối mỗi trang: `NGUON_HIEP_KY.ghiCong` (liên kết `url`) và `NGUON_HIEP_KY.ngatCau`.
- Kết quả có `guiCung === true`: hiện `GHI_CHU_GUI_CUNG` ngay dưới tên cung.
- Gọi du niên cát/hung theo `cat` ("cát" / "hung"), không dùng chữ "tốt cho tài lộc", "xấu, gây bệnh"… Màu cát/hung kèm chữ, không chỉ bằng màu.
- Năm tính theo **năm âm lịch**. Ở mọi ô nhập năm: "Sinh trước Tết thì dùng năm âm lịch trước đó" + liên kết `/lich-am/doi-ngay`.
- Câu tự viết chỉ mô tả cách tính hoặc điều đếm được. Không viết lịch sử phong thủy, "phong thủy là gì", "khoa học hay không".

## 1. Việc cần làm

### 1.1. Route

- `src/app/(v2)/phong-thuy/page.tsx`: hub (`PT`).
- `src/app/(v2)/phong-thuy/cung-phi/page.tsx`: công cụ tra cung phi (`PT-CUNGPHI`).
- `src/app/(v2)/phong-thuy/cung-phi/[cung]/page.tsx`: 8 trang cung (`PT-CUNGPHI-LEAF`); `cungTheoSlug` undefined → `notFound()`; `generateStaticParams` từ `BAT_CUNG`.
- `src/app/(v2)/phong-thuy/bat-trach/page.tsx`: bảng du niên (`PT-BATTRACH`).
- `src/app/(v2)/phong-thuy/huong-nha/page.tsx`: công cụ hướng nhà (`PT-HUONGNHA`).
- Mọi trang `export const revalidate = 3600`.
- Công cụ đọc tham số từ `searchParams` và render ở server như `src/app/(v2)/xem-tuoi/vo-chong/page.tsx` (form `method="get"`), làm theo đúng cách trang đó xử lý robots/canonical khi có tham số.
  - `/phong-thuy/cung-phi?nam=1990&gt=nam` (`gt` = `nam` | `nu`).
  - `/phong-thuy/huong-nha?do=135&nam=1990&gt=nu` (`nam`, `gt` không bắt buộc).
  - Năm ngoài 1900–2100 hoặc độ không phải số 0–359.9: hiện báo lỗi trong form, không 500.

### 1.2. Metadata

`metaTrang(duongDan, MAC_DINH, mau, thamSo)`, h1 bằng `thongTinTrang`.

| Trang | `mau` | `thamSo` |
|---|---|---|
| hub, cung-phi, bat-trach, huong-nha | — | — |
| trang cung | `/phong-thuy/cung-phi/{cung}` | `{ cung: slug, Tên: ten, 'tên': ten.toLowerCase(), 'Đông/Tây': nhom, Hành: hanh }` |

- JSON-LD (escape `<` như Lệnh 29): hub `CollectionPage` + `BreadcrumbList`; hai công cụ `WebApplication` + `BreadcrumbList`; bat-trach `DefinedTermSet` (8 du niên) + `BreadcrumbList`; trang cung `DefinedTerm` (`inDefinedTermSet` = URL bat-trach) + `WebPage` + `BreadcrumbList`.
- Breadcrumb `breadcrumb(duongDan, tenCuoi)`; trang cung `tenCuoi` = "Cung {ten}".

### 1.3. Hub `/phong-thuy`

1. Ba thẻ lớn: **Tra cung phi** → `/phong-thuy/cung-phi`; **Bát trạch** → `/phong-thuy/bat-trach`; **Hướng nhà** → `/phong-thuy/huong-nha`.
2. Form nhỏ tra cung phi (năm + giới tính) gửi sang `/phong-thuy/cung-phi`.
3. **8 cung**: lưới 8 thẻ (ký hiệu, tên, chữ Hán, phương, nhóm Đông/Tây), mỗi thẻ → trang cung. Chia hai nhóm "Đông tứ" (Khảm, Ly, Chấn, Tốn) và "Tây tứ" (Càn, Khôn, Cấn, Đoài).
4. Trích `TRICH.dongTayTuTrach` và `TRICH.daiDuNien`.
5. `KhoiDienGiai` với `noiDungTheoDuongDan('/phong-thuy')` nếu có nội dung đã duyệt; không có thì không hiện khung trống.
6. Khối "Nguồn": `NGUON_HIEP_KY` (tên, năm, bản), liên kết `/nguon`.

### 1.4. Tra cung phi `/phong-thuy/cung-phi`

1. Form: năm sinh âm lịch, giới tính (nam/nữ). Mặc định chưa có kết quả.
2. Có kết quả: thẻ lớn "Cung {ten} {kyHieu}", số `so`, hành, `nhom`, can chi năm, nguyên (`nguyen`). Liên kết trang cung. Nếu `guiCung`: câu `GHI_CHU_GUI_CUNG`.
3. Bảng **8 phương** từ `batPhuong(cung.ten)`: du niên (tên + chữ Hán + sao), cát/hung, phương, quái của phương. 4 cát trên, 4 hung dưới.
4. **Cách tính** (luôn hiện, kể cả khi chưa nhập):
   - Trích `TRICH.cuuCungKienTrach`, `TRICH.khangHy23` (mốc: năm 1684 là thượng nguyên), `TRICH.caiChinh`.
   - Bảng `NGUYEN` (3 dòng: nguyên, năm đầu–năm cuối, nam khởi, nữ khởi). Nam khởi / nữ khởi: thượng 1 Khảm / 5 trung; trung 4 Tốn / 2 Khôn; hạ 7 Đoài / 8 Cấn (lấy đúng chữ ở câu trích).
   - Một dòng: "Nam đếm lùi (nghịch hành), nữ đếm tới (thuận hành) mỗi năm một cung, chu kỳ 9 năm."
   - `GHI_CHU_GUI_CUNG`.
5. Liên kết: 8 trang cung, `/phong-thuy/bat-trach`, `/phong-thuy/huong-nha`, `/sinh-nam/{nam}` khi có trong `trangDaDung()` hoặc năm 1930–2030 (theo cách trang vo-chong đang làm với `namSinhHopLe`).

### 1.5. Trang cung `/phong-thuy/cung-phi/{cung}`

1. Đầu trang: ký hiệu lớn, "Cung {ten}", chữ Hán, số Lạc thư, hành, `nhom` ("Đông tứ"/"Tây tứ"), `loai` (lão dương…), phương và 3 sơn.
2. **8 phương theo cung {ten}**: bảng như mục 1.4.3.
3. **Năm sinh có cung {ten}** (1930–2030): hai cột Nam / Nữ, mỗi năm "1990 Canh Ngọ" liên kết `/sinh-nam/{nam}`. Năm có `guiCung` đánh dấu "*" và chú thích `GHI_CHU_GUI_CUNG` dưới bảng. Cung Khôn và Cấn có nhiều năm hơn vì nhận năm gửi: không cần giải thích thêm ngoài chú thích đó.
4. Thanh 8 cung (chuyển nhanh), liên kết `/phong-thuy/cung-phi`, `/phong-thuy/bat-trach`; liên kết trang quái Kinh Dịch cùng tên (`/kinh-dich/bat-quai/{slug}`, cùng slug).
5. Ghi công.

### 1.6. Bát trạch `/phong-thuy/bat-trach`

1. **8 du niên**: mỗi du niên một thẻ: tên, chữ Hán, sao (`sao` + `saoHan`), cát/hung, cách lập (`moTaBien`, kèm hình 3 hào: hào biến tô khác và có chữ "biến"), câu trích `trich` (Hán + phiên âm + vị trí).
2. **Bảng 8 × 8**: hàng = cung phi (người), cột = phương (quái của phương, ghi cả tên phương). Ô = tên du niên, nền cát/hung (kèm chữ). 375 px cuộn ngang **trong khung bảng**.
3. **Cách lập**: trích `TRICH.phienQuai`, `TRICH.thuTuSao`; vẽ chuỗi `phienQuai('Càn')` thành 8 bước (Càn → Đoài → Chấn → … → Càn, mỗi bước ghi sao).
4. **Đông tứ, Tây tứ**: trích `TRICH.dongTayTuTrach`; hai nhóm cung. Một dòng tính được: "Hai cung cùng nhóm thì du niên là một trong 4 cát; khác nhóm thì là một trong 4 hung."
5. Liên kết 8 trang cung, công cụ cung phi, hướng nhà. Ghi công.

### 1.7. Hướng nhà `/phong-thuy/huong-nha`

1. Form: độ la bàn của **hướng nhà** (0–359, số thập phân được), tùy chọn năm sinh + giới tính. Có 8 nút nhanh (Bắc 0, Đông Bắc 45, … Tây Bắc 315) điền sẵn độ.
2. Kết quả:
   - Hướng: độ, sơn (`sonHuong`), quái và phương (`cungHuong`).
   - Tọa (phía sau nhà, ngược hướng): độ, sơn, quái. Trích `TRICH.sonHuong` (Tý sơn tất Ngọ hướng).
   - Nhà thuộc **{trach} tứ trạch** (theo quái của tọa).
   - Có năm sinh: cung phi người đó (như 1.4.2, rút gọn) và hai dòng tính được: "Phương hướng nhà ({cungHuong.phuong}) với cung {ten}: {duNien}, {cát/hung}" và "Quái tọa {cungToa.ten} với cung {ten}: {duNien}, {cát/hung}".
   - Không kết luận "hợp/không hợp", không khuyên sửa nhà.
3. **Vòng 24 sơn** (SVG trong trang): 24 ô 15°, tên sơn, 8 vùng quái tô nhạt; có kết quả thì vẽ kim hướng và tọa. Bắc ở trên. Chữ đọc được ở 375 px.
4. **Cách tính** (luôn hiện): trích `TRICH.batCung`; một dòng "24 sơn chia đều 360°, mỗi sơn 15°, Tý ở chính Bắc (352,5°–7,5°)"; bảng 8 quái với 3 sơn và khoảng độ (`tuDo`–`denDo`).
5. Một dòng: "Trang chỉ tính theo độ la bàn bạn nhập; đo hướng thế nào (cửa chính, mặt tiền) do bạn xác định."
6. Ghi công.

### 1.8. Liên kết từ trang cũ

- `src/app/(v2)/sinh-nam/[yyyy]/page.tsx`: ở khối "Cung phi Bát trạch", tên cung nam, nữ thành liên kết tới `/phong-thuy/cung-phi/{slug}` (dùng `cungTheoTen(...).slug`), chỉ khi `daDung.has('/phong-thuy/cung-phi')`. Thêm liên kết "Bát trạch" → `/phong-thuy/bat-trach` cùng điều kiện.
- `src/app/(v2)/xem-tuoi/vo-chong/page.tsx`: dòng "Cung phi (Bát trạch)" thành liên kết trang cung, cùng điều kiện.
- Không đổi gì khác ở hai trang này.

### 1.9. CSS

- Tệp mới `src/app/(v2)/phong-thuy/phong-thuy.css` (trần 30 KB), lớp `ck-pt-*`, nạp bằng `layout.tsx` của cụm như `kinh-dich/layout.tsx`.
- Màu, font lấy biến của `ck.css`. Chữ Hán dùng font serif sẵn có.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua (có `phong-thuy.test.mjs`).
- Dev trả 200: `/phong-thuy`, `/phong-thuy/cung-phi`, `/phong-thuy/cung-phi?nam=1990&gt=nam`, `/phong-thuy/cung-phi?nam=1968&gt=nam`, `/phong-thuy/bat-trach`, `/phong-thuy/huong-nha`, `/phong-thuy/huong-nha?do=180&nam=1990&gt=nu`, 8 trang cung (`can-thien`, `doai-trach`, `ly-hoa`, `chan-loi`, `ton-phong`, `kham-thuy`, `can-son`, `khon-dia`).
- Dev trả 404: `/phong-thuy/cung-phi/abc`. `/phong-thuy/cung-phi?nam=abc` trả 200 có báo lỗi.
- Đối chiếu:
  - 1990 nam: Khảm (số 1), Đông tứ mệnh, hạ nguyên; 4 cát: Sinh khí Đông Nam, Thiên y Đông, Diên niên Nam, Phục vị Bắc.
  - 1990 nữ: Cấn (số 8), Tây tứ mệnh.
  - 1968 nam: số 5, gửi Khôn, có câu `GHI_CHU_GUI_CUNG`.
  - `?do=180`: hướng Ngọ (Ly, Nam), tọa Tý (Khảm), Đông tứ trạch; 1990 nữ (Cấn): phương Nam là Họa hại (hung), tọa Khảm là Ngũ quỷ (hung).
  - Bảng 8 × 8 hàng Càn: Càn Phục vị, Đoài Sinh khí, Ly Tuyệt mệnh, Chấn Ngũ quỷ, Tốn Họa hại, Khảm Lục sát, Cấn Thiên y, Khôn Diên niên.
- Title không còn `{...}`; 0 lỗi console; không tràn ngang ở 375 px; không liên kết 404.
- Chụp hub, cung-phi có kết quả, cung Khảm, bát trạch, hướng nhà có kết quả ở 1366 và 375; lưu `docs/v2/bang-chung/ck-phong-thuy-*.png`.
- Báo cáo theo mẫu Lệnh 25.
