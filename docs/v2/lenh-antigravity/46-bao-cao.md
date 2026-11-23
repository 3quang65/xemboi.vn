# Báo cáo Lệnh 46: Frontend chỉ tiếng Việt (gỡ chữ Hán, chữ Anh thừa)

Ngày hoàn thành: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `docs/v2/lenh-antigravity/46-bao-cao.md` — Báo cáo này (được cập nhật dần trong quá trình thực hiện).
- `12` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-46-que-01-375.png` (`617.995` byte)
  - `ck-46-que-01-1366.png` (`924.678` byte)
  - `ck-46-que-55-375.png` (`647.719` byte)
  - `ck-46-que-55-1366.png` (`948.381` byte)
  - `ck-46-con-giap-dan-375.png` (`704.439` byte)
  - `ck-46-con-giap-dan-1366.png` (`1.008.218` byte)
  - `ck-46-huong-nha-375.png` (`1.041.621` byte)
  - `ck-46-huong-nha-1366.png` (`1.368.743` byte)
  - `ck-46-ban-do-sao-375.png` (`928.263` byte)
  - `ck-46-ban-do-sao-1366.png` (`1.235.983` byte)
  - `ck-46-bat-tu-375.png` (`996.340` byte)
  - `ck-46-bat-tu-1366.png` (`1.384.041` byte)

### Tệp chỉnh sửa (`55` tệp thuộc Lệnh 46)
- **Thành phần dùng chung (46.1):**
  - `src/components/ck/truc-quan/TrichNguyenVan.tsx` (`1.100` byte) — đổi props sang `{ dich, viTriViet, tenSach, ghiCong, url, tacGia?, nienDai?, doanId?, ghiCongDich?, nhan? }`, bỏ `nguyenVan`, `tenGoc`, `lang="zh-Hant"`, hiện bản dịch tiếng Việt kèm dòng `"Dịch nghĩa: xemboi"`.
  - `src/components/ck/truc-quan/DocNhanh.tsx` (`2.936` byte) — cập nhật `TrichSachDaGiai = TrichNguyenVanProps`, truyền `{...sachGhi}`.
  - `src/components/ck/truc-quan/index.ts` (`826` byte) — cập nhật export theo `TrichNguyenVan.tsx`.
  - `src/components/ck/truc-quan/truc-quan.css` (`19.770` byte ≤ `30.720` B) — đổi `.ck-tq-trich-han` thành `.ck-tq-trich-dich`, thêm `.ck-tq-trich-nhan`, `.ck-tq-trich-dich-gia`.
  - `src/components/ck/truc-quan/LaBan.tsx` (`21.189` byte) — bỏ chữ Hán của quái/du niên/sao, thay trích Hán + phiên âm bằng `dn.trich.dich` + `"Sách ghi"` + `"Dịch nghĩa: xemboi"`.
  - `src/components/ck/truc-quan/VongNguHanh.tsx` (`9.388` byte), `src/components/ck/SoDoNguHanh.tsx` (`6.119` byte) — bỏ chữ Hán trên 5 đỉnh ngũ hành.
  - `src/components/ck/truc-quan/TheNgayChon.tsx` (`1.435` byte) — lọc `boChuHan(cau)` cho lý do chọn ngày.
  - `src/components/ck/DanhSachNguonClient.tsx` (`4.727` byte) — bỏ dòng chữ Hán `.ck-ng-han`, giữ tìm theo `tenGoc`.
  - `src/components/ck/TuDienThuatNguClient.tsx` (`3.596` byte) — bỏ dòng chữ Hán `.ck-tdt-han`.
- **Cụm Bát tự, Con giáp, Nạp âm, Ngũ hành, Tử vi:**
  - `src/app/(v2)/bat-tu/lap-la-so/page.tsx` (`52.375` byte) & `src/app/(v2)/bat-tu/bat-tu.css` (`28.312` byte ≤ `30.720` B) — bỏ `CAN_HAN`/`CHI_HAN` ở dải đầu Đọc nhanh (đổi sang `.ck-bt-tam-viet-lon`), 4 trụ, lưu niên, bảng, đại vận; cập nhật `TrichNguyenVan`.
  - `src/app/(v2)/con-giap/page.tsx` (`2.769` byte), `src/app/(v2)/con-giap/[slug]/page.tsx` (`12.595` byte) — bỏ `CHI_HAN`, cập nhật `TrichNguyenVan` sang bản dịch.
  - `src/app/(v2)/nap-am/page.tsx` (`2.912` byte), `src/app/(v2)/nap-am/[slug]/page.tsx` (`8.428` byte) — bỏ `NAP_AM_HAN`, dòng `"Chữ Hán: …"`, lọc `boChuHan` cho metadata/H1.
  - `src/app/(v2)/ngu-hanh/page.tsx` (`4.136` byte), `src/app/(v2)/ngu-hanh/[hanh]/page.tsx` (`6.866` byte) — bỏ `HANH_HAN` và `NAP_AM_HAN`.
  - `src/app/(v2)/tu-vi/sao/[slug]/page.tsx` (`7.920` byte) — bỏ `CHI_HAN` và `sao.han`, lọc `boChuHan` cho metadata/H1.
  - `src/components/ck/canChiHelpers.ts` (`2.662` byte) — xóa `HANH_HAN`, `CHI_HAN`, `CAN_HAN`, `NAP_AM_HAN` sau khi không còn nơi nào dùng.
- **Cụm Phong thủy & Cửu tinh:**
  - `src/app/(v2)/phong-thuy/PhongThuyHelpers.ts` (`6.982` byte), `PhongThuyUi.tsx` (`6.345` byte), `phong-thuy.css` (`29.981` byte ≤ `30.720` B) — bỏ chữ Hán, phiên âm ở `KhoiTrichDan` và `BangBatPhuong`, hiện bản dịch `dich` + `"Sách ghi"` + `"Dịch nghĩa: xemboi"`, bỏ `alternateName` Hán trong JSON-LD; thêm `lamSachChuHanDauCau` lọc chữ Hán trong `chiTiet` đọc nhanh.
  - `src/app/(v2)/phong-thuy/page.tsx` (`7.129` byte), `bat-trach/page.tsx` (`8.145` byte), `cung-phi/page.tsx` (`9.605` byte), `cung-phi/[cung]/page.tsx` (`7.499` byte), `huong-nha/page.tsx` (`14.818` byte) — bỏ toàn bộ thẻ chữ Hán (`c.han`, `d.han`, `d.saoHan`, `九星`).
  - `src/app/(v2)/phong-thuy/cuu-tinh/CuuTinhHelpers.ts` (`4.252` byte), `CuuTinhUi.tsx` (`18.697` byte), `page.tsx` (`7.630` byte) — bỏ cột `Chữ Hán` và toàn bộ chữ Hán của 9 sao / 9 cung, lọc `lamSachChuHanDauCau` cho `DocNhanh` và `boChuHan(GHI_CHU_BON_SAO)`.
- **Cụm Xem ngày, Xuất hành, `.ics`:**
  - `src/app/(v2)/xem-ngay/page.tsx` (`16.294` byte) — bỏ toàn bộ `<span lang="zh-Hant">` (can chi ngày/tháng, 12 thần, 12 trực); lọc `boChuHan` cho `chiTiet` của `DocNhanh`.
  - `src/app/(v2)/xem-ngay/BaHeGiaiThich.tsx` (`6.055` byte) — bỏ cột `Chữ Hán` ở bảng 12 trực và 12 thần, đổi `viTri` sang `viTriViet`, cập nhật 3 chỗ gọi `TrichNguyenVan`.
  - `src/app/(v2)/xem-ngay/KhoiViecThang.tsx` (`8.846` byte) — bỏ `({han})` trong chip nghi kỵ lọc và lọc `boChuHan(viec.ghiChu)`.
  - `src/app/(v2)/xem-ngay/[ma]/lich.ics/route.ts` (`1.333` byte) — lọc `boChuHan` cho các dòng `lyDo` trước khi gọi `lichIcs(...)`.
  - `src/app/(v2)/xem-ngay/xuat-hanh/page.tsx` (`9.749` byte) — đổi sang `tenBaiViet`, `viTriViet`, `dich`, `tenHanViet`; cập nhật `TrichNguyenVan`.
- **Cụm Kinh Dịch:**
  - `src/app/(v2)/kinh-dich/KinhDichHelpers.ts` (`4.498` byte), `KinhDichUi.tsx` (`3.745` byte), `kinh-dich.css` (`24.552` byte ≤ `30.720` B) — đổi `DongVanHan` thành `DongLoiDich` (bỏ nguyên văn Hán và phiên âm Hán-Việt, in bản dịch tiếng Việt kèm `ghiChuViet` ở quẻ Mông/Chấn), cập nhật `GhiCongChuDich` dùng `NGUON_DICH` (bỏ `NGUON_PHIEN_AM`), bỏ `alternateName` Hán trong JSON-LD.
  - `src/app/(v2)/kinh-dich/page.tsx` (`4.655` byte), `64-que/page.tsx` (`5.965` byte), `bat-quai/[slug]/page.tsx` (`8.740` byte), `que/[slug]/page.tsx` (`9.963` byte), `gieo-que/page.tsx` (`10.508` byte) — dùng `dich` (64 quẻ), `DICH_THUYET_QUAI` (8 quái), dòng nguồn `"Bản dịch: Ngô Tất Tố"` (9 quẻ) / `"Dịch nghĩa: xemboi"` (55 quẻ), tra `kyHieu` quẻ hỗ/đảo/đối qua `thongTinNganTheoSo`, bỏ toàn bộ chữ Hán.
- **Cụm Từ điển, Nguồn, Chiêm tinh:**
  - `src/app/(v2)/tu-dien/page.tsx` (`2.847` byte) — bỏ `alternateName: t.han` trong JSON-LD `DefinedTermSet`.
  - `src/app/(v2)/nguon/[slug]/page.tsx` (`4.773` byte) — bỏ dòng `"Tên gốc"` và `alternateName: nguon.tenGoc` trong JSON-LD `Book`.
  - `src/app/(v2)/chiem-tinh/ChiemTinhHelpers.ts` (`8.700` byte), `ChiemTinhUi.tsx` (`12.887` byte), `chiem-tinh.css` (`25.605` byte ≤ `30.720` B) — bỏ `TEN_ANH_HANH_TINH`, `TEN_LOAI[].en`, `en`/`la` trong `alternateName`; đổi `TrichTetrabiblos` sang `trich.vi` + `"Sách ghi"` + `"Dịch nghĩa: xemboi"`; thêm `lamSachChuAnhMeta`/`lamSachMetaChiemTinh`/`lamSachThongTinChiemTinh` dọn chữ Anh thừa trong `SeoTrang`.
  - `src/app/(v2)/chiem-tinh/page.tsx` (`11.041` byte), `cung-hoang-dao/page.tsx` (`13.541` byte), `cung-hoang-dao/[cung]/page.tsx` (`13.476` byte) — bỏ cột/dòng tiếng Anh, Latin, `(masculine, diurnal)`, `(exaltation)`, `(fall)`.
  - `src/app/(v2)/chiem-tinh/ban-do-sao/page.tsx` (`25.553` byte), `ban-do-sao/VongBanDoSaoSvg.tsx` (`12.419` byte) — bỏ `"ASC · Ascendant"`, `"MC · Midheaven"`, tên tiếng Anh hành tinh; đổi nhãn SVG `"ASC"` / `"MC"` sang `"Mọc"` / `"Đỉnh"`.
- **Tài liệu:** `docs/v2/22-chuan-truc-quan.md` (`6.355` byte) — bổ sung điều thứ 11 (chỉ tiếng Việt, chạy `node scripts/kiem-chu-han.mjs` trước khi báo xong) và cập nhật mô tả `TrichNguyenVan`.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, `package.json`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`.
- Không sửa `6` tệp đã có thay đổi sẵn từ trước khi bắt đầu Lệnh 46 (`src/app/(v2)/lich-am/page.tsx`, `src/app/(v2)/tu-vi/tu-vi.css`, `src/app/(v2)/xem-ngay/xem-ngay.css`, `src/app/(v2)/xem-tuoi/vo-chong/page.tsx`, `src/app/(v2)/xem-tuoi/xong-dat/page.tsx`, `src/components/ck/FormLaSo.tsx`).
- Không cài gói npm, không commit, không chạy `next build`, không bấm Overwrite.
- Không tự dịch hay tự viết lời luận trong giao diện; dùng các trường tiếng Việt đã có ở commit `92dd270`.

