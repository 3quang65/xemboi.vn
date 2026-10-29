import { prisma } from '@/lib/prisma';
import { MASTER_THEMES } from './dialogue-simulation';
import { getMinhChart, THAY_MINH_TRIET, THAY_THAI_SON, THAY_TAM_AN, THAY_TUE_PHONG, getAgentBySlug } from './agent-persona';

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant' | 'admin' | 'system';
  content: string;
  senderAgentSlug?: string;
  senderName?: string;
  senderAvatar?: string;
  senderBadge?: string;
  citedSources?: string[];
  audioUrl?: string | null;
  audioDuration?: number | null;
  createdAt: string;
}

export interface StoredConversation {
  id: string;
  mode: 'SINGLE_AGENT' | 'COUNCIL_CONSULTATION';
  title: string;
  agentId: string;
  agentSlug: string;
  agentName: string;
  participantSlugs: string[];
  customerId?: string | null;
  customerName: string;
  customerGender?: 'male' | 'female';
  activeChartId?: string | null;
  chartSummary?: string;
  chartData?: any;
  status: 'ACTIVE' | 'COUNCIL_DEBATING' | 'HUMAN_TAKEOVER' | 'CLOSED';
  summary?: string | null;
  messages: StoredMessage[];
  createdAt: string;
  updatedAt: string;
}

// In-memory cache for ultra-fast access and offline fallback
const memoryConversations: Map<string, StoredConversation> = new Map();
let isInitialized = false;

