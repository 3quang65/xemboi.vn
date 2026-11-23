# Lệnh 33: Cụm `/kinh-dich` (hub, bảng 64 quẻ, 64 trang quẻ, 8 trang quái)

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/33-bao-cao.md`.

Ràng buộc như Lệnh 25, 31, 32:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung, **không tự dịch, không tự giảng** nguyên văn chữ Hán (kể cả "ý nghĩa quẻ", "quẻ tốt/xấu", "lời khuyên");
- chỉ đặt liên kết tới `daDungKinhDich()` (mục Dữ liệu);
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css` (đã chạm trần 60 KB);
- `src/components/ck/HinhQue.tsx` được sửa nhẹ nếu cần (mục 1.6), các component `ck` khác không sửa.

## Vì sao

Menu "Kinh Dịch" đã trỏ tới `/kinh-dich` (hub) và `/kinh-dich/64-que`, nhưng hai trang này cùng 64 trang quẻ và 8 trang quái đang 404. Dòng SEO: `KD`, `KD-64`, `KD-QUE`, `KD-QUAI` trong `docs/v2/16-seo-trang.csv`.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/chu-dich.ts`

Chỉ có **nguyên văn có nguồn** và **phần tính được**. Chưa có bản dịch tiếng Việt và lời bình.

| Tên | Trả về |
|---|---|
| `bang64()` | 64 dòng `{ que, kyHieu, han }`. `que` là `Que` của `kinh-dich.ts`: `so, tenNgan, ten` (tên đầy đủ "Thủy Lôi Truân"), `slug` ("03-thuy-loi-truan"), `thuong`, `ha` (quái trên, dưới), `hao` |
| `queChiTiet(slug)` | `null` nếu sai slug. Có: `que`, `kyHieu` (䷀…䷿), `han { ten, queTu, hao[{viTri, van}], dung }`, `phienAm` (cùng dạng, **có thể `null`**), `ho`, `dao`, `doi`, `truoc`, `sau`, `khacBan[]` |
| `tenViTriHao('初九')` | "Sơ Cửu" (dùng làm nhãn hào) |
| `KHAC_BAN` | 2 chỗ bản gốc khác các bản khác: `{ so, viTri, banGoc, banKhac, ghiChu }` |
| `NGUON_CHU_DICH` | ghi công nguyên văn (Kanripo KR1a0001, CC BY-SA 4.0) + `doiChieu` |
| `NGUON_PHIEN_AM` | ghi công phiên âm (Apache-2.0) |
| `BAT_QUAI_CHI_TIET` | 8 quái: `ten, slug, han, kyHieu (☰…☷), hao, tuong (tên tượng tiếng Việt), hanh, tuongHan, thuyetQuai { tinh, vat, thanThe, giaDinh, phuong \| null }, phuongSachGhi \| null` |
| `PHIEN_AM_THUYET_QUAI[chuoiHan]` | phiên âm từng câu Thuyết quái |
| `quaiTheoSlug(slug)`, `queCoQuai(ten)` | quái theo slug; `{ tren[], duoi[] }` các quẻ có quái đó |
| `duongDanQue(que)`, `duongDanQuai(quai)` | đường dẫn trang |
| `daDungKinhDich()` | `trangDaDung()` + 64 trang quẻ + 8 trang quái. **Dùng thay `trangDaDung()` ở mọi trang của cụm** |

Điều bắt buộc khi hiện:
- Nguyên văn Hán đặt trong phần tử có `lang="zh-Hant"`. Phiên âm ngay dưới, `lang="vi"`. `phienAm === null` thì chỉ hiện Hán, không báo lỗi.
- Câu ghi công `NGUON_CHU_DICH.ghiCong` (có liên kết `url`) và `NGUON_PHIEN_AM.ghiCong` ở cuối mỗi trang quẻ và trang bảng.
- Chỗ `khacBan`: đặt ghi chú ngay dưới câu đó: "Bản gốc ghi {banGoc}; {ghiChu}".
- Ngũ hành của quái (`hanh`) **không có trong Thuyết quái**. Hiện thì ghi kèm: "Ngũ hành của quái là cách quy thông dụng đời sau, Thuyết quái không ghi."

## 1. Việc cần làm

### 1.1. Route

- `src/app/(v2)/kinh-dich/page.tsx`: hub (`KD`).
- `src/app/(v2)/kinh-dich/64-que/page.tsx`: bảng (`KD-64`).
- `src/app/(v2)/kinh-dich/que/[slug]/page.tsx`: trang quẻ (`KD-QUE`). `queChiTiet(slug)` null → `notFound()`.
- `src/app/(v2)/kinh-dich/bat-quai/[slug]/page.tsx`: trang quái (`KD-QUAI`). `quaiTheoSlug(slug)` undefined → `notFound()`.
- Trang quẻ, quái: `generateStaticParams` từ `bang64()` / `BAT_QUAI_CHI_TIET` (72 trang tĩnh). Mọi trang `export const revalidate = 3600`.
- Mẫu tham khảo: `src/app/(v2)/can-chi/[slug]/page.tsx` (trang từ điển có mẫu SEO, `KhoiDienGiai`).

### 1.2. Metadata

Gọi `metaTrang(duongDan, MAC_DINH, mau, thamSo)`; h1 lấy bằng `thongTinTrang` cùng tham số.

| Trang | `mau` | `thamSo` |
|---|---|---|
| hub `/kinh-dich` | — | — |
| `/kinh-dich/64-que` | — | — |
| quẻ | `/kinh-dich/que/{nn}-{ten}` | `{ nn: '03', ten: 'thuy-loi-truan', 'Tên đầy đủ': 'Thủy Lôi Truân', 'tên đầy đủ': 'thủy lôi truân', Tên: 'Truân', 'tên': 'truân', 'số': '3', n: '3' }` |
| quái | `/kinh-dich/bat-quai/{quai}` | `{ quai: slug, Tên: ten, Quái: ten, 'quái': ten.toLowerCase() }` |

(`nn`, `ten` lấy từ `slug` tách ở dấu gạch đầu tiên.)

- `MAC_DINH` ngắn, chỉ nói điều trang có. Không viết "ý nghĩa", "luận giải", "tốt xấu", "giải mã".
- JSON-LD (escape `<` như Lệnh 29):
  - hub: `WebPage` + `BreadcrumbList`;
  - 64 quẻ: `DefinedTermSet` (64 `DefinedTerm`: `name` = tên đầy đủ, `alternateName` = chữ Hán, `url`) + `BreadcrumbList`;
  - quẻ, quái: `DefinedTerm` (`inDefinedTermSet` = URL trang 64 quẻ) + `WebPage` + `BreadcrumbList`.
- Breadcrumb: `breadcrumb(duongDan, tenCuoi)`. Đã cài sẵn: trang quẻ, quái có cha là `/kinh-dich/64-que`. `tenCuoi` = "Quẻ {tên đầy đủ}" / "Quái {tên}".

### 1.3. Hub `/kinh-dich`

Dùng `KhungTrang`. Lần lượt:

1. Hai thẻ lớn: **64 quẻ** → `/kinh-dich/64-que`; **Gieo quẻ** → `/kinh-dich/gieo-que`.
2. **Bát quái**: lưới 8 thẻ (ký hiệu ☰, tên, chữ Hán, tượng `tuong` + `tuongHan`), mỗi thẻ → trang quái.
3. **Quẻ ngẫu nhiên hôm nay** thì **không làm** (dễ bị hiểu là "quẻ của bạn").
4. `KhoiDienGiai` với `noiDungTheoDuongDan('/kinh-dich')` nếu có nội dung đã duyệt; không có thì không hiện khung trống.
5. Khối "Nguồn văn bản": `NGUON_CHU_DICH` (tên, ghi công, `doiChieu`), `NGUON_PHIEN_AM`; liên kết `/nguon`.

Câu dẫn tự viết chỉ được nói điều đếm được: "64 quẻ, mỗi quẻ 6 hào, ghép từ 2 trong 8 quái; nguyên văn lời quẻ, lời hào theo bản Chu Dịch Kanripo". Không viết lịch sử, tác giả, "Kinh Dịch là gì".

### 1.4. Bảng `/kinh-dich/64-que`

1. **Danh sách theo thứ tự Văn Vương** (`bang64()`): số, ký hiệu ䷀ (chữ to), chữ Hán, tên đầy đủ, quái trên / dưới (liên kết trang quái). Mỗi dòng → trang quẻ. 375 px: thẻ xếp lưới 2 cột, không tràn ngang.
2. **Bảng tra 8 × 8**: hàng = quái trên, cột = quái dưới (tiêu đề hàng/cột là ký hiệu + tên quái). Mỗi ô: số + tên ngắn + ký hiệu quẻ, liên kết trang quẻ. 375 px cho cuộn ngang **trong khung bảng** (khung có `overflow-x:auto`), trang không tràn.
3. Ghi công (mục Dữ liệu).

### 1.5. Trang quẻ `/kinh-dich/que/{slug}`

1. **Đầu trang**: ký hiệu ䷂ lớn, "Quẻ số {so}", tên đầy đủ, chữ Hán `han.ten`. Hình 6 hào (`HinhQue` hoặc vẽ trong trang). Quái trên, quái dưới: thẻ nhỏ liên kết trang quái.
2. **Nguyên văn** (`<section>` tiêu đề "Nguyên văn lời quẻ, lời hào"):
   - Lời quẻ: Hán + phiên âm.
   - 6 hào từ 初 lên 上, nhãn `tenViTriHao(viTri)` kèm `viTri` Hán ("Sơ Cửu 初九"). Hán + phiên âm.
   - `dung` (chỉ Càn, Khôn có): như một hào thứ 7, nhãn "Dụng Cửu 用九" / "Dụng Lục 用六".
   - Ghi chú `khacBan` đặt ngay dưới câu liên quan.
   - Ngay dưới khối: "Bản dịch và lời bình tiếng Việt đang biên tập." Nếu `noiDungTheoDuongDan(duongDan)` có nội dung đã duyệt thì hiện `KhoiDienGiai` thay câu đó.
3. **Quẻ liên quan** (phần tính được; mỗi mục một dòng giải thích cách tính, rồi thẻ quẻ liên kết):
   - Quẻ hỗ: "lấy hào 2-3-4 làm quái dưới, hào 3-4-5 làm quái trên".
   - Quẻ đảo (綜): "lật ngược 6 hào". Nếu `dao.so === que.so`: "Quẻ đối xứng: lật ngược vẫn là chính nó."
   - Quẻ đối (錯): "đổi âm thành dương, dương thành âm cả 6 hào".
4. **Trước / sau**: quẻ `truoc`, `sau` (null thì không hiện ô đó).
5. Liên kết: `/kinh-dich/64-que`, `/kinh-dich/gieo-que`, `/kinh-dich`.
6. Ghi công (mục Dữ liệu).

### 1.6. Trang quái `/kinh-dich/bat-quai/{slug}`

1. Đầu trang: ký hiệu ☰ lớn, "Quái {ten}", chữ Hán `han`, hình 3 hào (từ `hao`, vẽ từ dưới lên), tượng: `tuongHan` + phiên âm + `tuong`.
2. **Theo Thuyết quái** (bảng 2 cột: mục | nguyên văn + phiên âm):
   - Tính (`tinh`), Vật (`vat`), Thân thể (`thanThe`), Gia đình (`giaDinh`), Phương (`phuong`).
   - Phương: có `phuongSachGhi` thì ghi thêm "→ {phuongSachGhi}". Khôn (`phuong === null`): "Thuyết quái không ghi phương của Khôn." Đoài (`phuongSachGhi === null`, có `phuong`): "Thuyết quái ghi Đoài theo mùa (chính thu), không ghi phương."
   - Dưới bảng: "Trích thiên Thuyết quái 說卦, bản Chu Dịch Kanripo KR1a0001" + ghi công.
3. Ngũ hành `hanh`: một dòng nhỏ, kèm câu bắt buộc ở mục Dữ liệu.
4. **Các quẻ có quái {ten}**: hai nhóm "ở trên" (`queCoQuai(ten).tren`) và "ở dưới" (`.duoi`), mỗi nhóm 8 thẻ nhỏ (ký hiệu + số + tên) liên kết trang quẻ.
5. Thanh 8 quái (chuyển nhanh sang quái khác), liên kết `/kinh-dich/64-que`.

### 1.7. Gieo quẻ `/kinh-dich/gieo-que`

- Đổi `trangDaDung()` thành `daDungKinhDich()` để `HinhQue` có liên kết tới trang quẻ.
- Bỏ khối "Lời quẻ đang biên tập". Thay bằng (chỉ khi có kết quả):
  - **Lời quẻ chủ**: `queChiTiet(queChu.slug)`, lời quẻ Hán + phiên âm.
  - **Lời hào động**: với mỗi số trong `haoDong` (1..6, từ dưới lên), hiện hào thứ đó của quẻ chủ (`han.hao[i-1]`), Hán + phiên âm, nhãn `tenViTriHao`.
  - Liên kết "Đọc đủ quẻ {ten}" → trang quẻ chủ; có quẻ biến thì thêm liên kết trang quẻ biến.
  - Không thêm quy tắc "đọc hào nào khi nhiều hào động" (không có nguồn trong dữ liệu).
- Khi chưa gieo: một dòng liên kết "Xem bảng 64 quẻ".
- Không đổi phần gieo, metadata, robots hiện có.

### 1.8. CSS

- Thêm vào `src/app/(v2)/kinh-dich/kinh-dich.css` (hiện 4,3 KB, trần 30 KB), lớp `ck-kd-*`.
- Chữ Hán dùng font serif sẵn có; cỡ ký hiệu quẻ lớn ở đầu trang.
- Màu, font lấy biến của `ck.css`. Hào âm/dương phân biệt bằng hình, không chỉ bằng màu.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua (có `chu-dich.test.mjs`, `chu-dich-64.test.mjs`).
- Dev trả 200: `/kinh-dich`, `/kinh-dich/64-que`, `/kinh-dich/que/01-thuan-can`, `/kinh-dich/que/03-thuy-loi-truan`, `/kinh-dich/que/64-hoa-thuy-vi-te`, 8 trang quái (`can-thien`, `doai-trach`, `ly-hoa`, `chan-loi`, `ton-phong`, `kham-thuy`, `can-son`, `khon-dia`).
- Dev trả 404: `/kinh-dich/que/abc`, `/kinh-dich/bat-quai/abc`.
- Đối chiếu:
  - Quẻ 1: lời quẻ 元亨利貞, có Dụng Cửu; hỗ = Càn; đảo = Càn (đối xứng); đối = Khôn.
  - Quẻ 3 Truân: đảo = Mông (4).
  - Quẻ 4 Mông: có ghi chú khác bản (來); quẻ 51 Chấn: ghi chú ở Lục Ngũ (意/億).
  - Quái Khôn: câu "không ghi phương"; Đoài: câu "theo mùa".
- `/kinh-dich/gieo-que?xu=9,7,8,8,7,6`: có lời quẻ chủ, lời hào 1 và 6, liên kết quẻ chủ, quẻ biến.
- Title không còn `{...}`; 0 lỗi console; không tràn ngang ở 375 px; không liên kết 404.
- Chụp hub, bảng 64, quẻ 1, quái Khôn, gieo quẻ có kết quả ở 1366 và 375; lưu `docs/v2/bang-chung/ck-kinh-dich-*.png`.
- Báo cáo theo mẫu Lệnh 25.
