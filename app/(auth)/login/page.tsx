import type { Metadata } from 'next';
import AuthNav from '@/components/AuthNav/AuthNav';
import LoginForm from '@/components/LoginForm/LoginForm';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Вхід',
  description: 'Вхід до особистого кабінету на платформі Relax Map',
};

export default function LoginPage() {
  return (
    <section className={css.wrap}>
      <AuthNav />
      <h1 className={css.title}>Вхід</h1>
      <LoginForm />
    </section>
  );
}