## 2. Kết quả nghiệm thu

### 2.1. Kết quả `node scripts/kiem-chu-han.mjs` trước khi sửa (`http://localhost:3047`)
```
Đã quét 118 trang; 35 trang có chữ Hán
  733 /nguon | nh Tử Vi Đẩu Số toàn thư 新鐫希夷陳先生紫微斗數全書 Trần Đoàn (t || yên hải Tử Bình đại toàn 刻京台增補淵海子平大全 thư mục số hóa || iếu; Bát trạch minh kính 乾坤法竅・八宅明鏡 Phạm Nghi Tân; N
  564 /tu-dien | ng 35 thuật ngữ âm dương 陰陽 ất 乙 bính 丙 can chi 干支 || canh 庚 dần 寅 dậu 酉 địa chi 地支 đinh 丁 giáp 甲 || hỏa 火 hợi 亥 kim 金 kỷ 己 còn gọi: kỉ mão 卯 còn gọ
  349 /bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu&ln=2026 | Việt Nam UTC+7) Trụ Giờ 甲 Giáp 辰 Thìn Ngày · Bạn 丁 || Đinh 酉 Dậu Trụ Tháng 辛 Tân 巳 Tỵ Trụ Năm 庚 Canh || 午 Ngọ Nhật chủ Đinh Hỏa, s
  347 /con-giap/dan | hó ) ( Hỏa cục) Sách ghi 如申子辰申乃子之母辰乃子之子…若三字缺其一則化不成局 || 不可以三合化局論…巳酉丑寅午戍亥卯未皆然 Tam mệnh thông hội ( 三命通 || 會 ) , Vạn Dân Anh, Minh, 卷二 · 論支元三合 · đoạn 4341 . V
  328 /con-giap/ty | g ) ( Thủy cục) Sách ghi 如申子辰申乃子之母辰乃子之子…若三字缺其一則化不成局 || 不可以三合化局論…巳酉丑寅午戍亥卯未皆然 Tam mệnh thông hội ( 三命通 || 會 ) , Vạn Dân Anh, Minh, 卷二 · 論支元三合 · đoạn 4341 . V
  323 /phong-thuy/huong-nha?do=135&nam=1990&gt=nu | iên của hướng Tuyệt mệnh 絶命, sao Phá quân; Hiệp kỷ || àn Quái: ☰ Càn · Tây Bắc 子山則必午向。 Tý sơn tắc tất Ngọ || ắc ◇ Ngũ quỷ Quái Khảm ( 坎 ) · 3 sơn: Nhâm, Tý, Quý
  297 /xem-ngay/khai-truong?trong=60 | ng Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương). || Thần ngày: Minh đường (明堂), hoàng đạo. Trực Khai ( || 開): dùng được. Cũng ghi nê
  297 /xem-ngay/khai-truong?trong=30 | ng Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương). || Thần ngày: Chu tước (朱雀), hắc đạo. Trực Khai (開) || ần Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương).
  297 /xem-ngay/khai-truong?trong=90 | ng Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương). || Thần ngày: Minh đường (明堂), hoàng đạo. Trực Khai ( || 開): dùng được. Cũng ghi nê
  294 /phong-thuy/cuu-tinh/2027 | g cung năm 2027 9 Cửu tử 九紫, sao Hữu bật. Năm đổi ở || g Nam ( Tốn ) 8 Bát bạch 八白 · Thổ Nam ( Ly ) 4 Tứ l || ục 四緑 · Mộc Tây Nam ( Khôn ) 6
  294 /phong-thuy/cuu-tinh/2026 | ung năm 2026 1 Nhất bạch 一白, sao Tham lang. Năm đổi || ông Nam ( Tốn ) 9 Cửu tử 九紫 · Hỏa Nam ( Ly ) Ngũ ho || àng 5 Ngũ hoàng 五黄 · Thổ Tây Nam ( Khôn ) 7
  282 /xem-ngay/khai-truong/thang-11-2026 | Khai thị (khai trương) ( 开市 ) Mục liên quan hiện kè || m: Giao dịch ( 交易 ) Lập khoán (lập giấy tờ || ) ( 立券 ) Nạp tài (thu tiền) ( 纳
  262 /phong-thuy/cung-phi/kham-thuy | phương thư. ☵ Cung Khảm 坎 Số Lạc thư: 1 · Hành: Th || ắc ✦ Phục vị Quái Khảm ( 坎 ) · 3 sơn: Nhâm, Tý, Quý || g tứ. Du niên: Phục vị ( 伏位 ) · Sao: Phụ bật ( 輔弼 )
  262 /phong-thuy/cung-phi/doai-trach | phương thư. ☱ Cung Đoài 兌 Số Lạc thư: 7 · Hành: Ki || ắc ◇ Họa hại Quái Khảm ( 坎 ) · 3 sơn: Nhâm, Tý, Quý || g tứ. Du niên: Họa hại ( 禍害 ) · Sao: Lộc tồn ( 禄存 )
  241 /bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gioiTinh=nu&gio=8&phut=30 | Việt Nam UTC+7) Trụ Giờ 甲 Giáp 辰 Thìn Ngày · Bạn 丁 || Đinh 酉 Dậu Trụ Tháng 辛 Tân 巳 Tỵ Trụ Năm 庚 Canh || 午 Ngọ Nhật chủ Đinh Hỏa, s
  196 /xem-ngay/xuat-hanh | Theo sách nào Hỷ thần — 喜神方位歌 凡嫁娶、冠帶，新人向之大吉，出行、移徙、 || 修造，背向之大吉。甲己在艮乙庚乾，丙辛坤位喜神安，丁壬只在離宮坐，戊癸遊來在巽間。 Ngọc hạp || ký ( 玉匣記 ) , 民俗吉凶日篇 · 喜神方位歌 · đoạn 8069 . Văn bản:
  141 /bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gioiTinh=nu&khongRoGio=1 | ờ Chưa rõ giờ Ngày · Bạn 丁 Đinh 酉 Dậu Trụ Tháng 辛 T || ân 巳 Tỵ Trụ Năm 庚 Canh 午 Ngọ Chưa rõ giờ sinh nên || ể ra thập thần. Sách ghi 凡㸔命專以日干為主取提綱所用之物為命 Tam mện
  115 /phong-thuy/cung-phi | cung phi theo Tam nguyên 三元經曰：九宫建宅，男命上元甲子起坎一，中元甲子起巽 || 四，下元甲子起兑七，逆行九宫；女命上元甲子起中五，中元甲子起坤二，下元甲子起艮八，順行九宫。 Tam || (1684) là Thượng nguyên 康熙二十三年甲子，一白入中宫。 Khang Hy n
  108 /kinh-dich/que/55-loi-hoa-phong | quẻ đối. Ghi rõ bản gốc. ䷶ Quẻ số 55 Lôi Hỏa Phong || 豐 Quái trên ☳ Chấn 震 Lôi Quái dưới ☲ Ly 離 Hỏa || i quẻ, lời hào Lời quẻ ( 卦辭 ) 亨王假之勿憂宜日中 hanh vương
   76 /kinh-dich/que/01-thuan-can | quẻ đối. Ghi rõ bản gốc. ䷀ Quẻ số 1 Thuần Càn 乾 Quá || i trên ☰ Càn 乾 Thiên Quái dưới ☰ Càn 乾 || i quẻ, lời hào Lời quẻ ( 卦辭 ) 元亨利貞 nguyên hanh lợi
   50 /kinh-dich/bat-quai/can-thien | Số Tiên thiên 1 Quái Càn 乾 Tượng: Thiên · 乾為天 ( Càn || yên văn và phiên âm Tính 乾健也 Càn kiện dã Vật 乾為馬 Cà || n vi mã Thân thể 乾為首 Càn vi thủ Gia đình 乾天也故
   49 /kinh-dich/bat-quai/doai-trach | ố Tiên thiên 2 Quái Đoài 兌 Tượng: Trạch · 兌為澤 ( Đoà || yên văn và phiên âm Tính 兌說也 Đoài duyệt dã Vật 兌為羊 || Đoài vi dương Thân thể 兌為口 Đoài vi khẩu Gia đình 兌三
   35 /kinh-dich/gieo-que?xu=7,8,9,7,6,8 | n quẻ chủ: Lôi Hỏa Phong 豐 Lời quẻ chủ ( 卦辭 ) 亨王假之勿 || 憂宜日中 hanh vương cách chi vật || hào động Hào 3 · Cửu Tam 九三 豐其沛日中見沬折其右肱无咎 phong kỳ
   24 /ngu-hanh/moc | im Bị khắc Thủy Sinh cho 木 Mộc Tương sinh (vòng ngo || t đứt) Sinh ra Hỏa Mộc ( 木 ) sinh Hỏa Được sinh bởi || uộc hành Mộc Đại Lâm Mộc 大林木 Mậu Thìn · Kỷ Tỵ Dương
   15 /xem-ngay/khai-truong/lich.ics?soNgay=60 | ON:Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương). || T hần ngày: Minh đường (明堂)\, hoàng đạo. Trực Khai || (開): d ùng được. Cũng ghi n
   15 /xem-ngay/khai-truong/lich.ics?soNgay=30 | ON:Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương). || T hần ngày: Chu tước (朱雀)\, hắc đạo. Trực Khai (開 || ON:Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương).
   15 /xem-ngay/khai-truong/lich.ics?soNgay=90 | ON:Bảng nghi kỵ ghi nên: 开市 Khai thị (khai trương). || T hần ngày: Minh đường (明堂)\, hoàng đạo. Trực Khai || (開): d ùng được. Cũng ghi n
   14 /tu-vi/sao/cu-mon | trong tử vi Sao Cự Môn (巨門) thuộc nhóm chính tinh: || hi Ký hiệu Đặc tính Tý ( 子 ) V Vượng Sửu ( 丑 ) H Hã || m Dần ( 寅 ) V Vượng Mão ( 卯 ) M Mi
   14 /tu-vi/sao/liem-trinh | ng tử vi Sao Liêm Trinh (廉貞) thuộc nhóm chính tinh: || hi Ký hiệu Đặc tính Tý ( 子 ) V Vượng Sửu ( 丑 ) Đ Đắ || c Dần ( 寅 ) V Vượng Mão ( 卯 ) H Hã
   13 /nguon/tan-tien-hy-di-tran-tien-sinh-tu-vi-dau-so-toan-thu | hông tin thư mục Tên gốc 新鐫希夷陳先生紫微斗數全書 Tên Hán Việt
    7 /nap-am/lo-bang-tho | g Thổ là gì Lộ Bàng Thổ (路旁土) là nạp âm của Canh Ng || âm Lộ Bàng Thổ Chữ Hán: 路旁土 Ngũ hành Thổ Hỏa sinh || (hành Thổ ) Hỏa Sinh cho 土 Thổ Kim Sinh ra Thủy Khắ
    7 /nap-am/lu-trung-hoa | Hỏa là gì Lư Trung Hỏa (爐中火) là nạp âm của Bính Dầ || âm Lư Trung Hỏa Chữ Hán: 爐中火 Ngũ hành Hỏa Mộc sinh || Lư Trung Hỏa (hành Hỏa ) 火 Hỏa Thổ Sinh ra Kim Khắc
    3 /nguon/ngoc-hap-ky | hông tin thư mục Tên gốc 玉匣記 Tên Hán Việt Ngọc hạp
    1 /sinh-nam/1990 | Thổ ( Thổ ) Hỏa Sinh cho 土 Thổ Kim Sinh ra Thủy Khắ
    1 /sinh-nam/1992 | Hỏa Bị khắc Thổ Sinh cho 金 Kim Thủy Sinh ra Mộc Khắ
```

