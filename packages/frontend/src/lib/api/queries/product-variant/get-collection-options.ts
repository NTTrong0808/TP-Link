import { ApiResponse } from '@/lib/api/schema'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { createMutation, createQuery } from 'react-query-kit'

export interface Variables {}

export interface Response extends ApiResponse<{ value: string; label: string }[]> {}

export interface Error extends AxiosError<Response> {}

export const getCollectionOptions = async (variables?: Variables): Promise<Response> => {
  const response: AxiosResponse<Response> | null = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/collections/options`,
  )

  return response?.data as Response
}

export const getCollectionOptionsKey = getCollectionOptions.name

export const useGetCollectionOptions = createQuery<Response, Variables, any>({
  queryKey: [getCollectionOptionsKey],
  fetcher: getCollectionOptions,
})
