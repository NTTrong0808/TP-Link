import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery, createSuspenseQuery } from 'react-query-kit'
import { SaleChannel } from './types'

export interface Variables {}

export interface Response extends ApiResponse<SaleChannel[]> {}

export interface Error extends AxiosError<Response> {}

const saleChannelApiPath = '/sale-channels'

export const getSaleChannels = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(saleChannelApiPath)

  return response.data
}

export const getSaleChannelsKey = saleChannelApiPath

export const useGetSaleChannels = createQuery<Response, Variables, any>({
  queryKey: [getSaleChannelsKey],
  fetcher: getSaleChannels,
})

export const useSuspenseSaleChannels = createSuspenseQuery<Response, Variables, Error>({
  queryKey: [`suspense-sale-channel-${getSaleChannelsKey}`],
  fetcher: getSaleChannels,
})
