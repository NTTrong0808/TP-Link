import { z } from 'zod'
import { ApiParams } from '../../schema'
import { orderSchema } from '../order/schema'

export const revenueByUserSchema = z.object({
  _id: z.string(),
  codeEmp: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  totalRevenue: z.number().optional(),
  totalOriginalRevenue: z.number().optional(),
  totalVAT: z.number().optional(),
  totalPreVAT: z.number().optional(),
  totalDiscount: z.number().optional(),
  totalPromotion: z.number().optional(),
})

export type IRevenueByUser = z.infer<typeof revenueByUserSchema>

export const revenueByCustomerSchema = z.object({
  _id: z.string(),
  customerUniqueId: z.string().optional(),
  customerTaxCode: z.string().optional(),
  customerType: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),

  totalRevenue: z.number().optional(),
  totalOriginalRevenue: z.number().optional(),
  totalVAT: z.number().optional(),
  totalPreVAT: z.number().optional(),
  totalDiscount: z.number().optional(),
  totalPromotion: z.number().optional(),

  totalBooking: z.number().optional(),
  lastBookingCode: z.string().optional(),
  lastBookingDate: z.string().optional(),
})

export type IRevenueByCustomer = z.infer<typeof revenueByCustomerSchema>

export const revenueByDateSchema = z.object({
  _id: z.string(),
  date: z.union([z.string(), z.date()]).optional(),
  totalRevenue: z.number(),
  totalOriginalRevenue: z.number().optional(),
  totalVAT: z.number().optional(),
  totalPreVAT: z.number().optional(),
  totalDiscount: z.number().optional(),
  totalPromotion: z.number().optional(),
  totalRevenueByBankTransfer: z.number().optional(),
  totalRevenueByCash: z.number().optional(),
  totalRevenueByPayoo: z.number().optional(),
  totalVoucher: z.number().optional(),
  totalPoint: z.number().optional(),
  totalDebt: z.number().optional(),
  totalCollected: z.number().optional(),
})

export type IRevenueByDate = z.infer<typeof revenueByDateSchema>

export const revenueByChannelSchema = z.object({
  _id: z.string(),
  saleChannelName: z.string().optional(),
  totalRevenue: z.number().optional(),
  totalOriginalRevenue: z.number().optional(),
  totalDiscount: z.number().optional(),
  totalPromotion: z.number().optional(),
  totalVAT: z.number().optional(),
  totalPreVAT: z.number().optional(),
  totalBooking: z.number().optional(),
})

export type IRevenueByChannel = z.infer<typeof revenueByChannelSchema>

export const revenueByBookingSchema = orderSchema.extend({
  _id: z.string(),
  totalRevenue: z.number().optional(),
  totalOriginalRevenue: z.number().optional(),
  totalVAT: z.number().optional(),
  totalPreVAT: z.number().optional(),
  totalDiscount: z.number().optional(),
  totalPromotion: z.number().optional(),
  totalVoucher: z.number().optional(),
  totalPoint: z.number().optional(),
  totalDebt: z.number().optional(),
  totalRevenueByBankTransfer: z.number().optional(),
  totalRevenueByCash: z.number().optional(),
  totalRevenueByPayoo: z.number().optional(),
  count: z.number().optional(),
  createdAtTime: z.string().optional(),
})

export type IRevenueByBooking = z.infer<typeof revenueByBookingSchema>

export const revenueByServiceSchema = z.object({
  _id: z.string(),
  totalRevenue: z.number().optional(),
  totalOriginalRevenue: z.number().optional(),
  totalVAT: z.number().optional(),
  totalPreVAT: z.number().optional(),
  totalDiscount: z.number().optional(),
  totalPromotion: z.number().optional(),
  totalQuantity: z.number().optional(),
  totalAverage: z.number().optional(),
  count: z.number().optional(),

  serviceName: z.string().optional(),
  serviceCode: z.string().optional(),
  serviceBarcode: z.string().optional(),
  invoiceUnit: z.string().optional(),
})

export type IRevenueByService = z.infer<typeof revenueByServiceSchema>

export const revenueByBookingAndServiceSchema = revenueByBookingSchema.extend(revenueByServiceSchema.shape).extend({
  items: z.any().optional(),
})

export type IRevenueByBookingAndService = z.infer<typeof revenueByBookingAndServiceSchema>

export const revenueByBookingAndCustomerSchema = revenueByBookingSchema.extend({
  customerUniqueId: z.string().optional(),
  customerType: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
})

export type IRevenueByBookingAndCustomer = z.infer<typeof revenueByBookingAndCustomerSchema>

export interface GetReportVariables extends ApiParams {
  from?: string
  to?: string
  saleChannelGroup?: string
  isExportReport?: boolean
  email?: string
}
