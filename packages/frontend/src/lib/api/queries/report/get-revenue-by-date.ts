import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByDate } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByDate[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByDate, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByDate = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_DATE, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })

  return response.data
}

export const getRevenueByDateKey = REPORT_API_ROUTES.GET_REVENUE_BY_DATE

export const useGetRevenueByDate = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByDateKey],
  fetcher: getRevenueByDate,
})

export const useExportRevenueByDateMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByDate({ ...variables, isExportReport: true }),
})
