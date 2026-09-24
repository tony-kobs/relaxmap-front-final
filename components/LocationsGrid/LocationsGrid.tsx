// Власник: Каталог
import css from './LocationsGrid.module.css';

type LocationsGridProps = {
  userId?: string;
};

export default function LocationsGrid({ userId }: LocationsGridProps) {
  return <section className={css.section} data-section="LocationsGrid" data-user-id={userId} />;
}
