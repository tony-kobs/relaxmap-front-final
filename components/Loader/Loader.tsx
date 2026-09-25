import css from './Loader.module.css';

type LoaderProps = {
  size?: number;
};

export default function Loader({ size = 80 }: LoaderProps) {
  return (
    <div className={css.wrap} role="status" aria-live="polite" aria-label="Завантаження">
      <div className={css.compass} style={{ width: size, height: size }}>
        <span className={css.ripple} />
        <span className={css.ripple} />
        <span className={css.ripple} />
        <div className={css.orbit} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={css.disc}>
          <svg className={css.mark} viewBox="0 0 160 160" aria-hidden="true">
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
    </div>
  );
}
