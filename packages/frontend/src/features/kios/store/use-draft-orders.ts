import { toastSuccess } from '@/components/widgets/toast'
import { DeepPartial } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { KiosFormSchemaType, KiosTypeEnum } from '../schemas/kios-form-schema'

export interface DraftOrder {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  formData?: DeepPartial<KiosFormSchemaType>
  type: KiosTypeEnum
  bookingId?: string | null
  expiryDate?: string | Date
}

// const serializeDate = (date: Date | string | undefined): string | undefined => {
//   if (!date) return undefined
//   return new Date(date).toISOString()
// }

// const deserializeDate = (dateStr: string | undefined): Date | undefined => {
//   if (!dateStr) return undefined
//   return new Date(dateStr)
// }

// const serializeDraftOrder = (order: DraftOrder) => ({
//   ...order,
//   createdAt: serializeDate(order.createdAt),
//   updatedAt: serializeDate(order.updatedAt),
//   expiryDate: serializeDate(order.expiryDate),
// })

// const deserializeDraftOrder = (order: any): DraftOrder => ({
//   ...order,
//   createdAt: deserializeDate(order.createdAt) || new Date(),
//   updatedAt: deserializeDate(order.updatedAt) || new Date(),
//   expiryDate: deserializeDate(order.expiryDate),
// })

export interface DraftOrderStore {
  draftOrders: DraftOrder[]

  currentDraftOrder?: DraftOrder | null
  setCurrentDraftOrder: (id: string) => void

  addDraftOrder: (draftOrder: Omit<DraftOrder, 'id'>) => DraftOrder
  updateDraftOrder: (id: string, draftOrder: Partial<DraftOrder>) => void
  removeDraftOrder: (id: string) => DraftOrder | null
  resetDraftOrders: (draftOrders: DraftOrder[]) => void
}

export const BROADCAST_CHANNEL = 'langfarm-draft-orders'

export const BROADCAST_CHANNEL_EVENTS = {
  DRAFT_ORDERS_UPDATED: 'DRAFT_ORDERS_UPDATED',
}

export const createDraftOrdersChannel = () => {
  return new BroadcastChannel(BROADCAST_CHANNEL)
}

const broadcastDraftOrdersUpdate = (data: DraftOrder, source: 'local' | 'broadcast' = 'local') => {
  if (source === 'broadcast') return

  try {
    const channel = createDraftOrdersChannel()
    channel.postMessage({
      type: BROADCAST_CHANNEL_EVENTS.DRAFT_ORDERS_UPDATED,
      data,
      source: 'local',
    })
  } catch (error) {
    console.error('Error broadcasting draft orders update:', error)
  } finally {
    const channel = createDraftOrdersChannel()
    channel.close()
  }
}

const STORAGE_KEY = 'LangfarmTicketDraftOrders'

export const useDraftOrders = create<DraftOrderStore>()(
  persist(
    (set, get) => ({
      draftOrders: [],

      setCurrentDraftOrder: (id: string) => {
        const currentState = get()
        const currentActiveDraftOrder = currentState?.draftOrders?.find((order) => order.id === id)
        if (currentActiveDraftOrder) {
          set({ currentDraftOrder: currentActiveDraftOrder })
          broadcastDraftOrdersUpdate(currentActiveDraftOrder)
        }
      },

      addDraftOrder: (draftOrder) => {
        if (get().draftOrders.length >= 10) {
          toastSuccess('Chỉ tạo được tối đa 10 đơn hàng.')
          return get().draftOrders?.[0]
        }

        const newDraftOrder = { ...draftOrder, id: uuidv4() }
        const currentState = get()
        const newState = {
          ...currentState,
          draftOrders: [newDraftOrder, ...(currentState?.draftOrders || [])],
        }

        set(newState)
        broadcastDraftOrdersUpdate(newDraftOrder)
        return newDraftOrder
      },

      updateDraftOrder: (id, draftOrder) => {
        const currentState = get()
        const newState = {
          ...currentState,
          draftOrders:
            currentState?.draftOrders?.map((order) =>
              order?.id === id ? { ...order, ...draftOrder } : { ...order },
            ) || [],
        }

        set(newState)

        const currentActiveDraftOrder = newState?.draftOrders?.find((order) => order?.id === id)
        if (currentActiveDraftOrder) {
          broadcastDraftOrdersUpdate(currentActiveDraftOrder)
        }
      },

      removeDraftOrder: (id) => {
        const currentState = get()
        const fromIndex = currentState?.draftOrders?.findIndex((t) => t.id === id)
        const newDraftOrders = currentState?.draftOrders?.filter((t, index) => index !== fromIndex)
        const newState = {
          ...currentState,
          draftOrders: newDraftOrders,
        }

        set(newState)

        const currentActiveDraftOrder =
          newDraftOrders?.[fromIndex > newDraftOrders.length - 1 ? fromIndex - 1 : fromIndex] || null

        broadcastDraftOrdersUpdate(currentActiveDraftOrder)

        return currentActiveDraftOrder
      },

      resetDraftOrders: (draftOrders) => {
        const currentState = get()
        const newState = {
          ...currentState,
          draftOrders,
        }

        set(newState)
        broadcastDraftOrdersUpdate(draftOrders?.[0] as DraftOrder)
      },
    }),
    {
      name: STORAGE_KEY,
      // partialize: (state) => ({
      //   draftOrders: state.draftOrders.map(serializeDraftOrder),
      //   currentDraftOrder: state.currentDraftOrder ? serializeDraftOrder(state.currentDraftOrder) : null,
      // }),
      // onRehydrateStorage: () => (state) => {
      //   if (state) {
      //     state.draftOrders = state.draftOrders.map(deserializeDraftOrder)
      //     state.currentDraftOrder = state.currentDraftOrder ? deserializeDraftOrder(state.currentDraftOrder) : null
      //   }
      // },
    },
  ),
)

// if (typeof window !== 'undefined') {
//   window.addEventListener('storage', (event) => {
//     if (event.key === STORAGE_KEY && event.newValue && !isUpdatingFromStorage) {
//       try {
//         isUpdatingFromStorage = true
//         const newState = JSON.parse(event.newValue)
//         const deserializedState = {
//           ...newState.state,
//           draftOrders: newState.state.draftOrders.map(deserializeDraftOrder),
//           currentDraftOrder: newState.state.currentDraftOrder
//             ? deserializeDraftOrder(newState.state.currentDraftOrder)
//             : null,
//         }
//         useDraftOrders.setState(deserializedState)
//       } catch (error) {
//         console.error('Error parsing draft orders state:', error)
//       } finally {
//         isUpdatingFromStorage = false
//       }
//     }
//   })
// }
