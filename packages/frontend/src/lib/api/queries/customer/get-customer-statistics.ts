import { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { customerService, CustomerService } from ".";

export interface Response
  extends Awaited<ReturnType<typeof customerService.getCustomerStatistics>> {}

export interface Error extends AxiosError<Response> {}

export const useCustomerStatistics = createQuery<Response, { id: string }, any>(
  {
    queryKey: [CustomerService.API_PATHS.GET_CUSTOMER_STATISTICS],
    fetcher: (variables) => customerService.getCustomerStatistics(variables.id),
  }
);
