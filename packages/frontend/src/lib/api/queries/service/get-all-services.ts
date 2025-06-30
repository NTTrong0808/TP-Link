import { createQuery } from 'react-query-kit';
import { ServiceService, serviceService } from '.';
import { ServiceType } from './types';

export interface Response
  extends Awaited<ReturnType<typeof serviceService.getServices>> {}

export type Variables =
  | {
      type: ServiceType;
    }
  | undefined;

export const useServices = createQuery<Response, Variables, any>({
  queryKey: [ServiceService.API_PATHS.GET_SERVICES],
  fetcher: (variables) => serviceService.getServices(variables),
});