### 2.2. Kết quả `node scripts/kiem-chu-han.mjs` sau khi sửa
```
Đã quét 118 trang; 0 trang có chữ Hán
```
*(Thoát mã `0`, không có trang nào còn chữ Hán và không có dòng lỗi nào.)*

### 2.3. Kiểm tra kỹ thuật, dung lượng CSS và trình duyệt (mục 46.6)
- **Kiểu TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`):** đạt, mã thoát `0`, `0` lỗi.
- **Unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/*.test.mjs`):** `177/177` bài kiểm tra đạt, `0` lỗi, `0` bỏ qua (`6.765,65` ms, mã thoát `0`).
- **Dung lượng CSS từng cụm (yêu cầu `≤ 30.720` B / 30 KB):**
  - `src/components/ck/truc-quan/truc-quan.css`: `19.770` byte
  - `src/app/(v2)/bat-tu/bat-tu.css`: `28.312` byte
  - `src/app/(v2)/phong-thuy/phong-thuy.css`: `29.981` byte
  - `src/app/(v2)/kinh-dich/kinh-dich.css`: `24.552` byte
  - `src/app/(v2)/chiem-tinh/chiem-tinh.css`: `25.605` byte
  - Các CSS khác giữ nguyên trong ngưỡng (`nguon.css`: `4.321` B, `tu-dien-trang.css`: `3.802` B, `tu-dien.css`: `17.833` B, `xem-ngay.css`: `27.193` B, `tu-vi.css`: `10.925` B, `xem-tuoi.css`: `10.579` B).
