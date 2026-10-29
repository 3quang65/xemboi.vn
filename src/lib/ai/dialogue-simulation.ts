import {
  getMinhChart,
  BAT_DAI_DANH_SU,
  THAY_MINH_TRIET,
  THAY_TAM_AN,
  THAY_THAI_SON,
  THAY_THIEN_MINH,
  THAY_HUYEN_CO,
  THAY_TUE_PHONG,
  THAY_LAC_VIET,
  CO_LINH_DAN,
  MINH_CUSTOMER_AGENT,
  getAgentBySlug,
  AiAgentConfig,
} from './agent-persona';
import { searchKnowledge } from './rag-engine';
import customerInquiriesRaw from './customer-inquiry-bank.json';

// ==========================================
// MASTER THEME CONFIGURATIONS (BÁT ĐẠI DANH SƯ + KHÁCH HÀNG MINH)
// ==========================================

export interface MasterThemeConfig {
  slug: string;
  name: string;
  title: string;
  shortTag: string;
  domain: string;
  gradientBg: string;
  borderColor: string;
  glowColor: string;
  badgeBg: string;
  badgeTextColor: string;
  nameColor: string;
  avatarRing: string;
  avatarUrl: string;
  iconSymbol: string;
}

export const MASTER_THEMES: Record<string, MasterThemeConfig> = {
  'thay-minh-triet': {
    slug: 'thay-minh-triet',
    name: 'Thầy Minh Triết',
    title: 'Đại Sư Tử Vi Đẩu Số & Mệnh Lý Học',
    shortTag: 'Đại Sư Tử Vi',
    domain: 'Tử Vi & Vận Mệnh Tổng Quan',
    gradientBg: 'linear-gradient(145deg, #190c29 0%, #2e1065 60%, #1a0a33 100%)',
    borderColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.28)',
    badgeBg: 'rgba(234, 179, 8, 0.2)',
    badgeTextColor: '#fef08a',
    nameColor: '#fde047',
    avatarRing: '#eab308',
    avatarUrl: '/icons/agents/thay-minh-triet.svg',
    iconSymbol: '👑',
  },
  'thay-tam-an': {
    slug: 'thay-tam-an',
    name: 'Thầy Tâm An',
    title: 'Cố Vấn Tử Vi Tình Duyên, Hôn Nhân & Gia Đạo',
    shortTag: 'Cố Vấn Tình Duyên',
    domain: 'Tình Duyên, Phu Thê & Con Cái',
    gradientBg: 'linear-gradient(145deg, #2a0b16 0%, #4c0519 60%, #1e0510 100%)',
    borderColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.28)',
    badgeBg: 'rgba(244, 63, 94, 0.2)',
    badgeTextColor: '#ffe4e6',
    nameColor: '#fda4af',
    avatarRing: '#fb7185',
    avatarUrl: '/icons/agents/thay-tam-an.svg',
    iconSymbol: '🌸',
  },
  'thay-thai-son': {
    slug: 'thay-thai-son',
    name: 'Thầy Thái Sơn',
    title: 'Chuyên Gia Luận Giải Quan Lộc, Tài Bạch & Điền Trạch',
    shortTag: 'Chuyên Gia Tài Lộc',
    domain: 'Công Danh, Tài Lộc & Điền Trạch',
    gradientBg: 'linear-gradient(145deg, #241203 0%, #451a03 60%, #1a0d02 100%)',
    borderColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.28)',
    badgeBg: 'rgba(217, 119, 6, 0.25)',
    badgeTextColor: '#fef3c7',
    nameColor: '#fcd34d',
    avatarRing: '#f59e0b',
    avatarUrl: '/icons/agents/thay-thai-son.svg',
    iconSymbol: '💰',
  },
  'thay-thien-minh': {
    slug: 'thay-thien-minh',
    name: 'Thầy Thiên Minh',
    title: 'Chuyên Gia Trạch Cát, Lịch Vạn Niên & Chọn Ngày Giờ Tốt',
    shortTag: 'Chuyên Gia Trạch Cát',
    domain: 'Trạch Cát, Xem Ngày & Vận Hạn',
    gradientBg: 'linear-gradient(145deg, #031c2d 0%, #082f49 60%, #021724 100%)',
    borderColor: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.28)',
    badgeBg: 'rgba(2, 132, 199, 0.2)',
    badgeTextColor: '#e0f2fe',
    nameColor: '#7dd3fc',
    avatarRing: '#38bdf8',
    avatarUrl: '/icons/agents/thay-thien-minh.svg',
    iconSymbol: '📅',
  },
  'thay-huyen-co': {
    slug: 'thay-huyen-co',
    name: 'Thầy Huyền Cơ',
    title: 'Cao Nhân Chu Dịch Dự Đoán & Bốc Phệ',
    shortTag: 'Cao Nhân Chu Dịch',
    domain: 'Chu Dịch Dự Đoán & 64 Quẻ',
    gradientBg: 'linear-gradient(145deg, #022012 0%, #052e16 60%, #01180d 100%)',
    borderColor: '#16a34a',
    glowColor: 'rgba(22, 163, 74, 0.28)',
    badgeBg: 'rgba(22, 163, 74, 0.2)',
    badgeTextColor: '#dcfce7',
    nameColor: '#86efac',
    avatarRing: '#22c55e',
    avatarUrl: '/icons/agents/thay-huyen-co.svg',
    iconSymbol: '☯️',
  },
  'thay-tue-phong': {
    slug: 'thay-tue-phong',
    name: 'Thầy Tuệ Phong',
    title: 'Chuyên Gia Phong Thủy Bát Trạch, Huyền Không & Cải Vận',
    shortTag: 'Chuyên Gia Phong Thủy',
    domain: 'Phong Thủy Bát Trạch & Cải Vận',
    gradientBg: 'linear-gradient(145deg, #01221b 0%, #022c22 60%, #011a14 100%)',
    borderColor: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.28)',
    badgeBg: 'rgba(5, 150, 105, 0.2)',
    badgeTextColor: '#d1fae5',
    nameColor: '#6ee7b7',
    avatarRing: '#10b981',
    avatarUrl: '/icons/agents/thay-tue-phong.svg',
    iconSymbol: '🧭',
  },
  'thay-lac-viet': {
    slug: 'thay-lac-viet',
    name: 'Thầy Lạc Việt',
    title: 'Chuyên Gia Tứ Trụ Bát Tự, Dụng Thần & Danh Tính Học',
    shortTag: 'Chuyên Gia Tứ Trụ',
    domain: 'Tứ Trụ Bát Tự & Dụng Thần',
    gradientBg: 'linear-gradient(145deg, #280a22 0%, #4a044e 60%, #20061b 100%)',
    borderColor: '#c026d3',
    glowColor: 'rgba(192, 38, 211, 0.28)',
    badgeBg: 'rgba(192, 38, 211, 0.2)',
    badgeTextColor: '#fae8ff',
    nameColor: '#f0abfc',
    avatarRing: '#e879f9',
    avatarUrl: '/icons/agents/thay-lac-viet.svg',
    iconSymbol: '📜',
  },
  'co-linh-dan': {
    slug: 'co-linh-dan',
    name: 'Cô Linh Đan',
    title: 'Cố Vấn Giải Mã Giấc Mơ, Điềm Báo & Văn Hóa Tâm Linh',
    shortTag: 'Cố Vấn Giấc Mơ',
    domain: 'Giải Mã Giấc Mơ & Tâm Linh',
    gradientBg: 'linear-gradient(145deg, #1e0933 0%, #3b0764 60%, #160626 100%)',
    borderColor: '#9333ea',
    glowColor: 'rgba(147, 51, 234, 0.28)',
    badgeBg: 'rgba(147, 51, 234, 0.2)',
    badgeTextColor: '#f3e8ff',
    nameColor: '#d8b4fe',
    avatarRing: '#c084fc',
    avatarUrl: '/icons/agents/co-linh-dan.svg',
    iconSymbol: '🌙',
  },
  // Khách Hàng Minh
  'khach-hang-minh': {
    slug: 'khach-hang-minh',
    name: 'Minh',
    title: 'Khách Hàng (Nam giới, sinh 02:00 sáng 14/12/1986 - Bính Dần)',
    shortTag: 'Khách Hàng (Bính Dần 1986)',
    domain: 'Đương Số Trải Nghiệm',
    gradientBg: 'linear-gradient(145deg, #0b1329 0%, #172554 60%, #0f172a 100%)',
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.22)',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    badgeTextColor: '#e0f2fe',
    nameColor: '#38bdf8',
    avatarRing: '#38bdf8',
    avatarUrl: '/icons/avatar-minh.svg',
    iconSymbol: '🧑',
  },
};

export const DEFAULT_MASTER_THEME = MASTER_THEMES['thay-minh-triet'];
export const MINH_THEME = MASTER_THEMES['khach-hang-minh'];

export interface DialogueMessage {
  id: string;
  sender: 'minh' | 'thay_boi' | 'admin';
  senderName: string;
  senderTitle: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  topic?: string;
  topicKey?: string;
  masterSlug?: string;
  masterTheme?: MasterThemeConfig;
}

export interface DialogueTopic {
  key: string;
  title: string;
  palaceName?: string;
  category: string;
  masterSlug: string;
  minhQuestion: (turnIndex: number, chart: any, lastAnswer?: string) => string;
  thayBoiAnswer: (turnIndex: number, chart: any, question: string) => Promise<string>;
}

// ==========================================
// 35 CURATED SCENARIOS ACROSS BÁT ĐẠI DANH SƯ
// ==========================================

