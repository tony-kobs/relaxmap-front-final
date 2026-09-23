'use client';

import css from './error.module.css';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className={css.wrap}>
      <h1 className={css.title}>Something went wrong</h1>
      <p className={css.text}>Please try again.</p>
      <button className={css.button} type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
