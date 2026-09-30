// Власник: Перший екран
import Image from 'next/image';
import css from './AdvantagesBlock.module.css';

const items = [
  {
    icon: '/iconsAdvantage/reviews.svg',
    title: 'Реальні відгуки',
    text: 'Користувачі діляться чесними враженнями, щоб ви робили правильний вибір.',
  },
  {
    icon: '/iconsAdvantage/filters.svg',
    title: 'Зручні фільтри',
    text: 'Шукайте за типом локації, регіоном, наявністю зручностей та іншими критеріями.',
  },
  {
    icon: '/iconsAdvantage/community.svg',
    title: 'Спільнота мандрівників',
    text: 'Додавайте власні улюблені місця та діліться своїми неймовірними знахідками.',
  },
];

export default function AdvantagesBlock() {
  return (
    <section className={css.section}>
      <div className="container">
        <h2 className={css.heading}>Ключові переваги</h2>

        <ul className={css.list}>
          {items.map(({ icon, title, text }) => (
            <li key={title} className={css.card}>
              <Image
                className={css.icon}
                src={icon}
                alt=""
                width={64}
                height={64}
              />
              <h3 className={css.cardTitle}>{title}</h3>
              <p className={css.cardText}>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
