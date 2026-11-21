import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { GOC_SITE } from '@/lib/seo/sitemap';

// Luật robots đọc từ CaiDat khóa "ROBOTS" ({ allow?: string[], disallow?: string[] }); khu quản trị luôn bị chặn.
export const revalidate = 300;

const LUON_CHAN = ['/quan-tri', '/admin', '/api/'];

export default async function robots(): Promise<MetadataRoute.Robots> {
  let allow: string[] = ['/'];
  let disallow: string[] = [];
  try {
    const cd = await prisma.caiDat.findUnique({ where: { khoa: 'ROBOTS' } });
    const g = (cd?.giaTri ?? {}) as { allow?: unknown; disallow?: unknown };
    if (Array.isArray(g.allow)) allow = g.allow.filter((x): x is string => typeof x === 'string');
    if (Array.isArray(g.disallow)) disallow = g.disallow.filter((x): x is string => typeof x === 'string');
  } catch { /* CSDL lỗi: dùng mặc định */ }
  return {
    rules: [{ userAgent: '*', allow, disallow: [...new Set([...LUON_CHAN, ...disallow])] }],
    sitemap: `${GOC_SITE}/sitemap.xml`,
  };
}
