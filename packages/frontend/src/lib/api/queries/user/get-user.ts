import { consumerApi } from '@/lib/api';
import { ApiResponse } from '@/lib/api/schema';
import { AxiosError } from 'axios';
import { createQuery, createSuspenseQuery } from 'react-query-kit';
import { User } from './schema';
import { UserStatus } from './constant';

export interface Variables {
  userId: string;
}

export interface Response extends ApiResponse<User> {}

export interface Error extends AxiosError<Response> {}

export const getUser = async (variables?: Variables): Promise<Response> => {
  const response = await consumerApi.get<Response>(
    `/users/${variables?.userId}`
  );

  return response.data;
};

export const getUsesKey = getUser.name;

export const useUser = createQuery<Response, Variables, any>({
  queryKey: [getUsesKey],
  fetcher: getUser,
});
