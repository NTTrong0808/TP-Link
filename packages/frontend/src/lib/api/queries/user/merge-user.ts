import { consumerApi } from '@/lib/api';
import { ApiResponse } from '@/lib/api/schema';
import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { User } from './schema';

export interface Variables {
  data: Pick<
    User,
    'email' | 'firstName' | 'lastName' | 'roleId' | 'phoneNumber'
  >;
}

export interface Response extends ApiResponse<User[]> {}

export interface Error extends AxiosError<Response> {}

export const mergeUser = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>(
    '/users/merge',
    variables.data
  );

  return response.data;
};

export const mergeUserKey = mergeUser.name;

export const useMergeUser = createMutation<Response, Variables, any>({
  mutationKey: [mergeUserKey],
  mutationFn: mergeUser,
});
