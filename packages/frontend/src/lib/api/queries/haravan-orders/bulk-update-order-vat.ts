import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { createMutation } from 'react-query-kit'
import { IOrder } from './type'

export interface Variables {
  vatDatas: {
    orderNumber: string
    address?: string
    legalName?: string
    receiverEmail?: string

    taxCode?: string

    note?: string
  }[]
}

export interface Response
  extends ApiResponse<{
    matched: number
    modified: number
  }> {}

export interface Error extends AxiosError<Response> {}

export const bulkUpdateOrderVAT = async (variables?: Variables): Promise<Response> => {
  const response: AxiosResponse<Response | Blob, any> | null = await axios.post<Blob>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/bulk-update-vat`,
    variables,
  )

  return response?.data as Response
}

export const useBulkUpdateOrderVAT = createMutation<Response, Variables, any>({
  mutationFn: bulkUpdateOrderVAT,
})
