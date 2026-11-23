# Lệnh 46: Frontend chỉ tiếng Việt (gỡ chữ Hán, chữ Anh thừa)

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Yêu cầu của anh Cường (24/11/2026):** "toàn bộ nội dung trên trang frontend đều phải là tiếng Việt, rõ ràng mạch lạc. Không được dùng từ tiếng Trung".

**Thứ tự:** làm sau Lệnh 45 (đã commit 56cda22). Dữ liệu tiếng Việt đã có sẵn ở commit 92dd270.

**Báo cáo:** `docs/v2/lenh-antigravity/46-bao-cao.md`, theo mẫu Lệnh 25. Kèm đầu ra của `node scripts/kiem-chu-han.mjs` trước và sau, cùng ảnh 375px và 1366px của 6 trang ở mục 46.6. **Viết báo cáo dần trong lúc làm**, đừng để tới cuối.

**Ràng buộc:** như Lệnh 40.
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`.
- Không cài gói, không commit, không chạy `next build`.
- CSS mỗi cụm ≤ 30 KB.
- Không bấm Overwrite trong hộp "Failed to save".
- Nếu thiếu dữ liệu tiếng Việt cho một chỗ, ghi vào mục 4 của báo cáo. **Không tự dịch trong giao diện**, không tự viết lời luận.

## Quy tắc

1. **Không in bất kỳ chữ Hán nào**, kể cả đặt trong ngoặc, chú thích nhỏ, `title`, `aria-label`, `alt`, `<title>`, meta, JSON-LD hay tệp `.ics`. Các dạng hay gặp:
   - chữ đứng cạnh can chi ("甲 Giáp", "子");
   - tên quẻ, tên quái, tên sao viết bằng chữ Hán ("乾", "九紫", "巨門");
   - nguyên văn sách;
   - tên sách viết bằng chữ Hán ("《三命通会》");
   - dòng "Chữ Hán: …", cột "Chữ Hán".
2. **Từ Hán-Việt vẫn dùng bình thường**, ví dụ Thiên can, Tỷ kiên, Tuyệt mệnh, Lộ Bàng Thổ.
3. **Phiên âm Hán-Việt của câu sách** (như "Càn kiện dã") cũng bỏ, vì người đọc không hiểu. Chỉ in bản dịch nghĩa.
4. **Chữ Anh thừa đổi sang tiếng Việt** hoặc bỏ:
   - Sun, Moon, Mars… và Gemini, Leo… (tên Anh, Latin của hành tinh, cung) → bỏ, chỉ giữ tên Việt;
   - "ASC · Ascendant" → "Cung mọc"; "MC · Midheaven" → "Thiên đỉnh";
   - "natal chart" → "bản đồ sao cá nhân";
   - "tropical", "equinoctial"… → bỏ.
   - Ký hiệu hình (♈︎, ☰, ䷀) vẫn giữ.
5. **Mỗi đoạn trích sách** hiện theo thứ tự:
   - nhãn "Sách ghi";
   - bản dịch tiếng Việt;
   - dòng nguồn bằng tiếng Việt;
   - một trong hai dòng ghi công: "Dịch nghĩa: xemboi", hoặc "Bản dịch: Ngô Tất Tố" ở 9 quẻ dùng bản này.
6. **Ghi công giấy phép giữ nguyên chữ**, ví dụ "Văn bản: Kanripo, CC BY-SA 4.0" kèm liên kết.

## 46.1. Thành phần dùng chung

- **`TrichNguyenVan`**
  - Đổi props: nhận `{ dich, viTriViet, tenSach, ghiCong, url }`.
    - `tenSach` là tên tiếng Việt, ví dụ "Tam mệnh thông hội".
    - Bỏ `nguyenVan` và `tenGoc`; bỏ `lang="zh-Hant"`.
  - Dưới đoạn dịch có dòng nhỏ "Dịch nghĩa: xemboi".
  - Đổi tên lớp CSS `ck-tq-trich-han` cho hợp nghĩa (ví dụ `ck-tq-trich-dich`).
  - Sửa mọi nơi gọi: bát tự, con giáp, xem ngày (`BaHeGiaiThich`), xuất hành.
- **`canChiHelpers.ts`:** bỏ các bảng chữ Hán (`CAN_HAN`…) khỏi mọi chỗ hiển thị; nếu không còn ai dùng thì xóa.
- **`LaBan.tsx`:** bỏ chữ Hán của quái.
- **`VongNguHanh.tsx`, `SoDoNguHanh.tsx`, `HinhQue.tsx`:** bỏ chữ Hán ("木", tên quẻ…).
- **`DanhSachNguonClient.tsx`:** bỏ dòng `tenGoc` (`ck-ng-han`). Ô tìm vẫn có thể tìm theo `tenGoc`.
- **`TuDienThuatNguClient.tsx`:** bỏ cột hoặc dòng `han`.
- **`TheCanChi.tsx`:** chuỗi nguồn nạp âm đã sạch trong dữ liệu; kiểm lại.

## 46.2. Dữ liệu tiếng Việt cần dùng (chỉ đọc)

| Chỗ | Trường cũ (bỏ) | Trường hiển thị |
|---|---|---|
| Trích bát tự, con giáp (`TRICH_BAT_TU`) | `nguyenVan`, `viTri` | `dich`, `viTriViet` |
| Phong thủy (`TRICH`, `DU_NIEN_8[].trich`), cửu tinh (`TRICH_CUU_TINH`) | `han`, `phienAm`, `DuNien.han`, `saoHan`, `SaoCuuTinh.han`, `CungBatTrach`/quái `han` | `dich`; vị trí dùng `viTriTrich(t)` (đã là tiếng Việt) |
| Xuất hành (`BAI_CA_HUONG`) | tên bài Hán, nguyên văn | `tenBaiViet`, `viTriViet`, `dich` |
| Xem ngày (`TRICH_DOAN`) | `nguyenVan`, `viTri` | `dich`, `viTriViet` |
| Nghi kỵ, thần sát (`Muc`) | `han` (开市, 明堂…) | `ten` |
| Trực, 12 thần (`BaHeGiaiThich`) | cột "Chữ Hán" | bỏ cột |
| 64 quẻ (`queChiTiet`) | `han.queTu`, `han.hao[].van`, `phienAm.*`, `han.ten` | `dich.queTu`, `dich.hao[i]`, `dich.dung`; dòng nguồn `NGUON_DICH[dich.nguon].nhan` |
| Nhãn hào | | "Hào 1" … "Hào 6", hoặc `tenViTriHao(han.hao[i].viTri)` ("Sơ Cửu"); chỉ in chuỗi đã chuyển, không in `viTri` gốc |
| Chỗ khác bản (`KHAC_BAN`) | `banGoc`, `banKhac`, `ghiChu` | `ghiChuViet` |
| 8 quái (`BAT_QUAI_CHI_TIET`) | `han`, `tuongHan`, `thuyetQuai.*`, `PHIEN_AM_THUYET_QUAI` | `DICH_THUYET_QUAI[cau]` cho từng câu |
| Gieo quẻ | lời quẻ, lời hào Hán, nhãn "卦辭" | `queChiTiet(slug).dich` |
| Bảng 64 quẻ (`bang64`) | `han` | bỏ |
| Nguồn sách (`/nguon`, `/nguon/[slug]`) | dòng "Tên gốc" | bỏ dòng; `tenHienThi`, `tacGia`, `nienDai`, `banIn`, `ghiCong` đã sạch |
| Nạp âm (`/nap-am/[slug]`) | "Chữ Hán: 路旁土", "(路旁土)" | bỏ |
| Tên sách trong ghi công | `tenGoc` của `NGUON_*` | `tenHanViet` hoặc `ten` |
| Sao tử vi (`/tu-vi/sao/[slug]`) | tên Hán (`巨門`), chi Hán ("Tý (子)") | bỏ |
| Chiêm tinh (`TrichAnh`) | `en` | `vi`; ghi chú `NGUON_TETRABIBLOS.ghiChuTrich` |
| Cung hoàng đạo, hành tinh | `en`, `la`, `TEN_ANH_HANH_TINH`, `TEN_LOAI[].en` | bỏ |

Trang 64 quẻ trước đây có hai khối "Nguyên văn" và "Phiên âm":
- gộp thành một khối "Lời quẻ" và 6 dòng "Lời hào", in bản dịch;
- hào động (ở gieo quẻ) vẫn tô như cũ;
- bỏ mọi giải thích "chữ Hán đọc là…".

## 46.3. Tệp có chữ Hán đang in ra (quét 24/11)

Số trong ngoặc là số chữ Hán trên trang.

- **Cụm bát tự:** `bat-tu/lap-la-so/page.tsx` (349).
- **Cụm con giáp, nạp âm, ngũ hành:**
  - `con-giap/[slug]` (347), `con-giap/page.tsx`;
  - `nap-am/[slug]`;
  - `ngu-hanh`, `ngu-hanh/[hanh]`;
  - `sinh-nam/[yyyy]`.
- **Cụm phong thủy:**
  - `PhongThuyHelpers.ts`, `PhongThuyUi.tsx`;
  - `bat-trach`;
  - `cung-phi` (115), `cung-phi/[cung]` (262);
  - `cuu-tinh/CuuTinhUi.tsx`, `cuu-tinh/page.tsx` (294);
  - `huong-nha` (323);
  - `phong-thuy/page.tsx`.
- **Cụm xem ngày:**
  - `xem-ngay/page.tsx`, `BaHeGiaiThich.tsx`, `KhoiViecThang.tsx`;
  - `khai-truong` (297), cả tệp `.ics`;
  - `xuat-hanh/page.tsx` (196).
- **Cụm kinh dịch:**
  - `KinhDichHelpers.ts`, `KinhDichUi.tsx`;
  - `page.tsx`, `64-que`;
  - `bat-quai/[slug]`, `que/[slug]`;
  - `gieo-que/page.tsx`, `SoDoGieoQue.tsx`.
- **Cụm từ điển, tử vi, nguồn:**
  - `tu-dien/page.tsx` (564);
  - `tu-vi/sao/[slug]`;
  - `nguon/page` (1.149), `nguon/[slug]`.
- **Cụm chiêm tinh (chữ Anh):**
  - `chiem-tinh/*`, `ChiemTinhUi.tsx` (`TrichTetrabiblos`), `ChiemTinhHelpers.ts`;
  - `ban-do-sao`, `cung-hoang-dao`.

Đây là danh sách lúc quét. Tiêu chuẩn cuối cùng là mục 46.6.

## 46.4. Cập nhật tài liệu

Thêm vào `docs/v2/22-chuan-truc-quan.md`, mục 2, điều thứ 11:
- "Chỉ tiếng Việt: không chữ Hán, không chữ Anh thừa; trích sách in bản dịch kèm dòng nguồn";
- chạy `node scripts/kiem-chu-han.mjs` trước khi báo xong.

## 46.5. Không làm

- Không đổi bố cục, màu, hình vẽ ngoài phần chữ.
- Không xóa trường trong lib.
- Không đổi đường dẫn trang.
- Không đổi ghi công giấy phép.

## 46.6. Nghiệm thu

1. **Quét tự động:** `node scripts/kiem-chu-han.mjs` (dev ở `http://localhost:3047`) báo **0 trang có chữ Hán** và không có dòng LỖI.
2. **`/kinh-dich/que/01-thuan-can`:**
   - lời quẻ "Kiền: Đầu cả, hanh thông, lợi tốt, chính bền.";
   - 6 lời hào và lời dụng;
   - dòng "Bản dịch: Ngô Tất Tố".
3. **`/kinh-dich/que/55-loi-hoa-phong`:** có dòng "Dịch nghĩa: xemboi".
4. **`/con-giap/dan`:** mục tam hợp có "Sách ghi" bằng tiếng Việt, và vị trí "Quyển 2 · …" bằng tiếng Việt.
5. **`/phong-thuy/huong-nha?do=135&nam=1990&gt=nu`:** la bàn không còn chữ Hán; trích Hiệp kỷ in bản dịch.
6. **`/chiem-tinh/ban-do-sao?ngay=1962-02-03&gio=12:00&tinh=ha-noi`:**
   - không còn "Ascendant", "Midheaven", "natal chart";
   - đoạn Tetrabiblos in tiếng Việt.
7. **Khả dụng:**
   - 375px không cuộn ngang;
   - vùng bấm ≥ 44px;
   - tắt JS vẫn đọc được.
8. **Kỹ thuật:**
   - `tsc` sạch;
   - test `tests/trang/*.test.mjs` vẫn đạt (Claude Code sẽ chạy lại).
