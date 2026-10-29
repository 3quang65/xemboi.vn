import fs from 'fs';
import path from 'path';

function createWavBuffer(sampleRate, durationSec, generateSample) {
  const numChannels = 2; // Stereo
  const bytesPerSample = 2; // 16-bit
  const totalSamples = Math.floor(sampleRate * durationSec);
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const [left, right] = generateSample(t, i, totalSamples);
    
    // Clamp to -1.0 to 1.0
    const clampedL = Math.max(-1, Math.min(1, left));
    const clampedR = Math.max(-1, Math.min(1, right));

    const intSampleL = Math.floor(clampedL < 0 ? clampedL * 32768 : clampedL * 32767);
    const intSampleR = Math.floor(clampedR < 0 ? clampedR * 32768 : clampedR * 32767);

    buffer.writeInt16LE(intSampleL, offset);
    buffer.writeInt16LE(intSampleR, offset + 2);
    offset += 4;
  }

  return buffer;
}

// 1. CỔ CẦM TĨNH TÂM (Guqin Meditation Zen Ambient) - 16s loopable
function generateGuqinBgm() {
  const sampleRate = 44100;
  const duration = 16.0;
  // Pentatonic notes (D3: 146.8, F3: 174.6, G3: 196.0, A3: 220.0, C4: 261.6, D4: 293.7, F4: 349.2)
  const notes = [
    { time: 0.5, freq: 146.83, dur: 4.5, gain: 0.7 },
    { time: 2.2, freq: 220.00, dur: 3.5, gain: 0.6 },
    { time: 4.0, freq: 261.63, dur: 4.0, gain: 0.55 },
    { time: 6.5, freq: 196.00, dur: 4.5, gain: 0.65 },
    { time: 8.8, freq: 293.66, dur: 3.8, gain: 0.5 },
    { time: 10.5, freq: 174.61, dur: 4.2, gain: 0.6 },
    { time: 12.8, freq: 220.00, dur: 3.2, gain: 0.55 },
  ];

  return createWavBuffer(sampleRate, duration, (t) => {
    let mono = 0;
    // Ambient drone
    mono += Math.sin(2 * Math.PI * 73.4 * t) * 0.08 * (0.8 + 0.2 * Math.sin(t * 0.5));
    mono += Math.sin(2 * Math.PI * 110.0 * t) * 0.05;

    // Plucked string harmonics (Karplus-like decay)
    for (const note of notes) {
      if (t >= note.time) {
        const dt = t - note.time;
        if (dt < note.dur) {
          const envelope = Math.exp(-dt * 1.8) * (1 - Math.exp(-dt * 30));
          // Fundamental + harmonics (Guqin rich overtone)
          const h1 = Math.sin(2 * Math.PI * note.freq * dt);
          const h2 = Math.sin(2 * Math.PI * (note.freq * 2) * dt) * 0.45;
          const h3 = Math.sin(2 * Math.PI * (note.freq * 3) * dt) * 0.2;
          const h4 = Math.sin(2 * Math.PI * (note.freq * 4) * dt) * 0.1;
          mono += (h1 + h2 + h3 + h4) * envelope * note.gain * 0.5;
        }
      }
    }

    // Subtle stereo panning
    const pan = Math.sin(t * 0.4) * 0.2;
    return [mono * (0.5 - pan), mono * (0.5 + pan)];
  });
}

// 2. TIÊU SÁO TINH KHÔNG (Bamboo Flute Cosmic Echo) - 16s loopable
function generateFluteBgm() {
  const sampleRate = 44100;
  const duration = 16.0;
  const phrases = [
    { time: 0.8, freq: 329.63, dur: 3.2 },
    { time: 3.8, freq: 392.00, dur: 3.0 },
    { time: 6.5, freq: 440.00, dur: 3.5 },
    { time: 9.8, freq: 493.88, dur: 2.8 },
    { time: 12.2, freq: 392.00, dur: 3.5 },
  ];

  return createWavBuffer(sampleRate, duration, (t) => {
    let mono = 0;
    // Cosmic wind ambient pad
    mono += (Math.sin(2 * Math.PI * 164.8 * t) + Math.sin(2 * Math.PI * 247.0 * t)) * 0.06;

    // Flute breathy tone with vibrato
    for (const p of phrases) {
      if (t >= p.time && t <= p.time + p.dur) {
        const dt = t - p.time;
        const vibrato = Math.sin(2 * Math.PI * 5.2 * dt) * 0.015;
        const f = p.freq * (1 + vibrato);
        const env = Math.sin((dt / p.dur) * Math.PI); // Smooth arc envelope
        // Flute timbre: dominant fundamental, soft 2nd harmonic, breath noise
        const sound = Math.sin(2 * Math.PI * f * dt) + Math.sin(2 * Math.PI * 2 * f * dt) * 0.25;
        const breath = (Math.random() * 2 - 1) * 0.03;
        mono += (sound + breath) * env * 0.35;
      }
    }

    const pan = Math.cos(t * 0.5) * 0.25;
    return [mono * (0.5 - pan), mono * (0.5 + pan)];
  });
}

