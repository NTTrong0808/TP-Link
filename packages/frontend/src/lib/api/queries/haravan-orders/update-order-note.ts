import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { IOrder } from './type'

export interface Variables {
  id: string
  note?: string
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

const updateOrderNoteRoute = '/orders/:id/note'

const updateOrderNote = async (variables: Variables): Promise<Response> => {
  const response = await axios.patch<Response>(
    `${process.env.NEXT_PUBLIC_API_URL}${updateOrderNoteRoute.replace(':id', variables.id)}`,
    variables,
  )

  return response.data
}

export const updateOrderNoteKey = updateOrderNoteRoute

export const useUpdateOrderNote = createMutation<Response, Variables, any>({
  mutationKey: [updateOrderNoteKey],
  mutationFn: updateOrderNote,
})
