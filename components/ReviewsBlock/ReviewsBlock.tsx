// Власник: Відгуки
// ---------------------------------------------
// ГОЛОВНА СТОРІНКА, блок відгуків

'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/Spinner/Spinner';
import ReviewCard, { ReviewData } from './ReviewCard';
import css from './ReviewsBlock.module.css';

const DESK_BREAKPOINT = 1440;
const TAB_BREAKPOINT = 768;

export default function ReviewsBlock() {
  const [feedbacks, setFeedbacks] = useState<ReviewData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Визначення кількості відображуваних карток для точного розрахунку кроку зміщення треку
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
    async function fetchReviews() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/feedbacks');
        const resData = await res.json();

        if (resData && resData.data) {
          setFeedbacks(resData.data);
        } else if (Array.isArray(resData)) {
          setFeedbacks(resData);
        }
      } catch (error) {
        console.error('Помилка завантаження відгуків з MongoDB:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

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

  // Розрахунок точного відсотка зміщення флекс-треку з урахуванням відступів gap
  const translationPercentage = currentIndex * (100 / cardsPerPage);
  const gapCompensation = currentIndex * (24 / cardsPerPage);

  return (
    <section className={`${css.section} ${css.reviewsBlockSection}`}>
      <h2 className={css.titleText}>Останні відгуки</h2>

      <div className={css.sliderWrapperFlex}>
        <div className={css.sliderViewportFlex}>
          <div
            className={css.sliderTrackFlex}
            style={{
              transform: `translateX(calc(-${translationPercentage}% - ${gapCompensation}px))`,
            }}
          >
            {feedbacks.map((item) => (
              <ReviewCard
                key={item._id}
                review={item}
                showLocationType={true}
                customClassName={css.sliderCardItemFlex}
              />
            ))}
          </div>
        </div>

        <div className={css.sliderControlsFlex}>
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

// ======================================
// import StarRating from '@/components/StarRating/StarRating';
// import css from './ReviewsBlock.module.css';

// type ReviewsBlockProps = {
//   locationId?: string;
// };

// export default function ReviewsBlock({ locationId }: ReviewsBlockProps) {
//   return (
//     <section className={css.section} data-location-id={locationId}>
//       {locationId ? null : <h2>Відгуки</h2>}
//       <StarRating className={css.rating} value={4.5} readOnly showValue />
//     </section>
//   );
// }
