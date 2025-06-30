import { OrderPaymentMethod } from '@/lib/api/queries/haravan-orders/type'

export const mappingPaymentMethod = (paymentMethod?: OrderPaymentMethod | null) => {
  if (paymentMethod === OrderPaymentMethod.COD) {
    return 'COD'
  }
  if (paymentMethod === OrderPaymentMethod.PLATFORM) {
    return 'Sàn thanh toán'
  }
  return 'Sàn thanh toán'
}
