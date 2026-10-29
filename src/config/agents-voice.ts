/**
 * CẤU HÌNH HỒ SƠ ÂM THANH & GIỌNG ĐỌC AI CHUẨN HÓA THEO GIỚI TÍNH
 * Phân định chính xác Giới Tính của Khách Hàng (Nam / Nữ) & Bát Đại Danh Sư
 * Tích hợp Edge Neural TTS (vi-VN-NamMinhNeural / vi-VN-HoaiMyNeural) & Guqin Ambient BGM
 */

export interface AgentVoiceProfile {
  agentSlug: string;
  name: string;
  title: string;
  gender: 'male' | 'female';
  estimatedAge: number;
  voiceProvider: string;
  voiceId: string; // Edge-TTS identifier (vi-VN-NamMinhNeural / vi-VN-HoaiMyNeural)
  edgeVoice: string; // Exact Edge Neural Voice Name
  edgePitch: string; // SSML prosody pitch (e.g. "-18Hz", "+12Hz", "+0Hz")
  edgeRate: string; // SSML prosody rate (e.g. "-10%", "+2%", "+0%")
  voiceSpeed: number; // 0.8 - 1.15
  voicePitch: string; // e.g. "-4st", "-1st", "+2st"
  webSpeechPitch: number; // 0.5 - 1.5 for Web Speech API fallback
  webSpeechRate: number; // 0.8 - 1.2
  voiceTone: string;
  timbreDescription: string;
  ambientTrackUrl: string;
  avatarRingColor: string;
}

export interface BgmTrackConfig {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  volume: number; // Default volume: 0.25 (ducked to 0.08 during speech)
  description: string;
  recommendedFor: string[];
}

export interface SfxTrackConfig {
  id: string;
  name: string;
  url: string;
  volume: number;
  description: string;
}

/**
 * HỒ SƠ GIỌNG ĐỌC BÁT ĐẠI DANH SƯ & KHÁCH HÀNG (NAM / NỮ)
 */
