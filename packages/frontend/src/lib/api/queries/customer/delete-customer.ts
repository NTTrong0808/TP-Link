import { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";
import { customerService, CustomerService } from ".";

export interface Response
  extends Awaited<ReturnType<typeof customerService.deleteCustomer>> {}

export interface Error extends AxiosError<Response> {}

export const useDeleteCustomer = createMutation<Response, { id: string }, any>({
  mutationFn: (variables) => customerService.deleteCustomer(variables.id),
});
