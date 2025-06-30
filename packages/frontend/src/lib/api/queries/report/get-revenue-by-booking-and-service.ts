import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByBookingAndService } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByBookingAndService[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByBookingAndService, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByBookingAndService = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_BOOKING_AND_SERVICE, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })

  return response.data
}

export const getRevenueByBookingAndServiceKey = REPORT_API_ROUTES.GET_REVENUE_BY_BOOKING_AND_SERVICE

export const useGetRevenueByBookingAndService = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByBookingAndServiceKey],
  fetcher: getRevenueByBookingAndService,
})

export const useExportRevenueByBookingAndServiceMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByBookingAndService({ ...variables, isExportReport: true }),
})
