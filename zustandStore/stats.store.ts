import api from "@/config/api";
import { create } from "zustand";

type Store = {
  data: {
    loading: boolean;
    stats: any;
    error: string | null;
  };
  getAllStats: (params?: any) => Promise<void>;
};

const endpoint = "/properties/stats";

const useStatsStore = create<Store>()((set) => ({
  data: {
    loading: false,
    stats: {},
    error: null,
  },
  getAllStats: async (params?: any) => {
    set((state) => ({ data: { ...state.data, loading: true } }));
    try {
      const response = await api.get(endpoint, params && { params });
      set((state) => ({ data: { ...state.data, stats: response?.data } }));
    } catch (error: any) {
      set((state) => ({ data: { ...state.data, error: error?.message } }));
    } finally {
      set((state) => ({ data: { ...state.data, loading: false } }));
    }
  },
}));

export default useStatsStore;
