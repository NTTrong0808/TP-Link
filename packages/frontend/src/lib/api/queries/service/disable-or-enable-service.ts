import { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { serviceService } from ".";

export interface Variables {
  serviceId: string;
  isActive: boolean;
}

export interface Response
  extends Awaited<ReturnType<typeof serviceService.disableOrEnableService>> {}

export interface Error extends AxiosError<Response> {}

export const useDisableOrEnableService = createMutation<
  Response,
  Variables,
  any
>({
  mutationFn: (variables) =>
    serviceService.disableOrEnableService(
      variables.serviceId,
      variables.isActive
    ),
});
