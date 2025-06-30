import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { OrderSummary } from './type'

export interface Variables extends OrderSummary {}

export interface Response
  extends ApiResponse<{
    totalAmountListPrice: number
    totalDiscount: number
    totalAmount: number
  }> {}

export interface Error extends AxiosError<Response> {}

export const getOrdersSummary = async (variables?: Variables): Promise<Response> => {
  const response = await axios.post<Response>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/summary`,
    {
      advancedFilters: variables?.advancedFilters,
    },
    {
      params: {
        ...Object.keys(variables || {})
          ?.filter((e) => e !== 'advancedFilters' && e !== 'sortBy' && e !== 'sortOrder')
          .reduce(
            (acc, key) => {
              const value = variables?.[key as keyof Variables]
              if (value) {
                if (Array.isArray(value)) {
                  acc[key] = value.join(',')
                  return acc
                }
                acc[key] = value
              }
              return acc
            },
            {} as Record<string, any>,
          ),
      },
    },
  )

  return response.data
}

export const getOrdersSummaryKey = getOrdersSummary.name

export const useOrdersSummary = createQuery<Response, Variables, any>({
  queryKey: [getOrdersSummaryKey],
  fetcher: getOrdersSummary,
})
