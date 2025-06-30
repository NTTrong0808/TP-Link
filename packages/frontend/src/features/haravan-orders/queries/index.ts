// stores/useQueryStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FilterOperator = 'contain' | 'equal' | 'gte' | 'lte' | 'in'

export type AdvancedFilter = {
  field: string
  operator?: FilterOperator
  value: string | number | boolean | string[]
}

type QueryState = {
  advancedFilters: AdvancedFilter[]
  createdAt: number | null // timestamp khi lưu filters
  setAdvancedFilters: (filters: AdvancedFilter[]) => void
  resetAdvancedFilters: () => void
}

const DEFAULT_FILTERS: AdvancedFilter[] = [
  { field: 'bookingCode', operator: 'contain', value: 'DHEC' },
  { field: 'receiptNumber', operator: 'contain', value: '371' },
  { field: 'createdByName', operator: 'contain', value: 'admin' },
  { field: 'saleChannelId', operator: 'equal', value: '67d13e7c9cea0b79ac07fddb' },
]

export const useQueryStore = create<QueryState>()(
  persist(
    (set) => ({
      advancedFilters: DEFAULT_FILTERS,
      createdAt: Date.now(),
      setAdvancedFilters: (filters) => set({ advancedFilters: filters, createdAt: Date.now() }),
      resetAdvancedFilters: () =>
        set({
          advancedFilters: DEFAULT_FILTERS,
          createdAt: Date.now(),
        }),
    }),
    {
      name: 'query-store',
      partialize: (state) => ({
        advancedFilters: state.advancedFilters,
        createdAt: state.createdAt,
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const data = JSON.parse(str)

          const now = new Date()
          const saved = new Date(data.state.createdAt || 0)

          const sameDay =
            now.getFullYear() === saved.getFullYear() &&
            now.getMonth() === saved.getMonth() &&
            now.getDate() === saved.getDate()

          // Nếu không phải cùng ngày → xóa luôn
          if (!sameDay) {
            localStorage.removeItem(name)
            return null
          }

          return data
        },
        setItem: (name, value) => localStorage.setItem(name, value?.toString()),
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)
