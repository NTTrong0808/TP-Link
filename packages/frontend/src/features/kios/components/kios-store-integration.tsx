import { TICKET_VALID_TIME_TO_SECOND } from '@/helper/ticket'
import { appDayJs } from '@/utils/dayjs'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useDebounce, useUpdateEffect } from 'react-use'
import { useOrderExpiryDate } from '../hooks/use-order-expiry-date'
import { useOrderTA } from '../hooks/use-order-ta'
import { useOrderActivation } from '../hooks/use-order-tab'
import { KiosFormSchemaType } from '../schemas/kios-form-schema'
import { useDraftOrders } from '../store/use-draft-orders'

export interface KiosStoreIntegrationProps {}

const KiosStoreIntegration = (props: KiosStoreIntegrationProps) => {
  const [orderActivationId] = useOrderActivation()
  const [_, setTa] = useOrderTA()
  const [, setExpiryDate] = useOrderExpiryDate()

  const { draftOrders, updateDraftOrder } = useDraftOrders()

  const draftOrder = draftOrders.find((order) => order.id === orderActivationId)

  const form = useFormContext<KiosFormSchemaType>()

  const allFields = useWatch({ control: form.control })

  // Update lại ngày hết hạn trên đơn khi qua ngày mới
  useEffect(() => {
    const currentExpiryDate = appDayJs().startOf('day').add(TICKET_VALID_TIME_TO_SECOND, 'second').isBefore(appDayJs())
      ? appDayJs().add(1, 'day')
      : appDayJs()
    const isValidExpiryDate =
      // draftOrder?.expiryDate &&
      // appDayJs().isBefore(appDayJs(draftOrder?.expiryDate).startOf('day').add(TICKET_VALID_TIME_TO_SECOND, 'second'))
      //   ? appDayJs(draftOrder?.expiryDate)
      //   :
      appDayJs(currentExpiryDate)

    setExpiryDate(isValidExpiryDate.format('DD/MM/YYYY'))
    updateDraftOrder(orderActivationId, { expiryDate: isValidExpiryDate.toDate() })
  }, [])

  useUpdateEffect(() => {
    setTa(allFields?.ta ?? null)
    // setExpiryDate(
    //   // draftOrder?.expiryDate ? appDayJs(draftOrder?.expiryDate).format('DD/MM/YYYY') :
    //   appDayJs().format('DD/MM/YYYY'),
    // )
    updateDraftOrder(orderActivationId, { formData: allFields })
  }, [allFields])

  useDebounce(
    () => {
      if (draftOrder) {
        form.reset(draftOrder.formData)
      }
    },
    100,
    [orderActivationId],
  )

  return null
}

export default KiosStoreIntegration
