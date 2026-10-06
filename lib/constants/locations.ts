import type { LocationQuery } from '@/types/location';

/** Порція «Показати ще» в каталозі (мобільний і десктоп 3×3). */
export const LOCATIONS_PAGE_SIZE = 9;

/** Каталог на планшеті (2 колонки): 6 карток, далі по 6. */
export const LOCATIONS_PAGE_SIZE_TABLET = 6;

/** Планшет — між брейкпоінтами 768 і 1440 у LocationsGrid.module.css. */
export const LOCATIONS_TABLET_MEDIA =
  '(min-width: 768px) and (max-width: 1439.98px)';

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
