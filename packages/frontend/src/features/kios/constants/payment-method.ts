export const paymentMethodKey = {
  CASH: 'cash',
  CREDIT_CARD: 'credit-card',
  MOMO: 'momo',
  ZALOPAY: 'zalopay',
  VNPAY: 'vnpay',
  BANK_TRANSFER: 'bank-transfer',
  BANK_ACCOUNT: 'bank-account',
} as const

export const paymentMethodLabel = {
  [paymentMethodKey.CASH]: 'Tiền mặt',
  [paymentMethodKey.CREDIT_CARD]: 'Thẻ quốc tế',
  [paymentMethodKey.MOMO]: 'Momo',
  [paymentMethodKey.ZALOPAY]: 'Zalopay',
  [paymentMethodKey.VNPAY]: 'VNPAY',
  [paymentMethodKey.BANK_TRANSFER]: 'Chuyển khoản',
}

export interface PaymentMethod {
  icon: string
  label: string
  value: string
}

export const paymentMethods: PaymentMethod[] = [
  {
    icon: '/assets/cash.svg',
    label: 'Thanh toán bằng tiền mặt',
    value: paymentMethodKey.CASH,
  },
  {
    icon: '/assets/credit-card.svg',
    label: 'Thanh toán bằng thẻ quốc tế',
    value: paymentMethodKey.CREDIT_CARD,
  },
  {
    icon: '/assets/momo.svg',
    label: 'Thanh toán bằng Momo',
    value: paymentMethodKey.MOMO,
  },
  {
    icon: '/assets/zalo.svg',
    label: 'Thanh toán bằng Zalopay',
    value: paymentMethodKey.ZALOPAY,
  },
  {
    icon: '/assets/vnpay.svg',
    label: 'Thanh toán bằng VNPAY',
    value: paymentMethodKey.VNPAY,
  },
]
