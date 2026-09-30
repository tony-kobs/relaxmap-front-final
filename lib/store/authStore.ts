import { create } from 'zustand';
import type { User } from '@/types/user';

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  clearIsAuthenticated: () => void;
  setAuthLoading: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
  setUser: (user) =>
    set({ user, isAuthenticated: true, isAuthLoading: false }),
  updateUser: (user) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...user } : null,
    })),
  clearIsAuthenticated: () =>
    set({ user: null, isAuthenticated: false, isAuthLoading: false }),
  setAuthLoading: (value) => set({ isAuthLoading: value }),
}));
