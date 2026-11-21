# 06. Năm mẫu tranh đầu trang “Thầy bói”

Tệp: `docs/v2/thiet-ke/dau-trang-mau.html`. Trang so sánh tự chứa, không có JavaScript và không dùng ảnh ngoài. Font Alegreya và Be Vietnam Pro lấy từ Google Fonts như E3. Không sửa `huong-e3.html`.

Mỗi khối gồm: nhãn mẫu và mô tả, header thu gọn (logo, ô tìm, menu sơn đỏ), đầu trang E3 (đường dẫn, tiêu đề, dòng phụ, form lập lá số giữ nguyên markup và CSS, chỉ bỏ JS), và bức tranh.

> **Chưa kiểm:** em chưa xem được hình thật vì không có công cụ chụp. Mọi tọa độ dưới đây là tính tay. Dung lượng tệp em chưa đo, ước khoảng 170–220 KB.

---

## 1. Cách dựng chung

### 1.1. Hệ tọa độ và vùng an toàn

**Hệ tọa độ** giống E3:
- tranh 1920×820, căn giữa;
- mép trái cột chữ luôn ở x = 400;
- form nằm ở x 1060–1520.

**Vùng an toàn ở 1366:** thấy được x 277–1643.
- Vật rời (trăng, mây, người, đò, đèn) đặt trọn trong x 300–1640.
- Ra ngoài vùng này chỉ có cảnh liền mạch: tre, đồi, sông, đất, tán đa.
- Vì vậy không còn mây cụt ở mép.
- Mây ở mẫu 5 (x 1532–1636) và đò xa có đèn ở mẫu 3 (x 1550–1614) nằm trọn trong dải hẹp giữa form và mép phải.

**Vùng chữ:** x 400–1010, y < 262. Vùng này không có sao, không có tán cây.
- Lớp tối sau chữ: `rgba(5,6,14,.8)` ở giữa.
- Chữ `#F7EBD0` đặt trên nền trời khoảng `#0B0C1C` thì tương phản theo lý thuyết hơn 12:1. Em chưa đo trên ảnh chụp.
- Mẫu 5 dùng mực `#1F140D` trên giấy `#F1E4C4`, hơn 14:1.

### 1.2. Mobile

Ở ≤ 1000px, dùng cùng một thẻ `<svg>`, không dùng `<use>` nên không lo gradient hay chuyển động mất. SVG được phóng to và dời sao cho khung cắt (`--cx --cy --cw --ch` khai báo ngay trên `.tranh-o`) lấp đầy một dải phía trên tiêu đề. Form nằm dưới.

- Đơn vị `--u: min(100vw, 760px)`.
- Ở 375px, dải cao `375 × ch / cw` (khoảng 218px).

| Mẫu | Khung cắt mobile (x, y, rộng, cao) |
|:-:|:--|
| 1 | 320, 395, 720, 418 |
| 2 | 220, 300, 877, 510 |
| 3 | 280, 380, 760, 432 |
| 4 | 150, 236, 984, 572 |
| 5 | 320, 395, 720, 418 |

### 1.3. Tán đa mới

- Không còn cục tròn. Mỗi tầng là một mảng vòm dẹt, mép dưới là dãy **mũi lá nhọn** rộng 24px (xen kẽ sâu 14 và 9).
- Viền vàng lá, gân kiểu xương cá màu vàng (đường giữa và các nhánh chéo).
- Vài lá khảm vỏ trứng hoặc lá vàng rơi lẻ.
- Bốn tầng: hai tầng sau đen nâu, một tầng giữa nâu cánh gián, một tầng trước son trầm.

### 1.4. Trăng và chuyển động

**Trăng vỏ trứng:** lưới 25 mảnh đa giác viết tay, khe là nét `#7A5A2A`, có bóng tối ở rìa. Không còn sinh bằng JS như E3.

