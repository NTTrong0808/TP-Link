import { Button } from '@/components/ui/button'
import { cn } from '@/lib/tw'
import { Slot } from '@radix-ui/react-slot'
import { ComponentProps, useEffect } from 'react'
import { defaultOrderFormData } from '../constants/order'
import { KIOS_TYPE } from '../schemas/kios-form-schema'
import { DraftOrder, useDraftOrders } from '../store/use-draft-orders'
import { useKiosContext } from './kios-context'

export interface KiosCreateOrderButtonProps extends ComponentProps<typeof Button> {
  onSuccess?: (order: DraftOrder) => void
}

const KiosCreateOrderButton = ({ onSuccess, ...props }: KiosCreateOrderButtonProps) => {
  const { services, paymentMethods } = useKiosContext()
  const { draftOrders, addDraftOrder } = useDraftOrders()

  const handleCreateNewDraftTransaction = () => {
    const newOrder = addDraftOrder({
      name: `Đơn hàng ${draftOrders.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      formData: {
        ...defaultOrderFormData,
        paymentMethod: paymentMethods?.[0]?._id,
        quantity: services.reduce((acc, service) => {
          acc[service.priceConfigId] = 0
          return acc
        }, {} as Record<string, number>),
      },
      type: KIOS_TYPE.COMPANY,
    })

    onSuccess?.(newOrder)
  }

  useEffect(() => {
    if (draftOrders.length !== 0) return

    handleCreateNewDraftTransaction()
  }, [draftOrders])

  return <Slot {...props} className={cn(props.className)} onClick={handleCreateNewDraftTransaction} />
}

export default KiosCreateOrderButton
