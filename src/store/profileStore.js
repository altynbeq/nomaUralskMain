import { create } from 'zustand';

export const useProfileStore = create((set) => ({
    name: '',
    email: '',
    setName: (name) => set({ name: name }),
    setEmail: (email) => set({ email: email }),
    clearProfle: () =>
        set({
            email: '',
            name: '',
        }),
}));
