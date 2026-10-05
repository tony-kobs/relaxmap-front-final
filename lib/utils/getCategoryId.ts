import type { Category } from '@/types/location';

/** Id категорії з populate-об'єкта, рядка-id або порожнього значення. */
export function getCategoryId(
  value: string | Pick<Category, '_id'> | null | undefined,
): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  const id = value._id;
  if (id == null) return '';
  return String(id);
}
