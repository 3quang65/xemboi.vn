import { NextResponse } from 'next/server';
import {
  listConversations,
  getConversationById,
  updateConversationStatus,
  addMessageToConversation,
  upsertConversation,
  StoredMessage,
} from '@/lib/ai/conversation-store';
import { getAgentBySlug } from '@/lib/ai/agent-persona';
import { parseChartForCouncil, generateAdminSummonCommentary } from '@/lib/ai/council-orchestrator';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = (searchParams.get('tab') as any) || 'all';
    const mode = (searchParams.get('mode') as any) || undefined;
    const status = searchParams.get('status') || undefined;

    const list = await listConversations({ tab, mode, status });
    return NextResponse.json({ ok: true, conversations: list });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, conversationId, status, content, senderRole = 'admin', senderAgentSlug, senderName } = body;

    if (!conversationId) {
      return NextResponse.json({ ok: false, error: 'Thiếu conversationId' }, { status: 400 });
    }

    const conv = await getConversationById(conversationId);
    if (!conv) {
      return NextResponse.json({ ok: false, error: 'Không tìm thấy cuộc hội thoại' }, { status: 404 });
    }

    // --- 1. TOGGLE TAKEOVER ---
    if (action === 'TOGGLE_TAKEOVER') {
      const nextStatus = conv.status === 'HUMAN_TAKEOVER' ? 'ACTIVE' : 'HUMAN_TAKEOVER';
      await updateConversationStatus(conversationId, nextStatus);

      // System notification message
      const sysMsg: StoredMessage = {
        id: `sys_${Date.now()}`,
        role: 'system',
        content:
          nextStatus === 'HUMAN_TAKEOVER'
            ? '⚠️ Chuyên Viên Admin đã tiếp quản cuộc trò chuyện trực tiếp (Human Takeover).'
            : '✅ Đã trả quyền điều phối lại cho Bát Đại Danh Sư.',
        senderBadge: 'Hệ Thống',
        createdAt: new Date().toISOString(),
      };
      await addMessageToConversation(conversationId, sysMsg);

      return NextResponse.json({ ok: true, status: nextStatus });
    }

    // --- 2. SEND ADMIN REPLY (OR IMPERSONATE AS MASTER) ---
    if (action === 'SEND_MESSAGE') {
      if (!content || !content.trim()) {
        return NextResponse.json({ ok: false, error: 'Nội dung tin nhắn trống' }, { status: 400 });
      }

      let msgSenderName = senderName || 'Chuyên Viên Quản Trị Hệ Thống (Admin)';
      let msgSenderBadge = 'Admin Trực Tuyến';
      let msgSenderAvatar = '/icons/icon.svg';
      let msgRole: 'admin' | 'assistant' = 'admin';

      if (senderAgentSlug) {
        const agent = getAgentBySlug(senderAgentSlug);
        msgSenderName = agent.name;
        msgSenderBadge = `${agent.title} (Admin Nhập Vai)`;
        msgSenderAvatar = agent.avatarUrl;
        msgRole = 'assistant';
      }

      const newMsg: StoredMessage = {
        id: `msg_admin_${Date.now()}`,
        role: msgRole,
        content: content.trim(),
        senderAgentSlug: senderAgentSlug || undefined,
        senderName: msgSenderName,
        senderBadge: msgSenderBadge,
        senderAvatar: msgSenderAvatar,
        createdAt: new Date().toISOString(),
      };

      await addMessageToConversation(conversationId, newMsg);
      return NextResponse.json({ ok: true, message: newMsg });
    }

    // --- 3. SUMMON AGENT INTO COUNCIL ---
    if (action === 'SUMMON_AGENT') {
      if (!senderAgentSlug) {
        return NextResponse.json({ ok: false, error: 'Thiếu senderAgentSlug để triệu tập' }, { status: 400 });
      }

      const agent = getAgentBySlug(senderAgentSlug);

      // Add to participantSlugs if not present
      if (!conv.participantSlugs.includes(agent.slug)) {
        conv.participantSlugs.push(agent.slug);
      }

      const analysis = parseChartForCouncil(conv.chartData);
      const context = conv.messages.map((m) => `${m.senderName}: ${m.content}`).slice(-3).join('\n');
      const commentary = await generateAdminSummonCommentary(agent.slug, analysis, context);

      const summonMsg: StoredMessage = {
        id: `msg_summon_${Date.now()}`,
        role: 'assistant',
        content: commentary,
        senderAgentSlug: agent.slug,
        senderName: agent.name,
        senderBadge: `${agent.title} (Triệu tập)`,
        senderAvatar: agent.avatarUrl,
        createdAt: new Date().toISOString(),
      };

      await addMessageToConversation(conversationId, summonMsg);
      await upsertConversation(conv);

      return NextResponse.json({ ok: true, message: summonMsg, participantSlugs: conv.participantSlugs });
    }

    // --- 4. TRIGGER AUTO COUNCIL ---
    if (action === 'TRIGGER_AUTO_COUNCIL') {
      conv.mode = 'COUNCIL_CONSULTATION';
      if (!conv.participantSlugs.includes('thay-minh-triet')) conv.participantSlugs.push('thay-minh-triet');
      if (!conv.participantSlugs.includes('thay-thai-son')) conv.participantSlugs.push('thay-thai-son');
      if (!conv.participantSlugs.includes('thay-tam-an')) conv.participantSlugs.push('thay-tam-an');
      conv.status = 'ACTIVE';
      await upsertConversation(conv);

      return NextResponse.json({ ok: true, conversation: conv });
    }

    return NextResponse.json({ ok: false, error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
