import { z } from 'zod'
import { bankAccountSchema } from '../payment-method/schema'
import { issuedTicketSchema } from '../ticket/schema'
import { ApiParams } from './../../schema'

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  CANCEL = 'CANCEL',

  PAYMENT_FAILED = 'PAYMENT_FAILED',
  POS_CREATED = 'POS_CREATED',

  CONFIRMED = 'CONFIRMED',
  CONFIRM = 'CONFIRM',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',

  RETURNED = 'RETURNED',
}

export enum CommissionPaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
  NO_PAID = 'NO_PAID',
}

export const orderSchema = z.object({
  bookingCode: z.string(),
  receiptNumber: z.string(),
  totalPaid: z.number(),
  discount: z.number().optional(),
  commissionRate: z.number(),
  checkInDate: z.string(),
  status: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
  items: z.array(
    z.object({
      serviceId: z.string(),
      title: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  ezCloudData: z.record(z.any()).optional(),
  payooData: z.record(z.any()).optional(),
  referralCode: z.string().optional(),
  taId: z.string().optional(),
  customer: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  vatInfo: z
    .object({
      taxCode: z.string(),
      receiverEmail: z.string(),
      legalName: z.string(),
      address: z.string(),
      note: z.string().optional(),
    })
    .optional(),
  paymentSessionExpiresAt: z.string().optional(),
  paymentMethodId: z.union([
    z.string(),
    z.object({
      name: z.string(),
      _id: z.string(),
    }),
  ]),
  commissionPaymentStatus: z.enum(Object.values(CommissionPaymentStatus) as [string, ...string[]]),
  confirmedAt: z.number().optional(),
  meInvoiceCreatedAt: z.number().optional(),
  completedAt: z.number().optional(),
  paidAt: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  note: z.string().optional(),
  tickets: z.array(issuedTicketSchema).optional(),
  ticketValidFrom: z.string().optional(),
  ticketValidTo: z.string().optional(),
  _id: z.string(),
  paymentMethodName: z.string().optional(),
  createdBy: z.union([
    z.string(),
    z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
  ]),
  posTerminalId: z.union([
    z.string(),
    z.object({
      name: z.string(),
      _id: z.string(),
    }),
  ]),
  printCount: z.number().optional(),
  printTimes: z.array(z.union([z.date(), z.string()])).optional(),
  posTerminalName: z.string().optional(),
  createdByName: z.string().optional(),
  bookingVatToken: z.string().optional(),
  bookingVatExpiredAt: z.number().optional(),
  saleChannelName: z.string().optional(),
  bankAccountId: z.string().optional(),
  bankAccount: bankAccountSchema,
  cancelledByName: z.string().optional(),
  cancelledAt: z.string().optional(),
  cancelledReason: z.string().optional(),
})

export type IOrder = z.infer<typeof orderSchema>

export enum OrderHistoryAction {
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',

  UPDATED_NOTE = 'UPDATED_NOTE',
  CONFIRMED = 'CONFIRMED',

  SENT_TICKET_EMAIL = 'SENT_TICKET_EMAIL',

  PRINTED_BILL = 'PRINTED_BILL',
}

export const orderHistorySchema = z.object({
  _id: z.string(),
  bookingId: z.string(),
  action: z.union([z.string(), z.enum(Object.values(OrderHistoryAction) as [string, ...string[]])]),
  createdByName: z.string(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  note: z.string().optional(),
  bookingStatus: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
  cancelledReason: z.string().optional(),
  paymentMethodName: z.string().optional(),
})

export type IOrderHistory = z.infer<typeof orderHistorySchema>

export interface OrderVariables extends ApiParams {
  search?: string
  status?: (typeof OrderStatus)[keyof typeof OrderStatus][]
  totalPaidFrom?: number
  totalPaidTo?: number

  paymentMethodId?: string[]
  vat?: string[]
  taId?: string[]

  createdFrom?: string
  createdTo?: string

  createdBy?: string[]
  saleChannelId?: string[]
  saleChannelGroup?: string[]
}

export interface GetOrderVariables extends OrderVariables {
  isExportExcel?: boolean
}

export interface GetOrdersSummaryVariables extends OrderVariables {}
