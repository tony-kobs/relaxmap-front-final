'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './RegistrationForm.module.css';

export default function RegistrationForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      onSubmit={async (values, helpers) => {
        try {
          const user = await register(values);
          setUser(user);
          toast.success('Account created');
          router.push(`/profile/${user._id}`);
        } catch {
          toast.error('Could not create account');
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.label}>
            Ім'я
            <Field className={css.input} type="text" name="name" />
            <ErrorMessage className={css.error} name="name" component="span" />
          </label>
          <label className={css.label}>
            Email
            <Field className={css.input} type="email" name="email" />
            <ErrorMessage className={css.error} name="email" component="span" />
          </label>
          <label className={css.label}>
            Password
            <Field className={css.input} type="password" name="password" />
            <ErrorMessage
              className={css.error}
              name="password"
              component="span"
            />
          </label>
          <button className={css.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Sign up'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
