import { create } from "zustand";

export interface TotalOrderState {
  total: number;
  setTotal: (total: number) => void;
}

export const useTotalOrder = create<TotalOrderState>((set) => ({
  total: 0,
  setTotal: (total: number) => set({ total }),
}));
