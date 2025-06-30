import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { createMutation } from 'react-query-kit'
import { IOrder } from './type'

export interface Variables {
  id: string
  vatData?: {
    address?: string
    legalName?: string
    receiverEmail?: string

    taxCode?: string

    note?: string
  }
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

export const updateOrder = async (variables?: Variables): Promise<Response> => {
  const response: AxiosResponse<Response | Blob, any> | null = await axios.post<Blob>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/update/${variables?.id}`,
    {
      vatData: variables?.vatData,
    },
  )

  return response?.data as Response
}

export const useUpdateOrder = createMutation<Response, Variables, any>({
  mutationFn: updateOrder,
})
