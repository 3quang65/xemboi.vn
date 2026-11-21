# 11 — Dựng giao diện hướng E3 ("Sơn mài đêm trăng") vào `/tu-vi-2027`

> Ngày thực hiện: **21/11/2026**
> Bản mẫu đối chiếu: [`docs/v2/thiet-ke/huong-e3.html`](thiet-ke/huong-e3.html), ghi chép [`docs/v2/thiet-ke/05-vong-4.md`](thiet-ke/05-vong-4.md).

---

## 1. Tệp đã sửa và thêm mới

### Tệp đã sửa
- [`src/app/tu-vi-2027/page.tsx`](../../src/app/tu-vi-2027/page.tsx): nạp `Alegreya` (weights `500`, `700`, `800`, style `normal` & `italic`) và `Be_Vietnam_Pro` (weights `400`, `500`, `600`, `700`) qua `next/font/google` với `subsets: ['vietnamese', 'latin']`, `display: 'swap'`, truyền `fontClassName` xuống `TrangR1Client`.
- [`src/app/tu-vi-2027/r1.css`](../../src/app/tu-vi-2027/r1.css): giữ nguyên phần `.r1-root` cho `/quan-tri/r1`, bổ sung toàn bộ token màu và stylesheet bản E3 cô lập dưới lớp gốc `.r1e` và tiền tố `.r1e-*`.
- [`src/components/r1/TrangR1Client.tsx`](../../src/components/r1/TrangR1Client.tsx): thay toàn bộ phần nhìn trang `/tu-vi-2027` sang E3 (dải trên, header triện + tìm kiếm minh họa, thanh menu ngang có nhãn `Sắp có` không gắn link cho 8 mảng chưa mở, đầu trang tranh đêm trăng + form lập lá số, dải giới thiệu 3 cam kết, kết quả có giờ & chưa rõ giờ, nhận định cuộn giấy lề son + sao dẫn chứng + nút soi căn cứ, bản luận giải mẫu biên tập, khối 2 giá, chân trang); giữ nguyên API `/api/r1/la-so`, funnel `/api/r1/su-kien`, quy tắc `hienNut149k`, `R1_COPY`, `BAN_MAU_BIEN_TAP`.
- [`src/components/r1/LaSo12Cung.tsx`](../../src/components/r1/LaSo12Cung.tsx): viết lại hiển thị lá số 4×4 (`VI_TRI_LUOI_4X4`) và danh sách 12 cung theo E3 dùng dữ liệu thật `LaSo` và `LuuNien`, Thiên bàn đặt thẳng trên nền ngà, SVG tam hợp/xung chiếu đo qua `ResizeObserver` với `stroke-dasharray` ≥ chu vi thật, quầng chữ ngà, triện son, bát quái chìm, nhãn Tuần/Triệt đo trên vạch chia cung, luôn ẩn họ tên, có lớp phủ phóng to và cuộn cho màn hình nhỏ.
- [`src/components/r1/HopThoaiMua.tsx`](../../src/components/r1/HopThoaiMua.tsx): chuyển giao diện hộp thoại mua sang khung ngà viền sơn mài E3, giữ nguyên thông báo trung thực, kiểm tra hợp lệ, gửi `/api/r1/lien-he` và thông báo lỗi chuẩn.

### Tệp mới thêm
- [`src/components/r1/TranhDauTrang.tsx`](../../src/components/r1/TranhDauTrang.tsx): SVG sprite và component `TranhDauTrangNen` (desktop 1920×820) + `TranhDauTrangDai` (dải mobile) dựng nguyên bức tranh sơn mài đêm trăng không có lư hương/khói, ID `r1e-*` riêng, giữ hạt giống cố định (`seed = 7`) và tôn trọng `prefers-reduced-motion`.
- [`src/components/r1/HoaVanE3.tsx`](../../src/components/r1/HoaVanE3.tsx): các SVG hoa văn tái sử dụng (`TrienXemBoi`, `HoaVanGoc4`, `HoaVanGocVang4`, `HoaVanMay`, `AnTieuDe`, `ChiaVach`, `BatQuaiSvg`).
- Ảnh bằng chứng trong [`docs/v2/bang-chung/`](bang-chung/): `r1e3-1366-dau.png`, `r1e3-1366-laso.png`, `r1e3-375-dau.png`, `r1e3-375-laso.png`, `r1e3-375-phong-to.png`, `r1e3-hopthoai.png`.

> Không sửa `src/lib/tuvi-v2`, `src/lib/core`, `src/lib/r1`, các API route, Prisma schema, logic store/tracking hay `/quan-tri/r1`. Không thực hiện commit git.

---

## 2. Kết quả kiểm

Chạy sau lần chỉnh sửa cuối cùng:

