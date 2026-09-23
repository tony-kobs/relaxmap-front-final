import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.wrap} role="status" aria-live="polite">
      <span className={css.spinner} />
      <span className={css.text}>Loading, please wait...</span>
    </div>
  );
}