function initSeedConversations() {
  if (isInitialized) return;
  isInitialized = true;

  const minhChart = getMinhChart();

  // Seed 1: Active Council Consultation session with Minh (1986 Bính Dần)
  const conv1: StoredConversation = {
    id: 'conv_council_minh_1986',
    mode: 'COUNCIL_CONSULTATION',
    title: 'Phòng Tọa Đàm Bát Đại Danh Sư và Minh (1986)',
    agentId: THAY_MINH_TRIET.id || 'agent_minh_triet_id',
    agentSlug: 'thay-minh-triet',
    agentName: 'Thầy Minh Triết',
    participantSlugs: [
      'thay-minh-triet',
      'thay-thai-son',
      'thay-tam-an',
      'thay-tue-phong',
      'thay-lac-viet',
      'thay-thien-minh',
      'thay-huyen-co',
      'co-linh-dan',
    ],
    customerName: 'Minh (Bính Dần 1986)',
    customerGender: 'male',
    activeChartId: 'minh-1986',
    chartSummary: 'Minh · Nam · 14/12/1986 (Bính Dần) · Lô Trung Hỏa · Mộc Tam Cục · Mệnh Thiên Phủ(Hợi) · Thân Vũ Tham(Sửu)',
    chartData: minhChart,
    status: 'ACTIVE',
    summary:
      'Hội đồng Bát Đại Danh Sư đã hoàn tất phiên tọa đàm toàn diện: Thầy Minh Triết định khung thế tiền bần hậu phú; Thầy Thái Sơn cố vấn quản trị dòng tiền; Thầy Tâm An chỉ điểm phương pháp hóa giải cung Phu Thê; Thầy Tuệ Phong hướng dẫn phong thủy Bát Trạch; Thầy Lạc Việt cân bằng Dụng Thần ngũ hành; Thầy Thiên Minh chọn giờ khởi sự; Thầy Huyền Cơ giải quẻ Hỏa Phong Đỉnh; Cô Linh Đan khai mở điềm báo giấc mơ.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg_c1_1',
        role: 'user',
        content:
          'Kính thỉnh Hội Đồng Bát Đại Danh Sư! Con tên là Minh, sinh lúc 2h sáng ngày 14/12/1986 (Bính Dần). Năm nay con bước sang tuổi 40, đang điều hành công ty riêng. Con kính nhờ Quý Thầy hội chẩn tổng thể lá số, chỉ rõ cho con cơ hội bứt phá công danh tài lộc và cách giữ gìn gia đạo êm ấm ạ!',
        senderName: 'Minh (Khách Hàng)',
        senderAvatar: '/icons/avatar-minh.svg',
        senderBadge: 'Đương số 1986',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_1.mp3',
        audioDuration: 18.5,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'msg_c1_2',
        role: 'assistant',
        senderAgentSlug: 'thay-minh-triet',
        senderName: 'Thầy Minh Triết',
        senderAvatar: '/icons/agents/thay-minh-triet.svg',
        senderBadge: 'Chủ trì - Tổng Quan Tử Vi',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_2.mp3',
        audioDuration: 35.2,
        content:
          `Thầy Minh Triết chào con trai! Thay mặt Hội Đồng Bát Đại Danh Sư, thầy khai mở bàn cờ Tử Vi của con:\n\n` +
          `Bản mệnh **Lô Trung Hỏa** được **Mộc Tam Cục** sinh trợ — hoàn cảnh cuộc đời thuận lợi nâng đỡ bản mệnh. Cung Mệnh tại Hợi đắc lệnh tinh **Thiên Phủ** đắc địa, Thân cư Phúc Đức tại Sửu đắc cặp đôi vàng **Vũ Khúc - Tham Lang miếu địa**.\n\n` +
          `Đây là cách cục *"Tiền bần hậu phú, đại khí vãn thành"*: Thuở tiền vận 20-35 tuổi nếm trải va vấp nợ nần để tôi luyện bản lĩnh, từ tuổi 40 trở đi lửa trong lò đã đượm, con bước vào đại vận chín muồi phát tài mạnh mẽ.\n\n` +
          `Về đường công danh, tài lộc và chiến lược điều hành doanh nghiệp trong đại vận này, tôi xin trân trọng kính mời **Thầy Thái Sơn** — Chuyên gia Quan Lộc & Tài Bạch cho ý kiến thẩm định chi tiết cho đương số...`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 15000).toISOString(),
      },
      {
        id: 'msg_c1_3',
        role: 'assistant',
        senderAgentSlug: 'thay-thai-son',
        senderName: 'Thầy Thái Sơn',
        senderAvatar: '/icons/agents/thay-thai-son.svg',
        senderBadge: 'Chuyên Gia Tài Lộc & Sự Nghiệp',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_3.mp3',
        audioDuration: 38.4,
        content:
          `Chào Thầy Minh Triết và quý bạn đương số! Tiếp lời định khung của Thầy Minh Triết, tôi — Thái Sơn xin đi thẳng vào tử huyệt tài chính:\n\n` +
          `Tam hợp Mệnh - Tài - Quan của con: Cung Quan tại Tân Mão có **Thiên Tướng** đắc cách *"Phủ Tướng triều viên"*, uy tín thương hiệu rất lớn. Cung Tài tại Ất Mùi là **Vô Chính Diệu** nhưng đối cung Phúc Đức có Vũ Khúc - Tham Lang miếu địa chiếu thẳng sang — tiền bạc của con không đến từ lương cố định mà luân chuyển theo từng hợp đồng dự án lớn.\n\n` +
          `Nhưng trong cung Quan có sao **Phục Binh** và **Thiên Không**: Tuyệt đối không được dùng đòn bẩy vay nợ quá lớn, không đứng tên bảo lãnh nợ giùm ai! Có tiền dôi dư hãy rút 70% mua đất thổ cư sổ đỏ trao tay (cung Điền Trạch có Thái Dương - Cự Môn vượng địa là kho tài sản truyền đời).\n\n` +
          `Tuy nhiên, kiếm tiền nhiều mà gia đạo bất an thì phúc lộc khó bền. Về cung Phu Thê dính Hóa Kỵ, xin kính mời **Thầy Tâm An** soi chiếu cho con...`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 35000).toISOString(),
      },
      {
        id: 'msg_c1_4',
        role: 'assistant',
        senderAgentSlug: 'thay-tam-an',
        senderName: 'Thầy Tâm An',
        senderAvatar: '/icons/agents/thay-tam-an.svg',
        senderBadge: 'Cố Vấn Tình Duyên & Gia Đạo',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_4.mp3',
        audioDuration: 42.0,
        content:
          `Thầy Tâm An xin chào Thầy Minh Triết, Thầy Thái Sơn và con trai. Nghe Thầy Thái Sơn dặn gom tiền vào đất đai, thầy rất mừng nhưng thầy phải lưu ý con mối liên hệ giữa sự nghiệp và gia đình:\n\n` +
          `Cung Phu Thê tại Đinh Dậu của con có cặp sao **Liêm Trinh (Hỏa)** và **Phá Quân (Thủy)** hãm địa, lại dính **Hóa Kỵ** ám tinh. Vợ con là người có học thức, sắc sảo (đắc Hóa Khoa, Thiên Việt) nhưng tự trọng cao và hay cả nghĩ. Khi con mải mê công việc về muộn, nói năng cộc lốc là kích hoạt Hóa Kỵ bùng lên thành chiến tranh lạnh!\n\n` +
          `Thầy tặng con pháp bảo: **"Nhường vợ không bao giờ là hèn!"**. Khi vợ nổi giận, con tuyệt đối không đôi co lý lẽ đúng sai, lùi một bước ôm vợ vào lòng, hôm sau nguội đầu mới thủ thỉ giãi bày. Cùng vợ đi chùa, làm từ thiện, gia đạo sẽ êm ấm vạn đời.\n\n` +
          `Về phương diện phong thủy không gian sống và văn phòng để hóa giải xung khí, kích hoạt tài vị, xin kính mời **Thầy Tuệ Phong** chỉ dẫn...`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 55000).toISOString(),
      },
      {
        id: 'msg_c1_5',
        role: 'assistant',
        senderAgentSlug: 'thay-tue-phong',
        senderName: 'Thầy Tuệ Phong',
        senderAvatar: '/icons/agents/thay-tue-phong.svg',
        senderBadge: 'Chuyên Gia Phong Thủy Cải Vận',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_5.mp3',
        audioDuration: 30.5,
        content:
          `Chào gia chủ Minh! Thầy Tuệ Phong xin đúc kết phương pháp Phong thủy Bát Trạch cải vận cho gia chủ:\n\n` +
          `Gia chủ là nam Bính Dần 1986, cung Phi là **Khôn Thổ (Tây Tứ Mệnh)**:\n` +
          `- **Bàn làm việc Giám Đốc:** Ngồi quay mặt về hướng **Đông Bắc (Sinh Khí - đại vượng tài lộc)** hoặc Tây Bắc (Diên Niên). Lưng tựa tường vững chãi.\n` +
          `- **Kích hoạt tài vị:** Đặt một **quả cầu Thạch Anh Tím hoặc Thạch Anh Xanh lục** ở góc trái bàn làm việc để thanh lọc từ trường, giúp tâm trí sáng suốt.\n` +
          `- **Phòng ngủ:** Tuyệt đối không để gương soi chiếu thẳng vào giường ngủ (nguồn cơn kích hoạt sao Hóa Kỵ gây giật mình mất ngủ cho người vợ).\n\n` +
          `Về cách cân bằng Dụng Thần Bát Tự để điều hòa năng lượng bản mệnh, tôi xin kính mời **Thầy Lạc Việt** lên tiếng...`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 75000).toISOString(),
      },
      {
        id: 'msg_c1_6',
        role: 'assistant',
        senderAgentSlug: 'thay-lac-viet',
        senderName: 'Thầy Lạc Việt',
        senderAvatar: '/icons/agents/thay-lac-viet.svg',
        senderBadge: 'Đại Sư Tứ Trụ Bát Tự & Dụng Thần',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_6.mp3',
        audioDuration: 26.8,
        content:
          `Chào bạn Minh và chư vị tiền bối! Dưới góc độ Tứ Trụ Bát Tự:\n\n` +
          `Nhật chủ của bạn mang nạp âm **Lô Trung Hỏa**, cần nhất **Dụng Thần Mộc để sinh Hỏa** (nuôi dưỡng nhiệt huyết sáng tạo) và **Hỷ Thần Thổ để dung nạp tài lộc** (giữ của cải như Thầy Thái Sơn đã dặn).\n\n` +
          `Về trang phục và vật phẩm: Ưu tiên sử dụng màu **Xanh lục, xanh ngọc (Mộc)** và màu **Đỏ rượu, tím than (Hỏa)** để trợ lực khí vận. Tránh lạm dụng quá nhiều màu đen hoặc xanh lam đậm thuộc Thủy khắc Hỏa.\n\n` +
          `Về thời cơ vàng khởi sự năm 2026, kính mời **Thầy Thiên Minh** chỉ điểm...`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 95000).toISOString(),
      },
      {
        id: 'msg_c1_7',
        role: 'assistant',
        senderAgentSlug: 'thay-thien-minh',
        senderName: 'Thầy Thiên Minh',
        senderAvatar: '/icons/agents/thay-thien-minh.svg',
        senderBadge: 'Đại Sư Trạch Cát & Kỳ Môn',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_7.mp3',
        audioDuration: 28.5,
        content:
          `Thầy Thiên Minh xin gửi lời chào đến gia chủ Minh! Về Thiên Thời năm 2026 Bính Ngọ:\n\n` +
          `Năm nay bạn không phạm Tam Tai lớn, nhưng có sự tương xung nhẹ ở chi Ngọ. Chiến lược tối ưu: Nửa đầu năm nên ưu tiên củng cố nội lực, đào tạo nhân sự; nửa cuối năm từ tháng 6 Âm lịch trở đi mới là thời điểm bung sức mở rộng quy mô.\n\n` +
          `Mỗi khi ký kết hợp đồng quan trọng, hãy chọn xuất hành vào **Giờ Thìn (07h - 09h)** hoặc **Giờ Thân (15h - 17h)** để đón trọn cát khí Quý Nhân tương trợ.\n\n` +
          `Bây giờ, xin mời **Thầy Huyền Cơ** khởi quẻ Chu Dịch dự đoán điềm cát hung cho bạn!`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 115000).toISOString(),
      },
      {
        id: 'msg_c1_8',
        role: 'assistant',
        senderAgentSlug: 'thay-huyen-co',
        senderName: 'Thầy Huyền Cơ',
        senderAvatar: '/icons/agents/thay-huyen-co.svg',
        senderBadge: 'Ẩn Sĩ Chu Dịch Dự Đoán Học',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_8.mp3',
        audioDuration: 24.0,
        content:
          `Bần đạo Huyền Cơ xin kính chào quý bạn! Khởi quẻ Chu Dịch theo thời khắc của bạn, đắc được quẻ **HỎA PHONG ĐỈNH** biến sang quẻ **SƠN PHONG CỔ**:\n\n` +
          `- **Quẻ Chủ Đỉnh:** Chiếc vạc luyện vàng rèn chí, điềm báo công danh đứng trước ngưỡng cửa lột xác ngoạn mục.\n` +
          `- **Quẻ Biến Cổ:** Nhắc nhở *"Vật cực tất phản, dục tốc bất đạt"*. Đừng vì nôn nóng mà ký thỏa thuận mập mờ, phải thanh lọc các mối quan hệ độc hại xung quanh.\n\n` +
          `Về cội nguồn tâm linh âm đức tổ tiên, xin mời **Cô Linh Đan** san sẻ cùng bạn!`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 135000).toISOString(),
      },
      {
        id: 'msg_c1_9',
        role: 'assistant',
        senderAgentSlug: 'co-linh-dan',
        senderName: 'Cô Linh Đan',
        senderAvatar: '/icons/agents/co-linh-dan.svg',
        senderBadge: 'Chuyên Gia Tâm Linh & Giấc Mơ',
        audioUrl: '/audio/cache/dialogue_minh_1986_msg_c1_9.mp3',
        audioDuration: 39.0,
        content:
          `Cô Linh Đan chào bạn Minh! Nghe các Thầy luận giải tường tận, cô muốn nhắc bạn về một điểm tựa linh thiêng: **Cung Phúc Đức Thân cư Sửu** có phúc ấm tổ tiên dòng họ che chở rất lớn.\n\n` +
          `Nếu bạn mơ thấy nước lớn hay gặp lại người thân đã khuất, đó là lời nhắc nhở hướng về gia đình và chú trọng ngày giỗ chạp gia tiên. Vào ngày rằm mùng một, hãy trích một phần lợi nhuận để **phóng sinh chim, cá** và làm việc thiện.\n\n` +
          `### 📋 BẢNG CẨM NANG HÀNH ĐỘNG TOÀN DIỆN 5 TRỤ CỘT:\n` +
          `1. **Tài Chính:** Giữ đòn bẩy dưới 40%, rút lãi chuyển sang đất thổ cư sổ đỏ có pháp lý rõ ràng.\n` +
          `2. **Gia Đạo:** Nhường nhịn vợ, thực hành "3 Không - 3 Nên", lắng nghe 15 phút mỗi tối.\n` +
          `3. **Phong Thủy:** Kê bàn làm việc hướng Đông Bắc (Sinh Khí), đặt quả cầu Thạch Anh Tím chiêu tài.\n` +
          `4. **Thời Vận:** Nửa cuối năm 2026 khởi sắc mạnh, trạch cát giờ Thìn/Thân khi ký kết hợp đồng.\n` +
          `5. **Tâm Linh:** Thành tâm nhớ ơn tổ tiên, phóng sinh tích đức, giữ tâm trong sáng thì vạn sự hanh thông!`,
        createdAt: new Date(Date.now() - 3600000 * 2 + 155000).toISOString(),
      },
    ],
  };

  // Seed 2: Council session for a female chart needing Human Takeover
  const conv2: StoredConversation = {
    id: 'conv_council_tran_thi_bich',
    mode: 'COUNCIL_CONSULTATION',
    title: 'Hội Chẩn Lá Số: Trần Thị Bích (Canh Tý 2020 Nhuận)',
    agentId: THAY_MINH_TRIET.id || 'agent_minh_triet_id',
    agentSlug: 'thay-minh-triet',
    agentName: 'Thầy Minh Triết',
    participantSlugs: ['thay-minh-triet', 'thay-tam-an', 'thay-lac-viet'],
    customerName: 'Trần Thị Bích',
    customerGender: 'female',
    activeChartId: 'bich-2020',
    chartSummary: 'Trần Thị Bích · Nữ · 23/05/2020 (Canh Tý Nhuận Tháng 4) · Bích Thượng Thổ',
    status: 'HUMAN_TAKEOVER',
    summary: 'Chị Bích có con gái sinh tháng nhuận Canh Tý 2020, thắc mắc về cách an sao và đặt tên ngũ hành khuyết thiếu.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
    messages: [
      {
        id: 'msg_c2_1',
        role: 'user',
        senderName: 'Trần Thị Bích',
        senderBadge: 'Đương số Nữ',
        audioUrl: '/audio/cache/dialogue_bich_2020_msg_c2_1.mp3',
        audioDuration: 13.5,
        content: 'Con gái tôi sinh vào tháng 4 nhuận năm Canh Tý 2020, nghe nói sinh tháng nhuận thì cách an sao Tử Vi và Tứ Trụ khác người bình thường. Nhờ Quý Thầy hội chẩn xem cháu khuyết hành gì và sau này học hành ra sao?',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'msg_c2_2',
        role: 'assistant',
        senderAgentSlug: 'thay-minh-triet',
        senderName: 'Thầy Minh Triết',
        senderAvatar: '/icons/agents/thay-minh-triet.svg',
        senderBadge: 'Chủ trì - Tổng Quan Tử Vi',
        audioUrl: '/audio/cache/dialogue_bich_2020_msg_c2_2.mp3',
        audioDuration: 20.8,
        content:
          'Chào chị Bích! Về tháng sinh nhuận, thuật an sao Nam Phái lấy mốc tiết khí và ngày giữa tháng để phân định. Cháu bé sinh ngày 23/05/2020 nhằm ngày mùng 1 tháng 4 nhuận, Mệnh Thổ, cách cục thanh tú có sao Văn Xương, Văn Khúc hội chiếu chủ về thông tuệ đĩnh ngộ...',
        createdAt: new Date(Date.now() - 3600000 * 5 + 15000).toISOString(),
      },
      {
        id: 'msg_c2_3',
        role: 'admin',
        content:
          'Chào chị Bích, Chuyên gia Trưởng ban Cố vấn XemBoi.vn đang trực tiếp tiếp quản buổi hội chẩn này để tra cứu chính xác bảng can chi tiết khí cho cháu bé...',
        senderName: 'Chuyên Viên Quản Trị Hệ Thống (Admin)',
        senderBadge: 'Admin Tiếp Quản',
        createdAt: new Date(Date.now() - 600000).toISOString(),
      },
    ],
  };

  // Seed 3: Single agent consultation (Nguyễn Văn An 1990)
  const conv3: StoredConversation = {
    id: 'conv_single_nguyen_van_an',
    mode: 'SINGLE_AGENT',
    title: 'Tư Vấn 1-1: Nguyễn Văn An (Canh Ngọ 1990)',
    agentId: THAY_THAI_SON.id || 'agent_thai_son_id',
    agentSlug: 'thay-thai-son',
    agentName: 'Thầy Thái Sơn',
    participantSlugs: ['thay-thai-son'],
    customerName: 'Nguyễn Văn An',
    customerGender: 'male',
    activeChartId: 'an-1990',
    chartSummary: 'Nguyễn Văn An · Nam · 15/06/1990 (Canh Ngọ) · Lộ Bàng Thổ',
    status: 'ACTIVE',
    summary: 'Khách hỏi về cung Quan Lộc và thời điểm thích hợp để mở văn phòng đại diện trong năm 2026.',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 120000).toISOString(),
    messages: [
      {
        id: 'msg_c3_1',
        role: 'user',
        content: 'Thầy Thái Sơn xem giúp con cung Quan Lộc năm 2026 này có thuận lợi để mở thêm chi nhánh công ty không Thầy?',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
      {
        id: 'msg_c3_2',
        role: 'assistant',
        senderAgentSlug: 'thay-thai-son',
        senderName: 'Thầy Thái Sơn',
        senderAvatar: '/icons/agents/thay-thai-son.svg',
        senderBadge: 'Chuyên Gia Tài Lộc',
        content:
          'Chào bạn An! Tuổi Canh Ngọ 1990 gặp năm Bính Ngọ 2026 là năm đồng Chi (Ngọ gặp Ngọ). Cung Quan Lộc của bạn có Thiên Khôi và Hóa Quyền hội chiếu, rất vượng về danh tiếng nhưng cần chọn tháng 6 hoặc tháng 9 Âm lịch để khai trương đón cát khí...',
        createdAt: new Date(Date.now() - 3600000 * 1 + 20000).toISOString(),
      },
    ],
  };

  memoryConversations.set(conv1.id, conv1);
  memoryConversations.set(conv2.id, conv2);
  memoryConversations.set(conv3.id, conv3);
}

