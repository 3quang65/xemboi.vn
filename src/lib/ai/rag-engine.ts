import { prisma } from '@/lib/prisma';
import { getAgentBySlug, THAY_MINH_TRIET, AiAgentConfig } from './agent-persona';

export interface KnowledgeChunkItem {
  id: string;
  docTitle: string;
  category: string;
  content: string;
  metadata?: Record<string, any>;
  score?: number;
}

export const inMemoryChunks: KnowledgeChunkItem[] = [];

// 1. Auto-load general seeded knowledge into inMemoryChunks
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const seeded = require('./seeded-knowledge.json');
  if (Array.isArray(seeded)) {
    seeded.forEach((topic: any, idx: number) => {
      inMemoryChunks.push({
        id: `seeded_chunk_${idx}`,
        docTitle: topic.title,
        category: topic.category,
        content: topic.content,
        metadata: { tags: topic.tags },
      });
    });
  }
} catch {
  // Ignore
}

// 2. Auto-load specialized knowledge for Bát Đại Danh Sư (8 Agents)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const seeded8 = require('./seeded-knowledge-8-agents.json');
  if (Array.isArray(seeded8)) {
    seeded8.forEach((topic: any, idx: number) => {
      inMemoryChunks.push({
        id: `agent8_chunk_${idx}`,
        docTitle: topic.title,
        category: topic.category,
        content: topic.content,
        metadata: {
          tags: topic.tags,
          agentSlug: topic.agentSlug,
          agentName: topic.agentName,
        },
      });
    });
  }
} catch {
  // Ignore
}

/**
 * Creates a normalized 1536-dimension pseudo-vector from text
 * for compatibility with pgvector Unsupported("vector(1536)").
 */
export function generateVectorEmbedding(text: string): number[] {
  const dim = 1536;
  const vec = new Float64Array(dim);
  const clean = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);

  let seed = 1337;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let h = 0;
    for (let c = 0; c < w.length; c++) {
      h = (Math.imul(31, h) + w.charCodeAt(c)) | 0;
    }
    const idx = Math.abs(h) % dim;
    vec[idx] += 1.0;
    seed = (seed ^ h) * 16807;
    const secondaryIdx = Math.abs(seed) % dim;
    vec[secondaryIdx] += 0.5;
  }

  // Normalize L2 norm
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1.0;
  const result: number[] = new Array(dim);
  for (let i = 0; i < dim; i++) {
    result[i] = Number((vec[i] / norm).toFixed(6));
  }
  return result;
}

let dbOfflineUntil = 0;

/**
 * Searches the Knowledge Base using vector cosine search or semantic fallback
 * Can filter or boost knowledge specifically targeted to a given agentSlug
 */
