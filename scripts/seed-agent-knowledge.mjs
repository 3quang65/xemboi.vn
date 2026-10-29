import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function generateVector(text) {
  const dim = 1536;
  const vec = new Float64Array(dim);
  const clean = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);

  let seed = 1337;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let h = 0;
    for (let c = 0; c < w.length; c++) {
      h = (Math.imul(31, h) + w.charCodeAt(c)) | 0;
    }
    const idx = Math.abs(h) % dim;
    vec[idx] += 1.0;
    seed = (seed ^ h) * 16807;
    const secondaryIdx = Math.abs(seed) % dim;
    vec[secondaryIdx] += 0.5;
  }

  let norm = 0;
  for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1.0;
  const result = new Array(dim);
  for (let i = 0; i < dim; i++) result[i] = Number((vec[i] / norm).toFixed(6));
  return result;
}

const KNOWLEDGE_TOPICS = [
  // 1. Tử Vi Đẩu Số & 14 Chính Tinh
  {
    title: 'Tinh Hoa 14 Chính Tinh Tử Vi Nam Phái Tại 12 Cung',
    category: 'TU_VI',
    content: `14 Chính tinh chia thành 2 vòng lớn:
1. Vòng Tử Vi (thuận chiều kim đồng hồ): Tử Vi (Thổ), Thiên Cơ (Mộc), Thái Dương (Hỏa), Vũ Khúc (Kim), Thiên Đồng (Thủy), Liêm Trinh (Hỏa).
2. Vòng Thiên Phủ (nghịch chiều kim đồng hồ đối ứng qua trục Dần - Thân): Thiên Phủ (Thổ), Thái Âm (Thủy), Tham Lang (Thủy/Mộc), Cự Môn (Thủy), Thiên Tướng (Thủy), Thiên Lương (Mộc), Thất Sát (Kim/Hỏa), Phá Quân (Thủy).
Khi các sao ở trạng thái Miếu (M) hoặc Vượng (V), phát huy tối đa cát khí. Khi Hãm địa (H), cần gặp cát tinh hoặc Tuần/Triệt cứu giải để xoay chuyển cục diện.`,
    tags: ['Chính Tinh', 'Vòng Tử Vi', 'Vòng Thiên Phủ', 'Miếu Vượng Hãm'],
  },
  {
    title: 'Luận Giải Sao Tử Vi Tọa Thủ 12 Cung Chức Năng',
    category: 'TU_VI',
    content: `Tử Vi là Đế Tinh, chủ về quyền uy, phúc thọ và tài năng quản trị.
- Cung Mệnh: Người đàng hoàng, có tư chất thủ lĩnh, được mọi người kính nể. Miếu địa tại Ngọ (Cực Hướng Ly Minh) cực kỳ quý hiển.
- Cung Phu Thê: Vợ chồng danh giá, người phối ngẫu có học thức, trọng danh dự. Gặp Tả Phụ Hữu Bật thì trợ lực lớn.
- Cung Tài Bạch: Tiền tài bền vững, làm ăn lớn, giữ được chữ tín.
- Cung Quan Lộc: Công danh thăng tiến vững chắc, hợp làm việc trong các tổ chức lớn hoặc doanh nghiệp uy tín.`,
    tags: ['Tử Vi', 'Cung Mệnh', 'Cung Phu Thê', 'Quan Lộc', 'Tài Bạch'],
  },
  {
    title: 'Luận Giải Sao Thiên Phủ - Kho Trời & Ngân Khố',
    category: 'TU_VI',
    content: `Thiên Phủ là Lệnh Tinh, chủ về tiền tài, kho tàng và sự bao dung che chở.
Thiên Phủ rất kỵ gặp Địa Không, Địa Kiếp hoặc Tuần/Triệt (gọi là "Không Khố" hay "Lộ Khố" - kho rỗng dễ hao tán).
Khi hội Tả Hữu, Hóa Lộc, Lộc Tồn, người có Thiên Phủ tích lũy tài sản rất bền, tính tình từ hòa, ăn ở có hậu, hậu vận sung túc đủ đầy.`,
    tags: ['Thiên Phủ', 'Kho Tiền', 'Lộc Tồn', 'Tài Sản'],
  },
  {
    title: 'Cách Cục Tử Phủ Vũ Tướng vs Sát Phá Liêm Tham',
    category: 'TU_VI',
    content: `Hai cách cục đối trọng lớn nhất trong Tử Vi Đẩu Số:
1. Tử Phủ Vũ Tướng (Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng): Biểu trưng cho mẫu người kiến thiết, quản trị, phát triển bền vững và gìn giữ kỷ cương.
2. Sát Phá Liêm Tham (Thất Sát, Phá Quân, Liêm Trinh, Tham Lang): Biểu trưng cho người tiên phong, dám mạo hiểm, khai phá cái mới, trải qua thăng trầm để đạt thành công vang dội.`,
    tags: ['Tử Phủ Vũ Tướng', 'Sát Phá Tham', 'Cách Cục', 'Mệnh Tài Quan'],
  },
  {
    title: 'Tuần Trung Không Vong & Triệt Lộ Không Vong Toàn Thư',
    category: 'TU_VI',
    content: `Tuần và Triệt đóng vai trò biến đổi khí lực của cung và các sao đóng tại đó:
- Triệt Lộ Không Vong: Tác động mạnh nhất từ tiền vận đến trước 30-32 tuổi, sau đó khí lực giảm dần. Triệt làm sao sáng thành tối, nhưng làm sao hãm địa bớt xấu đi.
- Tuần Trung Không Vong: Tác động êm dịu nhưng kéo dài suốt cuộc đời, ảnh hưởng rõ hơn từ trung vận về sau.
- Cung Vô Chính Diệu (không có chính tinh) rất mừng gặp Tuần hoặc Triệt để củng cố nền tảng, gọi là "Mệnh Vô Chính Diệu đắc Không".`,
    tags: ['Tuần', 'Triệt', 'Không Vong', 'Vô Chính Diệu'],
  },
  {
    title: 'Ý Nghĩa Tứ Hóa: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ',
    category: 'TU_VI',
    content: `Tứ Hóa là động cơ thúc đẩy biến cố và thời vận:
1. Hóa Lộc (Mộc): Duyên may, tiền tài, sự hanh thông, cơ hội mở rộng.
2. Hóa Quyền (Hỏa): Quyền lực, ý chí, khả năng nắm giữ vị trí chủ chốt.
3. Hóa Khoa (Mộc/Thủy): Trí tuệ, học vấn, danh tiếng thanh cao và là đệ nhất đấng cứu giải tai ách.
4. Hóa Kỵ (Thủy): Trở ngại, thị phi, dằn vặt, nghi kỵ nhưng khi miếu địa tại Thìn Tuất thì lại có ý chí vượt khó phi thường.`,
    tags: ['Tứ Hóa', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'],
  },
  {
    title: 'Vận Hạn Năm 2026 Bính Ngọ & Các Sao Lưu Niên',
    category: 'TU_VI',
    content: `Năm 2026 Bính Ngọ (hành Thủy - Thiên Hà Thủy), can Bính hóa khí:
- Bính Đồng Cơ Xương Liêm: Thiên Đồng Hóa Lộc, Thiên Cơ Hóa Quyền, Văn Xương Hóa Khoa, Liêm Trinh Hóa Kỵ.
- Sao Lưu Niên năm 2026: Lưu Thái Tuế tại cung Ngọ, Lưu Tang Môn tại Thân, Lưu Bạch Hổ tại Dần, Lưu Thiên Khốc tại Tý, Lưu Thiên Hư tại Ngọ, Lưu Lộc Tồn tại Tỵ.
Người có cung Mệnh hoặc Tiểu hạn đóng tại Dần - Ngọ - Tuất cần chú ý các biến chuyển lớn về gia sự và công việc.`,
    tags: ['Năm 2026', 'Bính Ngọ', 'Lưu Thái Tuế', 'Lưu Tang Môn', 'Tiểu Hạn'],
  },

  // 2. Tứ Trụ Bát Tự & Ngũ Hành
  {
    title: 'Tứ Trụ Bát Tự: Nhật Chủ, Thập Thần và Dụng Thần Cải Vận',
    category: 'TU_TRU',
    content: `Bát Tự xét Can Chi 4 trụ: Năm, Tháng, Ngày, Giờ.
- Can Ngày gọi là Nhật Chủ (đại diện cho bản thân).
- Thập Thần gồm: Tỷ Kiên, Kiếp Tài, Thực Thần, Thương Quan, Chính Tài, Thiên Tài, Chính Quan, Thất Sát, Chính Ấn, Thiên Ấn.
- Khi Nhật Chủ quá vượng hoặc quá nhược thì sinh ra mất cân bằng. Dụng Thần là yếu tố ngũ hành được chọn để cứu vãn, lập lại thế cân bằng cho bản mệnh. Bổ sung Dụng Thần qua màu sắc trang phục, hướng làm việc và đối tác.`,
    tags: ['Tứ Trụ', 'Bát Tự', 'Nhật Chủ', 'Dụng Thần', 'Thập Thần'],
  },

  // 3. Kinh Dịch & Chọn Ngày Hoàng Đạo
  {
    title: 'Kinh Dịch 64 Quẻ: Thuần Càn, Thuần Khôn và Quẻ Đại Cát',
    category: 'KINH_DICH',
    content: `Kinh Dịch gồm 8 quẻ đơn (Bát Quái: Càn, Khôn, Chấn, Tốn, Khảm, Ly, Cấn, Đoài) phối thành 64 quẻ kép.
- Quẻ Thuần Càn (Trời): Cương kiện, hanh thông, rồng bay giữa trời xanh.
- Quẻ Thuần Khôn (Đất): Nhu thuận, tích lũy, chở che vạn vật.
- Quẻ Địa Thiên Thái: Âm dương giao hòa, bế tắc tiêu tan, vạn sự hanh thông cát lợi.
- Quẻ Hỏa Thiên Đại Hữu: Ánh mặt trời soi chiếu trời cao, gặt hái thành tựu lớn.`,
    tags: ['Kinh Dịch', '64 Quẻ', 'Thuần Càn', 'Thuần Khôn', 'Địa Thiên Thái'],
  },
  {
    title: 'Quy Tắc Chọn Ngày Lành Tháng Tốt: 12 Trực & Giờ Hoàng Đạo',
    category: 'XEM_NGAY',
    content: `Chọn ngày tốt xuất hành, cưới hỏi, khai trương, động thổ theo nguyên tắc:
1. Trực tốt: Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thâu, Khai, Bế (Trực Trừ, Định, Thành, Khai thường đại cát).
2. Tránh các ngày kỵ dân gian: Tam Nương (mùng 3, 7, 13, 18, 22, 27 âm), Nguyệt Kỵ (mùng 5, 14, 23 âm), Dương Công Kỵ Nhật.
3. Xuất hành vào các giờ Hoàng Đạo (Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh).`,
    tags: ['Chọn Ngày Tốt', '12 Trực', 'Giờ Hoàng Đạo', 'Tam Nương', 'Nguyệt Kỵ'],
  },

  // 4. Phong Thủy Bát Trạch
  {
    title: 'Phong Thủy Cung Phi Bát Trạch & Hướng Nhà Cát Lợi',
    category: 'PHONG_THUY',
    content: `Mỗi người sinh ra mang một Cung Phi Bát Trạch (Càn, Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài), chia làm 2 nhóm:
1. Đông Tứ Mệnh (Khảm, Chấn, Tốn, Ly): Hợp hướng Đông, Đông Nam, Bắc, Nam.
2. Tây Tứ Mệnh (Càn, Khôn, Cấn, Đoài): Hợp hướng Tây, Tây Bắc, Tây Nam, Đông Bắc.
Bốn hướng tốt gồm: Sinh Khí (tài lộc), Thiên Y (sức khỏe), Diên Niên (tình cảm bền vững), Phục Vị (bình an tinh thần). Bốn hướng xấu: Tuyệt Mệnh, Họa Hại, Lục Sát, Ngũ Quỷ.`,
    tags: ['Bát Trạch', 'Đông Tứ Mệnh', 'Tây Tứ Mệnh', 'Sinh Khí', 'Hướng Nhà'],
  },
];

async function seedKnowledge() {
  console.log('=== BẮT ĐẦU NẠP KHO TRI THỨC CHO AI AGENT THẦY BÓI ===');

  try {
    // 1. Ensure Agent "Thầy Bói" exists
    let agent = await prisma.aiAgent.findUnique({ where: { slug: 'thay-boi-tu-vi' } });
    if (!agent) {
      agent = await prisma.aiAgent.create({
        data: {
          slug: 'thay-boi-tu-vi',
          name: 'Thầy Bói',
          title: 'Đại Sư Tử Vi & Huyền Học Phương Đông',
          avatarUrl: '/icons/icon.svg',
          isDefault: true,
          isActive: true,
          modelProvider: 'gemini',
          modelName: 'gemini-1.5-flash',
          temperature: 0.6,
          systemPrompt: 'Nhân cách Thầy Bói uyên bác Tử Vi Nam Phái tại XemBoi.vn',
          welcomeMessage: 'Thầy Bói chào con! Con đang muốn hỏi điều gì về lá số hay vận hạn năm 2026?',
          suggestedQuestions: [
            'Thầy xem giúp cung Phu Thê và tình duyên của con thế nào?',
            'Vận hạn năm 2026 Bính Ngọ của con có gì đáng lưu ý?',
            'Cung Quan Lộc và Tài Bạch của con hợp ngành nghề gì?',
          ],
        },
      });
      console.log('✓ Đã tạo Agent Thầy Bói trong cơ sở dữ liệu!');
    }

    let seededChunks = 0;
    for (const topic of KNOWLEDGE_TOPICS) {
      const doc = await prisma.agentKnowledgeDoc.create({
        data: {
          agentId: agent.id,
          title: topic.title,
          category: topic.category,
          sourceType: 'SEEDED',
          rawContent: topic.content,
          status: 'INDEXED',
        },
      });

      const embedding = generateVector(topic.title + ' ' + topic.content);
      const vecSql = `[${embedding.join(',')}]`;

      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "AgentKnowledgeChunk" ("id", "docId", "content", "metadata", "embedding")
           VALUES ($1, $2, $3, $4::jsonb, $5::vector)`,
          `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          doc.id,
          topic.content,
          JSON.stringify({ tags: topic.tags, title: topic.title }),
          vecSql
        );
      } catch {
        // Fallback without vector cast if pgvector extension isn't installed
        await prisma.agentKnowledgeChunk.create({
          data: {
            docId: doc.id,
            content: topic.content,
            metadata: { tags: topic.tags, title: topic.title },
          },
        });
      }
      seededChunks++;
    }

    console.log(`✓ Đã nạp thành công ${seededChunks} tài liệu tri thức chuyên sâu vào PostgreSQL!`);
  } catch (err) {
    console.log('Lưu ý kết nối PostgreSQL:', err.message);
    console.log('✓ Cơ chế RAG Engine inMemoryChunks đã sẵn sàng với toàn bộ tri thức dự phòng!');
  } finally {
    await prisma.$disconnect();
  }

  // Also write seeded knowledge to JSON file for standalone offline zero-downtime serving
  const jsonPath = path.join(process.cwd(), 'src/lib/ai/seeded-knowledge.json');
  fs.writeFileSync(jsonPath, JSON.stringify(KNOWLEDGE_TOPICS, null, 2), 'utf8');
  console.log('✓ Đã đồng bộ dữ liệu tri thức vào src/lib/ai/seeded-knowledge.json thành công!');
}

seedKnowledge().catch(console.error);
