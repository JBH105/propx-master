import api from "@/config/api";
import { create } from "zustand";

type Store = {
  properties: {
    loading: boolean;
    data: any;
    error: string | null;
  };
  propertyById: {
    loading: boolean;
    data: any;
    error: string | null;
  };
  getAllProperties: (params?: any) => Promise<void>;
  getPropertyById: (id: string) => Promise<void>;
  createProperty: (payload: any) => Promise<{ data: any; error: any }>;
  updateProperty: (
    id: string,
    payload: any
  ) => Promise<{ data: any; error: any }>;
};

const endpoint = "/properties/properties";
const endpointPropertyById = "/properties/property";

const usePropertyStore = create<Store>()((set) => ({
  properties: {
    loading: true,
    data: {},
    error: null,
  },
  propertyById: {
    loading: true,
    data: {},
    error: null,
  },
  getAllProperties: async (params?: any) => {
    set((state) => ({ properties: { ...state.properties, loading: true } }));
    try {
      const response = await api.get(endpoint, params && { params });
      set((state) => ({
        properties: {
          ...state.properties,
          data: response?.data?.details?.data,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        properties: { ...state.properties, error: error?.message },
      }));
    } finally {
      set((state) => ({ properties: { ...state.properties, loading: false } }));
    }
  },
  getPropertyById: async (id: string) => {
    set((state) => ({
      propertyById: { ...state.propertyById, loading: true },
    }));
    try {
      const response = await api.get(endpointPropertyById, { params: { id } });
      set((state) => ({
        propertyById: {
          ...state.propertyById,
          data: response?.data?.details?.data,
        },
      }));
    } catch (error: any) {
      set((state) => ({
        propertyById: { ...state.propertyById, error: error?.message },
      }));
    } finally {
      set((state) => ({
        propertyById: { ...state.propertyById, loading: false },
      }));
    }
  },
  createProperty: async (payload: any) => {
    try {
      const response = await api.post(endpointPropertyById, payload);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  updateProperty: async (id: string, payload: any) => {
    try {
      const response = await api.patch(endpointPropertyById + "/" + id, payload);
      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
}));

export default usePropertyStore;
