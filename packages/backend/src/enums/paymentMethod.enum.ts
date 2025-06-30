export const PaymentType = {
  ZALOPAY: 1,
  INTERNATIONAL_CARDS: 2, // Thẻ quốc tế
  DOMESTIC_CARD: 3, // Thẻ nội địa
  MOMO: 6,
  QR_BANK: 7,
  BANK_TRANSFER: 8,
  PAYOO_ACCOUNT: 5,
}

export const PaymentMethod = {
  CASH: 'cash',
  PAYOO_BANK: 'bank-transfer',
  PAYOO_QR: 'qr-transfer',
  PAYOO: 'bank-account',
} as const

export const PayooQRValue = {
  [PaymentType.MOMO]: 5,
  [PaymentType.ZALOPAY]: 2,
}

export const PaymentMethodLabel = {
  [PaymentType.MOMO]: 'Momo',
  [PaymentType.ZALOPAY]: 'Zalopay',
  [PaymentType.INTERNATIONAL_CARDS]: 'Thẻ quốc tế',
  [PaymentType.DOMESTIC_CARD]: 'Thẻ nội địa',
  [PaymentType.QR_BANK]: 'QR Bank',
  [PaymentType.BANK_TRANSFER]: 'Chuyển khoản',
  [PaymentType.PAYOO_ACCOUNT]: 'Payoo',
}
