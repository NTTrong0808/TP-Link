import { OrderHistoryAction, OrderStatus } from './schema'

export const ORDER_STATUS_LABEL = {
  [OrderStatus.PENDING]: 'Chờ thanh toán',
  [OrderStatus.PROCESSING]: 'Chờ thanh toán',
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.CANCELLED]: 'Đã hủy',
  [OrderStatus.CANCEL]: 'Đã hủy',
  [OrderStatus.PAYMENT_FAILED]: 'Thanh toán thất bại',
  [OrderStatus.POS_CREATED]: 'Đã tạo đơn',

  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderStatus.CONFIRM]: 'Đã xác nhận',
  [OrderStatus.EXPIRED]: 'Đã hết hạn',
  [OrderStatus.COMPLETED]: 'Đã hoàn tất',
}

export const ORDER_STATUS_COLOR = {
  [OrderStatus.PENDING]: 'text-primary-orange-300',
  [OrderStatus.PROCESSING]: 'text-primary-orange-300',
  [OrderStatus.PAID]: 'text-semantic-success-400',
  [OrderStatus.CANCELLED]: 'text-secondary-strawberry-300',
  [OrderStatus.CANCEL]: 'text-secondary-strawberry-300',
  [OrderStatus.PAYMENT_FAILED]: 'text-secondary-strawberry-300',
  [OrderStatus.POS_CREATED]: 'text-primary-orange-300',

  [OrderStatus.CONFIRMED]: 'text-neutral-grey-600',
  [OrderStatus.EXPIRED]: 'text-secondary-strawberry-300',
  [OrderStatus.COMPLETED]: 'text-semantic-success-400',
}

export const ORDER_HISTORY_ACTION_LABEL = {
  [OrderHistoryAction.CREATED]: 'Đã tạo đơn hàng',
  [OrderHistoryAction.CANCELLED]: 'Đã hủy đơn hàng',
  [OrderHistoryAction.FAILED]: 'Thanh toán không thành công',
  [OrderHistoryAction.UPDATED_NOTE]: 'Đã chỉnh sửa ghi chú',
  [OrderHistoryAction.CONFIRMED]: 'Đã xác nhận thanh toán',
  [OrderHistoryAction.SENT_TICKET_EMAIL]: 'Đã gửi lại vé',
  [OrderHistoryAction.PRINTED_BILL]: 'Đã in hoá đơn',
}
