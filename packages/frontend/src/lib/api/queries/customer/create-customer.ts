import { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { customerService } from ".";
import { CreateCustomerDto } from "./schema";

export interface Response
  extends Awaited<ReturnType<typeof customerService.createCustomer>> {}

export interface Error extends AxiosError<Response> {}

export const useCreateCustomer = createMutation<
  Response,
  { dto: CreateCustomerDto },
  any
>({
  mutationFn: (variables) =>
    customerService.createCustomer(variables.dto),
});
