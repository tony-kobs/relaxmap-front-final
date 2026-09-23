import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { User } from '@/types/user';

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
}

export async function checkSession() {
  const cookieStore = await cookies();

  return nextServer.get<{ success: boolean }>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}
