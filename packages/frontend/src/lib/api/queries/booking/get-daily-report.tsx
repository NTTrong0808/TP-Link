import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { createQuery } from 'react-query-kit'

export interface Response
  extends ApiResponse<{
    totalBank: number
    totalCash: number
    totalPayoo: number
    totalPoint: number
    totalVoucher: number
    cashierName: string
  }> {}

export const getDailyReport = async (): Promise<Response> => {
  const response = await consumerApi.get<Response>(`/bookings/daily-report-end-of-day`)

  return response.data
}

export const getDailyReportKey = getDailyReport.name

export const useGetDailyReport = createQuery<Response, {}, any>({
  queryKey: [getDailyReportKey],
  fetcher: getDailyReport,
})
