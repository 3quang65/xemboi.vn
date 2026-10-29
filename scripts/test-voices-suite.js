const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

async function testSynthesis(label, text, voiceId, pitch = '+0Hz', rate = '+0%') {
  const start = Date.now();
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceId, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text, { pitch, rate });
  
  return new Promise((resolve, reject) => {
    const chunks = [];
    audioStream.on('data', c => chunks.push(c));
    audioStream.on('end', () => {
      const buf = Buffer.concat(chunks);
      console.log(`[${label}] [${voiceId}] Success in ${Date.now() - start}ms, size: ${buf.length} bytes`);
      resolve(buf);
    });
    audioStream.on('error', reject);
  });
}

async function run() {
  console.log('--- Testing Male Master: Thầy Minh Triết ---');
  await testSynthesis('Thầy Minh Triết', 'Kính chào quý bạn, tôi là Thầy Minh Triết, Đại sư Tử Vi Đẩu Số.', 'vi-VN-NamMinhNeural', '-18Hz', '-10%');

  console.log('--- Testing Female Master: Cô Linh Đan ---');
  await testSynthesis('Cô Linh Đan', 'Kính chào quý bạn, tôi là Cô Linh Đan, chuyên gia tâm linh, giấc mơ và thiền y.', 'vi-VN-HoaiMyNeural', '+12Hz', '-4%');

  console.log('--- Testing Male Customer: Anh Minh (1986) ---');
  await testSynthesis('Khách Nam Minh', 'Con chào Quý Thầy ạ! Con tên Minh, sinh năm Bính Dần 1986, con muốn hỏi về cung Tài Bạch.', 'vi-VN-NamMinhNeural', '+0Hz', '+2%');

  console.log('--- Testing Female Customer: Chị Bích (2020) ---');
  await testSynthesis('Khách Nữ Bích', 'Kính chào Quý Thầy, em là Bích, em muốn thỉnh giáo về lá số của con gái em ạ.', 'vi-VN-HoaiMyNeural', '+6Hz', '+0%');
}

run().catch(console.error);
