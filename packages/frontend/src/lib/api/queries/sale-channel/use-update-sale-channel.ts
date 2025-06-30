import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { SaleChannel } from './types'

export interface Variables {
  saleChannelId: string
  services?: string[]
  isActive?: boolean
}

export interface Response extends ApiResponse<SaleChannel> {}

export interface Error extends AxiosError<Response> {}

export const updateSaleChannel = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.put<Response>(`/sale-channels/${variables?.saleChannelId}`, {
    services: variables?.services,
    isActive: variables?.isActive,
  })
  return response.data
}

export const useUpdateSaleChannel = createMutation<Response, Variables, any>({
  mutationFn: updateSaleChannel,
})
