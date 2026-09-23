import AuthNav from '@/components/AuthNav/AuthNav';
import SignInForm from '@/components/SignInForm/SignInForm';
import css from './page.module.css';

export default function LoginPage() {
  return (
    <section className={css.wrap}>
      <AuthNav />
      <h1 className={css.title}>Вхід</h1>
      <SignInForm />
    </section>
  );
}
