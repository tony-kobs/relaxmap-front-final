// Власник: Перший екран
import css from './AdvantagesBlock.module.css';

const items = [
  ['Реальні відгуки', 'Враження мандрівників, а не рекламні описи.'],
  ['Зручні фільтри', 'Шукай за регіоном, типом локації і назвою.'],
  ['Спільнота мандрівників', 'Ділись місцями, які варто побачити.'],
];

export default function AdvantagesBlock() {
  return (
    <section className={css.section}>
      {items.map(([title, text]) => (
        <article key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}
