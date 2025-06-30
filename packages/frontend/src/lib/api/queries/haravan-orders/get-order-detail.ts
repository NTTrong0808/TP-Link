import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { IOrder } from './type'

export interface Variables {
  id: string
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

export const getHaravanOrderDetail = async (variables?: Variables): Promise<Response> => {
  const response = await axios.get<Response>(`${process.env.NEXT_PUBLIC_API_URL}/orders/${variables?.id}`)

  return response.data
}

export const getHaravanOrderDetailKey = getHaravanOrderDetail.name

export const useHaravanOrderDetail = createQuery<Response, Variables, any>({
  queryKey: [getHaravanOrderDetailKey],
  fetcher: getHaravanOrderDetail,
})

export const useMutateOrderDetail = createMutation<Response, Variables, any>({
  mutationFn: getHaravanOrderDetail,
})
