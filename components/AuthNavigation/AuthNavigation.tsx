'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push('/login');
    }
  };

  if (isAuthenticated) {
    return (
      <div className={css.box}>
        <Link
          className={pathname === '/profile' ? css.active : css.link}
          href="/profile"
        >
          {user?.name ?? 'Мій профіль'}
        </Link>
        <button className={css.button} type="button" onClick={handleLogout}>
          Вийти
        </button>
      </div>
    );
  }

  return (
    <div className={css.box}>
      <Link
        className={pathname === '/login' ? css.active : css.link}
        href="/login"
      >
        Вхід
      </Link>
      <Link
        className={pathname === '/register' ? css.active : css.link}
        href="/register"
      >
        Реєстрація
      </Link>
    </div>
  );
}
