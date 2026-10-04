'use client';

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

type Props = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg className={css.icon} width="20" height="20" aria-hidden="true">
      <use href={`/sprite.svg#chevron-${direction}`} />
    </svg>
  );
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: Props) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className={css.nav} aria-label="Сторінки каталогу">
      <ReactPaginate
        className={css.list}
        pageCount={pageCount}
        forcePage={currentPage - 1}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        breakLabel="…"
        previousLabel={<Arrow direction="left" />}
        nextLabel={<Arrow direction="right" />}
        previousAriaLabel="Попередня сторінка"
        nextAriaLabel="Наступна сторінка"
        ariaLabelBuilder={(page) => `Сторінка ${page}`}
        pageLinkClassName={css.link}
        breakLinkClassName={css.break}
        previousLinkClassName={`${css.link} ${css.arrow}`}
        nextLinkClassName={`${css.link} ${css.arrow}`}
        activeLinkClassName={css.active}
        disabledClassName={css.disabled}
        disabledLinkClassName={css.disabledLink}
        renderOnZeroPageCount={null}
      />
    </nav>
  );
}