export const AGENTS_VOICE_CONFIG: Record<string, AgentVoiceProfile> = {
  // 1. THẦY MINH TRIẾT (Nam - Lão niên, Trưởng lão đắc đạo) - Tốc độ tăng 20%
  'thay-minh-triet': {
    agentSlug: 'thay-minh-triet',
    name: 'Thầy Minh Triết',
    title: 'Đại Sư Tử Vi Đẩu Số & Mệnh Lý Học',
    gender: 'male',
    estimatedAge: 60,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '-18Hz',
    edgeRate: '+10%',
    voiceSpeed: 1.08,
    voicePitch: '-4st',
    webSpeechPitch: 0.78,
    webSpeechRate: 1.06,
    voiceTone: 'Deep Wise Elder',
    timbreDescription: 'Trầm ấm, khoan thai, uy nghiêm, độ vang sâu như bậc Trưởng lão đắc đạo',
    ambientTrackUrl: '/audio/bgm/co-cam-thien-dinh.mp3',
    avatarRingColor: '#eab308',
  },

  // 2. THẦY TÂM AN (Nam - Từ ái, thiền vị, chữa lành) - Tốc độ tăng 20%
  'thay-tam-an': {
    agentSlug: 'thay-tam-an',
    name: 'Thầy Tâm An',
    title: 'Đại Sư Hôn Nhân, Tình Duyên & Gia Đạo',
    gender: 'male',
    estimatedAge: 48,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '-4Hz',
    edgeRate: '+14%',
    voiceSpeed: 1.13,
    voicePitch: '-1st',
    webSpeechPitch: 0.95,
    webSpeechRate: 1.10,
    voiceTone: 'Warm Empathetic',
    timbreDescription: 'Từ ái, nhẹ nhàng, truyền cảm, ấm áp chữa lành nỗi niềm duyên số',
    ambientTrackUrl: '/audio/bgm/tra-dao-thanh-am.mp3',
    avatarRingColor: '#ec4899',
  },

  // 3. THẦY THÁI SƠN (Nam - Đĩnh đạc, quyền uy, thương trường) - Tốc độ tăng 20%
  'thay-thai-son': {
    agentSlug: 'thay-thai-son',
    name: 'Thầy Thái Sơn',
    title: 'Chuyên Gia Kinh Doanh, Đầu Tư & Tài Vận',
    gender: 'male',
    estimatedAge: 50,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '-10Hz',
    edgeRate: '+24%',
    voiceSpeed: 1.25,
    voicePitch: '-3st',
    webSpeechPitch: 0.86,
    webSpeechRate: 1.22,
    voiceTone: 'Authoritative Baritone',
    timbreDescription: 'Dứt khoát, hào sảng, nội lực mạnh mẽ, sắc bén bản lĩnh thương trường',
    ambientTrackUrl: '/audio/bgm/co-cam-thien-dinh.mp3',
    avatarRingColor: '#d97706',
  },

  // 4. THẦY THIÊN MINH (Nam - Chuẩn mực, tròn vành rõ chữ, thiên văn) - Tốc độ tăng 20%
  'thay-thien-minh': {
    agentSlug: 'thay-thien-minh',
    name: 'Thầy Thiên Minh',
    title: 'Đại Sư Trạch Cát, Kỳ Môn & Chọn Ngày Giờ',
    gender: 'male',
    estimatedAge: 55,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '-8Hz',
    edgeRate: '+18%',
    voiceSpeed: 1.18,
    voicePitch: '-2st',
    webSpeechPitch: 0.90,
    webSpeechRate: 1.15,
    voiceTone: 'Scholarly Calm',
    timbreDescription: 'Tròn vành rõ chữ, điềm tĩnh, chuẩn mực thông tuệ thời vận và tiết khí',
    ambientTrackUrl: '/audio/bgm/co-cam-thien-dinh.mp3',
    avatarRingColor: '#0284c7',
  },

  // 5. THẦY HUYỀN CƠ (Nam - Lão ẩn sĩ, cổ kính, thâm trầm quẻ Dịch) - Tốc độ tăng 20%
  'thay-huyen-co': {
    agentSlug: 'thay-huyen-co',
    name: 'Thầy Huyền Cơ',
    title: 'Ẩn Sĩ Chu Dịch Dự Đoán Học',
    gender: 'male',
    estimatedAge: 65,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '-22Hz',
    edgeRate: '+6%',
    voiceSpeed: 1.03,
    voicePitch: '-6st',
    webSpeechPitch: 0.70,
    webSpeechRate: 0.98,
    voiceTone: 'Mystic Ancient Hermit',
    timbreDescription: 'Cổ kính, thâm trầm, hơi khàn nhẹ đầy chất tiên phong đạo cốt thấu triệt quẻ Dịch',
    ambientTrackUrl: '/audio/bgm/sao-truc-tinh-khong.mp3',
    avatarRingColor: '#8b5cf6',
  },

  // 6. THẦY TUỆ PHONG (Nam - Nho nhã, khoa học, phong thủy thực nghiệm) - Tốc độ tăng 20%
  'thay-tue-phong': {
    agentSlug: 'thay-tue-phong',
    name: 'Thầy Tuệ Phong',
    title: 'Chuyên Gia Phong Thủy Bát Trạch & Địa Lý',
    gender: 'male',
    estimatedAge: 45,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0Hz',
    edgeRate: '+22%',
    voiceSpeed: 1.20,
    voicePitch: '0st',
    webSpeechPitch: 1.00,
    webSpeechRate: 1.20,
    voiceTone: 'Refined Intellectual',
    timbreDescription: 'Nho nhã, sáng sủa, mạch lạc trường khí phong thủy và nhà đất thực nghiệm',
    ambientTrackUrl: '/audio/bgm/tra-dao-thanh-am.mp3',
    avatarRingColor: '#10b981',
  },

  // 7. THẦY LẠC VIỆT (Nam - Sắc bén, logic Tứ Trụ Bát Tự) - Tốc độ tăng 20%
  'thay-lac-viet': {
    agentSlug: 'thay-lac-viet',
    name: 'Thầy Lạc Việt',
    title: 'Đại Sư Tứ Trụ Bát Tự, Ngũ Hành & Danh Tính',
    gender: 'male',
    estimatedAge: 45,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '-5Hz',
    edgeRate: '+20%',
    voiceSpeed: 1.20,
    voicePitch: '-1st',
    webSpeechPitch: 0.95,
    webSpeechRate: 1.20,
    voiceTone: 'Analytical Sharp',
    timbreDescription: 'Khúc chiết, logic, chặt chẽ khi luận giải Dụng Thần ngũ hành và cải vận',
    ambientTrackUrl: '/audio/bgm/co-cam-thien-dinh.mp3',
    avatarRingColor: '#f97316',
  },

  // 8. CÔ LINH ĐAN (NỮ DANH SƯ DUY NHẤT - Trong trẻo, dịu dàng, thiền y) - Tốc độ tăng 20%
  'co-linh-dan': {
    agentSlug: 'co-linh-dan',
    name: 'Cô Linh Đan',
    title: 'Chuyên Gia Tâm Linh, Giấc Mơ & Điềm Báo',
    gender: 'female',
    estimatedAge: 32,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-HoaiMyNeural', // Vietnamese female neural voice
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+12Hz',
    edgeRate: '+16%',
    voiceSpeed: 1.13,
    voicePitch: '+2st',
    webSpeechPitch: 1.25,
    webSpeechRate: 1.10,
    voiceTone: 'Serene Ethereal Female',
    timbreDescription: 'Trong trẻo, dịu dàng, huyền diệu như tiếng suối mát soi chiếu cõi tâm linh',
    ambientTrackUrl: '/audio/bgm/sao-truc-tinh-khong.mp3',
    avatarRingColor: '#06b6d4',
  },

  // 9. KHÁCH HÀNG NAM (Đương số Nam / Anh Minh 1986 Bính Dần) - Tốc độ tăng 20%
  'khach-hang-nam': {
    agentSlug: 'khach-hang-nam',
    name: 'Khách Hàng (Nam)',
    title: 'Đương Số Nam Mệnh',
    gender: 'male',
    estimatedAge: 38,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-NamMinhNeural',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0Hz',
    edgeRate: '+22%',
    voiceSpeed: 1.22,
    voicePitch: '0st',
    webSpeechPitch: 1.02,
    webSpeechRate: 1.22,
    voiceTone: 'Sincere Questioner',
    timbreDescription: 'Chân thành, tự nhiên, khiêm nhường, kính cẩn thỉnh giáo chư vị Đại Sư',
    ambientTrackUrl: '/audio/bgm/co-cam-thien-dinh.mp3',
    avatarRingColor: '#38bdf8',
  },

  // 10. KHÁCH HÀNG NỮ (Đương số Nữ / Chị Bích / Khách Nữ) - Tốc độ tăng 20%
  'khach-hang-nu': {
    agentSlug: 'khach-hang-nu',
    name: 'Khách Hàng (Nữ)',
    title: 'Đương Số Nữ Mệnh',
    gender: 'female',
    estimatedAge: 30,
    voiceProvider: 'edge_neural',
    voiceId: 'vi-VN-HoaiMyNeural', // Vietnamese female neural voice
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+6Hz',
    edgeRate: '+20%',
    voiceSpeed: 1.20,
    voicePitch: '+1st',
    webSpeechPitch: 1.18,
    webSpeechRate: 1.18,
    voiceTone: 'Gentle Inquiring Female',
    timbreDescription: 'Dịu dàng, nhẹ nhàng, trong trẻo, chân thành hỏi chuyện và thỉnh vấn các Thầy',
    ambientTrackUrl: '/audio/bgm/sao-truc-tinh-khong.mp3',
    avatarRingColor: '#f472b6',
  },
};

