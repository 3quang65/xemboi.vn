import { NextResponse } from 'next/server';
import { TuVi } from '@/lib/core/tuvi';
import { streamChatResponse } from '@/lib/ai/rag-engine';
import { routeFollowupToMaster } from '@/lib/ai/council-orchestrator';
import { addInquiry } from '@/lib/ai/customer-inquiry-service';

function detectInquiryCategory(question: string): { category: string; categoryName: string } {
  const q = question.toLowerCase();
  if (q.includes('vợ') || q.includes('chồng') || q.includes('yêu') || q.includes('tình duyên') || q.includes('kết hôn') || q.includes('ly hôn')) {
    return { category: 'TINH_DUYEN', categoryName: 'Tình Duyên & Hôn Nhân' };
  }
  if (q.includes('tiền') || q.includes('tài lộc') || q.includes('đầu tư') || q.includes('chứng khoán') || q.includes('kinh doanh') || q.includes('nợ')) {
    return { category: 'TAI_LOC', categoryName: 'Tài Lộc & Đầu Tư' };
  }
  if (q.includes('việc') || q.includes('công danh') || q.includes('thăng tiến') || q.includes('nhảy việc') || q.includes('thi cử')) {
    return { category: 'CONG_DANH', categoryName: 'Công Danh & Sự Nghiệp' };
  }
  if (q.includes('nhà') || q.includes('hướng') || q.includes('phong thủy') || q.includes('bếp') || q.includes('đất')) {
    return { category: 'PHONG_THUY', categoryName: 'Phong Thủy Bát Trạch' };
  }
  if (q.includes('con') || q.includes('sinh con') || q.includes('gia đạo') || q.includes('bố mẹ')) {
    return { category: 'GIA_DAO_CON_CAI', categoryName: 'Gia Đạo & Con Cái' };
  }
  if (q.includes('mơ') || q.includes('tâm linh') || q.includes('âm đức') || q.includes('phóng sinh') || q.includes('vận hạn')) {
    return { category: 'TAM_LINH_GIAI_HAN', categoryName: 'Tâm Linh & Tu Tâm Cải Mệnh' };
  }
  return { category: 'VAN_HAN', categoryName: 'Vận Hạn Năm Hiện Tại' };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Phản hồi trạng thái xem trước phiên hỏi từ client
    if (body.xem) {
      return NextResponse.json({
        ok: true,
        tinNhan: [],
        conLai: 10,
      });
    }

    const cauHoi: string = (body.cauHoi || body.question || '').trim();
    if (!cauHoi) {
      return NextResponse.json({
        ok: true,
        traLoi: 'Thầy lắng nghe đây, con muốn hỏi thầy về điều gì?',
        answer: 'Thầy lắng nghe đây, con muốn hỏi thầy về điều gì?',
        conLai: 10,
      });
    }

    // 2. Phục hồi hoặc an lá số từ sinh data hoặc laSo payload
    let ls = body.laSo || body.ls;
    const sinh = body.sinh;
    if (!ls && sinh) {
      try {
        ls = TuVi.anLaSo({
          lich: sinh.amLich ? 'am' : 'duong',
          ten: sinh.ten || 'Quý gia chủ',
          ngay: Number(sinh.ngay || 1),
          thang: Number(sinh.thang || 1),
          nam: Number(sinh.nam || 1990),
          gio: Number(sinh.gio ?? 6),
          gioiTinh: sinh.gioiTinh === 'nu' || sinh.gioiTinh === 'Nữ' ? 'nu' : 'nam',
          namXem: Number(sinh.xemNam || 2026),
        });
      } catch (err) {
        console.warn('TuVi.anLaSo in hoi-thay failed:', err);
      }
    }

    // 3. Tự động điều hướng câu hỏi đến Danh Sư phù hợp nhất
    const routedMasters = routeFollowupToMaster(cauHoi, ['thay-minh-triet', 'thay-thai-son']);
    const chosenMasterSlug = body.agentSlug || routedMasters[0]?.slug || 'thay-minh-triet';

    // 4. Lưu câu hỏi vào Ngân hàng Inquiry của Khách Hàng để Ban Quản Trị theo dõi
    try {
      const cat = detectInquiryCategory(cauHoi);
      addInquiry({
        question: cauHoi,
        category: cat.category,
        categoryName: cat.categoryName,
        userPersona: ls?.ten ? `Gia chủ ${ls.ten}` : 'Khách hỏi trực tiếp tại Lá Số',
        source: 'HOI_THAY_SINGLE_AGENT',
      });
    } catch {
      // Bỏ qua lỗi ghi log
    }

    // 5. Khởi tạo generator hội thoại tự nhiên từ RAG & LLM Engine
    const generator = streamChatResponse({
      userMessage: cauHoi,
      conversationHistory: [],
      chartData: ls,
      agentSlug: chosenMasterSlug,
    });

    // 6. Kiểm tra xem caller là app-main.js (truyền phien/sinh) để streaming NDJSON
    const isStreamingClient = Boolean(body.phien || body.sinh || body.stream);

    if (isStreamingClient) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let fullText = '';
            for await (const chunk of generator) {
              fullText += chunk;
              controller.enqueue(encoder.encode(JSON.stringify({ them: chunk }) + '\n'));
            }
            controller.enqueue(
              encoder.encode(JSON.stringify({ xong: true, text: fullText, conLai: 9 }) + '\n')
            );
            controller.close();
          } catch (err: any) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  xong: true,
                  loi: 'Thầy đang xem vận, con bình tâm hỏi lại sau nhé.',
                }) + '\n'
              )
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
        },
      });
    }

    // 7. REST non-streaming fallback cho test / standard JSON API
    let fullText = '';
    for await (const chunk of generator) {
      fullText += chunk;
    }

    return NextResponse.json({
      ok: true,
      traLoi: fullText,
      answer: fullText,
      agentSlug: chosenMasterSlug,
      conLai: 9,
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: true,
      traLoi: 'Thầy khuyên con hãy giữ tâm bình thản, làm việc lành và kiên tâm vượt qua khúc quanh này.',
      answer: 'Thầy khuyên con hãy giữ tâm bình thản, làm việc lành và kiên tâm vượt qua khúc quanh này.',
      conLai: 9,
    });
  }
}
