// Phần "phong tục" cho các trang ngày lễ /lich-am/ngay-le/{le} (và /tet cho khóa 'tet-nguyen-dan').
// Nguồn: Phan Kế Bính, *Việt Nam phong tục* (1915, phạm vi công cộng). Lý do chọn và chương ứng với lễ:
// docs/v2/doi-chieu/van-khan-phong-tuc.md mục 0, 2.1, 4.1.
//
// Văn bản: CSDL RAG (nguồn WS24) chỉ có 98 đoạn là TIÊU ĐỀ chương (mỗi đoạn 7–23 ký tự, không có thân văn,
// và số chương lệch một bậc so với Wikisource), nên mọi đoạn dưới đây chép từ bản vi.wikisource
// (trang con I.4, I.12, II.6, II.10; đọc ngày 24/11/2026). Vì vậy `doanId` đều là null và mỗi đoạn có `url`.
// `van` là nguyên văn chữ quốc ngữ của tác giả, giữ chính tả gốc (vd "quỉ", "phú quí", "gia-tiên", "Đoan-dương");
// chỉ bỏ ký tự rỗng U+200B của bản chép. Không phải sửa lỗi OCR nào trong các câu đã chọn.
// Không câu nào chứa chữ Hán (frontend cấm chữ Hán).
// Lễ có trang mà sách KHÔNG nói tới nên không có khóa: via-than-tai, gio-to-hung-vuong, phat-dan
// (thiên III mục IX chỉ ghi Phật sinh ngày mồng tám tháng tư, không tả lễ, và lệch với ngày rằm tháng tư của trang).

export const NGUON_PHONG_TUC = {
  ma: 'WS24',
  tenSach: 'Việt Nam phong tục',
  tacGia: 'Phan Kế Bính',
  nam: 1915,
  giayPhep: 'Phạm vi công cộng (tác giả mất 1921). Bản chép trên Wikisource theo CC BY-SA 4.0.',
  url: 'https://vi.wikisource.org/wiki/Việt_Nam_phong_tục',
} as const;

export const GHI_CHU_PHONG_TUC =
  'Trích từ sách Việt Nam phong tục của Phan Kế Bính, viết năm 1915, tả phong tục miền Bắc thời ấy; có chỗ tác giả phê phán tục cũ. Trang trích để biết tục xưa ghi trong sách, không khuyên làm hay bỏ tục nào.';

export type TrichPhongTuc = {
  /** id đoạn trong bảng ragDoan; null khi chép từ Wikisource (CSDL chưa có thân văn). */
  doanId: number | null;
  /** vd "Thiên I, mục XII · Tứ thời tiết lạp" */
  viTriViet: string;
  /** Nguyên văn chữ quốc ngữ của tác giả, 1–4 câu. */
  van: string;
  /** Trang Wikisource chứa đoạn, khi doanId là null. */
  url?: string;
};

export type PhongTucLe = {
  /** 1–2 câu tiếng Việt hiện đại tóm điều sách tả. */
  tomTat: string;
  trich: TrichPhongTuc[];
  /** Đường dẫn nội bộ liên quan. */
  lienQuan?: string[];
};

const WS = 'https://vi.wikisource.org/wiki/Việt_Nam_phong_tục/';
const I4 = { doanId: null, viTriViet: 'Thiên I, mục IV · Phụng sự tổ tôn', url: `${WS}I.4` } as const;
const I12 = { doanId: null, viTriViet: 'Thiên I, mục XII · Tứ thời tiết lạp', url: `${WS}I.12` } as const;
const II6 = { doanId: null, viTriViet: 'Thiên II, mục VI · Chùa chiền', url: `${WS}II.6` } as const;
const II10 = { doanId: null, viTriViet: 'Thiên II, mục X · Am chúng sinh', url: `${WS}II.10` } as const;

