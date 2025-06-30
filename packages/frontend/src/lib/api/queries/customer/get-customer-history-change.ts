import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { customerService, CustomerService } from '.'
import { ApiResponse } from '../../schema'
import { ILCCustomerHistory } from './schema'

export interface Variables {
  id: string
}

export interface Response extends ApiResponse<ILCCustomerHistory[]> {}

export interface Error extends AxiosError<Response> {}

export const useCustomerHistoryChange = createQuery<Response, Variables, any>({
  queryKey: [CustomerService.API_PATHS.GET_CUSTOMER_HISTORY_CHANGE],
  fetcher: (variables) => customerService.getCustomerHistory(variables.id),
})
