export interface DashboardData {
  revenue?: { date: string; current: number; lastPeriod: number; rate: number; lastPeriodDate: string }[]
  ticketSold?: { date: string; current: number; lastPeriod: number; rate: number; lastPeriodDate: string }[]
  composedChart: {
    date: string
    currentRevenue: number
    lastPeriodRevenue: number
    currentTicketSold: number
    lastPeriodTicketSold: number
    lastPeriodDate: string
    saleChannels?: string[]
    details?: {
      saleChannelGroup: string
      saleChannelName: string
      currentRevenue: number
      lastPeriodRevenue: number
      currentTicketSold: number
      lastPeriodTicketSold: number
    }[]
    [key: string]: any
  }[]
  pieChart: {
    saleChannelName: string
    revenue: number
    ticketSold: number
    ticketSoldAdult: number
    ticketSoldChild: number
  }[]

  saleChannels: {
    saleChannelName: string
    revenue: number
    ticketSold: number
    ticketSoldAdult: number
    ticketSoldChild: number
  }[]
  // totalRevenue: number
  // totalTicketSold: number
  // totalTicketExpired: number
  // revenueRate: number
  // ticketSoldRate: number
  // ticketExpiredRate: number

  totalRevenue: number
  totalRevenueByCash: number
  totalRevenueByPayoo: number
  // totalRevenueByPayooQR: number
  totalTicketSold: number
  totalTicketSoldAdult: number
  totalTicketSoldChild: number

  totalBooking: number
  totalBookingAverage: number

  lastUpdated?: Date
}