- **Trình duyệt (Playwright Chromium) trên `6` trang ở `375px`, `1366px` và tắt JS (`javaScriptEnabled: false`):**
  - Cả `6` trang ở cả `375px` và `1366px` đều trả HTTP `200`, `0` `console.error`, `0` `pageerror`, `0` lỗi mạng HTTP `>= 400`, `0` chữ Hán, `scrollWidth <= innerWidth` (không cuộn ngang).
  - Kiểm tra vùng bấm tương tác trong `<main>` (nút, `<summary>`, `.ck-nut`, điều hướng trước/sau, liên kết cùng cụm): đều đạt `>= 44px` (`0` phần tử `< 44px`; các thành phần dùng chung ngoài phạm vi Lệnh 46 như nút mũi tên `.ck-menu-nut-con` ở header, input radio/checkbox `17×17` bọc trong `<label>` và link chữ nội tuyến không thay đổi).
  - Khi tắt JS ở `375px`: cả `6` trang đều HTTP `200`, không cuộn ngang, đọc đủ nội dung trong `<main>` (`1.457`–`4.614` ký tự), và bấm `<summary>` vẫn mở được `<details>` (`opened`).
  - Đối chiếu chi tiết từng mục 46.6.2–46.6.6 (và đã mở kiểm tra trực quan đủ `12` ảnh `docs/v2/bang-chung/ck-46-*.png`):
    1. `/kinh-dich/que/01-thuan-can`: có `"Kiền: Đầu cả, hanh thông, lợi tốt, chính bền."`, đủ 6 hào + Dụng Cửu, dòng `"Bản dịch: Ngô Tất Tố"`.
    2. `/kinh-dich/que/55-loi-hoa-phong`: có 6 lời hào tiếng Việt và dòng `"Dịch nghĩa: xemboi"`.
    3. `/con-giap/dan`: mục Tam hợp có `"Sách ghi"` và khi mở hiện `"Quyển 2 · Luận chi nguyên tam hợp · đoạn 4341"`, kèm `"Dịch nghĩa: xemboi"`.
    4. `/phong-thuy/huong-nha?do=135&nam=1990&gt=nu`: `0` chữ Hán trên SVG la bàn và toàn trang; các khối trích Hiệp kỷ biện phương thư đều in bản dịch tiếng Việt kèm `"Dịch nghĩa: xemboi"`.
    5. `/chiem-tinh/ban-do-sao?ngay=1962-02-03&gio=12:00&tinh=ha-noi`: không còn `"Ascendant"`, `"Midheaven"`, `"natal chart"` ở `<title>`, `<meta name="description">`, nhãn thẻ hay SVG; dùng `"Cung mọc"`, `"Thiên đỉnh"`, `"Mọc"`/`"Đỉnh"` trên vòng tròn; các khối Tetrabiblos in bản dịch tiếng Việt kèm `"Sách ghi"` và `"Dịch nghĩa: xemboi"`.
    6. `/bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu&ln=2026`: `0` chữ Hán trên SVG lá số và toàn trang, hiện đầy đủ 4 trụ tiếng Việt (`Giáp Thìn`, `Đinh Dậu`, `Tân Tỵ`, `Canh Ngọ`) và cột `Lưu niên` (`Bính Ngọ`).

