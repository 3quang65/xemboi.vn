'use client';

import React from 'react';

interface VoiceWaveformAvatarProps {
  avatarUrl: string;
  name: string;
  ringColor?: string;
  isSpeaking: boolean;
  amplitude?: number; // 0 to 1
  size?: number;
}

export function VoiceWaveformAvatar({
  avatarUrl,
  name,
  ringColor = '#eab308',
  isSpeaking,
  amplitude = 0,
  size = 40,
}: VoiceWaveformAvatarProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* Waveform Ring (CSS GPU-accelerated smooth pulse) */}
      {isSpeaking && (
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: `2px solid ${ringColor}`,
            animation: 'avatarPulse 1.6s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Avatar Image */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `2px solid ${isSpeaking ? ringColor : 'rgba(255,255,255,0.2)'}`,
          overflow: 'hidden',
          background: '#1e1b4b',
          boxShadow: isSpeaking ? `0 0 14px ${ringColor}` : '0 2px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease',
          zIndex: 2,
        }}
      >
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Speaking Indicator Dot */}
      {isSpeaking && (
        <span
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #0f172a',
            zIndex: 3,
            boxShadow: '0 0 6px #22c55e',
          }}
        />
      )}
    </div>
  );
}
