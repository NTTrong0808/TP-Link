import { consumerApi } from '@/lib/api';
import { ApiResponse } from '@/lib/api/schema';
import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { User } from './schema';
import { UserStatus } from './constant';

export interface Variables {
  userId: string;
  data: Partial<Pick<User, 'firstName' | 'lastName' | 'roleId' | 'status'>>;
}

export interface Response extends ApiResponse<User[]> {}

export interface Error extends AxiosError<Response> {}

export const updateUser = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.put<Response>(
    `/users/${variables.userId}`,
    variables.data
  );

  return response.data;
};

export const updateUserKey = updateUser.name;

export const useUpdateUser = createMutation<Response, Variables, any>({
  mutationKey: [updateUserKey],
  mutationFn: updateUser,
});
