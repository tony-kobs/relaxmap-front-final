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
          <svg className={css.closeIcon} width="24" height="24" aria-hidden="true">
            <use href="/sprite.svg#close" />
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
