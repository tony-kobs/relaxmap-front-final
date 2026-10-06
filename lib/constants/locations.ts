import type { LocationQuery } from '@/types/location';

/** Порція «Показати ще» в каталозі на десктопі (3×3). */
export const LOCATIONS_PAGE_SIZE = 9;

/** Каталог на планшеті (2 колонки) і мобільному: 6 карток, далі по 6. */
export const LOCATIONS_PAGE_SIZE_COMPACT = 6;

/** Десктоп — брейкпоінт 1440 у LocationsGrid.module.css. */
export const LOCATIONS_DESKTOP_MEDIA = '(min-width: 1440px)';

/** Спільний queryKey для LocationsGrid і сторінки профілю (один кеш React Query). */
export function locationsQueryKey(
  userId?: string,
  filters: LocationQuery = {},
) {
  return ['locations', userId ?? 'all', filters] as const;
}

/** Рейтинг на сторінці локації. Окремий ключ: списки живуть під `locations`. */
export function locationDetailsQueryKey(locationId: string) {
  return ['location', locationId] as const;
}
