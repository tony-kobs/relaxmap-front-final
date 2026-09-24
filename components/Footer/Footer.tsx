import Link from 'next/link';
import css from './Footer.module.css';

const socials = [
  { id: 'facebook', label: 'Facebook', href: '#' },
  { id: 'instagram', label: 'Instagram', href: '#' },
  { id: 'x', label: 'X', href: '#' },
  { id: 'youtube', label: 'YouTube', href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={css.footer}>
      <div className={css.inner}>
        <div className={css.top}>
          <Link className={css.logo} href="/" aria-label="Relax Map">
            <svg
              className={css.logoMark}
              width="129"
              height="36"
              aria-hidden="true"
            >
              <use href="/sprite.svg#company-logo" />
            </svg>
          </Link>

          <ul className={css.socials}>
            {socials.map((item) => (
              <li key={item.id}>
                <a
                  className={css.social}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                >
                  <svg width="24" height="24" aria-hidden="true">
                    <use href={`/sprite.svg#${item.id}`} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <nav className={css.nav} aria-label="Навігація у підвалі">
            <Link href="/">Головна</Link>
            <Link href="/locations">Місця відпочинку</Link>
          </nav>
        </div>

        <hr className={css.divider} />

        <p className={css.copy}>
          © {year} Природні Мандри. Усі права захищені.
        </p>
      </div>
    </footer>
  );
}
