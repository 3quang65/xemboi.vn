# 14 — Sổ giấy phép mã ngoài

Lập ngày 21/11/2026 theo lời anh Cường: "tải thoải mái tất cả các repo có ích, cứ tích hợp bỏ qua vấn đề giấy phép, khi xong anh sẽ đi phép tác giả và trả phí nếu cần".

- Mã đã tải: `D:\VibeCode\Antigravity\repo-huyen-hoc\ma-nguon\` (140 repo, khoảng 7,9 GB).
- Giấy phép đọc từ tệp LICENSE trong từng repo: `repo-huyen-hoc\giay-phep-thuc-te.csv`.
- Quy tắc: mỗi lần nhúng mã, dữ liệu hay bảng tra từ repo ngoài vào xemboi, ghi một dòng vào **mục 1**. Trước khi mở trên tên miền chính, mọi dòng ở mục 1 thuộc nhóm "cần xin phép" phải đã xin phép hoặc đã thay.

## 1. Đã nhúng vào xemboi

| Ngày | Repo | Tệp hoặc phần đã dùng | Dùng ở đâu trong xemboi | Giấy phép | Trạng thái xin phép |
|---|---|---|---|---|---|
| 21/11/2026 | [Nhat-Nguyet/nhatnguyet-lunar-ziwei-bazi-numerology](https://github.com/Nhat-Nguyet/nhatnguyet-lunar-ziwei-bazi-numerology) (commit 708b5c3) | `ca-kiem/am-lich.json`, `ca-kiem/tu-vi.json`, rút gọn còn đầu vào và vị trí sao | `tests/tuvi-v2/doi-chieu/nhat-nguyet-*.json`, chỉ dùng trong test `doi-chieu-nhat-nguyet.test.mjs`, không chạy trên web | CC BY 4.0 (dùng thương mại được) | Không cần xin. Phải ghi nguồn: đã ghi trong fixture và docs/v2/15. Nếu công bố bộ test, ghi thêm tên tác giả. |
| 23/11/2026 | [6tail/lunar-javascript](https://github.com/6tail/lunar-javascript) (npm `lunar-javascript` 1.7.8, ghim đúng bản) | Bảng nghi kỵ theo ngày (`LunarUtil.getDayYi/getDayJi`) và thần sát (`getDayJiShen/getDayXiongSha`); tháng và ngày can chi do xemboi tự tính theo giờ Việt Nam rồi truyền vào | `src/lib/trang/xem-ngay.ts`, chạy trên web (cụm `/xem-ngay`); test `tests/trang/xem-ngay.test.mjs` | MIT (dùng thương mại được) | Không cần xin. Giữ LICENSE trong node_modules; trang ghi "theo bảng của lunar-javascript, không rõ sách gốc". |

Dùng ngoài xemboi, chỉ để đối chiếu (không nhúng): iztro (MIT), lunar-javascript (MIT), astronomy-engine (MIT). Script nằm ở `repo-huyen-hoc\doi-chieu\`.

## 2. Nhóm cần xin phép tác giả nếu nhúng (52 repo)

Gồm AGPL/GPL/LGPL, phi thương mại (CC BY-NC), không có tệp giấy phép, và các bản dựa trên mã Hồ Ngọc Đức (chỉ cho phi thương mại).

| Mã | Repo | Giấy phép trong repo | Ghi chú khảo sát |
|---|---|---|---|
| R004 | [ziweiknows/ziwei-chart](https://github.com/ziweiknows/ziwei-chart) | GPL (LICENSE) | GPL-3.0-or-later |
| R010 | [doanguyen/lasotuvi-django](https://github.com/doanguyen/lasotuvi-django) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ (không thấy LICENSE) |
| R013 | [nhattamchinh159/LapLaSoTuViJavaScript](https://github.com/nhattamchinh159/LapLaSoTuViJavaScript) | MIT (LICENSE) | MIT (phần Tuvi9) + tệp lunar-calendar.js theo giấy phép Hồ Ngọc Đức chỉ cho dùng |
| R014 | [thaylinh/tuvi-api](https://github.com/thaylinh/tuvi-api) | KHÔNG CÓ TỆP GIẤY PHÉP | MIT |
| R015 | [lambiengcode/astro-lens](https://github.com/lambiengcode/astro-lens) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ (không thấy LICENSE) |
| R019 | [xRaii73/tuvi](https://github.com/xRaii73/tuvi) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R020 | [0xaldric/tuvi](https://github.com/0xaldric/tuvi) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R021 | [Teiv17402/tuvi-laso](https://github.com/Teiv17402/tuvi-laso) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R022 | [destinynet/destiny-core](https://github.com/destinynet/destiny-core) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R023 | [matharts/ziwei](https://github.com/matharts/ziwei) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R024 | [Timmy9527/agentziwei](https://github.com/Timmy9527/agentziwei) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R033 | [CutePandaSh/zhdate](https://github.com/CutePandaSh/zhdate) | GPL (LICENSE) | chưa rõ |
| R036 | [hkargc/JavaScript-For-Paipan](https://github.com/hkargc/JavaScript-For-Paipan) | khác: DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE | chưa rõ (repo PHP anh em là WTFPL) |
| R037 | [vanng822/amlich](https://github.com/vanng822/amlich) | KHÔNG CÓ TỆP GIẤY PHÉP | Không có LICENSE; đầu tệp lib/amlich-aa98.js: Copyright (c) 2006 Ho Ngoc Duc, ch |
| R038 | [NghiaCaNgao/LunarDate](https://github.com/NghiaCaNgao/LunarDate) | package.json: ISC | chưa rõ; làm lại từ thuật toán Hồ Ngọc Đức 2004 |
| R039 | [nacana22/lunar-date](https://github.com/nacana22/lunar-date) | package.json: ISC | chưa rõ; làm lại từ thuật toán Hồ Ngọc Đức |
| R040 | [tuanquynh0508/lunar-calendar-ts-vi](https://github.com/tuanquynh0508/lunar-calendar-ts-vi) | package.json: MIT | chưa rõ; dựa trên JS Hồ Ngọc Đức |
| R043 | [Nhat-Nguyet/nhatnguyet-widgets](https://github.com/Nhat-Nguyet/nhatnguyet-widgets) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R048 | [hailiang194/am-duong-lich](https://github.com/hailiang194/am-duong-lich) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R053 | [livedcode/ChineseCalendarLib](https://github.com/livedcode/ChineseCalendarLib) | GPL (LICENSE) | GPL-3.0 |
| R055 | [hkargc/paipan](https://github.com/hkargc/paipan) | khác: DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE | WTFPL |
| R062 | [allanpk716/BaziEval](https://github.com/allanpk716/BaziEval) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R063 | [Jamling/birthday-tool](https://github.com/Jamling/birthday-tool) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R070 | [muyen/meihua-yishu](https://github.com/muyen/meihua-yishu) | CC BY-NC (LICENSE) | CC BY-NC-SA 4.0 |
| R072 | [zzkt/i-ching](https://github.com/zzkt/i-ching) | GPL (LICENSE) | chưa rõ |
| R075 | [obiscr/yijing](https://github.com/obiscr/yijing) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R076 | [l2yao/Iching](https://github.com/l2yao/Iching) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R080 | [muyen/decoding-iching](https://github.com/muyen/decoding-iching) | CC BY-NC (LICENSE) | chưa rõ |
| R081 | [Jockeyvb/CompassEx](https://github.com/Jockeyvb/CompassEx) | AGPL-3.0 (LICENSE.txt) | AGPL-3.0 (bản thương mại đóng mã phải mua) |
| R086 | [kentang2017/kinqimen](https://github.com/kentang2017/kinqimen) | KHÔNG CÓ TỆP GIẤY PHÉP | MIT |
| R090 | [Taogram/taobi](https://github.com/Taogram/taobi) | AGPL-3.0 (LICENSE) | MPL-2.0 |
| R093 | [d1210182010/daliurenpython-zh-tw](https://github.com/d1210182010/daliurenpython-zh-tw) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R094 | [Brhiza/mingyu](https://github.com/Brhiza/mingyu) | AGPL-3.0 (LICENSE) | AGPL-3.0-only |
| R095 | [hhszzzz/taibu](https://github.com/hhszzzz/taibu) | AGPL-3.0 (LICENSE) | MIT cho packages/core, packages/mcp, packages/mcp-server; AGPL-3.0-only cho web/ |
| R099 | [HeiGeAi/HeiGe-SuanMing](https://github.com/HeiGeAi/HeiGe-SuanMing) | CC BY-NC (LICENSE) | PolyForm Noncommercial 1.0.0 |
| R100 | [Horace-Maxwell/Horosa-Web-App-comprehensively-improved-Windows](https://github.com/Horace-Maxwell/Horosa-Web-App-comprehensively-improved-Windows) | AGPL-3.0 (LICENSE) | AGPL-3.0-only |
| R101 | [Horace-Maxwell/Horosa-Web-App-comprehensively-improved-MacOS](https://github.com/Horace-Maxwell/Horosa-Web-App-comprehensively-improved-MacOS) | AGPL-3.0 (LICENSE) | chưa rõ (bản Windows là AGPL-3.0-only) |
| R107 | [ai-freer/fortune-skill](https://github.com/ai-freer/fortune-skill) | CC BY-NC (LICENSE) | PolyForm Noncommercial (theo mô tả trên trang topic) |
| R109 | [g-battaglia/kerykeion](https://github.com/g-battaglia/kerykeion) | AGPL-3.0 (LICENSE) | AGPL-3.0 (có COMMERCIAL-LICENSE.md chưa đọc) |
| R110 | [timotejroiko/sweph](https://github.com/timotejroiko/sweph) | AGPL-3.0 (LICENSE) | AGPL-3.0 từ 2.10.1; GPL-2.0 tới 2.10.0; LGPL-3.0 nếu có giấy phép Swiss Ephemeri |
| R111 | [astrorigin/pyswisseph](https://github.com/astrorigin/pyswisseph) | AGPL-3.0 (LICENSE.txt) | chưa rõ (Swiss Ephemeris; chưa mở trang) |
| R114 | [CruiserOne/Astrolog](https://github.com/CruiserOne/Astrolog) | LGPL (license.htm) | chưa rõ |
| R118 | [kentang2017/kinastro](https://github.com/kentang2017/kinastro) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R121 | [LindseyB/tarot-api](https://github.com/LindseyB/tarot-api) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R123 | [searge/tarot](https://github.com/searge/tarot) | CC BY-SA (LICENSE.md) | chưa rõ |
| R125 | [evoluteur/motivational-numerology](https://github.com/evoluteur/motivational-numerology) | AGPL-3.0 (LICENSE) | AGPL-3.0 |
| R126 | [minhphuc010194/NumerologyWebApp](https://github.com/minhphuc010194/NumerologyWebApp) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ (không thấy LICENSE) |
| R128 | [compuuteio/numerology](https://github.com/compuuteio/numerology) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R138 | [zhaobin2026ai/bazi-sft](https://huggingface.co/datasets/zhaobin2026ai/bazi-sft) | KHÔNG CÓ TỆP GIẤY PHÉP | Apache-2.0 |
| R139 | [AmareshHebbar/bazi-sft](https://huggingface.co/datasets/AmareshHebbar/bazi-sft) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R142 | [huy555huy/suan](https://github.com/huy555huy/suan) | KHÔNG CÓ TỆP GIẤY PHÉP | chưa rõ |
| R144 | [codeaholicguy/amlich.js](https://github.com/codeaholicguy/amlich.js) | package.json: MIT | package.json ghi MIT nhưng chép mã Hồ Ngọc Đức (theo 05a mục 4) |

## 3. Nhóm giấy phép mở, chỉ cần ghi công (88 repo)

MIT, Apache-2.0, BSD, ISC, Unlicense: được dùng thương mại, phải giữ thông báo bản quyền trong tệp NOTICE của xemboi.

| Mã | Repo | Giấy phép |
|---|---|---|
| R001 | [SylarLong/iztro](https://github.com/SylarLong/iztro) | MIT (LICENSE) |
| R002 | [SylarLong/react-iztro](https://github.com/SylarLong/react-iztro) | MIT (LICENSE) |
| R003 | [Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) | MIT (LICENSE) |
| R005 | [ziweiknows/ziwei-chat](https://github.com/ziweiknows/ziwei-chat) | Apache-2.0 (LICENSE) |
| R006 | [learnwithu/mingli-master](https://github.com/learnwithu/mingli-master) | MIT (LICENSE) |
| R007 | [x-haose/x-iztro](https://github.com/x-haose/x-iztro) | MIT (LICENSE) |
| R009 | [doanguyen/lasotuvi](https://github.com/doanguyen/lasotuvi) | MIT (LICENSE) |
| R011 | [nmhaaa3218/TuViMCP](https://github.com/nmhaaa3218/TuViMCP) | Apache-2.0 (LICENSE) |
| R012 | [iZenDeveloper/viet-tuvi-engine](https://github.com/iZenDeveloper/viet-tuvi-engine) | MIT (LICENSE) |
| R016 | [airicyu/fortel-ziweidoushu](https://github.com/airicyu/fortel-ziweidoushu) | MIT (LICENSE) |
| R017 | [ethan605/ziwei-cal](https://github.com/ethan605/ziwei-cal) | MIT (LICENSE) |
| R018 | [duandigi/tu-vi-dau-so-research](https://github.com/duandigi/tu-vi-dau-so-research) | MIT (LICENSE) |
| R025 | [6tail/lunar-javascript](https://github.com/6tail/lunar-javascript) | MIT (LICENSE) |
| R026 | [6tail/lunar-typescript](https://github.com/6tail/lunar-typescript) | MIT (LICENSE) |
| R027 | [6tail/tyme4ts](https://github.com/6tail/tyme4ts) | MIT (LICENSE) |
| R028 | [6tail/lunar-python](https://github.com/6tail/lunar-python) | MIT (LICENSE) |
| R029 | [SylarLong/lunar-lite](https://github.com/SylarLong/lunar-lite) | MIT (LICENSE) |
| R030 | [yuangu/sxtwl_cpp](https://github.com/yuangu/sxtwl_cpp) | BSD (LICENSE) |
| R031 | [wolfhong/LunarCalendar](https://github.com/wolfhong/LunarCalendar) | MIT (LICENSE) |
| R032 | [kinegratii/borax](https://github.com/kinegratii/borax) | MIT (LICENSE) |
| R034 | [hungtcs/traditional-chinese-calendar-database](https://github.com/hungtcs/traditional-chinese-calendar-database) | MIT (LICENSE) |
| R035 | [liujiawm/gocalendar](https://github.com/liujiawm/gocalendar) | MIT (LICENSE) |
| R041 | [junkeythong/amlichvietnam](https://github.com/junkeythong/amlichvietnam) | MIT (LICENSE) |
| R042 | [Nhat-Nguyet/nhatnguyet-lunar-ziwei-bazi-numerology](https://github.com/Nhat-Nguyet/nhatnguyet-lunar-ziwei-bazi-numerology) | MIT (LICENSE) |
| R044 | [cmduyeen/lich-am-viet-nam](https://github.com/cmduyeen/lich-am-viet-nam) | MIT (LICENSE) |
| R045 | [qelunai/vietnamese-calendar-data](https://github.com/qelunai/vietnamese-calendar-data) | MIT (LICENSE) |
| R046 | [qelunai/qelunai-lunar](https://github.com/qelunai/qelunai-lunar) | MIT (LICENSE) |
| R047 | [FelixTNG/vn-lunar-calendar](https://github.com/FelixTNG/vn-lunar-calendar) | MIT (LICENSE) |
| R049 | [ThienMD/lich-van-nien-flutter](https://github.com/ThienMD/lich-van-nien-flutter) | MIT (LICENSE) |
| R050 | [khahdihdz/LichVietNam](https://github.com/khahdihdz/LichVietNam) | MIT (LICENSE) |
| R051 | [h4x0r/stem-branch](https://github.com/h4x0r/stem-branch) | Apache-2.0 (LICENSE) |
| R052 | [RedSC1/chinese_lunar_almanac](https://github.com/RedSC1/chinese_lunar_almanac) | MIT (LICENSE) |
| R054 | [LunarBar-app/LunarBar](https://github.com/LunarBar-app/LunarBar) | MIT (LICENSE) |
| R056 | [tommitoan/bazica](https://github.com/tommitoan/bazica) | MIT (LICENSE) |
| R057 | [iZenDeveloper/viet-bazi-engine](https://github.com/iZenDeveloper/viet-bazi-engine) | MIT (LICENSE) |
| R058 | [alvamind/bazi-calculator-by-alvamind](https://github.com/alvamind/bazi-calculator-by-alvamind) | package.json: MIT |
| R060 | [wangsquirrel/divicast](https://github.com/wangsquirrel/divicast) | MIT (LICENSE) |
| R061 | [ZHENYI-ORG/Zhenyi-bazi](https://github.com/ZHENYI-ORG/Zhenyi-bazi) | MIT (LICENSE) |
| R064 | [qianye-wuyu/yueyuan-bazi](https://github.com/qianye-wuyu/yueyuan-bazi) | MIT (LICENSE) |
| R065 | [gongzisahan/sizhu-programming](https://github.com/gongzisahan/sizhu-programming) | MIT (LICENSE) |
| R066 | [miounet11/life-kline](https://github.com/miounet11/life-kline) | Apache-2.0 (LICENSE) |
| R067 | [xuemian168/bazi-skill](https://github.com/xuemian168/bazi-skill) | Apache-2.0 (LICENSE) |
| R068 | [kentang2017/ichingshifa](https://github.com/kentang2017/ichingshifa) | MIT (LICENSE) |
| R069 | [bopo/najia](https://github.com/bopo/najia) | MIT (LICENSE) |
| R071 | [strobus/i-ching](https://github.com/strobus/i-ching) | MIT (LICENSE) |
| R073 | [john-walks-slow/open-iching](https://github.com/john-walks-slow/open-iching) | package.json: ISC |
| R074 | [abbeymondshein/i-ching-cli](https://github.com/abbeymondshein/i-ching-cli) | package.json: ISC |
| R077 | [Johnson-Jia/liuyao-divination](https://github.com/Johnson-Jia/liuyao-divination) | MIT (LICENSE) |
| R078 | [1eakkkk/liuyao-tool](https://github.com/1eakkkk/liuyao-tool) | MIT (LICENSE) |
| R079 | [shubhaviatiningsih-byte/fortune-liuyao-skill](https://github.com/shubhaviatiningsih-byte/fortune-liuyao-skill) | Apache-2.0 (LICENSE) |
| R082 | [minagawah/mikaboshi](https://github.com/minagawah/mikaboshi) | MIT (LICENSE) |
| R083 | [superzhang21/metaphysics-steward](https://github.com/superzhang21/metaphysics-steward) | MIT (LICENSE) |
| R084 | [JackieL233/fengshui-master](https://github.com/JackieL233/fengshui-master) | MIT (LICENSE) |
| R085 | [limcheekin/qishui](https://github.com/limcheekin/qishui) | MIT (LICENSE) |
| R087 | [kentang2017/kinliuren](https://github.com/kentang2017/kinliuren) | MIT (LICENSE) |
| R088 | [kentang2017/kintaiyi](https://github.com/kentang2017/kintaiyi) | MIT (LICENSE) |
| R089 | [qfdk/qimen](https://github.com/qfdk/qimen) | MIT (LICENSE) |
| R091 | [perfhelf/bigfishmarquis-qimen](https://github.com/perfhelf/bigfishmarquis-qimen) | MIT (LICENSE) |
| R092 | [taynpg/csp](https://github.com/taynpg/csp) | MIT (LICENSE) |
| R096 | [ChesterRa/mingpan](https://github.com/ChesterRa/mingpan) | Apache-2.0 (LICENSE) |
| R097 | [ml8s/liki](https://github.com/ml8s/liki) | MIT (LICENSE) |
| R098 | [Zijian-Ni/tianji](https://github.com/Zijian-Ni/tianji) | MIT (LICENSE) |
| R102 | [masterai-top/Bazi-Ziwei-Qimen-Dunjia-Divination-System-Source-Code](https://github.com/masterai-top/Bazi-Ziwei-Qimen-Dunjia-Divination-System-Source-Code) | MIT (LICENSE) |
| R103 | [dhicoc/dsh-chinese-traditional-wisdom-skill](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill) | package.json: MIT |
| R104 | [Jam0731/MingPan](https://github.com/Jam0731/MingPan) | MIT (LICENSE) |
| R105 | [GaoRenYouShu/XuanJiPaiPan](https://github.com/GaoRenYouShu/XuanJiPaiPan) | MIT (LICENSE) |
| R106 | [RubyCcll/guanwei](https://github.com/RubyCcll/guanwei) | MIT (LICENSE) |
| R108 | [cosinekitty/astronomy](https://github.com/cosinekitty/astronomy) | MIT (LICENSE) |
| R112 | [AstroDraw/AstroChart](https://github.com/AstroDraw/AstroChart) | MIT (LICENSE) |
| R113 | [0xStarcat/CircularNatalHoroscopeJS](https://github.com/0xStarcat/CircularNatalHoroscopeJS) | Unlicense (LICENSE) |
| R115 | [VedAstro/VedAstro](https://github.com/VedAstro/VedAstro) | MIT (LICENSE.md) |
| R116 | [vedika-io/xalen-ephemeris](https://github.com/vedika-io/xalen-ephemeris) | Apache-2.0 (LICENSE) |
| R117 | [sameerkumar18/aztro](https://github.com/sameerkumar18/aztro) | Apache-2.0 (LICENSE) |
| R119 | [metabismuth/tarot-json](https://github.com/metabismuth/tarot-json) | MIT (LICENSE) |
| R120 | [MarketingPipeline/Tarot.js](https://github.com/MarketingPipeline/Tarot.js) | MIT (LICENSE) |
| R122 | [lambiengcode/flutter-tarot-card](https://github.com/lambiengcode/flutter-tarot-card) | MIT (LICENSE) |
| R124 | [mixvlad/TarotCards](https://github.com/mixvlad/TarotCards) | MIT (LICENSE) |
| R127 | [LanderTome/numerologyCalculator](https://github.com/LanderTome/numerologyCalculator) | Apache-2.0 (LICENSE.md) |
| R130 | [google-ai-edge/mediapipe](https://github.com/google-ai-edge/mediapipe) | Apache-2.0 (LICENSE) |
| R131 | [yeonsumia/palmistry](https://github.com/yeonsumia/palmistry) | Apache-2.0 (LICENSE) |
| R132 | [samuelwbarber/palm-line-reader](https://github.com/samuelwbarber/palm-line-reader) | MIT (LICENSE) |
| R133 | [tenpai-ai/kanxiang](https://github.com/tenpai-ai/kanxiang) | MIT (LICENSE) |
| R134 | [molpass/mcp-gwansang](https://github.com/molpass/mcp-gwansang) | MIT (LICENSE) |
| R135 | [Leon-Drq/face-reading-skill](https://github.com/Leon-Drq/face-reading-skill) | MIT (LICENSE) |
| R136 | [ChenJiangxi/BaziQA](https://github.com/ChenJiangxi/BaziQA) | MIT (LICENSE) |
| R137 | [DestinyLinker/MingLi-Bench](https://github.com/DestinyLinker/MingLi-Bench) | MIT (LICENSE) |
| R141 | [RoxyAPI/astrology-ai-chatbot](https://github.com/RoxyAPI/astrology-ai-chatbot) | MIT (LICENSE) |
| R143 | [tf1993614/Know-your-fate](https://github.com/tf1993614/Know-your-fate) | MIT (LICENSE) |
