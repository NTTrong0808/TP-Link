import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery, createSuspenseQuery } from 'react-query-kit'
import { IOrder } from './schema'

export interface Variables {
  id?: string
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

const getOrderDetailRoute = '/bookings/:id'

export const getOrderDetail = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(getOrderDetailRoute.replace(':id', variables?.id as string))

  return response.data
}

export const getOrderDetailKey = `order:${getOrderDetailRoute}`

export const useOrderDetail = createQuery<Response, Variables, any>({
  queryKey: [getOrderDetailKey],
  fetcher: getOrderDetail,
})

export const useSuspenseOrderDetail = createSuspenseQuery<Response, Variables, Error>({
  queryKey: [getOrderDetailKey],
  fetcher: getOrderDetail,
})
