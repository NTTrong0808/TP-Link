export enum TypeConfig {
  ME_INVOICE = 55, // 5/5/2022 Thanks!
  OLA_ME_INVOICE = 12, // 5/5/2022 Thanks!
}

export enum API_PATH {
  FETCH_TOKEN = '/auth/token',
  GET_INVOICE = '/invoice/templates',
  GET_INVOICE_UNPUBLISH = '/invoice/unpublishview',
  CREATE_INVOICE = '/invoice',
  CANCEL_INVOICE = `/invoice/cancel`,
  SEND_EMAIL = `invoice/sendemail`,
}

export const ME_INVOICE_ENUM = {
  EXCHANGE_RATE: 1, // Vì LF chỉ bán ở VN nên mặc định là 1
  VAT_RATE_NAME: '8%', // Thuế suất mặc định
  VAT_RATE: 0.08,
  UNIT_NAME: 'Gói',
  MAIN_CURRENCY: 'VND',
}
