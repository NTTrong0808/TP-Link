import { AxiosError, AxiosRequestConfig } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { IIssuedTicket } from './schema'
export interface Variables {
  bookingId: string
  sign: string
  noAuth?: boolean
}

export interface Response extends ApiResponse<IIssuedTicket[]> {}

export interface Error extends AxiosError<Response> {}

export const verifyTicketByBooking = async (variables?: Variables, config?: AxiosRequestConfig): Promise<Response> => {
  const response = await consumerApi.post<Response>(
    `/bookings/online/verify-link`,
    {
      bookingId: variables?.bookingId,
      sign: variables?.sign,
    },
    {
      noAuth: variables?.noAuth,
      ...config,
    },
  )
  return response.data
}

export const verifyTicketByBookingKey = verifyTicketByBooking.name

export const useVerifyTicketByBooking = createMutation<Response, Variables, Error, AxiosRequestConfig>({
  mutationKey: [verifyTicketByBookingKey],
  mutationFn: verifyTicketByBooking,
})
