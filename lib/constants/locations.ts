import type { LocationQuery } from '@/types/location';

/**
 * Десктопний каталог (3×3) і порція «Показати ще» на профілі.
 * Поріг десктопу — `LOCATIONS_DESKTOP_MEDIA`, той самий, що в сітці.
 */
export const LOCATIONS_PAGE_SIZE = 9;

/** Каталог на планшеті (2×4) і мобільному (1×8): 8 карток на сторінку. */
export const LOCATIONS_PAGE_SIZE_COMPACT = 8;

/** Збігається з `@media (min-width: 1440px)` у LocationsGrid.module.css. */
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

/** Профіль: 6 карток (3×2 на десктопі), далі «Показати ще» по 6. */
export const LOCATIONS_PROFILE_PAGE_SIZE = 6;
