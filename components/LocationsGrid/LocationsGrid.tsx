'use client';
// Власник: Каталог
import { useEffect, useRef } from 'react';
import LocationCard from '@/components/LocationCard/LocationCard';
import { useAuthStore } from '@/lib/store/authStore';
import { useSearchParams } from 'next/navigation';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { nextServer } from '@/lib/api/api';
import Loader from '@/components/Loader/Loader';
import {
  LOCATIONS_PAGE_SIZE,
  LOCATIONS_PROFILE_PAGE_SIZE,
  locationsQueryKey,
} from '@/lib/constants/locations';
import type { Location, LocationQuery, Paginated } from '@/types/location';
import css from './LocationsGrid.module.css';

const DEFAULT_SORT = 'popular';

type LocationsGridProps = {
  userId?: string;
};

async function fetchPage(
  page: number,
  filters: LocationQuery,
  userId?: string,
) {
  const url = userId ? `/users/${userId}/locations` : '/locations';
  const params = userId
    ? { page, limit: LOCATIONS_PROFILE_PAGE_SIZE }
    : { ...filters, page, limit: LOCATIONS_PAGE_SIZE };

  const { data } = await nextServer.get<Paginated<Location>>(url, {
    params,
    paramsSerializer: { indexes: null },
  });
  return data;
}

export default function LocationsGrid({ userId }: LocationsGridProps) {
  const searchParams = useSearchParams();
  const currentUserId = useAuthStore((state) => state.user?._id);
  const isOwnProfile = Boolean(userId) && userId === currentUserId;

  const filters: LocationQuery = {};
  if (!userId) {
    const search = searchParams.get('search')?.trim();
    const region = searchParams.get('region');
    const types = searchParams.getAll('type');
    const sort = searchParams.get('sort') ?? DEFAULT_SORT;

    if (search) filters.search = search;
    if (region) filters.region = region;
    if (types.length) filters.type = types;
    filters.sort = sort as LocationQuery['sort'];
  }

  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: locationsQueryKey(userId, filters),
    queryFn: ({ pageParam }) => fetchPage(pageParam, filters, userId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  const locations = data?.pages.flatMap((page) => page.data) ?? [];
  // нові дані за зміненими фільтрами (не догрузка «Показати ще»)
  const isRefetching = isFetching && !isFetchingNextPage;

  const listRef = useRef<HTMLUListElement>(null);
  const firstNewIndex = useRef<number | null>(null);

    useEffect(() => {
      const index = firstNewIndex.current;
      if (index === null || isFetchingNextPage) return;

      const firstNewCard = listRef.current?.children[index];
      firstNewCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      firstNewIndex.current = null;
    }, [isFetchingNextPage]);

  const handleLoadMore = () => {
    firstNewIndex.current = locations.length;
    fetchNextPage();
  };

  if (isPending) {
    return (
      <section className={css.section} data-section="LocationsGrid">
        <Loader size={56} />
      </section>
    );
  }

  if (isError) {
    return (
      <section className={css.section} data-section="LocationsGrid">
        <p className={css.message}>
          Не вдалося завантажити локації. Спробуйте пізніше.
        </p>
      </section>
    );
  }

  if (locations.length === 0) {
    return (
      <section className={css.section} data-section="LocationsGrid">
        <div className={css.empty}>
          <p className={css.emptyTitle}>
            {userId ? 'Тут поки немає локацій' : 'Нічого не знайдено'}
          </p>
          {!userId && (
            <p className={css.message}>
              Спробуйте змінити пошуковий запит або скинути фільтри.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={css.section}
      data-section="LocationsGrid"
      data-user-id={userId}
      aria-busy={isFetching}
    >
      <div className={css.gridWrap}>
        <ul
          ref={listRef}
          className={`${css.grid} ${isRefetching ? css.dimmed : ''}`}
        >
          {locations.map((location) => (
            <li key={location._id} className={css.card}>
              <LocationCard location={location} showEdit={isOwnProfile} />
            </li>
          ))}
        </ul>

        {isRefetching && (
          <div className={css.fetchLoader}>
            <div className={css.fetchLoaderInner}>
              <Loader size={48} />
            </div>
          </div>
        )}
      </div>

      {isFetchingNextPage && <Loader size={40} />}

      {hasNextPage && !isFetchingNextPage && (
        <button type="button" className={css.more} onClick={handleLoadMore}>
          Показати ще
        </button>
      )}
    </section>
  );
}
