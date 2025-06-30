import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { appDayJs } from '@/utils/dayjs'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { IOrder } from './schema'

export interface Variables {
  bookingId: IOrder['_id']
  time?: Date
}

export interface Response extends ApiResponse<IOrder> {}

export interface Error extends AxiosError<Response> {}

export const printBillLog = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(`/bookings/print/log`, {
    bookingId: variables?.bookingId,
    time: variables?.time || appDayJs().toDate(),
  })

  return response.data
}

export const printBillLogKey = printBillLog.name

export const usePrintBillLogMutation = createMutation<Response, Variables, any>({
  mutationKey: [printBillLogKey],
  mutationFn: printBillLog,
})
