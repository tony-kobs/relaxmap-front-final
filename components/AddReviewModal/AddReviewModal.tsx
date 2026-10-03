'use client';

import { useEffect, useId, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AddReviewForm from '@/components/AddReviewForm/AddReviewForm';
import css from './AddReviewModal.module.css';

type AddReviewModalProps = {
  locationId: string;
};

export default function AddReviewModal({ locationId }: AddReviewModalProps) {
  const router = useRouter();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.back();
      }
    };

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [router]);

  return (
    <div className={css.backdrop} onMouseDown={() => router.back()}>
      <div
        ref={dialogRef}
        className={css.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={css.close}
          onClick={() => router.back()}
          aria-label="Закрити"
        >
          <svg className={css.closeIcon} width="24" height="24" aria-hidden="true">
            <use href="/sprite.svg#close" />
          </svg>
        </button>
        <h2 id={titleId} className={css.title}>
          Залишити відгук
        </h2>
        <AddReviewForm locationId={locationId} />
      </div>
    </div>
  );
}
