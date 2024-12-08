import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProfileStore = create(
    persist((set) => ({
        name: '',
        email: '',
        setName: (name) => set({ name: name }),
        setEmail: (email) => set({ email: email }),
        clearProfle: () =>
            set({
                email: '',
                name: '',
            }),
    })),
);
