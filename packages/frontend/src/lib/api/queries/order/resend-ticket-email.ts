import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
import { IOrder } from './schema'

export interface Variables {
  bookingId: string
  // ticketIds: string[];
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

export const sendTicketEmail = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(
    `/bookings/send-ticket-email/${variables?.bookingId}`,
    // {
    //   ticketIds: variables?.ticketIds,
    // }
  )

  return response.data
}

export const sendTicketEmailKey = sendTicketEmail.name

export const useSendTicketEmailMutation = createMutation<Response, Variables, any>({
  mutationFn: sendTicketEmail,
})
