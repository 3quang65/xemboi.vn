// AI soạn bản nháp (docs/v2/17 mục 2.3, Đợt 2b). AI chỉ viết NHÁP: tạo một phiên bản nguonTao 'AI', không bao giờ duyệt hay xuất bản.
// Luồng: đoạn công khai (taoNguCanhAi) → 9router, việc "soan" → kiểm trích dẫn → lưu phiên bản + trích dẫn + AiSoanViec + nhật ký.
// Bản nháp sai trích dẫn vẫn được lưu để biên tập sửa, nhưng việc ghi KHONG_DAT_TRICH_DAN và lỗi Chặn nằm trong kiemTra.
import type { LoaiNoiDung, Prisma, PrismaClient, TrangThaiNoiDung } from '@prisma/client';
import { goiLlm, docCauHinhLlm, type KetQuaGoi } from '@/lib/ai/cau-hinh-llm';
import { ghiNhatKy, type NguoiDung } from '@/lib/quan-tri/phien';
import { KHOI, type KhoiMuc, type MaKhoi } from './khoi';
import { CHI_DAN_AI, taoNguCanhAi } from './ngu-canh-ai';
import { trangThaiSauKhiLuu } from './quy-trinh';
import { kiemTrichDan } from './trich-dan';

export const DUOC_AI_SOAN: TrangThaiNoiDung[] = ['NHAP', 'AI_SOAN', 'BIEN_TAP', 'CAN_SUA', 'CAN_CAP_NHAT'];
const TOI_DA_DOAN = 40;

type GoiLlm = typeof goiLlm;
export type KetQuaAiSoan =
  | { ok: true; phienBanId: string; so: number; viecId: string; datTrichDan: boolean; soLoi: number; biLoai: string[] }
  | { ok: false; loi: string; viecId?: string; biLoai?: string[] };

const MA_KHOI = KHOI.map((k) => k.ma as MaKhoi);

/** Lời nhắc người dùng: khuôn JSON phụ thuộc loại nội dung. */
export function taoLoiNhac(loai: LoaiNoiDung, tieuDe: string, yeuCau: string, nguCanh: string): string {
  const khuon = loai === 'MUC_TU_DIEN'
    ? `Trả về DUY NHẤT một đối tượng JSON {"khoi": {${MA_KHOI.map((k) => `"${k}": "markdown"`).join(', ')}}}.\n` +
      KHOI.map((k) => `- ${k.ma}: ${k.ten}`).join('\n') +
      '\nKhối nào nguồn không đủ thì để chuỗi rỗng. Khối 3 bắt buộc mỗi đoạn văn có mã [D:số].'
    : 'Trả về DUY NHẤT một đối tượng JSON {"than": "markdown"}.';
  return [
    `Đề mục: ${tieuDe}`,
    yeuCau ? `Yêu cầu của biên tập: ${yeuCau}` : '',
    khuon,
    'Các đoạn nguồn (chỉ được dùng những đoạn này, ghi đúng mã):',
    nguCanh,
  ].filter(Boolean).join('\n\n');
}

/** Đọc JSON trả về (chịu được rào ```json và chữ thừa quanh đối tượng). */
export function docKetQua(loai: LoaiNoiDung, vanBan: string): { khoi?: KhoiMuc; than?: string } | null {
  const s = vanBan.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
  const dau = s.indexOf('{');
  const cuoi = s.lastIndexOf('}');
  if (dau < 0 || cuoi <= dau) return null;
  let j: unknown;
  try { j = JSON.parse(s.slice(dau, cuoi + 1)); } catch { return null; }
  const o = j as { khoi?: Record<string, unknown>; than?: unknown };
  if (loai === 'MUC_TU_DIEN') {
    if (!o.khoi || typeof o.khoi !== 'object') return null;
    const khoi: KhoiMuc = {};
    for (const k of MA_KHOI) if (typeof o.khoi[k] === 'string' && (o.khoi[k] as string).trim()) khoi[k] = (o.khoi[k] as string).trim();
    return Object.keys(khoi).length ? { khoi } : null;
  }
  return typeof o.than === 'string' && o.than.trim() ? { than: o.than.trim() } : null;
}

