import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'

export interface Variables {
  hour?: number
}

export const defaultVariables: Variables = {
  hour: 8,
}

export interface Response extends ApiResponse<Response> {}

export interface Error extends AxiosError<Response> {}

export const refreshDashboard = async (variables: Variables = defaultVariables): Promise<Response> => {
  const response = await consumerApi.post<Response>(`/dashboard/update-data`, {
    hour: variables?.hour || defaultVariables.hour,
  })

  return response.data
}

export const refreshDashboardKey = refreshDashboard.name

export const useRefreshDashboardMutation = createMutation<Response, Variables, any>({
  mutationKey: [refreshDashboardKey],
  mutationFn: refreshDashboard,
})
