import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'

export interface Variables {
  bookingId: string
  bookingVatToken: string
  vatInfo: {
    taxCode: string
    receiverEmail: string
    legalName: string
    address: string
    note?: string
  }
}

export interface Response extends ApiResponse<Response> {}

export interface Error extends AxiosError<Response> {}

export const updateBookingVatInfo = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(
    `/bookings/update-vat-info/${variables?.bookingId}/${variables?.bookingVatToken}`,
    variables?.vatInfo,
    {
      noAuth: true,
    },
  )

  return response.data
}

export const updateBookingVatInfoKey = updateBookingVatInfo.name

export const useUpdateBookingVatInfo = createMutation<Response, Variables, any>({
  mutationKey: [updateBookingVatInfoKey],
  mutationFn: updateBookingVatInfo,
})