## 3. Các điểm lệch khỏi lệnh và lý do
- **Dải đầu Đọc nhanh Bát tự (`bat-tu/lap-la-so`):** trước đây đặt chữ Hán kích thước lớn ở ô giữa mỗi trụ; khi bỏ chữ Hán theo Quy tắc 1 đã chuyển sang dùng `.ck-bt-tam-viet-lon` hiển thị tên Can/Chi tiếng Việt đậm để giữ cân đối thẻ mà không đổi bố cục.
- **Nhãn SVG Bản đồ sao (`ban-do-sao/VongBanDoSaoSvg.tsx`):** đổi nhãn `"ASC"` / `"MC"` trên vòng tròn sang `"Mọc"` / `"Đỉnh"` để loại chữ Anh thừa mà vẫn vừa khoảng nhãn gọn quanh đường tròn.
- **Lọc tại tầng giao diện đối với chuỗi dựng sẵn trong lib/CSDL:** do ràng buộc không sửa `src/lib/**` và CSDL trong Lệnh 46, các chuỗi ghép sẵn còn chữ Hán hoặc chữ Anh thừa từ `src/lib/**` và bảng `SeoTrang` được lọc tạm bằng `boChuHan`, `lamSachChuHanDauCau`, `lamSachChuAnhMeta` ở tầng giao diện để trang hiển thị sạch 100% tiếng Việt ngay.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

