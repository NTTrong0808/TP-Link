import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'

export interface Variables {
  ids?: string[]
}

export interface Response extends ApiResponse<any> {}

export interface Error extends AxiosError<Response> {}

export const markAsUsedIssuedTickets = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(`/issued-tickets/mark-as-used`, {
    data: variables,
  })
  return response.data
}

export const markAsUsedIssuedTicketsKey = markAsUsedIssuedTickets.name

export const useMarkAsUsedIssuedTicketsMutation = createMutation<Response, Variables, any>({
  mutationKey: [markAsUsedIssuedTicketsKey],
  mutationFn: markAsUsedIssuedTickets,
})
