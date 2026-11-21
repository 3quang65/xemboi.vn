# Lược đồ lá số mẫu

Mỗi tệp `*.json` trong thư mục này chứa **một đối tượng lá số hoặc một mảng các đối tượng lá số** (tệp theo nhóm ca, vd. `gio-ty-muon.json` có 6 lá; id duy nhất trong toàn thư mục), chỉ dùng dữ liệu giả để kiểm thử. Không ghi tên, số điện thoại hay ngày sinh của người thật.

## Trường bắt buộc

| Đường dẫn | Kiểu dữ liệu | Ràng buộc / ý nghĩa |
|---|---|---|
| `id` | chuỗi | Duy nhất trong toàn thư mục; chỉ gồm chữ thường không dấu, số và dấu gạch nối. |
| `nhanCa` | mảng chuỗi | Không rỗng. Nhãn mô tả mục tiêu kiểm thử, thí dụ `gio-ty-muon`, `thang-nhuan`, `truoc-1968`, `cuc`, `tuan-triet`, `tu-hoa`. |
| `ngayGioSinhDuong` | đối tượng | Ngày giờ dương lịch giả dùng làm đầu vào. |
| `ngayGioSinhDuong.nam` | số nguyên | Năm từ 1800 đến 2200. |
| `ngayGioSinhDuong.thang` | số nguyên | Từ 1 đến 12. |
| `ngayGioSinhDuong.ngay` | số nguyên | Là ngày hợp lệ của tháng và năm đã cho. |
| `ngayGioSinhDuong.gio` | số nguyên | Từ 0 đến 23. |
| `ngayGioSinhDuong.phut` | số nguyên | Từ 0 đến 59. |
| `gioiTinh` | chuỗi | Một trong `nam`, `nu`. Đây là thuộc tính dữ liệu giả, không định danh người. |
| `muiGio` | chuỗi | Dạng độ lệch UTC `±HH:MM`, thí dụ `+07:00`. |
| `mongDoi` | đối tượng | Kết quả đã đối chiếu mà máy an sao phải trả về. |
| `mongDoi.amLich` | đối tượng | Ngày âm lịch mong đợi. |
| `mongDoi.amLich.nam` | số nguyên | Năm âm lịch. |
| `mongDoi.amLich.thang` | số nguyên | Tháng 1–12. |
| `mongDoi.amLich.ngay` | số nguyên | Ngày 1–30. |
| `mongDoi.amLich.nhuan` | luận lý | `true` nếu là tháng nhuận. |
| `mongDoi.canChi` | đối tượng | Có bốn chuỗi không rỗng: `nam`, `thang`, `ngay`, `gio`. |
| `mongDoi.menhThan` | đối tượng | `menh` và `than` là hai chuỗi địa chi cung an tương ứng. |
| `mongDoi.cuc` | chuỗi | Tên cục đầy đủ, thí dụ `Thủy nhị cục`. |
| `mongDoi.chinhTinh` | đối tượng | Đủ đúng 14 khóa sao chính tinh; giá trị mỗi khóa là địa chi cung an. |
| `mongDoi.nguonDoiChieu` | mảng đối tượng | Không rỗng; mỗi phần tử có `ten` (chuỗi) và `thamChieu` (chuỗi). Nguồn chưa xác định phải ghi rõ `chưa có nguồn`, không được bịa. |

Mười bốn khóa bắt buộc trong `mongDoi.chinhTinh`: `tuVi`, `thienCo`, `thaiDuong`, `vuKhuc`, `thienDong`, `liemTrinh`, `thienPhu`, `thaiAm`, `thamLang`, `cuMon`, `thienTuong`, `thienLuong`, `thatSat`, `phaQuan`.

Các đối tượng có thể bổ sung trường giải thích, nhưng không được thay hoặc bỏ trường bắt buộc. Bộ kiểm không chấp nhận trường định danh người thật như `ten`, `hoTen`, `soDienThoai`, `sdt` ở bất kỳ cấp nào (ngoại lệ duy nhất là `ten` bên trong một phần tử `nguonDoiChieu`, vì đó là tên nguồn).

## Trường tùy chọn

`nguon` (chuỗi không rỗng nếu có: nguồn đối chiếu tóm tắt), `quyUoc` (chuỗi), `bienThe` (mảng `{moTa, tuyChon, khacMacDinh}` — kết quả khi đổi quy ước), `ghiChu`, `noiSinh` (`mien-bac`/`mien-nam`), `muiGioLich`, `gioChuanUTC7`. Trường chưa kiểm được nguồn ghi `chưa có nguồn` kèm cách lấy.
