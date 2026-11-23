// Ba API chat thời v1 (/api/hoi-thay, /api/chat/stream, /api/chat/council) không còn giao diện nào gọi tới.
// Chúng chưa có xác thực, chưa giới hạn lượt, vẫn gọi mô hình và còn đoạn mẫu trái định vị docs/v2/04
// ("vật phẩm", "cải vận", "hóa giải"). Tắt mặc định cho tới khi làm lại phần chat trả phí.
// Bật lại để thử ở máy trạm: BAT_CHAT_CU=1.

export const chatCuDangBat = () => process.env.BAT_CHAT_CU === '1';

/** Trả 410 khi chat cũ đang tắt; null khi được phép chạy tiếp. */
export function chanChatCu(): Response | null {
  if (chatCuDangBat()) return null;
  return new Response(JSON.stringify({ error: 'API này đã ngừng.' }), {
    status: 410,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