**Chuyển động:**
- lửa đèn co giãn 2,6 giây;
- quầng đèn thở 5 giây;
- khói trôi 9 giây;
- 4–6 sao lấp lánh;
- dải trăng trên sông (mẫu 3).

Tất cả tắt khi bật `prefers-reduced-motion`.

---

## 2. Năm mẫu

| # | Tên | Ý tưởng | Nhân vật chính cao |
|:-:|:--|:--|:--|
| 1 | Sân đình đêm rằm | E3 sửa lại. Người ở tiền cảnh lệch trái (x 410–830), quầng đèn dầu ôm hai người. Đa 4 tầng lá bên trái, đình một mái lớn đầu đao cuốn phía sau, trăng ở (975, 425), lư hương có khói | Thầy 184px (gấp 2,4 lần E3), người xem 152px |
| 2 | Cận cảnh gieo quẻ | Thầy chiếm gần trọn cột trái, hai tay vừa buông 3 đồng xu (lỗ vuông) rơi về đĩa sứ viền chàm. Có sách quẻ, đèn dầu, tráp, lư hương, ống thẻ. Đa và đình lùi vào sương chàm. Khói cuộn thành hai xoáy mây cạnh trăng | Thầy 369px: 45% chiều cao tranh desktop, khoảng 75% dải mobile |
| 3 | Bến đò cổng làng | Cảnh rộng. Bờ đất trái có đa, cổng làng hai tầng mái rêu (đốm xanh) với hoành phi son. Thầy và cô gái đội nón quai thao (mặt nón vàng lá nổi trên vòm cổng tối). Sông chàm, dải trăng vàng đứt quãng, đò có mui, người lái đò chống sào in trên dải vàng | Thầy 140px, cô gái 124px |
| 4 | Chùa trên đồi, đèn lồng | Gác chuông hai tầng mái trên đỉnh đồi, chuông vàng trong tầng trên, chóp hồ lô chạm đáy trăng. Vòng 12 địa chi (Tý…Hợi, chữ nghiêng 13px) quanh trăng. Bậc đá 13 bậc dày dần theo phối cảnh, 8 đèn lồng đỏ to dần. Thầy ngồi chân bậc chỉ vào la kinh. Bắc Đẩu ở lề trái (x 318–380) | Thầy 165px |
| 5 | Tranh dân gian, nền sáng | Kiểu Đông Hồ: giấy điệp có hạt óng, viền đen 2px. Đa lá xanh, gân trắng, quả đỏ. Chiếu vàng hoè có trám đỏ, mặt trời son, mây cuộn viền đen. Thầy áo the đen than, chồng khăn đóng áo dài chàm, vợ áo tứ thân nâu, yếm đỏ, thắt lưng hoa lý. Header và chữ đổi sang màu mực, menu vẫn sơn đỏ | Thầy 184px, chồng 184px, vợ 154px |

### Em thích mẫu nào

**Em nghiêng về mẫu 1.**
- Nó sửa thẳng ba điểm yếu đã nêu: người to và là tâm điểm, tán đa hết “súp lơ”, hết mây cụt.
- Vẫn giữ đủ chất liệu anh đã ưng ở E3.
- Ở mobile thấy đủ người, đèn, đình và trăng.

**Mẫu 2 là phương án mạnh nhất về cảm xúc** nếu dáng thầy ở cỡ lớn trông đẹp. Nhưng cũng chính vì to nên mọi lỗi dáng sẽ lộ rõ nhất. Cần xem ảnh chụp rồi mới chọn.

**Mẫu 3 thơ nhất** nhưng người lại nhỏ (140px), tức là quay lại đúng điểm yếu cũ.

**Mẫu 4 huyền bí nhất** nhưng nhiều chi tiết, dễ rối ở 375px.

**Mẫu 5** chủ yếu để đối chứng nền sáng.

---

## 3. Bảng khung xương

