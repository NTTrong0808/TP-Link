import { create } from 'zustand'

export interface TotalTicketState {
  total: number
  setTotal: (total: number) => void
}

export const useTotalTicket = create<TotalTicketState>((set) => ({
  total: 0,
  setTotal: (total: number) => set({ total }),
}))
