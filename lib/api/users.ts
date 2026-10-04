import { cache } from 'react';
import type { User } from '@/types/user';

export type PublicUser = Pick<User, '_id' | 'name' | 'avatar'>;

/**
 * Публічні дані користувача для Server Components (generateMetadata профілю).
 * `cache()` дедуплікує однакові виклики в межах одного рендеру.
 */
export const getPublicUserById = cache(
  async (id: string): Promise<PublicUser | null> => {
    try {
      const baseUrl = process.env.BACKEND_URL;
      const res = await fetch(`${baseUrl}/users/${id}`, {
        cache: 'no-store',
      });

      if (!res.ok) return null;

      const json = await res.json();
      return json?.data ?? json;
    } catch {
      return null;
    }
  },
);
