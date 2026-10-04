'use client';

import css from './SliderDots.module.css';

type SliderDotsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

// Скільки крапок видно одночасно (як dynamicBullets у Swiper)
const VISIBLE_DOTS = 5;
const DOT_STEP_PX = 18; // ширина крапки 10px + відступ 8px

export default function SliderDots({
  count,
  activeIndex,
  onSelect,
}: SliderDotsProps) {
  if (count <= 1) return null;

  const visible = Math.min(count, VISIBLE_DOTS);
  const half = Math.floor(VISIBLE_DOTS / 2);
  const firstVisible = Math.min(
    Math.max(activeIndex - half, 0),
    count - visible,
  );

  const getSizeClass = (index: number) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return css.active;
    if (distance === 1) return '';
    if (distance === 2) return css.small;
    return css.tiny;
  };

  return (
    <div
      className={css.viewport}
      style={{ width: `${visible * DOT_STEP_PX - 8}px` }}
    >
      <ul
        className={css.track}
        style={{ transform: `translateX(-${firstVisible * DOT_STEP_PX}px)` }}
      >
        {Array.from({ length: count }, (_, index) => {
          const isVisible =
            index >= firstVisible && index < firstVisible + visible;
          const isActive = index === activeIndex;

          return (
            <li key={index}>
              <button
                type="button"
                className={`${css.dot} ${getSizeClass(index)}`}
                onClick={() => onSelect(index)}
                aria-label={`Перейти до слайду ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={isVisible ? 0 : -1}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
