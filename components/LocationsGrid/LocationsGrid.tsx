'use client';
// Власник: Каталог
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { nextServer } from '@/lib/api/api';
import Spinner from '@/components/Spinner/Spinner';
import type { Location, LocationQuery, Paginated } from '@/types/location';
import css from './LocationsGrid.module.css';

const LIMIT = 9;
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
    ? { page, limit: LIMIT }
    : { ...filters, page, limit: LIMIT };

  const { data } = await nextServer.get<Paginated<Location>>(url, {
    params,
    paramsSerializer: { indexes: null },
  });
  return data;
}

export default function LocationsGrid({ userId }: LocationsGridProps) {
  const searchParams = useSearchParams();

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
    queryKey: ['locations', userId ?? 'all', filters],
    queryFn: ({ pageParam }) => fetchPage(pageParam, filters, userId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });

  const locations = data?.pages.flatMap((page) => page.data) ?? [];

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
        <Spinner />
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
      <ul
        ref={listRef}
        className={`${css.grid} ${isFetching && !isFetchingNextPage ? css.dimmed : ''}`}
      >
        {locations.map((location) => (
          <li key={location._id} className={css.card}>
            <div className={css.imageWrap}>
              {location.images[0] ? (
                <Image
                  src={location.images[0]}
                  alt={location.name}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 33vw"
                  className={css.image}
                />
              ) : null}
            </div>
            <div className={css.body}>
              <p className={css.type}>{location.type?.name}</p>
              <h3 className={css.name}>{location.name}</h3>
              <Link href={`/locations/${location._id}`} className={css.link}>
                Переглянути локацію
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {isFetchingNextPage && <Spinner />}

      {hasNextPage && !isFetchingNextPage && (
        <button type="button" className={css.more} onClick={handleLoadMore}>
          Показати ще
        </button>
      )}
    </section>
  );
}