export async function searchKnowledge(query: string, limit = 4, agentSlug?: string): Promise<KnowledgeChunkItem[]> {
  const queryVec = generateVectorEmbedding(query);
  const cleanQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const keywords = cleanQuery.split(/\s+/).filter((w) => w.length > 2);

  const now = Date.now();
  if (now > dbOfflineUntil) {
    try {
      // If PostgreSQL and pgvector are available (with fast 1.5s circuit-breaker)
      const vecStr = `[${queryVec.join(',')}]`;
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 1500));
      const queryPromise = prisma.$queryRaw<any[]>`
        SELECT 
          c.id, 
          c.content, 
          c.metadata, 
          d.title as "docTitle", 
          d.category,
          1 - (c.embedding <=> ${vecStr}::vector) as score
        FROM "AgentKnowledgeChunk" c
        JOIN "AgentKnowledgeDoc" d ON c."docId" = d.id
        ORDER BY c.embedding <=> ${vecStr}::vector ASC
        LIMIT ${limit}
      `;

      const rows = (await Promise.race([queryPromise, timeoutPromise])) as any[];

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          docTitle: r.docTitle,
          category: r.category,
          content: r.content,
          metadata: r.metadata,
          score: Number(r.score) || 0.8,
        }));
      }
    } catch {
      // Graceful fallback with 5-minute circuit-breaker to avoid repeated connection timeouts
      dbOfflineUntil = now + 300000;
    }
  }

  // In-memory scoring (Title, Tags, Content weighted + Agent affinity boost)
  const scored = inMemoryChunks.map((chunk) => {
    const chunkTitle = (chunk.docTitle || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const chunkText = (chunk.content || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const tags = Array.isArray(chunk.metadata?.tags)
      ? chunk.metadata.tags.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : '';

    let matches = 0;
    for (const kw of keywords) {
      if (chunkTitle.includes(kw)) matches += 3;
      if (tags.includes(kw)) matches += 2;
      if (chunkText.includes(kw)) matches += 1;
    }

    // High boost if chunk is specifically authored for this agent
    if (agentSlug && chunk.metadata?.agentSlug === agentSlug) {
      matches += 5;
    }

    const score = keywords.length > 0 ? matches / (keywords.length * 3 + 2) : 0.5;
    return { ...chunk, score };
  });

  scored.sort((a, b) => (b.score || 0) - (a.score || 0));
  return scored.slice(0, limit);
}

/**
 * Builds a comprehensive Markdown block representing the active birth chart
 * so the AI Agent has full Palace, Star, and Transit visibility.
 */
export function buildChartContext(chart: any): string {
  if (!chart || (!chart.cung && !chart.palacesData)) return '';
  const cungList: any[] = chart.cung || chart.palacesData || [];
  const duong = chart.duong || {};
  const am = chart.am || {};
  const cc = chart.canChi || {};

  const lines: string[] = [
    '=== [LÁ SỐ TỬ VI HIỆN TẠI CỦA KHÁCH HÀNG] ===',
    `- Họ tên: ${chart.ten || 'Đương Số'} | Giới tính: ${chart.gioiTinh || 'Nam'}`,
    `- Ngày sinh Dương lịch: ${duong.ngay || chart.solarDay}/${duong.thang || chart.solarMonth}/${duong.nam || chart.solarYear}`,
    `- Âm lịch: ngày ${am.ngay || chart.lunarDay} tháng ${am.thang || chart.lunarMonth}${am.nhuan || chart.isLeapMonth ? ' (nhuận)' : ''} năm ${cc.nam || chart.canChiYear}`,
    `- Giờ sinh: ${chart.gio?.canChi || chart.canChiHour || ''} (${chart.gio?.khoang || ''})`,
    `- Bản mệnh Nạp âm: ${chart.banMenh} | Cục: ${chart.cuc || chart.cucName}`,
    `- Mệnh chủ: ${chart.menhChu} | Thân chủ: ${chart.thanChu}`,
    `- Tuần Không: ${chart.tuan} | Triệt Không: ${chart.triet}`,
    `- Năm xem hạn: ${chart.namXem || chart.yearViewing || 2026}`,
    '',
    '--- CHI TIẾT 12 CUNG ĐỊA BÀN ---',
  ];

  for (const c of cungList) {
    const chinh = (c.chinhTinh || []).map((s: any) => `${s.ten}${s.dacTinh ? `(${s.dacTinh})` : ''}${s.hoa ? `-${s.hoa}` : ''}`).join(', ') || 'Vô chính diệu';
    const cat = (c.catTinh || []).map((s: any) => s.ten).join(', ') || 'Không';
    const hung = (c.hungTinh || []).map((s: any) => s.ten).join(', ') || 'Không';
    const luu = (c.luuTinh || []).map((s: any) => s.ten).join(', ') || '';
    const tags = [c.laThan ? 'CUNG THÂN' : '', c.tuan ? 'TUẦN' : '', c.triet ? 'TRIỆT' : ''].filter(Boolean).join(' | ');

    lines.push(
      `* Cung ${c.ten} (tại ${c.can} ${c.tenChi || ''}): ${tags ? `[${tags}] ` : ''}Đại vận ${c.daiVanTu || c.daiVan}t, Tiểu hạn ${c.tieuHan || ''}`
    );
    lines.push(`  + Chính tinh: ${chinh}`);
    lines.push(`  + Cát tinh: ${cat}`);
    lines.push(`  + Hung/Sát tinh: ${hung}`);
    if (luu) lines.push(`  + Sao Lưu hạn năm: ${luu}`);
  }

  lines.push('=== [HẾT DỮ LIỆU LÁ SỐ] ===');
  return lines.join('\n');
}

/**
 * Streams the reasoning and response from the active Master Agent (Bát Đại Danh Sư)
 */

import { streamLlmOrFallback } from './llm-provider';

/**
 * Streams the reasoning and response from the active Master Agent (Bát Đại Danh Sư)
 * Hỗ trợ đa mô hình (Gemini 4 Argon, OpenAI, DeepSeek) với Fallback Đàm Đạo Tự Nhiên
 */
export async function* streamChatResponse(params: {
  userMessage: string;
  conversationHistory: Array<{ role: string; content: string }>;
  chartData?: any;
  agentSlug?: string;
}): AsyncGenerator<string, { fullText: string; citedSources: string[] }, unknown> {
  const { userMessage, conversationHistory, chartData, agentSlug } = params;

  // Resolve active Agent persona
  const agent: AiAgentConfig = getAgentBySlug(agentSlug || 'thay-minh-triet');

  // 1. Retrieve relevant RAG knowledge chunks prioritized for this agent
  const knowledge = await searchKnowledge(userMessage, 2, agent.slug);
  const citedSources = knowledge.map((k) => k.docTitle);

  // 2. Build Chart Context (if client is viewing a chart)
  const chartContext = buildChartContext(chartData);

  // 3. Synthesize system prompt
  const systemInstruction = [
    agent.systemPrompt,
    chartContext ? '\n' + chartContext : '',
    '\n=== [TRI THỨC HUYỀN HỌC BỔ TRỢ (RAG)] ===',
    ...knowledge.map((k, idx) => `[Tài liệu ${idx + 1}: ${k.docTitle} (${k.category})]\n${k.content}`),
    '=== [HẾT TRI THỨC BỔ TRỢ] ===',
  ].filter(Boolean).join('\n');

  // 4. Fallback intelligent streaming synthesis (văn phong đàm đạo trà thất, không dùng ###)
  const fallbackGenerator = async function* (): AsyncGenerator<string, void, unknown> {
    let responseText = '';
    const q = userMessage.toLowerCase();
    const tenKhach = chartData?.ten || 'bạn';

    if (agent.slug === 'thay-tam-an') {
      // THẦY TÂM AN
      responseText = `Thầy Tâm An chào con! Nghe con tâm sự về câu chuyện: "${userMessage}", thầy thấu cảm sâu sắc nỗi niềm và sự trăn trở trong lòng con lúc này.\n\n`;
      if (chartData && (chartData.cung || chartData.palacesData)) {
        const cungList: any[] = chartData.cung || chartData.palacesData || [];
        const cungPhu = cungList.find((c: any) => c.ten === 'Phu Thê');
        const chinh = cungPhu?.chinhTinh?.map((s: any) => `**${s.ten}**${s.dacTinh ? ` (${s.dacTinh})` : ''}`).join(', ') || 'Vô chính diệu';
        responseText += `Mở cung Phu Thê trên lá số của con ra soi chiếu, cung vị tọa tại **${cungPhu?.can || ''} ${cungPhu?.tenChi || ''}** có chính tinh **${chinh}** tọa thủ. `;
        if (cungPhu?.hungTinh && cungPhu.hungTinh.length > 0) {
          const hungNames = cungPhu.hungTinh.map((s: any) => s.ten).join(', ');
          responseText += `Tuy nhiên có sự xuất hiện của sát tinh như *${hungNames}*, báo hiệu giữa hai người dù có duyên nợ sâu nặng nhưng đôi lúc lời ăn tiếng nói dễ bị lệch pha, chuyện nhỏ nhặt cũng dễ sinh hờn giận.\n\n`;
        } else {
          responseText += `Khí tượng hôn nhân cơ bản là thuần hậu, người phối ngẫu chu toàn và có trách nhiệm với gia đình.\n\n`;
        }
      }
      responseText += `Cổ nhân có câu: *"Đồng thanh tương ứng, đồng khí tương cầu"*. Mọi khúc mắc tình cảm hay gia đạo đều có thể chuyển hóa nếu con biết lùi một bước để lắng nghe trọn vẹn, không tranh phần thắng thua lúc nóng giận. Tối nay con hãy dành chút thời gian tĩnh lặng, trò chuyện chân thành với người thương, con sẽ thấy lòng mình nhẹ nhõm hơn rất nhiều con nhé!`;
    } else if (agent.slug === 'thay-thai-son') {
      // THẦY THÁI SƠN
      responseText = `Chào quý bạn! Tôi là Thầy Thái Sơn. Nghe bạn đề cập vấn đề: "${userMessage}", dưới góc nhìn thương trường thực chiến, tôi xin đi thẳng vào bài toán Dòng Tiền và Thế Trận Làm Ăn.\n\n`;
      if (chartData && (chartData.cung || chartData.palacesData)) {
        const cungList: any[] = chartData.cung || chartData.palacesData || [];
        const quan = cungList.find((c: any) => c.ten === 'Quan Lộc');
        const tai = cungList.find((c: any) => c.ten === 'Tài Bạch');
        const chinhQuan = quan?.chinhTinh?.map((s: any) => `**${s.ten}**`).join(', ') || 'Chính tinh vượng';
        const chinhTai = tai?.chinhTinh?.map((s: any) => `**${s.ten}**`).join(', ') || 'Tài tinh';
        responseText += `Chiếu theo tam hợp Mệnh - Tài - Quan của bạn, cung Quan Lộc tại **${quan?.tenChi || ''}** có ${chinhQuan}, cung Tài Bạch có ${chinhTai}. Thế đứng này cho thấy bạn có năng lực chuyên môn và chí tiến thủ rất lớn. `;
        if (tai?.hungTinh && tai.hungTinh.length > 0) {
          responseText += `Song cần đặc biệt cẩn trọng vì cung Tài có hung/hao tinh chiếu về, cảnh báo tiền bạc vào nhanh nhưng cũng rất dễ bị rò rỉ nếu quá cả nể đối tác hoặc đầu tư theo phong trào.\n\n`;
        } else {
          responseText += `Nền tảng tài chính phát triển theo hướng tích lũy bền vững, càng về hậu vận càng tích tụ được nhiều điền sản.\n\n`;
        }
      }
      responseText += `Thái Sơn nhắc nhở bạn: Hãy luôn giữ đòn bẩy tài chính ở ngưỡng an toàn, sòng phẳng minh bạch giấy trắng mực đen trong mọi giao dịch. Làm ăn có kỷ luật thì dù sóng gió thương trường ra sao bạn vẫn đứng vững và gặt hái thành quả!`;
    } else if (agent.slug === 'thay-tue-phong') {
      // THẦY TUỆ PHONG
      responseText = `Chào gia chủ! Thầy Tuệ Phong xin chia sẻ cùng bạn về: "${userMessage}". Cổ nhân dạy: *"Nhất Mệnh, nhì Vận, tam Phong Thủy"*, không gian sống và làm việc có tác động vô cùng vi tế lên tâm trí và sự sáng suốt của chúng ta mỗi ngày.\n\n`;
      responseText += `Chiếu theo bản mệnh và tuổi của bạn, nguyên tắc phong thủy cốt lõi là giữ cho ngôi nhà và bàn làm việc luôn 'Tọa Sơn Hướng Thủy' - tức sau lưng có điểm tựa vững chãi, phía trước thoáng đãng để đón sinh khí. Tránh ngồi quay lưng ra cửa ra vào hoặc cửa sổ lớn vì thế này dễ gây bồn chồn bất an và thị phi ngoài ý muốn.\n\n`;
      responseText += `Gia chủ hãy bài trí thêm cây xanh tán tròn hoặc quả cầu thạch anh hợp mệnh tại góc làm việc để điều hòa từ trường. 'Tâm an thì trạch an', sắp xếp lại không gian ngăn nắp, gia chủ sẽ thấy năng lượng làm việc hanh thông hơn hẳn!`;
    } else if (agent.slug === 'thay-thien-minh') {
      // THẦY THIÊN MINH
      responseText = `Chào gia chủ, tôi là Thầy Thiên Minh. Về vấn đề: "${userMessage}", người xưa dạy: *"Thời lai đồ điếu giai vi thuận, vận khứ anh hùng ẩm hận đa"*, làm bất cứ việc gì nếu biết thuận theo dòng chảy của thời vận thì hiệu quả sẽ tăng lên bội phần.\n\n`;
      responseText += `Chiếu theo lịch vạn niên và thời vận năm 2026 Bính Ngọ, các công việc trọng đại như khai trương, ký kết hay xuất hành xa, gia chủ nên ưu tiên các ngày mang Trực Khai, Trực Thành và chọn khung Giờ Thìn (07h - 09h) hoặc Giờ Thân (15h - 17h) để đón trọn cát khí Quý Nhân tương trợ.\n\n`;
      responseText += `Chuẩn bị chu tất nội lực, chọn đúng thời điểm xuất phát, gia chủ sẽ nắm chắc phần thắng và vạn sự cát lành!`;
    } else if (agent.slug === 'thay-lac-viet') {
      // THẦY LẠC VIỆT
      responseText = `Chào đương số, tôi là Thầy Lạc Việt. Dưới góc nhìn Tứ Trụ Bát Tự (Năm - Tháng - Ngày - Giờ sinh), vạn vật và con người đều vận hành theo sự vượng suy của ngũ hành Kim, Mộc, Thủy, Hỏa, Thổ.\n\n`;
      responseText += `Đối chiếu với câu hỏi "${userMessage}", cốt lõi của việc cải vận là tìm ra vị thuốc Dụng Thần để cân bằng lại bản mệnh. Người mang mệnh hỏa vượng thì cần thủy dưỡng ẩm, người kim vượng thì cần mộc điều hòa. Bạn có thể bổ khuyết năng lượng còn thiếu thông qua thói quen dưỡng sinh, màu sắc trang phục tương sinh và giữ tâm tính trung hòa.\n\n`;
      responseText += `Thuận theo tự nhiên, bồi đắp ngũ hành khuyết thiếu, bạn sẽ thấy cuộc sống mình ngày càng an nhiên và bền vững!`;
    } else if (agent.slug === 'thay-huyen-co') {
      // THẦY HUYỀN CƠ
      responseText = `Hữu duyên tương ngộ! Ta là Huyền Cơ. Đứng trước câu hỏi: "${userMessage}", Chu Dịch dạy rằng: *"Cùng tắc biến, biến tắc thông, thông tắc cửu"*. Mọi sự biến chuyển trong đời đều là cơ hội để ngươi chuyển hóa tâm thức.\n\n`;
      responseText += `Cảm ứng theo thời điểm khởi niệm, quẻ Dịch khuyên ngươi: Đứng trước ngã rẽ lớn, điều tối quan trọng là không được manh động đi đường tắt. Hãy giữ tâm chính trực, lấy chữ Tín làm đầu và kiên nhẫn tích lũy nội lực. Khi thời cơ chín muồi, hào biến sẽ mở ra con đường hanh thông rực rỡ!`;
    } else if (agent.slug === 'co-linh-dan') {
      // CÔ LINH ĐAN
      responseText = `Chào bạn hiền! Linh Đan đây, nghe bạn chia sẻ về: "${userMessage}", mình cảm nhận được sâu sắc những lo âu trong lòng bạn lúc này.\n\n`;
      responseText += `Bạn hãy an tâm nhé, trong văn hóa tâm linh Á Đông, mỗi điềm báo hay giấc mơ đều là thông điệp từ tiềm thức nhắc nhở ta sống chậm lại và hướng về cội nguồn gia tiên. Chiều nay sau khi xong việc, bạn hãy thắp một nén hương thơm lên bàn thờ tổ tiên với lòng thành kính biết ơn, cầu xin ông bà che chở cho tâm an vạn sự lành.\n\n`;
      responseText += `Tâm thiện thì phước đức tự sinh, bạn giữ lòng hoan hỷ và làm thêm việc thiện, điềm lành ắt sẽ mỉm cười với bạn!`;
    } else {
      // THẦY MINH TRIẾT
      responseText = `Thầy Minh Triết chào bạn! Hữu duyên tương ngộ tại XemBoi.vn để cùng đàm đạo về câu hỏi: "${userMessage}".\n\n`;
      if (chartData && (chartData.cung || chartData.palacesData)) {
        const cungList: any[] = chartData.cung || chartData.palacesData || [];
        const cungMenh = cungList.find((c: any) => c.ten === 'Mệnh');
        const chinhMenh = cungMenh?.chinhTinh?.map((s: any) => `**${s.ten}**${s.dacTinh ? ` (${s.dacTinh})` : ''}`).join(', ') || 'Vô chính diệu';
        responseText += `Soi vào bàn cờ Tử Vi của bạn sinh năm **${chartData.canChi?.nam || chartData.canChiYear || ''}**, bản mệnh **${chartData.banMenh || ''}**, cung Mệnh tại **${cungMenh?.tenChi || ''}** có ${chinhMenh} tọa thủ. Tinh bàn thể hiện bạn là người có nghị lực lớn, có lòng tự trọng cao và luôn có cơ may gặp quý nhân trong nghịch cảnh.\n\n`;
      }
      responseText += `Cổ nhân có câu: *"Đức năng thắng số, nhân định thắng thiên"*. Lá số chỉ ra hướng gió, nhưng người cầm lái chính là bản lĩnh và tâm sáng của bạn mỗi ngày. Hãy kiên định với mục tiêu lương thiện đã chọn, thầy chúc bạn vạn sự cát lành và công danh hanh thông!`;
    }

    const words = responseText.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' ';
      yield chunk;
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
  };

  // 5. Invoke Dynamic LLM Stream or Fallback
  let fullText = '';
  const history = (conversationHistory || []).map((m) => ({
    role: (m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
    content: m.content,
  }));

  for await (const chunk of streamLlmOrFallback(
    {
      systemInstruction,
      userPrompt: userMessage,
      conversationHistory: history,
      temperature: agent.temperature || 0.65,
    },
    fallbackGenerator
  )) {
    fullText += chunk;
    yield chunk;
  }

  return { fullText, citedSources };
}
