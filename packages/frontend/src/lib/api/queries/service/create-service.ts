import { ICreateServiceDto } from "./types";
import { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { serviceService } from ".";

export interface Variables {
  dto: ICreateServiceDto;
}

export interface Response
  extends Awaited<ReturnType<typeof serviceService.createService>> {}

export interface Error extends AxiosError<Response> {}

export const useCreateService = createMutation<Response, Variables, any>({
  mutationFn: (variables) => serviceService.createService(variables.dto),
});