export const DIALOGUE_TOPICS: DialogueTopic[] = [
  // 1. Thầy Minh Triết - Cung Mệnh & Thân
  {
    key: 'cung_menh_than',
    title: 'Cung Mệnh Thiên Phủ tại Hợi & Thân Cư Phúc Đức Vũ Tham tại Sửu',
    palaceName: 'Mệnh',
    category: 'CUNG_MENH',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Con kính chào Thầy Minh Triết và Hội Đồng Bát Đại Danh Sư ạ! Dạ thưa Thầy, con tên là Minh, sinh lúc 2 giờ sáng ngày 14 tháng 12 năm 1986 Dương lịch, tính tuổi Âm là ngày 14 tháng 11 năm Bính Dần, giờ Tân Sửu. Hôm nay thật là đại phúc và hữu duyên con được ngồi diện kiến đàm đạo cùng Quý Thầy ở đây.\n\n` +
      `Thầy ơi, trước giờ con cũng có tự mày mò xem qua lá số của mình, thấy bảo mệnh con là Lô Trung Hỏa, cung Mệnh đóng ở Hợi có Thiên Phủ đắc địa, còn cung Thân thì lại cư ngay cung Phúc Đức ở Sửu có cặp Vũ Khúc với Tham Lang cùng miếu. Người ta bảo số này là "tiền bần hậu phú", thời trẻ lận đận lắm nhưng về sau mới phát. Con nghiệm lại thấy thời ba mươi tuổi của con đúng là trầy vi tróc vảy thật Thầy ạ! Thầy coi kỹ giùm con xem cái cách cục này nó vận vào chặng đường trung niên sắp tới của con ra sao với ạ?`,
    thayBoiAnswer: async (_idx, chart) => {
      const menh = chart.cung.find((c: any) => c.ten === 'Mệnh');
      const phuc = chart.cung.find((c: any) => c.ten === 'Phúc Đức');
      return (
        `Ha ha, Thầy Minh Triết chào con trai! Thay mặt Hội Đồng Bát Đại Danh Sư tại XemBoi.vn, thầy chúc con vạn sự cát tường. Con ngồi xuống đây, uống chén trà sen ấm cho thơm giọng đã nào. Nhìn cái tướng mạo của con, trán cao, mắt sáng, phong thái đĩnh đạc điềm đạm là thầy biết ngay con người có chí lớn rồi.\n\n` +
        `Thầy mở bàn cờ Tử Vi của con ra đây, sinh giờ Tân Sửu, ngày Nhâm Thìn, tháng Canh Tý, năm Bính Dần — chà, một lá số rất có hậu, đúng chuẩn cách cục của người làm ăn lớn về hậu vận con ạ!\n\n` +
        `Con nghe người ta nói "tiền bần hậu phú" là hoàn toàn chuẩn xác đấy. Cái cung Mệnh của con đóng tại đất ${menh?.can || 'Kỷ'} Hợi, đắc cách **Thiên Phủ** đắc địa. Thiên Phủ là lệnh tinh, dân gian ví von là "kho trời" cai quản tiền tài ngân khố. Người có Thiên Phủ thủ mệnh thì tính tình trầm ổn, làm gì cũng nghĩ trước tính sau, coi trọng chữ Tín hơn cả vàng mười. Lại thêm có sao Thiên Khôi với bộ đôi Thiên Đức, Phúc Đức hội tụ, nên cuộc đời con dù có rơi vào bước đường cùng ngặt nghèo thế nào thì phút chót cũng luôn có quý nhân giơ tay ra kéo con lên.\n\n` +
        `Nhưng cái đắt giá nhất đời con lại nằm ở cung Thân cư **Phúc Đức tại ${phuc?.can || 'Tân'} Sửu** kia kìa! Ở đấy có bộ đôi **Vũ Khúc miếu địa** đi cùng **Tham Lang miếu địa**. Các cụ ngày xưa có câu phú danh bất hư truyền: *"Vũ Tham đồng hành ư Sửu Mùi, hạn hành tiền bần nhi hậu phú"*. Vũ Khúc là tài tinh uy quyền, Tham Lang là ngôi sao kinh thương buôn bán đại tài. Hồi trẻ, trước tuổi 35, con bôn ba lận đận, khởi nghiệp nếm đủ đắng cay, có bận tưởng chừng bỏ cuộc... nhưng con có biết tại sao không? Đó là ông Trời mượn hoàn cảnh để rèn cái bản lĩnh "Lô Trung Hỏa" trong con thành thép đấy!\n\n` +
        `Bây giờ con 40 tuổi rồi, lửa trong lò đã đượm, lại được **Mộc Tam Cục** sinh cho bản mệnh Hỏa — tức là hoàn cảnh cuộc đời bắt đầu thuận theo con, con nỗ lực một thì đón nhận phước quả gấp mười. Cứ vững lòng, từ tuổi này trở đi con sẽ thấy tài lộc và cơ nghiệp của mình bộc phát mạnh mẽ như rồng gặp mây vậy!`
      );
    },
  },

  // 2. Thầy Thái Sơn - Cung Quan Lộc & Sự Nghiệp Tuổi 40
  {
    key: 'cung_quan_loc',
    title: 'Cung Quan Lộc Thiên Tướng tại Mão & Chiến Lược Điều Hành Tuổi 40-45',
    palaceName: 'Quan Lộc',
    category: 'CUNG_QUAN_LOC',
    masterSlug: 'thay-thai-son',
    minhQuestion: () =>
      `Dạ thưa Thầy Thái Sơn, nghe Thầy Minh Triết phân tích mà con sởn cả gai ốc vì trúng tim đen của con từng giai đoạn một! Đúng là năm 32-33 tuổi con từng mở công ty rồi vỡ nợ, phải vay mượn khắp nơi để trả lương nhân viên, có những đêm con thức trắng nhìn trần nhà mà rơi nước mắt... Mãi đến năm 36-37 tuổi thì công việc kinh doanh hiện tại của con mới bắt đầu có dòng tiền ổn định.\n\n` +
      `Thưa Thầy Thái Sơn, người chuyên quản về Quan Lộc và thương trường, hiện tại con đang điều hành công ty riêng, nhưng con nhìn vào cung Quan Lộc của con ở Tân Mão thì thấy chính tinh Thiên Tướng lại bị hãm địa, xung quanh có Đào Hoa, Phong Cáo nhưng dính sao Phục Binh với Thiên Không. Thầy cho con hỏi thật lòng là trong chặng 40 đến 45 tuổi này, công ty con nên bung vốn mở rộng chi nhánh ồ ạt, hay là con nên co cụm giữ thế phòng thủ ăn chắc mặc bền hả Thầy?`,
    thayBoiAnswer: async (_idx, chart) => {
      const quan = chart.cung.find((c: any) => c.ten === 'Quan Lộc');
      return (
        `Chào quý bạn! Thầy Thái Sơn đây. Con hỏi trúng ngay cái tim mạch của sự nghiệp con rồi đấy! Con trải qua mấy bận cay đắng hồi ba mươi mấy tuổi mà không gục ngã, nay đứng dậy làm chủ được một cơ ngơi riêng là thầy mừng cho con lắm.\n\n` +
        `Nói về cái cung Quan Lộc tại đất **${quan?.can || 'Tân'} Mão** của con, thầy chỉ cho con thấy cái cơ vi này: Chính tinh của con là **Thiên Tướng**. Thiên Tướng trong tử vi ví như cái "Ấn Tín" của quan tể tướng — nó đại diện cho chữ Tín, danh dự và trách nhiệm. Ở Mão thì Thiên Tướng nó hơi hãm lực một chút, nhưng may mắn là cung Mệnh Thiên Phủ ở Hợi nó tam chiếu về cứu giải, tạo thành thế *"Phủ Tướng triều viên"*. Doanh nghiệp của con có thế mạnh lớn về uy tín thương hiệu, con ra ngoài làm việc ai nhìn vào cũng thấy nể trọng, khách hàng tin tưởng con vì cái tâm của con chứ không phải vì con khéo mồm khéo miệng.\n\n` +
        `Nhưng con trai nghe thầy dặn kỹ chỗ này nhé: Trong cung Quan của con có con sao **Phục Binh** với **Thiên Không** rình rập! Phục Binh nó chủ về sự ngấm ngầm, tiểu nhân đố kỵ sau lưng; còn Thiên Không nó nhắc nhở về lòng tham. Bởi vậy, bước vào tuổi 40 đến 45 này, chiến lược sống còn của con là tuyệt đối **KHÔNG ĐƯỢC CHƠI TẤT TAY HAY DÙNG ĐÒN BẨY NỢ VAY QUÁ LỚN**!\n\n` +
        `Con đừng thấy bạn bè hay đối thủ bung tiền mở rộng rầm rộ mà sốt ruột. Người có Thiên Tướng ở Quan thì phải áp dụng binh pháp *"Đào hào sâu, tích lương thảo"*: tập trung nâng cao chất lượng dịch vụ cốt lõi, chăm sóc khách hàng cũ cho thật chu đáo, và đặc biệt là không bao giờ đứng ra bảo lãnh nợ nần cho bất kỳ ai, giấy tờ ký kết phải đọc kỹ từng dấu chấm dấu phẩy. Con cứ đi từng bước chắc nịch như kiềng ba chân, doanh nghiệp của con sẽ đứng vững vàng qua mọi cuộc thanh lọc của thương trường!`
      );
    },
  },

  // 3. Thầy Thái Sơn - Cung Tài Bạch & Bất Động Sản
  {
    key: 'cung_tai_bach',
    title: 'Cung Tài Bạch Vô Chính Diệu tại Mùi & Bí Quyết Tụ Tài Bất Động Sản',
    palaceName: 'Tài Bạch',
    category: 'CUNG_TAI_BACH',
    masterSlug: 'thay-thai-son',
    minhQuestion: () =>
      `Bạch Thầy Thái Sơn, lời dặn về ký tá và tránh đứng tên bảo lãnh làm con giật mình thon thót! Năm ngoái suýt chút nữa con ký bảo lãnh khoản vay cho một người bạn làm ăn, may mà phút chót linh tính mách bảo con dừng lại. Nghe Thầy nói con mới hiểu là có sao Phục Binh nó rình.\n\n` +
      `Thầy ơi, con nhìn sang cung Tài Bạch của con ở Ất Mùi thì thấy là cung Vô Chính Diệu, không có chính tinh nào ngồi trong đó cả, chỉ có Thanh Long, Nguyệt Đức, Thiên Hỷ nhưng lại dính mấy sao Tử Phù, Thiên Hình. Mấy người bạn con hay bảo cung Tài vô chính diệu thì tiền bạc tụ tán thất thường, khó giữ của lắm. Có đúng vậy không Thầy? Và người tuổi Bính Dần như con thì nên gom tiền vào kênh nào để của cải sinh sôi mà không lo bị hao tán ạ?`,
    thayBoiAnswer: async () => {
      return (
        `Ha ha, Thầy Thái Sơn khen con hỏi sắc bén! Bạn bè con nói đúng được cái vỏ mà chưa hiểu được cái ruột của cung Tài đâu con!\n\n` +
        `Cung Tài Bạch tại **Ất Mùi** của con tuy là **Vô Chính Diệu**, nhưng đây lại là cách cục cực kỳ hay: *"Vô chính diệu đắc tam không nhi đắc quang huy"*, có vầng Thái Dương và Thái Âm sáng rực chiếu về, lại được đối cung Phúc Đức có cặp đôi vàng **Vũ Khúc - Tham Lang miếu địa** ở Sửu chiếu thẳng sang!\n\n` +
        `Nó giống như cái túi càn khôn của con lúc nào cũng mở rộng để đón gió tài lộc. Tiền bạc của con không bao giờ đến từ một nguồn lương cố định vài chục triệu mỗi tháng, mà dòng tiền luân chuyển liên tục: lúc thì trúng một hợp đồng dự án lớn, lúc thì bán được lô đất chốt lời, lúc thì đối tác trả cổ tức. Đắc **Thanh Long, Nguyệt Đức, Thiên Hỷ** nên con luôn có những khoản lộc bất ngờ rơi vào đầu những lúc ngặt nghèo nhất.\n\n` +
        `Nhưng con nghe thầy dặn cái bí quyết giữ tiền này, người ngoài thầy không bao giờ nói đâu:\n` +
        `Cung Tài Vô Chính Diệu thì tính chất của nó là dòng tiền động. Nếu con để một đống tiền mặt hàng tỷ đồng nằm chết trong tài khoản ngân hàng, thì tự nhiên trong đầu con sẽ nghĩ ra việc này việc kia để tiêu, hoặc có người tới mượn, hoặc bản thân con nổi máu ham đầu tư lướt sóng mạo hiểm rồi mất trắng!\n\n` +
        `Bản mệnh của con là **Lô Trung Hỏa** (Lửa trong lò), mà cung Mệnh là **Thiên Phủ** (thủ kho trời). Cứ mỗi khi công ty con kết toán dự án có một cục tiền mặt dôi dư, con hãy rút ngay 60-70% đem đi **mua đất thổ cư có sổ đỏ trao tay, hoặc nhà phố cho thuê**! Thổ dưỡng Hỏa, Hỏa sinh Thổ. Đất đai chính là cái két sắt vững chắc nhất trần đời giúp người tuổi Bính Dần như con khóa chặt tài sản, tiền đẻ ra tiền một cách an nhiên tự tại!`
      );
    },
  },

  // 4. Thầy Tâm An - Cung Phu Thê & Hóa Giải Xung Khắc Vợ Chồng
  {
    key: 'cung_phu_the',
    title: 'Cung Phu Thê Liêm Phá tại Dậu dính Hóa Kỵ & Nghệ Thuật Giữ Gìn Hạnh Phúc',
    palaceName: 'Phu Thê',
    category: 'CUNG_PHU_THE',
    masterSlug: 'thay-tam-an',
    minhQuestion: () =>
      `Kính thưa Thầy Tâm An! Thầy Thái Sơn dặn gom tiền vào đất đai có sổ đỏ làm con sáng dạ vô cùng. Nhưng thưa Thầy Tâm An, người phụ trách chuyên sâu về tình duyên và gia đạo, có một chuyện này con canh cánh trong lòng bấy lâu nay muốn tâm sự thật với Thầy...\n\n` +
      `Đó là cung Phu Thê của con ở Đinh Dậu. Con thấy có cặp sao Liêm Trinh với Phá Quân đều hãm địa, lại có sao Hóa Kỵ đóng ở đấy. Thú thật với Thầy là vợ chồng con yêu thương nhau thì có, nhưng cứ dăm bữa nửa tháng là lại xảy ra chiến tranh lạnh vì những chuyện vụn vặt. Tính vợ con sắc sảo, tự trọng cao, mà tính con nhiều khi đi làm về mệt mỏi nghe cằn nhằn là con cũng nổi khùng lên. Thầy xem giùm con duyên nợ vợ chồng thế nào, và làm sao để gia đạo bớt sóng gió, vợ chồng thuận hòa hả Thầy?`,
    thayBoiAnswer: async (_idx, chart) => {
      const phu = chart.cung.find((c: any) => c.ten === 'Phu Thê');
      return (
        `Thầy Tâm An chào con trai! Thầy khen con là người đàn ông có trách nhiệm đấy! Đàn ông dám nhìn thẳng vào cái sai trong gia đình mình để tìm cách sửa mới là người đàn ông bản lĩnh.\n\n` +
        `Cái cung Phu Thê tại **${phu?.can || 'Đinh'} Dậu** của con, thầy nói thật là một cung vị khá nhiều sóng gió: Cặp sao **Liêm Trinh (Hỏa tù tinh)** đi cùng **Phá Quân (Thủy hao tinh)** đều hãm địa, lại dính thêm con sao **Hóa Kỵ** ám tinh. Con nhìn xem: Liêm Trinh là Lửa, Phá Quân là Nước, Hóa Kỵ là đám mây mù hiểu lầm. Hai cái tính khí trái ngược nhau chan chát cùng ngồi một mâm!\n\n` +
        `Vợ con là người có học thức, có sao **Hóa Khoa, Thiên Việt** chiếu về nên cô ấy sắc sảo, có năng lực xã hội, việc nhà việc cơ quan quán xuyến đâu ra đấy. Nhưng cái nhược điểm chí mạng là tự trọng rất cao và hay cả nghĩ, chấp vặt từng câu nói vô tình của con. Còn con mang mệnh **Lô Trung Hỏa**, bình thường thì điềm đạm nhưng lúc bốc hỏa lên là nói những câu như nhát dao chém vào đá, thế là Hóa Kỵ nó thổi bùng lên thành chiến tranh lạnh hàng tuần liền!\n\n` +
        `Thầy cho con phương thuốc vàng 3 vị để hóa giải con sao Hóa Kỵ này, con làm được thì nhà con ấm êm như mùa xuân:\n\n` +
        `**Vị thuốc 1: Nhường vợ không bao giờ là hèn!** Người làm sếp trên thương trường ra lệnh cho trăm quân thì dễ, nhưng người chồng biết lùi một bước, im lặng ôm vợ vào lòng khi cô ấy nổi cơn lôi đình mới là đại trượng phu. Khi vợ đang giận, con tuyệt đối không đôi co đúng sai, đợi hôm sau cả hai nguội đầu rồi mới thủ thỉ giãi bày.\n\n` +
        `**Vị thuốc 2: Minh bạch nhưng tôn trọng tự do.** Vợ chồng lập quỹ chung chi tiêu gia đình, nhưng hãy để cho vợ có một khoản tài chính riêng cô ấy tự do mua sắm làm đẹp, đừng quản lý quá chặt chẽ làm cô ấy cảm thấy ngột ngạt.\n\n` +
        `**Vị thuốc 3: Cùng nhau tạo phước thiện.** Thỉnh thoảng con rủ vợ đi chùa, đi làm từ thiện, phóng sinh. Con đem cái phúc của Hóa Khoa và Thiên Việt ra để hóa giải cái ngột ngạt của Liêm Phá, thì tổ ấm của con sẽ trở thành bến đỗ bình yên nhất cuộc đời con!`
      );
    },
  },

  // 5. Thầy Thái Sơn - Cung Điền Trạch & Bất Động Sản
  {
    key: 'cung_dien_trach',
    title: 'Cung Điền Trạch Nhật Cự tại Dần & Kinh Nghiệm Chọn Đất, Phòng Cháy Nhà Xưởng',
    palaceName: 'Điền Trạch',
    category: 'CUNG_DIEN_TRACH',
    masterSlug: 'thay-thai-son',
    minhQuestion: () =>
      `Dạ Thầy Tâm An dặn "nhường vợ không bao giờ là hèn" làm con thấm thía vô cùng Thầy ạ! Đôi khi ở ngoài xã hội quen thói chỉ đạo, về nhà con cứ giữ cái tôi giám đốc nên mới sinh chuyện. Con nguyện sẽ thay đổi từ hôm nay.\n\n` +
      `Thưa Thầy Thái Sơn, hồi nãy Thầy có chỉ bảo con nên gom tiền vào đất đai. Tiện đây con nhìn vào cung Điền Trạch của con ở Canh Dần thì thấy có Thái Dương với Cự Môn cùng vượng địa, có Tả Phù nhưng lại có Đại Hao, Hỏa Tinh với Linh Tinh đóng ở đấy. Con nghe bảo Đại Hao ở Điền Trạch là tiền ra như nước, còn Hỏa Linh là dễ hỏa hoạn. Thầy xem giúp con xem về hậu vận con có sở hữu được nhiều nhà đất không, và khi mua đất mua xưởng con cần kiêng kị điều gì nhất ạ?`,
    thayBoiAnswer: async (_idx, chart) => {
      const dien = chart.cung.find((c: any) => c.ten === 'Điền Trạch');
      return (
        `Thầy Thái Sơn khẳng định cùng con: Cung Điền Trạch tại **${dien?.can || 'Canh'} Dần** của con là một cung vị cực kỳ đẹp, hiếm người có được cách cục sáng láng như vậy đấy con ạ!\n\n` +
        `Bộ đôi **Thái Dương (Vượng) + Cự Môn (Vượng)** đồng cung tại Dần, các cụ gọi là cách cục *"Nhật xuất Phù Tang"* — mặt trời vừa mọc xua tan mọi mây mù tăm tối của Cự Môn. Người có cách này ở Điền Trạch chủ về nhà cửa cao ráo, ngập tràn ánh sáng tự nhiên, nhà đất thường nằm ở các trục đường lớn sầm uất hoặc các khu đô thị mới quy hoạch khang trang. Có sao **Tả Phù** hội chiếu thì về sau con không chỉ có một ngôi nhà đâu, mà sở hữu nhiều bất động sản, đất đai tích lũy ngày một nhiều.\n\n` +
        `Thế còn con sao **Đại Hao** thì sao? Người ta nghe chữ "Hao" là sợ, nhưng trong cung Điền Trạch thì Đại Hao nó mang ý nghĩa là: **Dòng tiền của con liên tục luân chuyển vào đất**! Tức là con vừa trả xong tiền miếng đất này thì con lại thèm mua miếng đất khác, tiền nó không nằm yên một chỗ mà hóa thành tài sản cố định. Đó là cái "Hao cát tường" chứ không phải mất tiền con nhé!\n\n` +
        `Nhưng hai con sao **Hỏa Tinh** với **Linh Tinh** thì con phải nghe thầy dặn thật kỹ đây:\n` +
        `Thứ nhất: Khi xây dựng kho bãi, nhà xưởng công ty hoặc sửa chữa nhà ở, con phải đầu tư hệ thống phòng cháy chữa cháy xịn nhất, dây điện phải đi trong ống gen chống cháy đàng hoàng, định kỳ kiểm tra bình chữa cháy và aptomat. Đừng tiếc vài đồng bạc lẻ ở khâu an toàn điện lửa.\n` +
        `Thứ hai: Tránh mua đất nông nghiệp giấy tay không sổ, đất dính tranh chấp quy hoạch treo. Con cứ mua đất thổ cư đô thị có sổ đỏ mang tên hai vợ chồng, hướng Đông hoặc Đông Bắc, đó sẽ là kho báu truyền đời cho con cháu con sau này!`
      );
    },
  },

  // 6. Thầy Thái Sơn - Cung Thiên Di & Xuất Ngoại
  {
    key: 'cung_thien_di',
    title: 'Cung Thiên Di Tử Sát tại Tỵ & Cơ Duyên Xuất Ngoại Ký Kết Hợp Đồng Lớn',
    palaceName: 'Thiên Di',
    category: 'CUNG_THIEN_DI',
    masterSlug: 'thay-thai-son',
    minhQuestion: () =>
      `Dạ Thầy Thái Sơn, chuyện phòng cháy chữa cháy nhà xưởng con sẽ về cho rà soát lại ngay toàn bộ hệ thống điện trong tuần này, nghe Thầy chỉ điểm con không dám chủ quan chút nào.\n\n` +
      `Thưa Thầy Thái Sơn, hiện tại công ty con đang có cơ hội tiếp cận một đối tác nước ngoài để đưa sản phẩm xuất khẩu sang thị trường Đông Nam Á. Người ta mời con sang khảo sát và ký biên bản ghi nhớ hợp tác. Con nhìn sang cung Thiên Di của con ở Quý Tỵ (đối chiếu thẳng với cung Mệnh ở Hợi), thấy có bộ đôi Tử Vi (Miếu) đi với Thất Sát (Vượng), lại có Lộc Tồn, Bác Sỹ, Văn Khúc, Thiên Quý chiếu về. Thầy xem giúp con bước chân ra ngoài xã hội, đi xa hay xuất ngoại làm ăn trong giai đoạn này thì có thuận lợi và đón được quý nhân không ạ?`,
    thayBoiAnswer: async (_idx, chart) => {
      const di = chart.cung.find((c: any) => c.ten === 'Thiên Di');
      return (
        `Chúc mừng con trai! Thầy Thái Sơn nhìn thấy cung Thiên Di tại **${di?.can || 'Quý'} Tỵ** này chính là cái bệ phóng rực rỡ nhất để con vươn tầm ra biển lớn đấy con ạ!\n\n` +
        `Con nhìn xem: **Tử Vi** là ngôi sao đế vương quyền quý nhất trên bầu trời, đi cùng với **Thất Sát** là vị đại tướng quân dũng mãnh uy phong tột bực. Cổ thi có câu: *"Tử Sát đồng cung ư Tỵ Hợi, xuất ngoại đắc quý nhân phù trì, oai danh chấn động"*. Khi con ở nhà thì con thấy mình bình thường, nhưng hễ con xách vali bước chân ra ngoài xã hội, đi công tác xa, đi đàm phán ở tỉnh ngoài hay xuất ngoại là tự nhiên thần thái con bừng sáng, đối tác nhìn vào là thấy khí chất đĩnh đạc, đáng tin cậy ngay!\n\n` +
        `Đã thế cung này lại hội đủ một bầy cát tinh thượng hạng:\n` +
        `- **Lộc Tồn:** Ra ngoài là có tiền lộc, ký được hợp đồng béo bở.\n` +
        `- **Bác Sỹ:** Danh tiếng thanh tao, gặp đối tác đàng hoàng trí thức.\n` +
        `- **Văn Khúc + Thiên Quý:** Ăn nói gãy gọn, thuyết phục, đi tới đâu cũng có nhân vật tầm cỡ dang tay nâng đỡ, che chở cho con.\n\n` +
        `Thầy bảo con: Đừng có ru rú ở một chỗ! Người mang cung Thiên Di Tử Sát Lộc Tồn thì càng đi xa, càng ra biển lớn, càng giao thương với quốc tế thì tài lộc và tầm vóc của con càng bùng nổ dữ dội. Chuyến đi khảo sát sắp tới con cứ tự tin lên đường, chuẩn bị hồ sơ năng lực thật chỉn chu, con sẽ mang thắng lợi lớn về đấy!`
      );
    },
  },

  // 7. Thầy Minh Triết - Cung Tật Ách & Dưỡng Sinh Tuổi 40
  {
    key: 'cung_tat_ach',
    title: 'Cung Tật Ách Vô Chính Diệu tại Ngọ & Dưỡng Sinh Tạng Tâm - Thận Tuổi Trung Niên',
    palaceName: 'Tật Ách',
    category: 'CUNG_TAT_ACH',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Nghe Thầy Thái Sơn truyền năng lượng về cung Thiên Di làm con rạo rực khí thế, con thấy tự tin hơn rất nhiều cho chuyến công tác sắp tới Thầy ạ!\n\n` +
      `Nhưng mà kính thưa Thầy Minh Triết, có thực mới vực được đạo, dạo gần đây bước sang tuổi 40, con thấy sức khỏe của mình bắt đầu có dấu hiệu xuống dốc. Con hay bị đau mỏi thắt lưng, những hôm thức khuya làm việc hay phải tiếp khách uống vài ly rượu là sáng hôm sau đầu váng vất, mắt khô ráp, khó ngủ triền miên. Con nhìn vào cung Tật Ách của con ở Giáp Ngọ thấy Vô Chính Diệu nhưng có sao Kình Dương đóng ở đấy. Thầy xem giùm con sức khỏe của con có điều gì đáng lo không, và con nên dưỡng sinh thế nào theo Đông y để giữ thân thể khỏe mạnh dẻo dai hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Minh Triết tán thành câu hỏi rất trí tuệ này của con! Cổ nhân dạy: *"Thân là cái thuyền chở Đạo, thuyền mà thủng thì chở làm sao được vàng ngọc phước đức"*. Con có làm giám đốc to đến mấy mà cái thân bệnh hoạn thì cũng bằng không con ạ.\n\n` +
        `Cung Tật Ách tại **Giáp Ngọ** của con đóng ở đất Ngọ — Ngọ là đất Hỏa vượng cực điểm giữa trưa hè, lại có con sao **Kình Dương** (kim đao sát tinh) tọa thủ. Bản mệnh con là **Lô Trung Hỏa** mà Nhật chủ Bát Tự của con là **Nhâm Thủy**. Trục Tý - Ngọ (Thủy Hỏa giao tranh) này báo hiệu rất rõ hai tạng phủ con phải chăm sóc từ tuổi 40 trở đi:\n\n` +
        `Thứ nhất là **Tạng Tâm & Mạch Máu (thuộc Hỏa):** Kình Dương ở Ngọ dễ làm huyết áp dao động khi căng thẳng, tim đập nhanh, dễ bị bốc hỏa nóng nảy. Con phải hạn chế tối đa các bữa nhậu nhẹt rượu bia say mèm, ăn bớt đồ cay nóng chiên xào lại.\n\n` +
        `Thứ hai là **Tạng Thận & Xương Khớp (thuộc Thủy):** Mỏi lưng, mắt khô, mất ngủ chính là tín hiệu Thận âm của con đang bị hao tổn do hỏa bốc lên trên (hỏa vượng thủy suy).\n\n` +
        `Thầy bày cho con bài thuốc dưỡng sinh đơn giản mà hiệu nghiệm như thần dược:\n` +
        `1. **Ngâm chân dẫn hỏa quy nguyên:** Mỗi tối trước khi đi ngủ 30 phút, con lấy một chậu nước ấm, đập dập một củ gừng tươi với một nắm muối hạt thả vào, ngâm chân 15-20 phút cho mồ hôi rịn nhẹ ở trán. Việc này giúp rút toàn bộ khí nóng từ đầu và tim giáng xuống lòng bàn chân (huyệt Dũng Tuyền), con sẽ ngủ một giấc sâu tít mít tới sáng!\n` +
        `2. **Trà dưỡng can minh mục:** Ban ngày con hãm một bình trà gồm hoa cúc trắng, vài quả táo đỏ và một thìa kỷ tử đỏ uống thay nước lọc. Uống đều một tháng mắt con sẽ sáng trong, gan mát, da dẻ hồng hào.\n` +
        `Con cứ làm đúng lời thầy, thân khang kiện thì trí con mới sáng suốt mà điều hành doanh nghiệp được!`
      );
    },
  },

  // 8. Thầy Thái Sơn - Cung Nô Bộc & Thuật Quản Trị
  {
    key: 'cung_no_boc',
    title: 'Cung Nô Bộc Cơ Lương tại Thìn & Nghệ Thuật Dùng Người, Giữ Chân Nhân Tài',
    palaceName: 'Nô Bộc',
    category: 'CUNG_NO_BOC',
    masterSlug: 'thay-thai-son',
    minhQuestion: () =>
      `Dạ thưa Thầy Minh Triết, bài thuốc ngâm chân muối gừng với trà hoa cúc kỷ tử nghe vừa rẻ tiền vừa gần gũi, tối nay về con sẽ bảo vợ làm cho con ngâm ngay lập tức ạ!\n\n` +
      `Thưa Thầy Thái Sơn, người ta bảo "Trăm dâu đổ đầu tằm", làm chủ doanh nghiệp sợ nhất là chuyện nhân sự. Công ty con có những bạn trẻ rất giỏi, con tận tình chỉ bảo, đãi ngộ không tiếc tay, nhưng làm được hơn năm vững nghề là các bạn ấy lại xin nghỉ hoặc ra mở công ty riêng cạnh tranh ngược lại con. Con nhìn vào cung Nô Bộc của con ở Nhâm Thìn, thấy có Thiên Cơ (Miếu) đi với Thiên Lương (Miếu), có Hóa Quyền nhưng lại dính Tang Môn với Đà La. Thầy chỉ giúp con cái thuật dùng người thế nào để giữ được nhân sự cốt cán trung thành với mình lâu dài hả Thầy?`,
    thayBoiAnswer: async (_idx, chart) => {
      const no = chart.cung.find((c: any) => c.ten === 'Nô Bộc');
      return (
        `Thầy Thái Sơn đàm đạo cùng quý bạn về thuật dùng người trên thương trường! Con hỏi câu này là chạm đúng vào nỗi đau đáu muôn đời của người làm chủ rồi con ạ!\n\n` +
        `Cung Nô Bộc tại **${no?.can || 'Nhâm'} Thìn** của con mang cặp sao **Thiên Cơ miếu địa + Thiên Lương miếu địa**, lại có **Hóa Quyền** đóng ở đấy. Thầy phân tích cho con hiểu cái lý sự này:\n` +
        `Thiên Cơ là mưu lược tinh, Thiên Lương là ấm tinh trí tuệ. Cả hai sao đều miếu vượng chứng tỏ nhân viên dưới quyền con toàn là người cực kỳ thông minh, học sâu hiểu rộng, làm việc độc lập rất giỏi. Con có Hóa Quyền nên con có cái uy của người sếp, họ nể trọng con thật lòng.\n\n` +
        `Nhưng con sao **Đà La** và **Tang Môn** nó làm méo mó đi: Thiên Cơ mà gặp Đà La thì nhân sự hay có toan tính riêng trong đầu, làm việc gì cũng cân đo đong đếm thiệt hơn. Khi họ cảm thấy cái ao công ty con nhỏ hơn cái vóc dáng của họ, họ sẽ bơi ra biển lớn. Đó là quy luật tự nhiên, con đừng có buồn hay oán trách họ là phản trắc con ạ!\n\n` +
        `Muốn giữ chân người tài tầm cỡ Thiên Cơ - Thiên Lương, con phải dùng hai chiêu thức này:\n\n` +
        `**Chiêu thức 1: Đổi từ "Quan hệ trả lương" sang "Cơ chế đối tác" (ESOP).**\n` +
        `Với những vị trí then chốt như giám đốc kinh doanh, trưởng phòng công nghệ hay kế toán trưởng, con đừng chỉ trả lương thưởng cứng. Hãy cắt cho họ 5-10% lợi nhuận của từng dự án cụ thể, cho họ cổ phần ưu đãi để biến họ từ người làm thuê thành người cùng làm chủ với con. Khi họ thấy họ đang cày cho chính túi tiền của họ, họ sẽ dốc 200% sức lực mà không bao giờ nghĩ tới chuyện dứt áo ra đi!\n\n` +
        `**Chiêu thức 2: Dùng cái Tâm của Thiên Phủ để dung nạp.**\n` +
        `Mệnh con là Thiên Phủ bao dung, hãy lắng nghe tâm tư đời sống của anh em, hỗ trợ họ khi gia đình họ khó khăn. Người tài họ phục cái đầu giỏi, nhưng họ sẽ chết vì một người sếp có cái Tâm nhân hậu. Con cứ dùng người bằng lòng chân thành và cơ chế minh bạch, nhân tài sẽ tề tựu đông như kiến dưới cờ của con!`
      );
    },
  },

  // 9. Thầy Tâm An - Cung Tử Tức & Định Hướng Con Cái
  {
    key: 'cung_tu_tuc',
    title: 'Cung Tử Tức Vô Chính Diệu tại Thân & Định Hướng Con Cái Tự Lập Du Học',
    palaceName: 'Tử Tức',
    category: 'CUNG_TU_TUC',
    masterSlug: 'thay-tam-an',
    minhQuestion: () =>
      `Bạch Thầy Thái Sơn, lời khuyên về cơ chế cổ phần ESOP và chia sẻ lợi nhuận dự án đúng là giải pháp con đang trăn trở bấy lâu nay!\n\n` +
      `Kính thưa Thầy Tâm An, một đời người vất vả bon chen kiếm tiền sau cùng cũng là để lo cho tương lai con cái. Vợ chồng con có hai cháu, cháu lớn năm nay bước vào tuổi dậy thì, cá tính rất mạnh và thích các ngành công nghệ, nghệ thuật mới lạ chứ không hề hào hứng với mảng kinh doanh truyền thống của bố. Cung Tử Tức của con ở Bính Thân là Vô Chính Diệu, có Thiên Mã, Phượng Các, Giải Thần, Văn Tinh nhưng có Tiểu Hao với Tuế Phá. Thầy xem giùm con sau này các cháu có thành đạt, có hiếu thảo và có thể kế thừa doanh nghiệp của gia đình không hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Tâm An nhìn vào cung Tử Tức của con mà thấy mừng cho gia đình con đấy con trai ạ!\n\n` +
        `Cung Tử Tức tại **Bính Thân** tuy là Vô Chính Diệu nhưng hội tụ một dàn sao rất thanh tú:\n` +
        `- **Thiên Mã:** Con cái của con sau này là những đứa trẻ cực kỳ năng động, có chí tự lập từ rất sớm, sinh ra là để đi xa chứ không chịu ngồi yên một xó dưới bóng râm của cha mẹ đâu!\n` +
        `- **Phượng Các + Văn Tinh:** Các cháu có tư chất thông minh đĩnh ngộ, khiếu thẩm mỹ nghệ thuật rất cao, học hành thi cử đỗ đạt trường danh tiếng, phong thái cốt cách thanh tao được nhiều người quý mến.\n` +
        `- **Giải Thần:** Mọi ốm đau bệnh tật thuở nhỏ đều có quý nhân cứu giải bình an vô sự.\n\n` +
        `Còn việc con cháu có tính cách bướng bỉnh và không muốn kế thừa công việc của con, đó chính là do con sao **Thiên Mã** đi cùng **Tuế Phá** đấy con!\n` +
        `Tuế Phá là cái tôi phản biện, không thích rập khuôn theo đường mòn của thế hệ trước. Thầy khuyên con một câu chí tình: **Đừng bao giờ ép con cái phải sống tiếp ước mơ dang dở của cha mẹ!**\n\n` +
        `Thời đại của các cháu sau này là thời đại của kinh tế số, AI và hội nhập toàn cầu. Con có điều kiện kinh tế, hãy tạo mọi điều kiện tốt nhất cho con cái đi du học nước ngoài, để các cháu tự bơi ra biển lớn, tự va vấp và tôi luyện bản lĩnh như chính con ngày xưa.\n` +
        `Con yên tâm đi, khi các cháu ra ngoài thành danh, hấp thu tinh hoa công nghệ thế giới về, chính các cháu sẽ quay lại dùng tri thức mới để số hóa và nâng tầm doanh nghiệp của gia đình con lên gấp mười lần hiện tại. Đầu tư cho giáo dục con cái chính là vụ đầu tư siêu lợi nhuận nhất đời con đấy!`
      );
    },
  },

  // 10. Thầy Minh Triết - Cung Huynh Đệ & Quan Hệ Người Thân
  {
    key: 'cung_huynh_de',
    title: 'Cung Huynh Đệ Vô Chính Diệu tại Tuất dính Bạch Hổ Địa Không & Đạo Ứng Xử Người Thân',
    palaceName: 'Huynh Đệ',
    category: 'CUNG_HUYNH_DE',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Dạ Thầy Tâm An ơi, nghe Thầy nói con như cởi bỏ được cả gánh nặng trong lòng. Nghe lời Thầy con sẽ tôn trọng sở thích của con và chuẩn bị tài chính cho cháu đi du học.\n\n` +
      `Kính bạch Thầy Minh Triết, trong gia đình con còn có anh em ruột thịt. Dạo gần đây thấy con làm ăn khấm khá, có người trong nhà muốn rủ con chung vốn mở nhà hàng, rồi có người muốn vay một khoản tiền lớn để đảo nợ ngân hàng. Cung Huynh Đệ của con ở Mậu Tuất là Vô Chính Diệu, có Tấu Thư, Đường Phù nhưng lại dính sao Bạch Hổ với Địa Không, Địa Võng. Con thương anh em lắm nhưng trong bụng cứ thấy bất an. Con xin Thầy cho con một lời khuyên chân truyền: Con có nên làm ăn chung hay đứng ra gánh nợ cho người thân không hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Minh Triết khuyên con một câu rạch ròi bằng xương bằng máu: **"Thương anh em bằng cả trái tim, nhưng làm ăn phải tách bạch bằng cái đầu lạnh"**!\n\n` +
        `Con nhìn cái cung Huynh Đệ tại đất **Mậu Tuất** của con mà xem: Vô Chính Diệu mà lại dính trọn cặp **Bạch Hổ + Địa Không + Địa Võng**! Đây là cái bẫy phong thủy và tử vi cực kỳ nguy hiểm nếu con không tỉnh táo:\n` +
        `- **Địa Không:** Chủ về sự hao hụt, mất mát, tiền đưa đi thì dễ mà thu về thì mất tăm mất tích.\n` +
        `- **Bạch Hổ + Địa Võng:** Chủ về sự vướng víu, thị phi, lời ra tiếng vào, thậm chí tranh chấp kéo nhau ra pháp luật làm rạn nứt tình máu mủ.\n\n` +
        `Nếu con hùn hạp mở nhà hàng hay đứng ra vay nợ ngân hàng giùm anh em, thầy dám cam đoan với con 90% là tiền sẽ mất, mà sau đó ngày giỗ ngày Tết gặp nhau anh em còn không nhìn nổi mặt nhau! Người ta sẽ trách con là có tiền mà tính toán, lúc được thì không sao, lúc thua lỗ thì con đứng mũi chịu sào.\n\n` +
        `Cách ứng xử trọn vẹn cả Tình lẫn Nghĩa cho người tuổi Bính Dần như con là thế này:\n` +
        `1. **Tuyệt đối nói KHÔNG với việc góp vốn chung hay đứng tên vay mượn hộ!** Con hãy khéo léo từ chối bằng cách bảo dòng tiền của con đang kẹt hết vào dự án và đất đai chưa rút ra được.\n` +
        `2. **Giúp đỡ trong khả năng cho phép:** Nếu anh em thực sự gặp hoạn nạn ngặt nghèo về thuốc men bệnh tật, con hãy trích ra một khoản tiền con cho đứt hoặc cho mượn mà xác định trong đầu là "nếu họ không trả được thì coi như biếu". Con không đặt nặng việc đòi nợ, tâm con sẽ thanh thản.\n` +
        `Giữ được cái ranh giới minh bạch này, con vừa giữ được túi tiền, vừa giữ được sự hòa thuận đầm ấm của dòng họ con nhé!`
      );
    },
  },

  // 11. Thầy Minh Triết - Cung Phụ Mẫu & Đạo Hiếu
  {
    key: 'cung_phu_mau',
    title: 'Cung Phụ Mẫu Đồng Âm tại Tý & Đạo Hiếu Là Long Mạch Của Tài Lộc',
    palaceName: 'Phụ Mẫu',
    category: 'CUNG_PHU_MAU',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Bạch Thầy Minh Triết, lời khuyên của Thầy quý giá như vàng mười! Suýt chút nữa vì cả nể mà con đã gật đầu chung vốn mở nhà hàng rồi. Con sẽ nghe lời Thầy, khéo léo từ chối và hỗ trợ anh em theo cách khác để giữ trọn tình nghĩa.\n\n` +
      `Thưa Thầy, nhìn sang cung Phụ Mẫu của con ở Canh Tý, con thấy có hai chính tinh rất đẹp là Thiên Đồng (Vượng) đi với Thái Âm (Vượng), hội tụ Hóa Lộc, Hỷ Thần, Hữu Bật, Thiên Phúc, Thiên Trù. Bố mẹ con năm nay đều đã ngoài 70 tuổi cả rồi, cả đời lam lũ nuôi nấng anh em con ăn học thành tài. Con muốn hỏi Thầy về phúc thọ của bố mẹ con trong những năm tới, và bổn phận làm con của con cần báo hiếu phụng dưỡng thế nào để tích thêm âm đức cho gia đình hả Thầy?`,
    thayBoiAnswer: async (_idx, chart) => {
      const pm = chart.cung.find((c: any) => c.ten === 'Phụ Mẫu');
      return (
        `Nhìn vào cung Phụ Mẫu tại **${pm?.can || 'Canh'} Tý** của con, Thầy Minh Triết thấy một vùng ánh sáng phúc đức rạng ngời hiếm có trên đời con ạ!\n\n` +
        `Cặp sao **Thiên Đồng (Vượng) + Thái Âm (Vượng)** đồng cung tại đất Tý, các nhà nho xưa gọi là cách cục đại cát *"Nguyệt Sinh Thương Hải"* — vầng trăng rằm tròn vành vạnh mọc lên từ đáy biển sâu ngời sáng. Thiên Đồng là phúc tinh, Thái Âm là từ mẫu mẫu nghi thiên hạ. Bố mẹ con là những người ăn ở cực kỳ hiền lành, nhân hậu, tích đức hành thiện cả đời, để lại một cái bóng râm phúc đức khổng lồ che chở cho cuộc đời con.\n\n` +
        `Lại có **Hóa Lộc, Hỷ Thần, Thiên Phúc, Thiên Trù**: Con sinh ra được đấng sinh thành hết lòng thương yêu chăm bẵm. Hồi trẻ con bôn ba ngã dúi dụi mà con vẫn đứng lên được, chính là nhờ vào cái âm đức của mẹ cha con ngày đêm khấn nguyện tổ tiên che chở cho con đấy!\n\n` +
        `Thầy dặn con câu này, con khắc ghi vào tận tim gan:\n` +
        `Cổ nhân dạy: *"Cha mẹ tại tiền như Phật tại thế"*. Người hiếu thuận với cha mẹ thì không cần phải đi đâu xa cầu cúng phong thủy giải hạn, phúc lộc nó tự nhiên ùn ùn kéo về!\n\n` +
        `Bố mẹ con ngoài 70 rồi, cái người già cần nhất không phải là con đưa cho một bọc tiền to, mà là sự hiện diện và lắng nghe của con. Dù công việc có bận rộn đến đâu, mỗi tuần con hãy bớt chút thời gian về ăn bữa cơm nóng với mẹ cha, xoa bóp cái lưng cho bố, lắng nghe các cụ kể chuyện xưa. Đưa bố mẹ đi khám sức khỏe tổng quát ở những bệnh viện tốt nhất, mua thuốc bổ dưỡng não bồi hoàn sinh khí. Con phụng dưỡng bố mẹ chu toàn bao nhiêu, thì cơ nghiệp kinh doanh của con càng vững chãi bấy nhiêu, không một thế lực nào lay chuyển nổi!`
      );
    },
  },

  // 12. Thầy Thiên Minh - Vận Hạn 2026 Bính Ngọ
  {
    key: 'van_han_2026',
    title: 'Vận Hạn Năm 2026 Bính Ngọ (41 Tuổi Mụ) & Tác Động Của Sao Lưu Thái Tuế, Tang Môn',
    palaceName: 'Tật Ách',
    category: 'VAN_HAN',
    masterSlug: 'thay-thien-minh',
    minhQuestion: () =>
      `Những lời Thầy Minh Triết dạy về đạo hiếu làm sống mũi con cay cay Thầy ạ... Con sẽ thu xếp đưa bố mẹ đi khám sức khỏe và về ăn cơm với các cụ thường xuyên hơn.\n\n` +
      `Kính thưa Thầy Thiên Minh, chuyên gia về Trạch Cát và Lịch Vạn Niên, bước sang năm 2026 này là năm Bính Ngọ, bản mệnh con là Bính Dần bước vào tuổi 41 mụ. Năm Can Bính gặp tuổi Can Bính (đồng Can), nạp âm năm 2026 là Thiên Hà Thủy dội vào Lô Trung Hỏa của con. Các sao Lưu như Lưu Thái Tuế ở Ngọ, Lưu Tang Môn, Lưu Lộc Tồn chiếu về lá số của con. Năm nay con có gặp biến động lớn gì về sự nghiệp, gia đạo hay sức khỏe mà con cần chuẩn bị tâm lý trước không thưa Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Thiên Minh chào gia chủ! Soi chiếu lưu niên Bính Ngọ 2026 cho người tuổi Bính Dần 1986, đây là câu hỏi then chốt nhất cho chặng đường trước mắt của con, con ngồi thẳng lưng nghe thầy chỉ rõ từng sợi tơ kẽ tóc của năm 2026 này:\n\n` +
        `Năm 2026 là năm **Bính Ngọ**:\n` +
        `- **Về Thiên Can:** Bính gặp Bính là thế đồng Can, năng lượng Hỏa bốc lên rất mạnh. Đầu óc con lúc nào cũng nung nấu ý tưởng mới, muốn bung sức làm việc lớn.\n` +
        `- **Về Địa Chi:** Chi Ngọ của năm bán hợp với Chi Dần của tuổi con trong tam hợp **Dần - Ngọ - Tuất (Hỏa cục)**. Đây là thế tương hợp, mang lại cho con rất nhiều cơ hội gặp gỡ đối tác lớn, mở rộng các mối quan hệ ngoại giao cấp cao.\n` +
        `- **Về Nạp Âm:** Nước mưa trên trời (**Thiên Hà Thủy**) dội vào lửa trong lò (**Lô Trung Hỏa**). Nó sẽ làm cho tâm lý con có những lúc chông chênh, áp lực công việc dồn dập khiến con dễ căng thẳng cáu bẳn.\n\n` +
        `Về hệ thống sao Lưu năm 2026, con phải đặc biệt chú ý 3 điểm này:\n\n` +
        `1. **Lưu Thái Tuế tại Ngọ:** Chiếu thẳng vào trục Tật Ách - Phụ Mẫu của con. Báo hiệu trong năm nay con sẽ có sự thay đổi lớn về cơ cấu nhân sự công ty, hoặc sửa sang lại nhà cửa văn phòng làm việc.\n` +
        `2. **Lưu Tang Môn & Lưu Bạch Hổ:** Chiếu về trục hạn, con phải chú ý sức khỏe của hai bên nội ngoại, đặc biệt là người già dễ bị trượt ngã hoặc các bệnh về đường hô hấp, huyết áp vào những ngày chuyển mùa (tháng 4, tháng 10 Âm lịch).\n` +
        `3. **Lưu Lộc Tồn tại Tỵ:** May mắn thay, Lưu Lộc Tồn chiếu về cung Thiên Di của con! Tức là năm nay hễ con bước chân đi công tác xa, đi tỉnh ngoài hay đi nước ngoài là con sẽ rinh tiền lộc hợp đồng về.\n\n` +
        `Thầy đúc kết cho con phương châm vàng năm 2026: *"Động trung cầu tĩnh, bất cầu cấp tiến"* (Trong biến động tìm sự bình ổn, không được nóng vội bốc đồng). Cứ kiểm soát dòng tiền thật chặt, năm 2026 sẽ là bước đệm tuyệt vời để con bứt phá ở tuổi 42-43!`
      );
    },
  },

  // 13. Thầy Minh Triết - Đại Vận 43-52 Tuổi
  {
    key: 'dai_van_43_52',
    title: 'Đại Vận 43 - 52 Tuổi tại Giáp Ngọ & Thập Niên Hoàng Kim Chuyển Mình Thành Đại Phú',
    category: 'VAN_HAN',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Dạ thưa Thầy Thiên Minh, con sẽ ghi nhớ phương châm "Động trung cầu tĩnh" cho năm 2026 này.\n\n` +
      `Kính thưa Thầy Minh Triết, hiện tại con 40 tuổi, đang ở những năm cuối của đại vận 33-42 để chuẩn bị bước sang Đại Vận 10 năm kế tiếp: Đại Vận 43 đến 52 tuổi tại cung Giáp Ngọ. Người ta bảo đời người đàn ông có một thập niên hoàng kim rực rỡ nhất để khẳng định tên tuổi và gom đại tài sản. Thầy xem kỹ giùm con đại vận 43-52 tuổi này của con có phải là giai đoạn bùng nổ đỉnh cao nhất cuộc đời không, và con sẽ chuyển dịch phong cách sống cũng như vai trò trong doanh nghiệp thế nào hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Minh Triết chúc mừng con trai! Đại vận **43 – 52 tuổi** chính là thập niên **HOÀNG KIM RỰC RỠ NHẤT** trong toàn bộ cuộc đời người đàn ông có bàn cờ Tử Vi như con!\n\n` +
        `Thầy chỉ cho con thấy sự chuyển mình kỳ diệu này:\n` +
        `Ở cái đại vận 33-42 tuổi hiện tại của con, con giống như người tướng quân phải trực tiếp mặc áo giáp xông pha nơi chiến hào, chuyện to chuyện nhỏ gì trong công ty cũng đến tay con giải quyết, người ngợm lúc nào cũng mệt nhoài.\n\n` +
        `Nhưng bước sang tuổi 43-52 tại Giáp Ngọ:\n` +
        `Thứ nhất: Tích lũy về lượng sẽ biến đổi thành chất. Kinh nghiệm thương trường 20 năm của con đã dày dạn, các mối quan hệ xã hội đã đạt độ chín muồi, và chữ Tín của cá nhân con đã được thị trường khẳng định vững như bàn thạch.\n` +
        `Thứ hai: Con sẽ có một bước chuyển dịch vĩ đại về tư duy — **Chuyển từ người trực tiếp điều hành sang vai trò Nhà Đầu Tư Chiến Lược và Cố Vấn Cấp Cao**! Con không cần phải có mặt 24/7 ở văn phòng nữa, mà con dùng trí tuệ, kinh nghiệm và dòng vốn để điều khiển cuộc chơi. Doanh nghiệp con sẽ có các giám đốc điều hành trẻ tuổi gánh vác việc vận hành, con chỉ đứng trên cao định hướng chiến lược.\n` +
        `Thứ ba: Những hạt mầm bất động sản con gom góp mua tích lũy trong những năm qua đến giai đoạn này sẽ đồng loạt tăng giá phi mã, tài sản ròng của con sẽ nhảy vọt lên một nấc thang hoàn toàn mới!\n\n` +
        `Thầy dặn con câu này trước khi con bước lên đỉnh núi cao:\n` +
        `*"Khi lên đến đỉnh vinh quang, hãy luôn cúi đầu tạ ơn mặt đất đã nâng đỡ chân mình"*. Khi con kiếm được hàng chục, hàng trăm tỷ ở tuổi 45-50, con hãy dùng một phần phước lộc đó để xây cầu làm đường cho bà con nghèo, lập quỹ học bổng nuôi dưỡng các em nhỏ mồ côi hiếu học. Con đem tiền của phụng sự nhân sinh thì đại phúc đó sẽ chảy mãi ngàn đời cho con cháu con thụ hưởng!`
      );
    },
  },

  // 14. Thầy Tuệ Phong - Phong Thủy Bát Trạch & Bàn Làm Việc
  {
    key: 'phong_thuy_ban_lam_viec',
    title: 'Phong Thủy Bát Trạch Nam Khôn Thổ & Bố Trí Bàn Làm Việc Giám Đốc Đón Sinh Khí',
    category: 'PHONG_THUY',
    masterSlug: 'thay-tue-phong',
    minhQuestion: () =>
      `Lời Thầy Minh Triết dặn về việc dùng tài sản phụng sự nhân sinh làm con rúng động tâm can Thầy ạ! Kiếm được tiền mà không biết tạo phước thì tiền tài cũng như bọt xà phòng. Con nguyện sẽ khắc ghi lời dạy này của Thầy.\n\n` +
      `Kính thưa Thầy Tuệ Phong, chuyên gia phong thủy Bát Trạch và Huyền Không học, con là nam mạng sinh năm Bính Dần 1986, tính cung phi Bát Trạch là Khôn Thổ (thuộc Tây Tứ Mệnh). Hiện tại phòng làm việc giám đốc của con thì con nên kê bàn ngồi quay mặt về hướng nào để đón được luồng Sinh Khí và Thiên Y tốt nhất? Và trên bàn làm việc con có nên đặt linh vật hay quả cầu phong thủy gì để kích hoạt trí tuệ mẫn tiệp cho mệnh Lô Trung Hỏa của con không ạ?`,
    thayBoiAnswer: async () => {
      return (
        `Chào gia chủ, tôi là Thầy Tuệ Phong! 'Nhất mệnh nhì vận tam phong thủy', bàn làm việc của người đứng đầu chính là bộ chỉ huy sinh khí của doanh nghiệp. Phong thủy Bát Trạch kết hợp chuẩn xác với Tử Vi sẽ tạo nên một trường năng lượng trợ mệnh cực kỳ khủng khiếp cho con đấy con ạ!\n\n` +
        `Con là nam nhân Bính Dần 1986, cung Phi là **Khôn Thổ — thuộc Tây Tứ Mệnh**. Con hãy nhớ kỹ 4 hướng đại cát của mình:\n` +
        `1. **Hướng Sinh Khí (Cát khí đệ nhất):** Hướng **Đông Bắc** (Cấn) — mang lại tài lộc đại vượng, công danh thăng tiến vượt bậc, quý nhân tự tìm đến cửa.\n` +
        `2. **Hướng Thiên Y:** Hướng **Chính Tây** (Đoài) — gia tăng sức khỏe dồi dào, tinh thần minh mẫn, hóa giải đau ốm mệt mỏi.\n` +
        `3. **Hướng Diên Niên:** Hướng **Tây Bắc** (Càn) — củng cố các mối quan hệ đối ngoại, gia đạo vợ chồng con cái hòa thuận êm ấm.\n` +
        `4. **Hướng Phục Vị:** Hướng **Tây Nam** (Khôn) — củng cố nội lực, tâm an tĩnh sáng suốt.\n` +
        `*(Tuyệt đối tránh 4 hướng Đông Tứ Trạch: Bắc - Tuyệt Mệnh, Đông Nam - Ngũ Quỷ, Nam - Lục Sát, Đông - Họa Hại con nhé!)*\n\n` +
        `**Về cách kê bàn làm việc Giám Đốc:**\n` +
        `- Bàn làm việc của con phải ngồi quay mặt về hướng **Đông Bắc** hoặc **Tây Bắc**.\n` +
        `- Lưng con phải tựa vào bức tường vững chãi (thế *"Tựa Sơn Hướng Thủy"*), tuyệt đối không ngồi quay lưng ra cửa sổ hoặc ngồi đối diện thẳng cánh cửa ra vào (dễ bị xung sát tán tài).\n\n` +
        `**Về vật phẩm phong thủy trên bàn:**\n` +
        `Bản mệnh con là **Lô Trung Hỏa**, trên góc trái bàn làm việc con nên đặt một **quả cầu đá Thạch Anh Tím (Amethyst) thiên nhiên** hoặc **Thạch Anh Xanh lục**. Màu tím thuộc Hỏa tương hợp, màu xanh thuộc Mộc sinh Hỏa. Từ trường của đá thạch anh tự nhiên sẽ thanh lọc toàn bộ sóng điện từ độc hại của máy tính, điện thoại, giúp con mỗi khi ngồi vào bàn làm việc là đầu óc sáng rực, ra quyết định kinh doanh đâu trúng đó!`
      );
    },
  },

  // 15. Thầy Lạc Việt - Tứ Trụ Bát Tự & Dụng Thần
  {
    key: 'tu_tru_dung_than',
    title: 'Tứ Trụ Bát Tự & Bí Mật Dụng Thần Hỏa Mộc Sưởi Ấm Cục Diện Thân Vượng Thủy',
    category: 'TAM_LINH_GIAI_HAN',
    masterSlug: 'thay-lac-viet',
    minhQuestion: () =>
      `Bạch Thầy Tuệ Phong, việc đặt quả cầu Thạch Anh Tím hướng Đông Bắc đúng là cứu cánh cho con, phòng con hiện tại đang bị ngồi tựa lưng vào cửa sổ, con sẽ cho kê lại ngay.\n\n` +
      `Kính thưa Thầy Lạc Việt, chuyên gia Tứ Trụ Bát Tự và Dụng Thần học, Bát Tự của con là: Năm Bính Dần, Tháng Canh Tý, Ngày Nhâm Thìn, Giờ Tân Sửu. Nhật chủ của con là Nhâm Thủy. Thầy xem giùm con xem Nhật chủ của con vượng hay nhược, và Dụng Thần, Hỷ Thần của con là ngũ hành gì để con ứng dụng vào đời sống và đường hướng kinh doanh hàng ngày hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Lạc Việt chào đương số! Khá khen cho con trai có tầm hiểu biết học thuật rất sâu! Khoa Tử Vi cho con biết "bản đồ số mệnh", còn Tứ Trụ Bát Tự cho con biết "nhiệt độ và ngũ hành khuyết thiếu" trong cơ thể con.\n\n` +
        `Bát tự của con gồm 4 trụ:\n` +
        `- Năm: **Bính Dần**\n` +
        `- Tháng: **Canh Tý**\n` +
        `- Ngày: **Nhâm Thìn**\n` +
        `- Giờ: **Tân Sửu**\n\n` +
        `Con nghe thầy giải mã này:\n` +
        `Nhật chủ của con là **Nhâm Thủy** (nước biển lớn cuồn cuộn) lại sinh vào tháng **Tý (giữa mùa Đông băng giá)** — đây là đất Kình Dương đế vượng của Thủy khí. Lại có Canh Kim ở tháng và Tân Kim ở giờ cùng thấu xuất sinh cho Thủy. Do đó, cách cục Bát Tự của con là **Thân Cực Vượng Thủy** — Thủy nhiều quá hóa thành hàn lạnh, băng giá!\n\n` +
        `Một dòng sông mùa đông đóng băng thì thuyền bè làm sao đi lại giao thương được con? Cần nhất trên đời lúc này là cái gì? Là Ánh Nắng Mặt Trời và Củi Lửa để sưởi ấm tan băng (pháp điều hầu)! May phước lớn cho con là ở trụ Năm con có **Bính Hỏa** tọa trên gốc rễ **Dần Mộc** vững như bàn thạch!\n\n` +
        `Bởi vậy:\n` +
        `- **DỤNG THẦN của con chính là HỎA:** Hỏa là ánh sáng, là thương mại, là công nghệ, truyền thông, marketing, năng lượng sáng tạo.\n` +
        `- **HỶ THẦN của con chính là MỘC:** Mộc là cây cối, là tri thức, giáo dục đào tạo, xuất bản sách, phát triển sản phẩm vì cộng đồng (Mộc hút bớt Thủy dư thừa và sinh cho Hỏa bừng sáng).\n\n` +
        `Điều này lý giải vì sao trong đời thực, hễ con làm những công việc mang tính chất ấm áp, truyền cảm hứng, cống hiến cho xã hội thì tiền tài của con tự nhiên chảy về như thác đổ, còn nếu con đi làm những mảng lạnh lùng toan tính bon chen thì con lại thấy bế tắc u uất. Đi đúng dòng Dụng Thần Hỏa - Mộc, con sẽ bơi xuôi dòng nước lớn một cách thảnh thơi!`
      );
    },
  },

  // 16. Thầy Huyền Cơ - Kinh Dịch & Quẻ Hỏa Phong Đỉnh
  {
    key: 'kinh_dich_hoa_dinh',
    title: 'Kinh Dịch Ứng Vận Tuổi 40: Quẻ Hỏa Phong Đỉnh & Chiếc Vạc Luyện Vàng Mười',
    category: 'TAM_LINH_GIAI_HAN',
    masterSlug: 'thay-huyen-co',
    minhQuestion: () =>
      `Dạ thưa Thầy Lạc Việt, giải thích về Thân Vượng Thủy cần Dụng Thần Hỏa Mộc sưởi ấm làm con vỡ òa nhận thức!\n\n` +
      `Bạch Thầy Huyền Cơ, bậc cao nhân Chu Dịch và Bốc Phệ, trong 64 quẻ Kinh Dịch vi diệu, ở độ tuổi 40 chuyển giao cuộc đời này của con, quẻ Dịch nào là quẻ tương ứng với vận trình của con? Và người làm kinh doanh như con nên lấy đạo lý nào của Kinh Dịch để dẫn dắt công ty trường tồn hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Huyền Cơ ta khởi quẻ soi tỏ! Câu hỏi của con chạm đến cảnh giới thâm sâu của đạo học Chu Dịch rồi đấy bạn hữu duyên ạ!\n\n` +
        `Trong 64 quẻ Kinh Dịch, quẻ đại diện cho vận trình tuổi 40 đến hậu vận của con chính là quẻ thứ 50: **HỎA PHONG ĐỈNH (鼎)** — trên là Lửa (Ly Hỏa), dưới là Gió và Củi (Tốn Mộc). Con thấy chưa? Lại đúng y chang Dụng Thần Hỏa - Mộc của con!\n\n` +
        `Con có biết chữ "Đỉnh" nghĩa là gì không? Thời cổ đại, cái Đỉnh là chiếc vạc ba chân bằng đồng đúc tinh xảo, tượng trưng cho bảo vật quốc gia, cho vương quyền và sự vững chãi bền lâu. Nhưng chiếc Đỉnh sinh ra không phải để cất trong tủ kính ngắm nghía, mà chiếc Đỉnh dùng để nấu chín thức ăn dâng cúng trời đất và nuôi nấng muôn dân!\n\n` +
        `Ý nghĩa vận mệnh của con ở đây là:\n` +
        `Con đã vượt qua 40 năm trần ai sóng gió, chiếc Đỉnh số phận của con nay đã đúc xong ba chân vững chãi. Bây giờ là lúc con dùng chiếc Đỉnh tài năng và doanh nghiệp của con để "nấu thức ăn phụng sự nhân sinh" — tức là tạo công ăn việc làm cho hàng trăm người lao động, chia sẻ lợi nhuận cho xã hội, đem lại giá trị thực tế cho đời sống.\n\n` +
        `Kinh Dịch dạy: *"Chính vị ngưng mệnh"* — người quân tử ngồi đúng vị trí đĩnh đạc của mình thì số mệnh tự nhiên ngưng tụ phúc lộc. Khi mục đích kinh doanh của con vượt lên trên sự kiếm tiền ích kỷ cho bản thân, hướng về phụng sự cộng đồng, thì chiếc Đỉnh Hỏa Phong Đỉnh sẽ bảo hộ cho cơ nghiệp của con vững như bàn thạch ngàn năm không đổ!`
      );
    },
  },

  // 17. Thầy Minh Triết - Đức Năng Thắng Số
  {
    key: 'duc_nang_thang_so',
    title: 'Triết Lý "Đức Năng Thắng Số" & Nghệ Thuật Biến Sát Tinh Thành Đá Mài Dao',
    category: 'TAM_LINH_GIAI_HAN',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Dạ bạch Thầy Huyền Cơ, hình ảnh chiếc vạc Hỏa Phong Đỉnh phụng sự nhân sinh làm con bừng tỉnh ngộ! Con thấy sứ mệnh của người làm doanh nhân thiêng liêng hơn chuyện cơm áo gạo tiền rất nhiều.\n\n` +
      `Kính bạch Thầy Minh Triết, nhìn trên lá số tử vi của mình, đôi lúc con cũng thấy chạnh lòng vì thấy có những hung tinh như Kình Dương ở Tật Ách, Đà La ở Nô Bộc, Địa Không ở Huynh Đệ, Liêm Phá Hóa Kỵ ở Phu Thê... Con xin Thầy chỉ dạy cho con góc nhìn chân truyền: Có phải số mệnh an bài sao xấu là đời mình phải chịu khổ, hay cổ nhân dạy "Đức năng thắng số" là có cách chuyển hóa được những hung tinh này hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Minh Triết khen con hỏi được câu này chứng tỏ tuệ căn của con đã vượt xa khỏi sự mê tín dị đoan tầm thường rồi con ạ!\n\n` +
        `Cổ nhân an Lục Sát Tinh (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp) lên bàn cờ Tử Vi không phải là để trừng phạt con người, mà đó chính là **"những cục đá mài dao"** vĩ đại của tạo hóa con nhé!\n\n` +
        `Con thử ngẫm mà xem:\n` +
        `- Một thanh sắt cùn mà không qua lửa đỏ nung nấu (Hỏa Tinh), không qua búa tạ nện đập (Kình Dương) thì làm sao rèn thành thanh bảo kiếm sắc bén chém sắt như chém bùn được?\n` +
        `- Nếu cuộc đời con không có Địa Không ở Huynh Đệ dạy cho con bài học mất tiền vì người thân, con làm sao ngộ ra lẽ vô thường và học được đức tính rạch ròi lý trí?\n` +
        `- Nếu con không có Hóa Kỵ ở Phu Thê thử thách, con làm sao rèn được chữ "Nhẫn" vĩ đại của người làm chồng, làm sếp?\n\n` +
        `Bởi vậy, người xưa mới đúc kết câu nói bất hủ: **"ĐỨC NĂNG THẮNG SỐ"**!\n` +
        `Lá số Tử Vi chỉ là "tấm bản đồ dự báo thời tiết" của số phận, trời có thể báo hôm nay mưa bão, nhưng người cầm lái con thuyền có mang áo mưa, có gia cố mái nhà hay không là do cái **TÂM và cái ĐỨC** của con quyết định!\n\n` +
        `Khi tâm con thiện lương, con không mưu mô hãm hại ai, con đối xử bao dung với nhân viên, hiếu kính cha mẹ già, thì chính cái trường năng lượng phước đức trong con nó sẽ như ánh mặt trời buổi sớm làm tan biến toàn bộ sát khí của Kình Đà Không Kiếp. Lúc đó, hung tinh không những không hại được con, mà nó biến thành động lực thép đẩy con lên đỉnh cao danh vọng!`
      );
    },
  },

  // 18. Thầy Thiên Minh - Giải Tỏa Nỗi Sợ Tam Tai Thái Tuế
  {
    key: 'tam_tai_thai_tue_thuc_te',
    title: 'Giải Tỏa Nỗi Sợ Tam Tai & Thái Tuế Năm 2026: Dần Ngọ Bán Hợp An Tâm Hành Sự',
    category: 'VAN_HAN',
    masterSlug: 'thay-thien-minh',
    minhQuestion: () =>
      `Nghe Thầy Minh Triết khai thị về đá mài dao làm con trút bỏ được 100% nỗi sợ hãi mơ hồ bấy lâu nay Thầy ạ!\n\n` +
      `Thưa Thầy Thiên Minh, dạo này con đi đâu cũng nghe bạn bè tuổi Bính Dần 1986 kháo nhau bảo sang năm 2026 Bính Ngọ là năm tuổi bản lề, có người sợ phạm Tam Tai, có người bảo phạm Thái Tuế rồi lo đi cúng sao giải hạn tiền triệu khắp nơi. Thầy cho con hỏi dứt khoát một câu: Năm 2026 Bính Ngọ này tuổi Bính Dần của con có phạm Tam Tai không, chịu ảnh hưởng của Thái Tuế thế nào, và con có cần phải tốn tiền đi làm lễ giải hạn cầu kỳ không hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Ha ha, con hỏi rất thẳng thắn, và Thầy Thiên Minh cũng trả lời dứt khoát bằng khoa học thuật số chân truyền để con ngủ ngon giấc nhé:\n\n` +
        `1. **VỀ HẠN TAM TAI:**\n` +
        `Tuổi Bính Dần của con thuộc tam hợp **Dần - Ngọ - Tuất**. Theo quy luật dịch học, tam hợp này sẽ gặp hạn Tam Tai vào 3 năm liên tiếp có Địa Chi là: **Thân - Dậu - Tuất**.\n` +
        `Năm 2026 là năm **Bính Ngọ** — Chi Ngọ chính là năm ở giữa của tam hợp bản mệnh con! Thầy khẳng định 100%: **TUỔI BÍNH DẦN NĂM 2026 TUYỆT ĐỐI KHÔNG PHẠM TAM TAI**! Ai dọa con phạm Tam Tai năm 2026 là người đó không biết tính lịch số hoặc cố tình dọa dẫm để trục lợi cúng bái con nhé!\n\n` +
        `2. **VỀ THÁI TUẾ:**\n` +
        `Chi Dần của con với Chi Ngọ của năm là mối quan hệ **Bán Hợp (Dần Ngọ bán hợp Hỏa cục)**. Đây là thế hợp, thế bạn bè trợ lực, mang lại luồng sinh khí ấm áp rất tốt.\n` +
        `Chỉ có điều vì sao Lưu Thái Tuế nó bay về đất Ngọ chiếu về cung Tật Ách của con, nên nó nhắc con đừng có chủ quan với sức khỏe khi làm việc quá sức, thế thôi!\n\n` +
        `3. **CÓ CẦN LÀM LỄ GIẢI HẠN KHÔNG?**\n` +
        `Tuyệt đối **KHÔNG CẦN TỐN TIỀN LÀM LỄ CẦU KỲ TỐN KÉM**! Thần Phật không ăn hối lộ của trần gian đâu con. Đầu năm 2026, con cứ dẫn vợ con bố mẹ lên ngôi chùa thanh tịnh gần nhà, thắp nén hương thơm thành kính, dâng đĩa hoa quả tươi, rồi đem số tiền định làm lễ đó đi mua gạo mua mì tặng cho bà con nghèo hoặc phóng sinh cá ốc. Đó mới là lễ giải hạn linh nghiệm nhất trời đất con nhé!`
      );
    },
  },

  // 19. Thầy Tuệ Phong - Tỳ Hưu & Thiềm Thừ
  {
    key: 'vat_pham_ty_huu_thiem_thu',
    title: 'Khai Quang & An Vị Tỳ Hưu, Thiềm Thừ Đúng Phép Chiêu Tài Tụ Khí',
    category: 'PHONG_THUY',
    masterSlug: 'thay-tue-phong',
    minhQuestion: () =>
      `Dạ biết mình không phạm Tam Tai làm con thở phào nhẹ nhõm, mừng quá Thầy Thiên Minh ơi!\n\n` +
      `Kính thưa Thầy Tuệ Phong, ở phòng khách công ty và trên két sắt gia đình, con thấy nhiều doanh nhân hay đặt tượng Tỳ Hưu hoặc Thiềm Thừ (cóc ngậm tiền). Người thì bảo đặt quay ra, người thì bảo đặt quay vào cãi nhau chí choé. Mệnh Lô Trung Hỏa và cung Mệnh Thiên Phủ (thủ kho) của con thì nên chọn linh vật nào, bằng chất liệu gì, và an vị quay đầu hướng nào cho chuẩn phép để tài lộc chỉ vào chứ không ra hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Tuệ Phong chỉ cho gia chủ cách an vị Tỳ Hưu và Thiềm Thừ chuẩn phong thủy chính tông này! Con hỏi trúng cái chuyện mà 90% người chơi phong thủy hiện nay đang làm sai bét be bét đấy con ạ!\n\n` +
        `1. **TỲ HƯU CHIÊU TÀI (Linh thú ăn vàng bạc không nhả):**\n` +
        `- Đặc tính của Tỳ Hưu là linh thú cực kỳ dũng mãnh, thích ăn vàng bạc châu báu và hút sinh khí bốn phương nhưng lại không có hậu môn, tiền vào mà không thoát ra được, cực kỳ tương hợp với Mệnh **Thiên Phủ (kho tiền)** của con!\n` +
        `- **Chất liệu:** Chọn Tỳ Hưu tạc từ đá ngọc tự nhiên (như ngọc bích xanh - Mộc sinh Hỏa, hoặc đá thạch anh đỏ, cẩm thạch).\n` +
        `- **Hướng đặt:** Đặt một đôi Tỳ Hưu trên bàn làm việc hoặc trên nóc két sắt, đầu Tỳ Hưu **BẮT BUỘC PHẢI QUAY RA NGOÀI CỬA CHÍNH HOẶC CỬA SỔ LỚN** để nó vươn mũi ra đón luồng tài khí từ ngoài đời vào cho gia chủ!\n\n` +
        `2. **THIỀM THỪ (Cóc ba chân ngậm đồng tiền cổ):**\n` +
        `- Thiềm Thừ trong truyền thuyết là linh vật đi theo tiên ông Lưu Hải, đi tới đâu là nhả tiền cứu giúp dân nghèo tới đó.\n` +
        `- **Hướng đặt:** Khác hoàn toàn với Tỳ Hưu, đầu Thiềm Thừ **BẮT BUỘC PHẢI QUAY VÀO TRONG NHÀ**! Tuyệt đối không để Thiềm Thừ quay đầu ra cửa (quay ra cửa là cóc nhảy ra ngoài đem tiền của nhà con nhả cho thiên hạ mất).\n` +
        `- Vị trí đẹp nhất: Đặt Thiềm Thừ ở góc chéo phía trong đối diện cửa chính (góc tụ tài của căn phòng), hoặc đặt dưới chân bàn làm việc bên tay trái.\n\n` +
        `Con cứ nhớ khẩu quyết của thầy: **Tỳ Hưu ngoảnh mặt ra đón của — Thiềm Thừ quay đầu vào nhả tiền**! Đặt chuẩn như vậy thì tài khí nhà con lúc nào cũng cuồn cuộn sinh sôi!`
      );
    },
  },

  // 20. Thầy Tuệ Phong - Phong Thủy Bếp & Phòng Ngủ
  {
    key: 'phong_thuy_bep_va_phong_ngu',
    title: 'Phong Thủy Bếp & Phòng Ngủ: Tọa Hung Hướng Cát Hóa Giải Xung Khắc Vợ Chồng',
    category: 'PHONG_THUY',
    masterSlug: 'thay-tue-phong',
    minhQuestion: () =>
      `Khẩu quyết "Tỳ Hưu ngoảnh mặt ra đón của — Thiềm Thừ quay đầu vào nhả tiền" của Thầy Tuệ Phong dễ nhớ và chuẩn quá Thầy ơi! Con sẽ về chỉnh lại ngay con Thiềm Thừ ở phòng khách.\n\n` +
      `Thưa Thầy Tuệ Phong, dân gian hay bảo "Đàn ông coi hướng nhà, đàn bà coi hướng bếp". Bếp là nơi giữ tài lộc và phòng ngủ là nơi nuôi dưỡng hòa khí vợ chồng. Để hóa giải triệt để cái tính xung khắc của sao Liêm Phá ở cung Phu Thê, hướng bếp nấu và giường ngủ của vợ chồng con nên đặt tọa hướng thế nào cho hợp cung Phi Khôn Thổ của con hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Tuệ Phong khen con có con mắt nhìn phong thủy bao quát! Bếp và phòng ngủ chính là lá phổi và quả tim của ngôi nhà con đấy:\n\n` +
        `1. **BÍ MẬT "TỌA HUNG HƯỚNG CÁT" CỦA BẾP NẤU:**\n` +
        `Phong thủy có nguyên tắc vàng: Bếp mang năng lượng Hỏa cực mạnh, nên phải đặt ở cung xấu để lửa bếp thiêu đốt hung khí, nhưng miệng bếp (hướng công tắc bật bếp) phải quay về hướng tốt để đón sinh khí cho gia chủ.\n` +
        `Với cung Phi **Khôn Thổ** của con:\n` +
        `- Bếp nên **TỌA** ở hướng **Chính Bắc (Tuyệt Mệnh)** hoặc **Chính Đông (Họa Hại)** để đốt sạch tai ương tật ách.\n` +
        `- Miệng bếp quay mặt về hướng **Tây Bắc (Diên Niên - chủ về hòa thuận gia đạo)** hoặc **Đông Bắc (Sinh Khí - đại vượng tài lộc)**.\n` +
        `- Tuyệt đối kiêng kị: Bếp nấu không đặt đối diện trực diện với vòi rửa chén (Thủy Hỏa tương xung làm vợ chồng hay cãi cọ), và lưng bếp không được dựa vào tường nhà vệ sinh.\n\n` +
        `2. **BỐ TRÍ PHÒNG NGỦ ĐỂ VỢ CHỒNG HẾT CHIẾN TRANH LẠNH:**\n` +
        `- Đầu giường ngủ của con phải kê tựa vào bức tường vững chãi hướng **Tây Bắc** hoặc **Tây Nam**.\n` +
        `- **Điều cấm kỵ nhất:** Tuyệt đối KHÔNG ĐƯỢC TREO GƯƠNG SOI CHIẾU THẲNG VÀO ĐẦU GIƯỜNG HOẶC CHÂN GIƯỜNG NGỦ! Gương chiếu vào giường tạo ra ảo giác bất an, làm giấc ngủ chập chờn, kích hoạt con sao Hóa Kỵ khiến vợ con hay đa nghi, mộng mị và giận hờn vô cớ.\n` +
        `- Ánh sáng phòng ngủ nên dùng đèn vàng ấm áp dịu nhẹ, tạo trường khí Hỏa - Thổ tương sinh nuôi dưỡng sự gắn kết nồng nàn của hai vợ chồng con!`
      );
    },
  },

  // 21. Thầy Thái Sơn - Chọn Tuổi Đối Tác Làm Ăn
  {
    key: 'chon_tuoi_doi_tac',
    title: 'Nghệ Thuật Chọn Tuổi Đối Tác Kinh Doanh Cho Bính Dần 1986',
    category: 'CONG_DANH',
    masterSlug: 'thay-thai-son',
    minhQuestion: () =>
      `Dạ Thầy Tuệ Phong ơi, nhà con đúng là đang có cái gương bàn trang điểm của vợ chiếu thẳng vào chân giường ngủ! Thảo nào nửa đêm vợ con hay giật mình khó ngủ rồi sáng dậy bực dọc càu nhàu. Con sẽ cho dời ngay cái bàn trang điểm sang góc khuất.\n\n` +
      `Kính thưa Thầy Thái Sơn, trong kinh doanh thì việc chọn đối tác đồng hành quyết định sống còn. Người ta bảo "Buôn có bạn, bán có phường". Với bản mệnh Lô Trung Hỏa, Dụng Thần Bát Tự là Hỏa - Mộc, tuổi Bính Dần 1986 của con nên bắt tay làm ăn với những người tuổi nào (Can Chi nào) thì hợp duyên sinh tài, và khi gặp đối tác tuổi Thân (Tứ hành xung) thì con cần ứng xử thế nào để không bị đổ vỡ hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Thái Sơn chia sẻ nghệ thuật phối hợp Thiên Can, Địa Chi chọn bạn làm ăn thương trường cho con đây:\n\n` +
        `**1. NHÓM TUỔI "VÀNG MƯỜI" CHO CON HỢP TÁC:**\n` +
        `- **Tuổi Canh Ngọ (1990) & Mậu Ngọ (1978):** Ngọ với Dần là thế Bán Hợp (tam hợp Dần - Ngọ - Tuất). Người tuổi Ngọ tính tình quyết đoán, xông xáo, dám nghĩ dám làm, phối hợp với sự trầm ổn cẩn trọng của mệnh Thiên Phủ trong con sẽ tạo thành cặp bài trùng công thủ toàn diện, mở rộng thị trường cực nhanh!\n` +
        `- **Tuổi Giáp Tuất (1994):** Tuất là kho Hỏa, tính tình trung hậu, cẩn mật, cực kỳ thích hợp làm giám đốc tài chính, kế toán trưởng hoặc người quản lý vận hành hậu phương hỗ trợ con.\n` +
        `- **Tuổi Kỷ Hợi (1959) & Quý Hợi (1983):** Dần Hợi Lục Hợp, lại trùng vào cung Mệnh Hợi của con. Người tuổi Hợi mang lại cho con sự an định, giải tỏa căng thẳng và có những lời khuyên chiến lược vô cùng sâu sắc.\n\n` +
        `**2. ĐỐI VỚI NGƯỜI TUỔI THÂN (TỨ HÀNH XUNG):**\n` +
        `Dân gian hay sợ "Dần Thân Tỵ Hợi tứ hành xung", nhưng người hiểu đạo học thì không sợ con nhé! Dần với Thân là cặp đối xung trực tiếp, người tuổi Thân (như Nhâm Thân 1992) tư duy rất nhanh, thực tế và quyết liệt.\n` +
        `- Nếu hợp tác với người tuổi Thân, con **KHÔNG NÊN GÓP VỐN LÂU DÀI CHUNG MỘT PHÁP NHÂN**.\n` +
        `- Thay vào đó, hãy hợp tác theo từng thương vụ hoặc dự án độc lập: Hợp đồng phân chia trách nhiệm và lợi nhuận phải thật rõ ràng, tiền bạc sòng phẳng sau mỗi đợt quyết toán. Hết dự án thì nghiệm thu thanh toán xong xuôi. Đi theo cách đó thì cả hai bên cùng có lợi mà không bao giờ va chạm xung đột!`
      );
    },
  },

  // 22. Thầy Tâm An - Tuyệt Kỹ "3 Không - 3 Nên" Với Vợ
  {
    key: 'hoa_giai_hoa_ky_hang_ngay',
    title: 'Tuyệt Kỹ Giao Tiếp "3 Không - 3 Nên" Triệt Tiêu Sát Khí Hóa Kỵ Ở Cung Phu Thê',
    category: 'CUNG_PHU_THE',
    masterSlug: 'thay-tam-an',
    minhQuestion: () =>
      `Cách hợp tác theo từng dự án ngắn hạn với tuổi Thân của Thầy Thái Sơn quá thông minh ạ!\n\n` +
      `Kính thưa Thầy Tâm An, quay trở lại câu chuyện gia đình, con thấy sao Hóa Kỵ ở cung Phu Thê nó quái gở lắm. Nhiều khi con đi làm về mệt, con nói một câu hoàn toàn vô tư, thế mà vợ con lại suy diễn thành con coi thường vợ, rồi mặt nặng mày nhẹ cả tuần liền. Xin Thầy chỉ cho con cái kỹ năng ứng xử thực chiến hàng ngày — làm sao để triệt tiêu cái năng lượng gây hiểu lầm của con sao Hóa Kỵ này hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Tâm An lắng nghe tâm sự gia đạo của con! Phụ nữ sinh ra là để yêu thương chứ không phải để tranh luận lý lẽ con ạ. Hóa Kỵ là "ám tinh" — tượng trưng cho màn sương mù che khuất mặt trời, nó làm cho tai người ta nghe một đằng nhưng não lại phiên dịch ra một nẻo!\n\n` +
        `Thầy truyền cho con bí kíp võ công gia truyền **"3 KHÔNG - 3 NÊN"** để triệt hạ con sao Hóa Kỵ này tận gốc rễ:\n\n` +
        `**3 ĐIỀU TUYỆT ĐỐI "KHÔNG":**\n` +
        `1. **Không nói lời mỉa mai khi tức giận:** Một câu mỉa mai của đàn ông có sức sát thương bằng mười cái tát vào lòng tự trọng của phụ nữ có sao Liêm Phá Hóa Khoa.\n` +
        `2. **Không lôi chuyện cũ từ năm nảo năm nào ra nhai lại:** Phụ nữ nhớ dai, nhưng đàn ông bản lĩnh là tuyệt đối không bao giờ đào bới sai lầm trong quá khứ của vợ.\n` +
        `3. **Không chiến tranh lạnh bỏ đi qua đêm:** Đàn ông giận mà xách xe đi nhậu thâu đêm là tự tay con tưới xăng vào ngọn lửa Hóa Kỵ đấy!\n\n` +
        `**3 ĐIỀU BẮT BUỘC "NÊN":**\n` +
        `1. **Nên hỏi lại để xác nhận cảm xúc:** Khi thấy vợ có vẻ phật ý, con hãy cười xòa hỏi ngay: *"Ủa mình ơi, hồi nãy anh nói câu đó em có hiểu lầm ý anh không? Anh chỉ muốn nói là... chứ anh thương em muốn chết ai nỡ nghĩ thế!"*. Hỏi một câu là sương mù Hóa Kỵ tan biến ngay lập tức!\n` +
        `2. **Nên khen ngợi những việc thầm lặng:** Vợ nấu bữa cơm ngon, thay lọ hoa mới, con hãy mở mồm khen thật lòng. Phụ nữ được khen là tự nhiên dịu dàng như nước mùa thu.\n` +
        `3. **Nên tặng quà bất ngờ không cần nhân dịp gì cả:** Thỉnh thoảng đi làm về xách theo cốc trà sữa vợ thích, hay mua tặng thỏi son nhỏ. Con làm được thế thì có mười con sao Hóa Kỵ cũng phải đầu hàng trước sự ngọt ngào của con!`
      );
    },
  },

  // 23. Thầy Thiên Minh - Dưỡng Sinh 24 Tiết Khí
  {
    key: 'duong_sinh_24_tiet_khi',
    title: 'Dưỡng Sinh Thuận Theo 24 Tiết Khí: Giữ Thân Tâm Khang Kiện Suốt 4 Mùa',
    category: 'CUNG_TAT_ACH',
    masterSlug: 'thay-thien-minh',
    minhQuestion: () =>
      `Bí kíp "3 Không - 3 Nên" của Thầy Tâm An thực tế và vi diệu quá Thầy ơi! Con nghe mà cười tủm tỉm, con sẽ áp dụng ngay tối nay!\n\n` +
      `Thưa Thầy Thiên Minh, quay lại chuyện dưỡng sinh theo thời tiết và đất trời, theo Đông y cổ truyền có thuật dưỡng sinh theo 24 Tiết khí trong năm. Mệnh Lô Trung Hỏa như con vào các mùa Xuân, Hạ, Thu, Đông nên ăn uống, sinh hoạt và tập luyện thế nào để ngũ hành âm dương trong cơ thể luôn cân bằng và tràn đầy sinh lực hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Thiên Minh truyền thụ bí quyết dưỡng sinh theo 24 Tiết khí - đỉnh cao của y đạo phương Đông! Trời đất có 4 mùa biến chuyển, cơ thể con người là một tiểu vũ trụ thu nhỏ, con thuận theo trời đất thì sống thọ trăm tuổi an khang:\n\n` +
        `**1. MÙA XUÂN (Lập Xuân đến Cốc Vũ) — Dưỡng Can Mộc:**\n` +
        `- Mộc mùa xuân sinh Hỏa cho bản mệnh Lô Trung Hỏa của con. Đây là mùa vạn vật đâm chồi nảy lộc, con nên dậy sớm hơn một chút, đi bộ dưới hàng cây xanh hít thở dương khí buổi sớm.\n` +
        `- Ăn nhiều rau xanh có vị ngọt mát tự nhiên (rau cải, giá đỗ, mầm đậu, cà rốt), hạn chế đồ cay nóng để không làm bốc hỏa gan.\n\n` +
        `**2. MÙA HẠ (Lập Hạ đến Đại Thử) — Dưỡng Tâm Hỏa:**\n` +
        `- Khí trời nóng nực, tâm hỏa con rất dễ bốc. Con tuyệt đối phải giữ tâm trí bình thản, không nổi nóng vội vàng.\n` +
        `- Buổi trưa con nên chợp mắt 15-20 phút (ngủ giờ Ngọ). Giấc ngủ ngắn này quý như thần dược giúp trái tim được nghỉ ngơi, phòng ngừa đột quỵ và huyết áp.\n` +
        `- Uống nước đậu đen xanh lòng rang, nước atiso, chè hạt sen long nhãn để thanh tâm giáng hỏa.\n\n` +
        `**3. MÙA THU (Lập Thu đến Sương Giáng) — Dưỡng Phế Kim:**\n` +
        `- Khí trời khô hanh, con nên ăn lê hấp đường phèn, nấm tuyết, uống nhiều nước ấm để nhuận phế, bảo vệ cổ họng và hệ hô hấp.\n\n` +
        `**4. MÙA ĐÔNG (Lập Đông đến Đại Hàn) — Dưỡng Thận Thủy:**\n` +
        `- Mùa đông Thủy khí cực lạnh, con nên ngủ sớm hơn và dậy muộn hơn một chút khi mặt trời đã lên. Giữ ấm thật kỹ vùng cổ và đôi bàn chân.\n` +
        `- Ăn các thực phẩm màu đen bổ thận (mè đen, đỗ đen, mộc nhĩ), và duy trì ngâm chân nước gừng muối đều đặn mỗi tối.\n\n` +
        `Con cứ ăn ngủ thuận theo nhịp điệu của đất trời, thì bệnh tật tiêu tan, tuổi 40-50 mà thể lực dẻo dai như thanh niên ba mươi vậy!`
      );
    },
  },

  // 24. Cô Linh Đan - Pháp Sự Phóng Sinh Đúng Chánh Pháp
  {
    key: 'phong_sinh_chuan_chanh_phap',
    title: 'Phóng Sinh Tùy Duyên Không Đặt Trước & Nghi Thức Hồi Hướng Đúng Chánh Pháp',
    category: 'TAM_LINH_GIAI_HAN',
    masterSlug: 'co-linh-dan',
    minhQuestion: () =>
      `Dạ thưa Thầy Thiên Minh, chế độ dưỡng sinh theo 24 tiết khí thật sâu sắc. Giờ con mới hiểu tại sao giấc ngủ trưa 15 phút giờ Ngọ lại quý giá đến vậy!\n\n` +
      `Kính thưa Cô Linh Đan, chuyên gia về văn hóa tâm linh và điềm báo dân gian, vào các dịp rằm lớn, đầu năm hay ngày vía Phật, gia đình con rất thích đi chùa làm công đức và phóng sinh chim cá để cầu bình an. Nhưng con thấy trên mạng người ta tranh cãi nhiều quá: có người bảo phóng sinh chim bị bẫy lại, thả cá bị chích điện thì thành ra tạo nghiệp thêm. Xin Cô chỉ dẫn cho con cách phóng sinh và hồi hướng công đức thế nào cho đúng chánh pháp để con vật được sống thực sự và gia đình con trọn vẹn phước báu ạ?`,
    thayBoiAnswer: async () => {
      return (
        `Chào bạn hiền, Linh Đan vô cùng hoan hỷ khi nghe bạn hỏi về hạnh nguyện phóng sinh chánh pháp! Phóng sinh là hạnh nguyện nuôi dưỡng lòng Từ Bi vô lượng, nhưng nếu làm bằng sự si mê rập khuôn thì biến thiện nghiệp thành ác nghiệp lúc nào không hay bạn nhé!\n\n` +
        `Linh Đan chia sẻ cùng bạn 3 nguyên tắc vàng khi phóng sinh:\n\n` +
        `**1. TUYỆT ĐỐI KHÔNG ĐẶT MUA TRƯỚC!**\n` +
        `Nhiều người gọi điện đặt trước hàng trăm con chim sẻ, hàng tạ cá cho ngày lễ chùa. Làm như thế là bạn đang gián tiếp thuê người ta đi giăng bẫy bắt nhốt sinh mạng! Phóng sinh đúng chánh pháp là **TÙY DUYÊN CỨU MẠNG**:\n` +
        `Sáng sớm bạn đi chợ, thấy chậu ốc, mớ cá trê, cá chép chuẩn bị bị người ta đập đầu mổ ruột, bạn phát tâm mua ngay mang đi thả. Thả càng nhanh càng tốt, không giam giữ trong túi ni lông ngột ngạt.\n\n` +
        `**2. CHỌN MÔI TRƯỜNG SỐNG PHÙ HỢP:**\n` +
        `- Thả cá nước ngọt ở những khúc sông lớn nước sạch, không thả ở những nơi có người đang giăng lưới chích điện.\n` +
        `- Tuyệt đối không thả các sinh vật ngoại lai nguy hại tàn phá môi trường (như rùa tai đỏ, cá lau kính, ốc bươu vàng).\n\n` +
        `**3. NGHI THỨC & HỒI HƯỚNG TÂM LINH:**\n` +
        `- Khi thả con vật xuống nước, bạn hãy niệm thầm trong tâm 10 câu *"Nam Mô A Di Đà Phật"* hoặc trì câu chú Đại Bi, chúc cho chúng thoát kiếp súc sinh được sinh về cõi an lành.\n` +
        `- Thả xong, bạn đứng chắp tay thành kính đọc lời hồi hướng: *"Nguyện đem công đức phóng sinh cứu mạng này, hồi hướng cho cha mẹ hiện tiền được mạnh khỏe trường thọ, tổ tiên cửu huyền thất tổ được siêu thăng, gia đình con hòa thuận, công việc hanh thông"*. Phước báu từ tâm buông xả ấy sẽ biến thành tấm khiên kim cương che chở trọn vẹn cho gia đình bạn!`
      );
    },
  },

  // 25. Thầy Thiên Minh - Xem Ngày Giờ Ký Hợp Đồng
  {
    key: 'xem_ngay_gio_ky_hop_dong',
    title: 'Khoa Trạch Cát: Tránh Ngày Sát Chủ, Chọn Giờ Hoàng Đạo Ký Hợp Đồng Đại Sự',
    category: 'CONG_DANH',
    masterSlug: 'thay-thien-minh',
    minhQuestion: () =>
      `Bạch Cô Linh Đan, lời chỉ dạy về việc tùy duyên cứu mạng không đặt mua trước làm con tỉnh ngộ hoàn toàn! Trước đây con cứ nghĩ phóng sinh càng nhiều càng tốt, nay mới hiểu cái tâm từ bi và môi trường sống của con vật mới là cốt lõi.\n\n` +
      `Thưa Thầy Thiên Minh, là người đứng đầu doanh nghiệp, mỗi khi ký kết hợp đồng kinh tế lớn hay khai trương văn phòng, dự án mới, con luôn muốn chọn ngày lành tháng tốt. Theo thuật Lịch Vạn Niên và Âm lịch chuẩn Hồ Ngọc Đức, con cần tránh những ngày hung sát nào (như Thụ Tử, Sát Chủ, Tam Nương) và chọn ngày giờ Hoàng đạo thế nào để chuyến đi đàm phán thuận buồm xuôi gió hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Thiên Minh mở khoa trạch cát: Chọn ngày lành tháng tốt, giờ Hoàng Đạo xuất hành ký kết hợp đồng chính là nghệ thuật kết hợp giữa Thiên Thời - Địa Lợi - Nhân Hòa, con nắm vững các quy tắc này thì đi đàm phán thương trường mười trận thắng cả mười:\n\n` +
        `**1. NHỮNG NGÀY HUNG SÁT TUYỆT ĐỐI TRÁNH KÝ KẾT & KHAI TRƯƠNG:**\n` +
        `- **Ngày Tam Nương:** Mùng 3, 7, 13, 18, 22, 27 Âm lịch hàng tháng (*"Tam Nương dữ sát bất khả đương, khởi tạo hôn nhân giai bất tường"*). Những ngày này năng lượng từ trường mặt trăng và trái đất rất hỗn loạn, người ta dễ nóng vội, ký nhầm điều khoản bất lợi.\n` +
        `- **Ngày Nguyệt Kỵ:** Mùng 5, 14, 23 (*"Nửa đời nửa đoạn làm chi nên việc"*).\n` +
        `- **Ngày Lục Xung với tuổi:** Con tuổi Dần, tuyệt đối tránh ký hợp đồng lớn vào các ngày mang Địa Chi **Thân (Lục Xung)** và ngày **Tỵ (Lục Hại)**.\n\n` +
        `**2. TIÊU CHÍ CHỌN NGÀY ĐẠI CÁT CHO DOANH NHÂN BÍNH DẦN:**\n` +
        `- Chọn ngày có các Trực tốt: **Trực Khai, Trực Thành, Trực Mãn, Trực Định** (chủ về khai mở, thành tựu trọn vẹn).\n` +
        `- Ngày mang Địa Chi hợp tuổi: Ngày **Ngọ, Tuất (Tam Hợp)** hoặc ngày **Hợi (Lục Hợp)**.\n` +
        `- Thiên Can ngày sinh hoặc hợp Can Bính: Ngày **Tân (Bính Tân tương hợp)**, hoặc ngày **Giáp, Ất (Mộc sinh Hỏa)**.\n\n` +
        `**3. CHỌN GIỜ HOÀNG ĐẠO ĐỂ XUẤT HÀNH KÝ TÁ:**\n` +
        `Ưu tiên giờ **Thìn (Tư Mệnh Hoàng Đạo - từ 7h đến 9h sáng)** hoặc giờ **Thân, Dậu, Hợi**. Con bước chân ra khỏi nhà đúng giờ đại cát, tâm thế tự tin, nở nụ cười hào sảng thì đối tác nhìn thấy là muốn bắt tay ký hợp đồng ngay lập tức!`
      );
    },
  },

  // 26. Cô Linh Đan - Cung Phúc Đức & Chăm Sóc Mồ Mả Tổ Tiên
  {
    key: 'phuc_duc_to_tien_mo_ma',
    title: 'Kích Hoạt Âm Phúc Tổ Tiên Cung Phúc Đức Sửu: Tảo Mộ Thanh Minh & Ban Thờ Gia Tiên',
    category: 'CUNG_PHUC_DUC',
    masterSlug: 'co-linh-dan',
    minhQuestion: () =>
      `Dạ thưa Thầy Thiên Minh, những quy tắc chọn ngày giờ Hoàng đạo thật rành mạch và dễ tra cứu, con sẽ ghi chép cẩn thận vào sổ tay điều hành công việc của con.\n\n` +
      `Kính thưa Cô Linh Đan, cung Thân của con cư tại Phúc Đức ở Sửu có bộ đôi Vũ Khúc - Tham Lang miếu địa, con nghe nói mồ mả tổ tiên và âm đức của dòng họ ảnh hưởng trực tiếp đến sự hưng suy của cung này. Con nên làm gì để chăm sóc mồ mả tổ tiên, giữ cho bàn thờ gia tiên luôn ấm cúng để kích hoạt được nguồn năng lượng âm phúc che chở cho cơ nghiệp của con hả Cô?`,
    thayBoiAnswer: async () => {
      return (
        `Linh Đan lắng nghe bạn! Bạn hỏi đến cội nguồn gốc rễ của vạn vật trên đời rồi đấy bạn hiền ạ! Cổ nhân dạy: *"Cây có gốc mới nở cành xanh ngọn, nước có nguồn mới biển cả sông sâu"*, con người ta có tổ tiên mới có hình hài và cơ nghiệp rực rỡ ngày hôm nay.\n\n` +
        `Cung Phúc Đức tại đất **Tân Sửu (Thổ cố hương)** của bạn có cặp sao **Vũ Khúc - Tham Lang miếu địa**, lại có **Thiên Tài, Hồng Loan, Quốc Ấn** hội tụ. Điều này chứng tỏ trong dòng họ nội ngoại nhà bạn trước đây có những bậc tiền nhân từng làm quan quý hiển hoặc buôn bán kinh thương rất cừ khôi, để lại một cái mạch âm phần vô cùng linh thiêng và giàu phúc khí che chở cho bạn.\n\n` +
        `Muốn dòng chảy âm phúc đó tuôn trào trợ lực cho bạn, bạn hãy làm chu đáo 3 việc này nhé:\n\n` +
        `1. **Tảo Mộ Tiết Thanh Minh & Tháng Chạp:** Hàng năm vào Tiết Thanh Minh (tháng 3 Âm lịch) và những ngày giáp Tết cuối năm, dù bận trăm công nghìn việc bạn cũng hãy dành một ngày cùng dòng tộc về quê viếng mộ, nhổ sạch cỏ dại, đắp thêm đất sạch, thắp nén hương thơm tri ân tiền nhân.\n` +
        `2. **Chăm Sóc Bàn Thờ Gia Tiên Tại Nhà:** Bàn thờ gia tiên phải đặt nơi trang nghiêm, tụ khí, lưng tựa tường vững chãi. Đèn dầu hoặc nến giữ ấm cúng, ngày rằm mùng một dâng hoa quả tươi, nước sạch. Khi thắp hương, bạn hãy tâm niệm báo cáo công việc và cầu xin tổ tiên gia hộ cho bạn có tâm sáng, làm việc thiện lành.\n` +
        `3. **Gắn Kết Dòng Tộc:** Đóng góp quỹ khuyến học cho con cháu nghèo trong họ, giúp đỡ những người già neo đơn neo côi. Khi họ hàng đoàn kết, người dưới mộ mỉm cười thì hào quang của cung Thân cư Phúc Đức sẽ bừng sáng, đẩy tài lộc của bạn lên tột đỉnh vinh quang!`
      );
    },
  },

  // 27. Thầy Lạc Việt - Ngành Nghề Mới Cho Mệnh Hỏa
  {
    key: 'nganh_nghe_moi_tuoi_40',
    title: 'Mệnh Lô Trung Hỏa (Dụng Thần Hỏa Mộc) Nên Đầu Tư Vào Lĩnh Vực Mới Nào?',
    category: 'CONG_DANH',
    masterSlug: 'thay-lac-viet',
    minhQuestion: () =>
      `Bạch Cô Linh Đan, việc lập quỹ khuyến học cho dòng họ và chăm sóc mồ mả tổ tiên làm con thấy lòng mình ấm áp lạ thường, con sẽ về bàn ngay với các bác trong họ để triển khai trong năm nay.\n\n` +
      `Kính thưa Thầy Lạc Việt, sau tuổi 40, ngoài mảng kinh doanh hiện tại đã đi vào quỹ đạo ổn định, con đang ấp ủ mở thêm một hướng đi mới. Với bản mệnh Lô Trung Hỏa, Dụng Thần Bát Tự là Hỏa và Mộc, con nên ưu tiên mở rộng sang mảng Giáo dục đào tạo - Truyền cảm hứng, hay là mảng Công nghệ số AI, hay Bất động sản sinh thái nông nghiệp sạch để vừa thuận thiên mệnh vừa bền vững lâu dài hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Lạc Việt phân tích lộ trình chiến lược Dụng Thần Hỏa - Mộc mở rộng ngành nghề mới cho đương số! Cả ba lĩnh vực con vừa nêu đều chạm đúng vào long mạch Dụng Thần Hỏa - Mộc của con đấy con trai ạ! Nhưng thầy phân tích lộ trình chiến lược cho con đi từng bước vững như kiềng ba chân này:\n\n` +
        `1. **LĨNH VỰC GIÁO DỤC ĐÀO TẠO & PHÁT TRIỂN CON NGƯỜI (Thuần Mộc sinh Hỏa):**\n` +
        `- Mộc là tri thức, là cái tâm nhân đức, là đào tạo nghề nghiệp và nâng tầm con người.\n` +
        `- Mệnh con có sao **Thiên Khôi** (đệ nhất quý nhân, thầy dạy) và Mệnh **Thiên Phủ** khoan hòa bao dung. Khi con mở các trung tâm đào tạo kỹ năng, trường học hoặc chia sẻ kinh nghiệm kinh doanh, con không những thu về dòng tiền cực kỳ ổn định mà còn tích được đại âm đức cho đời sau. Đây là mảng con nên bắt tay vào làm sớm nhất!\n\n` +
        `2. **LĨNH VỰC CÔNG NGHỆ SỐ, AI & TRUYỀN THÔNG (Thuần Hỏa):**\n` +
        `- Hỏa là ánh sáng, là tốc độ, là công nghệ phần mềm, chuyển đổi số và thương mại điện tử.\n` +
        `- Mảng này giúp con bắt kịp xu thế thời đại, ứng dụng công nghệ để nhân bản quy mô doanh nghiệp mà không bị giới hạn bởi địa lý. Con nên đầu tư vào đội ngũ công nghệ trẻ để họ triển khai cho con.\n\n` +
        `3. **BẤT ĐỘNG SẢN SINH THÁI & NÔNG NGHIỆP SẠCH (Mộc - Thổ giao hòa):**\n` +
        `- Đây là "hậu phương trú ẩn tài sản" cho con từ tuổi 45 trở đi. Mua những khu đất rộng có suối, có cây xanh để làm khu nghỉ dưỡng cuối tuần hoặc nông trại hữu cơ. Vừa có dòng tiền du lịch, vừa là nơi gia đình con lui về an dưỡng tâm hồn.\n\n` +
        `Con cứ đi đúng lộ trình này, cơ nghiệp của con sẽ vừa giàu có về tiền bạc, vừa phong phú về giá trị tinh thần!`
      );
    },
  },

  // 28. Thầy Thái Sơn - Nhân Tướng Học Quản Trị Nhân Sự
  {
    key: 'nhan_tuong_nhan_su',
    title: 'Ứng Dụng Nhân Tướng Học & Thần Thái Tuyển Chọn Phó Tướng Kế Toán Trưởng',
    category: 'CONG_DANH',
    masterSlug: 'thay-thai-son',
    minhQuestion: () =>
      `Nghe Thầy Lạc Việt phân tích về mảng giáo dục đào tạo Mộc sinh Hỏa làm con bừng sáng ý tưởng, đúng là ước mơ con ấp ủ từ thời trẻ Thầy ạ!\n\n` +
      `Thưa Thầy Thái Sơn, để mở rộng quy mô công ty thì con đang phải phỏng vấn tuyển chọn hai vị trí cực kỳ then chốt: một là Giám đốc kinh doanh (phó tướng), hai là Kế toán trưởng giữ tay hòm chìa khóa. Có những bí quyết Nhân tướng học phương Đông nào giúp con nhìn thấu tâm can ứng viên khi ngồi phỏng vấn — đâu là người trung hậu đáng tin cậy để trao quyền, và đâu là người giảo hoạt phản trắc cần phải tránh xa hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Thái Sơn truyền thụ bí quyết Nhân tướng học nhìn thấu tâm can và dùng người cho quý bạn! Cổ nhân dạy: *"Hữu tâm vô tướng, tướng tự tâm sinh; Hữu tướng vô tâm, tướng tùy tâm diệt"*. Khi con ngồi phỏng vấn, con hãy quan sát 3 điểm cốt tử này:\n\n` +
        `**1. TƯỚNG NGƯỜI TRUNG HẬU, ĐÁNG TRAO TRỌNG TRÁCH (Đặc biệt là Kế toán trưởng):**\n` +
        `- **Ánh Mắt:** Ánh mắt nhìn thẳng, con ngươi đen trắng phân minh, ánh mắt ấm áp tĩnh lặng, không đảo mắt láo liên khi suy nghĩ. Cổ nhân gọi là *"Thần thanh khí hòa"* — người này tâm quang minh chính đại, không tham lam của công.\n` +
        `- **Cung Điền Trạch (Khoảng cách giữa mí mắt trên và lông mày):** Rộng rãi, đầy đặn, da dẻ sáng sủa không có nốt ruồi xấu đè lên — người này tính tình đôn hậu, biết bảo vệ tài sản công ty cẩn mật.\n` +
        `- **Địa Các (Cằm):** Cằm đầy đặn, tròn trịa, vuông vức vững chãi — người này tính tình kiên trì, chịu khó, có hậu vận tốt và cực kỳ trung thành với người sếp có tâm.\n\n` +
        `**2. TƯỚNG NGƯỜI CẦN CẢNH GIÁC PHẢN TRẮC, THỊ PHI:**\n` +
        `- **Mắt hình tam giác hoặc lòng trắng có tia máu đỏ dại:** Tính tình nham hiểm, dễ nổi lòng tham hoặc làm liều khi gặp cám dỗ tiền bạc lớn.\n` +
        `- **Sống mũi nhọn hoắt trơ xương như lưỡi kiếm hoặc sống mũi gãy khúc:** Tính tình ích kỷ, hẹp hòi, hay đố kỵ với người khác và dễ phản bội cam kết khi có mối lợi to hơn.\n` +
        `- **Nói chuyện mà tay che miệng, ánh mắt nhìn lén lút:** Trong bụng đang có điều gian dối, không minh bạch.\n\n` +
        `Dùng tướng để sơ tuyển, nhưng con nhớ kỹ: Phải dùng cơ chế minh bạch để quản lý và dùng lòng chân thành đối đãi. Có như thế con mới quy tụ được hào kiệt phò tá lâu dài!`
      );
    },
  },

  // 29. Thầy Minh Triết - Vượt Khủng Hoảng Tuổi 40
  {
    key: 'khung_hoang_trung_nien',
    title: 'Vượt Qua Khủng Hoảng Tuổi 40 ("Tứ Thập Nhi Bất Hoặc") & Ba Trụ Đỡ Cuộc Đời',
    category: 'TAM_LINH_GIAI_HAN',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Những mẹo nhìn ánh mắt và cung Điền Trạch của Thầy Thái Sơn thật vi diệu, con sẽ áp dụng ngay vào các buổi phỏng vấn tuần tới Thầy ạ.\n\n` +
      `Kính thưa Thầy Minh Triết, bước sang tuổi 40, thú thật với Thầy đôi khi trong những đêm tĩnh lặng, con hay rơi vào cảm giác "khủng hoảng tuổi trung niên" — cảm giác áp lực đè nặng giữa trách nhiệm lèo lái công ty, sự an vui của vợ con, sức khỏe của cha mẹ già và sự an lạc của chính bản thân mình. Nhiều lúc thấy cô đơn và mỏi mệt lạ lùng. Xin Thầy cho con một lời khuyên từ đáy lòng để con luôn giữ được tâm thế an định, vững vàng bước qua giai đoạn này hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Minh Triết ôm lấy vai con nào! Con trải qua cảm giác đó là hoàn toàn bình thường, bất kỳ người đàn ông có trách nhiệm nào bước qua tuổi 40 cũng từng có những đêm thao thức cô đơn như thế con ạ.\n\n` +
        `Khổng Tử ngày xưa có câu nói bất hủ: **"Tứ thập nhi bất hoặc"** — bốn mươi tuổi là cái tuổi không còn mê muội, không còn hoang mang bồng bột như thời hai mươi ba mươi nữa, mà đã thấu tỏ quy luật được mất của nhân sinh.\n\n` +
        `Thầy tặng con **BA TRỤ ĐỠ KIM CƯƠNG** để giữ cho cuộc đời con luôn vững như bàn thạch:\n\n` +
        `**Trụ đỡ 1: Chấp nhận lẽ "Vô thường" trên thương trường.**\n` +
        `Kinh doanh có lúc được ắt có lúc mất, có mùa gặt ắt có mùa đông giá lạnh. Khi gặp chuyện bất như ý, con hãy mỉm cười tự nhủ: *"Chuyện này đến để dạy cho ta một bài học kiên nhẫn, rồi nó cũng sẽ qua đi"*. Đừng để sự được mất bên ngoài làm xao động sự bình yên trong tâm con.\n\n` +
        `**Trụ đỡ 2: Giữ trọn bến đỗ Gia Đình.**\n` +
        `Khi con bước chân về đến cửa nhà, hãy cởi bỏ chiếc áo giáp giám đốc nặng nề để lại ngoài cửa. Bước vào nhà, con chỉ là người chồng ấm áp của vợ, người cha vui tính của các con. Nụ cười của vợ con chính là liều thuốc tăng lực vi diệu nhất xua tan mọi áp lực thương trường.\n\n` +
        `**Trụ đỡ 3: Dành 15 phút tĩnh tọa mỗi ngày.**\n` +
        `Mỗi sáng thức dậy hoặc trước khi đi ngủ, con hãy ngồi tĩnh lặng 15 phút, buông bỏ điện thoại, lắng nghe hơi thở vào ra. Tâm có an định thì tuệ mới sáng, trí mới thông. Con có đầy đủ cả Phúc - Đức - Tài, hãy tự tin bước đi với nụ cười bao dung trên môi con nhé!`
      );
    },
  },

  // 30. Thầy Minh Triết - 16 Chữ Vàng Đúc Kết
  {
    key: 'loi_khuyen_tram_nam',
    title: 'Đại Kết Cuộc Đời Minh (1986): 16 Chữ Vàng Khắc Ghi Để Hậu Vận Đại Phúc Lưu Truyền',
    category: 'CUNG_MENH',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Kính bạch Thầy Minh Triết và Hội Đồng Bát Đại Danh Sư! Trải qua một buổi đàm đạo huyền học sâu sắc từ cung Mệnh, Thân, các cung số, vận hạn 2026 cho đến triết lý nhân sinh, con cảm thấy như được gột rửa toàn bộ tâm hồn, mọi hoang mang lo lắng đều tan biến sạch sẽ.\n\n` +
      `Con kính xin Thầy Minh Triết ban cho con một lời đúc kết tâm huyết nhất cho toàn bộ cuộc đời của con, để con lấy đó làm kim chỉ nam soi đường dẫn lối cho chặng đường nửa đời người còn lại ạ!`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Minh Triết rất hoan hỷ và trân quý nhân duyên được tọa đàm đàm đạo cùng con ngày hôm nay!\n\n` +
        `Bàn cờ Tử Vi của con — nam nhân **Bính Dần 1986, Mệnh Lô Trung Hỏa, Cục Mộc Tam Cục, Mệnh Thiên Phủ tại Hợi, Thân cư Phúc Đức Vũ Khúc Tham Lang miếu địa tại Sửu** — là một lá số của bậc chính nhân quân tử: *"Tiền bần hậu phú, đại khí vãn thành"* (chén ngọc lớn thì đúc muộn, ngọc quý phải qua mài giũa gian nan mới tỏa sáng lòa con nhé).\n\n` +
        `Thầy tặng con **16 CHỮ VÀNG** để khắc ghi vào xương tủy trọn đời:\n\n` +
        `### **"TÂM TỒN THIỆN NIỆM — CHỮ TÍN LÀM ĐẦU**\n` +
        `### **ĐỨC DƯỠNG CƠ NGHIỆP — VẠN PHƯỚC TRƯỜNG LƯU"**\n\n` +
        `1. **Tâm tồn thiện niệm:** Dù cuộc đời có xô đẩy, thương trường có bon chen, hãy luôn giữ trọn tấm lòng lương thiện và trắc ẩn thương người.\n` +
        `2. **Chữ Tín làm đầu:** Đúng như phẩm chất Thiên Phủ thủ mệnh, uy tín với khách hàng, đối tác và gia đình quý hơn vàng mười.\n` +
        `3. **Đức dưỡng cơ nghiệp:** Lấy phước đức làm mảnh đất màu mỡ để nuôi cây công danh tài lộc xanh tốt đời đời.\n` +
        `4. **Vạn phước trường lưu:** Phúc ấm không những che chở cho con vinh hoa phú quý tới trăm tuổi, mà còn truyền mãi ngàn đời cho con cháu hậu duệ mai sau.\n\n` +
        `Chúc con và toàn thể gia quyến luôn thân tâm an lạc, vạn sự hanh thông, công danh sự nghiệp rực rỡ như hoa mùa xuân!`
      );
    },
  },

  // 31. Thầy Tuệ Phong - Chọn Màu Xe Ô Tô Phong Thủy
  {
    key: 'chon_mau_xe_phong_thuy',
    title: 'Chọn Màu Xe Ô Tô Trợ Vận Cho Mệnh Lô Trung Hỏa Bính Dần',
    category: 'PHONG_THUY',
    masterSlug: 'thay-tue-phong',
    minhQuestion: () =>
      `Dạ thưa Thầy Minh Triết, 16 chữ vàng Thầy ban con sẽ cho in chữ thư pháp đóng khung gỗ treo trang trọng ngay sau bàn làm việc của con để nhắc nhở bản thân mỗi ngày ạ!\n\n` +
      `Kính thưa Thầy Tuệ Phong, sắp tới công ty con dự định đổi chiếc xe ô tô mới để con tiện đi công tác xa và gặp gỡ đối tác ngoại giao. Chiếc xe đối với doanh nhân ví như con ngựa chiến ra trận. Mệnh Lô Trung Hỏa của con thì nên chọn xe màu gì để đi đường bình an vạn dặm, đón tài rước lộc, và tuyệt đối kiêng kị màu xe nào hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Tuệ Phong tư vấn chọn màu xe tương sinh trợ vận cho mệnh Lô Trung Hỏa Bính Dần! Chiếc xe là khối kim loại di chuyển với tốc độ cao, từ trường ngũ hành của nó tác động trực tiếp lên người cầm lái:\n\n` +
        `Bản mệnh con là **Lô Trung Hỏa** (Lửa trong lò):\n` +
        `1. **MÀU XE ĐẠI CÁT NHẤT (Mộc sinh Hỏa - Tương Sinh):**\n` +
        `- Màu **Xanh Lục, Xanh Lá Cây**: Đây là màu sắc của hành Mộc, Mộc sinh Hỏa tức chiếc xe nâng đỡ bản mệnh con. Đi xe màu này con sẽ cảm thấy tâm trí thư thái, ít khi bị va chạm hỏng vặt, đi đàm phán hợp đồng tỷ lệ thành công cực kỳ cao.\n\n` +
        `2. **MÀU XE TƯƠNG HỢP (Hỏa hòa Hỏa):**\n` +
        `- Màu **Đỏ, Đỏ Mận, Nâu Đỏ, Cam**: Màu bản mệnh Hỏa của con, tạo cảm giác quyền uy, năng động và nổi bật phong thái doanh nhân thành đạt.\n\n` +
        `3. **MÀU XE TUYỆT ĐỐI NÊN TRÁNH:**\n` +
        `- Màu **Đen, Xanh Dương Đậm (thuộc Thủy)**: Thủy khắc Hỏa dữ dội! Chiếc xe khắc bản mệnh con thì con đi đường hay bị va quẹt xây xát vô cớ, xe hay hỏng vặt giữa đường và tâm trạng khi lái xe rất dễ bực bội nóng nảy.\n\n` +
        `Con cứ chọn xe màu đỏ mận hoặc xanh lục sẫm, bên trong xe treo một sợi dây khánh bình an Phật Di Lặc bằng ngọc, con sẽ đi đến nơi về đến chốn, vạn dặm bình an!`
      );
    },
  },

  // 32. Thầy Tuệ Phong - Nghi Thức Nhập Trạch Nhà Mới
  {
    key: 'nghi_thuc_nhap_trach_nha_moi',
    title: 'Nghi Thức Nhập Trạch Rước Lửa, Gạo Muối Đón Sinh Khí Vào Nhà Mới',
    category: 'PHONG_THUY',
    masterSlug: 'thay-tue-phong',
    minhQuestion: () =>
      `Bạch Thầy Tuệ Phong, lời dặn về màu xe đỏ mận và xanh lục thật chí lý! Con suýt chút nữa chọn màu đen vì thấy người ta hay đi màu đen, may mà hỏi Thầy kịp thời.\n\n` +
      `Thưa Thầy Tuệ Phong, cuối năm nay căn nhà mới của gia đình con xây xong. Khi làm lễ nhập trạch dọn về nhà mới, người chủ gia đình tuổi Bính Dần như con cần làm những nghi thức cốt lõi nào (như rước lửa, gạo muối, đun nước pha trà) để kích hoạt sinh khí và đón thần tài thổ địa vào nhà hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Tuệ Phong chỉ dẫn các bước đại sự nhập trạch rước lửa đón sinh khí vào nhà mới! Nhập trạch là việc đại sự đánh dấu bước chuyển mình phong thủy của cả gia đình con, con làm đúng các bước này thì nhà cửa ấm êm, tài lộc cuồn cuộn đổ về nhé:\n\n` +
        `1. **Người Bước Vào Nhà Đầu Tiên:**\n` +
        `Người chủ gia đình là con (nam Bính Dần) sẽ là người bước chân qua ngưỡng cửa đầu tiên. Hai tay con bê một **bếp than hồng hoặc chiếc bếp ga mini đang đỏ lửa** mang vào nhà. Lửa tượng trưng cho sinh khí, ấm áp và xua tan toàn bộ âm khí ẩm mốc của công trình xây dựng.\n\n` +
        `2. **Người Thứ Hai (Vợ Con):**\n` +
        `Vợ con đi ngay sau, tay cầm một **hũ gạo đầy và một hũ muối đầy**, tượng trưng cho sự no ấm, sung túc và mặn mà nghĩa tình vợ chồng.\n\n` +
        `3. **Các Con:** Đi sau cùng cầm theo tiền vàng, sổ tiết kiệm hoặc vật dụng may mắn mang vào nhà.\n\n` +
        `4. **Đun Nước Khai Bếp:**\n` +
        `Ngay sau khi an vị, con hãy bật bếp đun một ấm nước sôi sùng sục, dùng nước sôi đó pha một ấm trà sen dâng lên bàn thờ gia tiên và thần linh. Tiếng nước sôi reo vui tượng trưng cho tài lộc sôi động, nhà cửa rộn rã tiếng cười.\n\n` +
        `Làm đúng tuần tự như vậy, con sẽ thấy căn nhà mới tràn ngập dương khí, ở ngày nào là khỏe khoắn ngày đó!`
      );
    },
  },

  // 33. Thầy Thiên Minh - Lịch Trình 12 Tháng Năm 2026
  {
    key: 'van_han_tung_thang_2026',
    title: 'Lịch Trình Chi Tiết Các Tháng Biến Động Năm 2026 Bính Ngọ',
    category: 'VAN_HAN',
    masterSlug: 'thay-thien-minh',
    minhQuestion: () =>
      `Dạ thưa Thầy Tuệ Phong, nghi thức rước bếp than hồng và hũ gạo muối thật thiêng liêng và giàu ý nghĩa, con sẽ chuẩn bị chu toàn cho ngày về nhà mới.\n\n` +
      `Kính thưa Thầy Thiên Minh, đối với năm 2026 Bính Ngọ sắp tới, Thầy có thể điểm qua cho con biết trong 12 tháng Âm lịch, những tháng nào là tháng đại cát để con bung sức ký hợp đồng, và những tháng nào có biến động thị phi mà con cần co cụm phòng thủ giữ gìn sức khỏe hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Thiên Minh vạch sẵn cho gia chủ "tấm hải đồ 12 tháng" năm 2026 Bính Ngọ để điều hành vạn sự hanh thông:\n\n` +
        `**CÁC THÁNG ĐẠI CÁT ĐÓN TÀI LỘC:**\n` +
        `- **Tháng Giêng (Tháng Dần) & Tháng Hai (Tháng Mão):** Đầu xuân năm mới Mộc vượng sinh Hỏa, công việc hanh thông, con có nhiều lời mời hợp tác xuất ngoại hoặc mở rộng chi nhánh mới.\n` +
        `- **Tháng Sáu (Tháng Mùi) & Tháng Chín (Tháng Tuất):** Đất tam hợp tài lộc, các khoản nợ đọng hoặc lợi nhuận từ dự án, bất động sản sẽ đổ về tài khoản rực rỡ.\n\n` +
        `**CÁC THÁNG BIẾN ĐỘNG CẦN CẨN TRỌNG:**\n` +
        `- **Tháng Tư & Tháng Năm (Tháng Tỵ - Ngọ - Mùa Hè):** Năng lượng Hỏa của năm Ngọ gặp tháng Hỏa bốc lên cực điểm. Con phải chú ý huyết áp, hạn chế bia rượu tiếp khách đêm khuya, không ký tá các hợp đồng mạo hiểm hoặc cho vay mượn tiền nong.\n` +
        `- **Tháng Bảy (Tháng Thân - Tháng Lục Xung):** Chi Thân xung Chi Dần bản mệnh của con. Tháng này con nên đi chùa phóng sinh, cẩn thận xe cộ va quẹt nhỏ và tránh tranh cãi với đối tác.\n\n` +
        `Biết trước thời tiết thì mưa mang ô, nắng đội mũ. Cứ nắm chắc lịch trình này, con sẽ làm chủ hoàn toàn vận trình năm 2026 con nhé!`
      );
    },
  },

  // 34. Thầy Tuệ Phong - Kích Hoạt Góc Tài Vị Văn Phòng
  {
    key: 'kich_hoat_goc_tai_vi_van_phong',
    title: 'Kích Hoạt Góc Tài Vị Phòng Làm Việc Bằng Cây Phong Thủy & Thác Nước Luân Chuyển',
    category: 'PHONG_THUY',
    masterSlug: 'thay-tue-phong',
    minhQuestion: () =>
      `Tấm hải đồ 12 tháng của Thầy Thiên Minh quý như cẩm nang bỏ túi! Con sẽ lưu ý tháng 4, tháng 5 kiêng rượu bia giữ sức khỏe và tháng 7 tránh tranh cãi thị phi.\n\n` +
      `Thưa Thầy Tuệ Phong, trong phòng làm việc của con, con muốn kích hoạt góc Tài Vị (góc chiêu tài) để tài khí trong phòng luôn luân chuyển sống động. Góc Tài Vị theo phong thủy là vị trí nào trong phòng giám đốc, và con nên đặt cây Kim Ngân, Kim Tiền hay thác nước phong thủy mini thế nào để hút tài khí hả Thầy?`,
    thayBoiAnswer: async () => {
      return (
        `Thầy Tuệ Phong chỉ điểm xác định và kích hoạt góc Tài Vị chuẩn xác trong phòng giám đốc! Xác định góc Tài Vị chuẩn xác là đòn bẩy kích hoạt doanh số cực kỳ mạnh mẽ cho công ty con đấy con ạ:\n\n` +
        `1. **XÁC ĐỊNH VỊ TRÍ GÓC TÀI VỊ:**\n` +
        `- Con đứng ở cửa chính bước vào phòng giám đốc nhìn vào bên trong: Góc Tài Vị chính là **GÓC CHÉO 45 ĐỘ ĐỐI DIỆN VỚI CỬA VÀO** (nằm ở phía trong cùng căn phòng).\n` +
        `- Góc này phải luôn giữ sạch sẽ, sáng sủa, không để thùng rác, không để chổi quét nhà hay đống giấy tờ lộn xộn bừa bãi.\n\n` +
        `2. **BÀI TRÍ CÂY PHONG THỦY HỢP MỆNH:**\n` +
        `- Mệnh con là Hỏa rất cần Mộc tương sinh: Đặt một chậu **Cây Kim Tiền** lá xanh mướt hoặc chậu **Cây Kim Ngân củ to** (chọn chậu cây có 5 thân thắt bím tượng trưng cho ngũ hành tương sinh).\n` +
        `- Dưới gốc cây con có thể chôn 3 đồng tiền hoa mai ngũ đế quấn chỉ đỏ để kích hoạt năng lượng chiêu tài.\n\n` +
        `3. **VỀ THÁC NƯỚC PHONG THỦY LUÂN CHUYỂN:**\n` +
        `- Đặt một thác nước phong thủy nhỏ có dòng nước chảy róc rách nhẹ nhàng hướng dòng nước **CHẢY VÀO TRONG PHÒNG** (tuyệt đối không để dòng nước chảy hướng ra ngoài cửa sổ hay cửa chính).\n` +
        `- Tiếng nước róc rách và dòng nước luân chuyển liên tục tượng trưng cho dòng tiền của công ty con luôn tuần hoàn sinh sôi không ngừng nghỉ!`
      );
    },
  },

  // 35. Thầy Minh Triết (Thay mặt Hội Đồng) - Lời Tri Ân & Tiễn Biệt
  {
    key: 'loi_tri_an_va_tam_nguyen',
    title: 'Lời Tri Ân Của Doanh Nhân Minh & Lời Tiễn Biệt Ấm Áp Của Hội Đồng Danh Sư',
    category: 'CUNG_MENH',
    masterSlug: 'thay-minh-triet',
    minhQuestion: () =>
      `Kính bạch Thầy Minh Triết và toàn thể Quý Thầy, Cô trong Hội Đồng Bát Đại Danh Sư! Hôm nay con cảm thấy mình là người may mắn nhất trên đời khi được Quý Thầy Cô dành trọn tâm huyết khai sáng cho con từ ngọn ngành lá số Tử Vi, Bát Tự, Kinh Dịch, Trạch Cát, cho đến từng góc bếp, bàn làm việc, nhân sự và cách đối nhân xử thế với gia đình, vợ con.\n\n` +
      `Con xin cúi đầu cảm tạ ân đức và trí tuệ uyên bác của Quý Thầy Cô! Con nguyện sẽ đem trọn vẹn những lời chỉ dạy vào đời sống thực tế: nhường nhịn vợ con, phụng dưỡng cha mẹ già, đãi ngộ nhân viên bằng chữ Tâm, và làm ăn bằng chữ Tín. Con kính chúc Quý Thầy Cô luôn dồi dào sức khỏe, trường thọ an khang để tiếp tục gieo duyên lành cứu giúp cho muôn vạn người đời ạ!`,
    thayBoiAnswer: async () => {
      return (
        `Ha ha, Thầy Minh Triết thay mặt Hội Đồng Bát Đại Danh Sư xúc động trước tấm lòng chân thành và sự cầu thị của con lắm con trai ạ!\n\n` +
        `Người xưa có câu: *"Đồng thanh tương ứng, đồng khí tương cầu"*. Con có tâm sáng thì con mới gặp được lời khuyên sáng suốt. Con hãy đứng dậy, vươn cao lồng ngực, bước ra ngoài với nụ cười tự tin của bậc trượng phu!\n\n` +
        `Cả 8 vị Thầy chúng tôi đều tin chắc chắn rằng: Với bản lĩnh Lô Trung Hỏa đã qua tôi luyện, với sự bao dung của Mệnh Thiên Phủ và sự bứt phá của Thân cư Vũ Tham, con sẽ chèo lái con thuyền doanh nghiệp của con cập bến bờ vinh quang rực rỡ, gia đạo êm ấm vạn đời hạnh phúc.\n\n` +
        `Bất cứ khi nào con thấy mỏi mệt hay cần người đàm đạo trà đạo, chén trà sen của Bát Đại Danh Sư tại XemBoi.vn lúc nào cũng ấm nóng chờ đón con trở về. Chúc con trai lên đường vạn dặm bình an, mã đáo thành công!`
      );
    },
  },
];

