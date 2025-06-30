import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { IOrderHistory } from './schema'

export interface Variables {
  bookingId: string
}

export interface Response extends ApiResponse<IOrderHistory[]> {}

export interface Error extends AxiosError<Response> {}
const getAllOrderHistoriesRoute = '/booking-histories/all/:bookingId'

export const getAllOrderHistories = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(
    getAllOrderHistoriesRoute?.replace(':bookingId', variables?.bookingId || ''),
  )

  return response.data
}

export const getAllOrderHistoriesKey = getAllOrderHistoriesRoute

export const useGetAllOrderHistories = createQuery<Response, Variables, any>({
  queryKey: [getAllOrderHistoriesKey],
  fetcher: getAllOrderHistories,
})
