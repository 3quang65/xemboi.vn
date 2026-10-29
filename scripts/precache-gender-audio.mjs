import fs from 'fs';
import path from 'path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { cleanTextForTTS, AGENTS_VOICE_CONFIG } from '../src/config/agents-voice.js';

const cacheDir = path.resolve('public/audio/cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

async function synthesizeNeuralAudio(voiceName, text, pitch, rate) {
  return new Promise(async (resolve, reject) => {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(text, { pitch, rate });
      const chunks = [];
      const timer = setTimeout(() => reject(new Error('Timeout 15s')), 15000);

      audioStream.on('data', (c) => chunks.push(c));
      audioStream.on('end', () => {
        clearTimeout(timer);
        resolve(Buffer.concat(chunks));
      });
      audioStream.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Fallback Google Translate TTS if needed
async function synthesizeGoogleTTS(text) {
  const chunks = [];
  const sentences = text.split(/(?<=[.!?,;:\n])\s+/);
  let current = '';

  for (const s of sentences) {
    if (!s.trim()) continue;
    if ((current + ' ' + s).length <= 180) {
      current = current ? current + ' ' + s : s;
    } else {
      if (current) chunks.push(current);
      current = s;
    }
  }
  if (current) chunks.push(current);

  const buffers = [];
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=vi&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) throw new Error(`Google TTS error ${res.status}`);
    const ab = await res.arrayBuffer();
    buffers.push(Buffer.from(ab));
  }
  return Buffer.concat(buffers);
}

async function generateAudioItem(filename, text, voiceName, pitch, rate) {
  const filePath = path.join(cacheDir, filename);
  const cleaned = cleanTextForTTS(text);
  console.log(`\nSynthesizing: ${filename} | Voice: ${voiceName} | Pitch: ${pitch} | Rate: ${rate}`);

  try {
    const buf = await synthesizeNeuralAudio(voiceName, cleaned, pitch, rate);
    fs.writeFileSync(filePath, buf);
    console.log(` [Edge Neural TTS] Saved ${filename} (${buf.length} bytes)`);
  } catch (err) {
    console.warn(` [Fallback to Google TTS] due to: ${err.message}`);
    const buf = await synthesizeGoogleTTS(cleaned);
    fs.writeFileSync(filePath, buf);
    console.log(` [Google TTS Saved] ${filename} (${buf.length} bytes)`);
  }
}

async function main() {
  console.log('====================================================');
  console.log('PRE-CACHING NEURAL AUDIO WITH ACCURATE GENDER');
  console.log('====================================================');

  // CONVERSATION 1: Minh 1986 (Male Customer) + Bát Đại Danh Sư
  // Turn 1: Khách Nam Minh 1986
  await generateAudioItem(
    'dialogue_minh_1986_msg_c1_1.mp3',
    'Kính thỉnh Hội Đồng Bát Đại Danh Sư! Con tên là Minh, sinh lúc 2h sáng ngày 14/12/1986 (Bính Dần). Năm nay con bước sang tuổi 40, đang điều hành công ty riêng. Con kính nhờ Quý Thầy hội chẩn tổng thể lá số, chỉ rõ cho con cơ hội bứt phá công danh tài lộc và cách giữ gìn gia đạo êm ấm ạ!',
    'vi-VN-NamMinhNeural',
    '+0Hz',
    '+2%'
  );

  // Turn 2: Thầy Minh Triết (Nam lão niên)
  await generateAudioItem(
    'dialogue_minh_1986_msg_c1_2.mp3',
    'Thầy Minh Triết chào con trai! Thay mặt Hội Đồng Bát Đại Danh Sư, thầy khai mở bàn cờ Tử Vi của con: Bản mệnh Lô Trung Hỏa được Mộc Tam Cục sinh trợ, hoàn cảnh cuộc đời thuận lợi nâng đỡ bản mệnh. Cung Mệnh tại Hợi đắc lệnh tinh Thiên Phủ đắc địa, Thân cư Phúc Đức tại Sửu đắc cặp đôi vàng Vũ Khúc - Tham Lang miếu địa. Đây là mẫu người tiền bần hậu phú, ngoài 36 tuổi tích lũy ngân lượng đồ sộ. Tuy nhiên, Mệnh ngộ Kình Dương hội Đà La khiến tâm tính đôi lúc nóng nảy, cẩn trọng giấy tờ thuế khóa. Về chiến lược tài chính thực chiến, xin mời Thầy Thái Sơn định hướng cho con!',
    'vi-VN-NamMinhNeural',
    '-18Hz',
    '-10%'
  );

  // Turn 9: Cô Linh Đan (NỮ DANH SƯ DUY NHẤT)
  await generateAudioItem(
    'dialogue_minh_1986_msg_c1_9.mp3',
    'Cô Linh Đan chào bạn Minh! Nghe các Thầy luận giải tường tận, cô muốn nhắc bạn về một điểm tựa linh thiêng: Cung Phúc Đức Thân cư Sửu có phúc ấm tổ tiên dòng họ che chở rất lớn. Nếu bạn mơ thấy nước lớn hay gặp lại người thân đã khuất, đó là lời nhắc nhở hướng về gia đình và chú trọng ngày giỗ chạp gia tiên. Vào ngày rằm mùng một, hãy trích một phần lợi nhuận để phóng sinh chim, cá và làm việc thiện. Giữ tâm thiện lành tích đức, đạo Phật dạy đức năng thắng số, vạn sự hanh thông cát lành!',
    'vi-VN-HoaiMyNeural',
    '+12Hz',
    '-4%'
  );

  // CONVERSATION 2: Trần Thị Bích (Female Customer)
  // Turn 1: Khách Nữ Bích (vi-VN-HoaiMyNeural)
  await generateAudioItem(
    'dialogue_bich_2020_msg_c2_1.mp3',
    'Con gái tôi sinh vào tháng 4 nhuận năm Canh Tý 2020, nghe nói sinh tháng nhuận thì cách an sao Tử Vi và Tứ Trụ khác người bình thường. Nhờ Quý Thầy hội chẩn xem cháu khuyết hành gì và sau này học hành ra sao ạ?',
    'vi-VN-HoaiMyNeural',
    '+6Hz',
    '+0%'
  );

  // Turn 2: Thầy Minh Triết (vi-VN-NamMinhNeural)
  await generateAudioItem(
    'dialogue_bich_2020_msg_c2_2.mp3',
    'Chào chị Bích! Về tháng sinh nhuận, thuật an sao Nam Phái lấy mốc tiết khí và ngày giữa tháng để phân định. Cháu bé sinh ngày 23/05/2020 nhằm ngày mùng 1 tháng 4 nhuận, Mệnh Thổ, cách cục thanh tú có sao Văn Xương, Văn Khúc hội chiếu chủ về thông tuệ đĩnh ngộ, việc học hành tương lai rất hanh thông rộng mở.',
    'vi-VN-NamMinhNeural',
    '-18Hz',
    '-10%'
  );

  console.log('\nAll gender-accurate neural audio files successfully pre-cached!');
}

main().catch(console.error);
