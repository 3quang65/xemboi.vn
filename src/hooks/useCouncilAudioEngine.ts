'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AgentVoiceProfile,
  BgmTrackConfig,
  BGM_TRACKS,
  SFX_TRACKS,
  getAgentVoiceProfile,
  cleanTextForTTS,
} from '@/config/agents-voice';

export interface AudioQueueItem {
  id: string;
  agentSlug: string;
  senderName: string;
  text: string;
  gender?: 'male' | 'female';
  audioUrl?: string | null;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useCouncilAudioEngine() {
  // BGM State
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<BgmTrackConfig>(BGM_TRACKS[0]);
  const [bgmVolume, setBgmVolume] = useState<number>(0.25);

  // Voice & TTS State
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState<boolean>(false);
  const [activeSpeakingSlug, setActiveSpeakingSlug] = useState<string | null>(null);
  const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState<string | null>(null);
  const [isPodcastMode, setIsPodcastMode] = useState<boolean>(false);
  const [audioAmplitude, setAudioAmplitude] = useState<number>(0);

  // Audio References
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const sfxAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const duckingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Queue Reference
  const queueRef = useRef<AudioQueueItem[]>([]);
  const isProcessingQueueRef = useRef<boolean>(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // -------------------------------------------------------------
  // 1. INITIALIZE AUDIO OBJECTS
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Background Music Audio Element
    const bgm = new Audio(selectedBgmTrack.url);
    bgm.loop = true;
    bgm.volume = bgmVolume;
    bgmAudioRef.current = bgm;

    // SFX Audio Element
    const sfx = new Audio();
    sfxAudioRef.current = sfx;

    // Voice Audio Element
    const voice = new Audio();
    voiceAudioRef.current = voice;

    // UNLOCK HTML5 AUDIO CONTEXT ON FIRST USER INTERACTION (Avoids Chrome Autoplay Policy Blocks)
    const unlockAudio = () => {
      try {
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        silentAudio.volume = 0.01;
        silentAudio.play().catch(() => {});
      } catch {}
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      bgm.pause();
      sfx.pause();
      voice.pause();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Update BGM source when track changes
  useEffect(() => {
    if (!bgmAudioRef.current) return;
    const wasPlaying = !bgmAudioRef.current.paused;
    bgmAudioRef.current.src = selectedBgmTrack.url;
    bgmAudioRef.current.volume = bgmVolume;
    if (wasPlaying || isBgmPlaying) {
      bgmAudioRef.current.play().catch(() => {});
    }
  }, [selectedBgmTrack]);

  // -------------------------------------------------------------
  // 2. AUDIO DUCKING (Smooth volume transition between 0.25 and 0.08)
  // -------------------------------------------------------------
  const smoothDuckBgm = useCallback((targetVolume: number, durationMs = 400) => {
    if (!bgmAudioRef.current) return;
    if (duckingIntervalRef.current) clearInterval(duckingIntervalRef.current);

    const startVol = bgmAudioRef.current.volume;
    const stepCount = 15;
    const stepTime = durationMs / stepCount;
    const delta = (targetVolume - startVol) / stepCount;
    let step = 0;

    duckingIntervalRef.current = setInterval(() => {
      step++;
      if (!bgmAudioRef.current) return;
      const newVol = Math.max(0, Math.min(1, startVol + delta * step));
      bgmAudioRef.current.volume = newVol;

      if (step >= stepCount) {
        if (duckingIntervalRef.current) clearInterval(duckingIntervalRef.current);
        if (bgmAudioRef.current) bgmAudioRef.current.volume = targetVolume;
      }
    }, stepTime);
  }, []);

  // -------------------------------------------------------------
  // 3. PLAY SFX (Chime, Scroll, Coin Toss)
  // -------------------------------------------------------------
  const playSfx = useCallback((sfxKey: 'CHIME' | 'SCROLL' | 'COIN_TOSS') => {
    const sfxConfig = SFX_TRACKS[sfxKey];
    if (!sfxConfig) return;
    try {
      const sfx = new Audio(sfxConfig.url);
      sfx.volume = sfxConfig.volume;
      sfx.play().catch(() => {});
    } catch {}
  }, []);

  // -------------------------------------------------------------
  // 4. BGM CONTROLS
  // -------------------------------------------------------------
  const toggleBgm = useCallback(() => {
    if (!bgmAudioRef.current) return;
    if (isBgmPlaying) {
      bgmAudioRef.current.pause();
      setIsBgmPlaying(false);
    } else {
      bgmAudioRef.current.play().then(() => {
        setIsBgmPlaying(true);
      }).catch((e) => {
        console.warn('Audio play restricted by browser autoplay policy:', e);
      });
    }
  }, [isBgmPlaying]);

  const changeBgmTrack = useCallback((track: BgmTrackConfig) => {
    setSelectedBgmTrack(track);
  }, []);

  const changeBgmVolume = useCallback((vol: number) => {
    setBgmVolume(vol);
    if (bgmAudioRef.current && !activeSpeakingSlug) {
      bgmAudioRef.current.volume = vol;
    }
  }, [activeSpeakingSlug]);

  // -------------------------------------------------------------
  // 5. WAVEFORM SIMULATION ANIMATION (Lightweight GPU-friendly state)
  // -------------------------------------------------------------
  const startWaveformSimulation = useCallback(() => {
    setAudioAmplitude(0.75);
  }, []);

  const stopWaveformSimulation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setAudioAmplitude(0);
  }, []);

  // -------------------------------------------------------------
  // 6. PROCESS AUDIO QUEUE (Sequential Voice Queue)
  // -------------------------------------------------------------
  const processNextInQueue = useCallback(async () => {
    if (queueRef.current.length === 0) {
      isProcessingQueueRef.current = false;
      setActiveSpeakingSlug(null);
      setCurrentlyPlayingMessageId(null);
      stopWaveformSimulation();
      // Restore BGM volume to normal level
      smoothDuckBgm(bgmVolume, 600);
      return;
    }

    isProcessingQueueRef.current = true;
    const item = queueRef.current.shift()!;
    const profile = getAgentVoiceProfile(item.agentSlug, {
      gender: item.gender,
      customerName: item.senderName,
    });

    setActiveSpeakingSlug(item.agentSlug);
    setCurrentlyPlayingMessageId(item.id);
    startWaveformSimulation();

    // DUCK BGM down to 0.08 while Master is speaking
    smoothDuckBgm(0.08, 300);

    // Call item's onStart callback
    if (item.onStart) item.onStart();

    const onSpeechFinished = () => {
      if (item.onEnd) item.onEnd();

      // Play soft Zen Chime transition before next Master speaks
      if (queueRef.current.length > 0) {
        playSfx('CHIME');
      }

      // 400ms pause before starting next in queue for natural conversational pacing
      setTimeout(() => {
        processNextInQueue();
      }, 450);
    };

    // Helper: Play native MP3 audio with master-specific playback rate (+20% speed)
    const playAudioUrl = async (url: string) => {
      try {
        const audio = new Audio(url);
        audio.playbackRate = Math.min(1.4, (profile.webSpeechRate || 1.15) * 1.05);
        voiceAudioRef.current = audio;
        audio.onended = onSpeechFinished;
        audio.onerror = () => {
          speakViaWebSpeech(item, profile, onSpeechFinished);
        };
        await audio.play();
      } catch {
        speakViaWebSpeech(item, profile, onSpeechFinished);
      }
    };

    // 1. If audioUrl is present, play HTML5 Audio directly
    if (item.audioUrl) {
      await playAudioUrl(item.audioUrl);
      return;
    }

    // 2. Otherwise, fetch high-fidelity Vietnamese speech from /api/tts
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.text,
          agentSlug: item.agentSlug,
          gender: item.gender,
          customerName: item.senderName,
          messageId: item.id,
        }),
      });
      const data = await res.json();
      if (data.ok && data.audioUrl) {
        await playAudioUrl(data.audioUrl);
        return;
      }
    } catch (err) {
      console.warn('Lỗi gọi /api/tts, thử fallback Web Speech:', err);
    }

    // 3. Fallback to browser Web Speech API (with strict Vietnamese voice check)
    speakViaWebSpeech(item, profile, onSpeechFinished);
  }, [bgmVolume, smoothDuckBgm, playSfx, startWaveformSimulation, stopWaveformSimulation]);

  // Helper: Speak via Web Speech Synthesis API
  const speakViaWebSpeech = (
    item: AudioQueueItem,
    profile: AgentVoiceProfile,
    onFinished: () => void
  ) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      // Browser does not support speech synthesis
      setTimeout(onFinished, 2000);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = cleanTextForTTS(item.text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;

    // Apply Persona Voice Parameters (+20% rate)
    utterance.lang = 'vi-VN';
    utterance.rate = Math.min(1.4, (profile.webSpeechRate || 1.0) * 1.10);

    // Find best Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoices = voices.filter((v) => v.lang.startsWith('vi') || v.lang.toLowerCase().includes('viet'));
    if (viVoices.length > 0) {
      if (profile.gender === 'female') {
        const femaleVoice = viVoices.find((v) => v.name.toLowerCase().includes('hoaimy') || v.name.toLowerCase().includes('nữ') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('linh'));
        utterance.voice = femaleVoice || viVoices[0];
        utterance.pitch = profile.webSpeechPitch || 1.18;
      } else {
        const maleVoice = viVoices.find((v) => v.name.toLowerCase().includes('namminh') || v.name.toLowerCase().includes('nam') || v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('an'));
        if (maleVoice) {
          utterance.voice = maleVoice;
          utterance.pitch = profile.webSpeechPitch || 0.88;
        } else {
          // CRITICAL FIX: If Chrome on Windows only has female "Google tiếng Việt",
          // deeply pitch-shift it down to 0.52 to produce a clear, resonant male baritone voice!
          utterance.voice = viVoices[0];
          utterance.pitch = 0.52;
        }
      }
    } else {
      // CRITICAL FIX: If no Vietnamese voice is installed in the client OS,
      // DO NOT read with English voice (which pronounces Vietnamese like gibberish)!
      console.warn('Không tìm thấy giọng đọc tiếng Việt trong Web Speech của trình duyệt. Đã xử lý an toàn.');
      setTimeout(onFinished, 2000);
      return;
    }

    utterance.onend = () => {
      onFinished();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      onFinished();
    };

    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------------
  // 7. PUBLIC ACTIONS: ENQUEUE, PLAY SINGLE, STOP ALL
  // -------------------------------------------------------------
  const enqueueSpeech = useCallback(
    (item: AudioQueueItem) => {
      if (!isAutoSpeakEnabled && !isPodcastMode) return;
      queueRef.current.push(item);
      if (!isProcessingQueueRef.current) {
        processNextInQueue();
      }
    },
    [isAutoSpeakEnabled, isPodcastMode, processNextInQueue]
  );

  const playSingleMessage = useCallback(
    (item: AudioQueueItem) => {
      // Stop current speech
      stopAllSpeech();

      // Ensure BGM plays softly
      if (!isBgmPlaying && bgmAudioRef.current) {
        bgmAudioRef.current.play().then(() => setIsBgmPlaying(true)).catch(() => {});
      }

      queueRef.current = [item];
      processNextInQueue();
    },
    [isBgmPlaying, processNextInQueue]
  );

  const stopAllSpeech = useCallback(() => {
    queueRef.current = [];
    isProcessingQueueRef.current = false;
    setActiveSpeakingSlug(null);
    setCurrentlyPlayingMessageId(null);
    stopWaveformSimulation();

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }

    // Restore BGM volume
    smoothDuckBgm(bgmVolume, 300);
  }, [bgmVolume, smoothDuckBgm, stopWaveformSimulation]);

  const startPodcastPlayback = useCallback(
    (items: AudioQueueItem[]) => {
      stopAllSpeech();
      setIsPodcastMode(true);

      // Start BGM if not already playing
      if (bgmAudioRef.current && !isBgmPlaying) {
        bgmAudioRef.current.play().then(() => setIsBgmPlaying(true)).catch(() => {});
      }

      playSfx('SCROLL');
      queueRef.current = [...items];
      processNextInQueue();
    },
    [isBgmPlaying, playSfx, processNextInQueue, stopAllSpeech]
  );

  const toggleAutoSpeak = useCallback(() => {
    setIsAutoSpeakEnabled((prev) => {
      const next = !prev;
      if (!next) {
        stopAllSpeech();
      }
      return next;
    });
  }, [stopAllSpeech]);

  return {
    // BGM
    isBgmPlaying,
    selectedBgmTrack,
    bgmVolume,
    toggleBgm,
    changeBgmTrack,
    changeBgmVolume,
    availableBgmTracks: BGM_TRACKS,

    // Voice & TTS
    isAutoSpeakEnabled,
    toggleAutoSpeak,
    activeSpeakingSlug,
    currentlyPlayingMessageId,
    audioAmplitude,
    isPodcastMode,
    setIsPodcastMode,

    // Actions
    playSfx,
    enqueueSpeech,
    playSingleMessage,
    stopAllSpeech,
    startPodcastPlayback,
  };
}
