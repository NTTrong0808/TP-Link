import { consumerApi } from '@/lib/api'
import { IIssuedTicketHistory } from '@/lib/api/queries/ticket/schema'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'

export interface Variables {
  ticketId: string
}

export interface Response extends ApiResponse<IIssuedTicketHistory[]> {}

export interface Error extends AxiosError<Response> {}
const getAllTicketHistoriesRoute = '/issued-ticket-histories/all/:ticketId'

export const getAllTicketHistories = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(
    getAllTicketHistoriesRoute?.replace(':ticketId', variables?.ticketId || ''),
  )

  return response.data
}

export const getAllTicketHistoriesKey = getAllTicketHistoriesRoute

export const useGetAllTicketHistories = createQuery<Response, Variables, any>({
  queryKey: [getAllTicketHistoriesKey],
  fetcher: getAllTicketHistories,
})
