import { create } from "zustand";

export interface TotalUsersState {
  total: number;
  setTotal: (total: number) => void;
}

export const useTotalCustomers = create<TotalUsersState>((set) => ({
  total: 0,
  setTotal: (total: number) => set({ total }),
}));
