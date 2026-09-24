'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/Spinner/Spinner';
import { meQueryOptions } from '@/queries/user';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery(meQueryOptions);

  useEffect(() => {
    if (data?._id) {
      router.replace(`/profile/${data._id}`);
      return;
    }

    if (isError) {
      router.replace('/login');
    }
  }, [data, isError, router]);

  if (isLoading || data || isError) {
    return <Spinner />;
  }

  return <Spinner />;
}
