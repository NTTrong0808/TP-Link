import { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";
import { customerService, CustomerService } from ".";
import { UpdateCustomerDto } from "./schema";

export interface Response
  extends Awaited<ReturnType<typeof customerService.updateCustomer>> {}

export interface Error extends AxiosError<Response> {}

export const useUpdateCustomer = createMutation<
  Response,
  { id: string; dto: UpdateCustomerDto },
  any
>({
  mutationFn: (variables) =>
    customerService.updateCustomer(variables.id, variables.dto),
});