/**
 * Danh sách 3 Nhạc Nền Cổ Phong (Zen Guqin Ambient Tracks)
 */
export const BGM_TRACKS: BgmTrackConfig[] = [
  {
    id: 'co-cam-thien-dinh',
    title: 'Cổ Cầm Tĩnh Tâm',
    subtitle: 'Guqin Meditation Zen',
    url: '/audio/bgm/co-cam-thien-dinh.mp3',
    volume: 0.25,
    description: 'Âm sắc Cổ cầm ngũ cung thanh tịnh, dẫn dắt tâm trí định tĩnh để lắng nghe luận giải đại cục.',
    recommendedFor: ['thay-minh-triet', 'thay-thai-son', 'thay-thien-minh', 'thay-lac-viet', 'COUNCIL_CONSULTATION', 'khach-hang-nam'],
  },
  {
    id: 'sao-truc-tinh-khong',
    title: 'Tiêu Sáo Tinh Không',
    subtitle: 'Bamboo Flute Cosmic Echo',
    url: '/audio/bgm/sao-truc-tinh-khong.mp3',
    volume: 0.25,
    description: 'Tiếng tiêu sáo ngân vang giữa trời sao huyền bí, thích hợp khởi quẻ Kinh Dịch và soi chiếu giấc mơ.',
    recommendedFor: ['thay-huyen-co', 'co-linh-dan', 'khach-hang-nu'],
  },
  {
    id: 'tra-dao-thanh-am',
    title: 'Thanh Âm Trà Đạo',
    subtitle: 'Tea Ceremony & Flowing Water',
    url: '/audio/bgm/tra-dao-thanh-am.mp3',
    volume: 0.25,
    description: 'Tiếng nước chảy róc rách và chuông gió an nhiên, thanh lọc trường khí gia đạo và phong thủy.',
    recommendedFor: ['thay-tam-an', 'thay-tue-phong'],
  },
];

