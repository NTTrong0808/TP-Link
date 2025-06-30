import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByBookingAndCustomer } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByBookingAndCustomer[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByBookingAndCustomer, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByBookingAndCustomer = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_BOOKING_AND_CUSTOMER, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })

  return response.data
}

export const getRevenueByBookingAndCustomerKey = REPORT_API_ROUTES.GET_REVENUE_BY_BOOKING_AND_CUSTOMER

export const useGetRevenueByBookingAndCustomer = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByBookingAndCustomerKey],
  fetcher: getRevenueByBookingAndCustomer,
})

export const useExportRevenueByBookingAndCustomerMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByBookingAndCustomer({ ...variables, isExportReport: true }),
})
