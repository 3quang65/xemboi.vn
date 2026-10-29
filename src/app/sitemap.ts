import type { MetadataRoute } from 'next';
import { CMS_ARTICLES } from '@/lib/core/cms-data';

const CAN_SLUGS = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy'];
const CHI_SLUGS = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://xemboi.vn';
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tu-vi-hom-nay`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tu-vi-ngay-mai`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tu-vi-tron-doi`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tu-tru`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/boi-dich`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/kien-thuc`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
  ];

  for (const chi of CHI_SLUGS) {
    routes.push({
      url: `${baseUrl}/tu-vi-hom-nay/tuoi-${chi}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });
    routes.push({
      url: `${baseUrl}/tu-vi-ngay-mai/tuoi-${chi}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  for (let i = 0; i < 60; i++) {
    const cSlug = CAN_SLUGS[(i + 6) % 10];
    const hSlug = CHI_SLUGS[i % 12];
    const base = `${baseUrl}/tu-vi-tron-doi/tuoi-${cSlug}-${hSlug}`;
    routes.push({ url: base, lastModified: now, changeFrequency: 'monthly', priority: 0.75 });
    routes.push({ url: `${base}-nam-mang`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    routes.push({ url: `${base}-nu-mang`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
  }

  for (const art of CMS_ARTICLES) {
    routes.push({
      url: `${baseUrl}/bai-viet/${art.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  return routes;
}
