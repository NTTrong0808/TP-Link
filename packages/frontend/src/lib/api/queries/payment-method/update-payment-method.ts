import { consumerApi } from '@/lib/api';
import { ApiResponse } from '@/lib/api/schema';
import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { PaymentMethod } from './schema';

export interface Variables {
  id: string;
  available: boolean;
}

export interface Response extends ApiResponse<PaymentMethod> {}

export interface Error extends AxiosError<Response> {}

export const updatePaymentMethod = async (
  variables?: Variables
): Promise<Response> => {
  const response = await consumerApi.put<Response>(
    `/payment-methods/${variables?.id}`,
    {
      available: variables?.available,
    }
  );

  return response.data;
};

export const useUpdatePaymentMethod = createMutation<Response, Variables, any>({
  mutationFn: updatePaymentMethod,
});
