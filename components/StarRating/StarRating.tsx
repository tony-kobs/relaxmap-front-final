'use client';

import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import css from './StarRating.module.css';

const STAR_COUNT = 5;

const starStyles = {
  itemShapes: Star,
  itemStrokeWidth: 1,
  activeFillColor: 'var(--color-neutral-darkest)',
  activeStrokeColor: 'var(--color-neutral-darkest)',
  inactiveFillColor: 'transparent',
  inactiveStrokeColor: 'var(--color-neutral-darkest)',
};

const itemLabels = ['1 зірка', '2 зірки', '3 зірки', '4 зірки', '5 зірок'];

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

function formatRating(value: number) {
  const half = Math.round(value * 2) / 2;
  return Number.isInteger(half) ? String(half) : half.toFixed(1);
}

export default function StarRating({
  value,
  onChange,
  readOnly,
  showValue = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const isReadOnly = readOnly ?? !onChange;
  const label = isReadOnly ? `Оцінка ${formatRating(value)} з ${STAR_COUNT}` : 'Оберіть оцінку';

  return (
    <div className={[css.row, className].filter(Boolean).join(' ')}>
      <div className={size === 'sm' ? css.sm : css.md}>
        <Rating
          className={css.rating}
          value={value}
          readOnly={isReadOnly}
          onChange={isReadOnly ? undefined : onChange}
          items={STAR_COUNT}
          itemStyles={starStyles}
          halfFillMode="svg"
          spaceInside="none"
          spaceBetween="small"
          transition="colors"
          isRequired={!isReadOnly}
          invisibleLabel={label}
          invisibleItemLabels={itemLabels}
        />
      </div>
      {showValue && isReadOnly ? (
        <>
          <span className={css.dot} aria-hidden="true">
            ·
          </span>
          <span className={css.score}>{formatRating(value)}</span>
        </>
      ) : null}
    </div>
  );
}