- **`npm.cmd run test:tuvi`**: `128/128` test pass (`0` fail, `0` skipped).
- **`npm.cmd run test:r1`**: `15/15` test pass (`0` fail, `0` skipped — gồm kiểm tra `hienNut149k`, chế độ chưa rõ giờ, đúng nguyên văn câu chữ, quyền riêng tư và quét từ cấm).
- **Quét `kiemTraTuCam` bổ sung cho 2 tệp mới** (`HoaVanE3.tsx`, `TranhDauTrang.tsx`): `0` vi phạm.
- **`npx.cmd tsc --noEmit`**: thoát mã `0`, không có lỗi TypeScript.
- **`npm.cmd run build`**: thành công (`49` trang tĩnh/động; route `/tu-vi-2027` có Size `26.4 kB`, First Load JS `129 kB`).
- **Kiểm trình duyệt thật (`http://localhost:3000/tu-vi-2027` qua Chrome/Playwright, đã tắt `next dev` sau khi kiểm):**
  - Console: `0` lỗi (`console.error` = `0`, `pageerror` = `0`).
  - Font: `Alegreya` (500/700/800) và `Be Vietnam Pro` (400/500/600/700) đều đã tải (`loaded`).
  - Menu ngang: chỉ `Tử vi` gắn link; 8 mục còn lại đều hiển thị chữ kèm nhãn `Sắp có`, không có thẻ `<a>`.
  - Lá số mẫu **Nữ, 15/8/1998, 09:30, dương lịch, năm xem 2027**: đối chiếu 12/12 cung trên `/tu-vi-2027` với `#ls-chinh` của `huong-e3.html` cho **0 khác biệt** (khớp toàn bộ can.chi, ±hành cung, tên cung, chính tinh + độ sáng, 2 cột phụ tinh, sao lưu ô `L`, `Th.n`, `ĐV.`, `LN.`, nhãn Tuần/Triệt).
  - Thiên bàn: `stroke-dasharray` đo thật là `1757` ≥ chu vi tam giác `1752.57px`; dòng họ tên hiển thị `Đã ẩn`; nút `Soi căn cứ trên lá số` tô sáng đúng 2 cung (`Nô Bộc`, `Phúc Đức`).
  - Chế độ **Chưa rõ giờ sinh**: vô hiệu hóa ô chọn giờ/phút, hiển thị khối tổng quan Can Chi – Nạp Âm 2027 phong cách E3, ẩn gói/nút `149.000đ` (`0` phần tử `[data-testid="btn-mua-149"]`) và hiện `[data-testid="ghi-chu-an-149"]`.
  - **Hộp thoại mua (`HopThoaiMua`)**: mở đúng nội dung nguyên văn, gửi liên hệ qua `/api/r1/lien-he` thành công (`Đã ghi nhận đăng ký của bạn...`).
  - **Mobile 375px**: `documentElement.scrollWidth === 375` cả trước và sau khi lập lá số (không cuộn ngang), không có ô chọn bị cắt chữ, đủ 12 cung ở danh sách đọc, lớp phủ phóng to mở cuộn/zoom và đóng gọn không cắt chữ.

### Ảnh bằng chứng
- [Đầu trang desktop 1366](bang-chung/r1e3-1366-dau.png)
- [Lá số 4×4 & Thiên bàn desktop 1366](bang-chung/r1e3-1366-laso.png)
- [Đầu trang mobile 375](bang-chung/r1e3-375-dau.png)
- [Lá số thu nhỏ mobile 375](bang-chung/r1e3-375-laso.png)
- [Lớp phủ phóng to mobile 375](bang-chung/r1e3-375-phong-to.png)
- [Hộp thoại mua E3](bang-chung/r1e3-hopthoai.png)

---

## 3. Chỗ lệch bản mẫu `huong-e3.html` và vì sao

1. **Khối 2 giá là `79.000đ` và `149.000đ` (thay cho `0đ` và `149.000đ`):** giữ nguyên chữ niêm yết trong `src/lib/r1/copy.ts`, giữ đúng 2 sự kiện funnel (`bam_mua_79` / `bam_mua_149`) và quy tắc R4 ẩn gói `149.000đ` khi chưa rõ giờ sinh. Gói `79.000đ` dùng thẻ giản dị (`.r1e-thuong`), gói `149.000đ` dùng thẻ son viền vàng lá (`.r1e-chinh`).
2. **Form bỏ ô nhập "Họ tên" và chỉ có năm xem `2027`:** tuân thủ `R1_COPY.form.phuDe` ("không hỏi tên thật hay số điện thoại") và yêu cầu luôn ẩn họ tên trên lá số; bổ sung ô tích đồng ý xử lý ngày giờ sinh (`Luật 91/2025/QH15`); `/api/r1/la-so` đang cố định lưu niên 2027 cho thử nghiệm R1 nên select Năm xem giữ `2027`.
3. **Tiêu đề đầu trang giữ nguyên `R1_COPY.hero.tieuDe`:** câu chữ dài hơn bản mẫu nên thu cỡ xuống `clamp(30px, 3vw, 39px)` để nằm trọn trong vùng trời đêm, không chạm tán cây đa.
4. **Menu chưa có trang giữ chữ tĩnh kèm nhãn `Sắp có`:** không gắn `<a>` cho 8 mảng chưa mở vì nginx của v3 hiện chỉ mở route R1; do có thêm nhãn `Sắp có`, mục cuối `Từ điển` ở 1366px hiện mũi tên cuộn ngang `›`.
5. **Chỉ dựng các phần R1 hiện có và loại trừ từ cấm:** không dựng "Bách khoa huyền học", tờ lịch bloc, "Ảnh lá số chia sẻ", "Hồ sơ hướng"; giữ nguyên khối `BAN_MAU_BIEN_TAP` và hộp `Quy ước an sao` minh bạch theo phong cách E3; bỏ các từ thuộc danh sách `src/lib/r1/tu-cam.ts`.

---

## 4. Việc còn lại

- Điền tên đơn vị chịu trách nhiệm và kênh liên hệ thật thay cho `[ĐIỀN TÊN/ĐỊA CHỈ]` và `[ĐIỀN EMAIL/SĐT LIÊN HỆ]` trong [`src/lib/r1/copy.ts`](../../src/lib/r1/copy.ts) trước khi mở chạy thật.
- Gắn đường dẫn cho 8 mục `Sắp có` trên thanh menu khi các mảng tương ứng hoàn thiện và được mở route trên nginx.
- Xóa dữ liệu kiểm thử cục bộ trong `scratch/r1-store.json` (tạo ra khi test `/api/r1/su-kien` và `/api/r1/lien-he` ở môi trường dev) nếu cần làm sạch dữ liệu phễu thử nghiệm trước khi triển khai.
