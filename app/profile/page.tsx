'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner/Spinner';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (isAuthLoading) return;

    if (user?._id) {
      router.replace(`/profile/${user._id}`);
      return;
    }

    router.replace('/login');
  }, [isAuthLoading, user, router]);

  return <Spinner />;
}
