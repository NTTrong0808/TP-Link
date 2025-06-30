'use client'

import { useEffect } from 'react'
import { BROADCAST_CHANNEL_EVENTS, createDraftOrdersChannel, useDraftOrders } from '../store/use-draft-orders'

export const DraftOrdersProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const channel = createDraftOrdersChannel()

    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.data &&
        event.data.type === BROADCAST_CHANNEL_EVENTS.DRAFT_ORDERS_UPDATED &&
        event.data.source === 'local'
      ) {
        useDraftOrders.setState({ currentDraftOrder: event.data.data })
      }
    }

    channel.addEventListener('message', handleMessage)

    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [])

  return children
}
