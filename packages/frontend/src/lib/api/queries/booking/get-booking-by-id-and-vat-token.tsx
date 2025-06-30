import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { IOrder } from '../order/schema'

export interface Variables {
  bookingId: string
  bookingVatToken: string
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

export const getBookingByIdAndVatToken = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(
    `/bookings/get-by-id-and-token/${variables?.bookingId}/${variables?.bookingVatToken}`,
    {
      ssr: true,
    },
  )

  return response.data
}

export const getBookingByIdAndVatTokenKey = getBookingByIdAndVatToken.name

export const useGetBookingByIdAndVatToken = createQuery<Response, Variables, any>({
  queryKey: [getBookingByIdAndVatTokenKey],
  fetcher: getBookingByIdAndVatToken,
})