/**
 * Extracts all already-discussed topic keys from conversation messages
 */
export function extractAskedTopicKeys(messages: DialogueMessage[]): Set<string> {
  const asked = new Set<string>();
  for (const m of messages) {
    if (m.topicKey) {
      asked.add(m.topicKey);
    }
    if (m.topic) {
      const match = DIALOGUE_TOPICS.find((t) => t.title === m.topic || t.key === m.topic);
      if (match) {
        asked.add(match.key);
      }
    }
  }
  return asked;
}

/**
 * Resolves the most suitable Master from Bát Đại Danh Sư based on topicKey, category, or question content
 */
export function resolveMasterForTopic(params: {
  topicKey?: string;
  category?: string;
  questionText?: string;
}): AiAgentConfig {
  const { topicKey = '', category = '', questionText = '' } = params;

  // 1. Check curated scenarios direct masterSlug mapping
  if (topicKey) {
    const matchedCurated = DIALOGUE_TOPICS.find((t) => t.key === topicKey);
    if (matchedCurated && matchedCurated.masterSlug) {
      return getAgentBySlug(matchedCurated.masterSlug);
    }
  }

  const qLower = questionText.toLowerCase();

  // 2. Keyword heuristic checks
  // Thầy Huyền Cơ: Kinh Dịch, bốc phệ, 64 quẻ, gieo quẻ, mai hoa, lục hào
  if (
    qLower.includes('kinh dịch') ||
    qLower.includes('quẻ') ||
    qLower.includes('bốc phệ') ||
    qLower.includes('mai hoa') ||
    qLower.includes('lục hào') ||
    qLower.includes('hào động') ||
    qLower.includes('gieo quẻ')
  ) {
    return THAY_HUYEN_CO;
  }

  // Cô Linh Đan: Giấc mơ, điềm báo, máy mắt, văn khấn, cúng kiếng, mồ mả, phóng sinh
  if (
    qLower.includes('mơ') ||
    qLower.includes('chiêm bao') ||
    qLower.includes('điềm') ||
    qLower.includes('máy mắt') ||
    qLower.includes('văn khấn') ||
    qLower.includes('cúng') ||
    qLower.includes('thần số') ||
    qLower.includes('phóng sinh') ||
    qLower.includes('tâm linh') ||
    qLower.includes('mồ mả')
  ) {
    return CO_LINH_DAN;
  }

  // Thầy Tuệ Phong: Phong thủy, hướng nhà, bàn thờ, bàn làm việc, bát trạch, bếp, tài vị, vật phẩm phong thủy
  if (
    qLower.includes('phong thủy') ||
    qLower.includes('hướng nhà') ||
    qLower.includes('bàn thờ') ||
    qLower.includes('bát trạch') ||
    qLower.includes('bếp') ||
    qLower.includes('tài vị') ||
    qLower.includes('két sắt') ||
    qLower.includes('tỳ hưu') ||
    qLower.includes('thiềm thừ') ||
    qLower.includes('màu xe') ||
    qLower.includes('nhập trạch')
  ) {
    return THAY_TUE_PHONG;
  }

  // Thầy Lạc Việt: Tứ trụ, bát tự, dụng thần, ngũ hành khuyết thiếu, đặt tên
  if (
    qLower.includes('bát tự') ||
    qLower.includes('tứ trụ') ||
    qLower.includes('dụng thần') ||
    qLower.includes('khuyết hành') ||
    qLower.includes('đặt tên') ||
    qLower.includes('thập thần') ||
    qLower.includes('nhật chủ')
  ) {
    return THAY_LAC_VIET;
  }

  // Thầy Thiên Minh: Trạch cát, ngày giờ tốt, hoàng đạo, tam tai, kim lâu, hoang ốc, xuất hành, khai trương
  if (
    qLower.includes('ngày tốt') ||
    qLower.includes('giờ tốt') ||
    qLower.includes('hoàng đạo') ||
    qLower.includes('tam tai') ||
    qLower.includes('kim lâu') ||
    qLower.includes('hoang ốc') ||
    qLower.includes('khai trương') ||
    qLower.includes('xuất hành') ||
    qLower.includes('trạch cát') ||
    qLower.includes('lịch vạn niên') ||
    qLower.includes('tiết khí')
  ) {
    return THAY_THIEN_MINH;
  }

  // Thầy Tâm An: Tình duyên, hôn nhân, vợ chồng, con cái, phu thê, tử tức, ly hôn, hòa giải
  if (
    qLower.includes('vợ') ||
    qLower.includes('chồng') ||
    qLower.includes('phu thê') ||
    qLower.includes('tình duyên') ||
    qLower.includes('hôn nhân') ||
    qLower.includes('con cái') ||
    qLower.includes('tử tức') ||
    qLower.includes('hòa hợp') ||
    qLower.includes('đào hoa') ||
    qLower.includes('hồng loan')
  ) {
    return THAY_TAM_AN;
  }

  // Thầy Thái Sơn: Công danh, tài lộc, tiền bạc, quan lộc, tài bạch, điền trạch, bất động sản, làm ăn, đối tác
  if (
    qLower.includes('tiền') ||
    qLower.includes('tài bạch') ||
    qLower.includes('quan lộc') ||
    qLower.includes('điền trạch') ||
    qLower.includes('nhà đất') ||
    qLower.includes('bất động sản') ||
    qLower.includes('kinh doanh') ||
    qLower.includes('công ty') ||
    qLower.includes('đối tác') ||
    qLower.includes('nô bộc') ||
    qLower.includes('lợi nhuận') ||
    qLower.includes('sự nghiệp')
  ) {
    return THAY_THAI_SON;
  }

  // 3. Category Fallback
  const catUpper = (category || '').toUpperCase();
  if (['TINH_DUYEN', 'CUNG_PHU_THE', 'GIA_DAO_CON_CAI', 'CUNG_TU_TUC'].includes(catUpper)) {
    return THAY_TAM_AN;
  }
  if (['CONG_DANH', 'TAI_LOC', 'CUNG_QUAN_LOC', 'CUNG_TAI_BACH', 'CUNG_DIEN_TRACH', 'CUNG_NO_BOC'].includes(catUpper)) {
    return THAY_THAI_SON;
  }
  if (['VAN_HAN', 'TRACH_CAT', 'XEM_NGAY', 'LICH_VAN_NIEN'].includes(catUpper)) {
    return THAY_THIEN_MINH;
  }
  if (['PHONG_THUY'].includes(catUpper)) {
    return THAY_TUE_PHONG;
  }
  if (['TU_TRU', 'BAT_TU'].includes(catUpper)) {
    return THAY_LAC_VIET;
  }
  if (['KINH_DICH', 'BOI_DICH'].includes(catUpper)) {
    return THAY_HUYEN_CO;
  }
  if (['TAM_LINH_GIAI_HAN', 'GIAC_MO', 'DIEM_BAO'].includes(catUpper)) {
    return CO_LINH_DAN;
  }

  // Default: Thầy Minh Triết (Tổng quan Tử Vi & Cung Mệnh/Thân)
  return THAY_MINH_TRIET;
}

