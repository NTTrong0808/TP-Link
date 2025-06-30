import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { IOrder } from './schema'

export interface Variables {
  bookingId: string
  cancelledReason?: string
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

const cancelOrderRoute = '/bookings/cancel/:bookingId'

const cancelOrder = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.patch<Response>(
    cancelOrderRoute.replace(':bookingId', variables.bookingId),
    variables,
  )

  return response.data
}

export const cancelOrderKey = cancelOrderRoute

export const useCancelOrder = createMutation<Response, Variables, any>({
  mutationKey: [cancelOrderKey],
  mutationFn: cancelOrder,
})
