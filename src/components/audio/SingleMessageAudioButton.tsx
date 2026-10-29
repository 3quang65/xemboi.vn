'use client';

import React from 'react';

interface SingleMessageAudioButtonProps {
  messageId: string;
  agentSlug: string;
  senderName: string;
  text: string;
  audioUrl?: string | null;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export function SingleMessageAudioButton({
  messageId,
  agentSlug,
  senderName,
  text,
  audioUrl,
  isPlaying,
  onPlay,
  onStop,
}: SingleMessageAudioButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (isPlaying) {
          onStop();
        } else {
          onPlay();
        }
      }}
      title={isPlaying ? 'Dừng đọc câu này' : `Nghe giọng đọc của ${senderName}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 7px',
        borderRadius: 12,
        background: isPlaying ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.08)',
        border: `1px solid ${isPlaying ? '#22c55e' : 'rgba(255, 255, 255, 0.18)'}`,
        color: isPlaying ? '#86efac' : '#cbd5e1',
        fontSize: 10,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        marginTop: 6,
      }}
    >
      <span>{isPlaying ? '⏹️' : '🔈'}</span>
      <span>{isPlaying ? 'Đang đọc...' : 'Nghe giọng Thầy'}</span>
    </button>
  );
}
