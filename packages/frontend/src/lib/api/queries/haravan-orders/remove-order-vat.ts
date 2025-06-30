import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { IOrder } from './type'

export interface Variables {
  id: string
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

export const removeOrderVAT = async (variables?: Variables): Promise<Response> => {
  const response = await axios.post<Response>(`${process.env.NEXT_PUBLIC_API_URL}/orders/remove-vat/${variables?.id}`)

  return response?.data as Response
}

export const useRemoveOrderVat = createMutation<Response, Variables, any>({
  mutationFn: removeOrderVAT,
})
