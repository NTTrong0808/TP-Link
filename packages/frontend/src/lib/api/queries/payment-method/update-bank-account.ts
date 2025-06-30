import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { BankAccount } from './schema'

export interface Variables extends Partial<BankAccount> {
  paymentMethodId: string
  bankAccountId: string
}

export interface Response extends ApiResponse<BankAccount> {}

export interface Error extends AxiosError<Response> {}

export const updateBankAccount = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.put<Response>(
    `/payment-methods/${variables?.paymentMethodId}/bank-account/${variables?.bankAccountId}`,
    variables,
  )

  return response.data
}

export const useUpdateBankAccount = createMutation<Response, Variables, Error>({
  mutationKey: [updateBankAccount.name],
  mutationFn: updateBankAccount,
})