Mỗi kiểu dáng vẽ một lần trong khung gốc rồi đặt bằng `translate … scale`. Tọa độ dưới đây là tọa độ tranh 1920×820 sau khi đặt. Ký hiệu “gần / xa” là phía gần / xa người xem.

### 3.1. Khung gốc thầy bói (nhìn 3/4, mặt quay phải)

Khung gốc:
- đỉnh khăn y 6, sàn y 200;
- đầu: tâm (101, 24), rx 13, ry 17, đỉnh sọ 7, cằm 41.

**Tỉ lệ:**
- Đầu (34 đơn vị) so với dáng ngồi (194 đơn vị) ≈ 1/5,7.
- Tính cả khăn ≈ 1/5,5.
- Thân từ vai đến hông khoảng 3,2 đầu, dài hơn người thật một chút. Em cố ý kéo dài kiểu tranh sơn mài, để giữ đầu ≈ 1/6 như anh yêu cầu.

**Tay:**
- Tay gần (tay phải) buông xuống, bàn tay đặt trên gối sau.
- Tay xa đổi theo từng mẫu.

### 3.2. Thầy, mẫu 1 và mẫu 5

`translate(382 595) scale(.95)`, tay xa chìa ra trước, lòng bàn tay ngửa.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh khăn | (478, 600,7) |
| Tâm đầu | (478, 617,8) |
| Cằm | (478, 634) |
| Cổ | (477, 638,7) |
| Vai gần / xa | (454,2, 657,7) / (495,1, 657,7) |
| Khuỷu gần | (439, 710,9) |
| Cổ tay gần (trên gối) | (424,8, 752,7) |
| Khuỷu xa | (507,4, 701,4) |
| Cổ tay xa | (537,8, 697,6) |
| Bàn tay xa | (549,2, 694,8) |
| Hông gần / xa | (458, 756,5) / (494,1, 756,5) |
| Gối sau / gối trước | (414,3, 773,6) / (554,9, 773,6) |
| Bàn chân lộ ra | (535, 779,3) |
| Sàn | y 785 |

### 3.3. Thầy, mẫu 2, gieo xu

`translate(273 420) scale(1.9)`.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh khăn | (464,9, 431,4) |
| Tâm đầu | (464,9, 465,6) |
| Cằm | (464,9, 497,9) |
| Cổ | (463, 507,4) |
| Vai gần / xa | (417,4, 545,4) / (499,1, 545,4) |
| Khuỷu gần | (436,4, 663,2) |
| Cổ tay gần | (535,2, 642,3) |
| Bàn tay gần (khum) | (558, 629) |
| Khuỷu xa | (531,4, 644,2) |
| Cổ tay xa | (588,4, 615,7) |
| Bàn tay xa (ngửa, vừa buông) | (607,4, 602,4) |
| Hông | (425, 743) / (497,2, 743) |
| Gối sau / trước | (337,6, 777,2) / (618,8, 777,2) |
| Bàn chân | (578,9, 788,6) |
| Sàn | y 800 |

Đồng xu ở (648, 650), (690, 698), (714, 746, nghiêng gần thành vạch). Đĩa ở (740, 772).

### 3.4. Thầy, mẫu 3

`translate(368 578) scale(.72)`, cùng tư thế với mẫu 1.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh khăn | (440,7, 582,3) |
| Tâm đầu | (440,7, 595,3) |
| Cằm | (440,7, 607,5) |
| Vai gần / xa | (422,7, 625,5) / (453,7, 625,5) |
| Khuỷu gần | (411,2, 665,8) |
| Cổ tay gần | (400,4, 697,5) |
| Khuỷu xa | (463, 658,6) |
| Cổ tay xa | (486,1, 655,8) |
| Bàn tay | (494,7, 653,6) |
| Hông | (425,6, 700,4) / (453, 700,4) |
| Gối | (392,5, 713,4) / (499, 713,4) |
| Sàn | y 722 |

### 3.5. Thầy, mẫu 4, chỉ la kinh

