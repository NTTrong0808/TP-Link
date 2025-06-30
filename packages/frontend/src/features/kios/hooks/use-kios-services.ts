import {
  SALE_CHANNEL_RETAIL_CODE,
  SALE_CHANNEL_TA_CODE,
  SALE_CHANNEL_WS,
  useServicesBySaleChannelCode,
} from '@/lib/api/queries/service/get-services-by-sale-channel-code'
import { appDayJs } from '@/utils/dayjs'
import { useOrderExpiryDate } from './use-order-expiry-date'
import { useOrderTA } from './use-order-ta'

const useKiosServices = () => {
  const [expiryDate] = useOrderExpiryDate()
  const [ta] = useOrderTA()

  const { ...props } = useServicesBySaleChannelCode({
    select: (resp) => resp || [],
    variables: {
      saleChannelCode: ta ? SALE_CHANNEL_TA_CODE : `${SALE_CHANNEL_RETAIL_CODE},${SALE_CHANNEL_WS}`,
      date: expiryDate ?? appDayJs().format('DD/MM/YYYY'),
    },
  })

  return { ...props }
}

export default useKiosServices
