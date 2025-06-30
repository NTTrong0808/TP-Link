export enum TypeConfig {
  PAYOO_POS = 56,
}

export enum API_PATH {
  CREATE_ORDER = '/auth/token',
}

export const PAYOO_CONST = {
  EXCHANGE_RATE: 1, // Vì LF chỉ bán ở VN nên mặc định là 1
  VAT_RATE_NAME: '8%', // Thuế suất mặc định
  VAT_RATE: 8,
  UNIT_NAME: 'Gói',
  MAIN_CURRENCY: 'VND',
}

export const PayooOrderStatus = {
  0: 'Chưa thanh toán',
  1: 'Đã thanh toán',
  2: 'Hủy thanh toán',
  3: 'Hủy đơn hàng',
}

export const PayooPaymentMethod = {
  0: 'Thẻ vật lý',
  1: 'Trả góp',
  2: 'QR Code',
  3: 'Thẻ quà tặng/Thẻ trả trước',
}
