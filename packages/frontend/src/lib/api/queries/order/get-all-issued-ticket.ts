import { AxiosError } from 'axios'
import { createInfiniteQuery, createQuery } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { GetIssuedTicketListVariables, IIssuedTicket } from '../ticket/schema'

export interface Variables extends GetIssuedTicketListVariables {}

export interface Response extends ApiResponse<IIssuedTicket[]> {}

export interface Error extends AxiosError<Response> {}

const getAllIssuedTicketRoute = '/issued-tickets'

export const getAllIssuedTicketWithPagination = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(getAllIssuedTicketRoute, variables)

  return response.data
}

export const getAllIssuedTicketWithPaginationKey = `pagination:${getAllIssuedTicketRoute}`

export const useGetAllIssuedTicketWithPagination = createQuery<Response, Variables, any>({
  queryKey: [getAllIssuedTicketWithPaginationKey],
  fetcher: getAllIssuedTicketWithPagination,
})

export const getInfiniteIssuedTicketKey = `infinite:${getAllIssuedTicketRoute}`

export const useGetInfiniteIssuedTicket = createInfiniteQuery<Response, Variables, any>({
  queryKey: [getInfiniteIssuedTicketKey],
  fetcher: (variables, { pageParam }) => getAllIssuedTicketWithPagination({ ...variables, page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage: Response) => {
    if (lastPage.meta?.hasNextPage) {
      return (lastPage.meta?.page || 0) + 1
    }

    return undefined
  },
})