export async function aiSoanNhap(
  db: PrismaClient,
  nd: NguoiDung,
  vao: { noiDungId: string; maDoan: (string | number | bigint)[]; yeuCau?: string },
  goi: GoiLlm = goiLlm,
): Promise<KetQuaAiSoan> {
  const noiDung = await db.noiDung.findUnique({ where: { id: vao.noiDungId }, select: { id: true, loai: true, tieuDe: true, trangThai: true } });
  if (!noiDung) return { ok: false, loi: 'Không tìm thấy nội dung' };
  if (!DUOC_AI_SOAN.includes(noiDung.trangThai)) return { ok: false, loi: `Trạng thái ${noiDung.trangThai} không cho AI soạn (đang chờ duyệt hoặc đã duyệt)` };
  const ma = [...new Set(vao.maDoan.map(String))].slice(0, TOI_DA_DOAN);
  const ng = await taoNguCanhAi(db, ma);
  if (!ng.doan.length) return { ok: false, loi: 'Không có đoạn công khai nào trong danh sách mã đã chọn', biLoai: ng.biLoai };
  const yeuCau = (vao.yeuCau ?? '').trim().slice(0, 2000);
  const ch = await docCauHinhLlm();

  const viec = await db.aiSoanViec.create({
    data: {
      noiDungId: noiDung.id, yeuCau: { yeuCau, maDoan: ma }, doanDaGui: ng.doan.map((d) => BigInt(d.id)),
      nhaCungCap: '9router', moHinh: ch.moHinh.soan, trangThai: 'CHO', taoBoiId: nd.id,
    },
  });

  const kq: KetQuaGoi = await goi('soan', [
    { role: 'system', content: CHI_DAN_AI },
    { role: 'user', content: taoLoiNhac(noiDung.loai, noiDung.tieuDe, yeuCau, ng.vanBan) },
  ], { cauHinh: ch, maxTokens: 8000, hetGioMs: 300_000 });

  const ketThucLoi = async (loi: string, them: Partial<Prisma.AiSoanViecUpdateInput> = {}) => {
    await db.$transaction(async (tx) => {
      await tx.aiSoanViec.update({ where: { id: viec.id }, data: { trangThai: 'LOI', loi: loi.slice(0, 2000), xongLuc: new Date(), ...them } });
      await ghiNhatKy(tx, nd, 'nd.ai_soan_loi', 'NoiDung', noiDung.id, undefined, { viecId: viec.id, loi: loi.slice(0, 300) });
    });
    return { ok: false as const, loi, viecId: viec.id, biLoai: ng.biLoai };
  };
  if (!kq.ok) return ketThucLoi(`Gọi mô hình thất bại: ${kq.loi}`);
  const token = { tokenVao: kq.tokenVao ?? null, tokenRa: kq.tokenRa ?? null, moHinh: kq.moHinh, chiPhiUocVnd: 0 };
  const noi = docKetQua(noiDung.loai, kq.vanBan);
  if (!noi) return ketThucLoi('Mô hình không trả đúng khuôn JSON', token);

  const trichDan = kiemTrichDan({ ...noi, doanDaGui: ng.doan });
  const nguonCuaDoan = new Map(
    (await db.ragDoan.findMany({ where: { id: { in: trichDan.maHopLe.map((m) => BigInt(m.doanId)) } }, select: { id: true, nguonId: true } }))
      .map((d) => [String(d.id), d.nguonId]),
  );
  const soLoiChan = trichDan.loi.filter((l) => l.muc === 'CHAN').length;

  const pb = await db.$transaction(async (tx) => {
    const cu = await tx.noiDungPhienBan.aggregate({ where: { noiDungId: noiDung.id }, _max: { so: true } });
    const so = (cu._max.so ?? 0) + 1;
    const p = await tx.noiDungPhienBan.create({
      data: {
        noiDungId: noiDung.id, so, nguonTao: 'AI', taoBoiId: nd.id, aiViecId: viec.id,
        khoi: (noi.khoi ?? undefined) as Prisma.InputJsonValue | undefined, than: noi.than ?? null,
        kiemTra: { trichDan: { dat: trichDan.dat, loi: trichDan.loi, soMaHopLe: trichDan.maHopLe.length } } as Prisma.InputJsonValue,
        ghiChu: `AI soạn (${kq.moHinh}) từ ${ng.doan.length} đoạn${yeuCau ? `: ${yeuCau.slice(0, 200)}` : ''}`,
      },
    });
    if (trichDan.maHopLe.length) {
      await tx.noiDungTrichDan.createMany({
        data: trichDan.maHopLe.map((m) => ({
          phienBanId: p.id, khoi: m.khoi ? Number(m.khoi.slice(1)) : null, doanId: BigInt(m.doanId),
          nguonId: nguonCuaDoan.get(m.doanId) ?? null, kieu: 'TOM_Y' as const,
        })),
      });
    }
    const trangThaiMoi = trangThaiSauKhiLuu(noiDung.trangThai, 'AI');
    if (trangThaiMoi !== noiDung.trangThai) await tx.noiDung.update({ where: { id: noiDung.id }, data: { trangThai: trangThaiMoi } });
    await tx.aiSoanViec.update({
      where: { id: viec.id },
      data: { ...token, trangThai: trichDan.dat ? 'XONG' : 'KHONG_DAT_TRICH_DAN', loi: trichDan.dat ? null : `${soLoiChan} lỗi trích dẫn mức Chặn`, xongLuc: new Date() },
    });
    await ghiNhatKy(tx, nd, 'nd.ai_soan', 'NoiDung', noiDung.id, { trangThai: noiDung.trangThai }, {
      trangThai: trangThaiMoi, phienBanId: p.id, so, viecId: viec.id, soDoan: ng.doan.length, datTrichDan: trichDan.dat, ...token,
    });
    return p;
  });

  return { ok: true, phienBanId: pb.id, so: pb.so, viecId: viec.id, datTrichDan: trichDan.dat, soLoi: trichDan.loi.length, biLoai: ng.biLoai };
}
