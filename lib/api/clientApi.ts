import { nextServer } from './api';
import type { Feedback } from '@/types/feedback';
import type {
  Location,
  LocationQuery,
  Paginated,
  Category,
} from '@/types/location';
import type { User } from '@/types/user';

export type AuthCredentials = {
  email: string;
  password: string;
  name?: string;
};

export async function register(credentials: AuthCredentials): Promise<User> {
  const { data } = await nextServer.post<User>('/auth/register', credentials);
  return data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const { data } = await nextServer.post<User>('/auth/login', credentials);
  return data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

export async function checkSession(): Promise<boolean> {
  const { data } = await nextServer.get<{ success: boolean }>('/auth/session');
  return data.success;
}

export async function getMe(): Promise<User> {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
}

export async function updateMe(payload: { name?: string }): Promise<User> {
  const { data } = await nextServer.patch<User>('/users/me', payload);
  return data;
}

export async function fetchHealth(): Promise<{
  message: string;
  timestamp: string;
}> {
  const { data } = await nextServer.get('/health');
  return data;
}

export async function getLocations(params: LocationQuery = {}) {
  const { data } = await nextServer.get<Paginated<Location>>('/locations', {
    params,
  });
  return data;
}

export async function getLocation(locationId: string) {
  const { data } = await nextServer.get<Location>(`/locations/${locationId}`);
  return data;
}

export async function getRegions() {
  const { data } = await nextServer.get<Category[]>('/categories/regions');
  return data;
}

export async function getLocationTypes() {
  const { data } = await nextServer.get<Category[]>('/categories/types');
  return data;
}

export async function getFeedbacks(
  params: { locationId?: string; page?: number; limit?: number } = {},
) {
  const { data } = await nextServer.get<Paginated<Feedback>>('/feedbacks', {
    params,
  });
  return data;
}

export async function getUserById(userId: string) {
  const { data } = await nextServer.get<User>(`/users/${userId}`);
  return data;
}

export async function getUserLocations(
  userId: string,
  params: { page?: number; limit?: number } = {},
) {
  const { data } = await nextServer.get<Paginated<Location>>(
    `/users/${userId}/locations`,
    {
      params,
    },
  );
  return data;
}

export async function createLocation(formData: FormData) {
  const { data } = await nextServer.post(`/locations`, formData);

  return data;
}
