// Các URL công khai đang chạy từ v1 (trước khi có SeoTrang cho chúng). Giữ trong sitemap nhóm "hien-tai"
// tới khi từng trang được đưa vào SeoTrang; URL nào đã có trong SeoTrang thì bỏ ở đây để không trùng.
import { CMS_ARTICLES } from '@/lib/core/cms-data';

const CAN_SLUGS = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy'];
const CHI_SLUGS = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'];

export type UrlCu = { duong: string; doi: 'daily' | 'weekly' | 'monthly'; uuTien: number };

export function urlHienTai(): UrlCu[] {
  const ds: UrlCu[] = [
    { duong: '/', doi: 'daily', uuTien: 1.0 },
    { duong: '/tu-vi-hom-nay', doi: 'daily', uuTien: 0.9 },
    { duong: '/tu-vi-ngay-mai', doi: 'daily', uuTien: 0.9 },
    { duong: '/tu-vi-tron-doi', doi: 'weekly', uuTien: 0.9 },
    { duong: '/tu-tru', doi: 'weekly', uuTien: 0.85 },
    { duong: '/boi-dich', doi: 'weekly', uuTien: 0.85 },
    { duong: '/kien-thuc', doi: 'weekly', uuTien: 0.85 },
  ];
  for (const chi of CHI_SLUGS) {
    ds.push({ duong: `/tu-vi-hom-nay/tuoi-${chi}`, doi: 'daily', uuTien: 0.8 });
    ds.push({ duong: `/tu-vi-ngay-mai/tuoi-${chi}`, doi: 'daily', uuTien: 0.8 });
  }
  for (let i = 0; i < 60; i++) {
    const base = `/tu-vi-tron-doi/tuoi-${CAN_SLUGS[(i + 6) % 10]}-${CHI_SLUGS[i % 12]}`;
    ds.push({ duong: base, doi: 'monthly', uuTien: 0.75 });
    ds.push({ duong: `${base}-nam-mang`, doi: 'monthly', uuTien: 0.7 });
    ds.push({ duong: `${base}-nu-mang`, doi: 'monthly', uuTien: 0.7 });
  }
  for (const art of CMS_ARTICLES) ds.push({ duong: `/bai-viet/${art.slug}`, doi: 'monthly', uuTien: 0.75 });
  return ds;
}