/**
 * Hiệu ứng âm thanh chuyển lượt (Traditional Sound Effects - SFX)
 */
export const SFX_TRACKS: Record<string, SfxTrackConfig> = {
  CHIME: {
    id: 'wooden-fish-chime',
    name: 'Khánh Ngọc Đăng Đàn',
    url: '/audio/sfx/wooden-fish-chime.mp3',
    volume: 0.40,
    description: 'Tiếng khánh đồng ngân nhẹ khi một vị Đại Sư bắt đầu đăng đàn phát biểu.',
  },
  SCROLL: {
    id: 'scroll-unfold',
    name: 'Mở Cuộn Trúc',
    url: '/audio/sfx/scroll-unfold.mp3',
    volume: 0.35,
    description: 'Tiếng lách cách mở cuộn trúc cổ khi triệu tập phiên Hội Chẩn.',
  },
  COIN_TOSS: {
    id: 'coin-toss',
    name: 'Gieo Xu Chu Dịch',
    url: '/audio/sfx/coin-toss.mp3',
    volume: 0.45,
    description: 'Tiếng gieo đồng tiền cổ kim loại khi Thầy Huyền Cơ bấm quẻ Kinh Dịch.',
  },
};

/**
 * THUẬT TOÁN NHẬN DIỆN GIỚI TÍNH TỰ ĐỘNG CỦA KHÁCH HÀNG (NAM / NỮ)
 */
export function detectGenderFromContext(options?: {
  gender?: string | null;
  name?: string | null;
  chartSummary?: string | null;
  text?: string | null;
}): 'male' | 'female' {
  if (!options) return 'male';

  // 1. Kiểm tra trường giới tính rõ ràng
  const rawGender = (options.gender || '').toLowerCase().trim();
  if (
    rawGender === 'female' ||
    rawGender === 'nu' ||
    rawGender === 'nữ' ||
    rawGender.includes('female') ||
    rawGender.includes('nu') ||
    rawGender.includes('nữ')
  ) {
    return 'female';
  }
  if (
    rawGender === 'male' ||
    rawGender === 'nam' ||
    rawGender.includes('male') ||
    rawGender.includes('nam')
  ) {
    return 'male';
  }

  // 2. Kiểm tra tóm tắt lá số (chartSummary)
  const summary = (options.chartSummary || '').toLowerCase();
  if (summary.includes('· nữ ·') || summary.includes('nữ mệnh') || summary.includes('con gái') || summary.includes('bé gái')) {
    return 'female';
  }
  if (summary.includes('· nam ·') || summary.includes('nam mệnh') || summary.includes('con trai') || summary.includes('bé trai')) {
    return 'male';
  }

  // 3. Kiểm tra tên gọi khách hàng (Tiếng Việt)
  const name = (options.name || '').toLowerCase();
  const femaleKeywords = [
    'thị', 'bích', 'lan', 'hoa', 'mai', 'linh', 'hương', 'nga', 'trang', 'phương',
    'nhi', 'vy', 'thảo', 'hà', 'yến', 'dung', 'huyền', 'ngọc', 'chị', 'cô', 'bà', 'mẹ', 'bé gái'
  ];
  for (const kw of femaleKeywords) {
    if (name.includes(kw)) return 'female';
  }

  return 'male';
}

