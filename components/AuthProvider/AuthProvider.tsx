'use client';

import { useEffect } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setAuthLoading(true);

      try {
        // 1) перевірка / оновлення сесії (бекенд сам рефрешить access за потреби)
        const isAuthenticated = await checkSession();
        if (cancelled) return;

        if (!isAuthenticated) {
          clearIsAuthenticated();
          return;
        }

        // 2) поточний користувач для хедера і редіректу /profile
        const user = await getMe();
        if (cancelled) return;

        if (user?._id) {
          setUser(user);
          return;
        }

        clearIsAuthenticated();
      } catch {
        if (!cancelled) {
          clearIsAuthenticated();
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [setUser, clearIsAuthenticated, setAuthLoading]);

  return children;
}
