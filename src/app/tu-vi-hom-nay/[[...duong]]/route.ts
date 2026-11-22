// Trang v1 đã gỡ hẳn (docs/v2/viec-can-anh mục 6.3): trả 410 để máy tìm kiếm bỏ khỏi chỉ mục.
const goBo = () => new Response('Trang này đã bị gỡ.', { status: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
export const GET = goBo;
export const HEAD = goBo;
