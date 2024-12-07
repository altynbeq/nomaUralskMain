import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    accessToken: null,
    user: null,
    userData: null,
    isLoggedIn: false,
    setAccessToken: (token) => set({ accessToken: token }),
    clearAccessToken: () => set({ accessToken: null }),
    setUser: (userData) => set({ user: userData }),
    clearUser: () => set({ user: null }),
    setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn: isLoggedIn }),
    clearIsLoggedIn: () => set({ isLoggedIn: false }),
}));
