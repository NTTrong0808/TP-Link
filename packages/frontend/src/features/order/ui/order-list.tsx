'use client'

import { URLS, URLS_TITLE } from '@/constants/urls'
import { useFilter } from '@/hooks/use-filter'
import { useSearch } from '@/hooks/use-search'
import { PanelView } from '@/layouts/panel/panel-view'
import useHeader from '@/layouts/panel/use-header'
import { OrderStatus, OrderVariables } from '@/lib/api/queries/order/schema'
import { GroupSaleChannel } from '@/lib/api/queries/sale-channel/types'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { useAuth } from '@/lib/auth/context'
import OrderListFilter from '../components/order-list-filter'
import OrderListTable from '../components/order-list-table'
import OrderSummary from '../components/order-summary'
import { ORDER_DEFAULT_FILTER } from '../constants/filter'

const OrderList = () => {
  useHeader({
    title: URLS_TITLE[URLS.ADMIN.ORDER.INDEX],
  })
  const { currentUser } = useAuth()
  const canAccess = useCanAccess()

  const isCanViewOrder = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_VIEW)
  const isCanViewOrderByEmployee = canAccess(CASL_ACCESS_KEY.TICKET_ORDER_BY_EMP_VIEW)
  const isCanViewOnlineOrder = canAccess(CASL_ACCESS_KEY.TICKET_ONLINE_ORDER_VIEW)

  const [search] = useSearch()
  const [filter] = useFilter(ORDER_DEFAULT_FILTER)

  const variables: OrderVariables = {
    search: search || undefined,
    status: filter.status?.map((s) => s as OrderStatus) ?? ORDER_DEFAULT_FILTER.status,
    vat: filter.vat ?? ORDER_DEFAULT_FILTER.vat,
    totalPaidFrom: filter.totalPaidFrom
      ? Number(filter.totalPaidFrom)
      : Number(ORDER_DEFAULT_FILTER.totalPaidFrom) || undefined,
    totalPaidTo: filter.totalPaidTo
      ? Number(filter.totalPaidTo)
      : Number(ORDER_DEFAULT_FILTER.totalPaidTo) || undefined,
    paymentMethodId: filter.paymentMethodId ?? ORDER_DEFAULT_FILTER.paymentMethodId,
    createdFrom: filter.createdFrom ?? ORDER_DEFAULT_FILTER.createdFrom,
    createdTo: filter.createdTo ?? ORDER_DEFAULT_FILTER.createdTo,
    createdBy:
      isCanViewOrderByEmployee && !isCanViewOrder
        ? [currentUser?._id as string]
        : filter.createdBy || ORDER_DEFAULT_FILTER.createdBy,
    saleChannelId: filter.saleChannelId ?? ORDER_DEFAULT_FILTER.saleChannelId,
    saleChannelGroup: isCanViewOnlineOrder && !isCanViewOrder ? [GroupSaleChannel.ONLINE] : [],
  }

  return (
    <PanelView>
      <OrderListFilter variables={variables} />
      <OrderSummary variables={variables} />
      <OrderListTable variables={variables} />
    </PanelView>
  )
}

export default OrderList
