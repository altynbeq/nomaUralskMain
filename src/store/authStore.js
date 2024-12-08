import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist((set) => ({
        accessToken: null,
        user: null,
        userData: null,
        isLoggedIn: false,
        accesses: null,
        setAccessToken: (token) => set({ accessToken: token }),
        setAccesses: (accesses) => set({ accesses: accesses }),
        clearAccessToken: () => set({ accessToken: null }),
        setUser: (userData) => set({ user: userData }),
        clearUser: () => set({ user: null }),
        setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn: isLoggedIn }),
        clearIsLoggedIn: () => set({ isLoggedIn: false }),
    })),
);
