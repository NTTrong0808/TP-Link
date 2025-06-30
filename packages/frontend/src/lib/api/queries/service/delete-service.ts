import { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { serviceService } from ".";

export interface Variables {
  serviceId: string;
}

export interface Response
  extends Awaited<ReturnType<typeof serviceService.deleteService>> {}

export interface Error extends AxiosError<Response> {}

export const useDeleteService = createMutation<Response, Variables, any>({
  mutationFn: (variables) => serviceService.deleteService(variables.serviceId),
});
