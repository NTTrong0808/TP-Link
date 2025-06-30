import { AxiosError } from 'axios'
import { createInfiniteQuery, createQuery } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { GetIssuedTicketListVariables, IIssuedTicket } from '../ticket/schema'

export interface Variables extends GetIssuedTicketListVariables {
  bookingId?: string
  printCount?: string | number
}

export interface Response extends ApiResponse<IIssuedTicket[]> {}

export interface Error extends AxiosError<Response> {}

const getIssuedTicketByBookingIdRoute = '/bookings/issued-tickets/:bookingId'

export const getIssuedTicketByBookingIdWithPagination = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(
    getIssuedTicketByBookingIdRoute.replace(':bookingId', variables?.bookingId as string),
    {
      params: {
        ...variables,
        ...Object.keys(variables || {}).reduce((acc, key) => {
          const value = variables?.[key as keyof Variables]
          if (value) {
            if (Array.isArray(value)) {
              acc[key] = value.join(',')
              return acc
            }
            acc[key] = value
          }
          return acc
        }, {} as Record<string, any>),
      },
    },
  )

  return response.data
}

export const getIssuedTicketByBookingIdWithPaginationKey = `pagination:${getIssuedTicketByBookingIdRoute}`

export const useIssuedTicketByBookingIdWithPagination = createQuery<Response, Variables, any>({
  queryKey: [getIssuedTicketByBookingIdWithPaginationKey],
  fetcher: getIssuedTicketByBookingIdWithPagination,
})

export const getInfiniteIssuedTicketByBookingIdKey = `infinite:${getIssuedTicketByBookingIdRoute}`

export const useInfiniteIssuedTicketByBookingId = createInfiniteQuery<Response, Variables, any>({
  queryKey: [getInfiniteIssuedTicketByBookingIdKey],
  fetcher: (variables, { pageParam }) => getIssuedTicketByBookingIdWithPagination({ ...variables, page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage: Response) => {
    if (lastPage.meta?.hasNextPage) {
      return (lastPage.meta?.page || 0) + 1
    }

    return undefined
  },
})
