import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            userData: null,
            isLoggedIn: false,
            setAccessToken: (token) => set({ accessToken: token }),
            setRefreshToken: (refreshToken) => set({ refreshToken: refreshToken }),
            setUser: (userData) => set({ user: userData }),
            setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn: isLoggedIn }),
            reset: () =>
                set({
                    accessToken: null,
                    user: null,
                    userData: null,
                    isLoggedIn: false,
                    refreshToken: null,
                }),
        }),
        {
            name: 'auth-storage',
        },
    ),
);
