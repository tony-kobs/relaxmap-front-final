import axios from 'axios';

const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api`
  : '/api';

export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});
