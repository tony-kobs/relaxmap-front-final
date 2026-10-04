'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import css from './Header.module.css';

const AUTH_PAGES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

const isAuthPage = (pathname: string) => AUTH_PAGES.includes(pathname);

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={css.header}>
      <div className={css.inner}>
        <Link className={css.logo} href="/" aria-label="Relax Map">
          <svg
            className={css.logoMark}
            width="121"
            height="29"
            aria-hidden="true"
          >
            <use href="/sprite.svg#company-logo" />
          </svg>
        </Link>
        {isAuthPage(pathname) ? null : <AuthNavigation />}
      </div>
    </header>
  );
}
