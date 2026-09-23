// Власник: Сесія. Діалог виходу відкривається з Header
'use client';

import css from './ConfirmationModal.module.css';

type ConfirmationModalProps = {
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function ConfirmationModal({
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <div className={css.section} role="dialog" aria-modal="true">
      <h2>{title}</h2>
      <button type="button" onClick={onCancel} disabled={isLoading}>
        {cancelButtonText}
      </button>
      <button type="button" onClick={onConfirm} disabled={isLoading}>
        {confirmButtonText}
      </button>
    </div>
  );
}
