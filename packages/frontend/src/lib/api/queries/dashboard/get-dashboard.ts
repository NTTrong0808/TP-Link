import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { appDayJs } from '@/utils/dayjs'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { Dashboard } from './schema'

export interface Variables {
  from?: Date
  to?: Date
  type?: 'day' | 'week' | 'month' | 'year'
}

export const defaultVariables: Variables = {
  from: appDayJs().startOf('day').toDate(),
  to: appDayJs().endOf('day').toDate(),
  type: 'day',
}

export interface Response extends ApiResponse<Dashboard> {}

export interface Error extends AxiosError<Response> {}

export const getDashboard = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(`/dashboard`, variables)

  return response.data
}

export const getDashboardKey = getDashboard.name

export const useGetDashboard = createQuery<Response, Variables, any>({
  queryKey: [getDashboardKey],
  fetcher: getDashboard,
})
