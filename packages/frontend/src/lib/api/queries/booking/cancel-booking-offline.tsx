import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { Booking } from './schema'

export interface Variables {
  bookingId: string
  note?: string
}

export interface Response extends ApiResponse<Booking> {}

export interface Error extends AxiosError<Response> {}

export const cancelBookingOffline = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.patch<Response>(`/bookings/offline/${variables.bookingId}/cancel`, variables)

  return response.data
}

export const cancelBookingOfflineKey = cancelBookingOffline.name

export const useCancelBookingOffline = createMutation<Response, Variables, any>({
  mutationKey: [cancelBookingOfflineKey],
  mutationFn: cancelBookingOffline,
})
