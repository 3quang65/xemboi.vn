import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Lúc `next build`, mỗi tiến trình con sinh trang tĩnh mở một bể kết nối riêng; với bể mặc định
 * (số CPU × 2 + 1) tổng số kết nối vượt `max_connections` của Postgres và truy vấn lỗi hàng loạt.
 * Khi build chỉ dùng 1 kết nối mỗi tiến trình, chờ lâu hơn thay vì báo lỗi.
 */
function urlKhiBuild(): string | undefined {
  const goc = process.env.DATABASE_URL;
  if (!goc || process.env.NEXT_PHASE !== 'phase-production-build') return undefined;
  const u = new URL(goc);
  u.searchParams.set('connection_limit', '1');
  u.searchParams.set('pool_timeout', '120');
  return u.toString();
}

const urlBuild = urlKhiBuild();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    ...(urlBuild ? { datasourceUrl: urlBuild } : {}),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export default prisma;

/**
 * Trang công khai bắt lỗi CSDL để vẫn hiện được lúc chạy. Riêng lúc build thì ném lại lỗi:
 * nuốt lỗi khi build sẽ nướng dữ liệu rỗng (hoặc 404) vào trang tĩnh.
 */
export function nemLoiKhiBuild(e: unknown): void {
  if (process.env.NEXT_PHASE === 'phase-production-build') throw e;
}
