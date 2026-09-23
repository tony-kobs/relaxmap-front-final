'use client';

import { ClipLoader } from 'react-spinners';
import css from './Spinner.module.css';

type Props = {
  loading?: boolean;
};

export default function Spinner({ loading = true }: Props) {
  if (!loading) {
    return null;
  }

  return (
    <div className={css.wrap} role="status" aria-live="polite">
      <ClipLoader color="#2563eb" size={28} />
    </div>
  );
}
