import { getMe } from '@/lib/api/clientApi';

export const meQueryKey = ['me'] as const;

export const meQueryOptions = {
  queryKey: meQueryKey,
  queryFn: getMe,
};