`translate(344.5 627) scale(.85)`.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh khăn | (430,4, 632,1) |
| Tâm đầu | (430,4, 647,4) |
| Cằm | (430,4, 661,9) |
| Vai gần / xa | (409,1, 683,1) / (445,7, 683,1) |
| Khuỷu gần | (395,5, 730,7) |
| Cổ tay gần | (382,8, 768,1) |
| Khuỷu xa | (458,4, 729) |
| Cổ tay xa | (490,7, 754,5) |
| Bàn tay chỉ xuống | (506, 759,6) |
| Hông | (412,5, 771,5) / (444,8, 771,5) |
| Gối | (373,4, 786,8) / (499,2, 786,8) |
| Sàn | y 797 |

La kinh ở tâm (535, 786), rx 27.

### 3.6. Khung gốc người nữ

Ngồi nghiêng, hai chân gập về phía sau, khung gốc mặt quay phải:
- đầu: tâm (100, 27), đỉnh 12,5, cằm 41,5;
- dáng ngồi 162 đơn vị, đầu ≈ 1/5,6;
- hai tay chắp trước ngực.

### 3.7. Người xem nữ, mẫu 1

`translate(874 618.5) scale(-.95 .95)`, lật ngang để quay về phía thầy.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh khăn vấn | (779, 626,1) |
| Tâm đầu | (779, 644,2) |
| Cằm | (779, 657,9) |
| Cổ | (779,5, 662,2) |
| Vai gần / xa | (798, 677,4) / (765,7, 675,5) |
| Khuỷu gần | (788,5, 714,5) |
| Cổ tay gần | (758,1, 700,2) |
| Khuỷu xa | (761, 711,6) |
| Cổ tay xa | (754,3, 698,3) |
| Bàn tay chắp | (753,4, 694,5) |
| Hông | (788,5, 751,5) / (763,8, 751,5) |
| Gối | (722, 770,5) |
| Bàn chân (sau lưng) | (822,7, 775,3) |
| Sàn | y 780 |

### 3.8. Cô gái nón quai thao, mẫu 3

`translate(681.5 592.5) scale(-.75 .75)`.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh nón | (606,5, 594,8); mặt nón x 576,5–636,5 (rộng ≈ 3,5 lần đầu) |
| Tâm đầu | (606,5, 612,8) |
| Cằm (nút quai) | (606,5, 623,6) |
| Vai gần / xa | (621,5, 639) / (596, 637,5) |
| Khuỷu gần | (614, 668,3) |
| Cổ tay gần | (590, 657) |
| Tay chắp | (586,3, 652,5) |
| Hông | (614, 697,5) / (594,5, 697,5) |
| Gối | (561,5, 712,5) |
| Bàn chân | (641, 716,3) |
| Sàn | y 720 |

### 3.9. Người vợ, mẫu 5

`translate(853.9 620) scale(-.95 .95)`.

| Điểm | Tọa độ |
|:--|:--|
| Tâm đầu | (758,9, 645,7) |
| Cằm | (758,9, 659,4) |
| Vai | (777,9, 678,9) / (745,6, 677) |
| Khuỷu gần | (768,4, 716) |
| Cổ tay gần | (738, 701,7) |
| Tay chắp | (733,3, 696) |
| Hông | (768,4, 753) / (743,7, 753) |
| Gối | (701,9, 772) |
| Bàn chân | (802,6, 776,8) |
| Sàn | y 781,5 |

### 3.10. Người chồng, mẫu 5

`translate(966.7 600) scale(-.95 .95)`, khung gốc thầy, hai tay đặt lên gối.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh khăn đóng | (870,8, 604,8) |
| Tâm đầu | (870,8, 622,8) |
| Cằm | (870,8, 639) |
| Vai gần / xa | (894,5, 662,7) / (853,7, 662,7) |
| Khuỷu gần | (909,7, 715,9) |
| Cổ tay gần | (924, 757,7) |
| Khuỷu xa | (833,7, 712,1) |
| Cổ tay xa | (807,1, 752) |
| Bàn tay xa | (801,4, 757,7) |
| Hông | (890,7, 761,5) / (854,6, 761,5) |
| Gối sau / trước | (934,4, 778,6) / (793,8, 778,6) |
| Sàn | y 790 |