/**
 * LẤY HỒ SƠ GIỌNG ĐỌC CHUẨN XÁC THEO GIỚI TÍNH CỦA KHÁCH HÀNG HOẶC TỪNG VỊ THẦY
 */
export function getAgentVoiceProfile(
  slug?: string | null,
  options?: {
    gender?: string | null;
    customerName?: string | null;
    chartSummary?: string | null;
  }
): AgentVoiceProfile {
  if (!slug) return AGENTS_VOICE_CONFIG['thay-minh-triet'];

  const normalized = slug.toLowerCase().trim();

  // Khớp trực tiếp trong bảng cấu hình
  if (AGENTS_VOICE_CONFIG[normalized]) {
    return AGENTS_VOICE_CONFIG[normalized];
  }

  // Khớp các alias của Khách Nam
  if (
    normalized === 'khach-minh-1986' ||
    normalized === 'minh-1986' ||
    normalized === 'user-male' ||
    normalized === 'customer-male' ||
    normalized === 'khach-nam'
  ) {
    return AGENTS_VOICE_CONFIG['khach-hang-nam'];
  }

  // Khớp các alias của Khách Nữ
  if (
    normalized === 'khach-hang-nu' ||
    normalized === 'customer-female' ||
    normalized === 'user-female' ||
    normalized === 'bich-2020' ||
    normalized === 'khach-nu'
  ) {
    return AGENTS_VOICE_CONFIG['khach-hang-nu'];
  }

  // Khách hàng vãng lai / Đương số tổng quát: Phân giải theo giới tính
  if (
    normalized === 'user' ||
    normalized === 'customer' ||
    normalized.startsWith('khach-') ||
    normalized.startsWith('customer-')
  ) {
    const detectedGender = detectGenderFromContext({
      gender: options?.gender,
      name: options?.customerName,
      chartSummary: options?.chartSummary,
    });
    return detectedGender === 'female'
      ? AGENTS_VOICE_CONFIG['khach-hang-nu']
      : AGENTS_VOICE_CONFIG['khach-hang-nam'];
  }

  return AGENTS_VOICE_CONFIG['thay-minh-triet'];
}

/**
 * TIỀN XỬ LÝ VĂN BẢN TRƯỚC KHI ĐƯA VÀO TEXT-TO-SPEECH
 * - Loại bỏ toàn bộ ký tự Markdown (**, *, #, >, -, `)
 * - Mở rộng các ký hiệu viết tắt Tử Vi sang chữ đọc chuẩn tiếng Việt
 * - Loại bỏ các bảng biểu Markdown thừa
 */
export function cleanTextForTTS(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText;

  // 1. Loại bỏ bảng Markdown (chỉ giữ phần nhận định)
  cleaned = cleaned.replace(/\|[^\n]+\|/g, ' ');

  // 2. Chuyển đổi trạng thái sao Tử Vi viết tắt thành từ ngữ phát âm chuẩn
  cleaned = cleaned
    .replace(/\(M\)/gi, ' miếu địa ')
    .replace(/\(V\)/gi, ' vượng địa ')
    .replace(/\(Đ\)/gi, ' đắc địa ')
    .replace(/\(B\)/gi, ' bình hòa ')
    .replace(/\(H\)/gi, ' hãm địa ');

  // 3. Loại bỏ Markdown formatting
  cleaned = cleaned
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/#{1,6}\s+/g, '') // headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/^>\s*/gm, '') // blockquotes
    .replace(/^[-*+]\s+/gm, '') // list items
    .replace(/^\d+\.\s+/gm, '') // ordered list numbers
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // code blocks
    .replace(/[|~_]/g, ' ') // table separators and underscores
    .replace(/\s+/g, ' ') // collapse whitespaces
    .trim();

  return cleaned;
}