/** Khóa là slug trong LE_AM_NAM (src/lib/trang/lich-mua.ts). */
export const PHONG_TUC_NGAY_LE: Record<string, PhongTucLe> = {
  'tet-nguyen-dan': {
    tomTat:
      'Sách tả Tết Nguyên đán là tết lớn nhất năm: sáng mồng một cúng gia tiên với bánh chưng, giò chả, kiêng nói gở, nhờ người xông đất, con cháu mừng tuổi ông bà cha mẹ. Phần nhiều ăn Tết ba ngày, mồng bốn hóa vàng, mồng bảy hạ cây nêu.',
    trich: [
      { ...I12, van: 'Mồng một đầu năm là tết nguyên đán. Tết này ăn to hơn cả tết trong một năm.' },
      {
        ...I12,
        van: 'Sáng mồng một Tết thì làm cỗ cúng Gia-tiên và cúng cả Thổ công, Táo quân, Nghệ sư, v.v... cỗ bàn to nhỏ thế nào cũng được, nhưng làm sao cũng phải có bánh chưng, cá kho, giò, chả, dưa hành, thịt bò mới ra làm cỗ ngày Tết.',
      },
      {
        ...I12,
        van: 'Hôm ấy ăn nói phải giữ gìn, sợ nói bậy thì giông đi cả năm. Nhiều nhà nhờ một người phúc hậu dễ tính, sáng sớm đến xông đất, để cho cả năm được bán đắt, buôn may.',
      },
      {
        ...I12,
        van: 'Cúng gia tiên xong thì con cháu ra mừng tuổi ông bà cha mẹ, lạy hai lạy. Ông bà cha mẹ mừng cho con cháu mỗi đứa một vài xu hoặc một vài hào, gọi là tiền mừng tuổi.',
      },
      {
        ...I12,
        van: 'Đến ngày mồng bốn thì hóa vàng. Ngày ấy xấu hay là chạm phải ngày tuổi chủ nhà thì hóa trước sau một ngày cũng được, có nhà để đến mồng bảy mới hóa vàng, gọi là ngày cúng tiễn ông vải. Hôm ấy con cháu họp đông đủ mà ăn uống vui vầy với nhau.',
      },
    ],
    lienQuan: ['/lich-am/ngay-le/giao-thua', '/lich-am/ngay-le/ong-cong-ong-tao'],
  },

  'ram-thang-gieng': {
    tomTat:
      'Sách không có mục riêng cho rằm tháng Giêng; chỉ ghi ngày thượng nguyên là một trong những ngày nhà chùa làm cỗ chay cúng Phật, và tả suốt tháng Giêng người ta đi lễ chùa, xem hội, thi hoa đăng.',
    trich: [
      {
        ...II6,
        van: 'Ngày vào hè ra hè, thượng nguyên trung nguyên, cùng là các ngày mồng năm ngày Tết đều có làm cỗ chay cúng Phật, rồi thì thết đãi các con hương đệ tử.',
      },
      {
        ...I12,
        van: 'Suốt một tháng giêng, già trẻ trai gái, kẻ chợ nhà quê, quần điều áo thắm, kẻ thì lễ bái chùa này miếu nọ, người thì du ngoạn cảnh nọ cảnh kia, chỗ thì thi hoa thủy-tiên, chỗ thì thi hoa-đăng, chỗ thì hội hè hát xướng.',
      },
    ],
    lienQuan: ['/tet'],
  },

  'tet-han-thuc': {
    tomTat:
      'Sách kể Hàn thực (mồng ba tháng ba) bắt nguồn từ chuyện Giới Tử Thôi bên Tàu, nơi người ta kiêng lửa ba ngày, chỉ ăn đồ lạnh. Ở ta thì làm bánh trôi bánh chay cúng gia tiên, không cúng Giới Tử Thôi và cũng không kiêng nấu nướng.',
    trich: [
      { ...I12, van: 'Ngày mồng ba tháng ba là Tết Hàn thực. Hàn thực nghĩa là ăn đồ lạnh.' },
      {
        ...I12,
        van: 'Sau Vua nhớ ra, sai người vào núi tìm không được, Vua sai đốt rừng ấy cho ông phải ra. Nhưng ông cũng không chịu ra, đành hai mẹ con chịu chết cháy. Vua thương xót, lập miếu thờ trên núi và phong cả khu rừng đó làm tự điền.',
      },
      {
        ...I12,
        van: 'Hôm ông ấy chết là ngày mồng 5 tháng ba. Người xứ đó thương ông ấy, cứ mỗi năm đến ngày ấy thì cấm đốt lửa ba ngày mà bắt đầu từ hôm mồng ba, chỉ ăn đồ lạnh đã nấu sẵn mà thôi.',
      },
      {
        ...I12,
        van: 'Ta nhiễm theo tục ấy, thành ra ăn Tết hôm mồng ba. Mà ta thì làm bánh trôi bánh chay để thế cho đồ lạnh, nhưng ta chỉ cúng gia-tiên, chứ không ai tưởng gì đến Giới-Tử-Thôi. Mà tiếng là hàn thực, nhưng nấu nướng chẳng có kiêng gì.',
      },
    ],
    lienQuan: ['/tiet-khi/thanh-minh'],
  },

  'tet-doan-ngo': {
    tomTat:
      'Sách tả Tết Đoan ngọ (mồng năm tháng năm): nhuộm móng cho trẻ, sáng sớm ăn rượu nếp, hoa quả để "giết sâu bọ", đeo bùa chỉ ngũ sắc, trưa cúng gia tiên rồi đi hái lá mồng năm về phơi làm thuốc. Tác giả cho rằng tục này theo người Tàu, gắn với chuyện Khuất Nguyên, nhưng ta không cúng Khuất Nguyên.',
    trich: [
      {
        ...I12,
        van: 'Tết này ta hay lấy lá móng nhuộm các đầu ngón tay, ngón chân cho trẻ, mà trừ ra ngón tay trỏ và ngón chân trỏ.',
      },
      {
        ...I12,
        van: 'Sáng sớm hôm ấy, ăn rượu nếp, trứng luộc, kê, bánh đa, đào, mận, muỗm, dưa hấu, uống nước dừa. Người lớn thì uống rượu hòa ít tam thần đơn, hoặc hồng hoàng, gọi là giết sâu bọ.',
      },
      {
        ...I12,
        van: 'Nhiều người mua bùa chỉ đeo cho con trẻ. Bùa chỉ kết bằng chỉ ngũ sắc, và lấy những mụn lụa, mụn the kết hoa sen, quả đào, quả khế, quả ớt, v.v...',
      },
      {
        ...I12,
        van: 'Giữa buổi trưa hôm ấy thì làm cỗ cúng gia-tiên, rồi đi hái lá mồng năm, bất cứ lá gì cũng hái, mà nhất là hay hái lá ích mẫu, lá cối xay, lá muỗm, lá vối, v.v... Đem về ủ rồi phơi cho khô, về sau đem nấu uống, cho rằng uống thế thì lành.',
      },
      {
        ...I12,
        van: 'Vậy Tết ấy là một ngày kỷ-niệm ông Khuất-Nguyên, mà ta thì thấy người Tàu ăn Tết cũng theo. Nhưng theo thì theo chớ không cúng gì Khuất-Nguyên.',
      },
    ],
  },

  'ram-thang-7': {
    tomTat:
      'Sách ghi rằm tháng Bảy là Tết Trung nguyên, theo sách Phật là ngày xá tội vong nhân, nên nhiều nhà mua vàng mã cúng gia tiên và đốt mã. Nhiều làng hay hội thiện về tháng Bảy lập đàn làm chay ở am chúng sinh, tụng kinh cầu siêu, thí thực, cuối cùng chạy đàn phá ngục.',
    trich: [
      {
        ...I12,
        van: 'Rằm tháng bảy gọi là Tết Trung-Nguyên. Ta tin theo sách Phật, thường cho hôm ấy là ngày vong nhân xá tội, nghĩa là người dưới âm phủ được tha tội một ngày hôm ấy. Bởi vậy nhiều nhà mua vàng mã cúng gia tiên, các nhà có người mới mất, cũng hay đốt mã làm chay về hôm ấy.',
      },
      {
        ...I12,
        van: 'Trong sách « Mộng-hoa-lục » nói rằng: ngày Trung-nguyên mua đồ mã, áo mã cúng cấp, dùng cái giường vu lan làm bằng tre, có ba chân, rồi treo tiền của và đồ bằng mã lên trên giường mà đốt.',
      },
      {
        ...II10,
        van: 'Nhiều nơi mỗi năm về tháng bảy, hoặc công làng, hoặc riêng một hội thiện, thiết đại tràng tại cửa am để làm chay, cúng hai, ba ngày hoặc năm, bảy ngày.',
      },
      {
        ...II10,
        van: 'Hôm bắt đầu phát tấu tụng kinh, cầu nguyện cho chúng sinh được siêu linh tịnh độ, hôm sau dẫn lục cúng, rồi cũng có phóng sinh thí thực như lễ kỳ an. Hôm sau cùng thì chạy đàn phá ngục.',
      },
      {
        ...II10,
        van: 'Cách chạy đàn, có mấy người đạo tràng, đóng tuồng Đường Tăng, Đại Thánh, Sa Tăng, Bát Giới chạy xung quanh đàn, và có làm nhà ngục bằng giấy, ông thầy đâm phá các cửa ngục, nghĩa là cứu cho chúng sinh thoát khỏi vòng giam cầm ở dưới âm ty.',
      },
    ],
  },

  'trung-thu': {
    tomTat:
      'Sách gọi Trung thu là Tết trẻ con: cúng gia tiên, tối bày cỗ trông trăng với bánh mặt trăng và hoa quả, trẻ con rước đèn, múa sư tử, người lớn hát trống quân. Tác giả chép các tích về tục treo đèn bày cỗ (Đường Minh Hoàng) và hát trống quân (Nguyễn Huệ).',
    trich: [
      {
        ...I12,
        van: 'Rằm tháng 8 là Tết Trung Thu. Tết này ta thường gọi là Tết trẻ con, nhưng có nhà tổn phí nhiều lắm.',
      },
      {
        ...I12,
        van: 'Ba ngày làm cỗ cúng gia-tiên, tối đến bày cỗ thưởng nguyệt. Đầu cỗ là bánh mặt trăng, và dùng nhiều thứ bánh trái hoa quả, nhuộm các màu các sắc, sặc sỡ, xanh, đỏ, trắng, vàng.',
      },
      {
        ...I12,
        van: 'Trẻ con tối hôm ấy, dìu dắt nhau từng đàn từng lũ, đám thì nhảy vô, đám thì kéo co, đám thì bắt cái hồ khoan, đám thì rước đèn, rước sư tử, trống, thanh la đánh vang cả đường, tiếng reo hò, tiếng đùa rầm rĩ.',
      },
      {
        ...I12,
        van: 'Tục treo đèn bày cỗ, chắc do ở điển vua Đường Minh-Hoàng. Hôm ấy là ngày sinh nhật vua Minh-Hoàng, truyền cho thiên hạ đâu đâu cũng treo đèn, bày tiệc ăn mừng, rồi ta cũng theo mà thành tục.',
      },
      {
        ...I12,
        van: 'Tục hát trống quân thì do từ đời Nguyễn-Huệ bên ta mới bày ra. Nguyên khi ông đem quân ra Bắc, quân sĩ lắm kẻ nhớ nhà. Ông ấy mới bày ra một cách cho đôi bên giả làm trai gái hát đối đáp với nhau, để cho quân sĩ vui lòng mà đỡ nhớ nhà. Có đánh trống làm nhịp, cho nên gọi là trống quân.',
      },
    ],
  },

  'ong-cong-ong-tao': {
    tomTat:
      'Sách ghi ngày hai mươi ba tháng Chạp là Tết Táo quân, khi vua bếp lên chầu trời tâu việc thiện ác, kèm chuyện hai chồng một vợ chết cháy được phong làm vua bếp. Vì thế người ta mua hai mũ ông, một mũ bà và con cá chép làm ngựa cho Táo quân.',
    trich: [
      {
        ...I12,
        van: 'Hai mươi ba tháng chạp là Tết Táo quân. Ta thường cho hôm ấy là ngày vua bếp lên chầu trời. Nguyên ở trong đạo Lão-Tử có nói rằng: ngày hai mươi ba tháng chạp thì Táo quân lên chầu trời để tâu việc thiện ác của nhân gian.',
      },
      {
        ...I12,
        van: 'Vợ xấu hổ đâm đầu vào đống lửa mà chết. Người chồng cũ cảm tình ân nghĩa, cũng đâm đầu vào lửa chết theo. Người chồng sau thương vợ, cũng nhảy vào nốt, thế là chết cháy cả ba. Thượng đế thương cho ba người cùng có nghĩa mới phong cho làm vua bếp.',
      },
      {
        ...I12,
        van: 'Ta theo hai điển ấy, cho nên cứ đến ngày ấy, thì mua hai mũ ông, một mũ bà để thờ và mua con cá chép để làm ngựa cho táo quân lên chầu trời.',
      },
      {
        ...I4,
        van: 'Nhà phú quí có gia-từ, phụng thờ cao, tằng, tổ, khảo tại chính ban giữa, còn đôi bên ban cạnh nhà, thì thờ Thổ-công, Táo quân, Nghệ-sư; nhà thì thờ Bà-Cô, Ông-Mãnh v.v...',
      },
    ],
    lienQuan: ['/lich-am/ngay-le/giao-thua'],
  },

  'giao-thua': {
    tomTat:
      'Sách tả nửa đêm ba mươi rạng mồng một, nhà nhà bày hương án cúng giao thừa, làng quê tế ở điếm, để tiễn ông Hành khiển cũ, đón ông mới. Ngày ba mươi tháng Chạp gọi là trừ tịch; ở ta hôm ấy người ta đi tảo mộ rồi về cúng Tết.',
    trich: [
      {
        ...I12,
        van: 'Nửa đêm hôm ba mươi rạng ngày mồng một, ở thành phố nhà nào cũng bày hương án ra giữa sân để cúng giao thừa. Ở thôn quê thì các xóm tế giao thừa tại nơi điếm sở, trống đánh, pháo đốt ầm ầm. Tục ta tin rằng mỗi năm có một ông Hành-khiển, coi việc nhân gian, hết năm thì thần nọ bàn giao công việc cho thần kia, cho nên cúng tế để tiễn đưa ông cũ mà đón ông mới.',
      },
      {
        ...I12,
        van: 'Ba mươi tháng chạp là ngày trừ tịch. Trừ tịch là chiều hôm trừ hết năm cũ mà sang năm mới. Lại một nghĩa là trừ khử ma quỉ.',
      },
      {
        ...I12,
        van: 'Nguyên tục bên Tàu ngày xưa, cứ về hôm ấy thì dùng một trăm hai mươi đứa trẻ con độ chín, mười tuổi, mặc áo thâm, đội mũ đỏ, cầm trống, vừa đi đường vừa đánh để khử trừ ma quỉ, cho nên gọi là trừ tịch.',
      },
      {
        ...I12,
        van: 'Ta thường không hiểu ngày ấy là một tết riêng, cho là ngày tiên thường hôm nguyên đán. Cho nên cứ hôm ấy thì đem trầu cau đi thỉnh tảo tiên phần, rồi về cúng Tết.',
      },
    ],
    lienQuan: ['/tet', '/lich-am/ngay-le/ong-cong-ong-tao'],
  },
};