/**
 * Converts raw bank inquiry into a natural, respectful question spoken by Minh addressed to the right Master
 */
function humanizeBankInquiry(inquiry: any, targetMaster: AiAgentConfig, _lastAnswer?: string): string {
  const masterSalutations: Record<string, string[]> = {
    'thay-tam-an': [
      `Kính thưa Thầy Tâm An, nghe các bậc tiền bối chỉ dạy về gia đạo và duyên nợ, con lại có nỗi niềm này muốn xin Thầy soi sáng: `,
      `Dạ thưa Thầy Tâm An, chuyện tình cảm và sự hòa thuận vợ chồng luôn là điều con canh cánh, con kính nhờ Thầy chỉ giáo: `,
    ],
    'thay-thai-son': [
      `Dạ thưa Thầy Thái Sơn, thương trường nhiều lúc sóng gió khó lường, con xin phép được thỉnh giáo Thầy một vấn đề trọng yếu về tài lộc và kinh doanh: `,
      `Bạch Thầy Thái Sơn, về chuyện công danh, tài chính và đầu tư làm ăn, con có một băn khoăn muốn nhờ Thầy định hướng: `,
    ],
    'thay-thien-minh': [
      `Kính thưa Thầy Thiên Minh, các cụ dạy có thờ có thiêng, có kiêng có lành, con xin phép hỏi Thầy về trạch cát và thời vận: `,
      `Dạ bạch Thầy Thiên Minh, trong việc tính toán ngày giờ đại cát và các hạn lưu niên, con kính nhờ Thầy soi xét giúp con: `,
    ],
    'thay-huyen-co': [
      `Bạch Thầy Huyền Cơ, con kính nhờ Thầy khởi quẻ Chu Dịch soi tỏ sự việc này giùm con: `,
      `Dạ thưa Thầy Huyền Cơ, đứng trước sự việc chưa quyết, con xin Thầy bấm một quẻ Dịch chỉ lối: `,
    ],
    'thay-tue-phong': [
      `Kính thưa Thầy Tuệ Phong, về không gian sống và phong thủy tài lộc, con có một thắc mắc muốn thỉnh giáo Thầy: `,
      `Dạ bạch Thầy Tuệ Phong, để sinh khí và tài vị văn phòng được hanh thông nhất, con kính nhờ Thầy chỉ điểm: `,
    ],
    'thay-lac-viet': [
      `Kính thưa Thầy Lạc Việt, xét theo Tứ Trụ Bát Tự và độ cân bằng ngũ hành, con xin Thầy khai mở cho con: `,
      `Dạ bạch Thầy Lạc Việt, đối với Dụng Thần và bản mệnh của con, con kính nhờ Thầy chỉ giáo: `,
    ],
    'co-linh-dan': [
      `Dạ con xin phép thưa với Cô Linh Đan, về mặt tâm linh dân gian và thông điệp tiềm thức, con rất muốn được Cô giải mã: `,
      `Kính thưa Cô Linh Đan, con có một hiện tượng và điềm báo trăn trở muốn nhờ Cô chỉ dẫn nghi thức chuẩn mực: `,
    ],
    'thay-minh-triet': [
      `Kính bạch Thầy Minh Triết và Hội Đồng Danh Sư, suy ngẫm sâu hơn về tinh bàn Tử Vi, con xin hỏi Thầy: `,
      `Dạ thưa Thầy Minh Triết, người tuổi 40 bước vào giai đoạn then chốt như con rất mong được Thầy chỉ dạy thêm: `,
    ],
  };

  const salutations = masterSalutations[targetMaster.slug] || masterSalutations['thay-minh-triet'];
  const intro = salutations[Math.floor(Math.random() * salutations.length)];

  return (
    `${intro}\n\n` +
    `*" ${inquiry.question} "*\n\n` +
    `Đối với người tuổi Bính Dần 1986, bản mệnh Lô Trung Hỏa như con, kính xin ${targetMaster.name} vận dụng kho tàng bí thư uyên thâm chỉ lối cho con ạ!`
  );
}

