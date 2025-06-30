import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { ILCCustomer } from '../customer/schema'
import { Booking, BookingItem, BookingVat } from './schema'

export interface Variables {
  createdAt: string
  items: BookingItem[]
  paymentMethodId: string
  vatInfo?: BookingVat
  note?: string
  taId?: string
  isCash?: boolean
  posCode?: string
  posTerminalId?: string
  customerData?: Partial<ILCCustomer>
  paymentNote?: string
  newCustomerData?: Partial<ILCCustomer>
}

export interface Response extends ApiResponse<Booking> {}

export interface Error extends AxiosError<Response> {}

export const createBookingOffline = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>('/bookings/offline', {
    ...variables,
  })

  return response.data
}

export const createBookingOfflineKey = createBookingOffline.name

export const useCreateBookingOffline = createMutation<Response, Variables, any>({
  mutationKey: [createBookingOfflineKey],
  mutationFn: createBookingOffline,
})
