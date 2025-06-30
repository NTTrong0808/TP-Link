import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createMutation } from 'react-query-kit'
import { SystemConfig } from './schema'

export interface Variables extends SystemConfig {}

export interface Response extends ApiResponse<SystemConfig> {}

export interface Error extends AxiosError<Response> {}

const updateSystemConfigRoute = '/system-config/update'

const updateSystemConfig = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.patch<Response>(updateSystemConfigRoute, variables)

  return response.data
}

export const updateSystemConfigKey = updateSystemConfigRoute

export const useUpdateSystemConfigMutation = createMutation<Response, Variables, any>({
  mutationKey: [updateSystemConfigKey],
  mutationFn: updateSystemConfig,
})
