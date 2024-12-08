import { create } from 'zustand';

export const useSubUserStore = create((set) => ({
    shifts: [],
    subUser: null,
    accesses: null,
    setShifts: (shifts) => set({ shifts: shifts }),
    setSubUser: (subUser) => set({ subUser: subUser }),
    setAccesses: (accesses) => set({ accesses: accesses }),
}));
