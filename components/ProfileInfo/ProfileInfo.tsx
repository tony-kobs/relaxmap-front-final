'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';
import css from './ProfileInfo.module.css';

type ProfileInfoProps = {
  userId: string;
  locationsCount?: number;
};

export default function ProfileInfo({
  userId,
  locationsCount = 0,
}: ProfileInfoProps) {
  const { data: user, isPending, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId),
  });

  if (isPending) return <Loader size={40} />;
  if (isError || !user) {
    return <p className={css.error}>Не вдалося завантажити профіль</p>;
  }

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <section
      className={css.section}
      data-section="ProfileInfo"
      data-user-id={userId}
    >
      <div className={css.avatarWrap}>
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name || 'Користувач'}
            width={100}
            height={100}
            className={css.avatar}
          />
        ) : (
          <div className={css.avatarPlaceholder}>{firstLetter}</div>
        )}
      </div>

      <div className={css.info}>
        <h2 className={css.name}>{user.name}</h2>
        <p className={css.subtitle}>Статей: {locationsCount}</p>
      </div>
    </section>
  );
}
