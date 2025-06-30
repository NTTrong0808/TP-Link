import { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { customerService, CustomerService } from ".";
import { GetCustomerVariables } from "./schema";

export interface Response
  extends Awaited<
    ReturnType<typeof customerService.getAllCustomersPagination>
  > {}

export interface Variables extends GetCustomerVariables {}
export interface Error extends AxiosError<Response> {}

export const useCustomersPagination = createQuery<Response, Variables, any>({
  queryKey: [CustomerService.API_PATHS.GET_CUSTOMERS_PAGINATION],
  fetcher: (variables) => customerService.getAllCustomersPagination(variables),
});
