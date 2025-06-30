import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { Booking } from './schema'

export interface Variables {
  bookingId: string
  dto?: {
    note?: string
  }
}

export interface Response extends ApiResponse<Booking> {}

export interface Error extends AxiosError<Response> {}

export const updateBooking = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.put<Response>(`/bookings/${variables?.bookingId}`, {
    ...(variables?.dto ? variables?.dto : {}),
  })

  return response.data
}

export const useUpdateBooking = createMutation<Response, Variables, any>({
  mutationFn: updateBooking,
})
