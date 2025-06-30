import { consumerApi } from '@/lib/api';
import { ApiResponse } from '@/lib/api/schema';
import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { User } from '../user/schema';

export interface Variables {
  data: Pick<
    User,
    'email' | 'firstName' | 'lastName' | 'roleId' | 'phoneNumber'
  >;
}

export interface Response extends ApiResponse<User | string> {}

export interface Error extends AxiosError<Response> {}

export const createUser = async (variables: Variables): Promise<Response> => {
  const response = await consumerApi.post<Response>('/users', variables.data);

  return response.data;
};

export const createUserKey = createUser.name;

export const useCreateUser = createMutation<Response, Variables, any>({
  mutationKey: [createUserKey],
  mutationFn: createUser,
});
