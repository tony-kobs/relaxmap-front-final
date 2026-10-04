import { isAxiosError } from 'axios';

export function getErrorMessage(
  error: unknown,
  fallback = 'Щось пішло не так. Спробуйте ще раз',
): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message ?? error.response?.data?.error;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}
