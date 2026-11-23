# Lệnh 48: Cặp con giáp (79 trang) và Tứ Hóa

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 47.

**Báo cáo:** `docs/v2/lenh-antigravity/48-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px của các trang ở mục 48.4.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md` (11 điều, nhất là điều 11: chỉ tiếng Việt);
- trang mẫu: `src/app/(v2)/con-giap/[slug]/page.tsx` (khối quan hệ, `SachGhiDetails`, `VongConGiap`), `src/app/(v2)/xem-tuoi/vo-chong/page.tsx`, `src/app/(v2)/tu-vi/sao/[slug]/page.tsx`.

**Dùng lại:** `DocNhanh`, `ThuatNgu`, `TrichNguyenVan`, `VongConGiap`, `KIEU_NET_TRA_CUU` / `MauNetTraCuuSvg` (màu, kiểu nét của tam hợp, lục hợp, xung, hại, hình), `KhungTrang`, `metaTrang` / `thongTinTrang`, `breadcrumb`.

**Ràng buộc:**
- Như Lệnh 46, 47: không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, middleware, `src/app/api/**`, `layout.tsx` gốc, `quan-tri`, `components/r1`, `ck.css`, `ck-nen.css`, `DauTrang.tsx`. Không cài gói, không commit, không chạy `next build`, không bấm Overwrite.
- CSS: cụm con giáp viết tiếp vào `src/app/(v2)/xem-tuoi/xem-tuoi.css` (giữ ≤ 30 KB; nếu vượt, tách `cap-con-giap.css`); Tứ Hóa viết vào `src/app/(v2)/tu-vi/tu-vi.css` (≤ 30 KB).
- **Chỉ tiếng Việt:** không in trường `nguyenVan`. Chạy `node scripts/kiem-chu-han.mjs` trước khi báo xong.
- **Không viết thêm chữ nội dung:** không tả tính cách, không "hợp làm ăn / hợp yêu", không lời khuyên cưới hỏi, không chấm điểm, không phần trăm. Chỉ dùng chữ có sẵn trong lib và nhãn giao diện ngắn.
- Không đỏ báo động. Xung, hình, hại dùng hổ phách `#B7791F` hoặc xám; hợp dùng vàng nhũ đang có. Không dùng các từ: hóa giải, vật phẩm, sát khí, cải vận, đại kỵ.

## Dữ liệu (đã có, chỉ đọc)

### `src/lib/trang/cap-con-giap.ts` (test `tests/trang/cap-con-giap.test.mjs`)

| Tên | Trả gì |
|---|---|
| `tatCaCap()` | 78 `CapConGiap` (66 cặp khác chi + 12 cặp cùng chi), thứ tự Tý → Hợi |
| `capConGiap(a, b)` | `{ a: ConGiap, b: ConGiap, slug, duongDan, cungChi, quanHe[], nhomChinh, tomTat }`; `a`, `b` là số chi 0–11 |
| `quanHe[]` | `{ loai, ten, nhom, cau, trich: MaTrichBatTu[] }`; `trich` tra `TRICH_BAT_TU` / `NGUON_BAT_TU` ở `bat-tu-truc-quan.ts` |
| `nhomChinh` | `'hop' \| 'xung' \| 'hinh' \| 'hai' \| 'khong'`, dùng tô ô ma trận. Tam hội hai chữ (vd Dần Mão) không tính vào ô, nhưng vẫn có trong `quanHe` |
| `docSlugCap(slug)` | `{ a, b, chuan, slugChuan }` hoặc `null` |
| `maTranCap()` | `{ chi[12], o[12][12] { nhom, duongDan, ten[] } }` |
| `capKhacCua(chi)` | 11 cặp khác của một chi (liên kết chéo) |
| `GHI_CHU_CAP` | đoạn giới hạn: chi năm chỉ là một phần, mỗi cặp con giáp có 25 cặp năm sinh, sách dặn không vội luận xung hình là xấu |

Slug: Tý = `ty`, Tỵ = `ti` (theo `CON_GIAP` đang dùng). Ví dụ `/xem-tuoi/dan-va-ngo`, `/xem-tuoi/ty-va-ti`, `/xem-tuoi/thin-va-thin`.

### `src/lib/trang/tu-hoa.ts` (test `tests/trang/tu-hoa.test.mjs`)

