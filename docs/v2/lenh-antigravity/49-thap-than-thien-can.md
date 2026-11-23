# Lệnh 49: 10 trang thập thần và 10 trang thiên can

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 48.

**Báo cáo:** `docs/v2/lenh-antigravity/49-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px của các trang ở mục 49.4.

**Đọc trước:** `docs/v2/22-chuan-truc-quan.md` (11 điều); trang mẫu `src/app/(v2)/bat-tu/lap-la-so/page.tsx` (cách hiện thập thần, `SachGhi`), `src/app/(v2)/con-giap/[slug]/page.tsx`, `src/app/(v2)/can-chi/[slug]/page.tsx`.

**Dùng lại:** `DocNhanh`, `ThuatNgu`, `TrichNguyenVan`, `VongNguHanh`, `ChuGiaiHanh`, `KhungTrang`, `metaTrang` / `thongTinTrang`, `breadcrumb`; màu ngũ hành đang có.

**Ràng buộc:** như Lệnh 48 (không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, middleware, `src/app/api/**`, `layout.tsx` gốc, `quan-tri`, `components/r1`, `ck.css`, `ck-nen.css`, `DauTrang.tsx`; không cài gói, không commit, không `next build`, không bấm Overwrite). CSS: thêm vào cụm bát tự / can chi đang có (mỗi tệp ≤ 30 KB; vượt thì tách tệp mới). **Chỉ tiếng Việt:** không in `nguyenVan`, `viTri`. **Không viết thêm nội dung:** không tả tính cách người có thần này, không "hợp nghề", không tốt xấu ngoài câu sách.

## Dữ liệu (đã có, chỉ đọc)

### `src/lib/trang/thap-than.ts` (test `tests/trang/thap-than-thien-can.test.mjs`)

| Tên | Trả gì |
|---|---|
| `THAP_THAN_CHI_TIET` | 10 `{ ten, slug, duongDan, thuTu, tenKhac[], nhom, quanHe, cungAmDuong, dinhNghia, trich[], bang[10] { nhatChu, hanhNhatChu, can, hanhCan } }` |
| `thapThanTheoSlug(slug)` | một mục hoặc `undefined` |
| `NHOM_THAP_THAN` | 5 nhóm `{ ten, quanHe: 'cùng hành' \| 'ta sinh' \| 'ta khắc' \| 'khắc ta' \| 'sinh ta', than: [cùng âm dương, khác âm dương] }` |
| `bangThapThan()` | `{ can[10], o[10][10] }` hàng nhật chủ, cột can gặp |
| `TRICH_THAP_THAN[ma]` | `TrichDoan` (`nguon: 'tamMenh'`, `doanId`, `viTriViet`, `dich`); nguồn tra `NGUON_BAT_TU.tamMenh` |
| `GHI_CHU_THAP_THAN` | câu giới hạn |

Slug: `ty-kien`, `kiep-tai`, `thuc-than`, `thuong-quan`, `thien-tai`, `chinh-tai`, `that-sat`, `chinh-quan`, `thien-an`, `chinh-an`.

### `src/lib/trang/thien-can.ts`

| Tên | Trả gì |
|---|---|
| `THIEN_CAN_CHI_TIET` | 10 `{ thuTu, ten, slug, duongDan, hanh, amDuong, hop { can, slug, hoa }, satCuaCan, sinh, tu, loc, thapThan[10] { can, than, duongDan }, hoaGiap[6], tuHoa }` |
| `thienCanTheoSlug(slug)` | một mục |
| `TRICH_SINH_TU_LOC` | câu sách cho sinh, tử, lộc |

Slug: `giap`, `at`, `binh`, `dinh`, `mau`, `ky`, `canh`, `tan`, `nham`, `quy`. `tuHoa` theo `src/lib/trang/tu-hoa.ts` (Lệnh 48).

SEO đã nạp NHAP: `BT-THAPTHAN` (mẫu `/bat-tu/thap-than/{than}`, tham số `{Thập thần}`, `{thập thần}`), `CC-THIENCAN` (mẫu `/can-chi/thien-can/{can}`, tham số `{Tên}`, `{tên}`, `{n}`, `{Hành}`, `{âm/dương}`).

## 49.1. Trang thập thần (`/bat-tu/thap-than/[than]`, 10 trang)

- `generateStaticParams` từ `THAP_THAN_CHI_TIET`; slug lạ: `notFound()`.
- **H1:** "{ten} trong bát tự". Dưới H1: tên khác (`tenKhac`) nếu có.
- **Đọc nhanh:** `DocNhanh` với `dinhNghia`. Thẻ: nhóm (`nhom`), quan hệ ngũ hành với nhật chủ (`quanHe`), "cùng âm dương" / "khác âm dương".
- **Hình:** vòng ngũ hành (`VongNguHanh`) đặt nhật chủ ở giữa, tô mũi tên quan hệ của thần này (vd Thực thần: mũi tên "ta sinh"). Kèm 5 nhóm `NHOM_THAP_THAN` dạng hàng chip, thần đang xem được đánh dấu.
- **Bảng 10 nhật chủ** (`bang`): cột Nhật chủ (chấm màu hành) → Can là {ten} (chấm màu hành). 375px: 2 cột × 5 dòng.
- **Sách ghi:** `TrichNguyenVan` cho từng mã trong `trich` (theo thứ tự), nguồn `NGUON_BAT_TU.tamMenh`.
- **Khối ghi chú:** `GHI_CHU_THAP_THAN`; nút "Lập lá số bát tự" → `/bat-tu/lap-la-so`.
- **Liên kết:** 9 thần còn lại (chip), bảng 10 × 10 thu gọn trong `<details>` "Bảng thập thần đủ 10 can" (`bangThapThan`), mỗi ô link tới trang thần.
- **Trang lập lá số:** ở `src/app/(v2)/bat-tu/lap-la-so/page.tsx`, tên thập thần dưới mỗi trụ thành liên kết tới trang thần (chỉ thêm `<a>`, không đổi bố cục).

## 49.2. Trang thiên can (`/can-chi/thien-can/[can]`, 10 trang)

- `generateStaticParams` từ `THIEN_CAN_CHI_TIET`; slug lạ: `notFound()`. Kiểm tra không đè `/can-chi/[slug]` (trang tĩnh `thien-can` được ưu tiên).
- **H1:** "Can {ten}". **Đọc nhanh:** "Can {ten} là can thứ {thuTu} trong 10 thiên can, hành {hanh}, {amDuong}." Thẻ: hành (màu), âm dương, hợp với {hop.can} hóa {hop.hoa}.
- **Hàng 10 can** ở đầu trang: 10 ô, ô đang xem nổi, mỗi ô link sang trang can đó.
- **Quan hệ:** hợp (`hop`, link trang can kia), Thất sát của can này (`satCuaCan`, link `/bat-tu/thap-than/that-sat`), sinh, tử, lộc (`sinh`, `tu`, `loc`) với `TrichNguyenVan` của `TRICH_SINH_TU_LOC`.
- **Khi làm nhật chủ** (`thapThan`): 10 ô can → tên thần (link trang thần).
- **6 năm hoa giáp** (`hoaGiap`): chip link sang trang hoa giáp đang có (dùng đường dẫn như trang `/can-chi/60-hoa-giap` đang dùng).
- **Tứ Hóa tử vi** (`tuHoa`): một hàng 4 ô Lộc, Quyền, Khoa, Kỵ (sao link khi có `duongDan`); nếu `tuHoa.khacPhai` thì dòng nhỏ "Can này các phái ghi khác nhau" link `/tu-vi/tu-hoa`.
- **Trang `/can-chi`:** thêm hàng 10 can link tới 10 trang mới (nếu trang đã có khối 10 can thì chỉ thêm liên kết).

## 49.3. Không làm

Không thêm trang chỉ mục `/bat-tu/thap-than` hay `/can-chi/thien-can` (breadcrumb tự bỏ qua đoạn này).

## 49.4. Nghiệm thu

1. `/bat-tu/thap-than/that-sat`: tên khác "Thiên quan"; bảng: Giáp → Canh, Ất → Tân; có đoạn dịch "Có chế thì gọi là Thiên quan, không có chế thì gọi là Thất sát."
2. `/bat-tu/thap-than/thien-an`: tên khác Kiêu thần, Đảo thực; có câu "Tuyệt đối không được hễ thấy Đảo thực là luận xấu."
3. `/bat-tu/thap-than/abc` 404. Trang lập lá số: bấm tên thần dưới trụ sang đúng trang.
4. `/can-chi/thien-can/giap`: Mộc, Dương, hợp Kỷ hóa Thổ, Thất sát Canh, sinh Hợi, tử Ngọ, lộc Dần Mão; Tứ Hóa Liêm Trinh, Phá Quân, Vũ Khúc, Thái Dương. `/can-chi/thien-can/canh` có dòng "các phái ghi khác nhau".
5. `/can-chi/giap-ty` (trang hoa giáp cũ) vẫn chạy.
6. `node scripts/kiem-chu-han.mjs` 0 trang có chữ Hán; `tsc --noEmit` 0 lỗi. Ảnh 375px và 1366px: `/bat-tu/thap-than/that-sat`, `/can-chi/thien-can/giap`.
