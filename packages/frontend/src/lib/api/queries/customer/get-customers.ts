import { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';
import { customerService, CustomerService } from '.';
import { CustomerType } from './schema';

export interface Response
  extends Awaited<ReturnType<typeof customerService.getAllCustomers>> {}

export interface Error extends AxiosError<Response> {}

export const useCustomers = createQuery<
  Response,
  { type?: CustomerType; isActive?: boolean },
  any
>({
  queryKey: [CustomerService.API_PATHS.GET_CUSTOMERS],
  fetcher: (variables) => customerService.getAllCustomers(variables),
});
