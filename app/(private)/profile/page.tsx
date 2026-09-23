'use client';

import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/Spinner/Spinner';
import { meQueryOptions } from '@/queries/user';
import css from './page.module.css';

export default function ProfilePage() {
  const { data, isLoading, isError } = useQuery(meQueryOptions);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !data) {
    return <p className={css.wrap}>Could not load profile.</p>;
  }

  return (
    <section className={css.wrap}>
      <h1 className={css.title}>Profile</h1>
      <p>
        <strong>Ім'я:</strong> {data.name}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
    </section>
  );
}