// ==========================================
// STORE INTERFACE FUNCTIONS
// ==========================================

export async function listConversations(filter?: {
  mode?: 'SINGLE_AGENT' | 'COUNCIL_CONSULTATION';
  status?: string;
  tab?: 'all' | 'council' | 'live' | 'takeover';
}): Promise<StoredConversation[]> {
  initSeedConversations();

  // Try database fetch if PostgreSQL is reachable
  try {
    const whereClause: any = {};
    if (filter?.mode) whereClause.mode = filter.mode;
    if (filter?.status) whereClause.status = filter.status;

    if (filter?.tab === 'council') {
      whereClause.mode = 'COUNCIL_CONSULTATION';
    } else if (filter?.tab === 'takeover') {
      whereClause.status = 'HUMAN_TAKEOVER';
    } else if (filter?.tab === 'live') {
      whereClause.status = { in: ['ACTIVE', 'COUNCIL_DEBATING'] };
    }

    const dbRows = await prisma.chatConversation.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    if (dbRows && dbRows.length > 0) {
      return dbRows.map((row) => ({
        id: row.id,
        mode: (row.mode as any) || 'SINGLE_AGENT',
        title: row.title || 'Hội thoại tư vấn',
        agentId: row.agentId,
        agentSlug: 'thay-minh-triet',
        agentName: 'Thầy Minh Triết',
        participantSlugs: row.participantSlugs || [],
        customerId: row.customerId,
        customerName: 'Khách Hàng',
        activeChartId: row.activeChartId,
        status: (row.status as any) || 'ACTIVE',
        summary: row.summary,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        messages: row.messages.map((m) => ({
          id: m.id,
          role: m.role as any,
          content: m.content,
          senderAgentSlug: m.senderAgentSlug || undefined,
          senderName: m.senderName || undefined,
          senderAvatar: m.senderAvatar || undefined,
          senderBadge: m.senderBadge || undefined,
          audioUrl: (m as any).audioUrl || undefined,
          audioDuration: (m as any).audioDuration || undefined,
          createdAt: m.createdAt.toISOString(),
        })),
      }));
    }
  } catch {
    // Database offline fallback to memoryConversations
  }

  // Fallback to in-memory store
  let list = Array.from(memoryConversations.values());

  if (filter?.tab === 'council') {
    list = list.filter((c) => c.mode === 'COUNCIL_CONSULTATION');
  } else if (filter?.tab === 'takeover') {
    list = list.filter((c) => c.status === 'HUMAN_TAKEOVER');
  } else if (filter?.tab === 'live') {
    list = list.filter((c) => c.status === 'ACTIVE' || c.status === 'COUNCIL_DEBATING');
  } else if (filter?.mode) {
    list = list.filter((c) => c.mode === filter.mode);
  }

  list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return list;
}

