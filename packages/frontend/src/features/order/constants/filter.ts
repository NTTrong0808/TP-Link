import { OrderStatus } from '@/lib/api/queries/order/schema'
import { appDayJs } from '@/utils/dayjs'
import { DATE_FORMAT } from './constant'

export const ORDER_DEFAULT_FILTER = {
  status: [OrderStatus.PROCESSING, OrderStatus.COMPLETED],
  vat: [],
  totalPaidFrom: '',
  totalPaidTo: '',
  paymentMethodId: [],
  saleChannelId: [],
  createdBy: [],
  createdFrom: appDayJs().startOf('day').format(DATE_FORMAT),
  createdTo: appDayJs().endOf('day').format(DATE_FORMAT),
}

export const ORDER_EMPTY_FILTER = {
  search: '',
  status: [],
  vat: [],
  totalPaidFrom: '',
  totalPaidTo: '',
  paymentMethodId: [],
  saleChannelId: [],
  createdBy: [],
  createdFrom: '',
  createdTo: '',
} as const
