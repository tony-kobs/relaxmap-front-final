import AuthNav from '@/components/AuthNav/AuthNav';
import SignUpForm from '@/components/SignUpForm/SignUpForm';
import css from './page.module.css';

export default function RegisterPage() {
  return (
    <section className={css.wrap}>
      <AuthNav />
      <h1 className={css.title}>Реєстрація</h1>
      <SignUpForm />
    </section>
  );
}