/**
 * Thanh minh không phải ngày lễ âm lịch trong LE_AM_NAM mà là tiết khí (TIET_KHI_24, trang /tiet-khi/thanh-minh),
 * nên để riêng. Khóa là slug tiết khí.
 */
export const PHONG_TUC_TIET_KHI: Record<string, PhongTucLe> = {
  'thanh-minh': {
    tomTat:
      'Sách ghi Thanh minh là một tiết trong tháng ba; bên Tàu hôm ấy đi tảo mộ gọi là hội Đạp thanh. Ở ta không ăn tết này, nhưng nhiều người nhân dịp ấy đi tảo mộ, cả họ đắp mả Tổ, rồi về làm cỗ cúng gia tiên.',
    trich: [
      {
        ...I12,
        van: 'Trong khoảng tháng ba, có một tiết hậu gọi là tiết Thanh-Minh. Thanh-Minh nghĩa là trời độ ấy mát mẻ quang đãng. Tục Tàu hôm ấy, giai-nhân, tài tử, đua nhau đi tảo mộ, gọi là Hội Đạp-thanh.',
      },
      {
        ...I12,
        van: 'Ta không ăn Tết ấy, nhưng cũng nhiều người nhân dịp ấy mà đi tảo mộ. Tảo mộ là đi thăm mộ tiền-nhân, cỏ rậm thì phát cho quang, đất khuyết thì đắp bồi lên, rồi về nhà cũng làm cỗ cúng gia-tiên.',
      },
      {
        ...I4,
        van: 'Một tiết thanh-minh thì cả họ rủ nhau đi đắp mả Tổ, nhiều họ đắp mãi to gần bằng núi. Có họ đắp xong thì tế ngay tại mả Tổ, có họ thì đem về nhà.',
      },
    ],
    lienQuan: ['/lich-am/ngay-le/tet-han-thuc'],
  },
};

/** Phong tục của một lễ theo slug; undefined khi sách không nói tới. */
export const phongTucLe = (slug: string): PhongTucLe | undefined => PHONG_TUC_NGAY_LE[slug];
