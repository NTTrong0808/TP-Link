import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { IOrder } from './type'

export interface Variables {
  id: string
  vatData: IOrder['vatData']
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

const updateOrderVatInfoRoute = '/orders/:id/vat-info'

const updateOrderVatInfo = async (variables: Variables): Promise<Response> => {
  const response = await axios.patch<Response>(
    `${process.env.NEXT_PUBLIC_API_URL}${updateOrderVatInfoRoute.replace(':id', variables.id)}`,
    variables?.vatData,
  )

  return response.data
}

export const updateOrderVatInfoKey = updateOrderVatInfoRoute

export const useUpdateOrderVatInfo = createMutation<Response, Variables, any>({
  mutationKey: [updateOrderVatInfoKey],
  mutationFn: updateOrderVatInfo,
})
