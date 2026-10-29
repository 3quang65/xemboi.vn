'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  DialogueMessage,
  MASTER_THEMES,
  resolveMasterForTopic,
  DEFAULT_MASTER_THEME,
  MINH_THEME,
  MasterThemeConfig,
} from '@/lib/ai/dialogue-simulation';
import {
  BAT_DAI_DANH_SU,
  MINH_CUSTOMER_AGENT,
  getAgentBySlug,
  AiAgentConfig,
} from '@/lib/ai/agent-persona';
import { StoredConversation, StoredMessage } from '@/lib/ai/conversation-store';
import { useCouncilAudioEngine, AudioQueueItem } from '@/hooks/useCouncilAudioEngine';
import { AudioControlHeader } from '@/components/audio/AudioControlHeader';
import { VoiceWaveformAvatar } from '@/components/audio/VoiceWaveformAvatar';
import { SingleMessageAudioButton } from '@/components/audio/SingleMessageAudioButton';
import { getAgentVoiceProfile, detectGenderFromContext } from '@/config/agents-voice';

// ==========================================
// TYPOGRAPHY & FORMATTING HELPER COMPONENTS
// ==========================================

function InlineFormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong
              key={i}
              style={{
                color: '#ffffff',
                fontWeight: 700,
                textShadow: '0 0 2px rgba(255,255,255,0.3)',
              }}
            >
              {boldText}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

function RenderMessageContent({
  content,
  theme,
  isMinh,
}: {
  content: string;
  theme?: MasterThemeConfig;
  isMinh?: boolean;
}) {
  // Check for Markdown Table
  if (content.includes('|') && content.includes('\n|')) {
    const lines = content.split('\n');
    const tableLines: string[] = [];
    let inTable = false;
    const components: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableLines.push(trimmed);
      } else {
        if (inTable && tableLines.length > 0) {
          components.push(<RenderTableBlock key={`tbl_${idx}`} lines={[...tableLines]} />);
          tableLines.length = 0;
          inTable = false;
        }
        if (trimmed) {
          components.push(<RenderParagraph key={`p_${idx}`} text={trimmed} theme={theme} isMinh={isMinh} />);
        }
      }
    });

    if (inTable && tableLines.length > 0) {
      components.push(<RenderTableBlock key="tbl_end" lines={[...tableLines]} />);
    }

    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, lineHeight: 1.7 }}>{components}</div>;
  }

  const paragraphs = content.split('\n\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, lineHeight: 1.7 }}>
      {paragraphs.map((para, pIdx) => (
        <RenderParagraph key={pIdx} text={para.trim()} theme={theme} isMinh={isMinh} />
      ))}
    </div>
  );
}

