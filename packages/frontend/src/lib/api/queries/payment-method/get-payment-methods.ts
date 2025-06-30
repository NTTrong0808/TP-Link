import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery, createSuspenseQuery } from 'react-query-kit'
import { PaymentMethod } from './schema'

export interface Variables {
  type: number[]
  available: boolean
}

export interface Response extends ApiResponse<PaymentMethod[]> {}

export interface Error extends AxiosError<Response> {}

const paymentMethodApiPath = '/payment-methods'

export const getPaymentMethods = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(paymentMethodApiPath, {
    params: {
      type: variables?.type,
      available: variables?.available,
    },
  })

  return response.data
}

export const getPaymentMethodsKey = paymentMethodApiPath

export const usePaymentMethods = createQuery<Response, Variables, any>({
  queryKey: [getPaymentMethodsKey],
  fetcher: getPaymentMethods,
})

export const useSuspensePaymentMethods = createSuspenseQuery<Response, Variables, Error>({
  queryKey: [`suspense-payment-method-${getPaymentMethodsKey}`],
  fetcher: getPaymentMethods,
})
