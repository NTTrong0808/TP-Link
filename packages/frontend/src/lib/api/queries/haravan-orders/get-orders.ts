import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { appDayJs } from '@/utils/dayjs'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { createMutation, createQuery, createSuspenseQuery } from 'react-query-kit'
import { IOrder, OrderVariables } from './type'

export interface Variables extends OrderVariables {}

export interface Response extends ApiResponse<IOrder[]> {}

export interface Error extends AxiosError<Response> {}

export const getOrders = async (variables?: Variables): Promise<Response> => {
  const response: AxiosResponse<Response | Blob, any> | null = await axios.post<Blob>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders`,
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

  // if (variables?.isExportExcel) {
  //   const fileName = `${appDayJs().format('YYMMDDHHmm')}-BaoCaoDanhSachDonHang.xlsx`
  //   const url = window.URL.createObjectURL(new Blob([response?.data as any]))
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = fileName
  //   document.body.appendChild(a)
  //   a.click()
  //   a.remove()
  //   window.URL.revokeObjectURL(url)
  // }

  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(response.data);
  // link.download = fileName;
  // link.click();
  // URL.revokeObjectURL(link.href);

  return response?.data as Response
}

export const getOrdersKey = getOrders.name

export const useGetOrders = createQuery<Response, Variables, any>({
  queryKey: [getOrdersKey],
  fetcher: getOrders,
})

export const useExportOrders = createMutation<Response, Variables, any>({
  mutationFn: getOrders,
})
