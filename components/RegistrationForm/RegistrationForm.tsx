'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './RegistrationForm.module.css';

const registrationValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Імʼя повинно містити щонайменше 2 символи')
    .max(32, 'Імʼя не повинно перевищувати 32 символи')
    .required('Імʼя обовʼязкове'),
  email: Yup.string()
    .trim()
    .email('Введіть коректну електронну пошту')
    .max(64, 'Пошта не повинна перевищувати 64 символи')
    .required('Пошта обовʼязкова'),
  password: Yup.string()
    .min(8, 'Пароль повинен містити щонайменше 8 символів')
    .max(128, 'Пароль не повинен перевищувати 128 символів')
    .required('Пароль обовʼязковий'),
});

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 409) {
      return 'Користувач з такою поштою вже існує';
    }
    const message = error.response?.data?.message ?? error.response?.data?.error;
    if (typeof message === 'string' && message) return message;
  }
  return 'Не вдалося зареєструватись. Спробуйте ще раз';
};

export default function RegistrationForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={registrationValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={async (values, helpers) => {
        try {
          const user = await register({
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          });
          setUser(user);
          toast.success(`Вітаємо, ${user.name || 'користувачу'}!`);
          router.push('/profile');
        } catch (error: unknown) {
          toast.error(getErrorMessage(error));
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={css.form} noValidate>
          <label className={css.label} htmlFor="name">
            <span className={css.labelText}>Імʼя*</span>
            <Field
              id="name"
              className={`${css.input} ${
                touched.name && errors.name ? css.inputError : ''
              }`}
              type="text"
              name="name"
              placeholder="Ваше імʼя"
              autoComplete="name"
            />
            <ErrorMessage className={css.error} name="name" component="span" />
          </label>

          <label className={css.label} htmlFor="email">
            <span className={css.labelText}>Пошта*</span>
            <Field
              id="email"
              className={`${css.input} ${
                touched.email && errors.email ? css.inputError : ''
              }`}
              type="email"
              name="email"
              placeholder="hello@relaxmap.ua"
              autoComplete="email"
            />
            <ErrorMessage className={css.error} name="email" component="span" />
          </label>

          <label className={css.label} htmlFor="password">
            <span className={css.labelText}>Пароль*</span>
            <Field
              id="password"
              className={`${css.input} ${
                touched.password && errors.password ? css.inputError : ''
              }`}
              type="password"
              name="password"
              placeholder="********"
              autoComplete="new-password"
            />
            <ErrorMessage
              className={css.error}
              name="password"
              component="span"
            />
          </label>

          <button
            className={css.button}
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={css.buttonContent}>
                <ClipLoader color="#ffffff" size={18} />
                <span>Реєстрація...</span>
              </span>
            ) : (
              'Зареєструватись'
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}