### 3.11. Người lái đò, mẫu 3

`translate(968 749)`, đứng, cao 62px.

| Điểm | Tọa độ |
|:--|:--|
| Đỉnh nón | (968, 687) |
| Đầu | (968, 702) |
| Vai | (962, 708) / (974, 708) |
| Khuỷu | (979, 707) / (966, 717) |
| Tay trên sào | (980,6, 699) / (973,7, 717) |
| Hông | (968, 727) |
| Gối | (965, 737) / (971, 737) |
| Chân | (963, 749) / (973, 749) |

Sào nối (986, 685) với (950, 779).

---

## 4. Chỗ em chưa chắc trên hình thật

**Dáng người**

1. **Thân thầy hơi dài.** Để đầu ≈ 1/6, thân từ vai đến hông dài khoảng 3,2 đầu. Nếu trông cứng hoặc “cao lêu nghêu”, có hai cách:
   - phóng đầu lên 1,15 lần;
   - kéo vai xuống 6 đơn vị.
2. **Tay gần buông thẳng xuống gối sau** có thể trông như cây gậy. Chưa có nếp khuỷu rõ.
3. **Mẫu 2:** cẳng tay gần vắt ngang bụng, hai bàn tay ở gần nhau. Có thể đọc thành “chắp tay” hơn là “vừa gieo xu”. Vệt chấm và đồng xu đang rơi là thứ duy nhất nói lên động tác. Ở cỡ 369px, mọi chỗ thô của path (gốc tay áo, chỗ thân nối vạt) sẽ lộ rõ.
4. **Áo the đen trên nền tối** (mẫu 1, 3, 4) phụ thuộc vào nét viền vàng phía đèn và quần màu ngà để tách hình. Đầu và khăn xếp có thể chìm vào lũy tre phía sau.
5. **Khăn xếp và khăn đóng** chỉ khác nhau chút ít ở nếp chữ nhân. Ở cỡ nhỏ có thể trông như nhau, hoặc giống mũ.
6. **Nón quai thao** là một elip vàng dẹt có vành. Có thể bị đọc thành cái mâm hay vầng hào quang.

**Cảnh**

7. **Mũi lá đa** lặp đều có thể trông như tua rèm hay răng cưa hơn là lá.
8. **Mẫu 4, nhãn địa chi** (13px) chỉ đọc được ở desktop. Ở 375px, chữ còn khoảng 5px, chỉ là hoa văn. Nếu tiêu đề xuống 3 dòng thì mép trên vòng (y 240) có thể sát chữ.
9. **Mẫu 4, đèn lồng** dùng `<use>` có gradient bên trong. Em chưa thấy lỗi nhưng chưa thử.
10. **Mẫu 5, viền khắc gỗ.** Viền tay áo vẽ bằng nét dày hơn chồng dưới. Chỗ tay áo nối vai có thể hở một vệt viền đen cắt ngang.
11. **Mẫu 3:** người lái đò chỉ cao 62px. Dải trăng có thể sáng quá, lấn cả hai nhân vật chính.

**Kỹ thuật**

12. **Mobile:** khung cắt tính bằng `calc(min(100vw,760px) * …)`. Em chưa kiểm ở 375px thật, nhất là:
    - mẫu 4, khung cắt rộng nên người còn khoảng 65px;
    - mẫu 2, đầu thầy sát mép trên dải.
13. **Độ tương phản và dung lượng** em chỉ ước tính, chưa đo.

