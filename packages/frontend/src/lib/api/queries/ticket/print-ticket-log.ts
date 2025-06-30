import { consumerApi } from '@/lib/api'
import { IOrder } from '@/lib/api/queries/order/schema'
import { IIssuedTicket } from '@/lib/api/queries/ticket/schema'
import { ApiResponse } from '@/lib/api/schema'
import { appDayJs } from '@/utils/dayjs'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'

export interface Variables {
  issuedCodes?: IIssuedTicket['_id'][]
  time?: Date
  bookingId?: IOrder['_id']
  posTerminalId?: string
}

export interface Response extends ApiResponse<IIssuedTicket> {}

export interface Error extends AxiosError<Response> {}

export const printTicketLog = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(`/issued-tickets/print/log`, {
    issuedCodes: variables?.issuedCodes,
    time: variables?.time || appDayJs().toDate(),
    bookingId: variables?.bookingId,
    posTerminalId: variables?.posTerminalId,
  })

  return response.data
}

export const printTicketLogKey = printTicketLog.name

export const usePrintTicketLogMutation = createMutation<Response, Variables, any>({
  mutationKey: [printTicketLogKey],
  mutationFn: printTicketLog,
})
