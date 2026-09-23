// Власник: Реєстрація
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './AuthNav.module.css';

export default function AuthNav() {
  const pathname = usePathname();

  return (
    <nav className={css.section}>
      <Link href="/register" data-active={pathname === '/register'}>
        Реєстрація
      </Link>
      <Link href="/login" data-active={pathname === '/login'}>
        Вхід
      </Link>
    </nav>
  );
}
