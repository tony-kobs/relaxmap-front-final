// Власник: Профіль
import Link from 'next/link';
import css from './ProfilePlaceholder.module.css';

type ProfilePlaceholderProps = {
  isAuthenticated: boolean;
};

export default function ProfilePlaceholder({ isAuthenticated }: ProfilePlaceholderProps) {
  return (
    <section className={css.section} data-section="ProfilePlaceholder">
      {isAuthenticated ? (
        <Link href="/locations/add">Поділитись локацією</Link>
      ) : (
        <Link href="/">Назад до локацій</Link>
      )}
    </section>
  );
}
