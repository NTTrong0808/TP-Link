'use client'

import { defaultVariables, useGetDashboard, Variables } from '@/lib/api/queries/dashboard/get-dashboard'
import { appDayJs } from '@/utils/dayjs'
import { useSearchParams } from 'next/navigation'
import OverallContainer from './overall-container'
import OverallRootCharts from './overall-root-charts'
import OverallRootRange from './overall-root-range'
import OverallRootStats from './overall-root-stats'

export interface OverallRootProps {}

const OverallRoot = (props: OverallRootProps) => {
  const searchParams = useSearchParams()

  const { data } = useGetDashboard({
    variables: {
      from:
        searchParams.get('from') && appDayJs(searchParams.get('from')!, 'YYYY-MM-DD').isValid()
          ? appDayJs(searchParams.get('from')!, 'YYYY-MM-DD').toDate()
          : defaultVariables.from,
      to:
        searchParams.get('to') && appDayJs(searchParams.get('to')!, 'YYYY-MM-DD').isValid()
          ? appDayJs(searchParams.get('to')!, 'YYYY-MM-DD').toDate()
          : defaultVariables.to,
      type: (searchParams.get('type') || defaultVariables.type) as Variables['type'],
    },
    select: (data) => ({
      chart: {
        revenue: data?.data?.revenue,
        ticketSold: data?.data?.ticketSold,
        saleChannels: data?.data?.saleChannels,
        composedChart: data?.data?.composedChart,
        pieChart: data?.data?.pieChart,
      },
      stats: {
        // totalTicketExpired: data?.data?.totalTicketExpired,
        // revenueRate: data?.data?.revenueRate,
        // ticketSoldRate: data?.data?.ticketSoldRate,
        // ticketExpiredRate: data?.data?.ticketExpiredRate,

        totalRevenue: data?.data?.totalRevenue,
        totalRevenueByCash: data?.data?.totalRevenueByCash,
        totalRevenueByPayoo: data?.data?.totalRevenueByPayoo,
        // totalRevenueByPayooQR: data?.data?.totalRevenueByPayooQR,

        totalTicketSold: data?.data?.totalTicketSold,
        totalTicketSoldAdult: data?.data?.totalTicketSoldAdult,
        totalTicketSoldChild: data?.data?.totalTicketSoldChild,

        totalBooking: data?.data?.totalBooking,
        totalBookingAverage: data?.data?.totalBookingAverage,
      },
      lastUpdated: data?.data?.lastUpdated,
    }),
  })

  return (
    <OverallContainer className="flex-1 w-full flex flex-col gap-4 max-w-none">
      <OverallRootRange lastUpdated={data?.lastUpdated} />
      <OverallRootStats data={data?.stats} />
      <OverallRootCharts data={data?.chart} />
    </OverallContainer>
  )
}

export default OverallRoot
