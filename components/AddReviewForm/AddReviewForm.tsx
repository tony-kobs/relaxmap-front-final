// Власник: Новий відгук
'use client';

import { ErrorMessage, Field, Form, Formik, useField } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import StarRating from '@/components/StarRating/StarRating';
import { createFeedback } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import css from './AddReviewForm.module.css';

const reviewValidationSchema = Yup.object().shape({
  rate: Yup.number()
    .integer('Оцінка повинна бути цілим числом')
    .required('Оберіть оцінку')
    .min(1, 'Оберіть оцінку від 1 до 5 зірок')
    .max(5, 'Оцінка не повинна перевищувати 5 зірок'),
  description: Yup.string()
    .trim()
    .min(1, 'Відгук повинен містити щонайменше 1 символ')
    .max(200, 'Відгук не повинен перевищувати 200 символів')
    .required('Відгук обовʼязковий'),
});

function ReviewRating() {
  const [field, , { setValue }] = useField<number>('rate');

  return (
    <StarRating
      className={css.rating}
      value={field.value}
      // field.onChange(number) не працює: Formik сприймає не-string як event і
      // падає на event.target.type, тому ставимо значення через setValue.
      onChange={(value) => setValue(Math.round(value))}
    />
  );
}

type AddReviewFormProps = {
  locationId: string;
};

export default function AddReviewForm({ locationId }: AddReviewFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userName = useAuthStore((state) => state.user?.name ?? '');

  return (
    <section
      className={css.section}
      data-section="AddReviewForm"
      data-location-id={locationId}
    >
      {/* key: реініціалізувати форму, коли в сесію потрапить користувач */}
      <Formik
        key={userName || 'anonymous'}
        initialValues={{ rate: 0, description: '' }}
        validationSchema={reviewValidationSchema}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={async (values, helpers) => {
          if (!userName.trim()) {
            toast.error('Увійдіть, щоб залишити відгук');
            helpers.setSubmitting(false);
            return;
          }

          try {
            await createFeedback({
              locationId,
              userName: userName.trim(),
              rate: values.rate,
              description: values.description.trim(),
            });
            await queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
            toast.success('Відгук опубліковано');
            router.back();
          } catch (error: unknown) {
            toast.error(
              getErrorMessage(error, 'Не вдалося надіслати відгук. Спробуйте ще раз'),
            );
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form} noValidate>
            <label className={css.label} htmlFor="review-description">
              <span className={css.labelText}>Ваш відгук</span>
              <Field
                as="textarea"
                id="review-description"
                className={`${css.textarea} ${
                  touched.description && errors.description ? css.inputError : ''
                }`}
                name="description"
                placeholder="Напишіть ваш відгук"
                maxLength={200}
              />
              <span className={css.labelFooter}>
                <ErrorMessage className={css.error} name="description" component="span" />
              </span>
            </label>

            <div className={css.label}>
              <ReviewRating />
              <span className={css.labelFooter}>
                <ErrorMessage className={css.error} name="rate" component="span" />
              </span>
            </div>

            <div className={css.actions}>
              <button
                className={css.buttonGhost}
                type="button"
                onClick={() => router.back()}
              >
                Відмінити
              </button>
              <button
                className={css.buttonPrimary}
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
                  'Надіслати'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