Trong lúc rà, em còn thấy hai chỗ lệch nhỏ chưa sửa:
- nhãn địa chi đặt thấp hơn tính toán khoảng 4px;
- đồng xu thứ ba không có lỗ vuông, vì nhìn gần như ngang cạnh.

---

## Lượt 2 (sau khi xem 10 ảnh chụp `vong5/mau*-1366-lan1.png`, `mau*-375-lan1.png`)

Em đã xem đủ 10 ảnh rồi mới sửa. Đồng ý với nhận xét: tán đa ra hình cái ô là lỗi nặng nhất, đúng như điểm 7 ở mục 4 em đã lo. Giữ nguyên cấu trúc trang, 5 mẫu, nhãn, form, menu, tiền tố id `m1-`…`m5-` và `prefers-reduced-motion`.

### Đồ dùng chung mới

Đầu `<body>` có một thẻ `<svg>` ẩn (0×0, không dùng `display:none` để gradient vẫn chạy). Trong đó có:
- **`#cay-da`**: symbol cây đa, khung 800×600, gốc thân ở (337, 594). Mỗi mẫu đặt bằng `<use>` và đổi màu qua 11 biến CSS ghi ngay trên thẻ `use`: `--da1` (khối tán sau), `--da2` (chùm lá), `--da3` (mảng sáng), `--dav`/`--davw` (màu và độ dày viền), `--dan` (nét cụm lá), `--dat`/`--dat2` (thân và vân thân), `--dar` (rễ), `--dal`/`--dal2` (lá rắc). Biến CSS kế thừa vào cây bóng của `use` nên không phải chép lại path.
- **`#trang-kham`**: trăng khảm vỏ trứng dùng chung cho mẫu 1–4.
- **`#la-giot`, `#la-de`**: lá hình giọt và lá đề nhỏ để rắc lên tán.

Các gradient và clipPath riêng của tán cũ và trăng cũ (`m1-l1…`, `m1-than`, `m1-bong`, `m1-trang`, `m2-xa`, `m3-l1…`, `m4-bong`…) đã xoá. Em đã grep lại: không còn tham chiếu nào trỏ tới id đã xoá, cũng không còn chuỗi răng cưa `q-9 2-12 14`.

### Lỗi 1: cây đa ra cái ô

Vẽ lại hoàn toàn và gộp thành `#cay-da`. Không còn hình nón, răng cưa đều, gân chữ V hay cuống ô.
- **Khối tán sau:** một khối hữu cơ rộng ngang (khoảng 790 × 310, tỉ lệ 2,5 : 1), lệch phải: đỉnh cao nhất ở giữa-phải. Mép là 24 cung lượn, cung nào cũng khác cỡ, có một chỗ lõm sâu khoảng 55 đơn vị ở giữa mép trên. Mép dưới là các cụm rủ tròn, không có mũi nhọn.
- **Bốn chùm lá chồng lớp:** trái, giữa-trên, phải, và một chùm thấp phía trước che chỗ thân chia cành. Mỗi chùm có mép lượn riêng, chừa khe tối của khối sau giữa các chùm. Mảng sáng (`--da3`) phủ phía trên-trái từng chùm. Thêm 22 nét cung ngắn trong lòng chùm để gợi cụm lá.
- **Lá rắc thưa kiểu sơn mài:** 24 lá vàng, 6 lá vỏ trứng hoặc quả son, gồm hình giọt và lá đề nhỏ, xoay lệch nhau. Có 4 lá đang rơi dưới tán.
- **Thân và rễ:** thân to (khoảng 130 đơn vị ở giữa, 330 ở chân), chân loe thành bạnh rễ, có 4 vân dọc và 5 cành lớn thò ra giữa các chùm lá. Có 2 cột rễ chạm đất ở hai đầu tán, 16 rễ phụ buông thẳng dài ngắn khác nhau, và 3 rễ bện vào thân: một rễ ôm mép trái, một rễ vắt chéo uốn chữ S qua mặt thân, một rễ ôm mép phải.
- **Màu theo mẫu:**
  - mẫu 1 và 3: sơn mài nâu son, mảng sáng son trầm, viền vàng mảnh;
  - mẫu 2: tím khói, mờ trong sương;
  - mẫu 4: bóng tím đêm, cỡ nhỏ;
  - mẫu 5: Đông Hồ, ba sắc xanh lá, viền đen 2,6, thân nâu đất, lá vàng hoè, quả son.
