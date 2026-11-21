'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  type DialogueMessage,
  MASTER_THEMES,
  resolveMasterForTopic,
  DEFAULT_MASTER_THEME,
  MINH_THEME,
} from '@/lib/ai/dialogue-simulation';
import { BAT_DAI_DANH_SU } from '@/lib/ai/agent-persona';
import type { AudioQueueItem, useCouncilAudioEngine } from '@/hooks/useCouncilAudioEngine';
import { AudioControlHeader } from '@/components/audio/AudioControlHeader';
import { VoiceWaveformAvatar } from '@/components/audio/VoiceWaveformAvatar';
import { SingleMessageAudioButton } from '@/components/audio/SingleMessageAudioButton';
import { getAgentVoiceProfile } from '@/config/agents-voice';
import { RenderMessageContent, resolveThemeForMessage } from './HienThiTinNhan';

type AudioEngine = ReturnType<typeof useCouncilAudioEngine>;

export default function GiaLapToaDam({
  tenQuanTri,
  audioEngine,
}: {
  tenQuanTri: string;
  audioEngine: AudioEngine;
}) {
  const [simMessages, setSimMessages] = useState<DialogueMessage[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(5000);
  const [typingSpeaker, setTypingSpeaker] = useState<'minh' | 'thay_boi' | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [simError, setSimError] = useState<string>('');

  const isRunningRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const simMessagesRef = useRef<DialogueMessage[]>([]);
  const speedMsRef = useRef<number>(speedMs);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    speedMsRef.current = speedMs;
  }, [speedMs]);

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

  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      isProcessingRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const executeTurn = async () => {
    if (!isRunningRef.current || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setSimError('');

    try {
      const curMsgs = simMessagesRef.current;
      const lastMsg = curMsgs.length > 0 ? curMsgs[curMsgs.length - 1] : null;

      let nextSpeaker: 'minh' | 'thay_boi' = 'minh';
      if (lastMsg && lastMsg.sender !== 'minh' && lastMsg.sender !== 'admin') {
        nextSpeaker = 'minh';
      } else if (lastMsg) {
        nextSpeaker = 'thay_boi';
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

      if (!data.ok) {
        setSimError(data.error || 'Không lấy được lượt đối thoại tiếp theo.');
      } else if (data.message && isRunningRef.current) {
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

        if (audioEngine.isAutoSpeakEnabled) {
          audioEngine.enqueueSpeech({
            id: incoming.id,
            agentSlug: incoming.sender === 'minh' ? 'khach-minh-1986' : (incoming.masterSlug || 'thay-minh-triet'),
            senderName: incoming.senderName,
            text: incoming.content,
          });
        }
      }
    } catch {
      setSimError('Lỗi kết nối khi mô phỏng đối thoại.');
    } finally {
      setTypingSpeaker(null);
      isProcessingRef.current = false;

      if (isRunningRef.current) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setTimeout(() => {
          if (isRunningRef.current) executeTurn();
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
      senderName: tenQuanTri,
      senderTitle: 'Can thiệp trực tiếp',
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
        if (isRunningRef.current) executeTurn();
      }, 600);
    }
  };

  const exportConversationTxt = () => {
    if (simMessages.length === 0) return;
    const lines = [
      '=================================================================',
      'BIÊN BẢN TỌA ĐÀM MÔ PHỎNG — XEMBOI.VN',
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
        senderTag += `${(m.senderName || tenQuanTri).toUpperCase()} (${m.timestamp})`;
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
    a.download = `BienBan_MoPhong_${new Date().toISOString().slice(0, 10)}.txt`;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {simError && (
        <div className="qt-bao loi" role="alert">
          {simError}
        </div>
      )}

      <div
        style={{
          background: 'linear-gradient(135deg, #130a1e 0%, #1f1130 50%, #12091c 100%)',
          borderRadius: 14,
          border: '1.5px solid #eab308',
          padding: '18px 20px',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 15, fontWeight: 700, color: '#fde047' }}>
            Phòng giả lập tọa đàm — Đương số Minh (1986 Bính Dần)
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              background: isRunning ? 'rgba(22, 163, 74, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: isRunning ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.2)',
              color: isRunning ? '#4ade80' : '#cbd5e1',
            }}
          >
            {isRunning
              ? `ĐANG ĐỐI THOẠI (${simMessages.length} lượt)`
              : simMessages.length > 0
                ? `TẠM DỪNG (${simMessages.length} lượt)`
                : 'SẴN SÀNG'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(145deg, #0b1329 0%, #172554 100%)',
              borderRadius: 12,
              border: '1.5px solid #38bdf8',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#0f172a',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/avatar-minh.svg" alt="Minh" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontSize: 14, color: '#38bdf8' }}>Minh (1986 Bính Dần)</strong>
              <div style={{ fontSize: 11.5, color: '#cbd5e1', marginTop: 2 }}>Nam · 02h00 14/12/1986</div>
              <div style={{ fontSize: 10.5, color: '#fde047', marginTop: 2 }}>Lô Trung Hỏa · Mộc Tam Cục</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))', gap: 8 }}>
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
                      ? 'rgba(34, 197, 94, 0.25)'
                      : isActive
                        ? theme.gradientBg
                        : 'rgba(255, 255, 255, 0.04)',
                    borderRadius: 10,
                    border: isSpeakingNow
                      ? '2px solid #22c55e'
                      : isActive
                        ? `1.5px solid ${theme.borderColor}`
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 4,
                  }}
                >
                  <VoiceWaveformAvatar
                    avatarUrl={master.avatarUrl}
                    name={master.name}
                    ringColor={isSpeakingNow ? '#22c55e' : theme.avatarRing}
                    isSpeaking={isSpeakingNow}
                    amplitude={audioEngine.audioAmplitude}
                    size={32}
                  />
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: isSpeakingNow ? '#4ade80' : isActive ? theme.nameColor : '#e2e8f0' }}>
                    {master.shortLabel || master.name.replace('Thầy ', '').replace('Cô ', '')}
                  </div>
                  <div style={{ fontSize: 9.5, color: '#94a3b8' }}>
                    {isSpeakingNow ? 'Đang luận' : count > 0 ? `${count} lượt` : 'Túc trực'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}>
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
            audioEngine.activeSpeakingSlug ? getAgentVoiceProfile(audioEngine.activeSpeakingSlug).name : undefined
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

      <div className="qt-the" style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isRunning ? (
            <button type="button" className="qt-nut" onClick={startSimulation}>
              {simMessages.length === 0 ? 'Bắt đầu đối thoại' : 'Tiếp tục đối thoại'}
            </button>
          ) : (
            <button type="button" className="qt-nut" onClick={stopSimulation}>
              Dừng đối thoại
            </button>
          )}
          <button type="button" className="qt-nut phu" onClick={resetSimulation}>
            Bắt đầu lại
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>Tốc độ:</span>
            <select className="qt-o" value={speedMs} onChange={(e) => setSpeedMs(Number(e.target.value))}>
              <option value={3000}>Nhanh (3 giây)</option>
              <option value={5000}>Vừa vặn (5 giây)</option>
              <option value={10000}>Thong thả (10 giây)</option>
            </select>
          </label>
          <button type="button" className="qt-nut phu" onClick={exportConversationTxt} disabled={simMessages.length === 0}>
            Xuất biên bản (.txt)
          </button>
        </div>
      </div>

      <div
        style={{
          background: '#0d0a14',
          borderRadius: 12,
          border: '1px solid var(--line)',
          padding: '20px 18px',
          minHeight: 420,
          maxHeight: 680,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {simMessages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8', padding: '32px 16px', maxWidth: 480 }}>
            <h3 style={{ fontSize: 16, color: '#fde047', margin: '0 0 8px', fontFamily: "'Noto Serif', serif" }}>
              Phòng tọa đàm mô phỏng đang chờ bắt đầu
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Bấm nút <b>Bắt đầu đối thoại</b> ở trên để chạy mô phỏng giữa đương số Minh và các trợ lý.
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
                  borderRadius: 12,
                  border: '1.5px solid #ef4444',
                  padding: '12px 16px',
                  color: '#fff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <strong style={{ fontSize: 13, color: '#fca5a5' }}>{m.senderName || tenQuanTri}</strong>
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
                gap: 12,
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
                size={40}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    borderRadius: 14,
                    background: isMinh ? MINH_THEME.gradientBg : masterTheme.gradientBg,
                    border: isSpeakingThisMsg
                      ? '2px solid #22c55e'
                      : `1.5px solid ${isMinh ? MINH_THEME.borderColor : masterTheme.borderColor}`,
                    padding: '12px 16px',
                    color: '#f8fafc',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                      paddingBottom: 6,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong style={{ fontSize: 13.5, color: isMinh ? MINH_THEME.nameColor : masterTheme.nameColor, fontFamily: "'Noto Serif', serif" }}>
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
                    {m.topic && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' }}>
                        {m.topic}
                      </span>
                    )}
                    <span style={{ fontSize: 11, marginLeft: 'auto', color: 'rgba(255, 255, 255, 0.55)' }}>{m.timestamp}</span>
                  </div>

                  <RenderMessageContent content={m.content} theme={masterTheme} isMinh={isMinh} />

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
              padding: '8px 14px',
              borderRadius: 20,
              background: typingSpeaker === 'minh' ? MINH_THEME.gradientBg : upcomingTheme.gradientBg,
              border: `1px solid ${typingSpeaker === 'minh' ? MINH_THEME.borderColor : upcomingTheme.borderColor}`,
              fontSize: 12.5,
              color: '#f8fafc',
              fontStyle: 'italic',
            }}
          >
            {typingSpeaker === 'minh'
              ? 'Minh đang chuẩn bị câu hỏi tiếp theo…'
              : `${upcomingMaster.name} đang soạn luận giải…`}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendAdminIntervene} className="qt-loc" style={{ marginBottom: 0 }}>
        <input
          type="text"
          className="qt-o"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Nhập câu hỏi hoặc chỉ đạo can thiệp trực tiếp…"
          style={{ flex: 1, minWidth: 240 }}
        />
        <button type="submit" className="qt-nut" disabled={!customPrompt.trim()}>
          Gửi can thiệp
        </button>
      </form>
    </div>
  );
}
