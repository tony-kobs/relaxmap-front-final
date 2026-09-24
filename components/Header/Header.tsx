import Image from 'next/image';
import Link from 'next/link';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.inner}>
        <Link className={css.logo} href="/">
          <Image src="/company_logo.svg" width={129} height={36} alt="Relax Map" priority />
        </Link>
        <AuthNavigation />
      </div>
    </header>
  );
}
