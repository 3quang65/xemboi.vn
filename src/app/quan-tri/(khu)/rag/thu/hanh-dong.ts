'use server';
// Server action lưu kết quả thử truy vấn thành câu hỏi chuẩn (không sửa rag/hanh-dong.ts, không viết SQL thô).
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { dieuKienPhamVi, phanTichBigInt } from '@/lib/rag/pham-vi';

const DS_MANG = new Set(['tu-vi', 'kinh-dich', 'bat-tu', 'chon-ngay', 'phong-thuy', 'ngu-hanh']);
const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function locQuayVe(raw: string): string {
  if (raw && raw.startsWith('/quan-tri/rag/thu') && !raw.startsWith('//')) return raw;
  return '/quan-tri/rag/thu';
}

function veLai(duong: string, loi: string): never {
  const u = new URL(duong, 'http://localhost');
  u.searchParams.delete('bao');
  u.searchParams.set('loi', loi);
  redirect(`${u.pathname}${u.search}`);
}

export async function luuCauHoiChuan(f: FormData) {
  const nd = await yeuCauQuyen('rag.sua_doan');
  const quayVe = locQuayVe(chu(f, 'quayVe'));
  const cauHoi = chu(f, 'cauHoi');
  const mang = chu(f, 'mang');
  const viTriDung = chu(f, 'viTriDung');
  const ghiChu = chu(f, 'ghiChu');

  if (!cauHoi) veLai(quayVe, 'Câu hỏi không được để trống');
  if (cauHoi.length > 500) veLai(quayVe, 'Câu hỏi tối đa 500 ký tự');
  if (!DS_MANG.has(mang)) veLai(quayVe, 'Mảng không hợp lệ');
  if (ghiChu.length > 1000) veLai(quayVe, 'Ghi chú tối đa 1.000 ký tự');

  const rawDoanIds = f.getAll('doanId').map((x) => String(x));
  const doanIds: bigint[] = [];
  const daCo = new Set<string>();
  for (const s of rawDoanIds) {
    const idBig = phanTichBigInt(s);
    if (idBig === null) continue;
    const str = String(idBig);
    if (!daCo.has(str)) {
      daCo.add(str);
      doanIds.push(idBig);
    }
  }

  if (doanIds.length < 1) veLai(quayVe, 'Phải chọn ít nhất 1 đoạn đúng');
  if (doanIds.length > 10) veLai(quayVe, 'Chỉ được chọn tối đa 10 đoạn');

  const kq = await prisma.$transaction(async (tx) => {
    const doanRows = await tx.ragDoan.findMany({
      where: { AND: [{ id: { in: doanIds } }, dieuKienPhamVi(nd)] },
      select: { id: true, nguon: { select: { ma: true } } },
    });
    if (doanRows.length !== doanIds.length) {
      return { ok: false as const, loi: 'Một hoặc nhiều đoạn đã chọn không tồn tại hoặc không thuộc phạm vi được phép' };
    }

    const nguonDungMa = Array.from(new Set(doanRows.map((d) => d.nguon.ma)));
    const maCu = await tx.ragCauHoiChuan.findMany({
      where: { id: { startsWith: 'G' } },
      select: { id: true },
    });
    let maxSo = 0;
    for (const r of maCu) {
      const m = /^G(\d{6})$/.exec(r.id);
      if (m) maxSo = Math.max(maxSo, Number(m[1]));
    }
    const idMoi = `G${String(maxSo + 1).padStart(6, '0')}`;

    const sau = await tx.ragCauHoiChuan.create({
      data: {
        id: idMoi,
        cauHoi,
        mang,
        doanDung: doanIds,
        nguonDungMa,
        viTriDung: viTriDung || null,
        ghiChu: ghiChu || null,
        taoBoiId: nd.id,
      },
    });

    await ghiNhatKy(
      tx,
      nd,
      'rag.cau_hoi_chuan',
      'RagCauHoiChuan',
      sau.id,
      null,
      {
        id: sau.id,
        cauHoi: sau.cauHoi,
        mang: sau.mang,
        doanDung: sau.doanDung.map(String),
        nguonDungMa: sau.nguonDungMa,
        viTriDung: sau.viTriDung,
        ghiChu: sau.ghiChu,
        taoBoiId: sau.taoBoiId,
      },
    );

    return { ok: true as const, id: sau.id };
  });

  if (!kq.ok) veLai(quayVe, kq.loi);

  revalidatePath('/quan-tri/rag/danh-gia');
  redirect(`/quan-tri/rag/danh-gia?tab=cau-hoi&bao=${encodeURIComponent(`Đã lưu câu hỏi chuẩn ${kq.id}`)}`);
}
