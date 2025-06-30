import { consumerApi } from '@/lib/api';
import { ApiResponse } from '@/lib/api/schema';
import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { User } from './schema';

export interface Variables {
  userId: string;
}

export interface Response extends ApiResponse<User[]> {}

export interface Error extends AxiosError<Response> {}

export const deleteUser = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.delete<Response>(
    `/users/${variables.userId}`
  );

  return response.data;
};

export const useDeleteUser = createMutation<Response, Variables, any>({
  mutationFn: deleteUser,
});
