import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByCustomer } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByCustomer[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByCustomer, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByCustomer = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_CUSTOMER, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })
  return response.data
}

export const getRevenueByCustomerKey = REPORT_API_ROUTES.GET_REVENUE_BY_CUSTOMER

export const useGetRevenueByCustomer = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByCustomerKey],
  fetcher: getRevenueByCustomer,
})

export const useExportRevenueByCustomerMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByCustomer({ ...variables, isExportReport: true }),
})