// 3. THANH ÂM TRÀ ĐẠO (Tea Ceremony & Flowing Water) - 16s loopable
function generateTeaBgm() {
  const sampleRate = 44100;
  const duration = 16.0;

  return createWavBuffer(sampleRate, duration, (t, i) => {
    // Water stream trickling sound (filtered noise synthesis)
    const noise = Math.random() * 2 - 1;
    const waterEnvelope = 0.04 + 0.03 * Math.sin(t * 1.5) + 0.02 * Math.sin(t * 3.7);
    let leftWater = noise * waterEnvelope;
    let rightWater = (Math.random() * 2 - 1) * waterEnvelope;

    // Soft singing bowl drone at 216 Hz & 432 Hz
    const bowl = (Math.sin(2 * Math.PI * 216 * t) + Math.sin(2 * Math.PI * 432 * t) * 0.4) * 0.05 * (0.8 + 0.2 * Math.sin(t * 0.3));

    // Occasional wind chime drops
    let chime = 0;
    const chimeTimes = [2.0, 5.5, 9.0, 13.5];
    for (const ct of chimeTimes) {
      if (t >= ct && t < ct + 2.5) {
        const dt = t - ct;
        chime += Math.sin(2 * Math.PI * 1760 * dt) * Math.exp(-dt * 3.5) * 0.12;
      }
    }

    return [leftWater + bowl + chime * 0.7, rightWater + bowl + chime * 0.3];
  });
}

// 4. SFX: KHÁNH NGỌC / CHUÔNG ĐỒNG ĐĂNG ĐÀN (Singing Bowl / Jade Chime) - 3s
function generateWoodenFishChime() {
  const sampleRate = 44100;
  const duration = 3.0;

  return createWavBuffer(sampleRate, duration, (t) => {
    if (t < 0.005) return [0, 0];
    const dt = t;
    const strike = Math.exp(-dt * 45) * 0.4; // Initial mallet impact
    // Resonant singing chime frequencies: 880Hz, 1760Hz, 2640Hz
    const env = Math.exp(-dt * 1.6);
    const ring1 = Math.sin(2 * Math.PI * 880 * dt) * 0.5;
    const ring2 = Math.sin(2 * Math.PI * 1762 * dt) * 0.3;
    const ring3 = Math.sin(2 * Math.PI * 2650 * dt) * 0.15;
    const sig = (strike + (ring1 + ring2 + ring3) * env) * 0.8;
    return [sig, sig];
  });
}

// 5. SFX: MỞ CUỘN TRÚC (Bamboo Scroll Unfold) - 1.2s
function generateScrollUnfold() {
  const sampleRate = 44100;
  const duration = 1.2;

  return createWavBuffer(sampleRate, duration, (t) => {
    const dt = t;
    // Rhythmic series of wooden bamboo slat clicks
    let click = 0;
    for (let c = 0; c < 6; c++) {
      const clickTime = 0.05 + c * 0.16 + (c * c) * 0.008;
      if (dt >= clickTime && dt < clickTime + 0.08) {
        const cdt = dt - clickTime;
        const woodFreq = 620 + c * 40;
        click += Math.sin(2 * Math.PI * woodFreq * cdt) * Math.exp(-cdt * 70) * (0.6 - c * 0.06);
      }
    }
    // Cloth sliding background friction
    const friction = (Math.random() * 2 - 1) * Math.exp(-dt * 3.0) * 0.08;
    const sig = (click + friction) * 0.85;
    return [sig, sig * 0.9];
  });
}

