import type { Metadata } from 'next';
import AuthNav from '@/components/AuthNav/AuthNav';
import RegistrationForm from '@/components/RegistrationForm/RegistrationForm';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Реєстрація',
  description: 'Створіть акаунт на платформі Relax Map',
};

export default function RegisterPage() {
  return (
    <section className={css.wrap}>
      <AuthNav />
      <h1 className={css.title}>Реєстрація</h1>
      <RegistrationForm />
    </section>
  );
}
