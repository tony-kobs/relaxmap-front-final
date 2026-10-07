import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/seo';

export const revalidate = 3600;

const PAGE_LIMIT = 100;
const MAX_PAGES = 20;

type LocationsPage = {
  data?: { _id: string; updatedAt?: string }[];
  totalPages?: number;
};

async function getLocationEntries(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) return [];

  const entries: MetadataRoute.Sitemap = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const res = await fetch(
        `${baseUrl}/locations?page=${page}&limit=${PAGE_LIMIT}`,
        { next: { revalidate } },
      );
      if (!res.ok) break;

      const json: LocationsPage = await res.json();
      for (const location of json.data ?? []) {
        entries.push({
          url: `${SITE_URL}/locations/${location._id}`,
          lastModified: location.updatedAt
            ? new Date(location.updatedAt)
            : undefined,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }

      if (!json.totalPages || page >= json.totalPages) break;
    }
  } catch {
    // Бекенд недоступний: віддаємо лише статичні сторінки.
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    {
      url: `${SITE_URL}/locations`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    { url: `${SITE_URL}/login`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/register`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [...staticEntries, ...(await getLocationEntries())];
}
