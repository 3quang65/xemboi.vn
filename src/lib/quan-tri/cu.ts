// Cầu nối cho khu quản trị cũ (/admin, /api/admin, /api/r1/quan-tri) trong lúc chuyển sang tài khoản.
import { kiemAdminKey } from '@/lib/r1/admin-auth';
import { nguoiDungCuaRequest } from './phien';
import { coQuyen, type Quyen } from './quyen';

/**
 * Hợp lệ khi phiên tài khoản có quyền `quyen`, hoặc có ADMIN_KEY đúng (khóa khẩn cấp, tắt bằng CHO_PHEP_ADMIN_KEY=0).
 * Trả về Response 401/403 để trả ngay, hoặc null nếu hợp lệ.
 */
export async function yeuCauQuanTri(req: Request, quyen: Quyen = 'khach_hang.xem'): Promise<Response | null> {
  const nd = await nguoiDungCuaRequest(req);
  if (nd) {
    if (coQuyen(nd.vaiTro, quyen)) return null;
    return Response.json({ ok: false, error: 'Không đủ quyền' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }
  return kiemAdminKey(req);
}
