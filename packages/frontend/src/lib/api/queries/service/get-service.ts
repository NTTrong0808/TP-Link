import { AxiosError } from "axios";
import { createQuery } from "react-query-kit";
import { ServiceService, serviceService } from ".";

export interface Response
  extends Awaited<ReturnType<typeof serviceService.getServiceById>> {}

export interface Error extends AxiosError<Response> {}

export const useServiceById = createQuery<Response, { serviceId: string }, any>(
  {
    queryKey: [ServiceService.API_PATHS.GET_SERVICE_BY_ID],
    fetcher: (variables) => serviceService.getServiceById(variables.serviceId),
  }
);
