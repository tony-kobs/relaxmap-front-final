'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const profileHref = user?._id ? `/profile/${user._id}` : '/profile';
  const isLocationsCatalog =
    pathname === '/locations' || /^\/locations\/[^/]+$/.test(pathname);

  if (isAuthenticated) {
    return (
      <nav className={css.nav}>
        <Link
          className={isLocationsCatalog ? css.active : css.link}
          href="/locations"
        >
          Місця відпочинку
        </Link>
        <Link
          className={pathname.startsWith('/profile') ? css.active : css.link}
          href={profileHref}
        >
          Мій Профіль
        </Link>
        <Link className={css.link} href="/locations/add">
          Поділитись локацією
        </Link>
        <span className={css.profile}>
          {user?.avatar ? (
            <Image
              src={user.avatar}
              width={32}
              height={32}
              alt=""
            />
          ) : null}
          <span className={css.name}>{user?.name}</span>
        </span>
        <Link className={css.iconButton} href="/logout" aria-label="Вийти">
          <Image src="/logout.svg" width={24} height={24} alt="" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className={css.nav}>
      <Link className={pathname === '/' ? css.active : css.link} href="/">
        Головна
      </Link>
      <Link
        className={isLocationsCatalog ? css.active : css.link}
        href="/locations"
      >
        Місця відпочинку
      </Link>
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
    </nav>
  );
}
