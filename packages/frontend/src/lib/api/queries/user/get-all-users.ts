import { consumerApi } from '@/lib/api'
import { ApiResponse } from '@/lib/api/schema'
import { AxiosError } from 'axios'
import { createQuery, createSuspenseQuery } from 'react-query-kit'
import { User } from './schema'
import { UserStatus } from './constant'

export interface Response extends ApiResponse<User[]> {}

export interface Error extends AxiosError<Response> {}

export const getAllUsers = async (): Promise<Response> => {
  const response = await consumerApi.get<Response>('/users/all')

  return response.data
}

export const getAllUsersKey = getAllUsers.name

export const useAllUsers = createQuery<Response, {}, any>({
  queryKey: [getAllUsersKey],
  fetcher: getAllUsers,
})

export const useSuspenseAllUsers = createSuspenseQuery<Response, {}, Error>({
  queryKey: [`suspense-all-user-${getAllUsersKey}`],
  fetcher: getAllUsers,
})
