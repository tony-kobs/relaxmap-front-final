'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import css from './ArrowNavigation.module.css';

type ArrowNavigationProps = {
  onPrev: () => void;
  onNext: () => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
};

const VISUAL_LIGHT_MS = 150;
const SWIPE_THRESHOLD = 50;

export default function ArrowNavigation({
  onPrev,
  onNext,
  viewportRef,
}: ArrowNavigationProps) {
  const [isPrevActive, setIsPrevActive] = useState(false);
  const [isNextActive, setIsNextActive] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const triggerPrev = useCallback(() => {
    setIsPrevActive(true);
    onPrev();
    setTimeout(() => setIsPrevActive(false), VISUAL_LIGHT_MS);
  }, [onPrev]);

  const triggerNext = useCallback(() => {
    setIsNextActive(true);
    onNext();
    setTimeout(() => setIsNextActive(false), VISUAL_LIGHT_MS);
  }, [onNext]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        triggerPrev();
      } else if (event.key === 'ArrowRight') {
        triggerNext();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerPrev, triggerNext]);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches && event.touches.length > 0) {
        touchStartX.current = event.touches[0].clientX;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches && event.touches.length > 0) {
        touchEndX.current = event.touches[0].clientX;
      }
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;
      const diffX = touchStartX.current - touchEndX.current;

      if (diffX > SWIPE_THRESHOLD) {
        triggerNext();
      } else if (diffX < -SWIPE_THRESHOLD) {
        triggerPrev();
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    viewportElement.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    viewportElement.addEventListener('touchmove', handleTouchMove, {
      passive: true,
    });
    viewportElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      viewportElement.removeEventListener('touchstart', handleTouchStart);
      viewportElement.removeEventListener('touchmove', handleTouchMove);
      viewportElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewportRef, triggerPrev, triggerNext]);

  return (
    <div className={css.sliderControlsFlex}>
      <button
        type="button"
        onClick={(event) => {
          triggerPrev();
          event.currentTarget.blur();
        }}
        className={`${css.sliderArrowBtn} ${isPrevActive ? css.sliderArrowBtnActiveVisual : ''}`}
        aria-label="Назад"
      >
        <svg viewBox="0 0 24 24" xmlns="http://w3.org">
          <path
            d="M7.09502 12.8518L12.5968 18.3533C12.7668 18.5236 12.8527 18.7236 12.8545 18.9533C12.8565 19.183 12.7745 19.383 12.608 19.5533C12.4345 19.7236 12.2312 19.8066 11.998 19.8023C11.7648 19.798 11.5648 19.7112 11.398 19.542L4.446 12.5903C4.336 12.4236 4.281 12.2353 4.281 12.0253C4.281 11.8153 4.336 11.627 4.446 11.4603L11.398 4.5085C11.5648 4.33917 11.7648 4.25233 11.998 4.248C12.2312 4.24367 12.4345 4.32667 12.608 4.497C12.7745 4.66733 12.8565 4.86733 12.8545 5.097C12.8527 5.32667 12.7668 5.52667 12.5968 5.697L7.09502 11.1985H18.9712C19.2112 11.1985 19.4145 11.2785 19.5812 11.4385C19.748 11.5985 19.8312 11.7943 19.8312 12.0253C19.8312 12.2563 19.748 12.4543 19.5812 12.6193C19.4145 12.7743 19.2112 12.8518 18.9712 12.8518H7.09502Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={(event) => {
          triggerNext();
          event.currentTarget.blur();
        }}
        className={`${css.sliderArrowBtn} ${isNextActive ? css.sliderArrowBtnActiveVisual : ''}`}
        aria-label="Вперед"
      >
        <svg viewBox="0 0 24 24" xmlns="http://w3.org">
          <path
            d="M16.9051 12.8517H4.70234C4.45767 12.8517 4.25459 12.7709 4.09309 12.6092C3.93142 12.4476 3.85059 12.2476 3.85059 12.0092C3.85059 11.7709 3.93142 11.5734 4.09309 11.4167C4.25459 11.26 4.45767 11.1817 4.70234 11.1817H16.9051L11.4033 5.68002C11.2333 5.50969 11.1474 5.30969 11.1456 5.08002C11.1436 4.85036 11.2256 4.65036 11.3921 4.48002C11.5656 4.30969 11.7689 4.22669 12.0021 4.23102C12.2353 4.23536 12.4353 4.32219 12.6021 4.49136L19.5541 11.443C19.6641 11.6097 19.7191 11.798 19.7191 12.008C19.7191 12.218 19.6641 12.4064 19.5541 12.573L12.6021 19.5147C12.4345 19.684 12.2312 19.7709 12.0021 19.7752C11.7689 19.7795 11.5656 19.6965 11.3921 19.5262C11.2256 19.3559 11.1436 19.1559 11.1456 18.9262C11.1474 18.6965 11.2333 18.4965 11.4033 18.3262L16.9051 12.8517Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}

