import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { GetOrdersSummaryVariables } from './schema'

export interface Variables extends GetOrdersSummaryVariables {}

export interface Response
  extends ApiResponse<{
    totalRevenue: number
    totalBookings: number
    totalTickets: number
  }> {}

export interface Error extends AxiosError<Response> {}

export const getOrdersSummary = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(
    '/bookings/summary',
    {
      advancedFilters: variables?.advancedFilters,
    },
    {
      params: {
        ...Object.keys(variables || {})
          ?.filter((e) => e !== 'advancedFilters')
          .reduce((acc, key) => {
            const value = variables?.[key as keyof Variables]
            if (value) {
              if (Array.isArray(value)) {
                acc[key] = value.join(',')
                return acc
              }
              acc[key] = value
            }
            return acc
          }, {} as Record<string, any>),
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
