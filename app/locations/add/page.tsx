// Власник: Форма локації
import type { Metadata } from 'next';
import LocationForm from '@/components/LocationForm/LocationForm';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Додавання нового місця',
  robots: { index: false, follow: false },
};

export default function CreateLocationPage() {
  return (
    <div className={`container ${css.addLocationPage}`}>
      <h1 className={css.title}>Додавання нового місця</h1>
      <LocationForm />
    </div>
  );
}
