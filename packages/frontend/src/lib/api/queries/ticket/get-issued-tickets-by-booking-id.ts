import { consumerApi } from '@/lib/api'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { IOrder } from '../order/schema'

export interface Variables {
  bookingId: string
  withBooking?: boolean
}

export interface Response extends ApiResponse<{ booking: IOrder; tickets: IIssuedTicket[] }> {}

export interface Error extends AxiosError<Response> {}

export const getIssuedTicketsByBookingId = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(`/bookings/issued-tickets/${variables?.bookingId}`, {
    params: {
      withBooking: variables?.withBooking ?? true,
    },
    noAuth: true,
  })

  return response.data
}

export const getIssuedTicketsByBookingIdKey = getIssuedTicketsByBookingId.name

export const useGetIssuedTicketsByBookingId = createQuery<Response, Variables, any>({
  queryKey: [getIssuedTicketsByBookingIdKey],
  fetcher: getIssuedTicketsByBookingId,
})