export async function getConversationById(id: string): Promise<StoredConversation | null> {
  initSeedConversations();

  // Try DB first
  try {
    const row = await prisma.chatConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (row) {
      return {
        id: row.id,
        mode: (row.mode as any) || 'SINGLE_AGENT',
        title: row.title || 'Hội thoại tư vấn',
        agentId: row.agentId,
        agentSlug: 'thay-minh-triet',
        agentName: 'Thầy Minh Triết',
        participantSlugs: row.participantSlugs || [],
        customerId: row.customerId,
        customerName: 'Khách Hàng',
        activeChartId: row.activeChartId,
        status: (row.status as any) || 'ACTIVE',
        summary: row.summary,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        messages: row.messages.map((m) => ({
          id: m.id,
          role: m.role as any,
          content: m.content,
          senderAgentSlug: m.senderAgentSlug || undefined,
          senderName: m.senderName || undefined,
          senderAvatar: m.senderAvatar || undefined,
          senderBadge: m.senderBadge || undefined,
          audioUrl: (m as any).audioUrl || undefined,
          audioDuration: (m as any).audioDuration || undefined,
          createdAt: m.createdAt.toISOString(),
        })),
      };
    }
  } catch {}

  // Fallback memory
  return memoryConversations.get(id) || null;
}

