import type { Metadata } from 'next';
import Link from 'next/link';
import css from './error.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className={css.wrap}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.text}>The page you are looking for does not exist.</p>
      <Link className={css.button} href="/">
        Go back home
      </Link>
    </div>
  );
}
