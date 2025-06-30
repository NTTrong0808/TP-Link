import { z } from 'zod'

export const PayooOrderStatus = {
  0: 'Chưa thanh toán',
  1: 'Đã thanh toán',
  2: 'Hủy thanh toán',
  3: 'Hủy đơn hàng',
}

export const bookingVatSchema = z.object({
  taxCode: z.string().min(1, { message: 'Mã số thuế không được để trống' }),
  legalName: z.string().min(1, { message: 'Tên công ty không được để trống' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  receiverEmail: z.string().email({ message: 'Email không hợp lệ' }),
})

export enum BookingStatus {
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  UNKNOWN = 'UNKNOWN',
}

export const bookingItemSchema = z.object({
  serviceId: z.string(),
  title: z.string(),
  quantity: z.number(),
  price: z.number(),
  priceConfigId: z.string(),
  shortTitle: z.string(),
  saleChannelId: z.string().optional(),
  targetId: z.string().optional(),
})

export const bookingSchema = z.object({
  _id: z.string(),
  bookingCode: z.string(),
  totalPaid: z.number(),
  commissionRate: z.number(),
  checkInDate: z.string(),
  status: z.string(),
  items: z.array(bookingItemSchema),
  ezCloudData: z.record(z.any()).optional(),
  payooData: z.record(z.any()).optional(),
  referralCode: z.string().optional(),
  taId: z.string().optional(),
  customer: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  vatInfo: z.record(z.any()).optional(),
  commissionPaymentStatus: z.string(),
  paymentSessionExpiresAt: z.string().optional(),
  paymentMethodId: z.string(),
  confirmedAt: z.number().optional(),
  meInvoiceCreatedAt: z.number().optional(),
  completedAt: z.number().optional(),
  paidAt: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  bankAccountId: z.string().optional(),
})

export type Booking = z.infer<typeof bookingSchema>
export type BookingWithPaymentMethodName = Booking & {
  paymentMethodName?: string
}
export type BookingItem = z.infer<typeof bookingItemSchema>
export type BookingVat = z.infer<typeof bookingVatSchema>
