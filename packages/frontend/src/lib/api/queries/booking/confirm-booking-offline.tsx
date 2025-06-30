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

export const confirmBookingOffline = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.patch<Response>(`/bookings/offline/${variables.bookingId}/confirm`, variables)

  return response.data
}

export const confirmBookingOfflineKey = confirmBookingOffline.name

export const useConfirmBookingOffline = createMutation<Response, Variables, any>({
  mutationKey: [confirmBookingOfflineKey],
  mutationFn: confirmBookingOffline,
})
