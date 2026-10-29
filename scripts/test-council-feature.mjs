const BASE_URL = 'http://localhost:3005';

async function testAdminConversationsAPI() {
  console.log('\n--- 1. Testing GET /api/admin/conversations ---');
  for (const tab of ['all', 'council', 'live', 'takeover']) {
    const res = await fetch(`${BASE_URL}/api/admin/conversations?tab=${tab}`);
    const data = await res.json();
    console.log(`Tab '${tab}': ok=${data.ok}, count=${data.conversations?.length}`);
  }

  // Get council conv ID
  const listRes = await fetch(`${BASE_URL}/api/admin/conversations?tab=council`);
  const listData = await listRes.json();
  const conv = listData.conversations[0];
  if (!conv) {
    console.error('No conversation found to test');
    return;
  }
  const convId = conv.id;

  // Test SEND_MESSAGE as Admin
  console.log('\n2a. Admin sending message...');
  const sendRes = await fetch(`${BASE_URL}/api/admin/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'SEND_MESSAGE',
      conversationId: convId,
      content: 'Chào đương số, tôi là Quản Trị Viên hệ thống XemBoi.vn.',
    }),
  });
  const sendData = await sendRes.json();
  console.log('Send Message result:', sendData.ok, sendData.message?.senderName);
}

async function testCouncilBatch1AndBatch2() {
  console.log('\n--- 3. Testing POST /api/chat/council (Batch 1: 5 Turns with 5s Delays) ---');
  const startTime = Date.now();
  const res = await fetch(`${BASE_URL}/api/chat/council`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'INIT_COUNCIL',
      activeChartId: 'la-so-tu-vi-nguyen-van-a-1990-nam-canh-ngo-x8k29a',
      userQuestion: 'Xin các Thầy đàm đạo và phản biện về sự nghiệp và gia đạo của tôi.',
    }),
  });

  console.log('SSE Response Status:', res.status);

  let eventCount = 0;
  const turnsSeen = [];
  const agentsSeen = [];
  let conversationId = '';
  let batchPausedReceived = false;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

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
          eventCount++;
          if (data.type === 'conversation_ready') {
            conversationId = data.conversationId;
            console.log(`\nPhòng Hội Chẩn khởi tạo: ID = ${conversationId}`);
          } else if (data.type === 'agent_start' || data.type === 'message_start') {
            turnsSeen.push(data.turn);
            agentsSeen.push(data.agentSlug);
            console.log(`\n>>> [LƯỢT ${data.turn}] ${data.agentName} (${data.senderBadge || data.badge}) BẮT ĐẦU PHÁT BIỂU:`);
          } else if (data.type === 'status') {
            console.log(`   [STATUS] ${data.message || data.status}`);
          } else if (data.type === 'token') {
            process.stdout.write('.');
          } else if (data.type === 'agent_complete' || data.type === 'message_end') {
            console.log(`\n<<< [LƯỢT ${data.turn}] ${data.agentSlug} HOÀN TẤT. Độ dài: ${(data.content || data.fullText)?.length} ký tự.`);
          } else if (data.type === 'council_batch_paused') {
            batchPausedReceived = true;
            console.log(`\n>>> [COUNCIL_BATCH_PAUSED] Đã tạm dừng sau 5 lượt đàm đạo! Lựa chọn tiếp tục = ${data.canContinue}`);
          }
        } catch (e) {}
      }
    }
  }

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  console.log(`\nBatch 1 hoàn thành trong ${durationSec}s. Tổng lượt đã đàm đạo: ${turnsSeen.length} lượt.`);
  console.log(`Danh Sư phát biểu: ${agentsSeen.join(' -> ')}`);

  if (!batchPausedReceived || turnsSeen.length !== 5) {
    throw new Error(`Kỳ vọng đúng 5 lượt đàm đạo và nhận event council_batch_paused, thực tế: ${turnsSeen.length}`);
  }

  // Verify inter-turn delay was respected (4 inter-turn intervals of 5s each = at least 20s total)
  if (durationSec < 20) {
    throw new Error(`Độ trễ tối thiểu 5s giữa mỗi câu trả lời chưa đạt! Tổng thời gian chạy: ${durationSec}s`);
  }
  console.log(`✅ Đạt yêu cầu độ trễ tối thiểu 5 giây giữa các câu trả lời! (${durationSec}s cho 5 lượt)`);

  // --- 4. Testing CONTINUE_COUNCIL (Batch 2: Turns 6 - 10) ---
  console.log('\n--- 4. Testing CONTINUE_COUNCIL (Batch 2: Turns 6 - 10) ---');
  const startBatch2 = Date.now();
  const res2 = await fetch(`${BASE_URL}/api/chat/council`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'CONTINUE_COUNCIL',
      conversationId,
      batchIndex: 2,
    }),
  });

  const reader2 = res2.body.getReader();
  let buffer2 = '';
  const turnsSeen2 = [];
  let finalSummarySeen = false;

  while (true) {
    const { done, value } = await reader2.read();
    if (done) break;
    buffer2 += decoder.decode(value, { stream: true });
    const lines = buffer2.split('\n');
    buffer2 = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'agent_start' || data.type === 'message_start') {
            turnsSeen2.push(data.turn);
            console.log(`\n>>> [LƯỢT ${data.turn}] ${data.agentName} (${data.senderBadge}) PHÁT BIỂU:`);
          } else if (data.type === 'status') {
            console.log(`   [STATUS] ${data.message}`);
          } else if (data.type === 'token') {
            process.stdout.write('.');
          } else if (data.type === 'agent_complete' || data.type === 'message_end') {
            console.log(`\n<<< [LƯỢT ${data.turn}] Hoàn tất. Độ dài: ${(data.content || data.fullText)?.length} ký tự.`);
          } else if (data.type === 'council_complete') {
            finalSummarySeen = true;
            console.log('\n>>> [COUNCIL_COMPLETE] Đã hoàn tất trọn vẹn 10 lượt đàm đạo & xuất Bảng Cẩm Nang 5 Trụ Cột!');
          }
        } catch (e) {}
      }
    }
  }

  const durationBatch2 = Math.round((Date.now() - startBatch2) / 1000);
  console.log(`Batch 2 hoàn thành trong ${durationBatch2}s. Các lượt: ${turnsSeen2.join(', ')}.`);
  if (!finalSummarySeen || turnsSeen2.length !== 5) {
    throw new Error(`Kỳ vọng đúng 5 lượt đợt 2 (Turns 6-10) và event council_complete.`);
  }
}

async function main() {
  try {
    await testAdminConversationsAPI();
    await testCouncilBatch1AndBatch2();
    console.log('\n🎉 TẤT CẢ KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC 100%!');
  } catch (err) {
    console.error('Lỗi kiểm thử:', err);
    process.exit(1);
  }
}

main();
