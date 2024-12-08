import { create } from 'zustand';

export const useCompanyStore = create((set) => ({
    leads: [],
    deals: [],
    kkm: [],
    receipts: [],
    writeOffs: [],
    urls: [],
    products: [],
    warehouses: [],
    setLeads: (leads) => set({ leads: leads }),
    setDeals: (deals) => set({ deals: deals }),
    setKKM: (kkm) => set({ kkm: kkm }),
    setReceipts: (receipts) => set({ receipts: receipts }),
    setWriteOffs: (writeOffs) => set({ writeOffs: writeOffs }),
    setUrls: (urls) => set({ urls: urls }),
    setProducts: (products) => set({ products: products }),
    setWarehouses: (warehouses) => set({ warehouses: warehouses }),
}));
