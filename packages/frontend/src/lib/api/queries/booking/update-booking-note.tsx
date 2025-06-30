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

const updateBookingNoteRoute = '/bookings/:bookingId/note'

export const updateBookingNote = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.patch<Response>(
    updateBookingNoteRoute.replace(':bookingId', variables.bookingId),
    {
      note: variables?.note,
    },
  )

  return response.data
}

export const useUpdateBookingNote = createMutation<Response, Variables, any>({
  mutationFn: updateBookingNote,
  mutationKey: [updateBookingNoteRoute],
})
