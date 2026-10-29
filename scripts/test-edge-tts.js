const crypto = require('crypto');
const fs = require('fs');

async function testEdgeTTS(text, voice = 'vi-VN-NamMinhNeural', pitch = '+0Hz', rate = '+0%') {
  return new Promise((resolve, reject) => {
    const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EA654781AE7967C72527C393';
    const connectionId = crypto.randomUUID().replace(/-/g, '');
    const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&ConnectionId=${connectionId}`;

    const ws = new WebSocket(url, {
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold'
      }
    });

    const audioBuffers = [];

    ws.onopen = () => {
      console.log('WS connected to Edge TTS!');
      const date = new Date().toUTCString();
      // Send Speech Config
      const configMsg = `X-Timestamp:${date}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
      ws.send(configMsg);

      // Send SSML
      const requestId = crypto.randomUUID().replace(/-/g, '');
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='vi-VN'><voice name='${voice}'><prosody pitch='${pitch}' rate='${rate}'>${text}</prosody></voice></speak>`;
      const ssmlMsg = `X-RequestId:${requestId}\r\nX-Timestamp:${date}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`;
      ws.send(ssmlMsg);
    };

    ws.onmessage = async (event) => {
      const data = event.data;
      if (typeof data === 'string') {
        if (data.includes('Path:turn.end')) {
          console.log('Edge TTS synthesis complete! Total buffers:', audioBuffers.length);
          ws.close();
          const finalBuffer = Buffer.concat(audioBuffers);
          resolve(finalBuffer);
        }
      } else if (data instanceof Blob) {
        const arrayBuf = await data.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        // Find binary header marker: Path:audio\r\n
        const headerEnd = buf.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd !== -1) {
          const audioData = buf.subarray(headerEnd + 4);
          if (audioData.length > 0) {
            audioBuffers.push(audioData);
          }
        }
      } else if (Buffer.isBuffer(data) || data instanceof ArrayBuffer) {
        const buf = Buffer.from(data);
        const headerEnd = buf.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd !== -1) {
          const audioData = buf.subarray(headerEnd + 4);
          if (audioData.length > 0) {
            audioBuffers.push(audioData);
          }
        }
      }
    };

    ws.onerror = (err) => {
      console.error('WS Error:', err);
      reject(err);
    };

    ws.onclose = () => {
      console.log('WS closed');
    };
  });
}

async function run() {
  console.log('Testing Edge-TTS for Male voice (vi-VN-NamMinhNeural)...');
  const maleBuf = await testEdgeTTS('Xin chào quý bạn, tôi là Thầy Minh Triết, đại sư Tử Vi Đẩu Số.', 'vi-VN-NamMinhNeural', '-10Hz', '+0%');
  console.log('Male audio size:', maleBuf.length);
  fs.writeFileSync('public/audio/cache/test_male.mp3', maleBuf);

  console.log('Testing Edge-TTS for Female voice (vi-VN-HoaiMyNeural)...');
  const femaleBuf = await testEdgeTTS('Kính chào quý bạn, tôi là Cô Linh Đan, chuyên gia tâm linh và thiền y.', 'vi-VN-HoaiMyNeural', '+15Hz', '+0%');
  console.log('Female audio size:', femaleBuf.length);
  fs.writeFileSync('public/audio/cache/test_female.mp3', femaleBuf);
}

run().catch(console.error);
