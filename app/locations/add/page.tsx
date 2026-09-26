// Власник: Форма локації
import LocationForm from '@/components/LocationForm/LocationForm';
import css from './page.module.css';

export default function CreateLocationPage() {
  return (
    <>
      <h1 className={css.logo}>Додавання нового місця</h1>
      <LocationForm />
    </>
  );
}
