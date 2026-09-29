'use client';

import { useEffect, useId, useRef } from 'react';
import css from './ConfirmationModal.module.css';

type ConfirmationModalProps = {
  title: string;
  description?: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  onDismiss?: () => void;
  isLoading?: boolean;
};

export default function ConfirmationModal({
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  onDismiss,
  isLoading = false,
}: ConfirmationModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onDismissRef = useRef(onDismiss ?? onCancel);
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    onDismissRef.current = onDismiss ?? onCancel;
  }, [onDismiss, onCancel]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoadingRef.current) {
        onDismissRef.current();
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
  }, []);

  const dismiss = () => {
    if (isLoading) {
      return;
    }

    onDismissRef.current();
  };

  const handleCancel = () => {
    if (isLoading) {
      return;
    }

    onCancel();
  };

  return (
    <div className={css.backdrop} onMouseDown={dismiss}>
      <div
        ref={dialogRef}
        className={css.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={isLoading}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={css.close}
          onClick={dismiss}
          disabled={isLoading}
          aria-label="Закрити"
        >
          <svg
            className={css.closeIcon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M17.6006 5.925C17.7649 5.925 17.8669 5.97351 17.9473 6.05391C18.0275 6.13422 18.0761 6.2357 18.0762 6.39961C18.0762 6.56382 18.0276 6.6659 17.9473 6.74629L12.6934 12.0002L13.0469 12.3537L17.9473 17.2531C18.0276 17.3335 18.0761 17.4357 18.0762 17.5998C18.0762 17.7641 18.0277 17.8661 17.9473 17.9465C17.8669 18.0269 17.7649 18.0754 17.6006 18.0754C17.4364 18.0754 17.3343 18.0269 17.2539 17.9465L12.3545 13.0461L12.001 12.6926L6.74707 17.9465C6.66668 18.0268 6.56459 18.0754 6.40039 18.0754C6.23648 18.0753 6.135 18.0267 6.05469 17.9465C5.97428 17.8661 5.92578 17.7641 5.92578 17.5998C5.92582 17.4357 5.97432 17.3335 6.05469 17.2531L11.3076 12.0002L10.9541 11.6467L6.05469 6.74629C5.97429 6.66589 5.92578 6.56388 5.92578 6.39961C5.92586 6.23557 5.97435 6.13425 6.05469 6.05391C6.13503 5.97357 6.23635 5.92508 6.40039 5.925C6.56466 5.925 6.66667 5.97351 6.74707 6.05391L11.6475 10.9533L12.001 11.3068L17.2539 6.05391C17.3343 5.97354 17.4364 5.92504 17.6006 5.925Z"
              fill="white"
              stroke="black"
            />
          </svg>
        </button>
        <h2 id={titleId} className={css.title}>
          {title}
        </h2>
        {description ? (
          <p id={descriptionId} className={css.description}>
            {description}
          </p>
        ) : null}
        <div className={css.actions}>
          <button
            type="button"
            className={css.cancel}
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            className={css.confirm}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={css.spinner} aria-hidden="true" />
            ) : null}
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