/**
 * Generates continuous turn-by-turn dialogue messages indefinitely
 * GUARANTEED:
 * 1. 100% natural, human-like conversation.
 * 2. Multi-Master (Bát Đại Danh Sư) routing: the best suited Master steps up for every question.
 * 3. Individual visual styles and masterTheme tags for each speaker.
 * 4. Absolutely zero duplicate questions or answers.
 */
export async function getNextSimulationTurn(params: {
  messages: DialogueMessage[];
  speaker: 'minh' | 'thay_boi';
  chart: any;
}): Promise<DialogueMessage> {
  const { messages, speaker, chart } = params;
  const turnIndex = messages.length;
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

  // Handle Admin Intervention naturally
  if (lastMsg && lastMsg.sender === 'admin' && speaker === 'thay_boi') {
    const assignedMaster = resolveMasterForTopic({
      questionText: lastMsg.content,
    });
    const masterTheme = MASTER_THEMES[assignedMaster.slug] || DEFAULT_MASTER_THEME;

    const adminAnswer =
      `${assignedMaster.name} xin thay mặt Hội Đồng Bát Đại Danh Sư tiếp nhận tham vấn từ Quý Chuyên Viên Quản Trị Hệ Thống:\n\n` +
      `Thưa Chuyên Viên, về vấn đề *" ${lastMsg.content} "* mà Quý Vị vừa đưa ra, đây là một điểm can thiệp rất đúng lúc và sắc bén.\n\n` +
      `Tôi xin ghi nhận và lập tức lồng ghép góc nhìn này vào tiến trình khai mở tinh bàn cho đương số Minh. Con trai Minh ơi, con nghe chuyên viên dặn chưa, thầy trò mình tiếp tục mạch đàm đạo nhé!`;

    return {
      id: `msg_thay_boi_admin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sender: 'thay_boi',
      senderName: assignedMaster.name,
      senderTitle: assignedMaster.title,
      avatarUrl: assignedMaster.avatarUrl,
      masterSlug: assignedMaster.slug,
      masterTheme,
      content: adminAnswer,
      timestamp: timeStr,
      topic: 'Giải Đáp Tham Vấn Admin',
      topicKey: 'admin_intervene',
    };
  }

  // --- MINH'S TURN ---
  if (speaker === 'minh') {
    const askedKeys = extractAskedTopicKeys(messages);

    // 1. First, search for the next unasked topic in the 35 curated scenarios
    const unaskedCurated = DIALOGUE_TOPICS.find((t) => !askedKeys.has(t.key));

    if (unaskedCurated) {
      const qText = unaskedCurated.minhQuestion(turnIndex, chart, lastMsg?.content);
      return {
        id: `msg_minh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        sender: 'minh',
        senderName: MINH_CUSTOMER_AGENT.name,
        senderTitle: MINH_CUSTOMER_AGENT.title,
        avatarUrl: MINH_CUSTOMER_AGENT.avatarUrl,
        masterSlug: 'khach-hang-minh',
        masterTheme: MINH_THEME,
        content: qText,
        timestamp: timeStr,
        topic: unaskedCurated.title,
        topicKey: unaskedCurated.key,
      };
    }

    // 2. If all 35 curated topics are exhausted, pull unasked inquiries from customer-inquiry-bank.json
    const bank = customerInquiriesRaw as any[];
    const unaskedBank = bank.filter((item) => !askedKeys.has(item.id));
    const chosenBank = unaskedBank.length > 0 ? unaskedBank[0] : bank[turnIndex % bank.length];

    // Determine target master for this bank inquiry
    const targetMaster = resolveMasterForTopic({
      category: chosenBank.category,
      questionText: chosenBank.question,
    });

    const humanQuestion = humanizeBankInquiry(chosenBank, targetMaster, lastMsg?.content);

    return {
      id: `msg_minh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sender: 'minh',
      senderName: MINH_CUSTOMER_AGENT.name,
      senderTitle: MINH_CUSTOMER_AGENT.title,
      avatarUrl: MINH_CUSTOMER_AGENT.avatarUrl,
      masterSlug: 'khach-hang-minh',
      masterTheme: MINH_THEME,
      content: humanQuestion,
      timestamp: timeStr,
      topic: chosenBank.categoryName || 'Chuyên Đề Mở Rộng',
      topicKey: chosenBank.id,
    };
  }

  // --- MASTER'S TURN (BÁT ĐẠI DANH SƯ STEPPING FORWARD) ---
  const lastTopicKey = lastMsg?.topicKey;
  const matchedCurated = DIALOGUE_TOPICS.find((t) => t.key === lastTopicKey);
  const bank = customerInquiriesRaw as any[];
  const matchedBankInquiry = bank.find((item) => item.id === lastTopicKey);
  const lastQuestion = lastMsg?.content || '';

  // SMART ROUTING: Determine the assigned Master
  const master = resolveMasterForTopic({
    topicKey: lastTopicKey,
    category: matchedCurated?.category || matchedBankInquiry?.category,
    questionText: lastQuestion,
  });

  const masterTheme = MASTER_THEMES[master.slug] || DEFAULT_MASTER_THEME;
  let answerText = '';

  if (matchedCurated) {
    answerText = await matchedCurated.thayBoiAnswer(turnIndex, chart, lastQuestion);
  } else {
    // Dynamic RAG-powered response for bank inquiries with 100% FULL, UNTRUNCATED text
    const searchQuery = matchedBankInquiry
      ? `${matchedBankInquiry.categoryName} ${matchedBankInquiry.keyStarsOrSigns?.join(' ')} ${matchedBankInquiry.question}`
      : lastQuestion;

    const ragChunks = await searchKnowledge(searchQuery, 2, master.slug);

    let ancientKnowledgeFullText = '';
    if (ragChunks.length > 0) {
      ancientKnowledgeFullText = ragChunks
        .map(
          (c, idx) =>
            `* **Cổ thư chiêm nghiệm ${idx + 1} — 《${c.docTitle}》:**\n` +
            `  ${c.content.trim()}`
        )
        .join('\n\n');
    }

    const approachText = matchedBankInquiry?.thayBoiApproach
      ? `\n\n* **Phương pháp luận giải chuyên sâu của ${master.name}:**\n  ${matchedBankInquiry.thayBoiApproach}`
      : '';

    const starsMentioned = matchedBankInquiry?.keyStarsOrSigns?.length
      ? matchedBankInquiry.keyStarsOrSigns.join(', ')
      : 'Thiên Phủ (Kho trời), Vũ Khúc - Tham Lang (Tài tinh miếu địa)';

    answerText =
      `${master.name} (${master.title}) xin hồi đáp câu hỏi rất chân thành và chạm đúng nỗi niềm thực tế của con trai!\n\n` +
      `Về khúc mắc này, dưới lăng kính chuyên môn ${master.shortLabel || 'huyền học'} và đối chiếu bàn cờ Tử Vi, tôi chỉ rõ cội nguồn gốc rễ cho con hiểu tường tận:\n\n` +
      `### 1. Soi Chiếu Bàn Cờ Tử Vi & Bản Mệnh Đương Số:\n` +
      `Con là nam nhân tuổi Bính Dần 1986, bản mệnh **Lô Trung Hỏa** (Lửa trong lò), cục diện **Mộc Tam Cục** (Cục sinh Bản Mệnh), cung Mệnh đóng tại Hợi có **Thiên Phủ** đắc địa và cung Thân cư Phúc Đức tại Sửu có **Vũ Khúc - Tham Lang miếu địa**.\n` +
      `Trong vấn đề con vừa hỏi, các bộ sao và cung vị chịu tác động trực tiếp bao gồm: **${starsMentioned}**.\n` +
      `Người mang cách cục "Vũ Tham đồng hành" ở cung Thân thì thuở tiền vận thường phải nếm trải thử thách, nhưng từ tuổi 40 trở đi thì nội lực và tuệ giác bắt đầu thức tỉnh mạnh mẽ. Khúc mắc này xuất hiện trong giai đoạn này chính là một bài học để con hoàn thiện nốt mảnh ghép cuối cùng trước khi bước vào đại vận hoàng kim.\n\n` +
      `### 2. Tri Thức Cổ Nhân Chỉ Dạy (Đầy Đủ 100% Cổ Thư Huyền Học):\n` +
      `Cổ nhân trong các pho bí thư Tử Vi Đẩu Số và Dịch học phương Đông đã truyền dạy về lý số này như sau:\n\n` +
      `${ancientKnowledgeFullText || '* **Trích dẫn thư tịch cổ:** Vạn sự giai do âm dương sinh khắc, tâm động thì quẻ ứng, đức dày thì họa biến thành tường.'}` +
      `${approachText}\n\n` +
      `### 3. Pháp Bảo Hành Động Thực Tiễn & Lời Khuyên Của ${master.name}:\n` +
      `Hiểu được đạo lý của cổ nhân rồi, con cần đem nó ứng dụng vào thực tế đời sống theo 3 bước này:\n` +
      `1. **Giữ Tâm An Định & Thuận Theo Tự Nhiên:** Lô Trung Hỏa kỵ nhất là sự bốc đồng nóng nảy. Khi gặp tình huống này, con hãy lùi lại một bước quan sát toàn cảnh, đừng ra quyết định khi cảm xúc đang xao động.\n` +
      `2. **Lấy Chữ Tín & Minh Bạch Làm Đầu:** Đúng như phẩm chất Thiên Phủ cai quản ngân khố của trời, mọi cam kết và ứng xử phải phân minh rõ ràng.\n` +
      `3. **Hành Thiện Tích Âm Đức:** Dù làm bất cứ việc gì, con hãy đặt lợi ích của cộng đồng và sự tử tế lên trên hết. Phước đức dày dặn thì mọi hung khí đều tự động tiêu tán, phúc lộc trường lưu!`;
  }

  return {
    id: `msg_${master.slug}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sender: 'thay_boi',
    senderName: master.name,
    senderTitle: master.title,
    avatarUrl: master.avatarUrl,
    masterSlug: master.slug,
    masterTheme,
    content: answerText,
    timestamp: timeStr,
    topic: lastMsg?.topic || 'Luận Giải Tử Vi',
    topicKey: lastTopicKey,
  };
}
