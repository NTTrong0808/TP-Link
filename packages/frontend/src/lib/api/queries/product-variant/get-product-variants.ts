import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { appDayJs } from '@/utils/dayjs'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { createMutation, createQuery, createSuspenseQuery } from 'react-query-kit'
import { IProductVariant } from './type'

export interface Variables {
  isExportExcel?: boolean
  advancedFilters?: Record<string, any>
  page: number
  size: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  receiverEmail?: string
}

export interface Response extends ApiResponse<IProductVariant[]> {}

export interface Error extends AxiosError<Response> {}

export const getProductVariants = async (variables?: Variables): Promise<Response> => {
  const response: AxiosResponse<Response | Blob, any> | null = await axios.post<Blob>(
    `${process.env.NEXT_PUBLIC_API_URL}/product-variants`,
    {
      advancedFilters: variables?.advancedFilters,
    },
    {
      responseType: variables?.isExportExcel ? 'blob' : undefined,
      params: {
        ...Object.keys(variables || {})
          ?.filter((e) => e !== 'advancedFilters')
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
        isExportExcel: variables?.isExportExcel,
        size: variables?.size || 25,
        page: variables?.page || 0,
      },
    },
  )

  return response?.data as Response
}

export const getProductVariantsKey = getProductVariants.name

export const useGetProductVariants = createQuery<Response, Variables, any>({
  queryKey: [getProductVariantsKey],
  fetcher: getProductVariants,
})

export const useExportProductVariants = createMutation<Response, Variables, any>({
  mutationFn: getProductVariants,
})
