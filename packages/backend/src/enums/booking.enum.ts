// Add more if it necessary
export enum BookingStatus {
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/**
 * Old status from ezcloud
 */
// export enum BookingStatus {
//   CANCELED = 'CANCEL',
//   PROCESSING = 'AWAIT_PAYMENT',
//   COMPLETED = 'CONFIRM',
//   UNKNOWN = 'UNKNOWN',
// }

export enum CommissionPaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
  NO_PAID = 'NO_PAID',
}
