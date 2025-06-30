import { IUpdateServiceDto } from "./types";
import { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { serviceService } from ".";

export interface Variables {
  serviceId: string;
  dto: IUpdateServiceDto;
}

export interface Response
  extends Awaited<ReturnType<typeof serviceService.createService>> {}

export interface Error extends AxiosError<Response> {}

export const useUpdateService = createMutation<Response, Variables, any>({
  mutationFn: (variables) =>
    serviceService.updateService(variables.serviceId, variables.dto),
});
