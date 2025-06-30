import { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { customerService, CustomerService } from ".";
import { CustomerType } from "./schema";

export interface Response
  extends Awaited<ReturnType<typeof customerService.getCustomerById>> {}

export interface Error extends AxiosError<Response> {}

export const useCustomer = createQuery<Response, { id: string }, any>({
  queryKey: [CustomerService.API_PATHS.GET_CUSTOMERS],
  fetcher: (variables) => customerService.getCustomerById(variables.id),
});
