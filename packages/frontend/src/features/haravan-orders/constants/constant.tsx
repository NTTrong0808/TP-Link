import { ORDER_STATUS_LABEL } from '@/lib/api/queries/order/constant'

import LazadaImage from '@/assets/images/lazada.svg'
import ShopeeImage from '@/assets/images/shopee.svg'
import TiktokImage from '@/assets/images/tiktok.svg'
import { OrderChannel, OrderFinancialStatus, OrderHistoryStatus } from '@/lib/api/queries/haravan-orders/type'
import { OrderStatus } from '@/lib/api/queries/order/schema'
import {
  CheckCircle2Icon,
  CheckSquareIcon,
  PackageCheckIcon,
  PenLineIcon,
  RotateCcwIcon,
  SquarePenIcon,
  TruckIcon,
  XCircleIcon,
} from 'lucide-react'

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

export const CHANNEL_ICON = {
  [OrderChannel.SPE]: ShopeeImage,
  [OrderChannel.LZD]: LazadaImage,
  [OrderChannel.TTS]: TiktokImage,
}

export const FINANCIAL_STATUS_LABEL = {
  [OrderFinancialStatus.PENDING]: 'Chờ thanh toán',
  [OrderFinancialStatus.AUTHORIZED]: 'Đã xác thực',
  [OrderFinancialStatus.PARTIALLY_PAID]: 'Thanh toán một phần',
  [OrderFinancialStatus.PAID]: 'Đã thanh toán',
  [OrderFinancialStatus.PARTIALLY_REFUNDED]: 'Hoàn tiền một phần',
  [OrderFinancialStatus.REFUNDED]: 'Đã hoàn tiền',
  [OrderFinancialStatus.VOIDED]: 'Đã hủy',
}

export const ORDER_HISTORY_STATUS_LABEL = {
  [OrderHistoryStatus.CREATED]: 'Đã khởi tạo',
  [OrderHistoryStatus.CLOSED]: 'Đã đóng',
  [OrderHistoryStatus.CANCELLED]: 'Đã hủy',
  [OrderHistoryStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderHistoryStatus.UPDATED]: 'Cập nhật thông tin',
  [OrderHistoryStatus.NOTFULFILLED]: 'Đang giao hàng',
  [OrderHistoryStatus.FULFILLED]: 'Đã giao hàng',
  [OrderHistoryStatus.NULL]: 'Đang giao hàng',
  [OrderHistoryStatus.PARTIAL]: 'Giao một phần',
  [OrderHistoryStatus.RESTOCKED]: 'Đã trả hàng',
}

export const ORDER_HISTORY_STATUS_ICON = {
  [OrderHistoryStatus.CREATED]: <SquarePenIcon />,
  [OrderHistoryStatus.CLOSED]: <PackageCheckIcon />,
  [OrderHistoryStatus.CANCELLED]: <XCircleIcon />,
  [OrderHistoryStatus.CONFIRMED]: <CheckSquareIcon />,
  [OrderHistoryStatus.UPDATED]: <PenLineIcon />,

  [OrderHistoryStatus.FULFILLED]: <CheckCircle2Icon />,
  [OrderHistoryStatus.NOTFULFILLED]: <TruckIcon />,
  [OrderHistoryStatus.NULL]: <TruckIcon />,
  [OrderHistoryStatus.PARTIAL]: <TruckIcon />,
  [OrderHistoryStatus.RESTOCKED]: <RotateCcwIcon />,
}

export const INVOICE_SYMBOL = '1C25MOL'
