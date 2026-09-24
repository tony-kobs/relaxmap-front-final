import Link from 'next/link';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default function Header() {
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
        <AuthNavigation />
      </div>
    </header>
  );
}
