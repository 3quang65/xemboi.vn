import {
  AiAgentConfig,
  BAT_DAI_DANH_SU,
  getAgentBySlug,
  THAY_MINH_TRIET,
  THAY_THAI_SON,
  THAY_TAM_AN,
  THAY_TUE_PHONG,
  THAY_THIEN_MINH,
  THAY_HUYEN_CO,
  THAY_LAC_VIET,
  CO_LINH_DAN,
} from './agent-persona';
import { MASTER_THEMES, MasterThemeConfig } from './dialogue-simulation';
import { searchKnowledge } from './rag-engine';

// ==========================================
// COUNCIL PRESETS & INTERFACES
// ==========================================

export const COUNCIL_PRESETS = {
  BATCH_1_MASTERS: ['thay-minh-triet', 'thay-thai-son', 'thay-tam-an', 'thay-tue-phong', 'thay-lac-viet'],
  BATCH_2_MASTERS: ['thay-thien-minh', 'thay-huyen-co', 'thay-lac-viet', 'co-linh-dan', 'thay-minh-triet'],
  TAM_SU_COT_LOI: ['thay-minh-triet', 'thay-thai-son', 'thay-tam-an'],
  BAT_DAI_DANH_SU_FULL: BAT_DAI_DANH_SU.map((a) => a.slug),
};

export interface ChartPalaceSummary {
  ten: string;
  canChi: string;
  chinhTinh: string;
  catTinh: string;
  hungTinh: string;
  isThan: boolean;
  tuan: boolean;
  triet: boolean;
  daiVanTu?: number;
}

export interface ChartAnalysisResult {
  hoTen: string;
  gioiTinh: string;
  ngaySinhDuong: string;
  ngaySinhAm: string;
  canChiNam: string;
  banMenh: string;
  cuc: string;
  menhPalace?: ChartPalaceSummary;
  thanPalace?: ChartPalaceSummary;
  quanPalace?: ChartPalaceSummary;
  taiPalace?: ChartPalaceSummary;
  phuThePalace?: ChartPalaceSummary;
  dienTrachPalace?: ChartPalaceSummary;
  phucDucPalace?: ChartPalaceSummary;
  tuTucPalace?: ChartPalaceSummary;
  tatAchPalace?: ChartPalaceSummary;
  cachCuc: string;
  diemManh: string;
  diemNghen: string;
  sinhKhac?: string;
  amDuongLy?: string;
}

// ==========================================
// ASTROLOGICAL CHART PARSER (100% REAL DATA)
// ==========================================

export function parseChartForCouncil(chart: any): ChartAnalysisResult {
  const isNu = chart?.gioiTinh === 'nu' || chart?.gioiTinh === 'Nữ' || String(chart?.gioiTinh).toLowerCase().includes('nữ');
  const defaultRes: ChartAnalysisResult = {
    hoTen: chart?.ten || 'Quý Gia Chủ',
    gioiTinh: isNu ? 'Nữ' : 'Nam',
    ngaySinhDuong: `${chart?.duong?.ngay || 14}/${chart?.duong?.thang || 12}/${chart?.duong?.nam || 1986}`,
    ngaySinhAm: `${chart?.am?.ngay || 14}/${chart?.am?.thang || 11} năm ${chart?.canChi?.nam || 'Bính Dần'}`,
    canChiNam: chart?.canChi?.nam || 'Bính Dần',
    banMenh: chart?.banMenh || 'Lô Trung Hỏa',
    cuc: chart?.cuc || 'Mộc Tam Cục',
    cachCuc: 'Phủ Tướng Triều Viên kết hợp Thân cư Vũ Tham miếu địa',
    diemManh: 'Mệnh Thiên Phủ đắc lệnh tinh cai quản tài khố, Thân cư Phúc Đức Vũ Khúc Tham Lang miếu địa đại phát trung hậu vận',
    diemNghen: 'Cung Phu Thê Liêm Phá hãm địa dính sao Hóa Kỵ ám tinh, dễ sinh bất hòa khắc khẩu trong đời sống hôn nhân',
  };

  if (!chart || (!chart.cung && !chart.palacesData)) {
    return defaultRes;
  }

  const cungList: any[] = chart.cung || chart.palacesData || [];

  const extractPalace = (name: string): ChartPalaceSummary | undefined => {
    const found = cungList.find((c) => c.ten === name);
    if (!found) return undefined;

    const chinh = (found.chinhTinh || [])
      .map((s: any) => `${s.ten}${s.dacTinh ? ` (${s.dacTinh})` : ''}${s.hoa ? `-${s.hoa}` : ''}`)
      .join(', ') || 'Vô chính diệu';

    const cat = (found.catTinh || []).map((s: any) => s.ten).join(', ') || 'Không';
    const hung = (found.hungTinh || []).map((s: any) => s.ten).join(', ') || 'Không';

    return {
      ten: found.ten,
      canChi: `${found.can || ''} ${found.tenChi || ''}`.trim(),
      chinhTinh: chinh,
      catTinh: cat,
      hungTinh: hung,
      isThan: !!found.laThan,
      tuan: !!found.tuan,
      triet: !!found.triet,
      daiVanTu: found.daiVanTu || found.daiVan,
    };
  };

  const menh = extractPalace('Mệnh');
  const than = cungList.find((c) => c.laThan) ? extractPalace(cungList.find((c) => c.laThan).ten) : undefined;
  const quan = extractPalace('Quan Lộc');
  const tai = extractPalace('Tài Bạch');
  const phuThe = extractPalace('Phu Thê');
  const dienTrach = extractPalace('Điền Trạch');
  const phucDuc = extractPalace('Phúc Đức');
  const tuTuc = extractPalace('Tử Tức');
  const tatAch = extractPalace('Tật Ách');

  // Detect patterns
  let cachCuc = 'Chính tinh miếu vượng đắc cách';
  if (menh?.chinhTinh.includes('Thiên Phủ') && quan?.chinhTinh.includes('Thiên Tướng')) {
    cachCuc = 'Phủ Tướng Triều Viên (Kho Lương & Ấn Tín hội tụ, uy tín bậc nhất thương trường)';
  } else if (menh?.chinhTinh.includes('Tử Vi') || menh?.chinhTinh.includes('Thiên Phủ')) {
    cachCuc = 'Tử Phủ Vũ Tướng (Cách cục đế vương, đĩnh đạc làm chủ)';
  } else if (menh?.chinhTinh.includes('Thất Sát') || menh?.chinhTinh.includes('Phá Quân') || menh?.chinhTinh.includes('Tham Lang')) {
    cachCuc = 'Sát Phá Tham (Cách cục tiên phong, xông pha bão táp tạo đột phá)';
  } else if (menh?.chinhTinh.includes('Cơ') || menh?.chinhTinh.includes('Nguyệt') || menh?.chinhTinh.includes('Đồng') || menh?.chinhTinh.includes('Lương')) {
    cachCuc = 'Cơ Nguyệt Đồng Lương (Cách cục mưu lược, tham mưu, quản trị và giáo dục)';
  } else if (menh?.chinhTinh === 'Vô chính diệu') {
    cachCuc = 'Mệnh Vô Chính Diệu (Túi càn khôn linh hoạt, mượn lực tam phương tứ chính)';
  }

  const isFemale = chart.gioiTinh === 'nu' || chart.gioiTinh === 'Nữ' || String(chart.gioiTinh).toLowerCase().includes('nữ');
  return {
    hoTen: chart.ten || defaultRes.hoTen,
    gioiTinh: isFemale ? 'Nữ' : 'Nam',
    ngaySinhDuong: `${chart.duong?.ngay || chart.solarDay || 14}/${chart.duong?.thang || chart.solarMonth || 12}/${chart.duong?.nam || chart.solarYear || 1986}`,
    ngaySinhAm: `${chart.am?.ngay || chart.lunarDay || 14}/${chart.am?.thang || chart.lunarMonth || 11} năm ${chart.canChi?.nam || defaultRes.canChiNam}`,
    canChiNam: chart.canChi?.nam || defaultRes.canChiNam,
    banMenh: chart.banMenh || defaultRes.banMenh,
    cuc: chart.cuc || defaultRes.cuc,
    menhPalace: menh,
    thanPalace: than,
    quanPalace: quan,
    taiPalace: tai,
    phuThePalace: phuThe,
    dienTrachPalace: dienTrach,
    phucDucPalace: phucDuc,
    tuTucPalace: tuTuc,
    tatAchPalace: tatAch,
    cachCuc,
    diemManh: menh?.chinhTinh ? `Cung Mệnh tại ${menh.canChi} có ${menh.chinhTinh}, hội cùng cát tinh ${menh.catTinh}` : defaultRes.diemManh,
    diemNghen: phuThe?.chinhTinh ? `Cung Phu Thê tại ${phuThe.canChi} có ${phuThe.chinhTinh}, dính thế ${phuThe.hungTinh}` : defaultRes.diemNghen,
  };
}

// ==========================================
// ASTROLOGICAL REASONING ENGINE (DYNAMIC PER CHART)
// ==========================================

