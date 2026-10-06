'use client';

import { use } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import LocationsGrid from '@/components/LocationsGrid/LocationsGrid';
import ProfilePlaceholder from '@/components/ProfilePlaceholder/ProfilePlaceholder';
import Loader from '@/components/Loader/Loader';
import { getUserLocations } from '@/lib/api/clientApi';
import { locationsQueryKey } from '@/lib/constants/locations';
import { useProfilePageSize } from '@/lib/hooks/useProfilePageSize';
import { useAuthStore } from '@/lib/store/authStore';
import css from './page.module.css';

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default function ProfilePage({ params }: PageProps) {
  const { userId } = use(params);
  const currentUserId = useAuthStore((state) => state.user?._id);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const isMyProfile = Boolean(currentUserId) && currentUserId === userId;
  // заголовок «Локації» — лише на чужому (публічному) профілі
  const isPublicProfile = !isAuthLoading && !isMyProfile;
  const pageSize = useProfilePageSize();

  const { data, isPending, isError } = useInfiniteQuery({
    queryKey: locationsQueryKey(userId, { limit: pageSize ?? undefined }),
    queryFn: ({ pageParam }) =>
      getUserLocations(userId, {
        page: pageParam,
        limit: pageSize ?? undefined,
      }),
    enabled: pageSize !== null,
    // при зміні брейкпоінта (інша порція) не ховаємо сторінку за лоадером
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    retry: 1,
  });

  if (isPending) return <Loader fullPage size={64} />;

  const locationsCount = data?.pages[0]?.total ?? 0;

  return (
    <div className={`container ${css.profilePage}`}>
      <ProfileInfo userId={userId} locationsCount={locationsCount} />

      {isPublicProfile && <h2 className={css.title}>Локації</h2>}

      {isError ? (
        <p className={css.error}>
          Не вдалося завантажити локації профілю. Спробуйте пізніше.
        </p>
      ) : locationsCount > 0 ? (
        <LocationsGrid userId={userId} pageSize={pageSize ?? undefined} />
      ) : isAuthLoading ? (
        <Loader size={40} />
      ) : (
        <ProfilePlaceholder isMyProfile={isMyProfile} />
      )}
    </div>
  );
}
