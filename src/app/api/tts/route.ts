import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import {
  getAgentVoiceProfile,
  cleanTextForTTS,
  detectGenderFromContext,
  AGENTS_VOICE_CONFIG,
  BGM_TRACKS,
  SFX_TRACKS,
} from '@/config/agents-voice';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const gender = searchParams.get('gender');
  const customerName = searchParams.get('name');

  if (slug) {
    const profile = getAgentVoiceProfile(slug, { gender, customerName });
    return NextResponse.json({ ok: true, profile });
  }

  return NextResponse.json({
    ok: true,
    agentsVoice: AGENTS_VOICE_CONFIG,
    bgmTracks: BGM_TRACKS,
    sfxTracks: SFX_TRACKS,
  });
}

// ---------------------------------------------------------------------------
// 1. TỔNG HỢP GIỌNG ĐỌC NEURAL EDGE TTS (vi-VN-NamMinhNeural / vi-VN-HoaiMyNeural)
// ---------------------------------------------------------------------------
async function synthesizeNeuralEdgeTTS(
  voiceName: string,
  text: string,
  pitch = '+0Hz',
  rate = '+0%'
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    let timer: NodeJS.Timeout | null = null;
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(text, { pitch, rate });
      const chunks: Buffer[] = [];

      timer = setTimeout(() => {
        reject(new Error('Edge TTS request timeout (15s)'));
      }, 15000);

      audioStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      audioStream.on('end', () => {
        if (timer) clearTimeout(timer);
        const fullBuf = Buffer.concat(chunks);
        if (fullBuf.length === 0) {
          reject(new Error('Edge TTS returned empty audio buffer'));
        } else {
          resolve(fullBuf);
        }
      });

      audioStream.on('error', (err: any) => {
        if (timer) clearTimeout(timer);
        reject(err);
      });
    } catch (err) {
      if (timer) clearTimeout(timer);
      reject(err);
    }
  });
}

// ---------------------------------------------------------------------------
// 2. FALLBACK DỰ PHÒNG: GOOGLE TRANSLATE TTS TIẾNG VIỆT
// ---------------------------------------------------------------------------
async function synthesizeVietnameseMp3(text: string): Promise<Buffer> {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?,;:\n])\s+/);
  let current = '';

  for (const s of sentences) {
    if (!s.trim()) continue;
    if ((current + ' ' + s).length <= 180) {
      current = current ? current + ' ' + s : s;
    } else {
      if (current) chunks.push(current);
      if (s.length <= 180) {
        current = s;
      } else {
        const words = s.split(' ');
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).length <= 180) {
            sub = sub ? sub + ' ' + w : w;
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      }
    }
  }
  if (current) chunks.push(current);

  const buffers: Buffer[] = [];
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=vi&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) {
      throw new Error(`Google TTS chunk fetch failed with status ${res.status}`);
    }
    const arrayBuf = await res.arrayBuffer();
    buffers.push(Buffer.from(arrayBuf));
  }

  return Buffer.concat(buffers);
}

