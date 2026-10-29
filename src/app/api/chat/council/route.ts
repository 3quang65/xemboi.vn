import {
  parseChartForCouncil,
  diagnoseChartAfflictions,
  generateTurn1MinhTriet,
  generateDynamicTurn2,
  generateDynamicTurn3,
  generateTurn2ThaiSon,
  generateTurn3TamAn,
  generateTurn4TuePhong,
  generateTurn5LacViet,
  generateTurn6ThienMinh,
  generateTurn7HuyenCo,
  generateTurn8LacVietDeep,
  generateTurn9LinhDan,
  generateTurn10CouncilConsensus,
  routeFollowupToMaster,
  generateAdminSummonCommentary,
  COUNCIL_PRESETS,
} from '@/lib/ai/council-orchestrator';
import {
  upsertConversation,
  addMessageToConversation,
  getConversationById,
  StoredConversation,
  StoredMessage,
} from '@/lib/ai/conversation-store';
import { getAgentBySlug, getMinhChart, THAY_MINH_TRIET } from '@/lib/ai/agent-persona';
import { MASTER_THEMES, DEFAULT_MASTER_THEME } from '@/lib/ai/dialogue-simulation';
import { parseChartSlug } from '@/lib/core/slug';
import { TuVi } from '@/lib/core/tuvi';
import { streamChatResponse } from '@/lib/ai/rag-engine';
import { addInquiry } from '@/lib/ai/customer-inquiry-service';


