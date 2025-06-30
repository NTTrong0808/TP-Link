import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'

export interface Variables {
  transId: string
}

export interface Response extends ApiResponse<Blob> {}

export interface Error extends AxiosError<Response> {}

export const getVatInvoiceByTransId = async (variables: Variables, config?: AxiosRequestConfig): Promise<Blob> => {
  const response = await axios.get<Blob>(`${process.env.NEXT_PUBLIC_API_URL}/meinvoice/${variables.transId}`, {
    ...config,
    responseType: 'blob',
  })
  return response.data
}

export const getVatInvoiceKey = getVatInvoiceByTransId.name

export const useGetVatInvoiceByTransId = createMutation<Blob, Variables, Error>({
  mutationKey: [getVatInvoiceKey],
  mutationFn: getVatInvoiceByTransId,
})
