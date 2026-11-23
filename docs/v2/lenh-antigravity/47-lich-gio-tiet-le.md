# Lệnh 47: Cụm Lịch P2: giờ hoàng đạo, 24 tiết khí, ngày lễ âm lịch

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 46.

**Báo cáo:** `docs/v2/lenh-antigravity/47-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px của mọi trang mục 47.6.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md` (11 điều, nhất là điều 11: chỉ tiếng Việt);
- trang mẫu cùng cụm: `src/app/(v2)/tet/page.tsx`, `src/app/(v2)/lich-am/page.tsx`, `src/app/(v2)/xem-ngay/page.tsx` (dải 12 giờ của Lệnh 41).

**Dùng lại:**
- `components/ck/truc-quan/`: `DocNhanh`, `ThuatNgu`, `TrichNguyenVan`;
- dải 12 giờ đã làm ở Lệnh 41 (component đang dùng cho `daiGio` ở trang xem ngày), không viết lại;
- `KhungTrang`, `lichHelpers` (`dinhDangNgayVN`, `duongDanNgayTuIso`), `metaTrang` / `thongTinTrang`.

**Ràng buộc:**
- Như Lệnh 40 và 46: không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, middleware, `src/app/api/**`, `layout.tsx` gốc, `quan-tri`, `components/r1`, `ck.css`, `ck-nen.css`, `DauTrang.tsx`.
- Không cài gói, không commit, không chạy `next build`, không bấm Overwrite.
- CSS: tạo cụm mới `src/app/(v2)/lich-am/lich-mua.css` (≤ 30 KB), import ở các trang của lệnh này. Không thêm vào `ck.css`.
- **Chỉ tiếng Việt** trên trang: không in trường `nguyenVan` (chữ Hán), chỉ in `dich`. Chạy `node scripts/kiem-chu-han.mjs` trước khi báo xong.
- **Không viết thêm chữ nội dung:** không phong tục, mâm cúng, văn khấn, "nên làm gì", không nguồn gốc lễ. Chỉ dùng chữ có sẵn trong lib và các nhãn giao diện ngắn. Chỗ người đọc chờ phong tục: một dòng "Phần phong tục đang biên tập, chưa đăng." (không link đi đâu).
- Không đỏ báo động; giờ hắc đạo dùng xám hoặc hổ phách `#B7791F`.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/lich-mua.ts` (test `tests/trang/lich-mua.test.mjs`)

| Tên | Trả gì |
|---|---|
| `gioHoangDaoNgay(d, m, y)` | `{ ngay: ChiTietNgay, gio[12] { chiSo, chi, khung, canChi, than, hoangDao }, hoangDao[6], tomTat }` |
| `gioHoangDaoHomNay()` | như trên cho hôm nay (giờ Việt Nam) |
| `bangGioHoangDao()` | 6 dòng `{ chiNgay: [chi, chi xung], gio[6] { chi, khung, than } }` |
| `TRICH_GIO_HOANG_DAO` | `{ nguon, doanId, viTriViet, dich }` (Hiệp kỷ quyển 5) cho `TrichNguyenVan` |
| `GHI_CHU_GIO_HOANG_DAO` | câu giới hạn của quy ước |
| `TIET_KHI_24` | 24 `{ slug, ten, kinhDo, loai: 'tiet' \| 'khi', thangTiet, nghiaTen, hau[3] { dich } }`, bắt đầu từ Lập xuân |
| `tenThangTiet(t)` | "tháng Giêng (tháng Dần)" |
| `tietKhiTrongNam(nam)` | 24 `{ slug, ten, ngay 'YYYY-MM-DD', gio 'HH:mm', thu, iso }` theo thời gian, giờ Việt Nam |
| `mocTiet(slug, nam)` | một mốc như trên |
| `tietHienTai(luc?)` | `{ dang, ke }` tiết đang hiệu lực và tiết kế tiếp |
| `tietKe(slug)` | `{ truoc, sau }` (vòng 24) |
| `NGUON_72_HAU` | `{ nguon, viTriViet, ketLuanDich, ghiChuDiaLy, ghiChuTietKhi }` |
| `TRICH_TIET_THANG` | `{ nguon, viTriViet, dich, giaiThich }` (Hiệp kỷ quyển 20) |
| `LE_AM_NAM` | 11 lễ `{ slug, ten, ngayAm, thangAm, tenKhac?, trangRieng? }`; Tết có `trangRieng: '/tet'` |
| `leTrongNamAm(namAm)` | các lễ của năm âm, `{ slug, ten, namAm, canChiNam, am, duong, thu }` theo ngày dương |
| `leQuaCacNam(slug)` | một lễ qua năm âm 2020–2035 |
| `leSapToi(slug)` | lần tới (tính cả hôm nay) + `conNgay` + `gioHoangDao` (chuỗi 6 chi) |
| `GHI_CHU_LE` | câu về múi giờ +7, tháng nhuận, giao thừa |
| `NAM_LICH_MUA_TU`, `NAM_LICH_MUA_DEN` | 2020, 2035 |

Menu và breadcrumb đã thêm ở `src/lib/trang/dieu-huong.ts` (đợt 6, em bật khi nghiệm thu). Dòng SEO đã nạp ở CSDL dạng NHAP: `LICH-GHD`, `LICH-TIETKHI-IDX`, `LICH-TIETKHI` (mẫu `/tiet-khi/{tiet}`), `LICH-NGAYLE-IDX`, `LICH-NGAYLE` (mẫu `/lich-am/ngay-le/{le}`), `LE-RAMGIENG`, `LE-VIATHANTAI`, `LE-RAM7`, `LE-TRUNGTHU`. Dùng `metaTrang` / `thongTinTrang` với tham số `{dd/mm}`, `{yyyy}`, `{Tên}`, `{giờ}`, `{độ}`, `{Lễ}`, `{thứ}`, `{dd/mm/yyyy}`.

## 47.1. Giờ hoàng đạo (`/lich-am/gio-hoang-dao`)

Soi thị trường (24/11): các trang lịch lớn cho **giờ hoàng đạo khác nhau** cho cùng ngày 23/11/2026 (Tân Sửu). Bảng của mình theo Hiệp kỷ: Dần, Mão, Tỵ, Thân, Tuất, Hợi. Điểm khác biệt cần thấy ngay: có quy tắc và sách.

- **Form GET** chọn ngày (`?ngay=YYYY-MM-DD`, mặc định hôm nay theo giờ Việt Nam). Có tham số thì `noindex` (như `/xem-ngay` đang làm). Ngày ngoài 1900–2100 hoặc sai: báo lỗi nhẹ, hiện hôm nay.
- **Đọc nhanh:** `DocNhanh` một câu: "Ngày {thứ} {dd/mm/yyyy} (âm {d/m}), ngày {can chi}: giờ hoàng đạo là {tomTat}." Thẻ: chi ngày; giờ hoàng đạo kế tiếp nếu là hôm nay.
- **Dải 12 giờ** (dùng lại Lệnh 41): ô hoàng đạo tô vàng nhũ, ô hắc đạo xám; mỗi ô ghi chi, khung giờ, tên thần (Thanh long, Minh đường…). Hôm nay có "Bây giờ".
- **Bảng tra 6 dòng** (`bangGioHoangDao`): cột trái "Ngày Tý, Ngọ" …; 6 ô giờ, mỗi ô chi + khung giờ + thần nhỏ. Ở 375px xếp thành thẻ.
- **Cách tính:** câu ngắn: "Mỗi ngày, Thanh long khởi ở một giờ tùy chi ngày, rồi đếm thuận 12 thần; 6 thần tốt là hoàng đạo." + `TrichNguyenVan` của `TRICH_GIO_HOANG_DAO` + `GHI_CHU_GIO_HOANG_DAO` trong khối ghi chú.
- **Liên kết:** lịch ngày đó (`duongDanNgayTuIso`), `/xem-ngay`, `/lich-am/ngay-mai`, `/lich-am`.

## 47.2. 24 tiết khí (`/tiet-khi`)

- **Chọn năm** (`?nam=`, 2020–2035, mặc định năm nay; có tham số thì noindex).
- **Đầu trang:** "Đang ở tiết {dang.ten} từ {giờ} {ngày}; tiết kế: {ke.ten} lúc {giờ} {ngày}" (dùng `tietHienTai`).
- **Vòng 24 tiết (SVG, server):** vòng tròn chia 24 đoạn theo kinh độ (0° Xuân phân ở bên phải hoặc Lập xuân ở đỉnh, chọn một cách và ghi chú). 12 "tiết" vạch đậm, 12 "trung khí" vạch mảnh; 4 mùa tô nền nhạt (xuân xanh mộc, hạ đỏ nhạt của hỏa, thu trắng kim, đông xanh thủy) dùng token `--ck-<hanh>-nhat`. Chấm "Hôm nay" theo `tietHienTai`. Mỗi tiết là link tới trang tiết. Chữ ≥ 12px ở 375px (cho phép rút còn tên ngắn hoặc chỉ ghi 12 tiết).
- **Bảng năm:** 24 dòng theo thời gian: tên (link), loại (tiết / trung khí), ngày, giờ, thứ, tháng theo tiết. Ở 375px xếp thẻ.
- **Khối giải thích:** `NGUON_72_HAU.ghiChuTietKhi`, `TRICH_TIET_THANG.giaiThich` + `TrichNguyenVan` của `TRICH_TIET_THANG`.

## 47.3. Trang từng tiết (`/tiet-khi/[tiet]`, 24 trang, `generateStaticParams`)

- **H1** "Tiết {ten}"; dưới là `nghiaTen`.
- **Đọc nhanh:** "Tiết {ten} năm {yyyy} bắt đầu lúc {giờ} {thứ} {dd/mm/yyyy}, Mặt Trời ở kinh độ {kinhDo}°. Là {tiết đầu / trung khí} của {tenThangTiet}." (năm = năm nay; nếu đã qua thì vẫn năm nay, thêm dòng "Năm sau: …").
- **Ba hậu:** 3 thẻ ngang (dọc ở 375px) "Hậu 1 · 5 ngày đầu", "Hậu 2", "Hậu 3", mỗi thẻ `hau[i].dich`. Nhãn "Sách ghi", dòng nguồn `NGUON_72_HAU.viTriViet` + "Dịch nghĩa: xemboi". Ngay dưới, khối hổ phách nhạt: `NGUON_72_HAU.ghiChuDiaLy`.
- **Bảng các năm 2020–2035:** năm, ngày, giờ, thứ; tô dòng năm nay.
- **Điều hướng:** tiết trước / sau (`tietKe`), về `/tiet-khi`; link `/bat-tu/lap-la-so` với câu "Bát tự đổi tháng ở tiết" chỉ ở 12 trang loại `tiet`.

## 47.4. Ngày lễ âm lịch (`/lich-am/ngay-le`)

- **Chọn năm âm** (`?nam=`, 2020–2035, mặc định năm âm hiện tại).
- **Danh sách** `leTrongNamAm`: thẻ hoặc bảng: tên (link trang lễ; Tết link `/tet`), ngày âm, ngày dương + thứ, "còn N ngày" nếu chưa tới. Lễ đã qua làm nhạt.
- `GHI_CHU_LE` trong khối ghi chú. Link `/tiet-khi/thanh-minh` với nhãn "Thanh minh là tiết khí, xem ngày ở trang tiết".

## 47.5. Trang từng lễ (`/lich-am/ngay-le/[le]`, 10 trang: mọi slug trong `LE_AM_NAM` trừ `tet-nguyen-dan`)

- `tet-nguyen-dan` không có trang ở đây (đã có `/tet`); slug lạ trả 404.
- **Đọc nhanh:** "{ten} năm {canChiNam} ({namAm}) rơi vào {thứ} {dd/mm/yyyy}, còn {conNgay} ngày. Giờ hoàng đạo ngày này: {gioHoangDao}." (`leSapToi`). Nếu `conNgay = 0`: "là hôm nay".
- **Bảng các năm 2020–2035** (`leQuaCacNam`): năm âm + can chi, ngày dương, thứ; tô năm sắp tới. Mỗi ngày link sang lịch ngày.
- **Một dòng** "Phần phong tục đang biên tập, chưa đăng."
- Liên kết: `/lich-am/ngay-le`, `/lich-am/gio-hoang-dao?ngay=…` (ngày lễ sắp tới), lễ trước/sau trong năm.

## 47.6. Nghiệm thu

1. `tsc --noEmit` 0 lỗi; `tsx --test tests/trang/lich-mua.test.mjs tests/trang/meta-dieu-huong.test.mjs` qua.
2. `node scripts/kiem-chu-han.mjs` báo 0 trang có chữ Hán (thêm các URL mới vào lượt quét nếu script cho phép truyền tham số; nếu không, ghi kết quả quét tay bằng trình duyệt).
3. Trình duyệt 375px và 1366px, 0 lỗi console, không cuộn ngang, vùng bấm ≥ 44px, có `prefers-reduced-motion`, mỗi trang ảnh `docs/v2/bang-chung/ck-47-*.png`:
   - `/lich-am/gio-hoang-dao` và `?ngay=2026-11-23`: giờ hoàng đạo hiện **Dần, Mão, Tỵ, Thân, Tuất, Hợi**; giờ Tuất là Thanh long.
   - `/tiet-khi`: 24 dòng năm nay, chấm "Hôm nay" nằm trong đoạn Tiểu tuyết (nếu chạy ngày 24/11/2026).
   - `/tiet-khi/lap-xuan`: năm 2026 ngày 04/02/2026; 3 hậu "Gió đông làm tan băng" …; có khối ghi chú địa lý.
   - `/tiet-khi/dong-chi`: không có link bát tự (trung khí).
   - `/lich-am/ngay-le`: năm 2026 có Trung thu 25/09/2026.
   - `/lich-am/ngay-le/trung-thu`: bảng 16 năm; 2027 là 15/09/2027.
   - `/lich-am/ngay-le/giao-thua`: năm âm 2025 là 16/02/2026.
   - `/lich-am/ngay-le/tet-nguyen-dan` và `/lich-am/ngay-le/abc`: 404.
4. Tắt JS ở 375px: các trang vẫn đọc đủ, form GET vẫn chạy.
5. Báo cáo ghi dung lượng `lich-mua.css`.
