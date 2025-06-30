'use client'

import { Skeleton } from '@/components/ui/skeleton'
import MoneyIcon from '@/components/widgets/icons/money-icon'
import ShoppingCard from '@/components/widgets/icons/shopping-card'
import TicketIcon from '@/components/widgets/icons/ticket-icon'
import { useOrdersSummary } from '@/lib/api/queries/order/get-orders-summary'
import { GetOrdersSummaryVariables } from '@/lib/api/queries/order/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { formatInternationalCurrency, formatInternationalWithoutCurrency } from '@/utils/currency'

export interface OrderSummaryProps {
  variables?: GetOrdersSummaryVariables
}

const OrderSummary = ({ variables }: OrderSummaryProps) => {
  const canAccess = useCanAccess()

  const isCanViewOrder = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW)
  const isCanViewOnlineOrder = canAccess(CASL_ACCESS_KEY.TICKET_ONLINE_ORDER_VIEW)
  const isCanViewOrderByEmployee = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_BY_EMP_VIEW)

  const { data, isLoading } = useOrdersSummary({
    variables,
    enabled: isCanViewOrder || isCanViewOnlineOrder || isCanViewOrderByEmployee,
  })

  return (
    <div className="rounded-lg border-low border bg-white px-5 py-4 flex items-center">
      <div className="flex flex-col gap-1 min-w-[390px]">
        <div className="flex items-center gap-1 font-medium text-[#616161]">
          <MoneyIcon />
          Tổng tiền
        </div>
        {isLoading ? (
          <Skeleton className="w-full h-[32px]" />
        ) : (
          <span className="font-bold text-2xl text-[#1F1F1F]">
            {formatInternationalCurrency(data?.data?.totalRevenue ?? 0, '.')}
          </span>
        )}
      </div>
      <div className="w-[1px] h-[60px] mx-6 bg-neutral-grey-200" />
      <div className="flex flex-col gap-1 min-w-[390px]">
        <div className="flex items-center gap-1 font-medium text-[#616161]">
          <ShoppingCard />
          Số đơn hàng
        </div>
        {isLoading ? (
          <Skeleton className="w-full h-[32px]" />
        ) : (
          <span className="font-bold text-2xl text-[#1F1F1F]">
            {formatInternationalWithoutCurrency(data?.data?.totalBookings ?? 0, '.')}
          </span>
        )}
      </div>
      <div className="w-[1px] h-[60px] mx-6 bg-neutral-grey-200" />

      <div className="flex flex-col gap-1 min-w-[390px]">
        <div className="flex items-center gap-1 font-medium text-[#616161]">
          <TicketIcon className="[&_path]:stroke-[#A7A7A7]" />
          Số Vé
        </div>
        {isLoading ? (
          <Skeleton className="w-full h-[32px]" />
        ) : (
          <span className="font-bold text-2xl text-[#1F1F1F]">
            {formatInternationalWithoutCurrency(data?.data?.totalTickets ?? 0, '.')}
          </span>
        )}
      </div>
    </div>
  )
}

export default OrderSummary
