const BASE_URL = 'http://localhost:3005';

async function verifyResponseIntegrity() {
  console.log('\n======================================================');
  console.log('KIỂM TRA TÍNH TOÀN VẸN VÀ ĐỘ DÀI CÂU TRẢ LỜI DANH SƯ');
  console.log('======================================================\n');

  const res = await fetch(`${BASE_URL}/api/chat/council`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'INIT_COUNCIL',
      activeChartId: 'la-so-tu-vi-nguyen-van-a-1990-nam-canh-ngo-x8k29a',
      userQuestion: 'Xin các vị Thầy đàm đạo sâu sắc và phản biện đa chiều về tiền tài và gia đạo.',
      customDelayMs: 500, // Faster delay for test verification
    }),
  });

  if (!res.ok) {
    console.error(`Lỗi HTTP ${res.status}: ${res.statusText}`);
    process.exit(1);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const turnAnswers = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'message_end') {
            turnAnswers.push({
              turn: data.turn,
              agentSlug: data.agentSlug,
              content: data.content,
              length: data.content.length,
            });
          }
        } catch {}
      }
    }
  }

  console.log(`Thu thập thành công ${turnAnswers.length} lượt trả lời trong Đợt 1.\n`);

  let allPassed = true;

  for (const item of turnAnswers) {
    console.log(`------------------------------------------------------`);
    console.log(`LƯỢT ${item.turn} [${item.agentSlug}] - Độ dài: ${item.length} ký tự`);
    
    // Check if ancient knowledge quote was sliced with "..."
    const quoteMatches = item.content.match(/> 📜 \*(.*?)\*: "(.*?)"/);
    if (quoteMatches) {
      const quoteLabel = quoteMatches[1];
      const quoteText = quoteMatches[2];
      console.log(`Trích dẫn cổ thư [${quoteLabel}]: ${quoteText.length} ký tự`);
      console.log(`Nội dung: "${quoteText}"`);
      
      if (quoteText.endsWith('...')) {
        console.error(`❌ CẢNH BÁO: Trích dẫn vẫn còn bị cắt với dấu "..."!`);
        allPassed = false;
      } else {
        console.log(`✅ Trích dẫn trọn vẹn 100%, không bị cắt ngang!`);
      }
    } else {
      console.log(`ℹ️ Không có trích dẫn blockquote trực tiếp.`);
    }

    // Check minimum expected length
    if (item.length < 500) {
      console.error(`❌ CẢNH BÁO: Câu trả lời quá ngắn (<500 ký tự)!`);
      allPassed = false;
    } else {
      console.log(`✅ Độ dài phản hồi phong phú, đạt chuẩn luận giải.`);
    }
  }

  console.log('\n======================================================');
  if (allPassed && turnAnswers.length === 5) {
    console.log('🎉 TẤT CẢ CÂU TRẢ LỜI CỦA CÁC DANH SƯ ĐỀU ĐẦY ĐỦ 100%!');
    console.log('======================================================\n');
    process.exit(0);
  } else {
    console.error('❌ CÓ LỖI XẢY RA TRONG QUÁ TRÌNH KIỂM TRA!');
    console.log('======================================================\n');
    process.exit(1);
  }
}

verifyResponseIntegrity();
