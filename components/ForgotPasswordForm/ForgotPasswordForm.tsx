'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { isAxiosError } from 'axios';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { requestResetEmail } from '@/lib/api/clientApi';
import css from '@/components/LoginForm/LoginForm.module.css';

const SENT_MESSAGE =
  'Якщо така пошта зареєстрована, ми надіслали на неї лист із посиланням для зміни пароля. Посилання дійсне 15 хвилин.';

const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Введіть коректну електронну пошту')
    .max(64, 'Пошта не повинна перевищувати 64 символи')
    .required('Пошта обовʼязкова'),
});

export default function ForgotPasswordForm() {
  const [isSent, setIsSent] = useState(false);

  if (isSent) {
    return (
      <div className={css.form}>
        <p className={css.text}>{SENT_MESSAGE}</p>
        <div className={css.links}>
          <Link href="/login" className={css.link}>
            Повернутися до входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={forgotPasswordValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={async (values, helpers) => {
        try {
          await requestResetEmail(values.email.trim());
          toast.success('Якщо така пошта є, ми надіслали на неї лист');
          setIsSent(true);
        } catch (error: unknown) {
          // 404 не показуємо, щоб не розкривати, чи зареєстрована пошта
          if (isAxiosError(error) && error.response?.status === 404) {
            toast.success('Якщо така пошта є, ми надіслали на неї лист');
            setIsSent(true);
            return;
          }
          toast.error('Не вдалося надіслати лист. Спробуйте пізніше');
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className={css.form} noValidate>
          <p className={css.text}>
            Вкажіть пошту, з якою ви реєструвались, і ми надішлемо посилання для
            зміни пароля.
          </p>

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

          <button
            className={css.button}
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={css.buttonContent}>
                <ClipLoader color="#ffffff" size={18} />
                <span>Надсилаємо...</span>
              </span>
            ) : (
              'Надіслати лист'
            )}
          </button>

          <div className={css.links}>
            <Link href="/login" className={css.link}>
              Повернутися до входу
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
