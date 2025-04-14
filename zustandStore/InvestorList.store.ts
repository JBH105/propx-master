import api from "@/config/api";
import { create } from "zustand";

type Store = {
  data: {
    loading: boolean;
    investorList: any;
    error: string | null;
  };
  getInvestorList: (params?: any) => Promise<void>;
};

const endpoint = "/properties/property";

const useInvestorListStore = create<Store>()((set) => ({
  data: {
    loading: false,
    investorList: {},
    error: null,
  },
  getInvestorList: async (params?: any) => {
    set((state) => ({ data: { ...state.data, loading: true } }));
    try {
      const response = await api.get(endpoint, params && { params });
      set((state) => ({ data: { ...state.data, investorList: response?.data?.details?.data } }));
    } catch (error: any) {
      set((state) => ({ data: { ...state.data, error: error?.message } }));
    } finally {
      set((state) => ({ data: { ...state.data, loading: false } }));
    }
  },
}));

export default useInvestorListStore;
