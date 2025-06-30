import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByBooking } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByBooking[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByBooking, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByBooking = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_BOOKING, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })

  return response.data
}

export const getRevenueByBookingKey = REPORT_API_ROUTES.GET_REVENUE_BY_BOOKING

export const useGetRevenueByBooking = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByBookingKey],
  fetcher: getRevenueByBooking,
})

export const useExportRevenueByBookingMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByBooking({ ...variables, isExportReport: true }),
})
