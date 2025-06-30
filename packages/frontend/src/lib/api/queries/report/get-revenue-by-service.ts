import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByService } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByService[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByService, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByService = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_SERVICE, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })
  return response.data
}

export const getRevenueByServiceKey = REPORT_API_ROUTES.GET_REVENUE_BY_SERVICE

export const useGetRevenueByService = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByServiceKey],
  fetcher: getRevenueByService,
})

export const useExportRevenueByServiceMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByService({ ...variables, isExportReport: true }),
})
