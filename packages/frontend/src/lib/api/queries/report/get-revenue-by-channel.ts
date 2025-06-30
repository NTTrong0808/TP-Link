import { consumerApi } from '@/lib/api'
import { ApiMeta, ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { REPORT_API_ROUTES } from '.'
import { GetReportVariables, IRevenueByChannel } from './schema'

export interface Variables extends GetReportVariables {}

export interface Response extends ApiResponse<IRevenueByChannel[]> {
  meta: ApiMeta & {
    summary: Omit<IRevenueByChannel, '_id'>
  }
}

export interface Error extends AxiosError<Response> {}

export const getRevenueByChannel = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(REPORT_API_ROUTES.GET_REVENUE_BY_CHANNEL, {
    ...variables,
    saleChannelGroup: variables?.saleChannelGroup !== 'ALL' ? variables?.saleChannelGroup : undefined,
  })

  return response.data
}

export const getRevenueByChannelKey = REPORT_API_ROUTES.GET_REVENUE_BY_CHANNEL

export const useGetRevenueByChannel = createQuery<Response, Variables, any>({
  queryKey: [getRevenueByChannelKey],
  fetcher: getRevenueByChannel,
})

export const useExportRevenueByChannelMutation = createMutation<Response, Variables, any>({
  mutationFn: (variables) => getRevenueByChannel({ ...variables, isExportReport: true }),
})