| Tên | Trả gì |
|---|---|
| `BON_HOA` | 4 `{ ma: 'loc' \| 'quyen' \| 'khoa' \| 'ky', ten }` |
| `BANG_TU_HOA` | 10 dòng `{ canSo, can, slugCan, sao: { loc, quyen, khoa, ky: { key, ten, duongDan } }, khacPhai }`; bảng xemboi dùng khi an lá số. `duongDan` là `/tu-vi/sao/{slug}` với chính tinh, `null` với Văn Xương, Văn Khúc, Hữu Bật |
| `BANG_TU_HOA_TQ` | bảng iztro (chỉ khác Canh, Nhâm) |
| `canCuaNam(namAm)` | 1–10 |
| `tuHoaCuaCan(canSo)` | một dòng của `BANG_TU_HOA` |
| `TRICH_TU_HOA` | `{ nguon { tenHanViet, tacGia, ghiCong, url }, doanId, viTriViet, dich[10], giaiThich }` (Toàn thư quyển 2) |
| `SO_PHAI_TU_HOA` | 2 can × 3 cách ghi `{ ten, nguon, loc, quyen, khoa, ky }` |
| `GHI_CHU_TU_HOA` | `{ viTri, luuNien, phiHoa, doiPhai }` |

Menu và breadcrumb đã thêm ở `src/lib/trang/dieu-huong.ts` (đợt 7, em bật khi nghiệm thu; trang cặp tự có breadcrumb Trang chủ › Xem tuổi › Con giáp hợp nhau › …). Dòng SEO đã nạp CSDL dạng NHAP: `XT-CAP-IDX`, `XT-CAP` (mẫu `/xem-tuoi/{chi-a}-va-{chi-b}`, tham số `{A}`, `{B}`, `{conA}`, `{conB}`, `{quanHe}`), `TUVI-TUHOA`.

## 48.1. Ma trận 12 con giáp (`/xem-tuoi/con-giap`)

Soi thị trường (24/11): các trang lớn trả lời "tuổi A và tuổi B có hợp không" bằng một chữ "hợp" hoặc "không hợp", thường lẫn tam hợp với lục hợp, không có quy tắc hay sách. Điểm khác của mình: một cặp có thể vừa hợp vừa hình (Sửu Mùi vừa xung vừa hình, Dần Tỵ vừa hại vừa hình), mỗi quan hệ có trích sách.

- **Đọc nhanh:** `DocNhanh` một câu: "Bảng 12 × 12 con giáp theo năm sinh: mỗi ô là quan hệ địa chi giữa hai tuổi (tam hợp, lục hợp, lục xung, hình, hại). Bấm ô để xem cặp."
- **Ma trận 12 × 12** (`maTranCap`): hàng và cột là 12 chi (chữ + tên con vật nhỏ). Mỗi ô là `<a href={duongDan}>`, nền theo `nhom` (hợp vàng nhũ nhạt; xung, hình, hại hổ phách nhạt với kiểu nét/biểu tượng khác nhau để người mù màu vẫn phân biệt; không có gì: trắng). Trong ô một ký hiệu ngắn theo `ten[]`. Ô đường chéo (cùng chi) có viền chấm. Ở 375px: bảng cuộn ngang trong khung, cột đầu dính (sticky); kèm nút chọn "Tuổi của bạn" (12 nút) để lọc ra danh sách 11 cặp dạng thẻ dọc. Bỏ JS cũng phải đọc được (danh sách thẻ hiện sẵn, JS chỉ lọc).
- **Chú giải** bên dưới: 5 nhóm với `MauNetTraCuuSvg`.
- **Vòng 12 con giáp** (`VongConGiap`) với các nét tam hợp, lục hợp, xung có sẵn, đặt cạnh ma trận ở 1366px.
- **Khối ghi chú:** `GHI_CHU_CAP`; liên kết sang `/xem-tuoi/vo-chong` ("Xem theo năm sinh cụ thể") và `/con-giap`.

## 48.2. Trang cặp (`/xem-tuoi/[cap]`, 78 trang)

- `generateStaticParams` từ `tatCaCap()`. `docSlugCap` trả `null`: `notFound()`. `chuan === false` (vd `/xem-tuoi/ngo-va-dan`): `permanentRedirect('/xem-tuoi/' + slugChuan)`.
- Không đụng `vo-chong`, `xong-dat`, `con-giap` (trang tĩnh, Next ưu tiên trước trang động).
- **H1:** "Tuổi {A.chi} và tuổi {B.chi}" (cùng chi: "Hai người cùng tuổi {chi}").
- **Đọc nhanh:** `DocNhanh` với `tomTat`. Thẻ: tên con vật hai bên, ngũ hành chi (`hanhChi`), âm dương.
- **Hình:** `VongConGiap` tô hai chi của cặp và nét quan hệ giữa chúng. Nếu cần thêm prop (vd `chiCap?: string`) thì thêm vào `src/components/ck/truc-quan/VongConGiap.tsx`, giữ tương thích chỗ cũ.
- **Từng quan hệ** (`quanHe[]`): mỗi quan hệ một thẻ: tên (`ThuatNgu` nếu có mục), `cau`, rồi `SachGhiDetails`-kiểu `TrichNguyenVan` cho từng mã `trich`. Có tam hội: thẻ nhỏ hơn, ghi "cùng phương". Không có quan hệ nào: một dòng `tomTat`.
- **Khối giới hạn:** `GHI_CHU_CAP` + nút "Xem tuổi vợ chồng theo năm sinh" → `/xem-tuoi/vo-chong`.
- **Liên kết chéo:** 11 cặp khác của tuổi A (`capKhacCua(a)`) và của tuổi B, dạng lưới chip nhỏ tô màu như ma trận; liên kết `/con-giap/{slug}` của hai con giáp.
- **Meta:** `metaTrang('/xem-tuoi/{chi-a}-va-{chi-b}', { A, B, conA, conB, quanHe })` với `quanHe` = các `ten` nối bằng ", " viết thường (không có: "không thuộc nhóm hợp, xung, hình, hại nào").

