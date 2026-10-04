// Власник: Профіль
import Link from 'next/link';
import css from './ProfilePlaceholder.module.css';

type ProfilePlaceholderProps = {
  isMyProfile: boolean;
};

export default function ProfilePlaceholder({
  isMyProfile,
}: ProfilePlaceholderProps) {
  return (
    <section className={css.section} data-section="ProfilePlaceholder">
      <div className={css.card}>
        {isMyProfile ? (
          <>
            <p className={css.text}>
              Ви ще нічого не публікували, поділіться своєю першою локацією!
            </p>
            <Link className={css.link} href="/locations/add">
              Поділитись локацією
            </Link>
          </>
        ) : (
          <>
            <p className={css.text}>Цей користувач ще не ділився локаціями</p>
            <Link className={css.link} href="/">
              Назад до локацій
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
