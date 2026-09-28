// Власник: Відгуки
// --------------------------------------
// ReviewsSection.tsx
// Секція відгуків на сторінці з Локаціями + кнопка "залишити відгук" */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Spinner from '@/components/Spinner/Spinner';
import ReviewCard, { ReviewData } from '../ReviewsBlock/ReviewCard';
import { useAuthStore } from '@/lib/store/authStore';
import css from './ReviewsSection.module.css';

const START_INDEX_DEFAULT = 0;
const DESK_BREAKPOINT = 1440;
const TAB_BREAKPOINT = 768;
const AUTH_PROMPT_ROUTE = '/auth-prompt';

type ReviewsSectionProps = {
  locationId: string;
};

export default function ReviewsSection({ locationId }: ReviewsSectionProps) {
  const [feedbacks, setFeedbacks] = useState<ReviewData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(START_INDEX_DEFAULT);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const batonHref = isAuthenticated
    ? `/locations/${locationId}/review`
    : AUTH_PROMPT_ROUTE;

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= DESK_BREAKPOINT) {
        setCardsPerPage(3);
      } else if (window.innerWidth >= TAB_BREAKPOINT) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchLocationReviews() {
      setIsLoading(true);
      try {
        const queryParams = `?locationId=${locationId}`;
        const res = await fetch(`/api/feedbacks${queryParams}`);
        const resData = await res.json();

        if (resData && resData.data) {
          setFeedbacks(resData.data);
        } else if (Array.isArray(resData)) {
          setFeedbacks(resData);
        }
      } catch (error) {
        console.error(
          'Помилка завантаження відгуків по локації з бази даних:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchLocationReviews();
  }, [locationId]);

  const handlePrevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, feedbacks.length - cardsPerPage) : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= feedbacks.length - cardsPerPage ? 0 : prev + 1,
    );
  };

  if (isLoading) {
    return (
      <div className={css.spinnerContainerFlex}>
        <Spinner loading={isLoading} />
      </div>
    );
  }

  const translationPercentage = currentIndex * (100 / cardsPerPage);
  const gapCompensation = currentIndex * (24 / cardsPerPage);

  return (
    <section
      className={`${css.section} ${css.reviewsSectionCustom}`}
      data-location-id={locationId}
    >
      <div className={css.sectionHeaderTopFlex}>
        <h2 className={css.sectionHeadingText}>Відгуки</h2>

        <Link href={batonHref} className={css.actionBatonLink}>
          Залишити відгук
        </Link>
      </div>

      <div className={css.listWrapperFlex}>
        <div className={css.sliderViewportFlex}>
          <div
            className={css.staticListFlex}
            style={{
              transform: `translateX(calc(-${translationPercentage}% - ${gapCompensation}px))`,
            }}
          >
            {feedbacks.map((item) => (
              <ReviewCard
                key={item._id}
                review={item}
                showLocationType={false}
                customClassName={css.listCardItemFlex}
              />
            ))}
          </div>
        </div>

        <div className={css.bottomControlsFlex}>
          <button
            type="button"
            onClick={handlePrevSlide}
            className={css.sliderArrowBtn}
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            className={css.sliderArrowBtn}
          >
            &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}

// =====================================
// 'use client';

// import Link from 'next/link';
// import ReviewsBlock from '@/components/ReviewsBlock/ReviewsBlock';
// import { useAuthStore } from '@/lib/store/authStore';
// import css from './ReviewsSection.module.css';

// type ReviewsSectionProps = {
//   locationId: string;
// };

// export default function ReviewsSection({ locationId }: ReviewsSectionProps) {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const href = isAuthenticated ? `/locations/${locationId}/review` : '/auth-prompt';

//   return (
//     <section className={css.section}>
//       <h2>Відгуки</h2>
//       <ReviewsBlock locationId={locationId} />
//       <Link href={href}>Залишити відгук</Link>
//     </section>
//   );
// }
