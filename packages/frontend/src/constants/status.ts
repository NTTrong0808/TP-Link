/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum IssuedTicketStatusLabel {
  USED = "Đã sử dụng",
  UN_USED = "Chưa sử dụng",
  EXPIRED = "Đã hết hiệu lực",
}

export enum IssuedTicketStatusColor {
  USED = "text-secondary-strawberry-300",
  UN_USED = "text-green-500",
  EXPIRED = "text-secondary-strawberry-300",
}

export enum IssuedTicketHistoryStatusLabel {
  VALID = "Vé hợp lệ",
  INVALID = "Vé không hợp lệ",
  QR_CODE_INVALID = "Mã QR không hợp lệ",
}

export enum IssuedTicketHistoryStatusColor {
  VALID = "text-green-500",
  INVALID = "text-secondary-strawberry-300",
  QR_CODE_INVALID = "text-secondary-strawberry-300",
}
