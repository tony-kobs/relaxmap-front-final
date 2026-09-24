'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

import { useEffect, useState } from 'react';

export default function AuthNavigation() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  /* const isAuthenticated = true;
  const user = {
    _id: '1',
    name: 'Олена Коваленко',
    avatar: '/images/location-form-placeholder-image.jpg',
  }; */

  const profileHref = user?._id ? `/profile/${user._id}` : '/profile';
  const isLocationsCatalog =
    pathname === '/locations' || /^\/locations\/[^/]+$/.test(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className={css.side}>
      <button
        type="button"
        className={css.menuButton}
        aria-expanded={isOpen}
        aria-controls="header-nav"
        aria-label={isOpen ? 'Закрити меню' : 'Відкрити меню'}
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg width="24" height="24" aria-hidden="true">
          <use href={isOpen ? '/sprite.svg#close' : '/sprite.svg#menu'} />
        </svg>
      </button>
      <nav
        id="header-nav"
        className={isOpen ? `${css.nav} ${css.navOpen}` : css.nav}
      >
        <div className={css.menuLinks}>
          {isAuthenticated ? (
            <>
              <Link
                className={pathname === '/' ? css.active : css.link}
                href="/"
              >
                Головна
              </Link>
              <Link
                className={isLocationsCatalog ? css.active : css.link}
                href="/locations"
              >
                Місця відпочинку
              </Link>
              <Link
                className={
                  pathname.startsWith('/profile') ? css.active : css.link
                }
                href={profileHref}
              >
                Мій Профіль
              </Link>
            </>
          ) : (
            <>
              <Link
                className={pathname === '/' ? css.active : css.link}
                href="/"
              >
                Головна
              </Link>
              <Link
                className={isLocationsCatalog ? css.active : css.link}
                href="/locations"
              >
                Місця відпочинку
              </Link>
            </>
          )}
        </div>
        <div className={css.menuActions}>
          {isAuthenticated ? (
            <Link
              className={`${css.button} ${css.buttonSecondary}`}
              href="/locations/add"
            >
              Поділитись локацією
            </Link>
          ) : (
            <>
              <Link
                className={`${css.button} ${css.buttonPrimary}`}
                href="/login"
              >
                Вхід
              </Link>
              <Link
                className={`${css.button} ${css.buttonSecondary}`}
                href="/register"
              >
                Реєстрація
              </Link>
            </>
          )}
        </div>
        {isAuthenticated ? (
          <span className={css.profile}>
            {user?.avatar ? (
              <Image
                className={css.avatar}
                src={user.avatar}
                width={32}
                height={32}
                alt=""
              />
            ) : (
              <span className={css.avatarFallback}>
                {user?.name?.charAt(0)}
              </span>
            )}
            <span className={css.name}>{user?.name}</span>
            <span className={css.divider} aria-hidden="true" />
            <Link className={css.iconButton} href="/logout" aria-label="Вийти">
              <svg width="24" height="24" aria-hidden="true">
                <use href="/sprite.svg#logout" />
              </svg>
            </Link>
          </span>
        ) : null}
      </nav>
    </div>
  );
}
