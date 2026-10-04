import type { LocationQuery } from '@/types/location';

/** Розмір сторінки каталогу / сітки локацій профілю. */
export const LOCATIONS_PAGE_SIZE = 9;

/** Спільний queryKey для LocationsGrid і сторінки профілю (один кеш React Query). */
export function locationsQueryKey(
  userId?: string,
  filters: LocationQuery = {},
) {
  return ['locations', userId ?? 'all', filters] as const;
}
