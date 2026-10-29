'use client';

import React, { useState } from 'react';
import { BgmTrackConfig, BGM_TRACKS } from '@/config/agents-voice';

interface AudioControlHeaderProps {
  isBgmPlaying: boolean;
  selectedBgmTrack: BgmTrackConfig;
  bgmVolume: number;
  toggleBgm: () => void;
  changeBgmTrack: (track: BgmTrackConfig) => void;
  changeBgmVolume: (vol: number) => void;
  isAutoSpeakEnabled: boolean;
  toggleAutoSpeak: () => void;
  activeSpeakingSlug: string | null;
  speakingMasterName?: string;
  isPodcastMode: boolean;
  onTogglePodcastMode?: () => void;
  audioAmplitude?: number;
}

export function AudioControlHeader({
  isBgmPlaying,
  selectedBgmTrack,
  bgmVolume,
  toggleBgm,
  changeBgmTrack,
  changeBgmVolume,
  isAutoSpeakEnabled,
  toggleAutoSpeak,
  activeSpeakingSlug,
  speakingMasterName,
  isPodcastMode,
  onTogglePodcastMode,
  audioAmplitude = 0,
}: AudioControlHeaderProps) {
  const [showBgmMenu, setShowBgmMenu] = useState(false);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #170d24 0%, #241038 50%, #150921 100%)',
        borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
        padding: '7px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        fontSize: 11.5,
        color: '#e2e8f0',
        zIndex: 10,
        position: 'relative',
      }}
    >
      {/* LEFT: BGM CONTROL & SELECTOR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Play/Pause BGM Button */}
        <button
          type="button"
          onClick={toggleBgm}
          title={isBgmPlaying ? 'Tạm dừng Nhạc Cổ Cầm' : 'Phát Nhạc Cổ Cầm Tĩnh Tâm'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 9px',
            borderRadius: 20,
            background: isBgmPlaying
              ? 'rgba(234, 179, 8, 0.22)'
              : 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${isBgmPlaying ? '#eab308' : 'rgba(255, 255, 255, 0.2)'}`,
            color: isBgmPlaying ? '#fde047' : '#94a3b8',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 11,
            transition: 'all 0.2s ease',
          }}
        >
          <span>{isBgmPlaying ? '🎵' : '🔇'}</span>
          <span>{isBgmPlaying ? 'Nhạc Cổ Cầm (Đang Bật)' : 'Bật Nhạc Cổ Cầm'}</span>
        </button>

        {/* BGM Track Dropdown Selector */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowBgmMenu((prev) => !prev)}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              color: '#fef08a',
              cursor: 'pointer',
              fontSize: 10.5,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{selectedBgmTrack.title}</span>
            <span style={{ fontSize: 8 }}>▼</span>
          </button>

          {showBgmMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                width: 220,
                background: '#1a102b',
                border: '1.5px solid #eab308',
                borderRadius: 8,
                padding: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                zIndex: 99,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontSize: 9.5, color: '#94a3b8', padding: '2px 6px', fontWeight: 700 }}>
                CHỌN NHẠC NỀN CỔ PHONG:
              </div>
              {BGM_TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    changeBgmTrack(t);
                    setShowBgmMenu(false);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: t.id === selectedBgmTrack.id ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
                    border: 'none',
                    color: t.id === selectedBgmTrack.id ? '#fde047' : '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: 11,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <strong style={{ fontSize: 11 }}>{t.title}</strong>
                  <span style={{ fontSize: 9.5, opacity: 0.75 }}>{t.subtitle}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Volume Slider */}
        <input
          type="range"
          min="0.05"
          max="0.5"
          step="0.02"
          value={bgmVolume}
          onChange={(e) => changeBgmVolume(parseFloat(e.target.value))}
          title={`Âm lượng nhạc nền: ${Math.round(bgmVolume * 100 * 2)}%`}
          style={{
            width: 50,
            accentColor: '#eab308',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* RIGHT: AUTO-SPEAK, PODCAST & ACTIVE SPEAKER PULSE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Real-time Speaker Amplitude Pulse */}
        {activeSpeakingSlug && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              padding: '3px 8px',
              borderRadius: 14,
              animation: 'pulse 1.5s infinite',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 12 }}>
              <div
                style={{
                  width: 2.5,
                  height: `${Math.max(4, audioAmplitude * 12)}px`,
                  background: '#22c55e',
                  borderRadius: 1,
                  transition: 'height 0.08s ease',
                }}
              />
              <div
                style={{
                  width: 2.5,
                  height: `${Math.max(3, (1 - audioAmplitude) * 11)}px`,
                  background: '#4ade80',
                  borderRadius: 1,
                  transition: 'height 0.08s ease',
                }}
              />
              <div
                style={{
                  width: 2.5,
                  height: `${Math.max(5, audioAmplitude * 13)}px`,
                  background: '#22c55e',
                  borderRadius: 1,
                  transition: 'height 0.08s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 10, color: '#86efac', fontWeight: 700 }}>
              {speakingMasterName || 'Thầy đang nói...'}
            </span>
          </div>
        )}

        {/* Auto-Speak Toggle Button */}
        <button
          type="button"
          onClick={toggleAutoSpeak}
          title={isAutoSpeakEnabled ? 'Tắt tự động đọc giọng Danh Sư' : 'Bật tự động đọc giọng Danh Sư'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 6,
            background: isAutoSpeakEnabled ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isAutoSpeakEnabled ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
            color: isAutoSpeakEnabled ? '#7dd3fc' : '#94a3b8',
            cursor: 'pointer',
            fontSize: 10.5,
            fontWeight: 700,
          }}
        >
          <span>{isAutoSpeakEnabled ? '🔊' : '🔈'}</span>
          <span>{isAutoSpeakEnabled ? 'Tự Đọc: BẬT' : 'Tự Đọc: TẮT'}</span>
        </button>

        {/* Podcast Mode Button */}
        {onTogglePodcastMode && (
          <button
            type="button"
            onClick={onTogglePodcastMode}
            title="Phát toàn bộ buổi tọa đàm từ đầu đến cuối có nhạc và giọng đọc"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 9px',
              borderRadius: 6,
              background: isPodcastMode
                ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              border: `1px solid ${isPodcastMode ? '#fca5a5' : '#fde047'}`,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 10.5,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span>{isPodcastMode ? '⏹️' : '📻'}</span>
            <span>{isPodcastMode ? 'Dừng Tọa Đàm' : 'Phát Tọa Đàm (Radio)'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