function RenderTableBlock({ lines }: { lines: string[] }) {
  if (lines.length < 2) return null;
  const headerRow = lines[0];
  const dataRows = lines.slice(2);

  const parseCells = (row: string) =>
    row
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());

  const headers = parseCells(headerRow);

  return (
    <div style={{ overflowX: 'auto', margin: '8px 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
          border: '1px solid rgba(234, 179, 8, 0.35)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        <thead style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fde047' }}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '7px 10px', textAlign: 'left', borderBottom: '1px solid rgba(234, 179, 8, 0.3)' }}>
                {h.replace(/\*\*/g, '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((r, rIdx) => {
            const cells = parseCells(r);
            return (
              <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                {cells.map((c, cIdx) => (
                  <td key={cIdx} style={{ padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#f1f5f9' }}>
                    <InlineFormattedText text={c} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RenderParagraph({ text, theme, isMinh }: { text: string; theme?: MasterThemeConfig; isMinh?: boolean }) {
  if (!text) return null;

  if (text.startsWith('### ')) {
    return (
      <h4
        style={{
          margin: '10px 0 4px',
          fontSize: 14.5,
          fontFamily: "'Noto Serif', serif",
          color: theme?.nameColor || (isMinh ? '#38bdf8' : '#fde047'),
          borderBottom: `1px dashed ${theme?.borderColor || 'rgba(255,255,255,0.2)'}`,
          paddingBottom: 4,
          letterSpacing: 0.3,
        }}
      >
        {text.replace(/^###\s+/, '')}
      </h4>
    );
  }

  if (text.startsWith('## ') || text.startsWith('# ')) {
    return (
      <h3
        style={{
          margin: '12px 0 6px',
          fontSize: 15.5,
          fontFamily: "'Noto Serif', serif",
          color: theme?.nameColor || (isMinh ? '#38bdf8' : '#fde047'),
        }}
      >
        {text.replace(/^#+\s+/, '')}
      </h3>
    );
  }

  if (text.startsWith('> ')) {
    return (
      <blockquote
        style={{
          margin: '8px 0',
          padding: '6px 12px',
          borderLeft: `3px solid ${theme?.borderColor || '#fde047'}`,
          background: 'rgba(234, 179, 8, 0.08)',
          color: '#fde047',
          fontStyle: 'italic',
          borderRadius: '0 6px 6px 0',
        }}
      >
        <InlineFormattedText text={text.replace(/^>\s*/, '')} />
      </blockquote>
    );
  }

  const lines = text.split('\n');
  const isBulletList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));

  if (isBulletList && lines.length > 1) {
    return (
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {lines.map((l, lIdx) => (
          <li key={lIdx} style={{ lineHeight: 1.65 }}>
            <InlineFormattedText text={l.trim().replace(/^[-*]\s+/, '')} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
      <InlineFormattedText text={text} />
    </p>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AdminConversationsPage() {
  // Navigation tabs: 4 Conversation Management Tabs + 1 Simulation Mode
  const [activeTab, setActiveTab] = useState<'council' | 'live' | 'takeover' | 'all' | 'simulation'>('council');

  // Audio Engine Hook (Guqin BGM, Audio Ducking, Voice Personas)
  const audioEngine = useCouncilAudioEngine();

  // --- LIVE CONVERSATIONS STATE ---
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Admin Reply & Takeover States
  const [adminInput, setAdminInput] = useState<string>('');
  const [impersonateSlug, setImpersonateSlug] = useState<string>(''); // '' = Admin direct, or master slug

  // --- MULTI-AGENT COUNCIL SIMULATION STATES (Tab 5) ---
  const [simMessages, setSimMessages] = useState<DialogueMessage[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(5000);
  const [typingSpeaker, setTypingSpeaker] = useState<'minh' | 'thay_boi' | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const isRunningRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const simMessagesRef = useRef<DialogueMessage[]>([]);
  const speedMsRef = useRef<number>(speedMs);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    speedMsRef.current = speedMs;
  }, [speedMs]);

  // Load conversations whenever activeTab changes (if in one of the 4 conversation tabs)
  useEffect(() => {
    if (activeTab !== 'simulation') {
      fetchConversations(activeTab);
    }
  }, [activeTab]);

  const fetchConversations = async (tabFilter: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/conversations?tab=${tabFilter}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        if (data.conversations.length > 0) {
          // If current selection is invalid, select the first
          if (!selectedConvId || !data.conversations.some((c: StoredConversation) => c.id === selectedConvId)) {
            setSelectedConvId(data.conversations[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh sách hội thoại:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    liveChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages?.length]);

  // Handle Human Takeover Toggle
  const handleToggleTakeover = async () => {
    if (!selectedConvId) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOGGLE_TAKEOVER',
          conversationId: selectedConvId,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        await fetchConversations(activeTab);
      }
    } catch (err) {
      console.error('Lỗi bật/tắt Takeover:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Summon Agent into Council
  const handleSummonAgent = async (agentSlug: string) => {
    if (!selectedConvId) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUMMON_AGENT',
          conversationId: selectedConvId,
          senderAgentSlug: agentSlug,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        await fetchConversations(activeTab);
      }
    } catch (err) {
      console.error('Lỗi triệu tập Thầy:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Trigger Auto Council
  const handleTriggerAutoCouncil = async () => {
    if (!selectedConvId) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TRIGGER_AUTO_COUNCIL',
          conversationId: selectedConvId,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        await fetchConversations(activeTab);
      }
    } catch (err) {
      console.error('Lỗi kích hoạt Hội Chẩn Tự Động:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Sending Message as Admin or Impersonating a Master
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !adminInput.trim() || actionLoading) return;

    const content = adminInput.trim();
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_MESSAGE',
          conversationId: selectedConvId,
          content,
          senderAgentSlug: impersonateSlug || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setAdminInput('');
        await fetchConversations(activeTab);
      }
    } catch (err) {
      console.error('Lỗi gửi tin nhắn Admin:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered conversations by search query
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.customerName && c.customerName.toLowerCase().includes(q)) ||
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.chartSummary && c.chartSummary.toLowerCase().includes(q))
    );
  });

  // ==========================================
  // SIMULATION MODE ENGINE (Tab 5)
  // ==========================================
  const executeTurn = async () => {
    if (!isRunningRef.current || isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const curMsgs = simMessagesRef.current;
      const lastMsg = curMsgs.length > 0 ? curMsgs[curMsgs.length - 1] : null;

      let nextSpeaker: 'minh' | 'thay_boi' = 'minh';
      if (lastMsg) {
        if (lastMsg.sender === 'minh' || lastMsg.sender === 'admin') {
          nextSpeaker = 'thay_boi';
        } else {
          nextSpeaker = 'minh';
        }
      }

      setTypingSpeaker(nextSpeaker);
      const thinkDelay = Math.min(Math.max(speedMsRef.current * 0.35, 1200), 2800);
      await new Promise((r) => setTimeout(r, thinkDelay));

      if (!isRunningRef.current) {
        setTypingSpeaker(null);
        isProcessingRef.current = false;
        return;
      }

      const res = await fetch('/api/admin/conversations/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: simMessagesRef.current,
          speaker: nextSpeaker,
        }),
      });

      const data = await res.json();

      if (data.ok && data.message && isRunningRef.current) {
        const incoming: DialogueMessage = data.message;
        setSimMessages((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            if (last.id === incoming.id || (last.sender === incoming.sender && last.content === incoming.content)) {
              return prev;
            }
          }
          const updated = [...prev, incoming];
          simMessagesRef.current = updated;
          return updated;
        });

        // Enqueue Audio Speech if Auto-Speak is enabled
        if (audioEngine.isAutoSpeakEnabled) {
          audioEngine.enqueueSpeech({
            id: incoming.id,
            agentSlug: incoming.sender === 'minh' ? 'khach-minh-1986' : (incoming.masterSlug || 'thay-minh-triet'),
            senderName: incoming.senderName,
            text: incoming.content,
          });
        }
      }
    } catch (err) {
      console.error('Lỗi trong lượt đàm đạo:', err);
    } finally {
      setTypingSpeaker(null);
      isProcessingRef.current = false;

      if (isRunningRef.current) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setTimeout(() => {
          if (isRunningRef.current) {
            executeTurn();
          }
        }, speedMsRef.current);
      }
    }
  };

  const startSimulation = () => {
    if (isRunningRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(true);
    isRunningRef.current = true;
    executeTurn();
  };

  const stopSimulation = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    isProcessingRef.current = false;
    setTypingSpeaker(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setSimMessages([]);
    simMessagesRef.current = [];
  };

  const handleSendAdminIntervene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const adminMsg: DialogueMessage = {
      id: `msg_admin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sender: 'admin',
      senderName: 'Chuyên Viên Quản Trị Hệ Thống (Admin)',
      senderTitle: 'Can Thiệp Trực Tiếp',
      avatarUrl: '/icons/icon.svg',
      content: customPrompt.trim(),
      timestamp: timeStr,
    };

    setSimMessages((prev) => {
      const next = [...prev, adminMsg];
      simMessagesRef.current = next;
      return next;
    });
    setCustomPrompt('');

    if (isRunningRef.current) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setTimeout(() => {
        if (isRunningRef.current) {
          executeTurn();
        }
      }, 600);
    }
  };

  const exportConversationTxt = () => {
    if (simMessages.length === 0) {
      alert('Chưa có tin nhắn nào để xuất!');
      return;
    }
    const lines = [
      '=================================================================',
      'BIÊN BẢN TỌA ĐÀM: HỘI ĐỒNG BÁT ĐẠI DANH SƯ & KHÁCH HÀNG MINH (1986)',
      'HỆ THỐNG HUYỀN HỌC & AI TỬ VI ĐẨU SỐ — XEMBOI.VN',
      `Thời gian xuất biên bản: ${new Date().toLocaleString('vi-VN')}`,
      `Tổng số lượt trao đổi: ${simMessages.length} lượt`,
      '=================================================================\n',
    ];

    simMessages.forEach((m, idx) => {
      let senderTag = `[LƯỢT ${idx + 1}] `;
      if (m.sender === 'minh') {
        senderTag += `KHÁCH HÀNG MINH (1986 Bính Dần) (${m.timestamp})`;
      } else if (m.sender === 'thay_boi') {
        senderTag += `${m.senderName.toUpperCase()} — ${m.senderTitle} (${m.timestamp})`;
      } else {
        senderTag += `CHUYÊN VIÊN ADMIN (${m.timestamp})`;
      }

      lines.push(senderTag);
      if (m.topic) lines.push(`Chủ đề: ${m.topic}`);
      lines.push('');
      lines.push(m.content);
      lines.push('-----------------------------------------------------------------\n');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BienBan_BatDaiDanhSu_va_Minh_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lastMasterMsg = [...simMessages].reverse().find((m) => m.sender === 'thay_boi');
  const activeMasterSlug = lastMasterMsg?.masterSlug || 'thay-minh-triet';

  const masterAnswerCounts: Record<string, number> = {};
  simMessages.forEach((m) => {
    if (m.sender === 'thay_boi' && m.masterSlug) {
      masterAnswerCounts[m.masterSlug] = (masterAnswerCounts[m.masterSlug] || 0) + 1;
    }
  });

  const lastMsg = simMessages.length > 0 ? simMessages[simMessages.length - 1] : null;
  const upcomingMaster = lastMsg
    ? resolveMasterForTopic({ topicKey: lastMsg.topicKey, questionText: lastMsg.content })
    : BAT_DAI_DANH_SU[0];
  const upcomingTheme = MASTER_THEMES[upcomingMaster.slug] || DEFAULT_MASTER_THEME;

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', paddingBottom: 60 }}>
      {/* Page Title & Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, fontFamily: "'Noto Serif', serif", color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🏛️</span>
            <span>Hội Thoại &amp; Trực Tuyến — Bát Đại Danh Sư &amp; Hội Chẩn</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            Trung tâm điều phối hội thoại đa tác tử: Giám sát phòng Hội Chẩn, triệu tập Thầy vào luận giải và can thiệp trực tiếp (Human Takeover).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              if (activeTab !== 'simulation') fetchConversations(activeTab);
            }}
            disabled={isLoading}
            style={{
              fontSize: 12.5,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--line)',
              background: 'var(--card)',
              color: 'var(--ink)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            🔄 {isLoading ? 'Đang nạp...' : 'Làm mới'}
          </button>

          <Link
            href="/admin/agents"
            style={{
              fontSize: 12.5,
              color: 'var(--red)',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--line)',
              background: 'var(--card)',
            }}
          >
            ← Bát Đại Danh Sư
          </Link>
        </div>
      </div>

      {/* Main Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--line)', marginBottom: 20, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button
          type="button"
          onClick={() => setActiveTab('council')}
          style={{
            padding: '12px 18px',
            border: 0,
            background: 'transparent',
            borderBottom: activeTab === 'council' ? '3px solid #d97706' : '3px solid transparent',
            color: activeTab === 'council' ? '#d97706' : 'var(--ink)',
            fontWeight: activeTab === 'council' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <span>🔥</span>
          <span>Phòng Hội Chẩn Đa Sư</span>
          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: '#fef3c7', color: '#b45309', fontWeight: 800 }}>
            COUNCIL
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('live')}
          style={{
            padding: '12px 18px',
            border: 0,
            background: 'transparent',
            borderBottom: activeTab === 'live' ? '3px solid #16a34a' : '3px solid transparent',
            color: activeTab === 'live' ? '#16a34a' : 'var(--ink)',
            fontWeight: activeTab === 'live' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <span>🟢</span>
          <span>Đang Trực Tuyến</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('takeover')}
          style={{
            padding: '12px 18px',
            border: 0,
            background: 'transparent',
            borderBottom: activeTab === 'takeover' ? '3px solid #dc2626' : '3px solid transparent',
            color: activeTab === 'takeover' ? '#dc2626' : 'var(--ink)',
            fontWeight: activeTab === 'takeover' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <span>🙋</span>
          <span>Cần Admin Hỗ Trợ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            padding: '12px 18px',
            border: 0,
            background: 'transparent',
            borderBottom: activeTab === 'all' ? '3px solid var(--red)' : '3px solid transparent',
            color: activeTab === 'all' ? 'var(--red)' : 'var(--ink)',
            fontWeight: activeTab === 'all' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <span>📋</span>
          <span>Tất Cả Hội Thoại</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          style={{
            padding: '12px 18px',
            border: 0,
            background: 'transparent',
            borderBottom: activeTab === 'simulation' ? '3px solid #7c3aed' : '3px solid transparent',
            color: activeTab === 'simulation' ? '#7c3aed' : 'var(--ink)',
            fontWeight: activeTab === 'simulation' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13.5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <span>⚙️</span>
          <span>Giả Lập Tọa Đàm (Minh 1986)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TABS 1, 2, 3, 4: LIVE CONVERSATIONS & COUNCIL ROOMS VIEW */}
      {/* ======================================================== */}
      {activeTab !== 'simulation' && (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 20, alignItems: 'start' }}>
          {/* LEFT COLUMN: Conversation List & Filter */}
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 14,
              border: '1px solid var(--line)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            {/* Search Box */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm khách hàng, lá số hoặc mã phòng..."
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--line)',
                  fontSize: 12.5,
                  background: 'var(--card)',
                  outline: 'none',
                }}
              />
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', maxHeight: 680 }}>
              {isLoading ? (
                <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  ⏳ Đang tải phiên hội chẩn...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  Không có phiên hội thoại nào phù hợp với bộ lọc này.
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const isSelected = c.id === selectedConvId;
                  const isCouncil = c.mode === 'COUNCIL_CONSULTATION';
                  const isTakeover = c.status === 'HUMAN_TAKEOVER';

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConvId(c.id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--line)',
                        cursor: 'pointer',
                        background: isSelected
                          ? 'rgba(234, 179, 8, 0.08)'
                          : 'transparent',
                        borderLeft: isSelected ? '4px solid #d97706' : '4px solid transparent',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13 }}>{isCouncil ? '🔥' : '💬'}</span>
                          <strong style={{ fontSize: 13.5, color: 'var(--ink)' }}>
                            {c.customerName || 'Đương số'}
                          </strong>
                        </div>

                        {/* Status Badge */}
                        <span
                          style={{
                            fontSize: 9.5,
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontWeight: 700,
                            background: isTakeover
                              ? '#dc2626'
                              : isCouncil
                              ? '#d97706'
                              : '#16a34a',
                            color: '#fff',
                          }}
                        >
                          {isTakeover
                            ? 'TAKEOVER'
                            : isCouncil
                            ? 'HỘI CHẨN'
                            : 'AI 1-1'}
                        </span>
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 6 }}>
                        {c.title || c.chartSummary || 'Chưa có thông tin'}
                      </div>

                      {/* Participant Avatars & Message Count */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          {(c.participantSlugs || ['thay-minh-triet']).slice(0, 4).map((slug) => {
                            const ag = getAgentBySlug(slug);
                            return (
                              <img
                                key={slug}
                                src={ag.avatarUrl}
                                alt={ag.name}
                                title={ag.name}
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  border: '1px solid #d97706',
                                  background: '#1d1729',
                                }}
                              />
                            );
                          })}
                          {(c.participantSlugs || []).length > 4 && (
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>
                              +{c.participantSlugs.length - 4}
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                          {c.messages?.length || 0} tin nhắn
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE COUNCIL CONTROL PANEL */}
          {selectedConv ? (
            <div
              style={{
                background: 'var(--card)',
                borderRadius: 14,
                border: '1.5px solid #eab308',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 15px rgba(234, 179, 8, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: 740,
                overflow: 'hidden',
              }}
            >
              {/* TOP HEADER OF SELECTED CONVERSATION */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #130a1e 0%, #1f1130 50%, #12091c 100%)',
                  padding: '14px 20px',
                  color: '#fff',
                  borderBottom: '1px solid rgba(234, 179, 8, 0.35)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{selectedConv.mode === 'COUNCIL_CONSULTATION' ? '🔥' : '💬'}</span>
                    <h2 style={{ fontSize: 16, margin: 0, fontFamily: "'Noto Serif', serif", color: '#fde047' }}>
                      {selectedConv.title || `Hội thoại: ${selectedConv.customerName}`}
                    </h2>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#cbd5e1', marginTop: 3 }}>
                    {selectedConv.chartSummary || 'Thông tin lá số đã nạp'}
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selectedConv.mode !== 'COUNCIL_CONSULTATION' && (
                    <button
                      type="button"
                      onClick={handleTriggerAutoCouncil}
                      disabled={actionLoading}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #eab308',
                        background: 'rgba(234, 179, 8, 0.2)',
                        color: '#fef08a',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      🔥 Chuyển Thành Hội Chẩn Đa Sư
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleToggleTakeover}
                    disabled={actionLoading}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: 0,
                      background: selectedConv.status === 'HUMAN_TAKEOVER' ? '#16a34a' : '#dc2626',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {selectedConv.status === 'HUMAN_TAKEOVER'
                      ? '✅ Trả Quyền Cho Bát Đại Danh Sư'
                      : '✋ Tiếp Quản Chat Trực Tiếp (Takeover)'}
                  </button>
                </div>
              </div>

              {/* ASTROLOGICAL COORDINATES & SUMMON AGENTS STRIP */}
              <div
                style={{
                  background: '#181124',
                  padding: '8px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                  <span style={{ color: '#fde047', fontWeight: 700 }}>
                    👑 Triệu Tập Bổ Sung Vị Thầy Vào Phòng (Summon Agent):
                  </span>
                  <span style={{ color: '#94a3b8' }}>Bấm tên Thầy để Thầy phát biểu bổ sung góc nhìn</span>
                </div>

                {/* 8 Masters Summon Bar */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
                  {BAT_DAI_DANH_SU.map((agent) => {
                    const isParticipating = (selectedConv.participantSlugs || []).includes(agent.slug);
                    const theme = MASTER_THEMES[agent.slug] || DEFAULT_MASTER_THEME;

                    return (
                      <button
                        key={agent.slug}
                        type="button"
                        onClick={() => handleSummonAgent(agent.slug)}
                        disabled={actionLoading}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 20,
                          background: isParticipating ? theme.gradientBg : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isParticipating ? theme.borderColor : 'rgba(255,255,255,0.15)'}`,
                          color: isParticipating ? theme.nameColor : '#cbd5e1',
                          fontSize: 11,
                          fontWeight: isParticipating ? 700 : 500,
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow: isParticipating ? `0 0 8px ${theme.glowColor}` : 'none',
                        }}
                      >
                        <img
                          src={agent.avatarUrl}
                          alt={agent.name}
                          style={{ width: 16, height: 16, borderRadius: '50%' }}
                        />
                        <span>{agent.shortLabel || agent.name.replace('Thầy ', '').replace('Cô ', '')}</span>
                        {isParticipating && <span style={{ fontSize: 9, opacity: 0.8 }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PODCAST PROMOTIONAL BANNER FOR MINH 1986 OR ANY COUNCIL */}
              {selectedConv.mode === 'COUNCIL_CONSULTATION' && (
                <div
                  style={{
                    background: 'linear-gradient(90deg, #31164d 0%, #1f0d36 100%)',
                    borderBottom: '1px solid rgba(234, 179, 8, 0.4)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ fontSize: 16 }}>📻</span>
                    <span style={{ color: '#fde047', fontWeight: 700 }}>
                      Phòng Tọa Đàm Cổ Phong Bát Đại Danh Sư &amp; Minh (1986)
                    </span>
                    <span style={{ color: '#cbd5e1', fontSize: 11 }}>
                      (Hòa tấu Cổ Cầm · Giọng Đọc 8 Thầy Phân Lập)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (audioEngine.isPodcastMode) {
                        audioEngine.stopAllSpeech();
                        audioEngine.setIsPodcastMode(false);
                      } else {
                        const customerGender = detectGenderFromContext({
                          gender: (selectedConv as any).customerGender,
                          name: selectedConv.customerName,
                          chartSummary: selectedConv.chartSummary,
                        });
                        const isFemale = customerGender === 'female';
                        const customerSlug = isFemale ? 'khach-hang-nu' : 'khach-hang-nam';
                        const customerName = selectedConv.customerName || (isFemale ? 'Khách Nữ' : 'Khách Nam');

                        const items: AudioQueueItem[] = selectedConv.messages
                          .filter((m: StoredMessage) => m.role === 'assistant' || m.role === 'user')
                          .map((m: StoredMessage) => ({
                            id: m.id,
                            agentSlug: m.senderAgentSlug || (m.role === 'user' ? customerSlug : 'thay-minh-triet'),
                            gender: m.role === 'user' ? customerGender : undefined,
                            senderName: m.senderName || (m.role === 'user' ? customerName : 'Thầy Minh Triết'),
                            text: m.content,
                            audioUrl: m.audioUrl,
                          }));
                        audioEngine.startPodcastPlayback(items);
                      }
                    }}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 20,
                      border: '1px solid #fde047',
                      background: audioEngine.isPodcastMode ? '#dc2626' : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                      color: '#fff',
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <span>{audioEngine.isPodcastMode ? '⏹️ Dừng Phát Tọa Đàm' : '▶️ Bắt Đầu Nghe Toàn Bộ Tọa Đàm Có Nhạc Cổ Cầm & Giọng Đọc'}</span>
                  </button>
                </div>
              )}

              {/* ZEN GUQIN BGM & AI VOICE PERSONA CONTROLS */}
              <AudioControlHeader
                isBgmPlaying={audioEngine.isBgmPlaying}
                selectedBgmTrack={audioEngine.selectedBgmTrack}
                bgmVolume={audioEngine.bgmVolume}
                toggleBgm={audioEngine.toggleBgm}
                changeBgmTrack={audioEngine.changeBgmTrack}
                changeBgmVolume={audioEngine.changeBgmVolume}
                isAutoSpeakEnabled={audioEngine.isAutoSpeakEnabled}
                toggleAutoSpeak={audioEngine.toggleAutoSpeak}
                activeSpeakingSlug={audioEngine.activeSpeakingSlug}
                speakingMasterName={
                  audioEngine.activeSpeakingSlug
                    ? getAgentVoiceProfile(audioEngine.activeSpeakingSlug).name
                    : undefined
                }
                isPodcastMode={audioEngine.isPodcastMode}
                onTogglePodcastMode={() => {
                  if (audioEngine.isPodcastMode) {
                    audioEngine.stopAllSpeech();
                    audioEngine.setIsPodcastMode(false);
                  } else if (selectedConv?.messages) {
                    const items: AudioQueueItem[] = selectedConv.messages
                      .filter((m: StoredMessage) => m.role === 'assistant' || m.role === 'user')
                      .map((m: StoredMessage) => ({
                        id: m.id,
                        agentSlug: m.senderAgentSlug || (m.role === 'user' ? 'khach-minh-1986' : 'thay-minh-triet'),
                        senderName: m.senderName || 'Đương số',
                        text: m.content,
                        audioUrl: m.audioUrl,
                      }));
                    audioEngine.startPodcastPlayback(items);
                  }
                }}
                audioAmplitude={audioEngine.audioAmplitude}
              />

              {/* MESSAGES THREAD */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  background: '#0d0a14',
                }}
              >
                {selectedConv.messages.map((m: StoredMessage) => {
                  const isUser = m.role === 'user';
                  const isAdmin = m.role === 'admin';
                  const isSystem = m.role === 'system';

                  if (isSystem) {
                    return (
                      <div
                        key={m.id}
                        style={{
                          alignSelf: 'center',
                          background: 'rgba(234, 179, 8, 0.15)',
                          border: '1px dashed rgba(234, 179, 8, 0.4)',
                          color: '#fef08a',
                          padding: '6px 14px',
                          borderRadius: 20,
                          fontSize: 11.5,
                          fontWeight: 600,
                        }}
                      >
                        {m.content}
                      </div>
                    );
                  }

                  if (isUser) {
                    const customerGender = detectGenderFromContext({
                      gender: (selectedConv as any).customerGender,
                      name: m.senderName || selectedConv.customerName,
                      chartSummary: selectedConv.chartSummary,
                    });
                    const isFemale = customerGender === 'female';
                    const customerSlug = isFemale ? 'khach-hang-nu' : 'khach-hang-nam';
                    const customerDisplayName = m.senderName || selectedConv.customerName || (isFemale ? 'Khách Nữ' : 'Khách Nam');
                    const customerThemeColor = isFemale ? '#f472b6' : '#38bdf8';
                    const customerBgColor = isFemale ? '#3b0764' : '#172554';
                    const customerBorderColor = isFemale ? '#701a75' : '#1e40af';
                    const customerAvatar = isFemale ? '/icons/agents/co-linh-dan.svg' : '/icons/avatar-minh.svg';

                    const isUserSpeaking =
                      (audioEngine.activeSpeakingSlug === customerSlug ||
                        audioEngine.activeSpeakingSlug === 'khach-minh-1986' ||
                        audioEngine.activeSpeakingSlug === 'khach-hang-nu' ||
                        audioEngine.activeSpeakingSlug === 'khach-hang-nam') &&
                      audioEngine.currentlyPlayingMessageId === m.id;

                    return (
                      <div
                        key={m.id}
                        style={{
                          alignSelf: 'flex-start',
                          maxWidth: '75%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: customerThemeColor, fontWeight: 700 }}>
                          <VoiceWaveformAvatar
                            avatarUrl={customerAvatar}
                            name={customerDisplayName}
                            ringColor={customerThemeColor}
                            isSpeaking={isUserSpeaking}
                            amplitude={audioEngine.audioAmplitude}
                            size={22}
                          />
                          <span>{customerDisplayName}</span>
                          <span style={{ fontSize: 9.5, opacity: 0.7 }}>
                            ({m.senderBadge || (isFemale ? 'Đương số Nữ' : 'Đương số Nam')})
                          </span>
                        </div>
                        <div
                          style={{
                            background: customerBgColor,
                            border: isUserSpeaking ? `2px solid ${customerThemeColor}` : `1px solid ${customerBorderColor}`,
                            boxShadow: isUserSpeaking ? `0 0 16px ${isFemale ? 'rgba(244, 114, 182, 0.4)' : 'rgba(56, 189, 248, 0.4)'}` : 'none',
                            color: '#fff',
                            padding: '10px 14px',
                            borderRadius: '12px 12px 12px 2px',
                            fontSize: 13,
                            lineHeight: 1.6,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {m.content}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                            <SingleMessageAudioButton
                              messageId={m.id}
                              agentSlug={customerSlug}
                              senderName={customerDisplayName}
                              text={m.content}
                              audioUrl={m.audioUrl}
                              isPlaying={isUserSpeaking}
                              onPlay={() => {
                                audioEngine.playSingleMessage({
                                  id: m.id,
                                  agentSlug: customerSlug,
                                  gender: customerGender,
                                  senderName: customerDisplayName,
                                  text: m.content,
                                  audioUrl: m.audioUrl,
                                });
                              }}
                              onStop={audioEngine.stopAllSpeech}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (isAdmin) {
                    return (
                      <div
                        key={m.id}
                        style={{
                          alignSelf: 'flex-end',
                          maxWidth: '78%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: 4,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#f87171', fontWeight: 700 }}>
                          <span>👑 {m.senderName || 'Admin Quản Trị'}</span>
                          <span style={{ fontSize: 9.5, background: '#dc2626', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>
                            {m.senderBadge || 'Trực tiếp'}
                          </span>
                        </div>
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                            border: '1px solid #ef4444',
                            color: '#fff',
                            padding: '10px 14px',
                            borderRadius: '12px 12px 2px 12px',
                            fontSize: 13,
                            lineHeight: 1.6,
                            boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
                          }}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  }

                  // Assistant / Master Message
                  const masterTheme = MASTER_THEMES[m.senderAgentSlug || ''] || DEFAULT_MASTER_THEME;
                  const isSpeakingThisMsg = audioEngine.currentlyPlayingMessageId === m.id;

                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: 'stretch',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {/* Master Identity Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <VoiceWaveformAvatar
                            avatarUrl={m.senderAvatar || masterTheme.avatarUrl}
                            name={m.senderName || 'Thầy'}
                            ringColor={masterTheme.avatarRing}
                            isSpeaking={isSpeakingThisMsg}
                            amplitude={audioEngine.audioAmplitude}
                            size={28}
                          />
                          <div>
                            <span style={{ fontWeight: 800, fontSize: 13, color: masterTheme.nameColor, fontFamily: "'Noto Serif', serif" }}>
                              {m.senderName}
                            </span>
                            {m.senderBadge && (
                              <span
                                style={{
                                  marginLeft: 6,
                                  fontSize: 9.5,
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  background: masterTheme.badgeBg,
                                  color: masterTheme.badgeTextColor,
                                  fontWeight: 700,
                                }}
                              >
                                {m.senderBadge}
                              </span>
                            )}
                            {isSpeakingThisMsg && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: 9.5,
                                  padding: '1px 6px',
                                  borderRadius: 10,
                                  background: 'rgba(34, 197, 94, 0.25)',
                                  color: '#4ade80',
                                  fontWeight: 700,
                                  border: '1px solid #22c55e',
                                }}
                              >
                                🔊 Đang phát luận
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: 13 }}>{masterTheme.iconSymbol}</span>
                      </div>

                      {/* Card Content */}
                      <div
                        style={{
                          background: masterTheme.gradientBg,
                          border: isSpeakingThisMsg ? '2px solid #22c55e' : `1.5px solid ${masterTheme.borderColor}`,
                          boxShadow: isSpeakingThisMsg ? '0 0 24px rgba(34, 197, 94, 0.45)' : `0 4px 16px ${masterTheme.glowColor}`,
                          color: '#fff',
                          padding: '12px 16px',
                          borderRadius: 12,
                          transition: 'border 0.2s ease, box-shadow 0.2s ease',
                        }}
                      >
                        <RenderMessageContent content={m.content} theme={masterTheme} />

                        {/* Single Message Audio Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                          <SingleMessageAudioButton
                            messageId={m.id}
                            agentSlug={m.senderAgentSlug || 'thay-minh-triet'}
                            senderName={m.senderName || 'Thầy'}
                            text={m.content}
                            audioUrl={m.audioUrl}
                            isPlaying={isSpeakingThisMsg}
                            onPlay={() => {
                              audioEngine.playSingleMessage({
                                id: m.id,
                                agentSlug: m.senderAgentSlug || 'thay-minh-triet',
                                senderName: m.senderName || 'Thầy',
                                text: m.content,
                                audioUrl: m.audioUrl,
                              });
                            }}
                            onStop={audioEngine.stopAllSpeech}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={liveChatEndRef} />
              </div>

              {/* ADMIN REPLY & IMPERSONATION CONSOLE */}
              <form
                onSubmit={handleSendAdminMessage}
                style={{
                  padding: 12,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  background: '#161122',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {/* Persona Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ color: '#cbd5e1' }}>Tư cách phản hồi:</span>
                  <select
                    value={impersonateSlug}
                    onChange={(e) => setImpersonateSlug(e.target.value)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: '1px solid rgba(242,199,107,0.3)',
                      background: '#0d0a14',
                      color: '#fef08a',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <option value="">👑 Admin Ban Quản Trị Hệ Thống (Trực Tiếp)</option>
                    <option value="thay-minh-triet">🔱 Thầy Minh Triết (Admin Nhập Vai)</option>
                    <option value="thay-thai-son">💰 Thầy Thái Sơn (Admin Nhập Vai)</option>
                    <option value="thay-tam-an">🌸 Thầy Tâm An (Admin Nhập Vai)</option>
                    <option value="thay-thien-minh">📅 Thầy Thiên Minh (Admin Nhập Vai)</option>
                    <option value="thay-huyen-co">☯️ Thầy Huyền Cơ (Admin Nhập Vai)</option>
                    <option value="thay-tue-phong">🧭 Thầy Tuệ Phong (Admin Nhập Vai)</option>
                    <option value="thay-lac-viet">📜 Thầy Lạc Việt (Admin Nhập Vai)</option>
                    <option value="co-linh-dan">🌙 Cô Linh Đan (Admin Nhập Vai)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    placeholder="Nhập nội dung phản hồi trực tiếp vào phòng hội chẩn..."
                    disabled={actionLoading}
                    style={{
                      flex: 1,
                      padding: '9px 14px',
                      borderRadius: 8,
                      border: '1px solid rgba(242,199,107,0.3)',
                      background: '#0d0a14',
                      color: '#fff',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !adminInput.trim()}
                    style={{
                      padding: '9px 20px',
                      borderRadius: 8,
                      border: '1px solid #fde047',
                      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: actionLoading || !adminInput.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {actionLoading ? 'Đang gửi...' : 'Gửi Phản Hồi'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--card)',
                borderRadius: 14,
                border: '1px solid var(--line)',
                padding: 40,
                textAlign: 'center',
                color: 'var(--muted)',
              }}
            >
              Chọn một phiên hội thoại ở danh sách bên trái để mở bảng điều khiển.
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: SIMULATION MODE (BÁT ĐẠI DANH SƯ & MINH 1986) */}
      {/* ======================================================== */}
      {activeTab === 'simulation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* GRAND COUNCIL ARENA HEADER */}
          <div
            style={{
              background: 'linear-gradient(135deg, #130a1e 0%, #1f1130 50%, #12091c 100%)',
              borderRadius: 18,
              border: '1.5px solid #eab308',
              padding: '20px 24px',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(234, 179, 8, 0.15)',
            }}
          >
            {/* Top Bar: Council Title & Live Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🏛️</span>
                <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 15, fontWeight: 700, color: '#fde047', letterSpacing: 0.5 }}>
                  HỘI ĐỒNG BÁT ĐẠI DANH SƯ XEMBOI.VN — TỌA ĐÀM CÙNG ĐƯƠNG SỐ MINH (1986 BÍNH DẦN)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 14px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background: isRunning ? 'rgba(22, 163, 74, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    border: isRunning ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.2)',
                    color: isRunning ? '#4ade80' : '#cbd5e1',
                  }}
                >
                  <span>{isRunning ? '🟢' : '⏸️'}</span>
                  <span>{isRunning ? `ĐANG ĐỐI THOẠI (${simMessages.length} lượt)` : simMessages.length > 0 ? `TẠM DỪNG (${simMessages.length} lượt)` : 'SẴN SÀNG'}</span>
                </span>
              </div>
            </div>

            {/* Split layout: Minh Profile (Left) & 8 Masters Council Strip (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'center' }}>
              {/* Customer Minh Profile Card */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #0b1329 0%, #172554 100%)',
                  borderRadius: 14,
                  border: '1.5px solid #38bdf8',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 4px 16px rgba(56, 189, 248, 0.2)',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#0f172a',
                    border: '2.5px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img src="/icons/avatar-minh.svg" alt="Minh" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <strong style={{ fontSize: 15, color: '#38bdf8' }}>Minh</strong>
                    <span style={{ fontSize: 9.5, background: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                      ĐƯƠNG SỐ 1986
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#cbd5e1', marginTop: 3 }}>
                    Nam · 02h00 14/12/1986 (Bính Dần)
                  </div>
                  <div style={{ fontSize: 10.5, color: '#fde047', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    Lô Trung Hỏa · Mộc Tam Cục · Mệnh Phủ · Thân Tham
                  </div>
                </div>
              </div>

              {/* 8 Masters Council Seats Strip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11.5, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hội Đồng Bát Đại Danh Sư (8 Thầy túc trực tham vấn):</span>
                  <span>Click Thầy để xem chuyên môn</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: 8,
                  }}
                >
                  {BAT_DAI_DANH_SU.map((master) => {
                    const theme = MASTER_THEMES[master.slug] || DEFAULT_MASTER_THEME;
                    const isActive = activeMasterSlug === master.slug;
                    const isSpeakingNow = audioEngine.activeSpeakingSlug === master.slug;
                    const count = masterAnswerCounts[master.slug] || 0;

                    return (
                      <div
                        key={master.slug}
                        title={`${master.name} — ${master.title}`}
                        style={{
                          background: isSpeakingNow
                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(21, 128, 61, 0.4) 100%)'
                            : isActive
                            ? theme.gradientBg
                            : 'rgba(255, 255, 255, 0.04)',
                          borderRadius: 12,
                          border: isSpeakingNow
                            ? '2px solid #22c55e'
                            : isActive
                            ? `2px solid ${theme.borderColor}`
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '8px 6px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: 5,
                          transition: 'all 0.3s ease',
                          boxShadow: isSpeakingNow
                            ? '0 0 20px rgba(34, 197, 94, 0.6)'
                            : isActive
                            ? `0 0 16px ${theme.glowColor}`
                            : 'none',
                          transform: isSpeakingNow || isActive ? 'scale(1.05)' : 'scale(1)',
                          position: 'relative',
                        }}
                      >
                        <VoiceWaveformAvatar
                          avatarUrl={master.avatarUrl}
                          name={master.name}
                          ringColor={isSpeakingNow ? '#22c55e' : theme.avatarRing}
                          isSpeaking={isSpeakingNow}
                          amplitude={audioEngine.audioAmplitude}
                          size={38}
                        />

                        <div
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: isSpeakingNow ? '#4ade80' : isActive ? theme.nameColor : '#e2e8f0',
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                          }}
                        >
                          {master.shortLabel || master.name.replace('Thầy ', '').replace('Cô ', '')}
                        </div>

                        <div
                          style={{
                            fontSize: 9,
                            padding: '1px 5px',
                            borderRadius: 6,
                            background: isSpeakingNow
                              ? 'rgba(34, 197, 94, 0.3)'
                              : isActive
                              ? theme.badgeBg
                              : 'rgba(255, 255, 255, 0.08)',
                            color: isSpeakingNow
                              ? '#86efac'
                              : isActive
                              ? theme.badgeTextColor
                              : '#94a3b8',
                            fontWeight: 600,
                            border: isSpeakingNow
                              ? '1px solid #22c55e'
                              : isActive
                              ? `1px solid ${theme.borderColor}`
                              : 'none',
                          }}
                        >
                          {isSpeakingNow ? '🔊 Đang luận' : isActive ? '✨ Đang tọa' : count > 0 ? `${count} lượt` : 'Túc trực'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* AUDIO CỔ PHONG & GIỌNG ĐỌC BÁT ĐẠI DANH SƯ CONTROLS */}
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
            <AudioControlHeader
              isBgmPlaying={audioEngine.isBgmPlaying}
              selectedBgmTrack={audioEngine.selectedBgmTrack}
              bgmVolume={audioEngine.bgmVolume}
              toggleBgm={audioEngine.toggleBgm}
              changeBgmTrack={audioEngine.changeBgmTrack}
              changeBgmVolume={audioEngine.changeBgmVolume}
              isAutoSpeakEnabled={audioEngine.isAutoSpeakEnabled}
              toggleAutoSpeak={audioEngine.toggleAutoSpeak}
              activeSpeakingSlug={audioEngine.activeSpeakingSlug}
              speakingMasterName={
                audioEngine.activeSpeakingSlug
                  ? getAgentVoiceProfile(audioEngine.activeSpeakingSlug).name
                  : undefined
              }
              isPodcastMode={audioEngine.isPodcastMode}
              onTogglePodcastMode={() => {
                if (audioEngine.isPodcastMode) {
                  audioEngine.stopAllSpeech();
                  audioEngine.setIsPodcastMode(false);
                } else if (simMessages.length > 0) {
                  const items: AudioQueueItem[] = simMessages
                    .filter((m) => m.sender === 'thay_boi' || m.sender === 'minh')
                    .map((m) => ({
                      id: m.id,
                      agentSlug: m.sender === 'minh' ? 'khach-minh-1986' : (m.masterSlug || 'thay-minh-triet'),
                      senderName: m.senderName,
                      text: m.content,
                    }));
                  audioEngine.startPodcastPlayback(items);
                }
              }}
              audioAmplitude={audioEngine.audioAmplitude}
            />
          </div>

          {/* CONTROL & SPEED BAR */}
          <div
            style={{
              background: 'var(--card)',
              borderRadius: 14,
              border: '1px solid var(--line)',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {!isRunning ? (
                <button
                  type="button"
                  onClick={startSimulation}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 30,
                    border: 0,
                    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>▶</span>
                  <span>{simMessages.length === 0 ? 'BẮT ĐẦU ĐỐI THOẠI CÙNG BÁT ĐẠI DANH SƯ' : 'TIẾP TỤC ĐỐI THOẠI'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopSimulation}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 30,
                    border: 0,
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>⏹</span>
                  <span>DỪNG ĐỐI THOẠI</span>
                </button>
              )}

              <button
                type="button"
                onClick={resetSimulation}
                style={{
                  padding: '10px 16px',
                  borderRadius: 30,
                  border: '1px solid var(--line)',
                  background: 'transparent',
                  color: 'var(--ink)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🔄 Bắt Đầu Lại Từ Đầu
              </button>
            </div>

            <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--muted)' }}>Tốc độ đối thoại:</span>
                <select
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--line)',
                    background: 'var(--bg)',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <option value={3000}>Nhanh (3 giây)</option>
                  <option value={5000}>Vừa vặn (5 giây - Mặc định)</option>
                  <option value={10000}>Thong thả (10 giây - Nghiền ngẫm sâu)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={exportConversationTxt}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  background: 'var(--card)',
                  color: 'var(--ink)',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>💾</span>
                <span>Xuất Biên Bản (.TXT)</span>
              </button>
            </div>
          </div>

          {/* SIMULATION DIALOGUE STREAM */}
          <div
            style={{
              background: '#0d0a14',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: '24px 20px',
              minHeight: 460,
              maxHeight: 700,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {simMessages.length === 0 && (
              <div
                style={{
                  margin: 'auto',
                  textAlign: 'center',
                  color: '#94a3b8',
                  padding: '40px 20px',
                  maxWidth: 500,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>☯️</div>
                <h3 style={{ fontSize: 17, color: '#fde047', margin: '0 0 8px', fontFamily: "'Noto Serif', serif" }}>
                  Phòng Tọa Đàm Đa Danh Sư Đang Chờ Bắt Đầu
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  Bấm nút <strong>&quot;BẮT ĐẦU ĐỐI THOẠI CÙNG BÁT ĐẠI DANH SƯ&quot;</strong> ở trên để khách hàng Minh và các vị Thầy bắt đầu đàm đạo tự nhiên.
                </p>
              </div>
            )}

            {simMessages.map((m, idx) => {
              const isMinh = m.sender === 'minh';
              const isAdmin = m.sender === 'admin';
              const masterTheme = resolveThemeForMessage(m);
              const isSpeakingThisMsg = audioEngine.currentlyPlayingMessageId === m.id;

              if (isAdmin) {
                return (
                  <div
                    key={m.id || idx}
                    style={{
                      alignSelf: 'center',
                      maxWidth: '85%',
                      width: '100%',
                      background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                      borderRadius: 14,
                      border: '1.5px solid #ef4444',
                      padding: '12px 18px',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>👑</span>
                      <strong style={{ fontSize: 13, color: '#fca5a5' }}>{m.senderName}</strong>
                      <span style={{ fontSize: 10, background: '#dc2626', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                        {m.senderTitle}
                      </span>
                      <span style={{ fontSize: 11, marginLeft: 'auto', opacity: 0.7 }}>{m.timestamp}</span>
                    </div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{m.content}</div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id || idx}
                  style={{
                    display: 'flex',
                    flexDirection: isMinh ? 'row' : 'row-reverse',
                    gap: 14,
                    maxWidth: '88%',
                    alignSelf: isMinh ? 'flex-start' : 'flex-end',
                    width: '100%',
                  }}
                >
                  <VoiceWaveformAvatar
                    avatarUrl={m.avatarUrl || (isMinh ? '/icons/avatar-minh.svg' : masterTheme.avatarUrl)}
                    name={m.senderName}
                    ringColor={isMinh ? MINH_THEME.avatarRing : masterTheme.avatarRing}
                    isSpeaking={isSpeakingThisMsg}
                    amplitude={audioEngine.audioAmplitude}
                    size={44}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        borderRadius: 16,
                        background: isMinh ? MINH_THEME.gradientBg : masterTheme.gradientBg,
                        border: isSpeakingThisMsg
                          ? '2px solid #22c55e'
                          : `1.5px solid ${isMinh ? MINH_THEME.borderColor : masterTheme.borderColor}`,
                        boxShadow: isSpeakingThisMsg
                          ? '0 0 24px rgba(34, 197, 94, 0.45)'
                          : `0 6px 20px ${isMinh ? MINH_THEME.glowColor : masterTheme.glowColor}`,
                        padding: '14px 18px',
                        color: '#f8fafc',
                        transition: 'border 0.2s ease, box-shadow 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 8,
                          paddingBottom: 6,
                          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
                          flexWrap: 'wrap',
                        }}
                      >
                        <strong
                          style={{
                            fontSize: 13.5,
                            color: isMinh ? MINH_THEME.nameColor : masterTheme.nameColor,
                            fontFamily: "'Noto Serif', serif",
                          }}
                        >
                          {m.senderName}
                        </strong>

                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: isMinh ? MINH_THEME.badgeBg : masterTheme.badgeBg,
                            color: isMinh ? MINH_THEME.badgeTextColor : masterTheme.badgeTextColor,
                            fontWeight: 700,
                          }}
                        >
                          {m.senderTitle}
                        </span>

                        {isSpeakingThisMsg && (
                          <span
                            style={{
                              fontSize: 9.5,
                              padding: '1px 7px',
                              borderRadius: 10,
                              background: 'rgba(34, 197, 94, 0.25)',
                              color: '#4ade80',
                              fontWeight: 700,
                              border: '1px solid #22c55e',
                            }}
                          >
                            🔊 Đang đọc
                          </span>
                        )}

                        {m.topic && (
                          <span
                            style={{
                              fontSize: 10,
                              padding: '2px 8px',
                              borderRadius: 10,
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: '#cbd5e1',
                            }}
                          >
                            🏷️ {m.topic}
                          </span>
                        )}

                        <span style={{ fontSize: 11, marginLeft: 'auto', color: 'rgba(255, 255, 255, 0.55)' }}>
                          {m.timestamp}
                        </span>
                      </div>

                      <RenderMessageContent content={m.content} theme={masterTheme} isMinh={isMinh} />

                      {/* Single Message Audio Button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <SingleMessageAudioButton
                          messageId={m.id}
                          agentSlug={isMinh ? 'khach-minh-1986' : (m.masterSlug || 'thay-minh-triet')}
                          senderName={m.senderName}
                          text={m.content}
                          isPlaying={isSpeakingThisMsg}
                          onPlay={() => {
                            audioEngine.playSingleMessage({
                              id: m.id,
                              agentSlug: isMinh ? 'khach-minh-1986' : (m.masterSlug || 'thay-minh-triet'),
                              senderName: m.senderName,
                              text: m.content,
                            });
                          }}
                          onStop={audioEngine.stopAllSpeech}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {typingSpeaker && (
              <div
                style={{
                  alignSelf: typingSpeaker === 'minh' ? 'flex-start' : 'flex-end',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 18px',
                  borderRadius: 24,
                  background: typingSpeaker === 'minh' ? MINH_THEME.gradientBg : upcomingTheme.gradientBg,
                  border: typingSpeaker === 'minh' ? `1.5px solid ${MINH_THEME.borderColor}` : `1.5px solid ${upcomingTheme.borderColor}`,
                  boxShadow: typingSpeaker === 'minh' ? `0 4px 14px ${MINH_THEME.glowColor}` : `0 6px 18px ${upcomingTheme.glowColor}`,
                  fontSize: 12.5,
                  color: '#f8fafc',
                  fontStyle: 'italic',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#1d1729',
                    border: `1.5px solid ${typingSpeaker === 'minh' ? '#38bdf8' : upcomingTheme.avatarRing}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={typingSpeaker === 'minh' ? '/icons/avatar-minh.svg' : upcomingMaster.avatarUrl}
                    alt="Speaker"
                    style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                  />
                </div>

                <span>
                  {typingSpeaker === 'minh'
                    ? 'Minh đang suy ngẫm câu hỏi tiếp theo...'
                    : `🔮 ${upcomingMaster.name} (${upcomingTheme.shortTag}) đang bấm độn chiêm nghiệm luận giải...`}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Intervention Form (Simulation Mode) */}
          <form
            onSubmit={handleSendAdminIntervene}
            style={{
              background: 'var(--card)',
              borderRadius: 14,
              border: '1px solid var(--line)',
              padding: 14,
              display: 'flex',
              gap: 10,
            }}
          >
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Nhập câu hỏi hoặc chỉ đạo can thiệp từ Admin (ví dụ: 'Hỏi Thầy Tâm An về thời điểm kết hôn')..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!customPrompt.trim()}
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                border: 0,
                background: customPrompt.trim() ? 'var(--red)' : 'var(--line)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: customPrompt.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Gửi Can Thiệp 🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function resolveThemeForMessage(m: DialogueMessage): MasterThemeConfig {
  if (m.masterSlug && MASTER_THEMES[m.masterSlug]) {
    return MASTER_THEMES[m.masterSlug];
  }
  const fallback = resolveMasterForTopic({ topicKey: m.topicKey, questionText: m.content });
  return MASTER_THEMES[fallback.slug] || DEFAULT_MASTER_THEME;
}
