import { ICreateServiceDto } from './types';
import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { serviceService } from '.';

export interface Variables {
  positions: {
    serviceId: string;
    position: number;
  }[];
}

export interface Response
  extends Awaited<ReturnType<typeof serviceService.arrangeServices>> {}

export interface Error extends AxiosError<Response> {}

export const useArrangeServices = createMutation<Response, Variables, any>({
  mutationFn: (variables) =>
    serviceService.arrangeServices(variables.positions),
});
