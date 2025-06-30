import { z } from 'zod'

export const dashboardChartSchema = z.object({
  date: z.string(),
  current: z.number(),
  lastPeriod: z.number(),
  rate: z.number(),
  lastPeriodDate: z.string(),
})

export const dashboardSaleChannelsSchema = z.object({
  saleChannelName: z.string(),
  revenue: z.number(),
  ticketSold: z.number(),
  ticketSoldAdult: z.number(),
  ticketSoldChild: z.number(),
  saleChannelGroup: z.string(),
})

export const dashboardPieChartSchema = z.object({
  saleChannelName: z.string(),
  revenue: z.number(),
  ticketSold: z.number(),
  ticketSoldAdult: z.number(),
  ticketSoldChild: z.number(),
  saleChannelGroup: z.string(),
})

export const dashboardComposedChartSchema = z
  .object({
    date: z.string(),
    currentRevenue: z.number(),
    lastPeriodRevenue: z.number(),
    lastPeriodDate: z.string(),

    currentTicketSold: z.number(),
    lastPeriodTicketSold: z.number(),
    saleChannels: z.array(z.string()).optional(),
    details: z
      .array(
        z.object({
          saleChannelName: z.string(),
          currentRevenue: z.number(),
          lastPeriodRevenue: z.number(),
          currentTicketSold: z.number(),
          lastPeriodTicketSold: z.number(),
          saleChannelGroup: z.string(),
        }),
      )
      .optional(),
  })
  .passthrough()

export const dashboardSchema = z.object({
  revenue: z.array(dashboardChartSchema).optional(),
  ticketSold: z.array(dashboardChartSchema).optional(),

  saleChannels: z.array(dashboardSaleChannelsSchema).optional(),

  composedChart: z.array(dashboardComposedChartSchema),
  pieChart: z.array(dashboardPieChartSchema),

  // totalTicketExpired: z.number(),
  // revenueRate: z.number(),
  // ticketSoldRate: z.number(),
  // ticketExpiredRate: z.number(),
  lastUpdated: z.date().optional(),

  totalRevenue: z.number(),
  totalRevenueByCash: z.number(),
  totalRevenueByPayoo: z.number(),
  // totalRevenueByPayooQR: z.number(),

  totalTicketSold: z.number(),
  totalTicketSoldAdult: z.number(),
  totalTicketSoldChild: z.number(),

  totalBooking: z.number(),
  totalBookingAverage: z.number(),
})

export type Dashboard = z.infer<typeof dashboardSchema>
export type DashboardChart = z.infer<typeof dashboardChartSchema>
export type DashboardSaleChannels = z.infer<typeof dashboardSaleChannelsSchema>
export type DashboardComposedChart = z.infer<typeof dashboardComposedChartSchema>
export type DashboardPieChart = z.infer<typeof dashboardPieChartSchema>
