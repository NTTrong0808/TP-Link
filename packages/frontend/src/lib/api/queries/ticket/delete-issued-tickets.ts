import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'

export interface Variables {
  ids?: string[]
}

export interface Response extends ApiResponse<any> {}

export interface Error extends AxiosError<Response> {}

export const deleteIssuedTickets = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.delete<Response>(`/issued-tickets/delete`, {
    data: variables,
  })
  return response.data
}

export const deleteIssuedTicketsKey = deleteIssuedTickets.name

export const useDeleteIssuedTicketsMutation = createMutation<Response, Variables, any>({
  mutationKey: [deleteIssuedTicketsKey],
  mutationFn: deleteIssuedTickets,
})