const MASTER_METAS: Record<string, { badge: string; statusPrep: string; statusContemplate: string }> = {
  'thay-minh-triet': {
    badge: 'Chủ Trì - Đại Sư Tử Vi Đẩu Số',
    statusPrep: 'Thầy Minh Triết đang soi chiếu cung Mệnh và định khung khí tượng...',
    statusContemplate: 'Thầy Minh Triết đang tổng hợp tinh hoa tinh bàn...',
  },
  'thay-thai-son': {
    badge: 'Chuyên Gia Tài Lộc & Quản Trị Rủi Ro',
    statusPrep: 'Thầy Thái Sơn đang thẩm định thế trận Tài Bạch & Quan Lộc...',
    statusContemplate: '⏳ Thầy Thái Sơn đang nghiền ngẫm luận điểm & chuẩn bị phản biện dòng tiền...',
  },
  'thay-tam-an': {
    badge: 'Cố Vấn Tình Duyên & Cân Bằng Thân Tâm',
    statusPrep: 'Thầy Tâm An đang đối chiếu Cung Phu Thê & Phúc Đức...',
    statusContemplate: '⏳ Thầy Tâm An đang đối chiếu Cung Phu Thê & Gia Đạo để đàm đạo...',
  },
  'thay-tue-phong': {
    badge: 'Chuyên Gia Phong Thủy Bát Trạch & Địa Lợi',
    statusPrep: 'Thầy Tuệ Phong đang khảo sát trường khí Điền Trạch & Tật Ách...',
    statusContemplate: '⏳ Thầy Tuệ Phong đang khảo sát trường khí phong thủy không gian sống...',
  },
  'thay-thien-minh': {
    badge: 'Bậc Thầy Trạch Cát & Thời Vận 2026',
    statusPrep: 'Thầy Thiên Minh đang tính toán thiên can địa chi và thời vận năm 2026...',
    statusContemplate: '⏳ Thầy Thiên Minh đang bấm quẻ chọn giờ hoàng đạo và soi thời vận...',
  },
  'thay-lac-viet': {
    badge: 'Đại Sư Tứ Trụ Bát Tự & Dụng Thần',
    statusPrep: 'Thầy Lạc Việt đang cân bằng Ngũ Hành & Dụng Thần bổ khuyết...',
    statusContemplate: '⏳ Thầy Lạc Việt đang phân tích Dụng Thần và Ngũ Hành tương sinh...',
  },
  'thay-huyen-co': {
    badge: 'Học Giả Chu Dịch & Mai Hoa Dịch Số',
    statusPrep: 'Thầy Huyền Cơ đang khởi hào chiêm nghiệm 64 quẻ Dịch...',
    statusContemplate: '⏳ Thầy Huyền Cơ đang khởi quẻ Chu Dịch chiêm đoán ngã rẽ cuộc đời...',
  },
  'co-linh-dan': {
    badge: 'Cố Vấn Tâm Linh & Phúc Đức Dòng Tộc',
    statusPrep: 'Cô Linh Đan đang cảm ứng trường khí Phúc Đức & gia tiên tiền tổ...',
    statusContemplate: '⏳ Cô Linh Đan đang lắng đọng tâm thức cảm ứng cội rễ phúc trạch...',
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      conversationId: incomingConvId,
      chartData,
      activeChartId,
      participantSlugs = COUNCIL_PRESETS.BATCH_1_MASTERS,
      userQuestion,
      action = 'INIT_COUNCIL',
      turnDelayMs: customDelayMs,
      batchIndex = 1,
    } = body;

    // Natural contemplative delay between turns (2.5 seconds)
    const INTER_TURN_DELAY = Math.max(Number(customDelayMs ?? 2500), 1800);

    // Resolve chart data
    let chart = chartData;
    if (!chart && activeChartId) {
      const parsed = parseChartSlug(activeChartId);
      if (parsed) {
        chart = TuVi.anLaSo({
          ten: parsed.ten,
          ngay: parsed.ngay,
          thang: parsed.thang,
          nam: parsed.nam,
          gio: parsed.gio,
          gioiTinh: parsed.gt,
          lich: parsed.lich,
          nhuan: parsed.nhuan,
          namXem: parsed.namXem,
        });
      }
    }
    if (!chart) {
      chart = getMinhChart();
    }

    const analysis = parseChartForCouncil(chart);
    // On INIT_COUNCIL, ALWAYS start a fresh conversation so changing customer info never leaks previous conversation context
    const convId = (action === 'INIT_COUNCIL' || !incomingConvId)
      ? `conv_council_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      : incomingConvId;

    // Prepare SSE Stream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (eventData: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
        };

        const streamTextInTokens = async (text: string, chunkSize = 16) => {
          for (let i = 0; i < text.length; i += chunkSize) {
            const token = text.slice(i, i + chunkSize);
            sendEvent({ type: 'token', token });
            await new Promise((r) => setTimeout(r, 16));
          }
        };

        try {
          // =========================================================================
          // ACTION 1: INIT COUNCIL (BATCH 1: 5 TURNS WITH MIN 5S DELAY BETWEEN TURNS)
          // =========================================================================
          if (action === 'INIT_COUNCIL') {
            // Diagnose chart afflictions dynamically to pick Turn 2 and Turn 3 masters based on latent problems
            const [dynAgent2Slug, dynAgent3Slug] = diagnoseChartAfflictions(chart, analysis, userQuestion);
            const councilLineup = ['thay-minh-triet', dynAgent2Slug, dynAgent3Slug];
            const effectiveParticipants = councilLineup;

            const newConv: StoredConversation = {
              id: convId,
              mode: 'COUNCIL_CONSULTATION',
              title: `Hội Chẩn Lá Số: ${analysis.hoTen} (${analysis.canChiNam})`,
              agentId: THAY_MINH_TRIET.id || 'agent_minh_triet_id',
              agentSlug: 'thay-minh-triet',
              agentName: 'Thầy Minh Triết',
              participantSlugs: effectiveParticipants,
              customerName: analysis.hoTen,
              activeChartId: activeChartId || chart.slug || 'la-so-hien-tai',
              chartSummary: `${analysis.hoTen} · ${analysis.gioiTinh} · ${analysis.ngaySinhDuong} (${analysis.canChiNam}) · ${analysis.banMenh} · ${analysis.cuc}`,
              chartData: chart,
              status: 'COUNCIL_DEBATING',
              messages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            if (userQuestion) {
              const userMsg: StoredMessage = {
                id: `msg_u_${Date.now()}`,
                role: 'user',
                content: userQuestion,
                senderName: analysis.hoTen,
                senderAvatar: '/icons/avatar-minh.svg',
                senderBadge: 'Đương số',
                createdAt: new Date().toISOString(),
              };
              newConv.messages.push(userMsg);
              await upsertConversation(newConv);
            } else {
              await upsertConversation(newConv);
            }

            sendEvent({
              type: 'conversation_ready',
              conversationId: convId,
              title: newConv.title,
              participantSlugs: effectiveParticipants,
            });

            // -------------------------------------------------------------
            // TURN 1: Thầy Minh Triết (Khai mở Tinh Bàn & Cục Diện Mệnh Thân)
            // -------------------------------------------------------------
            sendEvent({
              type: 'status',
              stage: 'soi_menh',
              message: 'Thầy Minh Triết đang soi chiếu cung Mệnh và định khung khí tượng...',
              agentSlug: 'thay-minh-triet',
              agentName: 'Thầy Minh Triết',
            });
            await new Promise((r) => setTimeout(r, 600));

            const agent1 = getAgentBySlug('thay-minh-triet');
            const theme1 = MASTER_THEMES['thay-minh-triet'];
            sendEvent({
              type: 'message_start',
              turn: 1,
              agentSlug: agent1.slug,
              agentName: agent1.name,
              senderBadge: 'Chủ Trì - Đại Sư Tử Vi Đẩu Số',
              senderAvatar: agent1.avatarUrl,
              theme: theme1,
            });

            const turn1Content = await generateTurn1MinhTriet(analysis, dynAgent2Slug, userQuestion);
            await streamTextInTokens(turn1Content);

            const msg1: StoredMessage = {
              id: `msg_turn1_${Date.now()}`,
              role: 'assistant',
              content: turn1Content,
              senderAgentSlug: agent1.slug,
              senderName: agent1.name,
              senderAvatar: agent1.avatarUrl,
              senderBadge: 'Chủ Trì - Đại Sư Tử Vi Đẩu Số',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg1);
            sendEvent({ type: 'message_end', turn: 1, id: msg1.id, content: turn1Content, agentSlug: agent1.slug });

            // -------------------------------------------------------------
            // TURN 2: Dynamic Second Master (Tương ứng với cung / sao xấu nổi cộm)
            // -------------------------------------------------------------
            const agent2 = getAgentBySlug(dynAgent2Slug);
            const theme2 = MASTER_THEMES[dynAgent2Slug] || DEFAULT_MASTER_THEME;
            const meta2 = MASTER_METAS[dynAgent2Slug] || {
              badge: 'Danh Sư Hội Đồng',
              statusPrep: `${agent2.name} đang xem xét tinh bàn...`,
              statusContemplate: `⏳ ${agent2.name} đang nghiên cứu luận điểm & chuẩn bị phản biện...`,
            };

            sendEvent({
              type: 'status',
              stage: 'contemplating',
              countdownSec: 4,
              message: meta2.statusContemplate,
              agentSlug: agent2.slug,
              agentName: agent2.name,
            });
            await new Promise((r) => setTimeout(r, INTER_TURN_DELAY));

            sendEvent({
              type: 'message_start',
              turn: 2,
              agentSlug: agent2.slug,
              agentName: agent2.name,
              senderBadge: meta2.badge,
              senderAvatar: agent2.avatarUrl,
              theme: theme2,
            });

            const turn2Content = await generateDynamicTurn2(dynAgent2Slug, analysis, turn1Content, dynAgent3Slug, userQuestion);
            await streamTextInTokens(turn2Content);

            const msg2: StoredMessage = {
              id: `msg_turn2_${Date.now()}`,
              role: 'assistant',
              content: turn2Content,
              senderAgentSlug: agent2.slug,
              senderName: agent2.name,
              senderAvatar: agent2.avatarUrl,
              senderBadge: meta2.badge,
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg2);
            sendEvent({ type: 'message_end', turn: 2, id: msg2.id, content: turn2Content, agentSlug: agent2.slug });

            // -------------------------------------------------------------
            // TURN 3: Dynamic Third Master (Cân bằng đa chiều & Đúc kết 3 Trụ Cột)
            // -------------------------------------------------------------
            const agent3 = getAgentBySlug(dynAgent3Slug);
            const theme3 = MASTER_THEMES[dynAgent3Slug] || DEFAULT_MASTER_THEME;
            const meta3 = MASTER_METAS[dynAgent3Slug] || {
              badge: 'Danh Sư Hội Đồng',
              statusPrep: `${agent3.name} đang soi chiếu...`,
              statusContemplate: `⏳ ${agent3.name} đang đối chiếu tinh bàn & chuẩn bị đúc kết...`,
            };

            sendEvent({
              type: 'status',
              stage: 'contemplating',
              countdownSec: 3,
              message: meta3.statusContemplate,
              agentSlug: agent3.slug,
              agentName: agent3.name,
            });
            await new Promise((r) => setTimeout(r, INTER_TURN_DELAY));

            sendEvent({
              type: 'message_start',
              turn: 3,
              agentSlug: agent3.slug,
              agentName: agent3.name,
              senderBadge: meta3.badge,
              senderAvatar: agent3.avatarUrl,
              theme: theme3,
            });

            const turn3Content = await generateDynamicTurn3(
              dynAgent3Slug,
              analysis,
              `${turn1Content}\n\n${turn2Content}`,
              councilLineup,
              userQuestion
            );
            await streamTextInTokens(turn3Content);

            const msg3: StoredMessage = {
              id: `msg_turn3_${Date.now()}`,
              role: 'assistant',
              content: turn3Content,
              senderAgentSlug: agent3.slug,
              senderName: agent3.name,
              senderAvatar: agent3.avatarUrl,
              senderBadge: meta3.badge,
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg3);
            sendEvent({ type: 'message_end', turn: 3, id: msg3.id, content: turn3Content, agentSlug: agent3.slug });

            // HOÀN TẤT ĐỢT 1: 3 LƯỢT ĐÀM ĐẠO CỐT LÕI (MỆNH THÂN - SỰ NGHIỆP - GIA ĐẠO)
            newConv.status = 'ACTIVE';
            newConv.summary = `Hội đồng đã hoàn tất 3 lượt luận giải đàm đạo cốt lõi cho ${analysis.hoTen}.`;
            await upsertConversation(newConv);

            sendEvent({
              type: 'council_batch_paused',
              batchIndex: 1,
              turnCount: 3,
              conversationId: convId,
              canContinue: true,
              message: 'Hội đồng Bát Đại Danh Sư đã hoàn tất 3 lượt luận giải đàm đạo cốt lõi.',
            });
            controller.close();
            return;
          }

          // =========================================================================
          // ACTION 2: CONTINUE COUNCIL (BATCH 2: TURNS 6 - 10 WITH 5S DELAY)
          // =========================================================================
          if (action === 'CONTINUE_COUNCIL') {
            const existingConv = await getConversationById(convId);
            const prevContext = (existingConv?.messages || []).map((m) => `${m.senderName}: ${m.content}`).join('\n\n');

            // -------------------------------------------------------------
            // TURN 6: Thầy Thiên Minh (Trạch Cát, Thời Vận 2026 & Thiên Thời)
            // -------------------------------------------------------------
            sendEvent({
              type: 'status',
              stage: 'trach_cat_2026',
              message: 'Thầy Thiên Minh đang bấm độn thời vận năm 2026 và chọn thời điểm hoàng đạo...',
              agentSlug: 'thay-thien-minh',
              agentName: 'Thầy Thiên Minh',
            });
            await new Promise((r) => setTimeout(r, 600));

            const agent6 = getAgentBySlug('thay-thien-minh');
            const theme6 = MASTER_THEMES['thay-thien-minh'];
            sendEvent({
              type: 'message_start',
              turn: 6,
              agentSlug: agent6.slug,
              agentName: agent6.name,
              senderBadge: 'Chuyên Gia Trạch Cát & Chọn Ngày Giờ',
              senderAvatar: agent6.avatarUrl,
              theme: theme6,
            });

            const turn6Content = await generateTurn6ThienMinh(analysis, prevContext);
            await streamTextInTokens(turn6Content);

            const msg6: StoredMessage = {
              id: `msg_turn6_${Date.now()}`,
              role: 'assistant',
              content: turn6Content,
              senderAgentSlug: agent6.slug,
              senderName: agent6.name,
              senderAvatar: agent6.avatarUrl,
              senderBadge: 'Chuyên Gia Trạch Cát & Chọn Ngày Giờ',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg6);
            sendEvent({ type: 'message_end', turn: 6, id: msg6.id, content: turn6Content, agentSlug: agent6.slug });

            // >>> CONTEMPLATIVE DELAY BEFORE TURN 7 (MIN 5 SECONDS) <<<
            sendEvent({
              type: 'status',
              stage: 'contemplating',
              countdownSec: 5,
              message: '⏳ Thầy Huyền Cơ đang khởi quẻ Chu Dịch Dự Đoán biến thiên thời thế... (dành 5 giây đọc kỹ lời khuyên)',
              agentSlug: 'thay-huyen-co',
              agentName: 'Thầy Huyền Cơ',
            });
            await new Promise((r) => setTimeout(r, INTER_TURN_DELAY));

            // -------------------------------------------------------------
            // TURN 7: Thầy Huyền Cơ (Chu Dịch Dự Đoán & 64 Quẻ Dịch Phản Biện)
            // -------------------------------------------------------------
            const agent7 = getAgentBySlug('thay-huyen-co');
            const theme7 = MASTER_THEMES['thay-huyen-co'];
            sendEvent({
              type: 'message_start',
              turn: 7,
              agentSlug: agent7.slug,
              agentName: agent7.name,
              senderBadge: 'Cao Nhân Chu Dịch Dự Đoán & Bốc Phệ',
              senderAvatar: agent7.avatarUrl,
              theme: theme7,
            });

            const turn7Content = await generateTurn7HuyenCo(analysis, `${prevContext}\n\n${turn6Content}`);
            await streamTextInTokens(turn7Content);

            const msg7: StoredMessage = {
              id: `msg_turn7_${Date.now()}`,
              role: 'assistant',
              content: turn7Content,
              senderAgentSlug: agent7.slug,
              senderName: agent7.name,
              senderAvatar: agent7.avatarUrl,
              senderBadge: 'Cao Nhân Chu Dịch Dự Đoán & Bốc Phệ',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg7);
            sendEvent({ type: 'message_end', turn: 7, id: msg7.id, content: turn7Content, agentSlug: agent7.slug });

            // >>> CONTEMPLATIVE DELAY BEFORE TURN 8 (MIN 5 SECONDS) <<<
            sendEvent({
              type: 'status',
              stage: 'contemplating',
              countdownSec: 5,
              message: '⏳ Thầy Lạc Việt đang soi chiếu Danh Tính Học & màu sắc bổ khuyết... (dành 5 giây đọc kỹ lời khuyên)',
              agentSlug: 'thay-lac-viet',
              agentName: 'Thầy Lạc Việt',
            });
            await new Promise((r) => setTimeout(r, INTER_TURN_DELAY));

            // -------------------------------------------------------------
            // TURN 8: Thầy Lạc Việt (Danh Tính Học & Ngũ Hành Chi Tiết)
            // -------------------------------------------------------------
            const agent8 = getAgentBySlug('thay-lac-viet');
            const theme8 = MASTER_THEMES['thay-lac-viet'];
            sendEvent({
              type: 'message_start',
              turn: 8,
              agentSlug: agent8.slug,
              agentName: agent8.name,
              senderBadge: 'Chuyên Gia Danh Tính Học & Dụng Thần',
              senderAvatar: agent8.avatarUrl,
              theme: theme8,
            });

            const turn8Content = await generateTurn8LacVietDeep(analysis, `${prevContext}\n\n${turn6Content}\n\n${turn7Content}`);
            await streamTextInTokens(turn8Content);

            const msg8: StoredMessage = {
              id: `msg_turn8_${Date.now()}`,
              role: 'assistant',
              content: turn8Content,
              senderAgentSlug: agent8.slug,
              senderName: agent8.name,
              senderAvatar: agent8.avatarUrl,
              senderBadge: 'Chuyên Gia Danh Tính Học & Dụng Thần',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg8);
            sendEvent({ type: 'message_end', turn: 8, id: msg8.id, content: turn8Content, agentSlug: agent8.slug });

            // >>> CONTEMPLATIVE DELAY BEFORE TURN 9 (MIN 5 SECONDS) <<<
            sendEvent({
              type: 'status',
              stage: 'contemplating',
              countdownSec: 5,
              message: '⏳ Cô Linh Đan đang soi Cung Phúc Đức, giấc mơ & âm đức tổ tiên... (dành 5 giây đọc kỹ lời khuyên)',
              agentSlug: 'co-linh-dan',
              agentName: 'Cô Linh Đan',
            });
            await new Promise((r) => setTimeout(r, INTER_TURN_DELAY));

            // -------------------------------------------------------------
            // TURN 9: Cô Linh Đan (Giải Mã Giấc Mơ, Điềm Báo & Âm Đức)
            // -------------------------------------------------------------
            const agent9 = getAgentBySlug('co-linh-dan');
            const theme9 = MASTER_THEMES['co-linh-dan'];
            sendEvent({
              type: 'message_start',
              turn: 9,
              agentSlug: agent9.slug,
              agentName: agent9.name,
              senderBadge: 'Cố Vấn Giấc Mơ, Điềm Báo & Tâm Linh Âm Đức',
              senderAvatar: agent9.avatarUrl,
              theme: theme9,
            });

            const turn9Content = await generateTurn9LinhDan(analysis, `${prevContext}\n\n${turn8Content}`);
            await streamTextInTokens(turn9Content);

            const msg9: StoredMessage = {
              id: `msg_turn9_${Date.now()}`,
              role: 'assistant',
              content: turn9Content,
              senderAgentSlug: agent9.slug,
              senderName: agent9.name,
              senderAvatar: agent9.avatarUrl,
              senderBadge: 'Cố Vấn Giấc Mơ, Điềm Báo & Tâm Linh Âm Đức',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg9);
            sendEvent({ type: 'message_end', turn: 9, id: msg9.id, content: turn9Content, agentSlug: agent9.slug });

            // >>> CONTEMPLATIVE DELAY BEFORE TURN 10 (MIN 5 SECONDS) <<<
            sendEvent({
              type: 'status',
              stage: 'contemplating',
              countdownSec: 5,
              message: '⏳ Toàn thể Hội Đồng đang đúc kết Bảng Cẩm Nang Hành Động 5 Trụ Cột... (dành 5 giây chuẩn bị nhận cẩm nang)',
              agentSlug: 'thay-minh-triet',
              agentName: 'Hội Đồng Bát Đại Danh Sư',
            });
            await new Promise((r) => setTimeout(r, INTER_TURN_DELAY));

            // -------------------------------------------------------------
            // TURN 10: Toàn Thể Hội Đồng Đúc Kết Bảng Cẩm Nang 5 Trụ Cột
            // -------------------------------------------------------------
            const agentLeader = getAgentBySlug('thay-minh-triet');
            const themeLeader = MASTER_THEMES['thay-minh-triet'];

            sendEvent({
              type: 'message_start',
              turn: 10,
              agentSlug: 'thay-minh-triet',
              agentName: 'Hội Đồng Bát Đại Danh Sư',
              senderBadge: 'Đúc Kết Toàn Diện 5 Trụ Cột',
              senderAvatar: agentLeader.avatarUrl,
              theme: themeLeader,
            });

            const turn10Content = await generateTurn10CouncilConsensus(analysis, `${prevContext}\n\n${turn9Content}`);
            await streamTextInTokens(turn10Content);

            const msg10: StoredMessage = {
              id: `msg_turn10_${Date.now()}`,
              role: 'assistant',
              content: turn10Content,
              senderAgentSlug: 'thay-minh-triet',
              senderName: 'Hội Đồng Bát Đại Danh Sư',
              senderAvatar: agentLeader.avatarUrl,
              senderBadge: 'Đúc Kết Toàn Diện 5 Trụ Cột',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, msg10);
            sendEvent({ type: 'message_end', turn: 10, id: msg10.id, content: turn10Content, agentSlug: 'thay-minh-triet' });

            sendEvent({
              type: 'council_batch_paused',
              batchIndex: 2,
              turnCount: 10,
              isFinal: true,
              canContinue: false,
              conversationId: convId,
              message: 'Hội đồng đã hoàn tất trọn vẹn 10 lượt đàm đạo và xuất Cẩm Nang Hành Động.',
            });
            sendEvent({
              type: 'council_complete',
              conversationId: convId,
              summary: `Đã hoàn tất trọn vẹn 10 lượt hội chẩn cho ${analysis.hoTen}.`,
            });
            controller.close();
            return;
          }

          // =========================================================================
          // ACTION 3: SUMMARIZE COUNCIL (IMMEDIATELY EMIT ACTIONABLE SUMMARY TABLE)
          // =========================================================================
          if (action === 'SUMMARIZE_COUNCIL') {
            const agent1 = getAgentBySlug('thay-minh-triet');
            const theme1 = MASTER_THEMES['thay-minh-triet'];

            sendEvent({
              type: 'message_start',
              turn: 10,
              agentSlug: 'thay-minh-triet',
              agentName: 'Hội Đồng Bát Đại Danh Sư',
              senderBadge: 'Đúc Kết Toàn Diện 5 Trụ Cột',
              senderAvatar: agent1.avatarUrl,
              theme: theme1,
            });

            const summaryContent = await generateTurn10CouncilConsensus(analysis, '');
            await streamTextInTokens(summaryContent);

            const summaryMsg: StoredMessage = {
              id: `msg_summary_${Date.now()}`,
              role: 'assistant',
              content: summaryContent,
              senderAgentSlug: 'thay-minh-triet',
              senderName: 'Hội Đồng Bát Đại Danh Sư',
              senderAvatar: agent1.avatarUrl,
              senderBadge: 'Đúc Kết Toàn Diện 5 Trụ Cột',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, summaryMsg);
            sendEvent({ type: 'message_end', turn: 10, id: summaryMsg.id, content: summaryContent, agentSlug: 'thay-minh-triet' });

            sendEvent({
              type: 'council_complete',
              conversationId: convId,
              summary: `Đã xuất Cẩm Nang Hành Động cho ${analysis.hoTen}.`,
            });
            controller.close();
            return;
          }

          // =========================================================================
          // ACTION 4: FOLLOW-UP QUESTION (@MENTION & AUTO-ROUTER) & USER_QUESTION
          // =========================================================================
          if (action === 'FOLLOWUP_QUESTION' || action === 'USER_QUESTION') {
            const existingConv = await getConversationById(convId);
            const participants = existingConv?.participantSlugs || COUNCIL_PRESETS.BATCH_1_MASTERS;

            const isUserFemale = analysis.gioiTinh === 'Nữ';
            const userMsg: StoredMessage = {
              id: `msg_u_${Date.now()}`,
              role: 'user',
              content: userQuestion || 'Thầy giải đáp thêm giúp tôi câu này...',
              senderName: analysis.hoTen,
              senderAvatar: isUserFemale ? '/icons/agents/co-linh-dan.svg' : '/icons/avatar-minh.svg',
              senderBadge: isUserFemale ? 'Đương số (Nữ)' : 'Đương số (Nam)',
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, userMsg);

            const routedMasters = routeFollowupToMaster(userQuestion || '', participants);
            const primaryMaster = routedMasters[0] || getAgentBySlug('thay-minh-triet');
            const theme = MASTER_THEMES[primaryMaster.slug] || DEFAULT_MASTER_THEME;

            sendEvent({
              type: 'status',
              stage: 'answering',
              message: `${primaryMaster.name} đang thẩm định câu hỏi và đàm đạo luận giải...`,
              agentSlug: primaryMaster.slug,
              agentName: primaryMaster.name,
            });
            await new Promise((r) => setTimeout(r, 450));

            sendEvent({
              type: 'message_start',
              agentSlug: primaryMaster.slug,
              agentName: primaryMaster.name,
              senderBadge: primaryMaster.title,
              senderAvatar: primaryMaster.avatarUrl,
              theme,
            });

            // Ghi nhận câu hỏi vào Ngân hàng Customer Inquiry
            try {
              const q = (userQuestion || '').toLowerCase();
              let cat = 'VAN_HAN';
              let catName = 'Vận Hạn Năm Hiện Tại';
              if (q.includes('vợ') || q.includes('chồng') || q.includes('yêu') || q.includes('tình') || q.includes('hôn nhân')) {
                cat = 'TINH_DUYEN'; catName = 'Tình Duyên & Hôn Nhân';
              } else if (q.includes('tiền') || q.includes('tài') || q.includes('đầu tư') || q.includes('kinh doanh')) {
                cat = 'TAI_LOC'; catName = 'Tài Lộc & Đầu Tư';
              } else if (q.includes('việc') || q.includes('công danh') || q.includes('thăng tiến')) {
                cat = 'CONG_DANH'; catName = 'Công Danh & Sự Nghiệp';
              } else if (q.includes('nhà') || q.includes('hướng') || q.includes('phong thủy')) {
                cat = 'PHONG_THUY'; catName = 'Phong Thủy Bát Trạch';
              }
              addInquiry({
                question: userQuestion || '',
                category: cat,
                categoryName: catName,
                userPersona: `${analysis.hoTen} (${analysis.canChiNam})`,
                source: 'COUNCIL_FOLLOWUP_QUESTION',
              });
            } catch {}

            // Khởi tạo đối thoại đàm đạo tự nhiên từ RAG & LLM Engine
            const generator = streamChatResponse({
              userMessage: userQuestion || '',
              conversationHistory: existingConv?.messages.map((m) => ({ role: m.role, content: m.content })) || [],
              chartData: chart,
              agentSlug: primaryMaster.slug,
            });

            let answer = '';
            for await (const chunk of generator) {
              answer += chunk;
              sendEvent({ type: 'token', token: chunk });
              await new Promise((r) => setTimeout(r, 12));
            }

            const assistantMsg: StoredMessage = {
              id: `msg_a_${Date.now()}`,
              role: 'assistant',
              content: answer,
              senderAgentSlug: primaryMaster.slug,
              senderName: primaryMaster.name,
              senderAvatar: primaryMaster.avatarUrl,
              senderBadge: primaryMaster.title,
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, assistantMsg);
            sendEvent({ type: 'message_end', id: assistantMsg.id, content: answer, agentSlug: primaryMaster.slug });

            sendEvent({ type: 'followup_complete', conversationId: convId });
            sendEvent({ type: 'council_complete', conversationId: convId });
            controller.close();
            return;
          }

          // =========================================================================
          // ACTION 5: SUMMON AGENT
          // =========================================================================
          if (action === 'SUMMON_AGENT') {
            const { summonAgentSlug } = body;
            const targetAgent = getAgentBySlug(summonAgentSlug || 'thay-minh-triet');
            const theme = MASTER_THEMES[targetAgent.slug] || DEFAULT_MASTER_THEME;

            sendEvent({
              type: 'summon_init',
              conversationId: convId,
              summonedSlug: targetAgent.slug,
            });

            sendEvent({
              type: 'status',
              message: `${targetAgent.name} đang gia nhập và đưa ra góc nhìn bổ khuyết...`,
              agentSlug: targetAgent.slug,
              agentName: targetAgent.name,
            });
            await new Promise((r) => setTimeout(r, 600));

            sendEvent({
              type: 'message_start',
              agentSlug: targetAgent.slug,
              agentName: targetAgent.name,
              senderBadge: `${targetAgent.title} (Triệu tập)`,
              senderAvatar: targetAgent.avatarUrl,
              theme,
            });

            const commentary = await generateAdminSummonCommentary(targetAgent.slug, analysis, '');
            await streamTextInTokens(commentary);

            const summonMsg: StoredMessage = {
              id: `msg_summon_${Date.now()}`,
              role: 'assistant',
              content: commentary,
              senderAgentSlug: targetAgent.slug,
              senderName: targetAgent.name,
              senderAvatar: targetAgent.avatarUrl,
              senderBadge: `${targetAgent.title} (Triệu tập)`,
              createdAt: new Date().toISOString(),
            };
            await addMessageToConversation(convId, summonMsg);
            sendEvent({ type: 'message_end', id: summonMsg.id, content: commentary, agentSlug: targetAgent.slug });

            sendEvent({ type: 'summon_complete', conversationId: convId });
            controller.close();
            return;
          }
        } catch (streamErr: any) {
          sendEvent({ type: 'error', error: streamErr?.message || 'Lỗi xử lý luồng hội đồng' });
        } finally {
          try {
            controller.close();
          } catch {}
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
