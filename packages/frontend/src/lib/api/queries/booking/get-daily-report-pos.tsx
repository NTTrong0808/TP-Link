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

export const getDailyReportPOS = async (): Promise<Response> => {
  const response = await consumerApi.get<Response>(`/bookings/daily-report-pos`)

  return response.data
}

export const getDailyReportPOSKey = getDailyReportPOS.name

export const useGetDailyReportPOS = createQuery<Response, {}, any>({
  queryKey: [getDailyReportPOSKey],
  fetcher: getDailyReportPOS,
})
