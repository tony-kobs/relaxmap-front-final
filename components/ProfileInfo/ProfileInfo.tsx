// Власник: Профіль
import css from './ProfileInfo.module.css';

type ProfileInfoProps = {
  userId: string;
};

export default function ProfileInfo({ userId }: ProfileInfoProps) {
  return <section className={css.section} data-section="ProfileInfo" data-user-id={userId} />;
}
