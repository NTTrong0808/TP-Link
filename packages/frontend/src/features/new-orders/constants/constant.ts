import { ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'
import { OrderStatus } from '@/lib/api/queries/order/schema'

export const STATUS_OPTIONS = [
  { value: OrderStatus.PROCESSING, label: ORDER_STATUS_LABEL.PROCESSING },
  { value: OrderStatus.COMPLETED, label: ORDER_STATUS_LABEL.COMPLETED },
  { value: OrderStatus.CANCELLED, label: ORDER_STATUS_LABEL.CANCELLED },
]

export const STATUS_OPTIONS_MAP = new Map(STATUS_OPTIONS.map((s) => [s?.value, s]))

export const VAT_OPTIONS = [
  { value: 'VAT', label: 'Đã xuất VAT' },
  { value: 'NO_VAT', label: 'Chưa xuất VAT' },
]

export const VAT_OPTIONS_MAP = new Map(VAT_OPTIONS.map((s) => [s?.value, s]))

export const DATE_FORMAT = 'YYYY-MM-DD'

export const DEFAULT_PAGE_SIZE = 50
