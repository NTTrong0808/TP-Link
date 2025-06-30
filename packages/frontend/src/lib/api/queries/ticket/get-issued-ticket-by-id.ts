import { consumerApi } from '@/lib/api'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'

export interface Variables {
  id: string
}

export interface Response extends ApiResponse<IIssuedTicket> {}

export interface Error extends AxiosError<Response> {}

export const getIssuedTicketById = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(`/issued-tickets/${variables?.id}`)

  return response.data
}

export const getIssuedTicketByIdKey = getIssuedTicketById.name

export const useGetIssuedTicketById = createQuery<Response, Variables, any>({
  queryKey: [getIssuedTicketByIdKey],
  fetcher: getIssuedTicketById,
})
