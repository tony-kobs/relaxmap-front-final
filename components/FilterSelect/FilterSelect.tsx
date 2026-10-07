'use client';

import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import css from './FilterSelect.module.css';

export type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

/**
 * Випадний список для фільтрів каталогу. Замість нативного <select>,
 * бо його системний список не можна стилізувати: у ньому завжди видно
 * смугу прокрутки, а стрілку не посунути.
 */
export default function FilterSelect({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const list = listRef.current;
    const item = list?.children[activeIndex] as HTMLElement | undefined;
    if (!list || !item) return;

    // Гортаємо лише список, щоб сторінка не стрибала
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    if (activeIndex === 0) {
      list.scrollTop = 0;
    } else if (top < list.scrollTop) {
      list.scrollTop = top;
    } else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = bottom - list.clientHeight;
    }
  }, [isOpen, activeIndex]);

  const open = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) {
      onChange(option.value);
    }
    close();
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, last));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`${css.root} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className={css.button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-label={`${ariaLabel}: ${selected?.label ?? ''}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        <span className={css.value}>{selected?.label}</span>
        <svg
          className={`${css.chevron} ${isOpen ? css.chevronOpen : ''}`}
          aria-hidden="true"
        >
          <use href="/sprite.svg#chevron-down" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          className={css.list}
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value || 'all'}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`${css.option} ${
                index === activeIndex ? css.optionActive : ''
              } ${option.value === value ? css.optionSelected : ''}`}
              onPointerEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
