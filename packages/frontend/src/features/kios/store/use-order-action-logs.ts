// stores/useOrderActionsLogsStore.ts
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

interface OrderActionLog {
  action: string
  metadata: Record<string, any>
  timestamp: string
}

interface OrderActionsLogsState {
  sessionId: string
  userId: string | null
  userName: string
  page: 'Kios'
  actions: OrderActionLog[]
  setUserId: (id: string) => void
  setUserName: (id: string) => void
  logAction: (action: string, metadata?: Record<string, any>) => void
  resetSession: () => void
  getPayload: () => {
    sessionId: string
    userId: string
    page: 'Kios'
    actions: OrderActionLog[]
  }
}

export const useOrderActionsLogsStore = create<OrderActionsLogsState>((set, get) => ({
  sessionId: uuidv4(),
  userId: null,
  userName: '',
  page: 'Kios', // cố định cho trang bán vé
  actions: [],
  setUserId: (id) => set({ userId: id }),
  setUserName: (name) => set({ userName: name }),
  logAction: (action, metadata = {}) =>
    set((state) => ({
      actions: [
        ...state.actions,
        {
          action,
          metadata,
          timestamp: new Date().toISOString(),
        },
      ],
    })),
  resetSession: () =>
    set({
      sessionId: uuidv4(),
      actions: [],
    }),
  getPayload: () => {
    const { sessionId, userId, page, actions, userName } = get()
    if (!userId) throw new Error('userId is missing')
    return { sessionId, userId, page, actions, userName }
  },
}))
