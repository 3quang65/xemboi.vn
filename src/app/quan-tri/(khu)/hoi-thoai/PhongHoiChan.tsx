'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MASTER_THEMES, DEFAULT_MASTER_THEME } from '@/lib/ai/dialogue-simulation';
import { BAT_DAI_DANH_SU, getAgentBySlug } from '@/lib/ai/agent-persona';
import type { StoredConversation, StoredMessage } from '@/lib/ai/conversation-store';
import type { AudioQueueItem, useCouncilAudioEngine } from '@/hooks/useCouncilAudioEngine';
import { AudioControlHeader } from '@/components/audio/AudioControlHeader';
import { VoiceWaveformAvatar } from '@/components/audio/VoiceWaveformAvatar';
import { SingleMessageAudioButton } from '@/components/audio/SingleMessageAudioButton';
import { getAgentVoiceProfile, detectGenderFromContext } from '@/config/agents-voice';
import { RenderMessageContent } from './HienThiTinNhan';

export type TabHoiThoai = 'council' | 'live' | 'takeover' | 'all';
type AudioEngine = ReturnType<typeof useCouncilAudioEngine>;

export default function PhongHoiChan({
  activeTab,
  tenQuanTri,
  audioEngine,
  refreshSignal,
}: {
  activeTab: TabHoiThoai;
  tenQuanTri: string;
  audioEngine: AudioEngine;
  refreshSignal: number;
}) {
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [adminInput, setAdminInput] = useState<string>('');
  const [impersonateSlug, setImpersonateSlug] = useState<string>('');

  const liveChatEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async (tabFilter: TabHoiThoai) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/conversations?tab=${encodeURIComponent(tabFilter)}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        if (data.conversations.length > 0) {
          setSelectedConvId((prev) =>
            prev && data.conversations.some((c: StoredConversation) => c.id === prev) ? prev : data.conversations[0].id
          );
        } else {
          setSelectedConvId('');
        }
      } else {
        setErrorMsg(data.error || 'Không tải được danh sách hội thoại.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối khi tải danh sách hội thoại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations(activeTab);
  }, [activeTab, refreshSignal, fetchConversations]);

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    liveChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages?.length]);

  const postConversationAction = async (payload: Record<string, unknown>) => {
    setActionLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        await fetchConversations(activeTab);
        return true;
      }
      setErrorMsg(data.error || 'Thao tác thất bại.');
      return false;
    } catch {
      setErrorMsg('Lỗi kết nối khi gửi thao tác.');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTakeover = () => {
    if (!selectedConvId) return;
    postConversationAction({ action: 'TOGGLE_TAKEOVER', conversationId: selectedConvId });
  };

  const handleSummonAgent = (agentSlug: string) => {
    if (!selectedConvId) return;
    postConversationAction({
      action: 'SUMMON_AGENT',
      conversationId: selectedConvId,
      senderAgentSlug: agentSlug,
    });
  };

  const handleTriggerAutoCouncil = () => {
    if (!selectedConvId) return;
    postConversationAction({ action: 'TRIGGER_AUTO_COUNCIL', conversationId: selectedConvId });
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !adminInput.trim() || actionLoading) return;
    const ok = await postConversationAction({
      action: 'SEND_MESSAGE',
      conversationId: selectedConvId,
      content: adminInput.trim(),
      senderAgentSlug: impersonateSlug || undefined,
      senderName: impersonateSlug ? undefined : tenQuanTri,
    });
    if (ok) setAdminInput('');
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.customerName && c.customerName.toLowerCase().includes(q)) ||
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.chartSummary && c.chartSummary.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {errorMsg && (
        <div className="qt-bao loi" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="qt-ht-luoi">
        <div className="qt-ht-ds-khung">
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
            <input
              type="text"
              className="qt-o"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm khách hàng, lá số hoặc mã phòng…"
              style={{ width: '100%' }}
            />
          </div>

          <div className="qt-ht-ds-cuon">
            {isLoading ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                Đang tải phiên hội chẩn…
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)' }}>
                Không có phiên hội thoại nào phù hợp với bộ lọc này.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === selectedConv?.id;
                const isCouncil = c.mode === 'COUNCIL_CONSULTATION';
                const isTakeover = c.status === 'HUMAN_TAKEOVER';
                const badgeClass = isTakeover ? 'xau' : isCouncil ? 'vua' : 'tot';
                const badgeText = isTakeover ? 'TAKEOVER' : isCouncil ? 'HỘI CHẨN' : 'AI 1-1';

                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={`qt-ht-muc${isSelected ? ' chon' : ''}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <strong style={{ fontSize: 13.5, color: 'var(--ink)' }}>
                        {c.customerName || 'Đương số'}
                      </strong>
                      <span className={`qt-nhan ${badgeClass}`}>{badgeText}</span>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 6 }}>
                      {c.title || c.chartSummary || 'Chưa có thông tin'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {(c.participantSlugs || ['thay-minh-triet']).slice(0, 4).map((slug) => {
                          const ag = getAgentBySlug(slug);
                          return (
                            // eslint-disable-next-line @next/next/no-img-element
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
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                            +{c.participantSlugs.length - 4}
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {c.messages?.length || 0} tin nhắn
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {selectedConv ? (
          <div className="qt-ht-phong">
            <div
              style={{
                background: 'linear-gradient(135deg, #130a1e 0%, #1f1130 50%, #12091c 100%)',
                padding: '14px 18px',
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
                <h2 style={{ fontSize: 16, margin: 0, fontFamily: "'Noto Serif', serif", color: '#fde047' }}>
                  {selectedConv.title || `Hội thoại: ${selectedConv.customerName}`}
                </h2>
                <div style={{ fontSize: 11.5, color: '#cbd5e1', marginTop: 3 }}>
                  {selectedConv.chartSummary || 'Thông tin lá số đã nạp'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Chuyển thành Hội Chẩn Đa Sư
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
                  }}
                >
                  {selectedConv.status === 'HUMAN_TAKEOVER'
                    ? 'Trả quyền cho trợ lý AI'
                    : 'Tiếp quản chat trực tiếp (Takeover)'}
                </button>
              </div>
            </div>

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
                  Triệu tập bổ sung vị Thầy vào phòng (Summon Agent):
                </span>
                <span style={{ color: '#94a3b8' }}>Bấm tên Thầy để phát biểu bổ sung góc nhìn</span>
              </div>

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
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={agent.avatarUrl} alt={agent.name} style={{ width: 16, height: 16, borderRadius: '50%' }} />
                      <span>{agent.shortLabel || agent.name.replace('Thầy ', '').replace('Cô ', '')}</span>
                      {isParticipating && <span style={{ fontSize: 9, opacity: 0.8 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

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
                  <span style={{ color: '#fde047', fontWeight: 700 }}>Phòng tọa đàm có âm thanh</span>
                  <span style={{ color: '#cbd5e1', fontSize: 11 }}>(Nhạc cổ cầm · Giọng đọc phân lập)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (audioEngine.isPodcastMode) {
                      audioEngine.stopAllSpeech();
                      audioEngine.setIsPodcastMode(false);
                    } else {
                      const customerGender = detectGenderFromContext({
                        gender: selectedConv.customerGender,
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
                  }}
                >
                  {audioEngine.isPodcastMode ? 'Dừng phát tọa đàm' : 'Nghe toàn bộ tọa đàm'}
                </button>
              </div>
            )}

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
                    gender: selectedConv.customerGender,
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
                          color: '#fff',
                          padding: '10px 14px',
                          borderRadius: '12px 12px 12px 2px',
                          fontSize: 13,
                          lineHeight: 1.6,
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
                        <span>{m.senderName || tenQuanTri}</span>
                        <span style={{ fontSize: 9.5, background: '#dc2626', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>
                          {m.senderBadge || 'Quản trị viên'}
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
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                }

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
                        </div>
                      </div>
                      <span style={{ fontSize: 13 }}>{masterTheme.iconSymbol}</span>
                    </div>

                    <div
                      style={{
                        background: masterTheme.gradientBg,
                        border: isSpeakingThisMsg ? '2px solid #22c55e' : `1.5px solid ${masterTheme.borderColor}`,
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: 12,
                      }}
                    >
                      <RenderMessageContent content={m.content} theme={masterTheme} />

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
                  <option value="">Quản trị viên: {tenQuanTri} (Trực tiếp)</option>
                  {BAT_DAI_DANH_SU.map((ag) => (
                    <option key={ag.slug} value={ag.slug}>
                      {ag.name} (Nhập vai)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={adminInput}
                  onChange={(e) => setAdminInput(e.target.value)}
                  placeholder="Nhập nội dung phản hồi trực tiếp vào phòng hội chẩn…"
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
                  className="qt-nut"
                  disabled={actionLoading || !adminInput.trim()}
                >
                  {actionLoading ? 'Đang gửi…' : 'Gửi phản hồi'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="qt-the" style={{ textAlign: 'center', color: 'var(--muted)', padding: 36 }}>
            Chọn một phiên hội thoại ở danh sách bên trái để mở bảng điều khiển.
          </div>
        )}
      </div>
    </>
  );
}
