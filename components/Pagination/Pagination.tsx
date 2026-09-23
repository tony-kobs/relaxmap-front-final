'use client';

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

type Props = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: Props) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      className={css.list}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      nextLabel=">"
      previousLabel="<"
    />
  );
}