// ---------------------------------------------------------------------------
// 3. POST /api/tts - XỬ LÝ YÊU CẦU GIỌNG ĐỌC CHUẨN GIỚI TÍNH
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      text,
      agentSlug = 'thay-minh-triet',
      gender,
      customerGender,
      customerName,
      chartSummary,
      messageId,
    } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Thiếu nội dung văn bản (text is required)' },
        { status: 400 }
      );
    }

    // 1. Tiền xử lý văn bản: Loại bỏ markdown, mở rộng thuật ngữ Tử Vi (M, V, Đ, H)
    const cleanedText = cleanTextForTTS(text);

    // 2. Xác định chính xác hồ sơ giọng đọc theo Giới Tính của Khách Hàng hoặc Thầy
    const effectiveGender = gender || customerGender;
    const profile = getAgentVoiceProfile(agentSlug, {
      gender: effectiveGender,
      customerName,
      chartSummary,
    });

    // 3. Tạo khóa Cache độc nhất dựa trên Giới tính, Voice ID, Pitch, Rate và nội dung
    const hash = crypto
      .createHash('md5')
      .update(
        `${profile.gender}_${profile.edgeVoice}_${profile.edgePitch}_${profile.edgeRate}_${cleanedText}`
      )
      .digest('hex');

    const cacheDir = path.resolve('public/audio/cache');
    fs.mkdirSync(cacheDir, { recursive: true });

    const cacheFileName = `tts_${profile.gender}_${hash}.mp3`;
    const cacheFilePath = path.join(cacheDir, cacheFileName);
    const publicAudioUrl = `/audio/cache/${cacheFileName}`;

    // 4. Ước tính thời lượng nói (Tiếng Việt trung bình ~3.6 từ/giây ở tốc độ gốc, tăng 20% lên ~4.3 từ/giây)
    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
    const baseWps = 4.3 * (profile.voiceSpeed || 1.15);
    const estimatedDuration = Math.max(1.2, parseFloat((wordCount / baseWps).toFixed(2)));

    // 5. Kiểm tra Cache đã tồn tại chưa
    if (fs.existsSync(cacheFilePath) && fs.statSync(cacheFilePath).size > 1000) {
      if (messageId) {
        try {
          await prisma.chatMessage.update({
            where: { id: messageId },
            data: { audioUrl: publicAudioUrl, audioDuration: estimatedDuration },
          });
        } catch {}
      }

      return NextResponse.json({
        ok: true,
        fromCache: true,
        audioUrl: publicAudioUrl,
        duration: estimatedDuration,
        cleanedText,
        voiceProfile: profile,
      });
    }

    // 6. TIÊU CHUẨN 1: TỔNG HỢP QUA EDGE NEURAL TTS (ĐÚNG GIỚI TÍNH & BẢN SẮC)
    // - Nam (7 Thầy Nam + Khách Nam): vi-VN-NamMinhNeural
    // - Nữ (Cô Linh Đan + Khách Nữ): vi-VN-HoaiMyNeural
    try {
      const voiceToUse = profile.edgeVoice || (profile.gender === 'female' ? 'vi-VN-HoaiMyNeural' : 'vi-VN-NamMinhNeural');
      const edgeBuf = await synthesizeNeuralEdgeTTS(
        voiceToUse,
        cleanedText,
        profile.edgePitch || '+0Hz',
        profile.edgeRate || '+0%'
      );

      fs.writeFileSync(cacheFilePath, edgeBuf);

      if (messageId) {
        try {
          await prisma.chatMessage.update({
            where: { id: messageId },
            data: { audioUrl: publicAudioUrl, audioDuration: estimatedDuration },
          });
        } catch {}
      }

      return NextResponse.json({
        ok: true,
        fromCache: false,
        provider: 'edge_neural',
        audioUrl: publicAudioUrl,
        duration: estimatedDuration,
        cleanedText,
        voiceProfile: profile,
      });
    } catch (edgeErr: any) {
      console.warn('Edge Neural TTS thất bại, chuyển sang phương thức dự phòng:', edgeErr?.message);
    }

    // 7. TIÊU CHUẨN 2 (DỰ PHÒNG 1): OPENAI TTS NẾU CÓ CẤU HÌNH API KEY
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const openaiVoice =
          profile.gender === 'female'
            ? 'nova'
            : agentSlug === 'thay-minh-triet'
            ? 'onyx'
            : agentSlug === 'thay-thai-son'
            ? 'fable'
            : agentSlug === 'thay-tam-an'
            ? 'echo'
            : 'alloy';

        const openAiRes = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: cleanedText,
            voice: openaiVoice,
            speed: profile.voiceSpeed,
          }),
        });

        if (openAiRes.ok) {
          const arrayBuffer = await openAiRes.arrayBuffer();
          fs.writeFileSync(cacheFilePath, Buffer.from(arrayBuffer));

          if (messageId) {
            try {
              await prisma.chatMessage.update({
                where: { id: messageId },
                data: { audioUrl: publicAudioUrl, audioDuration: estimatedDuration },
              });
            } catch {}
          }

          return NextResponse.json({
            ok: true,
            fromCache: false,
            provider: 'openai_tts',
            audioUrl: publicAudioUrl,
            duration: estimatedDuration,
            cleanedText,
            voiceProfile: profile,
          });
        }
      } catch (openAiErr: any) {
        console.warn('OpenAI TTS thất bại:', openAiErr?.message);
      }
    }

    // 8. TIÊU CHUẨN 3 (DỰ PHÒNG 2): GOOGLE TRANSLATE NATIVE VIETNAMESE TTS
    try {
      const mp3Buffer = await synthesizeVietnameseMp3(cleanedText);
      fs.writeFileSync(cacheFilePath, mp3Buffer);

      if (messageId) {
        try {
          await prisma.chatMessage.update({
            where: { id: messageId },
            data: { audioUrl: publicAudioUrl, audioDuration: estimatedDuration },
          });
        } catch {}
      }

      return NextResponse.json({
        ok: true,
        fromCache: false,
        provider: 'google_translate_tts',
        audioUrl: publicAudioUrl,
        duration: estimatedDuration,
        cleanedText,
        voiceProfile: profile,
      });
    } catch (synthErr: any) {
      console.warn('Lỗi synthesizeVietnameseMp3:', synthErr?.message);
    }

    // 9. FALLBACK CUỐI CÙNG: TRẢ VỀ METADATA CHO BROWSER WEB SPEECH
    if (messageId) {
      try {
        await prisma.chatMessage.update({
          where: { id: messageId },
          data: { audioDuration: estimatedDuration },
        });
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      fromCache: false,
      audioUrl: null,
      duration: estimatedDuration,
      cleanedText,
      voiceProfile: profile,
    });
  } catch (err: any) {
    console.error('Lỗi API /api/tts:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Lỗi xử lý âm thanh' },
      { status: 500 }
    );
  }
}
