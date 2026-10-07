'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader/Loader';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProfileRedirect() {
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

  return <Loader fullPage size={64} />;
}
