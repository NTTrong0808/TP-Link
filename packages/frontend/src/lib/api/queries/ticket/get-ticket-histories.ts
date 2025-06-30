import { consumerApi } from '@/lib/api'
import { IIssuedTicketHistory } from '@/lib/api/queries/ticket/schema'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createInfiniteQuery } from 'react-query-kit'

export interface Variables {
  pageSize?: number
  page?: number
}

export interface Response extends ApiResponse<IIssuedTicketHistory[]> {}

export interface Error extends AxiosError<Response> {}
const getTicketHistoriesRoute = '/issued-ticket-histories'

export const getTicketHistories = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(getTicketHistoriesRoute, {
    params: variables,
  })

  return response.data
}

export const getTicketHistoriesKey = getTicketHistoriesRoute

export const useInfiniteTicketHistories = createInfiniteQuery<Response, Variables, any>({
  queryKey: [getTicketHistoriesKey],
  fetcher: (variables, { pageParam }) => getTicketHistories({ ...variables, page: pageParam }),
  initialPageParam: 0,
  getNextPageParam: (lastPage: Response) => {
    if (lastPage.meta?.hasNextPage) {
      return (lastPage.meta?.page || 0) + 1
    }

    return undefined
  },
})
