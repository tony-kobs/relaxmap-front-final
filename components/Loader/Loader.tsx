import Image from 'next/image';
import css from './Loader.module.css';

export default function Loader() {
  return (
    <section className={css.stage} role="status" aria-live="polite" aria-label="Завантаження">
      <div className={css.scene}>
        <Image className={css.photo} src="/status/loading.png" alt="" fill sizes="100vw" />
      </div>
      <div className={css.scrim} />
      <div className={css.center}>
        <div className={css.compass} aria-hidden="true">
          <span className={css.ripple} />
          <span className={css.ripple} />
          <span className={css.ripple} />
          <div className={css.orbit}>
            <span />
            <span />
            <span />
          </div>
          <div className={css.disc}>
            <svg className={css.mark} viewBox="0 0 160 160">
              <circle className={css.dial} cx="80" cy="80" r="68" />
              <g className={css.ticks}>
                <path d="M80 16v12M80 132v12M16 80h12M132 80h12" />
                <path d="M35 35l8.5 8.5M116.5 116.5l8.5 8.5M125 35l-8.5 8.5M43.5 116.5l-8.5 8.5" />
              </g>
              <g className={css.ring}>
                <circle cx="80" cy="80" r="52" />
              </g>
              <g className={css.needle}>
                <path d="M80 34l7.2 46H80l-7.2-46z" />
                <path d="M80 126l7.2-46H80l-7.2 46z" />
              </g>
              <circle className={css.hub} cx="80" cy="80" r="6.5" />
            </svg>
          </div>
        </div>
        <p className={css.title}>Шукаємо місце</p>
        <p className={css.text}>Підбираємо локації для відпочинку</p>
      </div>
    </section>
  );
}