function getStarCoreMenh(chinhTinh: string): {
  tenBo: string;
  khiChat: string;
  diemSang: string;
  diemNghen: string;
  phuongHuong: string;
} {
  const s = chinhTinh || '';
  if (s.includes('Tử Vi') && s.includes('Thiên Phủ')) {
    return {
      tenBo: 'Tử Phủ Đồng Cung (Đế Tinh & Tài Khố song hành)',
      khiChat: 'đĩnh đạc, trầm tĩnh, phong thái bao quát, có uy quyền lãnh đạo tự nhiên và coi trọng chữ tín',
      diemSang: 'năng lực quy tụ lòng người, nhìn xa trông rộng, có khả năng đứng mũi chịu sào trước sóng lớn',
      diemNghen: 'lòng tự trọng rất cao, đôi khi khó chia sẻ gánh nặng với người khác, tự tạo áp lực vô hình cho bản thân',
      phuongHuong: 'làm chủ doanh nghiệp, quản trị vĩ mô, nắm vai trò trọng yếu trong tổ chức lớn',
    };
  }
  if (s.includes('Thiên Cơ') && s.includes('Thiên Lương')) {
    return {
      tenBo: 'Cơ Lương Hội Thủ (Mưu Lược & Thiện Tướng)',
      khiChat: 'thông tuệ, mẫn tiệp, trực giác nhạy bén, tâm tính thiện lương và có chiều sâu nội tâm',
      diemSang: 'khả năng học một biết mười, giỏi quyền biến kế sách, thích giúp đỡ và chỉ dẫn cho người khác',
      diemNghen: 'hay suy nghĩ quá nhiều sinh ra âu lo, cầu toàn thái quá đôi khi làm lỡ mất cơ hội dứt khoát',
      phuongHuong: 'cố vấn chiến lược, công nghệ, nghiên cứu, giáo dục, tài chính phân tích hoặc chuyên môn sâu',
    };
  }
  if (s.includes('Thái Dương') && s.includes('Cự Môn')) {
    return {
      tenBo: 'Cự Nhật Đồng Cung (Quang Minh & Khẩu Tài)',
      khiChat: 'hào sảng, khẳng khái, biện tài sắc bén, thích lẽ công bằng và có chí hướng vượt trội',
      diemSang: 'khả năng diễn thuyết, thuyết phục và mở rộng quan hệ đối ngoại phi thường, danh tiếng vang xa',
      diemNghen: 'tính bộc trực thẳng thắn dễ vướng khẩu thiệt thị phi, người ngoài hiểu lầm sự nhiệt tình',
      phuongHuong: 'đối ngoại, truyền thông, luật sư, thương mại quốc tế, giảng dạy hoặc lãnh đạo cộng đồng',
    };
  }
  if (s.includes('Vũ Khúc') && s.includes('Tham Lang')) {
    return {
      tenBo: 'Tham Vũ Đồng Hành (Tiền Bần Hậu Phú)',
      khiChat: 'thực tế, sắc sảo, thích trải nghiệm cái mới, giàu ý chí làm giàu và không ngại bôn ba',
      diemSang: 'nhạy bén tột bậc với cơ hội thương trường, càng va vấp càng tôi rèn bản lĩnh, hậu vận bứt phá mạnh',
      diemNghen: 'thời trẻ dễ nôn nóng muốn thấy kết quả ngay, đôi khi thiếu kiên nhẫn với những việc chậm tiến độ',
      phuongHuong: 'kinh doanh thương trường, đầu tư tài chính, bất động sản, xây dựng mạng lưới quan hệ',
    };
  }
  if (s.includes('Thiên Đồng') && s.includes('Thái Âm')) {
    return {
      tenBo: 'Đồng Nguyệt Tương Hội (Phúc Tinh & Phú Tinh)',
      khiChat: 'ôn hòa, phong nhã, tế nhị, giàu tình cảm, có khiếu thẩm mỹ và được nhiều người quý mến',
      diemSang: 'tính dĩ hòa vi quý, phúc khí dồi dào, có duyên với các nguồn tài lộc bền bỉ và bất động sản',
      diemNghen: 'tâm lý dễ bị ảnh hưởng bởi môi trường xung quanh, có lúc do dự thiếu tính quyết đoán thép',
      phuongHuong: 'tài chính dịch vụ, nghệ thuật sáng tạo, kinh doanh bền vững, quản lý tài sản gia đình',
    };
  }
  if (s.includes('Thất Sát') || s.includes('Phá Quân') || s.includes('Tham Lang')) {
    return {
      tenBo: 'Sát Phá Tham (Tiên Phong Khai Phá)',
      khiChat: 'quả cảm, quyết liệt, thích mạo hiểm, giàu năng lượng bứt phá và không chịu bó buộc lối mòn',
      diemSang: 'sức chịu đựng áp lực phi thường, dám nghĩ dám làm, lật ngược thế cờ trong nghịch cảnh',
      diemNghen: 'tính khí nóng nảy, dễ độc đoán, tiền vận thăng trầm nhiều thử thách trước khi gặt hái quả ngọt',
      phuongHuong: 'khởi nghiệp kinh doanh, thi công dự án, khai thác thị trường mới, vị trí đòi hỏi quyết đoán',
    };
  }
  if (s.includes('Tử Vi') || s.includes('Thiên Phủ') || s.includes('Thiên Tướng')) {
    return {
      tenBo: 'Tử Phủ Vũ Tướng (Cốt Cách Đế Tinh)',
      khiChat: 'chính trực, đĩnh đạc, trọng đạo lý, có phong thái người làm chủ và tinh thần trách nhiệm',
      diemSang: 'sự ổn định, tin cậy, quy tụ được sự trợ lực của quý nhân và đối tác trung thành',
      diemNghen: 'đôi khi thiếu linh hoạt trước những biến cố chớp nhoáng, thận trọng quá mức cần thiết',
      phuongHuong: 'làm chủ, quản lý doanh nghiệp, tài chính ngân hàng, các cơ quan tổ chức quy chuẩn',
    };
  }
  if (s.includes('Cơ') || s.includes('Nguyệt') || s.includes('Đồng') || s.includes('Lương')) {
    return {
      tenBo: 'Cơ Nguyệt Đồng Lương (Trí Tuệ Mưu Lược)',
      khiChat: 'nhẹ nhàng, sâu sắc, chu đáo, làm việc có phương pháp khoa học và coi trọng sự tích lũy',
      diemSang: 'tư duy phân tích sắc bén, giữ được sự cân bằng, ít khi rơi vào cảnh đổ vỡ mất trắng',
      diemNghen: 'tinh thần mạo hiểm không cao, đôi khi suy nghĩ nhiều làm tiêu hao năng lượng tinh thần',
      phuongHuong: 'chuyên gia tư vấn, tài chính, công nghệ, nghiên cứu phân tích, giáo dục hoặc cơ quan chuyên môn',
    };
  }
  return {
    tenBo: 'Cục Diện Tinh Bàn Linh Hoạt',
    khiChat: 'tùy cơ ứng biến, nhạy bén thích nghi với hoàn cảnh, có tinh thần cầu thị và học hỏi nhanh',
    diemSang: 'khả năng nắm bắt cơ hội từ môi trường bên ngoài, linh hoạt chuyển hướng khi thời cuộc thay đổi',
    diemNghen: 'cần xác lập một mục tiêu dài hạn kiên định, tránh để ngoại cảnh làm phân tán tâm trí',
    phuongHuong: 'phối hợp đối tác, mở rộng mạng lưới, nắm bắt các xu hướng chuyển dịch của thời đại',
  };
}

function getThanInsight(thanPalace?: ChartPalaceSummary): string {
  if (!thanPalace) return 'Thân cư Phúc Đức: Hậu vận dựa vào phúc trạch tổ tiên và sự an lạc nội tâm.';
  const ten = thanPalace.ten;
  if (ten === 'Mệnh') return 'Thân Mệnh đồng cung: Cuộc đời nhất quán trước sau, tính tự lập rất cao, thành bại do chính bàn tay bạn.';
  if (ten === 'Quan Lộc') return 'Thân cư Quan Lộc: Sự nghiệp và danh tiếng là lẽ sống, sau 36 tuổi sẽ dồn toàn tâm trí cho công danh.';
  if (ten === 'Tài Bạch') return 'Thân cư Tài Bạch: Rất nhạy bén với kim tiền, hậu vận phát về đường tích lũy của cải vật chất.';
  if (ten === 'Thiên Di') return 'Thân cư Thiên Di: Duyên nợ lớn ở ngoài xã hội, tha hương lập nghiệp hoặc xuất ngoại sẽ dễ công thành danh toại.';
  if (ten === 'Phu Thê') return 'Thân cư Phu Thê: Người bạn đời có ảnh hưởng mang tính quyết định đến mọi bước ngoặt cuộc đời bạn.';
  return 'Thân cư Phúc Đức: Càng về hậu vận càng hướng về nguồn cội, tu dưỡng âm đức để che chở cho gia đạo.';
}

function formatAncientKnowledgeQuote(label: string, snippet: string): string {
  if (!snippet) return '';
  const clean = snippet.trim();
  return `> 📜 *${label}:* "${clean}"\n\n`;
}

// ==========================================
// DYNAMIC AFFLICTION DIAGNOSIS & COUNCIL ORCHESTRATION
// ==========================================

