// MAIN PAGE, Reviews Block

'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader/Loader';
import ReviewCard, { ReviewData } from './ReviewCard';
import ArrowNavigation from './ArrowNavigation';
import { getFeedbacks } from '@/lib/api/clientApi';
import { feedbacksQueryKey } from '@/lib/constants/feedbacks';
import css from './ReviewsBlock.module.css';

const TAB_BREAKPOINT = 768;
const DESK_BREAKPOINT = 1440;

type ReviewsBlockProps = {
  locationId?: string;
  showTitle?: boolean;
  /** Без вкладеного .container — коли блок уже всередині контейнера сторінки */
  embedded?: boolean;
};

export default function ReviewsBlock({
  locationId,
  showTitle = true,
  embedded = false,
}: ReviewsBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isHomePage = !locationId;

  const {
    data,
    isPending: isLoading,
    isError,
  } = useQuery({
    queryKey: feedbacksQueryKey(locationId),
    queryFn: () => getFeedbacks(isHomePage ? {} : { locationId }),
  });

  const feedbacks = (data?.data ?? []) as ReviewData[];

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
    setCurrentIndex(0);
  }, [locationId, feedbacks.length]);

  const handlePrevSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, feedbacks.length - cardsPerPage) : prev - 1,
    );
  };

  const handleNextSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((prev) =>
      prev >= feedbacks.length - cardsPerPage ? 0 : prev + 1,
    );
  };

  const sectionClassName = embedded
    ? css.reviewsBlockEmbedded
    : `container ${css.reviewsBlockSection}`;

  if (isLoading) {
    return (
      <section className={sectionClassName} data-section="ReviewsBlock">
        <Loader size={48} />
      </section>
    );
  }

  if (isError) {
    return (
      <section className={sectionClassName} data-section="ReviewsBlock">
        <p className={css.message}>
          Не вдалося завантажити відгуки. Спробуйте пізніше.
        </p>
      </section>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <section className={sectionClassName} data-section="ReviewsBlock">
        {showTitle && (
          <h2 className={css.titleText}>
            {isHomePage ? 'Останні відгуки' : 'Відгуки'}
          </h2>
        )}
        <p className={css.message}>Поки що немає відгуків для цієї локації.</p>
      </section>
    );
  }

  const translationPercentage = currentIndex * (100 / cardsPerPage);
  const gapCompensation = currentIndex * (24 / cardsPerPage);

  return (
    <section className={sectionClassName} data-section="ReviewsBlock">
      <div className={css.sliderWrapperFlex}>
        <div className={css.titleWrapper}>
          {showTitle && (
            <h2 className={css.titleText}>
              {isHomePage ? 'Останні відгуки' : 'Відгуки'}
            </h2>
          )}
        </div>

        <div className={css.sliderViewportFlex} ref={viewportRef}>
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
                showLocationType={isHomePage}
                customClassName={css.sliderCardItemFlex}
              />
            ))}
          </div>
        </div>

        <ArrowNavigation
          onPrev={handlePrevSlide}
          onNext={handleNextSlide}
          viewportRef={viewportRef}
        />
      </div>
    </section>
  );
}
