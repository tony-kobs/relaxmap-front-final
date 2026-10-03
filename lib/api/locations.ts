import { cache } from 'react';
import type { Location } from '@/types/location';

/**
 * Спільний хелпер для Server Components сторінки деталей локації
 * (LocationInfoBlock, LocationGallery, LocationDescription) та сторінки
 * редагування. `cache()` з 'react' дедуплікує однакові виклики
 * getLocationById(id) в межах одного запиту/рендеру — реальний fetch
 * піде лише один раз, навіть якщо кілька компонентів викличуть хелпер
 * з тим самим id.
 */
export const getLocationById = cache(
  async (id: string): Promise<Location | null> => {
    try {
      const baseUrl = process.env.BACKEND_URL;
      const res = await fetch(`${baseUrl}/locations/${id}`, {
        cache: 'no-store',
      });

      if (!res.ok) return null;

      const json = await res.json();
      return json?.data ?? json;
    } catch {
      return null;
    }
  },
);
