// MAIN PAGE, Reviews Block

'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/Spinner/Spinner';
import ReviewCard, { ReviewData } from './ReviewCard';
import css from './ReviewsBlock.module.css';

const TAB_BREAKPOINT = 768;
const DESK_BREAKPOINT = 1440;

export default function ReviewsBlock({
  locationId,
  showTitle = true,
}: {
  locationId?: string;
  showTitle?: boolean;
}) {
  const [feedbacks, setFeedbacks] = useState<ReviewData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const isHomePage = !locationId;

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
        const queryParams = isHomePage ? '' : `?locationId=${locationId}`;
        const res = await fetch(`/api/feedbacks${queryParams}`);
        const resData = await res.json();

        if (resData && resData.data) {
          setFeedbacks(resData.data);
        } else if (Array.isArray(resData)) {
          setFeedbacks(resData);
        }
      } catch (error) {
        console.error('Помилка MongoDB:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [locationId, isHomePage]);

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

  const rowOffset = currentIndex * (100 / cardsPerPage);
  const gapCompensation = currentIndex * (24 / cardsPerPage);

  return (
    <section className={`container ${css.reviewsBlockSection}`}>
      <div className={css.sliderWrapperFlex}>
        <div className={css.titleWrapper}>
          {showTitle && (
            <h2 className={css.titleText}>
              {isHomePage ? 'Останні відгуки' : 'Відгуки'}
            </h2>
          )}
        </div>
        <div className={css.sliderViewportFlex}>
          <div
            className={css.sliderTrackFlex}
            style={{
              transform: `translateY(calc(-${rowOffset}% - ${gapCompensation}px))`,
            }}
          >
            {feedbacks.map((item) => (
              <ReviewCard
                key={item._id}
                review={item}
                showLocationType={isHomePage}
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
