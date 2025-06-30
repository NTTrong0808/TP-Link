import { IIssuedTicketHistory } from '@/lib/api/queries/ticket/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { consumerApi } from '../..'
import { ApiResponse } from '../../schema'
export interface Variables {
  issuedCode: string
}

export interface Response extends ApiResponse<IIssuedTicketHistory> {}

export interface Error extends AxiosError<Response> {}

export const redeemTicket = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(`/issued-tickets/use/${variables?.issuedCode}`)
  return response.data
}

export const redeemTicketKey = redeemTicket.name

export const useRedeemTicketMutation = createMutation<Response, Variables, any>({
  mutationKey: [redeemTicketKey],
  mutationFn: redeemTicket,
})
