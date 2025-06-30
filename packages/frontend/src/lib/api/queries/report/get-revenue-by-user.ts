import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByUser } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByUser[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByUser, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByUser = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_USER, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })
  return response.data
}

export const getRevenueByUserKey = REPORT_API_ROUTES.GET_REVENUE_BY_USER

export const useGetRevenueByUser = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByUserKey],
  fetcher: getRevenueByUser,
})

export const useExportRevenueByUserMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByUser({ ...variables, isExportReport: true }),
})