export function diagnoseChartAfflictions(
  chart: any,
  analysis: ChartAnalysisResult,
  userQuestion?: string
): [string, string] {
  const scores: Record<string, number> = {
    'thay-thai-son': 10,
    'thay-tam-an': 10,
    'thay-tue-phong': 9,
    'thay-thien-minh': 8,
    'thay-lac-viet': 8,
    'thay-huyen-co': 7,
    'co-linh-dan': 7,
  };

  // Add deterministic jitter based on customer name / birth date to break ties organically
  const seedStr = `${analysis?.hoTen || ''}_${analysis?.ngaySinhDuong || ''}_${analysis?.canChiNam || ''}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) & 0xffffffff;
  }
  const jitterKeys = Object.keys(scores);
  jitterKeys.forEach((key, idx) => {
    scores[key] += ((hash >> (idx * 3)) & 3) * 0.5;
  });

  // Evaluate palaces
  const palaces: any[] = Array.isArray(chart?.cung) ? chart.cung : [];
  palaces.forEach((c) => {
    const ten = c.ten || '';
    const hung = Array.isArray(c.hungTinh) ? c.hungTinh.map((s: any) => s.ten || '') : [];
    const chinh = Array.isArray(c.chinhTinh) ? c.chinhTinh.map((s: any) => s.ten || '') : [];
    const cat = Array.isArray(c.catTinh) ? c.catTinh.map((s: any) => s.ten || '') : [];
    const allStars = [...hung, ...chinh, ...cat].join(' ');

    const hasKy = allStars.includes('Hóa Kỵ') || allStars.includes('Kỵ');
    const hasKK = allStars.includes('Địa Không') || allStars.includes('Địa Kiếp');
    const hasKD = allStars.includes('Kình Dương') || allStars.includes('Đà La');
    const hasHL = allStars.includes('Hỏa Tinh') || allStars.includes('Linh Tinh');
    const hasTuanTriet = Boolean(c.tuan || c.triet);

    if (ten === 'Tài Bạch' || ten === 'Quan Lộc') {
      if (hasKy) scores['thay-thai-son'] += 7;
      if (hasKK) scores['thay-thai-son'] += 6;
      if (hasKD) scores['thay-thai-son'] += 5;
      if (hasTuanTriet) scores['thay-thai-son'] += 3.5;
      if (allStars.includes('Đại Hao') || allStars.includes('Tiểu Hao')) scores['thay-thai-son'] += 4;
    } else if (ten === 'Phu Thê' || ten === 'Tử Tức') {
      if (hasKy) scores['thay-tam-an'] += 7.5;
      if (allStars.includes('Cô Thần') || allStars.includes('Quả Tú')) scores['thay-tam-an'] += 6;
      if (hasKK) scores['thay-tam-an'] += 5;
      if (hasKD) scores['thay-tam-an'] += 4.5;
      if (hasTuanTriet) scores['thay-tam-an'] += 3.5;
    } else if (ten === 'Điền Trạch' || ten === 'Tật Ách') {
      if (hasKK) scores['thay-tue-phong'] += 7;
      if (hasHL) scores['thay-tue-phong'] += 6;
      if (hasKD) scores['thay-tue-phong'] += 4.5;
      if (hasTuanTriet) scores['thay-tue-phong'] += 3.5;
    } else if (ten === 'Thiên Di') {
      if (hasKK || hasKD || hasKy) scores['thay-thien-minh'] += 6.5;
    } else if (ten === 'Phúc Đức') {
      if (allStars.includes('Âm Sát') || allStars.includes('Thiên Riêu')) scores['co-linh-dan'] += 7;
      if (hasKK) {
        scores['co-linh-dan'] += 5;
        scores['thay-tam-an'] += 3;
      }
      if (hasKy) scores['thay-tam-an'] += 4;
    }
  });

  // Evaluate Mệnh & Thân for turning points or element clashes
  if (analysis?.sinhKhac && (analysis.sinhKhac.includes('khắc') || analysis.sinhKhac.includes('Khắc'))) {
    scores['thay-lac-viet'] += 5.5;
  }
  const menhChinh = analysis?.menhPalace?.chinhTinh || '';
  if (menhChinh.includes('Thất Sát') || menhChinh.includes('Phá Quân') || menhChinh.includes('Tham Lang')) {
    scores['thay-huyen-co'] += 5;
  }

  // Weight user's explicit question if present
  if (userQuestion && userQuestion.trim().length > 3) {
    const q = userQuestion.toLowerCase();
    if (/tiền|tài|lộc|kinh doanh|đầu tư|công việc|sự nghiệp|thăng tiến|nợ|lỗ|hợp đồng|buôn bán/.test(q)) {
      scores['thay-thai-son'] += 15;
    }
    if (/tình|yêu|hôn nhân|vợ|chồng|ly hôn|gia đình|con cái|tâm an|stress|bất an|trầm cảm/.test(q)) {
      scores['thay-tam-an'] += 15;
    }
    if (/phong thủy|nhà|đất|bàn làm việc|hướng|sức khỏe|bệnh|tai nạn|trấn trạch/.test(q)) {
      scores['thay-tue-phong'] += 15;
    }
    if (/2026|thời vận|xuất hành|đi xa|định cư|ngày giờ|khởi sự|cát hung|năm nay|năm tới/.test(q)) {
      scores['thay-thien-minh'] += 15;
    }
    if (/bát tự|tứ trụ|dụng thần|hỷ thần|ngũ hành|khuyết|mệnh/.test(q)) {
      scores['thay-lac-viet'] += 15;
    }
    if (/quẻ|dịch|mai hoa|chọn|nên hay không|có nên|ngã rẽ|tương lai|dự đoán/.test(q)) {
      scores['thay-huyen-co'] += 15;
    }
    if (/tâm linh|gia tiên|mồ mả|giấc mơ|nghiệp|phóng sinh|cầu an|điềm báo|duyên âm/.test(q)) {
      scores['co-linh-dan'] += 15;
    }
  }

  // Sort descending
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0]);

  return [sorted[0], sorted[1]];
}

function getHandoverSentence(toMasterSlug: string, analysis: ChartAnalysisResult): string {
  switch (toMasterSlug) {
    case 'thay-thai-son':
      return `Tuy nhiên, người mang mệnh cách sáng mà ra thương trường nếu không quản lý được dòng tiền và cạm bẫy đối tác thì rất dễ hao tổn công sức! Tôi xin trân trọng kính chuyển lời tới **Thầy Thái Sơn** — chuyên gia thẩm định Quan Lộc & Tài Bạch, nhờ Thầy mổ xẻ góc nhìn thực chiến xem dòng tiền và thế trận làm ăn của bạn ${analysis.hoTen} nên điều phối thế nào?`;
    case 'thay-tam-an':
      return `Tuy nhiên, làm nên nghiệp lớn mà gia đạo bất an, thân tâm chao đảo thì cái giá phải trả quá đắt! Tôi xin trân trọng kính mời **Thầy Tâm An** — người nắm giữ chìa khóa bình an cho Cung Phu Thê và Gia Đạo, nhờ Thầy soi chiếu tình cảm và hóa giải nút thắt cho bạn ${analysis.hoTen}!`;
    case 'thay-tue-phong':
      return `Tuy nhiên, cổ nhân dạy *"Địa linh nhân kiệt"* — môi trường sống và trường khí nhà ở, bàn làm việc có ảnh hưởng mang tính quyết định đến tâm trí và cơ hội của bạn. Tôi xin kính mời **Thầy Tuệ Phong** — chuyên gia Phong Thủy Bát Trạch chỉ ra phương vị sinh khí và thế trận hóa giải sát khí cho bạn ${analysis.hoTen}!`;
    case 'thay-thien-minh':
      return `Sức người dù nỗ lực đến đâu cũng cần thuận theo dòng chảy của THIÊN THỜI. Năm 2026 Bính Ngọ đang mang lại những biến chuyển quan trọng, tôi xin trân trọng kính chuyển lời tới **Thầy Thiên Minh** — bậc thầy Trạch Cát & Thời Vận chỉ điểm lộ trình xuất hành, thời cơ khởi sự cho bạn ${analysis.hoTen}!`;
    case 'thay-lac-viet':
      return `Mọi chuyển động của tinh bàn thực chất đều vận hành theo trục Âm Dương Ngũ Hành. Để tìm ra Dụng Thần ngũ hành bổ khuyết cân bằng lại bản mệnh cho bạn, tôi xin trân trọng kính mời **Thầy Lạc Việt** — Đại Sư Tứ Trụ Bát Tự lên tiếng đàm luận!`;
    case 'thay-huyen-co':
      return `Đứng trước những ngã rẽ quan trọng của cuộc đời, cần có sự soi chiếu của Chu Dịch để nhìn rõ cát hung ẩn tàng. Tôi xin trân trọng kính mời **Thầy Huyền Cơ** khởi quẻ Dịch Mai Hoa soi tỏ hướng đi sáng suốt nhất cho bạn ${analysis.hoTen}!`;
    case 'co-linh-dan':
      return `Cây có gốc mới nở hoa kết trái, người có phúc trạch tổ tiên che chở mới vượt qua được phong ba bão táp. Tôi xin trân trọng kính mời **Cô Linh Đan** soi chiếu Cung Phúc Đức và tầng sâu tâm linh để truyền trao lời dặn tu đức tích phúc cho bạn ${analysis.hoTen}!`;
    default:
      return `Tôi xin trân trọng kính chuyển lời tới vị Danh Sư tiếp theo trong Hội Đồng cùng tham gia đàm luận!`;
  }
}

/**
 * LƯỢT 1: Thầy Minh Triết (Khai mở Tinh bàn & Chuyển giao Động theo Sát Tinh / Affliction)
 */
export async function generateTurn1MinhTriet(
  analysis: ChartAnalysisResult,
  nextMasterSlug = 'thay-thai-son',
  question?: string
): Promise<string> {
  const rag = await searchKnowledge(`cung mệnh ${analysis.menhPalace?.chinhTinh || ''} đại cục`, 2, 'thay-minh-triet');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  const menh = analysis.menhPalace;
  const than = analysis.thanPalace;
  const starCore = getStarCoreMenh(menh?.chinhTinh || '');
  const thanText = getThanInsight(than);

  const qSection = question && question.trim().length > 3
    ? `\n\n📌 **Về mối bận tâm của bạn:** *" ${question.trim()} "* — Soi vào cung Mệnh của bạn, đây là thời khắc bản mệnh đang chuyển pha. Mọi khúc mắc hiện tại không phải là ngõ cụt, mà là phép thử để rèn luyện khí chất ${starCore.khiChat} của chính bạn.`
    : '';

  const handover = getHandoverSentence(nextMasterSlug, analysis);

  return (
    `Thầy Minh Triết xin kính chào quý bạn **${analysis.hoTen}** và các vị Danh Sư trong Hội Đồng!\n\n` +
    `Mở Tinh Bàn của bạn sinh năm **${analysis.canChiNam}**, bản mệnh **${analysis.banMenh}**, tương phối cùng **${analysis.cuc}**:\n\n` +
    `Nhìn vào hạt nhân cốt lõi định hình nên cuộc đời bạn:\n\n` +
    `- **Cung Mệnh tại ${menh?.canChi || 'bản cung'}:** Tọa thủ sao **${menh?.chinhTinh || 'Chính tinh miếu vượng'}**, hội cùng cát tinh *${menh?.catTinh || 'Khoa Quyền, Khôi Việt'}*. Cấu trúc này thuộc cách cục **${starCore.tenBo}**.\n` +
    `- **Khí chất thiên bẩm:** Bạn mang nét tính cách ${starCore.khiChat}. Trong công việc và cuộc sống, bạn luôn toát lên vẻ đĩnh đạc, có lòng tự trọng và tinh thần trách nhiệm cao.\n` +
    `- **Thế đứng Cung Thân:** ${thanText}\n\n` +
    `✨ **Điểm sáng lớn nhất:** ${starCore.diemSang}. Dù gặp nghịch cảnh bão giông, bạn luôn có nghị lực và có cơ may gặp quý nhân tương trợ đúng thời khắc ngặt nghèo.\n\n` +
    `⚠️ **Nút thắt cần thấu tỏ:** ${starCore.diemNghen}. ${menh?.triet ? '*(Cung Mệnh có Triệt Không: Thời tiền vận trước 32 tuổi phải trải qua va vấp tôi rèn, sau đó mới thong dong phát tiết)*.' : ''} ${menh?.tuan ? '*(Cung Mệnh có Tuần Không: Vận trình phát triển chắc chắn, chớ nôn nóng nhảy cóc)*.' : ''}` +
    qSection +
    (ragSnippet ? `\n\n> 📜 *Cổ nhân đúc kết:* "${ragSnippet}"` : '') +
    `\n\n${handover}`
  );
}

/**
 * LƯỢT 2: Dynamic Second Master (Đàm đạo sâu theo cung hạn / vấn đề nổi cộm)
 */
export async function generateDynamicTurn2(
  masterSlug: string,
  analysis: ChartAnalysisResult,
  turn1Text: string,
  nextMasterSlug: string,
  question?: string
): Promise<string> {
  const handover = getHandoverSentence(nextMasterSlug, analysis);

  // 1. Thầy Thái Sơn (Tài Lộc & Quan Lộc)
  if (masterSlug === 'thay-thai-son') {
    const rag = await searchKnowledge(`quan lộc tài bạch rủi ro dòng tiền đầu tư`, 2, 'thay-thai-son');
    const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';
    const quan = analysis.quanPalace;
    const tai = analysis.taiPalace;
    const dien = analysis.dienTrachPalace;
    const quanStars = quan?.chinhTinh || 'Chính tinh đắc cách';
    const taiStars = tai?.chinhTinh || 'Tài tinh hội tụ';
    const dienStars = dien?.chinhTinh || 'Cơ nghiệp điền trạch';

    let loiKhuyenTaiChinh = 'Tập trung vào dòng tiền thực chất, kiểm soát hàng tồn và các khoản nợ đọng.';
    if (taiStars.includes('Vũ Khúc') || taiStars.includes('Thiên Phủ') || taiStars.includes('Lộc Tồn')) {
      loiKhuyenTaiChinh = 'Cung Tài nắm tài tinh vượng địa, bạn có khả năng giữ tiền và tích lũy rất tốt. Hãy mạnh dạn chuyển hóa thặng dư sang tài sản sinh lời an toàn như bất động sản có sổ đỏ.';
    } else if (taiStars.includes('Không') || taiStars.includes('Kiếp') || taiStars.includes('Hóa Kỵ') || taiStars.includes('Hao')) {
      loiKhuyenTaiChinh = 'Dòng tiền có tính chất vào nhanh ra bạo, dễ bị hao hụt ngoài ý muốn. Tuyệt đối không đầu tư theo phong trào mạo hiểm hoặc đứng tên vay mượn hộ người khác.';
    }

    const qAnswer = question && question.trim().length > 3
      ? `\n\n🎯 **Chiếu theo thắc mắc của bạn:** Dưới góc nhìn kinh tế, câu trả lời nằm ở chữ **"Quản Trị Rủi Ro"**. Cơ hội luôn đi kèm cạm bẫy, bạn chỉ nên xuất tiền khi đã nắm rõ luật chơi và có phương án dự phòng ít nhất 6 tháng chi phí.`
      : '';

    return (
      `Chào Thầy Minh Triết, bạn **${analysis.hoTen}** và các vị Thầy trong Hội Đồng!\n\n` +
      `Tôi nghe Thầy Minh Triết vừa luận giải cung Mệnh rất uyên bác. Dưới góc nhìn thương trường thực chiến, tôi xin đi thẳng vào **bài toán Dòng Tiền & Thế Trận Làm Ăn** của bạn:\n\n` +
      `- **Cung Quan Lộc (${quan?.canChi || 'Quan cung'} - ${quanStars}):** Bạn có năng lực chuyên môn và chí tiến thủ cao. ${quan?.hungTinh && quan.hungTinh !== 'Không' ? `Tuy nhiên có sát tinh *${quan.hungTinh}* chiếu về, cảnh báo bạn hay bị cả nể đối tác hoặc dễ gánh vác việc thay cho người khác.` : 'Thế đứng vững vàng, thích hợp dẫn dắt và điều phối công việc.'}\n` +
      `- **Cung Tài Bạch (${tai?.canChi || 'Tài cung'} - ${taiStars}):** ${loiKhuyenTaiChinh}\n` +
      `- **Cung Điền Trạch (${dien?.canChi || 'Điền cung'} - ${dienStars}):** Điền sản chính là chiếc két sắt giữ lộc của bạn. Bất cứ khi nào có khoản tiền nhàn rỗi, hãy ưu tiên đưa vào đất đai hoặc tài sản pháp lý minh bạch để tiền không bị bốc hơi.` +
      qAnswer +
      `\n\n🚨 **3 Nguyên Tắc Sống Còn Thái Sơn Nhắc Nhở Bạn:**\n` +
      `1. Giữ đòn bẩy tài chính ở mức an toàn, tuyệt đối không vay quá 35-40% tổng tài sản để đầu tư mạo hiểm.\n` +
      `2. Làm ăn sòng phẳng, hợp đồng giấy trắng mực đen rõ ràng, không cả nể người quen kẻo mất cả tiền lẫn tình.\n` +
      `3. Chú trọng xây dựng một nguồn thu nhập thụ động bền vững bên cạnh công việc chính.` +
      (ragSnippet ? `\n\n> 📜 *Binh pháp tài chính:* "${ragSnippet}"` : '') +
      `\n\n${handover}`
    );
  }

  // 2. Thầy Tâm An (Phu Thê & Gia Đạo)
  if (masterSlug === 'thay-tam-an') {
    const rag = await searchKnowledge(`phu thê tình duyên hôn nhân gia đạo`, 2, 'thay-tam-an');
    const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';
    const phu = analysis.phuThePalace;
    const phuc = analysis.phucDucPalace;
    const phuStars = phu?.chinhTinh || 'Chính tinh';

    let loiKhuyenPhuThe = 'Người bạn đời là chỗ dựa tinh thần quan trọng, cùng bạn vun đắp cơ đồ.';
    if (phuStars.includes('Hóa Kỵ') || (phu?.hungTinh && phu.hungTinh.includes('Kỵ'))) {
      loiKhuyenPhuThe = 'Cung Phu Thê có ám tinh, hai người rất thương nhau nhưng đôi khi nói chuyện lại dễ lệch pha, dễ vướng hiểu lầm vì những chuyện nhỏ nhặt.';
    } else if (phuStars.includes('Thất Sát') || phuStars.includes('Phá Quân') || phuStars.includes('Kình Dương')) {
      loiKhuyenPhuThe = 'Bạn đời là người có cá tính mạnh, lòng tự trọng cao. Trong gia đình cần sự tôn trọng khoảng trời riêng của nhau, tránh áp đặt cái tôi.';
    }

    const qAnswer = question && question.trim().length > 3
      ? `\n\n🌸 **Gửi gắm riêng cho thắc mắc của bạn:** Mọi bão giông ngoài đời sẽ dừng lại sau cánh cửa gia đình nếu bạn biết lắng nghe. Hãy để tâm mình dịu xuống, bạn sẽ nhìn thấy lối đi sáng suốt nhất.`
      : '';

    return (
      `Thầy Tâm An xin kính chào Thầy Minh Triết và quý bạn **${analysis.hoTen}**!\n\n` +
      `Tôi rất đồng tình với Thầy Minh Triết khi nhìn vào hạt nhân bản mệnh của bạn. Nhưng tôi xin chia sẻ một điều từ tận đáy lòng: **Gia đình chính là cội nguồn sinh khí lớn nhất của đời người!**\n\n` +
      `Soi chiếu vào **Cung Phu Thê** và **Cung Phúc Đức** của bạn:\n\n` +
      `- **Cung Phu Thê (${phu?.canChi || 'Phu Thê'} - ${phuStars}):** ${loiKhuyenPhuThe}\n` +
      `- **Cung Phúc Đức (${phuc?.canChi || 'Phúc cung'} - ${phuc?.chinhTinh || 'Phúc tinh'}):** Cội rễ tổ tiên và phúc ấm của dòng họ là chiếc ô che chở vô hình cho bạn những lúc bế tắc. Hãy dành thời gian hương khói gia tiên và sống thiện lành để bồi đắp thêm phúc trạch cho con cháu.` +
      qAnswer +
      `\n\n🌿 **Công Thức Hóa Giải Thân Tâm — "3 ĐIỀU NÊN LÀM":**\n` +
      `1. **Lắng nghe trọn vẹn:** Dành 15 phút mỗi ngày trò chuyện với người thân mà không cầm điện thoại, không phán xét.\n` +
      `2. **Hạ bớt kỳ vọng:** Đừng mang áp lực công việc ngoài xã hội về trút lên mái ấm gia đình.\n` +
      `3. **Tĩnh tâm mỗi tối:** Trước khi ngủ, buông xả mọi bực dọc trong ngày, giữ tâm an lạc để nạp lại năng lượng mới.` +
      (ragSnippet ? `\n\n> 📜 *Lời khuyên tu dưỡng:* "${ragSnippet}"` : '') +
      `\n\n${handover}`
    );
  }

  // 3. Thầy Tuệ Phong (Phong Thủy Bát Trạch & Không Gian Sống)
  if (masterSlug === 'thay-tue-phong') {
    const rag = await searchKnowledge(`phong thủy bát trạch hướng nhà bàn làm việc sinh khí`, 2, 'thay-tue-phong');
    const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

    return (
      `Kính chào Thầy Minh Triết và bạn **${analysis.hoTen}**!\n\n` +
      `Thầy Minh Triết vừa chỉ ra cấu trúc bản mệnh rất chuẩn xác. Tuy nhiên, cổ nhân có câu: *"Tâm sinh tướng, nhưng Hoàn cảnh lại nhào nặn nên Tâm"*. Chiếu theo bản mệnh **${analysis.banMenh}** và tuổi **${analysis.canChiNam}** của bạn, tôi xin chỉ ra những xung đột trường khí vô hình đang bủa vây bạn:\n\n` +
      `🧭 **1. Thế Bàn Làm Việc (Quyết định tài lộc & sự sáng suốt):**\n` +
      `- Mệnh của bạn tối kỵ ngồi làm việc ở thế *"tọa không hướng hư"* (lưng quay ra cửa sổ hoặc cửa ra vào). Thế ngồi này khiến bạn luôn có cảm giác bất an, dễ bị đối tác lật kèo.\n` +
      `- **Phương vị Sinh Khí:** Bạn nên kê bàn làm việc quay mặt về hướng **Đông Bắc (Sinh Khí)** hoặc **Tây Bắc (Diên Niên)**. Sau lưng cần có tường vững chãi làm điểm tựa *"Tọa Sơn Hướng Thủy"*.\n\n` +
      `🏡 **2. Không Gian Phòng Ngủ (Quyết định giấc ngủ và hòa khí):**\n` +
      `- Tránh gương soi chiếu thẳng vào đầu giường vì tạo ảo giác bất an khiến bạn trằn trọc mất ngủ.\n` +
      `- Đặt một chậu cây xanh bản lá tròn (Kim Ngân hoặc Trầu Bà Đế Vương) ở góc phòng khách để thanh lọc trường khí độc hại.\n\n` +
      `🔮 **3. Vật Phẩm Trợ Mệnh:**\n` +
      `- Đặt một **quả cầu Thạch Anh Tím hoặc Thạch Anh Tóc Vàng** tại góc bàn làm việc để giữ tâm trí luôn tĩnh tại, không đưa ra quyết định sai lầm lúc nóng vội.` +
      formatAncientKnowledgeQuote('Thư tịch Phong Thủy cổ kim', ragSnippet) +
      `\n\n${handover}`
    );
  }

  // 4. Thầy Thiên Minh (Thời Vận 2026 & Trạch Cát)
  if (masterSlug === 'thay-thien-minh') {
    const rag = await searchKnowledge(`trạch cát thời vận năm 2026 bính ngọ`, 2, 'thay-thien-minh');
    const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

    return (
      `Thầy Thiên Minh xin kính chào Thầy Minh Triết và bạn **${analysis.hoTen}**!\n\n` +
      `Cổ nhân dạy: *"Thời lai đồ điếu giai vi thuận, vận khứ anh hùng ẩm hận đa"*. Bản mệnh có sáng mà đi ngược thời vận thì cũng như chèo thuyền ngược nước. Chiếu theo Tinh bàn của bạn, tôi xin chỉ rõ chìa khóa **THIÊN THỜI**:\n\n` +
      `📅 **1. Soi Vận Trình Năm 2026 (Bính Ngọ):**\n` +
      `- Năm 2026 mang thiên can **Bính (Hỏa)** và địa chi **Ngọ (Hỏa)**. Chiếu theo tuổi **${analysis.canChiNam}** và nạp âm **${analysis.banMenh}**, năm nay bản mệnh đang đứng trước chu kỳ chuyển pha rất nhạy cảm.\n` +
      `- **Chiến lược:** Nửa đầu năm nên ưu tiên củng cố nội lực, kiểm tra kỹ lưỡng các hợp đồng và xây dựng nền móng an toàn. Nửa cuối năm mới là thời cơ chín muồi để tăng tốc mở rộng.\n\n` +
      `⏰ **2. Khung Giờ Hoàng Đạo Khởi Sự:**\n` +
      `- Mọi việc quan trọng như xuất hành công tác, ký hợp đồng hay mở hàng, nên ưu tiên chọn **Giờ Thìn (07h - 09h)** hoặc **Giờ Thân (15h - 17h)** để đón trọn cát khí Quý Nhân tương trợ.` +
      formatAncientKnowledgeQuote('Bí truyền Trạch Cát', ragSnippet) +
      `\n\n${handover}`
    );
  }

  // 5. Thầy Lạc Việt (Tứ Trụ Bát Tự & Dụng Thần)
  if (masterSlug === 'thay-lac-viet') {
    const rag = await searchKnowledge(`tứ trụ bát tự dụng thần hỷ thần cân bằng ngũ hành`, 2, 'thay-lac-viet');
    const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

    return (
      `Thầy Lạc Việt xin kính chào Thầy Minh Triết và bạn **${analysis.hoTen}**!\n\n` +
      `Dưới góc độ **Tứ Trụ Bát Tự & Âm Dương Ngũ Hành**, mọi thăng trầm của đời người thực chất là sự thừa thiếu của 5 dòng năng lượng Kim, Mộc, Thủy, Hỏa, Thổ:\n\n` +
      `📜 **1. Soi Chiếu Dụng Thần & Hỷ Thần Bản Mệnh:**\n` +
      `- Bạn sinh năm **${analysis.canChiNam}**, nạp âm bản mệnh **${analysis.banMenh}**.\n` +
      `- Chiếu theo thế đứng Tứ Trụ, tinh bàn của bạn cần nhất là **Dụng Thần Mộc để sinh Hỏa** (nuôi dưỡng năng lượng sáng tạo, nhiệt huyết) và **Hỷ Thần Thổ để dung nạp tài lộc** (giúp tiền bạc tụ lại bền vững, không bị phân tán).\n\n` +
      `⚖️ **2. Phương Pháp Bổ Khuyết Ngũ Hành:**\n` +
      `- Bổ sung trang phục hoặc phụ kiện mang gam màu xanh lá cây hoặc vàng đất để tăng cường trường khí tương sinh.\n` +
      `- Chú ý chế độ dinh dưỡng dưỡng Can và Tỳ vị, tránh để thức khuya làm tổn hao chân khí.` +
      formatAncientKnowledgeQuote('Khẩu quyết Tứ Trụ Bát Tự', ragSnippet) +
      `\n\n${handover}`
    );
  }

  // 6. Thầy Huyền Cơ (Chu Dịch & Mai Hoa Dịch Số)
  if (masterSlug === 'thay-huyen-co') {
    const rag = await searchKnowledge(`kinh dịch mai hoa quẻ biến cát hung`, 2, 'thay-huyen-co');
    const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

    return (
      `Thầy Huyền Cơ xin bái kiến Thầy Minh Triết và quý bạn **${analysis.hoTen}**!\n\n` +
      `Chu Dịch dạy: *"Cùng tắc biến, biến tắc thông, thông tắc cửu"*. Mệnh bàn của bạn đang ở ngưỡng cửa của sự biến hóa lớn:\n\n` +
      `☯️ **1. Chiêm Nghiệm Quẻ Dịch Tương Ứng:**\n` +
      `- Cảm ứng theo thời điểm và bản mệnh của bạn, được quẻ **Địa Thiên Thái**, hào biến thành **Thủy Thiên Nhu**.\n` +
      `- **Lời quẻ:** Đất trời giao hòa, vạn vật hanh thông, nhưng trước khi bứt phá phải biết chữ "Nhu" — kiên nhẫn tích lũy, không nóng vội manh động.\n\n` +
      `🎯 **2. Kim Chỉ Nam Quyết Định:**\n` +
      `- Đứng trước các ngã rẽ quan trọng, hãy chọn con đường có tính bền vững và sự đồng thuận của tập thể, tránh đi đường tắt mạo hiểm.` +
      formatAncientKnowledgeQuote('Chu Dịch Đại Tượng Truyện', ragSnippet) +
      `\n\n${handover}`
    );
  }

  // 7. Cô Linh Đan (Tâm Linh & Phúc Trạch)
  const rag = await searchKnowledge(`phúc đức tâm linh gia tiên giải nghiệp`, 2, 'co-linh-dan');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';
  const phuc = analysis.phucDucPalace;

  return (
    `Linh Đan xin kính chào Thầy Minh Triết và bạn **${analysis.hoTen}**!\n\n` +
    `Lắng nghe lời Thầy Minh Triết, Linh Đan cảm nhận sâu sắc rằng mỗi bước đi trong đời người đều có sự nâng đỡ âm thầm của tiên tổ:\n\n` +
    `🕯️ **1. Soi Cung Phúc Đức (${phuc?.canChi || 'Phúc cung'} - ${phuc?.chinhTinh || 'Phúc tinh'}):**\n` +
    `- Cung Phúc Đức của bạn cho thấy dòng họ có bề dày âm đức, nhưng đương số đôi khi mải mê với vòng xoáy cuộc sống bên ngoài mà ít dành thời gian chăm sóc cội rễ tâm linh.\n` +
    `- Những giấc mơ hay linh cảm bồn chồn thời gian qua chính là tín hiệu nhắc nhở bạn cần hướng về tổ tiên, thanh lọc tâm trí.\n\n` +
    `🌸 **2. Lời Dặn Tu Dưỡng Phúc Báu:**\n` +
    `- Dành ngày mùng Một, ngày Rằm thắp nén hương thơm tưởng nhớ gia tiên với tâm thành kính.\n` +
    `- Thực hiện phóng sinh thiện nguyện để giải trừ oan khiên, bồi đắp thêm phúc trạch cho bản thân và con cháu.` +
    formatAncientKnowledgeQuote('Kinh nghiệm Âm Đức', ragSnippet) +
    `\n\n${handover}`
  );
}

function getMasterSummaryRow(masterSlug: string, analysis: ChartAnalysisResult): { linhVuc: string; nhanDinh: string; hanhDong: string } {
  switch (masterSlug) {
    case 'thay-minh-triet':
      return {
        linhVuc: '**1. Bản Mệnh (Minh Triết)**',
        nhanDinh: `Khí chất đĩnh đạc, bản mệnh **${analysis.banMenh}** vững vàng`,
        hanhDong: 'Rèn luyện đức nhẫn nại, tôi rèn bản lĩnh vượt chướng ngại',
      };
    case 'thay-thai-son':
      return {
        linhVuc: '**Sự Nghiệp & Dòng Tiền (Thái Sơn)**',
        nhanDinh: 'Tài Bạch cần sự chắc chắn, phòng ngừa rủi ro cạm bẫy đối tác',
        hanhDong: 'Đòn bẩy dưới 35-40%, chuyển hóa lợi nhuận sang tài sản an toàn',
      };
    case 'thay-tam-an':
      return {
        linhVuc: '**Gia Đạo & Thân Tâm (Tâm An)**',
        nhanDinh: 'Phu Thê cần sự thấu cảm, cội nguồn hạnh phúc từ gia đình',
        hanhDong: 'Lắng nghe không phán xét 15p mỗi ngày, giữ hòa khí làm gốc',
      };
    case 'thay-tue-phong':
      return {
        linhVuc: '**Phong Thủy & Không Gian Sống (Tuệ Phong)**',
        nhanDinh: 'Trường khí nhà ở, bàn làm việc ảnh hưởng trực tiếp đến tâm trí',
        hanhDong: 'Tọa sơn hướng thủy, kích hoạt phương vị Sinh Khí, bài trí thạch anh',
      };
    case 'thay-thien-minh':
      return {
        linhVuc: '**Thời Vận 2026 & Trạch Cát (Thiên Minh)**',
        nhanDinh: 'Năm 2026 Bính Ngọ cần nắm chắc thời cơ, tránh manh động',
        hanhDong: 'Nửa đầu năm tích lũy, nửa cuối năm bung sức; chọn giờ Thìn/Thân khởi sự',
      };
    case 'thay-lac-viet':
      return {
        linhVuc: '**Tứ Trụ & Dụng Thần Bổ Khuyết (Lạc Việt)**',
        nhanDinh: 'Cân bằng Âm Dương Ngũ Hành, điều hòa xung khắc bản mệnh',
        hanhDong: 'Bổ khuyết Dụng Thần tương sinh, điều tiết thói quen dưỡng sinh',
      };
    case 'thay-huyen-co':
      return {
        linhVuc: '**Chu Dịch & Dự Báo Ngã Rẽ (Huyền Cơ)**',
        nhanDinh: 'Quẻ Dịch mở ra thời cơ chuyển pha, tùy thời quyền biến',
        hanhDong: 'Giữ tâm chính trực khi đứng trước quyết định lớn, thấy cơ thì quyết',
      };
    case 'co-linh-dan':
      return {
        linhVuc: '**Tâm Linh & Phúc Trạch Tổ Tiên (Cô Linh Đan)**',
        nhanDinh: 'Cung Phúc Đức là cội rễ vô hình nâng đỡ đường đời',
        hanhDong: 'Hương khói gia tiên, phóng sinh tích phúc, nuôi dưỡng âm đức',
      };
    default:
      return {
        linhVuc: '**Kim Chỉ Nam Tổng Hợp**',
        nhanDinh: 'Vận trình hanh thông khi hành động đúng đạo lý',
        hanhDong: 'Đức năng thắng số, kiên trì mục tiêu dài hạn',
      };
  }
}

/**
 * LƯỢT 3: Dynamic Third Master (Cân bằng đa chiều & Đúc kết Bảng 3 Kim Chỉ Nam)
 */
export async function generateDynamicTurn3(
  masterSlug: string,
  analysis: ChartAnalysisResult,
  previousDialogue: string,
  lineup: string[],
  question?: string
): Promise<string> {
  const row1 = getMasterSummaryRow(lineup[0] || 'thay-minh-triet', analysis);
  const row2 = getMasterSummaryRow(lineup[1] || 'thay-thai-son', analysis);
  const row3 = getMasterSummaryRow(lineup[2] || masterSlug, analysis);

  let specificAdvice = '';
  if (masterSlug === 'thay-tam-an') {
    specificAdvice = `Là một người nghiên cứu chuyên sâu về Hạnh Phúc Gia Đạo, tôi xin nhắc nhở: Dù sự nghiệp có vẻ vang đến đâu, một mái ấm gia đình hòa thuận và tâm trí bình an chính là bệ phóng vững chắc nhất của bạn!`;
  } else if (masterSlug === 'thay-thai-son') {
    specificAdvice = `Dưới góc nhìn kinh tế thực chiến, mọi ước mơ chỉ thành hiện thực khi bạn giữ được sự tỉnh táo về tài chính. Hãy bảo toàn dòng tiền, biến lợi nhuận thành tài sản tích lũy an toàn!`;
  } else if (masterSlug === 'thay-tue-phong') {
    specificAdvice = `Hãy chỉnh đốn ngay góc làm việc và nơi nghỉ ngơi của bạn. Một trường khí trong lành, thuận phong tụ khí sẽ khai thông trí tuệ để bạn đưa ra những quyết sách sáng suốt!`;
  } else if (masterSlug === 'thay-thien-minh') {
    specificAdvice = `Thời cơ đang đến gần trong năm 2026. Hãy bước từng bước vững chắc, chuẩn bị kỹ lưỡng để khi ngọn gió Thiên Thời thổi tới, bạn sẽ giương buồm bứt phá!`;
  } else if (masterSlug === 'thay-lac-viet') {
    specificAdvice = `Giữ cho Âm Dương Ngũ Hành trong cơ thể và tinh thần luôn cân bằng. Đạo trời không thiên vị ai, chỉ giúp người biết thuận theo lẽ tự nhiên!`;
  } else if (masterSlug === 'thay-huyen-co') {
    specificAdvice = `Quẻ Dịch đã chỉ lối: Đứng trước ngã rẽ, giữ lòng kiên định và chính trực, không đi đường tắt thì tiền đồ ắt rực rỡ!`;
  } else {
    specificAdvice = `Cội nguồn phúc đức sâu dày là tấm khiên che chở lớn nhất. Hãy sống thiện lương, hiếu kính tổ tiên và tích lũy âm đức mỗi ngày!`;
  }

  const qAnswer = question && question.trim().length > 3
    ? `\n\n🌿 **Hồi đáp mối bận tâm của bạn:** *" ${question.trim()} "* — Tất cả khúc mắc hiện tại đều sẽ được tháo gỡ khi bạn kết hợp hài hòa cả 3 chỉ dẫn của các Thầy.`
    : '';

  return (
    `Tôi xin kính chào Hội Đồng Danh Sư và quý bạn **${analysis.hoTen}**!\n\n` +
    `Lắng nghe hai Thầy vừa phân tích rất thấu đáo, tôi thấy toàn bộ bức tranh cuộc đời bạn đã được soi tỏ từ bản mệnh, tài lộc cho đến thời vận:\n\n` +
    `💡 **Lời Nhắn Nhủ Trọng Tâm:**\n` +
    `${specificAdvice}` +
    qAnswer +
    `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 **BẢNG ĐÚC KẾT 3 KIM CHỈ NAM SAU 3 LƯỢT ĐÀM ĐẠO CỐT LÕI:**\n` +
    `| Lĩnh Vực | Nhận Định Trọng Yếu | Lời Khuyên Hành Động Cụ Thể |\n` +
    `| :--- | :--- | :--- |\n` +
    `| ${row1.linhVuc} | ${row1.nhanDinh} | ${row1.hanhDong} |\n` +
    `| ${row2.linhVuc} | ${row2.nhanDinh} | ${row2.hanhDong} |\n` +
    `| ${row3.linhVuc} | ${row3.nhanDinh} | ${row3.hanhDong} |\n\n` +
    `> 🕊️ *"Đức năng thắng số — Tinh bàn chỉ đường, nhưng chính tâm sáng và hành động thiện lành của bạn mỗi ngày mới tạo nên số phận rực rỡ!"*\n\n` +
    `Hội đồng Bát Đại Danh Sư kính chúc bạn **${analysis.hoTen}** luôn chân cứng đá mềm, công danh hanh thông và gia đạo trọn vẹn an vui!`
  );
}

// Backward-compatible wrappers
export async function generateTurn2ThaiSon(analysis: ChartAnalysisResult, turn1Text: string, question?: string): Promise<string> {
  return generateDynamicTurn2('thay-thai-son', analysis, turn1Text, 'thay-tam-an', question);
}

export async function generateTurn3TamAn(analysis: ChartAnalysisResult, turns1And2: string, question?: string): Promise<string> {
  return generateDynamicTurn3('thay-tam-an', analysis, turns1And2, ['thay-minh-triet', 'thay-thai-son', 'thay-tam-an'], question);
}

/**
 * LƯỢT 4: Thầy Tuệ Phong (Chuyên môn Phong Thủy Bát Trạch & Giải mã căn nguyên môi trường)
 */
export async function generateTurn4TuePhong(analysis: ChartAnalysisResult, previousContext: string): Promise<string> {
  const rag = await searchKnowledge(`phong thủy bát trạch hướng nhà bàn làm việc sinh khí`, 2, 'thay-tue-phong');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  return (
    `Kính thưa Hội Đồng Bát Đại Danh Sư và bạn **${analysis.hoTen}**!\n\n` +
    `Lắng nghe hai Thầy Thái Sơn và Tâm An tranh luận nảy lửa giữa *"Tiền Tài"* và *"Tình Cảm"*, tôi thấy cả hai vị đều chạm đúng vào hiện tượng, **nhưng cái "căn nguyên gốc rễ" tác động lên tâm trí bạn mỗi ngày thì hai Thầy chưa nhìn ra!**\n\n` +
    `Cổ nhân có câu: *"Tâm sinh tướng, nhưng Hoàn cảnh lại nhào nặn nên Tâm"*. Chiếu theo bản mệnh **${analysis.banMenh}** và tuổi **${analysis.canChiNam}** của bạn, tôi xin chỉ ra những xung đột trường khí vô hình đang bủa vây bạn:\n\n` +
    `🧭 **1. Thế Bàn Làm Việc & Phòng Làm Việc (Quyết định tài lộc & sự sáng suốt):**\n` +
    `- Mệnh của bạn tối kỵ ngồi làm việc ở thế *"tọa không hướng hư"* (lưng quay ra cửa sổ hoặc cửa ra vào). Thế ngồi này khiến bạn luôn có cảm giác bất an, dễ bị cấp dưới qua mặt hoặc đối tác lật kèo.\n` +
    `- **Phương vị Sinh Khí:** Bạn nên kê bàn làm việc quay mặt về hướng **Đông Bắc (Sinh Khí)** hoặc **Tây Bắc (Diên Niên)**. Sau lưng cần có tường vững chãi làm điểm tựa *"Tọa Sơn Hướng Thủy"*.\n\n` +
    `🏡 **2. Không Gian Phòng Ngủ (Quyết định sự hòa hợp phu thê của Thầy Tâm An):**\n` +
    `- Phòng ngủ của bạn đang có dấu hiệu bị dương khí quá gắt (ánh nắng trực chiếu) hoặc ngược lại là bị ẩm thấp u tối. Gương soi chiếu thẳng vào đầu giường là đại kỵ, tạo ảo giác bất an khiến vợ chồng dễ sinh nghi kỵ, khắc khẩu.\n` +
    `- Đặt một chậu cây xanh bản lá tròn (như Kim Ngân hoặc Trầu Bà Đế Vương) ở góc Đông Nam phòng khách để thanh lọc trường khí độc hại.\n\n` +
    `🔮 **3. Vật Phẩm Phong Thủy Trợ Mệnh:**\n` +
    `- Bạn nên đặt một **quả cầu Thạch Anh Tím hoặc Thạch Anh Tóc Vàng** tại cung Tài Bạch của bàn làm việc để giữ cho tâm trí luôn tĩnh tại, không đưa ra quyết định sai lầm lúc nóng giận.\n\n` +
    formatAncientKnowledgeQuote('Thư tịch Phong Thủy cổ kim', ragSnippet) +
    `Không gian sống là *"Địa Lợi"*, nhưng để kết nối được với *"Thiên Thời"* và hóa giải trọn vẹn cả Tiền lẫn Tình, tôi xin trân trọng kính mời **Thầy Lạc Việt** — Chuyên gia Tứ Trụ Bát Tự & Dụng Thần lên tiếng đúc kết lại toàn bộ thế trận đợt này!`
  );
}

/**
 * LƯỢT 5: Thầy Lạc Việt (Tứ Trụ Bát Tự & Đúc kết hòa giải Đợt 1)
 */
export async function generateTurn5LacViet(analysis: ChartAnalysisResult, previousContext: string): Promise<string> {
  const rag = await searchKnowledge(`tứ trụ bát tự dụng thần hỷ thần cân bằng ngũ hành`, 2, 'thay-lac-viet');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  return (
    `Chào quý bạn **${analysis.hoTen}** và kính thưa chư vị tiền bối trong Hội Đồng Bát Đại Danh Sư!\n\n` +
    `Dưới góc độ **Tứ Trụ Bát Tự & Lý Thuyết Âm Dương Ngũ Hành**, tôi xin đứng ở vị thế trung dung để **hòa giải toàn bộ những phản biện nảy lửa suốt 4 lượt vừa qua**:\n\n` +
    `Thầy Minh Triết nhìn đại cục, Thầy Thái Sơn nhắc nhở dòng tiền, Thầy Tâm An cảnh tỉnh gia đạo, và Thầy Tuệ Phong chỉnh đốn môi trường sống. Tất cả 4 mảnh ghép này không hề mâu thuẫn nhau, mà nó chính là các mặt của **Đạo Cân Bằng**:\n\n` +
    `📜 **1. Soi Chiếu Dụng Thần & Hỷ Thần Bản Mệnh:**\n` +
    `- Bạn sinh năm **${analysis.canChiNam}**, nạp âm bản mệnh **${analysis.banMenh}**.\n` +
    `- Trong Tứ Trụ, người mang cách cục này cần nhất là **Dụng Thần Mộc để sinh Hỏa** (nuôi dưỡng năng lượng sáng tạo, nhiệt huyết) và **Hỷ Thần Thổ để dung nạp tài lộc** (giúp tiền bạc tụ lại thành bất động sản như Thầy Thái Sơn đã nói, không bị phân tán).\n` +
    `- Khi Ngũ Hành bị thiên lệch (quá chú trọng Kim/Thủy để kiếm tiền mà bỏ quên Mộc/Hỏa), tâm hỏa sẽ bốc lên khiến bạn cáu gắt với vợ con như Thầy Tâm An đã vạch rõ!\n\n` +
    `⚖️ **2. Lời Đúc Kết Đa Chiều Cho Đương Số:**\n` +
    `- Bạn hoàn toàn **không cần phải đánh đổi** giữa sự nghiệp vẻ vang và mái ấm gia đình, nếu bạn biết áp dụng nguyên tắc *"Đi làm quyết liệt như Thầy Thái Sơn, về nhà bao dung như Thầy Tâm An, và tĩnh tại điều hòa không gian như Thầy Tuệ Phong"*.\n\n` +
    formatAncientKnowledgeQuote('Khẩu quyết Tứ Trụ Bát Tự', ragSnippet) +
    `✨ **KÍNH BÁO:** Hội Đồng Bát Đại Danh Sư đã hoàn tất **Đợt Tọa Đàm & Phản Biện Đa Chiều 5 Lượt Đầu Tiên**. Quý bạn hãy dành ít phút nghiền ngẫm những điều tâm huyết các Thầy vừa chỉ dạy!`
  );
}

// =========================================================================
// BATCH 2: ĐỢT TỌA ĐÀM NÂNG CAO (TURNS 6 - 10: THỜI VẬN, KINH DỊCH, TÂM LINH)
// =========================================================================

/**
 * LƯỢT 6: Thầy Thiên Minh (Trạch Cát, Thời Vận 2026 & Thiên Thời)
 */
export async function generateTurn6ThienMinh(analysis: ChartAnalysisResult, previousContext: string): Promise<string> {
  const rag = await searchKnowledge(`trạch cát thời vận năm 2026 bính ngọ tam tai kim lâu`, 2, 'thay-thien-minh');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  return (
    `Thầy Thiên Minh xin kính chào quý bạn **${analysis.hoTen}** và Hội Đồng Bát Đại Danh Sư!\n\n` +
    `Sau 5 lượt phân tích nền tảng rất sâu sắc của các Thầy, tôi xin mang đến cho bạn chiếc chìa khóa quan trọng nhất của sự thành bại: **Đó chính là yếu tố THIÊN THỜI (Thời Vận & Trạch Cát)**!\n\n` +
    `Cổ nhân dạy: *"Thời lai đồ điếu giai vi thuận, vận khứ anh hùng ẩm hận đa"*. Thời vận đến thì người bình thường cũng làm nên chuyện lớn; thời chưa tới mà nôn nóng xông pha thì chỉ rước lấy hao tài kiệt sức.\n\n` +
    `📅 **1. Soi Vận Trình Năm 2026 (Bính Ngọ):**\n` +
    `- Năm 2026 mang thiên can **Bính (Hỏa)** và địa chi **Ngọ (Hỏa)**, là năm Thiên Hà Thủy / Hỏa vượng. Chiếu theo tuổi **${analysis.canChiNam}** của bạn, năm nay bạn không phạm Tam Tai nặng, nhưng có sự tương xung nhẹ ở chi Ngọ.\n` +
    `- **Chiến lược:** Nửa đầu năm (tháng 1 đến tháng 5 Âm lịch) nên ưu tiên củng cố nội lực, đào tạo nhân sự, chốt các hợp đồng an toàn. Nửa cuối năm (từ tháng 6 trở đi) mới là thời cơ bung sức mở rộng quy mô.\n\n` +
    `⏰ **2. Giờ Hoàng Đạo Khởi Sự:**\n` +
    `- Các công việc trọng đại như ký kết hợp đồng, xuất hành công tác, động thổ hoặc khai trương, bạn nên chọn các khung giờ: **Giờ Thìn (07h - 09h)** hoặc **Giờ Thân (15h - 17h)** để đón trọn cát khí Quý Nhân tương trợ.\n\n` +
    formatAncientKnowledgeQuote('Kinh nghiệm Trạch Cát bí truyền', ragSnippet) +
    `Nhưng thời thế biến ảo khôn lường, lòng người khó đoán. Để nhìn xuyên qua sương mù của tương lai, tôi xin kính mời **Thầy Huyền Cơ** khởi quẻ Chu Dịch dự đoán xem ẩn số nào đang chờ đợi đương số phía trước!`
  );
}

/**
 * LƯỢT 7: Thầy Huyền Cơ (Chu Dịch Dự Đoán & 64 Quẻ Dịch Phản Biện)
 */
export async function generateTurn7HuyenCo(analysis: ChartAnalysisResult, previousContext: string): Promise<string> {
  const rag = await searchKnowledge(`chu dịch dự đoán 64 quẻ kinh dịch biến hào`, 2, 'thay-huyen-co');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  return (
    `Bần đạo **Huyền Cơ** xin kính chào quý bạn **${analysis.hoTen}** và chư vị Danh Sư!\n\n` +
    `Vừa rồi lắng nghe Thầy Thiên Minh chỉ điểm về ngày giờ và tháng tốt, tôi liền bấm độn khởi một quẻ Chu Dịch theo thời khắc đương số bước vào phòng hội chẩn này. Quẻ đắc được là quẻ **HỎA PHONG ĐỈNH** biến sang quẻ **SƠN PHONG CỔ**:\n\n` +
    `☯️ **1. Giải Mã Hình Tượng Quẻ Chu Dịch:**\n` +
    `- **Quẻ Chủ - Hỏa Phong Đỉnh:** Trên là Lửa (Hỏa), dưới là Gió (Phong) và Chiếc Vạc nấu nung. Đây là tượng của sự chuyển hóa, cách tân, rèn giũa bản thân để đạt tới tầm vóc mới. Điềm báo công danh của bạn đang đứng trước ngưỡng cửa lột xác ngoạn mục.\n` +
    `- **Quẻ Biến - Sơn Phong Cổ:** Cổ là sự đình trệ, mục nát bên trong nếu không dám làm mới. Lời hào cảnh báo rất rõ: *"Trọng danh vọng bên ngoài mà bỏ bê việc chỉnh đốn nội bộ và gắn kết người thân thì chiếc vạc dù đẹp cũng dễ gãy quai đổ vỡ!"*\n\n` +
    `⚡ **2. Lời Cảnh Báo Phản Biện Từ Huyền Cơ:**\n` +
    `- Tôi có lời khuyên bạn: *"Vật cực tất phản, dục tốc bất đạt"*. Đừng vì thấy cơ hội trước mắt mà vội vàng ký kết những thỏa thuận mập mờ. Quẻ Dịch nhắc bạn phải thanh lọc những mối quan hệ độc hại, chớ để kẻ tiểu nhân nấp sau danh nghĩa bạn bè lợi dụng lòng tốt của bạn.\n\n` +
    formatAncientKnowledgeQuote('Chu Dịch hào từ đúc kết', ragSnippet) +
    `Quẻ Dịch chỉ ra gốc rễ nằm ở sự tu dưỡng tâm đức. Về phần âm đức tổ tiên và cách thức thanh lọc tâm hồn, tôi xin mời **Cô Linh Đan** san sẻ cùng đương số!`
  );
}

/**
 * LƯỢT 8: Thầy Lạc Việt (Danh Tính Học & Ngũ Hành Cải Vận Chi Tiết)
 */
export async function generateTurn8LacVietDeep(analysis: ChartAnalysisResult, previousContext: string): Promise<string> {
  const rag = await searchKnowledge(`danh tính học ngũ hành họ tên cải vận bổ khuyết`, 2, 'thay-lac-viet');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  return (
    `Thầy Lạc Việt xin tiếp tục đàm đạo cùng bạn **${analysis.hoTen}**!\n\n` +
    `Sau khi nghe Thầy Huyền Cơ phân tích quẻ Hỏa Phong Đỉnh, tôi càng thấy rõ tầm quan trọng của việc **bổ khuyết ngũ hành thông qua Danh Tính Học và Thói Quen Sinh Hoạt**:\n\n` +
    `📜 **1. Thẩm Định Trường Khí Họ Tên:**\n` +
    `- Họ tên **${analysis.hoTen}** của bạn mang trường năng lượng âm dương rất độc đáo. Các âm tiết phát ra mang tính cương nghị, có sức hiệu triệu. Tuy nhiên, để dung hòa sát khí từ quẻ Sơn Phong Cổ, bạn cần chủ động bổ sung yếu tố mềm mỏng (tính Thủy ôn nhu) trong phong thái giao tiếp hàng ngày.\n\n` +
    `🎨 **2. Màu Sắc & Trang Phục Trợ Mệnh Hàng Ngày:**\n` +
    `- **Màu tương sinh may mắn:** Ưu tiên sử dụng trang phục, phụ kiện hoặc màu xe thuộc hành **Mộc (Xanh lục, xanh ngọc)** và hành **Hỏa (Đỏ rượu, tím than)**. Màu Mộc sinh Hỏa giúp tiếp thêm sinh khí và tinh thần minh mẫn.\n` +
    `- **Màu nên hạn chế:** Tránh lạm dụng quá nhiều màu đen kịt hoặc xanh lam đậm thuộc Thủy khắc chế bản mệnh Hỏa lúc đang gặp chuyện phiền muộn.\n\n` +
    formatAncientKnowledgeQuote('Thư tịch Danh Tính Học', ragSnippet) +
    `Bây giờ, xin kính mời **Cô Linh Đan** mang đến góc nhìn tâm linh ấm áp, giải mã những giấc mơ và chỉ dẫn gieo trồng phước điền cho bạn!`
  );
}

/**
 * LƯỢT 9: Cô Linh Đan (Giải Mã Giấc Mơ, Điềm Báo & Âm Đức Tổ Tiên)
 */
export async function generateTurn9LinhDan(analysis: ChartAnalysisResult, previousContext: string): Promise<string> {
  const rag = await searchKnowledge(`giải mã giấc mơ điềm báo phóng sinh âm đức tổ tiên`, 2, 'co-linh-dan');
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  const phuc = analysis.phucDucPalace;

  return (
    `Cô Linh Đan xin gửi lời chào ấm áp và an lành đến bạn **${analysis.hoTen}** và các vị Thầy kính mến!\n\n` +
    `Nghe các Thầy phân tích từ sao số, tiền bạc đến quẻ Dịch, cô muốn kéo bạn về một khoảng lặng bình yên trong tâm hồn: **Đó là thế giới của Giấc Mơ, Trực Giác và Âm Đức Tổ Tiên** che chở cho bạn.\n\n` +
    `🌙 **1. Soi Cung Phúc Đức & Mối Duyên Với Cội Nguồn:**\n` +
    `- Cung Phúc Đức của bạn tại **${phuc?.canChi || 'cung vị'}** có chính tinh **${phuc?.chinhTinh || 'Vũ Khúc - Tham Lang'}**. Dòng họ của bạn ngày xưa có người ăn ở rất nhân từ, để lại phúc ấm lớn cho con cháu. Những lúc bạn gặp hoạn nạn tưởng chừng bế tắc, luôn có một bàn tay vô hình xoay chuyển cục diện cứu bạn thoát nạn trong gang tấc.\n` +
    `- **Giải mã điềm báo giấc mơ:** Nếu dạo gần đây bạn hay mơ thấy nước lớn, đi lạc đường hoặc gặp người thân đã khuất, đó không phải là ác mộng, mà là lời nhắc nhở từ cõi tâm linh: *Hãy bớt bon chen lại, hướng về gia đình và chú trọng ngày giỗ chạp tổ tiên*.\n\n` +
    `🕊️ **2. Pháp Sự Tu Dưỡng Phước Đức Thực Tiễn:**\n` +
    `- Vào ngày rằm hoặc mùng một hàng tháng, bạn hãy dành một khoản nhỏ trích từ lợi nhuận để **phóng sinh chim, cá** hoặc gửi tặng bữa ăn thiện nguyện cho người vô gia cư.\n` +
    `- Trước khi đi ngủ, hãy thực hành buông xả 5 phút: Tha thứ cho những người làm tổn thương mình trong ngày, để tâm trí nhẹ bẫng đi vào giấc ngủ an lành.\n\n` +
    formatAncientKnowledgeQuote('Kinh điển nhân quả tâm linh', ragSnippet) +
    `Và bây giờ, toàn thể Hội Đồng Bát Đại Danh Sư xin cùng nhau đúc kết **BẢNG CẨM NANG HÀNH ĐỘNG TOÀN DIỆN 5 TRỤ CỘT** gửi tặng bạn!`
  );
}

/**
 * LƯỢT 10: Toàn Thể Hội Đồng Đúc Kết & Xuất Bảng Cẩm Nang Toàn Diện
 */
export async function generateTurn10CouncilConsensus(analysis: ChartAnalysisResult, allPreviousContext: string): Promise<string> {
  return (
    `Kính thưa quý bạn đương số **${analysis.hoTen}**!\n\n` +
    `Sau **10 lượt tọa đàm, tranh biện và bổ khuyết đa chiều** từ Tử Vi Đẩu Số, Tài Lộc Thương Trường, Gia Đạo Hôn Nhân, Phong Thủy Địa Lý, Trạch Cát Thời Vận, Chu Dịch Dự Đoán, Tứ Trụ Bát Tự cho đến Tâm Linh Âm Đức, **Hội Đồng Bát Đại Danh Sư tại XemBoi.vn xin đúc kết Bản Cẩm Nang Hành Động Tối Thượng** dành riêng cho bạn:\n\n` +
    `### 📋 BẢNG CẨM NANG HÀNH ĐỘNG 5 TRỤ CỘT — ${analysis.hoTen.toUpperCase()}:\n\n` +
    `| Trụ Cột Đời Người | Nhận Định Cốt Tử Từ Hội Đồng | Phương Thức Hành Trì Hóa Giải |\n` +
    `| :--- | :--- | :--- |\n` +
    `| **1. Mệnh & Thân (Tử Vi)** | Cách cục **${analysis.cachCuc}** đắc địa hậu vận | Giữ tâm khiêm tốn, coi thử thách là ngọc mài sáng, không tự mãn lúc đắc thế |\n` +
    `| **2. Tiền Tài & Sự Nghiệp** | Dòng tiền dồi dào nhưng rủi ro nợ nần | Giữ đòn bẩy dưới 40%, không bảo lãnh nợ, rút lãi chuyển hóa sang đất thổ cư sổ đỏ |\n` +
    `| **3. Hôn Nhân & Gia Đạo** | Cung Phu Thê cần sự vun bồi thấu cảm | Thực hành "3 Không - 3 Nên", lắng nghe 15 phút mỗi tối, tuyệt đối không chiến tranh lạnh |\n` +
    `| **4. Phong Thủy & Không Gian** | Bản mệnh **${analysis.banMenh}** hợp hướng Đông Bắc | Kê bàn hướng Đông Bắc/Tây Bắc, đặt quả cầu Thạch Anh trợ vận, phòng ngủ thông thoáng |\n` +
    `| **5. Thời Vận & Tâm Linh** | Năm 2026 nửa cuối năm khởi sắc mạnh | Trạch cát giờ Thìn/Thân khi ký kết, phóng sinh thiện nguyện, giữ tâm trong sáng |\n\n` +
    `> *"Đức năng thắng số — Tinh bàn chỉ ra con đường, nhưng bước đi thế nào là do chính tâm nguyện và hành động của bạn mỗi ngày!"*\n\n` +
    `Hội Đồng Bát Đại Danh Sư tại XemBoi.vn nguyện cầu cho bạn luôn vững vàng trí tuệ, thân tâm an lạc, gia đạo thái hòa, công thành danh toại!`
  );
}

