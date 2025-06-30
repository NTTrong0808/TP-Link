import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery } from 'react-query-kit'
import { SystemConfig } from './schema'

export interface Response extends ApiResponse<SystemConfig> {}

export interface Error extends AxiosError<Response> {}

const getSystemConfigRoute = '/system-config'

export const getSystemConfig = async (): Promise<Response> => {
  const response = await consumerApi.get<Response>(getSystemConfigRoute)

  return response.data
}

export const getSystemConfigKey = getSystemConfigRoute

export const useSystemConfig = createQuery<Response, any, Error>({
  queryKey: [getSystemConfigKey],
  fetcher: getSystemConfig,
})