- **Mẫu 2:** mảng ô mờ ở góc trái thay bằng `#cay-da` tông tím khói.
- **Mẫu 4:** hai hình ô đen giữa tranh đã bỏ, thay bằng một cây đa nhỏ trên sườn đồi trái, gốc ở (585, 690). Ô bên sườn phải bỏ hẳn, vì nó nằm sau form.

### Lỗi 2: phần đáng xem bị form che

Form chiếm x tranh khoảng 1052–1527 ở mọi bề rộng ≥ 1160, vì tranh và khung chữ cùng căn giữa.
- **Mẫu 1:**
  - bỏ hai cây cau ở x 1560 và 1800;
  - bên phải chỉ còn trời, sao và một dải núi xa thấp (x 1000–1920, y 532–640);
  - tán đa đặt ngay dải dưới tiêu đề: tán x 32–712, y khoảng 270–530, gốc ở (318, 727);
  - khung cắt mobile đổi từ `320,395,720,418` thành `320,360,720,453` để thấy cả tán.
- **Mẫu 3:**
  - bỏ đò xa có đèn ở x 1550;
  - trăng dời từ x 880 sang 850, dải vàng trên sông dời theo;
  - con đò và người lái đò dời 48px sang trái thành x 770–946 (cách mép form hơn 100px) và cập bến cạnh cọc buộc ở x 756;
  - cổng làng dời từ x 640 sang 610 và vẽ đè trước tán đa, đứng ngay sau lưng cô gái.

### Lỗi 3: mẫu 4

- **Thầy to gấp 1,4 lần:** scale 0,85 → 1,19, cao khoảng 231px, đỉnh khăn y 577, đáy y 808. Mép trái x 355, tức khoảng 78px tính từ mép màn 1366, thỏa điều kiện ≥ 60.
- **Chiếu:** nới thành x 330–600.
- **La kinh:** phóng 1,12 lần, dời tới (566, 796), ngay dưới ngón tay chỉ (khoảng (548, 756)). Bỏ cuốn sổ nhỏ cạnh la kinh cho gọn.
- **Hai hình ô:** xem lỗi 1.

### Lỗi 4: mẫu 2

- **Tay:** cẳng tay gần duỗi ra trước. Bàn tay xòe úp xuống, năm ngón tách rời, rộng khoảng 60px trên tranh.
- **Xu rơi thành vệt:** ba đồng xu to hơn (r 12) nằm trên một đường cong từ dưới bàn tay xuống đĩa. Sau mỗi đồng có một vệt sáng hình nêm, nhạt dần về phía tay (gradient `m2-vet`), kèm nét tốc độ mờ và một đốm lấp lánh. Đồng thứ nhất nghiêng, đồng thứ hai ngửa mặt có lỗ vuông, đồng thứ ba gần như ngang cạnh, sắp chạm đĩa.
- **Đĩa và sách cân hơn:**
  - đĩa sứ dời sang (700, 774), rx 46, có bóng đổ và hoa văn chàm, nằm bên trái;
  - sách quẻ mở to gấp khoảng 2,5 lần (x 748–840), có bìa son và dấu son, nằm bên phải;
  - đèn dầu dời từ x 850 sang 864 để nhường chỗ cho sách.

### Lỗi 5: mẫu 5

