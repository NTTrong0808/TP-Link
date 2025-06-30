import { ISSUED_TICKET_HISTORY_STATUS, ISSUED_TICKET_STATUS } from './schema'

export const ISSUED_TICKET_STATUS_LABEL = {
  [ISSUED_TICKET_STATUS.UN_USED]: 'Chưa sử dụng',
  [ISSUED_TICKET_STATUS.USED]: 'Đã sử dụng',
  [ISSUED_TICKET_STATUS.EXPIRED]: 'Hết hạn',
  [ISSUED_TICKET_STATUS.DELETED]: 'Đã xoá',
} as const

export const ISSUED_TICKET_STATUS_COLOR = {
  [ISSUED_TICKET_STATUS.UN_USED]: 'text-semantic-success-400 bg-semantic-success-100',
  [ISSUED_TICKET_STATUS.USED]: 'bg-secondary-banana-100 text-primary-orange-300',
  [ISSUED_TICKET_STATUS.EXPIRED]: 'text-secondary-strawberry-300 bg-secondary-persimmon-100',
  [ISSUED_TICKET_STATUS.DELETED]: 'bg-neutral-grey-100 text-neutral-grey-600',
} as const

export const ISSUED_TICKET_HISTORY_STATUS_LABEL = {
  [ISSUED_TICKET_HISTORY_STATUS.VALID]: 'Vé được quét thành công',
  [ISSUED_TICKET_HISTORY_STATUS.INVALID]: 'Quét vé không hợp lệ',
  [ISSUED_TICKET_HISTORY_STATUS.QR_CODE_INVALID]: 'Mã QR không hợp lệ',
  [ISSUED_TICKET_HISTORY_STATUS.PRINT]: 'Đã in vé',
  [ISSUED_TICKET_HISTORY_STATUS.REPRINT]: 'Đã in lại vé',
  [ISSUED_TICKET_HISTORY_STATUS.EXPIRED]: 'Vé đã hết hạn',
  [ISSUED_TICKET_HISTORY_STATUS.CREATED]: 'Đã tạo vé',
  [ISSUED_TICKET_HISTORY_STATUS.MARK_AS_USED]: 'đánh dấu đã sử dụng',
} as const
