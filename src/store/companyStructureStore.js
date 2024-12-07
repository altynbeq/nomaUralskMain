import { create } from 'zustand';

export const useCompanyStructureStore = create((set) => ({
    departments: [],
    stores: [],
    subUsers: [],
    setDepartments: (departments) => set({ departments: departments }),
    setStores: (stores) => set({ stores: stores }),
    setSubUsers: (subUsers) => set({ subUsers: subUsers }),
}));
