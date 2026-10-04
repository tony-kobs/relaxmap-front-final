// Власник: Профіль
import Link from 'next/link';
import css from './ProfilePlaceholder.module.css';

type ProfilePlaceholderProps = {
  isMyProfile: boolean;
};

export default function ProfilePlaceholder({ isMyProfile }: ProfilePlaceholderProps) {
  return (
    <section className={css.section} data-section="ProfilePlaceholder">
      {isMyProfile ? (
        <Link className={css.link} href="/locations/add">
          Поділитись локацією
        </Link>
      ) : (
        <Link className={css.link} href="/">
          Назад до локацій
        </Link>
      )}
    </section>
  );
}
