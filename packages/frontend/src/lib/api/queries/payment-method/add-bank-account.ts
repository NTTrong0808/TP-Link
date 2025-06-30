import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { BankAccount } from './schema'

export interface Variables extends BankAccount {
  paymentMethodId: string
}

export interface Response extends ApiResponse<BankAccount> {}

export interface Error extends AxiosError<Response> {}

export const addBankAccount = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(
    `/payment-methods/${variables?.paymentMethodId}/bank-account`,
    variables,
  )

  return response.data
}

export const useAddBankAccount = createMutation<Response, Variables, Error>({
  mutationKey: [addBankAccount.name],
  mutationFn: addBankAccount,
})
