# Lệnh 50: 10 trang hành tinh (Chiêm tinh)

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 49.

**Báo cáo:** `docs/v2/lenh-antigravity/50-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px của các trang ở mục 50.3.

**Đọc trước:** `docs/v2/22-chuan-truc-quan.md`; trang mẫu `src/app/(v2)/chiem-tinh/cung-hoang-dao/[cung]/page.tsx` (thẻ cung, cách trích Tetrabiblos), `src/app/(v2)/chiem-tinh/ban-do-sao/page.tsx` (bảng thiên thể, ký hiệu).

**Dùng lại:** helper trích Tetrabiblos đang dùng ở trang cung (in `vi`, vị trí `viTriTrich`, ghi công `NGUON_TETRABIBLOS`), `DocNhanh`, `KhungTrang`, `metaTrang` / `thongTinTrang`, `breadcrumb`.

**Ràng buộc:** như Lệnh 48, 49. CSS: `chiem-tinh.css` đã 25,6 KB, nên tạo tệp mới `src/app/(v2)/chiem-tinh/hanh-tinh.css` (≤ 30 KB). **Chỉ tiếng Việt:** không in `en`, không in tên Anh/La-tinh của hành tinh. **Không viết thêm nội dung:** không tả tính cách, không "hành tinh này chủ về tình yêu / tiền bạc", không lời khuyên. Ba hành tinh ngoài chỉ có phần tính được.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/hanh-tinh.ts` (test `tests/trang/hanh-tinh.test.mjs`)

| Tên | Trả gì |
|---|---|
| `HANH_TINH_CHI_TIET` | 10 `{ ten, slug, duongDan, kyHieu, coDien, phatHien?, coDienChiTiet }` |
| `coDienChiTiet` | 7 thiên thể cổ: `{ tinhChat: TrichAnh, cat, gioi, ngayDem, trich: TrichAnh[], nha: CungHoangDao[], vuong, ham }`; 3 hành tinh ngoài: `null` |
| `TEN_CAT`, `TEN_GIOI`, `TEN_NGAY_DEM` | nhãn tiếng Việt cho `cat`, `gioi`, `ngayDem` |
| `hanhTinhTheoSlug(slug)` | một mục |
| `cungHienTai(slug, luc?)` | `{ cung, doTrongCung }` lúc hiện tại (giờ máy chủ) |
| `TRICH_NHA_VUONG` | lấy câu chương XX (`cung.trichNha`) và XXII (`cung.trichVuong`) |
| `GHI_CHU_NGOAI` | câu về 3 hành tinh ngoài |

Slug: `mat-troi`, `mat-trang`, `sao-thuy`, `sao-kim`, `sao-hoa`, `sao-moc`, `sao-tho`, `sao-thien-vuong`, `sao-hai-vuong`, `sao-diem-vuong`.

SEO NHAP: `CT-HANHTINH` (mẫu `/chiem-tinh/hanh-tinh/{x}`, tham số `{Hành tinh}`, `{hành tinh}`, `{moTa}`). `moTa`: thiên thể cổ "tính chất, cát hay hung, cung chủ quản, cung vượng và hãm theo Tetrabiblos của Ptolemy"; hành tinh ngoài "tìm ra năm {phatHien}, không có trong Tetrabiblos".

## 50.1. Trang hành tinh (`/chiem-tinh/hanh-tinh/[x]`, 10 trang)

- `generateStaticParams` từ `HANH_TINH_CHI_TIET`; slug lạ `notFound()`. `revalidate = 3600` (vị trí hôm nay).
- **H1:** "{ten} trong chiêm tinh", ký hiệu cạnh tên.
- **Đọc nhanh:** thiên thể cổ: `tinhChat.vi`; thẻ: `TEN_CAT[cat]`, `TEN_GIOI[gioi]`, `TEN_NGAY_DEM[ngayDem]`. Hành tinh ngoài: `GHI_CHU_NGOAI`, thẻ "Tìm ra năm {phatHien}".
- **Hôm nay ở đâu:** vòng hoàng đạo 12 cung nhỏ (SVG, dùng lại kiểu vòng ở trang cung nếu có) đánh dấu cung hiện tại + câu "Hôm nay {ten} ở cung {cung.ten}, khoảng {doTrongCung}°." Nút "Lập bản đồ sao" → `/chiem-tinh/ban-do-sao`.
- **Cung trong sách** (chỉ thiên thể cổ): ba thẻ: Nhà (`nha[]`, link trang cung), Vượng (`vuong`), Hãm (`ham`); thẻ nào `null` thì ghi "Tetrabiblos không ghi". Dưới mỗi thẻ câu trích tương ứng (`TRICH_NHA_VUONG`).
- **Sách ghi:** các câu `trich[]` (chương V, VI, VII) theo thứ tự, mỗi câu có vị trí chương, trang.
- **Liên kết:** 9 thiên thể còn lại (chip có ký hiệu); trang `/chiem-tinh` thêm hàng 10 thiên thể dẫn tới các trang này (chỉ thêm liên kết).

## 50.2. Không làm

Không dựng `/chiem-tinh/nha/{n}`: Tetrabiblos không đặt tên hay nghĩa cho 12 nhà (xem `GHI_CHU_NHA` ở `ban-do-sao.ts`).

## 50.3. Nghiệm thu

1. `/chiem-tinh/hanh-tinh/sao-tho`: Hung tinh, Dương, Thuộc ngày; nhà Ma Kết, Bảo Bình; vượng Thiên Bình; hãm Bạch Dương; có câu "cái lạnh của Sao Thổ được xếp vào ban ngày…".
2. `/chiem-tinh/hanh-tinh/mat-troi`: hôm nay ở đúng cung (24/11/2026: Nhân Mã).
3. `/chiem-tinh/hanh-tinh/sao-diem-vuong`: chỉ có năm 1930, ghi chú, vị trí hôm nay; không có khối "Cung trong sách".
4. `/chiem-tinh/hanh-tinh/pluto` 404.
5. `node scripts/kiem-chu-han.mjs` 0 trang có chữ Hán; trang không có chữ Anh thừa (Sun, Mercury, benefic…). `tsc --noEmit` 0 lỗi. Ảnh 375px và 1366px: `sao-tho`, `sao-diem-vuong`.