1. **Một số chuỗi ghép sẵn trong `src/lib/**` còn kèm chữ Hán** *(không sửa `src/lib/**` theo ràng buộc; tầng giao diện tạm lọc qua `boChuHan`)*:
   - `src/lib/trang/xem-ngay-truc-quan.ts`:
     - `lyDoNgay` (dòng 101–103) còn ghép `${m.han}`, `(${x.than.han})`, `(${x.truc.han})` — ảnh hưởng cả khối ngày chọn và tệp `.ics`.
     - `docNhanhNgay` (dòng 202, 206) còn ghép `${x.than.han}, …` và `${x.truc.han}, …`.
   - `src/lib/trang/phan-truc-quan.ts`:
     - `docNhanhHuongNha` (dòng 115) còn ghép `${dnHuong.han}, sao ${dnHuong.sao}…`.
     - `docNhanhCuuTinh` (dòng 145) còn ghép `${trung.han}, sao ${trung.tenBacDau}…`.
   - `src/lib/trang/xem-ngay.ts`:
     - `VIEC['mua-xe'].ghiChu` (dòng 222) còn `(交易)`.
   - `src/lib/trang/cuu-tinh.ts`:
     - `GHI_CHU_BON_SAO` (dòng 175–176) còn `(開山立向修方吉)`.
