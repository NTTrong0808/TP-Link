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

const cancelCashOrderRoute = '/bookings/cancel/cash/:bookingId'

const cancelCashOrder = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.patch<Response>(
    cancelCashOrderRoute.replace(':bookingId', variables.bookingId),
    variables,
  )

  return response.data
}

export const cancelCashOrderKey = cancelCashOrderRoute

export const useCancelCashOrder = createMutation<Response, Variables, any>({
  mutationKey: [cancelCashOrderKey],
  mutationFn: cancelCashOrder,
})
