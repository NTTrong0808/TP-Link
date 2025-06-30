import { AxiosError, AxiosResponse } from 'axios'
import { createQuery } from 'react-query-kit'
import { sepayService } from '.'
import { BankListResponse } from './schema'

export interface Response extends AxiosResponse<BankListResponse> {}

export interface Error extends AxiosError<Response> {}

export const useGetBankList = createQuery<Response, any, Error>({
  queryKey: [sepayService.getBankList.name],
  fetcher: sepayService.getBankList,
})