2. **Một số mẫu trong bảng `SeoTrang` (CSDL) còn `{Hán}`, chữ Anh hoặc nhắc `"nguyên văn"` / `"phiên âm"`**:
   - Mẫu `/tu-vi/sao/{sao}` và `/nap-am/{ten}` còn chèn `({Hán})` trong `metaDescription`;
   - Mẫu `/chiem-tinh/ban-do-sao` còn `"natal chart"`, `/chiem-tinh/cung-hoang-dao` còn `"tên tiếng Anh"`, `/chiem-tinh/cung-hoang-dao/{cung}` còn `({English})`;
   - Các mẫu `/kinh-dich/que/{nn}-{ten}`, `/kinh-dich/bat-quai/{slug}`, `/kinh-dich/64-que`, `/kinh-dich/gieo-que`, `/xem-ngay/xuat-hanh` còn cụm mô tả `"nguyên văn"`, `"phiên âm Hán Việt"` hoặc `"chữ Hán"`.
   - *(Lớp giao diện đã lọc chữ Hán và chữ Anh thừa ở `metaTrang`/`thongTinTrang` cho `nap-am`, `tu-vi/sao`, `chiem-tinh`; đề nghị cập nhật đồng bộ trong bảng `SeoTrang` khi thuận tiện.)*
