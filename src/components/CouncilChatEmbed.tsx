'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  BAT_DAI_DANH_SU,
  getAgentBySlug,
  AiAgentConfig,
} from '@/lib/ai/agent-persona';
import {
  MASTER_THEMES,
  DEFAULT_MASTER_THEME,
  MasterThemeConfig,
} from '@/lib/ai/dialogue-simulation';
import { useCouncilAudioEngine } from '@/hooks/useCouncilAudioEngine';
import { VoiceWaveformAvatar } from '@/components/audio/VoiceWaveformAvatar';
import { SingleMessageAudioButton } from '@/components/audio/SingleMessageAudioButton';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  senderAgentSlug?: string;
  senderName?: string;
  senderAvatar?: string;
  senderBadge?: string;
}

// ==========================================
// TYPOGRAPHY & MARKDOWN RENDERING HELPERS
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
                color: 'var(--council-bold, #ffd700)',
                fontWeight: 700,
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
    <div style={{ overflowX: 'auto', margin: '10px 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 13,
          border: '1px solid rgba(234, 179, 8, 0.3)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        <thead style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#fde047' }}>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
                  fontWeight: 600,
                }}
              >
                {h.replace(/\*\*/g, '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((r, rIdx) => {
            const cells = parseCells(r);
            return (
              <tr
                key={rIdx}
                style={{
                  background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
              >
                {cells.map((c, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
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

function RenderParagraph({ text, theme }: { text: string; theme?: MasterThemeConfig }) {
  if (!text) return null;

  if (text.startsWith('### ')) {
    return (
      <h4
        style={{
          margin: '12px 0 6px',
          fontSize: 15,
          fontFamily: "'Noto Serif', serif",
          color: theme?.nameColor || '#fde047',
          borderBottom: `1px dashed ${theme?.borderColor || 'rgba(234, 179, 8, 0.3)'}`,
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
          margin: '14px 0 8px',
          fontSize: 16,
          fontFamily: "'Noto Serif', serif",
          color: theme?.nameColor || '#fde047',
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
          margin: '10px 0',
          padding: '8px 14px',
          background: 'rgba(234, 179, 8, 0.08)',
          borderLeft: `3px solid ${theme?.borderColor || '#eab308'}`,
          borderRadius: 4,
          fontStyle: 'italic',
          color: 'var(--council-quote, #fef08a)',
        }}
      >
        <InlineFormattedText text={text.replace(/^>\s*/, '')} />
      </blockquote>
    );
  }

  if (text.startsWith('- ') || text.startsWith('* ')) {
    return (
      <li style={{ marginLeft: 18, listStyleType: 'circle', margin: '4px 0 4px 18px' }}>
        <InlineFormattedText text={text.replace(/^[-*]\s+/, '')} />
      </li>
    );
  }

  return (
    <p style={{ margin: '6px 0', lineHeight: 1.75 }}>
      <InlineFormattedText text={text} />
    </p>
  );
}

function RenderMessageContent({
  content,
  theme,
}: {
  content: string;
  theme?: MasterThemeConfig;
}) {
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
          components.push(<RenderParagraph key={`p_${idx}`} text={trimmed} theme={theme} />);
        }
      }
    });

    if (inTable && tableLines.length > 0) {
      components.push(<RenderTableBlock key="tbl_end" lines={[...tableLines]} />);
    }

    return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14.5 }}>{components}</div>;
  }

  const paragraphs = content.split('\n\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14.5 }}>
      {paragraphs.map((para, pIdx) => (
        <RenderParagraph key={pIdx} text={para.trim()} theme={theme} />
      ))}
    </div>
  );
}

// ==========================================
// MAIN COUNCIL CHAT EMBED COMPONENT
// ==========================================

export default function CouncilChatEmbed() {
  const [mounted, setMounted] = useState(false);
  const [chart, setChart] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [councilStatus, setCouncilStatus] = useState<string | null>(null);
  const [activeSpeakingSlug, setActiveSpeakingSlug] = useState<string | null>(null);
  const [councilConversationId, setCouncilConversationId] = useState<string | null>(null);
  const [councilParticipants, setCouncilParticipants] = useState<string[]>([
    'thay-minh-triet',
    'thay-thai-son',
    'thay-tam-an',
    'thay-tue-phong',
    'thay-lac-viet',
    'thay-thien-minh',
    'thay-huyen-co',
    'co-linh-dan',
  ]);
  const [councilBatchPaused, setCouncilBatchPaused] = useState<{
    batchIndex: number;
    turnCount: number;
    canContinue: boolean;
    message: string;
  } | null>(null);
  const [input, setInput] = useState('');
  const [isAutoDialogue, setIsAutoDialogue] = useState<boolean>(false);
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoNextIndexRef = useRef<number>(0);
  const chartRef = useRef<any>(null);
  const audioEngine = useCouncilAudioEngine();

  // Keep chartRef in sync
  useEffect(() => {
    chartRef.current = chart;
  }, [chart]);

  // Mount check & chart detector
  useEffect(() => {
    setMounted(true);

    const checkExistingChart = () => {
      try {
        const saved = localStorage.getItem('xb_cur_laso');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.cung || parsed.palacesData || parsed.canChi)) {
            setChart(parsed);
            chartRef.current = parsed;
          }
        }
      } catch {}
    };

    checkExistingChart();

    const handleChartGen = (e: any) => {
      if (e.detail?.chart) {
        const newChart = e.detail.chart;
        setChart(newChart);
        chartRef.current = newChart;
        setMessages([]);
        setCouncilConversationId(null);
        setCouncilBatchPaused(null);
        setInput('');
        audioEngine.stopAllSpeech();
      }
    };

    window.addEventListener('xb_chart_generated', handleChartGen);
    return () => {
      window.removeEventListener('xb_chart_generated', handleChartGen);
    };
  }, []);

  // Auto scroll as tokens stream
  useEffect(() => {
    if (chatEndRef.current && (isStreaming || messages.length > 0)) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, councilStatus, isStreaming]);

  // Trigger Council Session
  const triggerCouncilSession = async (initialQuestion?: string) => {
    const activeChart = chartRef.current || chart || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('xb_cur_laso') || '{}') : null);
    if (isStreaming || !activeChart || (!activeChart.cung && !activeChart.palacesData)) return;
    setIsStreaming(true);
    setCouncilBatchPaused(null);
    setCouncilStatus('Đang thỉnh mời Bát Đại Danh Sư an tọa vào phòng hội chẩn...');

    try {
      const res = await fetch('/api/chat/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'INIT_COUNCIL',
          chartData: activeChart,
          participantSlugs: councilParticipants,
          userQuestion: initialQuestion,
        }),
      });

      if (!res.body) {
        setIsStreaming(false);
        setCouncilStatus(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let currentMsgId: string | null = null;
      let currentMsgText = '';
      let sseBuffer = '';

      const handleEvent = (data: any) => {
        if (data.type === 'council_init' || data.type === 'conversation_ready') {
          setCouncilConversationId(data.conversationId);
          const parts = data.participantSlugs || data.participants;
          if (Array.isArray(parts)) setCouncilParticipants(parts);
        }

        if (data.type === 'status') {
          setCouncilStatus(data.message || data.status);
        }

        if (data.type === 'agent_start' || data.type === 'message_start') {
          audioEngine.playSfx('CHIME');
          setActiveSpeakingSlug(data.agentSlug);
          currentMsgText = '';
          currentMsgId = `cmsg_${data.agentSlug}_${Date.now()}`;
          const newSpeakerMsg: Message = {
            id: currentMsgId,
            role: 'assistant',
            content: '',
            senderAgentSlug: data.agentSlug,
            senderName: data.agentName,
            senderAvatar: data.senderAvatar || data.avatarUrl,
            senderBadge: data.senderBadge || data.badge,
          };
          setMessages((prev) => [...prev, newSpeakerMsg]);
        }

        if (data.type === 'token' && currentMsgId) {
          currentMsgText += data.token;
          const activeId = currentMsgId;
          const snapshotText = currentMsgText;
          setMessages((prev) =>
            prev.map((m) => (m.id === activeId ? { ...m, content: snapshotText } : m))
          );
        }

        if ((data.type === 'agent_complete' || data.type === 'message_end') && currentMsgId) {
          const activeId = currentMsgId;
          const fullText = data.content || data.fullText || currentMsgText;
          setMessages((prev) =>
            prev.map((m) => (m.id === activeId ? { ...m, content: fullText } : m))
          );
          // Tắt tự động đọc luận giải: chỉ phát khi người dùng chủ động bấm nút nghe trên tin nhắn
        }

        if (data.type === 'council_batch_paused') {
          setCouncilBatchPaused({
            batchIndex: data.batchIndex || 1,
            turnCount: data.turnCount || 3,
            canContinue: !!data.canContinue,
            message:
              data.message ||
              'Hội đồng Bát Đại Danh Sư đã hoàn tất 3 lượt đàm đạo cốt lõi.',
          });
          setActiveSpeakingSlug(null);
          setCouncilStatus(null);
          setIsStreaming(false);
        }

        if (data.type === 'council_complete') {
          setActiveSpeakingSlug(null);
          setCouncilStatus(null);
          setIsStreaming(false);
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              handleEvent(data);
            } catch {}
          }
        }
      }

      if (sseBuffer.trim().startsWith('data: ')) {
        try {
          const data = JSON.parse(sseBuffer.trim().slice(6));
          handleEvent(data);
        } catch {}
      }
    } catch (err) {
      console.error('Lỗi phiên tọa đàm:', err);
      setCouncilStatus(null);
      setIsStreaming(false);
    } finally {
      setIsStreaming(false);
    }
  };

  // Continue Council Session (Batch 2)
  const handleContinueCouncil = async () => {
    if (isStreaming || !councilConversationId) return;
    setIsStreaming(true);
    setCouncilBatchPaused(null);
    setCouncilStatus('Bát Đại Danh Sư tiếp tục đăng đàn đàm đạo chuyên sâu...');

    const activeChart = chartRef.current || chart || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('xb_cur_laso') || '{}') : null);
    try {
      const res = await fetch('/api/chat/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONTINUE_COUNCIL',
          conversationId: councilConversationId,
          chartData: activeChart,
          batchIndex: councilBatchPaused ? councilBatchPaused.batchIndex + 1 : 2,
          participantSlugs: councilParticipants,
        }),
      });

      if (!res.body) {
        setIsStreaming(false);
        setCouncilStatus(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let currentMsgId: string | null = null;
      let currentMsgText = '';
      let sseBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.type === 'status') setCouncilStatus(data.message || data.status);
              if (data.type === 'agent_start' || data.type === 'message_start') {
                audioEngine.playSfx('CHIME');
                setActiveSpeakingSlug(data.agentSlug);
                currentMsgText = '';
                currentMsgId = `cmsg_${data.agentSlug}_${Date.now()}`;
                const newSpeakerMsg: Message = {
                  id: currentMsgId,
                  role: 'assistant',
                  content: '',
                  senderAgentSlug: data.agentSlug,
                  senderName: data.agentName,
                  senderAvatar: data.senderAvatar || data.avatarUrl,
                  senderBadge: data.senderBadge || data.badge,
                };
                setMessages((prev) => [...prev, newSpeakerMsg]);
              }
              if (data.type === 'token' && currentMsgId) {
                currentMsgText += data.token;
                const activeId = currentMsgId;
                const snap = currentMsgText;
                setMessages((prev) =>
                  prev.map((m) => (m.id === activeId ? { ...m, content: snap } : m))
                );
              }
              if ((data.type === 'agent_complete' || data.type === 'message_end') && currentMsgId) {
                const activeId = currentMsgId;
                const fullText = data.content || data.fullText || currentMsgText;
                setMessages((prev) =>
                  prev.map((m) => (m.id === activeId ? { ...m, content: fullText } : m))
                );
                if (audioEngine.isAutoSpeakEnabled) {
                  audioEngine.enqueueSpeech({
                    id: activeId,
                    agentSlug: data.agentSlug || 'thay-minh-triet',
                    senderName: data.agentName || 'Thầy',
                    text: fullText,
                    gender: data.agentSlug === 'co-linh-dan' ? 'female' : 'male',
                  });
                }
              }
              if (data.type === 'council_complete' || data.type === 'followup_complete') {
                setActiveSpeakingSlug(null);
                setCouncilStatus(null);
                setIsStreaming(false);
              }
            } catch {}
          }
        }
      }
    } catch {
      setCouncilStatus(null);
      setIsStreaming(false);
    } finally {
      setIsStreaming(false);
    }
  };

  // Send User Question
  const handleSendQuestion = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isStreaming) return;
    setInput('');

    // If session hasn't started, initialize it with this question
    if (messages.length === 0) {
      triggerCouncilSession(text);
      return;
    }

    const userMsgId = 'u_' + Date.now();
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: text }]);
    setIsStreaming(true);
    setCouncilBatchPaused(null);
    setCouncilStatus('Hội đồng đang thảo luận câu hỏi của gia chủ...');

    const activeChart = chartRef.current || chart || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('xb_cur_laso') || '{}') : null);
    try {
      const res = await fetch('/api/chat/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'USER_QUESTION',
          conversationId: councilConversationId,
          chartData: activeChart,
          userQuestion: text,
          participantSlugs: councilParticipants,
        }),
      });

      if (!res.body) {
        setIsStreaming(false);
        setCouncilStatus(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let currentMsgId: string | null = null;
      let currentMsgText = '';
      let sseBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.type === 'status') setCouncilStatus(data.message || data.status);
              if (data.type === 'agent_start' || data.type === 'message_start') {
                audioEngine.playSfx('CHIME');
                setActiveSpeakingSlug(data.agentSlug);
                currentMsgText = '';
                currentMsgId = `cmsg_${data.agentSlug}_${Date.now()}`;
                const newSpeakerMsg: Message = {
                  id: currentMsgId,
                  role: 'assistant',
                  content: '',
                  senderAgentSlug: data.agentSlug,
                  senderName: data.agentName,
                  senderAvatar: data.senderAvatar || data.avatarUrl,
                  senderBadge: data.senderBadge || data.badge,
                };
                setMessages((prev) => [...prev, newSpeakerMsg]);
              }
              if (data.type === 'token' && currentMsgId) {
                currentMsgText += data.token;
                const activeId = currentMsgId;
                const snap = currentMsgText;
                setMessages((prev) =>
                  prev.map((m) => (m.id === activeId ? { ...m, content: snap } : m))
                );
              }
              if ((data.type === 'agent_complete' || data.type === 'message_end') && currentMsgId) {
                const activeId = currentMsgId;
                const fullText = data.content || data.fullText || currentMsgText;
                setMessages((prev) =>
                  prev.map((m) => (m.id === activeId ? { ...m, content: fullText } : m))
                );
                if (audioEngine.isAutoSpeakEnabled) {
                  audioEngine.enqueueSpeech({
                    id: activeId,
                    agentSlug: data.agentSlug || 'thay-minh-triet',
                    senderName: data.agentName || 'Thầy',
                    text: fullText,
                    gender: data.agentSlug === 'co-linh-dan' ? 'female' : 'male',
                  });
                }
              }
              if (data.type === 'council_complete' || data.type === 'followup_complete') {
                setActiveSpeakingSlug(null);
                setCouncilStatus(null);
                setIsStreaming(false);
              }
            } catch {}
          }
        }
      }
    } catch {
      setCouncilStatus(null);
      setIsStreaming(false);
    } finally {
      setIsStreaming(false);
    }
  };

  // Curated Topics for Continuous Auto Q&A Dialogue
  const AUTO_QA_TOPICS = [
    'Kính xin Thầy Thái Sơn soi thêm về tài vận, cơ hội làm ăn và tháng dễ thất thoát tiền bạc trong năm nay.',
    'Xin thỉnh ý Thầy Tâm An chỉ điểm về tình duyên gia đạo, làm sao để giữ hòa khí và gia tăng phước lộc.',
    'Kính nhờ Thầy Tuệ Phong chỉ dẫn phương vị phong thủy nhà đất và cách bài trí phòng làm việc trợ vượng sinh khí.',
    'Kính xin Thầy Huyền Cơ bấm quẻ Mai Hoa Dịch Số soi thời cơ quyết định việc đại sự sắp tới nên tiến hay lui.',
    'Kính nhờ Thầy Lạc Việt phân tích sâu hơn về Dụng Thần và ngũ hành bổ khuyết trong Tứ Trụ để cải vận.',
    'Xin kính thỉnh Thầy Thiên Minh chỉ dẫn các ngày hoàng đạo đại cát trong tháng tới để ký kết, giao dịch.',
    'Kính nhờ Cô Linh Đan chia sẻ phương pháp an tâm, tích âm đức tổ tiên và cách chuyển hóa giấc mơ, điềm báo.',
    'Kính xin Thầy Minh Triết đúc kết lại cốt lõi toàn cục lá số và lời khuyên tâm huyết nhất cho gia chủ.',
  ];

  // Auto Q&A Dialogue effect
  useEffect(() => {
    if (!isAutoDialogue || isStreaming) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      setAutoCountdown(null);
      return;
    }

    // 1. If session hasn't started yet and chart is present, start it
    if (messages.length === 0 && chart) {
      triggerCouncilSession();
      return;
    }

    // 2. If council batch is paused, auto-continue after 4 seconds
    if (councilBatchPaused && councilBatchPaused.canContinue) {
      let timeLeft = 4;
      setAutoCountdown(timeLeft);
      autoTimerRef.current = setInterval(() => {
        timeLeft -= 1;
        setAutoCountdown(timeLeft);
        if (timeLeft <= 0) {
          if (autoTimerRef.current) clearInterval(autoTimerRef.current);
          autoTimerRef.current = null;
          setAutoCountdown(null);
          handleContinueCouncil();
        }
      }, 1000);
      return () => {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      };
    }

    // 3. If messages exist and council has finished a consultation or Q&A turn
    if (messages.length > 0 && !councilBatchPaused) {
      let timeLeft = 5;
      setAutoCountdown(timeLeft);
      autoTimerRef.current = setInterval(() => {
        timeLeft -= 1;
        setAutoCountdown(timeLeft);
        if (timeLeft <= 0) {
          if (autoTimerRef.current) clearInterval(autoTimerRef.current);
          autoTimerRef.current = null;
          setAutoCountdown(null);
          const nextQ = AUTO_QA_TOPICS[autoNextIndexRef.current % AUTO_QA_TOPICS.length];
          autoNextIndexRef.current += 1;
          handleSendQuestion(nextQ);
        }
      }, 1000);
      return () => {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      };
    }
  }, [isAutoDialogue, isStreaming, councilBatchPaused, messages.length, chart]);

  if (!mounted) return null;

  const mountNode = document.getElementById('councilChatMount');
  if (!mountNode || !chart) return null;

  const quickPrompts = [
    '⭐ Luận tổng quan Mệnh - Thân - Cục',
    '💼 Sự nghiệp, công danh & thời cơ phát triển',
    '💰 Cung Tài Bạch & cách tích lũy tiền của',
    '❤️ Tình duyên, hôn nhân & cung Phu Thê',
    '🛡️ Năm nay có hạn gì và cách tu dưỡng hóa giải?',
  ];

  const content = (
    <section
      className="council-embed-card"
      aria-label="Phòng tọa đàm Bát Đại Danh Sư"
      style={{
        marginTop: 20,
        marginBottom: 24,
        borderRadius: 16,
        background: 'var(--council-bg, #161122)',
        border: '1.5px solid var(--gold, #eab308)',
        boxShadow: '0 10px 32px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 1. COMPACT ANCIENT HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1b1228 0%, #2b123d 50%, #150920 100%)',
          padding: '14px 18px',
          borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🏛️</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontFamily: "'Noto Serif', serif",
                  fontWeight: 700,
                  color: '#fef08a',
                  letterSpacing: 0.3,
                }}
              >
                Tọa Đàm Luận Giải Bát Đại Danh Sư
              </h3>
              <span
                style={{
                  fontSize: 10.5,
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: 'rgba(234, 179, 8, 0.2)',
                  border: '1px solid #eab308',
                  color: '#fef08a',
                  fontWeight: 600,
                }}
              >
                8 Vị Danh Sư Hội Chẩn
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>
              Đương số:{' '}
              <strong style={{ color: '#ffffff' }}>{chart.ten || 'Quý Gia Chủ'}</strong>{' '}
              {chart.canChi?.nam ? `(${chart.canChi.nam}` : ''}
              {chart.banMenh ? ` · Mạng ${chart.banMenh}` : ''}
              {chart.cuc ? ` · ${chart.cuc})` : chart.canChi?.nam ? ')' : ''}
            </div>
          </div>
        </div>

        {/* Audio & Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={audioEngine.toggleBgm}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 500,
              border: `1px solid ${audioEngine.isBgmPlaying ? '#eab308' : 'rgba(255,255,255,0.18)'}`,
              background: audioEngine.isBgmPlaying ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.05)',
              color: audioEngine.isBgmPlaying ? '#fef08a' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={audioEngine.isBgmPlaying ? 'Tắt nhạc Cổ cầm' : 'Bật nhạc Thiền Cổ cầm'}
          >
            <span>{audioEngine.isBgmPlaying ? '🎵' : '🔇'}</span>
            <span>{audioEngine.isBgmPlaying ? 'Nhạc Thiền: Bật' : 'Nhạc: Tắt'}</span>
          </button>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 500,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
            }}
            title="Bấm nút Loa ở mỗi câu để nghe giọng đọc của từng Danh Sư"
          >
            <span>🔈</span>
            <span>Nghe đọc: Bấm nút loa</span>
          </div>
        </div>
      </div>

      {/* 2. MASTERS AVATAR ROW */}
      <div
        style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 600 }}>
          HỘI ĐỒNG:
        </span>
        {BAT_DAI_DANH_SU.map((master) => {
          const isSpeaking = activeSpeakingSlug === master.slug;
          const theme = MASTER_THEMES[master.slug] || DEFAULT_MASTER_THEME;
          return (
            <div
              key={master.slug}
              title={`${master.name} – ${master.title}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                opacity: activeSpeakingSlug ? (isSpeaking ? 1 : 0.55) : 0.9,
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onClick={() => {
                if (!isStreaming) {
                  setInput(`Kính thưa ${master.name}, con muốn thỉnh ý riêng Thầy về: `);
                }
              }}
            >
              <div style={{ position: 'relative' }}>
                <VoiceWaveformAvatar
                  avatarUrl={master.avatarUrl}
                  name={master.name}
                  ringColor={theme.avatarRing || '#eab308'}
                  isSpeaking={isSpeaking}
                  amplitude={audioEngine.audioAmplitude}
                  size={36}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  whiteSpace: 'nowrap',
                  color: isSpeaking ? theme.nameColor || '#fde047' : '#cbd5e1',
                  fontWeight: isSpeaking ? 700 : 500,
                }}
              >
                {master.name.replace('Thầy ', '').replace('Cô ', '')}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. MESSAGES CONTAINER */}
      <div
        style={{
          maxHeight: 520,
          minHeight: messages.length === 0 ? 200 : 360,
          overflowY: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          background: 'rgba(10, 6, 18, 0.4)',
        }}
      >
        {/* Welcome Call-To-Action if no messages yet */}
        {messages.length === 0 && (
          <div
            style={{
              padding: '24px 20px',
              borderRadius: 12,
              background: 'linear-gradient(145deg, rgba(234, 179, 8, 0.08) 0%, rgba(30, 15, 45, 0.5) 100%)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              margin: 'auto 0',
            }}
          >
            <div style={{ fontSize: 36 }}>🔮</div>
            <h4
              style={{
                margin: 0,
                fontSize: 18,
                fontFamily: "'Noto Serif', serif",
                color: '#fef08a',
              }}
            >
              Khởi Động Phiên Tọa Đàm Luận Giải
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 13.5,
                color: '#cbd5e1',
                maxWidth: 620,
                lineHeight: 1.6,
              }}
            >
              Hội đồng Bát Đại Danh Sư đã sẵn sàng tọa đàm, phối hợp 8 lăng kính mệnh lý (Tử Vi Đẩu Số, Bát Tự Hà Lạc, Kinh Dịch, Quan Lộc, Tài Bạch & Trị Liệu Tâm Lý) để khai mở và luận đàm tường tận lá số cho đương số{' '}
              <strong style={{ color: '#fff' }}>{chart.ten || 'Quý Gia Chủ'}</strong>.
            </p>

            <button
              type="button"
              onClick={() => triggerCouncilSession()}
              disabled={isStreaming}
              style={{
                marginTop: 6,
                padding: '10px 24px',
                borderRadius: 24,
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                border: '1.5px solid #fde047',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 14.5,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(217, 119, 6, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>▶️ Bắt Đầu Tọa Đàm Luận Giải (3 Lượt Cốt Lõi)</span>
            </button>
          </div>
        )}

        {/* Message Items */}
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  margin: '4px 0',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: '14px 14px 2px 14px',
                    background: 'linear-gradient(135deg, #451a03 0%, #241203 100%)',
                    border: '1px solid #d97706',
                    color: '#fef3c7',
                    fontSize: 14,
                    lineHeight: 1.65,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ fontSize: 10.5, color: '#fde68a', fontWeight: 600, marginBottom: 3 }}>
                    GIA CHỦ THỈNH Ý:
                  </div>
                  <div>{msg.content}</div>
                </div>
              </div>
            );
          }

          const master = msg.senderAgentSlug ? getAgentBySlug(msg.senderAgentSlug) : null;
          const theme = msg.senderAgentSlug
            ? MASTER_THEMES[msg.senderAgentSlug] || DEFAULT_MASTER_THEME
            : DEFAULT_MASTER_THEME;
          const isSpeaking = activeSpeakingSlug === msg.senderAgentSlug;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                margin: '4px 0',
              }}
            >
              {/* Speaker Avatar */}
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <VoiceWaveformAvatar
                  avatarUrl={msg.senderAvatar || master?.avatarUrl || '/icons/agents/thay-minh-triet.svg'}
                  name={msg.senderName || master?.name || 'Danh Sư'}
                  ringColor={theme.avatarRing || '#eab308'}
                  isSpeaking={isSpeaking}
                  amplitude={audioEngine.audioAmplitude}
                  size={40}
                />
              </div>

              {/* Message Content Bubble */}
              <div
                style={{
                  flex: 1,
                  background: 'rgba(26, 18, 38, 0.75)',
                  border: `1px solid ${isSpeaking ? theme.borderColor || '#eab308' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '4px 16px 16px 16px',
                  padding: '12px 16px',
                  boxShadow: isSpeaking
                    ? `0 4px 20px ${theme.glowColor || 'rgba(234, 179, 8, 0.2)'}`
                    : '0 2px 10px rgba(0,0,0,0.15)',
                  transition: 'border 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Speaker Header Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 6,
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    paddingBottom: 6,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: theme.nameColor || '#fde047',
                        fontFamily: "'Noto Serif', serif",
                      }}
                    >
                      {msg.senderName || master?.name}
                    </span>
                    {msg.senderBadge && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 6,
                          background: theme.badgeBg || 'rgba(234, 179, 8, 0.15)',
                          color: theme.badgeTextColor || '#fef08a',
                          fontWeight: 500,
                        }}
                      >
                        {msg.senderBadge}
                      </span>
                    )}
                  </div>

                  <SingleMessageAudioButton
                    messageId={msg.id}
                    agentSlug={msg.senderAgentSlug || 'thay-minh-triet'}
                    senderName={msg.senderName || 'Thầy'}
                    text={msg.content}
                    isPlaying={audioEngine.currentlyPlayingMessageId === msg.id}
                    onPlay={() => {
                      const isCustomer = msg.role === 'user';
                      const isFemale = isCustomer
                        ? (chart?.gioiTinh === 'Nữ' || chart?.gioiTinh === 'nu')
                        : (msg.senderAgentSlug === 'co-linh-dan');
                      audioEngine.enqueueSpeech({
                        id: msg.id,
                        agentSlug: msg.senderAgentSlug || (isCustomer ? (isFemale ? 'khach-hang-nu' : 'khach-hang-nam') : 'thay-minh-triet'),
                        senderName: msg.senderName || (isCustomer ? (chart?.ten || 'Quý Gia Chủ') : 'Thầy'),
                        text: msg.content,
                        gender: isFemale ? 'female' : 'male',
                      });
                    }}
                    onStop={audioEngine.stopAllSpeech}
                  />
                </div>

                {/* Body Text */}
                <RenderMessageContent content={msg.content} theme={theme} />
              </div>
            </div>
          );
        })}

        {/* Live Contemplation Status */}
        {isStreaming && councilStatus && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 20,
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              fontSize: 12.5,
              color: '#fef08a',
              fontStyle: 'italic',
              width: 'fit-content',
              margin: '4px 0',
            }}
          >
            <span style={{ animation: 'spin 2s linear infinite' }}>☯️</span>
            <span>{councilStatus}</span>
          </div>
        )}

        {/* 3-Turn Paused Checkpoint */}
        {councilBatchPaused && !isStreaming && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              background: 'rgba(26, 18, 38, 0.85)',
              border: '1px solid rgba(234, 179, 8, 0.45)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              margin: '8px 0',
            }}
          >
            <div style={{ fontSize: 13.5, color: '#fef08a', fontWeight: 600 }}>
              ✨ {councilBatchPaused.message || 'Hội đồng Bát Đại Danh Sư đã hoàn tất 3 lượt luận giải đàm đạo cốt lõi.'}
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: '#cbd5e1' }}>
              Quý gia chủ có thể chọn câu hỏi gợi ý hoặc đặt câu hỏi riêng bên dưới để các Thầy đàm đạo sâu hơn.
            </p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 4. QUICK PROMPT CHIPS */}
      <div
        style={{
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.25)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            type="button"
            disabled={isStreaming}
            onClick={() => handleSendQuestion(q.replace(/^[^\s]+\s+/, ''))}
            style={{
              padding: '4px 10px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: '#e2e8f0',
              fontSize: 11.5,
              cursor: isStreaming ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* 5. MINIMALIST BOTTOM INPUT BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion();
        }}
        style={{
          padding: '10px 14px',
          background: 'linear-gradient(135deg, #1b1228 0%, #150920 100%)',
          borderTop: '1px solid rgba(234, 179, 8, 0.25)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (autoTimerRef.current) {
              clearInterval(autoTimerRef.current);
              autoTimerRef.current = null;
              setAutoCountdown(null);
            }
          }}
          placeholder="Đặt câu hỏi chi tiết về lá số để Hội đồng Danh Sư cùng đàm đạo..."
          disabled={isStreaming}
          style={{
            flex: 1,
            padding: '9px 14px',
            borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#ffffff',
            fontSize: 13.5,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          style={{
            padding: '9px 18px',
            borderRadius: 20,
            background: isStreaming
              ? 'rgba(255,255,255,0.1)'
              : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            border: '1px solid #fde047',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 13,
            cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            opacity: isStreaming || !input.trim() ? 0.6 : 1,
          }}
        >
          <span>{isStreaming ? 'Đang đàm đạo...' : 'Thỉnh ý ➔'}</span>
        </button>
      </form>
    </section>
  );

  return createPortal(content, mountNode);
}
