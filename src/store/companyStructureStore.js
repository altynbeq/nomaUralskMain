import { create } from 'zustand';

export const useCompanyStructureStore = create((set) => ({
    leads: null,
    deals: null,
    kkm: null,
    receipts: null,
    writeOffs: null,
    urls: null,
    name: '',
    email: '',
    setLeads: (leads) => set({ leads: leads }),
    setDeals: (deals) => set({ deals: deals }),
    setKKM: (kkm) => set({ kkm: kkm }),
    setReceipts: (receipts) => set({ receipts: receipts }),
    setWriteOffs: (writeOffs) => set({ writeOffs: writeOffs }),
    setUrls: (urls) => set({ urls: urls }),
    setName: (name) => set({ name: name }),
    setEmail: (email) => set({ email: email }),
}));
