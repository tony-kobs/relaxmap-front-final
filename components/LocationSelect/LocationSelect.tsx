import { Category } from '@/types/location';
import css from './LocationSelect.module.css';
import { useField } from 'formik';
import { useEffect, useRef, useState } from 'react';

type LocationSelectProps = {
  name: string;
  id: string;
  placeholder: string;
  options: Category[];
};

export function LocationSelect({
  name,
  id,
  placeholder,
  options,
}: LocationSelectProps) {
  const [field, , helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option._id === field.value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    helpers.setValue(value);
    setIsOpen(false);
  };

  return (
    <div className={css.selectWrapper} ref={selectRef}>
      <button
        className={css.selectButton}
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption ? selectedOption.name : placeholder}</span>

        <span
          className={`${css.selectArrow} ${isOpen ? css.selectArrowOpen : ''}`}
        />
      </button>

      {isOpen && (
        <ul className={css.selectDropdown} role="listbox">
          {options.map((option) => (
            <li key={option._id}>
              <button
                className={css.selectOption}
                type="button"
                onClick={() => handleSelect(option._id)}
                role="option"
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
