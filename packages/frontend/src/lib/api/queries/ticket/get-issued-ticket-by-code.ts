import { consumerApi } from '@/lib/api'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'

export interface Variables {
  issuedCode: string
}

export interface Response extends ApiResponse<IIssuedTicket> {}

export interface Error extends AxiosError<Response> {}

export const getIssuedTicketByIssuedCode = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(`/issued-tickets/by-issued-code/${variables?.issuedCode}`)

  return response.data
}

export const getIssuedTicketByIssuedCodeKey = getIssuedTicketByIssuedCode.name

export const useGetIssuedTicketByIssuedCode = createQuery<Response, Variables, any>({
  queryKey: [getIssuedTicketByIssuedCodeKey],
  fetcher: getIssuedTicketByIssuedCode,
})