- **Người chồng vẽ lại:**
  - ngồi xếp bằng, quần trắng, lộ hai bàn chân;
  - thân áo dài chàm đổ về trước 8°, đầu cúi thêm 7°;
  - vạt trước phủ lên đùi;
  - tay gần gập khuỷu, bàn tay ngửa đưa ra như đang hỏi thầy.
  
  Cả người dời phải 20px (`translate(986.7 600)`) để bàn tay không lẫn vào lưng người vợ.
- **Mây:** bỏ hai đám mây nhỏ rải rác.
- **Cỏ:** nét cỏ chữ “M” thay bằng khóm cỏ khắc gỗ `#m5-co` (4 lá cong ba sắc xanh, viền đen). Ba khóm có hoa son (`#m5-co-hoa`). Tổng 11 khóm rải theo cụm, chân khóm ở y ≤ 800 để không bị dải hồi văn đáy che.

### Lỗi 6: trăng khảm

Trăng dùng chung `#trang-kham`, thay lưới 25 mảnh to.
- Khoảng 70 mảnh nhỏ: 11 hàng nứt lượn nhẹ cách nhau 9 đơn vị, các vạch nối so le như gạch xây, cộng 23 vết nứt chéo chẻ thêm mảnh tam giác để phá thế lưới đều.
- Mảnh cỡ 9–11 đơn vị, khoảng 8–10px trên màn ở cỡ trăng mẫu 1.
- Khe màu nâu vàng nhạt `#B89A62`, nét 1,05.
- Nền kem có gradient cầu: sáng ở trên-trái, ngả `#D9C08C` ở rìa.
- Một số mảnh hơi sẫm, một số hơi sáng hơn, như vỏ trứng thật.
- Bóng rìa nhẹ, viền vàng `#D4AF5C`.

### Mô tả mẫu

Đã cập nhật mô tả của cả 5 mẫu trong HTML, cùng `aria-label` của tranh mẫu 1.

### Sau khi xem ảnh thật, em thích mẫu nào

**Em đổi ý: giờ em thích mẫu 4 nhất.**
- Trên ảnh chụp, đây là tranh có bố cục rõ nhất. Đường bậc đá chéo dẫn mắt từ tiền cảnh lên gác chuông rồi lên trăng.
- Đèn lồng đỏ cho điểm màu nóng mà các mẫu khác thiếu.
- Vòng 12 địa chi quanh trăng nói thẳng chuyện tử vi mà không cần chữ.
- Điểm yếu duy nhất là thầy nhỏ và sát mép, cộng hai hình ô. Cả hai đã sửa ở lượt này.

**Mẫu 2 đứng thứ hai.**
- Ảnh thật cho thấy dáng thầy ở cỡ lớn đứng được.
- Bàn tay xòe và vệt xu rơi nay đã kể được động tác.

**Mẫu 1** an toàn nhưng phẳng hơn. **Mẫu 3** thơ nhưng người nhỏ. **Mẫu 5** vẫn chỉ để đối chứng nền sáng.

### Chưa kiểm ở lượt 2

- **Chưa chụp lại sau khi sửa** (em không có công cụ chụp). Mọi vị trí mới vẫn là tính tay, cần Claude Code chụp `lan2` để duyệt.
- **Biến CSS trên `<use>` và `<use>` lồng trong symbol** (lá rắc) là cách dùng chuẩn, nhưng em chưa thử trên Safari.
- **Dung lượng tệp chưa đo.** Lượt này xoá nhiều path răng cưa dài và thêm khoảng 14 KB đồ dùng chung, nên em ước tệp nhỏ hơn hoặc ngang lượt 1, dưới 400 KB.
- **Mẫu 1:** cột rễ phải và vài rễ phụ của tán đa buông trước góc trái mái đình (x 590–650). Nếu nhìn rối thì dời cây sang trái khoảng 30px.
- **Mẫu 4:** đầu gối phải của thầy (x 542) chạm mép la kinh (x 532–600). La kinh vẽ đè lên gối. Nếu trông dính thì dời la kinh sang phải khoảng 12px.