export async function upsertConversation(conv: StoredConversation): Promise<StoredConversation> {
  initSeedConversations();
  conv.updatedAt = new Date().toISOString();
  memoryConversations.set(conv.id, conv);

  // Try to write to DB if online
  try {
    await prisma.chatConversation.upsert({
      where: { id: conv.id },
      create: {
        id: conv.id,
        mode: conv.mode,
        title: conv.title,
        agentId: conv.agentId,
        participantSlugs: conv.participantSlugs,
        activeChartId: conv.activeChartId,
        status: conv.status,
        summary: conv.summary,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
      },
      update: {
        mode: conv.mode,
        title: conv.title,
        participantSlugs: conv.participantSlugs,
        status: conv.status,
        summary: conv.summary,
        updatedAt: new Date(conv.updatedAt),
      },
    });
  } catch {}

  return conv;
}

export async function addMessageToConversation(
  conversationId: string,
  message: StoredMessage
): Promise<StoredMessage> {
  initSeedConversations();
  const conv = memoryConversations.get(conversationId);
  if (conv) {
    conv.messages.push(message);
    conv.updatedAt = new Date().toISOString();
  }

  // Try DB append
  try {
    await prisma.chatMessage.create({
      data: {
        id: message.id,
        conversationId,
        role: message.role,
        content: message.content,
        senderAgentSlug: message.senderAgentSlug,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
        senderBadge: message.senderBadge,
        audioUrl: message.audioUrl,
        audioDuration: message.audioDuration,
        createdAt: new Date(message.createdAt),
      },
    });

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  } catch {}

  return message;
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'ACTIVE' | 'COUNCIL_DEBATING' | 'HUMAN_TAKEOVER' | 'CLOSED'
): Promise<boolean> {
  initSeedConversations();
  const conv = memoryConversations.get(conversationId);
  if (conv) {
    conv.status = status;
    conv.updatedAt = new Date().toISOString();
  }

  try {
    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { status, updatedAt: new Date() },
    });
  } catch {}

  return true;
}