// ============================================

// 'use client';

// import css from './ArrowNavigation.module.css';

// type ArrowNavigationProps = {
//   onPrev: () => void;
//   onNext: () => void;
// };

// export default function ArrowNavigation({
//   onPrev,
//   onNext,
// }: ArrowNavigationProps) {
//   return (
//     <div className={css.sliderControlsFlex}>
//       <button
//         type="button"
//         onClick={onPrev}
//         className={css.sliderArrowBtn}
//         aria-label="Назад"
//       >
//         <svg viewBox="0 0 24 24" xmlns="http://w3.org">
//           <path
//             d="M7.09502 12.8518L12.5968 18.3533C12.7668 18.5236 12.8527 18.7236 12.8545 18.9533C12.8565 19.183 12.7745 19.383 12.608 19.5533C12.4345 19.7236 12.2312 19.8066 11.998 19.8023C11.7648 19.798 11.5648 19.7112 11.398 19.542L4.446 12.5903C4.336 12.4236 4.281 12.2353 4.281 12.0253C4.281 11.8153 4.336 11.627 4.446 11.4603L11.398 4.5085C11.5648 4.33917 11.7648 4.25233 11.998 4.248C12.2312 4.24367 12.4345 4.32667 12.608 4.497C12.7745 4.66733 12.8565 4.86733 12.8545 5.097C12.8527 5.32667 12.7668 5.52667 12.5968 5.697L7.09502 11.1985H18.9712C19.2112 11.1985 19.4145 11.2785 19.5812 11.4385C19.748 11.5985 19.8312 11.7943 19.8312 12.0253C19.8312 12.2563 19.748 12.4543 19.5812 12.6193C19.4145 12.7743 19.2112 12.8518 18.9712 12.8518H7.09502Z"
//             fill="currentColor"
//           />
//         </svg>
//       </button>

//       <button
//         type="button"
//         onClick={onNext}
//         className={css.sliderArrowBtn}
//         aria-label="Вперед"
//       >
//         <svg viewBox="0 0 24 24" xmlns="http://w3.org">
//           <path
//             d="M16.9051 12.8517H4.70234C4.45767 12.8517 4.25459 12.7709 4.09309 12.6092C3.93142 12.4476 3.85059 12.2476 3.85059 12.0092C3.85059 11.7709 3.93142 11.5734 4.09309 11.4167C4.25459 11.26 4.45767 11.1817 4.70234 11.1817H16.9051L11.4033 5.68002C11.2333 5.50969 11.1474 5.30969 11.1456 5.08002C11.1436 4.85036 11.2256 4.65036 11.3921 4.48002C11.5656 4.30969 11.7689 4.22669 12.0021 4.23102C12.2353 4.23536 12.4353 4.32219 12.6021 4.49136L19.5541 11.443C19.6641 11.6097 19.7191 11.798 19.7191 12.008C19.7191 12.218 19.6641 12.4064 19.5541 12.573L12.6021 19.5147C12.4353 19.684 12.2353 19.7709 12.0021 19.7752C11.7689 19.7795 11.5656 19.6965 11.3921 19.5262C11.2256 19.3559 11.1436 19.1559 11.1456 18.9262C11.1474 18.6965 11.2333 18.4965 11.4033 18.3262L16.9051 12.8517Z"
//             fill="currentColor"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// }
