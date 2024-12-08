import { create } from 'zustand';

export const useSubUserStore = create((set) => ({
    shifts: [],
    setShifts: (shifts) => set({ shifts: shifts }),
}));
