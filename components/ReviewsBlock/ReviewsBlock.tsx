// MAIN PAGE, Reviews Block

'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader/Loader';
import ReviewCard, { ReviewData } from './ReviewCard';
import ArrowNavigation from './ArrowNavigation';
import SliderDots from './SliderDots';
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

  // Скидаємо слайдер на початок, коли змінилась локація або кількість відгуків
  const sliderResetKey = `${locationId ?? 'latest'}:${feedbacks.length}`;
  const [prevSliderResetKey, setPrevSliderResetKey] = useState(sliderResetKey);
  if (prevSliderResetKey !== sliderResetKey) {
    setPrevSliderResetKey(sliderResetKey);
    setCurrentIndex(0);
  }

  // Кількість позицій слайдера з урахуванням карток на екрані; індекс
  // обмежуємо, щоб після зміни ширини екрана не вийти за останню позицію
  const maxIndex = Math.max(0, feedbacks.length - cardsPerPage);
  const activeIndex = Math.min(currentIndex, maxIndex);

  const handlePrevSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex(activeIndex === 0 ? maxIndex : activeIndex - 1);
  };

  const handleNextSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex(activeIndex >= maxIndex ? 0 : activeIndex + 1);
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
        <p className={css.message}>
          {isHomePage
            ? 'Поки що немає відгуків.'
            : 'Поки що немає відгуків для цієї локації.'}
        </p>
      </section>
    );
  }

  const translationPercentage = activeIndex * (100 / cardsPerPage);
  const gapCompensation = activeIndex * (24 / cardsPerPage);

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

        <div className={css.controlsRow}>
          <SliderDots
            count={maxIndex + 1}
            activeIndex={activeIndex}
            onSelect={setCurrentIndex}
          />
          <ArrowNavigation
            onPrev={handlePrevSlide}
            onNext={handleNextSlide}
            viewportRef={viewportRef}
          />
        </div>
      </div>
    </section>
  );
}
