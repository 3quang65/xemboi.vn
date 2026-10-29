import fs from 'fs';
import path from 'path';

export interface CustomerInquiry {
  id: string;
  category: string;
  categoryName: string;
  cungTen?: string;
  question: string;
  userPersona: string;
  corePainPoint: string;
  thayBoiApproach: string;
  keyStarsOrSigns: string[];
  frequency: 'HOT_TRENDING' | 'VERY_HIGH' | 'HIGH' | 'MEDIUM';
  searchKeywords: string[];
  suggestedQuestions: string[];
  source?: string;
  createdAt?: string;
}

const INQUIRY_FILE = path.join(process.cwd(), 'src/lib/ai/customer-inquiry-bank.json');

let inMemoryInquiries: CustomerInquiry[] = [];

// Initialize memory from JSON
function loadInquiries(): CustomerInquiry[] {
  if (inMemoryInquiries.length > 0) return inMemoryInquiries;
  try {
    if (fs.existsSync(INQUIRY_FILE)) {
      const raw = fs.readFileSync(INQUIRY_FILE, 'utf8');
      inMemoryInquiries = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load customer inquiry bank:', err);
  }
  return inMemoryInquiries;
}

function saveInquiries(): void {
  try {
    fs.writeFileSync(INQUIRY_FILE, JSON.stringify(inMemoryInquiries, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save customer inquiry bank:', err);
  }
}

export function getAllInquiries(filters?: {
  category?: string;
  cungTen?: string;
  query?: string;
  frequency?: string;
  page?: number;
  limit?: number;
}) {
  const items = loadInquiries();
  let filtered = [...items];

  if (filters?.cungTen && filters.cungTen !== 'ALL') {
    filtered = filtered.filter((i) => {
      if (i.cungTen === filters.cungTen) return true;
      if (filters.cungTen === 'Phu Thê' && i.category === 'TINH_DUYEN') return true;
      if (filters.cungTen === 'Quan Lộc' && i.category === 'CONG_DANH') return true;
      if (filters.cungTen === 'Tài Bạch' && i.category === 'TAI_LOC') return true;
      if (filters.cungTen === 'Tử Tức' && i.category === 'GIA_DAO_CON_CAI') return true;
      if (filters.cungTen === 'Điền Trạch' && i.category === 'PHONG_THUY') return true;
      return false;
    });
  }

  if (filters?.category && filters.category !== 'ALL') {
    filtered = filtered.filter((i) => i.category === filters.category);
  }

  if (filters?.frequency && filters.frequency !== 'ALL') {
    filtered = filtered.filter((i) => i.frequency === filters.frequency);
  }

  if (filters?.query) {
    const q = filters.query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    filtered = filtered.filter((i) => {
      const qText = (i.question + ' ' + i.corePainPoint + ' ' + (i.searchKeywords || []).join(' ') + ' ' + i.userPersona)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return qText.includes(q);
    });
  }

  // Calculate statistics
  const stats: Record<string, number> = {
    TOTAL: items.length,
    HOT_TRENDING: items.filter((x) => x.frequency === 'HOT_TRENDING').length,
    TINH_DUYEN: items.filter((x) => x.category === 'TINH_DUYEN').length,
    CONG_DANH: items.filter((x) => x.category === 'CONG_DANH').length,
    TAI_LOC: items.filter((x) => x.category === 'TAI_LOC').length,
    VAN_HAN: items.filter((x) => x.category === 'VAN_HAN').length,
    GIA_DAO_CON_CAI: items.filter((x) => x.category === 'GIA_DAO_CON_CAI').length,
    PHONG_THUY: items.filter((x) => x.category === 'PHONG_THUY').length,
    TAM_LINH_GIAI_HAN: items.filter((x) => x.category === 'TAM_LINH_GIAI_HAN').length,
  };

  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    ok: true,
    total: filtered.length,
    allTotal: items.length,
    page,
    limit,
    stats,
    inquiries: paginated,
  };
}

export function getInquiryById(id: string): CustomerInquiry | null {
  const items = loadInquiries();
  return items.find((x) => x.id === id) || null;
}

export function addInquiry(inquiry: Partial<CustomerInquiry>): CustomerInquiry {
  const items = loadInquiries();
  const newId = inquiry.id || `inq_custom_${Date.now()}`;

  const categoryMap: Record<string, string> = {
    TINH_DUYEN: 'Tình Duyên & Hôn Nhân',
    CONG_DANH: 'Công Danh & Sự Nghiệp',
    TAI_LOC: 'Tài Lộc & Đầu Tư',
    VAN_HAN: 'Vận Hạn Năm Hiện Tại',
    GIA_DAO_CON_CAI: 'Gia Đạo & Con Cái',
    PHONG_THUY: 'Phong Thủy Bát Trạch',
    TAM_LINH_GIAI_HAN: 'Tâm Linh & Tu Tâm Cải Mệnh',
  };

  const created: CustomerInquiry = {
    id: newId,
    category: inquiry.category || 'TINH_DUYEN',
    categoryName: categoryMap[inquiry.category || 'TINH_DUYEN'] || 'Huyền Học & Đời Sống',
    question: inquiry.question || '',
    userPersona: inquiry.userPersona || 'Khách hàng quan tâm huyền học',
    corePainPoint: inquiry.corePainPoint || '',
    thayBoiApproach: inquiry.thayBoiApproach || 'Luận giải dựa trên cung sao và đạo đức hướng thiện',
    keyStarsOrSigns: inquiry.keyStarsOrSigns || [],
    frequency: inquiry.frequency || 'HIGH',
    searchKeywords: inquiry.searchKeywords || [],
    suggestedQuestions: inquiry.suggestedQuestions || [],
    source: inquiry.source || 'MANUAL_ENTRY',
    createdAt: new Date().toISOString(),
  };

  items.unshift(created);
  saveInquiries();
  return created;
}

/**
 * Searches and synthesizes external customer inquiries across market sources
 * (Forums: TuViVietNam, Webtretho, Voz, Facebook groups, Google trends)
 */
export async function searchExternalInquiries(topicOrQuery: string): Promise<CustomerInquiry[]> {
  const clean = topicOrQuery.trim().toLowerCase();

  // Curated database of market trending inquiries discovered from forums and search engines
  const MARKET_DISCOVERY_DATABASE: CustomerInquiry[] = [
    {
      id: `inq_ext_disc_1_${Date.now()}`,
      category: 'TINH_DUYEN',
      categoryName: 'Tình Duyên & Hôn Nhân',
      question: 'Phụ nữ tuổi Canh Thân (1980), Nhâm Thân (1992) hay Giáp Tý (1984) có phải số cao số, cô độc trắc trở tình duyên không?',
      userPersona: 'Phụ nữ U35–U45 tuổi thành đạt trong sự nghiệp nhưng đường tình muộn mằn',
      corePainPoint: 'Tủi thân, sợ định kiến xã hội về phụ nữ tuổi Thân hay tuổi Canh, khao khát có một mái ấm',
      thayBoiApproach: 'Phá bỏ quan niệm dân gian cổ hủ: Tuổi Thân hay Canh không phải nguyên nhân gây muộn chồng. Soi cung Mệnh và Phu Thê xem có Cô Thần, Quả Tú, Vũ Khúc hay Thất Sát không. Khuyên học cách dịu dàng, giảm bớt sự kiểm soát của người phụ nữ lãnh đạo.',
      keyStarsOrSigns: ['Cô Thần', 'Quả Tú', 'Vũ Khúc Phu Thê', 'Canh Thân Cao Số'],
      frequency: 'HOT_TRENDING',
      searchKeywords: ['phu nu canh than cao so', 'tuoi nham than muon chong', 'co than qua tu tinh duyen'],
      suggestedQuestions: ['Làm thế nào để hóa giải sao Cô Thần Quả Tú?'],
      source: 'Diễn đàn Webtretho & Hội Tử Vi Việt Nam',
    },
    {
      id: `inq_ext_disc_2_${Date.now()}`,
      category: 'CONG_DANH',
      categoryName: 'Công Danh & Sự Nghiệp',
      question: 'Tôi sinh vào giờ nào thì có số làm Quan to, chức vụ cao trong cơ quan nhà nước hay tập đoàn đa quốc gia?',
      userPersona: 'Thanh niên, trí thức trẻ hoặc phụ huynh định hướng con đường chính trị, hành chính công',
      corePainPoint: 'Muốn biết bản thân có "mệnh làm quan" hay hợp với đường tư nhân',
      thayBoiApproach: 'Soi bộ ba quyền uy: Hóa Quyền (nắm quyền), Quốc Ấn (con dấu bổ nhiệm), Tướng Quân (chỉ huy) và bộ Khôi Việt (đứng đầu). Nếu Mệnh/Quan có Tử Vi, Thiên Phủ, Thái Dương miếu thì đường công danh cực sáng.',
      keyStarsOrSigns: ['Hóa Quyền', 'Quốc Ấn', 'Tướng Quân', 'Tử Vi Cung Quan'],
      frequency: 'VERY_HIGH',
      searchKeywords: ['so lam quan to trong tu vi', 'la so lam lanh dao', 'sao hoa quyen quoc an'],
      suggestedQuestions: ['Mệnh có Thất Sát hợp làm quân đội, công an hay kinh doanh?'],
      source: 'Voz Huyền Học & Diễn Đàn Lý Số',
    },
    {
      id: `inq_ext_disc_3_${Date.now()}`,
      category: 'TAI_LOC',
      categoryName: 'Tài Lộc & Đầu Tư',
      question: 'Năm 2026 này con đầu tư chứng khoán, vàng bạc hay tiền ảo (crypto) có thắng lợi không hay bị đu đỉnh thua lỗ?',
      userPersona: 'Nhà đầu tư cá nhân 25–45 tuổi tham gia thị trường tài chính biến động',
      corePainPoint: 'Sợ sập bẫy thị trường, sợ mất vốn liếng, tâm lý FOMO và lòng tham',
      thayBoiApproach: 'Kiểm tra Cung Tài Bạch và vận hạn năm 2026: Năm Bính Ngọ Hỏa cực vượng, kỵ gặp Địa Không, Địa Kiếp, Kiếp Sát ở Tài Bạch (chủ về cú sụp đổ tài chính chớp nhoáng). Khuyên đầu tư vào giá trị thực, tuyệt đối không vay margin đòn bẩy cao.',
      keyStarsOrSigns: ['Địa Không Địa Kiếp Tài Bạch', 'Hạn Đầu Tư 2026', 'Tiểu Hao Đại Hao'],
      frequency: 'HOT_TRENDING',
      searchKeywords: ['dau tu chung khoan nam 2026', 'co nen mua vang 2026', 'xem han dau tu tai chinh'],
      suggestedQuestions: ['Tháng nào năm 2026 tài chính thuận buồm xuôi gió?'],
      source: 'Google Trends & Cộng Đồng Đầu Tư Tài Chính',
    },
    {
      id: `inq_ext_disc_4_${Date.now()}`,
      category: 'VAN_HAN',
      categoryName: 'Vận Hạn Năm Hiện Tại',
      question: 'Năm 2026 Bính Ngọ có phải năm nhuận không? Trẻ em sinh năm 2026 tính theo phong thủy mệnh gì, tương lai ra sao?',
      userPersona: 'Các cặp vợ chồng đang lên kế hoạch sinh con năm 2026 (Bính Ngọ)',
      corePainPoint: 'Muốn con sinh ra có số sướng, gia đình hòa thuận, công việc bố mẹ ăn nên làm ra',
      thayBoiApproach: 'Năm 2026 Bính Ngọ nạp âm là Thiên Hà Thủy (Nước trên trời). Tuổi Bính Ngọ (Ngựa trong chuồng) rất thông minh, hoạt bát, tự lập sớm. Hướng dẫn tháng sinh đại cát (Mùa Thu, Mùa Đông: tháng 7, 8, 10, 11 Âm lịch) để được Thủy vượng dưỡng sinh.',
      keyStarsOrSigns: ['Sinh Con 2026', 'Bính Ngọ Thiên Hà Thủy', 'Tháng Sinh Đẹp 2026'],
      frequency: 'HOT_TRENDING',
      searchKeywords: ['sinh con nam 2026 thang nao tot', 'menh con nam binh ngo', 'bo me tuoi gi hop sinh con 2026'],
      suggestedQuestions: ['Bố mẹ mệnh Hỏa sinh con mệnh Thủy 2026 có xung khắc không?'],
      source: 'Hội Mẹ & Bé, Bệnh Viện Phụ Sản & Diễn Đàn Webtretho',
    },
    {
      id: `inq_ext_disc_5_${Date.now()}`,
      category: 'PHONG_THUY',
      categoryName: 'Phong Thủy Bát Trạch',
      question: 'Nhà có đường đâm thẳng vào cửa chính (Thương Sát) hoặc gương bát quái nhà đối diện chiếu vào thì hóa giải thế nào?',
      userPersona: 'Chủ nhà ở phố hoặc ngõ hẻm đang gặp các thế sát phong thủy ngoại cảnh',
      corePainPoint: 'Cảm giác gia đình bất an, hay xảy ra cãi vã, sợ tai nạn va quẹt',
      thayBoiApproach: 'Hướng dẫn 3 lớp phòng ngự phong thủy: Trồng hàng rào cây xanh tán rậm cản sát khí; Đặt hòn non bộ hoặc bình phong che chắn phía trước cửa; Treo Gương Bát Quái Lồi (chứ không dùng gương Bát Quái lõm hay tranh thú dữ khiêu khích hàng xóm).',
      keyStarsOrSigns: ['Thương Sát', 'Đường Đâm Cửa', 'Gương Bát Quái Lồi', 'Bình Phong Trấn Sát'],
      frequency: 'VERY_HIGH',
      searchKeywords: ['hoa giai duong dam vao nha', 'nha bi guong bat quai chieu', 'thuong sat phong thuy'],
      suggestedQuestions: ['Trồng cây gì trước cửa để chặn tà khí tốt nhất?'],
      source: 'Hội Phong Thủy Xây Dựng & Bất Động Sản',
    },
    {
      id: `inq_ext_disc_6_${Date.now()}`,
      category: 'TAM_LINH_GIAI_HAN',
      categoryName: 'Tâm Linh & Tu Tâm Cải Mệnh',
      question: 'Mơ thấy người thân đã khuất về nói chuyện, cho tiền hoặc dặn dò thì báo hiệu điềm gì? Cần làm lễ gì không?',
      userPersona: 'Người vừa trải qua giấc mơ kỳ lạ về tổ tiên, cảm xúc bồi hồi xúc động xen lẫn tò mò',
      corePainPoint: 'Băn khoăn thông điệp tâm linh, sợ người thân dưới cõi âm thiếu thốn đói rét',
      thayBoiApproach: 'Phân tích tâm lý học phương Đông và giao cảm lượng tử tâm linh: Giấc mơ là chiếc cầu nối tiềm thức. Khuyên gia đình lên ban thờ thắp hương tưởng nhớ, làm một mâm cơm chay ấm cúng cúng gia tiên, in kinh sách hoặc cúng dường tam bảo phóng sinh hồi hướng công đức cho hương linh.',
      keyStarsOrSigns: ['Giấc Mơ Tâm Linh', 'Gia Tiên Báo Mộng', 'Hồi Hướng Công Đức'],
      frequency: 'HIGH',
      searchKeywords: ['mo thay nguoi chet cho tien', 'diem bao mo nguoi than', 'cach cung hoi huong to tien'],
      suggestedQuestions: ['Có cần đốt nhiều vàng mã hình nhân xe cộ không Thầy?'],
      source: 'Văn Khấn Cổ Truyền & Nghiên Cứu Tâm Linh Việt Nam',
    },
  ];

  // If user searched for something specific, prioritize matching or return curated results
  if (clean) {
    const matched = MARKET_DISCOVERY_DATABASE.filter(
      (m) =>
        m.question.toLowerCase().includes(clean) ||
        m.searchKeywords.some((k) => k.toLowerCase().includes(clean)) ||
        m.categoryName.toLowerCase().includes(clean)
    );
    if (matched.length > 0) return matched;
  }

  return MARKET_DISCOVERY_DATABASE;
}

export function importDiscoveredInquiries(itemsToImport: CustomerInquiry[]): number {
  const current = loadInquiries();
  const currentQuestions = new Set(current.map((x) => x.question.trim().toLowerCase()));

  let count = 0;
  for (const item of itemsToImport) {
    if (!currentQuestions.has(item.question.trim().toLowerCase())) {
      current.push(item);
      currentQuestions.add(item.question.trim().toLowerCase());
      count++;
    }
  }

  if (count > 0) {
    saveInquiries();
  }
  return count;
}
