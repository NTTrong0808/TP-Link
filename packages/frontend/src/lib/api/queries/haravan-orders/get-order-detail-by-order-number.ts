import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'
import { IOrder } from './type'

export interface Variables {
  orderNumber: string
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

export const getHaravanOrderDetailByOrderNumber = async (variables?: Variables): Promise<Response> => {
  const response = await axios.get<Response>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/by-order-number/${variables?.orderNumber}`,
  )

  return response.data
}

export const getHaravanOrderDetailByOrderNumberKey = getHaravanOrderDetailByOrderNumber.name

export const useHaravanOrderDetailByOrderNumber = createQuery<Response, Variables, any>({
  queryKey: [getHaravanOrderDetailByOrderNumberKey],
  fetcher: getHaravanOrderDetailByOrderNumber,
})

export const useMutateOrderDetailByOrderNumber = createMutation<Response, Variables, any>({
  mutationFn: getHaravanOrderDetailByOrderNumber,
})