## 48.3. Tứ Hóa (`/tu-vi/tu-hoa`)

Soi thị trường (24/11): khó tìm trang tiếng Việt có bảng Tứ Hóa đủ 10 can; các nơi có thì không nói Canh, Nhâm mỗi sách ghi một kiểu. Điểm khác của mình: bảng máy dùng thật, câu phú gốc dịch nghĩa, bảng so ba cách ghi.

- **Form GET** `?nam=YYYY` (1900–2100): tra can năm (`canCuaNam`) và tô dòng đó trong bảng; có tham số thì `noindex`. Câu: "Năm {nam} can {can}: {Lộc}, {Quyền}, {Khoa}, {Kỵ}." (ghép từ `tuHoaCuaCan`, mỗi sao một nhãn "hóa Lộc" …). Lưu ý ranh giới năm theo Tết: thêm một dòng nhãn "Tính theo năm âm lịch (sinh trước Tết thì lấy năm trước)."
- **Bảng 10 can × 4 hóa** (`BANG_TU_HOA`): cột Lộc, Quyền, Khoa, Kỵ; ô là tên sao, link khi có `duongDan`. Dòng `khacPhai` có dấu và liên kết xuống 48.3 "So phái". Ở 375px: mỗi can một thẻ 4 dòng.
- **Câu phú gốc:** `TrichNguyenVan` với `dich` là 10 vế `TRICH_TU_HOA.dich` (mỗi vế một dòng) + `giaiThich`; `viTriViet`, `nguon`.
- **So phái (Canh, Nhâm):** `SO_PHAI_TU_HOA`: mỗi can một bảng nhỏ 3 hàng (cách ghi) × 4 cột; ô khác với hàng "Sách Việt" in đậm.
- **Ghi chú:** 4 câu `GHI_CHU_TU_HOA` thành danh sách ngắn có tiêu đề "Vị trí sao Hóa", "Lưu Tứ Hóa", "Phi hóa", "Lá số xemboi".
- **Liên kết:** `/tu-vi/lap-la-so`, `/tu-vi/sao`, `/phuong-phap/nam-phai-bac-phai`.

## 48.4. Nghiệm thu

1. `/xem-tuoi/con-giap`: ma trận 144 ô; ô Dần × Ngọ là hợp; Tý × Ngọ là xung; Sửu × Mùi là xung (có thêm ký hiệu hình); Dần × Tỵ là hại (có thêm hình); Dần × Mão trắng. Bấm một ô sang đúng trang cặp.
2. `/xem-tuoi/dan-va-ti`: hai thẻ (hình, hại), mỗi thẻ có trích sách dịch nghĩa. `/xem-tuoi/ti-va-dan` chuyển 308/301 về `/xem-tuoi/dan-va-ti`. `/xem-tuoi/meo-va-cho` 404. `/xem-tuoi/thin-va-thin`: tự hình. `/xem-tuoi/ty-va-ty`: dòng không có quan hệ.
3. `/xem-tuoi/vo-chong`, `/xem-tuoi/xong-dat` vẫn chạy như cũ.
4. `/tu-vi/tu-hoa`: 10 dòng; Giáp: Liêm Trinh, Phá Quân, Vũ Khúc, Thái Dương; Canh và Nhâm có dấu khác phái; `?nam=1990` tô dòng Canh; bảng so phái Canh hàng iztro: Khoa Thái Âm, Kỵ Thiên Đồng.
5. `node scripts/kiem-chu-han.mjs`: 0 trang có chữ Hán (thêm các URL mới vào danh sách quét nếu script nhận danh sách; nếu không, ghi trong báo cáo đã kiểm tay).
6. `tsc --noEmit` 0 lỗi. Ảnh 375px và 1366px: `/xem-tuoi/con-giap`, `/xem-tuoi/dan-va-ti`, `/xem-tuoi/thin-va-thin`, `/tu-vi/tu-hoa?nam=1990`.