// 6. SFX: GIEO XU CHU DỊCH (Ancient Coin Toss) - 2.0s
function generateCoinToss() {
  const sampleRate = 44100;
  const duration = 2.0;

  return createWavBuffer(sampleRate, duration, (t) => {
    const dt = t;
    let metallic = 0;
    // 3 bronze coins dropping and clinking on wood table at t = 0.2, 0.4, 0.55, 0.7
    const clinks = [
      { time: 0.15, freq: 2400 },
      { time: 0.32, freq: 2750 },
      { time: 0.48, freq: 2150 },
      { time: 0.65, freq: 2600 },
      { time: 0.82, freq: 2350 },
    ];

    for (const c of clinks) {
      if (dt >= c.time && dt < c.time + 0.4) {
        const cdt = dt - c.time;
        const ring = Math.sin(2 * Math.PI * c.freq * cdt) * Math.exp(-cdt * 28);
        const overtone = Math.sin(2 * Math.PI * (c.freq * 1.48) * cdt) * Math.exp(-cdt * 35) * 0.4;
        metallic += (ring + overtone) * 0.4;
      }
    }

    return [metallic * 0.85, metallic * 0.75];
  });
}

// MAIN GENERATION RUNNER
function main() {
  console.log('🎵 BẮT ĐẦU TẠO CÁC TỆP ÂM THANH CỔ PHONG & HIỆU ỨNG (BGM & SFX)...');

  const bgmDir = path.resolve('public/audio/bgm');
  const sfxDir = path.resolve('public/audio/sfx');

  fs.mkdirSync(bgmDir, { recursive: true });
  fs.mkdirSync(sfxDir, { recursive: true });

  // 1. Co Cam Thien Dinh
  const guqinBuf = generateGuqinBgm();
  fs.writeFileSync(path.join(bgmDir, 'co-cam-thien-dinh.mp3'), guqinBuf);
  fs.writeFileSync(path.join(bgmDir, 'co-cam-thien-dinh.wav'), guqinBuf);
  console.log(`✓ Tạo thành công BGM: co-cam-thien-dinh.mp3 (${guqinBuf.length} bytes)`);

  // 2. Sao Truc Tinh Khong
  const fluteBuf = generateFluteBgm();
  fs.writeFileSync(path.join(bgmDir, 'sao-truc-tinh-khong.mp3'), fluteBuf);
  fs.writeFileSync(path.join(bgmDir, 'sao-truc-tinh-khong.wav'), fluteBuf);
  console.log(`✓ Tạo thành công BGM: sao-truc-tinh-khong.mp3 (${fluteBuf.length} bytes)`);

  // 3. Tra Dao Thanh Am
  const teaBuf = generateTeaBgm();
  fs.writeFileSync(path.join(bgmDir, 'tra-dao-thanh-am.mp3'), teaBuf);
  fs.writeFileSync(path.join(bgmDir, 'tra-dao-thanh-am.wav'), teaBuf);
  console.log(`✓ Tạo thành công BGM: tra-dao-thanh-am.mp3 (${teaBuf.length} bytes)`);

  // 4. SFX: Wooden Fish / Jade Chime
  const chimeBuf = generateWoodenFishChime();
  fs.writeFileSync(path.join(sfxDir, 'wooden-fish-chime.mp3'), chimeBuf);
  fs.writeFileSync(path.join(sfxDir, 'wooden-fish-chime.wav'), chimeBuf);
  console.log(`✓ Tạo thành công SFX: wooden-fish-chime.mp3 (${chimeBuf.length} bytes)`);

  // 5. SFX: Scroll Unfold
  const scrollBuf = generateScrollUnfold();
  fs.writeFileSync(path.join(sfxDir, 'scroll-unfold.mp3'), scrollBuf);
  fs.writeFileSync(path.join(sfxDir, 'scroll-unfold.wav'), scrollBuf);
  console.log(`✓ Tạo thành công SFX: scroll-unfold.mp3 (${scrollBuf.length} bytes)`);

  // 6. SFX: Coin Toss
  const coinBuf = generateCoinToss();
  fs.writeFileSync(path.join(sfxDir, 'coin-toss.mp3'), coinBuf);
  fs.writeFileSync(path.join(sfxDir, 'coin-toss.wav'), coinBuf);
  console.log(`✓ Tạo thành công SFX: coin-toss.mp3 (${coinBuf.length} bytes)`);

  console.log('🎉 TẤT CẢ TỆP ÂM THANH ĐÃ ĐƯỢC TẠO HOÀN TẤT TRONG /public/audio/!');
}

main();
