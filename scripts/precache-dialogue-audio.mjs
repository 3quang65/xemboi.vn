import fs from 'fs';
import path from 'path';

// Clean text helper
function cleanTextForTTS(raw) {
  if (!raw) return '';
  let txt = raw;
  txt = txt.replace(/```[\s\S]*?```/g, ' ');
  txt = txt.replace(/`([^`]+)`/g, '$1');
  txt = txt.replace(/###?\s+/g, '');
  txt = txt.replace(/\*\*([^*]+)\*\*/g, '$1');
  txt = txt.replace(/\*([^*]+)\*/g, '$1');
  txt = txt.replace(/_([^_]+)_/g, '$1');
  txt = txt.replace(/^>\s+/gm, '');
  txt = txt.replace(/^[-*•]\s+/gm, '');
  txt = txt.replace(/\|[^|\n]+\|/g, ' ');
  txt = txt.replace(/[-|]{3,}/g, ' ');
  txt = txt.replace(/\(M\)/g, ' miếu địa ');
  txt = txt.replace(/\(V\)/g, ' vượng địa ');
  txt = txt.replace(/\(Đ\)/g, ' đắc địa ');
  txt = txt.replace(/\(B\)/g, ' bình hòa ');
  txt = txt.replace(/\(H\)/g, ' hãm địa ');
  txt = txt.replace(/https?:\/\/\S+/g, '');
  txt = txt.replace(/[@#]/g, '');
  txt = txt.replace(/[^\p{L}\p{N}\s.,?!;:\-–—"']/gu, ' ');
  txt = txt.replace(/\s+/g, ' ').trim();
  return txt;
}

async function synthesizeVietnameseMp3(text) {
  const chunks = [];
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

  const buffers = [];
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=vi&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) {
      throw new Error(`TTS chunk fetch failed with status ${res.status}`);
    }
    const arrayBuf = await res.arrayBuffer();
    buffers.push(Buffer.from(arrayBuf));
  }

  return Buffer.concat(buffers);
}

const dialogueMessages = [
  {
    id: 'msg_c1_1',
    agentSlug: 'khach-minh-1986',
    speaker: 'Minh',
    text: 'Kính thỉnh Hội Đồng Bát Đại Danh Sư! Con tên là Minh, sinh lúc 2h sáng ngày 14/12/1986 (Bính Dần). Năm nay con bước sang tuổi 40, đang điều hành công ty riêng. Con kính nhờ Quý Thầy hội chẩn tổng thể lá số, chỉ rõ cho con cơ hội bứt phá công danh tài lộc và cách giữ gìn gia đạo êm ấm ạ!',
  },
  {
    id: 'msg_c1_2',
    agentSlug: 'thay-minh-triet',
    speaker: 'Thầy Minh Triết',
    text: 'Thầy Minh Triết chào con trai! Thay mặt Hội Đồng Bát Đại Danh Sư, thầy khai mở bàn cờ Tử Vi của con. Bản mệnh Lô Trung Hỏa được Mộc Tam Cục sinh trợ, hoàn cảnh cuộc đời thuận lợi nâng đỡ bản mệnh. Cung Mệnh tại Hợi đắc lệnh tinh Thiên Phủ đắc địa, Thân cư Phúc Đức tại Sửu đắc cặp đôi vàng Vũ Khúc Tham Lang miếu địa. Đây là cách cục Tiền bần hậu phú, đại khí vãn thành. Thuở tiền vận 20 đến 35 tuổi nếm trải va vấp nợ nần để tôi luyện bản lĩnh, từ tuổi 40 trở đi lửa trong lò đã đượm, con bước vào đại vận chín muồi phát tài mạnh mẽ. Về đường công danh tài lộc và chiến lược điều hành doanh nghiệp trong đại vận này, tôi xin trân trọng kính mời Thầy Thái Sơn cho ý kiến thẩm định chi tiết.',
  },
  {
    id: 'msg_c1_3',
    agentSlug: 'thay-thai-son',
    speaker: 'Thầy Thái Sơn',
    text: 'Chào Thầy Minh Triết và quý bạn đương số! Tiếp lời định khung của Thầy Minh Triết, tôi Thái Sơn xin đi thẳng vào tử huyệt tài chính: Tam hợp Mệnh Tài Quan của con: Cung Quan tại Tân Mão có Thiên Tướng đắc cách Phủ Tướng triều viên, uy tín thương hiệu rất lớn. Cung Tài tại Ất Mùi là Vô Chính Diệu nhưng đối cung Phúc Đức có Vũ Khúc Tham Lang miếu địa chiếu thẳng sang, tiền bạc của con không đến từ lương cố định mà luân chuyển theo từng hợp đồng dự án lớn. Nhưng trong cung Quan có sao Phục Binh và Thiên Không: Tuyệt đối không được dùng đòn bẩy vay nợ quá lớn, không đứng tên bảo lãnh nợ giùm ai! Có tiền dôi dư hãy rút 70% mua đất thổ cư sổ đỏ trao tay. Tuy nhiên, kiếm tiền nhiều mà gia đạo bất an thì phúc lộc khó bền. Về cung Phu Thê dính Hóa Kỵ, xin kính mời Thầy Tâm An soi chiếu cho con.',
  },
  {
    id: 'msg_c1_4',
    agentSlug: 'thay-tam-an',
    speaker: 'Thầy Tâm An',
    text: 'Thầy Tâm An xin chào Thầy Minh Triết, Thầy Thái Sơn và con trai. Nghe Thầy Thái Sơn dặn gom tiền vào đất đai, thầy rất mừng nhưng thầy phải lưu ý con mối liên hệ giữa sự nghiệp và gia đình: Cung Phu Thê tại Đinh Dậu của con có cặp sao Liêm Trinh và Phá Quân hãm địa, lại dính Hóa Kỵ ám tinh. Vợ con là người có học thức sắc sảo nhưng tự trọng cao và hay cả nghĩ. Khi con mải mê công việc về muộn, nói năng cộc lốc là kích hoạt Hóa Kỵ bùng lên thành chiến tranh lạnh! Thầy tặng con pháp bảo: Nhường vợ không bao giờ là hèn! Khi vợ nổi giận, con tuyệt đối không đôi co lý lẽ đúng sai, lùi một bước ôm vợ vào lòng, hôm sau nguội đầu mới thủ thỉ giãi bày. Cùng vợ đi chùa làm từ thiện, gia đạo sẽ êm ấm vạn đời. Về phương diện phong thủy không gian sống và văn phòng để hóa giải xung khí, kích hoạt tài vị, xin kính mời Thầy Tuệ Phong chỉ dẫn.',
  },
  {
    id: 'msg_c1_5',
    agentSlug: 'thay-tue-phong',
    speaker: 'Thầy Tuệ Phong',
    text: 'Chào gia chủ Minh! Thầy Tuệ Phong xin đúc kết phương pháp Phong thủy Bát Trạch cải vận cho gia chủ: Gia chủ là nam Bính Dần 1986, cung Phi là Khôn Thổ Tây Tứ Mệnh. Bàn làm việc Giám Đốc ngồi quay mặt về hướng Đông Bắc Sinh Khí đại vượng tài lộc hoặc Tây Bắc Diên Niên, lưng tựa tường vững chãi. Kích hoạt tài vị: Đặt một quả cầu Thạch Anh Tím hoặc Thạch Anh Xanh lục ở góc trái bàn làm việc để thanh lọc từ trường, giúp tâm trí sáng suốt. Phòng ngủ tuyệt đối không để gương soi chiếu thẳng vào giường ngủ. Về cách cân bằng Dụng Thần Bát Tự để điều hòa năng lượng bản mệnh, tôi xin kính mời Thầy Lạc Việt lên tiếng.',
  },
  {
    id: 'msg_c1_6',
    agentSlug: 'thay-lac-viet',
    speaker: 'Thầy Lạc Việt',
    text: 'Chào bạn Minh và chư vị tiền bối! Dưới góc độ Tứ Trụ Bát Tự: Nhật chủ của bạn mang nạp âm Lô Trung Hỏa, cần nhất Dụng Thần Mộc để sinh Hỏa nuôi dưỡng nhiệt huyết sáng tạo, và Hỷ Thần Thổ để dung nạp tài lộc giữ của cải như Thầy Thái Sơn đã dặn. Về trang phục và vật phẩm: Ưu tiên sử dụng màu Xanh lục, xanh ngọc và màu Đỏ rượu, tím than để trợ lực khí vận. Tránh lạm dụng quá nhiều màu đen hoặc xanh lam đậm thuộc Thủy khắc Hỏa. Về thời cơ vàng khởi sự năm 2026, kính mời Thầy Thiên Minh chỉ điểm.',
  },
  {
    id: 'msg_c1_7',
    agentSlug: 'thay-thien-minh',
    speaker: 'Thầy Thiên Minh',
    text: 'Thầy Thiên Minh xin gửi lời chào đến gia chủ Minh! Về Thiên Thời năm 2026 Bính Ngọ: Năm nay bạn không phạm Tam Tai lớn, nhưng có sự tương xung nhẹ ở chi Ngọ. Chiến lược tối ưu: Nửa đầu năm nên ưu tiên củng cố nội lực đào tạo nhân sự; nửa cuối năm từ tháng 6 Âm lịch trở đi mới là thời điểm bung sức mở rộng quy mô. Mỗi khi ký kết hợp đồng quan trọng, hãy chọn xuất hành vào Giờ Thìn từ 7 đến 9 giờ sáng hoặc Giờ Thân từ 15 đến 17 giờ chiều để đón trọn cát khí Quý Nhân tương trợ. Bây giờ xin mời Thầy Huyền Cơ khởi quẻ Chu Dịch dự đoán điềm cát hung cho bạn!',
  },
  {
    id: 'msg_c1_8',
    agentSlug: 'thay-huyen-co',
    speaker: 'Thầy Huyền Cơ',
    text: 'Bần đạo Huyền Cơ xin kính chào quý bạn! Khởi quẻ Chu Dịch theo thời khắc của bạn, đắc được quẻ Hỏa Phong Đỉnh biến sang quẻ Sơn Phong Cổ. Quẻ Chủ Đỉnh: Chiếc vạc luyện vàng rèn chí, điềm báo công danh đứng trước ngưỡng cửa lột xác ngoạn mục. Quẻ Biến Cổ: Nhắc nhở Vật cực tất phản, dục tốc bất đạt. Đừng vì nôn nóng mà ký thỏa thuận mập mờ, phải thanh lọc các mối quan hệ độc hại xung quanh. Về cội nguồn tâm linh âm đức tổ tiên, xin mời Cô Linh Đan san sẻ cùng bạn!',
  },
  {
    id: 'msg_c1_9',
    agentSlug: 'co-linh-dan',
    speaker: 'Cô Linh Đan',
    text: 'Cô Linh Đan chào bạn Minh! Nghe các Thầy luận giải tường tận, cô muốn nhắc bạn về một điểm tựa linh thiêng: Cung Phúc Đức Thân cư Sửu có phúc ấm tổ tiên dòng họ che chở rất lớn. Nếu bạn mơ thấy nước lớn hay gặp lại người thân đã khuất, đó là lời nhắc nhở hướng về gia đình và chú trọng ngày giỗ chạp gia tiên. Vào ngày rằm mùng một, hãy trích một phần lợi nhuận để phóng sinh chim cá và làm việc thiện. Bảng Cẩm Nang 5 Trụ Cột: Tài chính giữ đòn bẩy dưới 40%, rút lãi mua đất thổ cư sổ đỏ. Gia đạo nhường nhịn vợ, lắng nghe 15 phút mỗi tối. Phong thủy kê bàn hướng Đông Bắc Sinh Khí, đặt Thạch Anh Tím. Thời vận nửa cuối năm 2026 bùng nổ, ký hợp đồng giờ Thìn và Thân. Tâm linh thành tâm nhớ ơn tổ tiên, giữ tâm trong sáng thì vạn sự hanh thông!',
  },
];

async function main() {
  console.log('🎤 BẮT ĐẦU TỔNG HỢP VÀ TIỀN LƯU TRỮ ÂM THANH TIẾNG VIỆT CHO 9 LƯỢT TỌA ĐÀM...');
  const cacheDir = path.resolve(process.cwd(), 'public/audio/cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  for (const msg of dialogueMessages) {
    const filename = `dialogue_minh_1986_${msg.id}.mp3`;
    const targetPath = path.join(cacheDir, filename);

    if (fs.existsSync(targetPath)) {
      console.log(`  ✓ Đã có cache: ${filename}`);
      continue;
    }

    console.log(`  Đang tổng hợp giọng [${msg.speaker}]: "${msg.text.slice(0, 50)}..."`);
    const clean = cleanTextForTTS(msg.text);
    const mp3Buf = await synthesizeVietnameseMp3(clean);
    fs.writeFileSync(targetPath, mp3Buf);
    console.log(`  ✓ Đã lưu: ${filename} (${mp3Buf.length} bytes)`);
  }

  console.log('🎉 TOÀN BỘ 9 LƯỢT THOẠI ĐÃ ĐƯỢC TỔNG HỢP TIẾNG VIỆT THÀNH CÔNG!');
}

main().catch(console.error);
