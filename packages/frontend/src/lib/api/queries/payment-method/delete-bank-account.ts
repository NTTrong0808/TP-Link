import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { BankAccount } from './schema'

export interface Variables {
  paymentMethodId: string
  bankAccountId: string
}

export interface Response extends ApiResponse<BankAccount> {}

export interface Error extends AxiosError<Response> {}

export const deleteBankAccount = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.delete<Response>(
    `/payment-methods/${variables?.paymentMethodId}/bank-account/${variables?.bankAccountId}`,
  )

  return response.data
}

export const useDeleteBankAccount = createMutation<Response, Variables, Error>({
  mutationKey: [deleteBankAccount.name],
  mutationFn: deleteBankAccount,
})