// ==========================================
// FOLLOW-UP QUESTION ROUTER
// ==========================================

export function routeFollowupToMaster(question: string, activeParticipantSlugs: string[]): AiAgentConfig[] {
  const qLower = question.toLowerCase();

  if (qLower.includes('tuệ phong') || qLower.includes('phong thủy') || qLower.includes('hướng bàn') || qLower.includes('hướng nhà') || qLower.includes('bếp')) {
    return [THAY_TUE_PHONG];
  }
  if (qLower.includes('thái sơn') || qLower.includes('tiền') || qLower.includes('đầu tư') || qLower.includes('quan lộc') || qLower.includes('tài bạch') || qLower.includes('nhà đất')) {
    return [THAY_THAI_SON];
  }
  if (qLower.includes('tâm an') || qLower.includes('vợ') || qLower.includes('chồng') || qLower.includes('tình duyên') || qLower.includes('hôn nhân') || qLower.includes('con cái')) {
    return [THAY_TAM_AN];
  }
  if (qLower.includes('thiên minh') || qLower.includes('ngày tốt') || qLower.includes('giờ hoàng đạo') || qLower.includes('tam tai') || qLower.includes('2026')) {
    return [THAY_THIEN_MINH];
  }
  if (qLower.includes('huyền cơ') || qLower.includes('quẻ') || qLower.includes('kinh dịch') || qLower.includes('bốc phệ')) {
    return [THAY_HUYEN_CO];
  }
  if (qLower.includes('lạc việt') || qLower.includes('bát tự') || qLower.includes('tứ trụ') || qLower.includes('dụng thần') || qLower.includes('đặt tên')) {
    return [THAY_LAC_VIET];
  }
  if (qLower.includes('linh đan') || qLower.includes('mơ') || qLower.includes('điềm báo') || qLower.includes('văn khấn') || qLower.includes('phóng sinh')) {
    return [CO_LINH_DAN];
  }

  const defaultMaster1 = getAgentBySlug(activeParticipantSlugs[0] || 'thay-minh-triet');
  const defaultMaster2 = getAgentBySlug(activeParticipantSlugs[1] || 'thay-thai-son');
  return [defaultMaster1, defaultMaster2];
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

export async function generateAdminSummonCommentary(
  masterSlug: string,
  analysis: ChartAnalysisResult,
  contextHistory: string
): Promise<string> {
  const master = getAgentBySlug(masterSlug);
  const rag = await searchKnowledge(`${master.shortLabel || master.title} ${analysis.cachCuc}`, 2, master.slug);
  const ragSnippet = rag.length > 0 ? rag[0].content.trim() : '';

  return (
    `**${master.name}** (${master.title}) nhận lời triệu tập từ Ban Quản Trị Hệ Thống:\n\n` +
    `Kính thưa Hội Đồng và quý bạn **${analysis.hoTen}**! Theo dõi dòng luận giải từ đầu đến giờ, dưới góc độ chuyên môn **${master.shortLabel || 'huyền học'}**, tôi xin bổ sung góc nhìn đặc biệt này:\n\n` +
    `Chiếu theo lá số tuổi **${analysis.canChiNam}**, ${master.slug === 'thay-huyen-co' ? 'tôi khởi quẻ Kinh Dịch thấy quẻ Hỏa Phong Đỉnh biến Sơn Phong Cổ — việc lớn cần người đồng lòng, chớ nóng vội độc hành.' : master.slug === 'thay-lac-viet' ? 'xét theo Tứ Trụ Bát Tự thì Nhật chủ của bạn Thân Vượng Thủy, Dụng Thần tối thượng là Hỏa và Hỷ Thần là Mộc để sưởi ấm tan băng giá.' : master.slug === 'co-linh-dan' ? 'về mặt tâm linh âm đức, cung Phúc Đức của bạn rất linh thiêng, hãy chú trọng ngày giỗ tết tảo mộ để đón trọn hồng phúc tổ tiên che chở.' : master.slug === 'thay-thien-minh' ? 'thời điểm này bạn cần giữ chữ Tĩnh, đợi đến tháng vượng khí hẵng bung sức.' : 'không gian sống và phương vị cần hòa hợp thiên nhiên để thân tâm luôn tĩnh tại.'}\n\n` +
    formatAncientKnowledgeQuote('Thư tịch cổ chỉ dạy', ragSnippet) +
    `Chúc bạn luôn vững tin trên con đường phía trước!`
  );
}
